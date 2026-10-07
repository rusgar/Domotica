/* ============================================================
   CONFIGURACIÓN GLOBAL
   ============================================================ */

const CREDENCIALES_PROFE = {
  usuario: 'profe',
  password: 'domotica2025'
};

const CONFIG = {
  duracionExamenSegundos: 5 * 60, // 5 minutos
};

// URL de la tarea de Moodle donde el alumno sube su JSON de auditoría.
// Déjala vacía ('') y el botón solo descargará el archivo con instrucciones.
const MOODLE = {
  urlTarea: ''
};

// Escalación de la auditoría:
// Un solo ejercicio (Ejercicio 6) con 2 tarjetas aleatorias de las 6 zonas.
// Cada tarjeta vale 5 puntos → 10 puntos en total.
// Ponderación sobre la nota final del examen:
//   Colocar aparatos = 1,5 · Auditoría = 2,5 (10 pts → 2,5).
const ESCALA_AUDITORIA = {
  ejerciciosAsignados: ['6'],
  puntosPorTarjeta: 5,
  puntosPorEjercicio: 10,   // 2 tarjetas × 5
  puntosTotales: 10,
  ponderadoColocar: 1.5,
  ponderadoAuditoria: 2.5
};

// Configuración del módulo de auditoría
const CONFIG_AUDITORIA = {
  precioKWh: 0.18,
  diasMes: 20,
  decimales: {
    energia: 2,      // kWh
    dinero: 2,       // €
    potencia: 2,     // W, kW
    porcentaje: 1,   // %
    minutos: 0,      // min
    dias: 0          // días
  },
  tolerancia: 0.02   // ±2% para redondeo
};