# Paso 5 · Módulo de Auditoría Energética

## 🎯 Objetivo

Añadir un **segundo módulo** dentro del mismo dashboard que permita a los alumnos realizar auditorías energéticas por zonas siguiendo los ejercicios del curso (Ejercicio 6 como base, con estructura preparada para los ejercicios Global, 3 y 4).

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
- Se sortean N tarjetas entre las 10 disponibles.
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

## 🧮 Validación mixta

- **Automática**:
  - Cálculos con tolerancia ±2%.
  - Presupuesto total y comparación con el límite.
  - Clasificación D / O / I / H de frases fijas.
  - Checkboxes de condiciones y factores correctos.
- **Manual** (por el profesor):
  - Campos abiertos (problema, causa, medidas, justificaciones, fuentes).
  - Se exportan en blanco en la rúbrica del XLSX.

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

1. Se pide al alumno: nombre (obligatorio), grupo, email.
2. Se descargan **dos archivos**:
   - **JSON** → datos completos (para guardar / procesar).
   - **XLSX** → informe tabulado con 5 hojas (Portada, Respuestas, Cálculos, Presupuesto, Rúbrica).
3. **En Chrome/Edge**:
   - Aparece el botón **"📁 Elegir carpeta resultados"**.
   - Se pide permiso una vez y se guarda el handle en **IndexedDB**.
   - Los siguientes informes se guardan **automáticamente** en esa carpeta, sin pasar por Descargas.

### Limitaciones técnicas

- Un HTML abierto con `file://` **no puede escribir directamente en una carpeta del sistema** (por seguridad del navegador).
- La File System Access API solo funciona en **Chrome y Edge** (no Firefox / Safari).
- En otros navegadores, el informe va a la carpeta de Descargas y el alumno lo mueve a mano.

## 📊 Excel generado

El XLSX contiene **5 hojas**:

1. **Portada** — alumno, fecha, ejercicio, puntuación, presupuesto.
2. **Respuestas** — todas las respuestas de las N tarjetas, apartado por apartado.
3. **Cálculos** — fórmula, respuesta del alumno, respuesta correcta y veredicto.
4. **Presupuesto** — coste por tarjeta + totales + dentro/fuera del límite.
5. **Rúbrica** — criterios de evaluación con espacios para corrección manual.

## 💾 Persistencia

- Se guarda automáticamente en `localStorage` con la clave `dashboard_auditoria_[rol]`.
- Al recargar, se restauran las tarjetas repartidas y todas las respuestas.
- El botón "🔄 Reiniciar" borra el progreso del ejercicio activo.

## ⏱️ Cronómetro y modo examen

- El cronómetro sigue corriendo desde el login, sea cual sea el módulo activo.
- El modo examen del profesor bloquea:
  - **Pistas** (módulo colocar).
  - **Reset** (ambos módulos).
  - **Auto-colocar** (módulo colocar).
  - **Atajo Ctrl+Shift+A**.
- Al agotarse el tiempo se detiene todo y se muestra el estado final.

## 📌 Decisiones tomadas

- **Un único HTML** con pestañas → el alumno no cambia de pestaña del navegador.
- **Cronómetro compartido** entre módulos → el examen mide el tiempo total.
- **Login único** → el rol aplica a ambos módulos.
- **Fichas por tarjeta** → cada una se valida por separado y se puede reabrir.
- **JSON + XLSX** → el primero para procesar, el segundo para leer.
- **Guardado en carpeta** → opcional, no bloquea el flujo si no está disponible.

## 🚧 Próximos pasos

- **Paso 6** — Añadir el Ejercicio Global (2 zonas + sensores + protocolos + envolvente).
- **Paso 7** — Añadir el Ejercicio 3 (10 casos de ineficiencia + presupuesto 8.000 €).
- **Paso 8** — Añadir el Ejercicio 4 (auditoría de aula real con mediciones).
- **Paso 9** — Panel del profesor para ver todos los informes recibidos.
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
- `js/auditoria/storage-carpeta.js`

### Modificados
- `index.html` — pestañas + modal informe
- `js/config.js` — configuración auditoría
- `js/estado.js` — estado auditoría + módulo activo
- `js/storage.js` — persistencia auditoría
- `js/login.js` — cambio de módulo
- `js/examen.js` — aplica a ambos módulos
- `js/main.js` — arranque + cierre de modales con Escape
- `README.md`
- `.gitignore`
