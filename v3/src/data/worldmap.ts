// Build-time world map: everything here runs in Astro's frontmatter and ships as plain SVG paths.
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import world from 'world-atlas/countries-110m.json';

export const W = 1000;
export const H = 520;

const topo = world as unknown as Topology<{ countries: GeometryCollection }>;
const obj = topo.objects.countries;
const all = feature(topo, obj);
const noAntarctica = { ...all, features: all.features.filter(f => f.id !== '010') };

const projection = geoNaturalEarth1().fitExtent([[10, 10], [W - 10, H - 10]], noAntarctica);
const path = geoPath(projection);
const r1 = (s: string | null) => (s ?? '').replace(/(\d+\.\d)\d+/g, '$1'); // trim decimals

const notAnt = (a: any) => a.id !== '010';
export const coast = r1(path(mesh(topo, obj, (a, b) => a === b && notAnt(a))));
export const borders = r1(path(mesh(topo, obj, (a, b) => a !== b && notAnt(a) && notAnt(b))));
export const land = r1(path(noAntarctica));
export const paraguay =r1(path(all.features.find(f => f.id === '600')!));

const ASU: LL = [-57.63, -25.28];
const [ax, ay] = projection(ASU)!;
export const asuncion = { x: +ax.toFixed(1), y: +ay.toFixed(1) };

type LL = [number, number];
// Main origins and destinations of Paraguay's foreign trade (illustrative, not client data).
// `via` are rough waypoints: river ports down the Hidrovía, then open-sea lanes.
const RIVER: LL[] = [[-58.8, -27.5], [-60.6, -32.9]];
const places: { name: string; at: LL; via?: LL[]; anchor?: 'start' | 'end' }[] = [
  { name: 'Santos', at: [-46.33, -23.96], anchor: 'start' },
  { name: 'Buenos Aires', at: [-58.38, -34.6], via: RIVER, anchor: 'end' },
  { name: 'Montevideo', at: [-56.16, -34.9], via: RIVER, anchor: 'start' },
  { name: 'Iquique', at: [-70.15, -20.21], anchor: 'end' },
  { name: 'Miami', at: [-80.19, 25.76], via: [[-66, 2]], anchor: 'end' },
  { name: 'Róterdam', at: [4.48, 51.92], via: [...RIVER, [-50, -30], [-33, -8], [-25, 20], [-12, 42]], anchor: 'start' },
  { name: 'Shanghái', at: [121.47, 31.23], via: [...RIVER, [-45, -38], [18, -38], [60, -12], [96, 2], [112, 14]], anchor: 'end' },
];

// Catmull-Rom through projected points → smooth cubic Bézier path.
function smooth(pts: number[][]) {
  if (pts.length < 3) {
    // short hop: bow it slightly so it reads as a route
    const [[x0, y0], [x1, y1]] = pts;
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - Math.hypot(x1 - x0, y1 - y0) * 0.22;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1.map(v => v.toFixed(1)).join(' ')} ${c2.map(v => v.toFixed(1)).join(' ')} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export const routes = places.map(p => {
  const pts = [ASU, ...(p.via ?? []), p.at].map(ll => projection(ll)!);
  const [ex, ey] = pts[pts.length - 1];
  return { name: p.name, d: smooth(pts), x: +ex.toFixed(1), y: +ey.toFixed(1), anchor: p.anchor ?? 'start' };
});
