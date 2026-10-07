/* ============================================================
   TARJETAS DE ZONA CON VARIACIONES ALEATORIAS
   Basadas en los ejercicios 6 y Global del curso ELEE017PO
   Cada tarjeta tiene varias variaciones de sus datos numéricos
   para que dos alumnos no reciban exactamente los mismos valores.
   ============================================================ */

const TARJETAS = [
  {
    id: 'aula',
    nombre: 'AULA',
    icono: '🏫',
    descripcion: 'Aula con 25 alumnos, ventanas al sur y calefacción',
    variaciones: [
      { alumnos: 25, horaInicio: '08:00', horaFin: '14:30', luminarias: 10, potenciaLuminaria: 40, ventanas: 2, orientacion: 'sur', horasApagar: 2, diasMes: 20 },
      { alumnos: 23, horaInicio: '08:00', horaFin: '14:00', luminarias: 8,  potenciaLuminaria: 40, ventanas: 2, orientacion: 'sur', horasApagar: 1.5, diasMes: 20 },
      { alumnos: 27, horaInicio: '08:30', horaFin: '15:00', luminarias: 12, potenciaLuminaria: 40, ventanas: 3, orientacion: 'sur', horasApagar: 2.5, diasMes: 20 },
      { alumnos: 24, horaInicio: '08:00', horaFin: '14:30', luminarias: 10, potenciaLuminaria: 36, ventanas: 2, orientacion: 'sureste', horasApagar: 2, diasMes: 22 }
    ],
    escenario: (v) => `${v.alumnos} alumnos; ${v.horaInicio}–${v.horaFin}; ${v.luminarias} LED de ${v.potenciaLuminaria} W; ${v.ventanas} ventanas grandes al ${v.orientacion}. En invierno la calefacción arranca a las 07:00. La puerta se abre con frecuencia. Algunos alumnos tienen frío y otros calor. Persianas bajadas gran parte de la mañana.`,
    datosTrabajo: (v) => `Iluminación: ${v.luminarias}×${v.potenciaLuminaria} W. Se podrían apagar ${v.horasApagar} h/día aprovechando luz natural.`,
    focoAnalisis: 'Iluminación, confort térmico, persianas, puerta y control de calefacción.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['temperatura', 'iluminacion'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext', 'radiacion_solar', 'viento'],
    frasesDOIH: [
      { texto: 'Hay 25 alumnos en el aula.', correcta: 'D' },
      { texto: 'La puerta se abre con frecuencia.', correcta: 'O' },
      { texto: 'Puede haber pérdidas térmicas por la puerta.', correcta: 'I' },
      { texto: 'La ventilación puede ser insuficiente con las ventanas cerradas.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia × Horas apagadas × Días = kWh/mes',
      enunciado: (v) => `Calcula el ahorro mensual si se apagan ${v.horasApagar} h/día las luminarias que permiten luz natural (${v.luminarias}×${v.potenciaLuminaria} W).`,
      valor: (v) => (v.luminarias * v.potenciaLuminaria / 1000) * v.horasApagar * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Sensores de presencia para apagado automático de luces',
      'Persianas automáticas con control solar',
      'Cierre automático de puerta con muelle o sensor'
    ],
    costeImpacto: 'Bajo · Impacto medio · Dificultad baja',
    fuenteSugerida: 'CTE DB-HE · RITE'
  },

  {
    id: 'pasillo',
    nombre: 'PASILLO',
    icono: '🚶',
    descripcion: 'Pasillo principal con tránsito alto y luces encendidas todo el día',
    variaciones: [
      { longitud: 35, luminarias: 18, potenciaLuminaria: 25, horasReducir: 3, diasMes: 20, transito: '08:00–09:00, 11:00–11:30 y 13:30–14:30' },
      { longitud: 30, luminarias: 16, potenciaLuminaria: 25, horasReducir: 2.5, diasMes: 20, transito: '08:00–09:00 y 13:30–14:30' },
      { longitud: 40, luminarias: 20, potenciaLuminaria: 22, horasReducir: 3.5, diasMes: 20, transito: '08:00–09:00, 11:00–11:30 y 13:30–14:30' }
    ],
    escenario: (v) => `Pasillo de ${v.longitud} m; ${v.luminarias} LED de ${v.potenciaLuminaria} W. Tránsito alto ${v.transito}. Todas las luces funcionan 07:30–15:30.`,
    datosTrabajo: (v) => `Potencia: ${v.luminarias}×${v.potenciaLuminaria} W = ${v.luminarias * v.potenciaLuminaria} W. Se plantea reducir ${v.horasReducir} h/día en periodos de tránsito muy bajo.`,
    focoAnalisis: 'Iluminación, presencia, temporización y sectorización.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['iluminacion'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['radiacion_solar'],
    frasesDOIH: [
      { texto: `El pasillo tiene ${18} luminarias LED.`, correcta: 'D' },
      { texto: 'El tránsito se concentra en tres franjas horarias.', correcta: 'O' },
      { texto: 'Fuera de esas franjas, la iluminación puede reducirse.', correcta: 'I' },
      { texto: 'Con sensores de presencia se ahorraría más del 50%.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia total × Horas × Días = kWh/mes',
      enunciado: (v) => `Calcula el ahorro mensual reduciendo ${v.horasReducir} h/día la iluminación del pasillo (${v.luminarias}×${v.potenciaLuminaria} W).`,
      valor: (v) => (v.luminarias * v.potenciaLuminaria / 1000) * v.horasReducir * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Sensores de presencia con temporización',
      'Sectorización de la iluminación del pasillo',
      'Aprovechamiento de luz natural con fotodiodos'
    ],
    costeImpacto: 'Bajo · Impacto alto · Dificultad baja',
    fuenteSugerida: 'CTE DB-HE · REBT'
  },

  {
    id: 'taller',
    nombre: 'TALLER',
    icono: '🔧',
    descripcion: 'Taller con portón exterior que se abre varias veces al día',
    variaciones: [
      { aperturasDia: 6, minutosApertura: 20, horasJornada: 8, tempExt: 7, tempInt: 19 },
      { aperturasDia: 8, minutosApertura: 15, horasJornada: 8, tempExt: 5, tempInt: 20 },
      { aperturasDia: 5, minutosApertura: 25, horasJornada: 8, tempExt: 8, tempInt: 18 }
    ],
    escenario: (v) => `Taller con gran portón exterior. En invierno se abre ${v.aperturasDia} veces al día durante ${v.minutosApertura} min en cambios de grupo. Temperatura exterior ${v.tempExt} °C, interior ${v.tempInt} °C. Hay calefacción y corriente de aire perceptible.`,
    datosTrabajo: (v) => `Apertura total: ${v.aperturasDia}×${v.minutosApertura} min = ${v.aperturasDia * v.minutosApertura} min/día.`,
    focoAnalisis: 'Infiltraciones, calefacción, organización y cierre.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['temperatura', 'velocidad_aire'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext', 'viento'],
    frasesDOIH: [
      { texto: 'El portón se abre 6 veces al día.', correcta: 'D' },
      { texto: 'Hay corriente de aire cerca del portón.', correcta: 'O' },
      { texto: 'Puede haber infiltraciones de aire frío.', correcta: 'I' },
      { texto: 'La calefacción no llega a compensar las pérdidas.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Aperturas × Minutos = Minutos totales / 60 = Horas',
      enunciado: (v) => `Calcula el porcentaje de jornada que el portón está abierto (${v.aperturasDia} aperturas × ${v.minutosApertura} min en una jornada de ${v.horasJornada} h).`,
      valor: (v) => ((v.aperturasDia * v.minutosApertura) / 60) / v.horasJornada * 100,
      unidad: '% jornada',
      decimales: 1,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Puertas rápidas o cortinas de aire',
      'Organización de cambios de grupo para minimizar aperturas',
      'Sensores de cierre automático'
    ],
    costeImpacto: 'Medio · Impacto alto · Dificultad media',
    fuenteSugerida: 'RITE · CTE DB-HE'
  },

  {
    id: 'despacho',
    nombre: 'DESPACHO',
    icono: '💼',
    descripcion: 'Despacho con ordenadores que quedan encendidos por la tarde',
    variaciones: [
      { personas: 3, puestos: 3, puestosApagar: 2, potenciaPuesto: 120, horasExtra: 4, diasMes: 20 },
      { personas: 2, puestos: 2, puestosApagar: 1, potenciaPuesto: 150, horasExtra: 5, diasMes: 20 },
      { personas: 4, puestos: 4, puestosApagar: 3, potenciaPuesto: 100, horasExtra: 4, diasMes: 22 }
    ],
    escenario: (v) => `${v.personas} personas; ${v.puestos} ordenadores y monitores. A las 18:00 termina la actividad, pero quedan encendidos hasta las 22:00. Un equipo sí necesita continuidad.`,
    datosTrabajo: (v) => `${v.puestosApagar} puestos pueden apagarse ${v.horasExtra} h. Cada puesto se estima en ${v.potenciaPuesto} W.`,
    focoAnalisis: 'Equipos eléctricos y gestión de apagado.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['temperatura'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext'],
    frasesDOIH: [
      { texto: 'Hay 3 ordenadores en el despacho.', correcta: 'D' },
      { texto: 'Los equipos quedan encendidos hasta las 22:00.', correcta: 'O' },
      { texto: 'Se podría programar el apagado de dos puestos.', correcta: 'I' },
      { texto: 'Un solo equipo justifica mantener el servidor encendido.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia × Puestos × Horas = kWh/día · × Días = kWh/mes',
      enunciado: (v) => `Calcula el consumo mensual evitando ${v.horasExtra} h/día de encendido en ${v.puestosApagar} puestos de ${v.potenciaPuesto} W durante ${v.diasMes} días.`,
      valor: (v) => (v.puestosApagar * v.potenciaPuesto / 1000) * v.horasExtra * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Programación de apagado automático',
      'Regletas inteligentes con horario',
      'Sensores de presencia con retardo'
    ],
    costeImpacto: 'Bajo · Impacto medio · Dificultad baja',
    fuenteSugerida: 'REBT · CTE DB-HE'
  },

  {
    id: 'biblioteca',
    nombre: 'BIBLIOTECA',
    icono: '📚',
    descripcion: 'Biblioteca con alta ocupación y ventilación a caudal fijo',
    variaciones: [
      { usuarios: 40, usuariosPunta: 45, horasPunta: '90 min', caudalFijo: 1.0, tempExt: 14, tempInt: 22, humedad: 55, co2: 1750 },
      { usuarios: 35, usuariosPunta: 40, horasPunta: '60 min', caudalFijo: 1.2, tempExt: 12, tempInt: 21, humedad: 50, co2: 1600 },
      { usuarios: 50, usuariosPunta: 55, horasPunta: '120 min', caudalFijo: 1.5, tempExt: 16, tempInt: 23, humedad: 60, co2: 1900 }
    ],
    escenario: (v) => `${v.usuarios} usuarios en hora punta. Ventanas cerradas y ventilación a caudal fijo. Tras ${v.horasPunta} varios describen el ambiente como cargado. No hay sensor de CO₂.`,
    datosTrabajo: (v) => `No inventar ppm. Hay ocupación alta + sensación de aire cargado + ventilación fija.`,
    focoAnalisis: 'Calidad de aire, ventilación, ocupación y necesidad de medir.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['calidad_aire', 'humedad'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext', 'humedad_ext'],
    frasesDOIH: [
      { texto: 'Hay 40 usuarios en la biblioteca.', correcta: 'D' },
      { texto: 'Varios usuarios describen el aire como cargado.', correcta: 'O' },
      { texto: 'La ventilación a caudal fijo puede ser insuficiente.', correcta: 'I' },
      { texto: 'El CO₂ supera las 1.200 ppm.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia ventilador × Horas × Días = kWh/mes',
      enunciado: (v) => `Calcula el consumo mensual del ventilador (${v.caudalFijo} kW) si se reduce 1 h/día durante 20 días, aunque primero hay que verificar la calidad del aire.`,
      valor: (v) => v.caudalFijo * 1 * 20,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Sensor de CO₂ para ventilación bajo demanda',
      'Data logging para registrar evolución de CO₂',
      'Ventilación con recuperador de calor'
    ],
    costeImpacto: 'Medio · Impacto alto · Dificultad media',
    fuenteSugerida: 'RITE · CTE DB-HS'
  },

  {
    id: 'gimnasio',
    nombre: 'GIMNASIO',
    icono: '🏋️',
    descripcion: 'Gimnasio con ocupación alta y condensación ocasional',
    variaciones: [
      { usuarios: 28, tempExt: 10, tempInt: 23, humedad: 70, co2: 1400, ventilacion: 'activa' },
      { usuarios: 25, tempExt: 8, tempInt: 22, humedad: 75, co2: 1300, ventilacion: 'activa' },
      { usuarios: 30, tempExt: 12, tempInt: 24, humedad: 68, co2: 1500, ventilacion: 'activa' }
    ],
    escenario: (v) => `${v.usuarios} usuarios. Exterior ${v.tempExt} °C. Interior ${v.tempInt} °C. Humedad ${v.humedad}%. CO₂ ${v.co2} ppm. Ventilación ${v.ventilacion}. Se observa condensación ocasional en una pared exterior. Movimiento de aire perceptible cerca de una rejilla.`,
    datosTrabajo: (v) => `No inventar temperatura superficial ni velocidad del aire: indicar qué sensores permitirían comprobarlas.`,
    focoAnalisis: 'Ventilación, humedad, puentes térmicos, confort y velocidad del aire.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['humedad', 'calidad_aire', 'velocidad_aire'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext', 'humedad_ext'],
    frasesDOIH: [
      { texto: 'Hay 28 usuarios en el gimnasio.', correcta: 'D' },
      { texto: 'Se observa condensación en una pared exterior.', correcta: 'O' },
      { texto: 'Puede existir un puente térmico en esa pared.', correcta: 'I' },
      { texto: 'La velocidad del aire supera 0,5 m/s.', correcta: 'H' }
    ],
    calculo: {
      formula: 'No hay ahorro fiable calculable sin más datos',
      enunciado: () => `No es posible calcular un ahorro fiable con los datos disponibles. Indica qué medirías (temperatura superficial, velocidad del aire, humedad) y con qué instrumento.`,
      valor: () => null,  // sin cálculo automático
      unidad: '',
      decimales: 0,
      tolerancia: 0
    },
    medidasSugeridas: [
      'Cámara termográfica para detectar puentes térmicos',
      'Sensores de temperatura superficial',
      'Anemómetro de hilo caliente para velocidad del aire'
    ],
    costeImpacto: 'Medio · Impacto medio · Dificultad media',
    fuenteSugerida: 'CTE DB-HE · RITE'
  },

];

/* ============================================================
   EJERCICIOS DISPONIBLES
   ============================================================ */
const EJERCICIOS = {
  6: {
    id: '6',
    nombre: 'Auditoría por zonas',
    descripcion: '2 zonas aleatorias de las 6 · Presupuesto 1.500 €',
    numTarjetas: 2,
    presupuesto: 1500,
    diasMes: 20,
    precioKWh: 0.18
  }
};

/* ============================================================
   ETIQUETAS DE CONDICIONES Y FACTORES
   ============================================================ */
const ETIQUETAS_CONDICIONES_INTERIORES = {
  temperatura: 'Temperatura interior',
  humedad: 'Humedad interior',
  calidad_aire: 'Calidad del aire (CO₂)',
  iluminacion: 'Iluminación',
  velocidad_aire: 'Velocidad del aire',
  ruido: 'Ruido'
};

const ETIQUETAS_FACTORES_EXTERIORES = {
  temperatura_ext: 'Temperatura exterior',
  humedad_ext: 'Humedad exterior',
  radiacion_solar: 'Radiación solar',
  viento: 'Viento',
  lluvia: 'Lluvia',
  calidad_aire_ext: 'Calidad del aire exterior',
  ruido: 'Ruido exterior'
};