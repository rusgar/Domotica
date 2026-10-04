# Solución modelo · Tarjeta 10 — SALÓN DE ACTOS 🎭

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Iluminación
- [x] Ruido

> Las dos que aparecen en el escenario: «varias zonas de iluminación… se encienden todas» y «ruido exterior perceptible durante un acto».

## 2 · Factores exteriores que pueden influir ✔

- [x] Radiación solar
- [x] Ruido exterior

> Grandes superficies acristaladas (gains solares y deslumbramiento) + ruido exterior que obliga a cerrar (condiciona la ventilación/free cooling).

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Iluminación sin sectorizar: se encienden todas las luminarias aunque solo se usan escenario y parte del patio, con un uso mensual puntual (2–3 días/semana). |
| **Evidencia en la tarjeta** | «Antes de un acto se encienden todas aunque solo se necesita escenario y parte del patio», «grandes superficies acristaladas», uso «2–3 días/semana». |
| **Causa probable** | Falta de sectorización y de escenas preprogramadas: todo está en un único circuito o no se aprovechan los pulsadores por zonas. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «El salón tiene 12 luminarias de 60 W.» | **D** | Dato numérico de la tarjeta (⚠️ fijada a 12×60 W en el código; tu variación puede decir 15×55 o 10×65: sigue siendo **D**). |
| «Se encienden todas aunque solo se use el escenario.» | **O** | Observación directa descrita. |
| «La sectorización reduciría el consumo.» | **I** | Inferencia lógica a partir de la observación. |
| «Instalar escenas de iluminación cuesta menos de 500 €.» | **H** | Hipótesis de coste: hay que cotizar (el rango típico es 150–600 €). |

**Frase propia de ejemplo:** «Durante un acto el patio está a media luz con el escenario al máximo» → **O** → **I**: «un escenario programado ajustaría los niveles».

## 5 · Medidas de mejora (respuesta modelo)

1. **Sectorización de la iluminación** (escenario / patio / pasillos en circuitos independientes).
2. **Escenas programables** («Acto», «Patio vacío», «Emergencia» con un pulsador).
3. *(Alternativa)* Control por zonas con pulsadores.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Potencia/iluminación encendida por zona durante un acto (W o lux por zona) |
| **Instrumento** | Analizador de red en cada circuito + luxómetro |

## 7 · Cálculo ✔ — ahorro mensual de iluminación

**Fórmula:** `Potencia × Luminarias × Horas × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 12 lum × 60 W · 2 h · 10 d/mes | (12×60)/1000 = 0,72 kW → 0,72 × 2 × 10 | **14,40 kWh/mes** (≈ 2,59 €/mes) |
| V2 | 15 lum × 55 W · 2,5 h · 8 d/mes | (15×55)/1000 = 0,825 kW → 0,825 × 2,5 × 8 | **16,50 kWh/mes** (≈ 2,97 €/mes) |
| V3 | 10 lum × 65 W · 1,5 h · 12 d/mes | (10×65)/1000 = 0,65 kW → 0,65 × 1,5 × 12 | **11,70 kWh/mes** (≈ 2,11 €/mes) |

> El campo a validar es **solo el valor en kWh/mes**, con 2 decimales. Los días/mes son de uso real (8–12), no laborables.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Medio | Sectorización 200–800 € por zona; escenas 150–600 €. |
| **Impacto** | Medio | 11,7–16,5 kWh/mes y mejor calidad de luz en los actos. |
| **Dificultad** | Baja | Reaparto de circuitos y programación; sin obra mayor. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **CTE DB-HE · Ahorro de Energía** |
| **Apartado consultado** | HE3 · Eficiencia de iluminación |
| **Dato encontrado** | HE3 exige poder sectorizar y controlar la iluminación por zonas y horarios. |
| **Aplicación a la tarjeta** | Justifica independizar escenario y patio y programar escenas en vez de encender todo el conjunto. |
| **Fuente técnica** | **IDAE** — guías de eficiencia en iluminación de edificios. |
| **Aplicación** | Criterios para estimar el ahorro de la sectorización y elegir el tipo de control. |

> Alternativa del desplegable: **AFME** (guías de instalaciones eléctricas y domótica), en línea con las escenas programables.

---

## Puntuación esperada de la ficha

| Bloque | Puntos | Tipo |
|---|---|---|
| 1 · Condiciones interiores | 10 | Automática |
| 2 · Factores exteriores | 10 | Automática |
| 4 · DOIH | 20 | Automática |
| 7 · Cálculo | 20 | Automática |
| 3, 5, 6, 8, 9 · campos abiertos | 40 | Manual (profesor) |
| **Total** | **100** | 60 auto + 40 manual |

## Presupuesto (apartado final del ejercicio)

**Actuación prioritaria sugerida:** sectorización de la iluminación por zonas — **≈ 500 €** (rango 200–800 €).
**Justificación:** es la medida con mejor balance coste/impacto de la tarjeta (ataca directamente el «se encienden todas»); las escenas programables (150–600 €) se añaden si queda margen dentro de los 1.500 €.
