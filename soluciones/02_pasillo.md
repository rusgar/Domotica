# Solución modelo · Tarjeta 2 — PASILLO 🚶

> **Módulo:** Auditoría por zonas · **Ejercicio Auditoría** (2 tarjetas aleatorias de las 10 zonas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **750 € por tarjeta** (1.500 € en las 2) · tiempo límite **60 min** (pasarlo resta **0,25** sobre 2,5)
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

> **Fuente en Asturias:** también es válida **FAEN – Fundación Asturiana de la Energía** (agencia energética del Principado de Asturias) si localizas el dato allí; si no existe fuente asturiana para ese dato, se admite la nacional **IDAE** (Madrid).
| **Aplicación** | Criterios para dimensionar temporizadores y estimar kWh ahorrados por sensor. |

> Alternativa del desplegable: **REBT** (ITC-BT-44 · Receptores para alumbrado), que regula las instalaciones de alumbrado.

---

## Puntuación esperada de la ficha

> **Escala que cuenta:** la tabla de abajo es el **detalle interno de la ficha** (60 automáticos + 40 de campos abiertos, que **no puntúan**). La nota de la tarjeta sale SOLO de lo automático: **aciertos / máximo automático × 5 = nota (0-5)** → **× 1,25 = ponderación** (máx. 1,25 por tarjeta). El ejercicio reparte 2 tarjetas → **10 puntos = 2,5 ponderados**. Este archivo sirve para comprobar que la respuesta se parece al **modelo exacto o parecido**.


| Bloque | Puntos | Tipo |
|---|---|---|
| 1 · Condiciones interiores | 10 | Automática |
| 2 · Factores exteriores | 10 | Automática |
| 4 · DOIH | 20 | Automática |
| 7 · Cálculo | 20 | Automática |
| 3, 5, 6, 8, 9 · campos abiertos | 40 | Manual (profesor) |
| **Total** | **100** | 60 auto + 40 campos abiertos (no puntúan) |

## Presupuesto (apartado 8 · obligatorio)

**Actuación prioritaria sugerida:** sensores de presencia con temporización por tramo — **≈ 175 €** (rango 80–250 €).
**Justificación:** el pasillo es la zona con mayor impacto por euro invertido (luces 8 h/día sin uso la mayor parte del tiempo); prioridad alta y coste bajo deja margen para las demás zonas dentro de los 1.500 € del ejercicio.

> **Precios de referencia:** usa los precios del catálogo del módulo **Colocar aparatos** (p. ej. sensor de presencia 30 € · sensor de CO₂ 90 € · LDR 2 € · actuador de luz 70 € · cámara termográfica 350 €). La cifra de arriba es una estimación de mercado: en el **apartado 8** elige en la lista los aparatos que vas a instalar (se repiten con cantidades y **el precio se suma solo**) o escribe el importe a mano; debe encajar con esa lista o con un artículo del catálogo (±20 %), ser **obligatorio** y **no pasarte de 750 € en esta tarjeta** (1.500 € en total). Un precio vacío bloquea la entrega.
