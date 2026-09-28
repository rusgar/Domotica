/* ============================================================
   DRAG & DROP DE APARATOS (con preguntas de desbloqueo)
   ============================================================ */

// Guard: initDropZones se llama en cada login; sin este flag los
// listeners se duplicarían y cada drop ejecutaría colocarAparato dos veces.
let dropZonesInicializadas = false;

function initDropZones() {
  if (dropZonesInicializadas) return;
  dropZonesInicializadas = true;
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      const zonaId = zone.dataset.zona;
      if (!state.zonasDesbloqueadas[zonaId]) return;
      zone.closest('.zona').classList.add('over');
    });
    zone.addEventListener('dragleave', () => {
      zone.closest('.zona').classList.remove('over');
    });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.closest('.zona').classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      const zonaId = zone.dataset.zona;

      if (!state.zonasDesbloqueadas[zonaId]) {
        alert('🔒 Esta zona está bloqueada. Responde primero la pregunta correctamente.');
        return;
      }
      colocarAparato(id, zonaId);
    });
  });
}

function crearChipColocado(id) {
  const ap = APARATOS.find(a => a.id === id);
  const chip = document.createElement('div');
  chip.className = 'colocado';
  chip.dataset.id = id;
  chip.innerHTML = `<span>${ap.emoji}</span> ${ap.nombre} ✕`;
  chip.title = 'Clic para devolver al banco';
  chip.addEventListener('click', () => devolverAlBanco(id));
  return chip;
}

function colocarAparato(id, zona) {
  if (state.examen.activo && state.examen.segundosRestantes <= 0) return;
  if (!state.zonasDesbloqueadas[zona]) return;

  const anterior = state.colocados[id];

  if (anterior) {
    const anteriorDiv = document.querySelector(`.drop-zone[data-zona="${anterior}"] .colocado[data-id="${id}"]`);
    if (anteriorDiv) anteriorDiv.remove();
    // Al sacarle un aparato, la zona de origen pierde su validación
    if (anterior !== zona) desVerificarZona(anterior);
  }

  state.colocados[id] = zona;

  const dropZone = document.querySelector(`.drop-zone[data-zona="${zona}"]`);
  if (!dropZone) return;

  dropZone.appendChild(crearChipColocado(id));

  // Si la zona de destino estaba validada y ahora tiene un intruso,
  // se des-valida en silencio. El aviso y el reinicio solo ocurren
  // cuando el alumno pulsa «✓ Validar» de la zona.
  if (state.zonasVerificadas[zona] && !zonaContenidoCorrecto(zona)) {
    desVerificarZona(zona);
  }

  actualizarUsados();
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
  document.getElementById('resultadoFinal').classList.remove('show');
}

function devolverAlBanco(id) {
  if (state.examen.activo && state.examen.segundosRestantes <= 0) return;

  const zona = state.colocados[id];
  if (!zona) return;
  const div = document.querySelector(`.drop-zone[data-zona="${zona}"] .colocado[data-id="${id}"]`);
  if (div) div.remove();
  delete state.colocados[id];

  // La zona pierde su validación al quitarle un aparato.
  // Solo se re-valida cuando el alumno vuelve a pulsar «✓ Validar».
  desVerificarZona(zona);

  actualizarUsados();
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

function actualizarUsados() {
  document.querySelectorAll('.aparato').forEach(div => {
    const id = div.dataset.id;
    if (state.colocados[id]) div.classList.add('usado');
    else div.classList.remove('usado');
  });
}

/* ============================================================
   PREGUNTAS DE DESBLOQUEO POR ZONA
   ============================================================ */

function abrirPregunta(zonaId) {
  if (state.zonasDesbloqueadas[zonaId]) {
    alert('✅ Esta zona ya está desbloqueada. Puedes colocar aparatos.');
    return;
  }

  const lista = PREGUNTAS[zonaId];
  if (!lista || lista.length === 0) {
    desbloquearZona(zonaId);
    return;
  }

  // Elegir al azar PERO nunca repetir la pregunta anterior de esta zona
  let indice = Math.floor(Math.random() * lista.length);
  const ultima = state.ultimaPregunta[zonaId];
  if (lista.length > 1 && ultima !== undefined && indice === ultima) {
    indice = (indice + 1 + Math.floor(Math.random() * (lista.length - 1))) % lista.length;
  }
  state.ultimaPregunta[zonaId] = indice;

  const pregunta = lista[indice];
  state.preguntaActual = { zonaId, pregunta };

  document.getElementById('preguntaZona').textContent =
    NOMBRES_ZONAS[zonaId] || zonaId;
  document.getElementById('preguntaTexto').textContent = pregunta.pregunta;

  const opcionesCont = document.getElementById('preguntaOpciones');
  opcionesCont.innerHTML = '';

  pregunta.opciones.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.textContent = op;
    btn.onclick = () => responderPregunta(i);
    opcionesCont.appendChild(btn);
  });

  document.getElementById('preguntaFeedback').className = 'feedback';
  document.getElementById('preguntaFeedback').textContent = '';
  document.getElementById('modalPregunta').classList.add('show');
}

function responderPregunta(indiceElegido) {
  if (!state.preguntaActual) return;
  const { zonaId, pregunta } = state.preguntaActual;
  const botones = document.querySelectorAll('#preguntaOpciones .opcion');

  botones.forEach((b, i) => {
    b.disabled = true;
    if (i === pregunta.correcta) b.classList.add('correcta');
    else if (i === indiceElegido) b.classList.add('incorrecta');
  });

  const feedback = document.getElementById('preguntaFeedback');
  feedback.classList.add('show');

  if (indiceElegido === pregunta.correcta) {
    feedback.className = 'feedback show ok';
    feedback.textContent = '✅ ¡Correcto! Zona desbloqueada.';
    desbloquearZona(zonaId);
    setTimeout(() => cerrarPregunta(), 1200);
  } else {
    feedback.className = 'feedback show mal';
    feedback.textContent = '❌ Respuesta incorrecta. Inténtalo de nuevo (se cargará otra pregunta).';
    setTimeout(() => {
      state.preguntaActual = null;
      abrirPregunta(zonaId);
    }, 1800);
  }
}

function desbloquearZona(zonaId, silencioso = false) {
  state.zonasDesbloqueadas[zonaId] = true;

  const zona = document.querySelector(`.zona[data-zona="${zonaId}"]`);
  if (zona) zona.classList.remove('bloqueada');

  const estado = document.getElementById('estado-' + zonaId);
  if (estado) {
    estado.className = 'zona-estado desbloqueada';
    estado.textContent = '🔓';
  }

  actualizarBotonValidar(zonaId);
  const btnPreg = zona?.querySelector('.btn-pregunta');
  if (btnPreg) {
    btnPreg.textContent = '✅ Desbloqueada';
    btnPreg.disabled = true;
    btnPreg.style.opacity = '0.6';
    btnPreg.style.cursor = 'default';
  }

  if (!silencioso) guardarProgreso();
}

function cerrarPregunta() {
  document.getElementById('modalPregunta').classList.remove('show');
  state.preguntaActual = null;
}

// Cerrar modal haciendo clic fuera
document.addEventListener('click', e => {
  const modal = document.getElementById('modalPregunta');
  if (e.target === modal) cerrarPregunta();
});