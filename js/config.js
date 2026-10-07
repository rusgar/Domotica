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

// Escala del módulo Colocar aparatos:
// 10 puntos crudos → 1,0 sobre la nota final.
// Penalización por tiempo: mide SOLO el tiempo del ejercicio de Colocar
// (el reloj se pausa al cambiar de módulo). Más de 60 min → −0,1.
const ESCALA_COLOCAR = {
  puntos: 10,
  ponderado: 1.0,
  limiteTiempoMinutos: 60,
  penalizacionTiempo: 0.1
};

// Escalación de la auditoría:
// Un solo ejercicio (Ejercicio Auditoría) con 2 tarjetas aleatorias de las 10 zonas.
// Cada tarjeta vale 5 puntos → 10 puntos en total.
// Ponderación sobre la nota final del examen:
//   Colocar aparatos = 1,0 · Auditoría = 2,5 (10 pts → 2,5).
const ESCALA_AUDITORIA = {
  ejerciciosAsignados: ['6'],
  puntosPorTarjeta: 5,
  puntosPorEjercicio: 10,   // 2 tarjetas × 5
  puntosTotales: 10,
  ponderadoColocar: ESCALA_COLOCAR.ponderado,
  ponderadoAuditoria: 2.5,
  // Presupuesto: tope POR TARJETA (obligatorio rellenarlo en el apartado 8)
  presupuestoPorTarjeta: 750,
  // Penalización por tiempo: mide SOLO el tiempo del Ejercicio Auditoría
  // (no la sesión completa). Más de 60 min → 1 décima del total (0,25 de 2,5).
  limiteTiempoMinutos: 60,
  penalizacionTiempo: 0.25
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