# Solución modelo · Tarjeta 1 — AULA 🏫

> **Módulo:** Auditoría por zonas · **Ejercicio Auditoría** (2 tarjetas aleatorias de las 10 zonas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **750 € por tarjeta** (1.500 € en las 2) · tiempo límite **60 min** (pasarlo resta **0,25** sobre 2,5)
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Temperatura interior
- [x] Iluminación

> Solo esas dos son las correctas: los demás factores (humedad, calidad del aire, velocidad del aire, ruido) no aparecen relacionados con el problema de la tarjeta. Marcar otras resta puntos: puntuación = (aciertos − fallos) / total correctas × 10.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior
- [x] Radiación solar
- [x] Viento

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | La iluminación y la calefacción funcionan sin adaptarse a la ocupación ni a la luz natural, y hay fuga de calor por la puerta: consumo innecesario y confort desigual entre alumnos. |
| **Evidencia en la tarjeta** | «Se podrían apagar *X* h/día aprovechando luz natural», «persianas bajadas gran parte de la mañana», «la puerta se abre con frecuencia», «algunos alumnos tienen frío y otros calor». |
| **Causa probable** | Falta de control automático (sensores de presencia, temporización, control solar de persianas) y de gestión de la consigna de calefacción, agravado por las infiltraciones de la puerta. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «Hay 25 alumnos en el aula.» | **D** | Dato numérico del escenario, verificable (⚠️ la frase está fijada a 25 en el código, aunque tu variación pueda decir 23, 24 o 27: sigue siendo **D**). |
| «La puerta se abre con frecuencia.» | **O** | Observación directa descrita en la tarjeta. |
| «Puede haber pérdidas térmicas por la puerta.» | **I** | Inferencia razonable a partir de la observación. |
| «La ventilación puede ser insuficiente con las ventanas cerradas.» | **H** | Hipótesis que hay que comprobar midiendo CO₂/caudales. |

**Frase propia de ejemplo:** «El aula se enfría por la mañana antes de las 9:00» → **I** (inferencia: se deduce de persianas bajadas y calefacción arrancando a las 07:00, pero no está medida).

## 5 · Medidas de mejora (respuesta modelo)

1. **Sensores de presencia para apagado automático de luces** (se apagan las *X* h/día que hay luz natural).
2. **Persianas automáticas con control solar** (bajan solas por radiación y dejan entrar luz natural, reduciendo el uso de luces y el sobrecalentamiento).
3. *(Alternativa)* Cierre automático de puerta con muelle o sensor.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Nivel de iluminación en los pupitres (lux) y temperatura del aire |
| **Instrumento** | Luxómetro + termómetro (o termohigrómetro de sonda) |

## 7 · Cálculo ✔ — ahorro mensual de iluminación

**Fórmula:** `Potencia × Horas apagadas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 10 lum × 40 W · 2 h/día · 20 d | (10×40)/1000 = 0,4 kW → 0,4 × 2 × 20 | **16,00 kWh/mes** (≈ 2,88 €/mes) |
| V2 | 8 lum × 40 W · 1,5 h/día · 20 d | (8×40)/1000 = 0,32 kW → 0,32 × 1,5 × 20 | **9,60 kWh/mes** (≈ 1,73 €/mes) |
| V3 | 12 lum × 40 W · 2,5 h/día · 20 d | (12×40)/1000 = 0,48 kW → 0,48 × 2,5 × 20 | **24,00 kWh/mes** (≈ 4,32 €/mes) |
| V4 | 10 lum × 36 W · 2 h/día · 22 d | (10×36)/1000 = 0,36 kW → 0,36 × 2 × 22 | **15,84 kWh/mes** (≈ 2,85 €/mes) |

> La conversión a euros es complementaria (kWh × 0,18 €): el campo a validar es **solo el valor en kWh/mes**, con 2 decimales.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Bajo | Sensores de presencia: 80–250 € por zona; temporización es software. |
| **Impacto** | Medio | Ahorro de 9–24 kWh/mes y mejor confort, pero la calefacción no se toca. |
| **Dificultad** | Baja | Sin obra: instalación y programación en una tarde. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **CTE DB-HE · Ahorro de Energía** |
| **Apartado consultado** | HE3 · Eficiencia de iluminación |
| **Dato encontrado** | HE3 regula la sectorización, el control horario y el aprovechamiento de la luz natural en las instalaciones de iluminación. |
| **Aplicación a la tarjeta** | Justifica apagar las luminarias cuando hay luz natural y sectorizar el aula por franjas, que es justo lo que se propone. |
| **Fuente técnica** | **IDAE** — guías de eficiencia energética en edificios: ahorro por controles de iluminación y sensores de presencia. |

> **Fuente en Asturias:** también es válida **FAEN – Fundación Asturiana de la Energía** (agencia energética del Principado de Asturias) si localizas el dato allí; si no existe fuente asturiana para ese dato, se admite la nacional **IDAE** (Madrid).
| **Aplicación** | Da criterios para estimar el ahorro (kWh por luminaria apagada) y dimensionar los sensores. |

> Otra opción válida del desplegable: **RITE** (IT 1), si el foco se pone en el confort térmico de los alumnos.

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

**Actuación prioritaria sugerida:** sensores de presencia para la iluminación — **≈ 150 €** (rango 80–250 €).
**Justificación:** mejor ratio impacto/coste de la tarjeta (impacto medio con inversión baja), deja margen para la otra zona (cada tarjeta tiene sus 750 €).

> **Precios de referencia:** usa los precios del catálogo del módulo **Colocar aparatos** (p. ej. sensor de presencia 30 € · sensor de CO₂ 90 € · LDR 2 € · actuador de luz 70 € · cámara termográfica 350 €). La cifra de arriba es una estimación de mercado: en el **apartado 8** elige en la lista los aparatos que vas a instalar (se repiten con cantidades y **el precio se suma solo**) o escribe el importe a mano; debe encajar con esa lista o con un artículo del catálogo (±20 %), ser **obligatorio** y **no pasarte de 750 € en esta tarjeta** (1.500 € en total). Un precio vacío bloquea la entrega.
