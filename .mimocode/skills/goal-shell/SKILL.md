---
name: goal-shell
description: Use when programming the /goal substrate with shell semantics — the Goal Shell doctrine where /goal is a process kernel (judge-gated halt = exit), cards are shell scripts, JS workflows are binaries, compose functions are libc calls, /loop is cron, and stuck-signatures route like signals/traps. Covers the gsh.js construct library and the spec-prose to GSH to card translation protocol.
---

# Goal Shell Programming

## The Kernel Law

`/goal` is a process kernel: a judge-gated halt is an `exit()` the kernel
refuses until the program's contract (§0) verifies. Cards are shell
scripts; workflows are binaries; compose functions are libc; `/loop` is
cron; stuck-signatures are signals and §6 routes are traps.

## Boot Law

At session start under a pinned goal: run the skill-match check BEFORE
any action (using-superpowers discipline), reload the pinned card, and
re-enter at the last incomplete phase. Clearance never survives
compaction.

## The Construct Library

Import `sdk/bridge/gsh.js` inside any gm-*.js workflow: `exit(ok)`,
`seq`, `and` (short-circuit), `or` (fallback), `run(cmd,{expect})`,
`pipe` (dataflow), `jobs` (parallel barrier), `trap(sig,route)` +
`route.match`, `until(slot,k)` (cap respected), `export/import` env.
Every construct speaks the typed token `{ok:bool}` — never exceptions.

## Translation Protocol

1. PROSE: requirements in natural language.
2. GSH: translate into shell grammar (PIN/SPEC/PHASE/TDD/RUN/PANEL/
   ON STUCK/SHIP/EXIT) — see `sdk/bridge/GSH_SPEC.md`.
3. CARD: gm-compile fills the master template; validate + smoke; pin.

## Determinism Law

No Date/crypto/fetch/process in orchestration code — such work belongs
inside `agent()` (a real subagent). The sandbox strips them so runs
replay identically; the anti-cheat layer depends on it.
