/* ============================================================
   ESTADO GLOBAL DE LA APLICACIÓN
   ============================================================ */

const state = {
  // Usuario actual: null | 'alumno' | 'profe'
  usuario: null,

  // Aparatos colocados: { idAparato: zonaId }
  colocados: {},

  // Zonas desbloqueadas tras responder bien la pregunta
  zonasDesbloqueadas: {},

  // Pregunta actual mostrada en el modal
  preguntaActual: null,

  // Cronómetro
  cronometro: {
    segundos: 0,
    intervalo: null,
    corriendo: false,
  },

  // Examen
  examen: {
    activo: false,
    segundosRestantes: CONFIG.duracionExamenSegundos,
    intervalo: null,
  },
};