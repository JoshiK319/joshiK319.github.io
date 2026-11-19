(function () {
  'use strict';
  // Link to the reference paper (used by both links on the page).
  const PAPER_URL = 'https://doi.org/10.1109/SSCET69323.2026.11735668';
  document.getElementById('paper-link').href = PAPER_URL;
  document.getElementById('paper-link2').href = PAPER_URL;

  const FIELDS = [
    ['J',      'J',            'kg·m²'],
    ['B',      'B',            'N·m·s'],
    ['Kt',     'Kt',           'N·m/A'],
    ['TL',     'Torque load',  'N·m'],
    ['wrated', 'wrated',       'rpm'],
    ['Fp',     'Fp',           '%'],
    ['tp1',    'tp1',          's'],
    ['tp2',    'tp2',          's']
  ];

  const form = document.getElementById('form');
  const msg = document.getElementById('msg');
  const canvas = document.getElementById('plot');
  const ctx = canvas.getContext('2d');
  const rc = document.getElementById('resp');
  const rctx = rc.getContext('2d');
  const STRUCTURE = 'PI';
  let lastResp = null;
  const inputs = {};

  FIELDS.forEach(([key, label, unit]) => {
    const row = document.createElement('div');
    row.className = 'field';
    row.innerHTML = '<label for="f_' + key + '">' + label + ' <small>[' + unit + ']</small></label>' +
                    '<input id="f_' + key + '" type="text" inputmode="decimal">';
    form.appendChild(row);
    inputs[key] = row.querySelector('input');
    inputs[key].addEventListener('input', schedule);
  });

  function setDefaults() {
    FIELDS.forEach(([key]) => { inputs[key].value = String(PMSM.DEFAULTS[key]); });
    schedule();
  }
  document.getElementById('reset').addEventListener('click', setDefaults);

  let pending = false, last = null;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; compute(); });
  }

  function readParams() {
    const p = {};
    FIELDS.forEach(([key]) => {
      const v = Number(inputs[key].value.trim());
      p[key] = inputs[key].value.trim() === '' ? NaN : v;
      inputs[key].classList.toggle('bad', !Number.isFinite(v) || v <= 0 || inputs[key].value.trim() === '');
    });
    return p;
  }

  function compute() {
    const res = PMSM.analyze(readParams());
    msg.textContent = res.error || '';
    if (res.error) { last = null; clearAll(); return; }
    last = res;
    draw(res);
    legend(res);
    results(res);
    response(res);
  }

  function clearAll() {
    const dpr = window.devicePixelRatio || 1, cw = canvas.clientWidth;
    canvas.width = cw * dpr; canvas.height = 40; canvas.style.height = '40px';
    document.getElementById('legend').innerHTML = '';
    document.getElementById('results').innerHTML = '';
    document.getElementById('resp-stats').innerHTML = '';
    rc.width = rc.clientWidth; rc.height = 1; lastResp = null;
  }

  const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
  const sci = (v) => Number(v.toPrecision(4)).toString();

  function results(res) {
    const el = document.getElementById('results');
    if (!res.pole) {
      el.innerHTML = '<div class="stat"><div class="k">Result</div><div class="v">No feasible pole for these inputs</div></div>';
      return;
    }
    const { pole, gains } = res;
    const stat = (k, v, big) => '<div class="stat' + (big ? ' big' : '') + '"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>';
    el.innerHTML =
      stat('Kp', sci(gains.Kp), true) + stat('Ki', sci(gains.Ki), true) +
      stat('Pole', fmt(pole.sigma) + ' ± j' + pole.omega.toFixed(2)) +
      stat('ζ', pole.zeta.toFixed(3)) + stat('ωn', pole.wn.toFixed(2) + ' rad/s');
  }

  function legend(res) {
    const p = res.params, zs = res.zetaLines, el = document.getElementById('legend');
    const item = (sw, text) => '<li>' + sw + '<span>' + text + '</span></li>';
    const line = (color, dash) => '<span class="sw' + (dash ? ' dash' : '') + '" style="border-color:' + color + '"></span>';
    el.innerHTML =
      item(line('var(--fp)'), 'F<sub>p</sub> boundary: F<sub>p</sub> = ' + (p.Fp / 100)) +
      item(line('var(--zeta)'), 'Damping boundary: ζ = ' + zs[0].zeta) +
      item(line('var(--zeta)', true), 'Damping boundary: ζ = ' + zs[1].zeta) +
      item(line('var(--tp1)', true), 'Peak-time boundary: t<sub>p</sub> = ' + p.tp1 + ' s') +
      item(line('var(--tp2)', true), 'Peak-time boundary: t<sub>p</sub> = ' + p.tp2 + ' s') +
      item('<span class="sw box" style="background:rgba(var(--region),.45)"></span>', 'Feasible region') +
      (res.pole ? item('<span class="sw star" style="color:var(--pole)">★</span>', 'Selected pole') : '');
  }

  // ---- plotting -------------------------------------------------------------------------
  function niceTicks(min, max, target) {
    const raw = (max - min) / target, mag = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / mag;
    const step = (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag, out = [];
    for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + 1e-9; v += step) out.push(Math.round(v / step) * step);
    return out;
  }

  function star(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r;
      c.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
    }
    c.closePath(); c.fill();
  }

  function draw(res) {
    const css = getComputedStyle(document.documentElement);
    const col = (n) => css.getPropertyValue(n).trim();
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth, ch = Math.max(320, Math.round(cw * 0.58));
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr); canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const L = 62, R = 14, T = 12, Bm = 50;
    const pw = cw - L - R, ph = ch - T - Bm;
    const { xMax, yMax } = res.limits;
    const px = (s) => L + (s + xMax) / xMax * pw;
    const py = (w) => T + (yMax - w) / (2 * yMax) * ph;

    ctx.font = '13px system-ui, sans-serif';
    ctx.fillStyle = col('--fg'); ctx.strokeStyle = col('--grid'); ctx.lineWidth = 1;

    // grid + ticks
    const xt = niceTicks(-xMax, 0, 7), yt = niceTicks(-yMax, yMax, 8);
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    xt.forEach((v) => { ctx.beginPath(); ctx.moveTo(px(v), T); ctx.lineTo(px(v), T + ph); ctx.stroke(); ctx.fillText(String(v), px(v), T + ph + 6); });
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    yt.forEach((v) => { ctx.beginPath(); ctx.moveTo(L, py(v)); ctx.lineTo(L + pw, py(v)); ctx.stroke(); ctx.fillText(String(v), L - 8, py(v)); });

    // feasible region (upper half plane)
    const { n, mask } = res.region;
    const off = document.createElement('canvas'); off.width = n; off.height = n;
    const octx = off.getContext('2d'), img = octx.createImageData(n, n);
    const rgb = col('--region').split(',').map(Number);
    for (let i = 0; i < n * n; i++) if (mask[i]) { const k = 4 * i; img.data[k] = rgb[0]; img.data[k + 1] = rgb[1]; img.data[k + 2] = rgb[2]; img.data[k + 3] = 115; }
    octx.putImageData(img, 0, 0);

    ctx.save();
    ctx.beginPath(); ctx.rect(L, T, pw, ph); ctx.clip();
    ctx.drawImage(off, px(-xMax), py(yMax), px(-0.5) - px(-xMax), py(0.5) - py(yMax));

    const path = (sig, wd, mirror) => {
      ctx.beginPath(); let pen = false;
      for (let i = 0; i < sig.length; i++) {
        if (!Number.isFinite(sig[i]) || !Number.isFinite(wd[i])) { pen = false; continue; }
        const y = py(mirror ? -wd[i] : wd[i]);
        if (pen) ctx.lineTo(px(sig[i]), y); else ctx.moveTo(px(sig[i]), y);
        pen = true;
      }
      ctx.stroke();
    };
    const pair = (sig, wd, color, dash) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash ? [7, 5] : []);
      path(sig, wd, false); path(sig, wd, true);
    };

    // damping lines
    res.zetaLines.forEach((z, k) => pair([0, -z.slope * yMax], [0, yMax], col('--zeta'), k === 1));
    // Fp
    pair(res.curves.fp.sigma, res.curves.fp.wd, col('--fp'), false);
    // peak-time curves
    res.curves.tp.forEach((t, k) => {
      const c = col(k === 0 ? '--tp1' : '--tp2');
      pair(t.sweep.sigma, t.sweep.wd, c, true);
      pair(t.fold.sigma, t.fold.wd, c, true);
    });
    ctx.setLineDash([]);

    // pole
    if (res.pole) {
      ctx.fillStyle = col('--pole');
      star(ctx, px(res.pole.sigma), py(res.pole.omega), 9);
      star(ctx, px(res.pole.sigma), py(-res.pole.omega), 9);
    }
    ctx.restore();

    // frame + labels
    ctx.strokeStyle = col('--fg'); ctx.lineWidth = 1; ctx.strokeRect(L, T, pw, ph);
    ctx.fillStyle = col('--fg'); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.font = '14px system-ui, sans-serif';
    ctx.fillText('σ = −ζ·ωn  [rad/s]', L + pw / 2, ch - 8);
    ctx.save(); ctx.translate(16, T + ph / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('ωd  [rad/s]', 0, 0); ctx.restore();
  }


  // ---- speed response: rated-speed step at t = 0, then the load torque once the speed has settled ----
  function response(res) {
    const el = document.getElementById('resp-stats');
    if (!res.pole) { el.innerHTML = ''; rc.height = 1; lastResp = null; return; }
    const m = PMSM.simulate(res.params, res.gains, STRUCTURE, { sigma: res.pole.sigma });
    lastResp = m;
    const stat = (k, v) => '<div class="stat"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>';
    el.innerHTML = stat('Peak time t<sub>p</sub>', m.tp.toFixed(3) + ' s') +
      stat('Overshoot', m.Mp.toFixed(1) + ' %') +
      stat('Load fluctuation F<sub>p</sub>', m.Fp.toFixed(1) + ' %' + (m.Fp <= res.params.Fp ? '' : ' (above limit)'));
    drawResp(m);
  }

  function drawResp(m) {
    const css = getComputedStyle(document.documentElement);
    const col = (n) => css.getPropertyValue(n).trim();
    const dpr = window.devicePixelRatio || 1;
    const cw = rc.clientWidth, ch = Math.max(240, Math.round(cw * 0.4));
    rc.width = Math.round(cw * dpr); rc.height = Math.round(ch * dpr); rc.style.height = ch + 'px';
    const c = rctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, cw, ch);
    const L = 62, R = 14, T = 14, Bm = 46, pw = cw - L - R, ph = ch - T - Bm;
    const ymax = Math.max(m.peak.rpm, m.rated) * 1.18;
    const px = (t) => L + t / m.T * pw, py = (v) => T + (1 - v / ymax) * ph;
    c.font = '13px system-ui, sans-serif'; c.lineWidth = 1;
    const xt = niceTicks(0, m.T, 7), yt = niceTicks(0, ymax, 5);
    c.strokeStyle = col('--grid'); c.fillStyle = col('--fg');
    c.textAlign = 'center'; c.textBaseline = 'top';
    xt.forEach((v) => { c.beginPath(); c.moveTo(px(v), T); c.lineTo(px(v), T + ph); c.stroke(); c.fillText(String(+v.toFixed(3)), px(v), T + ph + 6); });
    c.textAlign = 'right'; c.textBaseline = 'middle';
    yt.forEach((v) => { c.beginPath(); c.moveTo(L, py(v)); c.lineTo(L + pw, py(v)); c.stroke(); c.fillText(String(+(v / 1e4).toFixed(2)), L - 8, py(v)); });
    c.save(); c.beginPath(); c.rect(L, T, pw, ph); c.clip();
    // rated speed and load-step marker
    c.setLineDash([2, 4]); c.strokeStyle = col('--muted'); c.beginPath(); c.moveTo(L, py(m.rated)); c.lineTo(L + pw, py(m.rated)); c.stroke();
    c.setLineDash([6, 4]); c.beginPath(); c.moveTo(px(m.tl), T); c.lineTo(px(m.tl), T + ph); c.stroke();
    // peak time
    c.strokeStyle = col('--fg'); c.beginPath(); c.moveTo(px(m.peak.t), py(0)); c.lineTo(px(m.peak.t), py(m.peak.rpm)); c.stroke();
    c.setLineDash([]);
    // response
    c.strokeStyle = col('--fg'); c.lineWidth = 2; c.beginPath();
    m.t.forEach((t, i) => { if (i) c.lineTo(px(t), py(m.rpm[i])); else c.moveTo(px(t), py(m.rpm[i])); });
    c.stroke(); c.lineWidth = 1;
    // markers and labels
    const dot = (x, y, color) => { c.fillStyle = color; c.beginPath(); c.arc(x, y, 4, 0, 2 * Math.PI); c.fill(); };
    dot(px(m.peak.t), py(m.peak.rpm), col('--pole')); dot(px(m.dip.t), py(m.dip.rpm), col('--fp'));
    c.font = '13px system-ui, sans-serif'; c.textBaseline = 'middle';
    c.fillStyle = col('--pole'); c.textAlign = 'left';
    c.fillText(m.Mp.toFixed(1) + '% overshoot', px(m.peak.t) + 14, py(m.peak.rpm) - 12);
    c.fillStyle = col('--fp'); c.textAlign = 'left';
    c.fillText('Fₚ = ' + m.Fp.toFixed(1) + '% undershoot', px(m.dip.t) + 10, py(m.dip.rpm) + 18);
    c.fillStyle = col('--muted'); c.textAlign = 'left'; c.font = '12px system-ui, sans-serif';
    c.fillText('load step', px(m.tl) + 6, T + ph - 10);
    c.save(); c.translate(px(m.peak.t) + 16, py(0) - 8); c.rotate(-Math.PI / 2); c.textAlign = 'left'; c.fillStyle = col('--fg');
    c.fillText('tₚ = ' + m.tp.toFixed(3) + ' s', 0, 0); c.restore();
    c.restore();
    c.strokeStyle = col('--fg'); c.strokeRect(L, T, pw, ph);
    c.fillStyle = col('--fg'); c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = '14px system-ui, sans-serif';
    c.fillText('Time  [s]', L + pw / 2, ch - 8);
    c.save(); c.translate(16, T + ph / 2); c.rotate(-Math.PI / 2); c.fillText('Speed  [r/min, ×10⁴]', 0, 0); c.restore();
  }

  let rt = null;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (last) draw(last); if (lastResp) drawResp(lastResp); }, 80); });
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (last) draw(last); if (lastResp) drawResp(lastResp); });

  setDefaults();
})();
