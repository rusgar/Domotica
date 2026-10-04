# Plan: Constancias PNG + JSON con iniciales + panel del profesor (examen práctico)

## Contexto y decisiones ya tomadas (con el usuario)

Web objetivo: `https://conectoresdicampus.netlify.app/` = este proyecto (`C:\Users\edama\OneDrive\Documentos\Domotica`) desplegado.

Respuestas del usuario a las preguntas:
1. **Imagen** = tarjeta resumen dibujada con **canvas** (sin html2canvas ni dependencias nuevas).
2. **Notas ocultas al alumno**: sí — solo las ve el profesor **con la misma clave** (`profe`/`domotica2025` de `js/config.js`).
3. **JSON con iniciales** = descarga por el alumno **+ panel de profesor** donde carga los JSON y los ve.
4. **JSON en ambos módulos**: Colocar aparatos **y** Auditoría.
5. **Constancia de auditoría**: botón **al completar TODAS las fichas** (una sola imagen por ejercicio).
6. Duda del usuario «gimnasio da 40 de 80, ¿no debería ser 80 de 80?» → **no es bug**: 40 pts son auto (CI+FE+DOIH = 10+10+20; Gimnasio no tiene cálculo ⇒ total 80) y 40 pts son **corrección manual** que nunca se otorgan solos. Se corrige la **redacción** para que diga `40/40 auto (100%) + 40 manuales pendientes` en vez de `40 de 80 · 50 %` (el alumno ya no lo verá de todos modos; sí el profesor).

Constantes de contexto: cronómetro arranca ya al entrar (`js/login.js:87`, funciona); tiempo en `state.cronometro.segundos`; 42 aparatos; examen = 5 min (`js/config.js:10`); única dependencia CDN = ExcelJS (`index.html:10`).

## Tareas

### 1. NUEVO `js/constancia.js` — imágenes canvas + iniciales + JSON Colocar
- `getIniciales()` / `pedirIniciales()`: lee `localStorage.dashboard_iniciales`; si falta o está vacío, `prompt('Tus iniciales (2-4 letras):')` (validar 2–4, mayúsculas) y guardar. Estilo `alert/prompt` igual que el resto del proyecto.
- `descargarCanvasComoPNG(canvas, nombre)`: `canvas.toBlob` → `<a download>`.
- `dibujarConstancia(opts)`: canvas ~1000×560, fondo `#0f172a`, borde verde, título `CONSTANCIA DE EXAMEN`, subtítulo módulo, línea grande `✓ TODO CORRECTO` (Colocar) / `✓ TODAS LAS FICHAS VALIDADAS` (Auditoría), filas: Iniciales · Tiempo (`formatearTiempo`) · Fecha (`toLocaleString('es-ES')`) · detalle (42 aparatos / N fichas) · pie `Dashboard Domótica · Conectores DCampus`. **Sin puntuaciones.**
- `descargarConstanciaColocar()` y `descargarConstanciaAuditoria(fichas, tarjetas)` envuelven lo anterior.
- `descargarJSONColocar()`: objeto `{ tipo:'colocar', version, fecha, iniciales, tiempoSegundos, tiempoLegible, aciertos, total:42, zonasVerificadas, examenActivo, usuario }` → `constancia_colocar_<INICIALES>_fecha.json`.

### 2. `js/validacion.js` — botones en la victoria + ocultar notas al alumno
- `mostrarVictoria()` (≈170-187) y el bloque de victoria dentro de `verificarTodo()` (≈318-319): añadir dos botones `📥 Descargar constancia (PNG)` → `descargarConstanciaColocar()` y `📄 Descargar JSON` → `descargarJSONColocar()`.
- `actualizarScore()` (25-35): mostrar `.score` **solo si `state.usuario === 'profe'`** (alumno nunca ve «Aciertos X / 42»).
- `verificarTodo()` rama de error (321-330): si alumno, mensaje sin aciertos numéricos (`Aún hay errores · Sin colocar: N`); profe mantiene el desglose.
- `mostrarPista`/pistas: sin cambios.

### 3. Auditoría: botón constancia al completar + notas solo profe
- `js/auditoria/ui-auditoria.js` → `actualizarProgresoGlobal()` (73-84): cuando `totalValidadas === total && total > 0`, crear/mostrar botón `📥 Descargar constancia (PNG)` (elemento dinámico tras el subtítulo o al final de `#tarjetasLista`) → `descargarConstanciaAuditoria()`; ocultarlo al resetear.
- `js/auditoria/ficha.js` → `validarFicha()` (385-419):
  - Alumno: resultado = `Ficha N validada ✓` (sin números); cabecera de tarjeta = `✓ Validada` (sin `% auto`).
  - Profesor: redacción nueva del bloque (406-415) → `Aciertos automáticos: 40/40 (100 %) · Corrección manual pendiente: 40 puntos · Nota final hasta: 80`.
- `js/auditoria/calculos.js` → `calcularPuntuacionFicha()` (90-150): añadir `autoMax = total - 40` y `porcentajeAuto = obtenido/autoMax*100` (redondeo 1 dec.). `porcentaje` legacy se mantiene por si el XLSX lo usa.

### 4. JSON de auditoría con iniciales
- `index.html` modal informe (279-292): campo `Iniciales *` (`#informeIniciales`, `maxlength=4`, mayúsculas).
- `js/auditoria/informe.js`: validar iniciales en `generarInforme()` (302-306) y añadir `alumno.iniciales` en `construirInformeJSON()` (26-30). El JSON ya lleva tiempo y puntuación (23-24, 31-35).

### 5. NUEVO `js/panel-profesor.js` — desbloqueo y carga de resultados
- Botón `📊 Resultados` en header: solo visible para profe (mostrar/ocultar en `js/login.js` junto a `#btnAuto`/`#btnExamen`, 37-43).
- Al pulsar: `prompt`/campo con la clave (`CREDENCIALES_PROFE.password`); si falla → no se abre («desbloquear»).
- Modal: `<input type="file" multiple accept=".json">` → parsea cada JSON y detecta tipo (`json.tipo === 'colocar'` o `json.meta`/`json.tarjetas` = informe auditoría).
- Tabla: Iniciales · Módulo/Ejercicio · Fecha · Tiempo · Puntuación auto (`aciertosAuto/totalMaximo` o `aciertos/42`) · estado. Orden por iniciales; aviso si JSON inválido; contador de registros. Lista en memoria de la sesión (sin persistir).
- `index.html`: modal `#panelResultados` (clase `modal` existente) + script tag.

### 6. `index.html` + `css/styles.css`
- 2 script tags nuevos (orden: tras `js/auditoria/informe.js`, antes de `js/main.js`).
- Estilos: `.btn-constancia`, `.btn-json`, `#panelResultados` tabla (reutilizar clases modal/botones existentes). Nada de CDN nuevas.

### 7. Documentación
- Actualizar `documentacion/pasos_1.md` (constancia Colocar + score solo profe) y `documentacion/pasos_2.md`/`pasos_3.md` (iniciales, constancia auditoría, panel profesor, redacción puntuación).

## Orden de ejecución
1. `js/constancia.js` + botones en `validarZona/mostrarVictoria/verificarTodo` (validación Colocar).
2. Ocultar `.score` y números a alumno (Colocar + Auditoría).
3. Redacción puntuación (`calculos.js` + `ficha.js`).
4. Iniciales en modal informe + JSON (`index.html`, `informe.js`).
5. Constancia al completar todas las fichas (`ui-auditoria.js`).
6. `js/panel-profesor.js` + botón header (`login.js`) + modal + CSS.
7. Docs.

## Verificación
- `python "C:\Users\edama\AppData\Local\Temp\opencode\jscheck.py"` con todos los `.js` tocados tras cada bloque (exit 0).
- Prueba manual en navegador (usuario): victoria Colocar → 2 descargas con iniciales correctas; alumno sin «Aciertos»; profe sí; auditoría 3/3 → constancia; informe exige iniciales; panel pide clave y tabla correcta.

## Riesgos/notas
- Sin `node`: solo jscheck (balance de llaves/strings).
- Los commits los hace el usuario.
- La clave de profe en cliente no es secreto real (visible en dev-tools); se acepta por ser proyecto didáctico.
- No se toca el flujo de examen/cronómetro ni la lógica de validación por zona (ya aprobada).
