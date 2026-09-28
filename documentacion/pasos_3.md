# Paso 4 · Preguntas de desbloqueo por zona

## 🎯 Objetivo

Impedir que el alumno sepa directamente dónde va cada aparato:

1. El **banco de aparatos** ya no se agrupa por zona; se mezcla y agrupa por **tipo** (sensor / actuador / controlador / gateway).
2. Las **descripciones de cada zona** se han eliminado (revelaban la respuesta).
3. Cada zona está **bloqueada por defecto**: para poder soltar aparatos, el alumno debe **responder correctamente** una pregunta teórica sobre esa zona.
4. Las preguntas se extraen de la **documentación del curso** ELEE017PO.

## 🔒 Zonas bloqueadas por defecto

Al entrar al dashboard, las 8 zonas aparecen bloqueadas:

- Aspecto atenuado, con icono 🔒 superpuesto.
- Etiqueta roja `🔒` junto al título.
- Botón `❓ Responder` en cada zona.

## ❓ Modal de pregunta

Al pulsar `❓ Responder`:

1. Se elige **una pregunta aleatoria** de la base de esa zona.
2. Se muestran **3 opciones** (solo una correcta).
3. El alumno pulsa una opción:
   - ✅ **Acierto** → feedback verde, se desbloquea la zona, se cierra el modal tras 1,2 s.
   - ❌ **Fallo** → feedback rojo, se carga **otra pregunta** al cabo de 1,8 s.

## 🔓 Desbloqueo

Cuando se acierta:

- La zona pierde el filtro de bloqueo.
- El estado pasa a `🔓`.
- El botón queda deshabilitado con `✅ Desbloqueada`.
- Ya se pueden **soltar aparatos** dentro.

## 🗂️ Base de preguntas (`js/preguntas.js`)

Distribución actual:

| Zona | Nº preguntas |
|---|---|
| Exterior | 3 |
| Envolvente | 3 |
| Interior | 4 |
| Eléctrico | 3 |
| Hidráulico | 3 |
| Térmico | 4 |
| Control | 4 |
| Gateway | 5 |

Todas las preguntas y opciones están extraídas directamente de los PDFs del curso:

- *Condiciones Interiores y Exteriores* → zonas exterior, envolvente, interior
- *Sensores y sistemas de medición* → zonas interior, envolvente
- *Medida y Monitorización de Consumos* → zonas eléctrico, hidráulico, térmico
- *Sistemas de Monitorización y Comunicación* → zonas control, gateway

## 💾 Persistencia

El objeto `zonasDesbloqueadas` se guarda en `localStorage` junto al resto del progreso. Al recargar, las zonas ya desbloqueadas se mantienen así.

## 🧹 Reset

Al pulsar `🔄 Reiniciar`:

- Se vacían `colocados` y `zonasDesbloqueadas`.
- Todas las zonas vuelven a estado bloqueado.
- Los botones de pregunta se reactivan.

## 🔐 Auto-colocar (solo profesor)

El botón `🤖 Auto-colocar` ahora también desbloquea todas las zonas sin preguntar, para que el profesor pueda mostrar la solución rápidamente.

## 📌 Decisiones tomadas

- Las preguntas se eligen **al azar** cada vez que se abre el modal.
- Al fallar **no se bloquea la zona**; simplemente se carga otra pregunta.
- Los aciertos no se acumulan: solo hay que acertar **una vez** por zona.
- El profesor en modo examen **no** desbloquea automáticamente: el alumno sigue respondiendo.
- El profesor **sí** puede desbloquear todo con "Auto-colocar" cuando no haya examen activo.