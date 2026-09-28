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