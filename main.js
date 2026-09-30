(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  // dates are computed, never typed: © year and years in business since 1976
  const FOUNDED = 1976, YEAR = new Date().getFullYear();
  document.getElementById('y').textContent = YEAR;
  document.querySelectorAll('[data-years]').forEach(el => { el.textContent = YEAR - FOUNDED; });

  /* ---------- mobile menu ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- scroll-linked values ---------- */
  const header = document.querySelector('.top');
  const sections = [...document.querySelectorAll('[data-scroll]')];
  const hero = document.querySelector('.hero');
  const conts = [...document.querySelectorAll('.cont')];
  const steps = document.querySelector('.steps');
  const stepItems = [...document.querySelectorAll('.step')];
  const belt = document.querySelector('.belt');
  const beltRow = document.querySelector('.belt__row');

  function measureBelt() {
    const shift = Math.max(0, beltRow.scrollWidth - belt.clientWidth + 40);
    belt.parentElement.style.setProperty('--shift', shift + 'px');
  }

  function update() {
    const vh = innerHeight;
    const max = root.scrollHeight - vh;
    root.style.setProperty('--page', max > 0 ? (scrollY / max).toFixed(4) : 0);
    header.classList.toggle('is-solid', scrollY > 40);

    // --p: 0 when a section's top enters the bottom of the screen, 1 when its bottom leaves the top
    for (const s of sections) {
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      s.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
    }
    // --s (hero): 0 at rest, 1 once scrolled past
    const hr = hero.getBoundingClientRect();
    hero.style.setProperty('--s', clamp(-hr.top / hr.height).toFixed(4));

    if (reduce) return;

    // containers slide in from the sides as they are "loaded"
    for (const c of conts) {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--in', clamp((vh * 1.02 - r.top) / (vh * 0.42)).toFixed(4));
    }

    // process route fills as you read, stamps light up when reached
    const sr = steps.getBoundingClientRect();
    const f = clamp((vh * 0.7 - sr.top) / (sr.height * 0.9));
    steps.style.setProperty('--f', f.toFixed(4));
    stepItems.forEach((el, i) => el.classList.toggle('is-on', f >= (i + 0.3) / stepItems.length));
  }

  let ticking = false;
  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measureBelt(); update(); });
  measureBelt();
  update();
  if (reduce) stepItems.forEach(el => el.classList.add('is-on'));

  /* ---------- hero: drifting currents ---------- */
  const canvas = document.querySelector('.hero__sea');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  const LINES = 16;
  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    const scroll = (scrollY || 0) * 0.0025;
    for (let i = 0; i < LINES; i++) {
      const k = i / (LINES - 1);
      const base = h * (0.18 + k * 0.78);
      const amp = 14 + 26 * Math.sin(k * Math.PI);
      const freq = 0.0028 + k * 0.0012;
      const speed = 0.00018 + k * 0.00008;
      ctx.beginPath();
      for (let x = -10; x <= w + 10; x += 12) {
        const y = base
          + Math.sin(x * freq + t * speed + i * 0.7 + scroll) * amp
          + Math.sin(x * freq * 0.37 - t * speed * 0.6 + i) * amp * 0.6;
        x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(77,184,244,${0.05 + 0.13 * Math.sin(k * Math.PI)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
  size();
  addEventListener('resize', () => { size(); if (reduce) draw(0); });
  if (reduce) { draw(0); return; }

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
  (function loop(t) {
    if (visible) draw(t);
    requestAnimationFrame(loop);
  })(0);
})();
