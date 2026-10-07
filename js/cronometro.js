/* ============================================================
   CRONÓMETRO
   ============================================================ */

function formatearTiempo(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, '0');
  const s = Math.floor(seg % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function iniciarCronometro() {
  detenerCronometro();
  state.cronometro.corriendo = true;
  state.cronometro.intervalo = setInterval(() => {
    state.cronometro.segundos++;
    actualizarTimerUI();
    guardarProgreso();
  }, 1000);
}

function detenerCronometro() {
  if (state.cronometro.intervalo) {
    clearInterval(state.cronometro.intervalo);
    state.cronometro.intervalo = null;
  }
  state.cronometro.corriendo = false;
}

function actualizarTimerUI() {
  const box = document.getElementById('timerBox');
  if (state.examen.activo) {
    box.textContent = '⏳ ' + formatearTiempo(state.examen.segundosRestantes);
    if (state.examen.segundosRestantes <= 30) box.classList.add('urgente');
    else box.classList.remove('urgente');
  } else {
    box.textContent = '⏱️ ' + formatearTiempo(state.cronometro.segundos);
    box.classList.remove('urgente');
  }
}

// ============================================================
// CRONÓMETRO DEL EJERCICIO DE AUDITORÍA
// Tiempo SOLO del Ejercicio Auditoría (no la sesión entera):
// es el que aplica la penalización por exceso de tiempo.
// ============================================================
function iniciarCronometroAuditoria() {
  detenerCronometroAuditoria();
  state.auditoria.corriendo = true;
  state.auditoria.intervalo = setInterval(() => {
    state.auditoria.segundos++;
    if (state.auditoria.segundos % 5 === 0) guardarProgresoAuditoria();
    actualizarTiempoEjercicioUI();
  }, 1000);
}

function detenerCronometroAuditoria() {
  if (state.auditoria.intervalo) {
    clearInterval(state.auditoria.intervalo);
    state.auditoria.intervalo = null;
  }
  state.auditoria.corriendo = false;
}

function limiteTiempoEjercicioSeg() {
  const min = (typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.limiteTiempoMinutos) || 60;
  return min * 60;
}

function penalizacionTiempoAplicada(segundos) {
  if (typeof segundos !== 'number' || segundos <= limiteTiempoEjercicioSeg()) return 0;
  return (typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.penalizacionTiempo) || 0.25;
}

function actualizarTiempoEjercicioUI() {
  const box = document.getElementById('tiempoEjercicio');
  if (!box) return;
  const seg = state.auditoria.segundos || 0;
  const pen = penalizacionTiempoAplicada(seg);
  box.textContent = pen > 0
    ? `⏰ ${formatearTiempo(seg)} (−${String(pen).replace('.', ',')})`
    : formatearTiempo(seg);
  box.classList.toggle('penalizado', pen > 0);
}

// ============================================================
// CRONÓMETRO DEL EJERCICIO DE COLOCAR APARATOS
// Tiempo SOLO del ejercicio (no la sesión): solo corre mientras el
// módulo Colocar está activo (se pausa al cambiar de pestaña) y es el
// que aplica la penalización (más de 60 min → −0,1 de los 1,0).
// ============================================================
function iniciarCronometroColocar() {
  if (state.colocar.corriendo) return;
  detenerCronometroColocar();
  state.colocar.corriendo = true;
  state.colocar.intervalo = setInterval(() => {
    state.colocar.segundos++;
    if (state.colocar.segundos % 5 === 0) guardarProgreso();
    actualizarTiempoColocarUI();
  }, 1000);
}

function detenerCronometroColocar() {
  if (state.colocar.intervalo) {
    clearInterval(state.colocar.intervalo);
    state.colocar.intervalo = null;
  }
  state.colocar.corriendo = false;
}

function limiteTiempoColocarSeg() {
  const min = (typeof ESCALA_COLOCAR !== 'undefined' && ESCALA_COLOCAR.limiteTiempoMinutos) || 60;
  return min * 60;
}

function penalizacionTiempoColocar(segundos) {
  if (typeof segundos !== 'number' || segundos <= limiteTiempoColocarSeg()) return 0;
  return (typeof ESCALA_COLOCAR !== 'undefined' && ESCALA_COLOCAR.penalizacionTiempo) || 0.1;
}

function actualizarTiempoColocarUI() {
  const box = document.getElementById('tiempoColocar');
  if (!box) return;
  const seg = state.colocar.segundos || 0;
  const pen = penalizacionTiempoColocar(seg);
  box.textContent = pen > 0
    ? `⏰ ${formatearTiempo(seg)} (−${String(pen).replace('.', ',')})`
    : formatearTiempo(seg);
  box.classList.toggle('penalizado', pen > 0);
}