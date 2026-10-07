/* ============================================================
   VALIDACIÓN Y PISTAS
   Validación POR BOTÓN de cada zona (no automática, no aparato a aparato)
   ============================================================ */

function aparatosDeZona(zonaId) {
  // Solo los OBLIGATORIOS: los de relleno (opcional: true) no cuentan
  // ni para validar, ni para el marcador, ni para la victoria.
  return APARATOS.filter(a => a.zona === zonaId && !a.opcional);
}

function todosApDeZona(zonaId) {
  return APARATOS.filter(a => a.zona === zonaId);
}

function aparatosObligatorios() {
  return APARATOS.filter(a => !a.opcional);
}

// ¿Están colocados TODOS los aparatos de la zona (en cualquier parte)?
function zonaCompleta(zonaId) {
  const mis = aparatosDeZona(zonaId);
  return mis.length > 0 && mis.every(a => !!state.colocados[a.id]);
}

// Contenido correcto: todos los obligatorios de la zona dentro y sin
// intrusos de otras zonas (los aparatos de relleno se ignoran: no puntúan)
function zonaContenidoCorrecto(zonaId) {
  const dentroMalos = aparatosDeZona(zonaId).some(a => state.colocados[a.id] !== zonaId);
  const intrusos = APARATOS.some(a => a.zona !== zonaId && !a.opcional && state.colocados[a.id] === zonaId);
  return !dentroMalos && !intrusos;
}

// ============================================================
// PUNTUACIÓN DEL EJERCICIO · 8 zonas × 0,125 = 1,0
// Cada zona obligatoria vale lo mismo (0,125) y dentro de la zona
// cada aparato vale (1 / nº de aparatos de esa zona) de la zona.
// Ej.: Exterior = 7 aparatos → cada uno 0,125/7 = 0,0179; con 5
// bien colocados la zona vale 5/7 × 0,125 = 0,089.
// Los aparatos de relleno (opcional: true) NO puntúan.
// ============================================================
function zonasPuntuadas() {
  return Object.keys(NOMBRES_ZONAS).filter(z => aparatosDeZona(z).length > 0);
}

function puntuacionZona(zonaId) {
  const req = aparatosDeZona(zonaId);
  const ok = req.filter(a => state.colocados[a.id] === zonaId).length;
  return { ok, total: req.length, puntos: req.length ? ok / req.length : 0 };
}

// Total del ejercicio en escala 0-1 (sin la penalización de tiempo)
function puntuacionTotalColocar() {
  const zonas = zonasPuntuadas();
  if (!zonas.length) return 0;
  return zonas.reduce((s, z) => s + puntuacionZona(z).puntos, 0) / zonas.length;
}

// 0-1 → "0,089" (el alumno NO lo ve: solo el profesor)
function formatearPuntos(n) {
  return (Math.round(n * 1000) / 1000).toFixed(3).replace('.', ',');
}

// Marcador: aciertos vivos sobre el total de obligatorios + la nota del
// ejercicio. Solo lo ve el PROFESOR.
function actualizarScore() {
  const obligatorios = aparatosObligatorios();
  let aciertos = 0;
  obligatorios.forEach(a => { if (state.colocados[a.id] === a.zona) aciertos++; });

  const elScore = document.getElementById('score');
  const elTotal = document.getElementById('total');
  const elNota = document.getElementById('scoreNota');
  if (elScore) elScore.textContent = aciertos;
  if (elTotal) elTotal.textContent = obligatorios.length;
  if (elNota) elNota.textContent = ' · Nota: ' + formatearPuntos(puntuacionTotalColocar());

  const cont = document.querySelector('.toolbar .score');
  if (cont) cont.style.display = (state.usuario === 'profe' && aciertos > 0) ? '' : 'none';
}

// Zonas dadas por el alumno: perfectas (✅) o aceptadas con el pop-up (📌)
function zonasTerminadasIds() {
  return zonasPuntuadas().filter(z => state.zonasVerificadas[z] || state.zonasTerminadas[z]);
}

// (nombre histórico: para la pista cuenta cualquier zona dada por buena)
function zonasCompletas() {
  return zonasTerminadasIds();
}

function marcarZonaVerificada(zonaId) {
  state.zonasVerificadas[zonaId] = true;
  state.zonasTerminadas[zonaId] = true;

  const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
  if (zona) {
    zona.classList.add('correcta');
    zona.classList.remove('aceptada');
  }

  aparatosDeZona(zonaId).forEach(ap => {
    const chip = document.querySelector(`.drop-zone[data-zona="${zonaId}"] .colocado[data-id="${ap.id}"]`);
    if (chip) chip.classList.add('bien');
  });

  const estado = document.getElementById('estado-' + zonaId);
  if (estado) {
    estado.className = 'zona-estado desbloqueada';
    estado.textContent = '✅';
  }

  actualizarBotonValidar(zonaId);
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

// Zona dada por buena con el pop-up «¿Dejarlo así?»: puede estar
// incompleta o con algún aparato mal colocado; se puntúa lo que haya.
function marcarZonaAceptada(zonaId) {
  state.zonasTerminadas[zonaId] = true;

  const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
  if (zona) {
    zona.classList.add('aceptada');
    zona.classList.remove('correcta');
  }

  const estado = document.getElementById('estado-' + zonaId);
  if (estado) {
    estado.className = 'zona-estado aceptada';
    estado.textContent = '📌 Aceptada';
  }

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
  if (estado && state.zonasDesbloqueadas[zonaId]) {
    if (state.zonasTerminadas[zonaId]) {
      estado.className = 'zona-estado aceptada';
      estado.textContent = '📌 Aceptada';
    } else {
      estado.className = 'zona-estado desbloqueada';
      estado.textContent = '🔓';
    }
  }

  actualizarBotonValidar(zonaId);
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

/* ------------------------------------------------------------
   BOTÓN «✓ VALIDAR» DE CADA ZONA
   · Zona bloqueada / ya validada (✅) → botón deshabilitado
   · Zona dada por buena con el pop-up (📌) → se puede volver a validar
   · Zona perfecta → verde ✅ + ¿victoria?
   · Zona imperfecta → pop-up «¿Quieres dejarlo así o poner más?»
     (NO vacía nada y NO da pistas de qué falta)
   ------------------------------------------------------------ */
function actualizarBotonValidar(zonaId) {
  const btn = document.getElementById('btnValidar-' + zonaId);
  if (!btn) return;

  const desbloq = !!state.zonasDesbloqueadas[zonaId];
  const verif = !!state.zonasVerificadas[zonaId];
  const aceptada = !verif && !!state.zonasTerminadas[zonaId];

  btn.classList.toggle('validada', verif);
  btn.classList.toggle('aceptada', aceptada);
  btn.disabled = !desbloq || verif;
  btn.textContent = verif ? '✅ Validada' : (aceptada ? '📌 Aceptada' : '✓ Validar');

  if (!desbloq) btn.title = 'Zona bloqueada: responde la pregunta primero';
  else if (verif) btn.title = 'Zona validada correctamente';
  else if (aceptada) btn.title = 'Zona dada por buena: puedes seguir añadiendo aparatos o volver a validarla';
  else btn.title = 'Comprueba los aparatos de esta zona. Si algo falta o sobra, el pop-up te deja darla por buena o seguir poniendo.';
}

function actualizarBotonesValidar() {
  Object.keys(NOMBRES_ZONAS).forEach(actualizarBotonValidar);
}

function validarZona(zonaId) {
  if (state.examen.activo && state.examen.segundosRestantes <= 0) return;
  if (!state.zonasDesbloqueadas[zonaId]) return;
  if (state.zonasVerificadas[zonaId]) return;

  const mis = aparatosDeZona(zonaId);

  // Zona sin aparatos obligatorios: nada que comprobar
  if (mis.length === 0) {
    marcarZonaVerificada(zonaId);
    comprobarVictoria();
    return;
  }

  const p = puntuacionZona(zonaId);
  const perfecta = p.ok === p.total && zonaContenidoCorrecto(zonaId);

  // Todo correcto → verde al momento (sin pop-up)
  if (perfecta) {
    marcarZonaVerificada(zonaId);
    comprobarVictoria();
    return;
  }

  // Falta o sobra algo → el alumno decide: dejarla así o seguir poniendo.
  // NO se dicen cuáles faltan ni en qué zona va cada cosa.
  abrirModalDecision(zonaId);
}

/* ------------------------------------------------------------
   POP-UP «¿Quieres dejarlo así o poner más?»
   ------------------------------------------------------------ */
let zonaEnDecision = null;

function abrirModalDecision(zonaId) {
  zonaEnDecision = zonaId;
  const modal = document.getElementById('modalDecision');
  const titulo = document.getElementById('decisionZona');
  if (titulo) titulo.textContent = NOMBRES_ZONAS[zonaId] || 'Zona';
  if (modal) modal.classList.add('show');
}

function cerrarModalDecision() {
  const modal = document.getElementById('modalDecision');
  if (modal) modal.classList.remove('show');
  zonaEnDecision = null;
}

// «Dejarlo así» → la zona queda dada por buena (📌) y puntúa lo colocado
function dejarZonaAsi() {
  const zonaId = zonaEnDecision;
  cerrarModalDecision();
  if (!zonaId) return;
  marcarZonaAceptada(zonaId);
  comprobarVictoria();
}

// «Poner más» → se cierra el pop-up y el alumno sigue editando la zona
function ponerMas() {
  cerrarModalDecision();
}

// Cerrar el pop-up haciendo clic fuera (igual que el de preguntas)
document.addEventListener('click', e => {
  const modal = document.getElementById('modalDecision');
  if (modal && e.target === modal) cerrarModalDecision();
});

function comprobarVictoria() {
  const zonas = zonasPuntuadas();
  if (zonas.length === 0) return false;
  const todas = zonas.every(z => state.zonasVerificadas[z] || state.zonasTerminadas[z]);
  if (todas) mostrarVictoria();
  return todas;
}

function mostrarVictoria() {
  const zonas = zonasPuntuadas();
  const segEj = (typeof state.colocar === 'object' && state.colocar.segundos) || 0;
  const pen = (typeof penalizacionTiempoColocar === 'function') ? penalizacionTiempoColocar(segEj) : 0;
  const res = document.getElementById('resultadoFinal');
  res.className = 'resultado-final show ok';
  res.innerHTML = `
      <span class="icono-grande">🏁</span>
      EJERCICIO TERMINADO
      <div class="detalle">Has revisado las <strong>${zonas.length} zonas</strong> del ejercicio.<br>
      Tiempo del ejercicio: <strong>${formatearTiempo(segEj)}</strong> / 60 min${
        pen > 0 ? ` · <span style="color:#fca5a5">⏰ penalización −${String(pen).replace('.', ',')}</span>` : ''}<br>
      Sesión: <strong>${formatearTiempo(state.cronometro.segundos)}</strong></div>
      <div class="captura-instrucciones">
        📸 <strong>Siguiente paso:</strong> haz una <strong>captura de pantalla</strong> de toda la tabla
        de zonas <strong>con el reloj visible</strong>, <strong>súbela a la tarea de Moodle</strong> y
        descarga también el <strong>JSON</strong>.<br>
        La nota sale del <strong>JSON</strong> (cada zona vale <strong>0,125</strong> →
        <strong>8 zonas = 1,0</strong>, con <strong>−0,1</strong> si pasaste de 60 min).
      </div>
      <div class="victoria-acciones">
        <button class="btn-constancia" onclick="descargarConstanciaColocar()">📥 Descargar constancia (PNG)</button>
        <button class="btn-json" onclick="descargarJSONColocar()">📄 Descargar resultado (JSON)</button>
      </div>
    `;
  detenerCronometro();
  if (typeof detenerCronometroColocar === 'function') detenerCronometroColocar();
  state.colocar.completado = true;
  document.body.style.background = 'linear-gradient(135deg, #052e16 0%, #14532d 100%)';
  setTimeout(() => {
    document.body.style.background = state.examen.activo
      ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
      : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
  }, 2500);
}

// Al restaurar progreso: zonas completas y realmente correctas se marcan
// como verificadas (✅); las marcadas que ya no cuadran se des-verifican
// y vuelven a su estado de aceptadas (📌) si el alumno las dio por buenas.
// Nunca reinicia ni alerta (evita borrar el progreso al iniciar sesión).
function reconciliarZonasVerificadas() {
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => {
    if (aparatosDeZona(zonaId).length === 0) return;

    if (!zonaCompleta(zonaId) || !zonaContenidoCorrecto(zonaId)) {
      desVerificarZona(zonaId);
      return;
    }

    state.zonasVerificadas[zonaId] = true;
    state.zonasTerminadas[zonaId] = true;
    const zonaDiv = document.querySelector(`.zona[data-zona="${zonaId}"]`);
    if (zonaDiv) {
      zonaDiv.classList.add('correcta');
      zonaDiv.classList.remove('aceptada');
    }
    aparatosDeZona(zonaId).forEach(ap => {
      const chip = document.querySelector(`.drop-zone[data-zona="${zonaId}"] .colocado[data-id="${ap.id}"]`);
      if (chip) chip.classList.add('bien');
    });
    const estado = document.getElementById('estado-' + zonaId);
    if (estado) {
      estado.className = 'zona-estado desbloqueada';
      estado.textContent = '✅';
    }
  });

  // Zonas dadas por buena (📌) pero no perfectas: repintar su estado
  zonasPuntuadas().forEach(zonaId => {
    if (state.zonasVerificadas[zonaId] || !state.zonasTerminadas[zonaId]) return;
    const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
    if (zona) {
      zona.classList.add('aceptada');
      zona.classList.remove('correcta');
    }
    const estado = document.getElementById('estado-' + zonaId);
    if (estado) {
      estado.className = 'zona-estado aceptada';
      estado.textContent = '📌 Aceptada';
    }
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
    btn.textContent = `💡 Pista (${n} zona${n > 1 ? 's' : ''} ✓)`;
  } else {
    btn.disabled = true;
    btn.title = 'Dá por buena al menos una zona (✅ o 📌) para desbloquear la pista';
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
    alert('🔒 La pista se desbloquea cuando des por buena al menos una zona (✅ o 📌).');
    return;
  }

  const noColocados = aparatosObligatorios().filter(a => !state.colocados[a.id]);
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
    `(Zonas dadas por buena: ${completas.join(', ')})`
  );
}

function verificarTodo() {
  const obligatorios = aparatosObligatorios();
  const total = obligatorios.length;
  let aciertos = 0;
  let faltan = 0;

  document.querySelectorAll('.colocado').forEach(c => c.classList.remove('bien', 'mal'));
  document.querySelectorAll('.zona').forEach(z => z.classList.remove('correcta'));

  obligatorios.forEach(ap => {
    const zona = state.colocados[ap.id];
    if (!zona) { faltan++; return; }
    const chip = document.querySelector(`.drop-zone[data-zona="${zona}"] .colocado[data-id="${ap.id}"]`);
    if (!chip) return;
    if (ap.zona === zona) {
      chip.classList.add('bien');
      aciertos++;
    } else {
      chip.classList.add('mal');
    }
  });

  document.querySelectorAll('.zona').forEach(zona => {
    const zonaId = zona.dataset.zona;
    const aparatosZona = aparatosDeZona(zonaId);
    if (aparatosZona.length === 0) return;
    const todosBien = aparatosZona.every(a => state.colocados[a.id] === zonaId);
    if (todosBien) zona.classList.add('correcta');
  });

  // Sincronizar el estado de validación con lo pintado (cierre de examen)
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => {
    const zonaDiv = document.querySelector(`.zona[data-zona="${zonaId}"]`);
    const estado = document.getElementById('estado-' + zonaId);
    if (aparatosDeZona(zonaId).length === 0) return;
    if (zonaCompleta(zonaId) && zonaContenidoCorrecto(zonaId)) {
      state.zonasVerificadas[zonaId] = true;
      state.zonasTerminadas[zonaId] = true;
      if (zonaDiv) {
        zonaDiv.classList.add('correcta');
        zonaDiv.classList.remove('aceptada');
      }
      if (estado) {
        estado.className = 'zona-estado desbloqueada';
        estado.textContent = '✅';
      }
    } else {
      delete state.zonasVerificadas[zonaId];
      if (zonaDiv) zonaDiv.classList.remove('correcta');
      if (estado) {
        if (state.zonasTerminadas[zonaId]) {
          estado.className = 'zona-estado aceptada';
          estado.textContent = '📌 Aceptada';
          if (zonaDiv) zonaDiv.classList.add('aceptada');
        } else if (state.zonasDesbloqueadas[zonaId]) {
          estado.className = 'zona-estado desbloqueada';
          estado.textContent = '🔓';
        }
      }
    }
  });
  actualizarBotonesValidar();
  actualizarScore();

  const res = document.getElementById('resultadoFinal');
  res.classList.add('show');

  // Terminado: todas las zonas dadas por buena (✅ perfectas o 📌 aceptadas)
  if (!comprobarVictoria()) {
    const terminadas = zonasTerminadasIds().length;
    const esProfe = state.usuario === 'profe';
    res.className = 'resultado-final show mal';
    // El alumno no ve la nota: solo cuántas zonas ha dado por buena.
    res.innerHTML = `
      <span class="icono-grande">⚠️</span>
      Ejercicio sin terminar
      <div class="detalle">
        ${esProfe ? `Aciertos: <strong>${aciertos}</strong> / ${total} · ` : ''}
        Zonas dadas por buena: <strong>${terminadas} / ${zonasPuntuadas().length}</strong><br>
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
  state.zonasTerminadas = {};
  state.colocar.completado = false;
  // state.ultimaPregunta se conserva a propósito:
  // las próximas preguntas serán distintas a las anteriores.

  document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
  document.querySelectorAll('.zona').forEach(z => {
    z.classList.add('bloqueada');
    z.classList.remove('correcta', 'aceptada', 'over');
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