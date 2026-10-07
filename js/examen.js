/* ============================================================
   MODO EXAMEN (aplica a ambos módulos)
   ============================================================ */

function toggleExamen() {
  if (state.usuario !== 'profe') return;

  if (state.examen.activo) {
    detenerExamen();
    alert('Modo examen desactivado.');
  } else {
    const minutos = CONFIG.duracionExamenSegundos / 60;
    if (!confirm(`¿Activar modo examen?\n\n· Se reiniciará todo el progreso\n· Duración: ${minutos} minutos\n· Se bloquean pistas, reset y auto-colocación\n· Aplica a ambos módulos (Colocar y Auditoría)`)) return;

    // Reset de ambos módulos
    resetear();
    resetearAuditoriaSilencioso();

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

  // Verificar módulo activo
  if (state.moduloActivo === 'colocar') {
    verificarTodo();
  } else {
    // En auditoría, solo mostrar aviso
    const cont = document.getElementById('tarjetasLista');
    if (cont) {
      const aviso = document.createElement('div');
      aviso.className = 'resultado-final show mal';
      aviso.innerHTML = `
        <span class="icono-grande">⏰</span>
        ¡TIEMPO AGOTADO!
        <div class="detalle">
          Se acabó el tiempo del examen. Entrega el informe cuando lo tengas listo.
        </div>
      `;
      cont.prepend(aviso);
    }
  }

  document.getElementById('btnReset').disabled = true;
  document.querySelectorAll('.aparato').forEach(a => a.draggable = false);
}

// Reset silencioso de auditoría (sin confirmación, para uso interno del examen)
function resetearAuditoriaSilencioso() {
  detenerCronometroAuditoria();
  state.auditoria = {
    ejercicio: null,
    config: null,
    tarjetas: [],
    variaciones: [],
    fichas: [],
    presupuesto: null,
    segundos: 0,
    intervalo: null,
    corriendo: false
  };
  borrarProgresoAuditoria();

  const inicio = document.getElementById('auditoriaInicio');
  const trabajo = document.getElementById('auditoriaTrabajo');
  if (inicio) inicio.style.display = 'block';
  if (trabajo) trabajo.style.display = 'none';

  const lista = document.getElementById('tarjetasLista');
  if (lista) {
    lista.innerHTML = '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
  }
}