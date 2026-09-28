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

  // Restaurar módulo activo
  const moduloGuardado = localStorage.getItem('dashboard_modulo_activo') || 'colocar';
  cambiarModulo(moduloGuardado);

  // Inicializar módulo colocar
  renderBanco();
  initDropZones();

  // Reset estado colocar
  state.colocados = {};
  state.zonasDesbloqueadas = {};
  state.zonasVerificadas = {};
  state.ultimaPregunta = {};
  state.cronometro.segundos = 0;

  // Restaurar progreso colocar
  const progreso = cargarProgreso();
  if (progreso) {
    state.colocados = progreso.colocados || {};
    state.zonasDesbloqueadas = progreso.zonasDesbloqueadas || {};
    state.zonasVerificadas = progreso.zonasVerificadas || {};
    state.ultimaPregunta = progreso.ultimaPregunta || {};
    state.cronometro.segundos = progreso.segundos || 0;

    Object.keys(state.zonasDesbloqueadas).forEach(zonaId => {
      if (state.zonasDesbloqueadas[zonaId]) desbloquearZona(zonaId, true);
    });

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

  // Re-pintar zonas verificadas guardadas (y cuadrar las que ya no lo están).
  // Va después de iniciarCronometro para que, si el ejercicio ya estaba
  // completado, la victoria detenga el tiempo.
  if (progreso) reconciliarZonasVerificadas();

  // Estado inicial de los botones «✓ Validar» de cada zona
  actualizarBotonesValidar();

  // Inicializar bloque de carpeta de resultados (si aplica)
  if (typeof inicializarBotonCarpeta === 'function') {
    inicializarBotonCarpeta();
  }
}

function cerrarSesion() {
  detenerCronometro();
  detenerExamen();
  borrarTodoProgreso();

  state.usuario = null;
  state.colocados = {};
  state.zonasDesbloqueadas = {};
  state.zonasVerificadas = {};
  state.ultimaPregunta = {};
  state.cronometro.segundos = 0;
  state.examen.activo = false;
  state.examen.segundosRestantes = CONFIG.duracionExamenSegundos;
  state.preguntaActual = null;
  actualizarBotonesValidar();
  state.auditoria = {
    ejercicio: null,
    config: null,
    tarjetas: [],
    variaciones: [],
    fichas: [],
    presupuesto: null
  };

  // Reset UI colocar
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

  // Reset UI auditoría
  const auditoriaInicio = document.getElementById('auditoriaInicio');
  const auditoriaTrabajo = document.getElementById('auditoriaTrabajo');
  if (auditoriaInicio) auditoriaInicio.style.display = 'block';
  if (auditoriaTrabajo) auditoriaTrabajo.style.display = 'none';
  const listaTarjetas = document.getElementById('tarjetasLista');
  if (listaTarjetas) {
    listaTarjetas.innerHTML = '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
  }

  // Reset modal informe
  document.getElementById('modalInforme').classList.remove('show');
  document.getElementById('informeNombre').value = '';
  document.getElementById('informeGrupo').value = '';
  document.getElementById('informeEmail').value = '';
  document.getElementById('informeError').classList.remove('show');

  // Reset login
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

  // Reset pestañas
  cambiarModulo('colocar');

  actualizarTimerUI();
}

// ============================================================
// CAMBIO DE MÓDULO (pestañas)
// ============================================================
function cambiarModulo(modulo) {
  state.moduloActivo = modulo;
  try { localStorage.setItem('dashboard_modulo_activo', modulo); } catch (e) {}

  // Actualizar pestañas
  document.querySelectorAll('.tab-modulo').forEach(t => t.classList.remove('active'));
  const tabActiva = document.getElementById(modulo === 'colocar' ? 'tabColocar' : 'tabAuditoria');
  if (tabActiva) tabActiva.classList.add('active');

  // Mostrar / ocultar módulos
  const mColocar = document.getElementById('moduloColocar');
  const mAuditoria = document.getElementById('moduloAuditoria');
  if (modulo === 'colocar') {
    mColocar.classList.remove('modulo-oculto');
    mColocar.classList.add('modulo-activo');
    mAuditoria.classList.remove('modulo-activo');
    mAuditoria.classList.add('modulo-oculto');
  } else {
    mAuditoria.classList.remove('modulo-oculto');
    mAuditoria.classList.add('modulo-activo');
    mColocar.classList.remove('modulo-activo');
    mColocar.classList.add('modulo-oculto');
  }
}