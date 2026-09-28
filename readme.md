# 🏢 Dashboard de Monitorización de Edificios

Dashboard interactivo para que los alumnos aprendan a **colocar cada sensor, actuador, controlador y gateway** en la zona correcta de un edificio, según los contenidos del curso **ELEE017PO · Domótica y Monitorización del Consumo en Edificios**.

## 📚 Contexto

El proyecto nace como material didáctico para las siguientes unidades:

- **Tema 2** – Condiciones interiores y exteriores
- **Tema 3** – Medida y monitorización de consumos
- **Tema 4** – Sistemas de monitorización y comunicación

Los alumnos deben arrastrar cada aparato hasta la zona del edificio donde se instalaría en la realidad: exterior, envolvente, interior, cuadro eléctrico, sala hidráulica, sala térmica, sala de control o gateways.

## 🎯 Objetivos didácticos

- Identificar el tipo de aparato por su función (sensor, actuador, controlador, gateway).
- Asociar cada aparato a la zona física del edificio donde tiene sentido instalarlo.
- Comprender la cadena: **sensor → gateway → controlador → actuador**.
- Reflexionar sobre el coste económico de una instalación de monitorización.

## 🚀 Cómo usarlo

1. Abre `index.html` en cualquier navegador moderno.
2. Pulsa **"Entrar como alumno"** para empezar la actividad.
3. Arrastra los aparatos desde la izquierda hasta las zonas del edificio.
4. Pulsa **"Verificar colocación"** cuando hayas terminado.

### Modo profesor

- Pulsa **"Entrar como profesor"**.
- Usuario: `profe` · Contraseña: `domotica2025`
- Se desbloquean:
  - Botón **Auto-colocar** (solución rápida).
  - Botón **Modo examen** (bloquea pistas y reset, añade cuenta atrás).
  - Atajo de teclado `Ctrl + Shift + A` para auto-colocar.

## 📁 Estructura

dashboard-domotica/
├── index.html
├── css/
│ └── styles.css
├── js/
│ ├── config.js ← credenciales y constantes
│ ├── datos.js ← catálogo de aparatos y zonas
│ ├── estado.js ← estado global
│ ├── storage.js ← persistencia en localStorage
│ ├── cronometro.js ← cronómetro
│ ├── login.js ← login alumno/profesor
│ ├── dragdrop.js ← arrastrar y soltar
│ ├── validacion.js ← verificación, pistas, reset
│ ├── examen.js ← modo examen
│ ├── ui.js ← renderizado de la interfaz
│ └── main.js ← arranque y atajos
├── documentacion/
│ ├── pasos_1.md
│ ├── pasos_2.md
│ └── pasos_3.md
├── README.md
└── .gitignore


## 🔧 Personalización rápida

| Qué quiero cambiar | Dónde |
|---|---|
| Usuario y contraseña del profesor | `js/config.js` |
| Duración del examen | `js/config.js` → `CONFIG.duracionExamenSegundos` |
| Añadir/quitar aparatos | `js/datos.js` → array `APARATOS` |
| Añadir zonas al edificio | `index.html` + `js/datos.js` → `NOMBRES_ZONAS` |
| Colores y estilos | `css/styles.css` |

## 🗺️ Hoja de ruta

- [x] Colocar aparatos por zonas con drag & drop
- [x] Login alumno / profesor
- [x] Cronómetro
- [x] Guardar progreso en `localStorage`
- [x] Modo examen con cuenta atrás
- [ ] Ejercicio aleatorio (subconjunto de aparatos)
- [ ] Presupuesto por tipo de edificio
- [ ] Exportación de resultados a CSV

## 📄 Licencia

Material didáctico de uso libre para formación profesional.