# Paso 5 · Módulo de Auditoría Energética

## 🎯 Objetivo

Añadir un **segundo módulo** dentro del mismo dashboard que permita a los alumnos realizar auditorías energéticas por zonas siguiendo los ejercicios del curso: hoy está activo **solo el Ejercicio 6**, con **2 tarjetas aleatorias de las 6 zonas disponibles**.

## 🧩 Filosofía del módulo

- **Sin instrumentos de medida**: los datos vienen en **tarjetas didácticas**.
- **Aleatoriedad real**: cada alumno recibe tarjetas y variaciones distintas → no copian.
- **Distinguir D / O / I / H**: dato, observación, inferencia e hipótesis.
- **Cálculos con unidades**: kWh/mes, %, €, usando las fórmulas del curso.
- **Fuentes y normativa**: el alumno debe localizar datos concretos en fuentes oficiales.
- **Presupuesto limitado**: priorizar actuaciones con 1.500 € (o 8.000 € en otros ejercicios).
- **Verificación**: qué medir, con qué instrumento y para qué.

## 📑 Pestañas dentro del dashboard

[🔧 Colocar aparatos] [📋 Auditoría]


Ambas conviven en el mismo `index.html`. El módulo activo se guarda en `localStorage` con la clave `dashboard_modulo_activo`.

## 🎲 Aleatoriedad controlada por el profesor

- El profesor (o el alumno si no hay examen activo) pulsa **"🎲 Repartir tarjetas"**.
- Se sortean **2 tarjetas entre las 6 disponibles** (aula, pasillo, taller, despacho, biblioteca, gimnasio).
- Cada tarjeta tiene **3-4 variaciones** de sus datos numéricos (alumnos, luminarias, horas, temperaturas…).
- Dos alumnos con la misma tarjeta reciben números distintos → no copian.

Ejemplo:

| Tarjeta | Variación 1 | Variación 2 | Variación 3 |
|---|---|---|---|
| AULA | 25 alumnos, 10×40W, 2h | 23 alumnos, 8×40W, 1.5h | 27 alumnos, 12×40W, 2.5h |
| PASILLO | 18×25W, 3h | 16×25W, 2.5h | 20×22W, 3.5h |

## 📋 Ficha digital por zona

Cada tarjeta tiene 9 bloques:

1. **Condiciones interiores afectadas** (checkboxes).
2. **Factores exteriores** (checkboxes).
3. **Diagnóstico**: problema, evidencia, causa probable (texto libre).
4. **Clasificación D / O / I / H**: frases fijas + frase propia.
5. **Medidas de mejora** (2 propuestas).
6. **Verificación**: qué medir + con qué instrumento.
7. **Cálculo** con validación automática.
8. **Coste / Impacto / Dificultad** (radio + justificación).
9. **Mini-investigación**: fuente oficial + fuente técnica.

## 📌 Bloque de referencia fijo

- El bloque **Escenario · Datos para trabajar · Foco de análisis** de la tarjeta activa está en una **barra fija arriba** (`#fichaFija`, `position: sticky`), visible durante todo el examen aunque se haga scroll.
- La barra cambia de contenido al pulsar o enfocar otra tarjeta (`actualizarFichaFija`) y se puede plegar con el botón **▲** (`toggleFichaFija`).
- Se oculta cuando no hay tarjetas repartidas o al reiniciar el ejercicio.
- El **cronómetro** también está fijo (arriba a la derecha) y con letra grande para que el alumno no tenga que buscar cuánto tiempo lleva.

## 🧮 Validación mixta

- **Automática**:
  - Cálculos con tolerancia ±2%.
  - Presupuesto total y comparación con el límite.
  - Clasificación D / O / I / H de frases fijas.
  - Checkboxes de condiciones y factores correctos.
- **Manual** (por el profesor):
  - Campos abiertos (problema, causa, medidas, justificaciones, fuentes).
  - Se dejan en blanco en la **rúbrica del informe `.md`** (nota por tarjeta 0-5).

La puntuación auto se calcula al pulsar **"✓ Validar ficha"**:

| Bloque | Puntos auto |
|---|---|
| Condiciones interiores | 10 |
| Factores exteriores | 10 |
| Clasificación DOIH | 20 |
| Cálculo | 20 |
| **Pendiente manual** | **40** |
| **Total** | **100** |

## 💰 Presupuesto interactivo

- Al terminar las fichas, se muestra un bloque de **presupuesto limitado**.
- El alumno asigna un **coste estimado** a cada actuación prioritaria.
- Se valida automáticamente si está dentro del límite (1.500 € en Ejercicio 6).
- Se prioriza por ratio **impacto / coste** (función `calcularPriorizacion`).

## 📤 Envío de informe

Al pulsar **"📤 Enviar informe"**:

1. Se pide al alumno: nombre (obligatorio), iniciales, email (opcional). **No** se pide grupo ni clase.
2. Se descarga **un único archivo**:
   - **JSON** → respuestas completas de las 2 tarjetas, puntuación automática y datos del alumno → **lo sube a la tarea de Moodle**.
3. La puntuación **no la pone el alumno**: la calcula el ejercicio y la verifica el profesor en su panel.

### Estructura del JSON (`construirInformeJSON`)

- `alumno`: `{ nombre, iniciales, email }`.
- `tarjetas[]`: zona, respuestas por bloque, presupuesto y puntuación automática.
- `tiempo`, `fecha`, `escala` (puntos por tarjeta, puntos totales y ponderados).

### Limitaciones técnicas

- Un HTML abierto con `file://` **no puede escribir directamente en una carpeta del sistema** (por seguridad del navegador) → se descarga a la carpeta habitual y el alumno lo sube a Moodle.
- No se genera Excel ni se usa la File System Access API: el entregable es **solo el JSON**.

## 💾 Persistencia

- Se guarda automáticamente en `localStorage` con la clave `dashboard_auditoria_[rol]`.
- Al recargar, se restauran las tarjetas repartidas y todas las respuestas.
- El botón "🔄 Reiniciar" borra el progreso del ejercicio activo.

## ⏱️ Cronómetro y modo examen

- El cronómetro sigue corriendo desde el login, sea cual sea el módulo activo.
- Está **fijo** en pantalla y con tamaño grande.
- El modo examen del profesor bloquea:
  - **Pistas** (módulo colocar).
  - **Reset** (ambos módulos).
  - **Auto-colocar** (módulo colocar).
  - **Atajo Ctrl+Shift+A**.
- Al agotarse el tiempo se detiene todo y se muestra el estado final.

## 📌 Decisiones tomadas

- **Un único HTML** con pestañas → el alumno no cambia de pestaña del navegador.
- **Cronómetro compartido** entre módulos → el examen mide el tiempo total, y está fijo y grande.
- **Login único** → el rol aplica a ambos módulos.
- **Fichas por tarjeta** → cada una se valida por separado y se puede reabrir.
- **Referencia siempre visible** → Escenario/Datos/Foco en barra fija arriba.
- **Solo JSON** → un entregable claro para Moodle; sin Excel ni carpeta de resultados.
- **2 tarjetas de 6** (Ejercicio 6) → **10 puntos = 2,5 ponderados** (Colocar aparatos pondera 1,5).

## 🚧 Próximos pasos

- **Paso 6** — Panel del profesor **por tarjeta** (ya construido: nota 0-5 por tarjeta + `.md` con la rúbrica incrustada).
- **Paso 7** — URL de la tarea de Moodle en `js/config.js` (`MOODLE.urlTarea`).
- **Paso 8** — Revisar la visibilidad de `soluciones/` en el despliegue.
- **Paso 9** — Ampliar a más ejercicios (3 y 4) si el curso lo pide.
- **Paso 10** — Exportación a PDF con rúbrica automática.

## 📁 Archivos nuevos / modificados en este paso

### Nuevos
- `css/auditoria.css`
- `js/auditoria/tarjetas.js`
- `js/auditoria/fuentes.js`
- `js/auditoria/normativa.js`
- `js/auditoria/calculos.js`
- `js/auditoria/presupuesto.js`
- `js/auditoria/aleatorio.js`
- `js/auditoria/ficha.js`
- `js/auditoria/ui-auditoria.js`
- `js/auditoria/informe.js`

### Modificados
- `index.html` — pestañas + barra fija + modal informe (solo JSON)
- `js/config.js` — configuración auditoría + escala (5/tarjeta, 10 = 2,5)
- `js/estado.js` — estado auditoría + módulo activo
- `js/storage.js` — persistencia auditoría
- `js/login.js` — cambio de módulo
- `js/examen.js` — aplica a ambos módulos
- `js/main.js` — arranque + cierre de modales con Escape
- `css/styles.css` — cronómetro fijo y ampliado
- `README.md`
- `.gitignore`
