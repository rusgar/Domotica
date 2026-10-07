# Paso 5 · Módulo de Auditoría Energética

## 🎯 Objetivo

Añadir un **segundo módulo** dentro del mismo dashboard que permita a los alumnos realizar auditorías energéticas por zonas siguiendo los ejercicios del curso: hoy está activo **solo el Ejercicio Auditoría**, con **2 tarjetas aleatorias de las 10 zonas disponibles**.

## 🧩 Filosofía del módulo

- **Sin instrumentos de medida**: los datos vienen en **tarjetas didácticas**.
- **Aleatoriedad real**: cada alumno recibe tarjetas y variaciones distintas → no copian.
- **Distinguir D / O / I / H**: dato, observación, inferencia e hipótesis.
- **Cálculos con unidades**: kWh/mes, %, €, usando las fórmulas del curso.
- **Fuentes y normativa**: el alumno debe localizar datos concretos en fuentes oficiales.
- **Presupuesto limitado**: priorizar actuaciones con **750 € por tarjeta** (1.500 € en total; el precio es obligatorio en el apartado 8).
- **Verificación**: qué medir, con qué instrumento y para qué.

## 📑 Pestañas dentro del dashboard

[🔧 Colocar aparatos] [📋 Auditoría]


Ambas conviven en el mismo `index.html`. El módulo activo se guarda en `localStorage` con la clave `dashboard_modulo_activo`.

## 🎲 Aleatoriedad controlada por el profesor

- El profesor (o el alumno si no hay examen activo) pulsa **"🎲 Repartir tarjetas"**.
- Se sortean **2 tarjetas entre las 10 disponibles** (aula, pasillo, taller, despacho, biblioteca, gimnasio, vestíbulo, comedor, aseo y salón de actos), **siempre zonas distintas**.
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
8. **Coste / Impacto / Dificultad** (radio + justificación) y **lista de aparatos + precio de la actuación (obligatorio)**.
9. **Mini-investigación**: fuente oficial + fuente técnica.

## 📌 Bloque de referencia fijo

- El bloque **Escenario · Datos para trabajar · Foco de análisis** de la tarjeta activa está en una **barra fija arriba** (`#fichaFija`, `position: sticky`), visible durante todo el examen aunque se haga scroll.
- La barra cambia de contenido al pulsar o enfocar otra tarjeta (`actualizarFichaFija`) y se puede plegar con el botón **▲** (`toggleFichaFija`).
- Se oculta cuando no hay tarjetas repartidas o al reiniciar el ejercicio.
- El **cronómetro** también está fijo (arriba a la derecha) y con letra grande para que el alumno no tenga que buscar cuánto tiempo lleva.

## 🧮 Validación (automática) y revisión

- **Automática** (la **única que cuenta** para la nota):
  - Cálculos con tolerancia ±2%.
  - Clasificación D / O / I / H de frases fijas.
  - Checkboxes de condiciones y factores correctos.
- **Revisión** (con la rúbrica del informe `.md`, **sin nota manual**):
  - Campos abiertos (problema, causa, medidas, justificaciones, fuentes).
  - **No puntúan**: se comparan con la solución incrustada (modelo exacto o parecido).
- **Obligatorios** (no puntúan, pero **bloquean la entrega**):
  - Precio de la actuación en el apartado 8 de cada tarjeta (vacío o por encima del tope → no se puede descargar el JSON).

La puntuación auto se calcula al pulsar **"✓ Validar ficha"**:

| Bloque | Puntos |
|---|---|
| Condiciones interiores | 10 |
| Factores exteriores | 10 |
| Clasificación DOIH | 20 |
| Cálculo | 20 |
| **Campos abiertos (no puntúan)** | **40** |
| **Total** | **100** |

La nota de la tarjeta = **aciertos auto / máx. auto × 5** → **× 1,25** = ponderación
(máx. 1,25 por tarjeta; 2 tarjetas = **2,5**).

## 💰 Presupuesto (apartado 8 · obligatorio)

- **Lista de aparatos**: un desplegable con **todo el catálogo** `APARATOS` agrupado por tipo
  (exterior · envolvente · interior · eléctrico · hidráulico · térmico · control y actuadores · gateway/IoT).
  El alumno añade aparatos, **repite cantidades** (botones − / +), los quita con 🗑 y la lista
  muestra precio por unidad y subtotal.
- **El precio se rellena solo**: al cambiar la lista, `refrescarMateriales()` escribe la **suma** en el
  campo del precio (editable: si lo sobrescribe a mano se marca como ajuste manual).
- **Tope por tarjeta: 750 €** (`ESCALA_AUDITORIA.presupuestoPorTarjeta`), 1.500 € en total.
- **Obligatorio**: si está vacío o se pasa del tope, `generarInforme()` bloquea la descarga del JSON.
- **Coherencia**: con lista → el precio debe **cuadrar con la suma** (±1 €); sin lista →
  `precioCoherenteCatalogo()` compara con `APARATOS` con tolerancia **±20 %**. En ambos casos hay
  aviso ámbar si no encaja (se permite escribir otro precio, pero queda marcado).
- El estado se muestra en tres sitios: en el **apartado 8**, en la **barra fija** de la tarjeta
  activa (`presupuestoFijaHTML`) y en la **cabecera** (`renderCabeceraAuditoria`).
- **No puntúa**: solo es un requisito de entrega (se revisa en el `.md`, que lista los aparatos elegidos).
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

- El cronómetro de sesión sigue corriendo desde el login, sea cual sea el módulo activo.
- Está **fijo** en pantalla y con tamaño grande.
- **Cronómetro del Ejercicio Auditoría** (`state.auditoria.segundos`, `iniciarCronometroAuditoria`):
  cuenta **solo** el tiempo del ejercicio (arranca al entrar y al repartir tarjetas, se guarda y
  restaura en `localStorage`) y es el que aplica la penalización.
- **Cronómetro del Ejercicio Colocar** (`state.colocar.segundos`, `iniciarCronometroColocar`,
  `#tiempoColocar`): corre **solo con el módulo Colocar activo** (se pausa al cambiar de módulo y
  se restaura en `localStorage` como `segundosEjercicioColocar`).
- **Penalización por exceso de tiempo**: más de **60 min**
  (`ESCALA_AUDITORIA.limiteTiempoMinutos`) → **−0,25** (`ESCALA_AUDITORIA.penalizacionTiempo`),
  es decir **1 décima del total de 2,5**. Se comunica al alumno en el enunciado inicial y aparece:
  - en la cabecera (`#tiempoEjercicio` en rojo con `⏰ … (−0,25)`),
  - en el panel del profesor (badge `⏰ −0,25` en la columna Tiempo y en el resumen por alumno),
  - en el `.md` (fila de tiempo, cita de penalización y checklist).
- **Penalización en Colocar**: más de **60 min** (`ESCALA_COLOCAR.limiteTiempoMinutos`) →
  **−0,1** (`ESCALA_COLOCAR.penalizacionTiempo`) sobre **1,0**; la aplica el panel al calcular la
  nota del **JSON** del alumno (también en el badge `⏰ −0,1`, el resumen y el `.md`).
- El modo examen del profesor bloquea:
  - **Pistas** (módulo colocar).
  - **Reset** (ambos módulos).
  - **Auto-colocar** (módulo colocar).
  - **Atajo Ctrl+Shift+A**.
- Al agotarse el tiempo se detiene todo y se muestra el estado final.

## 📌 Decisiones tomadas

- **Un único HTML** con pestañas → el alumno no cambia de pestaña del navegador.
- **Cronómetro compartido** entre módulos → el examen mide el tiempo total, y está fijo y grande;
  cada ejercicio además lleva su **propio reloj** (Auditoría y Colocar) con su penalización.
- **Login único** → el rol aplica a ambos módulos.
- **Fichas por tarjeta** → cada una se valida por separado y se puede reabrir.
- **Referencia siempre visible** → Escenario/Datos/Foco en barra fija arriba.
- **Solo JSON** → un entregable claro para Moodle; sin Excel ni carpeta de resultados.
- **2 tarjetas de 10** (Ejercicio Auditoría) → **10 puntos = 2,5 ponderados** (Colocar aparatos pondera 1,0).
- **Presupuesto por tarjeta y obligatorio** → 750 € por tarjeta, precio en el apartado 8 y aviso
  si no encaja con el catálogo (±20 %); no puntúa, pero bloquea la entrega si falta.
- **Penalización de tiempo** → más de 60 min en el ejercicio (reloj propio) resta **0,25** de 2,5
  en Auditoría y **0,1** de 1,0 en Colocar, indicada en el enunciado inicial.
- **Colocar se corrige con JSON + captura** → el alumno sube ambos a Moodle; la nota es **solo
  automática** y sale del `puntos` del JSON (**8 zonas × 0,125 = 1,0**, parcial por aparato):
  `puntos × 1,0 − penalización`. La captura es la evidencia y se adjunta en el panel
  (botón **＋ 📷** / **📷 Ver**).
- **Puntuación parcial de Colocar** → cada zona vale **0,125** y cada aparato
  `0,125 / nº de aparatos de esa zona`; **sin nota manual** y **sin bloqueos**: si la zona no
  está perfecta, el pop-up «¿Quieres dejarlo así o poner más?» deja la zona **📌 aceptada**.
  El ejercicio termina cuando las **8 zonas** están dadas por buena (✅ o 📌).
- **Sin grupos en el banco** → lista alfabética y sin contadores; los aparatos de relleno
  (`opcional: true`) no puntúan y no cambian la solución de referencia.

## 🚧 Próximos pasos

- **Paso 6** — Panel del profesor **por tarjeta** (ya construido: nota **solo automática** = Auto/5 × 1,25 → 2,5 en total + `.md` con la rúbrica incrustada).
- **Paso 7** — URL de la tarea de Moodle en `js/config.js` (`MOODLE.urlTarea`).
- **Paso 8** — ✅ Decidido: `soluciones/` **sin ningún enlace** en la interfaz, accesible solo por URL directa.
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
