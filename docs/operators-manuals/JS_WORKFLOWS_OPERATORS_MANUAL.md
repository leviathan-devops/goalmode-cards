# JS WORKFLOWS — OPERATORS MANUAL
What this is: operating manual for the deterministic binaries a card mounts in §2. Companion: sdk/bridge/gsh.js, GSH_SPEC.md, machinery/run-smoke.mjs.

1. FORMAT. .mimocode/workflows/<file>.js; identity = meta.name inside ([A-Za-z0-9._-]+); meta: name, description, phases[], permissions[] (asked once up-front; denial does not abort).
2. SIGNATURE. export default async function (g = globalThis) { const { phase, log, glob, readFile } = g; ... } — bare globals in the substrate runtime, injectable under node (the seam; machinery/run-smoke.mjs is the reference harness).
3. CONSTRUCTS. Import sdk/bridge/gsh.js: exit(ok) tokens; seq/and/or control; run(cmd,{expect}) gates; pipe dataflow; jobs barrier; trap/route; until cap. Never throw across a slot — return tokens.
4. DETERMINISM. No Date/crypto/fetch/timers/process in orchestration; such work goes inside agent() (a real subagent). The sandbox strips them so runs replay identically.
5. IO. File ops jailed to the workspace root; ../ escapes throw; enumerate with glob(), not agents.
6. AGENTS. agent(prompt,{schema}) → validated object | null (failure/timeout — never throw). parallel for disjoint units; pipeline for stages; workflow() for nesting (maxDepth 8; cycles throw).
7. GATE. Return {ok:true, evidence} | {ok:false, failed}. A binary the smoke cannot gate is a binary the kernel cannot trust.
8. TEST. node deploy/battery/bridge-tests.mjs (library laws 10/10); per-binary: node machinery/run-smoke.mjs . (or your own harness on the seam pattern).
9. SHIP. Binaries ride DEPLOY.sh into any target; deploy-proof.mjs proves the clean-target install + in-target smoke.
10. CEILINGS. maxConcurrentAgents min(16,2xCores); maxLifecycleAgents 1000; scriptDeadlineMs 12h — split long work across phases, not depth.
Golden rule: a workflow is a shell binary — single purpose, typed exit, replayable. If it needs a mood to work, it is not done.
