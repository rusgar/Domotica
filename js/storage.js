/* ============================================================
   PERSISTENCIA EN LOCALSTORAGE
   ============================================================ */

const STORAGE_KEY = () => `dashboard_progreso_${state.usuario || 'anon'}`;
const STORAGE_KEY_AUDITORIA = () => `dashboard_auditoria_${state.usuario || 'anon'}`;

// ============================================================
// MÓDULO COLOCAR APARATOS
// ============================================================
function guardarProgreso() {
  if (!state.usuario) return;
  const data = {
    colocados: state.colocados,
    segundos: state.cronometro.segundos,
    zonasDesbloqueadas: state.zonasDesbloqueadas,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY(), JSON.stringify(data));
  } catch (e) { /* ignorar */ }
}

function cargarProgreso() {
  if (!state.usuario) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY());
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function borrarProgreso() {
  if (!state.usuario) return;
  try { localStorage.removeItem(STORAGE_KEY()); } catch (e) {}
}

// ============================================================
// MÓDULO AUDITORÍA
// ============================================================
function guardarProgresoAuditoria() {
  if (!state.usuario) return;
  const a = state.auditoria;
  if (!a.ejercicio) return;

  const data = {
    ejercicio: a.ejercicio,
    tarjetasIds: a.tarjetas.map(t => t.id),
    variaciones: a.variaciones,
    fichas: a.fichas,
    segundos: state.cronometro.segundos,
    timestamp: Date.now()
  };
  try {
    localStorage.setItem(STORAGE_KEY_AUDITORIA(), JSON.stringify(data));
  } catch (e) { /* ignorar */ }
}

function cargarProgresoAuditoria() {
  if (!state.usuario) return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDITORIA());
    if (!raw) return false;
    const data = JSON.parse(raw);

    if (!data.ejercicio || !data.tarjetasIds) return false;

    // Restaurar solo si el ejercicio coincide con el actual
    const config = EJERCICIOS[data.ejercicio];
    if (!config) return false;

    // Reconstruir las tarjetas desde los IDs guardados
    const tarjetasRestauradas = [];
    const variacionesRestauradas = [];
    const fichasRestauradas = data.fichas || [];

    for (let i = 0; i < data.tarjetasIds.length; i++) {
      const id = data.tarjetasIds[i];
      const tarjeta = TARJETAS.find(t => t.id === id);
      if (!tarjeta) continue;
      tarjetasRestauradas.push(tarjeta);
      variacionesRestauradas.push(data.variaciones[i] || {});
    }

    if (tarjetasRestauradas.length === 0) return false;

    // Actualizar estado
    state.auditoria.ejercicio = data.ejercicio;
    state.auditoria.config = config;
    state.auditoria.tarjetas = tarjetasRestauradas;
    state.auditoria.variaciones = variacionesRestauradas;
    state.auditoria.fichas = fichasRestauradas;
    state.cronometro.segundos = data.segundos || 0;

    // Reconstruir las tarjetas en el DOM
    renderTarjetasAuditoria();
    actualizarProgresoGlobal();

    return true;
  } catch (e) {
    return false;
  }
}

function borrarProgresoAuditoria() {
  if (!state.usuario) return;
  try { localStorage.removeItem(STORAGE_KEY_AUDITORIA()); } catch (e) {}
}

// ============================================================
// BORRAR TODO
// ============================================================
function borrarTodoProgreso() {
  borrarProgreso();
  borrarProgresoAuditoria();
}