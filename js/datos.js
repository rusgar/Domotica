/* ============================================================
   CATÁLOGO DE APARATOS Y TIPOS DE EDIFICIO
   ============================================================ */

// Cada aparato: id, emoji, nombre, tipo, zona correcta, precio (€)
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
  { id: 'camara_termo', emoji: '📷', nombre: 'Cámara termográfica', tipo: 'Temperatura superficie', zona: 'envolvente', precio: 350 },
  { id: 'sonda_superficie', emoji: '🌡️', nombre: 'Sonda de superficie', tipo: 'Temperatura contacto', zona: 'envolvente', precio: 45 },

  // INTERIOR
  { id: 'dht22', emoji: '🌡️', nombre: 'DHT22', tipo: 'Temp + humedad interior', zona: 'interior', precio: 8 },
  { id: 'ds18b20', emoji: '🔌', nombre: 'DS18B20', tipo: 'Temp digital 1-Wire', zona: 'interior', precio: 6 },
  { id: 'pt100', emoji: '🎯', nombre: 'PT100', tipo: 'Temp alta precisión', zona: 'interior', precio: 40 },
  { id: 'termistor', emoji: '🔘', nombre: 'Termistor', tipo: 'Temp doméstica', zona: 'interior', precio: 3 },
  { id: 'sensor_co2', emoji: '🫁', nombre: 'Sensor CO₂ NDIR', tipo: 'Calidad aire interior', zona: 'interior', precio: 90 },
  { id: 'ldr', emoji: '💡', nombre: 'LDR / Fotodiodo', tipo: 'Sensor luminosidad', zona: 'interior', precio: 2 },
  { id: 'luxometro', emoji: '🔆', nombre: 'Luxómetro', tipo: 'Medida luz (lux)', zona: 'interior', precio: 120 },
  { id: 'sensor_presencia', emoji: '👤', nombre: 'Sensor de presencia', tipo: 'Detección ocupación', zona: 'interior', precio: 30 },

  // ELÉCTRICO
  { id: 'analizador_redes', emoji: '📊', nombre: 'Analizador de redes', tipo: 'P, Q, FP, armónicos', zona: 'electrico', precio: 280 },
  { id: 'pinza_amperimetrica', emoji: '🔧', nombre: 'Pinza amperimétrica', tipo: 'Medida corriente', zona: 'electrico', precio: 80 },
  { id: 'registrador_energia', emoji: '📼', nombre: 'Registrador de energía', tipo: 'Data logging eléctrico', zona: 'electrico', precio: 220 },

  // HIDRÁULICO
  { id: 'caudalimetro_mecanico', emoji: '⚙️', nombre: 'Caudalímetro mecánico', tipo: 'Caudal doméstico', zona: 'hidraulico', precio: 60 },
  { id: 'caudalimetro_ultrasonico', emoji: '📡', nombre: 'Caudalímetro ultrasónico', tipo: 'Caudal alta precisión', zona: 'hidraulico', precio: 400 },
  { id: 'sensor_presion', emoji: '🎚️', nombre: 'Sensor de presión', tipo: 'Presión agua (bar)', zona: 'hidraulico', precio: 50 },
  { id: 'contador_volumetrico', emoji: '🔢', nombre: 'Contador volumétrico', tipo: 'Volumen agua (m³)', zona: 'hidraulico', precio: 90 },

  // TÉRMICO
  { id: 'contador_termico', emoji: '🔥', nombre: 'Contador de energía térmica', tipo: 'kWh térmicos', zona: 'termico', precio: 300 },
  { id: 'sensor_impulsion', emoji: '🌡️', nombre: 'Sensor de impulsión', tipo: 'Tª salida caldera', zona: 'termico', precio: 35 },
  { id: 'sensor_retorno', emoji: '🌡️', nombre: 'Sensor de retorno', tipo: 'Tª vuelta caldera', zona: 'termico', precio: 35 },
  { id: 'caudalimetro_termico', emoji: '🌀', nombre: 'Caudalímetro térmico', tipo: 'Caudal circuito', zona: 'termico', precio: 150 },
  { id: 'contador_gas', emoji: '⛽', nombre: 'Contador de gas', tipo: 'm³ o kWh de gas', zona: 'termico', precio: 110 },

  // CONTROL
  { id: 'plc', emoji: '🖥️', nombre: 'PLC', tipo: 'Control industrial', zona: 'control', precio: 450 },
  { id: 'bms', emoji: '🧠', nombre: 'BMS', tipo: 'Gestión del edificio', zona: 'control', precio: 1200 },
  { id: 'controlador_knx', emoji: '🎛️', nombre: 'Controlador KNX', tipo: 'Domótica', zona: 'control', precio: 350 },
  { id: 'controlador_bacnet', emoji: '🎛️', nombre: 'Controlador BACnet', tipo: 'Climatización', zona: 'control', precio: 500 },
  { id: 'actuador_luz', emoji: '💡', nombre: 'Actuador de luz', tipo: 'Enciende/apaga', zona: 'control', precio: 70 },
  { id: 'actuador_valvula', emoji: '🚰', nombre: 'Actuador de válvula', tipo: 'Abre/cierra agua', zona: 'control', precio: 95 },
  { id: 'actuador_persiana', emoji: '🪟', nombre: 'Actuador de persiana', tipo: 'Sube/baja toldo', zona: 'control', precio: 85 },

  // GATEWAY
  { id: 'gateway_modbus', emoji: '🔀', nombre: 'Gateway Modbus', tipo: 'RTU/TCP ↔ IP', zona: 'gateway', precio: 180 },
  { id: 'gateway_knx', emoji: '🔀', nombre: 'Gateway KNX', tipo: 'KNX ↔ IP', zona: 'gateway', precio: 250 },
  { id: 'gateway_bacnet', emoji: '🔀', nombre: 'Gateway BACnet', tipo: 'MS/TP ↔ IP', zona: 'gateway', precio: 300 },
  { id: 'gateway_zigbee', emoji: '🔀', nombre: 'Gateway Zigbee', tipo: 'Zigbee ↔ IP', zona: 'gateway', precio: 60 },
  { id: 'gateway_lora', emoji: '🔀', nombre: 'Gateway LoRa', tipo: 'LoRa ↔ IP', zona: 'gateway', precio: 220 },
  { id: 'broker_mqtt', emoji: '☁️', nombre: 'Broker MQTT', tipo: 'Mensajería IoT', zona: 'gateway', precio: 0 },
];

// Nombres legibles de las zonas
const NOMBRES_ZONAS = {
  exterior: '🌤️ Exterior',
  envolvente: '🧱 Envolvente',
  interior: '🏠 Interior',
  electrico: '⚡ Eléctrico',
  hidraulico: '💧 Hidráulico',
  termico: '🔥 Térmico',
  control: '🧠 Control',
  gateway: '🔀 Gateway',
};

// Descripciones para las pistas
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