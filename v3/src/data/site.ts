// All page copy lives here so the client's text can change without touching layout.
//
// Dates are never typed by hand: everything derives from FOUNDED and the current year.
// They're computed at build time and refreshed in the browser on load (see Base.astro),
// so the page stays correct even if the site isn't rebuilt for a while.
// In copy, write {years} for the years in business; <Copy> swaps in a live value.

const FOUNDED = 1976;
const YEAR = new Date().getFullYear();

export const site = {
  name: 'Agencia Bautista',
  legal: 'Agencia Bautista E.A.S.',
  tagline: `Confianza que cruza fronteras desde ${FOUNDED}.`,
  founded: FOUNDED,
  year: YEAR,
  years: YEAR - FOUNDED,
  phones: [
    { label: '(0981) 402-038', tel: '+595981402038' },
    { label: '(0981) 407-826', tel: '+595981407826' },
  ],
  whatsapp: 'https://wa.me/595981402038',
  email: 'operaciones@agenciabautista.com.py',
  address: ['Mayor Bullo 540 entre Azara y Cerro Corá', 'Ofic. 4 (Planta Alta), Asunción'],
  mapsEmbed: 'https://www.google.com/maps?q=Mayor+Bullo+540,+Asunci%C3%B3n,+Paraguay&z=17&output=embed',
};

export const about = {
  lead: `${site.legal} es una empresa especializada en despachos aduaneros y logística, con {years} años de trayectoria en el comercio exterior paraguayo.`,
  body: 'Nuestro enfoque es claro: agilidad, transparencia y soluciones reales para importadores y exportadores.',
};

export type Tone = 'sky' | 'card' | 'white' | 'deep';

export const services: { title: string; detail: string; tone: Tone }[] = [
  { title: 'Despachos aduaneros', detail: 'De importación y exportación.', tone: 'card' },
  { title: 'Clasificación arancelaria', detail: 'De mercancías, con la posición NCM que corresponde.', tone: 'sky' },
  { title: 'Licencias y permisos', detail: 'Tramitación de licencias, permisos y certificaciones.', tone: 'white' },
  { title: 'Asesoría técnica', detail: 'En normativas aduaneras.', tone: 'deep' },
  { title: 'Representación', detail: 'Ante las autoridades aduaneras.', tone: 'white' },
  { title: 'Gestión documental', detail: 'Y la logística asociada a cada operación.', tone: 'card' },
];

export const reasons = [
  '{years} años de experiencia comprobada',
  'Asesoría personalizada y profesional',
  'Procesos rápidos y cumplimiento legal garantizado',
  'Relación directa con las autoridades aduaneras',
  'Cercanía, compromiso y respaldo total',
];

export const steps = [
  { title: 'Relevamiento inicial', detail: 'Escuchamos tu necesidad y analizamos la operación.' },
  { title: 'Asesoría técnica', detail: 'Documentación, permisos y requisitos.' },
  { title: 'Gestión de trámites', detail: 'Ante Aduanas y demás organismos.' },
  { title: 'Seguimiento personalizado', detail: 'En cada etapa sabés dónde está tu operación.' },
  { title: 'Post-servicio', detail: 'Apoyo continuo después del despacho.' },
];

// ncm = HS/NCM tariff chapters typical of the sector (to confirm with the client).
export const sectors = [
  { name: 'Manufactura', img: '/img/sectores/manufactura.png', goods: 'Maquinaria, insumos industriales y plásticos', ncm: ['39', '84'] },
  { name: 'Tecnología', img: '/img/sectores/tecnologia.png', goods: 'Equipos informáticos y electrónica', ncm: ['84', '85'] },
  { name: 'Salud', img: '/img/sectores/salud.png', goods: 'Medicamentos e insumos médicos', ncm: ['30', '90'] },
  { name: 'Agro', img: '/img/sectores/agro.png', goods: 'Granos, semillas y fertilizantes', ncm: ['10', '12', '31'] },
  { name: 'Repuestos', img: '/img/sectores/repuestos.png', goods: 'Autopartes y repuestos', ncm: ['87'] },
  { name: 'Consumo masivo', img: '/img/sectores/consumo.png', goods: 'Alimentos, bebidas y cosmética', ncm: ['21', '22', '33'] },
];

/**
 * Images for the animated scenes. Drop the file in public/img/ and set its path here;
 * while a value is empty the page shows a placeholder (or the drawn fallback).
 */
export const media = {
  spreader: '/img/spreader.webp', // container spreader (gripper), front elevation (original in v3/src-images/)
  truck: '/img/camion.webp',  // top-down truck with container, cab to the right (original in v3/src-images/)
};

/**
 * Hero ship video as frames (from src-images/hero-original.mp4, every 2nd frame → 96 WebP).
 * lg = 1280px wide for desktop, sm = 720px for phones. Regenerate both if the video changes.
 */
export const heroFrames = { count: 96, lg: '/hero/lg', sm: '/hero/sm' };

/** ISO 6346-style container code; the brand's founding year doubles as the serial. */
export const containerCode = (i: number) => `ABTU ${site.founded}${String(i + 1).padStart(2, '0')}`;
