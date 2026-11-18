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

  return { DEFAULTS, ZETA_LINES, validate, analyze, gainsFromPole };
});
