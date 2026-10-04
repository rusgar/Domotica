# Solución modelo · Tarjeta 7 — VESTÍBULO 🚪

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen (1 decimal).

---

## 1 · Condiciones interiores afectadas ✔

- [x] Temperatura interior
- [x] Velocidad del aire

> Cada apertura mete aire frío y genera corriente junto a la entrada. El resto no se describe.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior
- [x] Viento

> ΔT de 13–16 °C (5–8 °C fuera vs. 20–22 °C dentro) y el viento que empuja el aire hacia el interior.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | La puerta automática comunica directamente con la zona climatizada: una fracción grande de la franja de acceso queda abierta, con infiltraciones de aire frío. |
| **Evidencia en la tarjeta** | «*N* ciclos en 30 min», «*S* s abierta por ciclo», «se observa corriente cerca de la entrada», exterior 5–8 °C. |
| **Causa probable** | Tiempos de apertura largos y ciclos frecuentes sin barrera intermedia (no hay vestíbulo de aire ni puerta doble). |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «La puerta se abre 15 veces en 30 minutos.» | **D** | Dato numérico de la tarjeta (⚠️ la frase está fijada a 15 en el código, aunque tu variación pueda decir 12 o 20: sigue siendo **D**). |
| «Se observa corriente cerca de la entrada.» | **O** | Observación directa descrita. |
| «Puede haber pérdidas de calor por las aperturas.» | **I** | Inferencia a partir de ΔT + aperturas. |
| «Instalar un vestíbulo de aire reduciría el consumo un 30 %.» | **H** | Hipótesis con un porcentaje **no comprobado**: hay que medirlo. |

**Frase propia de ejemplo:** «El suelo junto a la puerta se enfría en horas punta» → **O** (observación) → **I**: «las infiltraciones afectan a esa zona».

## 5 · Medidas de mejora (respuesta modelo)

1. **Vestíbulo de aire (cortina de aire)** (barra la entrada de aire frío sin frenar el paso).
2. **Puerta doble de acceso** (doble cerramiento: nunca se comunican directamente interior y exterior).
3. *(Alternativa)* Reducir el tiempo de apertura de la puerta.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Velocidad del aire y temperatura junto a la entrada (o tiempo real de apertura) |
| **Instrumento** | Anemómetro + termómetro (o cronómetro para el % de apertura) |

## 7 · Cálculo ✔ — % de la franja con la puerta abierta

**Fórmula:** `Ciclos × Segundos / 60 = Minutos · / Franja × 100 = %`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 15 ciclos × 45 s · franja 30 min | 15×45 = 675 s = 11,25 min → 11,25/30 × 100 | **37,5 % franja** |
| V2 | 20 ciclos × 40 s · franja 30 min | 20×40 = 800 s ≈ 13,33 min → 13,33/30 × 100 | **44,4 % franja** |
| V3 | 12 ciclos × 50 s · franja 30 min | 12×50 = 600 s = 10 min → 10/30 × 100 | **33,3 % franja** |

> Entre un tercio y casi la mitad de la franja de acceso con la puerta abierta: de ahí el impacto «alto» de las medidas.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Alto | Vestíbulo de aire: 800–2.500 €; puerta doble: obra. |
| **Impacto** | Alto | 33–44 % de apertura en franja de acceso con ΔT de 13–16 °C. |
| **Dificultad** | Media | Instalación con obra menor y coordinación con el uso del acceso. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **RITE · Reglamento de Instalaciones Térmicas** |
| **Apartado consultado** | IT 1 · Exigencias de bienestar e higiene |
| **Dato encontrado** | IT 1.1.4.2 regula la velocidad media del aire y el control de infiltraciones; IT 1.1.4.1 fija la temperatura del aire. |
| **Aplicación a la tarjeta** | Justifica evitar corrientes junto a la entrada y limitar la pérdida de calor por aperturas frecuentes. |
| **Fuente técnica** | **IDAE** — guías de eficiencia en instalaciones térmicas: pérdidas por accesos y vestíbulos. |
| **Aplicación** | Estimación de la infiltración por apertura para dimensionar la cortina de aire. |

> Alternativa del desplegable: **CTE DB-HE** (HE1 · permeabilidad de huecos y cerramientos).

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

**Actuación prioritaria sugerida:** reducir el tiempo de apertura + ajuste de la programación de la puerta — **≈ 100 €** (programación/software, rango 0–100 €).
**Justificación:** reduce el 33–44 % de apertura sin obra; el vestíbulo de aire (800–2.500 €) es la medida definitiva pero consume casi todo el presupuesto de los 1.500 €, así que se prioriza solo si esta es la única tarjeta con foco de acceso.
