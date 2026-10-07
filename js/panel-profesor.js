/* ============================================================
   PANEL DE PROFESOR · Resultados de la clase
   · Se abre con 📊 Resultados (solo visible para el profe)
   · Pide la contraseña de CREDENCIALES_PROFE
   · Carga los JSON descargados de Moodle (Ejercicio 6 →
     2 tarjetas de las 6 · 5 pts/tarjeta = 10 pts)
   · Una fila POR TARJETA: puntuación automática + nota del
     profesor (0-5 por tarjeta, tras verificar con la rúbrica)
   · 10 pts = 2,5 ponderados (Colocar aparatos = 1,5)
   · Botón ⬇ .md por JSON: convertido a Markdown CON la
     solución/rúbrica incrustada para verificarla
   ============================================================ */

const CLAVE_NOTAS_MANUALES = 'dashboard_notas_manuales';

// Solución modelo de cada tarjeta (carpeta repartida por Moodle;
// en la web se usa para incrustarla en el informe .md)
const SOLUCIONES_POR_TARJETA = {
  'AULA': 'soluciones/01_aula.md',
  'PASILLO': 'soluciones/02_pasillo.md',
  'TALLER': 'soluciones/03_taller.md',
  'DESPACHO': 'soluciones/04_despacho.md',
  'BIBLIOTECA': 'soluciones/05_biblioteca.md',
  'GIMNASIO': 'soluciones/06_gimnasio.md'
};

let panelDesbloqueado = false;
let panelRegistros = [];

const escala = () => (typeof ESCALA_AUDITORIA !== 'undefined' ? ESCALA_AUDITORIA : {
  ejerciciosAsignados: ['6'], puntosPorTarjeta: 5, puntosPorEjercicio: 10, puntosTotales: 10,
  ponderadoColocar: 1.5, ponderadoAuditoria: 2.5
});

const red2 = n => Math.round(n * 100) / 100;

// ------------------------------------------------------------
// Apertura / cierre / desbloqueo
// ------------------------------------------------------------
function abrirPanelResultados() {
  if (state.usuario !== 'profe') return;
  document.getElementById('panelResultados').classList.add('show');
  document.getElementById('panelPass').value = '';
  document.getElementById('panelError').classList.remove('show');

  document.getElementById('panelLock').style.display = panelDesbloqueado ? 'none' : 'block';
  document.getElementById('panelContenido').style.display = panelDesbloqueado ? 'block' : 'none';

  if (panelDesbloqueado) renderPanel();
  else setTimeout(() => document.getElementById('panelPass').focus(), 50);
}

function cerrarPanelResultados() {
  document.getElementById('panelResultados').classList.remove('show');
  document.getElementById('panelPass').value = '';
  document.getElementById('panelError').classList.remove('show');
}

function desbloquearPanel() {
  const pass = document.getElementById('panelPass').value;
  const err = document.getElementById('panelError');

  if (pass !== CREDENCIALES_PROFE.password) {
    err.textContent = '❌ Contraseña incorrecta.';
    err.classList.add('show');
    document.getElementById('panelPass').value = '';
    return;
  }

  err.classList.remove('show');
  panelDesbloqueado = true;
  document.getElementById('panelLock').style.display = 'none';
  document.getElementById('panelContenido').style.display = 'block';
  renderPanel();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('panelPass');
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter') desbloquearPanel();
  });
});

// ------------------------------------------------------------
// Carga de los JSON entregados
// ------------------------------------------------------------
function esc(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Puntuación automática de UNA tarjeta convertida a la escala 0-5
function autoDeTarjeta(t) {
  const e = escala();
  let p = t && t.ficha ? t.ficha.puntuacion : null;

  if ((!p || typeof p.aciertosAuto !== 'number') && typeof calcularPuntuacionFicha === 'function') {
    const tarjetaObj = (typeof TARJETAS !== 'undefined') ? TARJETAS.find(x => x.id === (t && t.tarjetaId)) : null;
    if (tarjetaObj && t && t.variacion) {
      try { p = calcularPuntuacionFicha(t.ficha || {}, tarjetaObj, t.variacion); } catch (err) { p = null; }
    }
  }

  const autoMax = (p && typeof p.autoMax === 'number') ? p.autoMax : 0;
  const aciertos = (p && typeof p.aciertosAuto === 'number') ? p.aciertosAuto
    : ((p && typeof p.obtenido === 'number') ? p.obtenido : 0);

  return {
    aciertosAuto: aciertos,
    autoMax: autoMax,
    autoEscala: autoMax > 0 ? red2(aciertos / autoMax * e.puntosPorTarjeta) : 0
  };
}

// Devuelve UNA LISTA de registros (una fila por tarjeta de auditoría,
// una sola fila para el módulo Colocar aparatos)
function normalizarRegistro(json, nombreFichero) {
  const e = escala();

  // 1) JSON de Colocar aparatos
  if (json && json.tipo === 'colocar') {
    const total = json.total || 0;
    const aciertos = typeof json.aciertos === 'number' ? json.aciertos : 0;
    return [{
      modulo: 'Colocar',
      ejercicio: 'Colocar aparatos',
      tarjeta: '',
      ordenTarjeta: 0,
      iniciales: (json.iniciales || '').toUpperCase(),
      nombre: '',
      fecha: json.fechaLegible || json.fecha || '',
      tiempo: json.tiempoLegible || '',
      auto: aciertos,
      autoMax: total,
      autoEscala: null,       // fuera de la escala 0-5
      notaMax: 0,
      puedeMd: true,
      json: json
    }];
  }

  // 2) Informe de Auditoría → una fila por tarjeta (5 pts cada una)
  if (json && json.alumno && json.puntuacion && Array.isArray(json.tarjetas)) {
    if (json.tarjetas.length === 0) return null;

    const ejId = (json.meta && json.meta.ejercicio) ? String(json.meta.ejercicio) : '';
    const etiqueta = ejId === '6' ? 'Ejercicio 6' : (ejId ? `Ejercicio ${ejId}` : 'Auditoría');
    const totalTarjetas = json.tarjetas.length;

    return json.tarjetas.map((t, i) => {
      const auto = autoDeTarjeta(t);
      return {
        modulo: 'Auditoría',
        ejercicio: etiqueta,
        tarjeta: `${t.tarjetaNombre || 'Tarjeta'} (${i + 1}/${totalTarjetas})`,
        ordenTarjeta: i,
        iniciales: (json.alumno.iniciales || '').toUpperCase(),
        nombre: json.alumno.nombre || '',
        fecha: (json.meta && json.meta.fechaLegible) || '',
        tiempo: (json.meta && json.meta.duracionLegible) || '',
        auto: auto.aciertosAuto,
        autoMax: auto.autoMax,
        autoEscala: auto.autoEscala,                 // 0 a 5
        notaMax: e.puntosPorTarjeta,                 // 5 por tarjeta
        puedeMd: i === 0,                            // el .md se descarga una sola vez
        json: json
      };
    });
  }

  return null;
}

function claveRegistro(reg, nombreFichero) {
  return `${reg.modulo}|${reg.ejercicio}|${reg.tarjeta || ''}|${reg.iniciales}|${reg.fecha}|${nombreFichero}`;
}

function cargarResultadosPanel(files) {
  if (!files || files.length === 0) return;

  const errores = [];
  const pendientes = Array.from(files).map(f =>
    f.text().then(txt => {
      try {
        const json = JSON.parse(txt);
        const regs = normalizarRegistro(json, f.name);
        if (!regs || regs.length === 0) {
          errores.push(`${f.name}: formato no reconocido`);
          return;
        }
        regs.forEach(reg => {
          const key = claveRegistro(reg, f.name);
          if (panelRegistros.find(r => r.key === key)) return;   // ya cargado
          reg.key = key;
          reg.fichero = f.name;
          reg.notaProfe = leerNotaProfe(key);
          panelRegistros.push(reg);
        });
      } catch (e) {
        errores.push(`${f.name}: JSON inválido`);
      }
    })
  );

  Promise.all(pendientes).then(() => {
    panelRegistros.sort((a, b) =>
      (a.iniciales || '').localeCompare(b.iniciales || '') ||
      (a.modulo || '').localeCompare(b.modulo || '') ||
      (a.ordenTarjeta || 0) - (b.ordenTarjeta || 0));
    renderPanel();
    document.getElementById('panelFiles').value = '';
    if (errores.length) {
      alert('No se pudieron cargar algunos archivos:\n\n' + errores.join('\n'));
    }
  });
}

// ------------------------------------------------------------
// Nota del profesor persistida por registro
// ------------------------------------------------------------
function leerTodasLasNotas() {
  try { return JSON.parse(localStorage.getItem(CLAVE_NOTAS_MANUALES) || '{}'); } catch (e) { return {}; }
}

function leerNotaProfe(key) {
  const v = leerTodasLasNotas()[key];
  if (typeof v === 'number') return v;                    // formato antiguo
  if (v && typeof v === 'object' && typeof v.profe === 'number') return v.profe;
  return null;
}

function guardarNotaProfe(key, valor) {
  const todas = leerTodasLasNotas();
  if (typeof valor === 'number') todas[key] = { profe: valor };
  else delete todas[key];
  try { localStorage.setItem(CLAVE_NOTAS_MANUALES, JSON.stringify(todas)); } catch (e) {}
}

function limpiarNota(valor, max) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const n = parseFloat(valor);
  if (isNaN(n)) return null;
  return Math.max(0, Math.min(max, red2(n)));
}

function cambiarNotaProfe(indice, valor) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.notaMax) return;
  reg.notaProfe = limpiarNota(valor, reg.notaMax);
  guardarNotaProfe(reg.key, reg.notaProfe);
  renderPanel();
}

function vaciarPanel() {
  if (panelRegistros.length && !confirm('¿Vaciar la tabla de resultados?')) return;
  panelRegistros = [];
  try { localStorage.removeItem(CLAVE_NOTAS_MANUALES); } catch (e) {}
  renderPanel();
}

// Nota final: la del profesor si existe; si no, la automática
function notaFinalDe(reg) {
  if (!reg.notaMax) return null;
  if (typeof reg.notaProfe === 'number') return reg.notaProfe;
  if (reg.autoEscala !== null && typeof reg.autoEscala === 'number') return reg.autoEscala;
  return null;
}

// ------------------------------------------------------------
// Pintado de la tabla + resumen por alumno
// ------------------------------------------------------------
function renderPanel() {
  const cuerpo = document.getElementById('panelTablaBody');
  const vacio = document.getElementById('panelVacio');
  const resumen = document.getElementById('panelResumen');
  if (!cuerpo) return;

  cuerpo.innerHTML = '';
  const hayDatos = panelRegistros.length > 0;
  if (vacio) vacio.style.display = hayDatos ? 'none' : 'block';

  panelRegistros.forEach((reg, i) => {
    const auditoria = reg.notaMax > 0;
    const final = notaFinalDe(reg);

    const celdaAuto = auditoria
      ? `${reg.autoEscala} / ${reg.notaMax}`
      : `${reg.auto} / ${reg.autoMax}`;

    const celdaProfe = auditoria
      ? `<input type="number" class="input-manual" min="0" max="${reg.notaMax}" step="0.1"
           value="${typeof reg.notaProfe === 'number' ? reg.notaProfe : ''}"
           placeholder="0-${reg.notaMax}"
           onchange="cambiarNotaProfe(${i}, this.value)">`
      : '<span class="panel-na">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${esc(reg.iniciales) || '—'}</strong></td>
      <td>${esc(reg.nombre) || '—'}</td>
      <td>${esc(reg.tarjeta) || esc(reg.ejercicio)}</td>
      <td class="panel-pequena">${esc(reg.fecha)}</td>
      <td>${esc(reg.tiempo) || '—'}</td>
      <td>${celdaAuto}</td>
      <td>${celdaProfe}</td>
      <td class="panel-nota">${final !== null ? `<strong>${final} / ${reg.notaMax}</strong>` : '—'}</td>
      <td>${reg.puedeMd ? `<button class="btn-md" onclick="descargarMarkdown(${i})">⬇ .md</button>` : ''}</td>
    `;
    cuerpo.appendChild(tr);
  });

  renderResumen(hayDatos, resumen);
}

// Resumen por alumno: sus 2 tarjetas (5 + 5 = 10 → 2,5 ponderados)
function renderResumen(hayDatos, elResumen) {
  if (!elResumen) return;

  const e = escala();
  const auditoria = panelRegistros.filter(r => r.notaMax > 0);

  if (!hayDatos) {
    elResumen.textContent = 'Ningún resultado cargado';
    return;
  }
  if (auditoria.length === 0) {
    elResumen.textContent =
      `${panelRegistros.length} resultado(s) de Colocar aparatos (pondera ${e.ponderadoColocar})`;
    return;
  }

  const grupos = {};
  auditoria.forEach(reg => {
    const id = `${reg.iniciales || '?'}|${reg.nombre}`;
    if (!grupos[id]) {
      grupos[id] = {
        iniciales: reg.iniciales, nombre: reg.nombre,
        tarjetas: 0, max: 0, auto: 0, profe: 0, profeCompleto: true
      };
    }
    const g = grupos[id];
    g.tarjetas++;
    g.max += reg.notaMax;
    g.auto += reg.autoEscala || 0;
    if (typeof reg.notaProfe === 'number') g.profe += reg.notaProfe;
    else g.profeCompleto = false;
  });

  const ponderar = n => red2(n / e.puntosTotales * e.ponderadoAuditoria);

  const lineas = Object.values(grupos).map(g => {
    const profe = g.profeCompleto
      ? `${red2(g.profe)} / ${g.max}`
      : `${red2(g.profe)} / ${g.max} (incompleta)`;
    const ponderado = g.profeCompleto ? ` → ${ponderar(g.profe)} de 2,5` : '';
    return `${g.iniciales || '?'}${g.nombre ? ' · ' + g.nombre : ''} → ` +
      `${g.tarjetas} tarjeta(s) · Auto: ${red2(g.auto)} · Profesor: ${profe}${ponderado}`;
  });

  const esperadas = e.puntosTotales / e.puntosPorTarjeta;   // 2 tarjetas
  const pendientes = Object.values(grupos).filter(g => g.tarjetas < esperadas).length;

  elResumen.innerHTML =
    `<strong>${Object.keys(grupos).length} alumno(s)</strong> · ` +
    `${auditoria.length} entrega(s) · ` +
    `Escala: ${e.puntosPorTarjeta} pts/tarjeta × ${esperadas} = ${e.puntosTotales} pts ` +
    `→ <strong>${e.ponderadoAuditoria} ponderados</strong> (Colocar aparatos: ${e.ponderadoColocar})` +
    (pendientes ? ` · ⚠️ ${pendientes} con menos de ${esperadas} tarjetas` : '') +
    `<br>${lineas.map(l => `<div class="linea-resumen">${esc(l)}</div>`).join('')}`;
}

// ------------------------------------------------------------
// Utilidades de descarga
// ------------------------------------------------------------
function descargarTexto(texto, nombreArchivo) {
  const blob = new Blob([texto], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function slug(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    .slice(0, 40);
}

function txt(valor, vacio) {
  const v = Array.isArray(valor) ? valor.join(', ') : valor;
  const t = (v === null || v === undefined || v === '' || (Array.isArray(valor) && valor.length === 0))
    ? (vacio || '—') : String(v);
  return t.replace(/\r?\n/g, '\n> ');
}

// Carga una solución modelo desde la web (si no, deja la ruta)
async function cargarSolucion(nombreTarjeta) {
  const ruta = SOLUCIONES_POR_TARJETA[nombreTarjeta];
  if (!ruta) return { ruta: '', texto: null };
  try {
    const resp = await fetch(ruta, { cache: 'no-store' });
    if (!resp.ok) return { ruta, texto: null };
    const cuerpo = await resp.text();
    const limpio = cuerpo.replace(/^#[^\n]*\n+/, '').trim();
    return { ruta, texto: limpio || null };
  } catch (e) {
    return { ruta, texto: null };
  }
}

async function descargarMarkdown(indice) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.json) {
    alert('Este registro no tiene el JSON original. Vuelve a cargar el archivo.');
    return;
  }

  const soluciones = {};
  if (Array.isArray(reg.json.tarjetas)) {
    const nombres = [...new Set(reg.json.tarjetas.map(t => t.tarjetaNombre))];
    const cargadas = await Promise.all(nombres.map(cargarSolucion));
    nombres.forEach((n, i) => { soluciones[n] = cargadas[i]; });
  }

  const texto = generarInformeMarkdown(reg, soluciones);
  const nombre = `informe_md_${slug(reg.iniciales || 'sin')}_${slug(reg.tarjeta || reg.ejercicio)}.md`;
  descargarTexto(texto, nombre);
}

// ------------------------------------------------------------
// INFORME .md · JSON del alumno + solución modelo incrustada
// ------------------------------------------------------------
function generarInformeMarkdown(reg, soluciones) {
  soluciones = soluciones || {};
  const json = reg.json;
  const e = escala();
  const notas = reg.notaMax > 0;
  const esAuditoria = !!(json && json.alumno && json.tarjetas);

  let md = '';

  // ---- Cabecera
  md += `# Informe de auditoría · ${reg.iniciales || '—'}${reg.nombre ? ' — ' + reg.nombre : ''}\n\n`;
  md += `| Campo | Valor |\n|---|---|\n`;
  md += `| Alumno | ${txt(reg.nombre) || '—'} |\n`;
  md += `| Iniciales | ${txt(reg.iniciales) || '—'} |\n`;
  md += `| Ejercicio | ${txt(reg.ejercicio)} |\n`;
  md += `| Tarjeta | ${txt(reg.tarjeta) || '—'} |\n`;
  md += `| Fecha | ${txt(reg.fecha)} |\n`;
  md += `| Tiempo | ${txt(reg.tiempo) || '—'} |\n`;
  md += `| Email | ${esAuditoria ? txt(json.alumno.email) || '—' : '—'} |\n`;
  md += `| Archivo JSON | ${txt(reg.fichero)} |\n\n`;

  if (notas) {
    const delFichero = panelRegistros
      .filter(r => r.notaMax > 0 && r.fichero === reg.fichero)
      .sort((a, b) => (a.ordenTarjeta || 0) - (b.ordenTarjeta || 0));

    let sumAuto = 0, sumProfe = 0, sumFinal = 0, profeCompleto = true;
    delFichero.forEach(r => {
      const f = notaFinalDe(r);
      sumAuto += r.autoEscala || 0;
      if (typeof r.notaProfe === 'number') sumProfe += r.notaProfe;
      else profeCompleto = false;
      if (typeof f === 'number') sumFinal += f;
    });

    md += `## Puntuación (${e.puntosPorTarjeta} pts por tarjeta · ${e.puntosTotales} en total → ` +
          `${e.ponderadoAuditoria} ponderados)\n\n`;
    md += `| Tarjeta | Automática | Nota del profesor | Nota final |\n|---|---:|---:|---:|\n`;
    delFichero.forEach(r => {
      const f = notaFinalDe(r);
      md += `| ${txt(r.tarjeta)} | ${r.autoEscala} / ${r.notaMax} | ` +
            `${typeof r.notaProfe === 'number' ? r.notaProfe : '—'} / ${r.notaMax} | ` +
            `${f !== null ? f : '—'} / ${r.notaMax} |\n`;
    });
    md += `| **Total** | **${red2(sumAuto)} / ${e.puntosTotales}** | ` +
          `**${profeCompleto ? red2(sumProfe) : red2(sumProfe) + '?'} / ${e.puntosTotales}** | ` +
          `**${red2(sumFinal)} / ${e.puntosTotales}** |\n\n`;

    md += `> **Nota sobre el examen:** total del profesor / ${e.puntosTotales} × ` +
          `${e.ponderadoAuditoria} = **${red2(sumProfe / e.puntosTotales * e.ponderadoAuditoria)}** ` +
          `de 2,5 ponderados (Colocar aparatos pondera ${e.ponderadoColocar}).\n\n`;
  }

  if (!esAuditoria) {
    md += `## Resultado del módulo Colocar aparatos\n\n`;
    md += `- Aciertos: **${reg.auto} / ${reg.autoMax}**\n`;
    md += `- Tiempo: ${txt(reg.tiempo) || '—'}\n`;
    return md;
  }

  // ---- Corrección
  md += `## ✅ Verificación (comparar respuestas con la solución de cada tarjeta)\n\n`;
  md += `- [ ] Apartados de la ficha correctos\n`;
  md += `- [ ] Clasificación D/O/I/H correcta\n`;
  md += `- [ ] Cálculo correcto\n`;
  md += `- [ ] Medidas y verificación adecuadas\n`;
  md += `- [ ] Fuentes oficiales/técnicas citadas bien\n`;
  md += `- [ ] Presupuesto justificado\n`;
  md += `- [ ] **Total propuesto: ______ / ${e.puntosTotales}**\n\n`;

  // ---- Respuestas tarjeta a tarjeta con solución incrustada
  json.tarjetas.forEach((t, idx) => {
    const f = t.ficha || {};
    const sol = soluciones[t.tarjetaNombre] || { ruta: SOLUCIONES_POR_TARJETA[t.tarjetaNombre] || '', texto: null };

    md += `---\n\n## ${idx + 1} · ${t.tarjetaNombre} (${e.puntosPorTarjeta} pts)\n\n`;
    md += `> **Nota de esta tarjeta: ______ / ${e.puntosPorTarjeta}** ` +
          `(comparar con la solución incrustada más abajo)\n\n`;

    md += `### 📝 Respuestas del alumno\n\n`;
    md += `- **Condiciones interiores:** ${txt(f.condicionesInteriores)}\n`;
    md += `- **Factores exteriores:** ${txt(f.factoresExteriores)}\n`;
    md += `- **Problema principal:** ${txt(f.problemaPrincipal)}\n`;
    md += `- **Evidencia:** ${txt(f.evidencia)}\n`;
    md += `- **Causa probable:** ${txt(f.causaProbable)}\n\n`;

    md += `**Clasificación D / O / I / H**\n\n`;
    const doih = f.doih || {};
    const claves = Object.keys(doih);
    if (claves.length) claves.forEach(k => { md += `- Frase ${Number(k) + 1}: **${doih[k]}**\n`; });
    else md += `- —\n`;
    md += `- **Frase propia:** ${txt(f.frasesPropias)}\n\n`;

    md += `**Medidas de mejora y verificación**\n\n`;
    md += `- **Medida 1:** ${txt(f.medida1)}\n`;
    md += `- **Medida 2:** ${txt(f.medida2)}\n`;
    md += `- **Qué medirías:** ${txt(f.queMedirias)}\n`;
    md += `- **Con qué instrumento:** ${txt(f.conQueInstrumento)}\n\n`;

    md += `**Cálculo**\n\n`;
    if (f.calculo !== null && f.calculo !== undefined && f.calculo !== '') {
      md += `- **Valor del alumno:** ${f.calculo}\n`;
      const tarjetaObj = (typeof TARJETAS !== 'undefined') ? TARJETAS.find(x => x.id === t.tarjetaId) : null;
      if (tarjetaObj && tarjetaObj.calculo && typeof validarCalculo === 'function' && t.variacion) {
        try {
          const correcto = tarjetaObj.calculo.valor(t.variacion);
          const v = validarCalculo(f.calculo, correcto, tarjetaObj.calculo.tolerancia,
            tarjetaObj.calculo.decimales, tarjetaObj.calculo.unidad);
          md += `- **Fórmula esperada:** ${tarjetaObj.calculo.formula}\n`;
          md += `- **Respuesta esperada:** ${v.correcto} ${tarjetaObj.calculo.unidad}\n`;
          md += `- **¿Correcto?** ${v.ok ? '✅ SÍ' : '❌ NO'}\n`;
        } catch (err) { /* sin cálculo */ }
      }
    } else {
      md += `- **Valor del alumno:** — (sin cálculo)\n`;
    }
    md += `- **Ahorro estimado (texto):** ${txt(f.ahorroEstimado)}\n\n`;

    md += `**Valoración de la actuación**\n\n`;
    md += `- **Coste estimado:** ${f.costeEstimado || f.coste || '—'} € · ${txt(f.costeJustificacion, '(sin justificar)')}\n`;
    md += `- **Impacto:** ${txt(f.impacto)} · ${txt(f.impactoJustificacion, '(sin justificar)')}\n`;
    md += `- **Dificultad:** ${txt(f.dificultad)} · ${txt(f.dificultadJustificacion, '(sin justificar)')}\n\n`;

    md += `**Investigación (fuentes)**\n\n`;
    md += `- **Fuente oficial:** ${txt(f.fuenteOficial && f.fuenteOficial.id)} · apartado: ${txt(f.fuenteOficial && f.fuenteOficial.apartado)}\n`;
    md += `  - Dato encontrado: ${txt(f.fuenteOficial && f.fuenteOficial.datoEncontrado)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteOficial && f.fuenteOficial.aplicacion)}\n`;
    md += `- **Fuente técnica:** ${txt(f.fuenteTecnica && f.fuenteTecnica.id)}\n`;
    md += `  - Información: ${txt(f.fuenteTecnica && f.fuenteTecnica.informacion)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteTecnica && f.fuenteTecnica.aplicacion)}\n\n`;

    if (typeof f.justificacionPresupuesto !== 'undefined') {
      md += `**Presupuesto justificado**\n\n`;
      md += `- **Coste:** ${f.costeEstimado || 0} €\n`;
      md += `- **Justificación:** ${txt(f.justificacionPresupuesto)}\n\n`;
    }

    // ---- Solución modelo incrustada
    md += `### 📚 Solución modelo — \`${sol.ruta || 'solución no disponible'}\`\n\n`;
    if (sol.texto) {
      md += sol.texto.split('\n').map(l => '> ' + l).join('\n') + '\n\n';
    } else {
      md += `_No se pudo incrustar automáticamente. Ábrela en \`${sol.ruta || 'soluciones/'}\`._\n\n`;
    }
  });

  // ---- Presupuesto global
  if (json.presupuesto) {
    md += `---\n\n## Presupuesto del ejercicio\n\n`;
    md += `| Concepto | Valor |\n|---|---:|\n`;
    md += `| Total propuesto | ${json.presupuesto.total} € |\n`;
    md += `| Máximo | ${json.presupuesto.maximo} € |\n`;
    md += `| ¿Dentro de presupuesto? | ${json.presupuesto.dentro ? 'SÍ ✅' : 'NO ❌'} |\n`;
    md += `| Restante | ${json.presupuesto.restante} € |\n\n`;
  }

  md += `---\n\n*Generado desde el panel del profesor · Dashboard Domótica · ` +
        `Escala: ${e.puntosPorTarjeta} pts/tarjeta · ${e.puntosTotales} pts totales → ` +
        `${e.ponderadoAuditoria} ponderados (Colocar aparatos: ${e.ponderadoColocar})*\n`;
  return md;
}

// ------------------------------------------------------------
// Cierre de sesión: olvidar la sesión del panel
// ------------------------------------------------------------
function cerrarPanelSesion() {
  panelDesbloqueado = false;
  panelRegistros = [];
}
