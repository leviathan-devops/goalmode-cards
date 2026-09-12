#!/usr/bin/env node
// bridge-tests.mjs — battery for the gsh.js shell-construct library.
// Pins LAWS: gate polarity, pipe dataflow, jobs barrier, trap routing,
// until cap, exit tokens. Runner: exit 1 on any FAIL.
import { strict as A } from 'node:assert';

let gsh;
try { gsh = await import('../../sdk/bridge/gsh.js'); }
catch (e) { console.log(`RED: gsh.js not importable: ${e.message}`); process.exit(1); }

const rows = [];
async function T(name, fn) {
  try { await fn(); rows.push(['PASS', name]); }
  catch (e) { rows.push(['FAIL', `${name} :: ${e.message}`]); }
}

// LAW: exit tokens are typed — ok true/false, never undefined
await T('exit tokens typed', () => {
  A.deepEqual(gsh.exit(true), { ok: true });
  A.deepEqual(gsh.exit(false), { ok: false });
});
// LAW: seq runs in order, later sees earlier's effect
// LAW: seq runs b UNCONDITIONALLY after a (shell `a; b`), returns b's result
await T('seq runs b always', async () => { await gsh.seq(async () => gsh.exit(false), async () => gsh.exit(true, { evidence: 'b-ran' }))(); });
await T('seq returns b result', async () => { const r = await gsh.seq(async () => gsh.exit(false), async () => gsh.exit(true, { evidence: 'b' }))(); A.equal(r.evidence, 'b'); });
await T('seq order kept', async () => { await gsh.seq(async () => { gsh.env.x = 1; }, async () => { gsh.env.y = gsh.env.x + 1; })(); A.equal(gsh.env.y, 2); });
// LAW: and() short-circuits — second slot skipped on first fail
await T('and short-circuit', async () => {
  let ran = false; const second = async () => { ran = true; return gsh.exit(true); };
  const r = await gsh.and(async () => gsh.exit(false), second)();
  A.equal(r.ok, false); A.equal(ran, false);
});
// LAW: or() tries second only after first fails
await T('or fallback', async () => {
  const r = await gsh.or(async () => gsh.exit(false), async () => gsh.exit(true))();
  A.equal(r.ok, true);
});
// LAW: run() = cmd+expect gate — mismatch is a fail, not a throw
await T('run gate polarity', async () => {
  const ok = await gsh.run(() => 'N pass, 0 fail', { expect: '0 fail' })();
  const bad = await gsh.run(() => '1 fail', { expect: '0 fail' })();
  A.equal(ok.ok, true); A.equal(bad.ok, false);
});
// LAW: pipe() carries dataflow — output of a is args of b
await T('pipe dataflow', async () => {
  const r = await gsh.pipe(async () => ({ ok: true, n: 2 }), async (a) => ({ ok: true, n: a.n * 3 }))();
  A.equal(r.n, 6);
});
// LAW: jobs() = parallel barrier — all results collected, one fail surfaces
await T('jobs barrier', async () => {
  const r = await gsh.jobs([async () => gsh.exit(true), async () => gsh.exit(false), async () => gsh.exit(true)]);
  A.equal(r.failed.length, 1);
});
// LAW: trap(signature, route) registers; match(sig) returns the route
await T('trap routing', () => {
  gsh.trap('no-progress', 'ROUTE_DEBUG');
  gsh.trap('same-fail', 'ROUTE_SPLIT');
  A.equal(gsh.route.match('no-progress'), 'ROUTE_DEBUG');
  A.equal(gsh.route.match('same-fail'), 'ROUTE_SPLIT');
});
// LAW: until(gate,k) re-runs at most k beats — cap respected
await T('until cap', async () => {
  let n = 0;
  const r = await gsh.until(async () => { n++; return gsh.exit(false); }, 3);
  A.equal(n, 3); A.equal(r.ok, false);
});
// LAW: export/import = env store shared across slots
await T('env store', () => { gsh.export('target', 'tetris'); A.equal(gsh.env.target, 'tetris'); });

let fail = 0;
for (const [s, n] of rows) { console.log(`${s} ${n}`); if (s === 'FAIL') fail++; }
console.log(`\nBRIDGE BATTERY: ${rows.length - fail}/${rows.length} PASS`);
process.exitCode = fail ? 1 : 0;  // exit AFTER microtasks drain (C1 fix: no premature kill)
