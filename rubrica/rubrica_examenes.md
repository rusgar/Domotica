# Rúbrica de evaluación · Dashboard Domótica (Conectores DCampus)

| | |
|---|---|
| **Módulo** | Práctica de Domótica · Dashboard de Monitorización |
| **Plataforma** | `https://conectoresdicampus.netlify.app/` (repo `rusgar/Domotica`) |
| **Pruebas evaluadas** | 1 · **Ejercicio Auditoría** (pondera **2,5**) · 2 · **Colocar aparatos** (pondera **1,0**) |
| **Entregas** | Archivos **JSON** descargados desde la web + **captura de pantalla** (Colocar) subidos a la tarea de **Moodle** |
| **Corrección** | **100 % automática** en la web (panel 📊 Resultados); la rúbrica y las soluciones de `soluciones/` sirven para **revisar y justificar** la nota |
| **Versión** | 1.0 · vigente para la convocatoria actual |

> **Principio de la corrección:** ninguna nota se escribe a mano en la plataforma. La nota sale
> exclusivamente de las respuestas del alumno (JSON) y del reloj de cada ejercicio. Esta rúbrica
> documenta **qué se evalúa, cómo se calcula y con qué evidencias** para poder sostener ante el
> centro la nota asignada a cada alumno.

---

## Resumen de la ponderación

| Prueba | Puntos crudos | Sobre la nota del examen | Entregable |
|---|---:|---:|---|
| **A · Ejercicio Auditoría** (2 tarjetas × 5 pts) | 10 | **0 – 2,5** | `JSON` de las 2 tarjetas (+ constancia PNG) |
| **B · Colocar aparatos** (8 zonas × 0,125) | 10 (0–10) | **0 – 1,0** | `JSON` + **captura de pantalla** (+ constancia PNG) |
| **Total de estas pruebas** | — | **0 – 3,5** | El resto de la nota del examen corresponde a otras pruebas del centro |

---

# A · Rúbrica del Ejercicio Auditoría

**Enunciado:** se reparten **2 tarjetas aleatorias distintas** de las 10 zonas del banco; en cada
tarjeta el alumno analiza el escenario (condiciones, factores, clasificación D/O/I/H, cálculo de
ahorro, medidas y presupuesto) y entrega **un único JSON** con las dos.

## A.1 · Criterios y ponderación (máximo 5 puntos por tarjeta)

| # | Criterio (bloque de la ficha) | Puntos | Tipo de corrección | Se comprueba con |
|---|---|---:|---|---|
| 1 | **Condiciones interiores** seleccionadas correctamente | 10 | Automática (checkboxes) | JSON · panel 📊 |
| 2 | **Factores exteriores** seleccionados correctamente | 10 | Automática (checkboxes) | JSON · panel 📊 |
| 3 | **Clasificación D / O / I / H** de las frases | 20 | Automática (frases fijas) | JSON · panel 📊 |
| 4 | **Cálculo de ahorro/medidas** con tolerancia **±2 %** y unidades correctas | 20 | Automática | JSON · panel 📊 |
| 5 | **Campos abiertos** (problema, causa, medidas propias, justificación, fuentes) | 40 | **Revisión con rúbrica** → **no puntúan** | Informe **`.md`** con la solución incrustada |
| — | **Presupuesto** (apartado 8): importe rellenado, ≤ **750 €/tarjeta** y coherente con el catálogo (±20 %) | 0 | **Obligatorio**: vacío → **bloquea la entrega** | JSON · `.md` |
| | **Total por ficha** | **100** | **60 automáticos + 40 de revisión** | |

- **Máximo automático real = 100 − 40 = 60** en la mayoría de fichas; si una ficha no tiene bloque
  de cálculo (p. ej. Gimnasio), su máximo automático es **40**. La nota **siempre** se calcula
  sobre el máximo automático real de esa ficha.
- **Nota de la tarjeta** = `aciertos automático / máximo automático × 5` → rango **0 – 5**.
- **Ponderación de la tarjeta** = `nota / 5 × 1,25` = `aciertos / máximo automático × 1,25` →
  máximo **1,25**; las 2 tarjetas suman **10 puntos crudos** → **2,5 ponderados**.

## A.2 · Niveles de desempeño (orientativo: traslado de la nota automática)

| Nivel | % de acierto automático | Nota por tarjeta | Ponderación por tarjeta | Indicadores |
|---|---|---|---|---|
| **Excelente** | ≥ 90 % | 4,5 – 5,0 | 1,13 – 1,25 | Sin errores en DOIH ni en el cálculo; unidades y decimales correctos; campos abiertos **iguales o equivalentes** a la solución |
| **Notable** | 75 – 89 % | 3,75 – 4,45 | 0,94 – 1,11 | Cálculo correcto con errores menores; DOIH casi completo; campos abiertos próximos al modelo |
| **Suficiente** | 60 – 74 % | 3,0 – 3,70 | 0,75 – 0,93 | Bloques básicos superados; algún error de cálculo dentro de la tolerancia; campos abiertos con la idea principal |
| **No alcanzado** | < 60 % | 0 – 2,95 | 0 – 0,74 | Fallos en DOIH y/o cálculo; campos abiertos irrelevantes o vacíos |

> Los campos abiertos **no suman ni restan puntos**, pero se revisan en el informe `.md`
> (checklist: DOIH, cálculo, fuentes oficiales, presupuesto, tiempo) y sirven de **soporte** para
> confirmar que la respuesta automática no es casual ni copiada.

## A.3 · Penalizaciones y bloqueos

| Situación | Efecto |
|---|---|
| Superar **60 min** en el Ejercicio Auditoría (reloj propio del ejercicio) | **−0,25** (1 décima de los 2,5) sobre la ponderación total |
| Precio vacío en el apartado 8 de cualquiera de las 2 tarjetas | **No se puede entregar** el JSON |
| Precio > 750 € por tarjeta o fuera de coherencia con el catálogo (±20 %) | Aviso y marca en el informe; revisión del profesor |
| Modo examen activo | Sin pistas, sin reinicio, sin auto-colocación; cuenta atrás de 5 min |

---

# B · Rúbrica del módulo Colocar aparatos

**Enunciado:** hay **8 zonas** del edificio bloqueadas por una **pregunta teórica**; hay que
colocar los aparatos del banco en su zona y validar cada zona. Hay **42 aparatos obligatorios**
que puntúan y **14 de relleno** (`opcional: true`) que **no puntúan**. No se admiten aparatos
repetidos.

## B.1 · Criterio principal: puntuación parcial por zona (8 × 0,125 = 1,0)

Cada zona vale lo mismo (**0,125**) y, dentro de la zona, cada aparato vale
`0,125 / nº de aparatos obligatorios de esa zona`:

| Zona | Aparatos obligatorios | Puntos de la zona | Valor de **cada** aparato | Ejemplo |
|---|---:|---:|---:|---|
| 🌤️ Exterior / Cubierta | 7 | 0,125 | **0,0179** | 5 de 7 bien → 5 × 0,0179 = **0,089** |
| 🧱 Envolvente | 2 | 0,125 | **0,0625** | 1 de 2 bien → **0,063** |
| 🛋️ Interior | 8 | 0,125 | **0,0156** | 8 de 8 bien → **0,125** |
| ⚡ Eléctrico | 3 | 0,125 | **0,0417** | 3 de 3 bien → **0,125** |
| 🚰 Hidráulico | 4 | 0,125 | **0,0313** | 2 de 4 bien → **0,063** |
| 🌡️ Térmico | 5 | 0,125 | **0,0250** | 4 de 5 bien → **0,100** |
| 🎛️ Control / Actuadores | 7 | 0,125 | **0,0179** | 6 de 7 bien → **0,107** |
| 📡 Gateway / IoT | 6 | 0,125 | **0,0208** | 6 de 6 bien → **0,125** |
| **Total** | **42** | **1,0** | — | Suma de las 8 zonas ÷ 8 = **nota 0–1** |

- **Puntos del ejercicio** = media de las 8 zonas → rango **0 – 1**.
- **Nota (0–10)** = `puntos × 10` · **Ponderación (0–1,0)** = `puntos × 1,0 − penalización de tiempo`.
- **Aparatos de relleno**: en zonas válidas **no suman ni restan**; los que estén en una zona que
  no les corresponde tampoco penalizan (solo cuentan los obligatorios bien colocados).

## B.2 · Reglas de validación (cómo se da por buena una zona)

| Situación al pulsar «✓ Validar» | Resultado visual | Efecto |
|---|---|---|
| **Zona perfecta**: los obligatorios están todos ahí y sin intrusos | Zona **verde ✅**, botón «✅ Validada» | Zona **terminada** y puntúa al máximo |
| **Zona imperfecta** (falta o sobra algo) | Pop-up **«¿Quieres dejarlo así o poner más?»** sin decir qué falta | **📌 Dejarlo así** → zona terminada con lo que haya · **➕ Poner más** → se cierra y sigue editando |
| Añadir o quitar aparatos tras aceptarla | La zona se puede **volver a validar** | La nota se recalcula en vivo |
| **Fin del ejercicio** | Pantalla «EJERCICIO TERMINADO» | Las **8 zonas** están dadas por buena (✅ o 📌): se para el reloj y aparecen los botones de entrega |

> **No existe nota manual ni vaciado de zonas:** nada más se penaliza con el pop-up ni se borra el
> trabajo hecho; repetir cuesta **tiempo**, no puntos.

## B.3 · Niveles de desempeño (orientativo)

| Nivel | Puntos (0–1) | Nota (0–10) | Indicadores |
|---|---|---|---|
| **Excelente** | ≥ 0,90 | 9,0 – 10 | Casi todas las zonas ✅; los fallos son aparatos de relleno o alguna zona con 1 pendiente |
| **Notable** | 0,75 – 0,89 | 7,5 – 8,9 | Varias zonas completas y el resto muy avanzadas |
| **Suficiente** | 0,60 – 0,74 | 6,0 – 7,4 | Mayoría de zonas dadas por buena con faltas puntuales |
| **No alcanzado** | < 0,60 | 0 – 5,9 | Zonas a medias o con muchos aparatos mal colocados |

## B.4 · Penalizaciones y requisitos

| Situación | Efecto |
|---|---|
| Superar **60 min** en el Ejercicio Colocar (reloj propio, se pausa al cambiar de módulo) | **−0,1** sobre los 1,0 ponderados |
| No terminar las 8 zonas | El ejercicio **no se da por terminado** (no hay pantalla final ni JSON automático) |
| Falta de **captura de pantalla** | Falta evidencia: la fila del panel queda sin verificación visual |
| Aparatos repetidos | Imposible: la plataforma retira el chip de la zona anterior |
| Modo examen activo | Sin pistas, sin reinicio, sin auto-colocación |

---

## C · Cálculo de la nota final de estas pruebas

```
Nota Auditoría = (aciertos auto tarjeta 1 / máx. auto × 5 / 5) × 1,25
               + (aciertos auto tarjeta 2 / máx. auto × 5 / 5) × 1,25 − (0,25 si > 60 min)
               = aciertos auto / máx. auto × 2,5                        → 0 – 2,5

Nota Colocar   = Σ(zonas) / 8                                          → 0 – 1,0
               − (0,1 si > 60 min)
```

| Ejemplo | Auditoría | Colocar | Total |
|---|---:|---:|---:|
| Ambas tarjetas al 100 % · Colocar sin errores y < 60 min | 2,50 | 1,00 | **3,50** |
| Tarjetas al 80 % · Colocar: 80 % de los aparatos en su zona (0,80) | 2,00 | 0,80 | **2,80** |
| Tarjetas al 65 % · Colocar: 0,60 con zonas aceptadas y 65 min | 1,63 | 0,50 | **2,13** |

---

## D · Hoja de registro por alumno (para el acta / la revisión)

| Iniciales | Nombre | Auditoría aciertos (auto / máx) | Nota tarjeta 1 | Nota tarjeta 2 | Penaliz. tiempo (Aud.) | **Pond. Aud. (0–2,5)** | Colocar puntos (0–1) | Tiempo Colocar | Penaliz. (Col.) | **Pond. Col. (0–1,0)** | **Total (0–3,5)** | Observaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |
| | | | | | | | | | | | | |

---

## E · Evidencias de cada alumno (qué archivar)

| Evidencia | Prueba | Dónde está | Para qué sirve |
|---|---|---|---|
| `resultado_auditoria_*.json` | Auditoría | Moodle → panel 📊 | Fuente de la nota automática |
| `resultado_colocar_*.json` (v2.0) | Colocar | Moodle → panel 📊 | Fuente de la nota (`zonas`, `puntos`, `puntosEjercicio`) |
| **Captura de pantalla** con el reloj visible | Colocar | Moodle → panel (＋ 📷 / 📷 Ver) | Comprueba que el JSON corresponde a esa sesión y el tiempo |
| Constancia PNG (iniciales + tiempo + fecha) | Ambas | Descarga del alumno | Justificante de entrega (sin notas) |
| Informe **`.md`** generado por el panel | Ambas | Panel 📊 · botón ⬇ .md | Respuestas + **solución/rúbrica incrustada** + checklist de revisión |
| Soluciones modelo | Ambas | `soluciones/01_aula.md` … `10_salon_de_actos.md` | Contraste para verificar (no se muestran al alumno) |
| Solución visual de Colocar | Colocar | `img/Captura de pantalla 2026-10-04 094925.png` | Los 42 obligatorios deben coincidir con esa distribución |

---

## F · Reglas comunes de evaluación

1. **Todo automático**: la plataforma no admite editar notas; el panel solo calcula a partir del JSON.
2. **Los alumnos no ven ninguna nota ni porcentaje**: solo saben si han terminado el ejercicio y
   cuántas zonas han dado por buena (Colocar). Las notas las ve únicamente el profesor.
3. **Modo examen** (cuenta atrás de 5 min): bloquea pistas, reinicio y auto-colocación; al agotarse
   el tiempo se verifica el estado del módulo activo.
4. **Repetir no penaliza**: en Colocar ninguna validación fallida borra trabajo ni resta puntos;
   el único coste es el tiempo.
5. **Trazabilidad**: cualquier nota puede reconstruirse con el JSON del alumno + esta rúbrica
   (panel 📊 → ⬇ .md incluye el desglose por zona de Colocar y el detalle por tarjeta de Auditoría).

---

*Documento generado para la acreditación de la práctica · los cálculos reproducen exactamente lo
implementado en `js/config.js` (`ESCALA_AUDITORIA`, `ESCALA_COLOCAR`), `js/validacion.js` y
`js/panel-profesor.js`.*
