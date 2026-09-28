/* ============================================================
   RELACIÓN CASO → NORMATIVA APLICABLE
   Basada en la documentación oficial de CTE, RITE y REBT
   ============================================================ */

const NORMATIVA = {
  iluminacion_fuera_horario: {
    caso: 'Iluminación encendida sin ocupación',
    normas: [
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE3',
        apartado: 'HE3 · Eficiencia energética de las instalaciones de iluminación',
        aplicacion: 'Regula la sectorización, el control y el aprovechamiento de luz natural en iluminación.'
      },
      {
        id: 'rebt',
        nombre: 'REBT · ITC-BT-44',
        apartado: 'ITC-BT-44 · Receptores para alumbrado',
        aplicacion: 'Regula las condiciones de las instalaciones de alumbrado.'
      }
    ]
  },
  climatizacion_zonas_vacias: {
    caso: 'Climatización en zonas sin ocupación',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 1.1',
        apartado: 'IT 1.1 · Exigencia de bienestar e higiene',
        aplicacion: 'Regula las condiciones de diseño y ajuste de la climatización según ocupación.'
      },
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE2',
        apartado: 'HE2 · Rendimiento de las instalaciones térmicas',
        aplicacion: 'Regula la eficiencia de los sistemas de climatización.'
      }
    ]
  },
  consigna_excesiva_verano: {
    caso: 'Consigna de temperatura excesiva en verano',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 1.1.4.1',
        apartado: 'IT 1.1.4.1 · Temperatura del aire',
        aplicacion: 'Establece los rangos de temperatura operativa en verano (23-25 °C).'
      }
    ]
  },
  ventanas_perdidas: {
    caso: 'Ventanas de vidrio simple con pérdidas',
    normas: [
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE1',
        apartado: 'HE1 · Condiciones de la envolvente térmica',
        aplicacion: 'Regula la transmitancia térmica máxima (U-value) de ventanas y cerramientos.'
      },
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE0',
        apartado: 'HE0 · Limitación del consumo energético',
        aplicacion: 'Limita el consumo global del edificio según su envolvente.'
      }
    ]
  },
  puerta_abierta: {
    caso: 'Puerta exterior abierta con climatización funcionando',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 1.1.4.2',
        apartado: 'IT 1.1.4.2 · Velocidad media del aire',
        aplicacion: 'Regula el control de infiltraciones y corrientes de aire.'
      },
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE1',
        apartado: 'HE1 · Envolvente térmica',
        aplicacion: 'Regula la permeabilidad al aire de huecos y cerramientos.'
      }
    ]
  },
  fuga_agua: {
    caso: 'Consumo constante de agua en madrugada',
    normas: [
      {
        id: 'cte_db_hs',
        nombre: 'CTE DB-HS4',
        apartado: 'HS4 · Suministro de agua',
        aplicacion: 'Regula el mantenimiento y la eficiencia de las instalaciones de agua.'
      },
      {
        id: 'rebt',
        nombre: 'REBT · ITC-BT-47',
        apartado: 'ITC-BT-47 · Motores',
        aplicacion: 'Regula las condiciones de las bombas de agua.'
      }
    ]
  },
  equipos_24_7: {
    caso: 'Equipos encendidos 24/7 sin necesidad',
    normas: [
      {
        id: 'rebt',
        nombre: 'REBT · ITC-BT-51',
        apartado: 'ITC-BT-51 · Sistemas de automatización, gestión técnica y seguridad',
        aplicacion: 'Regula los sistemas de apagado automático y gestión de equipos.'
      },
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE2',
        apartado: 'HE2 · Rendimiento de las instalaciones',
        aplicacion: 'Regula el rendimiento y la eficiencia de equipos eléctricos.'
      }
    ]
  },
  ventilacion_constante: {
    caso: 'Ventilación a caudal constante sin ocupación',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 1.1.4.3',
        apartado: 'IT 1.1.4.3 · Calidad del aire interior',
        aplicacion: 'Regula la ventilación según ocupación y actividad.'
      },
      {
        id: 'cte_db_hs',
        nombre: 'CTE DB-HS3',
        apartado: 'HS3 · Calidad del aire interior',
        aplicacion: 'Establece los caudales mínimos de ventilación según uso.'
      }
    ]
  },
  bomba_ciclos: {
    caso: 'Bomba con ciclos frecuentes y lejos del punto óptimo',
    normas: [
      {
        id: 'rebt',
        nombre: 'REBT · ITC-BT-47',
        apartado: 'ITC-BT-47 · Motores',
        aplicacion: 'Regula las condiciones de instalación y protección de motores.'
      },
      {
        id: 'rite',
        nombre: 'RITE · IT 1.2',
        apartado: 'IT 1.2 · Eficiencia energética',
        aplicacion: 'Regula el rendimiento de los sistemas de bombeo.'
      }
    ]
  },
  falta_submedicion: {
    caso: 'Falta de submedición y monitorización',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 3',
        apartado: 'IT 3 · Seguridad · IT 4 · Uso y mantenimiento',
        aplicacion: 'Regula la instalación de sistemas de medición y monitorización.'
      },
      {
        id: 'cte_db_he',
        nombre: 'CTE DB-HE0',
        apartado: 'HE0 · Limitación del consumo energético',
        aplicacion: 'Favorece la instalación de contadores y sistemas de medida.'
      }
    ]
  },
  confort_termico: {
    caso: 'Confort térmico inadecuado',
    normas: [
      {
        id: 'rite',
        nombre: 'RITE · IT 1',
        apartado: 'IT 1 · Exigencias de bienestar e higiene',
        aplicacion: 'Establece los parámetros de confort térmico, humedad y velocidad del aire.'
      },
      {
        id: 'une',
        nombre: 'UNE-EN ISO 7730',
        apartado: 'Ergonomía del ambiente térmico',
        aplicacion: 'Define los índices PMV y PPD para evaluar el confort térmico.'
      }
    ]
  }
};

/* ============================================================
   HELPERS
   ============================================================ */
function obtenerNormasPorCaso(casoId) {
  return NORMATIVA[casoId] || null;
}

function obtenerNormaPorId(normaId) {
  const oficiales = FUENTES_OFICIALES.find(f => f.id === normaId);
  if (oficiales) return oficiales;
  return FUENTES_TECNICAS.find(f => f.id === normaId) || null;
}