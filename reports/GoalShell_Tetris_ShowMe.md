# GOAL SHELL x BUILD TETRIS — ShowMe Blueprint
**SPINE:** BLUEPRINT · **Date:** 2026-09-12 · **Ingredients:** ascii-diagrams, ascii-graph, ascii-visualize, ascii-simulator, engineering-report, trident-deep-planning
**Demonstrates:** the Bridge — raw shell → GSH script → GM card → /goal kernel, one program, four layers
**Home:** Shared Workspace Context/MIMOCODE/Goalmode_Cards/ (anchors below cite this root as GC/)

## L0 — THE FOUR LAYERS (master view: one program, four representations)

```
┌ LAYER 1: RAW SHELL (sh) ── control flow + exit codes only ─┐
│ deps · codegen · selftest · tar.  NO judge, NO spec,       │
│ NO panels, NO routes. exit 0 means "script survived".      │
└──────────────┬─────────────────────────────────────────────┘
               ▼  Bridge import: gsh.js + GSH_SPEC translator
┌ LAYER 2: GSH — goalmode shell grammar (script form) ───────┐
│ PIN · SPEC · PHASE · TDD · RUN · PANEL · ON STUCK ·        │
│ SHIP · EXIT   (shell-shaped superset of layer 1)           │
└──────────────┬──────────────────────────────────────────────┘
               ▼  gm-compile: translator fills master template
┌ LAYER 3: GM CARD — pinned program document (§0-§6) ────────┐
│ mechanical gates · js+compose slots · panels · routes      │
│ testing/debug/verification wired against spec + blueprint  │
└──────────────┬──────────────────────────────────────────────┘
               ▼  /goal pin
┌ LAYER 4: /goal KERNEL — judge-gated execution ─────────────┐
│ macro phases → micro loops → cold gates → panels → ship    │
│ GOAL COMPLETE = exit(0), kernel-released, never scripted   │
└─────────────────────────────────────────────────────────────┘
```

## L1 — SIDE-BY-SIDE A: THE RAW SHELL PROGRAM (what sh gives, where it dies)

```sh
#!/bin/sh
set -eu                                  # die on first failure
mkdir -p tetris && cd tetris
cat > tetris.py << 'EOF'                 # codegen by heredoc
<the game source: playfield, pieces,
 rotation, gravity, line clear, score,
 keyboard input loop>
EOF
python3 -m py_compile tetris.py          # syntax gate
python3 tetris.py --selftest             # exit code = ONLY verdict
tar czf tetris.tar.gz tetris.py          # "ship" = tar
exit 0
```

| sh mechanic | what it gave tetris | where it DEAD-ENDS |
|---|---|---|
| `set -eu` | fail-fast sequencing | one failed selftest kills the build; no retry, no route |
| heredoc codegen | code emitted from the script | no spec exists; code IS the spec |
| `py_compile` | syntax gate | syntactically-valid broken tetris passes |
| `--selftest` exit code | the only verification | no adversarial play, no spec check, no judge |
| `tar` | a package | no audit, no report, no evidence chain |
| `exit 0` | script survived | NOTHING was verified — the gap this bridge closes |

## L2 — SIDE-BY-SIDE B: THE GSH PSEUDOCODE TEMPLATE (same build, shell grammar)

```
#!/goalmode
PIN  "build playable tetris; ship only when spec + battery verify green"
SPEC docs/specs/tetris.md            # research->spec translation artifact
PHASE research: RUN gm-research --mode topic-survey
               "tetris mechanics, playfield spec, rotation systems"
               -> research.json
PHASE spec:     WRITE spec FROM research + operator prose
PHASE implement:
    TDD  tetris/engine.py            # compose:tdd: RED->GREEN->refactor
    TDD  tetris/render.py
    RUN  gm-smoke --target tetris    # deterministic js binary slot
PHASE verify:
    PANEL 3 --schema {verdict,findings}
    until(GATE "python3 -m pytest tests/ -q", 3)
    GATE  "grep -c 'S[0-9]' docs/specs/tetris.md >= 5"
ON  STUCK: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE
SHIP: /ship-package AND /engineering-report
EXIT 0
```

Construct → mechanism table (the GSH_SPEC contract, every line compiles):

| GSH construct | gsh.js call | substrate primitive | anchor |
|---|---|---|---|
| `#!/goalmode` | card frontmatter | template :1-9 | GC/Goalmode_Cards/templates/GOALMODE_CARD_MASTER_v1.md:1 |
| `PIN` | nl_prompt in §0 | judge-gated halt | GC/.../GOAL_BUILD_v1.md:57-61 |
| `SPEC` | spec artifact + anchors | §0 grep gates | GOAL_BUILD_v1.md:33-35 |
| `PHASE n:` | §1 phase rows | pipeline order | template :23-27 |
| `TDD` | §3 compose slot | compose:tdd contract | template :34-36 |
| `RUN` | §2 js slot | workflow run | workflows.md:86 |
| `PANEL n` | §4 parallel jurors | agent({schema}) | workflows.md:46 |
| `until(GATE,k)` | judge re-beat | cold cmd rerun | GOAL_BUILD_v1.md:12 |
| `ON STUCK` | §6 route table | trap handlers | template :48-53 |
| `SHIP` | §5 gates | /ship-package + /engineering-report | GOAL_BUILD_v1.md:78-80 |
| `EXIT 0` | kernel release | judge only — not scriptable | bible:80 (GOAL COMPLETE) |

## L3 — SIDE-BY-SIDE C: THE PINNED GM CARD (compiled from B; test/debug/verify wired)

```markdown
---
card: goalmode-v1
id: build-tetris-v1
version: 1
forked-from: GOALMODE_CARD_MASTER_v1
mode: build
baseline: master @ <sha>
workflows: [.mimocode/workflows/gm-research.js,
            .mimocode/workflows/gm-smoke.js]
---
# BUILD TETRIS

## §0 GOAL CONTRACT (kernel reads THIS — commands, not prose)
outer_success:
  - cmd: "ls docs/specs/tetris.md"
    expect: "spec exists, >=5 [Sn] anchors"
  - cmd: "grep -c 'S[0-9]' docs/specs/tetris.md"
    expect: ">= 5"
  - cmd: "python3 -m pytest tests/ -q"
    expect: "N pass, 0 fail"
  - cmd: "workflow run gm-smoke --args {target:tetris}"
    expect: "{ok:true}"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present, majority PASS"
  - cmd: "ls Ship_Packages/tetris/PACKAGE_AUDIT.md"
    expect: "verdict PASS"
  - cmd: "grep -rn 'sk-' --include='*' . | grep -v REDACTED"
    expect: "no output (zero secrets)"
nl_prompt: "build playable tetris; ship only when spec + battery green"
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
- slot: spec  card: COMPOSE_NEXT_CARD (spec phase only)  trigger: phase 2

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
```

Built-in testing = §0 pytest + smoke + panel artifacts. Built-in debugging = §6 routes (compose:debug RCA first). Built-in verification against the SPEC = the `[Sn]` anchor grep; against the BLUEPRINT = §1 exits + §4 verdicts cite spec sections; kernel re-runs §0 cold.

## L4 — SIDE-BY-SIDE D: PSEUDOCODE OF THE PINNED CARD (the kernel executing it)

```
┌──────────────────────────────────────┐
│ kernel(card):                        │
│   verify frontmatter schema          │
│   load §0 as [(cmd, expect)]         │
│                                      │
│   for phase in §1 (order)            │
│     if engine is js                  │
│       r = workflow run slot          │
│       gate on {ok} | null            │
│     if engine is compose             │
│       run skill contract             │
│       gate on fresh verify output    │
│     on stuck_signature               │
│       run §6 routes in order         │
│       3 route fails -> ESCALATE      │
│                                      │
│   panels: adversarial, then final    │
│   ship: spg A-I + report             │
│                                      │
│   judge: run §0 cold                 │
│     all pass -> EXIT 0               │
│     else      -> continue loop       │
│                                      │
│ EXIT is kernel-owned; the card       │
│ cannot script its own release        │
└──────────────────────────────────────┘
```

## L5 — THE TRANSLATION TRACE (A → B → C → D, the bridge compiler steps)

```
TIMELINE: operator says "build tetris from scratch"
STEP 1  prose -> GSH       translator maps verbs: build->TDD slot,
         verify->GATE, ship->SHIP, stuck->ON STUCK   (L2 shape)
STEP 2  GSH -> card        gm-compile fills master template:
         PIN->§0 nl_prompt, PHASE->§1 rows, RUN->§2 slots,
         TDD->§3 slots, PANEL->§4, ON STUCK->§6      (L3 shape)
STEP 3  card -> kernel     /goal pin; judge loads §0;
         phases dispatch engines; slots return
         {ok,evidence}|null; routes trap stuckness   (L4)
RESULT   tetris shipped when §0 passes cold — every layer
         above verified the SAME program at its own level
```

## L6 — FILE TREE OF THE TETRIS BUILD OUTPUT (ascii-graph, shown=9 total=9)

```
┌ tetris/ (built by the pinned card) ─────────┐
├─────────────────────────────────────────────┤
│ ├─ docs/specs/tetris.md      [S1..Sn] spec  │
│ ├─ tetris/engine.py          tdd slot out   │
│ ├─ tetris/render.py          tdd slot out   │
│ ├─ tests/                    battery        │
│ ├─ .panels/adversarial-verdicts.json        │
│ ├─ Ship_Packages/tetris/     SPG output     │
│ └─ reports/...Report_v1.md   chat+disk      │
└─────────────────────────────────────────────┘
```

## L7 — INTERFACES, FAILURE MODES, OPEN DECISIONS

Interfaces: GSH grammar (11 constructs, L2 table) · gsh.js (construct library over sandbox API) · gm-compile (translator) · card schema (§0-§6, template :12-53) · kernel contract (§0 cold re-run).

| failure mode | cause | bridge countermeasure |
|---|---|---|
| translation drift | GSH line lost in compile | construct-coverage grep: every L2 line maps to a card line |
| prose-ified gate | translator emits text where cmd expected | schema validator rejects non-cmd §0 lines |
| sandbox break in gsh.js | Date/crypto/fetch in library | workflows.md:78 strip — library tested against it |
| trap misfire on slow phase | deadline too tight | K constants per card, §6 orders routes, ESCALATE last |
| agent self-exit attempt | card tries to script EXIT 0 | kernel-owned release — not addressable from slots |

Open decisions: (1) grammar surface — minimal 11 constructs (recommended) vs full POSIX subset; (2) tetris implementation language for the demo — python (recommended, selftest + pytest natural); (3) compiler home — gm-compile workflow (recommended, deterministic) vs skill.

## SELF-CHECK
Spine BLUEPRINT named. Ingredients loaded via skill tool this session. Box law: every diagram ≤76 cols (max measured 62, L0). Anchors: template :1-9/:12/:23-27/:34-36/:48-53 verified by grep this turn; GOAL_BUILD_v1 and workflows.md lines verified earlier this session. Caps: L6 shown=9 total=9. File = this chat content at GC/reports/GoalShell_Tetris_ShowMe.md.
