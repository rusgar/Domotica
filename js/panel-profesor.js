/* ============================================================
   PANEL DE PROFESOR · Resultados de la clase
   · Se abre con 📊 Resultados (solo visible para el profe)
   · Pide la contraseña de CREDENCIALES_PROFE
   · Carga los JSON descargados de Moodle (Ejercicio Auditoría →
     2 tarjetas de las 10 · 5 pts/tarjeta = 10 pts)
   · Una fila POR TARJETA con su puntuación automática (0-5)
   · NO se pone nota a mano: la nota es la automática
        Auto/5 × 1,25 = ponderación de esa tarjeta (máx. 1,25)
        2 tarjetas = 10 pts → 2,5 ponderados
   · Colocar aparatos = 1,0 ponderado: la nota también es SOLO
        automática y sale del JSON del alumno
        (8 zonas × 0,125 = 1,0, parcial por aparato; −0,1 si > 60 min)
   · Botón ⬇ .md por JSON: convertido a Markdown CON la
      solución/rúbrica incrustada para verificarla
    ============================================================ */

const CLAVE_NOTAS_MANUALES = 'dashboard_notas_manuales';  // legacy (se limpia al vaciar el panel)
// Claves antiguas de notas manuales de Colocar: ya no se usan (nota solo automática)
const CLAVE_NOTA_COLOCAR_LEGACY = 'dashboard_nota_colocar';

// Solución modelo de cada tarjeta (carpeta repartida por Moodle;
// en la web se usa para incrustarla en el informe .md)
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

const escala = () => (typeof ESCALA_AUDITORIA !== 'undefined' ? ESCALA_AUDITORIA : {
  ejerciciosAsignados: ['6'], puntosPorTarjeta: 5, puntosPorEjercicio: 10, puntosTotales: 10,
  ponderadoColocar: 1.0, ponderadoAuditoria: 2.5
});

// Escala de Colocar aparatos: 10 pts → 1,0 · 60 min → −0,1
const escalaColocar = () => (typeof ESCALA_COLOCAR !== 'undefined' ? ESCALA_COLOCAR : {
  puntos: 10, ponderado: 1.0, limiteTiempoMinutos: 60, penalizacionTiempo: 0.1
});

const red2 = n => Math.round(n * 100) / 100;

// Nota de Colocar · SOLO automática (no se pone nota a mano).
// Sale del JSON del alumno: `puntos` = Σ zonas / nº de zonas (0-1),
// es decir 8 zonas × 0,125 = 1,0 con parcial dentro de cada zona.
function notaColocar(reg) {
  if (!reg || reg.modulo !== 'Colocar') return null;
  const c = escalaColocar();
  const json = reg.json || null;
  let p = null;
  if (json && typeof json.puntos === 'number') p = json.puntos;
  else if (json && typeof json.aciertos === 'number' && json.total > 0) p = json.aciertos / json.total;
  if (p === null || !isFinite(p)) return null;
  p = Math.max(0, Math.min(1, p));
  const nota = red2(p * c.puntos);                 // 0-10
  const bruto = red2(p * c.ponderado);             // 0-1,0
  const pen = (typeof penalizacionTiempoColocar === 'function')
    ? penalizacionTiempoColocar(reg.tiempoSeg) : 0;
  return { puntos: p, nota, bruto, pen, final: red2(Math.max(0, bruto - pen)) };
}

// (nombre histórico) Nota de Colocar → ponderación final (0-1,0)
function ponderadoColocarDe(reg) {
  return notaColocar(reg);
}

// ------------------------------------------------------------
// CAPTURA DE PANTALLA (Colocar): el profesor adjunta la imagen
// que el alumno ha subido a Moodle y la consulta al corregir
// ------------------------------------------------------------
let capturaPendienteIndice = null;

function adjuntarCaptura(indice) {
  capturaPendienteIndice = indice;
  const input = document.getElementById('panelCapturaInput');
  if (input) input.click();
}

function onCapturaSeleccionada(files) {
  const f = files && files[0];
  const input = document.getElementById('panelCapturaInput');
  if (input) input.value = '';
  if (!f || capturaPendienteIndice === null) return;
  leerImagen(f, dataUrl => {
    const reg = panelRegistros[capturaPendienteIndice];
    if (reg) {
      reg.captura = dataUrl;
      reg.capturaNombre = f.name;
      renderPanel();
    }
    capturaPendienteIndice = null;
  });
}

function leerImagen(file, cb) {
  const reader = new FileReader();
  reader.onload = ev => cb(ev.target.result);
  reader.readAsDataURL(file);
}

function verCaptura(indice) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.captura) return;
  const v = document.getElementById('panelVisor');
  const img = document.getElementById('panelVisorImg');
  if (!v || !img) { window.open(reg.captura, '_blank'); return; }
  img.src = reg.captura;
  img.alt = reg.capturaNombre || 'Captura';
  v.classList.add('show');
}

function cerrarVisorCaptura() {
  const v = document.getElementById('panelVisor');
  if (v) v.classList.remove('show');
}

// Extrae unas iniciales (2-4 mayúsculas) del nombre de un archivo
function inicialesDeNombre(nombre) {
  const m = String(nombre || '').toUpperCase().match(/\b[A-ZÑ]{2,4}\b/);
  return m ? m[0] : '';
}

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
    // Tiempo SOLO del ejercicio (los JSON viejos solo traen el de sesión)
    const tiempoSeg = typeof json.tiempoEjercicioSegundos === 'number' ? json.tiempoEjercicioSegundos
      : (typeof json.tiempoSegundos === 'number' ? json.tiempoSegundos : null);
    const tiempoTxt = json.tiempoEjercicioLegible || json.tiempoLegible || '';
    const iniciales = (json.iniciales || '').toUpperCase();
    return [{
      modulo: 'Colocar',
      ejercicio: 'Colocar aparatos',
      tarjeta: '',
      ordenTarjeta: 0,
      iniciales: iniciales,
      nombre: '',
      fecha: json.fechaLegible || json.fecha || '',
      tiempo: tiempoTxt,
      tiempoSeg: tiempoSeg,
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
    const etiqueta = ejId === '6' ? 'Ejercicio Auditoría' : (ejId ? `Ejercicio ${ejId}` : 'Auditoría');
    const totalTarjetas = json.tarjetas.length;
    const meta = json.meta || {};
    // Tiempo SOLO del ejercicio (los JSON viejos no lo traen → se usa el de sesión)
    const tiempoSeg = typeof meta.duracionEjercicioSegundos === 'number' ? meta.duracionEjercicioSegundos
      : (typeof meta.duracionSegundos === 'number' ? meta.duracionSegundos : null);
    const tiempoTxt = meta.duracionEjercicioLegible || meta.duracionLegible || '';

    return json.tarjetas.map((t, i) => {
      const auto = autoDeTarjeta(t);
      return {
        modulo: 'Auditoría',
        ejercicio: etiqueta,
        tarjeta: `${t.tarjetaNombre || 'Tarjeta'} (${i + 1}/${totalTarjetas})`,
        ordenTarjeta: i,
        iniciales: (json.alumno.iniciales || '').toUpperCase(),
        nombre: json.alumno.nombre || '',
        fecha: (meta.fechaLegible) || '',
        tiempo: tiempoTxt,
        tiempoSeg: tiempoSeg,
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
  const lista = Array.from(files);
  const esImagen = f => (f.type || '').startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(f.name || '');
  const imagenes = lista.filter(esImagen);
  const jsons = lista.filter(f => !esImagen(f));

  const pendientes = jsons.map(f =>
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

    // Capturas de pantalla (Colocar): se asocian a su alumno
    imagenes.forEach(f => leerImagen(f, dataUrl => {
      const ini = inicialesDeNombre(String(f.name || '').replace(/\.[a-z]+$/i, ''));
      let reg = panelRegistros.find(r =>
        r.modulo === 'Colocar' && r.iniciales && ini && r.iniciales === ini);

      if (!reg) {
        const colocar = panelRegistros.filter(r => r.modulo === 'Colocar');
        if (colocar.length === 1) reg = colocar[0];
      }

      if (!reg) {
        const respuesta = prompt(
          `No encuentro a quién pertenece «${f.name}».\n` +
          `Escribe sus INICIALES (2 a 4 letras):`, ini || '');
        const nuevas = (respuesta || '').trim().toUpperCase();
        if (!/^[A-ZÑ]{2,4}$/.test(nuevas)) {
          alert(`❌ Captura descartada: «${f.name}» no se ha asociado a ningún alumno.`);
          return;
        }
        reg = {
          modulo: 'Colocar', ejercicio: 'Colocar aparatos', tarjeta: '', ordenTarjeta: 0,
          iniciales: nuevas, nombre: '', fecha: '', tiempo: '', tiempoSeg: null,
          auto: 0, autoMax: 0, autoEscala: null, notaMax: 0, puedeMd: true,
          json: null,
          key: `Colocar|Colocar aparatos||${nuevas}|captura`, fichero: f.name
        };
        panelRegistros.push(reg);
      }

      reg.captura = dataUrl;
      reg.capturaNombre = f.name;
      if (typeof reg.puedeMd === 'boolean' && !reg.json) reg.puedeMd = true;
      renderPanel();
    }));
  });
}

function vaciarPanel() {
  if (panelRegistros.length && !confirm('¿Vaciar la tabla de resultados?')) return;
  panelRegistros = [];
  capturaPendienteIndice = null;
  // Limpia las claves antiguas de notas manuales (hoy la nota es SOLO automática)
  try { localStorage.removeItem(CLAVE_NOTAS_MANUALES); } catch (e) {}
  try { localStorage.removeItem(CLAVE_NOTA_COLOCAR_LEGACY); } catch (e) {}
  renderPanel();
}

// Ponderación de UNA tarjeta sobre la nota final del examen:
// 5 pts de tarjeta → 1,25 ponderados (2 tarjetas = 10 pts → 2,5)
function ponderadoPorTarjeta() {
  const e = escala();
  return e.ponderadoAuditoria / (e.puntosTotales / e.puntosPorTarjeta);   // 2,5 / 2 = 1,25
}

// La nota de la tarjeta es SOLO la puntuación automática (no se pone nota a mano)
function ponderadoDe(reg) {
  if (!reg || !reg.notaMax) return null;
  const auto = typeof reg.autoEscala === 'number' ? reg.autoEscala : 0;
  return red2(auto / reg.notaMax * ponderadoPorTarjeta());
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
    const esColocar = reg.modulo === 'Colocar';
    const auditoria = reg.notaMax > 0;
    const maxPond = red2(ponderadoPorTarjeta());
    const pond = ponderadoDe(reg);
    const c = escalaColocar();
    const pen = esColocar
      ? ((typeof penalizacionTiempoColocar === 'function') ? penalizacionTiempoColocar(reg.tiempoSeg) : 0)
      : penalizacionTiempoAplicada(reg.tiempoSeg);

    const celdaAuto = auditoria
      ? `${reg.autoEscala} / ${reg.notaMax}`
      : `${reg.auto} / ${reg.autoMax}`;

    const celdaTiempo = `${esc(reg.tiempo) || '—'}` + (pen
      ? ` <span class="panel-tiempo-malo" title="Supera los 60 min del ejercicio: se descuenta ${String(pen).replace('.', ',')} sobre ${esColocar ? 'los 1,0' : 'los 2,5'}">⏰ −${String(pen).replace('.', ',')}</span>`
      : '');

    // Nota · Ponderación (Colocar: SOLO automática, sale del JSON del alumno)
    let celdaPond;
    if (esColocar) {
      const p = ponderadoColocarDe(reg);
      celdaPond = p
        ? `<strong>${p.nota} / ${c.puntos}</strong> → <strong>${p.final} / ${red2(c.ponderado)}</strong>`
        : '<span class="panel-na">— (sin JSON)</span>';
    } else {
      celdaPond = pond !== null
        ? `<strong>${pond} / ${maxPond}</strong>`
        : '<span class="panel-na">—</span>';
    }

    const celdaCaptura = esColocar
      ? (reg.captura
        ? `<button class="btn-captura" title="${esc(reg.capturaNombre || 'captura')}" onclick="verCaptura(${i})">📷 Ver</button>`
        : `<button class="btn-captura btn-captura-add" title="Adjuntar la captura de pantalla del alumno" onclick="adjuntarCaptura(${i})">＋ 📷</button>`)
      : '<span class="panel-na">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${esc(reg.iniciales) || '—'}</strong></td>
      <td>${esc(reg.nombre) || '—'}</td>
      <td>${esc(reg.tarjeta) || esc(reg.ejercicio)}</td>
      <td class="panel-pequena">${esc(reg.fecha)}</td>
      <td>${celdaTiempo}</td>
      <td>${celdaAuto}</td>
      <td class="panel-nota">${celdaPond}</td>
      <td>${celdaCaptura}</td>
      <td>${reg.puedeMd ? `<button class="btn-md" onclick="descargarMarkdown(${i})">⬇ .md</button>` : ''}</td>
    `;
    cuerpo.appendChild(tr);
  });

  renderResumen(hayDatos, resumen);
}

// Resumen por alumno: auditoría (2 tarjetas → 2,5) y Colocar (→ 1,0)
function renderResumen(hayDatos, elResumen) {
  if (!elResumen) return;

  const e = escala();
  const c = escalaColocar();
  const auditoria = panelRegistros.filter(r => r.notaMax > 0);
  const colocar = panelRegistros.filter(r => r.modulo === 'Colocar');

  if (!hayDatos) {
    elResumen.textContent = 'Ningún resultado cargado';
    return;
  }

  const lineas = [];

  // ---- Auditoría: nota SOLO automática (Auto/5 × 1,25 por tarjeta)
  const grupos = {};
  auditoria.forEach(reg => {
    const id = `${reg.iniciales || '?'}|${reg.nombre}`;
    if (!grupos[id]) {
      grupos[id] = {
        iniciales: reg.iniciales, nombre: reg.nombre,
        tarjetas: 0, max: 0, auto: 0, ponderado: 0, tiempoSeg: 0
      };
    }
    const g = grupos[id];
    g.tarjetas++;
    g.max += reg.notaMax;
    g.auto += reg.autoEscala || 0;
    g.ponderado += ponderadoDe(reg) || 0;
    if (typeof reg.tiempoSeg === 'number' && reg.tiempoSeg > g.tiempoSeg) g.tiempoSeg = reg.tiempoSeg;
  });

  Object.values(grupos).forEach(g => {
    const pen = penalizacionTiempoAplicada(g.tiempoSeg);
    const final = red2(Math.max(0, g.ponderado - pen));
    const textoPen = pen
      ? ` · ⏰ ${formatearTiempo(g.tiempoSeg)} > 60 min → <strong>−${String(pen).replace('.', ',')}</strong> → nota <strong>${final}</strong>`
      : '';
    lineas.push(
      `${esc(g.iniciales) || '?'}${g.nombre ? ' · ' + esc(g.nombre) : ''} → ` +
      `${g.tarjetas} tarjeta(s) · Auto: ${red2(g.auto)} / ${g.max} · ` +
      `Nota: <strong>${red2(g.ponderado)} / ${e.ponderadoAuditoria}</strong>${textoPen}`);
  });

  // ---- Colocar: nota SOLO automática desde el JSON (8 zonas × 0,125 = 1,0)
  colocar.forEach(reg => {
    const p = ponderadoColocarDe(reg);
    const pen = (typeof penalizacionTiempoColocar === 'function')
      ? penalizacionTiempoColocar(reg.tiempoSeg) : 0;
    const tiempo = reg.tiempo ? ` · ⏱ ${esc(reg.tiempo)}` : '';
    const penTxt = pen
      ? ` · ⏰ >${c.limiteTiempoMinutos} min → <strong>−${String(pen).replace('.', ',')}</strong>` : '';
    const foto = reg.captura ? ' · 📷' : '';
    if (p) {
      lineas.push(
        `${esc(reg.iniciales) || '?'} → <strong>Colocar: ${p.nota} / ${c.puntos}` +
        ` → ${p.final} / ${red2(c.ponderado)}</strong>${penTxt}${tiempo}${foto}` +
        ` · Aciertos: ${reg.auto}/${reg.autoMax}`);
    } else {
      lineas.push(
        `${esc(reg.iniciales) || '?'} → Colocar: <strong>sin JSON</strong> ` +
        `(no hay puntuación automática; solo la captura)` +
        (reg.captura ? '' : ' · ⚠️ falta la captura') + penTxt + tiempo);
    }
  });

  const esperadas = e.puntosTotales / e.puntosPorTarjeta;   // 2 tarjetas
  const pendientes = Object.values(grupos).filter(g => g.tarjetas < esperadas).length;
  const colocarSinJSON = colocar.filter(r => !r.json).length;

  elResumen.innerHTML =
    `<strong>${Object.keys(grupos).length} alumno(s)</strong> · ` +
    `${auditoria.length} entrega(s) · ` +
    `Escala: ${e.puntosPorTarjeta} pts/tarjeta × ${esperadas} = ${e.puntosTotales} pts ` +
    `→ <strong>${e.ponderadoAuditoria} ponderados</strong> · ` +
    `nota = <strong>solo automática: Auto/5 × ${red2(ponderadoPorTarjeta())} por tarjeta</strong>` +
    ` · ⏰ tiempo > ${escala().limiteTiempoMinutos || 60} min → <strong>−${red2(escala().penalizacionTiempo || 0.25)}</strong>` +
    `<br><strong>Colocar aparatos:</strong> ${colocar.length} · nota (solo automática) 0-${c.puntos} ` +
    `→ <strong>${red2(c.ponderado)} ponderados</strong> · ` +
    `⏰ > ${c.limiteTiempoMinutos} min → <strong>−${String(c.penalizacionTiempo).replace('.', ',')}</strong>` +
    (colocarSinJSON ? ` · ⚠️ ${colocarSinJSON} sin JSON` : '') +
    (pendientes ? ` · ⚠️ ${pendientes} con menos de ${esperadas} tarjetas` : '') +
    `<br>${lineas.map(l => `<div class="linea-resumen">${l}</div>`).join('')}`;
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
  // Colocar puede generarse aunque solo haya captura (sin JSON del alumno):
  // en ese caso el .md no traerá puntuación automática
  if (!reg || (!reg.json && reg.modulo !== 'Colocar')) {
    alert('Este registro no tiene el JSON original. Vuelve a cargar el archivo.');
    return;
  }

  const soluciones = {};
  if (reg.json && Array.isArray(reg.json.tarjetas)) {
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

  const delFichero = panelRegistros
    .filter(r => r.notaMax > 0 && r.fichero === reg.fichero)
    .sort((a, b) => (a.ordenTarjeta || 0) - (b.ordenTarjeta || 0));

  if (notas) {
    let sumAuto = 0, sumPond = 0;
    delFichero.forEach(r => {
      sumAuto += r.autoEscala || 0;
      sumPond += ponderadoDe(r) || 0;
    });
    const maxPond = red2(ponderadoPorTarjeta());

    md += `## Puntuación (${e.puntosPorTarjeta} pts por tarjeta · ${e.puntosTotales} en total → ` +
          `${e.ponderadoAuditoria} ponderados)\n\n`;
    md += `> **La nota solo sale de la parte automática: no se pone nota a mano.** ` +
          `Por tarjeta: **Auto/5 × ${maxPond} = ponderación** (máx. ${maxPond} por tarjeta).\n\n`;
    md += `| Tarjeta | Automática (0-5) | Ponderación (0-${maxPond}) |\n|---|---:|---:|\n`;
    delFichero.forEach(r => {
      md += `| ${txt(r.tarjeta)} | ${r.autoEscala} / ${r.notaMax} | ` +
            `**${ponderadoDe(r)} / ${maxPond}** |\n`;
    });
    md += `| **Total** | **${red2(sumAuto)} / ${e.puntosTotales}** | ` +
          `**${red2(sumPond)} / ${e.ponderadoAuditoria}** |\n\n`;

    md += `> **Nota sobre el examen:** ${red2(sumAuto)} / ${e.puntosTotales} × ` +
          `${e.ponderadoAuditoria} = **${red2(sumPond)}** de ${e.ponderadoAuditoria} ponderados ` +
          `(Colocar aparatos pondera ${e.ponderadoColocar}).\n\n`;

    // Penalización por tiempo (solo el reloj del Ejercicio Auditoría)
    const limiteMin = (typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.limiteTiempoMinutos) || 60;
    const pen = penalizacionTiempoAplicada(reg.tiempoSeg);
    md += pen
      ? `> **⏰ Penalización por tiempo:** el ejercicio lleva **${reg.tiempo || '—'}** > ${limiteMin} min → ` +
        `**−${String(pen).replace('.', ',')}** sobre 2,5 → ` +
        `**nota final ${red2(Math.max(0, sumPond - pen))} de ${e.ponderadoAuditoria} ponderados**.\n\n`
      : `> **⏰ Tiempo del ejercicio:** ${reg.tiempo || '—'} · límite ${limiteMin} min → **sin penalización**.\n\n`;

    md += `Los campos abiertos de cada ficha **no puntúan**: sirven para verificar la respuesta ` +
          `comparándola con la solución incrustada más abajo.\n\n`;
  }

  if (!esAuditoria) {
    const c = escalaColocar();
    const p = ponderadoColocarDe(reg);
    const pen = (typeof penalizacionTiempoColocar === 'function')
      ? penalizacionTiempoColocar(reg.tiempoSeg) : 0;

    md = `# Informe de Colocar aparatos · ${reg.iniciales || '—'}\n\n`;
    md += `| Campo | Valor |\n|---|---|\n`;
    md += `| Alumno | ${txt(reg.nombre) || '—'} |\n`;
    md += `| Iniciales | ${txt(reg.iniciales) || '—'} |\n`;
    md += `| Ejercicio | Colocar aparatos |\n`;
    md += `| Fecha | ${txt(reg.fecha)} |\n`;
    md += `| Tiempo del ejercicio | ${txt(reg.tiempo) || '—'} |\n`;
    md += `| Captura en el panel | ${reg.captura ? 'adjuntada' : 'NO adjuntada'} |\n`;
    md += `| Archivo JSON | ${txt(reg.fichero) || 'captura de pantalla'} |\n\n`;

    md += `## Puntuación (módulo Colocar · ${c.puntos} pts → ${red2(c.ponderado)} ponderados · **SOLO automática**)\n\n`;
    md += `| Concepto | Valor |\n|---|---:|\n`;
    md += `| Aparatos bien colocados (obligatorios) | ${reg.auto} / ${reg.autoMax} |\n`;
    md += `| Nota automática (${c.puntos} pts) | ${p ? `${p.nota} / ${c.puntos}` : '**sin JSON**'} |\n`;
    md += `| Tiempo del ejercicio | ${txt(reg.tiempo) || '—'} |\n`;
    md += `| Penalización por tiempo | ${pen ? `**−${String(pen).replace('.', ',')}** (> ${c.limiteTiempoMinutos} min)` : 'sin penalización'} |\n`;
    md += `| **Ponderación** | **${p ? `${p.final} / ${red2(c.ponderado)}` : `— / ${red2(c.ponderado)}`}** |\n\n`;

    // Desglose por zona: 8 zonas × 0,125 = 1,0 (parcial dentro de cada zona)
    const zonasJson = (reg.json && reg.json.zonas) || null;
    if (zonasJson && typeof zonasJson === 'object' && Object.keys(zonasJson).length > 0) {
      const nZonas = Object.keys(zonasJson).length;
      md += `### Desglose por zona (${nZonas} × 0,125 = 1,0)\n\n`;
      md += `| Zona | Aparatos bien colocados | Puntos |\n|---|---:|---:|\n`;
      Object.keys(zonasJson).forEach(z => {
        const zj = zonasJson[z] || {};
        const ok = typeof zj.ok === 'number' ? zj.ok : 0;
        const total = typeof zj.total === 'number' ? zj.total : 0;
        const puntos = total > 0 ? (ok / total) / nZonas : 0;
        const nombre = (typeof NOMBRES_ZONAS !== 'undefined' && NOMBRES_ZONAS[z]) ? NOMBRES_ZONAS[z] : z;
        md += `| ${nombre} | ${ok} / ${total} | ${puntos.toFixed(3).replace('.', ',')} |\n`;
      });
      md += `| **Total** | | **${p ? p.puntos.toFixed(3).replace('.', ',') : '—'}** |\n\n`;
    }

    md += `**Cómo se calcula:** cada una de las **8 zonas** vale **0,125** (8 × 0,125 = **1,0**); ` +
      `dentro de la zona, cada aparato vale \`0,125 / nº de aparatos de la zona\` ` +
      `(Ej.: Exterior = 7 aparatos → 0,018 c/u). Los aparatos de relleno (opcional) **no puntúan**. ` +
      `La nota final es \`puntos × ${c.puntos}\` y la ponderación \`puntos × ${red2(c.ponderado)}\`` +
      (pen ? ` − ${String(pen).replace('.', ',')} (por pasar de ${c.limiteTiempoMinutos} min) = **${p ? p.final : 0}**` : '') +
      `.\n\n`;

    md += `### Captura de pantalla\n\n`;
    md += reg.captura
      ? `Imagen adjunta en el panel (**${txt(reg.capturaNombre) || 'captura'}**). El alumno además debe subirla a Moodle.\n\n`
      : `⚠️ **Sin captura adjunta.** El alumno debe subir la captura a Moodle y el profesor puede adjuntarla desde el panel (botón \`＋ 📷\`).\n\n`;

    md += `### Comprobación\n\n`;
    md += `- Cada zona se da por buena con «✓ Validar»: si está perfecta sale en verde (✅); ` +
      `si algo falta o sobra aparece el pop-up «¿Quieres dejarlo así o poner más?» y la zona queda **📌 aceptada** ` +
      `(se puntúa lo que haya y **no bloquea**).\n`;
    md += `- El ejercicio termina cuando las **8 zonas** están dadas por buena (✅ o 📌).\n`;
    md += `- **No se admiten aparatos repetidos**: cada aparato del catálogo se coloca una sola vez.\n`;
    md += `- Los aparatos de relleno (opcional) **no puntúan**: solo deben colocarse en zonas válidas si el alumno los arrastra.\n`;
    md += `- Los \`42\` aparatos obligatorios tienen que estar en su zona de referencia ` +
      `(\`img/Captura de pantalla 2026-10-04 094925.png\`) para que la zona puntúe al máximo.\n\n`;
    return md;
  }

  // ---- Corrección
  md += `## ✅ Verificación (comparar respuestas con la solución de cada tarjeta)\n\n`;
  md += `- [ ] Apartados de la ficha correctos\n`;
  md += `- [ ] Clasificación D/O/I/H correcta\n`;
  md += `- [ ] Cálculo correcto\n`;
  md += `- [ ] Medidas y verificación adecuadas\n`;
  md += `- [ ] Fuentes oficiales/técnicas citadas bien\n`;
  md += `- [ ] Precio (apartado 8) rellenado, dentro del tope y coherente con el catálogo\n`;
  const totalAuto = red2(delFichero.reduce((s, r) => s + (r.autoEscala || 0), 0));
  const totalPond = red2(totalAuto / e.puntosTotales * e.ponderadoAuditoria);
  const limiteMinMD = (typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.limiteTiempoMinutos) || 60;
  md += `- [ ] Tiempo del ejercicio ≤ ${limiteMinMD} min (hoy: ${reg.tiempo || '—'})` +
        `${penalizacionTiempoAplicada(reg.tiempoSeg) > 0 ? ' ❌ **hay penalización**' : ''}\n`;
  md += `- [ ] **Total automático: ${totalAuto} / ${e.puntosTotales} → ` +
        `${totalPond} de ${e.ponderadoAuditoria} ponderados · Observaciones: __________**\n\n`;

  // ---- Respuestas tarjeta a tarjeta con solución incrustada
  json.tarjetas.forEach((t, idx) => {
    const f = t.ficha || {};
    const sol = soluciones[t.tarjetaNombre] || { ruta: SOLUCIONES_POR_TARJETA[t.tarjetaNombre] || '', texto: null };
    const fila = delFichero[idx];
    const autoT = fila && typeof fila.autoEscala === 'number' ? fila.autoEscala : 0;

    md += `---\n\n## ${idx + 1} · ${t.tarjetaNombre} (${e.puntosPorTarjeta} pts)\n\n`;
    md += `> **Nota automática de esta tarjeta: ${autoT} / ${e.puntosPorTarjeta}` +
          ` → ${red2(autoT / e.puntosPorTarjeta * ponderadoPorTarjeta())} de ` +
          `${red2(ponderadoPorTarjeta())} ponderados**\n`;
    md += `> (No se pone nota a mano: compara las respuestas con la solución incrustada más abajo)\n\n`;

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
    const topeTarj = (json.presupuesto && json.presupuesto.porTarjeta) ||
      ((typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.presupuestoPorTarjeta) || 0);
    const precioNum = parseFloat(f.costeEstimado);
    const precioOK = !isNaN(precioNum) && precioNum > 0;
    const matsMd = Array.isArray(f.materiales) ? f.materiales : [];
    if (matsMd.length) {
      const lineas = matsMd.map(m => {
        const ap = (typeof APARATOS !== 'undefined' && APARATOS) ? APARATOS.find(a => a.id === m.id) : null;
        return ap ? `${m.cantidad} × ${ap.nombre} (${ap.precio} €)` : null;
      }).filter(Boolean);
      const sumaMat = (typeof sumaMateriales === 'function') ? sumaMateriales(f) : 0;
      md += `- **Aparatos elegidos:** ${lineas.join(' · ')} → suma ${formatearNumero(sumaMat, 0)} €\n`;
    }
    const estadoPrecio = !precioOK ? '❌ **SIN PRECIO (obligatorio)**'
      : precioNum > topeTarj ? `❌ **supera el tope de ${topeTarj} €**`
      : (typeof precioCoherenteCatalogo === 'function' && !precioCoherenteCatalogo(precioNum, f.materiales))
        ? (matsMd.length ? '⚠️ no cuadra con la suma de su lista' : '⚠️ fuera del catálogo (±20 %)')
        : (matsMd.length ? '✅ cuadra con la lista de aparatos' : '✅ dentro del tope y coherente con el catálogo');
    md += `- **Precio de la actuación (apartado 8):** ${precioOK ? precioNum : '—'} € / ` +
          `tope ${topeTarj} € → ${estadoPrecio}\n`;
    md += `- **Coste valorado:** ${txt(f.coste)} · ${txt(f.costeJustificacion, '(sin justificar)')}\n`;
    md += `- **Impacto:** ${txt(f.impacto)} · ${txt(f.impactoJustificacion, '(sin justificar)')}\n`;
    md += `- **Dificultad:** ${txt(f.dificultad)} · ${txt(f.dificultadJustificacion, '(sin justificar)')}\n\n`;

    md += `**Investigación (fuentes)**\n\n`;
    md += `- **Fuente oficial:** ${txt(f.fuenteOficial && f.fuenteOficial.id)} · apartado: ${txt(f.fuenteOficial && f.fuenteOficial.apartado)}\n`;
    md += `  - Dato encontrado: ${txt(f.fuenteOficial && f.fuenteOficial.datoEncontrado)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteOficial && f.fuenteOficial.aplicacion)}\n`;
    md += `- **Fuente técnica:** ${txt(f.fuenteTecnica && f.fuenteTecnica.id)}\n`;
    md += `  - Información: ${txt(f.fuenteTecnica && f.fuenteTecnica.informacion)}\n`;
    md += `  - Aplicación: ${txt(f.fuenteTecnica && f.fuenteTecnica.aplicacion)}\n\n`;

    if (f.justificacionPresupuesto) {
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
    const p = json.presupuesto;
    const topeP = p.porTarjeta ||
      ((typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.presupuestoPorTarjeta) || 0);
    md += `---\n\n## Presupuesto del ejercicio\n\n`;
    md += `| Concepto | Valor |\n|---|---:|\n`;
    md += `| Tope por tarjeta (obligatorio) | ${topeP} € |\n`;
    md += `| Máximo total | ${p.maximo} € |\n`;
    md += `| Total propuesto | ${p.total} € |\n`;
    md += `| ¿Dentro de presupuesto? | ${p.dentro ? 'SÍ ✅' : 'NO ❌ / incompleto ❌'} |\n`;
    md += `| Restante | ${p.restante} € |\n`;
    if (typeof p.rellenas === 'number') md += `| Precios rellenados | ${p.rellenas} / ${json.tarjetas.length} |\n`;
    md += `\n> El precio va en el **apartado 8** de cada tarjeta: se rellena solo al elegir aparatos del ` +
          `desplegable del catálogo (o a mano) y debe encajar con esa lista o con un artículo del ` +
          `catálogo del módulo Colocar aparatos (±20 %).\n\n`;
  }

  md += `---\n\n*Generado desde el panel del profesor · Dashboard Domótica · ` +
        `Escala: ${e.puntosPorTarjeta} pts/tarjeta · ${e.puntosTotales} pts totales → ` +
        `${e.ponderadoAuditoria} ponderados (Colocar aparatos: ${e.ponderadoColocar}) · ` +
        `nota = solo automática: Auto/5 × ${red2(ponderadoPorTarjeta())} por tarjeta · ` +
        `⏰ > ${(typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.limiteTiempoMinutos) || 60} min → ` +
        `−${String((typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.penalizacionTiempo) || 0.25).replace('.', ',')}*\n`;
  return md;
}

// ------------------------------------------------------------
// Cierre de sesión: olvidar la sesión del panel
// ------------------------------------------------------------
function cerrarPanelSesion() {
  panelDesbloqueado = false;
  panelRegistros = [];
}
