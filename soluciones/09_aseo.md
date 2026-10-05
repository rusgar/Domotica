# Solución modelo · Tarjeta 9 — ASEO 🚻

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Iluminación

> Única condición correcta: el problema es solo de luces encendidas con uso intermitente.

## 2 · Factores exteriores que pueden influir ✔

- [x] Radiación solar

> Único factor correcto: aseo interior sin ventanal, pero la luz natural del pasillo/exteriores puede contribuir en horario diurno.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Uso intermitente del aseo con las luminarias encendidas de forma continuada: se consume luz cuando no hay nadie. |
| **Evidencia en la tarjeta** | «Uso intermitente», «*N* luminarias de *P* W permanecen encendidas largos periodos», «se estima posible evitar *H* h/día con presencia». |
| **Causa probable** | Falta de control de presencia/temporización: nadie apaga las luces porque no hay incentivo ni automatismo. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «El aseo tiene 6 luminarias de 18 W.» | **D** | Dato numérico de la tarjeta (⚠️ fijada a 6×18 W en el código; tu variación puede decir 8×15 o 5×20: sigue siendo **D**). |
| «Las luces permanecen encendidas largos periodos.» | **O** | Observación directa descrita. |
| «Un sensor de presencia podría reducir 2,5 h/día.» | **I** | Inferencia a partir del uso intermitente (⚠️ la cifra está fijada a 2,5 h en el código, aunque tu variación pueda decir 3 o 2: sigue siendo **I**). |
| «El ahorro anual supera los 30 €.» | **H** | Hipótesis: hay que calcularlo y comparar con el precio del kWh. |

**Frase propia de ejemplo:** «La luz del aseo sigue encendida cuando el pasillo está vacío» → **O** → **I**: «se podría apagar con detector de presencia».

> **Comprobación de la hipótesis H:** con la variación V1 el ahorro es 5,40 kWh/mes ≈ 0,97 €/mes ≈ 11,6 €/año → **no** supera 30 €. Con V2: 7,20 kWh/mes ≈ 1,30 €/mes ≈ 15,6 €/año → tampoco. Por eso se mantiene como hipótesis hasta calcular (y de ahí el «impacto bajo»).

## 5 · Medidas de mejora (respuesta modelo)

1. **Sensor de presencia con temporización** (apaga cuando el aseo está vacío, con retardo corto).
2. **Iluminación LED con detector de movimiento** (ya son LED de 15–20 W; el detector completa el ahorro).
3. *(Alternativa)* Cartelería de concienciación.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Horas reales de encendido sin ocupación (o consumo kWh del circuito) |
| **Instrumento** | Temporizador registrador / analizador de red |

## 7 · Cálculo ✔ — ahorro mensual de iluminación

**Fórmula:** `Potencia × Horas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 6 lum × 18 W · 2,5 h/día · 20 d | (6×18)/1000 = 0,108 kW → 0,108 × 2,5 × 20 | **5,40 kWh/mes** (≈ 0,97 €/mes) |
| V2 | 8 lum × 15 W · 3 h/día · 20 d | (8×15)/1000 = 0,12 kW → 0,12 × 3 × 20 | **7,20 kWh/mes** (≈ 1,30 €/mes) |
| V3 | 5 lum × 20 W · 2 h/día · 22 d | (5×20)/1000 = 0,10 kW → 0,10 × 2 × 22 | **4,40 kWh/mes** (≈ 0,79 €/mes) |

> El campo a validar es **solo el valor en kWh/mes**, con 2 decimales. Son ahorros pequeños: de ahí «impacto bajo».

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Bajo | Sensor/temporizador: 80–250 € por zona. |
| **Impacto** | Bajo | 4,4–7,2 kWh/mes (menos de 1,5 €/mes). |
| **Dificultad** | Baja | Sin obra; cambio en el cuadro de la zona. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **CTE DB-HE · Ahorro de Energía** |
| **Apartado consultado** | HE3 · Eficiencia de iluminación |
| **Dato encontrado** | HE3 regula el control y la sectorización de la iluminación (apagado por presencia y horario). |
| **Aplicación a la tarjeta** | Justifica el apagado automático en locales de uso intermitente como el aseo. |
| **Fuente técnica** | **IDAE** — guías de ahorro en iluminación. |
| **Aplicación** | Datos para estimar kWh ahorrados por detector de presencia. |

> Alternativa del desplegable: **REBT** (ITC-BT-44 · Receptores para alumbrado).

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

**Actuación prioritaria sugerida:** sensor de presencia con temporización — **≈ 150 €** (rango 80–250 €).
**Justificación:** coste mínimo y mejora de confort/higiene percibida; aunque el ahorro económico es bajo (<1,5 €/mes), la inversión se amortiza en cuanto evita las quejas por luz encendida. En una reparto de 1.500 € entre 3 zonas, al aseo se le puede asignar la parte mínima y priorizar las zonas de mayor impacto.
