/* ============================================================
   RENDERIZADO DE LA INTERFAZ
   ============================================================ */

function renderBanco() {
  const cont = document.getElementById('bancoAparatos');
  cont.innerHTML = '';

  Object.entries(NOMBRES_ZONAS).forEach(([zonaId, label]) => {
    const lista = APARATOS.filter(a => a.zona === zonaId);
    if (lista.length === 0) return;

    const catDiv = document.createElement('div');
    catDiv.className = 'categoria';
    catDiv.textContent = label;
    cont.appendChild(catDiv);

    lista.forEach(ap => {
      const div = document.createElement('div');
      div.className = 'aparato';
      div.dataset.id = ap.id;
      div.draggable = true;
      div.innerHTML = `
        <div class="emoji">${ap.emoji}</div>
        <div>
          <div class="nombre">${ap.nombre}</div>
          <span class="tipo">${ap.tipo}</span>
        </div>
        <div class="precio">${ap.precio}€</div>
      `;
      div.addEventListener('dragstart', e => {
        if (state.examen.activo && state.examen.segundosRestantes <= 0) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('text/plain', ap.id);
        div.classList.add('dragging');
      });
      div.addEventListener('dragend', () => div.classList.remove('dragging'));
      cont.appendChild(div);
    });
  });

  actualizarUsados();
}
