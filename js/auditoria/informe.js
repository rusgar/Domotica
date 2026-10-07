/* ============================================================
   GENERACIÓN DEL INFORME (JSON)
   ============================================================ */

// Generar el objeto JSON con todos los datos del alumno
function construirInformeJSON(nombre, email, iniciales) {
  const { ejercicio, config, tarjetas, variaciones, fichas } = state.auditoria;
  const ahora = new Date();

  // Calcular puntuación automática global
  const puntGlobal = calcularPuntuacionEjercicio(fichas, tarjetas, variaciones);

  // Calcular presupuesto
  const totalPresupuesto = fichas.reduce((s, f) => s + (parseFloat(f.costeEstimado) || 0), 0);

  return {
    meta: {
      version: '1.0',
      fecha: ahora.toISOString(),
      fechaLegible: ahora.toLocaleString('es-ES'),
      ejercicio,
      ejercicioNombre: config?.nombre || '',
      duracionSegundos: state.cronometro.segundos,
      duracionLegible: formatearTiempo(state.cronometro.segundos)
    },
    alumno: {
      nombre: nombre.trim(),
      iniciales: (iniciales || '').trim().toUpperCase(),
      email: email.trim()
    },
    puntuacion: {
      aciertosAuto: puntGlobal.aciertosAuto,
      pendienteManual: puntGlobal.pendienteManual,
      totalMaximo: puntGlobal.totalMaximo,
      // El alumno NO se puntúa: la nota la da el profesor tras verificar con soluciones/
      notaMaxima: ESCALA_AUDITORIA.puntosPorEjercicio,        // 10 por ejercicio
      puntosPorTarjeta: ESCALA_AUDITORIA.puntosPorTarjeta,    // 5
      notaTotalAuditoria: ESCALA_AUDITORIA.puntosTotales      // 10
    },
    presupuesto: {
      maximo: config?.presupuesto || 0,
      total: redondear(totalPresupuesto, 2),
      dentro: totalPresupuesto <= (config?.presupuesto || 0),
      restante: redondear((config?.presupuesto || 0) - totalPresupuesto, 2)
    },
    tarjetas: tarjetas.map((t, i) => ({
      indice: i + 1,
      tarjetaId: t.id,
      tarjetaNombre: t.nombre,
      variacion: variaciones[i],
      ficha: fichas[i]
    }))
  };
}

// Descargar un archivo (blob) al disco duro del alumno
function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// Generar el nombre base del informe
function generarNombreBase(nombre, extension) {
  const fecha = new Date();
  const fechaStr = fecha.getFullYear() + '-' +
    String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
    String(fecha.getDate()).padStart(2, '0') + '_' +
    String(fecha.getHours()).padStart(2, '0') + 'h' +
    String(fecha.getMinutes()).padStart(2, '0');
  const nombreLimpio = nombre.trim().replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  return `informe_${nombreLimpio}_${fechaStr}.${extension}`;
}

// Descargar el JSON
function descargarJSON(informe, nombre) {
  const json = JSON.stringify(informe, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  descargarBlob(blob, generarNombreBase(nombre, 'json'));
}

// ============================================================
// FUNCIÓN PRINCIPAL: generar y descargar informe
// ============================================================
async function generarInforme() {
  const nombre = document.getElementById('informeNombre').value.trim();
  const iniciales = document.getElementById('informeIniciales').value.trim().toUpperCase();
  const email = document.getElementById('informeEmail').value.trim();
  const err = document.getElementById('informeError');

  if (!nombre) {
    err.textContent = '❌ El nombre es obligatorio.';
    err.classList.add('show');
    return;
  }

  if (!/^[A-ZÑ]{2,4}$/.test(iniciales)) {
    err.textContent = '❌ Introduce tus iniciales (2 a 4 letras).';
    err.classList.add('show');
    return;
  }

  // Recordar iniciales para constancias y JSON de Colocar aparatos
  try { localStorage.setItem('dashboard_iniciales', iniciales); } catch (e) {}

  err.classList.remove('show');

  const informe = construirInformeJSON(nombre, email, iniciales);

  // Descargar el JSON (el archivo que se sube a Moodle)
  descargarJSON(informe, nombre);

  cerrarModalInforme();

  // Abrir la tarea de Moodle para que suba el JSON
  const url = urlMoodleTarea();
  if (url) window.open(url, '_blank', 'noopener');

  const base = generarNombreBase(nombre, 'json');
  if (url) {
    alert(
      `✅ JSON descargado:\n\n· ${base}\n\n` +
      `Se ha abierto Moodle en otra pestaña.\n` +
      `1. Inicia sesión con TU usuario y contraseña de Moodle.\n` +
      `2. Entra en la tarea de auditoría.\n` +
      `3. Sube el archivo «${base}».\n\n` +
      `El profesor lo descargará desde Moodle para evaluarlo.`
    );
  } else {
    alert(
      `✅ JSON descargado:\n\n· ${base}\n\n` +
      `Entra en Moodle con TU usuario, abre la tarea de auditoría\n` +
      `y sube el archivo «${base}».\n` +
      `(El profesor todavía no ha configurado la URL de la tarea.)`
    );
  }
}

// URL de la tarea de Moodle (configurada por el profesor en js/config.js)
function urlMoodleTarea() {
  if (typeof MOODLE === 'undefined' || !MOODLE.urlTarea) return '';
  return String(MOODLE.urlTarea).trim();
}