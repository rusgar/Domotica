/* ============================================================
   RENDERIZADO DE LA INTERFAZ
   ============================================================ */

function renderBanco() {
  const cont = document.getElementById('bancoAparatos');
  cont.innerHTML = '';

  // MEZCLAR los aparatos para que no se sepa la zona por el orden
  const mezclados = [...APARATOS].sort(() => Math.random() - 0.5);

  // Agrupar por TIPO de aparato (no por zona):
  const grupos = {
    sensor:      { label: '📡 Sensores',                 items: [] },
    actuador:    { label: '⚙️ Actuadores',               items: [] },
    controlador: { label: '🎛️ Controladores y sistemas', items: [] },
    gateway:     { label: '🔀 Gateways y comunicación',  items: [] },
    otro:        { label: '🔧 Otros',                    items: [] },
  };

  mezclados.forEach(ap => {
    const t = (ap.tipo || '').toLowerCase();
    if (t.includes('sensor') || t.includes('medida') || t.includes('calidad') ||
        t.includes('caudal') || t.includes('presión') || t.includes('volumen') ||
        t.includes('temperatura') || t.includes('humedad') || t.includes('luz') ||
        t.includes('radiación') || t.includes('viento') || t.includes('lluvia') ||
        t.includes('partículas') || t.includes('co₂') || t.includes('co2') ||
        t.includes('luminosidad') || t.includes('ocupación') || t.includes('superficie') ||
        t.includes('contacto') || t.includes('doméstica') || t.includes('precisión') ||
        t.includes('digital') || t.includes('temp') || t.includes('tª')) {
      grupos.sensor.items.push(ap);
    } else if (t.includes('actuador') || t.includes('enciende') ||
               t.includes('abre') || t.includes('sube')) {
      grupos.actuador.items.push(ap);
    } else if (t.includes('control') || t.includes('gestión') ||
               t.includes('domótica') || t.includes('climatización') ||
               t.includes('industrial')) {
      grupos.controlador.items.push(ap);
    } else if (t.includes('gateway') || t.includes('mensajería') ||
               t.includes('↔') || t.includes('iot')) {
      grupos.gateway.items.push(ap);
    } else {
      grupos.otro.items.push(ap);
    }
  });

  Object.values(grupos).forEach(grupo => {
    if (grupo.items.length === 0) return;

    const catDiv = document.createElement('div');
    catDiv.className = 'categoria';
    catDiv.textContent = `${grupo.label} (${grupo.items.length})`;
    cont.appendChild(catDiv);

    grupo.items.forEach(ap => {
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