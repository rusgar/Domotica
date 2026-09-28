/* ============================================================
   BASE DE PREGUNTAS POR ZONA
   Extraídas de la documentación del curso ELEE017PO
   Cada pregunta: { pregunta, opciones: [...], correcta: índice }
   ============================================================ */

const PREGUNTAS = {
  exterior: [
    {
      pregunta: '¿Qué factor exterior es el que más afecta al consumo de climatización, representando un 40-60% del total?',
      opciones: [
        'La temperatura exterior',
        'La calidad del aire',
        'La dirección del viento'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Qué instrumento se utiliza para medir la radiación solar global (directa + difusa)?',
      opciones: [
        'El luxómetro',
        'El piranómetro',
        'El anemómetro'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué mide un pluviómetro?',
      opciones: [
        'La velocidad del viento',
        'La humedad relativa del aire',
        'La cantidad de lluvia caída'
      ],
      correcta: 2
    }
  ],

  envolvente: [
    {
      pregunta: '¿Qué instrumento permite detectar puentes térmicos y pérdidas de calor en paredes y ventanas?',
      opciones: [
        'El termómetro de mercurio',
        'La cámara termográfica',
        'El luxómetro'
      ],
      correcta: 1
    },
    {
      pregunta: 'Un valor de transmitancia térmica (U-value) más bajo significa...',
      opciones: [
        'Que el material aísla mejor',
        'Que el material deja pasar más calor',
        'Que el material es más caro'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Dónde suelen aparecer los puentes térmicos?',
      opciones: [
        'Solo en el centro de las paredes',
        'En esquinas, pilares, marcos de ventanas y encuentros pared-tejado',
        'Únicamente en los suelos'
      ],
      correcta: 1
    }
  ],

  interior: [
    {
      pregunta: '¿Por debajo de qué valor debe estar el CO₂ en un aula para no afectar a la concentración?',
      opciones: [
        'Por debajo de 2.000 ppm',
        'Por debajo de 800-1.000 ppm',
        'Por debajo de 300 ppm'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué rango de humedad relativa se considera ideal para el confort interior?',
      opciones: [
        '10-20%',
        '40-60%',
        '80-90%'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué sensor mide temperatura y humedad a la vez y es muy usado en domótica?',
      opciones: [
        'El PT100',
        'El termistor NTC',
        'El DHT22'
      ],
      correcta: 2
    },
    {
      pregunta: '¿Qué valor de iluminación se recomienda en un aula?',
      opciones: [
        '100-150 lux',
        '300-500 lux',
        '1.000-1.500 lux'
      ],
      correcta: 1
    }
  ],

  electrico: [
    {
      pregunta: '¿Qué aparato se conecta al cuadro eléctrico y mide tensión, corriente, potencia activa, reactiva, FP y armónicos?',
      opciones: [
        'La pinza amperimétrica',
        'El analizador de redes',
        'El registrador de energía'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Cuál es la limitación principal de la pinza amperimétrica?',
      opciones: [
        'Solo mide corriente, no potencia',
        'Solo mide tensión, no corriente',
        'No funciona en corriente alterna'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Qué buscamos en los datos eléctricos cuando vemos un pico a las 3:00 de la madrugada?',
      opciones: [
        'Es normal, es la hora de más actividad',
        'Es anómalo, algo está encendido que no debería',
        'Es el arranque del sistema de climatización'
      ],
      correcta: 1
    }
  ],

  hidraulico: [
    {
      pregunta: '¿Qué tipo de caudalímetro mide el tiempo que tarda el sonido en atravesar el agua y es el más preciso?',
      opciones: [
        'Mecánico de turbina',
        'Electromagnético',
        'Ultrasónico'
      ],
      correcta: 2
    },
    {
      pregunta: '¿Cómo se detectan las fugas de agua en un edificio?',
      opciones: [
        'Comparando el consumo nocturno con el esperado',
        'Midiendo la temperatura del agua',
        'Contando las veces que se abre un grifo'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Qué mide un sensor de presión en la instalación de agua?',
      opciones: [
        'El volumen total consumido',
        'La presión del agua en la tubería (en bar)',
        'La temperatura del agua caliente'
      ],
      correcta: 1
    }
  ],

  termico: [
    {
      pregunta: '¿Qué mide un contador de energía térmica?',
      opciones: [
        'Solo la temperatura del agua',
        'El caudal y el ΔT para calcular la energía cedida en kWh térmicos',
        'El consumo de gas en m³'
      ],
      correcta: 1
    },
    {
      pregunta: 'En una caldera, la energía térmica se calcula como...',
      opciones: [
        'Caudal × ΔT × 1,163 × Tiempo',
        'Caudal × Presión × Tiempo',
        'Temperatura × Volumen × 0,5'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Cuántos kWh aproximados tiene 1 m³ de gas natural?',
      opciones: [
        '1 kWh',
        '10,7 kWh',
        '100 kWh'
      ],
      correcta: 1
    },
    {
      pregunta: 'Si el ΔT de una caldera es de solo 5 °C cuando debería ser 20 °C, ¿qué indica?',
      opciones: [
        'Que la caldera funciona perfectamente',
        'Que el sistema no cede bien el calor (radiadores sucios u obstruidos)',
        'Que hay una fuga de gas'
      ],
      correcta: 1
    }
  ],

  control: [
    {
      pregunta: '¿Qué es un BMS?',
      opciones: [
        'Un protocolo de comunicación industrial',
        'El Building Management System, sistema central que controla y monitoriza todos los sistemas del edificio',
        'Un tipo de sensor de temperatura'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué diferencia hay entre un sensor y un actuador?',
      opciones: [
        'El sensor mide y el actuador ejecuta la acción',
        'Son exactamente lo mismo',
        'El sensor ejecuta y el actuador mide'
      ],
      correcta: 0
    },
    {
      pregunta: '¿Qué lógica de control enciende y apaga con un margen para evitar oscilaciones?',
      opciones: [
        'ON/OFF simple',
        'Histéresis',
        'PID'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué tipo de controlador está específicamente diseñado para climatización en edificios?',
      opciones: [
        'Controlador KNX',
        'Controlador BACnet',
        'Controlador Modbus'
      ],
      correcta: 1
    }
  ],

  gateway: [
    {
      pregunta: '¿Para qué sirve un gateway?',
      opciones: [
        'Para medir la temperatura del aire',
        'Para traducir entre protocolos que hablan idiomas distintos',
        'Para almacenar datos en la nube'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué protocolo es el más usado en industria para contadores eléctricos y PLC?',
      opciones: [
        'KNX',
        'Modbus',
        'Zigbee'
      ],
      correcta: 1
    },
    {
      pregunta: '¿Qué protocolo inalámbrico está pensado para largas distancias (2-15 km) y bajo consumo, ideal para sensores exteriores?',
      opciones: [
        'Zigbee',
        'WiFi',
        'LoRa'
      ],
      correcta: 2
    },
    {
      pregunta: '¿Qué protocolo de mensajería ligero se usa para enviar datos a la nube en IoT?',
      opciones: [
        'MQTT',
        'BACnet',
        'Modbus RTU'
      ],
      correcta: 0
    },
    {
      pregunta: 'KNX es un protocolo...',
      opciones: [
        'Industrial de los años 70',
        'Estándar europeo de domótica (EN 50090)',
        'De mensajería IoT'
      ],
      correcta: 1
    }
  ]
};