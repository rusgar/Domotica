/* ============================================================
   MODO EXAMEN
   ============================================================ */

function toggleExamen() {
  if (state.usuario !== 'profe') return;

  if (state.examen.activo) {
    detenerExamen();
    alert('Modo examen desactivado.');
  } else {
    const minutos = CONFIG.duracionExamenSegundos / 60;
    if (!confirm(`¿Activar modo examen?\n\n· Se reiniciará todo el progreso\n· Duración: ${minutos} minutos\n· Se bloquean pistas, reset y auto-colocación`)) return;

    resetear();
    state.examen.activo = true;
    state.examen.segundosRestantes = CONFIG.duracionExamenSegundos;

    document.body.classList.add('examen-activo');
    document.getElementById('examenBanner').classList.add('show');
    document.getElementById('btnExamen').classList.add('activo');
    document.getElementById('btnExamen').textContent = '🛑 Detener examen';
    document.getElementById('btnReset').disabled = true;

    state.examen.intervalo = setInterval(() => {
      state.examen.segundosRestantes--;
      actualizarTimerUI();
      if (state.examen.segundosRestantes <= 0) {
        finalizarExamenPorTiempo();
      }
    }, 1000);

    actualizarTimerUI();
    actualizarBotonPista();
  }
}

function detenerExamen() {
  if (state.examen.intervalo) {
    clearInterval(state.examen.intervalo);
    state.examen.intervalo = null;
  }
  state.examen.activo = false;
  document.body.classList.remove('examen-activo');
  document.getElementById('examenBanner').classList.remove('show');
  document.getElementById('btnExamen').classList.remove('activo');
  document.getElementById('btnExamen').textContent = '🎓 Activar modo examen';
  document.getElementById('btnReset').disabled = false;
  actualizarTimerUI();
  actualizarBotonPista();
}

function finalizarExamenPorTiempo() {
  if (state.examen.intervalo) {
    clearInterval(state.examen.intervalo);
    state.examen.intervalo = null;
  }
  detenerCronometro();
  verificarTodo();

  const res = document.getElementById('resultadoFinal');
  res.className = 'resultado-final show mal';
  res.innerHTML = `
    <span class="icono-grande">⏰</span>
    ¡TIEMPO AGOTADO!
    <div class="detalle">
      Se acabó el tiempo del examen. Los resultados se han registrado.<br>
      Tiempo transcurrido: <strong>${formatearTiempo(state.cronometro.segundos)}</strong>
    </div>
  `;

  document.getElementById('btnReset').disabled = true;
  document.querySelectorAll('.aparato').forEach(a => a.draggable = false);
}