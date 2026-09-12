---
name: goalmode-card
description: Use when forking, filling, validating, or pinning a Goalmode Card — the forkable program document executed by a /goal kernel. Covers card anatomy (frontmatter, §0 goal contract, §1 phase graph, §2 JS workflow slots, §3 compose function slots, §4 review panels, §5 ship gates, §6 recovery routing), the GSH shell grammar translation, and the mechanical-gates discipline.
---

# Goalmode Card Operations

## The Law

A card is a PROGRAM, not a document. §0 commands are the kernel's only halt
vocabulary — every line is `cmd:` + `expect:`, never prose. `EXIT 0`
(GOAL COMPLETE) is kernel-owned: the card cannot script its own release.

## Fork and Fill (order forced by dependency)

1. Fork a master from `cards/masters/` — record `forked-from:` in frontmatter.
2. Fill §0 FIRST (phases need exit gates), then §2/§3 slots, then §1
   phase graph referencing them, then §6 routing BEFORE first run.
3. Every §2 slot names its JS card under `.mimocode/workflows/`; every §3
   slot names its compose-function card (`compose:tdd`, `compose-next`).
4. Validate: `node deploy/battery/validate-cards.mjs cards/` — PASS or fix.
5. Smoke: `workflow run gm-smoke` — `{ok:true}` or fix before pinning.

## GSH Shell Grammar

Cards may be authored as GSH scripts and compiled: PIN → §0 nl_prompt,
PHASE n → §1 rows, RUN → §2 slots, TDD → §3 slots, PANEL → §4,
ON STUCK → §6 traps, SHIP → §5, EXIT → kernel-owned. See
`sdk/bridge/GSH_SPEC.md` and `sdk/bridge/translate.md`.

## Anti-Cheat

Conditions are commands; schema-nulls fail; the sandbox replays
identically. A card whose §0 contains prose instead of cmd/expect pairs
is INVALID — the validator rejects it.
