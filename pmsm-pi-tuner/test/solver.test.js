// Run with: node test/solver.test.js
const assert = require('assert');
const P = require('../js/solver.js');
const close = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

const r = P.analyze(P.DEFAULTS);
assert(!r.error && r.pole, 'expected a feasible pole');

// Fold (merge) points of the two peak-time curves
const [c1, c2] = r.curves.tp;
close(c1.fold.fold[0], -40.018, 0.01, 'fold sigma tp=0.04'); close(c1.fold.fold[1], 46.001, 0.01, 'fold wd tp=0.04');
close(c2.fold.fold[0], -26.656, 0.01, 'fold sigma tp=0.06'); close(c2.fold.fold[1], 30.505, 0.01, 'fold wd tp=0.06');

// Selected pole and gains for the default inputs
close(r.pole.sigma, -33.75, 0.4, 'pole sigma'); close(r.pole.omega, 30.67, 0.4, 'pole omega');
const g = P.gainsFromPole(-33.75, 30.665, P.DEFAULTS.J, P.DEFAULTS.B, P.DEFAULTS.Kt);
close(g.Kp, 0.0029904, 1e-6, 'Kp'); close(g.Ki, 0.091974, 1e-5, 'Ki');
assert(r.pole.zeta > 0.7 && r.pole.zeta < 0.85, 'zeta band');

// Other tp pairs still converge
for (const [a, b] of [[0.05, 0.06], [0.03, 0.05], [0.04, 0.08]]) {
  const q = P.analyze(Object.assign({}, P.DEFAULTS, { tp1: a, tp2: b }));
  assert(!q.error && q.curves.tp.every((t) => t.fold.fold), `fold for tp ${a}/${b}`);
}

// Validation
assert(P.analyze(Object.assign({}, P.DEFAULTS, { tp1: 0.05, tp2: 0.05 })).error, 'equal tp rejected');
assert(P.analyze(Object.assign({}, P.DEFAULTS, { J: -1 })).error, 'negative J rejected');

// Time response at the default pole (checked against an independent Python/SciPy integration)
{
  const m = P.simulate(P.DEFAULTS, r.gains, 'PI', { sigma: r.pole.sigma });
  close(m.tp, 0.0481, 5e-4, 'PI tp'); close(m.Mp, 19.59, 0.1, 'PI overshoot'); close(m.Fp, 12.48, 0.1, 'PI Fp');
  assert(m.Fp < P.DEFAULTS.Fp, 'simulated Fp inside the design limit');
  assert(m.tp >= P.DEFAULTS.tp1 && m.tp <= P.DEFAULTS.tp2, 'simulated tp inside the band');
}

console.log('All tests passed. Default pole: %s + j%s, Kp=%s, Ki=%s',
  r.pole.sigma.toFixed(2), r.pole.omega.toFixed(2), r.gains.Kp.toPrecision(4), r.gains.Ki.toPrecision(4));
