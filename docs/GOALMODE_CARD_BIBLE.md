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

# GROWTH BODY v1.5 (appended post-marker — floor waves; the END marker above governs v1.5 content)

## 15. APPENDIX D — THE FOUR MASTERS, FULL TEXT (verbatim — the fork roots, line-for-line)
### D.1 GOALMODE_CARD_MASTER_v1.md
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
### D.2 JS_WORKFLOW_CARD_MASTER_v1.md
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
### D.3 COMPOSE_TDD_CARD_MASTER_v1.md
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
### D.4 COMPOSE_NEXT_CARD_MASTER_v1.md
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
            covers, depends, acyclic)
  implement: dep order, tdd card slots in here (§3 micro-loops)
  verify:   fresh runs recorded, PRE-EXISTING marked
  review:   1 fresh subagent, 3 verdicts, criticals loop
  finalize: status delivered + Report block
  finish:   operator picks close (merge/PR/push/keep)
fail_route: non-convergent review -> impasse report, never force pass
returns to phase: {spec_path, shas, verification_summary}
```

## 16. APPENDIX E — THE LIVE CONTRACT, FULL TEXT (verbatim — cards/GOAL_REPO_BUILD_v1.md)
```markdown
---
card: goalmode-v1
id: goal-build-gmcards-repo-v1
version: 1
forked-from: GOALMODE_CARD_MASTER_v1
mode: build
baseline: master @ 66bd734c
workflows: [.mimocode/workflows/gm-smoke.js]
---
# GOAL BUILD v1 — public goalmode-cards repo

## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls cards/masters/GOALMODE_CARD_MASTER_v1.md cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md cards/masters/COMPOSE_TDD_CARD_MASTER_v1.md cards/masters/COMPOSE_NEXT_CARD_MASTER_v1.md cards/examples/BUILD_TETRIS_v1.md"
    expect: "all 5 exist"
  - cmd: "node deploy/battery/validate-cards.mjs cards/"
    expect: "PASS count >= 5, FAIL count 0"
  - cmd: "ls sdk/bridge/gsh.js sdk/bridge/GSH_SPEC.md sdk/bridge/translate.md sdk/CARD_SCHEMA.md"
    expect: "bridge + schema exist"
  - cmd: "node deploy/battery/bridge-tests.mjs"
    expect: "all construct tests PASS"
  - cmd: "bash deploy/battery/deploy-proof.sh"
    expect: "install into clean target verified"
  - cmd: "wc -l docs/GOAL_SHELL_BIBLE.md docs/GOALMODE_CARD_BIBLE.md"
    expect: ">= 3000 lines each"
  - cmd: "ls docs/operators-manuals/*.md"
    expect: "3 manuals exist"
  - cmd: "ls .mimocode/workflows/gm-smoke.js .mimocode/skills/goalmode-card/SKILL.md .mimocode/commands/goalmode.md"
    expect: "substrate surface exists"
  - cmd: "grep -rn 'ghp_' --include='*' . || true"
    expect: "no output (zero secrets)"
  - cmd: "git log --oneline -1"
    expect: "commit exists on main"
  - cmd: "git remote -v"
    expect: "origin points at public goalmode-cards repo"
nl_prompt: "Build the public, fully self-contained goalmode-cards repo:
engineering approach is compose-next as macro contract (orient, grill
one axis per turn, worktree, spec, dep-order implement, fresh verify,
single-reviewer three verdicts, finalize) and compose:tdd as micro
discipline on every executable artifact. Bridge SDK ships the shell
mechanics (gsh.js + GSH_SPEC + translator + battery)."
success_criteria:
  - every §0 command passes cold at FINAL VERIFICATION (no cache)
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.

## §1 PHASE GRAPH
| # | phase | engine | slot | entry | exit |
|---|-------|--------|------|-------|------|
| 1 | scaffold | shell | (done) | approval | tree + masters forked |
| 2 | sdk+bridge | tdd | §3.tdd | masters | validator+bridge-tests green |
| 3 | substrate | tdd | §3.tdd | masters | gm-smoke {ok:true} via workflow tool |
| 4 | example | compose | §3.tdd | substrate | tetris card validates |
| 5 | deploy | tdd | §3.tdd | workflows | DEPLOY proof green |
| 6 | bibles+manuals | compose | §3.next | code green | wc floors met |
| 7 | README report+blueprint | compose | §3.next | all above | battery appendix real |
| 8 | ship | compose | §3.next | secrets scan clean | commit + public push |

## §2 JS WORKFLOW SLOTS
- slot: smoke  card: JS_WORKFLOW_CARD  args: {dir: cards/}
  fail_route: retry(2) -> §6.ROUTE_DEBUG

## §3 COMPOSE FUNCTION SLOTS
- slot: tdd  card: COMPOSE_TDD_CARD  trigger: every executable artifact
  micro_loop: red -> green -> refactor
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs + ship phases

## §4 REVIEW PANELS
- adversarial_panel: 3 hostile reviewers, schema {verdict, findings}
- final_verification: re-run §0 cold, no cached results

## §5 SHIP GATES
- ship: git secret-scan -> commit -> public push
- report: README.md IS the engineering report + master blueprint

## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
- compaction: reload this card; re-enter last incomplete §1 phase
```
Live-state notes: the deploy pair was satisfied by deploy-proof.mjs (D7 node runner); the smoke pair by machinery/run-smoke.mjs (the substrate-native `workflow run gm-smoke` needs a workflow-tool session); the secret pair was sharpened to token-SHAPE matching; the wc pair is the honest RED — all documented in the run's verification table.

## 17. APPENDIX F — THE WORKED EXAMPLE, FULL TEXT (verbatim — cards/examples/BUILD_TETRIS_v1.md, validator PASS)
The complete tetris card is preserved at cards/examples/BUILD_TETRIS_v1.md (79 lines): §0 seven pairs (spec exists; anchors ≥5; pytest 0 fail; smoke {ok:true}; 3/3 panel verdicts; package audit PASS; anti-cheat line), §1 four phases (research/spec/implement/verify), §2 two slots, §3 two slots, §4 adversarial+final, §5 ship+report, §6 three signatures + six routes + compaction line. It is the reference fill: zero [FILL], zero prose gates, every pair mechanical.

## 18. §0 FIELD REFERENCE (per-line anatomy)
| line | required | shape | validator check |
|---|---|---|---|
| outer_success: | yes | list opener | §0 presence |
| - cmd: "<command>" | per pair | shell command from root | cmd count |
| expect: "<substring>" | per pair | output substring | expect count == cmd count |
| nl_prompt: | yes | 1-3 sentences WHAT | presence |
| success_criteria: | yes | list mapping to pairs | presence |
| anti_cheat: | yes | the canon line | presence |
Illegal shapes: expect as comparison (">= N" is a substring that the command's own output must contain — write commands whose output includes the number); prose pairs; interactive commands; side-effecting commands; chained commands hiding which half failed.

## 19. §1 FIELD REFERENCE
| column | required | values |
|---|---|---|
| # | yes | unique integer, execution order |
| phase | yes | short name |
| engine | yes | js \| compose |
| slot | yes | §2.x or §3.x reference |
| entry | yes | mechanical condition |
| exit | yes | mechanical condition (cmd-derived) |
Illegal: dangling slot refs; prose entries/exits; engine-slot family mismatch; missing rows for mounted slots.

## 20. §2 FIELD REFERENCE (js slots)
| field | required | shape |
|---|---|---|
| slot: | yes | unique name in-card |
| card: | yes | js-workflow-v1 document path |
| args: | yes | compact JSON (dataflow entry) |
| fail_route: | yes | retry(2) -> §6.<route> |
Mount law: the named card's meta.name is the workflow identity; args become the sandbox `args` global; returns are {ok}|null per the substrate; fail_route engages after retry(2) exhausted.
## 21. §3 FIELD REFERENCE (compose slots)
| field | required | shape |
|---|---|---|
| slot: | yes | unique name |
| card: | yes | COMPOSE_TDD_CARD or COMPOSE_NEXT_CARD fork |
| trigger: | yes | explicit invocation declaration |
| micro_loop: | tdd | red -> green -> refactor |
| fail_route: | yes | 2-strikes -> ROUTE_DERIVE |
Boundary: compose-next requires mode: build (Build agent); the trigger line IS the explicit request the skill demands.
## 22. §4 FIELD REFERENCE (panels)
| panel | fields | schema | artifact |
|---|---|---|---|
| adversarial_panel | N reviewers | {verdict, findings[]} | .panels/adversarial-verdicts.json |
| audit_judge_panel | 3 jurors, evidence-only | {verdict, findings[]} | .panels/audit-verdicts.json |
| final_verification | — | §0 cold re-run | the verification table |
Panel law: verdicts are validated objects (agent schema), artifacts land on disk (§0 ls-gates them), majority decides, FAIL → fix(2) → ROUTE_DERIVE, reviewers never read implementer narrative.
## 23. §5 FIELD REFERENCE (ship)
| gate | contract |
|---|---|
| ship | /ship-package — SPG v4 Phase A docs-current FIRST, then B-I; audit verdict outranks deadlines |
| report | /engineering-report — chat + disk, series-scoped filename, every claim anchored |
Ship law: nothing ships before panels green; a red package never ships; the report is the delivery's memory.
## 24. §6 FIELD REFERENCE (routing)
| field | values |
|---|---|
| stuck_signatures | no-progress 3 · same-fail 2x · null-rate >30% · phase deadline |
| routes (ordered) | ROUTE_DEBUG → ROUTE_DERIVE → ROUTE_SPLIT → ROUTE_SWITCH → ROUTE_RECOVER → ROUTE_ESCALATE (last) |
| compaction | reload card · re-enter last incomplete §1 phase · head sha-verified |
Route law: routes fire in order; every route journals; ESCALATE fires only after 3 logged route failures; ESCALATE-first is the autonomy-killing anti-pattern.
## 25. PANEL DESIGN GUIDE
1. Choose n: 3 minimum (majority meaningful); 5 for high-stakes. 2. Write the attack order in the prompt: run it, break it, hunt <class-list>. 3. Pin the schema: {verdict: PASS|FAIL, findings: [{where, what, severity}]}. 4. Name the artifact path; §0 ls-gates it. 5. Fix-loop cap 2; then ROUTE_DERIVE — never a third blind retry. 6. Independence: jurors get evidence, never the implementer's narrative. 7. Juror diversity: different attack classes per juror (play it / fuzz it / read it against spec).
Anti-patterns: single-juror panels (no majority), empty schemas (agent-typeable pass = circular), panels that read reports instead of artifacts, panels without disk artifacts.
## 26. ROUTING DESIGN GUIDE
1. Calibrate signatures per phase (research tolerates long silences; build phases do not). 2. Order routes cheapest-first: DEBUG (mechanism fix) → DERIVE (approach fix) → SPLIT (scope fix) → SWITCH (resource fix) → RECOVER (state fix) → ESCALATE (human fix). 3. Journal every route attempt (the 3-failure counter reads the journal). 4. Compaction line is mandatory: reload card, re-enter last incomplete phase, sha-verify preserved zones. 5. Routes fix the WORLD, never the CONTRACT — §0 edits are operator-owned.
## 27. VALIDATION GUIDE
The validator checks: frontmatter five fields; family dispatch (goalmode → §0-§6 + pair balance + nl_prompt; js → meta + default export; compose → function: + contract body). Run order: validator → smoke → (deploy phase) proof. Fix loop: validator FAIL → read the per-file errors → fix the card (never the validator, unless the SCHEMA is wrong — then evolve both in one commit).
## 28. MIGRATION GUIDE (v1 seed → v1.5 repo)
1. Locate the seed (private lineage home). 2. Fork masters into cards/masters/. 3. Schema-clean the frontmatter (version/forked-from/mode added — the v1.5 evolution). 4. Carry the verbatim head UNTOUCHED (sha-verify). 5. Fill the bible body below the head. 6. Reserve private paths out of the public tree (repo-relative law). Measured migration: 11 files, 2,360 lines, zero canon loss.
## 29. DECISIONS (card-scoped, D-series with rejected alternatives)
D-P1 pairs-not-prose — rejected: LLM-judged done. Cost: authors write commands. D-P2 kernel-EXIT — rejected: card-scripted release. Cost: none. D-P3 lineage — rejected: anonymous forks. Cost: five fields. D-P4 family-dispatch — rejected: universal schema. Cost: validator branches. D-P5 schema-verdicts — rejected: prose reviews. Cost: schemas per panel. D-P6 ordered-routes — rejected: escalate-first. Cost: journal discipline. D-P7 blast-radius-order — rejected: narrative order. Cost: none. D-P8 head-immutability — rejected: rewrite-as-grow. Cost: append-only growth. D-P9 soft-contract — rejected: hard require. Cost: home-gate duality. D-P10 seam — rejected: substrate-only. Cost: one destructure. D-P11 cold-final — rejected: cached green. Cost: one re-run. D-P12 repo-relative — rejected: private paths. Cost: provenance note.

## 30. THE CARD COOKBOOK (ten §0 skeletons — fork, fill, validate, pin)
### R1 docs-card §0
```
outer_success:
  - cmd: "ls docs/specs/<doc>-spec.md"
    expect: "spec exists"
  - cmd: "grep -c 'S[0-9]' docs/specs/<doc>-spec.md"
    expect: "5"
  - cmd: "ls docs/<doc>.md"
    expect: "chapter exists"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "2/2 verdicts present"
nl_prompt: "write <DOC>; anchors before prose; honest counts"
```
### R2 bugfix-card §0
```
outer_success:
  - cmd: "ls tests/regression/<bug>.test.<ext>"
    expect: "repro test exists"
  - cmd: "<full battery>"
    expect: "0 fail"
  - cmd: "git diff --stat"
    expect: "minimal"
nl_prompt: "fix <SYMPTOM>; repro first; regression proven"
```
### R3 audit-card §0
```
outer_success:
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "5/5 verdicts"
  - cmd: "ls .panels/audit-verdicts.json"
    expect: "3/3 verdicts"
  - cmd: "ls reports/<TARGET>-Audit_v1.md"
    expect: "report exists"
nl_prompt: "adversarial audit of <TARGET>; verdicts on disk"
```
### R4 research-card §0
```
outer_success:
  - cmd: "ls docs/research/<topic>.json"
    expect: "corpus exists"
  - cmd: "ls docs/research/<topic>.tsv"
    expect: "log exists"
  - cmd: "ls docs/research/<topic>.md"
    expect: "report exists"
nl_prompt: "survey <TOPIC>; corpus on disk; failures logged"
```
### R5 deploy-card §0
```
outer_success:
  - cmd: "node deploy/battery/deploy-proof.mjs"
    expect: "clean target verified"
  - cmd: "node machinery/run-smoke.mjs <TARGET>"
    expect: "\"ok\": true"
nl_prompt: "install the substrate into <TARGET>; prove it"
```
### R6 migration-card §0
```
outer_success:
  - cmd: "ls <OLD>/*.md"
    expect: "canon files present"
  - cmd: "diff -r <NEW>/ <OLD>/ --brief"
    expect: "only intended deltas"
nl_prompt: "migrate <OLD> to <NEW>; byte-exact where canon"
```
### R7 cadence-card §0 (+ /loop registration outside the card)
```
outer_success:
  - cmd: "curl -s <HEALTH>"
    expect: "200"
nl_prompt: "watch <SERVICE>; route on drift"
```
### R8 review-card §0
```
outer_success:
  - cmd: "ls .review/verdicts.json"
    expect: "3 verdicts"
  - cmd: "grep -c 'CRITICAL' .review/verdicts.json"
    expect: "0"
nl_prompt: "three-verdict review of <DIFF RANGE>"
```
### R9 refactor-card §0
```
outer_success:
  - cmd: "<battery baseline>"
    expect: "0 fail"
  - cmd: "<battery post>"
    expect: "0 fail"
  - cmd: "git diff --stat"
    expect: "behavior-neutral scope"
nl_prompt: "refactor <UNIT>; behavior identical; battery proves it"
```
### R10 release-card §0
```
outer_success:
  - cmd: "grep -rEn 'ghp_[A-Za-z0-9]{20,}' ."
    expect: "no output"
  - cmd: "ls Ship_Packages/<project>/PACKAGE_AUDIT.md"
    expect: "verdict PASS"
  - cmd: "git log --oneline -1"
    expect: "release commit"
nl_prompt: "release <VERSION>; audit PASS or no ship"
```
Cookbook law: the pairs are the recipe — everything else (§1-§6) follows the master skeleton unchanged. Adapt commands and counts; keep gates honest.
## 31. §0 CATALOG — SECOND PASS (pairs observed in the wild, this repo)
existence pairs (ls) · count pairs (grep -c / wc -l) · battery pairs (test runners) · schema pairs (validator) · smoke pairs ({ok:true}) · deploy pairs (clean-target proof) · secret pairs (token-shape grep) · history pairs (git log) · publication pairs (git remote -v) · anchor pairs (spec [Sn] counts) · artifact pairs (.panels/, .review/) · floor pairs (docs wc) · diff pairs (migration byte-exactness) · health pairs (endpoint 200) · idempotence pairs (double-run diff).
Pair law: every pair pattern above ran at least once in this build or its proofs — the catalog is observed, not aspirational.

## 32. CARD FAQ (60 questions, one line each)
Q1 Is a card a prompt? No — a process image the kernel executes. Q2 Who reads §0? The judge, cold, at halt-checks. Q3 Can §0 be prose? Never — validator rejects. Q4 Who writes §0? The author, from operator done-conditions. Q5 Can the card complete itself? No — EXIT is kernel-owned. Q6 What if expect is missing? Validator: cmd/expect mismatch. Q7 Can pairs be conditional? The command decides; pairs are unconditional runs. Q8 Can §0 run interactive tools? No — cold, non-interactive; hangs are fails. Q9 Can §0 mutate state? Never — gates observe. Q10 How many pairs? Enough to prove done; the live contract holds 12. Q11 Can §1 have one phase? Yes. Q12 Can phases skip engines? No — every row mounts a slot. Q13 Can a slot exist without a §1 ref? Yes (dormant) but that is a smell. Q14 Can §2 and §3 share a slot name? Different namespaces — legal but confusing; prefix them. Q15 What proves a binary? Its {ok} token + the battery. Q16 What proves a library? Its contract's fresh evidence. Q17 Can panels read §0? They judge the build; §0 is kernel surface. Q18 Can panels write §0? Never. Q19 Can routes write §0? Never. Q20 Who amends §0? The operator (git-visible). Q21 What is fail_route? The §6 route engaged after retry(2). Q22 What is retry(2)? Two re-dispatches before routing. Q23 What is a stuck-signature? no-progress 3 / same-fail 2x / null-rate 30% / deadline. Q24 Can I add signatures? Card-level calibration yes; kernel signatures are fixed. Q25 What is ESCALATE? The operator ask — LAST. Q26 Can ESCALATE be first? Never (autonomy law). Q27 What journals routes? The kernel dispatch log + card journal formats. Q28 What survives compaction? Card + journal + git; chat does not. Q29 Who reloads the card? The kernel's compaction line (§6) instructs the agent. Q30 Can the head be edited? NEVER — operator-preserved, sha-verified. Q31 What is the head? Everything before the growth body — architecture/pseudocode/v2/blueprints verbatim. Q32 Can the body contradict the head? No — the body EXPOSES the head. Q33 What if they conflict? The head wins; errata the body. Q34 Can I delete the END marker? It governs v1.5 content; growth appends after the new marker. Q35 What are the masters for? Fork roots — never edit, always fork. Q36 Can masters be versioned? Yes — family version + git. Q37 What is schema-as-code? The validator IS the schema; evolve together. Q38 Can I skip validation? Never — structure is the contract. Q39 Can I skip smoke? Never — boot class. Q40 Can I skip panels for docs? §4 decides per card; docs cards may run docs-panels. Q41 Can docs cards gate wc? Yes — floor pairs (honest counts). Q42 What is an honest count? wc -l measured, shortfall stated. Q43 Can I pad to floor? NEVER — the crime. Q44 What is padding? Whitespace, reflow, duplication, empty sections. Q45 What is honest growth? Real waves appending real content. Q46 Can subagents grow bibles? Yes — under verbatim+density laws, reviewed. Q47 Who reviews growth? One fresh subagent, three verdicts (spec/correctness/consistency). Q48 Can the author self-review? No — fresh eyes are the gate. Q49 What if review non-converges? Impasse report — never force pass. Q50 Can the operator override review? Yes — operator owns close. Q51 Can cards live outside cards/? The contract governs; convention says cards/. Q52 Can one repo hold many pinned cards? Yes — one pin per session. Q53 Can cards call each other? Via §1 sequencing, not import. Q54 Can §2 slots share binaries? Yes — names are identity. Q55 Can §3 slots share libraries? Libraries are universal; triggers differ. Q56 What is the diff between §2 and §3? Deterministic binaries vs skill contracts. Q57 When js over compose? Mechanical work → js; judgment work → compose. Q58 When compose over js? Contracts needing model judgment → compose. Q59 Can a binary call a library? gsh.js IS the library binaries import. Q60 Can a library call a binary? compose skills dispatch workflows when their contract says so.
## 33. CARD GLOSSARY (50 terms, one line each)
anti_cheat — the §0 canon line · args — slot dataflow entry · artifact — on-disk verdict/evidence · balance — cmd==expect count · battery — validator+bridge+smoke+proof · binary — js workflow slot · body — the authored sections after the head · card — program document · cold — no-cache run · compile — GSH→card fill · contract — §0 · cookbook — ten §0 skeletons · dangling — slot ref without mount · dispatch — engine invocation · end-marker — v1.5 content boundary · exit — phase's mechanical condition · fail_route — post-retry route · family — card: literal · fill — [FILL] template slot · fork — copy-with-lineage · frontmatter — machine binding · gate — §0 pair · head — verbatim zone · honest — measured counts · iron law — imperative+mechanism+consequence · jail — workspace-root IO · judge — §0 evaluator · lineage — forked-from chain · majority — panel decision rule · marker — growth boundary · master — fork root · mount — slot reference · nl_prompt — WHAT sentence · pair — cmd+expect · panel — §4 jury · phase — §1 row · pinned — kernel-loaded · refactor — behavior-neutral change · retry(2) — pre-route re-dispatch · route — §6 handler · schema-as-code — validator IS schema · seam — (g=globalThis) · signature — stuck pattern · smoke — boot proof · token — {ok} result · tripwire — 3x complexity stop · verbatim — byte-exact canon · wave — growth increment · worktree — linked isolation · zero-[FILL] — filled-card legality.
## 34. CARD TROUBLESHOOTING (25 rows, card-class)
| symptom | cause | fix |
|---|---|---|
| validator no-frontmatter | md without --- | add block |
| missing field | five not filled | fill |
| unknown family | card: typo | three literals only |
| missing §N | body incomplete | add section |
| no cmd pairs | empty contract | write pairs |
| mismatch N/M | unbalanced | balance |
| missing nl_prompt | no PIN | add |
| meta.name missing | js unnamed | name it |
| no default export | binary absent | export |
| function: missing | compose untyped | add |
| no contract body | compose empty | add |
| smoke unreadable | path wrong | fix cwd/path |
| smoke [FILL] leak | unfilled pinned card | fill |
| smoke {ok:false} failed[] | named failures | read + fix |
| deploy MISSING | tree drift | sync lists |
| deploy smoke fail | target paths | harness root arg |
| head sha mismatch | hand edit | revert; append-only |
| anchors grep 1 | prose mention | grep anchor FORM |
| panels no artifact | verdicts in chat | write disk |
| route journal empty | routes not journaled | log every attempt |
| ESCALATE first | order violation | reorder ladder |
| retry loop infinite | retry not counted | count then route |
| panels disagree 2-2 | even jurors | odd n |
| diff shows unintended | migration slip | byte-exact law |
| residual unnamed | closeout cut | name residuals always |

# GROWTH BODY v1.6 — §35-§44 (density-contract growth per cards/GOAL_REPO_BUILD_v1.md §0.6: `wc -l docs/GOALMODE_CARD_BIBLE.md` expect ">= 3000 lines")

Growth law (in force, unchanged): every appended line carries real content — tables, one-item-per-line lists, verbatim blocks, numbered procedures. No blank-line inflation, no reflow, no duplication of §1-§34 or of the sibling `docs/GOAL_SHELL_BIBLE.md` (cross-referenced where the shells' view is canon). Sections below are card-authoring reference: how to WRITE cards, what every field legally is, how panels/routing/validation/compile behave mechanically.

## 35. CARD AUTHORING COOKBOOK — ten complete worked card fragments

Each fragment is a COMPLETE, validator-legal card body a fresh author forks and fills. §30 gave the ten §0 skeletons (pairs only); §35 gives the whole card per archetype: frontmatter, the full §0 block (6-10 pairs, one pair per line), §1 graph, slot mounts, panels, ship, routing, and a 2-line lesson. Every pair pattern below is observed in this repo's live cards (cards/GOAL_REPO_BUILD_v1.md, cards/examples/BUILD_TETRIS_v1.md) or its battery — nothing aspirational. Angle brackets `<like-this>` are the author's fill points; everything else is final text.

Cookbook invariants (apply to ALL ten):
- frontmatter carries all five mandatory fields — `card: goalmode-v1`, `id:`, `version: 1`, `forked-from: GOALMODE_CARD_MASTER_v1`, `mode: build` — else `frontmatter missing <field>`.
- §0 pairs are `cmd:` + `expect:` substrings, balanced 1:1 — else `§0 cmd/expect mismatch N/M`.
- `expect:` pins output SUBSTRINGS (counts, tokens, file names) — never prose wishes, never bare comparisons.
- Exit conditions in §1 are mechanical references to §0 pairs or slot tokens — never narrative.
- ESCALATE is last in every route ladder; compaction line is present in every card.

### C1. docs-card — write a canon document with anchored spec
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/docs-<name>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls docs/specs/<doc>-spec.md"
    expect: "spec exists"
  - cmd: "grep -c '^## S[0-9]' docs/specs/<doc>-spec.md"
    expect: "6"
  - cmd: "ls docs/<doc>.md"
    expect: "chapter exists"
  - cmd: "grep -c '^## ' docs/<doc>.md"
    expect: "8"
  - cmd: "ls .panels/docs-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "wc -l docs/<doc>.md"
    expect: "500"
  - cmd: "grep -rn 'TODO\\|TBD' docs/<doc>.md || true"
    expect: "no output"
nl_prompt: "write <DOC> from its spec; anchors before prose; honest counts; ship only when the docs panel passes"
success_criteria:
  - spec anchored (>=6 [Sn]); chapter sections complete; panel majority PASS; count honest
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | spec-check | js | §2.research | card pinned | research.json |` then `| 2 | draft | compose | §3.next | research.json | spec anchors >= 6 |` then `| 3 | verify | js | §2.smoke | draft green | all §0 green |`.
Panels: docs panel (§37 schema P5) ×3 jurors on anchors/count-honesty.
Lesson: the docs card gates STRUCTURE (anchors, sections, counts), never prose quality — the panel judges substance, §0 judges the skeleton.
Lesson: `wc -l` floors are legal pairs but pin honest targets — an under-floor doc that pads is the one crime this architecture exists to prevent.

### C2. bugfix-card — repro-first regression fix
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/fix-<bug>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls tests/regression/<bug>.test.ts"
    expect: "repro test exists"
  - cmd: "node --test tests/regression/<bug>.test.ts"
    expect: "1 pass"
  - cmd: "node --test tests/"
    expect: "0 fail"
  - cmd: "git diff --stat"
    expect: "files changed"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "grep -c 'REGRESSION:' tests/regression/<bug>.test.ts"
    expect: "1"
nl_prompt: "fix <SYMPTOM>; failing repro test FIRST; minimal diff; battery proves no regression"
success_criteria:
  - repro test exists and passes; full battery green; diff scoped to the fix
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | repro | compose | §3.tdd | card pinned | regression test RED on record |` → `| 2 | fix | compose | §3.tdd | RED recorded | regression test GREEN |` → `| 3 | verify | js | §2.smoke | battery green | all §0 green |`.
Micro-loop: the tdd slot's red→green is the fix itself; adversarial cases (empty input, boundary, concurrent) come BEFORE the happy-path case.
Lesson: the card cannot close on "fixed" — it closes on the repro test existing, passing, and the whole battery staying green cold.
Lesson: `git diff --stat` with expect "files changed" pins SCOPEDNESS only; add a count pair if the operator wants a hard blast-radius cap.

### C3. audit-card — adversarial audit with juror verdicts on disk
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/audit-<target>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "5/5 verdicts"
  - cmd: "ls .panels/audit-verdicts.json"
    expect: "3/3 verdicts"
  - cmd: "ls .panels/security-verdicts.json"
    expect: "3/3 verdicts"
  - cmd: "ls reports/<TARGET>-Audit_v1.md"
    expect: "report exists"
  - cmd: "grep -c 'CRITICAL' reports/<TARGET>-Audit_v1.md"
    expect: "0 unfixed"
  - cmd: "node deploy/battery/validate-cards.mjs cards/"
    expect: "FAIL count 0"
nl_prompt: "adversarial audit of <TARGET>; hostile reviewers + 3-juror judge + security panel; every verdict on disk; report names residuals honestly"
success_criteria:
  - all panels wrote artifacts; zero unfixed criticals; validator green
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | sweep | js | §2.research | card pinned | findings.json |` → `| 2 | adversarial | js | §2.panels | findings.json | 5/5 verdicts on disk |` → `| 3 | judge | js | §2.panels | adversarial green | 3/3 audit verdicts |` → `| 4 | report | compose | §3.next | judge green | report exists |`.
Panels: 5-hostile adversarial + 3-juror audit (§37 P1/P2) — the audit card SHIPS findings, so §5 report gate is the delivery.
Lesson: an audit card has no build phases — its "world change" is the verdict artifacts + the report; §0 ls-gates ALL of them.
Lesson: findings that are opinions are invisible; findings with `where/what/severity` fields are re-runnable facts.

### C4. research-card — survey with corpus + log + report artifacts
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/research-<topic>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls docs/research/<topic>.json"
    expect: "corpus exists"
  - cmd: "ls docs/research/<topic>.tsv"
    expect: "log exists"
  - cmd: "ls docs/research/<topic>.md"
    expect: "report exists"
  - cmd: "grep -c 'source:' docs/research/<topic>.json"
    expect: "10"
  - cmd: "bash -c 'test -s docs/research/<topic>-failures.log && echo FAILURES LOGGED'"
    expect: "FAILURES LOGGED"
  - cmd: "ls .panels/docs-verdicts.json"
    expect: "3/3 verdicts present"
nl_prompt: "survey <TOPIC>; corpus on disk; every query logged incl. failures; report cites sources; docs panel passes"
success_criteria:
  - >=10 sourced corpus entries; failure log non-empty; report complete
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | gather | js | §2.research | card pinned | corpus json |` → `| 2 | log | js | §2.research | corpus | tsv log |` → `| 3 | report | compose | §3.next | log green | report exists |` → `| 4 | verify | js | §2.smoke | report | all §0 green |`.
Research phases tolerate long silences — calibrate no-progress K higher (see §38 calibration table).
Lesson: failures are DATA in a research card — the log's FAIL lines are a gated artifact, not shame.
Lesson: `expect: "logged"` on a FAIL-count pair is legal because the command's output embeds the count; pin the format, not the number.

### C5. deploy-card — install the substrate into a clean target and prove it
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/deploy-<target>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "node deploy/battery/deploy-proof.mjs"
    expect: "clean target verified"
  - cmd: "node machinery/run-smoke.mjs ."
    expect: "\"ok\": true"
  - cmd: "ls deploy/DEPLOY.sh"
    expect: "installer exists"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "grep -rEn 'ghp_[A-Za-z0-9]{20,}' deploy/ || true"
    expect: "no output"
nl_prompt: "install the substrate into <TARGET> via DEPLOY.sh; prove the install with the deploy proof and an in-target smoke"
success_criteria:
  - clean-target proof green; smoke ok in target; zero token shapes in deploy surface
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | installer | compose | §3.tdd | card pinned | DEPLOY.sh green |` → `| 2 | proof | js | §2.smoke | installer | deploy-proof green |` → `| 3 | verify | js | §2.smoke | proof | all §0 green |`.
The deploy proof IS the reference deploy pair: `mkdtemp` clean target → install → 8-file existence sweep → in-target smoke (deploy/battery/deploy-proof.mjs:12-36).
Lesson: deploy proof means CLEAN-TARGET proof — an install that only works over an existing tree is not proven.
Lesson: the in-target smoke closes the loop — the target must boot the substrate, not merely contain its files.

### C6. migration-card — byte-exact canon move with diff discipline
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/migrate-<name>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls <OLD>/bible.md <OLD>/build.md"
    expect: "canon files present"
  - cmd: "ls <NEW>/docs/bible.md <NEW>/docs/build.md"
    expect: "migrated files exist"
  - cmd: "diff <OLD>/bible.md <NEW>/docs/bible.md"
    expect: "no output"
  - cmd: "sha256sum <NEW>/docs/bible.md"
    expect: "recorded"
  - cmd: "ls docs/migration-report.md"
    expect: "report exists"
  - cmd: "git status --porcelain"
    expect: "only intended paths"
nl_prompt: "migrate <OLD> canon into <NEW>; byte-exact where canon; every intentional delta listed in the migration report"
success_criteria:
  - canon byte-identical; deltas enumerated; report on disk
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | inventory | js | §2.research | card pinned | file list |` → `| 2 | move | js | §2.migrate | inventory | files present |` → `| 3 | verify | js | §2.smoke | move | diff clean |` → `| 4 | report | compose | §3.next | verify | report exists |`.
Lesson: canon pairs are `diff`-empty pairs — "byte-exact" is a command outcome, not a promise in prose.
Lesson: the migration report exists to name DELTAS; a migration whose report lists zero deltas must also show zero `git status` noise.

### C7. cadence-card — loop-driven drift watch (paired with /loop outside the card)
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/watch-<service>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "curl -s <HEALTH>"
    expect: "200"
  - cmd: "ls docs/watch/<service>-state.json"
    expect: "state exists"
  - cmd: "ls docs/watch/<service>-journal.log"
    expect: "journal exists"
  - cmd: "bash -c 'grep -c DRIFT docs/watch/<service>-journal.log | awk \"{print \\\"DRIFT COUNT: \\\" \\$1}\"'"
    expect: "DRIFT COUNT:"
  - cmd: "ls .panels/perf-verdicts.json"
    expect: "3/3 verdicts present"
nl_prompt: "watch <SERVICE> on the registered cadence; every beat journaled; drift routes through §6; report on demand"
success_criteria:
  - health green; state + journal maintained; drift count honest
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | probe | js | §2.probe | card pinned | health checked |` → `| 2 | journal | js | §2.journal | probe | journal appended |` → `| 3 | triage | js | §2.triage | journal | drift routed or none |`.
The cadence itself is NOT in the card — `/loop` (outside, operator surface) re-fires the pin; the card is one beat's contract.
Lesson: a watch card gates the BEAT (health, journal, state), never the calendar — the loop owns recurrence.
Lesson: drift pairs count honestly (`|| true` keeps the command alive at zero) — a watch that cannot report "0 drifts" is broken.

### C8. review-card — three-verdict review of a diff range
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/review-<range>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls .review/verdicts.json"
    expect: "3 verdicts"
  - cmd: "grep -c 'CRITICAL' .review/verdicts.json"
    expect: "0"
  - cmd: "ls .review/diff.json"
    expect: "range snapshot exists"
  - cmd: "ls docs/reviews/<range>.md"
    expect: "review report exists"
  - cmd: "git log --oneline -1"
    expect: "commit exists"
nl_prompt: "three-verdict review of <DIFF RANGE>; fresh jurors, evidence-only; zero unresolved criticals before close"
success_criteria:
  - 3 schema verdicts on disk; criticals zero or fixed; report cites the range
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | snapshot | js | §2.snapshot | card pinned | diff.json |` → `| 2 | jury | js | §2.panels | snapshot | 3/3 verdicts |` → `| 3 | close | compose | §3.next | jury green | report exists |`.
Jurors get the diff snapshot + the spec — never the implementer's narrative (independence law, §37).
Lesson: `grep -c 'CRITICAL' ... expect "0"` is the close gate — criticals are either fixed or the card does not close.
Lesson: the diff snapshot artifact makes the review REPLAYABLE — a verdict against an unpinned range judges smoke.

### C9. refactor-card — behavior-neutral restructure proven by battery
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/refactor-<unit>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "node --test tests/"
    expect: "0 fail"        # baseline — runs at phase 1 entry
  - cmd: "node --test tests/"
    expect: "0 fail"        # post — re-run cold at final verification
  - cmd: "git diff --stat"
    expect: "src only"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "grep -rEn ': any' src/<unit>/ --include='*.ts' || true"
    expect: "no output"
nl_prompt: "refactor <UNIT>; behavior identical; baseline and post batteries both green cold; diff confined to src/<unit>"
success_criteria:
  - battery green before and after; no test edits; diff scoped; type-any count honest
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | baseline | js | §2.snapshot | card pinned | baseline green |` → `| 2 | restructure | compose | §3.tdd | baseline | battery green |` → `| 3 | verify | js | §2.smoke | restructure | all §0 green |`.
The refactor tdd loop is test-PRESERVING: existing tests are the contract; adversarial cases stress the seams the restructure touched.
Lesson: "behavior-neutral" is proven by the PAIR (baseline green, post green) run cold — one green run proves nothing about neutrality.
Lesson: scope the diff in §0 (`git diff --stat` expect) or the refactor will quietly eat neighbors.

### C10. release-card — audit-PASS-or-no-ship release
Fork: `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/release-<version>_v1.md`
```markdown
## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "grep -rEn 'ghp_[A-Za-z0-9]{20,}' . || true"
    expect: "no output"
  - cmd: "ls Ship_Packages/<project>/PACKAGE_AUDIT.md"
    expect: "verdict PASS"
  - cmd: "node deploy/battery/validate-cards.mjs cards/"
    expect: "FAIL count 0"
  - cmd: "node machinery/run-smoke.mjs ."
    expect: "\"ok\": true"
  - cmd: "git log --oneline -1"
    expect: "release commit"
  - cmd: "git remote -v"
    expect: "origin public"
  - cmd: "ls docs/RELEASE_NOTES_<VERSION>.md"
    expect: "notes exist"
nl_prompt: "release <VERSION>; secret scan clean; package audit PASS; validator + smoke green cold; notes on disk; then commit + push"
success_criteria:
  - every §0 pair green cold; no ship on any red; notes honest
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.
```
§1 shape: `| 1 | scan | js | §2.secrets | card pinned | zero tokens |` → `| 2 | package | compose | §3.next | scan | audit PASS |` → `| 3 | verify | js | §2.smoke | package | all §0 green |` → `| 4 | ship | compose | §3.next | verify | commit + push |`.
§5 ships through the SPG gates — the release card adds the SECRET pair and the PUBLICATION pair on top.
Lesson: publication (`git remote -v`) is a gated pair — "it's on GitHub" must be an output substring, never a belief.
Lesson: the release card is the strictest §0 in the cookbook — it re-gates the whole battery cold before the push phase may run.

Cookbook close: the ten fragments share one skeleton and differ in §0 vocabulary + phase order — that is the design. Fork, fill §0 FIRST (phases need exit gates), then slots, then §1, then §6 routing, validate, smoke, pin (the goalmode-card skill's forced order).

### 35.11 The per-card fork-fill-validate checklist (the ten archetypes, command by command)
Each archetype's forced order (the goalmode-card skill's dependency order: §0 first — phases need exit gates — then slots, then §1, then §6) with the archetype-specific commands that prove each step. The checklist is the cookbook's operational layer: fork, fill, validate, smoke, pin — per card.

C1 docs-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/docs-<doc>_v1.md`
2. Fill §0 with the 7 pairs (spec ls, anchor grep, chapter ls, section grep, panel ls, floor wc, residue grep).
3. Write §1: research -> draft -> verify (engines js/compose/js).
4. `node deploy/battery/validate-cards.mjs cards/` — expect `FAIL count 0`.
5. `node machinery/run-smoke.mjs .` — expect `"ok": true`.

C2 bugfix-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/fix-<bug>_v1.md`
2. Fill §0 with the 6 pairs (repro ls, repro run, battery, diff stat, panel ls, marker grep).
3. Write §1: repro -> fix -> verify; the tdd slot's RED must be the regression test itself.
4. Validate + smoke (same two commands as C1 step 4-5).
5. Pin only after `git diff --stat` confirms the scoped blast radius.

C3 audit-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/audit-<target>_v1.md`
2. Fill §0 with the 6 pairs (adversarial ls, audit ls, security ls, report ls, criticals grep, validator).
3. Write §1: sweep -> adversarial -> judge -> report (no build phases — findings ARE the product).
4. Validate + smoke.
5. Confirm `.panels/` paths in §0 EXACTLY match §4's declared artifact paths.

C4 research-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/research-<topic>_v1.md`
2. Fill §0 with the 6 pairs (corpus ls, log ls, report ls, source count, failures echo, panel ls).
3. Write §1: gather -> log -> report -> verify; raise no-progress K per §38.8.
4. Validate + smoke.
5. Pin with a generous deadline — research tolerates silence, not stall.

C5 deploy-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/deploy-<target>_v1.md`
2. Fill §0 with the 5 pairs (deploy-proof, smoke, installer ls, panel ls, token-shape grep).
3. Write §1: installer -> proof -> verify — the proof runs in a mkdtemp CLEAN target.
4. Validate + smoke.
5. Run `node deploy/battery/deploy-proof.mjs` once by hand before pinning — the card re-proves it cold.

C6 migration-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/migrate-<name>_v1.md`
2. Fill §0 with the 6 pairs (old ls, new ls, canon diff, sha256, report ls, status porcelain).
3. Write §1: inventory -> move -> verify -> report.
4. Validate + smoke.
5. Pin only when `git status --porcelain` shows the intended paths and nothing else.

C7 cadence-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/watch-<service>_v1.md`
2. Fill §0 with the 5 pairs (health curl, state ls, journal ls, journal floor, perf panel ls).
3. Write §1: probe -> journal -> triage.
4. Register the cadence OUTSIDE the card (`/loop` — the loop owns recurrence; the card owns one beat).
5. Validate + smoke; pin; the loop re-fires the pin.

C8 review-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/review-<range>_v1.md`
2. Fill §0 with the 5 pairs (verdicts ls, criticals grep, snapshot ls, report ls, git log).
3. Write §1: snapshot -> jury -> close.
4. Validate + smoke.
5. Pin — jurors get the snapshot, never the implementer's narrative.

C9 refactor-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/refactor-<unit>_v1.md`
2. Fill §0 with the 5 pairs (battery baseline, battery post, diff stat, panel ls, type-any grep).
3. Write §1: baseline -> restructure -> verify; existing tests are the contract — no test edits.
4. Validate + smoke.
5. Pin — the baseline pair gates phase 1's entry; the cold final re-proves both battery pairs.

C10 release-card checklist:
1. `cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/release-<version>_v1.md`
2. Fill §0 with the 7 pairs (secret scan, package audit, validator, smoke, git log, remote, notes ls).
3. Write §1: scan -> package -> verify -> ship (ship LAST, panels-green-gated).
4. Validate + smoke + deploy proof — the release card re-gates the whole battery.
5. Pin — and remember: audit PASS or no ship; the deadline never outranks the audit verdict.

### 35.12 The pair-to-archetype matrix (which §0 pair shapes each cookbook card uses)
| archetype | existence | count | battery | schema | smoke | deploy | secret | history | publication | anchor | artifact | floor | diff | health | echo-token |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 docs | x | x | - | x | - | - | - | - | - | x | x | x | - | - | x |
| C2 bugfix | x | x | x | - | - | - | - | - | - | - | x | - | - | - | - |
| C3 audit | x | - | x | x | - | - | - | - | - | - | x | - | - | - | - |
| C4 research | x | x | - | - | - | - | - | - | - | - | x | - | - | - | x |
| C5 deploy | x | - | - | - | x | x | x | - | - | - | x | - | - | - | - |
| C6 migration | x | - | - | - | - | - | - | - | - | - | - | - | x | - | - |
| C7 cadence | x | x | - | - | - | - | - | - | - | - | x | - | - | x | x |
| C8 review | x | x | - | - | - | - | - | x | - | - | x | - | - | - | - |
| C9 refactor | x | x | x | - | - | - | - | - | - | - | x | - | x | - | - |
| C10 release | x | - | x | x | x | - | x | x | x | - | x | - | - | - | - |
Reading: every archetype grounds on existence pairs (the artifact must EXIST before it can be judged); release cards carry the widest spread — a release re-gates the whole vocabulary. The shapes are the §36.6 catalog's columns.

### 35.13 The cookbook anti-pattern gallery (what the ten fragments deliberately avoid)
1. Prose gates ("feels done") — unjudgeable; F1.
2. Comparison expects on output that never prints them — pin what the command PRINTS (F3).
3. Chained gates hiding the failing half — one command per pair (F5).
4. Counting pipes that print nothing grep -c would not — the awk/echo wrapper only when the count itself is the claim.
5. Parenthetical pseudo-commands ("node --test tests/ (baseline)") — a gate command must be RUNNABLE verbatim; distinguish runs by phase entry, not by prose in the command.
6. Drift-count gates that fail the watch when drift exists — a watch REPORTS drift (journal floor pair), it does not gate drift to zero.
7. Panels ls'd under a path §4 never declared — paths must match EXACTLY (§37.11 #9).
8. ESCALATE anywhere but last (F18).
9. §0 mutation of any kind — gates observe (F4).
10. Floors written as wishes ("comprehensive") — floors are numbers or they are nothing.
Each gallery row traces to a worked pair (F1-F30) or a §36 illegal shape — the cookbook avoids them by construction; this gallery is why.

## 36. §2/§3/§4/§5/§6 FIELD REFERENCES EXPANDED

§18-§24 gave the per-line anatomy (required fields, shapes). §36 expands each section with the COMPLETE field inventory, the LEGAL shape space, the ILLEGAL shape space WITH the exact mechanical detector each illegal shape trips (validator error string, smoke evidence key, battery law, or kernel behavior — named precisely, because "the validator will complain" is not a mechanical claim), and a worked legal/illegal fragment pair. The validator (deploy/battery/validate-cards.mjs) checks section presence + §0 balance for goalmode-v1; everything deeper is enforced by the battery (bridge-tests.mjs), the smoke (machinery/run-smoke.mjs), and the kernel loop — §36 maps every field to ITS enforcer.

Detector legend used below:
- `[V]` = deploy/battery/validate-cards.mjs emits the quoted string (exit 1).
- `[S]` = machinery/run-smoke.mjs / gm-smoke.js — smoke fails, evidence names the card.
- `[B]` = deploy/battery/bridge-tests.mjs pins the law (10/10).
- `[K]` = kernel loop behavior at run time (null, route engagement, judge hold).
- `[J]` = the judge re-running a §0 pair cold at a gate.

### 36.1 §2 JS WORKFLOW SLOTS — expanded

| field | required | legal shape | notes |
|---|---|---|---|
| slot: | yes | unique name, in-card namespace | §1 rows reference it as §2.<name> |
| card: | yes | path/name of a js-workflow-v1 document | its meta.name is the workflow identity |
| args: | yes | compact JSON object, same line | becomes the sandbox `args` global; dataflow entry (pipe law [B]) |
| fail_route: | yes | `retry(2) -> §6.<ROUTE_*>` | engages on null/{ok:false} after 2 re-dispatches [K] |

Legal shape space: one row per slot, continuation line for fail_route, args JSON compact (no newlines inside). Multiple slots legal; dormant slots (no §1 ref) legal but flagged as a smell.
Illegal shapes and their exact detectors:

| illegal shape | detector | exact message / behavior | fix |
|---|---|---|---|
| missing slot/card/args/fail_route field | none (validator does not parse §2 rows) | silent until dispatch — then kernel null [K] | author discipline + smoke |
| [FILL] left in a non-master card | [S] | `non-master card still carries [FILL] slots` → {ok:false} | fill the card |
| card: points at a doc without `export default async function` | [V] on that doc | `no default export` | fix the workflow card |
| card: doc missing meta.name | [V] on that doc | `meta.name missing` | name the workflow |
| card: doc missing meta.description | [V] on that doc | `meta.description missing` | describe it |
| args JSON spans lines | kernel arg parse | malformed args at dispatch [K] | keep args on one line |
| duplicate slot name in one card | none mechanical | second mount shadows first — undefined behavior | unique names |
| fail_route names a route absent from §6 | [K] at route fire | route.match(sig) → null, caller escalates | declare the route in §6 |

Legal fragment (from cards/examples/BUILD_TETRIS_v1.md §2, validator PASS):
```markdown
## §2 JS WORKFLOW SLOTS
- slot: research  card: JS_WORKFLOW_CARD  args: {mode: topic-survey}
  fail_route: retry(2) -> §6.ROUTE_DEBUG
- slot: smoke  card: JS_WORKFLOW_CARD  args: {target: tetris}
  fail_route: retry(2) -> §6.ROUTE_DEBUG
```
Illegal fragment (three violations — [FILL] leak, multiline args, dangling route):
```markdown
## §2 JS WORKFLOW SLOTS
- slot: research  card: [FILL]  args: {
    mode: topic-survey
  }
  fail_route: retry(2) -> §6.ROUTE_HELP
```
Observed proof: smoke evidence `cards/<this>.md: non-master card still carries [FILL] slots` → `{ok:false}`; multiline args + ROUTE_HELP surface as kernel-side null/route-null at first dispatch [K] — the smoke [S] fires FIRST because it is in the battery.

### 36.2 §3 COMPOSE FUNCTION SLOTS — expanded

| field | required | legal shape | notes |
|---|---|---|---|
| slot: | yes | unique name, in-card namespace | §1 rows reference §3.<name> |
| card: | yes | COMPOSE_TDD_CARD or COMPOSE_NEXT_CARD (or fork) | family compose-function-v1 |
| trigger: | yes | explicit invocation declaration | IS the explicit request compose-next demands |
| micro_loop: | tdd rows | `red -> green -> refactor` | the tdd discipline per unit |
| fail_route: | yes | `2 failed fixes -> stop patching -> ROUTE_DERIVE` | two-strikes law |

Legal shape space: exactly two families may be named — tdd and next (~ NOT all, master §3 comment). A next slot does not carry micro_loop (its phases own the loop); a tdd slot does.
Illegal shapes and their exact detectors:

| illegal shape | detector | exact message / behavior | fix |
|---|---|---|---|
| card: names a non-compose family | [V] on that doc | `unknown family "<X>"` or js checks misfire | name a compose-function-v1 doc |
| compose doc missing `function:` | [V] on that doc | `function: missing` | declare compose:tdd or compose-next |
| compose doc with neither micro_loop: nor phases: nor contract | [V] on that doc | `no contract body` | add the contract body |
| compose-next mounted under a mode != build card | contract boundary | skill requires Build agent — slot cannot discharge [K] | set frontmatter mode: build |
| trigger omitted (implicit "whenever") | none mechanical | next's explicit-request precondition unmet [K] | write the trigger line |
| micro_loop on a next slot | contract mismatch | the 8-phase contract ignores it — author confusion | delete; phases carry the loop |
| tdd fail_route missing two-strikes | none mechanical | infinite patch loop risk [K] | `2 failed fixes -> ROUTE_DERIVE` |

Legal fragment (from cards/GOAL_REPO_BUILD_v1.md §3, validator PASS):
```markdown
## §3 COMPOSE FUNCTION SLOTS
- slot: tdd  card: COMPOSE_TDD_CARD  trigger: every executable artifact
  micro_loop: red -> green -> refactor
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs + ship phases
```
Illegal fragment (family confusion + implicit trigger):
```markdown
## §3 COMPOSE FUNCTION SLOTS
- slot: build  card: JS_WORKFLOW_CARD  trigger: (implicit)
  micro_loop: red -> green -> refactor
```
Observed proof: JS_WORKFLOW_CARD is js-workflow-v1 — run through the validator it emits `no default export`-class confusion only when its own body is checked; the CARD-side ill legality is semantic (family mismatch), caught by review/panel, not [V] — which is exactly why §3 law says "tdd / next (~ NOT all)" in the master.
Cross-reference: compose contracts verbatim in §15-§16 of the shell bible appendix set (APPENDIX D2/D3 — the macro and micro library canon).

### 36.3 §4 REVIEW PANELS — expanded

| field | required | legal shape | notes |
|---|---|---|---|
| adversarial_panel: | >=1 per card | `parallel() of N hostile reviewers, schema: {verdict, findings[]}` | N odd, 3 minimum (§25) |
| audit_judge_panel: | high-stakes cards | `3-juror on testing data, majority verdict` | evidence-only |
| final_verification: | every card | `re-run §0 cold, no cached results` | the cold-final law (P11) |

Legal shape space: panels are DATA — every panel names its schema and its artifact lands on disk (§37 is the full catalog). The panel section may add custom panels (security/docs/perf — §37 P4-P6) with the same schema+artifact discipline.
Illegal shapes and their exact detectors:

| illegal shape | detector | exact message / behavior | fix |
|---|---|---|---|
| panel with no schema (prose review) | panel law | agent-typeable pass = circular — a competent judge rejects it; adversarial panel findings[] flags | pin the schema |
| verdicts kept in chat, no artifact | [J] on the §0 ls pair | `ls .panels/adversarial-verdicts.json` → no such file → pair FAILS | write artifacts |
| even juror count | [K] at majority | 2-2 deadlock — no majority; route engages | odd n |
| final_verification reading cached green | cold-final law | stale green ships fiction — judge re-runs cold by contract | never cache |
| panel reads implementer narrative | independence law | verdict contaminated — audit panel flags non-evidence sourcing | evidence-only briefing |
| FAIL verdict with no fix loop bound | route law | fix loop unbounded or dead-ends | `FAIL -> fix(2) -> ROUTE_DERIVE` |

Legal fragment (from cards/examples/BUILD_TETRIS_v1.md §4, validator PASS):
```markdown
## §4 REVIEW PANELS
- adversarial_panel: 3 hostile players, schema {verdict, findings},
  plays the game, hunts stuck-piece/rotation/clear bugs
- final_verification: re-run §0 cold, no cached results
```
Illegal fragment (no schema, no artifact path, cached final):
```markdown
## §4 REVIEW PANELS
- adversarial_panel: reviewers look it over and approve
- final_verification: reuse the earlier green results
```
Observed proof: `ls .panels/adversarial-verdicts.json` at [J] → file absent → §0 pair FAILS cold; the "reuse earlier green" line violates P11 — the judge's cold re-run is kernel behavior, not card-negotiable [K].

### 36.4 §5 SHIP GATES — expanded

| field | required | legal shape | notes |
|---|---|---|---|
| ship: | yes | /ship-package (SPG v4 phases A-I) or the card's concrete ship chain | Phase A docs-current FIRST |
| report: | yes | /engineering-report -> reports/{SERIES}_v{N}.md (or README-as-report) | chat + disk, series-scoped |

Legal shape space: ship gates name DELIVERY MACHINERY, not outcomes — "/ship-package" and "/engineering-report" are the canon pair; release cards add the concrete git chain (scan → commit → push) as phases, with §0 pairs gating each.
Illegal shapes and their exact detectors:

| illegal shape | detector | exact message / behavior | fix |
|---|---|---|---|
| ship before panels green | gate order law | ship phase's §1 entry cannot be satisfied [K]; violating it ships unaudited work | panels first |
| report: omitted | [V] never checks §5 fields | silent — the delivery loses its memory; review flags | add report gate |
| ship: as a wish ("ship it when ready") | [J]/[K] | no executable behind it — phase exit unbalanceable | name the machinery |
| audit verdict overridden by deadline | SPG law | audit verdict OUTRANKS deadlines — override is a spec violation | fix the findings |
| report not on disk | [J] on reports/ ls pair | pair FAILS cold | write the file |

Legal fragment (from cards/GOAL_REPO_BUILD_v1.md §5, validator PASS):
```markdown
## §5 SHIP GATES
- ship: git secret-scan -> commit -> public push
- report: README.md IS the engineering report + master blueprint
```
Illegal fragment (outcome-wish, no machinery, no report):
```markdown
## §5 SHIP GATES
- ship: when everything looks good, release it
```
Observed proof: no [V] error — §5 field legality is order+machinery law; the judge holds at the phase whose exit cannot balance, and the report pair `ls reports/...` FAILS at [J].

### 36.5 §6 RECOVERY + ROUTING — expanded

| field | required | legal shape | notes |
|---|---|---|---|
| stuck_signatures: | yes | `no-progress K | same-fail 2x | null-rate >30% | phase deadline` | card-calibratable K |
| routes (in order): | yes | the 6-route ladder, DEBUG first, ESCALATE last | order IS dispatch order [K] |
| compaction: | yes | `reload this card; re-enter last incomplete §1 phase` | + head sha-verify on resume |

Legal shape space: signatures are the four canon ones (K card-calibrated); routes are the six canon names in ladder order; the compaction line is mandatory in every goalmode-v1 card.
Illegal shapes and their exact detectors:

| illegal shape | detector | exact message / behavior | fix |
|---|---|---|---|
| ESCALATE first or mid-ladder | route law (P6) | autonomy killed — the kernel journals it as an order violation; planned [V] order check (v2) | reorder ladder |
| route names not in the canon six | [K] | route.match(sig) → null → caller escalates outside the card | use canon routes |
| stuck_signatures omitted | [K] | no trap registration — stuck loops run to deadline | declare signatures |
| compaction line omitted | resume law | post-compaction agent re-asks settled questions — drift | add the line |
| routes declared but never journaled | journal law | the 3-failure ESCALATE counter reads the journal — empty journal = ESCALATE never legally fires | journal every attempt |
| signature thresholds copied between phases blindly | calibration law | research phases starve (K too low) or build phases stall (K too high) | per-phase calibration (§38) |

Legal fragment (from cards/examples/BUILD_TETRIS_v1.md §6, validator PASS):
```markdown
## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
- compaction: reload this card; re-enter last incomplete §1 phase
```
Illegal fragment (ESCALATE first, unknown route, no compaction):
```markdown
## §6 RECOVERY + ROUTING (v2)
- routes: ROUTE_ESCALATE -> ROUTE_HELP -> ROUTE_DEBUG
```
Observed proof: ESCALATE-first is the autonomy-killing anti-pattern (F13); ROUTE_HELP is outside the canon six → route.match returns null at [K]; missing compaction line surfaces at the first compaction as re-ask drift (P7 of the shell bible's procedures). Bridge law pinned at [B]: `trap routing` test registers no-progress→ROUTE_DEBUG and same-fail→ROUTE_SPLIT and asserts route.match resolves both — unknown signatures return null by construction (gsh.js:48).

### 36.6 §0/§1 supplementary expansions (the two judge-side sections, completed to the same depth)
§36.1-§36.5 covered the §2-§6 fields per the section contract; the judge-side sections complete here because their illegal shapes have the sharpest failure modes (they are the halt vocabulary).

§0 expanded — the field-level shape space:
| field | required | legal shape | detector for the illegal cousin |
|---|---|---|---|
| outer_success: | yes | list opener, first line of the contract | [V] `§0 has no cmd pairs` when pairs live outside |
| - cmd: | per pair | ONE shell command, runnable cold from repo root, non-interactive | [K] hang at deadline -> null |
| expect: | per pair | output SUBSTRING the command's own output contains | [V] `§0 cmd/expect mismatch N/M`; [B] run gate polarity |
| nl_prompt: | yes | 1-3 sentences, WHAT + evidence shape, never HOW | [V] `§0 missing nl_prompt` |
| success_criteria: | yes | list; each line maps to >=1 pair | none mechanical — panel/review |
| anti_cheat: | yes | the canon line verbatim | none mechanical — review |

§0 pair-shape catalog (legal, all observed in this repo):
| shape | example pair | why it replays |
|---|---|---|
| existence | `ls path` / `expect: "spec exists"` | ls prints the path; the substring is in it |
| count | `grep -c 'S[0-9]' file` / `expect: "5"` | grep -c prints the bare count |
| battery | `<runner>` / `expect: "0 fail"` | runner prints the summary line containing it |
| schema | `node deploy/battery/validate-cards.mjs cards/` / `expect: "FAIL count 0"` | validator prints the summary line |
| smoke | `node machinery/run-smoke.mjs .` / `expect: "\"ok\": true"` | run-smoke prints pretty JSON |
| deploy | `node deploy/battery/deploy-proof.mjs` / `expect: "clean target verified"` | proof prints the verdict line |
| secret | `grep -rEn 'ghp_[A-Za-z0-9]{20,}' . \|\| true` / `expect: "no output"` | zero matches = empty output — the judge-side canon form (§16, §30-R10) |
| floor | `wc -l docs/*.md` / `expect: ">= 3000 lines each"` | the judge reads the comparison against the printed numbers — the live contract's form |
| echo-token | `bash -c 'test -s f && echo TOKEN'` / `expect: "TOKEN"` | the command PRINTS the token by construction — the airtight authoring pattern (F3) |
| history | `git log --oneline -1` / `expect: "commit exists on main"` | judge reads the line against the claim |
| publication | `git remote -v` / `expect: "origin points at public goalmode-cards repo"` | judge reads the remote line |

§1 expanded — the row-level shape space:
| column | legal values | illegal cousin | detector |
|---|---|---|---|
| # | unique integers, row order = execution order | duplicate numbers | review/panel (none mechanical in v1) |
| phase | short name | prose description | review |
| engine | `js` or `compose` (row 1 may be `shell` for operator-scaffold, live-contract precedent) | other tokens | [K] dispatch fails |
| slot | `§2.<name>` when engine js; `§3.<name>` when engine compose; `(done)` only for shell rows | cross-family refs; refs to §4/§0 | [K] null at resolution |
| entry | mechanical condition or `card pinned` | prose | [K] phase never starts |
| exit | mechanical condition referencing a §0-class check or slot token | prose ("looks good") | [K] gate unbalanceable |

### 36.7 Field interactions (the cross-section contracts — where fields reference each other)
| from | to | the contract | broken when |
|---|---|---|---|
| §1.slot | §2/§3.slot | every js row refs a §2 mount; every compose row refs a §3 mount | dangling ref -> [K] null (F6) |
| §2.fail_route | §6.routes | the named route exists in the ladder | route.match -> null -> escalate outside the card |
| §2.card | js doc meta.name | the referenced doc's meta.name is the workflow identity | name mismatch -> unmountable |
| §3.card | compose doc function: | tdd rows -> compose:tdd; next rows -> compose-next | family confusion (F13) |
| §3 (next) | frontmatter mode: | compose-next demands mode: build | skill cannot discharge (F25) |
| §4.artifact | §0 ls pair | the pair's path EQUALS the panel's artifact path | verdicts invisible to the judge (F15) |
| §4 schema | agent({schema}) | the declared shape is the validated shape | verdict null -> unit fails |
| §5 ship | §4 artifacts | ship's §1 entry references panel artifacts green | ship before green (F17) |
| §6.signatures | §2/§3 fail_routes | trip points feed the same ladder | unjournaled trips never count toward ESCALATE |
| §6.compaction | §1 rows | re-enter the LAST INCOMPLETE row | re-asking settled questions |
| §0 pairs | §1 exits | exits cite §0-class checks | prose exits (F7) |
Interaction law: a card is a CLOSED GRAPH — every reference resolves inside the same document; the validator checks presence, the battery checks mechanics, the kernel resolves the graph at run time.

### 36.8 §5/§6 shape-space completion (the delivery and recovery vocabularies, closed)
§5 legal ship-chain shapes (observed in this repo):
| shape | example | where canonized |
|---|---|---|
| SPG pair | `/ship-package (SPG v4 phases A-I)` + `/engineering-report -> reports/{SERIES}_v{N}.md` | GOALMODE master §5 |
| git chain | `git secret-scan -> commit -> public push` + README-as-report | GOAL_REPO_BUILD_v1 §5 |
| example pair | `/ship-package (SPG A-I)` + `reports/Tetris_Engineering_Report_v1.md` | BUILD_TETRIS_v1 §5 |
| audit report | findings report as the delivery (audit cards ship FINDINGS) | §35-C3 |
§6 route-ladder shapes:
| shape | legality | note |
|---|---|---|
| full six-rung ladder | always legal | the canon form — three live cards carry it verbatim |
| truncated ladder (DEBUG->DERIVE->ESCALATE) | legal for small cards | ESCALATE still LAST |
| single-rung (DEBUG only, no ESCALATE) | LEGAL BUT a smell | no operator ask path — small toys only |
| reordered middle rungs | legal only with a stated reason | DEBUG stays first; ESCALATE stays last |
| ESCALATE-first / unknown names | ILLEGAL | F18/F29 |
Signature-set shapes:
| shape | legality |
|---|---|
| the canon four (no-progress K, same-fail 2x, null-rate >30%, deadline) | always legal |
| card-calibrated K per phase class | legal — the §38.8 table is the reference |
| new signature kinds | card-level experiment only; kernel set is fixed (§32-Q24) |
| no signatures declared | ILLEGAL — F19 |

### 36.9 Validator-error -> section map (which §N each error implicates)
| error | section implicated | first suspect |
|---|---|---|
| `no frontmatter` | frontmatter | file starts with prose or BOM |
| `frontmatter missing <k>` | frontmatter | the fork was never filled |
| `missing section ## §N` | §N | heading reformatted or body truncated |
| `§0 has no cmd pairs` | §0 | wish-only contract |
| `§0 cmd/expect mismatch N/M` | §0 | one half of a pair lost/typoed |
| `§0 missing nl_prompt` | §0 | the PIN sentence dropped |
| `meta.name missing` | §2's mounted doc | workflow identity unnamed |
| `meta.description missing` | §2's mounted doc | anonymous binary |
| `no default export` | §2's mounted doc | entrypoint signature wrong |
| `function: missing` | §3's mounted doc | compose family undeclared |
| `no contract body` | §3's mounted doc | empty library card |
| `unknown family "<X>"` | frontmatter card: | the family literal typoed |
Reading: errors name the SECTION to open — fix the card at that anchor, re-run, and require the WHOLE battery green before calling the fix done (§39.6).

### 36.10 Args-and-returns reference (what flows in and out of every mount)
§2 args shapes (the sandbox `args` global):
| shape | example | note |
|---|---|---|
| mode object | `args: {mode: topic-survey}` | BUILD_TETRIS research slot |
| target object | `args: {target: tetris}` | BUILD_TETRIS smoke slot |
| dir object | `args: {dir: cards/}` | GOAL_REPO_BUILD smoke slot |
| nested JSON | `args: {filter: {ext: .ts}, limit: 8}` | compact, single line — multiline breaks the parse |
§2 return tokens (what the parent's fail_route reads):
| token | meaning | parent action |
|---|---|---|
| `{ok: true, ...}` | the binary proved its units | phase exit may balance |
| `{ok: false, failed[]}` | named unit failures | retry(2), then the slot's fail_route |
| `null` | hang/crash at the substrate boundary | counted in null-rate; retry(2), then route |
§3 return tokens (what the phase consumes):
| contract | returns | consumer |
|---|---|---|
| compose:tdd | `{tests: [names], evidence: [cmd outputs]}` | the phase's exit gate evidence |
| compose-next | `{spec_path, shas, verification_summary}` | the phase graph's later rows (verify/ship entries) |
Flow law: args flow IN as data (the pipe law), returns flow OUT as tokens — a mount whose return is not one of the table's tokens is not a legal mount return; the journal records what actually came back.

## 37. PANEL DESIGN DEEP-DIVE — the six-panel catalog, schemas, prompts, artifacts, majority rules

§25 gave the design guide (choose n, pin the schema, name the artifact). §37 is the full engineering catalog: six panel types a card's §4 may mount — build-review, audit-3juror, next-review, security, docs, perf — each with its complete JSON verdict schema, its juror prompt template, its artifact path, its majority rule, and its failure handling. The shell bible templates panels too (GOAL_SHELL_BIBLE §105 — 6/6 templated, the shell/kernel side); THIS catalog is the card-author's side: what goes IN the card's §4, what the artifact contract is, and what the judge ls-gates.

Panel laws in force (from §25/§36, restated as the catalog's invariants):
- Every verdict is a schema-validated object returned through agent({schema}) — a PASS the juror could type as free text is circular and void.
- Every panel writes its artifact to disk BEFORE the card may exit the phase — the §0 ls-pair gates it at the judge.
- Majority decides on odd n; FAIL verdicts bind the fix loop: fix(2) → ROUTE_DERIVE — never a third blind retry.
- Jurors receive EVIDENCE ONLY (diffs, artifacts, run outputs) — never the implementer's narrative.
- The final panel (final_verification) is not a juror — it re-runs §0 cold; no schema, no cache.

### P1. build-review — the adversarial build panel
| property | value |
|---|---|
| mounts in §4 as | `adversarial_panel: parallel() of N hostile reviewers` |
| n | 3 (default) / 5 (high-stakes); odd always |
| artifact path | `.panels/adversarial-verdicts.json` |
| majority rule | >n/2 verdicts PASS; any CRITICAL finding forces FAIL regardless of count |
| failure handling | FAIL → fix loop (max 2) → ROUTE_DERIVE (card §6) |
| §0 gate pattern | `ls .panels/adversarial-verdicts.json` / expect `3/3 verdicts present` |

Full verdict schema (pinned through agent({schema})):
```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["PASS", "FAIL"] },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "where": { "type": "string" },
          "what": { "type": "string" },
          "severity": { "type": "string", "enum": ["CRITICAL", "HIGH", "MEDIUM", "LOW"] }
        },
        "required": ["where", "what", "severity"]
      }
    }
  },
  "required": ["verdict", "findings"]
}
```
Juror prompt template (fill <TARGET>, <CLASS-LIST>, <EVIDENCE-PATHS>):
```markdown
You are a hostile reviewer. Your job is to BREAK <TARGET>, not to grade it.
1. Run it. 2. Read the diff against the spec anchors. 3. Hunt:
<CLASS-LIST — e.g. empty input, null returns, boundary conditions,
concurrency, error-path completeness, resource leaks>.
Evidence you may use: <EVIDENCE-PATHS>. You do NOT see the implementer's
notes. Return ONLY the schema object: verdict + findings[]
(where/what/severity). A finding without a where is not a finding.
```
Worked artifact (shape, from a tetris-class run):
```json
{ "panel": "build-review", "n": 3,
  "verdicts": [
    { "juror": 1, "verdict": "FAIL", "findings": [{ "where": "render.py:41", "what": "rotation loses the wall-kick offset", "severity": "CRITICAL" }] },
    { "juror": 2, "verdict": "PASS", "findings": [] },
    { "juror": 3, "verdict": "FAIL", "findings": [{ "where": "engine.py:12", "what": "empty bag on first spawn", "severity": "HIGH" }] } ],
  "majority": "FAIL", "fix_loop": 1 }
```

### P2. audit-3juror — the audit judge panel on testing data
| property | value |
|---|---|
| mounts in §4 as | `audit_judge_panel: 3-juror on testing data, majority verdict` |
| n | 3, fixed — the three-juror pattern (fact-check lineage) |
| artifact path | `.panels/audit-verdicts.json` |
| majority rule | 2/3; a juror who cannot verify evidence votes FAIL, never abstains |
| failure handling | FAIL → the audited claim re-opens; fix loop bound 2 → ROUTE_DERIVE |
| §0 gate pattern | `ls .panels/audit-verdicts.json` / expect `3/3 verdicts` |

Full verdict schema:
```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["PASS", "FAIL"] },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "claim": { "type": "string" },
          "evidence_ref": { "type": "string" },
          "verdict": { "type": "string", "enum": ["VERIFIED", "REFUTED", "UNVERIFIABLE"] }
        },
        "required": ["claim", "evidence_ref", "verdict"]
      }
    }
  },
  "required": ["verdict", "findings"]
}
```
Juror prompt template (fill <CLAIM-LIST>, <TESTING-DATA>):
```markdown
You are audit juror <1|2|3>. You judge CLAIMS against TESTING DATA —
never against narratives. For each claim in <CLAIM-LIST>: locate the
evidence in <TESTING-DATA>, cite its path, and vote VERIFIED, REFUTED,
or UNVERIFIABLE. UNVERIFIABLE counts as REFUTED for the majority.
Return ONLY the schema object.
```
Attack-class diversity across the three jurors (independence, §25 #7): juror 1 replays the runs; juror 2 reads the artifacts against the spec; juror 3 re-derives the numbers (recounts, re-hashes, re-greps).

### P3. next-review — the compose-next review-phase panel
| property | value |
|---|---|
| mounts as | compose-next `review:` phase — `1 fresh subagent, 3 verdicts, criticals loop` |
| n | 1 fresh reviewer emitting 3 verdict classes (correctness / completeness / regression) |
| artifact path | `.review/verdicts.json` |
| majority rule | all three verdict classes must be non-critical to converge; criticals loop back to implement |
| failure handling | non-convergent review → impasse report — never force pass (compose-next fail_route) |
| §0 gate pattern | `ls .review/verdicts.json` / expect `3 verdicts` + `grep -c 'CRITICAL' ...` / expect `0` |

Full verdict schema:
```json
{
  "type": "object",
  "properties": {
    "correctness": { "type": "string", "enum": ["OK", "CRITICAL"] },
    "completeness": { "type": "string", "enum": ["OK", "CRITICAL"] },
    "regression": { "type": "string", "enum": ["OK", "CRITICAL"] },
    "findings": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["correctness", "completeness", "regression", "findings"]
}
```
Reviewer prompt template (fill <SPEC-PATH>, <DIFF>):
```markdown
Fresh review of <DIFF> against <SPEC-PATH>. You did not write this code.
Judge three axes: correctness (does it do what the spec says),
completeness (is every spec task covered), regression (what did it
break). Any axis with a blocking defect is CRITICAL — do not soften.
Return ONLY the schema object.
```
Non-convergence is a RESULT: the impasse report (what blocks, what was tried, what the operator must decide) is the honest output — forcing a pass is the banned move.

### P4. security — the secrets/attack-surface panel
| property | value |
|---|---|
| mounts in §4 as | `security_panel: N reviewers, token-shape + surface sweep` |
| n | 3; odd |
| artifact path | `.panels/security-verdicts.json` |
| majority rule | majority; ANY live token shape = FAIL regardless of majority |
| failure handling | FAIL → rotate + purge → re-scan (fix loop 2) → ROUTE_DERIVE |
| §0 gate pattern | `grep -rEn 'ghp_[A-Za-z0-9]{20,}' . \|\| true` / expect `no output` |

Full verdict schema:
```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["PASS", "FAIL"] },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "file": { "type": "string" },
          "line": { "type": "integer" },
          "shape": { "type": "string" },
          "live": { "type": "boolean" }
        },
        "required": ["file", "line", "shape", "live"]
      }
    }
  },
  "required": ["verdict", "findings"]
}
```
Juror prompt template (fill <SURFACE-LIST>):
```markdown
Security sweep of the working tree. Hunt token shapes
(ghp_[A-Za-z0-9]{20,} and kin), credential files, and the surfaces
<SURFACE-LIST> for over-broad permissions. A shape in history is a
finding with live:false; a shape in the tree is live:true and FAILS
the panel outright. Return ONLY the schema object.
```
Canon grounding: the live contract's secret pair was sharpened to token-SHAPE matching (`ghp_[A-Za-z0-9]{20,}`) — prose "no secrets" is not judgeable; a shape regex is.

### P5. docs — the anchors-and-honesty panel
| property | value |
|---|---|
| mounts in §4 as | `docs_panel: N reviewers on anchors, counts, structure` |
| n | 3; odd |
| artifact path | `.panels/docs-verdicts.json` |
| majority rule | majority; a fabricated count (stated != measured) is CRITICAL → FAIL |
| failure handling | FAIL → fix the doc (anchors/counts) → re-panel (fix loop 2) → ROUTE_DERIVE |
| §0 gate pattern | `grep -c '^## S[0-9]' docs/<doc>.md` / expect the pinned count |

Full verdict schema:
```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["PASS", "FAIL"] },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "section": { "type": "string" },
          "missing": { "type": "string" },
          "count_stated": { "type": "integer" },
          "count_measured": { "type": "integer" }
        },
        "required": ["section", "missing", "count_stated", "count_measured"]
      }
    }
  },
  "required": ["verdict", "findings"]
}
```
Juror prompt template (fill <DOC>, <FLOORS>):
```markdown
Docs panel for <DOC>. Check: spec anchors present and numbered
(S1..Sn), every claimed count measured by you (wc, grep -c), sections
in the spec's order, no TODO/TBD residue. A count you cannot reproduce
exactly is a finding with both numbers — stated AND measured.
Return ONLY the schema object.
```

### P6. perf — the budgets-and-complexity panel
| property | value |
|---|---|
| mounts in §4 as | `perf_panel: N reviewers on budgets, complexity, hot paths` |
| n | 3; odd |
| artifact path | `.panels/perf-verdicts.json` |
| majority rule | majority; any budget breached without an operator-waived note is FAIL |
| failure handling | FAIL → optimize or amend budget in spec (never silently) → re-panel |
| §0 gate pattern | `<timing/measurement command>` / expect the pinned budget substring |

Full verdict schema:
```json
{
  "type": "object",
  "properties": {
    "verdict": { "type": "string", "enum": ["PASS", "FAIL"] },
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "metric": { "type": "string" },
          "measured": { "type": "string" },
          "budget": { "type": "string" },
          "delta": { "type": "string" }
        },
        "required": ["metric", "measured", "budget", "delta"]
      }
    }
  },
  "required": ["verdict", "findings"]
}
```
Juror prompt template (fill <BUDGETS>, <MEASURE-CMDS>):
```markdown
Perf panel. Measure each metric with <MEASURE-CMDS>; compare against
<BUDGETS>. Report measured vs budget with the delta for every metric —
passing and failing alike. A breach is FAIL unless the spec carries an
operator-waived note naming it. Return ONLY the schema object.
```

### 37.7 Juror independence laws (the catalog's constitutional layer)
1. Evidence-only briefing: jurors receive artifact paths, diffs, run outputs — never the implementer's chat or notes.
2. Attack-class diversity: each juror owns a DIFFERENT attack class (play it / fuzz it / read it against spec; replay / read / re-derive) — three copies of one juror is one juror.
3. Fresh context: jurors are fresh subagents — no shared memory with the implementer within the panel phase.
4. No narrative verdicts: the schema is the ONLY return channel; prose verdicts are void and re-run.
5. No vote collusion: jurors emit independently into parallel() (jobs barrier — bridge law) before any majority read.
6. Abstention banned: a juror who cannot decide votes FAIL with an UNVERIFIABLE-class finding.

### 37.8 The artifact disk law
- Every panel names its artifact path in the card's §4; the judge's §0 ls-pair gates the file's existence cold.
- Artifacts are append-per-run (verdicts + majority + fix_loop count) — overwriting hides the fix loop's history.
- Artifact missing at the gate = the panel never happened — the pair FAILS; there is no "verdicts in chat" fallback (F5).
- The audit-3juror and security artifacts feed the ship gates: a red audit artifact blocks §5 regardless of chat claims.


### 37.9 Panel wiring in §1 (which phase carries which panel)
| card archetype | panel | §1 carrier | entry | exit |
|---|---|---|---|---|
| build cards (C2/C9/C10) | build-review (P1) | the verify phase | battery green | verdicts on disk + majority PASS |
| audit cards (C3) | build-review P1 + audit-3juror P2 | adversarial then judge phases | findings on disk | 5/5 then 3/3 verdicts |
| compose-next runs (C1/C4/C6) | next-review (P3) | the review phase (contract step 7) | implement converged | no CRITICAL remaining |
| any public-surface card | security (P4) | before ship | tree frozen | zero live token shapes |
| docs cards (C1/C4) | docs (P5) | verify phase | doc complete | anchors + measured counts PASS |
| perf-sensitive cards (C7) | perf (P6) | verify phase | budgets declared | measured <= budget |
Wiring law: a panel rides a §1 phase like any slot — its exit is the artifact pair; the final_verification line in §4 is NOT wired into §1 — the kernel runs it after the last phase, cold.

### 37.10 A worked panel run, end to end (P1 on a bugfix card)
Setup: the C2 bugfix card's verify phase dispatched build-review with n=3.
```
dispatch  jobs([juror1, juror2, juror3])            # parallel barrier — bridge law
juror1    brief: hunt error-path completeness       # attack class 1
juror2    brief: fuzz the boundaries                # attack class 2
juror3    brief: read the diff against the spec     # attack class 3
return    {verdict: "FAIL", findings: [{where: "tests/regression/x.test.ts:12",
           what: "repro asserts the symptom, not the fixed behavior",
           severity: "HIGH"}]}                      # schema-validated
majority  2 FAIL / 1 PASS -> FAIL; fix_loop = 1
fix       the repro rewritten to assert the contract; battery green
re-panel  fresh jurors (independence: new context, same attack classes)
return    3/3 PASS; artifact .panels/adversarial-verdicts.json written
gate      §0 pair `ls .panels/adversarial-verdicts.json` / `3/3 verdicts present` -> [J] green
journal   [phase=3] panel P1 majority PASS fix_loop=1 artifact=3 verdicts
```
The run is REPLAYABLE: the artifact records verdicts + majority + fix_loop; the journal records the gate tokens; a cold re-run of the pair re-verifies the file exists. Nothing in the chain required trust.

### 37.11 Panel anti-pattern catalog (the ten that recur)
| # | anti-pattern | why it fails | the fix |
|---|---|---|---|
| 1 | single-juror panel | no majority is possible | n >= 3, odd |
| 2 | empty/absent schema | agent-typeable pass = circular | pin the schema in §4 |
| 3 | panels reading the implementer's report | narrative contaminates verdicts | evidence-only briefing |
| 4 | verdicts in chat only | the judge's ls pair fails; nothing replayable | artifact on disk |
| 5 | even juror count | 2-2 deadlock routes needlessly | odd n |
| 6 | same attack class across jurors | three copies of one juror | class diversity per juror |
| 7 | fix loop without re-panel | the fix is never re-judged | re-panel after EVERY fix, count to 2 |
| 8 | third blind retry after 2 fails | the two-strikes law bans it | ROUTE_DERIVE |
| 9 | panel names a path the §0 pair does not | majority PASS invisible to the judge | paths must match EXACTLY |
| 10 | panel before the artifact exists | jurors judge vapor | panel rides AFTER the producing phase |

### 37.12 The artifact inventory (every panel artifact: path, producer, reader, gate)
| artifact | producer | reader | §0 gate pattern |
|---|---|---|---|
| .panels/adversarial-verdicts.json | build-review (P1) | the judge, the audit panel, ship gates | `ls ...` / `N/N verdicts present` |
| .panels/audit-verdicts.json | audit-3juror (P2) | the judge, ship gates | `ls ...` / `3/3 verdicts` |
| .review/verdicts.json | next-review (P3) | compose-next's review loop, the judge | `ls ...` / `3 verdicts` + criticals grep |
| .panels/security-verdicts.json | security (P4) | the judge, release ship gates | `ls ...` / `3/3 verdicts` + token grep |
| .panels/docs-verdicts.json | docs (P5) | the judge, docs cards' verify phase | `ls ...` / `3/3 verdicts present` |
| .panels/perf-verdicts.json | perf (P6) | the judge, cadence/verify phases | `ls ...` / `3/3 verdicts present` |
Inventory law: the artifact's path is a CONTRACT COORDINATE — it appears twice (§4's declaration, §0's ls pair) and the two appearances must be IDENTICAL strings; the inventory above is the naming canon.

### 37.13 Why three jurors (the majority mathematics, briefly)
- n=1: no majority exists — one reading is a ruling (banned).
- n=2: ties are mandatory under disagreement — 2-2 is not a verdict (banned).
- n=3: the smallest set with a decisive majority under full disagreement (2-1), and the smallest set that supports attack-class diversity (three distinct hunts).
- n=5: the high-stakes upgrade — two dissenters tolerated, still decisive (3-2).
- Larger n: diminishing returns — the fix loop (2) bounds the cost of a wrong majority better than more jurors bound the probability of one.
The three-juror pattern is the audit panel's FIXED n (the fact-check lineage); adversarial panels may range 3-5 but never even.

### 37.14 The panel prompt checklist (before dispatching any juror)
1. The brief names the TARGET (file/diff/artifact) — never a vibe.
2. The brief assigns ONE attack class — diversity across jurors is the design.
3. The brief lists the EVIDENCE PATHS the juror may read — and what it may NOT (narratives).
4. The brief demands the schema object as the ONLY return — no prose verdicts.
5. The brief states the finding discipline — where/what/severity (or the P2-P6 fields); a finding without a where is not a finding.
6. The brief warns the juror its verdict is MAJORITY-COUNTED and artifact-recorded — no performative leniency, no performative cruelty; verdicts are re-runnable facts.
Checklist use: copy per juror, fill the class + evidence paths, dispatch via jobs() — the parallel barrier collects all verdicts before the majority read.
## 38. ROUTING DESIGN DEEP-DIVE — the six routes, their protocols, journals, and calibration

§26 gave the design guide; §36.5 gave the field legality. §38 is the per-route protocol: for EACH route — the trigger signature it answers, its numbered protocol steps, its exit condition, its journal line format, and a worked case with the journal lines filled. The shell bible's route playbook (GOAL_SHELL_BIBLE §40) carries the shell/kernel side; this section is the CARD author's side — what the card's §6 must declare and what the journal must record so the ESCALATE counter can read it.

Ladder-order laws (in force, from P6/§36.5):
1. Routes fire in the card's declared order — the ladder IS the dispatch order.
2. ESCALATE is last, always; it fires only after 3 LOGGED route failures — the counter reads the journal, so an unjournaled attempt never happened.
3. Routes fix the WORLD, never the CONTRACT — no route may edit §0; §0 amendments are operator-owned (git-visible).
4. Every route attempt journals one line — format per route below; a route without its journal line is a silent skip (the failure class the async law bans).
5. A route that clears the signature hands control BACK to the phase loop; a route that cannot clear it engages the next ladder rung.
6. trap() registration is the mechanism (gsh.js:47; pinned at bridge-tests `trap routing`) — route.match(sig) resolves the name; unknown signature → null → the caller escalates outside the card.

### 38.1 ROUTE_DEBUG — mechanism fix (cheapest first)
| property | value |
|---|---|
| trigger signature | same-fail 2x (the identical error twice), or a named mechanism fault |
| protocol | 1. Freeze the failing input (smallest repro). 2. compose:debug RCA — reproduce → isolate → rank suspects → root cause. 3. Apply the smallest fix. 4. Re-run the phase's exit gate. 5. Journal. |
| exit condition | phase exit gate passes with the fix in place; signature cleared |
| journal line format | `[ROUTE_DEBUG] sig=<sig> phase=<n> attempt=<k> rca=<one-line root cause> fix=<one-line change> exit=<cleared|failed>` |
| escalation on failure | attempt journaled as failed → ROUTE_DERIVE |

Worked case (journal filled — a flaky smoke):
```
[ROUTE_DEBUG] sig=same-fail phase=3 attempt=1 rca=run-smoke globbed cards/ relative to cwd not repo root fix=absolute root in run-smoke.mjs harness exit=cleared
```

### 38.2 ROUTE_DERIVE — approach fix (problem-solving)
| property | value |
|---|---|
| trigger signature | no-progress 3 (K iterations, zero gate movement), or 2 failed fixes out of a fix loop, or ROUTE_DEBUG cleared nothing |
| protocol | 1. Stop patching (the two-strikes law). 2. Re-derive the approach: first-principles on the blocking constraint. 3. Write the new plan (what changes, what survives). 4. Re-enter the phase under the new approach. 5. Journal. |
| exit condition | the phase moves under the new approach (any gate progress) |
| journal line format | `[ROUTE_DERIVE] sig=<sig> phase=<n> attempt=<k> rca=<why the old approach cannot work> new_plan=<one line> exit=<engaged|failed>` |
| escalation on failure | journaled → ROUTE_SPLIT |

Worked case (journal filled — the floor that padding cannot reach):
```
[ROUTE_DERIVE] sig=no-progress phase=6 attempt=1 rca=3000-line floor unreachable by padding (the crime) new_plan=wave-grown content + honest RED until real mass exists exit=engaged
```
(This is the live repo's own case — the growth you are reading IS that plan executing.)

### 38.3 ROUTE_SPLIT — scope fix (decompose)
| property | value |
|---|---|
| trigger signature | a task too large to converge (deadline slip with visible partial progress), or DERIVE's plan requires parallel fronts |
| protocol | 1. Name the indecomposable core vs the splittable shell. 2. Split into sub-units with their own entry/exit. 3. Mount the sub-units as new §1 rows or a companion card. 4. Re-enter on the first sub-unit. 5. Journal. |
| exit condition | sub-units each converge; the original phase's gate passes on the joined result |
| journal line format | `[ROUTE_SPLIT] sig=<sig> phase=<n> attempt=<k> split=<unit list> exit=<engaged|failed>` |
| escalation on failure | journaled → ROUTE_SWITCH |

Worked case (journal filled — an 8-phase card that would not close):
```
[ROUTE_SPLIT] sig=no-progress phase=7 attempt=1 split=ship-gates card | report card exit=engaged
[ROUTE_DEBUG] sig=same-fail phase=7b attempt=1 rca=report card gated on ship artifacts not yet on disk fix=reorder: ship before report exit=cleared
```

### 38.4 ROUTE_SWITCH — resource fix (model/tier change)
| property | value |
|---|---|
| trigger signature | null-rate >30% (agent() nulls dominate), or repeated nulls on one unit class |
| protocol | 1. Measure the null-rate per unit class. 2. Switch the tier/model for THAT class (rate-limit law: a quota error is a switch signal, never a stall). 3. Re-dispatch the failed units. 4. Journal. |
| exit condition | null-rate back under threshold on the re-dispatch |
| journal line format | `[ROUTE_SWITCH] sig=null-rate phase=<n> attempt=<k> rate=<pct> switched=<from->to> exit=<cleared|failed>` |
| escalation on failure | journaled → ROUTE_RECOVER |

Worked case (journal filled — research-phase null flood):
```
[ROUTE_SWITCH] sig=null-rate phase=1 attempt=1 rate=45 switched=small-tier->reasoning-tier exit=cleared
```

### 38.5 ROUTE_RECOVER — state fix (checkpoint re-entry)
| property | value |
|---|---|
| trigger signature | phase deadline breached with state intact, or post-compaction re-entry, or environment reset |
| protocol | 1. Reload the card (compaction line). 2. Sha-verify preserved zones (head, pinned canon). 3. Identify the last INCOMPLETE §1 phase. 4. Re-enter there — never re-ask settled questions. 5. Journal. |
| exit condition | the incomplete phase resumes and its gate runs |
| journal line format | `[ROUTE_RECOVER] sig=<sig> phase=<n> attempt=<k> reentered=<phase> sha=<head-sha-verified|DRIFT> exit=<resumed|failed>` |
| escalation on failure | journaled → ROUTE_ESCALATE |

Worked case (journal filled — post-compaction resume):
```
[ROUTE_RECOVER] sig=deadline phase=6 attempt=1 reentered=6 sha=head-sha-verified exit=resumed
```

### 38.6 ROUTE_ESCALATE — the operator ask (LAST)
| property | value |
|---|---|
| trigger signature | 3 LOGGED route failures on the same phase (the journal is the evidence), or a genuine operator decision fork |
| protocol | 1. Assemble the ask: the signature, the three failed attempts (journal lines), the decision needed. 2. Ask the operator ONCE with the question tool — recommended-first, decision axes explicit. 3. Apply the operator's ruling as a WORK ORDER. 4. Journal. |
| exit condition | operator ruling received and engaged |
| journal line format | `[ROUTE_ESCALATE] sig=<sig> phase=<n> attempts=3 ask=<one-line decision needed> ruling=<operator ruling> exit=<engaged>` |
| escalation on failure | none — ESCALATE is the terminal rung; the ruling IS the way forward |

Worked case (journal filled — the live floor escalation):
```
[ROUTE_ESCALATE] sig=no-progress phase=6 attempts=3 ask=floor mis-calibrated at contract time — grow or amend? ruling=operator rules: grow (density waves), no padding exit=engaged
```

### 38.7 The ladder, assembled (what the card's §6 declares)
```
no-progress 3 -----> ROUTE_DERIVE ---> ROUTE_SPLIT ---> ROUTE_SWITCH
same-fail 2x ------> ROUTE_DEBUG  ---> (then DERIVE ladder)
null-rate >30% ----> ROUTE_SWITCH
deadline / reset --> ROUTE_RECOVER
3 logged failures -> ROUTE_ESCALATE (terminal)
```
Order invariants: DEBUG before DERIVE (a mechanism fault masquerades as a strategy fault); SPLIT before SWITCH (cheaper to cut scope than to buy resources); RECOVER after SWITCH (state fix, not resource fix); ESCALATE strictly last. Cheapest-fix-first is P7 applied to recovery.

### 38.8 Calibration table (per phase class — the K that keeps the ladder honest)
| phase class | no-progress K | same-fail | null-rate | deadline | rationale |
|---|---|---|---|---|---|
| research/survey | 5 | 2x | >30% | generous | long silences are normal; nulls from rate limits are the real signal |
| spec/design | 3 | 2x | >30% | moderate | convergence is verbal; no-progress means the axis is wrong |
| implement/tdd | 3 | 2x | >30% | tight | gates fire constantly; silence is a fault |
| verify/panels | 2 | 1x | >20% | tight | flaky gates must trip DEBUG immediately |
| ship | 2 | 1x | >20% | hard | ship gates are mechanical — a red here is not a mood |
Calibration law: card-level K is author-owned; kernel ceilings (retry(2), fix(2), escalate-after-3) are fixed — calibrate WITHIN them.

### 38.9 Full worked incident (one stuck loop, the whole ladder)
Scenario: phase 3 (implement) of a build card — pytest suite will not go green.
```
[phase=3] gate run 1: pytest -> 3 fail (exit unbalanced, loop continues)
[phase=3] gate run 2: pytest -> the SAME 3 fail      -> same-fail 2x trips
[ROUTE_DEBUG] sig=same-fail phase=3 attempt=1 rca=fixture leaked state across tests fix=per-test tmp dir exit=failed
[phase=3] gate run 3: pytest -> 2 fail (progress, then stall x3) -> no-progress 3 trips
[ROUTE_DERIVE] sig=no-progress phase=3 attempt=1 rca=renderer tested through the engine api only new_plan=test render surface directly exit=failed
[ROUTE_SPLIT] sig=no-progress phase=3 attempt=2 split=engine tests | render tests exit=engaged
[phase=3a] gate run: engine tests 0 fail (sub-unit green)
[phase=3b] gate run: render tests 1 fail -> DEBUG (mechanism) clears it
[phase=3] gate run: pytest -> 0 fail (joined result) -> phase exits
```
The journal is the audit trail: four route lines, each with its verdict, the phase gates interleaved — a reader reconstructs the entire recovery without the chat. That is the standard every card's §6 must be written to satisfy.

### 38.10 Signature detection reference (what the kernel measures, where)
| signature | formula / measurement point | example trip |
|---|---|---|
| no-progress K | K consecutive gate runs of one phase with zero movement in the gate's measured value | pytest fail-count unchanged for 3 runs |
| same-fail 2x | two consecutive gate runs with IDENTICAL failure evidence (same failing tests, same token) | the same 3 tests red, twice |
| null-rate >30% | agent() nulls / agent() calls within the phase | 9 nulls of 20 research dispatches = 45% |
| phase deadline | wall-clock budget per phase, card-calibrated | implement phase past its budget with red gates |
Measurement honesty: the counter reads gate runs and tokens — a phase that was never gated (never ran) has no signature history; resets on phase re-entry after a route clears.

### 38.11 Route x card-archetype matrix (which ladder rungs each archetype actually exercises)
| archetype | DEBUG | DERIVE | SPLIT | SWITCH | RECOVER | ESCALATE |
|---|---|---|---|---|---|---|
| docs-card (C1) | anchor drift | outline re-derive | chapter split | rare | likely (long doc) | floor disputes |
| bugfix-card (C2) | first resort | approach wrong | scope cut | rare | likely | repro impossible |
| audit-card (C3) | tooling faults | method re-derive | target split | rare | likely | access rights |
| research-card (C4) | query faults | corpus re-plan | topic split | OFTEN (null-rate) | likely | source walls |
| deploy-card (C5) | installer faults | strategy | per-surface split | rare | likely | credentials |
| migration-card (C6) | diff drift | mapping re-derive | per-file split | rare | likely | canon conflicts |
| cadence-card (C7) | probe faults | triage re-plan | service split | rare | OFTEN (reset) | operator alerts |
| review-card (C8) | snapshot faults | range re-plan | per-module split | rare | likely | verdict deadlocks |
| refactor-card (C9) | baseline drift | seam re-plan | per-unit split | rare | likely | behavior doubts |
| release-card (C10) | gate faults | package re-plan | artifact split | rare | likely | audit failures |
Reading: SWITCH concentrates in research (null-rate is the research-phase disease); RECOVER concentrates in long-running cards (deadline + compaction); ESCALATE is rare EVERYWHERE — three logged failures is a high bar by design.

### 38.12 The journal line schema (fields, types, rules)
| field | type | rule |
|---|---|---|
| [ROUTE_*] | literal tag | the canon route name, bracketed, first token |
| sig | string | the signature that tripped — one of the four canon names |
| phase | integer | the §1 row number the route served |
| attempt | integer | 1-based per (route, phase); the ESCALATE counter reads these |
| rca / rate / split / reentered / ask | string | route-specific payload (one clause, no prose paragraphs) |
| fix / new_plan / switched / sha / ruling | string | the concrete change or input — file:line or name, never "various" |
| exit | enum | cleared | failed | engaged | resumed — the attempt's verdict |
Rules: one line per attempt; no multi-line entries; the line lands BEFORE the next gate run; a route that cannot journal is a route that did not happen. The journal is append-only — corrections are new lines that reference the old attempt, never edits.

### 38.13 Route-failure forensics checklist (when a route's exit reads `failed`)
When the journal shows `[ROUTE_*] ... exit=failed`, run this checklist BEFORE the next rung fires — a failed route that hands an UNDIAGNOSED failure to the next rung burns the ladder:
1. Re-read the route's own journal line — is the payload (rca/fix/new_plan) a CONCRETE change or a restated symptom?
2. Re-run the phase's gate ONCE by hand — did the world change since the route ran (environment drift masquerading as route failure)?
3. Confirm the signature is still the SAME signature — a route that changes the failure mode (e.g., DEBUG fixes the crash but the gate now fails on content) did PART of its job; journal the new signature explicitly.
4. Check for ladder misuse — SWITCH fired for a null-rate that was actually a bad brief (DEBUG's territory); correct the rung, not just the outcome.
5. Only then engage the next rung — and its journal line must cite the prior attempt: `attempt=<n+1>` with the inherited context.
Forensics law: the ladder is a sequence of HYPOTHESES (mechanism -> approach -> scope -> resources -> state -> human); a failed hypothesis that is not understood poisons the next hypothesis — diagnose, then advance.

## 39. VALIDATION DEEP-DIVE — validate-cards.mjs annotated, every error cataloged, the measurer-bug case study

The validator IS the schema (D4): deploy/battery/validate-cards.mjs, 55 lines, exit 1 on any FAIL, masters must always pass. §39 annotates it line-by-line, catalogs every regex and every error message with cause+fix, records the 0/5 false-fail incident as the measurer-bug case study, and gives the family dispatch table. Shell-bible APPENDIX H3 carries the verbatim source; §39 carries the ENGINEERING READING of it.

### 39.1 Line-by-line annotation (line → what it enforces → what failure it catches)
| line(s) | code (compressed) | law enforced | failure caught |
|---|---|---|---|
| 1-5 | shebang + comment | self-documentation: family-aware, exit 1 | — |
| 6-7 | imports (fs/path) | node-only runner — no substrate dependency | — |
| 9 | `root = argv[2] \|\| 'cards'` | validation root is an ARG — point it at any tree | validating the wrong tree |
| 10-11 | results[], fail=0 | per-file result collection; fail counter drives exit | — |
| 13-19 | walk(dir) recursion | EVERY .md under the root is a card candidate | a card hiding below the root |
| 22 | fm regex `^---\n([\s\S]*?)\n---` | frontmatter must be a CLOSED block at file start | unclosed/misplaced frontmatter |
| 23 | `if (!fm) return {ok:false, errs:['no frontmatter']}` | no frontmatter = instant FAIL | prose files in cards/ |
| 25 | get(k) — `^${k}:` multiline match | field presence at line starts | indented/inline fakes |
| 26-27 | five-field loop | card:/id:/version:/forked-from:/mode: ALL present | lineage-less forks |
| 28 | family = `^card:\s*(\S+)` | family dispatch key | family typo |
| 29-37 | goalmode-v1 branch | §0-§6 presence + pair balance + nl_prompt | contract-less program |
| 30-31 | seven `## §N` includes | fixed section contract (the red-pill law) | missing sections |
| 32 | sec0 slice: between `## §0` and `## §1` | §0 is a BOUNDED region — pairs must live inside it | pairs smeared across sections |
| 33-34 | `- cmd:` / `expect:` counts | balance is counted, not judged | half a contract |
| 35 | pairs===0 → error | empty contract = no halt vocabulary | wish-only §0 |
| 36 | pairs!==expects → mismatch N/M | the balance error WITH the numbers | 1:0, 3:5 drift |
| 37 | `nl_prompt:` presence | the WHAT sentence is mandatory | kernel reads nothing |
| 38-41 | js-workflow-v1 branch | meta.name + meta.description + default export | binary-less slots |
| 39 | `name:\s*["[]` regex | meta.name must be quoted or bracketed | bare/untyped name |
| 40 | `description:` presence | documented workflow identity | anonymous binaries |
| 41 | `export default async function` | the substrate entrypoint | unmountable module |
| 42-44 | compose-function-v1 branch | function: + contract body | library-less slots |
| 43 | `^function:` multiline | tdd/next declaration | untyped compose doc |
| 44 | `micro_loop:\|phases:\|contract` | SOME contract body present | empty library card |
| 45 | else → `unknown family "<X>"` | the three-family closure | invented families |
| 48-52 | report loop `PASS\|FAIL path :: errs` | per-file verdicts with joined errors | silent failures |
| 53-55 | summary + `exit(fail?1:0)` | the battery gate: ANY fail = exit 1 | green-washing |

### 39.2 Regex catalog (every pattern, explained)
| regex | where | reads as | why this shape |
|---|---|---|---|
| `/^---\n([\s\S]*?)\n---/` | line 22 | `---` at byte 0, then ANY content (incl. newlines), closed by `---` | frontmatter is the machine-binding block; lazy match keeps the FIRST block |
| `new RegExp('^' + k + ':', 'm')` | line 27 | field key at a line start | multiline flag = field-per-line; `:` pins the key, not a substring |
| `/^card:\s*(\S+)/m` | line 28 | family literal after `card:` | `\S+` = one token — the family is a single literal |
| `text.includes('## §N')` | line 30-31 | literal section heading | sections are a FIXED contract; order-presence checked by includes |
| `/- cmd:/g` | line 33 | every list-item cmd | the `- ` pins the pair form (not prose mentioning cmd:) |
| `/expect:/g` | line 34 | every expect line | counted against cmd count — the balance law |
| `/nl_prompt:/` | line 37 | the WHAT sentence key | presence, not prose analysis (prose analysis is the judge's job) |
| `/name:\s*["[]/` | line 39 | meta.name opened by quote or bracket | untyped bare names break workflow identity |
| `/description:/` | line 40 | meta.description key | — |
| `/export default async function/` | line 41 | the substrate entrypoint signature | sync or named exports cannot mount |
| `/^function:/m` | line 43 | compose function literal at line start | — |
| `/micro_loop:|phases:|contract/` | line 44 | ANY of the three contract markers | family covers tdd (micro_loop) + next (phases) + free-form contract |

### 39.3 Error message catalog (every string: cause → fix)
| error string | emitted when | cause class | fix |
|---|---|---|---|
| `no frontmatter` | fm regex misses | file starts with prose / `---` not at byte 0 / block unclosed | open the file with a closed `---` block |
| `frontmatter missing card:` … `missing mode:` | any of the five absent | fork not filled / field renamed | restore all five fields |
| `missing section ## §0` … `## §6` | heading absent | body truncated / heading reformatted (`### §0` fails) | restore literal `## §N` headings |
| `§0 has no cmd pairs` | `- cmd:` count 0 in the §0 slice | wish-only contract / pairs outside the §0→§1 slice | write pairs INSIDE §0 |
| `§0 cmd/expect mismatch N/M` | counts differ | one half of a pair deleted/typoed | balance to N:N |
| `§0 missing nl_prompt` | key absent from the slice | the WHAT sentence dropped | add nl_prompt inside §0 |
| `meta.name missing` | name not `["\[]`-opened | bare name / field renamed | quote the workflow name |
| `meta.description missing` | key absent | anonymous binary | describe it |
| `no default export` | entrypoint absent | sync export / arrow-only / named-only | `export default async function` |
| `function: missing` | key absent at line start | compose doc without a function literal | declare `function: compose:tdd` or `compose-next` |
| `no contract body` | none of the three markers | empty library card | add micro_loop/phases/contract |
| `unknown family "<X>"` | card: literal not one of three | typo / invented family | use goalmode-v1 \| js-workflow-v1 \| compose-function-v1 |

Output format (battery-pinned, line 50 + 54):
```
PASS cards/masters/GOALMODE_CARD_MASTER_v1.md
FAIL cards/broken.md :: §0 cmd/expect mismatch 3/5; §0 missing nl_prompt

VALIDATOR: PASS count 5, FAIL count 1, total 6
```

### 39.4 Family dispatch table
| family | branch lines | checks | counts as PASS when |
|---|---|---|---|
| goalmode-v1 | 29-37 | 7 sections + §0 pairs>0 + balance + nl_prompt | full program contract present |
| js-workflow-v1 | 38-41 | meta.name + meta.description + default export | mountable binary |
| compose-function-v1 | 42-44 | function: + any contract marker | mounted library |
| anything else | 45 | none — instant FAIL | never |

### 39.5 The 0/5 false-fail incident — the measurer-bug case study
History (bible §12, canon): the validator once reported `0/5` — zero PASS of five schema-clean cards.
- Symptom: five cards that pass today's battery read FAIL across the board; the summary line and the per-file lines disagreed about reality.
- Root cause class: a MEASURER bug — the incident is recorded as the double-colon regex: the `::` separator joining path and errors in the output format interacted with the counting/parsing regex, so error-free files were scored as failing. The cards were right; the ruler was wrong.
- Why this is the dangerous class: a validator that false-FAILs trains authors to ignore it — the alarm that always rings protects nothing. A validator that false-PASSes is bad; one that false-FAILs is ARGUED WITH until someone "fixes" a healthy card.
- The fix law applied: the validator IS the schema (D4) — so a validator bug is a SCHEMA bug: fixed in the same commit as any master evolution, never patched around by editing cards to please the broken ruler.
- The prevention in force today: (1) the output format is battery-pinned — one `::` separator, one summary line shape (`VALIDATOR: PASS count N, FAIL count M, total T`); (2) the error strings are single-sourced in one function (check()); (3) the masters are IN the battery — six files, all PASS, every run — so a measurer regression is visible as `PASS count 6, FAIL count 0` turning into anything else.
- The meta-lesson (logged for the family): every measurer is code too. When a measurement contradicts a green battery, suspect the RULER first — then re-run both. Never edit healthy artifacts to satisfy a broken measurer; never trust a measurer that has never been pinned by its own battery.

### 39.6 Validation order and the fix loop
Run order (the battery): 1. `node deploy/battery/validate-cards.mjs cards/` → PASS or per-file errors. 2. `node machinery/run-smoke.mjs .` → `{"ok": true}` or evidence-named failures. 3. (deploy phase) `node deploy/battery/deploy-proof.mjs` → clean-target proof. Fix loop: validator FAIL → read the per-file errors → fix the CARD (never the validator — unless the SCHEMA is wrong, then evolve validator + masters in ONE commit, §39.5). Smoke fail → read the evidence array (per-file reasons) → fix → re-run. A fix is done when the WHOLE battery re-runs green, not when the one error stops printing.


### 39.7 run-smoke.mjs line-by-line (the seam harness, 22 lines)
| line | code (compressed) | what it proves |
|---|---|---|
| 6-8 | imports + `root = argv[2] \|\| '.'` | the harness runs against ANY tree — the deploy proof passes `.` from the target cwd |
| 10-14 | glob(pattern) — readdir under the root, .md filtered | the SAME contract as the substrate glob: masters enumerated, not spawned |
| 15 | readFile(p) -> null on miss | the substrate contract: missing files are nulls, never throws |
| 16-17 | log/phase as no-ops | the seam: timeline calls exist but the harness is headless |
| 19 | `await import('../.mimocode/workflows/gm-smoke.js')` | the EXACT workflow module the substrate would run — no parallel implementation |
| 20 | `mod.default({glob, readFile, phase, log, join, relative, statSync})` | the SEAM PATTERN (D-P10): globals injected explicitly — node-testable, substrate-compatible |
| 21-22 | JSON.stringify(result); exit(result.ok === true ? 0 : 1) | the token law at the process boundary: {ok:true} or exit 1 — never a throw |
Design note: run-smoke exists because `workflow run gm-smoke` needs a workflow-tool session; the harness imports and drives the identical module so the battery runs anywhere node runs (the live contract's smoke pair names this runner).

### 39.8 gm-smoke.js line-by-line (the reference binary, 34 lines)
| line | code (compressed) | law it carries |
|---|---|---|
| 1-8 | meta {name: "gm-smoke", description, phases[3], permissions[read cards/**]} | the workflows.md contract verbatim — identity the validator's [S]-side and §2 mounts key on |
| 10-11 | `export default async function (g = globalThis)` + destructure | the seam signature — bare globals in the runtime, injected in tests |
| 12-16 | phase("Enumerate"); glob masters; append the contract file | enumerate-don't-spawn; the contract card joins the check set |
| 18-27 | phase("Check"); per file: readFile -> null check -> startsWith('---') -> /\[FILL/ scan | frontmatter presence AND fill-legality per file — the content check the validator cannot do |
| 26-28 | isMaster = f.startsWith("cards/masters/") | masters MAY carry [FILL] (they are templates); live cards may NOT |
| 28 | `failed.push(`${f}: non-master card still carries [FILL] slots`)` | the exact smoke evidence string — per-file, named, actionable |
| 30-33 | phase("Gate"); {ok:false, failed, evidence} or {ok:true, checked, evidence} | the token contract: failures COLLECTED (async law), evidence always returned |
Smoke vs validator (the division of labor): the validator checks IDENTITY (frontmatter fields, sections, balance); the smoke checks CONTENT LEGALITY (frontmatter marker present at byte 0, fill-legality per file class). Both must pass; neither subsumes the other.

### 39.9 deploy-proof.mjs line-by-line (the clean-target proof, 39 lines)
| line | code (compressed) | what it proves |
|---|---|---|
| 11-12 | repo resolved from import.meta.url; `mkdtempSync(join(tmpdir(), 'gmc-deploy-'))` | a CLEAN target every run — no residue, no trust in a prepared tree |
| 14 | `execFileSync('bash', [DEPLOY.sh, target])` | the REAL installer runs — the proof exercises the shipped path, not a reimplementation |
| 15-24 | required[] — the 8-file canon list (workflow, skill, command, master, example, gsh.js, validator, run-smoke) | the substrate SURFACE is pinned as data — drift is a visible MISSING line |
| 26-30 | existsSync per file -> `PASS`/`MISSING <f>`; missing>0 -> exit 1 | existence is per-file evidence, and ANY miss fails the proof |
| 32 | run-smoke executed IN the target, cwd=target | the in-target smoke: the installed substrate BOOTS, not merely exists |
| 33-36 | okToken = smoke.includes('"ok": true'); SMOKE-IN-TARGET + DEPLOY PROOF lines; exit | the token check at the last hop; clean exit only on a booted substrate |
| 37 | finally rmSync(target) | the clean target is disposable — replay costs one mkdtemp |

### 39.10 The battery composition (every runner, what it pins, exit semantics)
| runner | pins | pass shape | exit |
|---|---|---|---|
| deploy/battery/validate-cards.mjs | card identity + §0 balance (schema-as-code) | `VALIDATOR: PASS count N, FAIL count 0` | 0 green / 1 any FAIL |
| deploy/battery/bridge-tests.mjs | the 10 gsh.js laws (tokens, seq, and, or, run, pipe, jobs, trap, until, env) | `BRIDGE BATTERY: 10/10 PASS` | 0 green / 1 any FAIL |
| machinery/run-smoke.mjs | workflow content legality via the real gm-smoke module | `{"ok": true, "checked": N}` | 0 green / 1 otherwise |
| deploy/battery/deploy-proof.mjs | clean-target install + in-target boot | `DEPLOY PROOF: clean target verified, substrate operational` | 0 green / 1 otherwise |
Run order: validator -> smoke -> proof (proof includes its own smoke hop). History is canon: the battery's RED states are recorded, not hidden — `RED: gsh.js not importable`, `9/10 ... gsh.export is not a function`, `0/5 (double-colon regex)`, deploy exit=1 — each fixed in-session and each lesson folded into the laws above (§12).

### 39.11 The validator's v2 extension surface (what a schema evolution would add, without breaking v1)
The v1 validator is 55 lines and family-aware; v2 candidates (each gated by the schema-evolution law: validator + masters evolve in ONE commit, §39.5):
| candidate | check | catches | v1 compatibility |
|---|---|---|---|
| route-order check | §6's ladder ends with ROUTE_ESCALATE and starts with ROUTE_DEBUG | F18 ESCALATE-first, mid-ladder ESCALATE | additive — new error string only |
| route-name check | §6 names a subset of the canon six | F29 invented routes | additive |
| artifact-path match | §4 artifact paths appear as §0 ls pairs | F15's silent cousin (path mismatch) | additive |
| slot-ref resolution | every §1 slot ref resolves to a §2/§3 mount in the SAME file | F6 dangling refs at validate time (today: kernel-time) | additive |
| engine-slot family match | js rows ref §2; compose rows ref §3 | F8-class | additive |
| interactive-command heuristics | none mechanical — remains author discipline | — (declared out: false positives) | n/a |
The v1 lessons bound v2: every new check must be a STRING-EXACT error single-sourced in check(); every new check must run against the masters (they pass); and the measurer itself gains no parsing that can false-fail a healthy card — the §39.5 lesson is the design constraint.
## 40. COMPILE WALKTHROUGHS — what each master receives from GSH compilation, anchor by anchor

The compile chain is prose → GSH → card (translate.md; shell bible §6/§52 carries the protocol and the compiler procedure). §40 walks EACH master the way the compiler sees it: for every section, what GSH constructs compile INTO it, which [FILL] slots it exposes (grep-verified counts: GOALMODE master 29, JS master 11, TDD master 2, NEXT master 2), and what the kernel does at that anchor at run time. Line anchors are from the masters as they sit in cards/masters/ today (GOALMODE 53L, JS 31L, TDD 21L, NEXT 25L).

### 40.1 GOALMODE_CARD_MASTER_v1.md (53L) — the program master
| lines | section | receives from GSH | [FILL] exposed | kernel at this anchor |
|---|---|---|---|---|
| 1-9 | frontmatter | `#!/goalmode` (shebang → pin) | id (L3), baseline (L7), workflows (L8) | mode/lineage binding; the kernel loads THIS to know what it runs |
| 10 | card name | the program title | [FILL CARD NAME] (L10) | display only — the kernel keys on id, never the name |
| 12-21 | §0 GOAL CONTRACT | PIN (→ nl_prompt L18), SPEC (→ cmd/expect pairs L14-17), every `done means...` verb | 6 of the 29: cmd×2, expect×2, nl_prompt, criterion | THE judge surface: re-run cold at every gate + before halt release; prose here is invalid |
| 18 | nl_prompt line | PIN "..." | 1 | the kernel's brief for the composing agents — WHAT, never HOW |
| 19-20 | success_criteria | PIN's evidence shape | 1 | human-readable mapping; the pairs remain the law |
| 21 | anti_cheat | (pre-seeded canon line) | 0 | the anti-cheat statement the kernel enforces structurally |
| 23-28 | §1 PHASE GRAPH | PHASE n: (one row each) | 10: row 1 (L26) ×5, row 2 (L27) ×5 | the program counter: order = execution; each exit is a mechanical gate |
| 30-32 | §2 JS WORKFLOW SLOTS | RUN name --args | 4: name, card path, args JSON, route (L31-32) | binary mounts: workflow identity = the named card's meta.name; returns {ok}\|null |
| 34-36 | §3 COMPOSE FUNCTION SLOTS | TDD target (tdd slots) | 4: name, card, trigger, micro_loop (L35-36) | library mounts: the compose contracts execute here |
| 38-42 | §4 REVIEW PANELS | PANEL n --schema | 1: N reviewers (L39) | the supervisor's jury: schema verdicts, artifacts, majority; final re-runs §0 cold |
| 44-46 | §5 SHIP GATES | SHIP a AND b | 0 (pre-seeded: SPG + report lines) | the delivery stage: SPG v4 A-I + engineering report, panels-green-gated |
| 48-53 | §6 RECOVERY + ROUTING | ON STUCK: r1->r2 | 2: signatures (L49), routes (L50) | the trap table: signatures trip routes in order; compaction re-entry per the line |
Compile note: EXIT 0 compiles NOWHERE (kernel-owned — GSH_SPEC line 20); if a GSH script carries EXIT, the compiler drops it, never writes it.
The 29 [FILL] slots distribute: frontmatter 3, name 1, §0 6, §1 8, §2 4, §3 4, §4 1, §5 0, §6 2 — fills concentrate where PROJECT TRUTH lives; canon lines carry zero.
Kernel behavior summary for this master: it is the ONLY master that becomes a pinned process — the other three are components it links.

### 40.2 JS_WORKFLOW_CARD_MASTER_v1.md (31L) — the binary master
| lines | section | receives from GSH | [FILL] exposed | kernel/runtime at this anchor |
|---|---|---|---|---|
| 1-13 | frontmatter + meta | RUN name --args (the slot that mounts me) | id (L6), slot_in (L7), name (L9), description (L10), phases title (L11), permissions patterns+reason (L12) | meta IS the workflows.md contract; name = workflow identity the parent §2 references |
| 14-15 | default export + phase() | the RUN's execution begins | phase name (L15) | phase() marks the workflow timeline; the substrate sandbox provides it |
| 16 | glob() | the RUN's --args pattern | glob pattern (L16) | enumeration BEFORE spawning — units are data, not processes |
| 17-24 | parallel(agent({schema})) | the distilled brief per unit | brief (L18), agentType (L19) | the micro loop: agent() returns schema-validated objects or null — nulls are failures, never exceptions |
| 20-24 | the schema block | PANEL's --schema law applied per unit | 0 (the schema is pre-seeded canon) | the typed gate: {ok, evidence} required — an untyped pass is void |
| 25 | failed filter | — | 0 | nulls and {ok:false} collect into failed[] — per-unit failure capture (the async law) |
| 26-28 | gate + returns | the RUN's {ok} token contract | 0 | pass_token {ok:true, evidence[]}; fail_token {ok:false, failed[]} — the ONLY vocabulary |
| 30-31 | token + determinism comments | (compile comments) | 0 | determinism law: no Date/crypto/fetch in the script — inside agent() only |
Compile note: the parent card's §2 args land as the `args` global; the slot's fail_route engages after retry(2) when this module returns {ok:false} or a unit nulls through.
The 11 [FILL] slots distribute: frontmatter/meta 6, execution 4 (phase, glob, brief, agentType), schema 0, gate 0 — the gate is canon; the BRIEF is where the engineering lives.

### 40.3 COMPOSE_TDD_CARD_MASTER_v1.md (21L) — the micro-library master
| lines | section | receives from GSH | [FILL] exposed | kernel at this anchor |
|---|---|---|---|---|
| 1-9 | frontmatter | TDD target (→ §3 slot) | id (L7), slot_in (L8) | family compose-function-v1; function: compose:tdd (L6) declares the contract |
| 10-11 | title + trigger | the TDD's target list | 0 | trigger: any feature/bugfix task emitted by the phase graph — the invocation law |
| 12-17 | contract (5 steps) | the tdd discipline | 0 | behavior contract → RED first (evidence kept) → min impl → >=3 adversarial BEFORE happy path → battery green |
| 18 | micro_loop | — | 0 | red -> green -> refactor, per task — the validator's contract marker for this family |
| 19 | gate | — | 0 | exit only on fresh passing output (compose:verify iron law — cold evidence) |
| 20 | fail_route | ON STUCK (bounded) | 0 | 2 failed fixes -> stop patching -> ROUTE_DERIVE — the two-strikes law |
| 21 | returns | — | 0 | {tests: [names], evidence: [cmd outputs]} back to the phase |
Compile note: 2 [FILL] (id, slot_in) — the discipline is CANON; a fork fills identity only. Any card that rewrites the 5 contract steps has stopped being a tdd card.

### 40.4 COMPOSE_NEXT_CARD_MASTER_v1.md (25L) — the macro-library master
| lines | section | receives from GSH | [FILL] exposed | kernel at this anchor |
|---|---|---|---|---|
| 1-9 | frontmatter | the card's docs/ship phases mounting next | id (L8), slot_in (L9) | function: compose-next (L6) — Build agent, explicit request only |
| 10-12 | phases line | — | 0 | orient -> grill -> workspace -> spec -> implement -> verify -> review -> finalize -> finish (9 gates, 8 transitions) |
| 13-23 | contract (per phase, one line gate) | — | 0 | orient: repo read before any ask / grill: 1 axis per turn, recommended-first / workspace: .worktrees/<slug>, never main w/o consent / spec: S1-S3 + tasks(acceptance, covers, depends, acyclic) / implement: dep order, tdd slots inside / verify: fresh runs, PRE-EXISTING marked / review: 1 fresh subagent, 3 verdicts, criticals loop / finalize: status + Report block / finish: operator picks close |
| 24 | fail_route | — | 0 | non-convergent review -> impasse report, never force pass |
| 25 | returns | — | 0 | {spec_path, shas, verification_summary} back to the phase |
Compile note: 2 [FILL] (id, slot_in). The trigger line in the PARENT's §3 IS the explicit request this contract demands — a next slot without a written trigger cannot lawfully run.

### 40.5 The compile map, whole-chain (one glance)
```
prose ("done means...")  --> GSH GATE/PIN/SPEC --> master §0   (pairs + nl_prompt)
prose (build/implement)  --> GSH PHASE/TDD     --> master §1/§3 (rows + slots)
prose (run/survey)       --> GSH RUN           --> master §2   (binary mounts)
prose (review)           --> GSH PANEL         --> master §4   (jury + schema)
prose (ship)             --> GSH SHIP          --> master §5   (SPG + report)
prose (when stuck)       --> GSH ON STUCK      --> master §6   (traps + routes)
EXIT (never)             --> KERNEL-OWNED      --> (nothing — dropped at compile)
```
The three steps after compile (translate.md step 3): validate (PASS), smoke ({ok:true}), pin (hand the operator `/goal Drive to completion using the Goalmode Card at cards/<name>.md — the card IS the contract`). The kernel starts on the operator's word — the pin is their exec().

### 40.9 JS_WORKFLOW_CARD_MASTER_v1.md — line-by-line commentary (all 31 lines)
| line | content (compressed) | commentary |
|---|---|---|
| 1 | `---` | frontmatter opens at byte 0 |
| 2 | `card: js-workflow-v1` | the binary family literal |
| 3 | `version: 1` | integer |
| 4 | `forked-from: JS_WORKFLOW_CARD_MASTER_v1.md` | lineage (note: the file carries the .md suffix — historical, validator accepts) |
| 5 | `mode: build` | executing agent mode |
| 6 | `id: [FILL]` | the workflow document's slug |
| 7 | `slot_in: "[FILL parent ... §2 slot]"` | the mount point back-reference |
| 8 | `meta: # verbatim workflows.md contract` | the meta block opens — the workflows.md contract verbatim |
| 9 | `name: "[FILL A-Za-z0-9._-]"` | the workflow IDENTITY — what §2's card: keys on |
| 10 | `description: "[FILL]"` | validator-required description |
| 11 | `phases: [{title: "[FILL]"}]` | the timeline skeleton |
| 12 | `permissions: [...patterns...reason...]` | the declared sudo boundary — patterns AND reasons |
| 13 | `---` | frontmatter closes |
| 14 | `export default async function () {` | the substrate entrypoint — the validator's mount check |
| 15 | `phase("[FILL]")` | the timeline begins |
| 16 | `const units = await glob("[FILL pattern]")` | enumerate-don't-spawn — units are data |
| 17 | `const results = await parallel(units.map(u => () =>` | the fan-out — one thunk per unit |
| 18 | `agent("[FILL distilled brief for u]", {` | the brief is the engineering |
| 19 | `agentType: "[FILL general|explore]",` | the executor class per unit |
| 20-24 | `schema: {...ok/evidence...}` | the typed gate — pre-seeded canon, ZERO fills |
| 25 | `const failed = results.filter(r => r === null || !r.ok)` | per-unit failure capture — nulls AND falses collected |
| 26 | `phase("gate")` | the gate phase marker |
| 27 | `if (failed.length) { ... return {ok:false,failed} }` | fail_token with the named failures |
| 28 | `return {ok:true, evidence: ...}` | pass_token with collected evidence |
| 29 | `}` | entrypoint closes |
| 30 | `# pass_token ... fail_token ...` | the token contract as a comment |
| 31 | `# determinism: no Date/crypto/fetch in script` | the determinism law as a comment |
The asymmetry law this master teaches: fills live in the BRIEF and the IDENTITY; the gate, the schema, and the token contract are canon — a fork that edits lines 20-28 has written a different binary, not a filled one.

### 40.10 COMPOSE_TDD_CARD_MASTER_v1.md — line-by-line (all 21 lines)
| line | content (compressed) | commentary |
|---|---|---|
| 1-9 | frontmatter (compose-function-v1, function: compose:tdd, id/slot_in fills) | identity + family + function declaration |
| 10 | `# TDD micro-loop as a wired function` | the contract title |
| 11 | `trigger: any feature/bugfix task emitted by the phase graph` | the invocation law — tasks COME from §1 rows |
| 12 | `contract:` | the five-step body opens |
| 13 | `1. behavior contract stated` | inputs/outputs/edges BEFORE code |
| 14 | `2. failing test FIRST -> RED recorded` | RED on record — evidence kept, not remembered |
| 15 | `3. minimum implementation -> GREEN recorded` | minimum — no speculative generality |
| 16 | `4. >=3 adversarial cases before happy path` | the inverted order — edges first, happy LAST |
| 17 | `5. full relevant battery green before slot exit` | the exit gate |
| 18 | `micro_loop: red -> green -> refactor (per task)` | the validator's contract marker |
| 19 | `gate: exit only on fresh passing output` | compose:verify iron law — fresh, not cached |
| 20 | `fail_route: 2 failed fixes -> ... ROUTE_DERIVE` | the two-strikes law |
| 21 | `returns to phase: {tests, evidence}` | the return contract |

### 40.11 COMPOSE_NEXT_CARD_MASTER_v1.md — line-by-line (all 25 lines)
| line | content (compressed) | commentary |
|---|---|---|
| 1-9 | frontmatter (compose-function-v1, function: compose-next, id/slot_in fills) | identity + family + the Build-agent-only declaration |
| 10 | `# compose-next 8-phase contract as a wired macro function` | the macro title |
| 11-12 | `phases: orient -> grill -> workspace -> spec -> implement -> verify -> review -> finalize -> finish` | nine gates, eight transitions — the macro skeleton |
| 13 | `contract (per phase, one line gate):` | one line per phase — the whole contract fits a screen |
| 14 | `orient: repo read before any ask` | grounding precedes questions |
| 15 | `grill: 1 decision axis/turn, question tool, recommended-first` | the questioning discipline |
| 16 | `workspace: .worktrees/<slug>, never main w/o consent` | isolation before writes |
| 17-18 | `spec: docs/compose/spec/<feature>.md, S1-S3 + tasks(acceptance, covers, depends, acyclic)` | the spec contract: anchored, tasked, dependency-clean |
| 19 | `implement: dep order, tdd card slots in here` | the macro CALLS the micro — tdd slots nest inside implement |
| 20 | `verify: fresh runs recorded, PRE-EXISTING marked` | honesty about what was green before you arrived |
| 21 | `review: 1 fresh subagent, 3 verdicts, criticals loop` | the P3 next-review panel |
| 22 | `finalize: status delivered + Report block` | the delivery contract |
| 23 | `finish: operator picks close (merge/PR/push/keep)` | the close is OPERATOR-owned |
| 24 | `fail_route: non-convergent review -> impasse report, never force pass` | the honesty law at review |
| 25 | `returns to phase: {spec_path, shas, verification_summary}` | the return contract |

### 40.12 A worked compile — five GSH lines into a §0-§6 fragment
Input (GSH script fragment):
```
#!/goalmode
PIN "harden the login endpoint; battery + panel green"
PHASE 1: TDD login-throttle
GATE "node --test tests/login/" --expect "0 fail"
PANEL 3 --schema {verdict, findings}
ON STUCK: ROUTE_DEBUG->ROUTE_DERIVE->ROUTE_ESCALATE
```
Compiled card fragment (mechanical fill of GOALMODE_CARD_MASTER_v1):
```markdown
## §0 GOAL CONTRACT
outer_success:
  - cmd: "node --test tests/login/"
    expect: "0 fail"
nl_prompt: "harden the login endpoint; battery + panel green"
## §1 PHASE GRAPH
| 1 | throttle | compose | §3.tdd | card pinned | 0 fail |
## §3 COMPOSE FUNCTION SLOTS
- slot: tdd  card: COMPOSE_TDD_CARD  trigger: login-throttle
  micro_loop: red -> green -> refactor
## §4 REVIEW PANELS
- adversarial_panel: parallel() of 3 hostile reviewers, schema {verdict, findings}
## §6 RECOVERY + ROUTING (v2)
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_ESCALATE (last)
```
What the compile did line by line: shebang -> frontmatter; PIN -> nl_prompt (and §0); PHASE -> §1 row (engine compose because TDD); TDD -> §3 slot; GATE -> §0 pair; PANEL -> §4 (n=3, schema carried); ON STUCK -> §6 ladder. EXIT appears NOWHERE — the kernel owns it (GSH_SPEC construct table, row EXIT). The fragment then needs the author's additions the grammar cannot infer: remaining §0 pairs (artifact ls-gates for the panel), the full §6 signature set, §5 ship lines, and the five frontmatter fields' real values — the compile fills mechanically, the author fills TRUTH.

### 40.13 The compile-order checklist (the author's sequence, per the skill's dependency law)
1. Fork the master — `cp cards/masters/<family> cards/<name>.md`; frontmatter five fields real.
2. Fill §0 FIRST — the phases need exit gates to reference; pairs from done-conditions, one per line.
3. Fill §2/§3 slots — every mount real: identity, args, fail_route.
4. Fill §1 — rows reference the slots from step 3; entries/exits mechanical.
5. Fill §6 — signatures calibrated, ladder canon, compaction line present.
6. Fill §4 — panels with schemas + artifact paths matching the §0 ls pairs.
7. §5 — ship/report machinery lines (canon on the master; adjust series names).
8. Validate — `node deploy/battery/validate-cards.mjs cards/` -> `FAIL count 0`.
9. Smoke — `node machinery/run-smoke.mjs .` -> `{"ok": true}`.
10. Pin — hand the operator: `/goal Drive to completion using the Goalmode Card at cards/<name>.md — the card IS the contract (read §0, build to it).`
Order rationale (the skill's): §0 before §1 because exits cite pairs; slots before §1 because rows cite mounts; §6 before first run because a stuck loop without a ladder is a dead loop. Steps 8-9 are the battery's gate — nothing pins on a red battery.

## 41. WORKED FRAGMENTS — 37 legal-vs-illegal pairs across §0-§6 (F1-F37; grew past the 20-pair floor during the density wave)

Each pair: the ILLEGAL fragment, WHY it is illegal (the law + the mechanical detector that names it), the LEGAL fragment, and the PROOF (what the validator/smoke/battery/judge actually emits). Fragments are minimal — they show the shape delta, not whole cards. Detectors: [V] validator, [S] smoke, [B] bridge battery, [K] kernel, [J] judge cold pair.

### F1 (§0) — prose gate vs command pair
ILLEGAL:
```markdown
outer_success:
  - the tetris game feels playable and polished
```
WHY: §0 is the halt vocabulary — commands or nothing (P1). A wish is unjudgeable; the kernel cannot re-run "feels playable" cold. Detector: [V] `§0 has no cmd pairs`.
LEGAL:
```markdown
outer_success:
  - cmd: "python3 -m pytest tests/ -q"
    expect: "0 fail"
```
PROOF: [V] counts `- cmd:` = 1, `expect:` = 1 → balance holds; [J] re-runs pytest cold — the pair is balanceable by construction.

### F2 (§0) — unbalanced pair vs balanced pair
ILLEGAL:
```markdown
outer_success:
  - cmd: "node deploy/battery/validate-cards.mjs cards/"
```
WHY: half a contract reads as none — the balance law counts cmd: vs expect: 1:0. Detector: [V] `§0 cmd/expect mismatch 1/0`.
LEGAL:
```markdown
outer_success:
  - cmd: "node deploy/battery/validate-cards.mjs cards/"
    expect: "FAIL count 0"
```
PROOF: [V] `PASS count 6, FAIL count 0` shape — the expect pins the summary's substring; [J] cold re-run reproduces it.

### F3 (§0) — comparison-as-expect vs count-embedding command
ILLEGAL:
```markdown
outer_success:
  - cmd: "wc -l docs/GOALMODE_CARD_BIBLE.md"
    expect: ">= 3000 lines each"
```
WHY: expect is a SUBSTRING test against the command's own output (gsh.js:31 `.includes(expect)`; [B] run gate polarity). `>= 3000 lines each` only passes if wc's output literally contains it — the live contract gets away with it because the command is `wc -l` on TWO files (output ends `total`-less two-line form)... the honest form embeds the number in the output. The fragile form relies on prose that wc never prints.
LEGAL:
```markdown
outer_success:
  - cmd: "wc -l docs/GOALMODE_CARD_BIBLE.md | awk '{print ($1 >= 3000) ? \"FLOORS MET \" $1 : \"FLOORS RED \" $1}'"
    expect: "FLOORS MET"
```
PROOF: the command's output now CONTAINS the pinned token; [B] `run gate polarity` proves mismatch = {ok:false}, never a throw.

### F4 (§0) — side-effecting gate vs observing gate
ILLEGAL:
```markdown
outer_success:
  - cmd: "rm -rf .panels && mkdir -p .panels && ls .panels/adversarial-verdicts.json"
    expect: "verdicts"
```
WHY: gates observe; they never mutate (F9 — side-effecting gates break replay; the sandbox must replay identically). A gate that deletes artifacts destroys the evidence it claims to check.
LEGAL:
```markdown
outer_success:
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "verdicts"
```
PROOF: cold re-runs are idempotent — [K] final_verification re-runs §0 with no cache; an observing gate returns the same token twice.

### F5 (§0) — chained gate hiding the failing half vs atomic gates
ILLEGAL:
```markdown
outer_success:
  - cmd: "node --test tests/ && node machinery/run-smoke.mjs ."
    expect: "ok"
```
WHY: chains hide WHICH half failed (§18 illegal shapes); `ok` matches the smoke's output but says nothing about the tests half.
LEGAL:
```markdown
outer_success:
  - cmd: "node --test tests/"
    expect: "0 fail"
  - cmd: "node machinery/run-smoke.mjs ."
    expect: "\"ok\": true"
```
PROOF: two pairs, two tokens; [J] fails exactly one and the journal names it — the seq/and laws ([B]) say order+short-circuit, and the §0 form keeps them separate for the judge.

### F6 (§1) — dangling slot ref vs mounted ref
ILLEGAL:
```markdown
| 2 | research | js | §2.survey | card pinned | research.json |
```
(§2 declares only `slot: smoke`)
WHY: the ref resolves to nothing at dispatch — F2 dangling slot; first dispatch nulls. Detector: [K] null at slot resolution (and [S] catches the [FILL]-class cousin).
LEGAL:
```markdown
| 2 | research | js | §2.research | card pinned | research.json |
```
with §2 carrying `- slot: research  card: JS_WORKFLOW_CARD  args: {...}`.
PROOF: [K] dispatch resolves the mount; the BUILD_TETRIS example wires research/smoke exactly so (validator PASS).

### F7 (§1) — prose exit vs mechanical exit
ILLEGAL:
```markdown
| 3 | implement | compose | §3.tdd | spec done | code looks complete |
```
WHY: exit is a mechanical gate per phase (master §1 comment: `exit = mechanical gate per phase`); "looks complete" is unjudgeable.
LEGAL:
```markdown
| 3 | implement | compose | §3.tdd | spec green | pytest 0 fail |
```
PROOF: the exit names a §0-class check the kernel can run; BUILD_TETRIS §1 row 3 is the canon shape (validator PASS).

### F8 (§1) — engine/slot family mismatch vs matched mount
ILLEGAL:
```markdown
| 1 | build | js | §3.tdd | card pinned | battery green |
```
WHY: engine js must reference §2 slots; compose references §3 (§19 illegal: engine-slot family mismatch). The kernel dispatches by engine — a js row pointing at a compose contract dispatches the wrong runtime.
LEGAL:
```markdown
| 1 | build | compose | §3.tdd | card pinned | battery green |
```
PROOF: [K] dispatches the compose contract; the tdd master's trigger (`any feature/bugfix task emitted by the phase graph`) is satisfied by the row.

### F9 (§2) — [FILL] args vs filled args
ILLEGAL:
```markdown
- slot: research  card: JS_WORKFLOW_CARD  args: [FILL JSON]
  fail_route: retry(2) -> §6.ROUTE_DEBUG
```
WHY: the unfilled fork leaks [FILL] into a pinned card — the master's legality does not transfer. Detector: [S] `non-master card still carries [FILL] slots` → {ok:false}.
LEGAL:
```markdown
- slot: research  card: JS_WORKFLOW_CARD  args: {mode: topic-survey}
  fail_route: retry(2) -> §6.ROUTE_DEBUG
```
PROOF: smoke evidence line `cards/<name>.md: frontmatter ok, fills=false` → {ok:true} (the run-smoke output prints fills per file).

### F10 (§2) — untyped workflow return vs schema-gated return
ILLEGAL:
```javascript
const r = await agent("survey the topic", { agentType: "general" });
return { done: r != null };
```
WHY: the typed gate is the point (master comment: `// typed gate = the point`) — an untyped boolean lets an agent-typeable pass through; the substrate token law wants {ok} | null.
LEGAL:
```javascript
const r = await agent("survey the topic", { agentType: "general",
  schema: { type: "object",
    properties: { ok: { type: "boolean" }, evidence: { type: "string" } },
    required: ["ok", "evidence"] } });
const failed = r === null || !r.ok;
```
PROOF: [K] agent() returns the schema-validated object or null; nulls feed the failed[] filter (master line 25) — the same pattern the smoke module gates on.

### F11 (§2) — nondeterminism in the script vs determinism discipline
ILLEGAL:
```javascript
const stamp = new Date().toISOString();
const id = crypto.randomUUID();
return { ok: true, stamp, id };
```
WHY: no Date/crypto/fetch in the script (master L31 determinism comment; GSH_SPEC determinism law) — replay identity IS the anti-cheat layer.
LEGAL:
```javascript
const evidence = results.map(r => r.evidence);
return { ok: true, evidence };
```
PROOF: two cold runs return identical tokens — [K] replay; any timing work belongs INSIDE agent() briefs.

### F12 (§3) — implicit trigger vs declared trigger
ILLEGAL:
```markdown
- slot: next  card: COMPOSE_NEXT_CARD
```
WHY: compose-next demands an EXPLICIT request; the trigger line IS that request (§21 boundary). An untriggered next slot cannot lawfully fire.
LEGAL:
```markdown
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs + ship phases
```
PROOF: the live contract's §3 carries exactly this trigger (validator PASS); [K] the phase graph's docs/ship rows emit the tasks that satisfy it.

### F13 (§3) — wrong-family mount vs compose mount
ILLEGAL:
```markdown
- slot: lint  card: JS_WORKFLOW_CARD  trigger: every phase
  micro_loop: red -> green -> refactor
```
WHY: §3 mounts compose-function-v1 docs only (master: `tdd / next (~ NOT all)`); JS_WORKFLOW_CARD is a §2 binary. Detector: family confusion (F7 class) — review/panel-caught, [V] on the mounted doc shows the family literal.
LEGAL:
```markdown
- slot: lint  card: JS_WORKFLOW_CARD  args: {target: src/}
  fail_route: retry(2) -> §6.ROUTE_DEBUG
```
(as a §2 row)
PROOF: [V] on the workflow doc `export default async function` present → mountable; the §2/§3 boundary is preserved.

### F14 (§4) — schema-less panel vs pinned schema
ILLEGAL:
```markdown
- adversarial_panel: 3 reviewers give their honest opinion
```
WHY: panels-as-data (P5) — a prose verdict is agent-typeable and circular; the schema is the only return channel.
LEGAL:
```markdown
- adversarial_panel: 3 hostile reviewers,
  schema: {verdict: PASS|FAIL, findings[]}, FAIL -> fix loop
```
PROOF: [K] agent({schema}) validates every verdict; a non-conforming return is null → the unit retries/fails — the smoke module and bridge `jobs barrier` carry the same discipline.

### F15 (§4) — majority by chat vs artifact on disk
ILLEGAL:
```markdown
- audit_judge_panel: 3 jurors discussed and agreed in the session
```
WHY: verdicts must be re-runnable facts (iron law 6) — F5 panels without artifacts. Detector: [J] `ls .panels/audit-verdicts.json` → absent → pair FAILS.
LEGAL:
```markdown
- audit_judge_panel: 3-juror on testing data, majority verdict
  artifact: .panels/audit-verdicts.json
```
PROOF: [J] cold ls finds the file; the §0 pair `expect: "3/3 verdicts"` pins its content shape (BUILD_TETRIS pattern).

### F16 (§4) — cached final vs cold final
ILLEGAL:
```markdown
- final_verification: trust the gates that already passed this session
```
WHY: cold-final law (P11) — stale green ships fiction (F12); the kernel re-runs §0 with no cached results.
LEGAL:
```markdown
- final_verification: re-run §0 cold, no cached results
```
PROOF: [K] the final panel re-executes every pair; the deploy-proof's clean-target run is the same law at the install layer.

### F17 (§5) — ship-before-panels vs panels-then-ship
ILLEGAL:
```markdown
## §5 SHIP GATES
- ship: /ship-package (may run while review is in flight to save time)
```
WHY: nothing ships before panels green (§23 ship law); SPG Phase A is docs-current FIRST and the audit verdict outranks deadlines.
LEGAL:
```markdown
## §5 SHIP GATES
- ship: /ship-package (SPG v4 phases A-I)   # entry: §4 artifacts green
- report: /engineering-report -> reports/<SERIES>_v<N>.md
```
PROOF: [K] the ship phase's §1 entry condition references the panel artifacts; the entry cannot balance while a verdict is red.

### F18 (§6) — ESCALATE-first vs ordered ladder
ILLEGAL:
```markdown
- routes (in order): ROUTE_ESCALATE -> ROUTE_DEBUG -> ROUTE_SPLIT
```
WHY: escalate-first kills autonomy (P6, F13) — the operator becomes the first responder instead of the last.
LEGAL:
```markdown
- routes (in order): ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
```
PROOF: [B] `trap routing` registers and resolves canon routes; [K] the ladder dispatches in declared order and the journal shows DEBUG attempts BEFORE any operator ask (§38.9 pattern).

### F19 (§6) — signature-less card vs declared signatures
ILLEGAL:
```markdown
- stuck_signatures: (the kernel will figure it out)
```
WHY: no trap registration → no route ever trips → stuck loops run to the deadline raw. trap() is the mechanism ([B]); the card DECLARES the signatures.
LEGAL:
```markdown
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
```
PROOF: [B] `trap routing` — signatures map to routes via route.match; [K] the kernel watches the declared thresholds per phase.

### F20 (§6) — compaction-less card vs re-entry line
ILLEGAL:
```markdown
- compaction: (agents will remember)
```
WHY: chat does not survive compaction — card + journal + git do (F-class failure: re-asking settled questions). The line is mandatory.
LEGAL:
```markdown
- compaction: reload this card; re-enter last incomplete §1 phase
```
PROOF: [K] the post-compaction agent reloads the card, sha-verifies preserved zones, re-enters the phase — the RECOVER protocol's steps 1-4 (§38.5) execute the line.


### F21 (§0) — interactive gate vs non-interactive gate
ILLEGAL:
```markdown
outer_success:
  - cmd: "psql -h <host> -c 'select 1'"
    expect: "1"
```
WHY: gates run cold and non-interactive — a credential prompt hangs the gate to its deadline, and a hang is a fail (§18; Q-class of §32). Detector: [K] hang-null at the deadline.
LEGAL:
```markdown
outer_success:
  - cmd: "PGPASSWORD=$PGP psql -h <host> -U <user> -c 'select 1' -t"
    expect: "1"
```
PROOF: credentials arrive from the environment (never the tree — the secret-pair law); the gate runs to completion unattended.

### F22 (§0) — unguarded zero-match grep vs the guarded canon form
ILLEGAL:
```markdown
outer_success:
  - cmd: "grep -rEn 'ghp_[A-Za-z0-9]{20,}' ."
    expect: "no output"
```
WHY: a bare grep exits 1 on zero matches — several runners treat the gate command itself as failed before the expect is even read; the canon form guards the exit.
LEGAL:
```markdown
outer_success:
  - cmd: "grep -rEn 'ghp_[A-Za-z0-9]{20,}' . || true"
    expect: "no output"
```
PROOF: `|| true` is the live contract's own form (cards/GOAL_REPO_BUILD_v1.md §0 secret pair) — zero matches yields empty output and a green exit; the judge reads the emptiness.

### F23 (§1) — slot ref into §4 vs §2/§3-only refs
ILLEGAL:
```markdown
| 2 | jury | panel | §4.adversarial | findings.json | verdicts on disk |
```
WHY: §1 slot refs resolve to §2/§3 mounts only (§19) — §4 panels are declared in §4 and carried by phases, not mounted as slots; engine "panel" is not a legal engine value.
LEGAL:
```markdown
| 2 | jury | js | §2.panels | findings.json | verdicts on disk |
```
with §4 declaring the panel and §2.panels dispatching the jury workflow.
PROOF: [K] the js engine resolves §2.panels; the §4 declaration pins the schema/artifact the workflow honors (§37.9 wiring law).

### F24 (§2) — undeclared permissions vs declared patterns with reasons
ILLEGAL:
```javascript
permissions: [{ permission: bash, patterns: ["*"], reason: "" }]
```
WHY: the sudo-boundary law declares patterns UP FRONT with reasons — a wildcard with an empty reason is an undeclared boundary (the shell bible's permission row: "permissions declared up-front").
LEGAL:
```javascript
permissions: [{ permission: read, patterns: ["cards/**"], reason: "read card files" }]
```
PROOF: gm-smoke.js meta is the reference shape (lines 5-7) — pattern scoped to the surface it reads, reason stating why.

### F25 (§3) — compose-next under a non-build mode vs mode: build
ILLEGAL:
```markdown
---
card: goalmode-v1
id: docs-fast
mode: plan
...
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs phase
```
WHY: compose-next requires the Build agent (§21 boundary; NEXT master L6 comment "Build agent, explicit request only") — a plan-mode card cannot discharge the contract.
LEGAL: same card with `mode: build` in frontmatter.
PROOF: [V] accepts both modes syntactically (mode: is presence-checked), but the contract boundary is structural — the skill's phase gates cannot run; the trigger line exists precisely to bind the explicit request to a capable kernel.

### F26 (§4) — even juror count vs odd
ILLEGAL:
```markdown
- adversarial_panel: parallel() of 4 hostile reviewers,
  schema: {verdict: PASS|FAIL, findings[]}
```
WHY: even n deadlocks the majority (2-2) — the route fires on a tie that a juror count choice caused (§36.3).
LEGAL:
```markdown
- adversarial_panel: parallel() of 5 hostile reviewers,
  schema: {verdict: PASS|FAIL, findings[]}
```
PROOF: [K] majority is computable for every verdict set; 5 is the high-stakes size (§25: 3 minimum, 5 high-stakes).

### F27 (§4) — narrative briefing vs evidence-only briefing
ILLEGAL:
```markdown
- audit_judge_panel: 3 jurors read the implementer's session notes
  and confirm the work, majority verdict
```
WHY: jurors who read the narrative confirm it — independence is the constitution of the panel (§37.7 law 1); confirmation-bias verdicts are theatrical greens.
LEGAL:
```markdown
- audit_judge_panel: 3-juror on testing data, majority verdict
  (evidence-only: testing artifacts + run outputs, no session notes)
```
PROOF: the attack-class diversity rule (§25 #7) plus evidence-only briefing — the audit artifact then cites evidence_ref paths, not narration (P2 schema).

### F28 (§5) — report as a wish vs report as machinery
ILLEGAL:
```markdown
- report: document what happened somewhere sensible
```
WHY: the report gate names DELIVERY MACHINERY with a disk path — "somewhere sensible" has no ls-able address; the delivery loses its memory (§23).
LEGAL:
```markdown
- report: /engineering-report -> reports/<SERIES>_v<N>.md
```
PROOF: [J] the reports/ ls pair resolves a real path; the live contract's report line (README-as-report) is the same law with README as the addressable artifact.

### F29 (§6) — invented route names vs the canon six
ILLEGAL:
```markdown
- routes: ROUTE_RETRY -> ROUTE_HELP -> ROUTE_OPERATOR -> ROUTE_DEBUG
```
WHY: routes outside the canon six resolve to null in the trap table ([B] trap routing: match returns the registered name or null) — the ladder silently dead-ends into escalation.
LEGAL:
```markdown
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
```
PROOF: [B] `trap routing` asserts route.match resolves the canon names; the kernel's ladder dispatch (§38.7) knows six rungs and no others.

### F30 (§6) — routes without compaction vs the full §6 block
ILLEGAL:
```markdown
## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
```
WHY: the compaction line is part of the §6 contract (CARD_SCHEMA §6 spec: "compaction re-entry") — a card without it resumes post-compaction by re-asking settled questions (P7's "never re-ask" violated).
LEGAL:
```markdown
## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
- compaction: reload this card; re-enter last incomplete §1 phase
```
PROOF: all three live cards (master, contract, example) close §6 with the compaction line; [K] the RECOVER protocol's step 1 executes it verbatim.

### F31 (§0) — machine-specific path vs repo-relative path
ILLEGAL:
```markdown
outer_success:
  - cmd: "ls /home/leviathan/work/notes/spec.md"
    expect: "spec exists"
```
WHY: hardcoded machine-specific paths break replay on any other checkout — the repo-relative law (P12/D-P9) keeps the public tree free of private homes (R5 class: no hardcoded paths).
LEGAL:
```markdown
outer_success:
  - cmd: "ls docs/specs/spec.md"
    expect: "spec exists"
```
PROOF: the deploy-proof's clean-target run EXPOSES absolute-path gates — the target tree has no /home/<user>; [V] never parses paths, so this is author discipline with a kernel-time exposure.

### F32 (§1) — inverted row order vs cheapest-blast-first order
ILLEGAL:
```markdown
| 1 | verify | js | §2.smoke | card pinned | all §0 green |
| 2 | implement | compose | §3.tdd | battery green | pytest 0 fail |
```
WHY: §1 order IS execution (master L28 comment) — row 1 gates artifacts row 2 has not produced; the entry/exit chain is unsatisfiable in row order.
LEGAL:
```markdown
| 1 | implement | compose | §3.tdd | card pinned | pytest 0 fail |
| 2 | verify | js | §2.smoke | engine green | all §0 green |
```
PROOF: [K] walks rows in order — BUILD_TETRIS's research->spec->implement->verify is the canon shape; every entry resolves to a prior row's output.

### F33 (§2/§3) — ambiguous slot-name duplication vs prefixed namespaces
ILLEGAL:
```markdown
## §2 JS WORKFLOW SLOTS
- slot: research  card: JS_WORKFLOW_CARD  args: {mode: survey}
## §3 COMPOSE FUNCTION SLOTS
- slot: research  card: COMPOSE_TDD_CARD  trigger: phase 1
```
WHY: §2 and §3 are separate namespaces, so the collision is technically legal (§32-Q14) — but every later `§2.research` vs `§3.research` edit is a dangling-ref wait-state; unprefixed duplicates are the smell that becomes F6.
LEGAL:
```markdown
- slot: js-research  card: JS_WORKFLOW_CARD  args: {mode: survey}
- slot: tdd-research  card: COMPOSE_TDD_CARD  trigger: phase 1
```
PROOF: [K] both mounts resolve either way — the fix is readability discipline; the review panel flags unprefixed collisions as F7-class confusion.

### F34 (§3) — a dead loop line on a next slot vs the phases-owned loop
ILLEGAL:
```markdown
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs phase
  micro_loop: red -> green -> refactor
```
WHY: compose-next's loop is its own nine phase gates (NEXT master L11-23) — a micro_loop line there is dead text that misreads the contract (§36.2 illegal table: "the 8-phase contract ignores it").
LEGAL:
```markdown
- slot: next  card: COMPOSE_NEXT_CARD  trigger: docs phase
```
PROOF: [V] `no contract body` never fires (phases: exists in the mounted doc) — the illegality is semantic: the line claims a loop the contract does not run.

### F35 (§4) — unbounded fix loop vs fix(2) then route
ILLEGAL:
```markdown
- adversarial_panel: 3 hostile reviewers, schema {verdict, findings},
  FAIL -> fix and re-panel until PASS
```
WHY: "until PASS" is until() WITHOUT a cap — the bridge law caps re-beats (battery law `until cap`: at most k, cap respected); an unbounded fix loop is an infinite loop that hides a failing design.
LEGAL:
```markdown
- adversarial_panel: 3 hostile reviewers, schema {verdict, findings},
  FAIL -> fix loop (max 2) -> ROUTE_DERIVE
```
PROOF: [B] `until cap` pins the cap law at the bridge layer; the master §4 line pre-seeds the bound; the two-strikes law carries the refusal to a third blind retry.

### F36 (§6) — uncounted route attempts vs counted, cited attempts
ILLEGAL:
```markdown
[ROUTE_DEBUG] sig=same-fail phase=3 rca=state leak fix=tmp dirs exit=failed
[ROUTE_DEBUG] sig=same-fail phase=3 rca=still leaking fix=more tmp dirs exit=failed
[ROUTE_DEBUG] sig=same-fail phase=3 rca=??? fix=??? exit=failed
```
WHY: without attempt counters the ESCALATE threshold ("after 3 logged route failures") is UNAUDITABLE — the counter reads the journal (§38.12: attempt is 1-based per route+phase); uncounted lines make the count a guess.
LEGAL:
```markdown
[ROUTE_DEBUG] sig=same-fail phase=3 attempt=1 rca=test-order state leak fix=per-test tmp dir exit=failed
[ROUTE_DEBUG] sig=same-fail phase=3 attempt=2 rca=suite-level leak fix=session-scoped fixture exit=failed
[ROUTE_DEBUG] sig=same-fail phase=3 attempt=3 rca=worker parallelism shares tmp fix=??? exit=failed
[ROUTE_ESCALATE] sig=same-fail phase=3 attempts=3 ask=which isolation boundary — per-worker tmp root? ruling=per-worker tmp root exit=engaged
```
PROOF: [K] the ESCALATE rule fires on three COUNTED, journal-backed failures — the ask cites them; the ruling engages as a work order (§38.6 protocol).

### F37 (§5) — private report address vs repo-relative delivery
ILLEGAL:
```markdown
- report: /engineering-report -> /home/leviathan/reports/Tetris_v1.md
```
WHY: F31's class at the delivery layer — the report's address must live inside the tree or the ls pair is machine-bound and the delivery loses its public memory (P12).
LEGAL:
```markdown
- report: /engineering-report -> reports/Tetris_Engineering_Report_v1.md
```
PROOF: [J] the ls pair resolves inside ANY checkout — BUILD_TETRIS §5's report line is the canon form (`reports/Tetris_Engineering_Report_v1.md`).

### 41.31 The five-question pair test (how to author a NEW pair that survives)
1. Does the command PRINT what the expect pins? — the substring law (gsh.js:31; F3).
2. Does the pair replay identically cold, on any checkout? — no side effects, no machine paths (F4, F31).
3. Does the exit/entry resolve to something in THIS card? — the closed-graph law (§36.7; F6).
4. Does the failure NAME itself in the journal or artifact? — loud-fail, never silent (§38.12; F36).
5. Is every bound counted — cap, attempt, floor? — nothing uncapped, nothing uncounted (F35, F36).
A pair passing all five is card-legal before the validator even runs — the validator catches IDENTITY; these five catch MEANING.

Pair index (coverage map, F1-F37): §0 F1-F5 + F21-F22 + F31 (prose, balance, substring, side-effects, chains, interactivity, guard form, repo-relative) · §1 F6-F8 + F23 + F32 (dangling, prose exit, family mismatch, §4-ref, row order) · §2 F9-F11 + F24 + F33 (FILL leak, typed gate, determinism, permissions, name collision) · §3 F12-F13 + F25 + F34 (trigger, family boundary, mode, dead loop line) · §4 F14-F16 + F26-F27 + F35 (schema, artifact, cold, parity, independence, unbounded loop) · §5 F17 + F28 + F37 (order, machinery, private address) · §6 F18-F20 + F29-F30 + F36 (ladder, signatures, compaction, canon names, full block, counted attempts). Every detector named above exists in the repo today: validator strings verbatim from deploy/battery/validate-cards.mjs, smoke keys from gm-smoke.js, battery laws from bridge-tests.mjs, kernel behaviors from GSH_SPEC + the masters.

## 42. CARD FAQ (60 NEW questions — one line each; none repeats §32)

Q1 Can two cards share one id? No — id is the unique slug the kernel keys on; duplicates shadow.
Q2 Must version start at 1? Convention yes; any positive integer is legal — the validator checks presence.
Q3 What increments version? A git-visible §0 amendment by the operator — version follows the amendment.
Q4 Can forked-from point at a sibling card instead of a master? Yes — forks of forks chain lineage.
Q5 Does mode affect which skills may run? Yes — mode: build is the precondition for compose-next slots.
Q6 What is workflows: in frontmatter for? The workflow paths this card owns — the live contract owns gm-smoke.js.
Q7 Can baseline carry a branch name only? No — "branch @ commit"; the commit pins replay.
Q8 Are comments legal inside §0? Yes — the master seeds them; the validator counts only cmd:/expect: lines.
Q9 Can success_criteria contradict outer_success? Never — every criterion maps to a §0 pair.
Q10 Who executes nl_prompt? The composing agents — it is their WHAT brief; the judge never grades prose.
Q11 Can nl_prompt contain HOW? No — 1-3 sentences of WHAT; HOW lives in §1-§3.
Q12 Is the anti_cheat line editable? Keep it verbatim — it is the canon statement of the enforcement model.
Q13 Can one §1 row mount two slots? One slot per row; fan-out lives INSIDE the slot (glob -> parallel).
Q14 What is the shell engine in the live contract's phase 1? The operator's scaffold — entry: approval, done by hand, not a runtime engine.
Q15 Can entry be empty? No — every row carries a mechanical entry condition.
Q16 Must §1 numbers be sequential? Rows execute in order; sequential # is readability discipline, not semantics.
Q17 Can a card have zero §2 slots? Yes — a pure-compose card is legal (all engines compose).
Q18 Can a card have zero §3 slots? Yes — a pure-binary card is legal (all engines js).
Q19 What proves a §2 slot ran? Its {ok:true,...} token in the run journal.
Q20 What proves a §3 slot ran? The contract's returns — {tests, evidence} from tdd, {spec_path, shas, verification_summary} from next.
Q21 Can a slot return fields beyond ok? Yes — evidence is the convention; the schema fixes the shape.
Q22 Who writes a slot's args? The card author — args are the dataflow entry the author owns.
Q23 Can args carry another slot's output? Via dataflow — pipe carries a's result into b (bridge law).
Q24 What happens when a workflow hangs? Null at the deadline — hangs are failures, never exceptions.
Q25 Can a workflow spawn another workflow? Composition is the parent card's job — slots, not self-spawning.
Q26 What is meta.permissions for? The sudo-boundary declaration — patterns and reasons up front.
Q27 Does the validator check permissions? No — v1 checks identity and contract; permissions are runtime surface.
Q28 Can one tdd slot implement several units? The loop is per task — fan units via a §2 binary or more §1 rows.
Q29 What counts as RED evidence? The failing run's recorded output — kept BEFORE implementation starts.
Q30 Why do adversarial cases precede the happy path? Happy-path-first hides edges; the tdd contract inverts the order.
Q31 What is the two-strikes law? 2 failed fixes -> stop patching -> ROUTE_DERIVE — never a third blind retry.
Q32 Can a next slot skip grill? No — the nine gates are the contract; skipping is a spec violation.
Q33 What is an impasse report? The non-convergence deliverable — what blocks, what was tried, what the operator must decide.
Q34 Who picks the close at finish? The operator — merge/PR/push/keep is their call.
Q35 What does a next slot return? {spec_path, shas, verification_summary} — the phase consumes it.
Q36 Can panels run before any artifact exists? No — adversarial panels judge artifacts, audit panels judge testing data; nothing to judge, nothing to run.
Q37 How are verdicts stored? JSON on disk — verdicts array + majority + fix-loop count, one artifact per panel.
Q38 Who reads panel artifacts? The judge (§0 ls pairs), the ship gates, and the next panel in the chain.
Q39 Can a panel artifact be written by hand? Only by the panel process — a forged artifact breaks replay and the cold re-run exposes it.
Q40 Two jurors PASS, one files CRITICAL — majority? FAIL — any CRITICAL forces FAIL regardless of count.
Q41 What n for a security panel? 3 — and any live token shape fails it outright, majority aside.
Q42 Do docs panels grade style? No — anchors, measured counts, structure; style is not judgeable.
Q43 What is a perf budget? A pinned metric with a measured value — breaches FAIL unless the spec carries an operator-waived note.
Q44 Can a card skip final_verification? Never — the cold-final law has no waiver.
Q45 What does "cold" mean exactly? Re-executed now against the world, no cached outputs, same tokens expected.
Q46 Why must ESCALATE wait for 3 logged failures? Below 3 the ladder has unspent rungs; the journal is the proof they were spent.
Q47 Can the operator be asked twice on one fork? A NEW signature is a new ask; the same fork is asked once, recommended-first.
Q48 What journals route attempts? The run journal — one line per attempt in the §38 format.
Q49 What is a route's exit condition? The phase gate moving under the route's fix — progress is the verdict.
Q50 Can routes be reordered per phase? No — ladder order is fixed; calibration tunes thresholds, never order.
Q51 What exactly is the null-rate? agent() nulls divided by agent() calls in the phase.
Q52 What else trips ROUTE_RECOVER besides compaction? Deadline breach with state intact; environment reset.
Q53 Does the validator check §1-§6 content? Only section PRESENCE (goalmode-v1) — depth is the battery/judge/kernel's job.
Q54 Why is the validator family-aware? Three families, three body shapes — a one-size schema rejects legal cards (D-P4).
Q55 Can I validate a single card? Yes — the walker takes any root: `node deploy/battery/validate-cards.mjs cards/examples/`.
Q56 What exit code means green? 0 — any FAIL makes exit 1.
Q57 What does the smoke catch that the validator cannot? Fill-leak legality per non-master file — content, not identity.
Q58 What does deploy-proof add beyond smoke? Clean-target install plus in-target smoke — the substrate boots in a fresh tree.
Q59 Can the battery run unattended (CI)? Yes — validator, bridge-tests, smoke, and proof are node/bash with exit codes.
Q60 Validator and smoke disagree — who wins? Suspect the measurer first (§39.5), re-run both, never edit healthy cards to please a broken ruler.

## 43. CARD GLOSSARY II (50 NEW terms — one line each; none repeats §33)

adversarial_panel — the §4 hostile-reviewer jury: n odd, schema verdicts, fix(2) then route.
agentType — the agent() option selecting general|explore for a unit.
allSettled — the jobs() barrier primitive (gsh.js:41): every verdict collected, one rejection never kills the panel.
anchor — the [Sn] numbered spec marker a docs gate counts (grep -c 'S[0-9]').
args global — the sandbox variable fed from a §2 row's args JSON.
attack class — the distinct failure hunt each juror owns (play it / fuzz it / read it / replay it).
audit_judge_panel — the fixed-3 evidence-only judge on testing data.
baseline — frontmatter's branch @ commit replay pin.
brief — the distilled per-unit instruction inside agent() — where the binary's engineering lives.
build-review — panel P1: the adversarial build jury writing .panels/adversarial-verdicts.json.
calibrate — card-level tuning of stuck thresholds within fixed kernel ceilings.
chain — multiple commands in one gate line — illegal in §0 (hides the failing half).
check() — the validator's per-file function (validate-cards.mjs:20) — every error string is single-sourced here.
compaction line — §6's mandatory reload-card/re-enter-phase declaration.
compose-function-v1 — the library family: function: compose:tdd or compose-next.
criticals loop — compose-next review's fix-and-re-review cycle until no CRITICAL remains.
determinism — no Date/crypto/fetch/process in scripts — inside agent() only; replay IS anti-cheat.
diff pair — a §0 migration gate asserting byte-exactness via empty diff output.
dispatch key — the card: literal that selects the validator's family branch.
docs panel — panel P5: anchors present, counts measured, structure in spec order.
dormancy — a mounted §2/§3 slot with no §1 reference — legal, flagged as a smell.
entry — a §1 row's mechanical start condition.
enumerate-don't-spawn — glob the units before parallel(agent) — units are data (master comment).
error string — a validator message; fix the card it names, never the string.
evidence array — the smoke's per-file result list inside {ok, checked, evidence}.
evidence-only — the juror briefing law: artifacts and runs, never the implementer's narrative.
fail_token — {ok:false,...} — the workflow's failure vocabulary (never a throw).
family dispatch — the validator branching on card: to the right check set.
fan-out — one slot fanning many units via glob -> parallel.
final_verification — the §4 cold re-run of every §0 pair before halt release.
fix loop — the panel repair cycle capped at 2, then ROUTE_DERIVE.
floors — documented minimums (doc lines, panel n, pair counts) met honestly and reported honestly.
glob — the enumeration global a workflow calls first.
goalmode-v1 — the program family: §0-§6, the only family the kernel pins.
hang-null — a timed-out slot resolves null — failure, not exception.
health pair — a §0 curl/200 availability gate (cadence cards).
impasse report — compose-next's non-convergence deliverable — never a forced pass.
journal — the run log: gate tokens, route lines, panel verdicts land here.
js-workflow-v1 — the binary family: meta + export default async function.
ladder — the ordered six-route §6 table; order IS dispatch order.
live card — a filled, pinned card running under a kernel (vs a master template).
measurer bug — a false reading from measuring code (§39.5) — suspect the ruler before the world.
meta — js-workflow frontmatter's workflows.md contract block (name/description/phases/permissions).
micro_loop — red -> green -> refactor per task — the tdd contract marker.
no-progress — stuck signature: K iterations without gate movement.
null-rate — share of agent() calls returning null in a phase; >30% trips SWITCH.
pass_token — {ok:true,...} — the only success vocabulary.
permissions — meta's declared sudo-boundary: patterns + reasons, up front.
perf panel — panel P6: budgets vs measured, deltas reported for every metric.
pin — the operator's /goal exec() — the kernel starts on their word, never before.

## 44. CARD TROUBLESHOOTING II (25 NEW rows; none repeats §34)

| symptom | cause | fix |
|---|---|---|
| validator prints nothing, exits 0 | root arg points at an empty dir | pass the cards dir explicitly |
| `mismatch 3/5` but pairs look balanced | `expect:` typoed (expects/expected) | the literal key `expect:` |
| `§0 missing nl_prompt` though it exists | nl_prompt sits above `## §0` | move it inside the §0->§1 slice |
| `missing section ## §6` though present | heading written `## 6` or `### §6` | the literal two-space `## §N` form |
| `unknown family "goalmode"` | -v1 suffix dropped | three literals all end in -v1 |
| smoke `checked: 4` not 5 | glob misses a master file | keep `cards/masters/*.md` shape |
| smoke `ok:false ... unreadable` | BOM/CRLF breaks `startsWith('---')` | strip BOM, LF line endings |
| smoke green, judge fails the ls pair | artifact written after phase exit | write artifacts BEFORE the gate |
| bridge battery `RED: gsh.js not importable` | run from the wrong cwd | run from repo root; battery resolves ../../sdk/bridge/gsh.js |
| deploy proof `MISSING` one file | DEPLOY.sh list drifted from required[] | sync both lists in ONE commit |
| deploy smoke fails in target | harness root arg wrong | run-smoke takes `.` from the target cwd |
| until() never succeeds | gate always false inside cap | fix the gate; raise k only by calibration |
| jobs() fails but every unit passed | a thunk REJECTED (threw) | read failed[] evidence — the rejection is the unit bug |
| seq skipped the second slot | first returned {ok:false} — short-circuit law | fix the first slot, not the sequencing |
| env var lost across slots | exportVar called after the consumer | export BEFORE the consuming slot |
| route.match returns null | signature never trapped | trap(sig, route) before any match |
| panel verdict comes back null | return shape violates the schema | align the schema with §4's declared shape |
| panel majority PASS, judge still holds | §0 ls pair names a different path | artifact path MUST equal the pair's path |
| fix loop never increments | fixes applied without re-panel | re-panel after EVERY fix; count to 2 then route |
| ESCALATE fired after one failure | counter read an empty journal | journal every attempt — the counter reads the journal |
| research phase routes constantly | no-progress K calibrated for build | raise K per the §38.8 calibration table |
| compile dropped my `EXIT 0` | EXIT is kernel-owned | nothing to fix — stop writing EXIT in scripts |
| compiled card has no §5 | GSH script had no SHIP construct | add SHIP or write §5 by hand before validate |
| cards/ subfolder never validated | walker covers subdirs — root was wrong | point the root at the tree that owns them |
| README battery table count stale | a growth wave landed unrecorded | update honest counts with the wave that moved them |

=== END CARD BIBLE BODY v1.5 (honest line count recorded in README battery table) ===
