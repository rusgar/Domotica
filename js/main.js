/* ============================================================
   ARRANQUE Y ATAJOS GLOBALES
   ============================================================ */

// Atajo secreto: Ctrl + Shift + A (solo profesor, bloqueado en examen)
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    if (state.usuario === 'profe' && !state.examen.activo) {
      if (state.moduloActivo === 'colocar') {
        colocarTodo();
      } else {
        console.log('🔒 Atajo reservado al módulo de colocar aparatos');
      }
    } else if (state.examen.activo) {
      console.log('🔒 Atajo bloqueado durante el examen');
    }
  }
});

// FUTURO: Generador de ejercicios aleatorios + presupuesto
function generarEjercicioAleatorio(tipo = 'colegio') {
  const config = TIPOS_EDIFICIO[tipo];
  if (!config) return null;
  const seleccionados = [];
  config.zonasObligatorias.forEach(zonaId => {
    const deZona = APARATOS.filter(a => a.zona === zonaId);
    const cuantos = 1 + Math.floor(Math.random() * deZona.length);
    const shuffled = [...deZona].sort(() => Math.random() - 0.5);
    seleccionados.push(...shuffled.slice(0, cuantos));
  });
  const costeTotal = seleccionados.reduce((s, a) => s + a.precio, 0);
  return {
    tipo,
    aparatos: seleccionados,
    costeTotal,
    presupuesto: config.presupuesto,
    dentroDePresupuesto: costeTotal <= config.presupuesto,
  };
}

// Cerrar modales con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const modalPregunta = document.getElementById('modalPregunta');
    const modalInforme = document.getElementById('modalInforme');
    if (modalPregunta?.classList.contains('show')) cerrarPregunta();
    if (modalInforme?.classList.contains('show')) cerrarModalInforme();
  }
});

// Arranque inicial
document.addEventListener('DOMContentLoaded', () => {
  actualizarTimerUI();
});