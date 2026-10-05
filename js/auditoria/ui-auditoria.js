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
    `Ejercicio ${tipo === '6' ? '6' : 'Global'} · ${config.nombre}`;
  document.getElementById('auditoriaSubtitulo').textContent =
    `${config.numTarjetas} tarjetas · Presupuesto ${config.presupuesto} € · Precio kWh ${config.precioKWh} €`;

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

// Render de todas las tarjetas
function renderTarjetasAuditoria() {
  const cont = document.getElementById('tarjetasLista');
  cont.innerHTML = '';

  const { tarjetas, variaciones, fichas } = state.auditoria;
  if (!tarjetas || tarjetas.length === 0) {
    cont.innerHTML = '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
    return;
  }

  tarjetas.forEach((tarjeta, i) => {
    const card = renderTarjetaAuditoria(i, tarjeta, variaciones[i], fichas[i], i === 0);
    cont.appendChild(card);
  });
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

  // Prefill de la puntuación de este ejercicio (0-50)
  const campoNota = document.getElementById('informeNota');
  if (campoNota) {
    try {
      campoNota.value = localStorage.getItem(`dashboard_nota_alumno_${state.auditoria.ejercicio}`) || '';
    } catch (e) { campoNota.value = ''; }
  }
}

function cerrarModalInforme() {
  document.getElementById('modalInforme').classList.remove('show');
}