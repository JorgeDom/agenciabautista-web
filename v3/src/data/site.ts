// All page copy lives here so the client's text can change without touching layout.
//
// Dates derive from FOUNDED and the current year, computed at build time and refreshed in the
// browser on load (see Base.astro), so they stay correct even if the site isn't rebuilt.
// The exception is the years in business: see YEARS_IN_BUSINESS.

const FOUNDED = 1977;
const YEAR = new Date().getFullYear();

// Fixed at the client's request (2026-10-07) until he confirms the figure. Note that
// YEAR - FOUNDED gives 49 in 2026, so check this whenever FOUNDED or the figure changes.
const YEARS_IN_BUSINESS = 50;

// WhatsApp goes to Mateo's personal line until the agency has a corporate number.
// Change it here only: country code + number, digits only.
const WHATSAPP = '595981407826';
const WHATSAPP_TEXT = 'Hola, ¿cómo están? Me gustaría conocer un poco más sobre sus servicios.';
const whatsappWith = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const site = {
  name: 'Agencia Bautista',
  legal: 'Agencia Bautista E.A.S.', // footer only: everywhere else the page says "Agencia Bautista"
  // The tagline and the founding year appear once on the page, in the hero (and in og-image.jpg).
  tagline: `Confianza que cruza fronteras desde ${FOUNDED}.`,
  founded: FOUNDED,
  year: YEAR,
  years: YEAR - FOUNDED,
  phones: [
    { label: '(0981) 407-826', tel: '+595981407826' },
    { label: '(0995) 683-696', tel: '+595995683696' },
  ],
  whatsapp: whatsappWith(WHATSAPP_TEXT),
  emails: ['operaciones@agenciabautista.com.py', 'mateo.bautista@agenciabautista.com.py'], // the first one gets the "Enviar un email" button
  instagram: 'https://www.instagram.com/agenciabautistapy/',
  address: ['Mayor Bullo 540 entre Azara y Cerro Corá', 'Ofic. 4 (Planta Alta), Asunción'],
  mapsEmbed: 'https://www.google.com/maps?q=Mayor+Bullo+540,+Asunci%C3%B3n,+Paraguay&z=17&output=embed',
};

export const about = {
  // The only place the years in business are stated; keep it that way.
  lead: `${site.name} es una empresa especializada en despachos aduaneros y soluciones logísticas, con ${YEARS_IN_BUSINESS} años de trayectoria en el comercio exterior paraguayo.`,
  body: 'Nuestro enfoque es claro: agilidad, transparencia y soluciones reales para importadores y exportadores.',
  caption: 'Con sede en Asunción, cubrimos todos los puertos del país.',
  // Below the copy: a few of the main ports by name, then the rest in one line (client, 2026-10-07).
  ports: {
    label: 'Puertos principales',
    names: ['Terport', 'Puerto Fénix', 'Caacupemí', 'Itá Enramada', 'Puerto Seguro', 'Aeropuerto Silvio Pettirossi'],
    more: 'Y muchos más en Alto Paraná, Itapúa y el Chaco.',
  },
};

/**
 * Ports and customs points drawn as dots on the map in "¿Quiénes somos?" (client's list, 2026-10-07).
 * The map opens close on Gran Asunción and zooms out to the whole country:
 * - `near: true` ports (around Asunción) are on screen from the start; their names show only
 *   while the map is zoomed in, then fade, leaving the dots as a cluster around the office.
 * - the others (regional) appear, with their names, as the map zooms out.
 * The biggest ones are also named in `about.ports`.
 * Not drawn yet because their location isn't confirmed: PAKSA (Kanonnikoff), Puerto San José
 * (Empedril) and Puerto Seguro Terrestre. Ask the client for the address, then add them here.
 *
 * at    = [longitude, latitude] in decimal degrees. Google Maps copies them as "latitude, longitude": swap them.
 * label = side of the dot the name sits on ('right' if omitted). Use it to separate names that
 *         overlap, or 'none' to show only the dot.
 */
// inland: not on the river (riverside ports near Asunción are snapped onto the drawn river, see paraguaymap.ts)
export type Port = { name: string; at: [number, number]; label?: 'right' | 'left' | 'above' | 'below' | 'none'; near?: boolean; inland?: boolean };
export const ports: Port[] = [
  { name: 'Encarnación', at: [-55.87, -27.33], label: 'left' },
  { name: 'Ciudad del Este', at: [-54.61, -25.51], label: 'left' },
  { name: 'Puerto Falcón', at: [-57.68, -25.24], label: 'above' }, // across the river from Asunción, next to Clorinda
  // Asunción and around (positions approximate, to the nearest couple of km)
  { name: 'Itá Enramada', at: [-57.675, -25.335], label: 'left', near: true },
  { name: 'Caacupemí', at: [-57.645, -25.255], label: 'above', near: true },
  { name: 'Puerto Fénix', at: [-57.565, -25.185], label: 'right', near: true }, // Mariano Roque Alonso
  { name: 'Terport San Antonio', at: [-57.555, -25.405], label: 'right', near: true },
  { name: 'Puerto Seguro Fluvial', at: [-57.575, -25.495], label: 'right', near: true }, // Villeta
  { name: 'Aeropuerto Silvio Pettirossi', at: [-57.519, -25.240], label: 'right', near: true, inland: true }, // Luque
];

/**
 * "Nuestro equipo": design approved, section hidden for now. Set `published` to true to show it
 * (and its nav link) everywhere, dev included.
 * The client wants the group photo without names for the moment (2026-10-07), and the repo is
 * public, so no names are kept here. Jorge has the approved list; each area takes
 * { name, role? } entries in `people`.
 */
export const team: {
  published: boolean; lede: string; photo: string;
  areas: { name: string; people: { name: string; role?: string }[] }[];
} = {
  published: false,
  lede: 'Las personas que están detrás de cada operación.',
  photo: '', // group photo in public/img/ (landscape, about 1600px wide); a placeholder shows while empty
  areas: [
    { name: 'Dirección', people: [] },
    { name: 'Comercio exterior', people: [] },
    { name: 'Administración y coordinación', people: [] },
  ],
};
export const showTeam = team.published;

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
  'Experiencia comprobada en importación y exportación',
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

// "Rubros": the sectors the agency's clients work in (no client names are shown).
export const sectorsIntro = {
  title: 'Experiencia en distintos sectores',
  lede: 'Acompañamos a pymes y grandes industrias en las importaciones y exportaciones de cada rubro.',
};

export const sectors = [
  { name: 'Manufactura', img: '/img/sectores/manufactura.png', goods: 'Maquinaria, insumos industriales y plásticos' },
  { name: 'Tecnología', img: '/img/sectores/tecnologia.png', goods: 'Equipos informáticos y electrónica' },
  { name: 'Salud', img: '/img/sectores/salud.png', goods: 'Medicamentos e insumos médicos' },
  { name: 'Agro', img: '/img/sectores/agro.png', goods: 'Granos, semillas y fertilizantes' },
  { name: 'Repuestos', img: '/img/sectores/repuestos.png', goods: 'Autopartes y repuestos' },
  { name: 'Consumo masivo', img: '/img/sectores/consumo.png', goods: 'Alimentos, bebidas y cosmética' },
];

/**
 * Images for the animated scenes. Drop the file in public/img/ and set its path here;
 * while a value is empty the page shows a placeholder (or the drawn fallback).
 */
export const media = {
  spreader: '/img/spreader.webp', // container spreader (gripper), front elevation (original in v3/src-images/)
  truck: '/img/camion.webp',  // top-down truck with container, cab to the right (original in v3/src-images/)
  // spinning globe beside "¿Por qué elegirnos?": v3/globe-36.gif (white lines on flat blue) redrawn as
  // brand-blue lines on a transparent background, 480px animated WebP at the original 25 fps
  globe: '/img/globo.webp',
  globeStill: '/img/globo-quieto.webp', // its first frame, for visitors who prefer reduced motion
};

/**
 * Hero ship video as frames (from src-images/hero-original.mp4, every 2nd frame → 96 WebP).
 * lg = 1280px wide for desktop, sm = 720px for phones. Regenerate both if the video changes.
 */
export const heroFrames = { count: 96, lg: '/hero/lg', sm: '/hero/sm' };

/** ISO 6346-style container code; the brand's founding year doubles as the serial. */
export const containerCode = (i: number) => `ABTU ${site.founded}${String(i + 1).padStart(2, '0')}`;
