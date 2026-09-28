/* ============================================================
   VALIDACIÓN Y PISTAS
   Validación POR BOTÓN de cada zona (no automática, no aparato a aparato)
   ============================================================ */

function aparatosDeZona(zonaId) {
  return APARATOS.filter(a => a.zona === zonaId);
}

// ¿Están colocados TODOS los aparatos de la zona (en cualquier parte)?
function zonaCompleta(zonaId) {
  const mis = aparatosDeZona(zonaId);
  return mis.length > 0 && mis.every(a => !!state.colocados[a.id]);
}

// Contenido correcto: todos los de la zona dentro y sin intrusos de otras zonas
function zonaContenidoCorrecto(zonaId) {
  const dentroMalos = aparatosDeZona(zonaId).some(a => state.colocados[a.id] !== zonaId);
  const intrusos = APARATOS.some(a => a.zona !== zonaId && state.colocados[a.id] === zonaId);
  return !dentroMalos && !intrusos;
}

// El marcador SOLO cuenta aparatos de zonas ya verificadas (nada de
// "una a una") y permanece OCULTO hasta verificar la primera zona.
function actualizarScore() {
  let aciertos = 0;
  Object.keys(state.zonasVerificadas).forEach(zonaId => {
    if (state.zonasVerificadas[zonaId]) aciertos += aparatosDeZona(zonaId).length;
  });
  document.getElementById('score').textContent = aciertos;
  document.getElementById('total').textContent = APARATOS.length;

  const cont = document.querySelector('.toolbar .score');
  if (cont) cont.style.display = aciertos > 0 ? '' : 'none';
}

function zonasCompletas() {
  return Object.keys(NOMBRES_ZONAS)
    .filter(zonaId => aparatosDeZona(zonaId).length > 0 && state.zonasVerificadas[zonaId]);
}

function marcarZonaVerificada(zonaId) {
  state.zonasVerificadas[zonaId] = true;

  const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
  if (zona) zona.classList.add('correcta');

  aparatosDeZona(zonaId).forEach(ap => {
    const chip = document.querySelector(`.drop-zone[data-zona="${zonaId}"] .colocado[data-id="${ap.id}"]`);
    if (chip) chip.classList.add('bien');
  });

  const estado = document.getElementById('estado-' + zonaId);
  if (estado) estado.textContent = '✅';

  actualizarBotonValidar(zonaId);
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

function desVerificarZona(zonaId) {
  if (!state.zonasVerificadas[zonaId]) return;
  delete state.zonasVerificadas[zonaId];

  const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
  if (zona) zona.classList.remove('correcta');

  aparatosDeZona(zonaId).forEach(ap => {
    const chip = document.querySelector(`.drop-zone[data-zona="${zonaId}"] .colocado[data-id="${ap.id}"]`);
    if (chip) chip.classList.remove('bien');
  });

  const estado = document.getElementById('estado-' + zonaId);
  if (estado && state.zonasDesbloqueadas[zonaId]) estado.textContent = '🔓';

  actualizarBotonValidar(zonaId);
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

/* ------------------------------------------------------------
   BOTÓN «✓ VALIDAR» DE CADA ZONA
   Solo el botón valida (sin verificación automática):
   · Zona bloqueada / ya validada → botón deshabilitado
   · Zona incompleta → aviso (NO reinicia)
   · Zona completa y correcta → verde ✅ + marcador + ¿victoria?
   · Zona completa con errores → detalle y REINICIO TOTAL
     (también en modo examen; el cronómetro sigue corriendo)
   ------------------------------------------------------------ */
function actualizarBotonValidar(zonaId) {
  const btn = document.getElementById('btnValidar-' + zonaId);
  if (!btn) return;

  const desbloq = !!state.zonasDesbloqueadas[zonaId];
  const verif = !!state.zonasVerificadas[zonaId];

  btn.classList.toggle('validada', verif);
  btn.disabled = !desbloq || verif;
  btn.textContent = verif ? '✅ Validada' : '✓ Validar';

  if (!desbloq) btn.title = 'Zona bloqueada: responde la pregunta primero';
  else if (verif) btn.title = 'Zona validada correctamente';
  else btn.title = 'Comprueba los aparatos de esta zona. Si hay errores, se reinicia todo el ejercicio.';
}

function actualizarBotonesValidar() {
  Object.keys(NOMBRES_ZONAS).forEach(actualizarBotonValidar);
}

function validarZona(zonaId) {
  if (state.examen.activo && state.examen.segundosRestantes <= 0) return;
  if (!state.zonasDesbloqueadas[zonaId]) return;
  if (state.zonasVerificadas[zonaId]) return;

  const mis = aparatosDeZona(zonaId);

  // Zona sin aparatos: nada que comprobar
  if (mis.length === 0) {
    marcarZonaVerificada(zonaId);
    comprobarVictoria();
    return;
  }

  // Aún faltan aparatos por colocar → aviso (solo cantidad), pero NO se reinicia
  const faltan = mis.filter(a => !state.colocados[a.id]);
  if (faltan.length > 0) {
    alert(
      `⚠️ Zona «${NOMBRES_ZONAS[zonaId]}» incompleta:\n\n` +
      `Faltan ${faltan.length} aparatos por colocar.\n\n` +
      `Colócalos todos y vuelve a pulsar «Validar».`
    );
    actualizarBotonValidar(zonaId);
    return;
  }

  if (zonaContenidoCorrecto(zonaId)) {
    marcarZonaVerificada(zonaId);
    comprobarVictoria();
    return;
  }

  const malos = mis.filter(a => state.colocados[a.id] !== zonaId);
  const intrusos = APARATOS.filter(a => a.zona !== zonaId && state.colocados[a.id] === zonaId);

  const lineas = [
    ...malos.map(a => `  • ${a.emoji} ${a.nombre} → debería estar en «${NOMBRES_ZONAS[a.zona]}»`),
    ...intrusos.map(a => `  • ${a.emoji} ${a.nombre} → no pertenece aquí (es de «${NOMBRES_ZONAS[a.zona]}»)`),
  ];

  alert(
    `❌ Zona «${NOMBRES_ZONAS[zonaId]}» con errores:\n\n` +
    `${lineas.join('\n')}\n\n` +
    `Se reinicia TODO el ejercicio: vuelve a empezar.\n` +
    `(Las preguntas de las zonas serán distintas a las anteriores.)`
  );

  reiniciarEjercicio(true);
}

function comprobarVictoria() {
  const conAparatos = Object.keys(NOMBRES_ZONAS).filter(z => aparatosDeZona(z).length > 0);
  if (conAparatos.length === 0) return false;
  const todas = conAparatos.every(z => state.zonasVerificadas[z]);
  if (todas) mostrarVictoria();
  return todas;
}

function mostrarVictoria() {
  const total = APARATOS.length;
  const res = document.getElementById('resultadoFinal');
  res.className = 'resultado-final show ok';
  res.innerHTML = `
      <span class="icono-grande">💡</span>
      ¡TODO CORRECTO!
      <div class="detalle">Has colocado los ${total} aparatos en su zona correcta.<br>
      Tiempo: <strong>${formatearTiempo(state.cronometro.segundos)}</strong></div>
    `;
  detenerCronometro();
  document.body.style.background = 'linear-gradient(135deg, #052e16 0%, #14532d 100%)';
  setTimeout(() => {
    document.body.style.background = state.examen.activo
      ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
  }, 2500);
}

// Al restaurar progreso: zonas completas y realmente correctas se marcan
// como verificadas; las marcadas que ya no cuadran se des-verifican.
// Nunca reinicia ni alerta (evita borrar el progreso al iniciar sesión).
function reconciliarZonasVerificadas() {
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => {
    if (aparatosDeZona(zonaId).length === 0) return;

    if (!zonaCompleta(zonaId)) {
      desVerificarZona(zonaId);
      return;
    }

    if (!zonaContenidoCorrecto(zonaId)) {
      desVerificarZona(zonaId);
      return;
    }

    state.zonasVerificadas[zonaId] = true;
    const zonaDiv = document.querySelector(`.zona[data-zona="${zonaId}"]`);
    if (zonaDiv) zonaDiv.classList.add('correcta');
    aparatosDeZona(zonaId).forEach(ap => {
      const chip = document.querySelector(`.drop-zone[data-zona="${zonaId}"] .colocado[data-id="${ap.id}"]`);
      if (chip) chip.classList.add('bien');
    });
    const estado = document.getElementById('estado-' + zonaId);
    if (estado) estado.textContent = '✅';
  });

  actualizarBotonesValidar();
  actualizarScore();
  comprobarVictoria();
}


function actualizarBotonPista() {
  const btn = document.getElementById('btnPista');

  if (state.examen.activo) {
    btn.disabled = true;
    btn.title = 'Pista bloqueada durante el examen';
    btn.textContent = '💡 Pista (examen)';
    return;
  }

  const completas = zonasCompletas();
  if (completas.length > 0) {
    btn.disabled = false;
    btn.title = 'Pista desbloqueada';
    const n = completas.length;
    btn.textContent = `💡 Pista (${n} zona${n > 1 ? 's' : ''} completa${n > 1 ? 's' : ''})`;
  } else {
    btn.disabled = true;
    btn.title = 'Completa al menos una zona entera para desbloquear la pista';
    btn.textContent = '💡 Pista (bloqueada)';
  }
}

function mostrarPista() {
  if (state.examen.activo) {
    alert('🔒 Las pistas están bloqueadas durante el examen.');
    return;
  }

  const completas = zonasCompletas();
  if (completas.length === 0) {
    alert('🔒 La pista se desbloquea cuando completes TODA una zona.');
    return;
  }

  const noColocados = APARATOS.filter(a => !state.colocados[a.id]);
  if (noColocados.length === 0) {
    alert('¡Ya has colocado todos los aparatos! Pulsa «✓ Validar» en cada zona.');
    return;
  }

  const candidatos = noColocados.filter(a => !completas.includes(a.zona));
  const lista = candidatos.length > 0 ? candidatos : noColocados;
  const ap = lista[Math.floor(Math.random() * lista.length)];

  alert(
    `💡 Pista desbloqueada\n\n` +
    `Aparato: ${ap.emoji} ${ap.nombre}\n\n` +
    `${PISTAS_ZONAS[ap.zona]}\n\n` +
    `(Zonas completas: ${completas.join(', ')})`
  );
}

function verificarTodo() {
  const total = APARATOS.length;
  let aciertos = 0;
  let faltan = 0;

  document.querySelectorAll('.colocado').forEach(c => c.classList.remove('bien', 'mal'));
  document.querySelectorAll('.zona').forEach(z => z.classList.remove('correcta'));

  Object.entries(state.colocados).forEach(([id, zona]) => {
    const ap = APARATOS.find(a => a.id === id);
    const chip = document.querySelector(`.drop-zone[data-zona="${zona}"] .colocado[data-id="${id}"]`);
    if (!chip) return;
    if (ap.zona === zona) {
      chip.classList.add('bien');
      aciertos++;
    } else {
      chip.classList.add('mal');
    }
  });

  APARATOS.forEach(ap => { if (!state.colocados[ap.id]) faltan++; });

  document.querySelectorAll('.zona').forEach(zona => {
    const zonaId = zona.dataset.zona;
    const aparatosZona = APARATOS.filter(a => a.zona === zonaId);
    if (aparatosZona.length === 0) return;
    const todosBien = aparatosZona.every(a => state.colocados[a.id] === zonaId);
    if (todosBien) zona.classList.add('correcta');
  });

  // Sincronizar el estado de validación con lo pintado (cierre de examen)
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => {
    if (aparatosDeZona(zonaId).length === 0) return;
    if (zonaCompleta(zonaId) && zonaContenidoCorrecto(zonaId)) state.zonasVerificadas[zonaId] = true;
    else delete state.zonasVerificadas[zonaId];
  });
  actualizarBotonesValidar();
  actualizarScore();

  const res = document.getElementById('resultadoFinal');
  res.classList.add('show');

  if (aciertos === total && faltan === 0) {
    mostrarVictoria();
  } else {
    res.className = 'resultado-final show mal';
    res.innerHTML = `
      <span class="icono-grande">⚠️</span>
      Aún hay errores
      <div class="detalle">
        Aciertos: <strong>${aciertos}</strong> / ${total} ·
        Sin colocar: <strong>${faltan}</strong><br>
        Los aparatos en <span style="color:#f87171">rojo</span> están mal colocados.
      </div>
    `;
  }
  actualizarBotonPista();
}

// Reinicio total del módulo colocar.
// forzar=true → se permite también con examen activo (error de zona).
// El cronómetro NO se toca: sigue corriendo.
function reiniciarEjercicio(forzar = false) {
  if (state.examen.activo && !forzar) {
    alert('🔒 No se puede reiniciar durante un examen.');
    return;
  }
  state.colocados = {};
  state.zonasDesbloqueadas = {};
  state.zonasVerificadas = {};
  // state.ultimaPregunta se conserva a propósito:
  // las próximas preguntas serán distintas a las anteriores.

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
  document.querySelectorAll('.colocado').forEach(c => c.classList.remove('bien', 'mal'));
  document.getElementById('resultadoFinal').classList.remove('show');

  actualizarBotonesValidar();
  actualizarUsados();
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

function resetear() {
  reiniciarEjercicio(false);
}

// AUTO-COLOCAR (solo profesor, bloqueado en examen)
function colocarTodo() {
  if (state.usuario !== 'profe') {
    alert('🔒 Esta función solo está disponible para el profesor.');
    return;
  }
  if (state.examen.activo) {
    alert('🔒 No puedes usar auto-colocar durante un examen.');
    return;
  }

  resetear();

  // Desbloquear todas las zonas sin preguntar
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => desbloquearZona(zonaId, true));

  // Colocar todos los aparatos
  APARATOS.forEach(ap => colocarAparato(ap.id, ap.zona));

  // Validar cada zona (todo correcto: sin alertas ni reinicios)
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => validarZona(zonaId));
}