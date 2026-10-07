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
- **Validar cada zona con su botón «✓ Validar»**: si está completa y correcta se marca en verde; si tiene errores se reinicia todo el ejercicio.
- **Ganar = constancia**: al colocar todo correctamente aparecen dos botones:
  - **📥 Descargar constancia (PNG)**: imagen con iniciales, tiempo y fecha (sin notas).
  - **📄 Descargar resultado (JSON)**: archivo con iniciales y aciertos para entregar al profesor.

### Módulo 2 · Auditoría
- **1 ejercicio asignado**: **Ejercicio 6** → se reparten **2 tarjetas aleatorias de las 6 zonas** → **5 puntos por tarjeta** → **10 puntos en total** (ponderado **2,5** sobre la nota del examen; Colocar aparatos pondera **1,5**).
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
4. En Colocar aparatos: responde la pregunta de cada zona, coloca sus aparatos y pulsa **«✓ Validar»**. Ganas cuando validas todas las zonas.

### 👨‍🏫 Modo profesor

- Pulsa **"Entrar como profesor"**.
- Usuario: `profe` · Contraseña: `domotica2025`
- Se desbloquean:
  - Botón **🤖 Auto-colocar** (solución rápida).
  - Botón **🎓 Modo examen** (bloquea pistas, reset y auto-colocación, añade cuenta atrás).
  - Botón **📊 Resultados** (panel privado con contraseña): carga los JSON descargados de Moodle, muestra **una fila por tarjeta** con la **puntuación automática (0-5)** y permite poner la **nota del profesor (0-5 por tarjeta)** → **10 en total = 2,5 ponderados**. Además convierte cada JSON en un **informe `.md`** con las respuestas del alumno **y la solución/rúbrica incrustada**.
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
│ ├── tarjetas.js ← 6 tarjetas (zonas del Ejercicio 6) con variaciones aleatorias
│ ├── fuentes.js ← base de fuentes oficiales y técnicas
│ ├── normativa.js ← relación caso → normativa
│ ├── calculos.js ← fórmulas y validadores
│ ├── presupuesto.js ← lógica de presupuesto limitado
│ ├── aleatorio.js ← reparto aleatorio de tarjetas
│ ├── ficha.js ← render de la ficha de análisis
│ ├── ui-auditoria.js ← interfaz del módulo auditoría
│ ├── informe.js ← generación del JSON
├── soluciones/
│ └── 01_aula.md … 06_gimnasio.md ← rúbricas/soluciones modelo (el .md del profesor las
│ incrusta al corregir; también se pueden repartir en Moodle)
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
2. Se descarga **un archivo**: `informe_[nombre]_[fecha].json` → **el archivo que subes a la tarea de Moodle**.
3. Se abre **Moodle** en otra pestaña (si el profesor ha configurado la URL en `js/config.js`): entras con **tu usuario de Moodle** y subes el JSON.

> El progreso se guarda en tu navegador: puedes cerrar y volver a entrar sin perder nada.

> ⚠️ **Soluciones**: el informe `.md` del profesor incrusta el contenido de `soluciones/0N_*.md` (se lee de la web desplegada). Si abres `index.html` con doble clic (`file://`) el navegador bloquea esa lectura y el `.md` solo dejará la ruta del archivo.

## 📊 Cómo corrige el profesor

1. Entra como profesor y pulsa **📊 Resultados** en la cabecera.
2. Introduce la **contraseña del profesor**.
3. **Carga los JSON** que has descargado de Moodle (varios a la vez).
   - Hay **una fila por tarjeta**: iniciales, zona, fecha, tiempo y su **puntuación automática (0-5)** calculada de las respuestas.
   - El resumen por alumno avisa de quién **no ha entregado las 2 tarjetas** y suma su nota sobre **10** → **2,5 ponderados**.
4. Escribe la **nota del profesor (0-5 por tarjeta)** tras comparar con la rúbrica de `soluciones/`: la **nota final** es la del profesor si la hay, si no, la automática. Las notas quedan guardadas en el navegador.
5. Pulsa **⬇ .md** en la fila de la primera tarjeta: se descarga un informe **Markdown** con las respuestas, la comprobación del cálculo, una checklist de corrección y **la solución/rúbrica incrustada justo debajo de cada tarjeta**.
6. Si coincide → pones la nota de cada tarjeta (5 + 5 = **10** = 2,5 ponderados). 🗑 Vaciar borra la tabla y las notas.

## 🔧 Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Usuario y contraseña del profesor | `js/config.js` |
| URL de la tarea de Moodle | `js/config.js` → `MOODLE.urlTarea` |
| Escala: puntos por tarjeta, total y ponderaciones | `js/config.js` → `ESCALA_AUDITORIA` |
| Duración del examen | `js/config.js` → `CONFIG.duracionExamenSegundos` |
| Precio kWh | `js/config.js` → `CONFIG_AUDITORIA.precioKWh` |
| Añadir/quitar aparatos | `js/datos.js` → array `APARATOS` |
| Añadir tarjetas de auditoría | `js/auditoria/tarjetas.js` → array `TARJETAS` |
| Añadir fuentes | `js/auditoria/fuentes.js` |
| Colores y estilos | `css/styles.css` y `css/auditoria.css` |

## 🗺️ Hoja de ruta

- [x] **Paso 1** — Colocar aparatos por zonas con drag & drop
- [x] **Paso 2** — Login, cronómetro y persistencia
- [x] **Paso 3** — Modo examen
- [x] **Paso 4** — Preguntas de desbloqueo por zona
- [x] **Paso 5** — Módulo de auditoría con Ejercicio 6
- [x] **Paso 6** — Ejercicio Global retirado: solo queda el Ejercicio 6 con 2 tarjetas de las 6 zonas
- [ ] **Paso 7** — Ejercicio 3 (detectives de ineficiencias, 10 casos)
- [ ] **Paso 8** — Ejercicio 4 (auditoría de un aula real con mediciones)
- [x] **Paso 9** — Panel del profesor (JSON → .md con rúbrica incrustada, una nota por tarjeta 0-5, total 10 = 2,5 ponderados)
- [ ] **Paso 10** — Exportación a PDF con rúbrica automática

## 📄 Licencia

Material didáctico de uso libre para formación profesional.