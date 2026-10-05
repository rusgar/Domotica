# Solución modelo · Tarjeta 3 — TALLER 🔧

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen (1 decimal).

---

## 1 · Condiciones interiores afectadas ✔

- [x] Temperatura interior
- [x] Velocidad del aire

> La corriente de aire perceptible y la pérdida de calor son los dos efectos interiores del portón abierto. El resto no aparece en el escenario.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior
- [x] Viento

> El diferencial interior/exterior (7–8 °C vs. 18–20 °C) y el viento que entra por el portón abierto.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | El portón permanece abierto una fracción apreciable de la jornada con calefacción encendida, entrando aire frío y generando corriente de aire. |
| **Evidencia en la tarjeta** | «Se abre *N* veces al día durante *M* min en cambios de grupo», «corriente de aire perceptible», exterior 5–8 °C frente a interior 18–20 °C. |
| **Causa probable** | Pérdidas térmicas por infiltración directa al exterior durante las aperturas, sin compensación (aire acondicionado, malla cortina o cortina de aire). |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «El portón se abre 6 veces al día.» | **D** | Dato numérico de la tarjeta (según tu variación: 5, 6 u 8; sigue siendo **D**). |
| «Hay corriente de aire cerca del portón.» | **O** | Observación directa descrita. |
| «Puede haber infiltraciones de aire frío.» | **I** | Inferencia a partir de aperturas + ΔT. |
| «La calefacción no llega a compensar las pérdidas.» | **H** | Hipótesis que habría que comprobar midiendo temperatura y caudal. |

**Frase propia de ejemplo:** «Los alumnos notan frío justo después de cada cambio de grupo» → **O** (observación) → de ahí la **I**: «las pérdidas coinciden con las aperturas del portón».

## 5 · Medidas de mejora (respuesta modelo)

1. **Puertas rápidas o cortinas de aire** (reducen el tiempo de intercambio en cada apertura).
2. **Organización de cambios de grupo para minimizar aperturas** (agrupar entradas/salidas; medida sin coste).
3. *(Alternativa)* Sensores de cierre automático.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Diferencia de temperatura interior/exterior y velocidad del aire cerca del portón |
| **Instrumento** | Termómetros (o termopar) + anemómetro |

## 7 · Cálculo ✔ — % de jornada con el portón abierto

**Fórmula:** `Aperturas × Minutos = Minutos totales / 60 = Horas` → `Horas / Jornada × 100 = %`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 6 aperturas × 20 min · jornada 8 h | 6×20 = 120 min = 2 h → 2/8 × 100 | **25,0 % jornada** |
| V2 | 8 aperturas × 15 min · jornada 8 h | 8×15 = 120 min = 2 h → 2/8 × 100 | **25,0 % jornada** |
| V3 | 5 aperturas × 25 min · jornada 8 h | 5×25 = 125 min ≈ 2,083 h → 2,083/8 × 100 | **26,0 % jornada** |

> Un cuarto de jornada (o más) con el portón comunicando con el exterior: por eso el impacto de las medidas es alto.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Medio | Cortina de aire o puerta rápida: cientos–miles de €; reorganizar turnos no cuesta. |
| **Impacto** | Alto | ~25 % de la jornada con infiltración directa de aire a 5–8 °C. |
| **Dificultad** | Media | Puede requerir obra/electricidad para la cortina y coordinación de horarios. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **RITE · Reglamento de Instalaciones Térmicas** |
| **Apartado consultado** | IT 1 · Exigencias de bienestar e higiene |
| **Dato encontrado** | IT 1.1.4.2 regula el control de infiltraciones y la velocidad media del aire para evitar corrientes. |
| **Aplicación a la tarjeta** | Justifica limitar el tiempo de apertura del portón y evitar corrientes de aire perceptibles en la zona de trabajo. |
| **Fuente técnica** | **IDAE** — guías de eficiencia en instalaciones térmicas: pérdidas por huecos y puertas de acceso. |
| **Aplicación** | Criterios para estimar la pérdida energética por apertura y dimensionar la cortina de aire. |

> Alternativa del desplegable: **CTE DB-HE** (HE1 · Condiciones de la envolvente térmica: permeabilidad al aire de huecos).

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

**Actuación prioritaria sugerida:** organización de cambios de grupo + sensores de cierre automático — **≈ 200 €** (rango sensores de cierre: 100–400 €).
**Justificación:** ataca directamente los 120–125 min/día de apertura con coste bajo; la cortina de aire (coste medio) se deja como segunda fase si sobra presupuesto en los 1.500 €.
