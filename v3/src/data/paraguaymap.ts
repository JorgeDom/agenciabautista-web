// Build-time map of Paraguay: everything here runs in Astro's frontmatter and ships as plain SVG paths.
// The ports drawn on it come from `ports` in site.ts.
import { geoMercator, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import world from 'world-atlas/countries-50m.json';
import { ports as portList } from './site';

export const W = 800;
export const H = 800;
const PAD = 110; // room around Paraguay for the neighbours' names

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const obj = topo.objects.countries;
const countries = feature(topo, obj);
const py = countries.features.find(f => f.id === '600')!;

// Paraguay fills the viewBox; whatever falls outside it is never shown, so it isn't shipped.
const projection = geoMercator()
  .fitExtent([[PAD, PAD], [W - PAD, H - PAD]], py)
  .clipExtent([[0, 0], [W, H]]);
const path = geoPath(projection);
const r1 = (s: string | null) => (s ?? '').replace(/(\d+\.\d)\d+/g, '$1'); // trim decimals

export const land = r1(path(countries));
export const coast = r1(path(mesh(topo, obj, (a, b) => a === b)));
export const borders = r1(path(mesh(topo, obj, (a, b) => a !== b)));
export const paraguay = r1(path(py));

type LL = [number, number];
// Río Paraguay where it crosses the country, from the Apa down to Asunción (north and south of
// that stretch it is the border, already drawn). Traced by hand: good for this scale, not for survey.
const RIVER: LL[] = [
  [-57.99, -22.09], [-57.94, -22.3], [-57.85, -22.65], [-57.72, -23.05], [-57.47, -23.42], [-57.33, -23.85],
  [-57.17, -24.4], [-57.25, -24.7], [-57.42, -24.95], [-57.56, -25.1], [-57.64, -25.26],
];
export const river = r1(path({ type: 'LineString', coordinates: RIVER }));

const xy = (ll: LL) => projection(ll)!.map(v => +v.toFixed(1)) as [number, number];

export const asuncion = xy([-57.63, -25.28]);

// Country names, placed by hand where each one has room.
export const names: { name: string; at: [number, number]; home?: boolean }[] = [
  { name: 'Paraguay', at: xy([-60.2, -22]), home: true },
  { name: 'Bolivia', at: xy([-62.4, -18.7]) },
  { name: 'Brasil', at: xy([-55.2, -20.6]) },
  { name: 'Argentina', at: xy([-60.4, -26.7]) },
];

// Nearest to Asunción first, so they appear outwards from the office as the map zooms out.
const far = (p: { x: number; y: number }) => Math.hypot(p.x - asuncion[0], p.y - asuncion[1]);
export const ports = portList
  .map(p => { const [x, y] = xy(p.at); return { ...p, x, y }; })
  .sort((a, b) => far(a) - far(b));
