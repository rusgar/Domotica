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

1. **Banco lateral** con **56 aparatos** (42 obligatorios + 14 de relleno con `opcional: true`)
   en **una sola lista ordenada alfabéticamente** (sin grupos por tipo: no se debe adivinar
   «¿cuántos sensores hay?»). Los gateways quedan al final por el orden alfabético.
2. **Zona de edificio** con 8 secciones visuales.
3. **Drag & drop** para mover aparatos del banco a las zonas. **No se puede repetir un aparato**:
   si se coloca en otra zona, el chip se retira de la anterior (ej. una veleta solo puede estar
   en «Exterior» **o** en «Envolvente», nunca en las dos).
4. **Clic sobre un chip** para devolverlo al banco.
5. **Botón "✓ Validar" en cada zona** (validación por zona, no global):
   - **Zona perfecta** (todo puesto y en su sitio) → zona en verde con `✓`, chips en verde,
     botón cambia a **"✅ Validada"** (y se cierra el ejercicio si eran la última pendiente).
   - **Zona imperfecta** (falta o sobra algo) → pop-up **«¿Quieres dejarlo así o poner más?»**
     **sin decir qué falta ni en qué zona va cada cosa**:
     - **«📌 Dejarlo así»** → la zona queda **aceptada** (borde ámbar, estado 📌, botón
       **"📌 Aceptada"**; se puede seguir añadiendo aparatos o volver a validarla).
     - **«➕ Poner más»** (también `Escape` o clic fuera) → se cierra el pop-up y se sigue editando.
     - **No se vacía nada**; las demás zonas **no se tocan**.
   - Para terminar hay que dar por buenas **las 8 zonas** (✅ o 📌); entonces aparece la pantalla
     final con las **instrucciones de captura de pantalla** y se para el reloj del ejercicio.
   - **Puntuación parcial automática** (la única): **8 zonas × 0,125 = 1,0** y dentro de cada
     zona **cada aparato vale `0,125 / nº de aparatos de esa zona`** (Ej.: Exterior con 7 →
     **0,018** c/u, con 5 bien = **0,089** de la zona). Solo puntúan los **42 obligatorios**.
   - El marcador "Aciertos · Nota" permanece **oculto** para el alumno (solo lo ve el profesor).
6. **Botón "Pista"**: da una ayuda sobre una zona pendiente (se desbloquea al dar por buena la
   primera zona, ✅ o 📌; bloqueada en examen).
7. **Botón "Auto-colocar"**: solución automática (uso del profesor).
8. **Botón "Reiniciar"**: limpia todo.
9. **Botón "✓ Verificar colocación"** (barra superior): deshabilitado; ahora solo se valida con el botón de cada zona (se mantiene para el cierre del examen).
10. **⏱ Reloj del ejercicio** en la barra (`#tiempoColocar`): cuenta **solo** el tiempo de este
    módulo, **se pausa al cambiar de pestaña** y se guarda en `localStorage`
    (`segundosEjercicioColocar`). Pasar de **60 min** resta **0,1** de los **1,0 ponderados**.
11. **Entrega**: al terminar se pide una **captura de pantalla** (con el reloj visible) y el
    **JSON**; ambos se suben a **Moodle**. La nota del profesor es **solo automática**: sale del
    `puntos` del JSON (8 × 0,125) menos la penalización de tiempo, con la captura como evidencia.

## 🎨 Diseño visual

- Tema oscuro (`#0f172a` y `#1e293b`) con acentos por zona.
- Cada zona tiene un color propio en el borde izquierdo.
- Animaciones suaves al colocar (`pop`) y al pasar (`hover`).

## 📌 Decisiones tomadas

- El banco es **una lista alfabética**, no agrupada por zona ni por tipo: el grupo
  «Sensores (28)» daría pistas y no hay que contabilizar.
- Los **precios** ya están incluidos en cada aparato (para la futura actividad de presupuesto).
- El estado **no** se guarda todavía (se añade en el paso 2).
- La validación es **por botón en cada zona** (no automática al colocar el último aparato, ni global): el alumno decide cuándo comprobar su zona.
- Si la zona **no está perfecta no se vacía ni se bloquea**: sale el pop-up «¿Quieres dejarlo así o poner más?»
  y el alumno decide; repetir cuesta tiempo, no puntos.
- **No hay nota manual**: la nota de Colocar es **solo automática** (8 zonas × 0,125 = 1,0 con
  parcial por aparato, −0,1 si > 60 min) y sale del **JSON** de entrega.
- **Las 8 zonas dadas por buena** (✅ o 📌) marcan el final del ejercicio; los 14 de relleno
  (barómetro, ruido, gateway Wi-Fi…) **no puntúan ni penalizan**, solo ocupan hueco en el banco.
- La solución de referencia sigue siendo `img/Captura de pantalla 2026-10-04 094925.png`.