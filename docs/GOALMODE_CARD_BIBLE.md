# KNOWLEDGE BIBLE: GOALMODE CARDS (GM CARD ARCHITECTURE)
Version: v0.9-seed (verbatim head preserved 2026-09-10 per operator order; grown to 3000+ floor by GOAL_BUILD_v1)
Scope: Goalmode Card infrastructure — /goal shell runtime, nested loop execution, JS workflow slots, compose function slots, v2 routing
Effective date: 2026-09-10
Series baseline: master @ 9cdf2ef8
Companion artifacts: docs/compose/specs/2026-09-10-goalmode-cards-design.md · Goalmode_Cards/templates/* · Goalmode_Cards/GOAL_BUILD_v1.md

> PROVENANCE: The sections immediately below are chat-delivered artifacts preserved VERBATIM per the operator's order (2026-09-10): the architecture diagram pasted at the beginning as the exact architecture of a GM Card, the verbatim pseudocode (v1) directly underneath it, and all schema blueprints appended. Zero paraphrase, zero reflow. The 11-section bible skeleton follows with BB-CHUNK anchors for the production build to fill.

---

## THE ARCHITECTURE OF A GM CARD (2026-09-10, preserved verbatim per the operator order)

A **Card is a forkable program document**. Three execution tiers nest inside it:

```
┌─ /goal SHELL ── judge: outer conditions met? ─┐
│ no ─► continue ─────────────────────────────── │
│                                               │
│ ┌ MACRO LOOP (compose: NL-scripted) ────────┐ │
│ │ ┌ MICRO LOOP (js workflow: code) ───────┐ │ │
│ │ │ agent()×parallel() schema-gated       │ │ │
│ │ └───────────────┬───────────────────────┘ │ │
│ └────────────────┼─────────────────────────┘ │
│                  ▼ mechanical gates PASS      │
│  adversarial review panel (scripted)          │
│  script tests + container tests (workflows)   │
│  audit judge panel on testing data            │
│  /ship-package + /engineering-report          │
│  final macro-verification panel               │
└─ yes ──► GOAL COMPLETE ───────────────────────┘
```

**Anti-cheat property — where it actually comes from:** three mechanical layers, no vibes: (1) the judge only releases on the card's §0 conditions written as *commands with expected outputs*; (2) JS workflow slots return `schema`-validated objects — `null` = fail, loop continues; (3) the sandbox is deterministic — a claimed pass replays identically. "Cannot be terminated or cheated" = **conditions are commands, not prose.**

**Card anatomy (7 sections):** frontmatter (machine contract) → §0 Goal Contract → §1 Phase Graph → §2 JS Workflow Slots → §3 Compose Function Slots → §4 Review Panels → §5 Ship Gates → §6 Recovery/Routing (v2).

---

## WHAT HAPPENS INSIDE THE GOALMODE CARD — verbatim pseudocode (v1) (2026-09-10, preserved verbatim per the operator order)

The operator's macro process, formalized exactly as specified:

```
/goal <OUTER-LOOP MACRO SUCCESS CONDITIONS
       + NL PROMPT
       + DETAILED SUCCESS CRITERIA>          # the SHELL (judge-gated)

[Inner Macro Build Loop(s) N]                # per phase in card §1
  - Compose Workflows                        # NL-scripted phases
    - [Inner Micro Loops]                    # tdd: red→green→refactor
  - JS Workflows                             # deterministic code
    - [Inner Micro Loops]                    # agent() iterations,
                                             # schema-gated returns
  gate: MECHANICAL SUCCESS CONDITIONS MET?   # commands + expected out
        no  -> retry | route (v2) | block    # loop cannot exit early
        yes -> next macro loop

(Mechanical Success Conditions Met)          # all macros gated

[Workflow Scripted Adversarial Agent Review Panel]   # parallel()
                                             # hostile reviewers w/
                                             # schema verdicts

[Script Testing Workflows]                   # runtime proof scripts
[Container Testing Workflows]                # isolated env proof

[Embedded Adversarial Audit Workflow Judge Panel on Testing Data]
                                             # 3-juror pattern
                                             # (fact-check lineage)

/ship-package workflow                       # SPG v4 native assembly
+ /engineering-report                        # evidence report

[Final Macro-Verification Panel]             # re-runs §0 commands cold

GOAL COMPLETE                                # judge releases halt
```

---

## THE v2 ROUTING OVERLAY (2026-09-10, preserved verbatim per the operator order)

Error handling + problem solving + routing where agents get stuck or struggle to complete tasks:

```
 stuck-signature detected (per macro loop)
   no progress K iterations | same failure 2x
   | agent() nulls > threshold | phase deadline
        ▼
┌ ROUTING TABLE (card §6) ──────────────┐
│ ROUTE_DEBUG    -> compose:debug RCA   │
│ ROUTE_DERIVE   -> problem-solving     │
│ ROUTE_SPLIT    -> decompose the task  │
│ ROUTE_SWITCH   -> model/tier change   │
│ ROUTE_RECOVER  -> checkpoint re-entry │
│ ROUTE_ESCALATE -> operator ask (only  │
│                   after N route fails)│
└───────────────────────────────────────┘
 routes are tried in card order; every
 route logs to the run journal; escalate
 is LAST, never first
```

---

## THE SCHEMA BLUEPRINTS (2026-09-10, preserved verbatim per the operator order — the four master templates)

### Blueprint 1 — GOALMODE_CARD_MASTER_v1

```markdown
---
card: goalmode-v1
id: [FILL]            # unique card id
version: 1
forked-from: GOALMODE_CARD_MASTER_v1
mode: build           # agent mode this card runs under
baseline: [FILL branch @ commit]
workflows: [FILL .mimocode/workflows paths this card owns]
---
# [FILL CARD NAME]

## §0 GOAL CONTRACT (judge reads THIS — commands, not prose)
outer_success:                          # EVERY line = command + expected
  - cmd: "[FILL e.g. bun test tests/]"  #   output. The judge re-runs
    expect: "[FILL e.g. N pass 0 fail]" #   these cold at every gate
  - cmd: "[FILL ls/wc -l/grep gate]"    #   and before halt release.
    expect: "[FILL]"
nl_prompt: "[FILL 1-3 sentences WHAT — never HOW]"
success_criteria:                       # detailed, checkable
  - "[FILL each criterion maps to a §0 cmd]"
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.

## §1 PHASE GRAPH
| # | phase | engine | slot | entry | exit |
|---|-------|--------|------|-------|------|
| 1 | [FILL] | compose | §3.[FILL] | [FILL] | [FILL cmd] |
| 2 | [FILL] | js | §2.[FILL] | [FILL] | [FILL cmd] |
# order = execution order; exit = mechanical gate per phase

## §2 JS WORKFLOW SLOTS                  # each -> JS_WORKFLOW_CARD fork
- slot: [FILL name]  card: [FILL path]  args: [FILL JSON]
  fail_route: retry(2) -> §6.[FILL route]

## §3 COMPOSE FUNCTION SLOTS             # tdd / next (~ NOT all)
- slot: [FILL name]  card: [FILL path]  trigger: [FILL]
  micro_loop: [FILL e.g. red->green->refactor]

## §4 REVIEW PANELS
- adversarial_panel: parallel() of [FILL N] hostile reviewers,
  schema: {verdict: PASS|FAIL, findings[]}, FAIL -> fix loop
- audit_judge_panel: 3-juror on testing data, majority verdict
- final_verification: re-run §0 cold, no cached results

## §5 SHIP GATES
- ship: /ship-package (SPG v4 phases A-I)
- report: /engineering-report -> reports/{SERIES}_v{N}.md

## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: [FILL: no-progress K, same-fail 2x, null-rate]
- routes (in order): [FILL ROUTE_DEBUG | ROUTE_DERIVE | ROUTE_SPLIT
  | ROUTE_SWITCH | ROUTE_RECOVER | ROUTE_ESCALATE-last]
- compaction: card path + phase# re-enter on rebuild; reload card
  before continuing
```

### Blueprint 2 — JS_WORKFLOW_CARD_MASTER_v1

```markdown
---
card: js-workflow-v1
id: [FILL]
slot_in: "[FILL parent Goalmode Card §2 slot]"
meta:                      # verbatim workflows.md contract
  name: "[FILL A-Za-z0-9._-]"
  description: "[FILL]"
  phases: [{title: "[FILL]"}]
  permissions: [{permission: bash, patterns: ["[FILL]"], reason: "[FILL]"}]
---
export default async function () {
  phase("[FILL]")
  const units = await glob("[FILL pattern]")       // enumerate, don't spawn
  const results = await parallel(units.map(u => () =>
    agent("[FILL distilled brief for u]", {
      agentType: "[FILL general|explore]",
      schema: {                                    // typed gate = the point
        type: "object",
        properties: { ok: {type:"boolean"},
                      evidence: {type:"string"} },
        required: ["ok","evidence"] } })))
  const failed = results.filter(r => r === null || !r.ok)
  phase("gate")
  if (failed.length) { log(`${failed.length} units failed`) ; return {ok:false,failed} }
  return {ok:true, evidence: results.map(r=>r.evidence)}
}
# pass_token: return {ok:true,...}   fail_token: {ok:false}
# determinism: no Date/crypto/fetch in script — inside agent() only
```

### Blueprint 3 — COMPOSE_TDD_CARD_MASTER_v1

```markdown
---
card: compose-function-v1
function: compose:tdd
id: [FILL]
slot_in: "[FILL parent §3 slot]"
---
# TDD micro-loop as a wired function
trigger: any feature/bugfix task emitted by the phase graph
contract:
  1. behavior contract stated (inputs/outputs/edges)
  2. failing test FIRST -> run -> RED recorded (evidence kept)
  3. minimum implementation -> GREEN recorded
  4. >=3 adversarial cases before happy path (happy path LAST)
  5. full relevant battery green before slot exit
micro_loop: red -> green -> refactor (per task)
gate:      exit only on fresh passing output (compose:verify iron law)
fail_route: 2 failed fixes -> stop patching -> ROUTE_DERIVE (card §6)
returns to phase: {tests: [names], evidence: [cmd outputs]}
```

### Blueprint 4 — COMPOSE_NEXT_CARD_MASTER_v1

```markdown
---
card: compose-function-v1
function: compose-next        # Build agent, explicit request only
id: [FILL]
slot_in: "[FILL parent §3 slot]"
---
# compose-next 8-phase contract as a wired macro function
phases: orient -> grill -> workspace -> spec -> implement ->
        verify -> review -> finalize -> finish
contract (per phase, one line gate):
  orient:   repo read before any ask
  grill:    1 decision axis/turn, question tool, recommended-first
  workspace:.worktrees/<slug>, never main w/o consent
  spec:     docs/compose/spec/<feature>.md, S1-S3 + tasks(acceptance,

# THE 11-SECTION BIBLE BODY (authored v1.5 — anchors consumed, floor recorded honestly)

## 1. Status Banner
Project: GOALMODE CARDS. Version: 1.5 (repo build, this session). Scope: the card document family — anatomy, schema, compile contract, panels, routing. Effective: 2026-09-12. Baseline: master @ 66bd734c. NO supersession authority granted: the verbatim head above (operator-preserved 2026-09-10) remains byte-exact canon; this body EXPOSES it, never replaces it.

## 2. Table of Contents
1 Status Banner · 2 this TOC · 3 The Red Pill · 4 Architecture Map · 5 Design Principles · 6 Deep-Dives Part 1 (frontmatter, §0, §1) · 7 Deep-Dives Part 2 (§2-§6) · 8 Registries · 9 Failure Modes · 10 Appendix A masters verbatim · 11 Appendix B contract + example verbatim · 12 Appendix C battery outputs · 13 Iron Laws · 14 Conclusion + Compaction Recovery. Every entry resolves to an emitted heading in this file.

## 3. The Red Pill
What you think a card is (WRONG): a fancy TODO template; documentation that describes a build.
What it actually is (CORRECT): the kernel's process image. §0 is executable law the judge runs cold; §1 is the program counter; §2/§3 are the linked binaries and libraries; §4 is the supervisor's jury; §5 is the ship stage; §6 is the signal disposition table. A card that reads well but gates nothing is INVALID — the validator exists because structure is the contract.
Myth-bust table:
| myth | reality |
|---|---|
| "the card is the plan" | the plan lives in specs; the card is the EXECUTABLE contract |
| "§0 is a summary" | §0 is the halt vocabulary — commands or nothing |
| "panels are optional review" | §4 + §0 artifact gates make review a gate, not a mood |
| "more sections = better" | sections are a fixed contract; content is the variable |
| "the card can declare completion" | EXIT is kernel-owned; the card cannot release itself |

## 4. Architecture Map
| component | role | inputs | outputs | runtime |
|---|---|---|---|---|
| frontmatter | machine binding | author | card:/id:/version:/forked-from:/mode: | validator |
| §0 goal contract | halt vocabulary | done-conditions | cmd/expect pairs + nl_prompt | judge (cold) |
| §1 phase graph | program counter | phases + slots | ordered rows w/ entry/exit | kernel loop |
| §2 js slots | binary mounts | workflow names + args | {ok}|null returns | workflow runtime |
| §3 compose slots | library mounts | tdd/next cards | fresh verify output | skill contracts |
| §4 panels | supervisor jury | artifacts + schemas | verdict artifacts | agent({schema}) |
| §5 ship gates | delivery stage | green panels | package + report | SPG + report skills |
| §6 recovery | trap table | stuck-signatures | ordered routes | kernel + journal |
Deep-dive mapping: frontmatter+§0+§1 → section 6; §2-§6 → section 7.

## 5. Design Principles (each with its rejected alternative)
P1 commands-not-prose (§0). Rejected: LLM-judged done-ness. Why: negotiable, unjudgeable. Cost: author writes runnable checks.
P2 kernel-owned EXIT. Rejected: card-scripted completion. Why: forgeable. Cost: none.
P3 fork-lineage. Rejected: free-form cards. Why: drift. Cost: five frontmatter fields.
P4 family-aware schema. Rejected: one-size schema. Why: three legal families with different bodies. Cost: validator branches.
P5 panels-as-data. Rejected: prose reviews. Why: agent-typeable passes are circular. Cost: schemas per panel.
P6 routes-ordered-escalate-last. Rejected: escalate-first. Why: autonomy. Cost: journal discipline.
P7 cheapest-phase-first. Rejected: narrative order. Why: blast radius caught early. Cost: none.
P8 verbatim-head immutability. Rejected: rewrite-as-you-grow. Why: operator-preserved canon. Cost: growth appends only.
P9 soft-contract-in-foreign-targets. Rejected: hard contract requirement everywhere. Why: deploy proof failure. Cost: home-repo contract gated by its own §0 ls.
P10 seam-portability. Rejected: substrate-only globals. Why: node testability. Cost: one destructure line.
P11 cold-final-only. Rejected: cached green. Why: stale artifacts ship fiction. Cost: one re-run.
P12 repo-relative docs. Rejected: private paths in public canon. Why: public repo (operator ruling). Cost: lineage note only.

## 6. Deep-Dives Part 1
### 6.1 frontmatter
Five mandatory fields (card/id/version/forked-from/mode); card selects the family schema; forked-from chains to a master; mode declares the executing agent (build for compose-next-capable kernels). Failure: missing any → validator FAIL; typo'd family → "unknown family".
### 6.2 §0 — the goal contract
Fields: outer_success[] (cmd/expect pairs), nl_prompt, success_criteria, anti_cheat line. The judge reads ONLY this section at halt; phases read it at entry/exit. Laws: every pair balanceable (validator counts cmd: vs expect:); expect = substring pinning counts; no side effects in gates. Worked pairs (from the live contract): ls artifact exists; grep -c anchors >= N; node validator → "FAIL count 0"; wc -l floors; grep -rn 'ghp_' → empty; workflow smoke → {"ok": true}. Failure: prose pair (rejected), unbalanced pair (rejected), side-effecting gate (breaks replay).
### 6.3 §1 — the phase graph
Table columns: #, phase, engine (js|compose), slot ref, entry, exit. Order IS execution; entry/exit are mechanical references to §0-style checks or slot returns. Cheapest-blast-radius first (docs before executables). Failure: dangling slot refs (null at first dispatch); inverted order (entry conditions never satisfied); missing exit (invalid row).

## 7. Deep-Dives Part 2
### 7.1 §2 js slots
Row: slot, card, args, fail_route (retry(2) → route). The card field names a js-workflow-v1 document whose default(g) runs in the workflow runtime; args flow by dataflow (A13); fail_route engages on null/{ok:false} after retry(2).
### 7.2 §3 compose slots
Row: slot, card, trigger, micro_loop. tdd = red→green→refactor per executable unit (RED on record first); next = the 8-phase macro contract (explicit-request satisfied by the card's trigger). fail_route after 2 failed fixes → ROUTE_DERIVE.
### 7.3 §4 panels
adversarial_panel: n hostile reviewers, schema {verdict, findings[]}, artifact written to .panels/, majority decides, FAIL → fix(2) → ROUTE_DERIVE. audit_judge_panel: 3-juror on testing data. final_verification: §0 cold, no cache.
### 7.4 §5 ship gates
/ship-package (Phase A docs-current FIRST; audit verdict outranks deadlines) AND /engineering-report (chat+disk, series-scoped). Never before panels green.
### 7.5 §6 recovery + routing
stuck_signatures (no-progress 3 | same-fail 2x | null-rate >30% | deadline); routes ordered DEBUG→DERIVE→SPLIT→SWITCH→RECOVER→ESCALATE-last (3 logged failures); compaction line: reload card, re-enter last incomplete §1 phase.

## 8. Registries
Constants (substrate): maxConcurrentAgents min(16,2xC); maxDepth 8; maxLifecycleAgents 1000; scriptDeadlineMs 12h. Constants (card): retry(2); fix-loop 2; escalate after 3; no-progress K=3; same-fail 2x; null-rate 30%.
Files: cards/GOAL_REPO_BUILD_v1.md (contract, 12 pairs); cards/masters/ x4 (53/28/18/22L); cards/examples/BUILD_TETRIS_v1.md; sdk/CARD_SCHEMA.md; deploy/battery/validate-cards.mjs (schema-as-code).
Decisions: D1 tokens; D2 kernel EXIT; D3 gates-as-commands; D4 validator-as-schema; D5 seam; D6 soft contract; D7 dual runtimes; D8 markdown cards; D9 repo-relative; D10 parallel-default; D11 explicit ceilings; D12 verbatim doctrine.

## 9. Failure Modes (card-authoring class — symptom → root cause → prevention)
F1 prose gate — root: author typed a wish; prevention: validator cmd/expect balance. F2 dangling slot — root: §1 ref to unmounted slot; prevention: smoke + first-dispatch null watch. F3 [FILL] leaked into a pinned card — root: fork not filled; prevention: gm-smoke legality check. F4 anchors renumbered — root: spec edit; prevention: amend-don't-renumber law. F5 panels without artifacts — root: verdicts in chat; prevention: §0 ls gate on .panels/*.json. F6 ESCALATE first — root: copy-paste; prevention: discipline + planned validator order check (v2). F7 family confusion — root: js body on goalmode card; prevention: family-aware validator. F8 head drift — root: hand-edit of verbatim zone; prevention: sha-verify at resume. F9 side-effecting gates — root: impatience; prevention: replay law. F10 weak expect ("pass") — root: unpinned counts; prevention: substring discipline. F11 frontmatter drift across masters — root: schema evolution; prevention: validator + masters in one commit. F12 stale final green — root: cached outputs; prevention: cold-final law. F13 escalate-first — root: operator-pleasing reflex; prevention: ordered routes + journal. F14 secret in tree — root: credential pasted; prevention: §0 grep gate + rotation. F15 under-floor docs padded — root: floor anxiety; prevention: honest-count reporting (this bible reports its own honest count in the README battery).

## 10. Appendix A — the four masters, verbatim (canon reference)
A.1 GOALMODE_CARD_MASTER_v1.md (53L): §0-§6 skeleton; 19 [FILL]; anti_cheat pre-seeded. Line anchors: frontmatter(1-9) §0(12) §1(23) §2(30) §3(34) §4(38) §5(44) §6(48) — grep-verified this session.
A.2 JS_WORKFLOW_CARD_MASTER_v1.md (28L): meta contract + default export skeleton (glob→parallel(agent,{schema})→failed-filter→gate); pass_token {ok:true}; fail_token {ok:false}; determinism comment in-file.
A.3 COMPOSE_TDD_CARD_MASTER_v1.md (18L): trigger feature/bugfix; contract behavior→RED→min-impl→≥3 adversarial→battery green; micro_loop red->green->refactor; fail_route 2-fails→ROUTE_DERIVE.
A.4 COMPOSE_NEXT_CARD_MASTER_v1.md (22L): phases orient→…→finish; one-line gate per phase; fail_route non-convergence→impasse report, never force pass.

## 11. Appendix B — live cards (canon reference)
B.1 GOAL_REPO_BUILD_v1.md: 12 outer_success pairs (existence; validator FAIL 0; bridge files; bridge battery; deploy proof; wc floors; manuals; substrate; smoke {"ok": true}; secret grep empty; commit on main; public origin). nl_prompt embeds compose-next macro + compose:tdd micro. §1 eight phases; §6 routes + compaction.
B.2 BUILD_TETRIS_v1.md: filled (zero [FILL]); spec-anchor gate ≥5; pytest 0 fail; smoke {ok:true}; 3/3 panel verdicts; package audit PASS; validator PASS.

## 12. Appendix C — battery outputs (measured this session, verbatim)
VALIDATOR final: "PASS count 6, FAIL count 0, total 6". BRIDGE: "10/10 PASS" (exit tokens typed / seq order / and short-circuit / or fallback / run gate polarity / pipe dataflow / jobs barrier / trap routing / until cap / env store). SMOKE: {"ok": true, "checked": 5} exit 0. DEPLOY PROOF: 8/8 files + "SMOKE-IN-TARGET: {ok:true} PASS" exit 0.
History kept honest: RED "gsh.js not importable" exit 1; 9/10 "FAIL env store :: gsh.export is not a function"; validator 0/5 (double-colon regex); deploy exit=1 (contract-card gap) — fixed in-session; the failures are canon, not shame.

## 13. Iron Laws
1. ALWAYS five frontmatter fields — else validator FAIL. 2. NEVER prose in §0 — unjudgeable halt. 3. MUST balance cmd/expect — half a contract reads as none. 4. ALWAYS fork-with-lineage — else drift. 5. NEVER leak [FILL] into pinned cards — smoke {ok:false}. 6. MUST write panel artifacts — verdicts must be re-runnable facts. 7. NEVER script EXIT — forgeable release. 8. ALWAYS order routes, ESCALATE last — autonomy lost otherwise. 9. MUST cold-final — stale green ships fiction. 10. NEVER pad docs — poisoned canon; honest counts always. 11. ALWAYS keep the head byte-exact — operator order destroyed otherwise. 12. MUST evolve schema+masters together — drift otherwise.

## 14. Conclusion and Compaction Recovery Guide
Read first after context loss: (1) the pinned card's §0 IS the contract — run it cold; (2) sections 6-7 are the anatomy laws; (3) Appendix A masters are the fork roots; (4) the validator is the schema — run before anything; (5) the head is operator-preserved — never edit; (6) report honest counts — any floor shortfall is stated in the README battery table with its growth path, never papered over.

=== END CARD BIBLE BODY v1.5 (honest line count recorded in README battery table) ===
