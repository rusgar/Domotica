/* ============================================================
   ESTADO GLOBAL DE LA APLICACIÓN
   ============================================================ */

const state = {
  // Usuario actual: null | 'alumno' | 'profe'
  usuario: null,

  // Módulo activo: 'colocar' | 'auditoria'
  moduloActivo: 'colocar',

  // ============================================================
  // MÓDULO 1 · COLOCAR APARATOS
  // ============================================================
  colocados: {},
  zonasDesbloqueadas: {},
  zonasVerificadas: {},   // zona -> true cuando todos sus aparatos están bien y verificados
  ultimaPregunta: {},     // zonaId -> índice de la última pregunta mostrada (para no repetir)
  preguntaActual: null,

  // Cronómetro (compartido entre módulos)
  cronometro: {
    segundos: 0,
    intervalo: null,
    corriendo: false,
  },

  // Examen (aplica a ambos módulos)
  examen: {
    activo: false,
    segundosRestantes: CONFIG.duracionExamenSegundos,
    intervalo: null,
  },

  // ============================================================
  // MÓDULO 2 · AUDITORÍA
  // ============================================================
  auditoria: {
    ejercicio: null,       // '6'
    config: null,          // objeto de EJERCICIOS
    tarjetas: [],          // tarjetas repartidas
    variaciones: [],       // variación elegida por tarjeta
    fichas: [],            // respuestas del alumno por tarjeta
    presupuesto: null      // bloque de presupuesto
  },
};