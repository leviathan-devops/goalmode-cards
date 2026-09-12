---
card: goalmode-v1
id: build-tetris-v1
version: 1
forked-from: GOALMODE_CARD_MASTER_v1
mode: build
baseline: master @ <sha>
workflows: [.mimocode/workflows/gm-smoke.js]
---
# BUILD TETRIS (worked example — pin me in a project with a tetris spec)

## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls docs/specs/tetris.md"
    expect: "spec exists"
  - cmd: "grep -c 'S[0-9]' docs/specs/tetris.md"
    expect: "5"
  - cmd: "python3 -m pytest tests/ -q"
    expect: "0 fail"
  - cmd: "workflow run gm-smoke"
    expect: "\"ok\": true"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "ls Ship_Packages/tetris/PACKAGE_AUDIT.md"
    expect: "verdict PASS"
nl_prompt: "build playable tetris; ship only when spec + battery green"
success_criteria:
  - spec anchored (>=5 [Sn]); battery green; panel majority PASS
anti_cheat: conditions are commands; schema-nulls fail; sandbox replays.

## §1 PHASE GRAPH
| # | phase | engine | slot | entry | exit |
|---|-------|--------|------|-------|------|
| 1 | research | js | §2.research | card pinned | research.json |
| 2 | spec | compose | §3.next | research.json | spec anchors >= 5 |
| 3 | implement | compose | §3.tdd | spec green | pytest 0 fail |
| 4 | verify | js | §2.smoke + §4 | engine green | all §0 green |

## §2 JS WORKFLOW SLOTS
- slot: research  card: JS_WORKFLOW_CARD  args: {mode: topic-survey}
  fail_route: retry(2) -> §6.ROUTE_DEBUG
- slot: smoke  card: JS_WORKFLOW_CARD  args: {target: tetris}
  fail_route: retry(2) -> §6.ROUTE_DEBUG

## §3 COMPOSE FUNCTION SLOTS
- slot: tdd  card: COMPOSE_TDD_CARD  trigger: engine.py, render.py
  micro_loop: red -> green -> refactor
- slot: spec  card: COMPOSE_NEXT_CARD  trigger: phase 2

## §4 REVIEW PANELS
- adversarial_panel: 3 hostile players, schema {verdict, findings},
  plays the game, hunts stuck-piece/rotation/clear bugs
- final_verification: re-run §0 cold, no cached results

## §5 SHIP GATES
- ship: /ship-package (SPG A-I)
- report: /engineering-report -> reports/Tetris_Engineering_Report_v1.md

## §6 RECOVERY + ROUTING (v2)
- stuck_signatures: no-progress 3 | same-fail 2x | null-rate >30%
- routes: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT
  -> ROUTE_SWITCH -> ROUTE_RECOVER -> ROUTE_ESCALATE (last)
- compaction: reload this card; re-enter last incomplete §1 phase
