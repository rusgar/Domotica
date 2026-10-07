/* ============================================================
   RENDERIZADO DE LA INTERFAZ
   ============================================================ */

function renderBanco() {
  const cont = document.getElementById('bancoAparatos');
  cont.innerHTML = '';

  // UNA sola lista, en orden ALFABÉTICO y SIN agrupar por tipo:
  // así no se regala dónde va cada aparato (los gateways no aparecen
  // aparte al final) y el banco es más difícil de recorrer.
  const ordenados = [...APARATOS].sort((a, b) =>
    String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es', { sensitivity: 'base' }));

  ordenados.forEach(ap => {
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

  actualizarUsados();
}
