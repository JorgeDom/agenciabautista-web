// Build-time map of Paraguay: everything here runs in Astro's frontmatter and ships as plain SVG paths.
// The ports drawn on it come from `ports` in site.ts.
import { geoMercator, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import coarse from 'world-atlas/countries-50m.json';
import fine from 'world-atlas/countries-10m.json';
import { ports as portList } from './site';

export const W = 800;
export const H = 800;
const PAD = 110; // room around Paraguay for the neighbours' names

// The map starts zoomed in on Asunción, so the lines that show there (borders, Paraguay's outline)
// use the detailed 1:10m data; the faint land fill behind them has no visible edges and stays 1:50m.
type World = Topology<{ countries: GeometryCollection }>;
const topo = fine as unknown as World;
const obj = topo.objects.countries;
const py = feature(topo, obj).features.find(f => f.id === '600')!;
const background = coarse as unknown as World;

// Paraguay fills the viewBox. On desktop the map is the section's background, wider than tall, so
// the neighbours are drawn one viewBox-width beyond each side; above and below are never shown.
const projection = geoMercator()
  .fitExtent([[PAD, PAD], [W - PAD, H - PAD]], py)
  .clipExtent([[-W, 0], [2 * W, H]]);
const path = geoPath(projection);
const r1 = (s: string | null) => (s ?? '').replace(/(\d+\.\d)\d+/g, '$1'); // trim decimals

export const land = r1(path(feature(background, background.objects.countries)));
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

// The ports around Asunción are on the river, but their coordinates are approximate, and at the
// opening zoom (8×) a kilometre shows. So each riverside one is moved onto the nearest point of the
// drawn water line (Paraguay's river border, or RIVER) when that is within about 6 km.
const g = py.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon;
const rings = g.type === 'Polygon' ? g.coordinates : g.coordinates.flat();
const water = [...rings, RIVER].map(line => line.map(ll => projection(ll as LL)!));
function snap([x, y]: [number, number]): [number, number] {
  let best: [number, number] = [x, y], bestD = 4; // projected units, about 6 km at this scale
  for (const line of water) {
    for (let i = 1; i < line.length; i++) {
      const [ax, ay] = line[i - 1], [bx, by] = line[i];
      const dx = bx - ax, dy = by - ay, len = dx * dx + dy * dy;
      const t = len ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len)) : 0;
      const sx = ax + t * dx, sy = ay + t * dy, d = Math.hypot(x - sx, y - sy);
      if (d < bestD) { bestD = d; best = [sx, sy]; }
    }
  }
  return best;
}

// Nearest to Asunción first, so they appear outwards from the office as the map zooms out.
const far = (p: { x: number; y: number }) => Math.hypot(p.x - asuncion[0], p.y - asuncion[1]);
export const ports = portList
  .map(p => {
    const raw = projection(p.at)!;
    const [x, y] = (p.near && !p.inland ? snap(raw as [number, number]) : raw).map(v => +v.toFixed(1));
    return { ...p, x, y };
  })
  .sort((a, b) => far(a) - far(b));
