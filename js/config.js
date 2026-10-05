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
// 2 ejercicios asignados (Ejercicio 6 + Global), 5 puntos cada uno = 10 en total.
// Cada ejercicio reparte 2 tarjetas aleatorias → 2,5 puntos por tarjeta.
const ESCALA_AUDITORIA = {
  ejerciciosAsignados: ['6', 'global'],
  puntosPorEjercicio: 5,
  puntosPorTarjeta: 2.5,
  puntosTotales: 10
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