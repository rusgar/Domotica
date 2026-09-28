/* ============================================================
   VALIDACIÓN Y PISTAS
   ============================================================ */

function actualizarScore() {
  let aciertos = 0;
  Object.entries(state.colocados).forEach(([id, zona]) => {
    const ap = APARATOS.find(a => a.id === id);
    if (ap && ap.zona === zona) aciertos++;
  });
  document.getElementById('score').textContent = aciertos;
  document.getElementById('total').textContent = APARATOS.length;
}

function zonasCompletas() {
  const completas = [];
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => {
    const aparatosZona = APARATOS.filter(a => a.zona === zonaId);
    if (aparatosZona.length === 0) return;
    const todosBien = aparatosZona.every(a => state.colocados[a.id] === zonaId);
    if (todosBien) completas.push(zonaId);
  });
  return completas;
}

function actualizarBotonPista() {
  const btn = document.getElementById('btnPista');

  if (state.examen.activo) {
    btn.disabled = true;
    btn.title = 'Pista bloqueada durante el examen';
    btn.textContent = '💡 Pista (examen)';
    return;
  }

  const completas = zonasCompletas();
  if (completas.length > 0) {
    btn.disabled = false;
    btn.title = 'Pista desbloqueada';
    const n = completas.length;
    btn.textContent = `💡 Pista (${n} zona${n > 1 ? 's' : ''} completa${n > 1 ? 's' : ''})`;
  } else {
    btn.disabled = true;
    btn.title = 'Completa al menos una zona entera para desbloquear la pista';
    btn.textContent = '💡 Pista (bloqueada)';
  }
}

function mostrarPista() {
  if (state.examen.activo) {
    alert('🔒 Las pistas están bloqueadas durante el examen.');
    return;
  }

  const completas = zonasCompletas();
  if (completas.length === 0) {
    alert('🔒 La pista se desbloquea cuando completes TODA una zona.');
    return;
  }

  const noColocados = APARATOS.filter(a => !state.colocados[a.id]);
  if (noColocados.length === 0) {
    alert('¡Ya has colocado todos los aparatos! Pulsa "Verificar colocación".');
    return;
  }

  const candidatos = noColocados.filter(a => !completas.includes(a.zona));
  const lista = candidatos.length > 0 ? candidatos : noColocados;
  const ap = lista[Math.floor(Math.random() * lista.length)];

  alert(
    `💡 Pista desbloqueada\n\n` +
    `Aparato: ${ap.emoji} ${ap.nombre}\n\n` +
    `${PISTAS_ZONAS[ap.zona]}\n\n` +
    `(Zonas completas: ${completas.join(', ')})`
  );
}

function verificarTodo() {
  const total = APARATOS.length;
  let aciertos = 0;
  let faltan = 0;

  document.querySelectorAll('.colocado').forEach(c => c.classList.remove('bien', 'mal'));
  document.querySelectorAll('.zona').forEach(z => z.classList.remove('correcta'));

  Object.entries(state.colocados).forEach(([id, zona]) => {
    const ap = APARATOS.find(a => a.id === id);
    const chip = document.querySelector(`.drop-zone[data-zona="${zona}"] .colocado[data-id="${id}"]`);
    if (!chip) return;
    if (ap.zona === zona) {
      chip.classList.add('bien');
      aciertos++;
    } else {
      chip.classList.add('mal');
    }
  });

  APARATOS.forEach(ap => { if (!state.colocados[ap.id]) faltan++; });

  document.querySelectorAll('.zona').forEach(zona => {
    const zonaId = zona.dataset.zona;
    const aparatosZona = APARATOS.filter(a => a.zona === zonaId);
    if (aparatosZona.length === 0) return;
    const todosBien = aparatosZona.every(a => state.colocados[a.id] === zonaId);
    if (todosBien) zona.classList.add('correcta');
  });

  const res = document.getElementById('resultadoFinal');
  res.classList.add('show');

  if (aciertos === total && faltan === 0) {
    res.className = 'resultado-final show ok';
    res.innerHTML = `
      <span class="icono-grande">💡</span>
      ¡TODO CORRECTO!
      <div class="detalle">Has colocado los ${total} aparatos en su zona correcta.<br>
      Tiempo: <strong>${formatearTiempo(state.cronometro.segundos)}</strong></div>
    `;
    detenerCronometro();
    document.body.style.background = 'linear-gradient(135deg, #052e16 0%, #14532d 100%)';
    setTimeout(() => {
      document.body.style.background = state.examen.activo
        ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
    }, 2500);
  } else {
    res.className = 'resultado-final show mal';
    res.innerHTML = `
      <span class="icono-grande">⚠️</span>
      Aún hay errores
      <div class="detalle">
        Aciertos: <strong>${aciertos}</strong> / ${total} ·
        Sin colocar: <strong>${faltan}</strong><br>
        Los aparatos en <span style="color:#f87171">rojo</span> están mal colocados.
      </div>
    `;
  }
  actualizarBotonPista();
}

function resetear() {
  if (state.examen.activo) {
    alert('🔒 No se puede reiniciar durante un examen.');
    return;
  }
  state.colocados = {};
  state.zonasDesbloqueadas = {};

  document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
  document.querySelectorAll('.zona').forEach(z => {
    z.classList.add('bloqueada');
    z.classList.remove('correcta', 'over');
  });
  document.querySelectorAll('.zona-estado').forEach(e => {
    e.className = 'zona-estado bloqueada';
    e.textContent = '🔒';
  });
  document.querySelectorAll('.btn-pregunta').forEach(b => {
    b.textContent = '❓ Responder';
    b.disabled = false;
    b.style.opacity = '1';
    b.style.cursor = 'pointer';
  });
  document.querySelectorAll('.colocado').forEach(c => c.classList.remove('bien', 'mal'));
  document.getElementById('resultadoFinal').classList.remove('show');

  actualizarUsados();
  actualizarScore();
  actualizarBotonPista();
  guardarProgreso();
}

// AUTO-COLOCAR (solo profesor, bloqueado en examen)
function colocarTodo() {
  if (state.usuario !== 'profe') {
    alert('🔒 Esta función solo está disponible para el profesor.');
    return;
  }
  if (state.examen.activo) {
    alert('🔒 No puedes usar auto-colocar durante un examen.');
    return;
  }

  resetear();

  // Desbloquear todas las zonas sin preguntar
  Object.keys(NOMBRES_ZONAS).forEach(zonaId => desbloquearZona(zonaId, true));

  // Colocar todos los aparatos
  APARATOS.forEach(ap => colocarAparato(ap.id, ap.zona));
  setTimeout(() => verificarTodo(), 300);
}