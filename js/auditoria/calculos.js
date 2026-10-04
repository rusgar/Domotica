/* ============================================================
   CÁLCULOS Y VALIDADORES AUTOMÁTICOS
   ============================================================ */

// Redondeo con decimales configurables
function redondear(valor, decimales = 2) {
  if (valor === null || valor === undefined || isNaN(valor)) return 0;
  const factor = Math.pow(10, decimales);
  return Math.round(valor * factor) / factor;
}

// Formatear número con decimales
function formatearNumero(valor, decimales = 2) {
  if (valor === null || valor === undefined || isNaN(valor)) return '—';
  return Number(valor).toFixed(decimales);
}

// Validar un cálculo con tolerancia
// Devuelve { ok, correcto, alumno, diferencia, mensaje }
function validarCalculo(valorAlumno, valorCorrecto, tolerancia = 0.02, decimales = 2, unidad = '') {
  if (valorCorrecto === null || valorCorrecto === undefined) {
    return {
      ok: true,
      correcto: null,
      alumno: valorAlumno,
      diferencia: 0,
      mensaje: 'Este apartado no requiere cálculo automático.'
    };
  }

  if (valorAlumno === null || valorAlumno === undefined || isNaN(valorAlumno)) {
    return {
      ok: false,
      correcto: valorCorrecto,
      alumno: null,
      diferencia: null,
      mensaje: 'Introduce un valor numérico.'
    };
  }

  const diff = Math.abs(valorAlumno - valorCorrecto);
  const margen = Math.abs(valorCorrecto) * tolerancia;
  const dentro = diff <= margen || diff <= 0.01;

  return {
    ok: dentro,
    correcto: redondear(valorCorrecto, decimales),
    alumno: redondear(valorAlumno, decimales),
    diferencia: redondear(diff, decimales),
    mensaje: dentro
      ? `✅ Correcto (${formatearNumero(valorCorrecto, decimales)} ${unidad})`
      : `❌ Incorrecto. Se esperaba ≈ ${formatearNumero(valorCorrecto, decimales)} ${unidad}. Diferencia: ${formatearNumero(diff, decimales)} ${unidad}.`
  };
}

// Validar clasificación DOIH (Dato / Observación / Inferencia / Hipótesis)
function validarDOIH(frase, eleccionAlumno) {
  if (!frase || !frase.correcta) return { ok: true };
  return {
    ok: eleccionAlumno === frase.correcta,
    correcta: frase.correcta,
    alumno: eleccionAlumno
  };
}

// Validar checkboxes múltiples (para condiciones interiores y factores exteriores)
// correctas: array de claves correctas · seleccionadas: array de claves marcadas
function validarMultiSeleccion(correctas, seleccionadas) {
  const setCorr = new Set(correctas);
  const setSel = new Set(seleccionadas);

  const aciertos = [...setSel].filter(k => setCorr.has(k)).length;
  const fallos = [...setSel].filter(k => !setCorr.has(k)).length;
  const olvidos = [...setCorr].filter(k => !setSel.has(k)).length;

  const totalCorr = setCorr.size;
  const puntuacion = totalCorr === 0 ? 0 : Math.max(0, (aciertos - fallos) / totalCorr);

  return {
    aciertos,
    fallos,
    olvidos,
    totalCorr,
    puntuacion: redondear(puntuacion, 2),
    perfecto: aciertos === totalCorr && fallos === 0
  };
}

// Calcular puntuación de una ficha (0-100)
function calcularPuntuacionFicha(respuestas, tarjeta, variacion) {
  let total = 0;
  let obtenido = 0;

  // 1. Condiciones interiores (10 puntos)
  total += 10;
  if (respuestas.condicionesInteriores) {
    const r = validarMultiSeleccion(
      tarjeta.condicionesInterioresCorrectas || [],
      respuestas.condicionesInteriores
    );
    obtenido += r.puntuacion * 10;
  }

  // 2. Factores exteriores (10 puntos)
  total += 10;
  if (respuestas.factoresExteriores) {
    const r = validarMultiSeleccion(
      tarjeta.factoresExterioresCorrectos || [],
      respuestas.factoresExteriores
    );
    obtenido += r.puntuacion * 10;
  }

  // 3. Clasificación DOIH (20 puntos)
  total += 20;
  if (respuestas.doih && tarjeta.frasesDOIH) {
    let acertadas = 0;
    tarjeta.frasesDOIH.forEach((frase, i) => {
      if (respuestas.doih[i] === frase.correcta) acertadas++;
    });
    obtenido += (acertadas / tarjeta.frasesDOIH.length) * 20;
  }

  // 4. Cálculo (20 puntos)
  if (tarjeta.calculo && tarjeta.calculo.valor(variacion) !== null) {
    total += 20;
    const valorCorrecto = tarjeta.calculo.valor(variacion);
    const validacion = validarCalculo(
      respuestas.calculo,
      valorCorrecto,
      tarjeta.calculo.tolerancia,
      tarjeta.calculo.decimales,
      tarjeta.calculo.unidad
    );
    if (validacion.ok) obtenido += 20;
  }

  // 5. Campos abiertos (40 puntos → manual)
  // No se pueden validar automáticamente, quedan para corrección manual
  total += 40;

  const porcentaje = total === 0 ? 0 : (obtenido / total) * 100;
  // Parte auto-calificable (sin los 40 puntos manuales):
  // Gimnasio → 40 (no tiene cálculo) · Resto → 60
  const autoMax = total - 40;
  const porcentajeAuto = autoMax === 0 ? 0 : (obtenido / autoMax) * 100;

  return {
    obtenido: redondear(obtenido, 2),
    total,
    porcentaje: redondear(porcentaje, 1),
    autoMax,
    porcentajeAuto: redondear(porcentajeAuto, 1),
    aciertosAuto: redondear(obtenido, 2),
    pendienteManual: 40
  };
}

// Calcular puntuación global de un ejercicio (varias fichas)
function calcularPuntuacionEjercicio(fichas, tarjetas, variaciones) {
  let totalAuto = 0;
  let totalManualPendiente = 0;

  fichas.forEach((ficha, i) => {
    if (!tarjetas[i] || !variaciones[i]) return;
    const p = calcularPuntuacionFicha(ficha, tarjetas[i], variaciones[i]);
    totalAuto += p.aciertosAuto;
    totalManualPendiente += p.pendienteManual;
  });

  return {
    aciertosAuto: redondear(totalAuto, 2),
    pendienteManual: redondear(totalManualPendiente, 2),
    totalMaximo: redondear(totalAuto + totalManualPendiente, 2)
  };
}

// Formatear resultado para mostrar
function formatearResultado(validacion) {
  if (!validacion) return '';
  return validacion.mensaje;
}