# Solución modelo · Tarjeta 8 — COMEDOR / CAFETERÍA 🍽️

> **Módulo:** Auditoría por zonas · **Ejercicio Auditoría** (2 tarjetas aleatorias de las 10 zonas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **750 € por tarjeta** (1.500 € en las 2) · tiempo límite **60 min** (pasarlo resta **0,25** sobre 2,5)
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Calidad del aire (CO₂)
- [x] Temperatura interior

> La ocupación de 100–140 personas en el pico dispara CO₂ y carga térmica; el resto no es el foco.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior

> Único factor relevante: condiciona la consigna y la conveniencia de ventilación/free cooling.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | La ventilación trabaja al mismo régimen (12:00–16:00) todo el tiempo aunque el pico dura solo 45–60 min: se ventila de más durante horas con poca ocupación. |
| **Evidencia en la tarjeta** | «Pico de 120 personas durante 45 min… el resto menos de 15», «ventilación y climatización mantienen el mismo régimen». |
| **Causa probable** | Control horario fijo, sin modulación por ocupación (no hay sensor de CO₂ ni gestión por demanda). |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «El pico de ocupación es de 120 personas.» | **D** | Dato numérico de la tarjeta (⚠️ fijada a 120 en el código; tu variación puede decir 100 o 140: sigue siendo **D**). |
| «La ventilación mantiene el mismo régimen toda la franja.» | **O** | Observación directa del horario. |
| «Se podría reducir la ventilación fuera del pico.» | **I** | Inferencia a partir de ocupación desigual + régimen constante. |
| «Reducir la ventilación 1 h/día ahorraría 24 kWh/mes.» | **H** | Hipótesis numérica que hay que comprobar con el cálculo (24 kWh es justo el resultado de la variación V1: por eso es hipótesis hasta calcular). |

**Frase propia de ejemplo:** «A las 15:00 queda poca gente pero sigue sonando la ventilación al máximo» → **O** → **I**: «el régimen no sigue la ocupación».

## 5 · Medidas de mejora (respuesta modelo)

1. **Ventilación bajo demanda según ocupación** (modula el caudal: máximo en el pico, mínimo el resto).
2. **Sensores de CO₂** (dato objetivo para modular, evita ventilar «a ciegas»).
3. *(Alternativa)* Programación horaria por franjas (bajar el nivel fuera de 12:00–16:00 efectivo).

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Concentración de CO₂ (ppm) a lo largo de la franja |
| **Instrumento** | Sensor de CO₂ NDIR con registro (data logger) |

## 7 · Cálculo ✔ — ahorro mensual de ventilación

**Fórmula:** `Potencia × Horas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 1,2 kW · 1 h/día · 20 d | 1,2 × 1 × 20 | **24,00 kWh/mes** (≈ 4,32 €/mes) |
| V2 | 1,5 kW · 1,5 h/día · 20 d | 1,5 × 1,5 × 20 | **45,00 kWh/mes** (≈ 8,10 €/mes) |
| V3 | 1,0 kW · 1 h/día · 22 d | 1,0 × 1 × 22 | **22,00 kWh/mes** (≈ 3,96 €/mes) |

> El campo a validar es **solo el valor en kWh/mes**, con 2 decimales.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Medio | Sensores 90–300 €; modulación/ventilación bajo demanda según instalación existente. |
| **Impacto** | Alto | 22–45 kWh/mes de ahorro directo y mejor calidad de aire en 100–140 personas. |
| **Dificultad** | Media | Requiere integrar sensor con la centralita de ventilación. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **RITE · Reglamento de Instalaciones Térmicas** |
| **Apartado consultado** | IT 1 · Exigencias de bienestar e higiene |
| **Dato encontrado** | IT 1.1.4.3 regula la ventilación según ocupación y actividad (caudal en función del uso real). |
| **Aplicación a la tarjeta** | Justifica modular la ventilación: caudal máximo solo durante el pico de 45–60 min, no 4 h completas. |
| **Fuente técnica** | **IDAE** — guías de eficiencia en ventilación y climatización. |
| **Aplicación** | Criterios para estimar el ahorro de reducir caudal fuera del pico. |

> **Fuente en Asturias:** también es válida **FAEN – Fundación Asturiana de la Energía** (agencia energética del Principado de Asturias) si localizas el dato allí; si no existe fuente asturiana para ese dato, se admite la nacional **IDAE** (Madrid).

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

**Actuación prioritaria sugerida:** sensor de CO₂ + programación por franjas de la ventilación — **≈ 300 €** (rango sensor: 90–300 €).
**Justificación:** habilita la medida principal (reducir caudal fuera del pico) con la mínima inversión; la obra de ventilación bajo demanda (coste medio) queda como ampliación si sobra presupuesto (750 € por tarjeta).

> **Precios de referencia:** usa los precios del catálogo del módulo **Colocar aparatos** (p. ej. sensor de presencia 30 € · sensor de CO₂ 90 € · LDR 2 € · actuador de luz 70 € · cámara termográfica 350 €). La cifra de arriba es una estimación de mercado: en el **apartado 8** elige en la lista los aparatos que vas a instalar (se repiten con cantidades y **el precio se suma solo**) o escribe el importe a mano; debe encajar con esa lista o con un artículo del catálogo (±20 %), ser **obligatorio** y **no pasarte de 750 € en esta tarjeta** (1.500 € en total). Un precio vacío bloquea la entrega.
