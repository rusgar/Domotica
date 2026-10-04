/* ============================================================
   GENERACIÓN DEL INFORME (JSON + XLSX)
   ============================================================ */

// Generar el objeto JSON con todos los datos del alumno
function construirInformeJSON(nombre, grupo, email, iniciales) {
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
      grupo: grupo.trim(),
      email: email.trim()
    },
    puntuacion: {
      aciertosAuto: puntGlobal.aciertosAuto,
      pendienteManual: puntGlobal.pendienteManual,
      totalMaximo: puntGlobal.totalMaximo
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

// Descargar el XLSX
function descargarXLSX(informe, nombre) {
  if (typeof ExcelJS === 'undefined') {
    alert('ExcelJS no está cargado. Solo se descargará el JSON.');
    return;
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = 'Dashboard Domótica';
  wb.created = new Date();

  // ============================================================
  // HOJA 1: PORTADA
  // ============================================================
  const wsPortada = wb.addWorksheet('Portada');
  wsPortada.columns = [
    { header: '', key: 'a', width: 28 },
    { header: '', key: 'b', width: 50 }
  ];

  wsPortada.addRow(['INFORME DE AUDITORÍA ENERGÉTICA']).font = { bold: true, size: 16, color: { argb: 'FF38BDF8' } };
  wsPortada.addRow([]);
  wsPortada.addRow(['Alumno', informe.alumno.nombre]);
  wsPortada.addRow(['Grupo', informe.alumno.grupo || '—']);
  wsPortada.addRow(['Email', informe.alumno.email || '—']);
  wsPortada.addRow(['Fecha', informe.meta.fechaLegible]);
  wsPortada.addRow(['Ejercicio', informe.meta.ejercicioNombre]);
  wsPortada.addRow(['Duración', informe.meta.duracionLegible]);
  wsPortada.addRow([]);

  wsPortada.addRow(['PUNTUACIÓN AUTOMÁTICA']).font = { bold: true, size: 12 };
  wsPortada.addRow(['Aciertos automáticos', informe.puntuacion.aciertosAuto]);
  wsPortada.addRow(['Pendiente corrección manual', informe.puntuacion.pendienteManual]);
  wsPortada.addRow(['Total máximo', informe.puntuacion.totalMaximo]);
  wsPortada.addRow([]);

  wsPortada.addRow(['PRESUPUESTO']).font = { bold: true, size: 12 };
  wsPortada.addRow(['Máximo', informe.presupuesto.maximo + ' €']);
  wsPortada.addRow(['Total propuesto', informe.presupuesto.total + ' €']);
  wsPortada.addRow(['Dentro del presupuesto', informe.presupuesto.dentro ? 'SÍ' : 'NO']);
  wsPortada.addRow(['Restante', informe.presupuesto.restante + ' €']);

  // Estilos de la portada
  wsPortada.eachRow((row, i) => {
    row.eachCell(cell => {
      if (i === 1) return; // título
      if (typeof cell.value === 'string' && cell.value.includes(':')) return;
      cell.alignment = { vertical: 'middle' };
    });
  });

  // ============================================================
  // HOJA 2: TARJETAS Y RESPUESTAS
  // ============================================================
  const wsTarjetas = wb.addWorksheet('Respuestas');
  wsTarjetas.columns = [
    { header: 'Tarjeta', key: 'tarjeta', width: 20 },
    { header: 'Apartado', key: 'apartado', width: 35 },
    { header: 'Respuesta', key: 'respuesta', width: 70 }
  ];

  wsTarjetas.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsTarjetas.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };

  informe.tarjetas.forEach(t => {
    const f = t.ficha;
    const rowTarjeta = t.tarjetaNombre;

    wsTarjetas.addRow([rowTarjeta, '—', '—']).font = { bold: true, color: { argb: 'FF38BDF8' } };
    wsTarjetas.addRow([rowTarjeta, 'Condiciones interiores', f.condicionesInteriores.join(', ') || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Factores exteriores', f.factoresExteriores.join(', ') || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Problema principal', f.problemaPrincipal || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Evidencia', f.evidencia || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Causa probable', f.causaProbable || '—']);

    // DOIH
    const frases = state.auditoria.tarjetas[t.indice - 1].frasesDOIH;
    frases.forEach((frase, i) => {
      const marcada = f.doih[i] || '—';
      const correcta = frase.correcta;
      const acierto = marcada === correcta ? '✅' : '❌';
      wsTarjetas.addRow([rowTarjeta, `Clasificación: "${frase.texto.slice(0, 50)}..."`, `${marcada} ${acierto} (correcta: ${correcta})`]);
    });

    wsTarjetas.addRow([rowTarjeta, 'Frase propia', f.frasesPropias || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Medida 1', f.medida1 || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Medida 2', f.medida2 || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Qué medirías', f.queMedirias || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Con qué instrumento', f.conQueInstrumento || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Cálculo introducido', f.calculo !== null ? f.calculo : '—']);
    wsTarjetas.addRow([rowTarjeta, 'Ahorro estimado', f.ahorroEstimado || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Coste', `${f.coste || '—'} · ${f.costeJustificacion || ''}`]);
    wsTarjetas.addRow([rowTarjeta, 'Impacto', `${f.impacto || '—'} · ${f.impactoJustificacion || ''}`]);
    wsTarjetas.addRow([rowTarjeta, 'Dificultad', `${f.dificultad || '—'} · ${f.dificultadJustificacion || ''}`]);
    wsTarjetas.addRow([rowTarjeta, 'Fuente oficial', `${f.fuenteOficial.id || '—'} · ${f.fuenteOficial.apartado || ''}`]);
    wsTarjetas.addRow([rowTarjeta, 'Dato encontrado (oficial)', f.fuenteOficial.datoEncontrado || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Aplicación (oficial)', f.fuenteOficial.aplicacion || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Fuente técnica', f.fuenteTecnica.id || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Información técnica', f.fuenteTecnica.informacion || '—']);
    wsTarjetas.addRow([rowTarjeta, 'Aplicación (técnica)', f.fuenteTecnica.aplicacion || '—']);
    wsTarjetas.addRow([]);
  });

  // ============================================================
  // HOJA 3: CÁLCULOS
  // ============================================================
  const wsCalculos = wb.addWorksheet('Cálculos');
  wsCalculos.columns = [
    { header: 'Tarjeta', key: 'tarjeta', width: 20 },
    { header: 'Fórmula', key: 'formula', width: 40 },
    { header: 'Respuesta alumno', key: 'alumno', width: 18 },
    { header: 'Respuesta correcta', key: 'correcto', width: 18 },
    { header: 'Unidad', key: 'unidad', width: 12 },
    { header: '¿Correcto?', key: 'ok', width: 12 }
  ];
  wsCalculos.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsCalculos.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };

  informe.tarjetas.forEach((t, i) => {
    const tarjeta = state.auditoria.tarjetas[i];
    const variacion = t.variacion;
    const ficha = t.ficha;

    if (!tarjeta.calculo || tarjeta.calculo.valor(variacion) === null) {
      wsCalculos.addRow([t.tarjetaNombre, tarjeta.calculo?.formula || '—', '—', '—', '—', 'Sin cálculo auto']);
      return;
    }

    const correcto = tarjeta.calculo.valor(variacion);
    const validacion = validarCalculo(
      ficha.calculo,
      correcto,
      tarjeta.calculo.tolerancia,
      tarjeta.calculo.decimales,
      tarjeta.calculo.unidad
    );

    wsCalculos.addRow([
      t.tarjetaNombre,
      tarjeta.calculo.formula,
      ficha.calculo !== null ? ficha.calculo : '—',
      validacion.correcto,
      tarjeta.calculo.unidad,
      validacion.ok ? '✅ SÍ' : '❌ NO'
    ]);
  });

  // ============================================================
  // HOJA 4: PRESUPUESTO
  // ============================================================
  const wsPresupuesto = wb.addWorksheet('Presupuesto');
  wsPresupuesto.columns = [
    { header: 'Tarjeta', key: 'tarjeta', width: 20 },
    { header: 'Coste estimado (€)', key: 'coste', width: 18 },
    { header: 'Justificación', key: 'just', width: 60 }
  ];
  wsPresupuesto.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsPresupuesto.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };

  informe.tarjetas.forEach(t => {
    wsPresupuesto.addRow([
      t.tarjetaNombre,
      t.ficha.costeEstimado || 0,
      t.ficha.justificacionPresupuesto || '—'
    ]);
  });

  wsPresupuesto.addRow([]);
  wsPresupuesto.addRow(['TOTAL', informe.presupuesto.total, '']);
  wsPresupuesto.addRow(['MÁXIMO', informe.presupuesto.maximo, '']);
  wsPresupuesto.addRow(['DENTRO', informe.presupuesto.dentro ? 'SÍ' : 'NO', '']);
  wsPresupuesto.addRow(['RESTANTE', informe.presupuesto.restante, '']);

  // ============================================================
  // HOJA 5: RÚBRICA
  // ============================================================
  const wsRubrica = wb.addWorksheet('Rúbrica');
  wsRubrica.columns = [
    { header: 'Criterio', key: 'criterio', width: 35 },
    { header: 'Puntos máx.', key: 'max', width: 14 },
    { header: 'Auto', key: 'auto', width: 14 },
    { header: 'Manual', key: 'manual', width: 14 },
    { header: 'Observaciones', key: 'obs', width: 40 }
  ];
  wsRubrica.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsRubrica.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };

  const n = informe.tarjetas.length;
  wsRubrica.addRow(['Datos y evidencias', n * 2, '', '', '']);
  wsRubrica.addRow(['Clasificación DOIH', n * 3, '', '', '']);
  wsRubrica.addRow(['Cálculos', n * 4, '', '', '']);
  wsRubrica.addRow(['Medidas propuestas', n * 3, '', '', '']);
  wsRubrica.addRow(['Investigación / fuentes', n * 2, '', '', '']);
  wsRubrica.addRow(['Normativa', n * 1, '', '', '']);
  wsRubrica.addRow(['Presupuesto justificado', n * 2, '', '', '']);
  wsRubrica.addRow(['Defensa oral', 10, '', '', '']);
  wsRubrica.addRow([]);
  wsRubrica.addRow(['TOTAL', `=SUM(B2:B9)`, informe.puntuacion.aciertosAuto, '', '']).font = { bold: true };

  // ============================================================
  // DESCARGAR
  // ============================================================
  return wb.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    descargarBlob(blob, generarNombreBase(nombre, 'xlsx'));
  });
}

// ============================================================
// FUNCIÓN PRINCIPAL: generar y descargar informe
// ============================================================
async function generarInforme() {
  const nombre = document.getElementById('informeNombre').value.trim();
  const iniciales = document.getElementById('informeIniciales').value.trim().toUpperCase();
  const grupo = document.getElementById('informeGrupo').value.trim();
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

  const informe = construirInformeJSON(nombre, grupo, email, iniciales);

  // 1. Descargar JSON
  descargarJSON(informe, nombre);

  // 2. Descargar XLSX
  try {
    await descargarXLSX(informe, nombre);
  } catch (e) {
    console.error('Error generando XLSX:', e);
    alert('El JSON se ha descargado correctamente, pero hubo un problema con el XLSX.');
  }

  // 3. Si el alumno eligió la carpeta "resultados" → guardar copia silenciosa
  if (typeof guardarEnCarpetaResultados === 'function' && carpetaResultadosElegida()) {
    try {
      await guardarEnCarpetaResultados(informe, nombre);
    } catch (e) {
      console.warn('No se pudo guardar en la carpeta resultados:', e);
    }
  }

  cerrarModalInforme();

  // Mensaje final
  alert(`✅ Informe descargado:\n\n· ${generarNombreBase(nombre, 'json')}\n· ${generarNombreBase(nombre, 'xlsx')}\n\nEntrega estos archivos al profesor.`);
}