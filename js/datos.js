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
  { id: 'sensor_presencia', emoji: '👤', nombre: 'Sensor de presencia', tipo: 'Dete