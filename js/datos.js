/* ============================================================
   CATÁLOGO DE APARATOS Y TIPOS DE EDIFICIO
   ============================================================ */

const APARATOS = [
  // EXTERIOR
  { id: 'termometro_ext', emoji: '🌡️', nombre: 'Termómetro exterior', tipo: 'Sensor temperatura', zona: 'exterior', precio: 25 },
  { id: 'higrometro_ext', emoji: '💧', nombre: 'Higrómetro exterior', tipo: 'Sensor humedad', zona: 'exterior', precio: 30 },
  { id: 'piranometro', emoji: '☀️', nombre: 'Piranómetro', tipo: 'Sensor radiación solar', zona: 'exterior', precio: 180 },
  { id: 'anemometro', emoji: '🌬️', nombre: 'Anemómetro', tipo: 'Sensor velocidad viento', zona: 'exterior', precio: 90 },
  { id: 'veleta', emoji: '🧭', nombre: 'Veleta', tipo: 'Sensor dirección viento', zona: 'exterior', precio: 75 },
  { id: 'pluviometro', emoji: '🌧️', nombre: 'Pluviómetro', tipo: 'Sensor lluvia', zona: 'exterior', precio: 60 },
  { id: 'sensor_particulas', emoji: '🌫️', nombre: 'Sensor de partículas', tipo: 'Calidad aire exterior', zona: 'exterior', precio: 120 },

  // ENVOLVENTE
  { id: 'camara_termo', emoji: '📷', nombre: 'Cámara termográfica', tipo: 'Sensor temperatura superficie', zona: 'envolvente', precio: 350 },
  { id: 'sonda_superficie', emoji: '🌡️', nombre: 'Sonda de superficie', tipo: 'Sensor temperatura contacto', zona: 'envolvente', precio: 45 },

  // INTERIOR
  { id: 'dht22', emoji: '🌡️', nombre: 'DHT22', tipo: 'Sensor temp + humedad', zona: 'interior', precio: 8 },
  { id: 'ds18b20', emoji: '🔌', nombre: 'DS18B20', tipo: 'Sensor temp digital 1-Wire', zona: 'interior', precio: 6 },
  { id: 'pt100', emoji: '🎯', nombre: 'PT100', tipo: 'Sensor temp alta precisión', zona: 'interior', precio: 40 },
  { id: 'termistor', emoji: '🔘', nombre: 'Termistor', tipo: 'Sensor temp doméstica', zona: 'interior', precio: 3 },
  { id: 'sensor_co2', emoji: '🫁', nombre: 'Sensor CO₂ NDIR', tipo: 'Calidad aire interior', zona: 'interior', precio: 90 },
  { id: 'ldr', emoji: '💡', nombre: 'LDR / Fotodiodo', tipo: 'Sensor luminosidad', zona: 'interior', precio: 2 },
  { id: 'luxometro', emoji: '🔆', nombre: 'Luxómetro', tipo: 'Medida luz (lux)', zona: 'interior', precio: 120 },
  { id: 'sensor_presencia', emoji: '👤', nombre: 'Sensor de presencia', tipo: 'Detección ocupación', zona: 'interior', precio: 30 },

  // ELÉCTRICO
  { id: 'analizador_redes', emoji: '📊', nombre: 'Analizador de redes', tipo: 'Medida P, Q, FP, armónicos', zona: 'electrico', precio: 280 },
  { id: 'pinza_amperimetrica', emoji: '🔧', nombre: 'Pinza amperimétrica', tipo: 'Medida corriente', zona: 'electrico', precio: 80 },
  { id: 'registrador_energia', emoji: '📼', nombre: 'Registrador de energía', tipo: 'Data logging eléctrico', zona: 'electrico', precio: 220 },

  // HIDRÁULICO
  { id: 'caudalimetro_mecanico', emoji: '⚙️', nombre: 'Caudalímetro mecánico', tipo: 'Medida caudal doméstico', zona: 'hidraulico', precio: 60 },
  { id: 'caudalimetro_ultrasonico', emoji: '📡', nombre: 'Caudalímetro ultrasónico', tipo: 'Medida caudal alta precisión', zona: 'hidraulico', precio: 400 },
  { id: 'sensor_presion', emoji: '🎚️', nombre: 'Sensor de presión', tipo: 'Medida presión agua (bar)', zona: 'hidraulico', precio: 50 },
  { id: 'contador_volumetrico', emoji: '🔢', nombre: 'Contador volumétrico', tipo: 'Medida volumen agua (m³)', zona: 'hidraulico', precio: 90 },

  // TÉRMICO
  { id: 'contador_termico', emoji: '🔥', nombre: 'Contador de energía térmica', tipo: 'Medida kWh térmicos', zona: 'termico', precio: 300 },
  { id: 'sensor_impulsion', emoji: '🌡️', nombre: 'Sensor de impulsión', tipo: 'Medida Tª salida caldera', zona: 'termico', precio: 35 },
  { id: 'sensor_retorno', emoji: '🌡️', nombre: 'Sensor de retorno', tipo: 'Medida Tª vuelta caldera', zona: 'termico', precio: 35 },
  { id: 'caudalimetro_termico', emoji: '🌀', nombre: 'Caudalímetro térmico', tipo: 'Medida caudal circuito', zona: 'termico', precio: 150 },
  { id: 'contador_gas', emoji: '⛽', nombre: 'Contador de gas', tipo: 'Medida m³ o kWh de gas', zona: 'termico', precio: 110 },

  // CONTROL
  { id: 'plc', emoji: '🖥️', nombre: 'PLC', tipo: 'Controlador industrial', zona: 'control', precio: 450 },
  { id: 'bms', emoji: '🧠', nombre: 'BMS', tipo: 'Controlador gestión edificio', zona: 'control', precio: 1200 },
  { id: 'controlador_knx', emoji: '🎛️', nombre: 'Controlador KNX', tipo: 'Controlador domótica', zona: 'control', precio: 350 },
  { id: 'controlador_bacnet', emoji: '🎛️', nombre: 'Controlador BACnet', tipo: 'Controlador climatización', zona: 'control', precio: 500 },
  { id: 'actuador_luz', emoji: '💡', nombre: 'Actuador de luz', tipo: 'Actuador enciende/apaga', zona: 'control', precio: 70 },
  { id: 'actuador_valvula', emoji: '🚰', nombre: 'Actuador de válvula', tipo: 'Actuador abre/cierra agua', zona: 'control', precio: 95 },
  { id: 'actuador_persiana', emoji: '🪟', nombre: 'Actuador de persiana', tipo: 'Actuador sube/baja toldo', zona: 'control', precio: 85 },

  // GATEWAY
  { id: 'gateway_modbus', emoji: '🔀', nombre: 'Gateway Modbus', tipo: 'Gateway RTU/TCP ↔ IP', zona: 'gateway', precio: 180 },
  { id: 'gateway_knx', emoji: '🔀', nombre: 'Gateway KNX', tipo: 'Gateway KNX ↔ IP', zona: 'gateway', precio: 250 },
  { id: 'gateway_bacnet', emoji: '🔀', nombre: 'Gateway BACnet', tipo: 'Gateway MS/TP ↔ IP', zona: 'gateway', precio: 300 },
  { id: 'gateway_zigbee', emoji: '🔀', nombre: 'Gateway Zigbee', tipo: 'Gateway Zigbee ↔ IP', zona: 'gateway', precio: 60 },
  { id: 'gateway_lora', emoji: '🔀', nombre: 'Gateway LoRa', tipo: 'Gateway LoRa ↔ IP', zona: 'gateway', precio: 220 },
  { id: 'broker_mqtt', emoji: '☁️', nombre: 'Broker MQTT', tipo: 'Mensajería IoT', zona: 'gateway', precio: 0 },

  // ============================================================
  // APARATOS DE RELLENO · opcionales (opcional: true)
  // Están en el banco para hacer bulto: NO son necesarios para
  // validar ninguna zona, NO cuentan en el marcador y NO penalizan
  // aunque se coloquen en una zona equivocada.
  // ============================================================
  // EXTERIOR (relleno)
  { id: 'barometro', emoji: '📈', nombre: 'Barómetro aneroide', tipo: 'Sensor presión atmosférica', zona: 'exterior', precio: 45, opcional: true },
  // ENVOLVENTE (relleno)
  { id: 'humedad_muro', emoji: '🧱', nombre: 'Sensor de humedad de muro', tipo: 'Sensor humedad superficie', zona: 'envolvente', precio: 60, opcional: true },
  // INTERIOR (relleno)
  { id: 'sensor_ruido', emoji: '🔊', nombre: 'Sensor de ruido', tipo: 'Acústica interior', zona: 'interior', precio: 110, opcional: true },
  { id: 'sensor_apertura', emoji: '🚪', nombre: 'Sensor de apertura', tipo: 'Detección apertura', zona: 'interior', precio: 25, opcional: true },
  { id: 'sensor_cov', emoji: '🌿', nombre: 'Sensor de COV', tipo: 'Calidad aire interior', zona: 'interior', precio: 140, opcional: true },
  // ELÉCTRICO (relleno)
  { id: 'medidor_trifasico', emoji: '⚡', nombre: 'Medidor trifásico DIN', tipo: 'Medida tensión y corriente', zona: 'electrico', precio: 160, opcional: true },
  { id: 'rele_cargas', emoji: '🔌', nombre: 'Relé de cargas DIN', tipo: 'Actuador conmutador', zona: 'electrico', precio: 70, opcional: true },
  // HIDRÁULICO (relleno)
  { id: 'detector_fugas', emoji: '💦', nombre: 'Detector de fugas ultrasónico', tipo: 'Detección fugas de agua', zona: 'hidraulico', precio: 480, opcional: true },
  // TÉRMICO (relleno)
  { id: 'presion_caldera', emoji: '🎚️', nombre: 'Sensor de presión de caldera', tipo: 'Medida presión (bar)', zona: 'termico', precio: 75, opcional: true },
  // CONTROL (relleno)
  { id: 'actuador_dali', emoji: '💡', nombre: 'Actuador DALI', tipo: 'Actuador regulable', zona: 'control', precio: 120, opcional: true },
  { id: 'termostato_zona', emoji: '🌡️', nombre: 'Termostato de zona', tipo: 'Controlador de zona', zona: 'control', precio: 95, opcional: true },
  { id: 'variador_frecuencia', emoji: '🎛️', nombre: 'Variador de frecuencia', tipo: 'Controlador industrial', zona: 'control', precio: 420, opcional: true },
  // GATEWAY (relleno)
  { id: 'gateway_wifi', emoji: '📶', nombre: 'Gateway Wi-Fi', tipo: 'Gateway Wi-Fi ↔ IP', zona: 'gateway', precio: 90, opcional: true },
  { id: 'gateway_enocean', emoji: '🛰️', nombre: 'Gateway EnOcean', tipo: 'Gateway EnOcean ↔ IP', zona: 'gateway', precio: 200, opcional: true },
];

// Nombres legibles de las zonas (sin descripción reveladora)
const NOMBRES_ZONAS = {
  exterior: '🌤️ Exterior / Cubierta',
  envolvente: '🧱 Envolvente',
  interior: '🏠 Interior (aulas, oficinas)',
  electrico: '⚡ Cuadro eléctrico',
  hidraulico: '💧 Sala hidráulica',
  termico: '🔥 Sala térmica (caldera)',
  control: '🧠 Sala de control / BMS',
  gateway: '🔀 Gateways / Protocolos',
};

// Pistas para cuando el alumno tenga desbloqueada la pista
const PISTAS_ZONAS = {
  exterior: '🌤️ Va fuera, midiendo el clima (temperatura, humedad, sol, viento, lluvia o calidad del aire).',
  envolvente: '🧱 Mide la temperatura de las superficies: paredes, ventanas o tejado.',
  interior: '🏠 Va dentro: mide temperatura, humedad, CO₂, luz o presencia en aulas y oficinas.',
  electrico: '⚡ Va en el cuadro eléctrico: mide tensión, corriente, potencia, energía o factor de potencia.',
  hidraulico: '💧 Va en la sala hidráulica: mide caudal, volumen, presión o detecta fugas de agua.',
  termico: '🔥 Va en la sala de calderas: mide energía térmica, temperaturas de impulsión/retorno o gas.',
  control: '🧠 Va en la sala de control o BMS: controla, decide o ejecuta acciones.',
  gateway: '🔀 Traduce entre protocolos: Modbus, KNX, BACnet, Zigbee, MQTT o LoRa.',
};

// FUTURO: tipos de edificio para la actividad de presupuesto
const TIPOS_EDIFICIO = {
  colegio: {
    nombre: 'Colegio',
    zonasObligatorias: ['exterior','interior','electrico','hidraulico','termico','control','gateway'],
    presupuesto: 5000,
  },
  hospital: {
    nombre: 'Hospital',
    zonasObligatorias: ['exterior','interior','electrico','hidraulico','termico','control','gateway'],
    presupuesto: 25000,
  },
  oficina: {
    nombre: 'Oficina',
    zonasObligatorias: ['exterior','interior','electrico','control','gateway'],
    presupuesto: 3000,
  },
};