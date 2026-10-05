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
- **2 ejercicios asignados**: **Ejercicio 6** (3 zonas) y **Ejercicio Global** (2 zonas) → **50 + 50 = 100 puntos**.
- Analizar zonas del edificio a partir de tarjetas con datos didácticos.
- Distinguir entre **dato, observación, inferencia e hipótesis** (D / O / I / H).
- Realizar cálculos de ahorro energético con unidades correctas.
- Investigar con fuentes oficiales (CTE DB-HE, RITE, REBT) y técnicas.
- Priorizar actuaciones con presupuesto limitado.
- Razonar sin inventar datos: qué medir, con qué instrumento y para qué.
- **Al validar todas las fichas aparece 🖼️ Constancia (PNG)** para descargar y entregar.
- Al terminar, el alumno **autoevalúa su nota (0-50)** comparándose con las soluciones modelo y descarga el **JSON** para subirlo a **Moodle**.

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
  - Botón **📊 Resultados** (panel privado con contraseña): carga los JSON subidos a Moodle, muestra la **nota del alumno (0-50)** y permite poner la **nota del profesor (0-50)** → total 100. Además convierte cada JSON en un **informe `.md`** legible.
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
│ ├── tarjetas.js ← 10 tarjetas con variaciones aleatorias
│ ├── fuentes.js ← base de fuentes oficiales y técnicas
│ ├── normativa.js ← relación caso → normativa
│ ├── calculos.js ← fórmulas y validadores
│ ├── presupuesto.js ← lógica de presupuesto limitado
│ ├── aleatorio.js ← reparto aleatorio de tarjetas
│ ├── ficha.js ← render de la ficha de análisis
│ ├── ui-auditoria.js ← interfaz del módulo auditoría
│ ├── informe.js ← generación JSON + XLSX
│ └── storage-carpeta.js ← guardado en carpeta "resultados"
├── soluciones/
│ └── 01_aula.md … 10_salon_de_actos.md ← soluciones modelo (se reparten por Moodle,
│ se autocomprueba el alumno, NO se enlazan desde la web)
├── documentacion/
│ ├── pasos_1.md
│ ├── pasos_2.md
│ ├── pasos_3.md
│ ├── pasos_4.md
│ └── pasos_5.md
├── README.md
└── .gitignore


## 💾 Entrega del trabajo (auditoría)

Al terminar cada ejercicio de auditoría, pulsa **"📤 Enviar informe"**:

1. Rellena tu nombre, **tus iniciales** y **tu puntuación en este ejercicio (0-50)**: autoevalúate comparando tus respuestas con las soluciones modelo que te deja el profesor en **Moodle**.
2. Se descargan **dos archivos**:
   - `informe_[nombre]_[fecha].json` → **el archivo que subes a la tarea de Moodle**.
   - `informe_[nombre]_[fecha].xlsx` → informe tabulado con rúbrica.
3. Se abre **Moodle** en otra pestaña (si el profesor ha configurado la URL en `js/config.js`) para que subas el JSON.
4. **En Chrome/Edge** puedes pulsar además **"📁 Elegir carpeta resultados"** para que los siguientes informes se guarden ahí automáticamente sin pasar por Descargas.

> El progreso de cada ejercicio se guarda por separado: puedes hacer el Ejercicio 6 y después el Global sin perder nada.

> ⚠️ **Soluciones**: la carpeta `soluciones/` está pensada para repartirse por Moodle. Si no quieres que sea accesible por URL en la web desplegada, dilo y la quitamos del repositorio (los archivos se quedan en tu PC).

## 📊 Cómo corrige el profesor

1. Entra como profesor y pulsa **📊 Resultados** en la cabecera.
2. Introduce la **contraseña del profesor**.
3. **Carga los JSON** que han subido los alumnos (varios a la vez, Ejercicio 6 y Global).
   - Aparecen iniciales, ejercicio, fecha, tiempo, aciertos automáticos y la **nota que se autoevaluó el alumno (0-50)**.
   - El resumen por alumno avisa de quién **no ha entregado los 2 ejercicios**.
4. Escribe la **nota del profesor (0-50)**: la **nota final** de cada ejercicio es la del profesor si la hay, si no, la del alumno. Total de clase = 50 + 50 = **100**. Las notas quedan guardadas en el navegador.
5. Pulsa **⬇ .md** en la fila del alumno: se descarga un informe **Markdown** con sus respuestas, la comprobación del cálculo, su nota y una checklist para compararlo con `soluciones/`.
6. 🗑 Vaciar borra la tabla y las notas.

## 🔧 Personalización rápida

| Qué cambiar | Dónde |
|---|---|
| Usuario y contraseña del profesor | `js/config.js` |
| URL de la tarea de Moodle | `js/config.js` → `MOODLE.urlTarea` |
| Puntos por ejercicio (50) y ejercicios asignados | `js/config.js` → `ESCALA_AUDITORIA` |
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
- [x] **Paso 6** — Ejercicio Global (2 zonas) habilitado como segundo ejercicio asignado
- [ ] **Paso 7** — Ejercicio 3 (detectives de ineficiencias, 10 casos)
- [ ] **Paso 8** — Ejercicio 4 (auditoría de un aula real con mediciones)
- [x] **Paso 9** — Panel del profesor (JSON → .md, nota alumno 0-50 + nota profe 0-50, total 100)
- [ ] **Paso 10** — Exportación a PDF con rúbrica automática

## 📄 Licencia

Material didáctico de uso libre para formación profesional.