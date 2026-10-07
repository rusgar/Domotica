# 🏢 Dashboard de Domótica y Monitorización

Dashboard interactivo para el curso **ELEE017PO · Domótica y Monitorización del Consumo en Edificios**.

Incluye **dos módulos** dentro del mismo dashboard:

- **🔧 Colocar aparatos** — ejercicio de arrastrar y soltar para colocar sensores, actuadores, controladores y gateways en su zona correcta del edificio.
- **📋 Auditoría** — ejercicios de auditoría energética por zonas con tarjetas aleatorias, cálculos automáticos y presupuesto limitado.

## 📚 Contexto didáctico

El material cubre los temas del curso:

- **Tema 2** — Condiciones interiores y exteriores del edificio
- **Tema 3** — Medida y monitorización de consumos (eléctrico, hídrico, térmico y gas)
- **Tema 4** — Sistemas de monitorización y comunicación (protocolos, arquitecturas, seguridad)

## 🎯 Objetivos

### Módulo 1 · Colocar aparatos
- Identificar el tipo de aparato por su función (sensor, actuador, controlador, gateway).
- Asociar cada aparato a la zona física del edificio donde tiene sentido instalarlo.
- Comprender la cadena sensor → gateway → controlador → actuador.
- **Responder correctamente una pregunta teórica por zona** para desbloquearla.
- **Validar cada zona con su botón «✓ Validar»**:
  - Si está **perfecta** (todo colocado y en su sitio) se marca en verde **✅** al momento.
  - Si **algo falta o sobra** aparece el pop-up **«¿Quieres dejarlo así o poner más?»** sin decir qué falla: puedes dejarla (**📌 aceptada**) o seguir poniendo. **No se vacía nada** y las demás zonas no se tocan.
- **Puntuación parcial automática** (la única): **8 zonas × 0,125 = 1,0**; dentro de cada zona cada aparato vale `0,125 / nº de aparatos de esa zona` (Ej.: Exterior con 7 → **0,018** c/u; 5 bien = **0,089** de la zona). Los **14 aparatos de relleno** no puntúan.
- **Ganar**: terminar cuando las **8 zonas** están dadas por buena (✅ o 📌), sin bloqueos.
- **Sin aparatos repetidos**: cada aparato del catálogo va a una sola zona (una veleta, en «Exterior» **o** en «Envolvente», nunca en las dos).
- **⏱ Reloj del ejercicio**: se pausa al cambiar de pestaña; pasar de **60 min** resta **0,1** de los **1,0** ponderados.
- **Al terminar aparecen**:
  - **📥 Descargar constancia (PNG)**: imagen con iniciales, tiempo y fecha (sin notas).
  - **📄 Descargar resultado (JSON)**: archivo con la **puntuación por zona**, `puntos` (0-1) y `puntosEjercicio` (0-10) para entregar al profesor.
  - **📸 Captura de pantalla** para subir a **Moodle** (evidencia junto al reloj).
- **Banco alfabético**: una sola lista ordenada A-Z (sin grupos «Sensores (28)» ni contadores);
  incluye aparatos de **relleno** que no puntúan y no cambian la solución de referencia.

### Módulo 2 · Auditoría
- **1 ejercicio asignado**: **Ejercicio Auditoría** → se reparten **2 tarjetas aleatorias de las 10 zonas** (siempre distintas) → **5 puntos por tarjeta** → **10 puntos en total** (ponderado **2,5** sobre la nota del examen; Colocar aparatos pondera **1,0**).
- Analizar zonas del edificio a partir de tarjetas con datos didácticos.
- Distinguir entre **dato, observación, inferencia e hipótesis** (D / O / I / H).
- Realizar cálculos de ahorro energético con unidades correctas.
- Investigar con fuentes oficiales (CTE DB-HE, RITE, REBT) y técnicas.
- Priorizar actuaciones con presupuesto limitado.
- Razonar sin inventar datos: qué medir, con qué instrumento y para qué.
- **Al validar todas las fichas aparece 🖼️ Constancia (PNG)** para descargar y entregar.
- Al terminar, el alumno descarga su **JSON** y lo sube a **Moodle** con su propio usuario. **No se autoevalúa**: la nota sale de sus respuestas y la verifica el profesor con las soluciones modelo.

## 🚀 Cómo usarlo

1. Abre `index.html` en Chrome o Edge (recomendado).
2. Pulsa **"Entrar como alumno"** o **"Entrar como profesor"**.
3. Cambia de módulo con las **pestañas superiores**.
4. En Colocar aparatos: responde la pregunta de cada zona, coloca sus aparatos y pulsa **«✓ Validar»**. Si la zona no está perfecta te pregunta si la dejas así o sigues poniendo. Terminas cuando las **8 zonas** están dadas por buena: descarga la constancia y el JSON y **sube la captura de pantalla a Moodle**.

### 👨‍🏫 Modo profesor

- Pulsa **"Entrar como profesor"**.
- Usuario: `profe` · Contraseña: `domotica2025`
- Se desbloquean:
  - Botón **🤖 Auto-colocar** (solución rápida).
  - Botón **🎓 Modo examen** (bloquea pistas, reset y auto-colocación, añade cuenta atrás).
  - Botón **📊 Resultados** (panel privado con contraseña): carga los JSON descargados de Moodle, muestra **una fila por tarjeta** con la **puntuación automática (0-5)** y su **ponderación (0-1,25)**. **No hay nota manual**: la nota de cada tarjeta es la automática → **Auto/5 × 1,25** (las 2 tarjetas = **10** = **2,5 ponderados**). Además convierte cada JSON en un **informe `.md`** con las respuestas del alumno **y la solución/rúbrica incrustada**. En **Colocar aparatos** cargas la **captura** (botón **＋ 📷**, se ve con **📷 Ver**) **y el JSON**: la nota también es **solo automática** → `puntos` del JSON × 1,0 (8 zonas × 0,125) restando **−0,1** si el reloj del ejercicio pasa de **60 min**; sin JSON la fila queda **sin puntuación**.
  - Atajo de teclado `Ctrl + Shift + A` para auto-colocar.

> 🔒 **Las notas solo las ve el profesor.** El alumno no ve aciertos, porcentajes ni puntuaciones: solo sabe si ha completado el ejercicio y qué le falta.

## 📁 Estructura del proyecto

dashboard-domotica/
├── index.html
├── css/
│ ├── styles.css ← estilos del módulo colocar
│ └── auditoria.css ← estilos del módulo auditoría
├── js/
│ ├── config.js ← configuración global
│ ├── datos.js ← catálogo de aparatos y zonas
│ ├── preguntas.js ← banco de preguntas por zona
│ ├── estado.js ← estado global
│ ├── storage.js ← persistencia en localStorage
│ ├── cronometro.js ← cronómetro compartido
│ ├── constancia.js ← constancias PNG + JSON con iniciales
│ ├── login.js ← login alumno/profesor + cambio de módulo
│ ├── dragdrop.js ← arrastrar y soltar + preguntas
│ ├── validacion.js ← verificación, pistas, reset
│ ├── examen.js ← modo examen (ambos módulos)
│ ├── ui.js ← renderizado del banco
│ ├── panel-profesor.js ← panel de resultados (solo profesor)
│ ├── main.js ← arranque y atajos
│ └── auditoria/
│ ├── tarjetas.js ← 10 tarjetas (zonas de la auditoría) con variaciones aleatorias
│ ├── fuentes.js ← base de fuentes oficiales y técnicas
│ ├── normativa.js ← relación caso → normativa
│ ├── calculos.js ← fórmulas y validadores
│ ├── presupuesto.js ← lógica de presupuesto limitado
│ ├── aleatorio.js ← reparto aleatorio de tarjetas
│ ├── ficha.js ← render de la ficha de análisis
│ ├── ui-auditoria.js ← interfaz del módulo auditoría
│ ├── informe.js ← generación del JSON
├── soluciones/
│ └── 01_aula.md … 10_salon_de_actos.md ← rúbricas/soluciones modelo (el .md del profesor las
│ incrusta al corregir; también se pueden repartir en Moodle)
├── rubrica/
│ └── rubrica_examenes.md (+ .html imprimible) ← rúbrica oficial de los DOS ejercicios
│ (Auditoría 2,5 · Colocar 1,0) para acentuar la nota de cada alumno
├── documentacion/
│ ├── pasos_1.md
│ ├── pasos_2.md
│ ├── pasos_3.md
│ ├── pasos_4.md
│ └── pasos_5.md
├── README.md
└── .gitignore


## 💾 Entrega del trabajo (auditoría)

Al terminar el ejercicio, pulsa **"📤 Enviar informe"**:

1. Rellena tu nombre, **tus iniciales** y (opcional) tu **email**. (La puntuación **no la escribes tú**: sale de tus respuestas y la verifica el profesor.)
2. **Antes de poder descargar** el JSON tienes que tener el **precio de la actuación** en el **apartado 8** de cada tarjeta: elige en la **lista de aparatos** (se repiten cantidades y **el precio se suma solo**) o escríbelo a mano. **750 € por tarjeta** como máximo y el importe debe encajar con esa lista o con el catálogo de **Colocar aparatos** (±20 %). Un precio vacío o fuera de tope bloquea la entrega.
3. Se descarga **un archivo**: `informe_[nombre]_[fecha].json` → **el archivo que subes a la tarea de Moodle**.
4. Se abre **Moodle** en otra pestaña (si el profesor ha configurado la URL en `js/config.js`): entras con **tu usuario de Moodle** y subes el JSON.

> ⏱ **Tiempo**: el cronómetro de la sesión corre siempre, pero para la nota cuenta **solo el tiempo del Ejercicio Auditoría**. Si superas los **60 min** se descuenta **1 décima (0,25 de los 2,5)**.

> El progreso se guarda en tu navegador: puedes cerrar y volver a entrar sin perder nada.

> ⚠️ **Soluciones**: el informe `.md` del profesor incrusta el contenido de `soluciones/0N_*.md` (se lee de la web desplegada). Si abres `index.html` con doble clic (`file://`) el navegador bloquea esa lectura y el `.md` solo dejará la ruta del archivo.

## 📊 Cómo corrige el profesor

> 📄 **Rúbrica oficial**: `rubrica/rubrica_examenes.md` (y su versión imprimible `.html`) detalla
> los criterios, la ponderación y las evidencias de **las dos pruebas**; es el documento con el que
> se sostiene la nota de cada alumno ante el centro.

1. Entra como profesor y pulsa **📊 Resultados** en la cabecera.
2. Introduce la **contraseña del profesor**.
3. **Carga los JSON** que has descargado de Moodle (varios a la vez). También puedes cargar
   directamente las **capturas de pantalla** (`.png`/`.jpg`) del módulo Colocar: se asocian al
   alumno por sus iniciales del nombre de archivo.
   - Hay **una fila por tarjeta**: iniciales, zona, fecha, **tiempo** (con badge `⏰ −0,25` si pasa de 60 min) y su **puntuación automática (0-5)** calculada de las respuestas.
   - El resumen por alumno avisa de quién **no ha entregado las 2 tarjetas**, suma su nota sobre **10** → **2,5 ponderados** y le aplica la **penalización de tiempo** si procede.
4. **No se pone nota a mano en Auditoría**: la nota de cada tarjeta sale de lo automático → **Auto/5 × 1,25** (máx. 1,25 por tarjeta). Usa la rúbrica de `soluciones/` solo para **revisar** los campos abiertos (que no puntúan) y comprobar que la respuesta es el modelo exacto o un parecido razonable.
5. Pulsa **⬇ .md** en la fila de la primera tarjeta: se descarga un informe **Markdown** con las respuestas, la comprobación del cálculo, una checklist de corrección y **la solución/rúbrica incrustada justo debajo de cada tarjeta**.
6. El informe ya trae el **total automático** (sobre 10), su **ponderación** (sobre 2,5), el **presupuesto por tarjeta** y la **penalización de tiempo** si la hay. 🗑 Vaciar borra la tabla.
7. **Colocar aparatos**: la nota es **solo automática** y sale del **JSON** del alumno (`puntos` =
   **8 zonas × 0,125 = 1,0**, con parcial por aparato) → el panel muestra `nota/10` y
   **`puntos − penalización`** (−0,1 si el reloj del ejercicio pasa de 60 min). Con **＋ 📷**
   adjuntas la captura y con **📷 Ver** la abres a pantalla completa; el **⬇ .md** incluye el
   **desglose por zona**, tiempo, penalización, nota, ponderación y la solución correcta.
   **No se escribe nota a mano**: si solo hay captura (sin JSON) la fila queda **sin puntuación**.

## 🔧 Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Usuario y contraseña del profesor | `js/config.js` |
| URL de la tarea de Moodle | `js/config.js` → `MOODLE.urlTarea` |
| Escala: puntos por tarjeta, total y ponderaciones | `js/config.js` → `ESCALA_AUDITORIA` |
| Escala de Colocar: 10 pts → 1,0 y 60 min → −0,1 | `js/config.js` → `ESCALA_COLOCAR` |
| Tope de presupuesto por tarjeta (750 €) | `js/config.js` → `ESCALA_AUDITORIA.presupuestoPorTarjeta` |
| Penalización de tiempo: 60 min → −0,25 | `js/config.js` → `ESCALA_AUDITORIA.limiteTiempoMinutos` / `penalizacionTiempo` |
| Precios de referencia de las actuaciones | `js/datos.js` → `APARATOS` |
| Duración del examen | `js/config.js` → `CONFIG.duracionExamenSegundos` |
| Precio kWh | `js/config.js` → `CONFIG_AUDITORIA.precioKWh` |
| Añadir/quitar aparatos | `js/datos.js` → array `APARATOS` |
| Añadir tarjetas de auditoría | `js/auditoria/tarjetas.js` → array `TARJETAS` |
| Añadir fuentes | `js/auditoria/fuentes.js` |
| Colores y estilos | `css/styles.css` y `css/auditoria.css` |

## 🗺️ Hoja de ruta

- [x] **Paso 1** — Colocar aparatos por zonas con drag & drop (banco alfabético sin grupos, sin duplicados, validación con pop-up «¿Dejarlo así?», puntuación parcial 8 × 0,125 = 1,0, reloj del ejercicio y entrega por captura + JSON)
- [x] **Paso 2** — Login, cronómetro y persistencia
- [x] **Paso 3** — Modo examen
- [x] **Paso 4** — Preguntas de desbloqueo por zona
- [x] **Paso 5** — Módulo de auditoría (10 tarjetas, reparto aleatorio de 2 zonas distintas)
- [x] **Paso 6** — Selector con un único **Ejercicio Auditoría**: 2 tarjetas de las 10 zonas (Ejercicio Global, 3 y 4 fuera)
- ~~**Paso 7** — Ejercicio 3 (detectives de ineficiencias, 10 casos)~~
- ~~**Paso 8** — Ejercicio 4 (auditoría de un aula real con mediciones)~~
- [x] **Paso 9** — Panel del profesor (JSON → .md con rúbrica incrustada; nota **solo automática**: Auto/5 × 1,25 por tarjeta, total 10 = 2,5 ponderados · en Colocar: JSON con puntuación por zona → 1,0 con −0,1 si >60 min + captura)
- [ ] **Paso 10** — Exportación a PDF con rúbrica automática

## 📄 Licencia

Material didáctico de uso libre para formación profesional.