/* PMSM speed-loop PI tuning (Kp, Ki) by pole placement.
 * Boundaries: Fp curve, damping lines, peak-time curves. Works in the browser (window.PMSM)
 * and in Node (require). No dependencies. See the referenced paper for the theory. */
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

  // ---- peak-time curve (a): sweep over zeta, solve for wn -------------------------------
  function sweepResidual(w, z, k, tp, bj) {
    const wd = Math.abs(w) * k;
    const a = (z * w - bj) / wd;
    const num = -z * w - a;
    const den = -z * w * a + wd;
    return Math.atan(num / den) / wd - tp;
  }

  function tpCurveZeta(tp, bj, n) {
    const NG = 800;
    const grid = new Float64Array(NG);
    const l0 = Math.log(0.8 / tp), l1 = Math.log(20 / tp);
    for (let i = 0; i < NG; i++) grid[i] = Math.exp(l0 + (l1 - l0) * i / (NG - 1));
    const sigma = [], wd = [];
    const v = new Float64Array(NG);
    for (let q = 0; q < n; q++) {
      const z = 0.01 + (0.999 - 0.01) * q / (n - 1);
      const k = Math.sqrt(1 - z * z);
      for (let i = 0; i < NG; i++) v[i] = sweepResidual(grid[i], z, k, tp, bj);
      for (let i = NG - 2; i >= 0; i--) {              // largest root first
        if (!(v[i] * v[i + 1] < 0)) continue;
        let lo = grid[i], hi = grid[i + 1], flo = v[i];
        for (let it = 0; it < 70; it++) {
          const mid = 0.5 * (lo + hi), fm = sweepResidual(mid, z, k, tp, bj);
          if (fm * flo <= 0) hi = mid; else { lo = mid; flo = fm; }
        }
        const w = 0.5 * (lo + hi);
        if (Math.abs(sweepResidual(w, z, k, tp, bj)) < 1e-8) {   // reject atan jumps
          sigma.push(-z * w); wd.push(w * k);
          break;
        }
      }
    }
    return { sigma, wd };
  }

  // ---- peak-time curve (b): fold point, then upper branch ---------------------------------
  const foldF = (s, w, tp, bj) =>
    (1 / w) * (Math.PI + Math.atan2(s * w + s + bj, w * w - s * s - s * bj)) - tp;

  function findFold(tp, bj, x0) {
    const h = 1e-6;
    const F = (s, w) => [
      foldF(s, w, tp, bj),
      (foldF(s, w + h, tp, bj) - foldF(s, w - h, tp, bj)) / (2 * h)
    ];
    const norm = (f) => Math.hypot(f[0] / tp, f[1] * 1e3);
    let s = x0[0], w = x0[1], f = F(s, w);
    for (let it = 0; it < 200; it++) {
      if (Math.abs(f[0]) < 1e-12 && Math.abs(f[1]) < 1e-9) break;
      const ds = 1e-4 * Math.max(1, Math.abs(s)), dw = 1e-4 * Math.max(1, Math.abs(w));
      const fs = F(s + ds, w), fw = F(s, w + dw);
      const a = (fs[0] - f[0]) / ds, b = (fw[0] - f[0]) / dw;
      const c = (fs[1] - f[1]) / ds, d = (fw[1] - f[1]) / dw;
      const det = a * d - b * c;
      if (!isFinite(det) || det === 0) return null;
      let step = [(d * f[0] - b * f[1]) / det, (-c * f[0] + a * f[1]) / det];
      let t = 1, moved = false;
      for (let ls = 0; ls < 30; ls++) {
        const sn = s - t * step[0], wn = w - t * step[1];
        if (wn > 0) {
          const fn = F(sn, wn);
          if (isFinite(fn[0]) && isFinite(fn[1]) && norm(fn) < norm(f)) { s = sn; w = wn; f = fn; moved = true; break; }
        }
        t *= 0.5;
      }
      if (!moved) break;
    }
    if (!(Math.abs(f[0]) < 1e-8 && Math.abs(f[1]) < 1e-5) || !(s < 0) || !(w > 0)) return null;
    return [s, w];
  }

  function tpCurveFold(tp, bj, n) {
    const fold = findFold(tp, bj, [-1.6 / tp, 1.84 / tp]);
    const sigma = [], wd = [];
    if (!fold) return { sigma, wd, fold: null };
    const hi0 = 2 * Math.PI / tp;
    for (let k = 0; k < n; k++) {
      const s = (fold[0] + 1e-3) + (-1 - (fold[0] + 1e-3)) * k / (n - 1);
      let lo = fold[1], hi = hi0, flo = foldF(s, lo, tp, bj);
      if (!(flo * foldF(s, hi, tp, bj) <= 0)) { sigma.push(NaN); wd.push(NaN); continue; }
      for (let it = 0; it < 80; it++) {
        const mid = 0.5 * (lo + hi), fm = foldF(s, mid, tp, bj);
        if (fm * flo <= 0) hi = mid; else { lo = mid; flo = fm; }
      }
      sigma.push(s); wd.push(0.5 * (lo + hi));
    }
    return { sigma, wd, fold };
  }

  function fpCurve(c, n) {
    const sigma = [], wd = [];
    for (let i = 0; i < n; i++) {
      const z = i / (n - 1);
      const wn = Math.exp(-z * Math.acos(z) / Math.sqrt(1 - z * z)) / c;   // NaN at z = 1, as in the script
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
    const o = Object.assign({ grid: 600, curvePts: 400, pad: 1.15, xCap: 2 }, opts);
    const { J, B, Kt, TL } = p;
    const bj = B / J;
    const c = J * p.wrated * (Math.PI / 30) * (p.Fp / 100) / TL;

    const fp = fpCurve(c, 1000);
    const tpCurves = [p.tp1, p.tp2].map((tp) => ({
      tp, sweep: tpCurveZeta(tp, bj, 600), fold: tpCurveFold(tp, bj, o.curvePts)
    }));

    // Automatic axis limits
    let maxS = 0, maxW = 0;
    const scan = (cv) => {
      for (let i = 0; i < cv.sigma.length; i++) {
        if (Number.isFinite(cv.sigma[i])) maxS = Math.max(maxS, -cv.sigma[i]);
        if (Number.isFinite(cv.wd[i])) maxW = Math.max(maxW, cv.wd[i]);
      }
    };
    scan(fp); tpCurves.forEach((t) => { scan(t.sweep); scan(t.fold); });
    const zl = ZETA_LINES[0], zh = ZETA_LINES[1];
    const yMax = o.pad * maxW;
    const slope = zl / Math.sqrt(1 - zl * zl);
    const xMax = Math.max(o.pad * maxS, Math.min(slope * yMax, o.xCap * yMax));

    // Feasible region and best (largest-margin) pole on a grid
    const n = o.grid;
    const tlo = Math.min(p.tp1, p.tp2), thi = Math.max(p.tp1, p.tp2);
    const mask = new Uint8Array(n * n);                      // row 0 = top (wd = yMax)
    let best = -Infinity, bi = -1, bjj = -1;
    for (let j = 0; j < n; j++) {
      const W = yMax - (yMax - 0.5) * j / (n - 1);
      for (let i = 0; i < n; i++) {
        const S = -xMax + (xMax - 0.5) * i / (n - 1);
        const wn = Math.hypot(S, W), z = -S / wn;
        const a = (-S - bj) / W;
        const T = Math.atan((S - a) / (S * a + W)) / W;
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
      curves: { fp, tp: tpCurves },
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
