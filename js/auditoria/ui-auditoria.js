/* ============================================================
   INTERFAZ DEL MÓDULO DE AUDITORÍA
   ============================================================ */

// Iniciar un ejercicio
function iniciarEjercicio(tipo) {
  const config = EJERCICIOS[tipo];
  if (!config) {
    alert('Ejercicio no disponible todavía.');
    return;
  }

  state.auditoria.ejercicio = tipo;
  state.auditoria.config = config;

  document.getElementById('auditoriaInicio').style.display = 'none';
  document.getElementById('auditoriaTrabajo').style.display = 'block';

  document.getElementById('auditoriaTitulo').textContent =
    `Ejercicio ${tipo} · ${config.nombre}`;
  document.getElementById('auditoriaSubtitulo').textContent =
    `${config.numTarjetas} tarjetas de 6 · Presupuesto ${config.presupuesto} € · Precio kWh ${config.precioKWh} €`;

  // Intentar restaurar progreso guardado
  const ok = cargarProgresoAuditoria();
  if (ok) {
    renderTarjetasAuditoria();
    actualizarProgresoGlobal();
  } else {
    document.getElementById('tarjetasLista').innerHTML =
      '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
    const btn = document.getElementById('btnConstanciaAuditoria');
    if (btn) btn.style.display = 'none';
    ocultarFichaFija();
  }
}

// Repartir tarjetas aleatorias
function repartirTarjetas() {
  const config = state.auditoria.config;
  if (!config) return;

  if (!confirm(`Se van a repartir ${config.numTarjetas} tarjetas aleatorias.\nSe borrará el progreso actual.\n¿Continuar?`)) {
    return;
  }

  const repartidas = repartirTarjetasAleatorias(config.numTarjetas);

  state.auditoria.tarjetas = repartidas.map(r => r.tarjeta);
  state.auditoria.variaciones = repartidas.map(r => r.variacion);
  state.auditoria.fichas = repartidas.map(() => crearFichaVacia());

  renderTarjetasAuditoria();
  actualizarProgresoGlobal();
  guardarProgresoAuditoria();
}

// ============================================================
// FICHA FIJA ARRIBA · Escenario / Datos / Foco de la tarjeta activa
// ============================================================

let fichaFijaIndice = 0;
let fichaFijaPlegada = false;

function actualizarFichaFija(indice) {
  const barra = document.getElementById('fichaFija');
  if (!barra) return;

  const tarjetas = state.auditoria.tarjetas || [];
  const variaciones = state.auditoria.variaciones || [];
  if (tarjetas.length === 0) { ocultarFichaFija(); return; }

  fichaFijaIndice = Math.max(0, Math.min(indice || 0, tarjetas.length - 1));

  const tarjeta = tarjetas[fichaFijaIndice];
  const variacion = variaciones[fichaFijaIndice] || {};

  barra.style.display = 'block';

  const nombre = document.getElementById('fichaFijaNombre');
  if (nombre) {
    nombre.textContent =
      `Tarjeta ${fichaFijaIndice + 1} · ${tarjeta.icono} ${tarjeta.nombre} (${fichaFijaIndice + 1}/${tarjetas.length})`;
  }

  const cuerpo = document.getElementById('fichaFijaCuerpo');
  if (cuerpo) {
    cuerpo.innerHTML = `
      <div class="ficha-fija-dato"><strong>Escenario:</strong> ${tarjeta.escenario(variacion)}</div>
      <div class="ficha-fija-dato"><strong>Datos para trabajar:</strong> ${tarjeta.datosTrabajo(variacion)}</div>
      <div class="ficha-fija-dato"><strong>Foco de análisis:</strong> ${tarjeta.focoAnalisis}</div>`;
  }
}

function ocultarFichaFija() {
  const barra = document.getElementById('fichaFija');
  if (barra) barra.style.display = 'none';
}

function toggleFichaFija() {
  fichaFijaPlegada = !fichaFijaPlegada;
  const cuerpo = document.getElementById('fichaFijaCuerpo');
  const btn = document.getElementById('fichaFijaBtn');
  if (cuerpo) cuerpo.style.display = fichaFijaPlegada ? 'none' : 'block';
  if (btn) btn.textContent = fichaFijaPlegada ? '▼' : '▲';
}

// Al tocar (clic o foco) una tarjeta pasa a ser la activa de la barra fija
function activarFichaFijaDesdeEvento(e) {
  const destino = e && e.target;
  if (!destino || typeof destino.closest !== 'function') return;
  const card = destino.closest('.tarjeta-auditoria[data-indice]');
  if (!card) return;
  const indice = Number(card.dataset.indice);
  if (!isNaN(indice)) actualizarFichaFija(indice);
}
document.addEventListener('click', activarFichaFijaDesdeEvento);
document.addEventListener('focusin', activarFichaFijaDesdeEvento);

// Render de todas las tarjetas
function renderTarjetasAuditoria() {
  const cont = document.getElementById('tarjetasLista');
  cont.innerHTML = '';

  const { tarjetas, variaciones, fichas } = state.auditoria;
  if (!tarjetas || tarjetas.length === 0) {
    cont.innerHTML = '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
    ocultarFichaFija();
    return;
  }

  tarjetas.forEach((tarjeta, i) => {
    const card = renderTarjetaAuditoria(i, tarjeta, variaciones[i], fichas[i], i === 0);
    cont.appendChild(card);
  });

  // La ficha de la tarjeta activa se queda fija arriba durante todo el examen
  actualizarFichaFija(fichaFijaIndice);
}

// Último número de fichas validadas visto (para detectar el paso a "todas")
let fichasValidadasAntes = -1;

// Actualizar progreso global
function actualizarProgresoGlobal() {
  const { fichas, config } = state.auditoria;
  const btn = document.getElementById('btnConstanciaAuditoria');

  if (!fichas || !config) {
    if (btn) btn.style.display = 'none';
    fichasValidadasAntes = -1;
    return;
  }

  const totalValidadas = fichas.filter(f => f.validado).length;
  const total = fichas.length;

  const el = document.getElementById('auditoriaSubtitulo');
  if (el && config) {
    el.textContent = `${totalValidadas} / ${total} fichas validadas · Presupuesto ${config.presupuesto} €`;
  }

  // La constancia aparece al terminar TODAS las fichas (una por ejercicio)
  const todoValidado = total > 0 && totalValidadas === total;
  if (btn) btn.style.display = todoValidado ? 'inline-block' : 'none';

  // Al validar la ÚLTIMA ficha → se abre el modal para descargar el JSON
  // y subirlo a Moodle. Solo en la transición (no al recargar la página).
  const transicion = fichasValidadasAntes >= 0 &&
    fichasValidadasAntes < total && totalValidadas === total;
  fichasValidadasAntes = totalValidadas;

  if (transicion) {
    setTimeout(() => {
      if (typeof mostrarModalInforme === 'function' &&
          !document.getElementById('modalInforme').classList.contains('show')) {
        mostrarModalInforme();
      }
    }, 800);
  }
}

// Reset del ejercicio
function resetearAuditoria() {
  if (state.examen.activo) {
    alert('🔒 No se puede reiniciar durante un examen.');
    return;
  }
  if (!confirm('¿Reiniciar el ejercicio? Se borrarán todas las respuestas.')) return;

  state.auditoria.tarjetas = [];
  state.auditoria.variaciones = [];
  state.auditoria.fichas = [];
  state.auditoria.presupuesto = null;

  document.getElementById('tarjetasLista').innerHTML =
    '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
  ocultarFichaFija();

  borrarProgresoAuditoria();
  actualizarProgresoGlobal();
}

// ============================================================
// PRESUPUESTO INTERACTIVO (al final del ejercicio)
// ============================================================

function renderPresupuesto() {
  const config = state.auditoria.config;
  const fichas = state.auditoria.fichas;
  if (!config || !fichas || fichas.length === 0) return;

  const cont = document.getElementById('tarjetasLista');

  const div = document.createElement('div');
  div.className = 'tarjeta-auditoria abierta';
  div.style.borderColor = '#fbbf24';

  const actuaciones = fichas
    .map((f, i) => ({
      indice: i,
      zona: state.auditoria.tarjetas[i]?.nombre || `Tarjeta ${i + 1}`,
      medida: f.medida1 || '(sin definir)',
      coste: parseFloat(f.costeEstimado) || 0,
      impacto: f.impacto || 'Medio',
      dificultad: f.dificultad || 'Media'
    }));

  const total = actuaciones.reduce((s, a) => s + a.coste, 0);
  const dentro = total <= config.presupuesto;
  const restante = config.presupuesto - total;

  div.innerHTML = `
    <div class="tarjeta-cabecera">
      <div class="tarjeta-titulo">
        <div class="tarjeta-icono">💰</div>
        <div>
          <div class="tarjeta-nombre">Presupuesto limitado</div>
          <div class="tarjeta-resumen">Elige UNA actuación prioritaria por zona · Máximo ${config.presupuesto} €</div>
        </div>
      </div>
    </div>
    <div class="tarjeta-cuerpo">
      ${fichas.map((f, i) => `
        <div class="ficha-bloque">
          <div class="ficha-titulo"><span class="num">${i + 1}</span> ${state.auditoria.tarjetas[i]?.nombre || 'Tarjeta ' + (i + 1)}</div>
          <div class="ficha-campo">
            <label>Coste estimado de la actuación prioritaria (€)</label>
            <input type="number" min="0" step="10" placeholder="Ej: 450" onchange="actualizarCosteEstimado(${i}, this.value)" value="${f.costeEstimado || ''}">
          </div>
          <div class="ficha-campo">
            <label>Justificación de la prioridad</label>
            <textarea placeholder="¿Por qué esta actuación y no otra?" onchange="actualizarCampo(${i}, 'justificacionPresupuesto', this.value)">${f.justificacionPresupuesto || ''}</textarea>
          </div>
        </div>
      `).join('')}

      <div class="calculo-box" style="margin-top:20px;">
        <div style="font-size:1rem;font-weight:700;color:${dentro ? '#4ade80' : '#f87171'};">
          Total: ${formatearNumero(total, 2)} € / ${config.presupuesto} €
        </div>
        <div style="font-size:0.85rem;color:#94a3b8;margin-top:6px;">
          ${dentro
            ? `✅ Dentro del presupuesto. Te quedan ${formatearNumero(restante, 2)} €.`
            : `❌ Te has pasado ${formatearNumero(Math.abs(restante), 2)} € del límite.`}
        </div>
      </div>
    </div>
  `;

  cont.appendChild(div);
}

function actualizarCosteEstimado(indice, valor) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  ficha.costeEstimado = valor === '' ? 0 : parseFloat(valor);
  guardarProgresoAuditoria();
  // Re-renderizar bloque de presupuesto
  const bloques = document.querySelectorAll('#tarjetasLista .tarjeta-auditoria');
  const ultimo = bloques[bloques.length - 1];
  if (ultimo && ultimo.textContent.includes('Presupuesto limitado')) {
    ultimo.remove();
    renderPresupuesto();
  }
}

// ============================================================
// MODAL DE INFORME
// ============================================================

function mostrarModalInforme() {
  if (!state.auditoria.tarjetas || state.auditoria.tarjetas.length === 0) {
    alert('Primero reparte las tarjetas y rellena las fichas.');
    return;
  }
  document.getElementById('modalInforme').classList.add('show');
  document.getElementById('informeError').classList.remove('show');

  // Prefill de iniciales (si ya se usaron en una constancia)
  const campoIni = document.getElementById('informeIniciales');
  if (campoIni && !campoIni.value.trim()) {
    campoIni.value = getIniciales();
  }
}

function cerrarModalInforme() {
  document.getElementById('modalInforme').classList.remove('show');
}