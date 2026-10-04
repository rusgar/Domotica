/* ============================================================
   PANEL DE PROFESOR · Resultados de la clase
   · Se abre con 📊 Resultados (solo visible para el profe)
   · Pide la contraseña de CREDENCIALES_PROFE
   · Carga los JSON que entrega el alumno (Colocar + Auditoría)
   · Campo para los puntos manuales (0 a 40 por ficha)
   · Calcula la nota final = automática + manual
   ============================================================ */

const CLAVE_NOTAS_MANUALES = 'dashboard_notas_manuales';

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
  // 1) JSON de Colocar aparatos
  if (json && json.tipo === 'colocar') {
    const total = json.total || 0;
    const aciertos = typeof json.aciertos === 'number' ? json.aciertos : 0;
    return {
      modulo: 'Colocar',
      iniciales: (json.iniciales || '').toUpperCase(),
      nombre: '',
      fecha: json.fechaLegible || json.fecha || '',
      tiempo: json.tiempoLegible || '',
      auto: aciertos,
      autoMax: total,
      manualMax: 0,
      manualEditable: false
    };
  }

  // 2) Informe de Auditoría
  if (json && json.alumno && json.puntuacion) {
    const p = json.puntuacion;
    const autoMax = (p.totalMaximo || 0) - (p.pendienteManual || 0);
    return {
      modulo: 'Auditoría',
      iniciales: (json.alumno.iniciales || '').toUpperCase(),
      nombre: json.alumno.nombre || '',
      fecha: (json.meta && json.meta.fechaLegible) || '',
      tiempo: (json.meta && json.meta.duracionLegible) || '',
      auto: typeof p.aciertosAuto === 'number' ? p.aciertosAuto : 0,
      autoMax: autoMax,
      manualMax: p.pendienteManual || 0,
      manualEditable: (p.pendienteManual || 0) > 0
    };
  }

  return null;
}

function claveRegistro(reg, nombreFichero) {
  return `${reg.modulo}|${reg.iniciales}|${reg.fecha}|${nombreFichero}`;
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
        const existente = panelRegistros.find(r => r.key === key);
        if (existente) return;                       // ya cargado

        reg.key = key;
        reg.fichero = f.name;
        reg.manual = notaManualGuardada(key, reg);
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

function notaManualGuardada(key, reg) {
  let notas = {};
  try { notas = JSON.parse(localStorage.getItem(CLAVE_NOTAS_MANUALES) || '{}'); } catch (e) {}
  const guardada = notas[key];
  if (typeof guardada === 'number') {
    return Math.max(0, Math.min(reg.manualMax, guardada));
  }
  return '';
}

function guardarNotaManual(key, valor) {
  let notas = {};
  try { notas = JSON.parse(localStorage.getItem(CLAVE_NOTAS_MANUALES) || '{}'); } catch (e) {}
  if (valor === '' || valor === null) delete notas[key];
  else notas[key] = valor;
  try { localStorage.setItem(CLAVE_NOTAS_MANUALES, JSON.stringify(notas)); } catch (e) {}
}

function vaciarPanel() {
  if (panelRegistros.length && !confirm('¿Vaciar la tabla de resultados?')) return;
  panelRegistros = [];
  try { localStorage.removeItem(CLAVE_NOTAS_MANUALES); } catch (e) {}
  renderPanel();
}

// ------------------------------------------------------------
// Pintado de la tabla
// ------------------------------------------------------------
function notaFinalDe(reg) {
  const manual = (reg.manualEditable && typeof reg.manual === 'number') ? reg.manual : 0;
  return reg.auto + manual;
}

function renderPanel() {
  const cuerpo = document.getElementById('panelTablaBody');
  const vacio = document.getElementById('panelVacio');
  const resumen = document.getElementById('panelResumen');
  if (!cuerpo) return;

  cuerpo.innerHTML = '';
  const hayDatos = panelRegistros.length > 0;
  if (vacio) vacio.style.display = hayDatos ? 'none' : 'block';

  if (resumen) {
    if (!hayDatos) {
      resumen.textContent = 'Ningún resultado cargado';
    } else {
      const colocar = panelRegistros.filter(r => r.modulo === 'Colocar').length;
      const aud = panelRegistros.filter(r => r.modulo === 'Auditoría').length;
      resumen.textContent = `${panelRegistros.length} resultado(s) · Colocar: ${colocar} · Auditoría: ${aud}`;
    }
  }

  panelRegistros.forEach((reg, i) => {
    const manualMax = reg.manualMax;
    const final = notaFinalDe(reg);
    const totalMax = reg.autoMax + reg.manualMax;

    const celdaManual = reg.manualEditable
      ? `<input type="number" class="input-manual" min="0" max="${manualMax}" step="1"
           value="${typeof reg.manual === 'number' ? reg.manual : ''}"
           placeholder="0-${manualMax}"
           onchange="cambiarNotaManual(${i}, this.value)">`
      : '<span class="panel-na">—</span>';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${esc(reg.iniciales) || '—'}</strong></td>
      <td>${esc(reg.nombre) || '—'}</td>
      <td>${esc(reg.modulo)}</td>
      <td class="panel-pequena">${esc(reg.fecha)}</td>
      <td>${esc(reg.tiempo) || '—'}</td>
      <td>${reg.auto} / ${reg.autoMax}</td>
      <td>${reg.manualMax || '—'}</td>
      <td>${celdaManual}</td>
      <td class="panel-nota"><strong>${final} / ${totalMax}</strong></td>
    `;
    cuerpo.appendChild(tr);
  });
}

function cambiarNotaManual(indice, valor) {
  const reg = panelRegistros[indice];
  if (!reg || !reg.manualEditable) return;

  let nota = parseFloat(valor);
  if (isNaN(nota)) nota = '';
  else nota = Math.max(0, Math.min(reg.manualMax, nota));

  reg.manual = nota;
  guardarNotaManual(reg.key, nota);
  renderPanel();
}

// ------------------------------------------------------------
// Cierre de sesión: olvidar la sesión del panel
// ------------------------------------------------------------
function cerrarPanelSesion() {
  panelDesbloqueado = false;
  panelRegistros = [];
}
