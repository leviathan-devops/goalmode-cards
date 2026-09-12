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
