/* ============================================================
   REPARTO ALEATORIO DE TARJETAS CON VARIACIONES
   ============================================================ */

// Barajar array (Fisher-Yates)
function barajar(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Repartir N tarjetas aleatorias con variaciones aleatorias
// Devuelve: [ { tarjeta, variacion, indice } , ... ]
function repartirTarjetas(numTarjetas) {
  const tarjetasBarajadas = barajar(TARJETAS);
  const seleccionadas = tarjetasBarajadas.slice(0, numTarjetas);

  return seleccionadas.map((tarjeta, i) => {
    const variaciones = tarjeta.variaciones || [{}];
    const variacionElegida = variaciones[Math.floor(Math.random() * variaciones.length)];
    return {
      indice: i,
      tarjeta,
      variacion: variacionElegida
    };
  });
}

// Generar un ID único para una tarjeta repartida
function generarIdTarjetaRepartida(tarjetaId, variacion) {
  const partes = [tarjetaId];
  Object.values(variacion).forEach(v => {
    if (typeof v === 'number') partes.push(v);
    else if (typeof v === 'string' && v.length < 20) partes.push(v.replace(/\s/g, ''));
  });
  return partes.join('_').slice(0, 80);
}

// Repartir sin repetir la misma tarjeta entre dos alumnos de la misma sesión
// (si se llama varias veces seguidas se pueden repetir, pero no en la misma llamada)
function repartirTarjetasUnicas(numTarjetas, excluir = []) {
  const disponibles = TARJETAS.filter(t => !excluir.includes(t.id));
  if (disponibles.length < numTarjetas) {
    return repartirTarjetas(numTarjetas);
  }
  const barajadas = barajar(disponibles);
  const seleccionadas = barajadas.slice(0, numTarjetas);

  return seleccionadas.map((tarjeta, i) => {
    const variaciones = tarjeta.variaciones || [{}];
    const variacionElegida = variaciones[Math.floor(Math.random() * variaciones.length)];
    return {
      indice: i,
      tarjeta,
      variacion: variacionElegida
    };
  });
}

// Selección aleatoria de frases DOIH (mezclar el orden)
function mezclarFrasesDOIH(frases) {
  return barajar(frases);
}

// Semilla pseudoaleatoria determinista (para reproducir el reparto si hace falta)
// Útil si el profesor quiere que todos los alumnos tengan el mismo reparto en una sesión
function repartirConSemilla(numTarjetas, semilla) {
  let seed = 0;
  for (let i = 0; i < semilla.length; i++) {
    seed += semilla.charCodeAt(i) * (i + 1);
  }

  // PRNG simple
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const orden = [...TARJETAS].sort(() => rng() - 0.5);
  const seleccionadas = orden.slice(0, numTarjetas);

  return seleccionadas.map((tarjeta, i) => {
    const variaciones = tarjeta.variaciones || [{}];
    const idx = Math.floor(rng() * variaciones.length);
    return {
      indice: i,
      tarjeta,
      variacion: variaciones[idx]
    };
  });
}