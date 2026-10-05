/* ============================================================
   PANEL DE PROFESOR · Resultados de la clase
   · Se abre con 📊 Resultados (solo visible para el profe)
   · Pide la contraseña de CREDENCIALES_PROFE
   · Carga los JSON que entrega el alumno por Moodle
     (Ejercicio 6 + Ejercicio Global → 50 + 50 = 100)
   · Nota del alumno (la que él autoevalúa) y nota del profesor
   · Botón por fila: descarga el JSON convertido en .md
   ============================================================ */

const CLAVE_NOTAS_MANUALES = 'dashboard_notas_manuales';

// Solución modelo de cada tarjeta (carpeta NO publicada en la web)
const SOLUCIONES_POR_TARJETA = {
  'AULA': 'soluciones/01_aula.md',
  'PASILLO': 'soluciones/02_pasillo.md',
  'TALLER': 'soluciones/03_taller.md',
  'DESPACHO': 'soluciones/04_despacho.md',
  'BIBLIOTECA': 'soluciones/05_biblioteca.md',
  'GIMNASIO': 'soluciones/06_gimnasio.md',
  'VESTÍBULO': 'soluciones/07_vestibulo.md',
  'COMEDOR / CAFETERÍA': 'soluciones/08_comedor.md',
  'ASEO': 'soluciones/09_aseo.md',
  'SALÓN DE ACTOS': 'soluciones/10_salon_de_actos.md'
};

let panelDesbloqueado = false;
let panelRegistros = [];

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

function normalizarRegistro(json, nombreFichero) {
  const notaMax = (typeof ESCALA_AUDITORIA !== 'undefined')
    ? ESCALA_AUDITORIA.puntosPorEjercicio : 50;

  // 1) JSON de Colocar aparatos
  if (json && json.tipo === 'colocar') {
    const total = json.total || 0;
    const aciertos = typeof json.aciertos === 'number' ? json.aciertos : 0;
    return {
      modulo: 'Colocar',
      ejercicio: 'Colocar aparatos',
      iniciales: (json.iniciales || '').toUpperCase(),
      nombre: '',
      fecha: json.fechaLegible || json.fecha || '',
      tiempo: json.tiempoLegible || '',
      auto: aciertos,
      autoMax: total,
      notaMax: 0,          // este módulo no entra en la escala 50+50
      notaAlumno: '',
      json: json
    };
  }

  // 2) Informe de Auditoría
  if (json && json.alumno && json.puntuacion) {
    const p = json.puntuacion;
    const autoMax = (p.totalMaximo || 0) - (p.pendienteManual || 0);
    const ejId = (json.meta && json.meta.ejercicio) ? String(json.meta.ejercicio) : '';
    const ejNombre = (json.meta && json.meta.ejercicioNombre) || '';
    const etiqueta = ejId
      ? `Ejercicio ${ejId === 'global' ? 'Global' : ejId}${ejNombre ? ' · ' + ejNombre : ''}`
      : (ejNombre || 'Auditoría');
    return {
      modulo: 'Auditoría',
      ejercicio: etiqueta,
      iniciales: (json.alumno.iniciales || '').toUpperCase(),
      nombre: json.alumno.nombre || '',
      fecha: (json.meta && json.meta.fechaLegible) || '',
      tiempo: (json.meta && json.meta.duracionLegible) || '',
      auto: typeof p.aciertosAuto === 'number' ? p.aciertosAuto : 0,
      autoMax: autoMax,
      notaMax: p.notaMaxima || notaMax,
      notaAlumno: typeof p.notaAlumno === 'number' ? p.notaAlumno : '',
      json: json
    };
  }

  return null;
}

function claveRegistro(reg, nombreFichero) {
  return `${reg.modulo}|${reg.ejercicio}|${reg.iniciales}|${reg.fecha}|${nombreFichero}`;
}

function cargarResultadosPanel(files) {
  if (!files || files.length === 0) return;

  const errores = [];
  const pendientes = Array.from(files).map(f =>
    f.text().then(txt => {
      try {
        const json = JSON.parse(txt);
        const reg = normalizarRegistro(json, f.name);
        if (!reg) {
          errores.push(`${f.name}: formato no reconocido`);
          return;
        }
        const key = claveRegistro(reg, f.name);
        if (panelRegistros.find(r => r.key === key)) return;   // ya cargado

        reg.key = key;
        reg.fichero = f.name;
        const notas = leerNotas(key);
        reg.notaAlumno = notas.alumno !== null ? notas.alumno : reg.notaAlumno;
        reg.notaProfe = notas.profe;
        panelRegistros.push(reg);
      } catch (e) {
        errores.push(`${f.name}: JSON inválido`);
      }
    })
  );

  Promise.all(pendientes).then(() => {
    renderPanel();
    document.getElementById('panelFiles').value = '';
    if (errores.length) {
      alert('No se pudieron cargar algunos archivos:\n\n' + errores.join('\n'));
    }
  });
}

// ------------------------------------------------------------
// Notas persistidas: { clave: { alumno: n, profe: n } }
// (migra el formato antiguo: { clave: n } → nota del profesor)
// ------------------------------------------------------------
function leerTodasLasNotas() {
  try { return JSON.parse(localStorage.getItem(CLAVE_NOTAS_MANUALES) || '{}'); } catch (e) { return {}; }
}

function leerNotas(key) {
  const todas = leerTodasLasNotas();
  const v = todas[key];
  if (typeof v === 'number') return { profe: v, alumno: null };   // formato antiguo
  if (v && typeof v === 'object') {
    return {
      profe: typeof v.profe === 'number' ? v.profe : null,
      alumno: typeof v.alumno === 'number' ? v.alumno : null
    };
  }
  return { profe: null, alumno: null };
}

function guardarNotas(key, alumno, profe) {
  const todas = leerTodasLasNotas();
  const limpia = {};
  if (typeof alumno === 'number') limpia.alumno = alumno;
  if (typeof profe === 'number') limpia.profe = profe;
  if (Object.keys(limpia).length === 0) delete todas[key];
  else todas[key] = limpia;
  try { localStorage.setItem(CLAVE_NOTAS_MANUALES, JSON.stringify(todas)); } catch (e) {}
}

function limpiarNota(valor, max) {
  if (valor === '' || valor === null || valor === undefined) return null;
  const n = parseFloat(valor);
  if (isNaN(n)) return null;
  return Math.max(0, Math.min(max, n));
}

function cambiarNotaAlumno(indice, valor) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.notaMax) return;
  reg.notaAlumno = limpiarNota(valor, reg.notaMax);
  guardarNotas(reg.key, reg.notaAlumno, reg.notaProfe);
  renderPanel();
}

function cambiarNotaProfe(indice, valor) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.notaMax) return;
  reg.notaProfe = limpiarNota(valor, reg.notaMax);
  guardarNotas(reg.key, reg.notaAlumno, reg.notaProfe);
  renderPanel();
}

function vaciarPanel() {
  if (panelRegistros.length && !confirm('¿Vaciar la tabla de resultados?')) return;
  panelRegistros = [];
  try { localStorage.removeItem(CLAVE_NOTAS_MANUALES); } catch (e) {}
  renderPanel();
}

// ------------------------------------------------------------
// Nota final de una fila: manda la del profesor si la hay
// ------------------------------------------------------------
function notaFinalDe(reg) {
  if (!reg.notaMax) return null;
  const nota = (typeof reg.notaProfe === 'number') ? reg.notaProfe : reg.notaAlumno;
  return typeof nota === 'number' ? nota : null;
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
    const final = notaFinalDe(reg);
    const auditoria = reg.notaMax > 0;

    const celdaNota = (valor, max, fn) => auditoria
      ? `<input type="number" class="input-manual" min="0" max="${max}" step="1"
           value="${typeof valor === 'number' ? valor : ''}" placeholder="0-${max}"
           onchange="${fn}(${i}, this.value)">`
      : '<span class="panel-na">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${esc(reg.iniciales) || '—'}</strong></td>
      <td>${esc(reg.nombre) || '—'}</td>
      <td>${esc(reg.ejercicio)}</td>
      <td class="panel-pequena">${esc(reg.fecha)}</td>
      <td>${esc(reg.tiempo) || '—'}</td>
      <td>${reg.auto} / ${reg.autoMax}</td>
      <td>${celdaNota(reg.notaAlumno, reg.notaMax, 'cambiarNotaAlumno')}</td>
      <td>${celdaNota(reg.notaProfe, reg.notaMax, 'cambiarNotaProfe')}</td>
      <td class="panel-nota">${final !== null ? `<strong>${final} / ${reg.notaMax}</strong>` : '—'}</td>
      <td><button class="btn-md" onclick="descargarMarkdown(${i})">⬇ .md</button></td>
    `;
    cuerpo.appendChild(tr);
  });

  renderResumen(hayDatos, resumen);
}

// Resumen por alumno: total de sus ejercicios (50 + 50 = 100)
function renderResumen(hayDatos, elResumen) {
  if (!elResumen) return;

  const auditoria = panelRegistros.filter(r => r.notaMax > 0);
  if (!hayDatos) {
    elResumen.textContent = 'Ningún resultado cargado';
    return;
  }
  if (auditoria.length === 0) {
    elResumen.textContent = `${panelRegistros.length} resultado(s) de Colocar aparatos (fuera de la escala 50+50)`;
    return;
  }

  const grupos = {};
  auditoria.forEach(reg => {
    const id = `${reg.iniciales || '?'}|${reg.nombre}`;
    if (!grupos[id]) {
      grupos[id] = {
        iniciales: reg.iniciales,
        nombre: reg.nombre,
        ejercicios: 0,
        alumno: 0,
        profe: 0,
        max: 0,
        alumnoCompleto: true,
        profeCompleto: true
      };
    }
    const g = grupos[id];
    g.ejercicios++;
    g.max += reg.notaMax;
    if (typeof reg.notaAlumno === 'number') g.alumno += reg.notaAlumno;
    else g.alumnoCompleto = false;
    if (typeof reg.notaProfe === 'number') g.profe += reg.notaProfe;
    else g.profeCompleto = false;
  });

  const lineas = Object.values(grupos).map(g => {
    const alumno = `${g.alumno}${g.alumnoCompleto ? '' : '?'} / ${g.max}`;
    const profe = g.profeCompleto
      ? ` · Profesor: ${g.profe} / ${g.max}`
      : '';
    return `${g.iniciales || '?'} ${g.nombre ? '· ' + g.nombre : ''} → ${g.ejercicios} ejer. · Alumno: ${alumno}${profe}`;
  });

  const asignados = (typeof ESCALA_AUDITORIA !== 'undefined')
    ? ESCALA_AUDITORIA.ejerciciosAsignados.length : 2;
  const pendientes = Object.values(grupos).filter(g => g.ejercicios < asignados).length;

  elResumen.innerHTML =
    `<strong>${Object.keys(grupos).length} alumno(s)</strong> · ` +
    `${auditoria.length} entrega(s)` +
    (pendientes ? ` · ⚠️ ${pendientes} sin entregar los ${asignados} ejercicios` : '') +
    `<br>${lineas.map(l => `<div class="linea-resumen">${esc(l)}</div>`).join('')}`;
}

// ------------------------------------------------------------
// INFORME .md · JSON del alumno convertido a Markdown
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
  const t = (v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0))
    ? (vacio || '—') : String(v);
  // Markdown multi-línea: sangría de bloque
  return t.replace(/\r?\n/g, '\n> ');
}

function descargarMarkdown(indice) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.json) {
    alert('Este registro no tiene el JSON original. Vuelve a cargar el archivo.');
    return;
  }
  const texto = generarInformeMarkdown(reg);
  const nombre = `informe_md_${slug(reg.iniciales || 'sin')}_${slug(reg.ejercicio)}.md`;
  descargarTexto(texto, nombre);
}

function generarInformeMarkdown(reg) {
  const json = reg.json;
  const notas = reg.notaMax > 0;
  const final = notaFinalDe(reg);
  const esAuditoria = !!(json && json.alumno && json.tarjetas);

  let md = '';

  // ---- Cabecera
  md += `# Informe de auditoría · ${reg.iniciales || '—'}${reg.nombre ? ' — ' + reg.nombre : ''}\n\n`;
  md += `| Campo | Valor |\n|---|---|\n`;
  md += `| Alumno | ${txt(reg.nombre) || '—'} |\n`;
  md += `| Iniciales | ${txt(reg.iniciales) || '—'} |\n`;
  md += `| Grupo | ${esAuditoria ? txt(json.alumno.grupo) || '—' : '—'} |\n`;
  md += `| Ejercicio | ${txt(reg.ejercicio)} |\n`;
  md += `| Fecha | ${txt(reg.fecha)} |\n`;
  md += `| Tiempo | ${txt(reg.tiempo) || '—'} |\n`;
  md += `| Archivo JSON | ${txt(reg.fichero)} |\n\n`;

  if (notas) {
    md += `## Puntuación (hasta ${reg.notaMax} puntos en este ejercicio)\n\n`;
    md += `| Bloque | Puntos |\n|---|---:|\n`;
    md += `| Automática (calculada por la app) | ${reg.auto} / ${reg.autoMax} |\n`;
    md += `| **Nota del alumno (autoevaluación)** | ${typeof reg.notaAlumno === 'number' ? reg.notaAlumno : '—'} / ${reg.notaMax} |\n`;
    md += `| **Nota del profesor** | ${typeof reg.notaProfe === 'number' ? reg.notaProfe : '—'} / ${reg.notaMax} |\n`;
    md += `| **Nota final (manda la del profe)** | ${final !== null ? final : '—'} / ${reg.notaMax} |\n\n`;

    // Otros ejercicios del mismo alumno → total sobre 100
    const otros = panelRegistros.filter(r => r !== reg && r.notaMax > 0 &&
      r.iniciales === reg.iniciales && r.nombre === reg.nombre);
    if (otros.length) {
      const todos = [reg, ...otros];
      const totalMax = todos.reduce((s, r) => s + r.notaMax, 0);
      const totalAlumno = todos.reduce((s, r) => s + (typeof r.notaAlumno === 'number' ? r.notaAlumno : 0), 0);
      md += `> **Total del alumno en los ${todos.length} ejercicios: ${totalAlumno} / ${totalMax}**\n\n`;
    }
    md += `> Las soluciones modelo están en la carpeta \`soluciones/\` (no publicada en la web).\n\n`;
  }

  if (!esAuditoria) {
    md += `## Resultado del módulo Colocar aparatos\n\n`;
    md += `- Aciertos: **${reg.auto} / ${reg.autoMax}**\n`;
    md += `- Tiempo: ${txt(reg.tiempo) || '—'}\n`;
    return md;
  }

  // ---- Rúbrica en blanco para corregir
  md += `## ✅ Corrección (comparar con la solución modelo)\n\n`;
  md += `- [ ] Apartados de la ficha correctos\n`;
  md += `- [ ] Clasificación D/O/I/H correcta\n`;
  md += `- [ ] Cálculo correcto\n`;
  md += `- [ ] Medidas de mejora y verificación adecuadas\n`;
  md += `- [ ] Fuentes oficiales/técnicas citadas bien\n`;
  md += `- [ ] Presupuesto justificado\n`;
  md += `- [ ] **Nota propuesta: ______ / ${reg.notaMax}**\n\n`;

  // ---- Respuestas tarjeta a tarjeta
  json.tarjetas.forEach((t, idx) => {
    const f = t.ficha || {};
    const solucion = SOLUCIONES_POR_TARJETA[t.tarjetaNombre] || '(sin solución asignada)';

    md += `---\n\n## ${idx + 1} · ${t.tarjetaNombre}\n\n`;
    md += `📂 Solución modelo: \`${solucion}\`\n\n`;

    md += `### Datos y evidencias\n\n`;
    md += `- **Condiciones interiores:** ${txt(f.condicionesInteriores)}\n`;
    md += `- **Factores exteriores:** ${txt(f.factoresExteriores)}\n`;
    md += `- **Problema principal:** ${txt(f.problemaPrincipal)}\n`;
    md += `- **Evidencia:** ${txt(f.evidencia)}\n`;
    md += `- **Causa probable:** ${txt(f.causaProbable)}\n\n`;

    // DOIH: con el JSON no se puede recorrer TARJETAS de forma fiable si
    // cambió el reparto, así que se muestra lo que respondió el alumno.
    md += `### Clasificación D / O / I / H\n\n`;
    const doih = f.doih || {};
    const claves = Object.keys(doih);
    if (claves.length) {
      claves.forEach(k => {
        md += `- Frase ${Number(k) + 1}: **${doih[k]}**\n`;
      });
    } else {
      md += `- —\n`;
    }
    md += `- **Frase propia:** ${txt(f.frasesPropias)}\n\n`;

    md += `### Medidas de mejora y verificación\n\n`;
    md += `- **Medida 1:** ${txt(f.medida1)}\n`;
    md += `- **Medida 2:** ${txt(f.medida2)}\n`;
    md += `- **Qué medirías:** ${txt(f.queMedirias)}\n`;
    md += `- **Con qué instrumento:** ${txt(f.conQueInstrumento)}\n\n`;

    md += `### Cálculo\n\n`;
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
        } catch (e) { /* sin cálculo */ }
      }
    } else {
      md += `- **Valor del alumno:** — (sin cálculo)\n`;
    }
    md += `- **Ahorro estimado (texto):** ${txt(f.ahorroEstimado)}\n\n`;

    md += `### Valoración de la actuación\n\n`;
    md += `- **Coste estimado:** ${f.costeEstimado || f.coste || '—'} € · ${txt(f.costeJustificacion, '(sin justificar)')}\n`;
    md += `- **Impacto:** ${txt(f.impacto)} · ${txt(f.impactoJustificacion, '(sin justificar)')}\n`;
    md += `- **Dificultad:** ${txt(f.dificultad)} · ${txt(f.dificultadJustificacion, '(sin justificar)')}\n\n`;

    md += `### Investigación (fuentes)\n\n`;
    md += `- **Fuente oficial:** ${txt(f.fuenteOficial && f.fuenteOficial.id)} · apartado: ${txt(f.fuenteOficial && f.fuenteOficial.apartado)}\n`;
    md += `  - Dato encontrado: ${txt(f.fuenteOficial && f.fuenteOficial.datoEncontrado)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteOficial && f.fuenteOficial.aplicacion)}\n`;
    md += `- **Fuente técnica:** ${txt(f.fuenteTecnica && f.fuenteTecnica.id)}\n`;
    md += `  - Información: ${txt(f.fuenteTecnica && f.fuenteTecnica.informacion)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteTecnica && f.fuenteTecnica.aplicacion)}\n\n`;

    if (typeof f.justificacionPresupuesto !== 'undefined') {
      md += `### Presupuesto justificado\n\n`;
      md += `- **Coste:** ${f.costeEstimado || 0} €\n`;
      md += `- **Justificación:** ${txt(f.justificacionPresupuesto)}\n\n`;
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

  md += `---\n\n*Generado desde el panel del profesor · Dashboard Domótica*\n`;
  return md;
}

// ------------------------------------------------------------
// Cierre de sesión: olvidar la sesión del panel
// ------------------------------------------------------------
function cerrarPanelSesion() {
  panelDesbloqueado = false;
  panelRegistros = [];
}
