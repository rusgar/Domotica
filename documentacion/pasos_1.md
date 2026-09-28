# Paso 1 · Dashboard base de colocación de aparatos

## 🎯 Objetivo

Crear un dashboard interactivo donde los alumnos puedan **arrastrar** cada aparato (sensor, actuador, controlador o gateway) desde un banco lateral hasta la **zona correcta del edificio**, con validación al final.

## 🧩 Zonas definidas

Se establecieron 8 zonas que cubren todo el ciclo de monitorización del edificio:

| Zona | Descripción |
|---|---|
| 🌤️ Exterior / Cubierta | Clima: temperatura, humedad, sol, viento, lluvia, calidad del aire |
| 🧱 Envolvente | Paredes, ventanas, tejado, puentes térmicos |
| 🏠 Interior | Aulas y oficinas: Tª, HR, CO₂, luz, presencia |
| ⚡ Cuadro eléctrico | Analizadores, pinzas, registradores |
| 💧 Sala hidráulica | Caudalímetros, presión, volumen |
| 🔥 Sala térmica | Contadores térmicos, impulsión/retorno, gas |
| 🧠 Sala de control / BMS | Controladores, actuadores, BMS |
| 🔀 Gateways / Protocolos | Modbus, KNX, BACnet, Zigbee, MQTT, LoRa |

## 🛠️ Tecnologías

- **HTML5** con `draggable` nativo
- **CSS3** con grid, flexbox y variables de color por zona
- **JavaScript** puro (sin frameworks)

## ✅ Funcionalidad del paso 1

1. **Banco lateral** con los 41 aparatos agrupados por tipo.
2. **Zona de edificio** con 8 secciones visuales.
3. **Drag & drop** para mover aparatos del banco a las zonas.
4. **Clic sobre un chip** para devolverlo al banco.
5. **Botón "Verificar colocación"**:
   - Marca en verde los correctos y en rojo los incorrectos.
   - Marca con `✓` las zonas completas.
   - Muestra un mensaje final con el resultado.
6. **Botón "Pista"**: da una ayuda sobre una zona pendiente.
7. **Botón "Auto-colocar"**: solución automática (uso del profesor).
8. **Botón "Reiniciar"**: limpia todo.

## 🎨 Diseño visual

- Tema oscuro (`#0f172a` y `#1e293b`) con acentos por zona.
- Cada zona tiene un color propio en el borde izquierdo.
- Animaciones suaves al colocar (`pop`) y al pasar (`hover`).

## 📌 Decisiones tomadas

- Los aparatos van **agrupados por zona** en el banco (facilita al alumno).
- Los **precios** ya están incluidos en cada aparato (para la futura actividad de presupuesto).
- El estado **no** se guarda todavía (se añade en el paso 2).