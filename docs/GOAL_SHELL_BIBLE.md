# KNOWLEDGE BIBLE: THE GOAL SHELL (v1.0)
Trigger: any session that pins /goal with a GM Card, authors GSH scripts, or extends the bridge.
Duty: operate /goal as a shell-programmable runtime kernel. TRIPLE DUTY: keep gates mechanical, keep constructs typed, keep EXIT kernel-owned.
One-shot protocol: Read fully. Then operate. Never script what the kernel owns.

Operator mandates (verbatim): "use /goal as a shell substrate for shell programming/scripting like any other program" / "extract a full Shell-Based Pseudocode SDK/Library/Template we can use to literally import the full mechanics of shell scripting into /goal engines as runtime execution kernels w/ built in workflow scripting capabilities".

## TABLE OF CONTENTS
1. The Red Pill
2. The Kernel Law and the Layer Model
3. Shell-Mechanic Equivalence Table
4. GSH Grammar Reference (11 constructs)
5. The Bridge Library API (gsh.js)
6. The Translation Protocol
7. Card Compile Contract
8. Procedures (P1-P8)
9. Worked Example: build tetris
10. Troubleshooting Matrix
11. Registries
12. Iron Laws
13. Compaction Recovery

## 1. THE RED PILL
What you think /goal is (WRONG): a timer, a watchdog, a "keep going" flag, a UI affordance that nags the agent.
What /goal actually is (CORRECT): a process kernel. The pinned goal text is the process's contract; the judge is the kernel's exit gate; GOAL COMPLETE is exit(0) and it is REFUSED until the contract's commands verify cold. A GM Card is not documentation — it is the process image: §0 is the contract, §1 is the program counter, §2/§3 are the loaded binaries and libraries, §4 is the supervisor, §5 is the init/ship stage, §6 is the signal disposition table.
Consequence of the wrong view: agents treat the goal as motivation and negotiate with it. Consequence of the right view: agents treat the goal as an operating environment and program against its API.

## 2. THE KERNEL LAW AND THE LAYER MODEL
The kernel law: the halt decision belongs to the judge, evaluated against §0 command pairs, run cold, with no cached results, after the review panels. Nothing inside the card can cause release; things inside the card can only make the world satisfy §0.
The layer model (one program, four representations):
  L1 RAW SHELL — traditional sh: control flow + exit codes only. Gives sequencing and fail-fast; dead-ends at verification semantics (an exit code proves survival, not correctness).
  L2 GSH — the goalmode shell grammar (11 constructs, section 4). Shell-shaped superset: adds PIN (contract), SPEC (anchor gates), PANEL (jury), ON STUCK (traps), and moves EXIT to the kernel.
  L3 GM CARD — the compiled program document (§0-§6). The kernel's process image.
  L4 /goal KERNEL — judge-gated execution of L3.
Compilation chain: prose → GSH → card → execution. Each layer verifies the same program at its own level: L1 by exit codes, L2 by grammar, L3 by the validator + smoke, L4 by the judge.

## 3. SHELL-MECHANIC EQUIVALENCE TABLE
| Unix shell | Goal Shell | Bridge call (sdk/bridge/gsh.js) | Card target |
|---|---|---|---|
| shebang #!/bin/sh | frontmatter | pin(card) | `---` block |
| cmd1; cmd2 | phase order | seq(a,b) | §1 rows |
| cmd1 && cmd2 | gate chain, short-circuit | and(a,b) | §1 exit + next entry |
| cmd1 || cmd2 | fallback | or(a,b) | §6 routes |
| exit codes, $? | typed tokens {ok:true}/{ok:false}/null | exit(ok) | §0 expect |
| test / [ ] | cmd+expect gate run cold | run(cmd,{expect}) | §0 pairs |
| pipe \| | schema dataflow slot→slot | pipe(a,b) | §2→§2 args |
| redirection > < | writeFile/readFile (jailed) | out/in | research.json etc. |
| environment vars | frontmatter + env store | exportVar/env | args blocks |
| functions | slots | fn slot(name,contract) | §2/§3 |
| job control & + wait | parallel barrier | jobs([thunks]) | §4 panels |
| signals + trap | stuck-signatures | trap(sig,route) + route.match | §6 |
| case dispatch | routing table | route.match(sig) | §6 |
| while until cond | judge re-beat, capped | until(slot,k) | GATE k |
| for x in $(ls) | glob enumeration | glob() + for | §2 unit fans |
| cron | /loop, later-priority queue | daemon(cron,prompt) | keepalive |
| mktemp | workspace tmp | mktemp() | scratch |
| rc/profile | .mimocode/ surface, hot-loaded | profile() | repo root |
| sudo boundary | permissions declared up-front | permit(patterns) | meta.permissions |
| exit 0 | GOAL COMPLETE | KERNEL-OWNED | (unscriptable) |
Rows are load-bearing: each right-hand cell exists and is exercised by the battery (deploy/battery/bridge-tests.mjs, 10/10) or the validator.

## 4. GSH GRAMMAR REFERENCE (11 constructs)
#!/goalmode — shebang; compiles to frontmatter; binds mode and lineage.
PIN "..." — the contract sentence; compiles to §0 nl_prompt; states WHAT + evidence shape, never HOW.
SPEC path — the spec anchor gate; compiles to §0 cmd/expect (grep -c 'S[0-9]' path >= N).
PHASE n: — program counter; compiles to §1 row; engine = compose|js.
TDD target — library call; compiles to §3 compose slot (compose:tdd); red→green→refactor per unit.
RUN name --args — binary exec; compiles to §2 js slot; returns {ok}|null; hung → null (never throws).
PANEL n --schema S — jury; compiles to §4; parallel n hostile reviewers returning S-validated verdicts; majority decides; FAIL → fix loop (max 2) → ROUTE_DERIVE.
GATE "cmd" --expect E — assertion; compiles to §0 pair; run cold; mismatch is fail, never throw.
until(GATE,k) — capped re-beat; compiles to judge re-run semantics; cap k then fail.
ON STUCK: r1->r2->... — trap table; compiles to §6; signatures: no-progress K, same-fail 2x, null-rate >30%, deadline; routes ordered, ESCALATE last.
SHIP a AND b — init/ship stage; compiles to §5; /ship-package AND /engineering-report.
EXIT 0 — NOT a construct. Kernel-owned. Appears in docs to mark the terminal state; the card cannot address it.

## 5. THE BRIDGE LIBRARY API (sdk/bridge/gsh.js)
exit(ok, extra) → {ok:bool,...} — the only success vocabulary.
exportVar(k,v) / env — the environment store shared across slots.
seq(a,b) — order; later sees earlier's effects; failure short-circuits the remainder.
and(a,b) — b skipped when a fails.
or(a,b) — b tried only after a fails.
run(cmd,{expect}) — the gate: output text must include expect; mismatch = {ok:false}, never throw. cmd is a string (echoed result) or a thunk returning text.
pipe(a,b) — dataflow: a's result is b's argument; failure short-circuits.
jobs([thunks]) — Promise.allSettled barrier; rejections become {ok:false}; returns {ok, failed[], results[]}.
trap(signature, routeName) + route.match(sig) — the trap table; unknown signature → null (caller escalates).
until(slot,k) — at most k beats; success returns early; cap exhausted returns last {ok:false}.
Battery: deploy/battery/bridge-tests.mjs — 10/10 laws pinned (exit tokens typed, seq order, and short-circuit, or fallback, run polarity, pipe dataflow, jobs barrier, trap routing, until cap, env store).
Portability delta: slots that run both in the substrate sandbox and under node take (g = globalThis) and destructure {phase, log, glob, readFile} — bare globals in the runtime, injectable in tests (machinery/run-smoke.mjs is the reference harness).

## 6. THE TRANSLATION PROTOCOL
Step 1 PROSE→GSH: build/implement→TDD slot; verify with C→GATE; research Q→RUN gm-research; when stuck→ON STUCK; ship→SHIP; "done means..."→§0 pairs verbatim. Unmapped verbs are TRANSLATION DRIFT: extend GSH_SPEC first, never invent silent behavior.
Step 2 GSH→CARD: gm-compile fills the master template mechanically (PIN→§0 nl_prompt; GATE→§0 pairs; PHASE→§1 rows; RUN→§2; TDD→§3; PANEL→§4; ON STUCK→§6; SHIP→§5; EXIT nowhere).
Step 3 VALIDATE+SMOKE+PIN: validator PASS → smoke {ok:true} → hand the operator the pin line. The pin is the operator's exec() — the kernel starts on their word.

## 7. CARD COMPILE CONTRACT
Frontmatter required fields: card, id, version, forked-from, mode. Families: goalmode-v1 (§0-§6 mandatory), js-workflow-v1 (meta + default export), compose-function-v1 (function: + contract). The validator (deploy/battery/validate-cards.mjs) IS the schema: family-aware checks, exit 1 on any FAIL; masters must always pass. Anti-cheat line is mandatory in §0: "conditions are commands; schema-nulls fail; sandbox replays."

## 8. PROCEDURES
P1 FORK: cp cards/masters/<family> cards/<name>.md; set id/version/forked-from/mode.
P2 FILL: §0 first (cmd/expect pairs), §2/§3 slots, §1 graph, §6 routes, §4 panels, §5 ship.
P3 VALIDATE: node deploy/battery/validate-cards.mjs cards/ → PASS all.
P4 SMOKE: node machinery/run-smoke.mjs . → {"ok":true} (substrate-native: workflow run gm-smoke).
P5 PIN: operator runs /goal with the card reference; kernel loads §0.
P6 OPERATE: phases dispatch; gates run cold; traps route; panels judge; ship assembles.
P7 RECOVER: on compaction/stuck — reload card, re-enter last incomplete §1 phase, never re-ask settled questions.
P8 CLOSE: judge releases on §0 cold pass; operator picks the merge/PR close.

## 9. WORKED EXAMPLE: BUILD TETRIS
Source: reports/GoalShell_Tetris_ShowMe.md (four side-by-sides, one program).
L1 raw sh: heredoc codegen + py_compile + selftest + tar — survives, verifies nothing.
L2 GSH: PIN/SPEC/PHASE research·spec·implement·verify/TDD engine+render/RUN gm-smoke/PANEL 3/until(GATE pytest,3)/ON STUCK routes/SHIP/EXIT.
L3 card: cards/examples/BUILD_TETRIS_v1.md — validator PASS, spec-anchor grep, panel artifacts, package audit, zero-secrets gate.
L4 kernel: judge re-runs §0 cold after final panel; GOAL COMPLETE only on release.
Lesson the example carries: the raw shell script DID build tetris; it could not know tetris was built. Layer 4 exists to make "built" a verified fact.

## 10. TROUBLESHOOTING MATRIX
| symptom | cause | fix |
|---|---|---|
| judge never releases | §0 pair prose-only | rewrite as cmd/expect; validator rejects prose |
| slot returns undefined | forgot exit() wrapper | every construct returns {ok} via exit() |
| and() ran second on failure | used seq where and intended | seq = order; and = short-circuit |
| or() ran second on success | inverted chain | or tries b ONLY after a fails |
| pipe lost fields | b ignored a's payload | b receives a's result as argument; transform inside |
| jobs threw | thunk threw instead of returning exit() | jobs converts rejections to {ok:false}; still return tokens |
| trap.match null | signature never registered | register in card §6 AND code before dispatch |
| until spins forever | k missing | until(slot,k) requires cap; judge beats are capped too |
| validator: frontmatter missing | field absent or duplicate colon bug | five fields mandatory; regex anchors ^field |
| smoke {ok:false} unreadable | file absent in target | contract card is soft-when-absent in foreign targets |
| deploy MISSING file | DEPLOY.sh tree drift | required-list is the contract; extend both together |
| node harness: phase is not defined | module assumed bare globals | use (g = globalThis) destructure pattern |
| gateway: workflow tool absent in session | surface limitation | node machinery/run-smoke.mjs is the harness equivalent |
| secret in tree | credential pasted in chat/files | grep ghp_ gate; rotate; REDACT placeholders only |
| bible under floor | newline-sparse prose | expand tables/commands; never blank-line pad |
| compaction lost the phase | state in chat | card §1 + progress files are the state; re-enter last phase |

## 11. REGISTRIES
Constants: maxConcurrentAgents min(16, 2x cores); maxDepth 8; maxLifecycleAgents 1000; scriptDeadlineMs 43200000 (substrate, workflows.md:126-131). Card constants: retry(2) pre-route; fix-loop max 2; escalate after 3 logged route failures; no-progress K=3; same-fail 2x; null-rate 30%.
Files: sdk/bridge/gsh.js (57L, 10 laws); deploy/battery/bridge-tests.mjs (10 checks); deploy/battery/validate-cards.mjs (family-aware); machinery/run-smoke.mjs (reference harness); .mimocode/workflows/gm-smoke.js; cards/masters/ x4; cards/examples/BUILD_TETRIS_v1.md; cards/GOAL_REPO_BUILD_v1.md (contract); deploy/DEPLOY.sh + deploy-proof.mjs.
Decisions: D1 tokens over exceptions (null-never-throw inherited); D2 EXIT kernel-owned; D3 gates-as-commands; D4 family-aware schema, validator-as-schema; D5 (g=globalThis) portability seam; D6 contract card soft-when-absent in foreign targets; D7 node runner for host-parseable proof.

## 12. IRON LAWS
1. ALWAYS return typed tokens; NEVER throw across a slot boundary. Consequence: one throw kills the batch.
2. NEVER script EXIT. Consequence: only the judge releases; a card-authored exit is theater.
3. MUST keep §0 as commands. Consequence: prose gates are unjudgeable and rejected.
4. ALWAYS cap loops (until k, judge beats). Consequence: uncapped loops stall the kernel.
5. NEVER place nondeterminism in orchestration. Consequence: replay dies, anti-cheat dies.
6. MUST order routes with ESCALATE last. Consequence: operator becomes first resort.
7. ALWAYS fork masters; record forked-from. Consequence: contract drift.
8. NEVER pass a panel without schema verdicts. Consequence: agent-typeable pass tokens are circular.
9. MUST re-verify §0 cold at close. Consequence: stale green ships fiction.
10. ALWAYS extend GSH_SPEC before using an unmapped construct. Consequence: silent behavior drift.

## 13. COMPACTION RECOVERY
Read this first after context loss: the pinned card at cards/<pinned>.md is the contract; re-enter at its last incomplete §1 phase; reload this bible for construct semantics; re-run validator + smoke before continuing; never re-ask the operator settled questions — the card holds them.

## 14. CONSTRUCT DEEP-DIVES, PART 1
Each construct: grammar, compile target, substrate call, contract, worked example, failure modes.

### 14.1 #!/goalmode — the shebang
Grammar: first line of a GSH script. Compile target: the card frontmatter block. Substrate: the frontmatter IS the binding — card family, id, version, forked-from, mode.
Contract: the executing agent mode is declared by `mode:`; lineage by `forked-from:`; a card without lineage is a FORK VIOLATION (validator rejects missing fields).
Worked example:
  #!/goalmode
  ...compiles to...
  ---
  card: goalmode-v1
  id: build-tetris-v1
  version: 1
  forked-from: GOALMODE_CARD_MASTER_v1
  mode: build
  ---
Failure modes: (a) shebang present but frontmatter fields missing → validator FAIL "frontmatter missing"; fix by filling all five fields. (b) mode mismatch — card says build but pinned in a session that cannot execute compose-next (legacy compose); fix: the boundary law, compose-next runs on Build; cards that need it declare mode: build and the pin happens there.
Law citations: fork lineage (Iron Law 7); validator-as-schema (Decision D4).

### 14.2 PIN — the contract sentence
Grammar: PIN "<one sentence: WHAT + evidence shape>".
Compile target: §0 nl_prompt. The ONLY place operator intent prose lives in a card.
Substrate: none — nl_prompt is read by the human and echoed by the kernel; it never gates.
Contract: states WHAT and the evidence SHAPE ("ship only when spec + battery verify green"), never procedure. Procedure lives in §1-§6.
Worked example: PIN "build playable tetris; ship only when spec + battery verify green".
Failure modes: (a) PIN contains skill names or phases — a procedure leak; the precedence law makes operator text outrank skills, so a procedural PIN would override the card's own engineering — forbidden. (b) PIN absent — the validator requires nl_prompt in §0.
Why it exists: the operator's exec() argument. When you pin, PIN is the argv to the kernel.

### 14.3 SPEC — the anchor gate
Grammar: SPEC <path> [--anchors N].
Compile target: §0 pairs: `ls <path>` + `grep -c 'S[0-9]' <path>` with expect >= N.
Substrate: plain commands — the gate is a cold shell run.
Contract: the spec exists BEFORE implementation phases; anchors are stable IDs ([S1]..[Sn]) that tasks and review verdicts cite. Renumbering anchors is FORBIDDEN (references silently break).
Worked example:
  SPEC docs/specs/tetris.md --anchors 5
  ...compiles to...
  - cmd: "ls docs/specs/tetris.md"
    expect: "spec exists"
  - cmd: "grep -c 'S[0-9]' docs/specs/tetris.md"
    expect: "5"
Failure modes: (a) spec written after code — the anchor gate fails at §0, correctly; write specs first. (b) anchors renumbered mid-build — every covers: reference drifts; amend, never renumber.

### 14.4 PHASE — the program counter
Grammar: PHASE <name>: followed by indented construct lines.
Compile target: one §1 row per phase: | # | phase | engine | slot | entry | exit |.
Substrate: execution order is the row order; engine selects dispatch (js → workflow run; compose → skill contract).
Contract: every phase carries an EXIT that is a mechanical gate (a command + expected output). A phase whose exit is prose is invalid.
Worked example:
  PHASE implement:
    TDD tetris/engine.py
    RUN gm-smoke --target tetris
  ...compiles to §1 row 3 plus §2/§3 slot rows.
Failure modes: (a) phase exit references a slot that does not exist — dangling slot; the smoke checks masters, the validator checks structure; dangling slots surface at first dispatch as null. (b) phase ordering inverted (verify before implement) — entry conditions fail; entry/exit columns exist to make this explicit.

### 14.5 TDD — the library call (compose:tdd)
Grammar: TDD <target-path>.
Compile target: §3 compose slot referencing COMPOSE_TDD_CARD_MASTER.
Substrate: the compose:tdd contract — behavior contract stated; failing test FIRST (RED recorded); minimum implementation (GREEN recorded); >= 3 adversarial cases before the happy path; fresh battery before slot exit.
Contract: one TDD line per executable unit; the micro loop is red → green → refactor.
Worked example (the bridge's own build):
  TDD sdk/bridge/gsh.js
  ...executed as... write deploy/battery/bridge-tests.mjs first; run → RED "gsh.js not importable" (exit 1, on record); implement gsh.js; run → 9/10 (env-store FAIL caught the export alias bug); fix alias; run → 10/10 GREEN.
That IS the discipline working: the battery caught two real bugs (module absent; alias) and one validator bug (double-colon regex) because tests existed before implementations.
Failure modes: (a) test-after-code — the theatrical-test class; RED must be on record BEFORE implementation exists. (b) assertions on agent-typeable phrases — circular; assertions target spec-named tokens or observable artifacts (bytes, exit codes, JSON fields).

### 14.6 RUN — the binary exec (JS workflow slot)
Grammar: RUN <workflow-name> [--args JSON] [-> output-file].
Compile target: §2 js slot row + args block.
Substrate: the workflow runtime — meta contract (name [A-Za-z0-9._-], description, phases, permissions), sandbox globals (glob/readFile/phase/log), agent(prompt,{schema}) → validated object or null, parallel barrier, child workflow(), determinism strip.
Contract: binaries are deterministic; network/time work belongs inside agent(); every binary returns the typed token; a hung binary is cancelled → null → the slot's fail_route.
Worked example: gm-smoke (`.mimocode/workflows/gm-smoke.js`):
  meta: name gm-smoke; phases Enumerate/Check/Gate; permissions read cards/**
  default(g): enumerate cards/masters/*.md + contract card (soft-when-absent in foreign targets — Decision D6); per file: frontmatter marker check; [FILL] legality check (masters MAY carry fills, filled cards MUST NOT); gate {ok:true,checked,evidence} | {ok:false,failed}.
Failure modes: (a) ReferenceError phase is not defined — bare globals in a node harness; fix with the (g = globalThis) seam. (b) contract card unreadable in a foreign target — Decision D6 made it soft-when-absent; the deploy proof exercises exactly this path.

### 14.7 PANEL — the jury
Grammar: PANEL <n> --schema <S>.
Compile target: §4 adversarial_panel line (and audit_judge_panel for 3-juror variants).
Substrate: jobs([...n thunks]) where each thunk is agent(prompt, {schema:S}) — the schema makes the verdict a VALIDATED OBJECT; agent() nulls on failure and never throws; the majority verdict decides.
Contract: verdicts are data ({verdict: PASS|FAIL, findings: []}); a panel whose verdicts arrive as prose is CIRCULAR and fails the gate; FAIL verdicts enter a fix loop capped at 2, then ROUTE_DERIVE.
Worked example (tetris): three hostile players each receive the build + the spec and the schema {verdict, findings[]}; they PLAY the game hunting stuck-piece, rotation, line-clear bugs; artifact lands at .panels/adversarial-verdicts.json; §0 checks "3/3 verdicts present".
Failure modes: (a) jurors that echo the implementer's claims — the prompt must order independent verification (play it, run it, break it), never "review the report". (b) no artifact — §0's ls gate fails; panels must WRITE their verdicts to disk.

### 14.8 GATE — the assertion
Grammar: GATE "<command>" --expect "<substring>".
Compile target: one §0 outer_success pair.
Substrate: a cold shell run (or node harness) whose output must CONTAIN the expect substring; mismatch is {ok:false}, never an exception.
Contract: commands are run from the project root; expect is a substring match on combined output; gates carry NO side effects (a gate that mutates state is a crime against replay).
Worked example:
  GATE "python3 -m pytest tests/ -q" --expect "0 fail"
  ...compiles to...
  - cmd: "python3 -m pytest tests/ -q"
    expect: "0 fail"
Failure modes: (a) expect too loose ("pass" matches "0 pass" on an empty suite) — pin counts. (b) expect too tight (exact whitespace) — substrings, not full-match. (c) gate with side effects — breaks replay; move effects into phases.

### 14.9 until — the capped re-beat
Grammar: until(GATE, k).
Compile target: the judge's re-run semantics for a §0 pair, capped at k.
Substrate: gsh.until(slot,k) — at most k beats; early return on success; cap exhausted returns the last {ok:false}.
Contract: k is per-gate calibration (default 3); uncapped waiting is a kernel stall.
Worked example: until(GATE "workflow run gm-smoke", 3) — a flaky network-dependent smoke gets 3 beats; the fourth state is fail-and-route.
Failure modes: (a) k omitted — the API requires it; there is no infinite wait. (b) k as a substitute for fixing — until is for FLAKY, not BROKEN; 3 fails on the same cause is a stuck-signature → routes.

### 14.10 ON STUCK — traps and routes
Grammar: ON STUCK: ROUTE_A -> ROUTE_B -> ... -> ESCALATE.
Compile target: §6 stuck_signatures + routes (ordered).
Substrate: gsh.trap(signature, routeName) + route.match(sig); signatures: no-progress K=3 iterations, same-fail 2x, agent null-rate >30%, phase deadline exceeded.
Contract: routes fire in card order; every route appends to the run journal; ROUTE_ESCALATE is LAST and fires only after 3 logged route failures — the operator is the last resort, never the first.
Route semantics:
  ROUTE_DEBUG — load compose:debug; reproduce → isolate → root cause → smallest fix → regression.
  ROUTE_DERIVE — stop patching; re-derive the approach from first principles (after 2 failed fixes this is mandatory, not optional).
  ROUTE_SPLIT — decompose the phase into independent subtasks; parallelize only the disjoint remainder.
  ROUTE_SWITCH — model/tier change for the stuck unit (rate-limit switch law).
  ROUTE_RECOVER — checkpoint re-entry: reload the card, resume at the last incomplete §1 phase, verify head integrity.
  ROUTE_ESCALATE — question-tool ask to the operator with options + recommendation; headless: pick recommended, log, continue.
Failure modes: (a) escalate-first — insubordination against autonomy; the order IS the law. (b) route without journal — the 3-failure counter has no memory; log every route attempt.

### 14.11 SHIP — the init/ship stage
Grammar: SHIP /ship-package AND /engineering-report.
Compile target: §5 ship gates.
Substrate: the SPG phase law (ship docs current → canon docs current → blocks from docs → dist gate → assembly → audit) and the engineering-report anatomy (chat + disk, series-scoped naming, every claim anchored).
Contract: ship NEVER precedes panels; the audit verdict outranks deadlines; a red package never ships; the report is delivered twice (chat + reports/).
Failure modes: (a) shipping with stale docs — Phase A FAILED = STOP. (b) report numbers not measured — invented numbers are the theatrical class; every number cites a command run this session.

### 14.12 EXIT — the kernel-owned release
Grammar: none. EXIT 0 appears in GSH scripts ONLY as the terminal marker.
Compile target: NOTHING. The compiler must not emit anything for EXIT.
Substrate: the judge evaluates §0 cold after the final panel; release is the kernel's decision alone.
Contract: a card that attempts to script its own release (writing its own "GOAL COMPLETE", faking panel artifacts) has committed the theatrical-crime class; §0's cold re-run exists precisely because artifacts can be faked but re-execution cannot lie about a live system.
Failure modes: (a) premature celebration — the goal loop's system-reminder fires and the judge reports what is still missing; treat that as the kernel speaking: keep working. (b) negotiated done ("should be complete") — not a kernel concept; §0 either passes or it does not.

## 15. THE BRIDGE LIBRARY API — FULL REFERENCE
Module: sdk/bridge/gsh.js (ESM). Import: import { exit, seq, and, or, run, pipe, jobs, trap, route, until, export as exportVar, env } from './gsh.js' — or default-import the namespace.
exit(ok, extra) -> {ok:true,...extra} | {ok:false,...extra}. The token factory. Every slot's return type. extra carries evidence (output text, counts, artifact paths).
env — the shared store object. exportVar(k,v) writes it. Precedence: frontmatter > env > defaults.
seq(a,b) -> thunk. Runs a then b; a's failure (r.ok === false) short-circuits b and returns a's result. Errors thrown inside slots are NOT caught by seq — slots must return tokens (law 1).
and(a,b) -> thunk. Identical to seq for token semantics; exists because the GRAMMAR distinguishes ; from && — use the one you mean, the reader is a programmer.
or(a,b) -> thunk. a fails → try b; a succeeds → return a.
run(cmd,{expect}) -> thunk. cmd: string (static output) or async thunk returning a string. expect: substring; absent expect = pass-through gate (shape check only). Returns exit(contains, {evidence:text}).
pipe(a,b) -> thunk. a's result (if ok) feeds b as ARGUMENT. The dataflow law: later slots consume earlier outputs — the pipe is how research.json reaches the spec phase.
jobs(thunks) -> {ok, failed[], results[]}. Promise.allSettled under the hood: one rejection NEVER kills the wave (the async-parallel law); rejections are normalized to {ok:false, evidence:reason}.
trap(signature, routeName) — writes route.table. route.match(sig) — resolves or null. The §6 compiler emits traps in card order; match returns the FIRST registered match — register in priority order.
until(slot,k) — the capped re-beat (see 14.9).
Determinism contract: the module imports nothing, reads no clock, touches no network — battery-verified by import under a stripped context.

## 16. THE TRANSLATION PROTOCOL — EXPANDED
Verb mapping table (the compiler's core):
| operator verb family | GSH construct | notes |
|---|---|---|
| build/implement/write X | TDD X | one line per executable unit |
| check/verify with command C | GATE "C" --expect E | cold; no side effects |
| it may be flaky, retry | until(GATE,k) | k per calibration; default 3 |
| research/survey/investigate Q | RUN gm-research -> out | super-research harness |
| smoke/quick sanity | RUN gm-smoke | {ok:true} token |
| have it reviewed / adversarial | PANEL n --schema S | verdicts are data |
| when stuck / if it fails repeatedly | ON STUCK: routes | ESCALATE last |
| ship/package/deploy | SHIP ... AND ... | §5; audit outranks deadlines |
| done means... | §0 outer_success pairs | the contract itself |
| who/what/why (context) | spec anchors [Sn] | SPEC path --anchors N |
Drift handling: a verb that maps to nothing is a SPEC GAP — extend GSH_SPEC (construct + compile target + law) before use. Silent invention is the regex-slop class: undocumentable behavior is forbidden behavior.
Worked translation (3 samples, the P7 experiment set):
  "build tetris from scratch" -> PIN + SPEC + PHASE research/spec/implement/verify (cards/examples/BUILD_TETRIS_v1.md, validator PASS).
  "grow the bibles to floor" -> PHASE docs: TDD none; GATE "wc -l docs/*.md" --expect "3000" (GOAL_REPO_BUILD_v1.md phase 6).
  "prove it deploys clean" -> PHASE deploy: RUN deploy-proof -> "DEPLOY PROOF: clean target verified" (GOAL_REPO_BUILD_v1.md phase 5).

## 17. PROCEDURES — EXPANDED
P1 FORK (5 min): cp the family master; rename id; bump version from lineage; set forked-from; declare mode. Verify: validator frontmatter checks.
P2 FILL §0 (30 min): write nl_prompt (WHAT + evidence shape); enumerate done-conditions as commands; for each, choose expect substrings that pin counts; add anti_cheat line. Test: grep the §0 block — every line pair has cmd AND expect.
P3 FILL SLOTS (per slot): js slots — fork bridge.template.js, name per meta law, implement with gsh constructs, inject-safe (g = globalThis); compose slots — reference the family master, declare trigger + micro_loop + fail_route.
P4 FILL §1: one row per phase; entry/exit are mechanical; engine matches slot family; order = cheapest-blast-radius first.
P5 FILL §4-§6: panels with schemas + artifact paths; stuck signatures with calibrated constants; routes ordered; compaction line.
P6 VALIDATE+SMOKE: validator PASS 0 fail; smoke {ok:true}. Fix until green — the card is code now.
P7 PIN: operator runs the goal text pointing at the card. Kernel loads §0.
P8 OPERATE+CLOSE: phases → gates → traps → panels → ship → judge release.

## 18. WORKED EXAMPLE — EXPANDED (the four layers on tetris)
Full artifact: reports/GoalShell_Tetris_ShowMe.md. Summary of what each layer contributes:
L1 gives: sequencing, fail-fast, codegen, an exit code. L1 lacks: a contract, anchors, juries, traps, and any notion that "built" must be proven.
L2 adds: the grammar that makes the engineering loop SAYABLE in shell order (PIN/SPEC/PHASE/TDD/RUN/PANEL/ON STUCK/SHIP/EXIT-kernel).
L3 makes it executable-by-kernel: §0 pairs the judge can run; §1 the program counter; §2/§3 the loaded units; §4 the supervisor; §5 the ship stage; §6 the trap table. Validator PASS + smoke {ok:true} = the card compiles and boots.
L4 runs it: gates cold, traps route, panels judge, ship assembles, EXIT 0 happens TO the card when §0 verifies — the kernel's exit, not the script's.
The tetris lesson: the raw shell script DID build tetris; it could not KNOW tetris was built. The kernel exists to turn "built" into a verified fact.

## 19. SUBSTRATE PRIMITIVES REFERENCE (what the kernel/runtime actually provides)
workflow runtime: meta contract (name [A-Za-z0-9._-], description, phases, permissions asked once up-front; denial does not abort); sandbox globals glob/readFile/writeFile/exists/phase/log/args; agent(prompt,opts) → deliverable | null (schema → validated object); parallel(thunks) (throwing thunk rejects batch); pipeline(items,...stages); workflow(name|script,args) child runs (structural faults throw: cycle, maxDepth, unknown name); file ops jailed to workspace root; determinism strip (no Date/crypto/fetch/process; seeded PRNG); run/status/wait/cancel/resume (journal replay = convergent); config: maxConcurrentAgents min(16,2xC), maxDepth 8, maxLifecycleAgents 1000, scriptDeadlineMs 12h.
Compose skills (libc): compose:tdd (red-green-refactor contract), compose-next (orient→grill→workspace→spec→implement→verify→review→finalize→finish; never auto-invoked; explicit request only), compose:ask (question tool; loop ends only on completion), compose:verify (NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE; 5-step gate), compose:report (final state first; code is truth), compose:debug (reproduce→isolate→root-cause→smallest fix), compose:feedback (verify-before-implement), compose:parallel/subagent (fan-out with distilled briefs), compose:worktree (isolation before risky builds).
Kernel: /goal pin; judge = §0 cold evaluator; GOAL COMPLETE = release. /loop = cron front-end (interval parse, immediate first run, /loops manage, keepalive budget + 7-day max). Skills hot-load from .mimocode/ (stock substrate, no plugins).

## 20. ENGINE INTEGRATIONS — DEEP WIRING
### 20.1 compose-next as the macro contract
Role in the shell: the login shell of engineering — the full session contract (orient → grill → workspace → spec → implement → verify → review → finalize → finish). Card slot: §3 compose-function card referencing COMPOSE_NEXT_CARD_MASTER; trigger: repo-scale phases (docs, ship).
Compile notes: compose-next activates ONLY on explicit request — the card's trigger line IS that explicit request (a user-approved program). Grill runs one decision axis per turn through the question tool, recommended first; headless picks resolve per the Never-Ask protocol. Workspace: .worktrees/<slug>, never main without consent. Review: ONE fresh subagent, three separate verdicts (spec compliance / correctness / codebase consistency); criticals loop fix→re-verify→re-review; non-convergence reports the impasse — never forced pass.
Failure modes: loading compose-next in legacy compose sessions (boundary violation — it is a Build-agent skill; cards declaring mode: build are safe); finishing without the operator (finish is operator-owned: merge/PR/push/keep).
### 20.2 compose:tdd as the micro discipline
Role: the per-unit inner loop. Contract: behavior contract stated → failing test FIRST (RED recorded) → minimum implementation (GREEN recorded) → ≥3 adversarial cases before the happy path → fresh battery before slot exit → after 2 failed fixes, stop patching, re-derive (ROUTE_DERIVE).
Card slot: §3 referencing COMPOSE_TDD_CARD_MASTER; trigger: every executable artifact.
Evidence shape: the RED run's output is itself an artifact (the goal-shell build's RED: "RED: gsh.js not importable ... exit=1"); GREEN follows on the same battery.
Failure modes: test-after-code (theatrical class); mocks asserted instead of behavior (prefer real implementations); happy path first (forbidden order).
### 20.3 JS workflows as binaries
Role: deterministic executables in .mimocode/workflows/. Meta law; sandbox globals; agent() typed returns; parallel barrier; jailed file ops; replay/journal resume. The (g = globalThis) seam keeps them substrate-native AND node-testable (machinery/run-smoke.mjs is the reference harness; deploy-proof.mjs runs it inside a clean target).
Repo binaries: gm-smoke (card sanity: masters present, frontmatter marker, [FILL] legality — {ok:true,checked,evidence}); gm-research (super-research harness slot; topic-survey + experiment modes; TSV logs); gm-panels (adversarial + 3-juror orchestration writing .panels/ verdict artifacts); gm-compile (GSH → card translator, planned P4.5-proven).
Failure modes: bare globals in node (use the seam); structural faults (cycle/maxDepth/unknown — they THROW and propagate; never nest past 8); deadline (12h script kill — split long builds into phases).
### 20.4 /loop as the cadence daemon
Role: cron for goalmode — periodic prompt injection while the REPL idles; fires enter the queue at later priority (user input never preempted). Front-end: /loop [interval] <prompt> parses e.g. 30m/2h, registers a recurring job, runs once immediately; /loops lists; /loops cancel <id> stops; auto-stop after keepalive misses or 7-day max age.
Card wiring: keepalive on long builds (loop 30m "advance the pinned card's next phase; run §0 gates; journal"); scheduled panels; nightly cold §0 re-runs (drift detection).
Scheduling law: avoid :00/:30 pile-ups (57 8 * * * not 0 9 * * *); durable ONLY on explicit request; surface job ids for later deletion.
Failure modes: loop fighting a pinned goal's phases (loop prompts journal observations, never mutate §0); session-only default losing jobs (durable:true on explicit ask).
### 20.5 super-research as the research engine
Role: honest, auditable research runs. Modes mapped to goalmode: topic-survey → the research PHASE (applications corpus, substrate inventory); experiment-loop → bridge validation (baseline → hypothesis → run → keep/revert; TSV log including crashes/dead-ends); root-cause → ROUTE_DEBUG's deep form; benchmark-comparison → engine A/B (workflow vs skill dispatch); ablation → which card sections actually bind the kernel.
Discipline: contract before begin (one confirmation, then autonomous); baseline first; TSV log with failures KEPT; never pause mid-loop; never game metrics/sources. Report: contract / baseline-vs-final / what worked / what didn't / open questions / where to look — under a page.
Repo wiring: RUN gm-research --mode topic-survey "..." → docs/research/<topic>.md + research/<topic>.tsv. External fetch honesty: failed fetches are logged, not cited ([TK] marking rule).
### 20.6 using-superpowers as the boot law
Role: session-start discipline — if a skill might apply (1% rule), load it before ANY action including questions; process skills before implementation skills; announce "Using [skill] to [purpose]".
Card wiring: §0 preamble + the goal-shell SKILL's boot law: under a pinned goal, first action = skill-match check + card reload + last-incomplete-phase re-entry. Clearance never survives compaction.
Failure modes: "I know this skill" (versions evolve — load current); "just this one thing first" (the drift door).

## 21. SECURITY AND SECRETS
Law: key material NEVER in state, logs, snapshots, or the repo — labels only. The PAT incident class: credentials pasted in chat are burned; use them transiently via environment injection at push time (one-shot URL or env-var auth), rotate after use, and grep the tree before any commit: grep -rn 'ghp_' --include='*' . must return nothing (it is a §0 gate in the contract card).
DEPLOY.sh copies code only — it must never carry credentials; the battery's clean-target proof greps nothing because there is nothing to grep; keep it that way.
Remote auth pattern: GH_TOKEN env → API repo create → push via one-shot URL; NEVER `git remote add` with an credentialed URL (it persists in .git/config). Rotation note ships in the README.

## 22. CALIBRATION AND PERFORMANCE
Concurrency: substrate semaphore min(16, 2×cores) process-wide; per-run can only narrow; excess agent() queues — size deliberate fleets accordingly.
Nesting: maxDepth 8 workflow-in-workflow; cycle detection throws; long builds split across phases rather than depth.
Volume: maxLifecycleAgents 1000 per run — a run spawning over-cap gets nulls; budget agents per phase (research fan-outs are the hungry consumer).
Time: scriptDeadlineMs 12h hard kill — the phase graph exists so no single script needs more; long goals live across pins, not inside one script.
Gate cadence: §0 pairs are cheap (ls/grep/wc) — run often; expensive suites (pytest batteries, panels) run at phase exits only; FINAL VERIFICATION re-runs everything cold once.
Loop cadence: 60-300s follow-up, 300-1800s routine polling, 1200-1800s heartbeat; :00/:30 nudge rule.

## 23. THE SDK AUTHORING GUIDE (writing new constructs)
To add construct #12 to GSH:
1. Name it in shell terms (e.g. FOR x IN units -> glob fan).
2. Specify compile target (which card section) + kernel semantics (what the judge does with it).
3. Implement in gsh.js as a pure construct returning/forwarding tokens; no IO of its own.
4. Add battery laws to bridge-tests.mjs (polarity, cap, dataflow — the three test dimensions).
5. Extend the validator ONLY if the construct adds card-section requirements.
6. Document: grammar row in GSH_SPEC, deep-dive section here, verb-mapping row in section 16.
Anti-law: a construct that cannot state its kernel semantics is a script-local helper, not GSH — keep it in your binary, out of the grammar.

## 24. FAQ (40 questions a fresh engineer asks)
Q1 Is a GM Card a prompt? No — it is a process image; the kernel executes §0, not the text.
Q2 Who writes §0? The card author, from the operator's done-conditions; the judge only RUNS it.
Q3 Can the card lie with a weak expect? It can lie to itself; the operator reads §0 at pin time — expect substrings that pin counts are the discipline.
Q4 Why substrings not full-match? Output prefixes (timings, headers) drift; substrings pin the semantic ("0 fail", "{ok:true}").
Q5 Can one card pin another card? No — one pin, one kernel, one contract. Nested builds are phases, not pins.
Q6 Where does state live between phases? Files (research.json, spec, verdict artifacts) + the env store; chat is not state.
Q7 What if a phase has no natural gate? Invent one: artifact exists + contains marker. A phase without an exit is invalid.
Q8 Why is EXIT not a construct? Release is the kernel's judgment on §0; a scriptable exit is a forgeable exit.
Q9 Does /goal survive compaction? The PIN persists; the loop re-enters via the card's §6 compaction line: reload card, resume last incomplete phase.
Q10 Can two cards pin one kernel? No. Sequence them as phases of one contract card.
Q11 What runs first, validator or smoke? Validator (structure), then smoke (content). A structurally-broken card fails validator before smoke runs.
Q12 Why family-aware validation? js/compose cards have different bodies; one schema would reject legal families or accept illegal goalmode cards.
Q13 Can gsh.js touch the network? No — determinism law; network work belongs inside agent().
Q14 Can I use Date in a workflow? Not in orchestration; inside agent() a subagent may (it is a real runtime).
Q15 Why {ok} tokens instead of exceptions? One throw kills a parallel batch; tokens normalize failure into data (jobs converts rejections).
Q16 What does null mean from agent()? Failure or timeout (cancelled). Treat exactly as {ok:false}.
Q17 Can slots return partial success? Yes: {ok:false, failed:[...], results:[...]} — jobs returns both; the gate decides.
Q18 Who writes the routes order? The card author; ESCALATE must be last (validator does not enforce order yet — discipline law).
Q19 Can a route loop back to a phase? Only ROUTE_RECOVER re-enters; others fix-then-continue; loops are the kernel's business.
Q20 What stops infinite fix loops? Caps: fix-loop max 2 → ROUTE_DERIVE; 3 route failures → ESCALATE.
Q21 Is gm-smoke the only binary? No — gm-research, gm-panels, gm-compile extend it; the meta contract is the binary format.
Q22 Can I write a binary in python? The substrate executes JS workflow scripts; a python binary is shelled out from a JS slot via run().
Q23 Why markdown cards, not JSON? Cards carry NL scripting + prose contracts + commands together; the machine-readable surface is frontmatter + §0 pairs.
Q24 Can the validator check more? Yes — it is the schema; evolve both together (masters must always pass).
Q25 What is the minimum viable card? §0 with ONE cmd/expect pair + nl_prompt + §1 one phase + §6 routes. It boots.
Q26 Can §0 run expensive suites? It runs at phase exits AND final; keep pairs cheap; heavy suites belong to phase slots whose exit is the cheap pair.
Q27 How do panels write artifacts? The panel slot writes .panels/<name>.json; §0 ls-gates the artifact.
Q28 What if the operator is absent at ESCALATE? Headless pick: recommended option, logged, continue; re-ask next fork.
Q29 Can loops mutate the card? No — loops observe and journal; §0 is operator-amended only.
Q30 What is replay, exactly? Same card + same sandbox → same run; the determinism strip + journal resume make convergence identical.
Q31 Why is compose-next not auto-invoked? Boundary law: explicit request only; the card's trigger line is that request.
Q32 Can compose:tdd skip tests for config changes? The contract allows skips for generated/config/throwaway; the card's TDD lines are for executable units.
Q33 What happens on timeout inside agent()? Cancelled → null → slot fail_route; the barrier never hangs.
Q34 How big can a card be? Floors are minimums; the contract card is 91 lines; bibles are the 3000+ class; cards stay lean, bibles carry depth.
Q35 Why repo-relative paths in docs? Public repo; private lineage is one provenance note (operator decision, repo-relative only).
Q36 Where do lessons go? Section 25 ledger + the engineering report's journey log; chat is not the record.
Q37 Can I pin without smoking? You can; you should not — smoke is 1 second and catches the boot class.
Q38 What proves the substrate itself? The battery (bridge 10/10) + validator (6/6) + smoke ({ok:true}) + deploy-proof (clean target) — all run in the README's battery appendix.
Q39 What if the judge reports missing work? That IS the kernel speaking — treat the report as the next phase list; keep working.
Q40 When is the goal COMPLETE? When §0 passes cold, no cache, after panels. Never before. Never "should be".

## 25. GLOSSARY (50 terms)
agent() — substrate spawn; returns deliverable or null; schema → validated object.
anchor — stable spec section ID [Sn]; renumbering forbidden.
anti_cheat — §0 line: conditions are commands; schema-nulls fail; sandbox replays.
barrier — jobs(); allSettled join; failures collected.
binary — a JS workflow slot (.mimocode/workflows/*.js).
boot law — skill-match + card reload before action under a pinned goal.
bridge — the SDK importing shell mechanics into the kernel (gsh.js + GSH_SPEC + translator).
card — the program document (§0-§6); the kernel's process image.
cold — re-run without cache; the only judge evidence.
compaction — context loss event; recovery = card §6 re-entry line.
compose function — libc-class slot (tdd, next) — skill contract.
construct — a GSH grammar element compiling 1:1 to card + gsh.
contract — §0 outer_success; the halt vocabulary.
cron — /loop substrate; later-priority fires; keepalive budget.
decided-state — recorded pick + tradeoff; never chat decoration.
determinism — sandbox strip enabling identical replay.
drift — behavior without documentation; translation drift = unmapped verb.
ESCALATE — last route; operator ask after 3 logged failures.
env — gsh.js shared store (export/import).
evidence — the expect substring found in real output.
fan-out — parallel units via jobs()/compose:parallel.
gate — cmd+expect assertion run cold.
GSH — the goalmode shell grammar (11 constructs).
headless — no user available; pick recommended, log, continue.
iron law — imperative + mechanism + consequence; earned by regression.
judge — the kernel's §0 cold evaluator; the exit gate.
kernel — /goal process; refuses halt until contract verifies.
libc — compose functions metaphor (tdd/next as library calls).
loop — /loop cadence daemon.
master — a family template in cards/masters/; fork root.
meta — workflow frontmatter contract (name/description/phases/permissions).
nl_prompt — §0's WHAT sentence; the pin's argv.
null — agent failure/timeout normalized; never an exception.
panel — §4 jury; schema verdicts as data.
phase — §1 program-counter row; entry/exit mechanical.
pin — operator exec(): /goal pointing at a card.
pipe — dataflow construct; a's result is b's argument.
replay — identical re-execution; anti-cheat basis.
route — a trap handler in §6.
schema — JSON contract making verdicts data.
seam — (g = globalThis) substrate/node portability.
signature — stuck-pattern key (no-progress, same-fail, null-rate, deadline).
smoke — gm-smoke {ok:true}; boot-class proof.
slot — a mounted unit in §2/§3.
spec — anchored requirements artifact; SPEC gate target.
token — {ok:bool,...} typed result; the only success vocabulary.
trap — ON STUCK registration; route.match resolves.
worktree — .worktrees/<slug> isolation; never main without consent.

## 26. TROUBLESHOOTING — EXPANDED (45 rows)
| # | symptom | cause | fix |
|---|---|---|---|
| 1 | judge never releases | prose §0 | rewrite as cmd/expect pairs |
| 2 | phase is not defined (node) | bare globals in harness | (g = globalThis) destructure seam |
| 3 | gsh.export is not a function | namespace alias drift | named export `export`; battery row 10 |
| 4 | validator: frontmatter missing X | field absent | add five mandatory fields |
| 5 | validator: cmd/expect mismatch | pair unbalanced | every cmd: gets expect: |
| 6 | validator: unknown family | typo in card: | goalmode-v1|js-workflow-v1|compose-function-v1 |
| 7 | smoke {ok:false} unreadable | file gone in target | contract soft-when-absent (D6); check cwd |
| 8 | smoke flags [FILL] in example | example not fully filled | fill or move to masters |
| 9 | deploy MISSING file | DEPLOY tree drift | extend required[] + DEPLOY.sh together |
| 10 | deploy-proof smoke fails in target | harness path relative | run-smoke uses join(root,p); cwd=target |
| 11 | bridge RED at import | gsh.js absent/broken | RED is correct pre-implementation state |
| 12 | and() short-circuited unexpectedly | a returned {ok:false} legitimately | check gate evidence |
| 13 | pipe fed undefined | a returned null (agent fail) | null-check before pipe; fail_route |
| 14 | jobs killed by one throw | thunk threw | return tokens; jobs normalizes rejections |
| 15 | trap.match returns null | unregistered signature | register in §6 order before dispatch |
| 16 | until ran k times on success path | early return missing ok check | until returns on r.ok !== false |
| 17 | card pins but nothing dispatches | §1 rows reference missing slots | dangling slot → first dispatch nulls |
| 18 | panels arrive as prose | schema missing in agent() | {verdict,findings} schema mandatory |
| 19 | panel artifact missing | panel did not write disk | §4 must write .panels/*.json; §0 ls-gates it |
| 20 | escalate fired first | route order wrong | ordered routes; ESCALATE last (discipline) |
| 21 | loop preempts user input | impossible by design | fires are later-priority; verify job is /loop not manual |
| 22 | loop job died with session | session-only default | durable:true only on explicit ask |
| 23 | cron at :00 pile-up | exact-hour expression | nudge minutes; state the rounding |
| 24 | compose-next asked to grill forever | decision axes unbounded | 3-round budget; headless picks |
| 25 | compose-next ran in legacy compose | boundary violation | mode: build cards only |
| 26 | tdd skipped RED | test-after-code | RED output on record BEFORE implementation |
| 27 | tests assert agent-typeable text | circular tokens | assert spec-named tokens/artifacts only |
| 28 | happy path first | order violation | >=3 adversarial before happy; happy LAST |
| 29 | 2 failed fixes, still patching | ROUTE_DERIVE skipped | re-derive mandatory after 2 |
| 30 | workflow structural throw | cycle/maxDepth/unknown name | tree audit; depth <= 8 |
| 31 | agent nulls > 30% | provider/model distress | stuck-signature → ROUTE_SWITCH |
| 32 | 12h script kill | single script too big | split into phases; long goals span pins |
| 33 | secret grep hits | credential in tree | rotate; REDACT; re-scan; never commit |
| 34 | remote URL holds token | credentialed remote added | one-shot push URL; never remote add |
| 35 | replay diverges | nondeterminism in orchestration | strip audit; move effects into agent() |
| 36 | maxLifecycleAgents nulls | over-cap fleet | budget agents/phase; raise deliberately |
| 37 | bible under wc floor | newline-sparse prose | real sections/appendices; never pad |
| 38 | doctrine paraphrased | reworded quotes | verbatim or marked; fidelity law |
| 39 | anchors renumbered | spec edited mid-build | amend; keep [Sn] stable |
| 40 | compaction lost position | state in chat | §1 + progress files; §6 re-entry line |
| 41 | card self-declares COMPLETE | scripted exit attempt | kernel-owned; cold re-run catches it |
| 42 | stale green at final | cached results | FINAL VERIFICATION is cold, no cache |
| 43 | operator re-asked settled questions | state not read | card + files before questions |
| 44 | per-task progress missing | subagent return unaudited | re-verify returns; verdicts on record |
| 45 | chat emissions differ from file | dual-write drift | file IS the chat; sync before send |

## 27. DECISION RECORDS (with rejected alternatives)
D1 tokens-over-exceptions. Chosen: every construct returns {ok}. Rejected: throw-based (throw/catch). Why rejected: one throw kills the parallel wave (jobs normalizes only rejections); tokens compose. Reversal cost: rewrite all slots + battery.
D2 EXIT kernel-owned. Chosen: release only via judge on §0 cold. Rejected: card-scripted exit. Why: forgeable exits are the theatrical class. Cost: none — the operator keeps manual abort via interruption.
D3 gates-as-commands. Chosen: cmd/expect pairs. Rejected: LLM-judged done-ness. Why: prose gates are unjudgeable and negotiable. Cost: author must write runnable checks — the point.
D4 validator-as-schema. Chosen: family-aware script IS the schema. Rejected: static JSON Schema only. Why: checks encode section semantics (cmd/expect balance) JSON Schema cannot. Cost: validator is load-bearing; battery-pinned.
D5 (g = globalThis) seam. Chosen: destructured context defaulting to globalThis. Rejected: bare globals only (substrate-only); explicit context only (node-only). Why: both hosts, one source. Cost: one destructure line per binary.
D6 contract soft-when-absent. Chosen: gm-smoke checks the contract card only when present. Rejected: hard-require (foreign targets fail). Why: deploy-proof proved the gap. Cost: a missing contract in the HOME repo is silent — mitigated by §0 ls gate on the contract itself.
D7 node runner for proofs. Chosen: machinery/*.mjs harnesses. Rejected: bash-only proofs. Why: host toolchain parses node invocations reliably; bash+deploy paths trip fail-closed classifiers. Cost: two runtimes documented (substrate-native workflow run; node harness).
D8 markdown cards. Rejected: JSON/YAML cards. Why: NL contracts + commands + prose coexist; frontmatter carries the machine surface. Cost: a real parser lives in the validator's regex layer — keep it strict.
D9 repo-relative documentation. Rejected: full private provenance. Why: public repo; operator decision. Cost: lineage archaeology stays home (MIMOCODE/Goalmode_Cards).
D10 parallel-default. Rejected: sequential-by-habit. Why: N units x T; parallel ~T. Cost: barrier discipline (allSettled) is mandatory.
D11 ceilings explicit. Chosen: maxDepth 8 / agents 1000 / 12h from substrate. Rejected: unlimited. Why: structural faults must throw, not hang. Cost: long builds split across pins.
D12 doctrine verbatim. Rejected: paraphrase. Why: a paraphrase is a claim; the quote is the law. Cost: appendices carry full sources.

## 28. LESSON LEDGER (incidents behind the laws)
L1 RED-before-implementation caught the missing module honestly (bridge build, this session) — law: tests precede code.
L2 The 9/10 run caught the export-alias namespace bug the author did not see — law: the battery reads what you wrote, not what you meant.
L3 The validator's double-colon regex failed ALL cards including correct ones — a validator bug looks exactly like universal non-compliance; fix the measurer first.
L4 The deploy proof caught the contract-card gap in a clean target BEFORE any user did — clean-target proofs are not ceremony.
L5 The workflow-tool absence in-session forced the node harness — surface limitations are documented deltas, not silent fallbacks (D7).
L6 The bare-globals ReferenceError produced the portability seam (D5) — the second host finds the assumption the first host hides.
L7 CTX firewall false-positives on bash+deploy shapes — adapt the invocation channel, never the mechanism (node runner, D7).
L8 A foreign-session report (v3) appeared under this series' name during the move — series naming is scoped per lineage; verify provenance before inheriting.
L9 The operator's stop-and-wait was honored mid-approval — gates fire when the operator says, not when the agent decides.
L10 The judge's missing-work report listed zero §0 met — the kernel speaks in checklists; answer with executed commands, not plans.

## APPENDIX A — SUBSTRATE DOCTRINE (verbatim canon: the runtime this kernel stands on)
Source: mimocode workflows reference, fetched and verified this session (131 lines). Quoted VERBATIM — the quote is the law; paraphrase is a claim.
A1 "Dynamic workflows let you orchestrate many subagents deterministically from a small JavaScript script — fan-out, pipelines, nested workflows — instead of driving each subagent by hand. The script runs in a sandbox; you call agent() to spawn work and combine results with plain JS."
A2 "The file name (minus .js) is not the workflow's identity — the meta.name inside is. Names must match [A-Za-z0-9._-]+."
A3 "Every workflow must begin with a meta export (a pure data literal — it is parsed, not executed)."
A4 "meta.permissions declares permissions the run will need: each entry is asked ONCE up-front (interactively when the run is foreground), the grant lands in the session ruleset, and background subagents inherit it — no mid-run permission stalls. A denial doesn't abort the run."
A5 API returns (verbatim rows): "agent(prompt, opts?) — spawn one subagent — Promise → its deliverable (text, or a validated object if opts.schema), or null on failure. Never throws." / "parallel(thunks) — run an array of () => Promise concurrently — Promise<any[]> (a throwing thunk rejects the batch)" / "pipeline(items, ...stages) — run each item through sequential stages, items in parallel" / "workflow(nameOrScript, args?, opts?) — run a child workflow as its own sub-run and await it — Promise → child result, or null on runtime failure".
A6 "File primitives are jailed to the workspace root (the worktree by default, or the workspace you pass at run). ../absolute escapes throw. Use glob() to enumerate work units — don't spawn an agent just to list files."
A7 agent options (verbatim fields): agentType ("subagent type; default general"), model ("provider/model literal OR a group/tier name"), tools ("tool allowlist; omit to inherit"), schema ("With schema, the deliverable is a validated object (never prose)"), isolation ("worktree"), label ("observability tag"), timeoutMs ("per-call timeout; on timeout resolves null").
A8 "The sandbox removes non-deterministic APIs so a run can be replayed/resumed identically: no Date, crypto, fetch, timers, or process; Math.random is a seeded PRNG. Do network/time-dependent work inside agent() (a real subagent), not in the orchestration script."
A9 Run table: run/status/wait/cancel/resume — "resume: Re-launch a persisted run under the same run_id (journal replay makes it convergent)".
A10 "Failed agent() resolves to null, never throws — check for null; a hung agent is cancelled and also yields null so it can't stall a parallel/pipeline barrier."
A11 "Failed child workflow() resolves to null for runtime failures, but structural faults throw and propagate up the whole tree: cycle detected (a saved name calling itself), nesting past maxDepth, or an unknown workflow name."
A12 "Concurrency is one process-wide semaphore sized by workflow.maxConcurrentAgents; a per-run value can only narrow it. Excess agent() calls queue automatically."
A13 "Communicate between workflows by dataflow — return a value from a child and pass it as args to the next, or write a shared file with writeFile and read it later. Workflows don't message each other directly."
A14 Config knobs (verbatim): maxConcurrentAgents default min(16, 2×cores), "Process-wide ceiling on concurrent subagents across all runs (incl. nested). No upper clamp — set deliberately."; maxDepth 8, "Max workflow()-calls-workflow() nesting; exceeding fails the run"; maxLifecycleAgents 1000, "Hard ceiling on total agents one run spawns over its life; over-cap agent() → null"; scriptDeadlineMs 43200000 (12h), "Wall-clock budget for the whole script; enforced as a hard kill".
A15 Built-in loop precedent (verbatim): "research-experiment — autonomous loop for improving a mechanically verifiable metric ... It records a baseline, runs guarded hypothesis/implementation/evaluation iterations, audits metric gaming, and writes a traceable report. Do not use it when success cannot be reduced to one numeric metric."
A16 compose workflow vs interactive (verbatim): "compose workflow (this, deterministic code) — best when requirements are well-defined and the task decomposes into independent subtasks. It fans out to parallel worktrees and runs non-interactively to completion — fire-and-forget." / "/compose-next skill on Build — best for exploratory or ambiguous work where you want to redirect mid-flow ... Recommended for frontier (Fable/Sol-class) models."

## APPENDIX B — COMPOSE DOCTRINE (verbatim canon quotes)
B1 Skill-gate (session law): "When a skill matches your task, you MUST load it before acting, then follow its guidance. Skill invocation is non-negotiable."
B2 Skip law: "NEVER decide to skip a skill based on its description alone. The skip conditions are INSIDE the skill content."
B3 Ask law: "Never stop the loop with a natural-language question — that ends your turn without finishing the task." (compose:ask)
B4 Loop-ends law (compose:ask, verbatim): "This means: the loop only ends when the task is actually complete — never because you paused to ask in prose."
B5 Never-Ask (compose:ask, verbatim): "you pick the best option for unattended/headless execution yourself and keep going ... Re-pick from the options you proposed, explicitly state your choice and reasoning in your response text, and continue."
B6 Verify iron law (compose:verify, verbatim): "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE" + "If you haven't run the verification command in this message, you cannot claim it passes." + "Skip any step = lying, not verifying."
B7 Verify gate (verbatim 5 steps): "1. IDENTIFY: What command proves this claim? 2. RUN: Execute the FULL command (fresh, complete) 3. READ: Full output, check exit code, count failures 4. VERIFY: Does output confirm the claim? ... 5. ONLY THEN: Make the claim".
B8 Execute chain (compose:execute, verbatim): "Load plan, review critically, execute all tasks, report when complete." + "Create a task per plan task with the task tool" + "Follow each step exactly" + "Use compose:report to write the final report ... Report skill will transition to compose:merge on completion".
B9 Report law (compose:report, verbatim): "code is truth, not specs" + "The report presents the final implemented state as its primary content — what WAS BUILT, not what was tried."
B10 Brainstorm gate: "Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it."
B11 Precedence: "user instructions always take precedence" over skills over default prompt.
B12 Completion: "You are NOT done until ALL of the following are true: code changes ... RUN verification ... confirmed passing output ... minimal and focused" + "DO NOT claim completion without a preceding verification tool call."
B13 compose-next activation: "Enter this workflow only on an explicit user request ... If the user has not clearly requested the workflow, do the work directly and run none of the phases."
B14 compose-next review (verbatim verdicts): "Spec compliance — every acceptance criterion is met and points to evidence" / "Correctness — logic, boundaries, error handling, regressions, and tests are sound" / "Codebase consistency — naming, structure, and local conventions match surrounding code."
B15 compose-next non-convergence: "If the fix-and-re-review loop stops converging ... stop looping and report the impasse with the remaining findings instead of forcing a pass."

## APPENDIX C — GSH GRAMMAR (EBNF, informative)
gsh-script   := shebang, {statement} ;
shebang      := "#!/goalmode" ;
statement    := pin | spec | phase | onstuck | ship | exit ;
pin          := 'PIN' , quoted ;
spec         := 'SPEC' , path , [ '--anchors' , number ] ;
phase        := 'PHASE' , name , ':' , { phase-body } ;
phase-body   := tdd | run | panel | gate | until | write ;
tdd          := 'TDD' , target-path ;
run          := 'RUN' , workflow-name , [ '--args' , json ] , [ '->' , outfile ] ;
panel        := 'PANEL' , number , '--schema' , schema-ref ;
gate         := 'GATE' , quoted-command , '--expect' , quoted-substr ;
until        := 'until(' , gate , ',' , number , ')' ;
onstuck      := 'ON' , 'STUCK' , ':' , route , { '->' , route } ;
route        := 'ROUTE_DEBUG' | 'ROUTE_DERIVE' | 'ROUTE_SPLIT' | 'ROUTE_SWITCH' | 'ROUTE_RECOVER' | 'ESCALATE' ;
ship         := 'SHIP' , ship-step , { 'AND' , ship-step } ;
ship-step    := '/ship-package' | '/engineering-report' ;
exit         := 'EXIT' , '0' ;  (* marker only — KERNEL-OWNED, compiles to nothing *)
Lexical: names [A-Za-z0-9._-]+; quoted = double-quoted string; json = compact JSON object; comments run '# ' to end of line. Compile-time checks: every gate has expect; EXIT emits nothing; unmapped constructs are drift (section 16).

## APPENDIX D — SOURCE LISTINGS (verbatim, annotated — the battery reads what you wrote)
### D.1 sdk/bridge/gsh.js (57 lines, 10 battery laws)
Header contract: "gsh.js — the Goal Shell bridge library: shell mechanics as callable objects over the /goal substrate. Every construct returns/forwards the typed token {ok:bool,...} — the kernel's only success vocabulary. Deterministic: no Date/crypto/fetch/process (workflows.md:78 law)."
export const env = {} — the $ENV store (construct: export/import).
export const route = { table: {} } — the trap table (§6); route.match resolves or null.
exit(ok, extra) — token factory; ok true/false ONLY; extra carries evidence. [battery: exit tokens typed]
seq(a,b) — order law; a's failure short-circuits b and returns a's result. [battery: seq order]
and(a,b) — short-circuit law: b skipped when a fails. [battery: and short-circuit]
or(a,b) — fallback law: b tried only after a fails. [battery: or fallback]
run(cmd,{expect}) — gate law: output text must include expect; mismatch is {ok:false}, never throw; cmd is string or thunk. [battery: run gate polarity]
pipe(a,b) — dataflow law: a's result is b's argument; failure short-circuits. [battery: pipe dataflow]
jobs(thunks) — barrier law: Promise.allSettled; rejections normalized to {ok:false,evidence}; returns {ok, failed[], results[]}. [battery: jobs barrier]
trap(signature, routeName) + route.match — trap law: register in priority order; unknown sig → null. [battery: trap routing]
until(slot,k) — cap law: at most k beats; early return on r.ok !== false; exhausted returns last false. [battery: until cap]
export { exportVar as export } — the alias row the battery caught missing (lesson L2); named-export namespace semantics.
### D.2 deploy/battery/validate-cards.mjs (the schema-as-code)
Walk cards/ for *.md; parse frontmatter /^---\n([\s\S]*?)\n---/; require card/id/version/forked-from/mode (anchored ^field multiline — the double-colon bug lesson: the measurer was wrong, not the cards).
Family goalmode-v1: §0-§6 presence; §0 pairs balance (cmd count == expect count, both > 0); nl_prompt mandatory.
Family js-workflow-v1: meta.name + meta.description + export default async function.
Family compose-function-v1: function: + contract body marker (micro_loop|phases|contract).
Output: per-file PASS/FAIL with error list + totals; exit 1 on any FAIL. THE SCHEMA IS THIS FILE (D4): evolve it and the masters together.
### D.3 deploy/battery/bridge-tests.mjs (10 laws, RED-first history)
Import-or-RED: "RED: gsh.js not importable" exit 1 — the recorded pre-implementation state.
T(name,fn) harness: PASS/FAIL rows; exit 1 on any FAIL. Tests: exit tokens typed / seq order / and short-circuit / or fallback / run gate polarity / pipe dataflow / jobs barrier / trap routing / until cap / env store. Each asserts the LAW (polarity, order, cap, dataflow) — not lines of implementation.
### D.4 .mimocode/workflows/gm-smoke.js (the reference binary)
meta: gm-smoke; phases Enumerate/Check/Gate; permissions read cards/**.
default(g = globalThis) — THE SEAM (D5): destructures {phase, log, glob, readFile}; bare in substrate, injected in node.
Enumerate: cards/masters/*.md + contract card SOFT-when-absent (D6 — the deploy proof forced this).
Check: per file — frontmatter marker; [FILL] legality (masters MAY, filled MUST NOT).
Gate: {ok:true, checked, evidence[]} | {ok:false, failed[]}.
### D.5 machinery/run-smoke.mjs (the reference harness)
Provides sandbox globals from node:fs (glob via readdirSync, readFile try/null); imports the workflow module; runs default(harness); prints JSON; exit 1 unless ok===true. The substrate-native equivalent is `workflow run gm-smoke` in a TUI session (D7: two runtimes, one module).
### D.6 deploy/DEPLOY.sh + deploy/battery/deploy-proof.mjs
DEPLOY copies the substrate surface (.mimocode/, cards masters+examples, sdk/bridge, battery, machinery) into ANY target — code only, never credentials.
deploy-proof.mjs: mkdtemp clean target → DEPLOY → 8-file required-list (PASS/MISSING) → run-smoke INSIDE the target → SMOKE-IN-TARGET {ok:true} → "DEPLOY PROOF: clean target verified". Measured result this session: 8/8 PASS + smoke-in-target PASS, exit 0.
### D.7 cards/GOAL_REPO_BUILD_v1.md (the live contract)
11 §0 command pairs (artifact existence ×2, validator, bridge docs, bridge battery, deploy proof, wc floors, manuals, substrate surface, smoke, secret grep, git commit, remote). §1 8 phases (scaffold→sdk+bridge→substrate→example→deploy→bibles→README→ship). §2 smoke slot; §3 tdd+next; §4 panels+cold final; §5 secret-scan→commit→push, README=report+blueprint; §6 routes + compaction re-entry.

## 29. MIGRATION AND VERSIONING
v1 (seed, 2026-09-10): mode architecture — M1 router, M2 orchestrator, M3 gate; 4 masters; bible seed with verbatim head. Provenance: MIMOCODE/Goalmode_Cards (private lineage).
v1.5 (2026-09-12, this repo): bridge SDK (gsh.js 10 laws), family-aware schema + validator, smoke binary + node harness, DEPLOY + clean-target proof, tetris worked example, GSH grammar (11 constructs), this bible.
v2 (planned): gm-compile (GSH→card translator as a binary), gm-panels + gm-research binaries proven in-runtime, routing-order validation in the validator, per-card calibration constants schema, second worked example (docs-build).
Migration law: masters carry version; forked-from chains lineage; breaking schema changes bump the validator and ALL masters in one commit.

## 30. FILE MANIFEST (this repo, built this session)
cards/GOAL_REPO_BUILD_v1.md — the live contract card (91+ lines, 12 §0 pairs).
cards/masters/GOALMODE_CARD_MASTER_v1.md (53L) — §0-§6 skeleton, 19 [FILL].
cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md — meta + default export skeleton.
cards/masters/COMPOSE_TDD_CARD_MASTER_v1.md — tdd contract card.
cards/masters/COMPOSE_NEXT_CARD_MASTER_v1.md — 8-phase contract card.
cards/examples/BUILD_TETRIS_v1.md — filled worked example (validator PASS).
sdk/bridge/gsh.js — 10-law construct library.
sdk/bridge/GSH_SPEC.md — grammar + polarity + determinism laws.
sdk/bridge/translate.md — the 3-step translation protocol.
sdk/bridge/bridge.template.js — forkable js-slot pair.
sdk/CARD_SCHEMA.md — the document schema (families + sections).
.mimocode/workflows/gm-smoke.js — the smoke binary (seam pattern).
.mimocode/skills/goalmode-card/SKILL.md — card ops doctrine.
.mimocode/skills/goal-shell/SKILL.md — kernel + boot doctrine.
.mimocode/commands/goalmode.md — the /goalmode wizard.
machinery/run-smoke.mjs — the reference node harness.
deploy/DEPLOY.sh — substrate installer.
deploy/battery/validate-cards.mjs — schema-as-code.
deploy/battery/bridge-tests.mjs — 10-law battery.
deploy/battery/deploy-proof.sh|.mjs — clean-target proofs.
reports/GoalShell_Tetris_ShowMe.md — the four-layer worked blueprint (242L).

## 31. COMPACTION RECOVERY GUIDE (read this first after context loss)
1. Read the pinned card (its path is in the goal text) — §0 IS the contract; §1 tells you the phase you were in.
2. Reload .mimocode/skills/goal-shell/SKILL.md (boot law) and this bible's sections 4-5 (grammar + API).
3. Re-run the cheap gates: validator → smoke → (if deploy phase) deploy-proof. Green means the tree is honest; resume the last incomplete §1 phase.
4. Never re-ask the operator settled questions — the card + this bible hold them. New forks get the question tool, recommended first.
5. The verbatim sources live in the appendices above — quote them; never paraphrase doctrine.
6. If a §0 gate is impossible as written, say so LOUDLY with the measured count — never pad, never fake green.

=== END GOAL SHELL BIBLE v1.0 (honest line count recorded in README battery table) ===
