(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  // dates are computed, never typed: © year and years in business since 1976
  // (runs before the word split below, which flattens the paragraph to text)
  const FOUNDED = 1976, YEAR = new Date().getFullYear();
  $('#y').textContent = YEAR;
  $$('[data-years]').forEach(el => { el.textContent = YEAR - FOUNDED; });

  /* split the "Quiénes somos" paragraph into words for the read-along reveal */
  const big = $('[data-reveal]');
  big.innerHTML = big.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = [...big.querySelectorAll('.w')];

  const sections = $$('main > section');
  const railItems = $$('.rail li');
  const nowPort = $('.now__port'), nowSec = $('.now__sec');
  const par = $$('[data-par]');
  const marks = $$('[data-mark]');
  const why = $('.why');
  const proc = $('.process'), pin = $('.process__pin'), track = $('.process__track');
  let dist = 0;

  function measure() {
    const pad = parseFloat(getComputedStyle(pin).paddingLeft) || 0;
    dist = Math.max(0, track.scrollWidth - (pin.clientWidth - pad * 2));
    proc.style.setProperty('--dist', dist + 'px');
  }

  let current = -1;
  function update() {
    const vh = innerHeight;
    const max = root.scrollHeight - vh;
    root.style.setProperty('--page', max > 0 ? (scrollY / max).toFixed(4) : 0);

    // which port are we at?
    let idx = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= vh * 0.4) idx = i; });
    if (scrollY >= max - 2) idx = sections.length - 1;
    if (idx !== current) {
      current = idx;
      railItems.forEach((li, i) => {
        li.classList.toggle('is-past', i < idx);
        li.classList.toggle('is-here', i === idx);
        li.querySelector('a').toggleAttribute('aria-current', i === idx);
      });
      const a = railItems[idx].querySelector('a');
      nowPort.textContent = a.dataset.port;
      nowSec.textContent = a.querySelector('span').textContent;
    }

    if (reduce) return;

    for (const f of par) {
      const r = f.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      f.style.setProperty('--pp', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
    }

    const br = big.getBoundingClientRect();
    const read = clamp((vh * 0.85 - br.top) / (br.height + vh * 0.3));
    const on = Math.round(read * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < on));

    for (const m of marks) {
      const r = m.getBoundingClientRect();
      m.style.setProperty('--m', clamp((vh * 0.92 - r.top) / (vh * 0.3)).toFixed(4));
    }

    const wr = why.getBoundingClientRect();
    why.style.setProperty('--p', clamp((vh - wr.top) / (vh + wr.height)).toFixed(4));

    const pr = proc.getBoundingClientRect();
    const span = pr.height - vh;
    proc.style.setProperty('--hp', span > 0 ? clamp(-pr.top / span).toFixed(4) : 0);
  }

  let ticking = false;
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
  }, { passive: true });
  addEventListener('resize', () => { measure(); update(); });
  document.fonts?.ready.then(() => { measure(); update(); });
  measure();
  update();
  if (reduce) words.forEach(w => w.classList.add('on'));
})();
