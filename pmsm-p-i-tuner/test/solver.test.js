// Run with: node test/solver.test.js
const assert = require('assert');
const P = require('../js/solver.js');
const close = (a, b, tol, msg) => assert(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

const r = P.analyze(P.DEFAULTS);
assert(!r.error && r.pole, 'expected a feasible pole');

// Fp constant: 0.0125 (the value in the original script) corresponds to a 9.83 mNm load torque
const d = P.DEFAULTS;
close(d.J * d.wrated * Math.PI / 30 * (d.Fp / 100) / 9.83e-3, 0.0125, 1e-5, 'Fp constant');

// Peak-time lines are horizontal at wd = pi/tp
close(r.curves.tp[0].wd, Math.PI / 0.04, 1e-9, 'tp1 line'); close(r.curves.tp[1].wd, Math.PI / 0.06, 1e-9, 'tp2 line');

// Selected pole lies inside every boundary
const { pole } = r;
assert(pole.omega >= Math.PI / 0.06 && pole.omega <= Math.PI / 0.04, 'tp band');
assert(pole.zeta >= 0.7 && pole.zeta <= 0.85, 'zeta band');

// Gains for the P-I pole quoted in the paper, -49 +/- j78
const g = P.gainsFromPole(-49, 78, d.J, d.B, 0.00264);
close(g.Kp, 0.0043, 5e-5, 'Kp(-49,78)'); close(g.Ki, 0.3696, 5e-4, 'Ki(-49,78)');

assert(P.analyze(Object.assign({}, d, { tp1: 0.05, tp2: 0.05 })).error, 'equal tp rejected');
assert(P.analyze(Object.assign({}, d, { J: -1 })).error, 'negative J rejected');
// Time response at the default pole (checked against an independent Python integration)
{
  const m = P.simulate(d, r.gains, 'P-I', { sigma: pole.sigma });
  close(m.tp, 0.0501, 5e-4, 'P-I tp'); close(m.Mp, 2.09, 0.1, 'P-I overshoot'); close(m.Fp, 5.57, 0.1, 'P-I Fp');
  assert(m.tp >= d.tp1 && m.tp <= d.tp2, 'simulated tp inside the band');
}

console.log('All tests passed. Default pole: %s + j%s, Kp=%s, Ki=%s',
  pole.sigma.toFixed(2), pole.omega.toFixed(2), r.gains.Kp.toPrecision(4), r.gains.Ki.toPrecision(4));
