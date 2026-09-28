/* ============================================================
   ESTADO GLOBAL DE LA APLICACIÓN
   ============================================================ */

const state = {
  // Usuario actual: null | 'alumno' | 'profe'
  usuario: null,

  // Aparatos colocados: { idAparato: zonaId }
  colocados: {},

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