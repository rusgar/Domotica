# Paso 2 · Login, cronómetro y persistencia

## 🎯 Objetivo

Añadir tres funcionalidades clave para el uso real en clase:

1. **Login diferenciado** (alumno / profesor) con contraseña oculta.
2. **Cronómetro** que mide el tiempo de resolución de cada alumno.
3. **Persistencia** del progreso en `localStorage` para no perderlo al recargar.

## 🔑 Login

### Pantalla inicial

Al abrir el dashboard aparece una capa de login con dos opciones:

- **👤 Entrar como alumno** → acceso directo sin credenciales.
- **👨‍🏫 Entrar como profesor** → despliega campos de usuario y contraseña.

### Credenciales por defecto


Usuario: profe
Password: domotica2025


Se pueden cambiar en `js/config.js` (`CREDENCIALES_PROFE`).

### ¿Qué desbloquea el profesor?

- Botón **🤖 Auto-colocar** visible.
- Botón **🎓 Modo examen** visible.
- Atajo de teclado `Ctrl + Shift + A` para auto-colocar.
- Badge verde `👨‍🏫 Profesor` en la cabecera.

El alumno solo ve el badge azul `👤 Alumno` y no puede acceder a las funciones avanzadas.

### Cierre de sesión

El botón **"Salir"** vuelve a la pantalla de login, borra el progreso guardado y reinicia el cronómetro.

## ⏱️ Cronómetro

- Empieza a contar al entrar al dashboard.
- Se actualiza cada segundo y se muestra en la cabecera con formato `MM:SS`.
- Se pausa cuando el alumno acierta todos los aparatos.
- Se guarda en `localStorage` junto al resto del progreso.

## 💾 Persistencia (`localStorage`)

### Qué se guarda

```json
{
  "colocados": {
    "dht22": "interior",
    "plc": "control"
  },
  "segundos": 245,
  "zonasDesbloqueadas": { "interior": true },
  "zonasVerificadas": { "interior": true },
  "ultimaPregunta": { "interior": 3 },
  "timestamp": 1732354821000
}
```

- `zonasVerificadas`: zonas a las que el alumno ha pulsado «✓ Validar» y están correctas.
- `ultimaPregunta`: índice de la última pregunta mostrada por zona (para no repetir tras un reinicio).

### Cuándo se guarda

- Al colocar un aparato en una zona.
- Al devolverlo al banco.
- Al validar una zona (correcta o tras des-validarla).
- Cada segundo que avanza el cronómetro.

### Cuándo se carga

Al entrar al dashboard después del login.

Se restauran:

- Los chips ya colocados en sus zonas.
- El tiempo transcurrido.
- El estado del banco (aparatos marcados como usados).
- Las zonas desbloqueadas y las zonas ya validadas (se re-pintan en verde).

### Cuándo se borra

- Al pulsar "Reiniciar" (limpia el progreso y lo guarda en blanco).
- Al cerrar sesión (borra la clave del rol actual).

### Clave de almacenamiento

Cada rol tiene su propia clave para no mezclar progresos:

```text
dashboard_progreso_alumno
dashboard_progreso_profe
```

## 📌 Decisiones tomadas

- El login está en el navegador (no hay backend). Suficiente para uso en clase.
- El cronómetro no cuenta el tiempo desde la última sesión, empieza de cero en cada login.
- El progreso se guarda automáticamente, no hay botón "Guardar".

---

## 📘 `documentacion/pasos_3.md`

```markdown
# Paso 3 · Modo examen

## 🎯 Objetivo

Añadir un **modo examen** que solo el profesor puede activar, con restricciones que simulan una prueba cronometrada real:

- Sin pistas.
- Sin reinicio.
- Sin auto-colocación.
- Cuenta atrás con límite de tiempo.
- Bloqueo total al agotarse el tiempo.

## 🎓 Activación

Solo visible para el profesor en la barra de herramientas:

- Botón **🎓 Activar modo examen** (rojo).
- Al pulsarlo, pide confirmación con un `confirm()` que indica:
  - Se reiniciará el progreso.
  - Duración en minutos.
  - Restricciones activadas.

## ⏳ Cuenta atrás

- Duración por defecto: **5 minutos** (`CONFIG.duracionExamenSegundos = 5 * 60`).
- El cronómetro habitual se sustituye por la cuenta atrás.
- Los últimos 30 segundos se muestran en rojo con animación de pulso.

## 🚫 Restricciones activas

Durante el examen se aplican estas restricciones:

| Acción | Estado |
|---|---|
| Colocar / quitar aparatos | ✅ Permitido |
| Botón "✓ Validar" de cada zona | ✅ Permitido (y obligatorio para puntuar) |
| Botón "✓ Verificar colocación" (barra) | ❌ Deshabilitado |
| Botón "💡 Pista" | ❌ Bloqueado |
| Botón "🔄 Reiniciar" | ❌ Deshabilitado |
| Botón "🤖 Auto-colocar" | ❌ Bloqueado |
| Atajo `Ctrl+Shift+A` | ❌ Bloqueado |
| Cerrar sesión | ✅ Permitido (con confirmación implícita) |

## 📢 Aviso visible

Se muestra un banner rojo parpadeante en la parte superior del dashboard:

> 🎓 MODO EXAMEN ACTIVO · No hay pistas · No se puede reiniciar · No hay auto-colocación

El fondo de la página cambia a un tono morado oscuro para reforzar visualmente que está activo.

## ⏰ Finalización automática

Cuando `segundosRestantes` llega a 0:

1. Se detiene el cronómetro.
2. Se ejecuta `verificarTodo()` automáticamente (revisa las zonas validadas y pinta aciertos/errores).
3. Se muestra un mensaje grande:
   - **⏰ ¡TIEMPO AGOTADO!**
   - Aciertos, errores y tiempo transcurrido.
4. Se bloquean los aparatos (`draggable = false`).
5. Se deshabilita el botón de reinicio.

## 🛑 Detención manual

El profesor puede detener el examen antes de tiempo con el mismo botón, ahora etiquetado:

> 🛑 Detener examen

## 📌 Decisiones tomadas

- El examen **no** oculta la pantalla al alumno; se confía en el control del aula.
- La duración se puede cambiar en `js/config.js` sin tocar más código.
- Al terminar el tiempo **no** se cierra sesión: el alumno puede ver su resultado hasta que el profesor lo indique.