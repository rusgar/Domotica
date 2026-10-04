# Solución modelo · Tarjeta 6 — GIMNASIO 🏋️

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> **Caso especial:** esta tarjeta **no tiene cálculo automático** (`valor = null`): hay que responder con el criterio de «qué medir».
> **Aceptación del cálculo:** — (sin bloque numérico).

---

## 1 · Condiciones interiores afectadas ✔

- [x] Humedad interior
- [x] Calidad del aire (CO₂)
- [x] Velocidad del aire

> Las tres aparecen con dato o síntoma en la tarjeta: humedad 68–75 %, CO₂ 1.300–1.500 ppm y «movimiento de aire perceptible cerca de una rejilla». Temperatura, iluminación y ruido no son el foco.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior
- [x] Humedad exterior

> El ΔT (8–12 °C fuera vs. 22–24 °C dentro) y la humedad exterior condicionan la condensación sobre la pared exterior.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Indicios de puente térmico (condensación en pared exterior) más alta de humedad y CO₂, con ventilación activa pero posiblemente mal repartida (corriente perceptible en la rejilla). |
| **Evidencia en la tarjeta** | «Se observa condensación ocasional en una pared exterior», humedad 68–75 %, CO₂ 1.300–1.500 ppm, «movimiento de aire perceptible cerca de una rejilla». |
| **Causa probable** | Superficie fría por puente térmico por debajo del punto de rocío + aporte de humedad de 25–30 personas; la velocidad del aire en la rejilla puede ser excesiva (sensación de corriente). |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «Hay 28 usuarios en el gimnasio.» | **D** | Dato numérico de la tarjeta (según variación: 25, 28 o 30; sigue siendo **D**). |
| «Se observa condensación en una pared exterior.» | **O** | Observación directa descrita. |
| «Puede existir un puente térmico en esa pared.» | **I** | Inferencia razonable a partir de la condensación. |
| «La velocidad del aire supera 0,5 m/s.» | **H** | Hipótesis: **no está medida**; hay que comprobarla con anemómetro. |

**Frase propia de ejemplo:** «La condensación aparece solo en los meses fríos» → **H** (habría que registrarlo durante varios meses).

## 5 · Medidas de mejora (respuesta modelo)

1. **Cámara termográfica para detectar puentes térmicos** (identifica la zona fría de la pared antes de reformar).
2. **Sensores de temperatura superficial** (verifican si la pared baja del punto de rocío).
3. *(Alternativa)* Anemómetro de hilo caliente para comprobar la velocidad del aire en la rejilla.

## 6 · Verificación del diagnóstico ⭐ (apartado clave de esta tarjeta)

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Temperatura superficial de la pared (°C), velocidad del aire (m/s) y humedad (%) |
| **Instrumento** | Cámara termográfica o sensor de temperatura superficial + anemómetro de hilo caliente + higrómetro |

> **No inventes temperaturas superficiales ni velocidades:** la tarjeta dice explícitamente «no inventar… indicar qué sensores permitirían comprobarlas».

## 7 · Cálculo ✔ — sin cálculo automático

**Respuesta modelo:** *No es posible calcular un ahorro fiable con los datos disponibles:* hay síntomas (condensación, corriente) pero faltan mediciones (temperatura superficial, velocidad del aire, punto de rocío). Lo correcto es indicar **qué se mediría** (temperatura superficial, velocidad del aire, humedad) y **con qué instrumento** (cámara termográfica/sonda, anemómetro, higrómetro).

> El bloque 7 de la ficha muestra un campo de texto «Ahorro estimado, si procede»: se puntúa manualmente la calidad de la explicación, no un número.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Medio | Cámara termográfica 300–800 € (o alquiler); reforma de aislamiento si se confirma el puente térmico. |
| **Impacto** | Medio | Confort, durabilidad del cerramiento y control de humedad; el ahorro energético aún no está cuantificado. |
| **Dificultad** | Media | Diagnóstico accesible; la corrección del puente térmico sí requiere obra. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **RITE · Reglamento de Instalaciones Térmicas** |
| **Apartado consultado** | IT 1 · Exigencias de bienestar e higiene |
| **Dato encontrado** | IT 1 fija los rangos de temperatura, humedad y velocidad del aire para el bienestar (y UNE-EN ISO 7730 define los índices PMV/PPD). |
| **Aplicación a la tarjeta** | Permite juzgar si 22–24 °C con 68–75 % de humedad y corriente perceptible son aceptables, y fijar objetivos de medida. |
| **Fuente técnica** | **UNE** — normas de ergonomía del ambiente térmico y calidad del aire. |
| **Aplicación** | Umbrales con los que comparar las medidas del sensor de humedad y el anemómetro. |

> Alternativa del desplegable: **CTE DB-HE** (envolvente térmica, si el foco es el puente térmico).

---

## Puntuación esperada de la ficha

| Bloque | Puntos | Tipo |
|---|---|---|
| 1 · Condiciones interiores | 10 | Automática |
| 2 · Factores exteriores | 10 | Automática |
| 4 · DOIH | 20 | Automática |
| 7 · Cálculo | — | **No se suma** (sin valor numérico) → el total de esta ficha es **80** |
| 3, 5, 6, 8, 9 · campos abiertos | 40 | Manual (profesor) |
| **Total** | **80** | 40 auto + 40 manual |

## Presupuesto (apartado final del ejercicio)

**Actuación prioritaria sugerida:** cámara termográfica (o alquiler de equipo) para detectar el puente térmico — **≈ 450 €** (rango 300–800 €).
**Justificación:** sin diagnosticar no se puede invertir en reforma; la medición primero (medida de bajo riesgo) evita gastar los 1.500 € en una solución equivocada.
