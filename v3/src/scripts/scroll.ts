// One rAF-throttled scroll/resize loop shared by every scene.

type Frame = (vh: number) => void;
const frames: Frame[] = [];
const resizers: (() => void)[] = [];
let ticking = false;
let started = false;

export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** 0 when the element's top enters the bottom of the viewport, 1 when its bottom leaves the top. */
export function passProgress(el: Element, vh = innerHeight) {
  const r = el.getBoundingClientRect();
  return clamp((vh - r.top) / (vh + r.height));
}

function run() {
  const vh = innerHeight;
  for (const f of frames) f(vh);
  ticking = false;
}
function request() {
  if (!ticking) { ticking = true; requestAnimationFrame(run); }
}

export function onScroll(frame: Frame, onResize?: () => void) {
  frames.push(frame);
  if (onResize) resizers.push(onResize);
  if (!started) {
    started = true;
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', () => { resizers.forEach(r => r()); request(); });
    document.fonts?.ready.then(() => { resizers.forEach(r => r()); request(); });
  }
  onResize?.();
  request();
}
