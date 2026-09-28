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