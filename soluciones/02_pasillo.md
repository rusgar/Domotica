# Solución modelo · Tarjeta 2 — PASILLO 🚶

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Iluminación

> Única condición correcta: el problema es exclusivamente de iluminación encendida sin necesidad. Cualquier otra marca resta: puntuación = (aciertos − fallos) / 1 × 10.

## 2 · Factores exteriores que pueden influir ✔

- [x] Radiación solar

> Único factor correcto: es la luz natural exterior la que permite reducir la iluminación.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Las 24 h de luz encendidas no se ajustan al tránsito real: hay periodos con muy poca gente donde la iluminación podría reducirse o apagarse. |
| **Evidencia en la tarjeta** | «Todas las luces funcionan 07:30–15:30» mientras el tránsito se concentra solo en tres franjas (08:00–09:00, 11:00–11:30 y 13:30–14:30). |
| **Causa probable** | Iluminación sin sectorización ni control de presencia: la potencia (*n* × 25 W) se mantiene constante toda la jornada. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «El pasillo tiene 18 luminarias LED.» | **D** | Dato numérico de la tarjeta (⚠️ la frase está fijada a 18 en el código, aunque tu variación pueda decir 16 o 20: sigue siendo **D**). |
| «El tránsito se concentra en tres franjas horarias.» | **O** | Observación directa de la franja horaria descrita. |
| «Fuera de esas franjas, la iluminación puede reducirse.» | **I** | Inferencia: se deduce de comparar horario de luces vs. tránsito. |
| «Con sensores de presencia se ahorraría más del 50 %.» | **H** | Hipótesis: hay que medir antes de afirmarlo. |

**Frase propia de ejemplo:** «El pasillo está vacío a las 10:30 con todas las luces encendidas» → **O** (observación) y de ahí se inferiría **I**: «se podría apagar esa zona».

## 5 · Medidas de mejora (respuesta modelo)

1. **Sensores de presencia con temporización** (apagan/reducen la luz fuera de las franjas de tránsito).
2. **Sectorización de la iluminación del pasillo** (tratar cada tramo por separado según su uso).
3. *(Alternativa)* Aprovechamiento de luz natural con fotodiodos.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Horas reales de encendido sin presencia (o nivel de iluminación, lux) |
| **Instrumento** | Temporizador registrador / analizador de red en el circuito, o luxómetro |

## 7 · Cálculo ✔ — ahorro mensual de iluminación

**Fórmula:** `Potencia total × Horas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 18 lum × 25 W · 3 h/día · 20 d | (18×25)/1000 = 0,45 kW → 0,45 × 3 × 20 | **27,00 kWh/mes** (≈ 4,86 €/mes) |
| V2 | 16 lum × 25 W · 2,5 h/día · 20 d | (16×25)/1000 = 0,40 kW → 0,40 × 2,5 × 20 | **20,00 kWh/mes** (≈ 3,60 €/mes) |
| V3 | 20 lum × 22 W · 3,5 h/día · 20 d | (20×22)/1000 = 0,44 kW → 0,44 × 3,5 × 20 | **30,80 kWh/mes** (≈ 5,54 €/mes) |

> El campo a validar es **solo el valor en kWh/mes**, con 2 decimales.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Bajo | Sensores y temporización: 80–250 € por tramo. |
| **Impacto** | Alto | Luces encendidas 8 h/día completas: el ahorro relativo es muy grande (>50 % posible). |
| **Dificultad** | Baja | Sin obra; cambio de cuadro y programación. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **CTE DB-HE · Ahorro de Energía** |
| **Apartado consultado** | HE3 · Eficiencia de iluminación |
| **Dato encontrado** | HE3 exige control y sectorización de la iluminación y valorar el aprovechamiento de la luz natural. |
| **Aplicación a la tarjeta** | Obliga a poder apagar o reducir la luz del pasillo fuera de las franjas de uso, que es exactamente la medida propuesta. |
| **Fuente técnica** | **IDAE** — publicaciones sobre ahorro en iluminación y control por presencia. |
| **Aplicación** | Criterios para dimensionar temporizadores y estimar kWh ahorrados por sensor. |

> Alternativa del desplegable: **REBT** (ITC-BT-44 · Receptores para alumbrado), que regula las instalaciones de alumbrado.

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

**Actuación prioritaria sugerida:** sensores de presencia con temporización por tramo — **≈ 175 €** (rango 80–250 €).
**Justificación:** el pasillo es la zona con mayor impacto por euro invertido (luces 8 h/día sin uso la mayor parte del tiempo); prioridad alta y coste bajo deja margen para las demás zonas de los 1.500 €.
