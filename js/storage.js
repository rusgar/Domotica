/* ============================================================
   PERSISTENCIA EN LOCALSTORAGE
   ============================================================ */

const STORAGE_KEY = () => `dashboard_progreso_${state.usuario || 'anon'}`;

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