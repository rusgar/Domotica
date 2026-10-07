/* ============================================================
   GENERACIÓN DEL INFORME (JSON)
   ============================================================ */

// Generar el objeto JSON con todos los datos del alumno
function construirInformeJSON(nombre, email, iniciales) {
  const { ejercicio, config, tarjetas, variaciones, fichas } = state.auditoria;
  const ahora = new Date();

  // Calcular puntuación automática global
  const puntGlobal = calcularPuntuacionEjercicio(fichas, tarjetas, variaciones);

  // Calcular presupuesto (tope POR TARJETA, obligatorio en el apartado 8)
  const tope = config?.presupuestoPorTarjeta || 0;
  const totalPresupuesto = fichas.reduce((s, f) => s + (parseFloat(f.costeEstimado) || 0), 0);
  const rellenas = fichas.filter(f => {
    const v = f.costeEstimado;
    const c = parseFloat(v);
    return v !== '' && v !== null && v !== undefined && !isNaN(c) && c > 0;
  }).length;
  const todasRellenas = rellenas === fichas.length;

  return {
    meta: {
      version: '1.0',
      fecha: ahora.toISOString(),
      fechaLegible: ahora.toLocaleString('es-ES'),
      ejercicio,
      ejercicioNombre: config?.nombre || '',
      duracionSegundos: state.cronometro.segundos,
      duracionLegible: formatearTiempo(state.cronometro.segundos),
      // Tiempo SOLO del ejercicio: sobre él se aplica la penalización (>60 min → −0,25)
      duracionEjercicioSegundos: state.auditoria.segundos || 0,
      duracionEjercicioLegible: formatearTiempo(state.auditoria.segundos || 0)
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
      // El alumno NO ve nota en el JSON: la puntuación automática solo la
      // calcula y muestra el panel del profesor (Auto/5 × 1,25 por tarjeta).
      notaMaxima: ESCALA_AUDITORIA.puntosPorEjercicio,        // 10 por ejercicio
      puntosPorTarjeta: ESCALA_AUDITORIA.puntosPorTarjeta,    // 5
      notaTotalAuditoria: ESCALA_AUDITORIA.puntosTotales      // 10
    },
    presupuesto: {
      maximo: tope * fichas.length,          // total de las 2 tarjetas (1.500 €)
      porTarjeta: tope,                      // 750 € por tarjeta
      rellenas,
      total: redondear(totalPresupuesto, 2),
      dentro: todasRellenas && totalPresupuesto <= (tope * fichas.length),
      restante: redondear((tope * fichas.length) - totalPresupuesto, 2)
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

  // Presupuesto: precio obligatorio en el apartado 8 y dentro del tope de cada tarjeta
  const cfgPres = state.auditoria.config || {};
  const topeTarjeta = cfgPres.presupuestoPorTarjeta || 0;
  const problemasPres = [];
  (state.auditoria.fichas || []).forEach((f, i) => {
    const v = f.costeEstimado;
    const c = parseFloat(v);
    const relleno = v !== '' && v !== null && v !== undefined && !isNaN(c) && c > 0;
    const nombreTarjeta = ((state.auditoria.tarjetas || [])[i] || {}).nombre || `Tarjeta ${i + 1}`;
    if (!relleno) {
      problemasPres.push(`· ${nombreTarjeta}: falta el precio de la actuación (apartado 8, obligatorio).`);
    } else if (c > topeTarjeta) {
      problemasPres.push(`· ${nombreTarjeta}: ${formatearNumero(c, 0)} € supera el tope de ${topeTarjeta} € de esta tarjeta.`);
    }
  });

  if (problemasPres.length) {
    err.innerHTML = '❌ <strong>Revisa el presupuesto antes de entregar:</strong><br>' +
      problemasPres.join('<br>') +
      '<br><br>El precio va en el <strong>apartado 8</strong> de cada tarjeta.';
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