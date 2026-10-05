# Solución modelo · Tarjeta 5 — BIBLIOTECA 📚

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Calidad del aire (CO₂)
- [x] Humedad interior

> El ambiente «cargado» apunta a calidad del aire; la ventilación insuficiente acumula humedad. Temperatura, iluminación, velocidad del aire y ruido no aparecen afectados.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior
- [x] Humedad exterior

> Condicionan la conveniencia de ventilar (en invierno se pierde calor al abrir; la humedad exterior afecta a la carga).

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Ventilación a caudal fijo insuficiente en hora punta: con 40–50 usuarios y ventanas cerradas, el aire se vuelve cargado. No hay sensor que lo detecte. |
| **Evidencia en la tarjeta** | «Tras 90 min varios describen el ambiente como cargado», «ventanas cerradas y ventilación a caudal fijo», «no hay sensor de CO₂». |
| **Causa probable** | El caudal fijo (1,0–1,5 kW) está dimensionado para ocupación media, no para el pico de 40–55 personas. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «Hay 40 usuarios en la biblioteca.» | **D** | Dato numérico de la tarjeta (según variación: 35, 40 o 50; sigue siendo **D**). |
| «Varios usuarios describen el aire como cargado.» | **O** | Observación directa subjetiva recogida. |
| «La ventilación a caudal fijo puede ser insuficiente.» | **I** | Inferencia a partir de ocupación alta + sensación de aire cargado. |
| «El CO₂ supera las 1.200 ppm.» | **H** | Hipótesis: **no hay dato medido** (no hay sensor); hay que verificarlo. |

**Frase propia de ejemplo:** «El aire mejora al abrir las ventanas» → **O** (observación) → **I**: «la ventilación mecánica no cubre la ocupación».

## 5 · Medidas de mejora (respuesta modelo)

1. **Sensor de CO₂ para ventilación bajo demanda** (el ventilador trabaja al caudal necesario según ocupación).
2. **Data logging para registrar la evolución de CO₂** (documenta el problema y verifica la medida).
3. *(Alternativa)* Ventilación con recuperador de calor (evita la pérdida térmica al ventilar en invierno).

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Concentración de CO₂ (ppm) y humedad relativa (%) |
| **Instrumento** | Sensor de CO₂ NDIR (fijo o data logger) + higrómetro |

## 7 · Cálculo ✔ — consumo mensual evitable del ventilador

**Fórmula:** `Potencia ventilador × Horas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 1,0 kW · 1 h/día · 20 d | 1,0 × 1 × 20 | **20,00 kWh/mes** (≈ 3,60 €/mes) |
| V2 | 1,2 kW · 1 h/día · 20 d | 1,2 × 1 × 20 | **24,00 kWh/mes** (≈ 4,32 €/mes) |
| V3 | 1,5 kW · 1 h/día · 20 d | 1,5 × 1 × 20 | **30,00 kWh/mes** (≈ 5,40 €/mes) |

> ⚠️ **Nota didáctica:** el enunciado recuerda que *primero hay que verificar la calidad del aire*: no se reduce la ventilación hasta tener datos de CO₂. El cálculo sigue siendo el mismo valor.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Medio | Sensor CO₂: 90–300 €; ventilación bajo demanda: 800–2.500 €. |
| **Impacto** | Alto | Calidad del aire de 40–55 usuarios + ahorro energético del caudal sobredimensionado. |
| **Dificultad** | Media | Requiere instalación del sensor y modulación del ventilador. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **CTE DB-HS · Salubridad** |
| **Apartado consultado** | HS3 · Calidad del aire interior |
| **Dato encontrado** | HS3 establece los caudales mínimos de ventilación según uso y los criterios de calidad del aire (incluido control de CO₂). |
| **Aplicación a la tarjeta** | Define el caudal que debe garantizarse con ocupación alta y justifica medir CO₂ para no ventilar «a ciegas». |
| **Fuente técnica** | **UNE** — normas sobre calidad del aire y ventilación en edificios. |
| **Aplicación** | Criterios de medición (posición del sensor, umbrales) para el data logger. |

> Alternativa del desplegable: **RITE** (IT 1.1.4.3 · Calidad del aire interior: ventilación según ocupación).

---

## Puntuación esperada de la ficha

> **Escala que cuenta:** la tabla de abajo es el detalle interno de la ficha (100 = 60 automático + 40 manual), pero la nota real es **2,5 puntos por tarjeta**: cada ejercicio reparte 2 tarjetas → **5 puntos por ejercicio**, y los 2 ejercicios asignados suman **10 puntos** en total. El profesor convierte el detalle en 2,5 proporcionalmente al verificarlo con este mismo archivo.


| Bloque | Puntos | Tipo |
|---|---|---|
| 1 · Condiciones interiores | 10 | Automática |
| 2 · Factores exteriores | 10 | Automática |
| 4 · DOIH | 20 | Automática |
| 7 · Cálculo | 20 | Automática |
| 3, 5, 6, 8, 9 · campos abiertos | 40 | Manual (profesor) |
| **Total** | **100** | 60 auto + 40 manual |

## Presupuesto (apartado final del ejercicio)

**Actuación prioritaria sugerida:** sensor de CO₂ para ventilación bajo demanda — **≈ 200 €** (rango 90–300 €).
**Justificación:** primero se mide (evita ventilar de más o de menos) y es prerrequisito de cualquier otra actuación; la modulación del ventilador (coste medio-alto) se plantea si queda presupuesto de los 1.500 €.
