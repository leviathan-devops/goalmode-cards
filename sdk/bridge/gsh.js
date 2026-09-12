// gsh.js — the Goal Shell bridge library: shell mechanics as callable
// objects over the /goal substrate. Every construct returns/forwards the
// typed token {ok:bool,...} — the kernel's only success vocabulary.
// Deterministic: no Date/crypto/fetch/process (workflows.md:78 law).

export const env = {};                       // export/import store ($ENV)
export const route = { table: {} };          // trap table (§6)

export function exit(ok, extra = {}) {       // exit code as data
  return ok ? { ok: true, ...extra } : { ok: false, ...extra };
}
export function exportVar(k, v) { env[k] = v; return env[k]; } // export VAR=v

// seq a; b            — shell `a; b`: b runs UNCONDITIONALLY; result is b's
export function seq(a, b) {
  return async () => { await a(); return b(); };
}
// and a && b          — b skipped when a fails (short-circuit law)
export function and(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? r : b(); };
}
// or a || b           — b tried only after a fails
export function or(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? b() : r; };
}
// run cmd --expect S  — cmd+expect gate; mismatch is a fail, not a throw
export function run(cmd, { expect } = {}) {
  return async () => {
    const out = typeof cmd === 'function' ? await cmd() : cmd;
    const text = typeof out === 'string' ? out : JSON.stringify(out);
    const ok = expect ? text.includes(expect) : true;
    return exit(ok, { evidence: text });
  };
}
// pipe a | b          — dataflow: a's result is b's argument
export function pipe(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? r : b(r); };
}
// jobs ( a & b & c ) wait — parallel barrier; failures collected
export async function jobs(thunks) {
  const settled = await Promise.allSettled(thunks.map(t => t()));
  const results = settled.map(s => s.status === 'fulfilled' ? s.value : exit(false, { evidence: s.reason?.message || 'rejected' }));
  const failed = results.filter(r => !r || r.ok === false);
  return { ok: failed.length === 0, failed, results };
}
// trap SIG -> ROUTE   — register; match(sig) resolves the route name
export function trap(signature, routeName) { route.table[signature] = routeName; }
route.match = (sig) => route.table[sig] || null;

// until GATE k        — re-run the gate at most k beats; cap respected
export async function until(slot, k) {
  let r = exit(false);
  for (let i = 0; i < k; i++) { r = await slot(); if (r && r.ok !== false) return r; }
  return r;
}
export { exportVar as export };
export default { exit, seq, and, or, run, pipe, jobs, trap, until, env, route, export: exportVar };
