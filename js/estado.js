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
  // Zonas que el alumno dio por buenas con el pop-up «¿Dejarlo así?»
  // (pueden estar incompletas o con algún aparato mal colocado)
  zonasTerminadas: {},
  ultimaPregunta: {},     // zonaId -> índice de la última pregunta mostrada (para no repetir)
  preguntaActual: null,

  // Tiempo SOLO del ejercicio de Colocar: corre solo con este módulo
  // activo (se pausa al cambiar de pestaña) y es el que aplica la
  // penalización (60 min → −0,1 sobre 1,0).
  colocar: {
    segundos: 0,
    intervalo: null,
    corriendo: false,
    completado: false
  },

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
    presupuesto: null,     // (residuo) presupuesto global en uso
    segundos: 0,           // tiempo SOLO del ejercicio (penalización > 60 min)
    intervalo: null,
    corriendo: false
  },
};