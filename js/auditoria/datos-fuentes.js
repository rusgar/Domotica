/* ============================================================
   APARTADOS Y DATOS/CRITERIOS POR FUENTE
   Para los desplegables de la mini-investigación (bloque 9)
   ============================================================ */

const APARTADOS_FUENTES_OFICIALES = {
  cte_db_he: [
    { id: 'HE0', nombre: 'HE0 · Limitación del consumo', datos: [
      'HE0 exige limitar el consumo de energía primaria no renovable del edificio.',
      'HE0 establece coeficientes de demanda energética máximos según zona climática.',
      'HE0 requiere contadores o sistemas de medición del consumo energético.',
      'HE0 obliga a instalar paneles solares en todas las cubiertas.',
      'HE0 prohíbe el uso de calderas de gas en edificios nuevos.'
    ]},
    { id: 'HE1', nombre: 'HE1 · Condiciones de la envolvente', datos: [
      'HE1 regula la permeabilidad al aire de huecos y cerramientos.',
      'HE1 fija valores máximos de transmitancia térmica de fachadas, cubiertas y suelos.',
      'HE1 exige control de puentes térmicos para evitar condensaciones.',
      'HE1 obliga a cambiar todas las ventanas cada 10 años.',
      'HE1 exige un aislamiento mínimo de 20 cm en todas las fachadas.'
    ]},
    { id: 'HE2', nombre: 'HE2 · Rendimiento de instalaciones', datos: [
      'HE2 exige rendimientos mínimos en calderas, bombas de calor y equipos de climatización.',
      'HE2 regula la eficiencia de los sistemas de ventilación y recuperación de calor.',
      'HE2 requiere sistemas de regulación y control en instalaciones térmicas.',
      'HE2 obliga a usar exclusivamente bombas de calor aerotérmicas.',
      'HE2 prohíbe los sistemas de ventilación mecánica en viviendas.'
    ]},
    { id: 'HE3', nombre: 'HE3 · Eficiencia de iluminación', datos: [
      'HE3 regula la sectorización, el control horario y el aprovechamiento de la luz natural.',
      'HE3 exige poder sectorizar y controlar la iluminación por zonas y horarios.',
      'HE3 regula el control y la sectorización de la iluminación (apagado por presencia y horario).',
      'HE3 exige apagar las luminarias cuando hay luz natural y sectorizar por franjas.',
      'HE3 obliga a usar lámparas LED con una eficiencia mínima del 95 %.',
      'HE3 exige sensores de presencia en todas las estancias.'
    ]},
    { id: 'HE4', nombre: 'HE4 · Contribución solar', datos: [
      'HE4 regula el aprovechamiento de la energía solar térmica para ACS.',
      'HE4 establece contribuciones mínimas de energía solar según zona climática.',
      'HE4 exige sistemas de control para evitar sobrecalentamiento en verano.',
      'HE4 obliga a instalar placas solares en todas las viviendas.',
      'HE4 prohíbe el uso de energías fósiles en sistemas de ACS.'
    ]},
    { id: 'HE5', nombre: 'HE5 · Generación renovable', datos: [
      'HE5 regula la instalación de sistemas de generación de energía renovable.',
      'HE5 establece potencias mínimas de fotovoltaica o solar térmica.',
      'HE5 exige sistemas de monitorización de la energía generada.',
      'HE5 obliga a instalar aerogeneradores en edificios de más de 5 plantas.',
      'HE5 exige que el 100 % de la energía sea de origen renovable.'
    ]}
  ],
  rite: [
    { id: 'IT1', nombre: 'IT 1 · Exigencias de bienestar e higiene', datos: [
      'IT 1.1.4.2 regula el control de infiltraciones y la velocidad media del aire para evitar corrientes.',
      'IT 1.1.4.2 regula la velocidad media del aire y el control de infiltraciones; IT 1.1.4.1 fija la temperatura del aire.',
      'IT 1.1.4.3 regula la ventilación según ocupación y actividad (caudal en función del uso real).',
      'IT 1 fija los rangos de temperatura, humedad y velocidad del aire para el bienestar.',
      'IT 1.1.4.3 · Calidad del aire interior: ventilación según ocupación.',
      'IT 1 obliga a mantener 24 °C en todas las estancias todo el año.',
      'IT 1 prohíbe el uso de sistemas de ventilación natural.'
    ]},
    { id: 'IT2', nombre: 'IT 2 · Eficiencia energética', datos: [
      'IT 2 exige rendimientos mínimos en equipos de climatización y ventilación.',
      'IT 2 regula la recuperación de calor en sistemas de ventilación.',
      'IT 2 requiere sistemas de control y regulación para optimizar el consumo.',
      'IT 2 obliga a usar exclusivamente energías renovables.',
      'IT 2 prohíbe los sistemas de aire acondicionado en edificios públicos.'
    ]},
    { id: 'IT3', nombre: 'IT 3 · Seguridad', datos: [
      'IT 3 regula las condiciones de seguridad en instalaciones térmicas.',
      'IT 3 exige protecciones contra sobrepresiones y temperaturas extremas.',
      'IT 3 requiere sistemas de alarma y parada de emergencia.',
      'IT 3 obliga a revisiones mensuales de todas las instalaciones.',
      'IT 3 prohíbe el uso de gas en edificios de más de 3 plantas.'
    ]},
    { id: 'IT4', nombre: 'IT 4 · Uso y mantenimiento', datos: [
      'IT 4 exige planes de mantenimiento preventivo de las instalaciones.',
      'IT 4 regula la información al usuario sobre el uso eficiente de los equipos.',
      'IT 4 requiere registros de mantenimiento y revisiones periódicas.',
      'IT 4 obliga a cambiar todos los equipos cada 5 años.',
      'IT 4 prohíbe el mantenimiento por personal no certificado.'
    ]}
  ],
  rebt: [
    { id: 'ITC-BT-44', nombre: 'ITC-BT-44 · Receptores para alumbrado', datos: [
      'ITC-BT-44 regula las instalaciones de alumbrado: secciones, protecciones y control.',
      'ITC-BT-44 exige sistemas de control y apagado automático en zonas de uso intermitente.',
      'ITC-BT-44 regula las instalaciones de alumbrado en edificios.',
      'ITC-BT-44 obliga a usar lámparas de bajo consumo en todas las viviendas.',
      'ITC-BT-44 prohíbe la instalación de luces exteriores.'
    ]},
    { id: 'ITC-BT-47', nombre: 'ITC-BT-47 · Motores', datos: [
      'ITC-BT-47 regula las instalaciones de motores: arranque, protección y control.',
      'ITC-BT-47 exige sistemas de regulación de velocidad para ahorro energético.',
      'ITC-BT-47 requiere protecciones contra sobrecargas y cortocircuitos.',
      'ITC-BT-47 obliga a instalar variadores de frecuencia en todos los motores.',
      'ITC-BT-47 prohíbe el uso de motores trifásicos en viviendas.'
    ]},
    { id: 'ITC-BT-51', nombre: 'ITC-BT-51 · Sistemas de automatización', datos: [
      'ITC-BT-51 regula los sistemas de apagado automático y gestión de equipos.',
      'ITC-BT-51 regula los sistemas de automatización, gestión técnica y seguridad.',
      'ITC-BT-51 exige sistemas de control centralizado para edificios terciarios.',
      'ITC-BT-51 obliga a usar exclusivamente el protocolo KNX.',
      'ITC-BT-51 prohíbe los sistemas de control manual.'
    ]}
  ],
  cte_db_hs: [
    { id: 'HS3', nombre: 'HS3 · Calidad del aire interior', datos: [
      'HS3 establece los caudales mínimos de ventilación según uso y los criterios de calidad del aire.',
      'HS3 regula el control de CO₂ como indicador de calidad del aire interior.',
      'HS3 exige sistemas de ventilación mecánica en locales de uso público.',
      'HS3 define el caudal que debe garantizarse con ocupación alta.',
      'HS3 obliga a mantener 1000 ppm de CO₂ como máximo en todas las estancias.',
      'HS3 prohíbe abrir las ventanas en edificios con ventilación mecánica.'
    ]},
    { id: 'HS4', nombre: 'HS4 · Suministro de agua', datos: [
      'HS4 regula las condiciones de suministro de agua caliente y fría.',
      'HS4 exige sistemas de medición y control del consumo de agua.',
      'HS4 requiere protecciones contra la legionella en sistemas de ACS.',
      'HS4 obliga a instalar contadores individuales en todas las viviendas.',
      'HS4 prohíbe el uso de agua caliente sanitaria en edificios públicos.'
    ]},
    { id: 'HS5', nombre: 'HS5 · Evacuación de aguas', datos: [
      'HS5 regula los sistemas de evacuación de aguas residuales y pluviales.',
      'HS5 exige sistemas de ventilación en bajantes y colectores.',
      'HS5 requiere protecciones contra retorno de aguas residuales.',
      'HS5 obliga a instalar sistemas de reutilización de aguas grises.',
      'HS5 prohíbe el vertido de aguas pluviales a la red de alcantarillado.'
    ]}
  ]
};

const APARTADOS_FUENTES_TECNICAS = {
  faen: [
    { id: 'faen_guia_eficiencia', nombre: 'Guías de eficiencia energética en edificios', datos: [
      'Criterios para estimar el ahorro por controles de iluminación y sensores de presencia.',
      'Datos de consumo energético de edificios en Asturias.',
      'Recomendaciones para la sectorización de iluminación en zonas de uso intermitente.'
    ]},
    { id: 'faen_estudios', nombre: 'Estudios e informes sobre energía', datos: [
      'Estudios de consumo energético en edificios públicos asturianos.',
      'Informes sobre ahorro energético en instalaciones térmicas.',
      'Casos prácticos de eficiencia en edificios de uso terciario.'
    ]}
  ],
  idiae: [
    { id: 'idae_guia_iluminacion', nombre: 'Guías de eficiencia en iluminación', datos: [
      'Criterios para estimar el ahorro (kWh por luminaria apagada) y dimensionar sensores.',
      'Datos para estimar kWh ahorrados por detector de presencia.',
      'Criterios para estimar el ahorro de la sectorización y elegir el tipo de control.',
      'Criterios para dimensionar temporizadores y estimar kWh ahorrados por sensor.'
    ]},
    { id: 'idae_guia_termica', nombre: 'Guías de eficiencia en instalaciones térmicas', datos: [
      'Criterios para estimar la pérdida energética por apertura y dimensionar la cortina de aire.',
      'Criterios para estimar el ahorro de reducir caudal fuera del pico.',
      'Estimación de la infiltración por apertura para dimensionar la cortina de aire.',
      'Pérdidas por huecos y puertas de acceso.'
    ]},
    { id: 'idae_guia_edificios', nombre: 'Guías de eficiencia energética en edificios', datos: [
      'Ahorro por controles de iluminación y sensores de presencia.',
      'Criterios para la gestión energética de edificios terciarios.',
      'Recomendaciones para la monitorización de consumos.'
    ]}
  ],
  une: [
    { id: 'une_7730', nombre: 'UNE-EN ISO 7730 · Confort térmico', datos: [
      'UNE-EN ISO 7730 define los índices PMV/PPD para evaluar el confort térmico.',
      'Criterios de medición (posición del sensor, umbrales) para el data logger.',
      'Umbrales con los que comparar las medidas del sensor de humedad y el anemómetro.'
    ]},
    { id: 'une_calidad_aire', nombre: 'Normas sobre calidad del aire y ventilación', datos: [
      'Criterios de calidad del aire interior según uso del edificio.',
      'Recomendaciones para la ventilación en locales de uso público.',
      'Umbrales de CO₂ y otros indicadores de calidad del aire.'
    ]}
  ],
  aff: [
    { id: 'aff_guia_electrica', nombre: 'Guías técnicas sobre instalaciones eléctricas', datos: [
      'Criterios para elegir regletas con horario y estimar consumo en standby.',
      'Recomendaciones para la automatización de instalaciones eléctricas.',
      'Criterios para la selección de equipos de control y medida.'
    ]},
    { id: 'aff_guia_domotica', nombre: 'Guías técnicas sobre domótica', datos: [
      'Criterios para la integración de sistemas domóticos en edificios.',
      'Recomendaciones para la programación de escenas y horarios.',
      'Criterios para la selección de protocolos de comunicación.'
    ]}
  ],
  knx: [
    { id: 'knx_estandar', nombre: 'Estándar KNX de domótica', datos: [
      'Protocolo estándar europeo para la automatización de edificios.',
      'Criterios para la integración de sensores y actuadores en un bus KNX.',
      'Recomendaciones para la programación de escenas y horarios.'
    ]},
    { id: 'knx_interoperabilidad', nombre: 'Interoperabilidad KNX', datos: [
      'Criterios para la interoperabilidad entre fabricantes.',
      'Recomendaciones para la configuración de dispositivos KNX.',
      'Criterios para la puesta en marcha de sistemas KNX.'
    ]}
  ],
  bacnet: [
    { id: 'bacnet_ashrae135', nombre: 'BACnet · ASHRAE 135', datos: [
      'Estándar de comunicación para automatización de edificios (ASHRAE 135).',
      'Criterios para la integración de sistemas de climatización y control.',
      'Recomendaciones para la configuración de redes BACnet.'
    ]},
    { id: 'bacnet_bms', nombre: 'BACnet · Sistemas BMS', datos: [
      'Criterios para la gestión centralizada de edificios con BACnet.',
      'Recomendaciones para la monitorización de consumos energéticos.',
      'Criterios para la integración de sistemas de climatización.'
    ]}
  ],
  aenor: [
    { id: 'aenor_certificacion', nombre: 'Certificación de eficiencia energética', datos: [
      'Criterios para la certificación energética de edificios.',
      'Recomendaciones para la mejora de la calificación energética.',
      'Criterios para la auditoría de sistemas de gestión energética.'
    ]},
    { id: 'aenor_gestion', nombre: 'Sistemas de gestión energética', datos: [
      'Criterios para la implementación de sistemas de gestión energética.',
      'Recomendaciones para la monitorización y verificación de consumos.',
      'Criterios para la mejora continua del rendimiento energético.'
    ]}
  ],
  fenercom: [
    { id: 'fenercom_guia', nombre: 'Guías técnicas y casos prácticos', datos: [
      'Casos prácticos de eficiencia energética en edificios de Madrid.',
      'Criterios para la estimación de ahorros energéticos.',
      'Recomendaciones para la rehabilitación energética de edificios.'
    ]},
    { id: 'fenercom_estudios', nombre: 'Estudios de eficiencia energética', datos: [
      'Estudios de consumo energético en edificios de la Comunidad de Madrid.',
      'Informes sobre ahorro energético en instalaciones terciarias.',
      'Criterios para la selección de medidas de mejora.'
    ]}
  ]
};
