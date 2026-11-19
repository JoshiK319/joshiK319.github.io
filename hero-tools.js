/* Interactive PI and P-I tuner cards in the hero. Each card shows the loop diagram and a live
 * pole-boundary plot. Move the sliders, click or drag in the plot to place a pole, and Kp/Ki update. */
(function () {
  'use strict';
  const SOLVERS = { pi: window.PMSM_PI, pii: window.PMSM_PII };
  if (!SOLVERS.pi || !SOLVERS.pii) return;

  const C = {
    ink: '#EEF1F5', dim: '#B2BCC8', faint: '#8691A0', grid: 'rgba(238,241,245,0.08)', axis: 'rgba(238,241,245,0.32)',
    fp: '#4DB5E8', zeta: '#E8589F', tp1: '#F09D55', tp2: '#EEF1F5', region: 'rgba(70,200,140,0.34)',
    pole: '#FFD166', good: '#46C88C', warn: '#F09D55'
  };

  const ARROW = (id) => '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>';

  function diagramPI(id) {
    return '<svg viewBox="0 6 640 150" role="img" aria-label="PI speed control loop">' + ARROW(id) +
      '<text x="6" y="52">&omega;<tspan font-size="11" dy="4">ref</tspan></text>' +
      '<line class="ln" x1="6" y1="64" x2="96" y2="64" marker-end="url(#' + id + ')"/>' +
      '<circle class="blk" cx="112" cy="64" r="15"/><text x="105" y="69" font-size="14">+</text><text x="106" y="92" font-size="14">&minus;</text>' +
      '<line class="ln" x1="127" y1="64" x2="170" y2="64" marker-end="url(#' + id + ')"/><text x="140" y="56" font-style="italic">e</text>' +
      '<rect class="blk" x="172" y="44" width="116" height="40"/>' +
      '<text x="186" y="70"><tspan font-style="italic">K</tspan><tspan font-size="11" dy="4">p</tspan><tspan dy="-4"> + </tspan><tspan font-style="italic">K</tspan><tspan font-size="11" dy="4">i</tspan><tspan dy="-4">/s</tspan></text>' +
      '<line class="ln" x1="288" y1="64" x2="326" y2="64" marker-end="url(#' + id + ')"/>' +
      '<rect class="blk" x="328" y="44" width="52" height="40"/><text x="342" y="70" font-style="italic">K<tspan font-size="11" dy="4" font-style="normal">t</tspan></text>' +
      '<line class="ln" x1="380" y1="64" x2="432" y2="64" marker-end="url(#' + id + ')"/><text x="396" y="56" font-style="italic">T<tspan font-size="11" dy="4" font-style="normal">e</tspan></text>' +
      '<circle class="blk" cx="448" cy="64" r="15"/><text x="441" y="69" font-size="14">+</text><text x="460" y="48" font-size="14">&minus;</text>' +
      '<line class="ln" x1="448" y1="14" x2="448" y2="47" marker-end="url(#' + id + ')"/><text x="456" y="26">T<tspan font-size="11" dy="4">Load</tspan></text>' +
      '<line class="ln" x1="463" y1="64" x2="502" y2="64" marker-end="url(#' + id + ')"/>' +
      '<rect class="blk" x="504" y="44" width="84" height="40"/><text x="520" y="62" font-size="13">1</text><line class="ln" x1="514" y1="66" x2="578" y2="66"/>' +
      '<text x="514" y="80" font-size="13"><tspan font-style="italic">Js</tspan> + <tspan font-style="italic">B</tspan></text>' +
      '<line class="ln" x1="588" y1="64" x2="636" y2="64" marker-end="url(#' + id + ')"/><text x="598" y="52">&omega;<tspan font-size="11" dy="4">out</tspan></text>' +
      '<polyline class="ln" points="608,64 608,138 112,138 112,80" marker-end="url(#' + id + ')"/></svg>';
  }

  function diagramPII(id) {
    return '<svg viewBox="0 6 640 158" role="img" aria-label="P-I speed control loop">' + ARROW(id) +
      '<text x="6" y="52">&omega;<tspan font-size="11" dy="4">ref</tspan></text>' +
      '<line class="ln" x1="6" y1="64" x2="84" y2="64" marker-end="url(#' + id + ')"/>' +
      '<circle class="blk" cx="100" cy="64" r="15"/><text x="93" y="69" font-size="14">+</text><text x="94" y="92" font-size="14">&minus;</text>' +
      '<line class="ln" x1="115" y1="64" x2="152" y2="64" marker-end="url(#' + id + ')"/><text x="126" y="56" font-style="italic">e</text>' +
      '<rect class="blk" x="154" y="44" width="84" height="40"/><text x="172" y="62" font-size="14" font-style="italic">K<tspan font-size="11" dy="4" font-style="normal">i</tspan></text>' +
      '<line class="ln" x1="166" y1="66" x2="226" y2="66"/><text x="192" y="80" font-size="13" font-style="italic">s</text>' +
      '<line class="ln" x1="238" y1="64" x2="254" y2="64" marker-end="url(#' + id + ')"/>' +
      '<circle class="blk" cx="270" cy="64" r="15"/><text x="263" y="69" font-size="14">+</text><text x="276" y="92" font-size="14">&minus;</text>' +
      '<line class="ln" x1="285" y1="64" x2="322" y2="64" marker-end="url(#' + id + ')"/>' +
      '<rect class="blk" x="324" y="44" width="52" height="40"/><text x="338" y="70" font-style="italic">K<tspan font-size="11" dy="4" font-style="normal">t</tspan></text>' +
      '<line class="ln" x1="376" y1="64" x2="428" y2="64" marker-end="url(#' + id + ')"/><text x="392" y="56" font-style="italic">T<tspan font-size="11" dy="4" font-style="normal">e</tspan></text>' +
      '<circle class="blk" cx="444" cy="64" r="15"/><text x="437" y="69" font-size="14">+</text><text x="456" y="48" font-size="14">&minus;</text>' +
      '<line class="ln" x1="444" y1="14" x2="444" y2="47" marker-end="url(#' + id + ')"/><text x="452" y="26">T<tspan font-size="11" dy="4">Load</tspan></text>' +
      '<line class="ln" x1="459" y1="64" x2="500" y2="64" marker-end="url(#' + id + ')"/>' +
      '<rect class="blk" x="502" y="44" width="84" height="40"/><text x="518" y="62" font-size="13">1</text><line class="ln" x1="512" y1="66" x2="576" y2="66"/>' +
      '<text x="512" y="80" font-size="13"><tspan font-style="italic">Js</tspan> + <tspan font-style="italic">B</tspan></text>' +
      '<line class="ln" x1="586" y1="64" x2="636" y2="64" marker-end="url(#' + id + ')"/><text x="598" y="52">&omega;<tspan font-size="11" dy="4">out</tspan></text>' +
      '<polyline class="ln" points="608,64 608,156 100,156 100,80" marker-end="url(#' + id + ')"/>' +
      '<polyline class="ln" points="608,118 306,118"/><rect class="blk" x="232" y="102" width="74" height="32"/>' +
      '<text x="262" y="123" font-style="italic">K<tspan font-size="11" dy="4" font-style="normal">p</tspan></text>' +
      '<line class="ln" x1="269" y1="102" x2="269" y2="80" marker-end="url(#' + id + ')"/></svg>';
  }

  const CONFIG = {
    pi:  { title: 'PI speed-loop tuner',  href: 'pmsm-pi-tuner/',   diagram: diagramPI,  id: 'ahpi',  structure: 'PI' },
    pii: { title: 'P-I speed-loop tuner', href: 'pmsm-p-i-tuner/', diagram: diagramPII, id: 'ahpii', structure: 'P-I' }
  };

  const fmt = (v) => Number(v.toPrecision(3)).toString();
  const sgn = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(1);

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

  function build(card, key) {
    const cfg = CONFIG[key], S = SOLVERS[key], D = S.DEFAULTS;
    const state = { Fp: D.Fp, tp1: D.tp1, tp2: D.tp2, custom: null, res: null, cursor: null, drag: false, view: 'poles' };

    card.classList.add('is-live');
    card.innerHTML =
      '<div class="tool-head"><em>Interactive tool</em><a class="tool-open" href="' + cfg.href + '">Open full tool <span aria-hidden="true">&rarr;</span></a></div>' +
      '<a class="tool-name" href="' + cfg.href + '">' + cfg.title + '</a>' +
      '<div class="tool-diagram">' + cfg.diagram(cfg.id) + '</div>' +
      '<div class="tool-views"><div class="tool-tabs" role="tablist"><button type="button" role="tab" class="on" data-v="poles" aria-selected="true">Pole plane</button>' +
      '<button type="button" role="tab" data-v="resp" aria-selected="false">Speed response</button></div>' +
      '<canvas class="tool-plot" tabindex="0" aria-label="Closed-loop pole boundaries. Click or use arrow keys to place a pole."></canvas>' +
      '<canvas class="tool-plot tool-resp" hidden role="img" aria-label="Speed response: rated-speed step, then a load-torque step once settled, with overshoot, peak time and load fluctuation marked."></canvas></div>' +
      '<div class="tool-sliders">' +
        '<label><span>F<sub>p</sub> <output data-o="Fp"></output></span><input type="range" data-k="Fp" min="5" max="30" step="1" value="' + D.Fp + '"></label>' +
        '<label><span>t<sub>p1</sub> <output data-o="tp1"></output></span><input type="range" data-k="tp1" min="0.02" max="0.05" step="0.005" value="' + D.tp1 + '"></label>' +
        '<label><span>t<sub>p2</sub> <output data-o="tp2"></output></span><input type="range" data-k="tp2" min="0.055" max="0.1" step="0.005" value="' + D.tp2 + '"></label>' +
      '</div>' +
      '<div class="tool-read"><div class="gains"><span>K<sub>p</sub> <b data-r="Kp"></b></span><span>K<sub>i</sub> <b data-r="Ki"></b></span>' +
      '<button type="button" class="tool-best">Best pole</button></div>' +
      '<div class="pole"><span data-r="pole"></span><span class="chip" data-r="chip"></span></div></div>';

    const canvas = card.querySelector('canvas.tool-plot:not(.tool-resp)'), ctx = canvas.getContext('2d');
    const rcv = card.querySelector('canvas.tool-resp'), rctx = rcv.getContext('2d');
    const out = (k) => card.querySelector('[data-o="' + k + '"]');
    const rd = (k) => card.querySelector('[data-r="' + k + '"]');
    const base = document.createElement('canvas');
    let geo = null, pending = false;

    function setLabels() {
      out('Fp').textContent = state.Fp + '%';
      out('tp1').textContent = state.tp1.toFixed(3) + ' s';
      out('tp2').textContent = state.tp2.toFixed(3) + ' s';
    }

    function compute() {
      state.res = S.analyze(Object.assign({}, D, { Fp: state.Fp, tp1: state.tp1, tp2: state.tp2 }), { grid: 360, curvePts: 160 });
      drawBase();
      updateRead();
      paint();
    }

    function activePole() { return state.custom || (state.res && state.res.pole) || null; }

    function inside(p) {
      const r = state.res, n = r.region.n, { xMax, yMax } = r.limits;
      const i = Math.round((p.sigma + xMax) / (xMax - 0.5) * (n - 1)), j = Math.round((yMax - p.omega) / (yMax - 0.5) * (n - 1));
      return i >= 0 && i < n && j >= 0 && j < n && r.region.mask[j * n + i] === 1;
    }

    function updateRead() {
      const r = state.res, p = activePole();
      if (!r || r.error || !p) {
        rd('Kp').textContent = '–'; rd('Ki').textContent = '–';
        rd('pole').textContent = 'No feasible pole'; rd('chip').textContent = ''; return;
      }
      const g = S.gainsFromPole(p.sigma, p.omega, D.J, D.B, D.Kt);
      const wn = Math.hypot(p.sigma, p.omega);
      rd('Kp').textContent = fmt(g.Kp); rd('Ki').textContent = fmt(g.Ki);
      rd('pole').textContent = sgn(p.sigma) + ' ± j' + p.omega.toFixed(1) + '  ·  ζ ' + (-p.sigma / wn).toFixed(2);
      const ok = inside(p), chip = rd('chip');
      chip.textContent = ok ? 'In region' : 'Outside region';
      chip.className = 'chip ' + (ok ? 'ok' : 'no');
      drawResp();
    }

    // ---- speed response of the active pole: rated-speed step, then the load torque once settled ----
    function drawResp() {
      const dpr = window.devicePixelRatio || 1, cw = rcv.clientWidth, ch = rcv.clientHeight;
      if (!cw || !ch) return;
      rcv.width = Math.round(cw * dpr); rcv.height = Math.round(ch * dpr);
      const c = rctx; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, cw, ch);
      const p = activePole(); if (!p || !state.res || state.res.error) return;
      const g = S.gainsFromPole(p.sigma, p.omega, D.J, D.B, D.Kt);
      const m = S.simulate(state.res.params, g, cfg.structure, { sigma: p.sigma });
      const L = 34, R = 8, T = 8, B = 20, pw = cw - L - R, ph = ch - T - B;
      const ymax = Math.max(m.peak.rpm, m.rated) * 1.2;
      const x = (t) => L + t / m.T * pw, y = (v) => T + (1 - v / ymax) * ph;
      c.font = '10px system-ui, sans-serif'; c.lineWidth = 1; c.strokeStyle = C.grid; c.fillStyle = C.faint;
      c.textAlign = 'center'; c.textBaseline = 'top';
      niceTicks(0, m.T, cw < 260 ? 3 : 4).forEach((v) => { c.beginPath(); c.moveTo(x(v), T); c.lineTo(x(v), T + ph); c.stroke(); c.fillText(String(+v.toFixed(2)), x(v), T + ph + 4); });
      c.textAlign = 'right'; c.textBaseline = 'middle';
      niceTicks(0, ymax, 3).forEach((v) => { c.beginPath(); c.moveTo(L, y(v)); c.lineTo(L + pw, y(v)); c.stroke(); c.fillText(String(+(v / 1e4).toFixed(1)), L - 5, y(v)); });
      c.save(); c.beginPath(); c.rect(L, T, pw, ph); c.clip();
      c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(L, y(m.rated)); c.lineTo(L + pw, y(m.rated)); c.stroke();
      c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x(m.tl), T); c.lineTo(x(m.tl), T + ph); c.stroke();
      c.strokeStyle = C.dim; c.beginPath(); c.moveTo(x(m.peak.t), y(0)); c.lineTo(x(m.peak.t), y(m.peak.rpm)); c.stroke(); c.setLineDash([]);
      c.strokeStyle = C.ink; c.lineWidth = 1.7; c.beginPath();
      m.t.forEach((t, i) => { if (i) c.lineTo(x(t), y(m.rpm[i])); else c.moveTo(x(t), y(m.rpm[i])); });
      c.stroke();
      const dot = (X, Y, col) => { c.fillStyle = col; c.beginPath(); c.arc(X, Y, 3, 0, 2 * Math.PI); c.fill(); };
      dot(x(m.peak.t), y(m.peak.rpm), '#FF6B6B'); dot(x(m.dip.t), y(m.dip.rpm), C.fp);
      c.font = '10px system-ui, sans-serif'; c.textBaseline = 'middle'; c.textAlign = 'left';
      const put = (txt, X, Y, col) => { const w = c.measureText(txt).width; c.fillStyle = col; c.fillText(txt, Math.min(X, L + pw - w - 2), Y); };
      const narrow = cw < 260;
      put(m.Mp.toFixed(1) + (narrow ? '% over' : '% overshoot'), x(m.peak.t) + 8, y(m.peak.rpm) - 8, '#FF6B6B');
      put('F\u209a ' + m.Fp.toFixed(1) + (narrow ? '%' : '% undershoot'), x(m.dip.t) + 6, y(m.dip.rpm) + 11, C.fp);
      c.save(); c.translate(x(m.peak.t) + 12, y(0) - 4); c.rotate(-Math.PI / 2); c.fillStyle = C.dim; c.textAlign = 'left';
      c.fillText('t\u209a ' + m.tp.toFixed(3) + ' s', 0, 0); c.restore();
      if (cw >= 260) { c.fillStyle = C.faint; c.fillText('load', x(m.tl) + 4, T + 7); }
      c.restore();
      c.strokeStyle = C.axis; c.strokeRect(L, T, pw, ph);
      c.fillStyle = C.faint; c.textBaseline = 'alphabetic'; c.textAlign = 'right'; c.fillText('s', L + pw, T + ph + 17);
      c.save(); c.translate(9, T + ph / 2); c.rotate(-Math.PI / 2); c.textAlign = 'center'; c.fillText('r/min \u00d710\u2074', 0, 0); c.restore();
    }

    // Wide cards show the pole plane and the response side by side; narrow ones switch between them.
    function applyView() {
      const side = card.classList.contains('side');
      card.querySelectorAll('.tool-tabs button').forEach((b) => { const on = b.dataset.v === state.view; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      canvas.hidden = !side && state.view !== 'poles';
      rcv.hidden = !side && state.view !== 'resp';
      if (layout()) drawBase();
      paint(); drawResp();
    }
    function setView(v) { state.view = v; applyView(); }
    function checkSide() {
      const side = card.clientWidth >= 440;
      if (side !== card.classList.contains('side')) { card.classList.toggle('side', side); applyView(); return true; }
      return false;
    }
    card.querySelectorAll('.tool-tabs button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.v)));

    function layout() {
      const dpr = window.devicePixelRatio || 1, cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch) return false;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      base.width = canvas.width; base.height = canvas.height;
      geo = { dpr, cw, ch, L: 34, R: 8, T: 8, B: 20 };
      geo.pw = cw - geo.L - geo.R; geo.ph = ch - geo.T - geo.B;
      return true;
    }

    const px = (s) => geo.L + (s + state.res.limits.xMax) / state.res.limits.xMax * geo.pw;
    const py = (w) => geo.T + (state.res.limits.yMax - w) / (2 * state.res.limits.yMax) * geo.ph;

    function drawBase() {
      if (!geo && !layout()) return;
      const r = state.res; if (!r || r.error) return;
      const c = base.getContext('2d'), { dpr, cw, ch, L, T, pw, ph } = geo, { xMax, yMax } = r.limits;
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, cw, ch);
      c.font = '10px system-ui, sans-serif'; c.lineWidth = 1;

      c.strokeStyle = C.grid; c.fillStyle = C.faint;
      c.textAlign = 'center'; c.textBaseline = 'top';
      niceTicks(-xMax, 0, 5).forEach((v) => { c.beginPath(); c.moveTo(px(v), T); c.lineTo(px(v), T + ph); c.stroke(); c.fillText(String(v), px(v), T + ph + 4); });
      c.textAlign = 'right'; c.textBaseline = 'middle';
      niceTicks(-yMax, yMax, 4).forEach((v) => { c.beginPath(); c.moveTo(L, py(v)); c.lineTo(L + pw, py(v)); c.stroke(); c.fillText(String(v), L - 5, py(v)); });
      c.strokeStyle = C.axis; c.beginPath(); c.moveTo(L, py(0)); c.lineTo(L + pw, py(0)); c.stroke();

      // feasible region
      const n = r.region.n, off = document.createElement('canvas'); off.width = n; off.height = n;
      const oc = off.getContext('2d'), img = oc.createImageData(n, n);
      for (let i = 0; i < n * n; i++) if (r.region.mask[i]) { const k = 4 * i; img.data[k] = 70; img.data[k + 1] = 200; img.data[k + 2] = 140; img.data[k + 3] = 95; }
      oc.putImageData(img, 0, 0);

      c.save(); c.beginPath(); c.rect(L, T, pw, ph); c.clip();
      c.drawImage(off, px(-xMax), py(yMax), px(-0.5) - px(-xMax), py(0.5) - py(yMax));

      const path = (sig, wd, mirror) => {
        c.beginPath(); let pen = false;
        for (let i = 0; i < sig.length; i++) {
          if (!Number.isFinite(sig[i]) || !Number.isFinite(wd[i])) { pen = false; continue; }
          const y = py(mirror ? -wd[i] : wd[i]);
          if (pen) c.lineTo(px(sig[i]), y); else c.moveTo(px(sig[i]), y);
          pen = true;
        }
        c.stroke();
      };
      const pair = (sig, wd, color, dash) => { c.strokeStyle = color; c.lineWidth = 1.6; c.setLineDash(dash ? [5, 4] : []); path(sig, wd, false); path(sig, wd, true); };

      r.zetaLines.forEach((z, k) => pair([0, -z.slope * yMax], [0, yMax], C.zeta, k === 1));
      pair(r.curves.fp.sigma, r.curves.fp.wd, C.fp, false);
      r.curves.tp.forEach((t, k) => {
        const col = k === 0 ? C.tp1 : C.tp2;
        if (t.sweep) { pair(t.sweep.sigma, t.sweep.wd, col, true); pair(t.fold.sigma, t.fold.wd, col, true); }
        else pair([0, -2 * xMax], [t.wd, t.wd], col, true);
      });
      c.restore();
      c.setLineDash([]); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(L, T, pw, ph);
    }

    function paint() {
      pending = false;
      if (!geo || !state.res || state.res.error) return;
      const { dpr, cw, ch, L, T, pw, ph } = geo, r = state.res;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save(); ctx.beginPath(); ctx.rect(L, T, pw, ph); ctx.clip();
      if (state.cursor) {
        ctx.strokeStyle = 'rgba(238,241,245,0.35)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px(state.cursor.s), T); ctx.lineTo(px(state.cursor.s), T + ph);
        ctx.moveTo(L, py(state.cursor.w)); ctx.lineTo(L + pw, py(state.cursor.w)); ctx.stroke(); ctx.setLineDash([]);
      }
      const p = activePole();
      if (p) {
        ctx.fillStyle = C.pole; ctx.shadowColor = 'rgba(255,209,102,0.7)'; ctx.shadowBlur = 8;
        star(ctx, px(p.sigma), py(p.omega), 7); star(ctx, px(p.sigma), py(-p.omega), 7); ctx.shadowBlur = 0;
      }
      ctx.restore();
      if (state.cursor) {
        tip('σ ' + sgn(state.cursor.s) + '  ωd ' + state.cursor.w.toFixed(1), C.dim);
      } else if (!state.custom) {
        tip('click or drag to place a pole', C.faint);
      }
    }
    function tip(text, color) {
      ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      const w = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(13,17,23,0.82)'; ctx.fillRect(geo.L + 3, geo.T + 3, w + 10, 16);
      ctx.fillStyle = color; ctx.fillText(text, geo.L + 8, geo.T + 6);
    }
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(paint); } };

    function toData(e) {
      const rect = canvas.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
      const { xMax, yMax } = state.res.limits;
      return { s: (x - geo.L) / geo.pw * xMax - xMax, w: yMax - (y - geo.T) / geo.ph * 2 * yMax, x, y };
    }
    function place(e) {
      if (!state.res || state.res.error) return;
      const d = toData(e);
      if (d.x < geo.L || d.x > geo.L + geo.pw || d.y < geo.T || d.y > geo.T + geo.ph) return;
      state.custom = { sigma: Math.min(d.s, -0.5), omega: Math.max(Math.abs(d.w), 0.5) };
      updateRead(); paint();
    }

    canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); state.drag = true; place(e); });
    canvas.addEventListener('pointermove', (e) => { if (!state.res || state.res.error) return; state.cursor = toData(e); if (state.drag) place(e); schedule(); });
    canvas.addEventListener('pointerup', () => { state.drag = false; });
    canvas.addEventListener('pointerleave', () => { state.cursor = null; schedule(); });
    canvas.addEventListener('keydown', (e) => {
      const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!step || !state.res || state.res.error) return;
      e.preventDefault();
      const p = activePole() || { sigma: -10, omega: 10 };
      state.custom = { sigma: Math.min(p.sigma + step[0], -0.5), omega: Math.max(p.omega + step[1], 0.5) };
      updateRead(); paint();
    });

    card.querySelectorAll('input[type=range]').forEach((inp) => inp.addEventListener('input', () => {
      state[inp.dataset.k] = Number(inp.value); setLabels();
      if (!window.__toolRaf) window.__toolRaf = {};
      cancelAnimationFrame(window.__toolRaf[key]);
      window.__toolRaf[key] = requestAnimationFrame(compute);
    }));
    card.querySelector('.tool-best').addEventListener('click', () => { state.custom = null; updateRead(); paint(); });

    let rt = null;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!checkSide()) applyView(); }, 100); });

    setLabels();
    requestAnimationFrame(() => { checkSide(); layout(); compute(); });
  }

  document.querySelectorAll('.hero-tool[data-tool]').forEach((card) => build(card, card.dataset.tool));
})();
