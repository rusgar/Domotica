/* ============================================================
   RENDER DE LA FICHA DE ANÁLISIS POR ZONA
   ============================================================ */

// Estructura de respuestas de una ficha (estado en memoria)
function crearFichaVacia() {
  return {
    condicionesInteriores: [],   // array de claves marcadas
    factoresExteriores: [],      // array de claves marcadas
    problemaPrincipal: '',
    evidencia: '',
    causaProbable: '',
    doih: {},                    // { 0: 'D', 1: 'O', ... }
    frasesPropias: '',           // clasificación abierta
    medida1: '',
    medida2: '',
    queMedirias: '',
    conQueInstrumento: '',
    calculo: null,               // número introducido
    ahorroEstimado: '',
    coste: '',
    costeJustificacion: '',
    impacto: '',
    impactoJustificacion: '',
    dificultad: '',
    dificultadJustificacion: '',
    fuenteOficial: {
      id: '',
      apartado: '',
      datoEncontrado: '',
      aplicacion: ''
    },
    fuenteTecnica: {
      id: '',
      informacion: '',
      aplicacion: ''
    },
    validado: false,
    puntuacion: null
  };
}

// Render completo de una tarjeta de auditoría
function renderTarjetaAuditoria(indice, tarjeta, variacion, respuestas, abierta = false) {
  const card = document.createElement('div');
  card.className = 'tarjeta-auditoria' + (abierta ? ' abierta' : '') + (respuestas.validado ? ' completa' : '');
  card.dataset.indice = indice;

  const completa = respuestas.validado;

  card.innerHTML = `
    <div class="tarjeta-cabecera" onclick="toggleTarjeta(${indice})">
      <div class="tarjeta-titulo">
        <div class="tarjeta-icono">${tarjeta.icono}</div>
        <div>
          <div class="tarjeta-nombre">Tarjeta ${indice + 1} · ${tarjeta.nombre}</div>
          <div class="tarjeta-resumen">${tarjeta.descripcion}</div>
        </div>
      </div>
      <div class="tarjeta-estado ${completa ? 'completa' : 'pendiente'}" id="estado-tarjeta-${indice}">
        ${completa ? '✓ Validada' : '⏳ Pendiente'}
      </div>
    </div>
    <div class="tarjeta-cuerpo">
      <!-- Datos didácticos de la tarjeta -->
      <div class="tarjeta-datos">
        <strong>Escenario:</strong> ${tarjeta.escenario(variacion)}
        <div class="tarjeta-foco">
          <strong>Datos para trabajar:</strong> ${tarjeta.datosTrabajo(variacion)}
        </div>
        <div class="tarjeta-foco">
          <strong>Foco de análisis:</strong> ${tarjeta.focoAnalisis}
        </div>
      </div>

      <!-- BLOQUE 1: Condiciones interiores afectadas -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">1</span> Condiciones interiores afectadas</div>
        <div class="ficha-opciones" id="ci-${indice}">
          ${Object.entries(ETIQUETAS_CONDICIONES_INTERIORES).map(([clave, label]) => `
            <label>
              <input type="checkbox" data-clave="${clave}" ${respuestas.condicionesInteriores.includes(clave) ? 'checked' : ''} onchange="toggleCI(${indice}, '${clave}', this.checked)">
              <span>${label}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- BLOQUE 2: Factores exteriores influyentes -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">2</span> Factores exteriores que pueden influir</div>
        <div class="ficha-opciones" id="fe-${indice}">
          ${Object.entries(ETIQUETAS_FACTORES_EXTERIORES).map(([clave, label]) => `
            <label>
              <input type="checkbox" data-clave="${clave}" ${respuestas.factoresExteriores.includes(clave) ? 'checked' : ''} onchange="toggleFE(${indice}, '${clave}', this.checked)">
              <span>${label}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- BLOQUE 3: Problema principal y causa -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">3</span> Diagnóstico</div>
        <div class="ficha-campo">
          <label>Problema principal detectado</label>
          <textarea placeholder="Describe el problema principal con tus palabras..." onchange="actualizarCampo(${indice}, 'problemaPrincipal', this.value)">${respuestas.problemaPrincipal}</textarea>
        </div>
        <div class="ficha-campo">
          <label>Evidencia que aparece en la tarjeta</label>
          <textarea placeholder="¿Qué dato u observación justifica el problema?" onchange="actualizarCampo(${indice}, 'evidencia', this.value)">${respuestas.evidencia}</textarea>
        </div>
        <div class="ficha-campo">
          <label>Causa probable</label>
          <textarea placeholder="¿Qué origina ese problema?" onchange="actualizarCampo(${indice}, 'causaProbable', this.value)">${respuestas.causaProbable}</textarea>
        </div>
      </div>

      <!-- BLOQUE 4: Clasificación D / O / I / H -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">4</span> ¿Dato, Observación, Inferencia o Hipótesis?</div>
        <p style="font-size:0.78rem;color:#94a3b8;margin-bottom:10px;">
          <strong>D</strong> = Dato de la tarjeta · <strong>O</strong> = Observación descrita · <strong>I</strong> = Inferencia razonable · <strong>H</strong> = Hipótesis que debe comprobarse
        </p>
        <div class="doih-filas">
          ${tarjeta.frasesDOIH.map((frase, i) => `
            <div class="doih-fila">
              <div class="doih-frase">${frase.texto}</div>
              <div class="doih-botones" id="doih-${indice}-${i}">
                ${['D','O','I','H'].map(letra => `
                  <button class="doih-btn ${respuestas.doih[i] === letra ? 'selected' : ''}" onclick="marcarDOIH(${indice}, ${i}, '${letra}')">${letra}</button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="ficha-campo" style="margin-top:14px;">
          <label>Escribe tú una frase propia e indícala como D / O / I / H</label>
          <textarea placeholder="Ej: 'El aula se calienta por la tarde' → I (inferencia)" onchange="actualizarCampo(${indice}, 'frasesPropias', this.value)">${respuestas.frasesPropias}</textarea>
        </div>
      </div>

      <!-- BLOQUE 5: Medidas de mejora -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">5</span> Medidas de mejora</div>
        <div class="ficha-campo">
          <label>Medida de mejora 1</label>
          <textarea placeholder="Primera actuación propuesta..." onchange="actualizarCampo(${indice}, 'medida1', this.value)">${respuestas.medida1}</textarea>
        </div>
        <div class="ficha-campo">
          <label>Medida de mejora 2</label>
          <textarea placeholder="Segunda actuación propuesta..." onchange="actualizarCampo(${indice}, 'medida2', this.value)">${respuestas.medida2}</textarea>
        </div>
      </div>

      <!-- BLOQUE 6: Verificación -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">6</span> ¿Qué medirías para verificar el diagnóstico?</div>
        <div class="ficha-campo">
          <label>Variable a medir</label>
          <input type="text" placeholder="Ej: CO₂, temperatura, lux..." onchange="actualizarCampo(${indice}, 'queMedirias', this.value)" value="${respuestas.queMedirias}">
        </div>
        <div class="ficha-campo">
          <label>Con qué instrumento</label>
          <input type="text" placeholder="Ej: sensor de CO₂ NDIR, luxómetro..." onchange="actualizarCampo(${indice}, 'conQueInstrumento', this.value)" value="${respuestas.conQueInstrumento}">
        </div>
      </div>

      <!-- BLOQUE 7: Cálculo -->
      ${tarjeta.calculo && tarjeta.calculo.valor(variacion) !== null ? `
        <div class="ficha-bloque">
          <div class="ficha-titulo"><span class="num">7</span> Cálculo</div>
          <div class="calculo-box">
            <div class="calculo-formula">${tarjeta.calculo.formula}</div>
            <p style="font-size:0.85rem;color:#cbd5e1;margin-bottom:12px;">${tarjeta.calculo.enunciado(variacion)}</p>
            <div class="calculo-input">
              <input type="number" step="0.01" placeholder="Introduce el resultado..." id="calculo-${indice}" value="${respuestas.calculo !== null ? respuestas.calculo : ''}" onchange="actualizarCalculo(${indice}, this.value)">
              <span class="u">${tarjeta.calculo.unidad}</span>
              <button class="btn-validar" style="padding:10px 16px;" onclick="validarCalculoTarjeta(${indice})">Comprobar</button>
            </div>
            <div class="calculo-resultado" id="calculo-resultado-${indice}"></div>
          </div>
        </div>
      ` : `
        <div class="ficha-bloque">
          <div class="ficha-titulo"><span class="num">7</span> Cálculo</div>
          <div class="calculo-box">
            <p style="font-size:0.85rem;color:#94a3b8;">${tarjeta.calculo ? tarjeta.calculo.enunciado(variacion) : 'Esta tarjeta no requiere cálculo automático.'}</p>
            <div class="ficha-campo" style="margin-top:12px;">
              <label>Ahorro estimado, si procede</label>
              <textarea placeholder="Explica cómo lo has estimado..." onchange="actualizarCampo(${indice}, 'ahorroEstimado', this.value)">${respuestas.ahorroEstimado}</textarea>
            </div>
          </div>
        </div>
      `}

      <!-- BLOQUE 8: Coste / Impacto / Dificultad -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">8</span> Valoración de la actuación</div>

        <div class="ficha-campo">
          <label>Coste</label>
          <div class="radio-group">
            ${['Bajo', 'Medio', 'Alto'].map(op => `
              <label>
                <input type="radio" name="coste-${indice}" value="${op}" ${respuestas.coste === op ? 'checked' : ''} onchange="actualizarCampo(${indice}, 'coste', '${op}')">
                ${op}
              </label>
            `).join('')}
          </div>
          <input type="text" placeholder="Justifica el coste (fuente, estimación...)" style="margin-top:8px;" onchange="actualizarCampo(${indice}, 'costeJustificacion', this.value)" value="${respuestas.costeJustificacion}">
        </div>

        <div class="ficha-campo">
          <label>Impacto esperado</label>
          <div class="radio-group">
            ${['Bajo', 'Medio', 'Alto'].map(op => `
              <label>
                <input type="radio" name="impacto-${indice}" value="${op}" ${respuestas.impacto === op ? 'checked' : ''} onchange="actualizarCampo(${indice}, 'impacto', '${op}')">
                ${op}
              </label>
            `).join('')}
          </div>
          <input type="text" placeholder="Justifica el impacto (kWh, €, confort...)" style="margin-top:8px;" onchange="actualizarCampo(${indice}, 'impactoJustificacion', this.value)" value="${respuestas.impactoJustificacion}">
        </div>

        <div class="ficha-campo">
          <label>Dificultad de aplicación</label>
          <div class="radio-group">
            ${['Baja', 'Media', 'Alta'].map(op => `
              <label>
                <input type="radio" name="dificultad-${indice}" value="${op}" ${respuestas.dificultad === op ? 'checked' : ''} onchange="actualizarCampo(${indice}, 'dificultad', '${op}')">
                ${op}
              </label>
            `).join('')}
          </div>
          <input type="text" placeholder="Justifica la dificultad (obra, permisos, inversión...)" style="margin-top:8px;" onchange="actualizarCampo(${indice}, 'dificultadJustificacion', this.value)" value="${respuestas.dificultadJustificacion}">
        </div>
      </div>

      <!-- BLOQUE 9: Mini-investigación -->
      <div class="ficha-bloque">
        <div class="ficha-titulo"><span class="num">9</span> Mini-investigación</div>
        <div class="ficha-campo">
          <label>Fuente oficial o normativa</label>
          <select onchange="actualizarFuente(${indice}, 'oficial', 'id', this.value)">
            <option value="">— Selecciona —</option>
            ${FUENTES_OFICIALES.map(f => `
              <option value="${f.id}" ${respuestas.fuenteOficial.id === f.id ? 'selected' : ''}>${f.nombre}</option>
            `).join('')}
          </select>
        </div>
        <div class="ficha-campo">
          <label>Apartado o página consultada</label>
          <input type="text" placeholder="Ej: HE1, apartado 2.1..." onchange="actualizarFuente(${indice}, 'oficial', 'apartado', this.value)" value="${respuestas.fuenteOficial.apartado}">
        </div>
        <div class="ficha-campo">
          <label>¿Qué dato o criterio has encontrado?</label>
          <textarea placeholder="Cita literal o parafrasea el dato concreto..." onchange="actualizarFuente(${indice}, 'oficial', 'datoEncontrado', this.value)">${respuestas.fuenteOficial.datoEncontrado}</textarea>
        </div>
        <div class="ficha-campo">
          <label>¿Cómo se aplica a esta tarjeta?</label>
          <textarea placeholder="Explica con tus palabras..." onchange="actualizarFuente(${indice}, 'oficial', 'aplicacion', this.value)">${respuestas.fuenteOficial.aplicacion}</textarea>
        </div>

        <div class="ficha-campo">
          <label>Fuente técnica fiable</label>
          <select onchange="actualizarFuente(${indice}, 'tecnica', 'id', this.value)">
            <option value="">— Selecciona —</option>
            ${FUENTES_TECNICAS.map(f => `
              <option value="${f.id}" ${respuestas.fuenteTecnica.id === f.id ? 'selected' : ''}>${f.nombre}</option>
            `).join('')}
          </select>
        </div>
        <div class="ficha-campo">
          <label>Información concreta que aporta</label>
          <textarea placeholder="Dato técnico, guía, recomendación..." onchange="actualizarFuente(${indice}, 'tecnica', 'informacion', this.value)">${respuestas.fuenteTecnica.informacion}</textarea>
        </div>
        <div class="ficha-campo">
          <label>¿Cómo se aplica a esta tarjeta?</label>
          <textarea placeholder="Explica con tus palabras..." onchange="actualizarFuente(${indice}, 'tecnica', 'aplicacion', this.value)">${respuestas.fuenteTecnica.aplicacion}</textarea>
        </div>
      </div>

      <!-- Acciones de la ficha -->
      <div class="ficha-acciones">
        <button class="btn-validar" onclick="validarFicha(${indice})">✓ Validar ficha</button>
      </div>

      <div id="ficha-resultado-${indice}"></div>
    </div>
  `;

  return card;
}

// ============================================================
// HANDLERS
// ============================================================

function toggleTarjeta(indice) {
  const card = document.querySelector(`.tarjeta-auditoria[data-indice="${indice}"]`);
  if (card) card.classList.toggle('abierta');
}

function toggleCI(indice, clave, marcado) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  if (marcado) {
    if (!ficha.condicionesInteriores.includes(clave)) ficha.condicionesInteriores.push(clave);
  } else {
    ficha.condicionesInteriores = ficha.condicionesInteriores.filter(c => c !== clave);
  }
  guardarProgresoAuditoria();
}

function toggleFE(indice, clave, marcado) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  if (marcado) {
    if (!ficha.factoresExteriores.includes(clave)) ficha.factoresExteriores.push(clave);
  } else {
    ficha.factoresExteriores = ficha.factoresExteriores.filter(c => c !== clave);
  }
  guardarProgresoAuditoria();
}

function marcarDOIH(indice, i, letra) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  ficha.doih[i] = letra;

  document.querySelectorAll(`#doih-${indice}-${i} .doih-btn`).forEach(b => {
    b.classList.toggle('selected', b.textContent === letra);
  });

  guardarProgresoAuditoria();
}

function actualizarCampo(indice, campo, valor) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  ficha[campo] = valor;
  guardarProgresoAuditoria();
}

function actualizarCalculo(indice, valor) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  ficha.calculo = valor === '' ? null : parseFloat(valor);
  guardarProgresoAuditoria();
}

function actualizarFuente(indice, tipo, campo, valor) {
  const ficha = state.auditoria.fichas[indice];
  if (!ficha) return;
  const key = tipo === 'oficial' ? 'fuenteOficial' : 'fuenteTecnica';
  ficha[key][campo] = valor;
  guardarProgresoAuditoria();
}

function validarCalculoTarjeta(indice) {
  const { tarjetas, variaciones } = state.auditoria;
  const tarjeta = tarjetas[indice];
  const variacion = variaciones[indice];
  const ficha = state.auditoria.fichas[indice];
  if (!tarjeta || !variacion || !ficha) return;

  const valorCorrecto = tarjeta.calculo.valor(variacion);
  const validacion = validarCalculo(
    ficha.calculo,
    valorCorrecto,
    tarjeta.calculo.tolerancia,
    tarjeta.calculo.decimales,
    tarjeta.calculo.unidad
  );

  const res = document.getElementById(`calculo-resultado-${indice}`);
  if (res) {
    res.className = 'calculo-resultado show ' + (validacion.ok ? 'ok' : 'mal');
    res.textContent = validacion.mensaje;
  }
}

function validarFicha(indice) {
  const { tarjetas, variaciones } = state.auditoria;
  const tarjeta = tarjetas[indice];
  const variacion = variaciones[indice];
  const ficha = state.auditoria.fichas[indice];
  if (!tarjeta || !variacion || !ficha) return;

  const puntuacion = calcularPuntuacionFicha(ficha, tarjeta, variacion);
  ficha.validado = true;
  ficha.puntuacion = puntuacion;

  const esProfe = state.usuario === 'profe';

  // Actualizar estado de la tarjeta
  const estado = document.getElementById(`estado-tarjeta-${indice}`);
  if (estado) {
    estado.className = 'tarjeta-estado completa';
    // La puntuación solo la ve el profesor
    estado.textContent = esProfe ? `✓ ${puntuacion.porcentajeAuto}% auto` : '✓ Validada';
  }
  const card = document.querySelector(`.tarjeta-auditoria[data-indice="${indice}"]`);
  if (card) card.classList.add('completa');

  // Mostrar resultado
  const res = document.getElementById(`ficha-resultado-${indice}`);
  if (res) {
    res.className = 'calculo-resultado show ok';
    if (esProfe) {
      // Redacción clara: la parte auto-calificable y la parte manual se separan.
      // (Antes decía "40 de 80 · 50 %", que confundía: los 40 manuales
      //  nunca se otorgan automáticamente.)
      res.innerHTML = `
        <strong>Ficha ${indice + 1} validada.</strong><br>
        Aciertos automáticos: <strong>${puntuacion.aciertosAuto} / ${puntuacion.autoMax}</strong>
        (${puntuacion.porcentajeAuto} % de la parte auto).<br>
        Corrección manual pendiente: <strong>${puntuacion.pendienteManual}</strong> puntos (campos abiertos).<br>
        Nota final posible: <strong>${puntuacion.aciertosAuto + puntuacion.pendienteManual} / ${puntuacion.total}</strong><br>
        En la nota del examen esta ficha vale <strong>2,5 puntos</strong> (2 tarjetas por ejercicio = 5)
      `;
    } else {
      res.innerHTML = `
        <strong>Ficha ${indice + 1} validada ✓</strong><br>
        Guarda tu constancia cuando completes todas las fichas.
      `;
    }
  }

  guardarProgresoAuditoria();
  actualizarProgresoGlobal();
}