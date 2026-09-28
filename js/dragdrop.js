/* ============================================================
   DRAG & DROP DE APARATOS
   ============================================================ */

function initDropZones() {
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.closest('.zona').classList.add('over');
    });
    zone.addEventListener('dragleave', () => {
      zone.closest('.zona').classList.remove('over');
    });
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.closest('.zona').classList.remove('over');
      const id = e.dataTransfer.getData('text/plain');
      colocarAparato(id, zone.dataset.zona);
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

  // Quitar de zona anterior
  if (state.colocados[id]) {
    const anterior = state.colocados[id];
    const anteriorDiv = document.querySelector(`.drop-zone[data-zona="${anterior}"] .colocado[data-id="${id}"]`);
    if (anteriorDiv) anteriorDiv.remove();
  }

  state.colocados[id] = zona;
  const dropZone = document.querySelector(`.drop-zone[data-zona="${zona}"]`);
  if (!dropZone) return;

  dropZone.appendChild(crearChipColocado(id));

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