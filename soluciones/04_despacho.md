# Solución modelo · Tarjeta 4 — DESPACHO 💼

> **Módulo:** Auditoría por zonas · **Ejercicio 6** (3 tarjetas) y **Global** (2 tarjetas)
> **Parámetros del ejercicio:** precio kWh **0,18 €** · 20 días/mes · presupuesto **1.500 €**
> Los datos numéricos son aleatorios: en el apartado 7 tienes el resultado de **cada variación**.
> **Aceptación del cálculo:** ±0,01 absoluto o 2 % de margen.

---

## 1 · Condiciones interiores afectadas ✔

- [x] Temperatura interior

> Única condición correcta: los equipos encendidos aportan carga térmica. El resto no se menciona en el escenario.

## 2 · Factores exteriores que pueden influir ✔

- [x] Temperatura exterior

> Único factor correcto: influye en la consigna y en la carga de climatización, pero el problema es de consumo eléctrico de equipos.

## 3 · Diagnóstico (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Problema principal** | Equipos de oficina encendidos fuera del horario de actividad (18:00–22:00) consumiendo sin uso, salvo el equipo que necesita continuidad. |
| **Evidencia en la tarjeta** | «A las 18:00 termina la actividad, pero quedan encendidos hasta las 22:00», «*N* puestos pueden apagarse *H* h», «un equipo sí necesita continuidad». |
| **Causa probable** | Falta de política de apagado: no hay programación horaria ni regletas inteligentes, y se mantiene todo conectado por comodidad. |

## 4 · Clasificación D / O / I / H ✔

| Frase | Correcta | Justificación |
|---|---|---|
| «Hay 3 ordenadores en el despacho.» | **D** | Dato numérico de la tarjeta (según variación: 2, 3 u 4; sigue siendo **D**). |
| «Los equipos quedan encendidos hasta las 22:00.» | **O** | Observación directa del horario. |
| «Se podría programar el apagado de dos puestos.» | **I** | Inferencia: la solución se deduce de los datos (puestos que pueden apagarse). |
| «Un solo equipo justifica mantener el servidor encendido.» | **H** | Hipótesis: habría que comprobar qué equipo necesita realmente continuidad. |

**Frase propia de ejemplo:** «El consumo del despacho por la noche es cercano al de la jornada laboral» → **H** (habría que medirlo con un analizador de red).

## 5 · Medidas de mejora (respuesta modelo)

1. **Programación de apagado automático** (software/BIOS: apagar los puestos que no necesitan continuidad a las 18:00).
2. **Regletas inteligentes con horario** (cortan standby de monitores, periféricos y cargadores).
3. *(Alternativa)* Sensores de presencia con retardo.

## 6 · Verificación del diagnóstico

| Campo | Respuesta modelo |
|---|---|
| **Variable a medir** | Potencia activa de los puestos fuera de horario (W) |
| **Instrumento** | Analizador de red o pinza amperimétrica |

## 7 · Cálculo ✔ — consumo mensual evitable

**Fórmula:** `Potencia × Puestos × Horas = kWh/día · × Días = kWh/mes`

| Variación | Datos | Desarrollo | Resultado |
|---|---|---|---|
| V1 | 2 puestos × 120 W · 4 h/día · 20 d | (2×120)/1000 = 0,24 kW → 0,24 × 4 × 20 | **19,20 kWh/mes** (≈ 3,46 €/mes) |
| V2 | 1 puesto × 150 W · 5 h/día · 20 d | (1×150)/1000 = 0,15 kW → 0,15 × 5 × 20 | **15,00 kWh/mes** (≈ 2,70 €/mes) |
| V3 | 3 puestos × 100 W · 4 h/día · 22 d | (3×100)/1000 = 0,30 kW → 0,30 × 4 × 22 | **26,40 kWh/mes** (≈ 4,75 €/mes) |

> El campo a validar es **solo el valor en kWh/mes**, con 2 decimales.

## 8 · Valoración de la actuación ✔ (según `costeImpacto` de la tarjeta)

| Campo | Correcto | Justificación modelo |
|---|---|---|
| **Coste** | Bajo | Programación (software) 0–100 €; regletas 40–150 €/puesto. |
| **Impacto** | Medio | 15–26 kWh/mes evitables + ahorro de standby de periféricos. |
| **Dificultad** | Baja | Sin obra: configuración y cambio de regletas. |

## 9 · Mini-investigación (respuesta modelo)

| Campo | Respuesta modelo |
|---|---|
| **Fuente oficial** | **REBT · Reglamento Electrotécnico Baja Tensión** |
| **Apartado consultado** | ITC-BT-51 · Sistemas de automatización, gestión técnica y seguridad |
| **Dato encontrado** | ITC-BT-51 regula los sistemas de apagado automático y gestión de equipos. |
| **Aplicación a la tarjeta** | Ampara el apagado programado de los puestos manteniendo la continuidad del equipo que la necesita (servidor). |
| **Fuente técnica** | **AFME** — guías técnicas sobre instalaciones eléctricas y domótica. |
| **Aplicación** | Criterios para elegir regletas con horario y estimar consumo en standby. |

> Alternativa del desplegable: **CTE DB-HE** (HE2 · Rendimiento de las instalaciones).

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

**Actuación prioritaria sugerida:** regletas inteligentes con horario para los puestos apagables — **≈ 150 €** (rango 40–150 €/puesto).
**Justificación:** recuperación directa de 15–26 kWh/mes con coste mínimo y sin obra; la programación por software (0–100 €) puede complementarlo.
