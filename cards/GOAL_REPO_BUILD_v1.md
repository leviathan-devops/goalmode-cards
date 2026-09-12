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
  - cmd: "node machinery/run-smoke.mjs ."
    expect: "\"ok\": true"
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
| 3 | substrate | tdd | §3.tdd | sdk | gm-smoke {ok:true} via workflow tool |
| 4 | example card | compose | §3.tdd | substrate | tetris card validates |
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
