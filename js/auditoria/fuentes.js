/* ============================================================
   BASE DE FUENTES OFICIALES Y TÉCNICAS
   Para la mini-investigación del módulo de auditoría
   ============================================================ */

const FUENTES_OFICIALES = [
  {
    id: 'cte_db_he',
    nombre: 'CTE DB-HE · Ahorro de Energía',
    tipo: 'Normativa oficial',
    url: 'https://www.codigotecnico.org/DocumentosCTE/AhorroEnergia.html',
    descripcion: 'Documento Básico HE del Código Técnico de la Edificación. Regula la eficiencia energética de los edificios.',
    apartados: ['HE0 · Limitación del consumo', 'HE1 · Condiciones de la envolvente', 'HE2 · Rendimiento de instalaciones', 'HE3 · Eficiencia de iluminación', 'HE4 · Contribución solar', 'HE5 · Generación renovable'],
    aplica: ['envolvente', 'aislamiento', 'iluminacion', 'energia', 'consumo', 'instalaciones']
  },
  {
    id: 'rite',
    nombre: 'RITE · Reglamento de Instalaciones Térmicas',
    tipo: 'Normativa oficial',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-15820',
    descripcion: 'Reglamento de instalaciones térmicas en los edificios. Regula climatización, ventilación y ACS.',
    apartados: ['IT 1 · Exigencias de bienestar e higiene', 'IT 2 · Eficiencia energética', 'IT 3 · Seguridad', 'IT 4 · Uso y mantenimiento'],
    aplica: ['climatizacion', 'ventilacion', 'calidad_aire', 'confort', 'temperatura', 'humedad']
  },
  {
    id: 'rebt',
    nombre: 'REBT · Reglamento Electrotécnico Baja Tensión',
    tipo: 'Normativa oficial',
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099',
    descripcion: 'Reglamento electrotécnico para baja tensión. Regula instalaciones eléctricas.',
    apartados: ['ITC-BT-44 · Receptores para alumbrado', 'ITC-BT-47 · Motores', 'ITC-BT-51 · Sistemas de automatización'],
    aplica: ['iluminacion', 'equipos', 'electricidad', 'automatizacion', 'consumo_electrico']
  },
  {
    id: 'cte_db_hs',
    nombre: 'CTE DB-HS · Salubridad',
    tipo: 'Normativa oficial',
    url: 'https://www.codigotecnico.org/DocumentosCTE/Salubridad.html',
    descripcion: 'Documento Básico HS. Regula la calidad del aire interior, suministro de agua y evacuación.',
    apartados: ['HS3 · Calidad del aire interior', 'HS4 · Suministro de agua', 'HS5 · Evacuación de aguas'],
    aplica: ['calidad_aire', 'ventilacion', 'agua', 'humedad']
  }
];

const FUENTES_TECNICAS = [
  {
    id: 'idiae',
    nombre: 'IDAE · Instituto para la Diversificación y Ahorro de la Energía',
    tipo: 'Organismo público',
    url: 'https://www.idae.es/',
    descripcion: 'Guías técnicas y publicaciones sobre eficiencia energética en edificios.',
    aplica: ['consumo', 'ahorro', 'eficiencia', 'edificios']
  },
  {
    id: 'une',
    nombre: 'UNE · Asociación Española de Normalización',
    tipo: 'Organismo técnico',
    url: 'https://www.une.org/',
    descripcion: 'Normas UNE sobre confort térmico, iluminación y calidad del aire.',
    aplica: ['confort', 'iluminacion', 'calidad_aire', 'ventilacion']
  },
  {
    id: 'aff',
    nombre: 'AFME · Asociación de Fabricantes de Material Eléctrico',
    tipo: 'Asociación profesional',
    url: 'https://www.afme.es/',
    descripcion: 'Guías técnicas sobre instalaciones eléctricas y domótica.',
    aplica: ['electricidad', 'domotica', 'iluminacion', 'automatizacion']
  },
  {
    id: 'knx',
    nombre: 'KNX Association',
    tipo: 'Organismo internacional',
    url: 'https://www.knx.org/',
    descripcion: 'Estándar europeo de domótica y automatización de edificios.',
    aplica: ['domotica', 'automatizacion', 'protocolos', 'control']
  },
  {
    id: 'bacnet',
    nombre: 'BACnet International',
    tipo: 'Organismo internacional',
    url: 'https://www.bacnetinternational.org/',
    descripcion: 'Estándar de comunicación para automatización de edificios (ASHRAE 135).',
    aplica: ['protocolos', 'bms', 'climatizacion', 'control']
  },
  {
    id: 'aenor',
    nombre: 'AENOR · Certificación',
    tipo: 'Entidad certificadora',
    url: 'https://www.aenor.com/',
    descripcion: 'Certificación de eficiencia energética y sistemas de gestión.',
    aplica: ['eficiencia', 'certificacion', 'gestion']
  },
  {
    id: 'fenercom',
    nombre: 'Fundación de la Energía de la Comunidad de Madrid',
    tipo: 'Fundación pública',
    url: 'https://www.fenercom.com/',
    descripcion: 'Guías técnicas y casos prácticos de eficiencia energética.',
    aplica: ['ahorro', 'casos_practicos', 'edificios']
  }
];

/* ============================================================
   SUGERENCIA DE FUENTES SEGÚN TIPO DE PROBLEMA
   ============================================================ */
const SUGERENCIAS_FUENTES = {
  iluminacion: {
    oficial: 'cte_db_he',
    tecnica: 'idiae',
    pista: 'CTE DB-HE sección HE3 regula la eficiencia de las instalaciones de iluminación.'
  },
  climatizacion: {
    oficial: 'rite',
    tecnica: 'bacnet',
    pista: 'RITE IT 1.1 regula las exigencias de bienestar e higiene en climatización.'
  },
  ventilacion: {
    oficial: 'cte_db_hs',
    tecnica: 'idiae',
    pista: 'CTE DB-HS3 regula la calidad del aire interior y los caudales de ventilación.'
  },
  calidad_aire: {
    oficial: 'cte_db_hs',
    tecnica: 'une',
    pista: 'CTE DB-HS3 establece los criterios de calidad del aire interior.'
  },
  envolvente: {
    oficial: 'cte_db_he',
    tecnica: 'idiae',
    pista: 'CTE DB-HE1 regula las condiciones de la envolvente térmica.'
  },
  electricidad: {
    oficial: 'rebt',
    tecnica: 'aff',
    pista: 'REBT ITC-BT-44 regula los receptores para alumbrado.'
  },
  equipos: {
    oficial: 'rebt',
    tecnica: 'aff',
    pista: 'REBT ITC-BT-51 regula los sistemas de automatización y gestión técnica.'
  },
  agua: {
    oficial: 'cte_db_hs',
    tecnica: 'idiae',
    pista: 'CTE DB-HS4 regula el suministro de agua y su eficiencia.'
  },
  confort: {
    oficial: 'rite',
    tecnica: 'une',
    pista: 'RITE IT 1 regula las exigencias de bienestar e higiene en los edificios.'
  }
};