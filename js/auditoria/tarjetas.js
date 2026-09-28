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

  {
    id: 'vestibulo',
    nombre: 'VESTÍBULO',
    icono: '🚪',
    descripcion: 'Vestíbulo con puerta automática que abre frecuentemente',
    variaciones: [
      { ciclos: 15, minutosFranja: 30, segundosApertura: 45, tempExt: 6, tempInt: 21 },
      { ciclos: 20, minutosFranja: 30, segundosApertura: 40, tempExt: 5, tempInt: 20 },
      { ciclos: 12, minutosFranja: 30, segundosApertura: 50, tempExt: 8, tempInt: 22 }
    ],
    escenario: (v) => `Acceso exterior. En entradas/salidas la puerta automática abre repetidamente y comunica con zonas climatizadas. Exterior ${v.tempExt} °C, interior ${v.tempInt} °C.`,
    datosTrabajo: (v) => `En ${v.minutosFranja} min: ${v.ciclos} ciclos; ${v.segundosApertura} s abierta por ciclo.`,
    focoAnalisis: 'Infiltraciones, acceso, climatización y control.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['temperatura', 'velocidad_aire'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext', 'viento'],
    frasesDOIH: [
      { texto: `La puerta se abre ${15} veces en 30 minutos.`, correcta: 'D' },
      { texto: 'Se observa corriente cerca de la entrada.', correcta: 'O' },
      { texto: 'Puede haber pérdidas de calor por las aperturas.', correcta: 'I' },
      { texto: 'Instalar un vestíbulo de aire reduciría el consumo un 30%.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Ciclos × Segundos / 60 = Minutos · / Franja × 100 = %',
      enunciado: (v) => `Calcula qué porcentaje de la franja de ${v.minutosFranja} min permanece abierta la puerta (${v.ciclos} ciclos × ${v.segundosApertura} s).`,
      valor: (v) => ((v.ciclos * v.segundosApertura) / 60) / v.minutosFranja * 100,
      unidad: '% franja',
      decimales: 1,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Vestíbulo de aire (cortina de aire)',
      'Puerta doble de acceso',
      'Reducir tiempo de apertura'
    ],
    costeImpacto: 'Alto · Impacto alto · Dificultad media',
    fuenteSugerida: 'RITE · CTE DB-HE'
  },

  {
    id: 'comedor',
    nombre: 'COMEDOR / CAFETERÍA',
    icono: '🍽️',
    descripcion: 'Comedor con pico de ocupación y ventilación constante',
    variaciones: [
      { picoPersonas: 120, duracionPico: 45, ocupacionBaja: 15, potenciaVentilacion: 1.2, horasReducir: 1, horasIguales: '12:00–16:00', diasMes: 20 },
      { picoPersonas: 100, duracionPico: 60, ocupacionBaja: 10, potenciaVentilacion: 1.5, horasReducir: 1.5, horasIguales: '12:00–16:00', diasMes: 20 },
      { picoPersonas: 140, duracionPico: 45, ocupacionBaja: 20, potenciaVentilacion: 1.0, horasReducir: 1, horasIguales: '11:30–15:30', diasMes: 22 }
    ],
    escenario: (v) => `Pico de ${v.picoPersonas} personas durante ${v.duracionPico} min. El resto del tiempo hay menos de ${v.ocupacionBaja}. Ventilación y climatización mantienen el mismo régimen de ${v.horasIguales}.`,
    datosTrabajo: (v) => `Ventilación: ${v.potenciaVentilacion} kW. Se plantea reducir ${v.horasReducir} h/día a máximo nivel si las condiciones lo permiten.`,
    focoAnalisis: 'Ventilación, ocupación y horarios.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['calidad_aire', 'temperatura'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['temperatura_ext'],
    frasesDOIH: [
      { texto: 'El pico de ocupación es de 120 personas.', correcta: 'D' },
      { texto: 'La ventilación mantiene el mismo régimen toda la franja.', correcta: 'O' },
      { texto: 'Se podría reducir la ventilación fuera del pico.', correcta: 'I' },
      { texto: 'Reducir la ventilación 1 h/día ahorraría 24 kWh/mes.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia × Horas × Días = kWh/mes',
      enunciado: (v) => `Calcula el ahorro mensual reduciendo ${v.horasReducir} h/día la ventilación de máximo nivel (${v.potenciaVentilacion} kW).`,
      valor: (v) => v.potenciaVentilacion * v.horasReducir * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Ventilación bajo demanda según ocupación',
      'Sensores de CO₂',
      'Programación horaria por franjas'
    ],
    costeImpacto: 'Medio · Impacto alto · Dificultad media',
    fuenteSugerida: 'RITE'
  },

  {
    id: 'aseo',
    nombre: 'ASEO',
    icono: '🚻',
    descripcion: 'Aseo con luminarias encendidas largos periodos',
    variaciones: [
      { luminarias: 6, potenciaLuminaria: 18, horasEvitar: 2.5, diasMes: 20 },
      { luminarias: 8, potenciaLuminaria: 15, horasEvitar: 3, diasMes: 20 },
      { luminarias: 5, potenciaLuminaria: 20, horasEvitar: 2, diasMes: 22 }
    ],
    escenario: (v) => `Uso intermitente. ${v.luminarias} luminarias de ${v.potenciaLuminaria} W permanecen encendidas largos periodos. Se estima posible evitar ${v.horasEvitar} h/día con presencia.`,
    datosTrabajo: (v) => `${v.luminarias}×${v.potenciaLuminaria} W.`,
    focoAnalisis: 'Iluminación, presencia y temporización.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['iluminacion'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['radiacion_solar'],
    frasesDOIH: [
      { texto: 'El aseo tiene 6 luminarias de 18 W.', correcta: 'D' },
      { texto: 'Las luces permanecen encendidas largos periodos.', correcta: 'O' },
      { texto: 'Un sensor de presencia podría reducir 2,5 h/día.', correcta: 'I' },
      { texto: 'El ahorro anual supera los 30 €.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia × Horas × Días = kWh/mes',
      enunciado: (v) => `Calcula el ahorro mensual evitando ${v.horasEvitar} h/día de encendido (${v.luminarias}×${v.potenciaLuminaria} W).`,
      valor: (v) => (v.luminarias * v.potenciaLuminaria / 1000) * v.horasEvitar * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Sensor de presencia con temporización',
      'Iluminación LED con detector de movimiento',
      'Cartelería de concienciación'
    ],
    costeImpacto: 'Bajo · Impacto bajo · Dificultad baja',
    fuenteSugerida: 'CTE DB-HE · REBT'
  },

  {
    id: 'salonActos',
    nombre: 'SALÓN DE ACTOS',
    icono: '🎭',
    descripcion: 'Salón de actos con iluminación sin sectorizar',
    variaciones: [
      { luminarias: 12, potenciaLuminaria: 60, horasApagar: 2, diasMes: 10, usoMensual: '2 días/semana' },
      { luminarias: 15, potenciaLuminaria: 55, horasApagar: 2.5, diasMes: 8, usoMensual: '2 días/semana' },
      { luminarias: 10, potenciaLuminaria: 65, horasApagar: 1.5, diasMes: 12, usoMensual: '3 días/semana' }
    ],
    escenario: (v) => `Uso puntual (${v.usoMensual}) y varias zonas de iluminación. Antes de un acto se encienden todas aunque solo se necesita escenario y parte del patio. Exterior 18 °C, interior 22 °C. Grandes superficies acristaladas. Ruido exterior perceptible durante un acto.`,
    datosTrabajo: (v) => `${v.luminarias} luminarias de ${v.potenciaLuminaria} W pueden quedar apagadas ${v.horasApagar} h/día durante ${v.diasMes} días/mes.`,
    focoAnalisis: 'Sectorización, escenas y gestión.',
    condicionesInteriores: ['temperatura', 'humedad', 'calidad_aire', 'iluminacion', 'velocidad_aire', 'ruido'],
    condicionesInterioresCorrectas: ['iluminacion', 'ruido'],
    factoresExteriores: ['temperatura_ext', 'humedad_ext', 'radiacion_solar', 'viento', 'lluvia', 'calidad_aire_ext'],
    factoresExterioresCorrectos: ['radiacion_solar', 'ruido'],
    frasesDOIH: [
      { texto: 'El salón tiene 12 luminarias de 60 W.', correcta: 'D' },
      { texto: 'Se encienden todas aunque solo se use el escenario.', correcta: 'O' },
      { texto: 'La sectorización reduciría el consumo.', correcta: 'I' },
      { texto: 'Instalar escenas de iluminación cuesta menos de 500 €.', correcta: 'H' }
    ],
    calculo: {
      formula: 'Potencia × Luminarias × Horas × Días = kWh/mes',
      enunciado: (v) => `Calcula el ahorro mensual apagando ${v.luminarias} luminarias de ${v.potenciaLuminaria} W durante ${v.horasApagar} h en ${v.diasMes} días/mes.`,
      valor: (v) => (v.luminarias * v.potenciaLuminaria / 1000) * v.horasApagar * v.diasMes,
      unidad: 'kWh/mes',
      decimales: 2,
      tolerancia: 0.02
    },
    medidasSugeridas: [
      'Sectorización de la iluminación',
      'Escenas programables',
      'Control por zonas con pulsadores'
    ],
    costeImpacto: 'Medio · Impacto medio · Dificultad baja',
    fuenteSugerida: 'CTE DB-HE'
  }
];

/* ============================================================
   EJERCICIOS DISPONIBLES
   ============================================================ */
const EJERCICIOS = {
  6: {
    id: '6',
    nombre: 'Auditoría por zonas',
    descripcion: '3 zonas aleatorias · Presupuesto 1.500 €',
    numTarjetas: 3,
    presupuesto: 1500,
    diasMes: 20,
    precioKWh: 0.18
  },
  global: {
    id: 'global',
    nombre: 'Auditoría final integrada',
    descripcion: '2 zonas aleatorias · Integración completa',
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