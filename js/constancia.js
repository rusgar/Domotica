/* ============================================================
   CONSTANCIAS (imágenes PNG) Y JSON CON INICIALES
   Tarjetas resumen dibujadas con <canvas> (sin librerías).
   · Colocar aparatos → "TODO CORRECTO" + tiempo
   · Auditoría        → "TODAS LAS FICHAS VALIDADAS" + tiempo
   El alumno descarga la imagen y la manda al profesor.
   Las notas NO aparecen en la imagen (solo las ve el profesor).
   ============================================================ */

// ------------------------------------------------------------
// INICIALES del alumno (2-4 letras), pedidas una sola vez
// ------------------------------------------------------------
function getIniciales() {
  try { return localStorage.getItem('dashboard_iniciales') || ''; } catch (e) { return ''; }
}

function pedirIniciales() {
  let ini = getIniciales().toUpperCase();
  while (!/^[A-ZÑ]{2,4}$/.test(ini)) {
    const entrada = prompt('Escribe tus INICIALES (2 a 4 letras) para la constancia:\n\nEj: AGL');
    if (entrada === null) return '';               // cancelado
    ini = entrada.trim().toUpperCase();
    if (!/^[A-ZÑ]{2,4}$/.test(ini)) {
      alert('❌ Introduce entre 2 y 4 letras (sin números ni espacios).');
    }
  }
  try { localStorage.setItem('dashboard_iniciales', ini); } catch (e) {}
  return ini;
}

// ------------------------------------------------------------
// Descarga un canvas como PNG
// ------------------------------------------------------------
function descargarCanvasComoPNG(canvas, nombreArchivo) {
  canvas.toBlob(blob => {
    if (!blob) { alert('No se pudo generar la imagen.'); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }, 'image/png');
}

// ------------------------------------------------------------
// Dibuja la tarjeta constancia en un canvas
// opts: { titulo, estado, detalle, tiempo, iniciales, fecha }
// ------------------------------------------------------------
function dibujarConstancia(opts) {
  const W = 1000, H = 560;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Fondo
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Borde verde
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 6;
  ctx.strokeRect(15, 15, W - 30, H - 30);
  ctx.strokeStyle = 'rgba(34,197,94,0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(27, 27, W - 54, H - 54);

  ctx.textAlign = 'center';

  // Título
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px Segoe UI, sans-serif';
  ctx.fillText('CONSTANCIA DE EXAMEN', W / 2, 90);

  // Subtítulo (módulo)
  ctx.fillStyle = '#94a3b8';
  ctx.font = '18px Segoe UI, sans-serif';
  ctx.fillText(opts.titulo, W / 2, 128);

  // Icono + estado grande
  ctx.font = '72px Segoe UI, sans-serif';
  ctx.fillText('✓', W / 2, 235);
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 40px Segoe UI, sans-serif';
  ctx.fillText(opts.estado, W / 2, 300);

  // Detalle
  if (opts.detalle) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px Segoe UI, sans-serif';
    ctx.fillText(opts.detalle, W / 2, 345);
  }

  // Línea divisoria
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 380);
  ctx.lineTo(W - 90, 380);
  ctx.stroke();

  // Datos: iniciales · tiempo · fecha
  ctx.textAlign = 'left';
  ctx.font = '20px Segoe UI, sans-serif';
  const x = 120;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Iniciales:', x, 425);
  ctx.fillText('Tiempo:', x, 465);
  ctx.fillText('Fecha:', x, 505);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px Segoe UI, sans-serif';
  ctx.fillText(opts.iniciales, x + 130, 425);
  ctx.fillText(opts.tiempo, x + 130, 465);
  ctx.font = '20px Segoe UI, sans-serif';
  ctx.fillText(opts.fecha, x + 130, 505);

  // Pie
  ctx.textAlign = 'right';
  ctx.fillStyle = '#475569';
  ctx.font = '16px Segoe UI, sans-serif';
  ctx.fillText('Dashboard Domótica · Conectores DCampus', W - 110, 505);

  return canvas;
}

function fechaLegible() {
  return new Date().toLocaleString('es-ES');
}

function fechaArchivo() {
  const f = new Date();
  return f.getFullYear() + '-' +
    String(f.getMonth() + 1).padStart(2, '0') + '-' +
    String(f.getDate()).padStart(2, '0') + '_' +
    String(f.getHours()).padStart(2, '0') + 'h' +
    String(f.getMinutes()).padStart(2, '0');
}

// ------------------------------------------------------------
// CONSTANCIA · Colocar aparatos (victoria)
// ------------------------------------------------------------
function descargarConstanciaColocar() {
  const iniciales = pedirIniciales();
  if (!iniciales) return;

  const canvas = dibujarConstancia({
    titulo: 'Módulo: Colocar aparatos',
    estado: 'TODO CORRECTO',
    detalle: `Has colocado los ${APARATOS.length} aparatos en su zona correcta`,
    tiempo: formatearTiempo(state.cronometro.segundos),
    iniciales: iniciales,
    fecha: fechaLegible()
  });

  descargarCanvasComoPNG(canvas, `constancia_colocar_${iniciales}_${fechaArchivo()}.png`);
}

// ------------------------------------------------------------
// JSON · Colocar aparatos (lo manda el alumno al profesor)
// ------------------------------------------------------------
function descargarJSONColocar() {
  const iniciales = pedirIniciales();
  if (!iniciales) return;

  let aciertos = 0;
  Object.keys(state.zonasVerificadas).forEach(zonaId => {
    if (state.zonasVerificadas[zonaId]) aciertos += aparatosDeZona(zonaId).length;
  });

  const json = {
    tipo: 'colocar',
    version: '1.0',
    fecha: new Date().toISOString(),
    fechaLegible: fechaLegible(),
    iniciales: iniciales,
    tiempoSegundos: state.cronometro.segundos,
    tiempoLegible: formatearTiempo(state.cronometro.segundos),
    aciertos: aciertos,
    total: APARATOS.length,
    todoCorrecto: aciertos === APARATOS.length,
    zonasVerificadas: state.zonasVerificadas,
    examenActivo: state.examen.activo
  };

  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultado_colocar_${iniciales}_${fechaArchivo()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// ------------------------------------------------------------
// CONSTANCIA · Auditoría (todas las fichas validadas)
// ------------------------------------------------------------
function descargarConstanciaAuditoria() {
  const iniciales = pedirIniciales();
  if (!iniciales) return;

  const fichas = state.auditoria.fichas || [];
  const tarjetas = state.auditoria.tarjetas || [];
  const nombres = tarjetas.map(t => t.nombre).join(' · ');

  const canvas = dibujarConstancia({
    titulo: 'Módulo: Auditoría energética',
    estado: 'TODAS LAS FICHAS VALIDADAS',
    detalle: `${fichas.length} fichas completadas — ${nombres}`,
    tiempo: formatearTiempo(state.cronometro.segundos),
    iniciales: iniciales,
    fecha: fechaLegible()
  });

  descargarCanvasComoPNG(canvas, `constancia_auditoria_${iniciales}_${fechaArchivo()}.png`);
}
