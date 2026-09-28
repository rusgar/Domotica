/* ============================================================
   ARRANQUE Y ATALLOS GLOBALES
   ============================================================ */

// Atajo secreto: Ctrl + Shift + A (solo profesor, bloqueado en examen)
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    if (state.usuario === 'profe' && !state.examen.activo) {
      colocarTodo();
    } else if (state.examen.activo) {
      console.log('🔒 Atajo bloqueado durante el examen');
    }
  }
});

// ================================================================
// FUTURO: Generador de ejercicios aleatorios + presupuesto
// ================================================================
// Preparado pero NO en uso todavía. Se activará en una próxima iteración.
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

// Arranque inicial
actualizarTimerUI();