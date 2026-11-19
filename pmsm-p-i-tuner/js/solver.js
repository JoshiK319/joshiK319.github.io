/* PMSM speed-loop P-I tuning (Kp, Ki) by pole placement.
 * Boundaries: Fp curve, damping lines, peak-time lines (wd = pi/tp). Works in the browser
 * (window.PMSM) and in Node (require). No dependencies. See the referenced paper for the theory. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PMSM = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DEFAULTS = {
    J: 1.15e-7,     // kg m^2
    B: 1.25e-8,     // N m s
    Kt: 0.0026,     // N m / A
    TL: 9.28e-3,    // N m (torque load)
    wrated: 60000,  // rpm
    Fp: 17,         // percent
    tp1: 0.04,      // s
    tp2: 0.06       // s
  };
  const ZETA_LINES = [0.7, 0.85];

  const fpFactor = (z) => Math.exp(-z * Math.acos(z) / Math.sqrt(1 - z * z));

  function validate(p) {
    for (const k of Object.keys(DEFAULTS)) {
      if (!Number.isFinite(p[k]) || p[k] <= 0) return 'Enter a positive number for every field.';
    }
    if (p.tp1 === p.tp2) return 'tp1 and tp2 must be different.';
    return null;
  }

  function fpCurve(c, n) {
    const sigma = [], wd = [];
    for (let i = 0; i < n; i++) {
      const z = i / (n - 1);
      const wn = fpFactor(z) / c;                       // NaN at z = 1, as in the script
      sigma.push(-z * wn); wd.push(wn * Math.sqrt(1 - z * z));
    }
    return { sigma, wd };
  }

  function gainsFromPole(sigma, omega, J, B, Kt) {
    return {
      Ki: J * (sigma * sigma + omega * omega) / Kt,
      Kp: -(2 * sigma * J - B) / Kt
    };
  }

  function analyze(p, opts) {
    const err = validate(p);
    if (err) return { error: err };
    const o = Object.assign({ grid: 600, pad: 1.15 }, opts);
    const { J, B, Kt, TL } = p;
    const c = J * p.wrated * (Math.PI / 30) * (p.Fp / 100) / TL;

    const fp = fpCurve(c, 1000);
    const tpLines = [p.tp1, p.tp2].map((tp) => ({ tp, wd: Math.PI / tp }));   // wd = pi / tp

    // Automatic axis limits
    let maxW = 0;
    for (const w of fp.wd) if (Number.isFinite(w)) maxW = Math.max(maxW, w);
    for (const t of tpLines) maxW = Math.max(maxW, t.wd);
    const yMax = o.pad * maxW;
    const zl = ZETA_LINES[0], zh = ZETA_LINES[1];
    const slopeHi = zh / Math.sqrt(1 - zh * zh);
    const wdTop = Math.PI / Math.min(p.tp1, p.tp2);
    let maxS = 0;
    for (const s of fp.sigma) if (Number.isFinite(s)) maxS = Math.max(maxS, -s);
    const xMax = o.pad * Math.max(maxS, slopeHi * wdTop);

    // Feasible region and best (largest-margin) pole on a grid
    const n = o.grid;
    const tlo = Math.min(p.tp1, p.tp2), thi = Math.max(p.tp1, p.tp2);
    const mask = new Uint8Array(n * n);                      // row 0 = top (wd = yMax)
    let best = -Infinity, bi = -1, bjj = -1;
    for (let j = 0; j < n; j++) {
      const W = yMax - (yMax - 0.5) * j / (n - 1);
      const T = Math.PI / W;                                 // peak time of a P-I pole
      for (let i = 0; i < n; i++) {
        const S = -xMax + (xMax - 0.5) * i / (n - 1);
        const wn = Math.hypot(S, W), z = -S / wn;
        const fpm = (wn - fpFactor(z) / c) / wn;
        const m = Math.min((z - zl) / (zh - zl), (zh - z) / (zh - zl), fpm,
                           (T - tlo) / (thi - tlo), (thi - T) / (thi - tlo));
        if (m > 0) {
          mask[j * n + i] = 1;
          if (m > best) { best = m; bi = i; bjj = j; }
        }
      }
    }

    let pole = null, gains = null;
    if (bi >= 0) {
      const sigma = -xMax + (xMax - 0.5) * bi / (n - 1);
      const omega = yMax - (yMax - 0.5) * bjj / (n - 1);
      const wn = Math.hypot(sigma, omega);
      pole = { sigma, omega, wn, zeta: -sigma / wn };
      gains = gainsFromPole(sigma, omega, J, B, Kt);
    }

    return {
      error: null, params: p, limits: { xMax, yMax },
      curves: { fp, tp: tpLines },
      zetaLines: ZETA_LINES.map((z) => ({ zeta: z, slope: z / Math.sqrt(1 - z * z) })),
      region: { n, mask }, pole, gains
    };
  }

  // ---- time response: rated-speed step at t = 0, load-torque step once the speed has settled ----
  // Linear plant J dw/dt = Kt*iq - B*w - TL (current loop taken as ideal), integrated with RK4.
  // structure 'PI':  iq = Kp*e + Ki*x      'P-I':  iq = Ki*x - Kp*w      (x' = e = w_ref - w)
  function simulate(p, gains, structure, opts) {
    const { J, B, Kt, TL } = p, Kp = gains.Kp, Ki = gains.Ki;
    const W = p.wrated * Math.PI / 30;
    const sg = (opts && Number.isFinite(opts.sigma) && opts.sigma < 0) ? -opts.sigma : 30;
    const tl = Math.min(3, Math.max(0.25, Math.ceil(6 / sg / 0.05) * 0.05));   // load step after settling
    const T = tl + Math.max(0.15, Math.min(1.5, 6 / sg));
    const N = 20000, dt = T / N, stride = 40;
    const pi = structure !== 'P-I';
    const f = (w, x, tq, out) => {
      const e = W - w, iq = pi ? Kp * e + Ki * x : Ki * x - Kp * w;
      out[0] = (Kt * iq - B * w - tq) / J; out[1] = e;
    };
    const k1 = [0, 0], k2 = [0, 0], k3 = [0, 0], k4 = [0, 0];
    let w = 0, x = 0;
    const t = [0], rpm = [0], c = 30 / Math.PI;
    let pk = { t: 0, rpm: 0 }, dip = { t: tl, rpm: Infinity };
    for (let n = 0; n < N; n++) {
      const tc = n * dt, tq = tc >= tl ? TL : 0;
      f(w, x, tq, k1); f(w + dt / 2 * k1[0], x + dt / 2 * k1[1], tq, k2);
      f(w + dt / 2 * k2[0], x + dt / 2 * k2[1], tq, k3); f(w + dt * k3[0], x + dt * k3[1], tq, k4);
      w += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
      x += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      const tn = (n + 1) * dt, r = w * c;
      if (tn < tl) { if (r > pk.rpm) pk = { t: tn, rpm: r }; }
      else if (r < dip.rpm) dip = { t: tn, rpm: r };
      if ((n + 1) % stride === 0) { t.push(tn); rpm.push(r); }
    }
    const rated = p.wrated;
    return {
      t, rpm, tl, T, rated, peak: pk, dip,
      tp: pk.t, Mp: Math.max(0, (pk.rpm - rated) / rated * 100), Fp: Math.max(0, (rated - dip.rpm) / rated * 100)
    };
  }

  return { DEFAULTS, ZETA_LINES, validate, analyze, gainsFromPole, simulate };
});
