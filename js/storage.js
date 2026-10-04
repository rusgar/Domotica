/* ============================================================
   PERSISTENCIA EN LOCALSTORAGE
   ============================================================ */

const STORAGE_KEY = () => `dashboard_progreso_${state.usuario || 'anon'}`;
// Clave ANTERIOR (un solo ejercicio): se conserva solo para migrar progresos viejos
const STORAGE_KEY_AUDITORIA_LEGACY = () => `dashboard_auditoria_${state.usuario || 'anon'}`;
// Clave por ejercicio: cada ejercicio guarda su progreso por separado
const STORAGE_KEY_AUDITORIA = (ejercicio) =>
  `dashboard_auditoria_${state.usuario || 'anon'}_${ejercicio || state.auditoria?.ejercicio || 'x'}`;

// ============================================================
// MÓDULO COLOCAR APARATOS
// ============================================================
function guardarProgreso() {
  if (!state.usuario) return;
  const data = {
    colocados: state.colocados,
    segundos: state.cronometro.segundos,
    zonasDesbloqueadas: state.zonasDesbloqueadas,
    zonasVerificadas: state.zonasVerificadas,
    ultimaPregunta: state.ultimaPregunta,
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
    localStorage.setItem(STORAGE_KEY_AUDITORIA(a.ejercicio), JSON.stringify(data));
  } catch (e) { /* ignorar */ }
}

function leerAuditoria(clave) {
  try {
    const raw = localStorage.getItem(clave);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function cargarProgresoAuditoria() {
  if (!state.usuario) return false;
  try {
    const ejActual = state.auditoria.ejercicio;
    if (!ejActual) return false;

    let data = leerAuditoria(STORAGE_KEY_AUDITORIA(ejActual));

    // Migración: progreso guardado con la clave antigua (un solo ejercicio)
    if (!data) {
      const legacy = leerAuditoria(STORAGE_KEY_AUDITORIA_LEGACY());
      if (legacy && legacy.ejercicio === ejActual) {
        data = legacy;
        try {
          localStorage.setItem(STORAGE_KEY_AUDITORIA(ejActual), JSON.stringify(data));
          localStorage.removeItem(STORAGE_KEY_AUDITORIA_LEGACY());
        } catch (e) { /* ignorar */ }
      }
    }

    if (!data || data.ejercicio !== ejActual || !data.tarjetasIds) return false;

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

// Borra el progreso de un ejercicio (por defecto, el actual)
function borrarProgresoAuditoria(ejercicio) {
  if (!state.usuario) return;
  const ej = ejercicio || state.auditoria.ejercicio;
  if (ej) {
    try { localStorage.removeItem(STORAGE_KEY_AUDITORIA(ej)); } catch (e) { /* ignorar */ }
  }
  try { localStorage.removeItem(STORAGE_KEY_AUDITORIA_LEGACY()); } catch (e) { /* ignorar */ }
}

// Borra el progreso de TODOS los ejercicios (cierre de sesión)
function borrarTodoProgresoAuditoria() {
  if (!state.usuario) return;
  const ids = typeof EJERCICIOS !== 'undefined' ? Object.keys(EJERCICIOS) : [];
  ids.forEach(id => {
    try { localStorage.removeItem(STORAGE_KEY_AUDITORIA(id)); } catch (e) { /* ignorar */ }
  });
  try { localStorage.removeItem(STORAGE_KEY_AUDITORIA_LEGACY()); } catch (e) { /* ignorar */ }
}

// ============================================================
// BORRAR TODO
// ============================================================
function borrarTodoProgreso() {
  borrarProgreso();
  borrarTodoProgresoAuditoria();
}