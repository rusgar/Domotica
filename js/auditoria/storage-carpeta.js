/* ============================================================
   GUARDADO EN CARPETA "resultados" CON FILE SYSTEM ACCESS API
   Solo funciona en Chrome/Edge (no Firefox/Safari)
   ============================================================ */

// Handle persistente de la carpeta elegida
let handleCarpetaResultados = null;

// Detectar si el navegador soporta la API
function soportaFileSystemAccess() {
  return typeof window.showDirectoryPicker === 'function';
}

// Comprobar si ya hay una carpeta elegida
function carpetaResultadosElegida() {
  return handleCarpetaResultados !== null;
}

// Mostrar el bloque de "elegir carpeta" si el navegador lo soporta
function inicializarBotonCarpeta() {
  const bloque = document.getElementById('informeFS');
  if (!bloque) return;

  if (!soportaFileSystemAccess()) {
    bloque.style.display = 'none';
    return;
  }

  bloque.style.display = 'block';

  // Intentar recuperar el handle guardado en IndexedDB
  recuperarHandleCarpeta().then(handle => {
    if (handle) {
      handleCarpetaResultados = handle;
      actualizarEstadoCarpeta('✅ Carpeta "resultados" ya elegida · Los informes se guardarán automáticamente');
    }
  });
}

// Pedir al usuario que elija la carpeta "resultados"
async function elegirCarpetaResultados() {
  if (!soportaFileSystemAccess()) {
    alert('Tu navegador no soporta el guardado directo en carpeta.\n\nUsa Chrome o Edge, o mueve manualmente los archivos de Descargas a la carpeta resultados.');
    return;
  }

  try {
    const handle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'documents',
      id: 'carpetaResultados'
    });

    // Verificar permisos de escritura
    const permiso = await handle.requestPermission({ mode: 'readwrite' });
    if (permiso !== 'granted') {
      actualizarEstadoCarpeta('❌ Permiso denegado', false);
      return;
    }

    handleCarpetaResultados = handle;
    await guardarHandleCarpeta(handle);
    actualizarEstadoCarpeta(`✅ Carpeta "${handle.name}" elegida · Los informes se guardarán ahí`);
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error('Error eligiendo carpeta:', e);
      actualizarEstadoCarpeta('❌ No se pudo elegir la carpeta', false);
    }
  }
}

// Actualizar el texto de estado
function actualizarEstadoCarpeta(texto, ok = true) {
  const el = document.getElementById('informeFSEstado');
  if (!el) return;
  el.textContent = texto;
  el.className = 'informe-fs-estado' + (ok ? ' ok' : '');
}

// Guardar el JSON + XLSX en la carpeta elegida
async function guardarEnCarpetaResultados(informe, nombre) {
  if (!handleCarpetaResultados) {
    throw new Error('No hay carpeta elegida');
  }

  // Verificar permisos antes de escribir
  const permiso = await handleCarpetaResultados.queryPermission({ mode: 'readwrite' });
  if (permiso !== 'granted') {
    const pedir = await handleCarpetaResultados.requestPermission({ mode: 'readwrite' });
    if (pedir !== 'granted') {
      throw new Error('Permiso denegado');
    }
  }

  // 1. Guardar JSON
  const nombreJSON = generarNombreBase(nombre, 'json');
  const archivoJSON = await handleCarpetaResultados.getFileHandle(nombreJSON, { create: true });
  const streamJSON = await archivoJSON.createWritable();
  await streamJSON.write(JSON.stringify(informe, null, 2));
  await streamJSON.close();

  // 2. Guardar XLSX
  if (typeof ExcelJS !== 'undefined') {
    try {
      const buffer = await generarXLSXBuffer(informe, nombre);
      const nombreXLSX = generarNombreBase(nombre, 'xlsx');
      const archivoXLSX = await handleCarpetaResultados.getFileHandle(nombreXLSX, { create: true });
      const streamXLSX = await archivoXLSX.createWritable();
      await streamXLSX.write(buffer);
      await streamXLSX.close();
    } catch (e) {
      console.warn('No se pudo guardar XLSX en carpeta:', e);
    }
  }

  console.log(`✅ Informe guardado en carpeta "${handleCarpetaResultados.name}"`);
}

// Generar el buffer del XLSX (reutilizable desde informe.js)
// Esta función la llama storage-carpeta.js cuando quiere guardar en carpeta sin descargar
async function generarXLSXBuffer(informe, nombre) {
  // Reutiliza la lógica del workbook creando un blob temporal
  // (en una versión futura se puede refactorizar para separar)
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Dashboard Domótica';
  wb.created = new Date();

  const wsPortada = wb.addWorksheet('Portada');
  wsPortada.addRow(['INFORME DE AUDITORÍA ENERGÉTICA']).font = { bold: true, size: 16 };
  wsPortada.addRow([]);
  wsPortada.addRow(['Alumno', informe.alumno.nombre]);
  wsPortada.addRow(['Grupo', informe.alumno.grupo || '—']);
  wsPortada.addRow(['Email', informe.alumno.email || '—']);
  wsPortada.addRow(['Fecha', informe.meta.fechaLegible]);
  wsPortada.addRow(['Ejercicio', informe.meta.ejercicioNombre]);
  wsPortada.addRow(['Duración', informe.meta.duracionLegible]);
  wsPortada.addRow([]);
  wsPortada.addRow(['PUNTUACIÓN']);
  wsPortada.addRow(['Aciertos automáticos', informe.puntuacion.aciertosAuto]);
  wsPortada.addRow(['Pendiente manual', informe.puntuacion.pendienteManual]);
  wsPortada.addRow(['Total', informe.puntuacion.totalMaximo]);
  wsPortada.addRow([]);
  wsPortada.addRow(['PRESUPUESTO']);
  wsPortada.addRow(['Máximo', informe.presupuesto.maximo + ' €']);
  wsPortada.addRow(['Total propuesto', informe.presupuesto.total + ' €']);
  wsPortada.addRow(['Dentro', informe.presupuesto.dentro ? 'SÍ' : 'NO']);

  const wsTarjetas = wb.addWorksheet('Respuestas');
  wsTarjetas.columns = [
    { header: 'Tarjeta', key: 't', width: 20 },
    { header: 'Apartado', key: 'a', width: 35 },
    { header: 'Respuesta', key: 'r', width: 70 }
  ];
  wsTarjetas.getRow(1).font = { bold: true };

  informe.tarjetas.forEach(t => {
    const f = t.ficha;
    wsTarjetas.addRow([t.tarjetaNombre, 'Problema principal', f.problemaPrincipal || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Causa probable', f.causaProbable || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Medida 1', f.medida1 || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Medida 2', f.medida2 || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Coste', f.coste || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Impacto', f.impacto || '—']);
    wsTarjetas.addRow([t.tarjetaNombre, 'Dificultad', f.dificultad || '—']);
    wsTarjetas.addRow([]);
  });

  return await wb.xlsx.writeBuffer();
}

// ============================================================
// PERSISTENCIA DEL HANDLE EN INDEXEDDB
// ============================================================
// El navegador no deja guardar el FileSystemDirectoryHandle en localStorage
// porque no es serializable. Usamos IndexedDB.

const DB_NAME = 'dashboard-domotica';
const DB_VERSION = 1;
const STORE_NAME = 'handles';

function abrirDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function guardarHandleCarpeta(handle) {
  try {
    const db = await abrirDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(handle, 'carpetaResultados');
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('No se pudo guardar el handle:', e);
  }
}

async function recuperarHandleCarpeta() {
  try {
    const db = await abrirDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get('carpetaResultados');
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    return null;
  }
}

async function borrarHandleCarpeta() {
  try {
    const db = await abrirDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('carpetaResultados');
    handleCarpetaResultados = null;
  } catch (e) {}
}

// Inicializar el bloque cuando se abra el modal de informe
document.addEventListener('DOMContentLoaded', () => {
  inicializarBotonCarpeta();
});