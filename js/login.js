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

  // Restaurar progreso guardado
  const progreso = cargarProgreso();
  if (progreso && progreso.colocados) {
    state.colocados = progreso.colocados;
    state.cronometro.segundos = progreso.segundos || 0;
    Object.entries(state.colocados).forEach(([id, zona]) => {
      const ap = APARATOS.find(a => a.id === id);
      if (!ap) return;
      const dropZone = document.querySelector(`.drop-zone[data-zona="${zona}"]`);
      if (!dropZone) return;
      const chip = crearChipColocado(id);
      dropZone.appendChild(chip);
    });
    actualizarUsados();
  } else {
    state.cronometro.segundos = 0;
    state.colocados = {};
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
  state.cronometro.segundos = 0;
  state.examen.activo = false;
  state.examen.segundosRestantes = CONFIG.duracionExamenSegundos;

  document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
  document.querySelectorAll('.zona').forEach(z => z.classList.remove('correcta', 'over'));
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

  actualizarTimerUI();
}