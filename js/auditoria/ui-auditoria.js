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
  state.auditoria.segundos = 0;   // se restaura abajo si hay progreso guardado

  document.getElementById('auditoriaInicio').style.display = 'none';
  document.getElementById('auditoriaTrabajo').style.display = 'block';

  document.getElementById('auditoriaTitulo').textContent =
    `Ejercicio Auditoría · ${config.numTarjetas} zonas aleatorias`;

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
    renderCabeceraAuditoria();
  }

  // El tiempo del ejercicio corre desde que se entra (es el que penaliza)
  iniciarCronometroAuditoria();
}

// Repartir tarjetas aleatorias
function repartirTarjetas() {
  const config = state.auditoria.config;
  if (!config) return;

  if (!confirm(`Se van a repartir ${config.numTarjetas} tarjetas aleatorias (zonas distintas) de las ${TARJETAS.length}.\nSe borrará el progreso actual.\n¿Continuar?`)) {
    return;
  }

  const repartidas = repartirTarjetasAleatorias(config.numTarjetas);

  state.auditoria.tarjetas = repartidas.map(r => r.tarjeta);
  state.auditoria.variaciones = repartidas.map(r => r.variacion);
  state.auditoria.fichas = repartidas.map(() => crearFichaVacia());

  // Al repartir empieza a contar el tiempo del ejercicio (0 → 60 min sin penalización)
  state.auditoria.segundos = 0;
  iniciarCronometroAuditoria();

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
      <div class="ficha-fija-dato"><strong>Foco de análisis:</strong> ${tarjeta.focoAnalisis}</div>
      ${presupuestoFijaHTML(fichaFijaIndice)}`;
  }
}

// 💰 Presupuesto de la tarjeta activa (visible siempre en la barra fija)
function presupuestoFijaHTML(indice) {
  const config = state.auditoria.config || {};
  const fichas = state.auditoria.fichas || [];
  const tope = config.presupuestoPorTarjeta || 0;
  const ficha = fichas[indice];

  const costeBruto = ficha ? ficha.costeEstimado : '';
  const coste = parseFloat(costeBruto);
  const relleno = costeBruto !== '' && costeBruto !== null && costeBruto !== undefined && !isNaN(coste);
  const excede = relleno && coste > tope;
  const coherente = relleno && !excede && precioCoherenteCatalogo(coste, ficha ? ficha.materiales : null);

  const totalGastado = fichas.reduce((s, f) => s + (parseFloat(f.costeEstimado) || 0), 0);
  const topeTotal = tope * fichas.length;

  let estado;
  if (!relleno) estado = `<span style="color:#f87171;">❌ falta el precio (obligatorio · tope ${tope} €)</span>`;
  else if (excede) estado = `<span style="color:#f87171;">❌ te pasas ${formatearNumero(coste - tope, 0)} € del tope</span>`;
  else if (!coherente) estado = `<span style="color:#fbbf24;">⚠️ precio fuera del catálogo (±20 %)</span>`;
  else estado = `<span style="color:#4ade80;">✅ dentro del tope y coherente con el catálogo</span>`;

  return `<div class="ficha-fija-dato ficha-fija-presupuesto">
      <strong>💰 Presupuesto tarjeta:</strong>
      <strong>${relleno ? formatearNumero(coste, 2) : 0} / ${formatearNumero(tope, 0)} €</strong> · ${estado}
      · Total: <strong>${formatearNumero(totalGastado, 0)} / ${formatearNumero(topeTotal, 0)} €</strong>
    </div>`;
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

  renderCabeceraAuditoria();

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

// ============================================================
// CABECERA · progreso + presupuesto en vivo + tiempo del ejercicio
// ============================================================
function renderCabeceraAuditoria() {
  const el = document.getElementById('auditoriaSubtitulo');
  const { fichas, config } = state.auditoria;
  if (!el || !config || !fichas) return;

  const total = fichas.length;
  const validadas = fichas.filter(f => f.validado).length;
  const tope = config.presupuestoPorTarjeta || 0;
  const minutos = (typeof ESCALA_AUDITORIA !== 'undefined' && ESCALA_AUDITORIA.limiteTiempoMinutos) || 60;

  if (total === 0) {
    el.innerHTML =
      `Sin tarjetas repartidas · 💰 tope <strong>${formatearNumero(tope, 0)} €</strong> por tarjeta · ` +
      `⏱ Ejercicio <strong id="tiempoEjercicio">00:00</strong> / ${minutos} min`;
    actualizarTiempoEjercicioUI();
    return;
  }

  const topeTotal = tope * total;
  const gastado = fichas.reduce((s, f) => s + (parseFloat(f.costeEstimado) || 0), 0);

  el.innerHTML =
    `${validadas} / ${total} fichas validadas · ` +
    `💰 <strong>${formatearNumero(gastado, 0)} / ${formatearNumero(topeTotal, 0)} €</strong> ` +
    `(tope ${formatearNumero(tope, 0)} € por tarjeta) · ` +
    `⏱ Ejercicio <strong id="tiempoEjercicio">00:00</strong> / ${minutos} min`;

  actualizarTiempoEjercicioUI();
}

// ============================================================
// PRECIO DE LA ACTUACIÓN (apartado 8) · obligatorio y coherente
// ============================================================
function actualizarCosteTarjeta(indice, valor) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;

  ficha.costeEstimado = (valor === '' || valor === null) ? '' : parseFloat(valor);

  guardarProgresoAuditoria();
  pintarAvisoPresupuesto(indice);
  renderCabeceraAuditoria();
  if (typeof actualizarFichaFija === 'function') actualizarFichaFija(indice);
}

// ============================================================
// LISTA DE APARATOS (apartado 8) · desplegable del catálogo con cantidades
// ============================================================
function opcionesCatalogoHTML() {
  return catalogoAgrupado().map(g =>
    `<optgroup label="${g.nombre}">` +
    g.items.map(a =>
      `<option value="${a.id}">${a.emoji} ${a.nombre} — ${formatearNumero(a.precio, 0)} €</option>`
    ).join('') +
    `</optgroup>`
  ).join('');
}

function materialesListaHTML(indice) {
  const ficha = (state.auditoria.fichas || [])[indice];
  const mats = materialesDeFicha(ficha);
  if (!mats.length) {
    return '<div class="materiales-vacio">Aún no has añadido aparatos: elige uno del desplegable y pulsa «➕ Añadir».</div>';
  }

  return mats.map(m => {
    const ap = (typeof APARATOS !== 'undefined' && APARATOS) ? APARATOS.find(a => a.id === m.id) : null;
    if (!ap) return '';
    const cant = parseInt(m.cantidad, 10) || 0;
    const sub = (parseFloat(ap.precio) || 0) * cant;
    return `<div class="materiales-item">
      <span class="mat-emoji">${ap.emoji}</span>
      <span class="mat-nombre">${ap.nombre}</span>
      <span class="mat-cant">
        <button type="button" aria-label="Quitar uno" onclick="cambiarCantidadMaterial(${indice}, '${m.id}', -1)">−</button>
        <strong>${cant}</strong>
        <button type="button" aria-label="Añadir uno" onclick="cambiarCantidadMaterial(${indice}, '${m.id}', 1)">+</button>
      </span>
      <span class="mat-ud">${formatearNumero(ap.precio, 0)} €/ud</span>
      <span class="mat-sub">${formatearNumero(sub, 0)} €</span>
      <button type="button" class="mat-quitar" title="Eliminar de la lista" onclick="eliminarMaterial(${indice}, '${m.id}')">🗑</button>
    </div>`;
  }).join('');
}

function materialesTotalHTML(indice) {
  const ficha = (state.auditoria.fichas || [])[indice];
  const mats = materialesDeFicha(ficha);
  const suma = sumaMateriales(ficha);
  const tope = (state.auditoria.config && state.auditoria.config.presupuestoPorTarjeta) || 0;

  if (!mats.length) {
    return '<span>También puedes escribir el precio a mano en el campo de abajo.</span>';
  }
  const excede = suma > tope;
  return `Suma de la lista: <strong>${formatearNumero(suma, 0)} €</strong> / ${formatearNumero(tope, 0)} € ` +
    `<span class="${excede ? 'mat-excede' : ''}">${excede ? '· ❌ supera el tope de la tarjeta' : '· ✅ dentro del tope'}</span> ` +
    `— el precio de abajo se actualiza con esta suma.`;
}

function refrescarMateriales(indice) {
  const lista = document.getElementById(`materiales-lista-${indice}`);
  if (lista) lista.innerHTML = materialesListaHTML(indice);

  const total = document.getElementById(`materiales-total-${indice}`);
  if (total) total.innerHTML = materialesTotalHTML(indice);

  const ficha = (state.auditoria.fichas || [])[indice];
  const mats = materialesDeFicha(ficha);
  const valor = mats.length ? String(Math.round(sumaMateriales(ficha) * 100) / 100) : '';

  const input = document.getElementById(`precio-actuacion-${indice}`);
  if (input) input.value = valor;

  actualizarCosteTarjeta(indice, valor);
}

function anadirMaterial(indice) {
  const sel = document.getElementById(`sel-material-${indice}`);
  if (!sel || !sel.value) return;
  cambiarCantidadMaterial(indice, sel.value, 1);
}

function cambiarCantidadMaterial(indice, id, delta) {
  const ficha = (state.auditoria.fichas || [])[indice];
  if (!ficha) return;
  if (!Array.isArray(ficha.materiales)) ficha.materiales = [];

  const item = ficha.materiales.find(m => m.id === id);
  if (item) {
    item.cantidad = (parseInt(item.cantidad, 10) || 0) + delta;
    if (item.cantidad <= 0) ficha.materiales = ficha.materiales.filter(m => m.id !== id);
  } else if (delta > 0) {
    ficha.materiales.push({ id, cantidad: 1 });
  }

  refrescarMateriales(indice);
}

function eliminarMaterial(indice, id) {
  const ficha = (state.auditoria.fichas || [])[indice];
  if (!ficha || !Array.isArray(ficha.materiales)) return;
  ficha.materiales = ficha.materiales.filter(m => m.id !== id);
  refrescarMateriales(indice);
}

function avisoPresupuestoEstado(indice) {
  const ficha = state.auditoria.fichas[indice];
  const config = state.auditoria.config || {};
  const tope = config.presupuestoPorTarjeta || 0;
  const valor = ficha ? ficha.costeEstimado : '';
  const coste = parseFloat(valor);
  const relleno = valor !== '' && valor !== null && valor !== undefined && !isNaN(coste);
  const mats = materialesDeFicha(ficha);
  const suma = sumaMateriales(ficha);

  if (!relleno) {
    return {
      cls: 'mal',
      texto: mats.length
        ? `❌ Falta el precio: usa la suma de tu lista (${formatearNumero(suma, 0)} €) o escríbelo.`
        : '❌ El precio es obligatorio para poder entregar el ejercicio. Elige arriba los aparatos (se suma solo) o escribe el importe.'
    };
  }
  if (coste > tope) {
    return { cls: 'mal', texto: `❌ Te pasas ${formatearNumero(coste - tope, 0)} € del tope de ${tope} € de esta tarjeta.` };
  }

  // Con lista de aparatos: el precio debe cuadrar con la suma
  if (mats.length) {
    if (Math.abs(coste - suma) <= 1) {
      return {
        cls: 'ok',
        texto: `✅ ${formatearNumero(coste, 0)} € dentro del tope · cuadra con tu lista (${mats.length} aparato${mats.length === 1 ? '' : 's'}, ${formatearNumero(suma, 0)} €).`
      };
    }
    return {
      cls: 'aviso',
      texto: `⚠️ Tu precio (${formatearNumero(coste, 0)} €) no coincide con la suma de tu lista (${formatearNumero(suma, 0)} €). Si es un ajuste manual, justifícalo abajo.`
    };
  }

  // Sin lista: coherencia con un artículo del catálogo (±20 %)
  if (!precioCoherenteCatalogo(coste)) {
    const c = articuloCatalogoCercano(coste);
    return {
      cls: 'aviso',
      texto: c && c.articulo
        ? `⚠️ No se parece a ningún artículo del catálogo (±20 %). El más cercano es «${c.articulo.nombre}» a ${c.articulo.precio} €. Puedes escribir tu precio si lo justificas.`
        : '⚠️ No se parece a ningún artículo del catálogo (±20 %). Puedes escribir tu precio si lo justificas.'
    };
  }
  const c = articuloCatalogoCercano(coste);
  return {
    cls: 'ok',
    texto: `✅ ${formatearNumero(coste, 0)} € dentro del tope${c && c.articulo ? ` · coherente con «${c.articulo.nombre}» (${c.articulo.precio} €)` : ''}.`
  };
}

function pintarAvisoPresupuesto(indice) {
  const aviso = document.getElementById(`presupuesto-aviso-${indice}`);
  if (!aviso) return;
  const est = avisoPresupuestoEstado(indice);
  aviso.className = `presupuesto-aviso ${est.cls}`;
  aviso.textContent = est.texto;
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
  state.auditoria.segundos = 0;
  detenerCronometroAuditoria();

  document.getElementById('tarjetasLista').innerHTML =
    '<div class="tarjeta-vacia">Pulsa "🎲 Repartir tarjetas" para empezar</div>';
  ocultarFichaFija();

  borrarProgresoAuditoria();
  actualizarProgresoGlobal();
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