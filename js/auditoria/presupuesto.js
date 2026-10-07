/* ============================================================
   LÓGICA DEL PRESUPUESTO LIMITADO
   ============================================================ */

// Validar presupuesto
// - actuaciones: array de { zonaId, tarjetaId, descripcion, coste, impacto, dificultad, justificacion }
// - presupuestoMax: número máximo permitido
function validarPresupuesto(actuaciones, presupuestoMax) {
  const total = actuaciones.reduce((sum, a) => sum + (parseFloat(a.coste) || 0), 0);
  const dentro = total <= presupuestoMax;
  const restante = presupuestoMax - total;

  return {
    total: redondear(total, 2),
    presupuestoMax,
    restante: redondear(restante, 2),
    dentro,
    exceso: dentro ? 0 : redondear(Math.abs(restante), 2),
    mensaje: dentro
      ? `✅ Dentro del presupuesto. Te quedan ${formatearNumero(restante, 2)} €.`
      : `❌ Te has pasado ${formatearNumero(Math.abs(restante), 2)} € del presupuesto máximo.`
  };
}

// Calcular priorización automática
// Ordena las actuaciones por (impacto / coste) — mayor ratio = mejor prioridad
function calcularPriorizacion(actuaciones) {
  return [...actuaciones]
    .map(a => {
      const coste = parseFloat(a.coste) || 0;
      const impacto = parseFloat(a.impacto) || 1;
      const ratio = coste > 0 ? impacto / coste : impacto;
      return { ...a, ratio: redondear(ratio, 4) };
    })
    .sort((a, b) => b.ratio - a.ratio);
}

// Sugerir cuáles descartar cuando te pasas del presupuesto
// Descarta primero las de menor ratio impacto/coste
function sugerirDescartes(actuaciones, presupuestoMax) {
  const ordenadas = calcularPriorizacion(actuaciones);
  const seleccionadas = [];
  let acumulado = 0;

  for (const a of ordenadas) {
    const coste = parseFloat(a.coste) || 0;
    if (acumulado + coste <= presupuestoMax) {
      seleccionadas.push(a);
      acumulado += coste;
    }
  }

  const descartadas = ordenadas.filter(a => !seleccionadas.includes(a));

  return {
    seleccionadas,
    descartadas,
    totalSeleccionado: redondear(acumulado, 2),
    criterio: 'Ratio impacto/coste: se priorizan las actuaciones con mayor impacto por cada euro invertido.'
  };
}

// Estimar coste típico por tipo de actuación (valores didácticos)
const COSTES_TIPICOS = {
  iluminacion_sensores: { min: 80, max: 250, unidad: 'por zona' },
  iluminacion_led: { min: 150, max: 500, unidad: 'por zona' },
  persianas_automaticas: { min: 400, max: 1200, unidad: 'por ventana' },
  cierre_automatico_puerta: { min: 100, max: 400, unidad: 'por puerta' },
  sensor_co2: { min: 90, max: 300, unidad: 'por aula' },
  ventilacion_demanda: { min: 800, max: 2500, unidad: 'por sistema' },
  recuperador_calor: { min: 1500, max: 4000, unidad: 'por sistema' },
  programacion_apagado: { min: 0, max: 100, unidad: 'software' },
  regletas_inteligentes: { min: 40, max: 150, unidad: 'por puesto' },
  aislamiento_ventanas: { min: 300, max: 1500, unidad: 'por ventana' },
  doble_cristal: { min: 500, max: 2000, unidad: 'por ventana' },
  camara_termografica: { min: 300, max: 800, unidad: 'equipo' },
  valvulas_termostaticas: { min: 30, max: 100, unidad: 'por radiador' },
  sectorizacion_iluminacion: { min: 200, max: 800, unidad: 'por zona' },
  escenas_programables: { min: 150, max: 600, unidad: 'por sistema' },
  vestibulo_aire: { min: 800, max: 2500, unidad: 'por acceso' }
};

function obtenerCosteTipico(tipo) {
  return COSTES_TIPICOS[tipo] || { min: 0, max: 0, unidad: '' };
}

// ============================================================
// COHERENCIA CON EL CATÁLOGO DE APARATOS (js/datos.js)
// El precio que pone el alumno debe encajar con un artículo real
// del catálogo del módulo Colocar aparatos (±20 %).
// ============================================================
function articuloCatalogoCercano(precio) {
  const p = parseFloat(precio);
  if (!p || p <= 0) return null;
  if (typeof APARATOS === 'undefined' || !Array.isArray(APARATOS)) return null;

  let mejor = null;
  let mejorDif = Infinity;
  APARATOS.forEach(a => {
    const ref = parseFloat(a && a.precio);
    if (!ref || ref <= 0) return;
    const dif = Math.abs(p - ref);
    if (dif < mejorDif) { mejorDif = dif; mejor = a; }
  });
  return mejor ? { articulo: mejor, dif: mejorDif } : null;
}

function precioCoherenteCatalogo(precio, materiales) {
  const p = parseFloat(precio);
  if (!p || p <= 0) return false;

  // Con lista de aparatos: el precio debe cuadrar con la suma de la lista
  const mats = Array.isArray(materiales) ? materiales : null;
  if (mats && mats.length) {
    const suma = sumaMateriales({ materiales: mats });
    return suma > 0 && Math.abs(p - suma) <= 1;
  }

  // Sin lista: el importe debe encajar con un artículo del catálogo (±20 %)
  const c = articuloCatalogoCercano(precio);
  if (!c) return false;
  if (typeof APARATOS === 'undefined') return true;
  return c.dif <= c.articulo.precio * 0.2;   // ±20 %
}

// ============================================================
// LISTA DE APARATOS DEL APARTADO 8 (desplegable del catálogo)
// ============================================================
const ZONAS_CATALOGO = [
  ['exterior', 'Exterior'],
  ['envolvente', 'Envolvente'],
  ['interior', 'Interior'],
  ['electrico', 'Eléctrico'],
  ['hidraulico', 'Hidráulico'],
  ['termico', 'Térmico'],
  ['control', 'Control y actuadores'],
  ['gateway', 'Gateway / IoT']
];

// Catálogo APARATOS agrupado por tipo para el desplegable del apartado 8
function catalogoAgrupado() {
  if (typeof APARATOS === 'undefined' || !Array.isArray(APARATOS)) return [];

  const grupos = [];
  ZONAS_CATALOGO.forEach(([zona, nombre]) => {
    const items = APARATOS.filter(a => a.zona === zona);
    if (items.length) grupos.push({ zona, nombre, items });
  });
  // Zonas nuevas que puedan aparecer en el catálogo
  APARATOS.forEach(a => {
    if (grupos.some(g => g.zona === a.zona)) return;
    const items = APARATOS.filter(x => x.zona === a.zona);
    grupos.push({ zona: a.zona, nombre: String(a.zona || 'Otros'), items });
  });
  return grupos;
}

function materialesDeFicha(ficha) {
  return (ficha && Array.isArray(ficha.materiales)) ? ficha.materiales : [];
}

// Suma de la lista de aparatos de la tarjeta (precio catálogo × cantidad)
function sumaMateriales(ficha) {
  if (typeof APARATOS === 'undefined' || !Array.isArray(APARATOS)) return 0;
  return materialesDeFicha(ficha).reduce((s, m) => {
    const ap = APARATOS.find(a => a.id === m.id);
    if (!ap) return s;
    return s + (parseFloat(ap.precio) || 0) * (parseInt(m.cantidad, 10) || 0);
  }, 0);
}