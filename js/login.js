/* ============================================================
   LOGIN / SESIÓN
   ============================================================ */

function entrarComoAlumno() {
  state.usuario = 'alumno';
  iniciarDashboard();
}

function mostrarCamposProfe() {
  document.getElementById('profesorFields').classList.toggle('show');
  document.getElementById('userProfe').focus();
}

function entrarComoProfe() {
  const u = document.getElementById('userProfe').value.trim();
  const p = document.getElementById('passProfe').value;
  const err = document.getElementById('loginError');

  if (u === CREDENCIALES_PROFE.usuario && p === CREDENCIALES_PROFE.password) {
    state.usuario = 'profe';
    err.textContent = '';
    iniciarDashboard();
  } else {
    err.textContent = '❌ Usuario o contraseña incorrectos';
    document.getElementById('passProfe').value = '';
  }
}

function iniciarDashboard() {
  document.getElementById('loginOverlay').classList.add('hidden');

  const badge = document.getElementById('userBadge');
  if (state.usuario === 'profe') {
    badge.className = 'user-badge profe';
    badge.textContent = '👨‍🏫 Profesor';
    document.getElementById('btnAuto').style.display = 'inline-block';
    document.getElementById('btnExamen').style.display = 'inline-block';
  } else {
    badge.className = 'user-badge alumno';
    badge.textContent = '👤 Alumno';
    document.getElementById('btnAuto').style.display = 'none';
    document.getElementById('btnExamen').style.display = 'none';
  }

  renderBanco();
  initDropZones();

  // Reset estado
  state.colocados = {};
  state.zonasDesbloqueadas = {};
  state.cronometro.segundos = 0;

  // Restaurar progreso guardado
  const progreso = cargarProgreso();
  if (progreso) {
    state.colocados = progreso.colocados || {};
    state.zonasDesbloqueadas = progreso.zonasDesbloqueadas || {};
    state.cronometro.segundos = progreso.segundos || 0;

    // Repintar zonas desbloqueadas
    Object.keys(state.zonasDesbloqueadas).forEach(zonaId => {
      if (state.zonasDesbloqueadas[zonaId]) desbloquearZona(zonaId, true);
    });

    // Repintar chips colocados
    Object.entries(state.colocados).forEach(([id, zona]) => {
      const ap = APARATOS.find(a => a.id === id);
      if (!ap) return;
      const dropZone = document.querySelector(`.drop-zone[data-zona="${zona}"]`);
      if (!dropZone) return;
      dropZone.appendChild(crearChipColocado(id));
    });
    actualizarUsados();
  }

  actualizarTimerUI();
  actualizarScore();
  actualizarBotonPista();
  iniciarCronometro();
}

function cerrarSesion() {
  detenerCronometro();
  detenerExamen();
  borrarProgreso();

  state.usuario = null;
  state.colocados = {};
  state.zonasDesbloqueadas = {};
  state.cronometro.segundos = 0;
  state.examen.activo = false;
  state.examen.segundosRestantes = CONFIG.duracionExamenSegundos;
  state.preguntaActual = null;

  document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
  document.querySelectorAll('.zona').forEach(z => {
    z.classList.add('bloqueada');
    z.classList.remove('correcta', 'over');
  });
  document.querySelectorAll('.zona-estado').forEach(e => {
    e.className = 'zona-estado bloqueada';
    e.textContent = '🔒';
  });
  document.querySelectorAll('.btn-pregunta').forEach(b => {
    b.textContent = '❓ Responder';
    b.disabled = false;
    b.style.opacity = '1';
    b.style.cursor = 'pointer';
  });

  document.getElementById('resultadoFinal').classList.remove('show');
  document.getElementById('loginOverlay').classList.remove('hidden');
  document.getElementById('profesorFields').classList.remove('show');
  document.getElementById('userProfe').value = '';
  document.getElementById('passProfe').value = '';
  document.getElementById('loginError').textContent = '';
  document.getElementById('examenBanner').classList.remove('show');
  document.body.classList.remove('examen-activo');
  document.getElementById('btnExamen').classList.remove('activo');
  document.getElementById('btnExamen').textContent = '🎓 Activar modo examen';
  document.getElementById('modalPregunta').classList.remove('show');

  actualizarTimerUI();
}