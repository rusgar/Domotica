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
5. **Botón "✓ Validar" en cada zona** (validación por zona, no global):
   - **Zona incompleta** → aviso con la cantidad de aparatos que faltan (sin reiniciar).
   - **Zona completa y correcta** → zona en verde con `✓`, chips en verde, botón cambia a "✅ Validada".
   - **Zona completa con errores** → aviso con el detalle y **reinicio total** del ejercicio.
   - Para ganar hay que validar correctamente **todas** las zonas; entonces se muestra la victoria y se para el cronómetro.
   - El marcador "Aciertos" permanece **oculto** hasta validar la primera zona.
6. **Botón "Pista"**: da una ayuda sobre una zona pendiente (se desbloquea al validar la primera zona).
7. **Botón "Auto-colocar"**: solución automática (uso del profesor).
8. **Botón "Reiniciar"**: limpia todo.
9. **Botón "✓ Verificar colocación"** (barra superior): deshabilitado; ahora solo se valida con el botón de cada zona (se mantiene para el cierre del examen).

## 🎨 Diseño visual

- Tema oscuro (`#0f172a` y `#1e293b`) con acentos por zona.
- Cada zona tiene un color propio en el borde izquierdo.
- Animaciones suaves al colocar (`pop`) y al pasar (`hover`).

## 📌 Decisiones tomadas

- Los aparatos van **agrupados por zona** en el banco (facilita al alumno).
- Los **precios** ya están incluidos en cada aparato (para la futura actividad de presupuesto).
- El estado **no** se guarda todavía (se añade en el paso 2).
- La validación es **por botón en cada zona** (no automática al colocar el último aparato, ni global): el alumno decide cuándo comprobar su zona.
- Si la validación falla, se **reinicia TODO el ejercicio** (también con examen activo); las próximas preguntas serán distintas.