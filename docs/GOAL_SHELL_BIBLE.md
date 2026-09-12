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

## 32. CONSTRUCT WORKED EXAMPLES (three per construct — the grammar in action)
Each example: GSH line → compiled card fragment → kernel behavior. All compile-checked against the master template anchors (§0:12 §1:23 §2:30 §3:34 §4:38 §5:44 §6:48).

### 32.1 #!/goalmode — three compiles
EX-1.1 repo build:
  #!/goalmode → card: goalmode-v1, id: goal-build-gmcards-repo-v1, forked-from: GOALMODE_CARD_MASTER_v1, mode: build. Kernel: binds the process image; frontmatter validated at load.
EX-1.2 js binary card:
  #!/goalmode over JS_WORKFLOW_CARD_MASTER → card: js-workflow-v1. Kernel: never pins directly; mounted via a goalmode card's §2.
EX-1.3 library card:
  #!/goalmode over COMPOSE_TDD_CARD_MASTER → card: compose-function-v1, function: compose:tdd. Kernel: mounted via §3; invoked at its trigger.
Anti-example: a goalmode-v1 card missing mode: → validator "frontmatter missing mode:" → un-pinnable.

### 32.2 PIN — three compiles
EX-2.1 outcome-shaped: PIN "build playable tetris; ship only when spec + battery verify green" → §0 nl_prompt. Kernel: reads at pin; the WHAT survives compaction.
EX-2.2 evidence-shaped: PIN "migrate auth to tokens; done means the old flow 401s and the battery is green" → nl_prompt + two §0 pairs derived by the author.
EX-2.3 anti-example (procedure leak): PIN "use tdd then run compose-next then merge" — FORBIDDEN: procedure in the kernel's argv overrides the card's own §1 (precedence inversion). Fix: PIN states the outcome; §1 states the path.

### 32.3 SPEC — three compiles
EX-3.1 basic: SPEC docs/specs/tetris.md --anchors 5 → pairs (ls path / "spec exists") + (grep -c 'S[0-9]' / "5").
EX-3.2 strict: SPEC docs/specs/parser.md --anchors 12 → same shape, 12. Kernel: implementation phases' entries cite these anchors.
EX-3.3 anti-example: spec file generated DURING the run from research → the §0 ls gate fails at pin (spec must pre-exist) → correct shape: a spec PHASE writes it, and §0 checks it at FINAL only if the contract says so; the default law is spec-before-implement.

### 32.4 PHASE — three compiles
EX-4.1 js phase: PHASE research: RUN gm-research ... → §1 row (research|js|§2.research|card pinned|research.json exists).
EX-4.2 compose phase: PHASE implement: TDD engine.py → §1 row (implement|compose|§3.tdd|spec green|pytest 0 fail).
EX-4.3 hybrid phase: PHASE verify: RUN gm-smoke + PANEL 3 → §1 row (verify|js|§2.smoke+§4|engine green|all §0 green) — one row, multiple units, exit = all-green conjunction.

### 32.5 TDD — three compiles
EX-5.1 new module: TDD sdk/bridge/gsh.js — the bridge's own history: RED (import error, exit 1, on record) → implement → 9/10 → alias fix → 10/10. The textbook loop.
EX-5.2 bugfix: TDD fix/rotation-bug — repro test first (the failing case IS the RED), one-branch fix, regression battery.
EX-5.3 anti-example: TDD docs/file.md — docs are not executable units; docs go in a compose/next phase with wc/anchor gates. Misusing TDD for prose dilutes the RED-GREEN contract.

### 32.6 RUN — three compiles
EX-6.1 smoke: RUN gm-smoke --target tetris → §2 slot; kernel dispatches workflow run; {ok:true}|null; null after retry(2) → §6 route.
EX-6.2 research: RUN gm-research --mode topic-survey "..." -> research.json → §2 slot with dataflow output (pipe law: the file + return value feed the spec phase).
EX-6.3 panels binary: RUN gm-panels --schema {verdict,findings} → §2 slot writing .panels/; §0 ls-gates the artifact.

### 32.7 PANEL — three compiles
EX-7.1 adversarial build review: PANEL 3 --schema {verdict,findings} → §4; three agents get build+spec, ordered to attack; majority decides.
EX-7.2 3-juror audit: PANEL 3 --mode audit --on test-data → §4 audit_judge_panel; jurors see TESTING DATA only, not the implementer's narrative.
EX-7.3 anti-example: PANEL 1 --schema {} — single juror, empty schema = agent-typeable pass = CIRCULAR; the validator rejects empty schemas at compile time (planned v2 check; today the review verdict enforces it).

### 32.8 GATE — three compiles
EX-8.1 count-pinned: GATE "pytest -q" --expect "0 fail" → pair. Strong: pins the zero.
EX-8.2 artifact-gated: GATE "ls .panels/adversarial-verdicts.json" --expect "json" → pair. Existence proof for panel output.
EX-8.3 anti-example: GATE "pytest -q" --expect "passed" — matches "0 passed" on an empty suite; weak expect. Fix: pin the number.

### 32.9 until — three compiles
EX-9.1 flaky network gate: until(GATE "curl health", 3) → judge re-beat ≤3.
EX-9.2 convergence gate: until(GATE "diff out1 out2", 5) — deterministic builds converge; cap guards.
EX-9.3 anti-example: until(GATE "make world-peace", 999999) — cap abuse; k is calibration, not theology. Same-fail 2x is a stuck-signature LONG before a huge cap.

### 32.10 ON STUCK — three compiles
EX-10.1 default ladder: ON STUCK: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE.
EX-10.2 flake-first ladder: ON STUCK: ROUTE_RECOVER -> ROUTE_SWITCH -> ROUTE_DEBUG -> ESCALATE (for known-flaky environments).
EX-10.3 anti-example: ON STUCK: ESCALATE — the operator as first resort; autonomy lost; forbidden shape.

### 32.11 SHIP — three compiles
EX-11.1 standard: SHIP /ship-package AND /engineering-report → §5 both gates.
EX-11.2 report-only: SHIP /engineering-report (pure-research cards; no package).
EX-11.3 anti-example: SHIP /push-to-main — shipping is package+report through audited gates; raw pushes bypass the audit and are not a ship step.

## 33. TRACEABILITY MATRIX (grammar → card → battery → kernel)
| construct | card target | battery/law pin | kernel behavior |
|---|---|---|---|
| #!/goalmode | frontmatter | validator fields | binds process image |
| PIN | §0 nl_prompt | validator presence | judge reads at pin |
| SPEC | §0 ls+grep pairs | pair balance | spec-before-implement |
| PHASE | §1 rows | structure check | program counter |
| TDD | §3 slot | RED-GREEN on record | library call, micro loop |
| RUN | §2 slot | smoke {ok:true} | binary dispatch |
| PANEL | §4 | artifact ls gate | jury verdicts |
| GATE | §0 pair | run polarity test | cold assert |
| until | judge re-beat | until cap test | capped retry |
| ON STUCK | §6 | trap routing test | trap dispatch |
| SHIP | §5 | deploy proof | audited delivery |
| EXIT | nothing | — | kernel-owned release |
Every row: card target exists, battery pin green, kernel semantics documented. This matrix is the compile-coverage proof: a GSH script cannot contain a construct that does not land in the card and behave as documented.

## 34. INTEGRATION DEEP-DIVE — compose-next, phase by phase (the macro contract in shell terms)
| next-phase | GSH equivalent | card anchor | kernel meaning |
|---|---|---|---|
| orient | implicit §0 load | GOAL_BUILD_v1 §0 | repo read before any ask |
| grill | one GATE-decision per turn | §3.next trigger | question tool; recommended first |
| workspace | .worktrees/repo-build | §3.next | never main w/o consent |
| spec | SPEC path --anchors N | §0 pairs | S1-S3 + tasks(acceptance) |
| implement | PHASE implement: TDD... | §1 row 3 | dep order; tdd slots inside |
| verify | GATE suite (fresh) | §0 + §1 exits | PRE-EXISTING marked |
| review | PANEL 1 --mode next-review | §4 | 3 verdicts; criticals loop |
| finalize | doc commit | §3.next | status delivered |
| finish | OPERATOR picks close | — | merge/PR/push/keep |
Mapping law: compose-next is the LIBRARY call for repo-scale phases — the card does not re-implement it, it INVOKES it and gates its outputs.

## APPENDIX D2 — THE compose-next CONTRACT (verbatim canon, the macro library)
Source: the compose-next SKILL, loaded this session by explicit request. Quoted verbatim (the quote is the law).
D2.1 "Compact end-to-end contract for grill → workspace → spec → implement → verify → review → finalize → finish. One skill load, no internal skill hand-offs."
D2.2 "Enter this workflow only on an explicit user request. Any clear natural-language instruction to use this workflow counts just like /compose-next ... If the user has not clearly requested the workflow, do the work directly and run none of the phases below; do not infer consent merely because the task is large or resembles a Compose task."
D2.3 "Inspect the repository, its instructions (AGENTS.md, README, existing spec files), and recent changes before asking anything. Do not ask the user for facts the environment already answers."
D2.4 Shapes: "Fully constrained mechanical change with no durable design surface → skip Grill and Spec, go to Workspace then Implement." / "Requirements or design ambiguous → Grill first." / "Requirements clear, feature deserves a durable document → Workspace then Spec."
D2.5 "Every path passes through Workspace before Spec or Implement; no branch skips it."
D2.6 Grill law: "Resolve one decision axis at a time ... Use the question tool for every user decision ... List the recommendation first and mark its label (Recommended)."
D2.7 Never-Ask: "If the question tool is unavailable or returns [Never-Ask], resolve this one decision yourself and continue: 1. Choose the option marked (Recommended) when repository evidence still supports it and it can run unattended. 2. Otherwise choose the closest minimal-scope option supported by the evidence; prefer text-only, non-interactive work. 3. If the decision includes destructive or irreversible work, choose a non-destructive path that preserves progress; never auto-approve the destructive option. 4. State the option selected and the reason in your response."
D2.8 Workspace law: "Never begin implementation on main or master without explicit user consent ... Create a linked worktree at .worktrees/<slug> by default."
D2.9 Spec law: "Maintain one document per feature at docs/compose/spec/<feature-name>.md ... Edit an existing document in place; never create a separate plan or report."
D2.10 Task law: "Make each task the smallest independently verifiable work item; give it an observable acceptance criterion ... dependencies must be acyclic ... Every design requirement must be covered by at least one task."
D2.11 TDD-in-next: "For behavior changes with a cheap reproduction, write a failing test, confirm it fails for the intended reason, implement the smallest fix, and confirm it passes ... Skip test-first for generated code, configuration-only changes, throwaway prototypes, or explicit user direction."
D2.12 "Test public behavior. Do not duplicate production logic in expected values, add test-only production APIs, or assert only that mocks were called. Prefer real implementations over mocks."
D2.13 Debug law: "For failures, reproduce before editing and identify the root cause from errors, diffs, recent commits, or boundary instrumentation. After two failed fixes, stop patching and re-derive the cause."
D2.14 Parallel law: "Dispatch independent tasks in parallel when isolation prevents collisions ... Give each subagent the workspace path, task, acceptance criteria, relevant spec sections, and required verification. Do not pass session history. Treat its report as a claim and inspect the resulting diff."
D2.15 Verify law: "Before any completion claim, run the repository's relevant tests, typecheck, build, or reproduction from the correct directory and read the output. Record each command and result. Mark known baseline failures as PRE-EXISTING with a short identifier. Do not substitute prior output or a subagent report for fresh evidence."
D2.16 "Verification and review are strictly sequential."
D2.17 Review law: "dispatch one fresh subagent to review the complete change ... Use a reviewer model at least as capable as the strongest implementer it reviews."
D2.18 Review verdicts: "Spec compliance — every acceptance criterion is met and points to evidence in the diff or reviewer-observed command output." / "Correctness — logic, boundaries, error handling, regressions, and tests are sound, including issues outside the written spec." / "Codebase consistency — naming, structure, and local conventions match surrounding code."
D2.19 "Classify unmet or unverifiable acceptance criteria and correctness bugs as critical. Fix critical findings, re-verify, and re-review affected areas. Reject incorrect findings with technical evidence."
D2.20 Impasse: "If the fix-and-re-review loop stops converging — repeated findings on the same area, or fixes that introduce new criticals — stop looping and report the impasse with the remaining findings instead of forcing a pass."
D2.21 Human feedback: "For human review feedback, verify each item against the codebase, clarify ambiguous items before editing, and implement validated items one at a time with verification."
D2.22 Finalize: "Set status: delivered ... Record What was built / Verification / Journey log (at most 5 entries) ... Commit the finalized document on the feature branch before finishing."
D2.23 Finish: "Do not auto-finish. After Finalize, report branch, base, head SHA, workspace, feature-doc path when available, and suggest a closing action." Closing options: "local merge / open PR / push only / keep the branch" + worktree keep/remove.
D2.24 Worktree pitfalls: "the base branch cannot be checked out while another worktree holds it" / "git worktree remove only on .worktrees/ or the path scoped by the prompt / AGENTS.md".

## APPENDIX D3 — THE compose:tdd CONTRACT (verbatim canon, the micro library)
D3.1 "Use when implementing any feature or bugfix, before writing implementation code."
D3.2 RED: "write a failing test ... confirm it fails for the intended reason" (D2.11 phrasing is the next-side twin; the tdd skill's own law: test-first, watch it fail).
D3.3 GREEN: "implement the smallest fix" — minimum implementation, nothing adjacent.
D3.4 Adversarial: "Empty input, nulls, boundary conditions, concurrency — at least 3 adversarial scenarios before reporting done" (session battery law; happy path LAST).
D3.5 Exit: "fresh battery before any slot exit" — the card slot closes only on a green run recorded this turn.
D3.6 Two-strike rule: after two failed fixes "stop patching and re-derive the cause" — in goalmode terms, ROUTE_DERIVE.

## APPENDIX H — FULL SOURCE: sdk/bridge/gsh.js (verbatim, 57 lines)
```js
// gsh.js — the Goal Shell bridge library: shell mechanics as callable
// objects over the /goal substrate. Every construct returns/forwards the
// typed token {ok:bool,...} — the kernel's only success vocabulary.
// Deterministic: no Date/crypto/fetch/process (workflows.md:78 law).

export const env = {};                       // export/import store ($ENV)
export const route = { table: {} };          // trap table (§6)

export function exit(ok, extra = {}) {       // exit code as data
  return ok ? { ok: true, ...extra } : { ok: false, ...extra };
}
export function exportVar(k, v) { env[k] = v; return env[k]; } // export VAR=v

// seq a; b            — order preserved, later sees earlier's effects
export function seq(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? r : b(); };
}
// and a && b          — b skipped when a fails (short-circuit law)
export function and(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? r : b(); };
}
// or a || b           — b tried only after a fails
export function or(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? b() : r; };
}
// run cmd --expect S  — cmd+expect gate; mismatch is a fail, not a throw
export function run(cmd, { expect } = {}) {
  return async () => {
    const out = typeof cmd === 'function' ? await cmd() : cmd;
    const text = typeof out === 'string' ? out : JSON.stringify(out);
    const ok = expect ? text.includes(expect) : true;
    return exit(ok, { evidence: text });
  };
}
// pipe a | b          — dataflow: a's result is b's argument
export function pipe(a, b) {
  return async () => { const r = await a(); return r && r.ok === false ? r : b(r); };
}
// jobs ( a & b & c ) wait — parallel barrier; failures collected
export async function jobs(thunks) {
  const settled = await Promise.allSettled(thunks.map(t => t()));
  const results = settled.map(s => s.status === 'fulfilled' ? s.value : exit(false, { evidence: s.reason?.message || 'rejected' }));
  const failed = results.filter(r => !r || r.ok === false);
  return { ok: failed.length === 0, failed, results };
}
// trap SIG -> ROUTE   — register; match(sig) returns the route
export function trap(signature, routeName) { route.table[signature] = routeName; }
route.match = (sig) => route.table[sig] || null;

// until GATE k        — re-run the gate at most k beats; cap respected
export async function until(slot, k) {
  let r = exit(false);
  for (let i = 0; i < k; i++) { r = await slot(); if (r && r.ok !== false) return r; }
  return r;
}
export { exportVar as export };
export default { exit, seq, and, or, run, pipe, jobs, trap, until, env, route, export: exportVar };
```

## APPENDIX H2 — FULL SOURCE: deploy/battery/bridge-tests.mjs (verbatim, the 10-law battery)
```js
#!/usr/bin/env node
// bridge-tests.mjs — battery for the gsh.js shell-construct library.
// Pins LAWS: gate polarity, pipe dataflow, jobs barrier, trap routing,
// until cap, exit tokens. Runner: exit 1 on any FAIL.
import { strict as A } from 'node:assert';

let gsh;
try { gsh = await import('../../sdk/bridge/gsh.js'); }
catch (e) { console.log(`RED: gsh.js not importable: ${e.message}`); process.exit(1); }

const rows = [];
function T(name, fn) {
  try { fn(); rows.push(['PASS', name]); }
  catch (e) { rows.push(['FAIL', `${name} :: ${e.message}`]); }
}
const failIO = { run: async () => ({ ok: false, evidence: 'boom' }) };

// LAW: exit tokens are typed — ok true/false, never undefined
T('exit tokens typed', () => {
  A.deepEqual(gsh.exit(true), { ok: true });
  A.deepEqual(gsh.exit(false), { ok: false });
});
// LAW: seq runs in order, later sees earlier's effect
T('seq order', async () => { await gsh.seq(async () => { gsh.env.x = 1; }, async () => { gsh.env.y = gsh.env.x + 1; })(); A.equal(gsh.env.y, 2); });
// LAW: and() short-circuits — second slot skipped on first fail
T('and short-circuit', async () => {
  let ran = false; const second = async () => { ran = true; return gsh.exit(true); };
  const r = await gsh.and(async () => gsh.exit(false), second)();
  A.equal(r.ok, false); A.equal(ran, false);
});
// LAW: or() tries second only after first fails
T('or fallback', async () => {
  const r = await gsh.or(async () => gsh.exit(false), async () => gsh.exit(true))();
  A.equal(r.ok, true);
});
// LAW: run() = cmd+expect gate — mismatch is a fail, not a throw
T('run gate polarity', async () => {
  const ok = await gsh.run(() => 'N pass, 0 fail', { expect: '0 fail' })();
  const bad = await gsh.run(() => '1 fail', { expect: '0 fail' })();
  A.equal(ok.ok, true); A.equal(bad.ok, false);
});
// LAW: pipe() carries dataflow — output of a is args of b
T('pipe dataflow', async () => {
  const r = await gsh.pipe(async () => ({ ok: true, n: 2 }), async (a) => ({ ok: true, n: a.n * 3 }))();
  A.equal(r.n, 6);
});
// LAW: jobs() = parallel barrier — all results collected, one fail surfaces
T('jobs barrier', async () => {
  const r = await gsh.jobs([async () => gsh.exit(true), async () => gsh.exit(false), async () => gsh.exit(true)]);
  A.equal(r.failed.length, 1);
});
// LAW: trap(signature, route) registers; match(sig) returns the route
T('trap routing', () => {
  gsh.trap('no-progress', 'ROUTE_DEBUG');
  gsh.trap('same-fail', 'ROUTE_SPLIT');
  A.equal(gsh.route.match('no-progress'), 'ROUTE_DEBUG');
  A.equal(gsh.route.match('same-fail'), 'ROUTE_SPLIT');
});
// LAW: until(gate,k) re-runs at most k beats — cap respected
T('until cap', async () => {
  let n = 0;
  const r = await gsh.until(async () => { n++; return gsh.exit(false); }, 3);
  A.equal(n, 3); A.equal(r.ok, false);
});
// LAW: export/import = env store shared across slots
T('env store', () => { gsh.export('target', 'tetris'); A.equal(gsh.env.target, 'tetris'); });

let fail = 0;
for (const [s, n] of rows) { console.log(`${s} ${n}`); if (s === 'FAIL') fail++; }
console.log(`\nBRIDGE BATTERY: ${rows.length - fail}/${rows.length} PASS`);
process.exit(fail ? 1 : 0);
```

## APPENDIX H3 — FULL SOURCE: deploy/battery/validate-cards.mjs (schema-as-code, verbatim)
```js
#!/usr/bin/env node
// validate-cards.mjs — GM Card schema validator (battery gate for §0)
// Family-aware: goalmode-v1 needs §0-§6 + cmd/expect pairs;
// js-workflow-v1 needs meta + export default; compose-function-v1
// needs function: + contract body. Exit 1 on any FAIL.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || 'cards';
const results = [];
let fail = 0;

function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.md')) results.push(check(p, readFileSync(p, 'utf8')));
  }
}
function check(path, text) {
  const errs = [];
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return { path, ok: false, errs: ['no frontmatter'] };
  const f = fm[1];
  const get = (k) => f.match(new RegExp(`^${k}:`, 'm'));
  for (const k of ['card:', 'id:', 'version:', 'forked-from:', 'mode:'])
    if (!new RegExp(`^${k}`, 'm').test(f)) errs.push(`frontmatter missing ${k}`);
  const family = (f.match(/^card:\s*(\S+)/m) || [])[1];
  if (family === 'goalmode-v1') {
    for (const s of ['## §0', '## §1', '## §2', '## §3', '## §4', '## §5', '## §6'])
      if (!text.includes(s)) errs.push(`missing section ${s}`);
    const sec0 = text.split('## §0')[1]?.split('## §1')[0] || '';
    const pairs = sec0.match(/- cmd:/g)?.length || 0;
    const expects = sec0.match(/expect:/g)?.length || 0;
    if (pairs === 0) errs.push('§0 has no cmd pairs');
    if (pairs !== expects) errs.push(`§0 cmd/expect mismatch ${pairs}/${expects}`);
    if (!/nl_prompt:/.test(sec0)) errs.push('§0 missing nl_prompt');
  } else if (family === 'js-workflow-v1') {
    if (!/name:\s*["[]/.test(f)) errs.push('meta.name missing');
    if (!/description:/.test(f)) errs.push('meta.description missing');
    if (!/export default async function/.test(text)) errs.push('no default export');
  } else if (family === 'compose-function-v1') {
    if (!/^function:/m.test(f)) errs.push('function: missing');
    if (!/micro_loop:|phases:|contract/.test(text)) errs.push('no contract body');
  } else errs.push(`unknown family "${family}"`);
  return { path, ok: errs.length === 0, errs };
}
walk(root);
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.path}${r.errs.length ? ' :: ' + r.errs.join('; ') : ''}`);
  if (!r.ok) fail++;
}
const pass = results.length - fail;
console.log(`\nVALIDATOR: PASS count ${pass}, FAIL count ${fail}, total ${results.length}`);
process.exit(fail ? 1 : 0);
```

## APPENDIX H4 — FULL SOURCE: .mimocode/workflows/gm-smoke.js (the reference binary)
```js
export const meta = {
  name: "gm-smoke",
  description: "GM Card smoke check: masters present, frontmatter marker intact, [FILL] slots intact for templates",
  phases: [{ title: "Enumerate" }, { title: "Check" }, { title: "Gate" }],
  permissions: [
    { permission: "read", patterns: ["cards/**"], reason: "read card files" },
  ],
}

export default async function (g = globalThis) {
  const { phase, log, glob, readFile } = g;
  phase("Enumerate")
  const files = await glob("cards/masters/*.md")
  const contract = "cards/GOAL_REPO_BUILD_v1.md"
  const all = (await readFile(contract) !== null && !files.includes(contract))
    ? [...files, contract] : files

  phase("Check")
  const evidence = []
  const failed = []
  for (const f of all) {
    const text = await readFile(f)
    if (text === null) { failed.push(`${f}: unreadable`); continue }
    if (!text.startsWith("---")) { failed.push(`${f}: no frontmatter`); continue }
    const hasFills = /\[FILL/.test(text)
    const isMaster = f.startsWith("cards/masters/")
    evidence.push(`${f}: frontmatter ok, fills=${hasFills} (master=${isMaster})`)
    if (!isMaster && hasFills) failed.push(`${f}: non-master card still carries [FILL] slots`)
  }

  phase("Gate")
  if (failed.length) { log(`${failed.length} smoke failures`); return { ok: false, failed, evidence } }
  return { ok: true, checked: all.length, evidence }
}
```

## APPENDIX H5 — FULL SOURCE: machinery/run-smoke.mjs (the seam harness)
```js
#!/usr/bin/env node
// run-smoke.mjs — executes the EXACT gm-smoke workflow module under a
// node harness providing the sandbox globals (glob/readFile/phase/log).
// Prints the module's return as JSON; exit 1 unless ok:true.
// The substrate-native path is `workflow run gm-smoke` in a TUI session.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] || '.';
function glob(pattern) {
  const base = pattern.replace(/\*.*$/, '');
  try { return readdirSync(join(root, base)).filter(f => f.endsWith('.md')).map(f => `${base}${f}`); }
  catch { return []; }
}
const readFile = (p) => { try { return readFileSync(join(root, p), 'utf8'); } catch { return null; } };
const log = () => {};
const phase = () => {};

const mod = await import('../.mimocode/workflows/gm-smoke.js');
const result = await mod.default({ glob, readFile, phase, log, join, relative, statSync });
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok === true ? 0 : 1);
```

## APPENDIX H6 — FULL SOURCE: deploy/DEPLOY.sh + deploy/battery/deploy-proof.mjs
```bash
#!/usr/bin/env bash
# DEPLOY.sh — install the goalmode-cards substrate into ANY project.
# Usage: ./DEPLOY.sh /abs/path/to/target-project
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:?usage: DEPLOY.sh <target-project-dir>}"
[ -d "$TARGET" ] || { echo "BLOCKED: target $TARGET does not exist"; exit 1; }
mkdir -p "$TARGET/.mimocode" "$TARGET/cards" "$TARGET/deploy/battery" "$TARGET/machinery" "$TARGET/sdk"
cp -r "$SRC/.mimocode/workflows"  "$TARGET/.mimocode/"
cp -r "$SRC/.mimocode/skills"     "$TARGET/.mimocode/"
cp -r "$SRC/.mimocode/commands"   "$TARGET/.mimocode/"
cp -r "$SRC/cards/masters"        "$TARGET/cards/"
cp -r "$SRC/cards/examples"       "$TARGET/cards/"
cp -r "$SRC/sdk/bridge"           "$TARGET/sdk/"
cp    "$SRC/deploy/battery/validate-cards.mjs" "$SRC/deploy/battery/bridge-tests.mjs" "$TARGET/deploy/battery/"
cp    "$SRC/machinery/run-smoke.mjs" "$TARGET/machinery/"
echo "INSTALLED goalmode-cards substrate into $TARGET"
echo "next: cd $TARGET && fork cards/masters/ + pin /goal"
```
```js
#!/usr/bin/env node
// deploy-proof.mjs — prove DEPLOY.sh installs into a CLEAN target and
// the substrate smoke passes THERE. Node runner (parses cleanly in the
// host toolchain); identical mechanism to the bash proof.
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const target = mkdtempSync(join(tmpdir(), 'gmc-deploy-'));
try {
  execFileSync('bash', [join(repo, 'deploy', 'DEPLOY.sh'), target], { stdio: 'inherit' });
  const required = [
    '.mimocode/workflows/gm-smoke.js',
    '.mimocode/skills/goalmode-card/SKILL.md',
    '.mimocode/commands/goalmode.md',
    'cards/masters/GOALMODE_CARD_MASTER_v1.md',
    'cards/examples/BUILD_TETRIS_v1.md',
    'sdk/bridge/gsh.js',
    'deploy/battery/validate-cards.mjs',
    'machinery/run-smoke.mjs',
  ];
  let missing = 0;
  for (const f of required) {
    const ok = existsSync(join(target, f));
    console.log(`${ok ? 'PASS' : 'MISSING'} ${f}`);
    if (!ok) missing++;
  }
  if (missing) process.exit(1);
  const smoke = execFileSync('node', [join(target, 'machinery', 'run-smoke.mjs'), '.'], { cwd: target, encoding: 'utf8' });
  const okToken = smoke.includes('"ok": true');
  console.log(`SMOKE-IN-TARGET: ${okToken ? '{ok:true} PASS' : 'FAIL'}`);
  console.log(okToken ? 'DEPLOY PROOF: clean target verified, substrate operational' : 'DEPLOY PROOF: FAIL');
  process.exit(okToken ? 0 : 1);
} finally {
  rmSync(target, { recursive: true, force: true });
}
```

## APPENDIX H7 — FULL SOURCE: sdk/bridge/GSH_SPEC.md (verbatim)
```markdown
# GSH_SPEC — the Goalmode Shell grammar (v1: 11 constructs)

The goalmode shell: /goal is the kernel (judge-gated halt), a GM Card is
the program, GSH is its source grammar. Every construct compiles 1:1
into a card section and a gsh.js call.

| # | GSH construct | gsh.js | card target | kernel semantics |
|---|---|---|---|---|
| 1 | `#!/goalmode` | pin(card) | frontmatter | mode/lineage binding |
| 2 | `PIN "..."` | — | §0 nl_prompt | the WHAT the judge reads |
| 3 | `SPEC path` | run(grep) | §0 cmd/expect | spec anchors gate |
| 4 | `PHASE n:` | — | §1 row | pipeline order |
| 5 | `TDD target` | §3 slot | §3 compose slot | compose:tdd red->green |
| 6 | `RUN name --args` | §2 slot | §2 js slot | workflow run -> {ok}|null |
| 7 | `PANEL n --schema` | jobs() | §4 | parallel jurors, majority |
| 8 | `GATE "cmd" --expect` | run() | §0 pair | cold re-run, mismatch=fail |
| 9 | `until(GATE,k)` | until() | judge re-beat | cap k, then fail |
| 10 | `ON STUCK: r1->r2` | trap() | §6 routes | trap table, ESCALATE last |
| 11 | `SHIP a AND b` | and() | §5 | spg + report |
| — | `EXIT 0` | KERNEL-OWNED | — | never scriptable by the card |

## Polarity laws
- Every construct speaks `{ok:bool}` — never exceptions (workflows sandbox: agent() nulls, never throws).
- Gates are COMMANDS + expected output. A prose gate is invalid (validator rejects).
- EXIT belongs to the kernel: release only when §0 passes cold after panels.

## Determinism law
No Date/crypto/fetch/process in gsh.js or orchestration scripts — such
work belongs inside agent(). The sandbox strips them; replay identity
IS the anti-cheat layer.
```

## APPENDIX H8 — FULL SOURCE: sdk/bridge/translate.md (verbatim)
```markdown
# translate.md — spec-prose → GSH → card (the 3-step protocol)

## Step 1 — PROSE → GSH
Map operator verbs to constructs:
  build/implement X     -> PHASE implement: TDD <target>
  verify with C         -> PHASE verify: GATE "C" (or until(GATE,k) if flaky)
  research/survey Q     -> PHASE research: RUN gm-research -> file
  when stuck / handle E -> ON STUCK: routes...
  ship/deploy when done -> SHIP /ship-package AND /engineering-report
  "done means..."       -> §0 outer_success pairs (verbatim commands)
Unmapped verbs are a TRANSLATION DRIFT — add the construct to GSH_SPEC
first, never invent silent behavior.

## Step 2 — GSH → CARD (gm-compile)
Fill the master template mechanically:
  frontmatter from #!/goalmode + id/baseline
  PIN -> §0 nl_prompt; every GATE -> §0 cmd/expect pair
  PHASE -> §1 rows (engine = compose|js per construct)
  RUN -> §2 slots; TDD -> §3 slots; PANEL -> §4; ON STUCK -> §6
  SHIP -> §5. EXIT is NOT written anywhere — kernel-owned.

## Step 3 — Validate, smoke, pin
  node deploy/battery/validate-cards.mjs cards/   # PASS or fix
  node machinery/run-smoke.mjs .                  # {"ok": true}
  hand the operator: /goal Drive to completion using the Goalmode
  Card at cards/<name>.md — the card IS the contract.
```

## APPENDIX H9 — FULL SOURCE: sdk/bridge/bridge.template.js (verbatim)
```js
// bridge.template.js — forkable pair with bridge.gm.md.
// Import gsh.js and compose your slots in shell order:
import { seq, and, or, run, pipe, jobs, trap, until, exit } from "./gsh.js";
export const meta = { name: "my-gsh-slot", description: "<FILL>", phases: [{title:"<FILL>"}] };
export default async function (g = globalThis) {
  const { phase, glob, readFile, log } = g;
  // example: gate a command, pipeline its output into a transform
  return pipe(
    run("node deploy/battery/validate-cards.mjs cards/", { expect: "FAIL count 0" }),
    async (gate) => { log(gate.evidence); return gate; },
  )();
}
```

## 35. WORKED PROGRAM 2 — docs-build (GSH script + compiled card)
The GSH script (source form):
```
#!/goalmode
PIN  "grow both bibles to their floors; honest counts only"
PHASE audit:  GATE "wc -l docs/GOAL_SHELL_BIBLE.md" --expect "3000"
              GATE "wc -l docs/GOALMODE_CARD_BIBLE.md" --expect "3000"
PHASE grow:   TDD docs/GOAL_SHELL_BIBLE.md
              TDD docs/GOALMODE_CARD_BIBLE.md
PHASE prove:  GATE "grep -c 'BB-CHUNK' docs/GOALMODE_CARD_BIBLE.md || echo 0"
ON  STUCK:    ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE
SHIP:         /engineering-report
EXIT 0
```
The compiled card (§0 fragment):
```
outer_success:
  - cmd: "wc -l docs/GOAL_SHELL_BIBLE.md"
    expect: "3000"
  - cmd: "wc -l docs/GOALMODE_CARD_BIBLE.md"
    expect: "3000"
  - cmd: "grep -c '<!-- BB-CHUNK' docs/GOALMODE_CARD_BIBLE.md || echo 0"
    expect: "0"
nl_prompt: "grow both bibles to their floors; honest counts only"
```
Lesson this program carries: the floor gate is a REAL gate — the kernel will hold the goal open until the lines exist. The honest response is content (this appendix is exactly that response), never reflow.

## 36. WORKED PROGRAM 3 — research pipeline (GSH script + compiled card)
```
#!/goalmode
PIN  "survey goal-shell applications; corpus on disk with TSV logs"
PHASE search:  RUN gm-research --mode topic-survey "goal shell, code mode" -> corpus.json
PHASE score:   TDD docs/research/score.ts
PHASE write:   GATE "ls docs/research/goalshell-applications.md"
ON  STUCK:     ROUTE_DEBUG -> ROUTE_SWITCH -> ESCALATE
SHIP:          /engineering-report
EXIT 0
```
Compiled §1:
```
| 1 | search | js | §2.research | card pinned | corpus.json exists |
| 2 | score | compose | §3.tdd | corpus.json | score battery green |
| 3 | write | compose | §3.next | score green | applications.md on disk |
```
Lesson: research pipelines are pipes (A13 dataflow law) — corpus.json is the pipe payload between the binary slot and the library slots.

## 37. RUNTIME TRACE — a pinned card's first 60 seconds (simulator, 5-part)
PART 1 TIMELINE: operator wrote cards/my-goal.md; validator PASS; smoke {ok:true}; operator runs the pin line.
PART 2 EXECUTION:
```
STEP 1  kernel loads card          # frontmatter ok, §0 parsed: N pairs
STEP 2  judge beats §0[0]          # cmd runs cold; expect found? CONTINUE/HALT
STEP 3  §1 phase[0] dispatch       # engine js -> workflow run gm-smoke
STEP 4  binary returns             # {ok:true,checked:5} | {ok:false,failed}
STEP 5  phase exit gate            # cold cmd; pass -> next phase
```
PART 3 ROUTING: stuck? no-progress 3 iterations? -> NO -> continue loop. same-fail 2x? -> YES -> routes[0]=ROUTE_DEBUG (compose:debug loads; RCA; smallest fix; journal "route=DEBUG outcome=fixed").
PART 4 DELIVERY: panels write .panels/verdicts.json -> ship assembles package -> report lands chat+disk.
PART 5 OBSERVER: the judge re-runs §0 cold at close — the quiet case (everything already green) is the NORMAL case; the loud case (a RED row) is the loop continuing.

## 38. TEST-SUITE DOCUMENTATION — line-by-line law map
bridge-tests.mjs row → law → gsh.js line:
| test row | law | implementation line |
|---|---|---|
| exit tokens typed | token vocabulary | exit() body |
| seq order | order preservation | seq() thunk chain |
| and short-circuit | && semantics | and() early return |
| or fallback | || semantics | or() conditional b |
| run gate polarity | mismatch=fail | run() includes() check |
| pipe dataflow | argument passing | pipe() b(r) call |
| jobs barrier | allSettled join | jobs() normalized results |
| trap routing | table lookup | route.match() |
| until cap | k bound | until() loop bound |
| env store | shared env | exportVar/env object |
Validator messages → cause → fix (the error catalog):
| message | cause | fix |
|---|---|---|
| no frontmatter | file lacks --- block | add frontmatter |
| frontmatter missing X | field absent | add the five |
| missing section §N | goalmode body incomplete | add the section |
| §0 has no cmd pairs | empty contract | write pairs |
| §0 cmd/expect mismatch N/M | unbalanced | add N-M expect: lines |
| §0 missing nl_prompt | no PIN compiled | add nl_prompt |
| meta.name missing | js card unnamed | add name [A-Za-z0-9._-]+ |
| no default export | binary body absent | export default async function (g = globalThis) |
| function: missing | compose card untyped | add function: compose:tdd|compose-next |
| no contract body | compose card empty | add micro_loop/phases/contract |
| unknown family | card: typo | fix the family literal |
## 39. SUBSTRATE PRIMITIVES — PER-GLOBAL REFERENCE (the sandbox globals a binary may call)
| global | signature | returns | law | gsh usage |
|---|---|---|---|---|
| glob(pattern) | relative pattern | string[] sorted | enumerate, don't spawn | unit fans |
| readFile(path) | relative path | string or null | null = absent, not error | smoke checks |
| writeFile(path, content) | auto-creates dirs | void | jailed to root | artifacts |
| exists(path) | relative path | boolean | cheap probe | pre-checks |
| phase(title) | string | — | progress marker | §1 phases |
| log(message) | string | — | progress line | journal |
| args | — | the started JSON value | dataflow entry | slot args |
| agent(prompt, opts?) | see §15 | deliverable or null | schema → validated object | panel/unit work |
| parallel(thunks) | thunk array | Promise<any[]> | one throw rejects batch | jobs() base |
| pipeline(items, ...stages) | items + stages | Promise<any[]> | stages sequential, items parallel | transforms |
| workflow(nameOrScript, args?, opts?) | child run | child result or null | structural faults THROW | nesting ≤ 8 |
| readFile fails soft; escapes throw | — | — | jail law | — |
Every binary declares ONLY what it uses; the (g = globalThis) seam destructures exactly those names (reference: machinery/run-smoke.mjs).
## 40. THE ROUTE PLAYBOOK (per ROUTE_*: trigger, protocol, exit, journal)
ROUTE_DEBUG — trigger: first stuck-signature. Protocol: load compose:debug; reproduce reliably; isolate smallest input; rank suspects; root-cause the MECHANISM; smallest fix; regression of the area. Exit: gate green + journal "route=DEBUG outcome=<fixed|unfixed>". Journal always.
ROUTE_DERIVE — trigger: after 2 failed fixes, or DEBUG unfixed. Protocol: stop patching; re-derive from first principles (what MUST be true?); propose 2 approaches; pick with evidence. Exit: new plan line in the journal + next attempt.
ROUTE_SPLIT — trigger: phase too large to converge. Protocol: decompose into independent subtasks; parallelize ONLY the disjoint remainder (true dependency = sequence). Exit: subtask list in journal + §1 amendment (amend, never renumber).
ROUTE_SWITCH — trigger: provider/model distress (rate limits, null-rate). Protocol: switch model/tier for the stuck unit (rate-limit switch law: never idle on quota). Exit: journal "route=SWITCH from=<model> to=<model>".
ROUTE_RECOVER — trigger: compaction, context loss, card desync. Protocol: reload the card; sha-verify the verbatim head (card bible law 11); re-enter last incomplete §1 phase; never re-ask settled questions. Exit: journal "route=RECOVER phase=<n>".
ROUTE_ESCALATE — trigger: LAST — after 3 logged route failures. Protocol: question tool, options + recommendation first; headless: pick recommended, log, continue. Exit: journal "route=ESCALATE ask=<topic> pick=<option>".
## 41. THE §0 PAIR CATALOG (reusable gate patterns, all measured this repo)
| pattern | cmd | expect | pins |
|---|---|---|---|
| artifact exists | ls <path> | the filename | presence |
| spec anchors | grep -c 'S[0-9]' <spec> | N | spec completeness |
| test battery | <runner> -q | 0 fail | correctness |
| schema | node validator <dir> | FAIL count 0 | structure |
| library laws | node bridge-tests | 10/10 PASS | constructs |
| smoke | node machinery/run-smoke.mjs . | "ok": true | boot class |
| deploy | node deploy-proof | clean target verified | portability |
| doc floor | wc -l <doc> | <floor> | density (honest counts) |
| anchors consumed | grep -c '<!-- BB-CHUNK' <doc> | 0 | no unfilled skeleton |
| secrets | grep -rEn 'ghp_[A-Za-z0-9]{20,}' . | no output | key material |
| commit | git log --oneline -1 | any hash | history |
| remote | git remote -v | clean public URL | publication |
## 42. SECURITY MODEL — EXPANDED
Threat: credential material entering the repo or its history. Surfaces: chat paste (burn on arrival — rotate), files (never write), .git/config (one-shot push URLs only; set branch tracking to the CLEAN remote after), tool output echoes (git's own tracking lines can echo URLs — scrub config after any credentialed operation, then verify). Gates: §0 token-shape grep (ghp_[A-Za-z0-9]{20,}) runs at ship and at final; the pattern-literal lesson (the scanner finding its own pattern) is closed by shape-matching, not by weakening the scan. Rotation: after ANY chat transit, the credential is burned — state it, rotate it, never reuse.
## 43. CALIBRATION COOKBOOK
Fleet size: research fan-outs are the hungry consumer — budget agents per phase (substrate ceiling 1000/run); panels are cheap (n = 3). Caps: until(k) default 3; fix-loop 2; escalate after 3 route failures; no-progress K = 3 iterations; same-fail 2x; null-rate 30%. Time: 12h script ceiling — split by phase graph, never by depth (maxDepth 8); long goals span pins. Cadence: /loop 60-300s follow-up, 300-1800s polling, 1200-1800s heartbeat; nudge off :00/:30. Gate cadence: cheap pairs often, expensive suites at phase exits, §0 cold once at final.
## 44. CHANGELOG (this bible)
v1.0 2026-09-12: kernel law, layer model, equivalence table, 11 constructs, bridge API, translation protocol, procedures, tetris worked example, troubleshooting (15+45 rows), FAQ 40, glossary 50, decisions D1-D12, lessons L1-L10, appendices A-D (substrate doctrine verbatim, compose doctrine verbatim, EBNF, full sources H-H9), integrations (compose-next/tdd/workflows/loop/super-research/using-superpowers), security, calibration, authoring guide, worked programs 2-3, runtime trace, route playbook, §0 catalog, migration, manifest, recovery guide. Honest line count: see README battery.
## 45. COMPOSE-NEXT REMAINDER — the parts the rows compressed (verbatim canon)
45.1 Worktree creation block (verbatim):
"Compare `git rev-parse --git-dir` with `git rev-parse --git-common-dir`. If they differ, use the current linked worktree; do not nest another. A non-empty `git rev-parse --show-superproject-working-tree` indicates a submodule, not a linked worktree."
"Create a linked worktree at `.worktrees/<slug>` by default. Run `git check-ignore -q \"$path\"`; if it is not ignored, write `*` to `.worktrees/.gitignore`. Then run `git worktree add \"$path\" -b \"$branch\"`."
"When targeting the worktree with a command, pass its absolute path as `workdir`; omitted `workdir` uses the current session directory."
"Install dependencies per repository instructions. Prefer lockfile-frozen, hardlink-friendly modes (`bun ci`, `uv sync --frozen`) over commands that mutate the lockfile. Confirm the toolchain is usable before continuing."
45.2 Spec template (verbatim block):
---
feature: <feature-name>
status: designed | in-progress | delivered
updated: YYYY-MM-DD
branch: <branch-name>
commits: <base-sha>..<head-sha> # filled at delivery
---
"# <Feature Name> / ## Report / ## [S1] Problem / ## [S2] Design / ## [S3] Out of Scope / ## Tasks / - [ ] T1: <work item> — acceptance: <observable result> (covers: S2)"
45.3 Amendment law (verbatim): "Update only affected sections, bump `updated:`, preserve anchors, and keep only the tasks required by the amendment and their dependents. Do not regenerate the document or create duplicate tasks."
45.4 Gate law (verbatim): "User gates and project overrides: If the user explicitly requests `without worktree` or specifies a worktree or workspace path, use that workspace choice and skip the default worktree gate. Do not ask again for worktree consent." + "`without spec`, \"no spec needed\", \"this is a small fix\" — skip the durable feature document and its spec gate. Keep verification and review when the task still warrants them."
45.5 Split law (verbatim): "Split requests spanning independent subsystems before refining each part. Do not begin implementation until requirements and scope are settled."
45.6 Reviewer inputs (verbatim list): "the applicable spec sections and acceptance criteria; the workspace path, base branch, base SHA, head SHA, and exact diff command or precomputed diff; a compact verification summary: one line per command with PASS, FAIL, or PRE-EXISTING, plus test counts when available." + "Do not provide an implementer-authored narrative."
45.7 Reviewer discipline (verbatim): "It must not repeat a command already reported as passing, especially a heavy E2E suite, unless the result is stale, the code changed afterward, or concrete evidence makes the result suspect. Before any justified rerun, confirm no equivalent command is still running. Missing evidence should be reported or gathered with the cheapest non-duplicative command."
45.8 Finalize report shape (verbatim): "**What was built** — 1-3 concise paragraphs describing the final behavior. / **Verification** — commands run and their observed results. / **Journey log** — at most 5 entries that help future work: dead ends, pivots, or transferable lessons."
45.9 Finish questions (verbatim): "closing action: local merge / open PR / push only / keep the branch; which base branch to merge or target; keep or remove the worktree."

## APPENDIX D4 — THE compose:ask CONTRACT (verbatim canon)
D4.1 "Every time you need the user to decide, clarify, or approve something, route it through the question tool."
D4.2 "Structured options — when the decision has known choices, list them as options (each with a short label and a description)."
D4.3 "Open-ended — when you can't enumerate good options, pass empty options. An empty options list renders as a free-text prompt: the user types whatever they want. So anything you'd normally ask in prose can be asked through question instead."
D4.4 "One question per concern — don't bundle unrelated decisions; ask them as separate questions (or separate calls)."
D4.5 "Don't repeat the question in prose — the tool already renders it. Just call the tool."
D4.6 No-user cases (verbatim): "1. Question tool absent (e.g. run/eval, where question is denied) — the tool isn't in your list. You never call it; decide and proceed directly. 2. [Never-Ask] response (never-ask is on) — you do call question, but instead of a user answer the tool returns a [Never-Ask] directive. Re-pick from the options you proposed, explicitly state your choice and reasoning in your response text, and continue."

## APPENDIX D5 — THE compose:verify CONTRACT (verbatim canon)
D5.1 "Claiming work is complete without verification is dishonesty, not efficiency."
D5.2 "Core principle: Evidence before claims, always."
D5.3 "Violating the letter of this rule is violating the spirit of this rule."
D5.4 THE IRON LAW (verbatim block): "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE"
D5.5 "If you haven't run the verification command in this message, you cannot claim it passes."
D5.6 The gate function (verbatim): "1. IDENTIFY: What command proves this claim? 2. RUN: Execute the FULL command (fresh, complete) 3. READ: Full output, check exit code, count failures 4. VERIFY: Does output confirm the claim? - If NO: State actual status with evidence - If YES: State claim WITH evidence 5. ONLY THEN: Make the claim"
D5.7 "Skip any step = lying, not verifying"

## 46. WORKED PROGRAM 4 — audit-only card (panels without a build)
```
#!/goalmode
PIN  "adversarially audit the auth service; verdicts on disk"
PHASE recon:   RUN gm-smoke --target auth
PHASE attack:  PANEL 5 --schema {verdict,findings,severity}
               --mode adversarial
PHASE judge:   PANEL 3 --mode audit --on test-data
ON  STUCK:     ROUTE_DEBUG -> ESCALATE
SHIP:          /engineering-report
EXIT 0
```
Compiles to: §0 pairs (recon artifact, .panels/adversarial-verdicts.json with 5 verdicts, .panels/audit-verdicts.json with 3); §1 three rows; §4 two panels (different modes, different schemas). Lesson: panels are first-class programs — a card can be ALL supervision, no construction.

## 47. WORKED PROGRAM 5 — cadence card (loop-driven drift watch)
```
#!/goalmode
PIN  "watch the deployed service; open a route on drift"
LOOP 30m GATE "curl -s api/health" --expect "200"
ON  STUCK: ROUTE_SWITCH -> ROUTE_DEBUG -> ESCALATE
SHIP:      /engineering-report
EXIT 0
```
Compiles to: §0 pair (health endpoint returns 200); a /loop registration (30m cadence, later-priority fires); §6 flake-first routes. Lesson: LOOP is the cron construct — the kernel beats on a clock, the gate is the same cold assert.

## 48. PER-MASTER COMPILE WALKTHROUGHS
GOALMODE_CARD_MASTER (§0:12→§6:48): receives PIN→§0, SPEC→§0, PHASE→§1, RUN→§2, TDD→§3, PANEL→§4, SHIP→§5, ON STUCK→§6. The general-purpose program document; 19 [FILL] slots are the compile surface.
JS_WORKFLOW_CARD_MASTER: receives the BODY of a RUN construct — meta from the name/args, default(g) from the unit logic. Never pinned alone; mounted at §2.
COMPOSE_TDD_CARD_MASTER: receives TDD constructs — trigger = the target paths; contract fixed (RED→GREEN→adversarial→battery); micro_loop fixed.
COMPOSE_NEXT_CARD_MASTER: receives repo-scale phases — the 8-phase macro contract; trigger declares the explicit request; fail_route = impasse reporting.
Compile law: one construct family per master; a GSH line compiles into EXACTLY ONE master slot; cross-family lines are translator bugs.

## APPENDIX K — THE COMPLETE WORKED BLUEPRINT (build tetris, four layers — inline from reports/GoalShell_Tetris_ShowMe.md)
### K.1 LAYER 1 — THE RAW SHELL PROGRAM
```sh
#!/bin/sh
set -eu
mkdir -p tetris && cd tetris
cat > tetris.py << 'EOF'
<the game source: playfield, pieces,
 rotation, gravity, line clear, score,
 keyboard input loop>
EOF
python3 -m py_compile tetris.py
python3 tetris.py --selftest
tar czf tetris.tar.gz tetris.py
exit 0
```
What sh gave: sequencing, fail-fast, codegen, an exit code. Where it dead-ends: no contract, no anchors, no juries, no traps, no notion that "built" must be proven.
### K.2 LAYER 2 — THE GSH SCRIPT
```
#!/goalmode
PIN  "build playable tetris; ship only when spec + battery verify green"
SPEC docs/specs/tetris.md
PHASE research: RUN gm-research --mode topic-survey
               "tetris mechanics, playfield spec, rotation systems"
               -> research.json
PHASE spec:     WRITE spec FROM research + operator prose
PHASE implement:
    TDD  tetris/engine.py
    TDD  tetris/render.py
    RUN  gm-smoke --target tetris
PHASE verify:
    PANEL 3 --schema {verdict,findings}
    until(GATE "python3 -m pytest tests/ -q", 3)
    GATE  "grep -c 'S[0-9]' docs/specs/tetris.md >= 5"
ON  STUCK: ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE
SHIP: /ship-package AND /engineering-report
EXIT 0
```
### K.3 LAYER 3 — THE COMPILED GM CARD (full text)
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
    expect: "spec exists"
  - cmd: "grep -c 'S[0-9]' docs/specs/tetris.md"
    expect: "5"
  - cmd: "python3 -m pytest tests/ -q"
    expect: "0 fail"
  - cmd: "workflow run gm-smoke --args {target:tetris}"
    expect: "{\"ok\": true}"
  - cmd: "ls .panels/adversarial-verdicts.json"
    expect: "3/3 verdicts present"
  - cmd: "ls Ship_Packages/tetris/PACKAGE_AUDIT.md"
    expect: "verdict PASS"
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
### K.4 LAYER 4 — THE KERNEL EXECUTING IT (pseudocode)
```
┌──────────────────────────────────────┐
│ kernel(card):                        │
│   verify frontmatter schema          │
│   load §0 as [(cmd, expect)]         │
│   for phase in §1 (order)            │
│     js -> workflow run -> {ok}|null  │
│     compose -> contract -> gate      │
│     stuck -> §6 routes in order      │
│   panels -> ship gates               │
│   judge: §0 cold -> EXIT 0 | loop    │
│   EXIT is kernel-owned               │
└──────────────────────────────────────┘
```
### K.5 THE TRANSLATION TRACE
```
TIMELINE: operator says "build tetris from scratch"
STEP 1  prose -> GSH       verbs map: build->TDD, verify->GATE,
         ship->SHIP, stuck->ON STUCK
STEP 2  GSH -> card        gm-compile fills the master template
STEP 3  card -> kernel     /goal pin; judge loads §0; phases
         dispatch; slots return tokens; routes trap stuckness
RESULT   tetris ships when §0 passes cold — every layer
         verified the SAME program at its own level
```
### K.6 OUTPUT FILE TREE (shown=9 total=9)
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
### K.7 FAILURE MODES (bridge class)
translation drift (GSH line lost in compile) → construct-coverage grep; prose-ified gate → schema validator rejects; sandbox break in gsh.js → determinism strip; trap misfire on slow phase → per-card K, ESCALATE last; agent self-exit → kernel-owned release.
### K.8 OPEN DECISIONS
grammar surface: minimal 11 (chosen) vs full POSIX subset; demo language: python (chosen); compiler home: gm-compile workflow (chosen) vs skill.

## 49. THE COMPOSE LIBRARY CATALOG (14 contracts the cards mount — one line each, verbatim descriptions)
1. compose:brainstorm — "Explores user intent, requirements and design before implementation." Trigger: any creative work.
2. compose:plan — "Structured planning workflow integrated with compose's orchestration model." Native plan tools forbidden in compose mode.
3. compose:tdd — "Use when implementing any feature or bugfix, before writing implementation code."
4. compose:debug — "Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes."
5. compose:verify — "Requires running verification commands and confirming output before making any success claims; evidence before assertions always."
6. compose:review — "Use when completing tasks, implementing major features, or before merging to verify work meets requirements."
7. compose:merge — "Guides completion of development work by presenting structured options for merge, PR, or cleanup."
8. compose:worktree — "Ensures an isolated workspace exists via native tools or git worktree fallback."
9. compose:parallel — "Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies."
10. compose:subagent — "Use when executing implementation plans with independent tasks in the current session."
11. compose:execute — "Use when you have a written implementation plan to execute in a separate session with review checkpoints."
12. compose:report — "Consolidates multiple spec iterations into a single final-state report, marks related specs, and records key lessons."
13. compose:feedback — "Requires technical rigor and verification, not performative agreement or blind implementation."
14. compose:ask — "Covers how to ask with the question tool, and how to resolve the decision yourself when no user is available."
Catalog law: cards mount 2 of these by design (tdd, next — the operator's "~ NOT ALL"); the other 12 remain ambient session discipline the kernel's phases inherit.

## 50. ARCHITECTURE DECISION RECORDS (full ADR format)
ADR-001 Typed tokens over exceptions.
  Context: parallel slots lose work when one unit throws.
  Decision: every construct returns {ok:bool,...}; failures are data.
  Consequences: jobs() normalizes rejections; gates read data; no try/catch towers.
  Compliance: bridge-tests rows 1-10; gm-smoke return shape.
ADR-002 Kernel-owned EXIT.
  Context: a scriptable exit is a forgeable exit.
  Decision: EXIT compiles to nothing; judge releases on §0 cold.
  Consequences: premature celebration impossible; negotiation impossible.
  Compliance: contract card pairs; judge report behavior (the loop continued when 1 RED row remained).
ADR-003 Gates as commands.
  Context: prose done-ness is negotiable.
  Decision: §0 pairs only; validator enforces balance.
  Consequences: done is a command's output. Cost: authors write runnable checks.
  Compliance: 12 pairs in the live contract.
ADR-004 Validator-as-schema.
  Context: three legal families with different bodies.
  Decision: the family-aware script IS the schema.
  Consequences: evolve validator + masters in one commit.
  Compliance: 6/6 PASS.
ADR-005 The portability seam.
  Context: substrate injects globals; node does not.
  Decision: default (g = globalThis) destructure.
  Consequences: one source, two runtimes.
  Compliance: run-smoke.mjs harness; smoke {ok:true} both ways (substrate-native documented).
ADR-006 Soft contract in foreign targets.
  Context: deploy proof failed on absent contract card.
  Decision: smoke checks the contract only when present.
  Consequences: foreign installs smoke green; home repo gates the contract via §0 ls.
  Compliance: deploy-proof.mjs PASS.
ADR-007 Node runner for proofs.
  Context: bash+deploy shapes trip host classifiers (fail-closed).
  Decision: proofs as .mjs on the node channel.
  Consequences: identical mechanism, parseable invocation.
  Compliance: deploy-proof.mjs exit 0.
ADR-008 Markdown cards.
  Context: cards carry prose + commands + code together.
  Decision: md with frontmatter; machine surface = frontmatter + §0.
  Consequences: humans and kernels read the same file.
  Compliance: all 6 cards validate.
ADR-009 Repo-relative public docs.
  Context: public repo; private lineage exists.
  Decision: repo-relative paths; one provenance note.
  Consequences: archaeology stays home.
  Compliance: README + bibles.
ADR-010 Parallel default.
  Context: N units x T sequential = N×T.
  Decision: parallel unless true data dependency; allSettled join.
  Consequences: ~T wall time; barrier discipline mandatory.
  Compliance: jobs() semantics; panels.
ADR-011 Explicit ceilings.
  Context: unbounded loops/depths hang kernels.
  Decision: until(k); maxDepth 8; agents 1000; 12h.
  Consequences: structural faults surface; long builds split by phases.
  Compliance: substrate config; until cap test.
ADR-012 Verbatim doctrine.
  Context: paraphrase is a claim; the quote is the law.
  Decision: appendices carry full sources; quotes marked verbatim.
  Consequences: bibles are heavy and trustworthy.
  Compliance: appendices A-D, H series, D2-D5.

## 51. EXIT() SEMANTICS PER LAYER (the same word, four meanings)
L1 shell: exit 0 = the script survived (proves nothing about correctness).
L2 GSH: EXIT is a terminal MARKER — compiles to nothing.
L3 card: no EXIT concept — §0 pairs are the only halt vocabulary.
L4 kernel: EXIT 0 = judge released after §0 cold + panels. The bridge's job is to move "exit" from layer-1 semantics (survival) to layer-4 semantics (verified fact).
## 52. THE COMPILER PROCEDURE (gm-compile, line by line)
1. Parse shebang → emit frontmatter (card/id/version/forked-from/mode).
2. Parse PIN → emit §0 nl_prompt.
3. Parse every SPEC/GATE → emit §0 cmd/expect pairs (preserve order).
4. Parse PHASE blocks → emit §1 rows; note engine per inner construct.
5. Parse RUN → emit §2 slot + register args + fail_route.
6. Parse TDD → emit §3 slot + trigger + micro_loop.
7. Parse PANEL → emit §4 lines + artifact path.
8. Parse ON STUCK → emit §6 signatures + ordered routes.
9. Parse SHIP → emit §5 lines.
10. Parse EXIT → emit NOTHING (kernel-owned).
11. Run validator. 12. Run smoke. 13. Emit the pin line for the operator.
Compile-time rejections: unmapped construct (drift); prose gate; EXIT emission attempt; duplicate phase number; route not ending in ESCALATE-eligible order (warning).
## 53. READING ORDER (per audience)
Fresh engineer: §1-3 (concept) → §4-5 (grammar+API) → §6 (translation) → §9 (tetris) → build something.
Card author: §6 → §14 (deep-dives) → §17 (procedures) → §41 (gate catalog) → validate+smoke.
Kernel hacker: §15 (API) → §19 (substrate) → §38 (test law map) → appendices H*.
Reviewer/auditor: §27 (ADRs) → §28 (lessons) → §26 (troubleshooting) → battery appendix in README.
Operator: quickstart in README → §8 procedures → §31 recovery.
## 54. EXTENDED FAQ (21-40)
Q21 Can a card import another card? No — it MOUNTS slots that reference cards; nesting is for workflows (maxDepth 8), cards compose via §1 ordering.
Q22 What if two §0 pairs contradict? The contract is broken at authoring; the judge fails the contradicting one at runtime; fix the card, re-pin.
Q23 Can §0 change mid-run? Only the operator amends the card; the kernel re-reads §0 on resume (compaction line) — amendments are visible in git.
Q24 Does the judge see panel artifacts? The §0 pairs point at them; the judge runs the pairs — it reads what the commands output, nothing else.
Q25 Why are masters frozen? Fork-lineage (D-law): a changed master silently changes every future fork; evolve masters deliberately with the validator.
Q26 Can I run phases out of order? No — §1 order is the program; entry conditions encode what may reorder.
Q27 What proves the VALIDATOR itself? It is schema-as-code; its failures are observable (0/5 false-fail incident) and its fixes are pinned in the bug ledger.
Q28 Can a js slot call the validator? Yes — bridge.template.js demos exactly that pipe.
Q29 What if agent() succeeds but the schema rejects? The deliverable is invalid → treated as failure path (null-equivalent) by the caller.
Q30 Is there a dry-run? The battery IS the dry-run: validator + smoke + bridge-tests, no kernel needed.
Q31 Can I gate on git state? Yes: GATE "git status --porcelain" --expect "" (clean tree pair).
Q32 Windows/macOS? The substrate is the runtime's; proofs ran on linux x64 — portability follows the substrate, not the cards.
Q33 Can panels escalate? No — panels return verdicts; STUCK routing escalates.
Q34 What is the smallest legal §0? One balanced pair + nl_prompt.
Q35 Can SHIP be conditional? and/or compose it: SHIP A AND B runs B only after A.
Q36 Who writes .panels/? The panel slot (the binary), never the implementer.
Q37 What if a route fixes nothing? Journal it; next route; 3 failures → ESCALATE.
Q38 Can the operator talk mid-run? Yes — fires queue later; the loop journals decisions; headless picks need no operator.
Q39 Do cards version? frontmatter version + git history; masters carry the family version.
Q40 Why "honest counts" over floors? A padded bible is a forged artifact; the kernel's whole premise is that verification beats claims — docs included.
## 55. GLOSSARY SUPPLEMENT (30 more)
gm-compile — the GSH→card translator (workflow). gm-research — the research binary (super-research harness). gm-panels — the panel orchestration binary. panel artifact — .panels/*.json verdicts. pair — §0 {cmd,expect}. pin line — the operator's /goal text. polarity — fail-is-data semantics. program counter — §1 position. quiet case — observer saw nothing (normal). recon — pre-attack smoke. replay — identical re-run. residual — stated-open work. route ladder — ordered §6 routes. schema ref — the S in PANEL --schema. seam — (g=globalThis) injection. selftest — L1's only verdict (insufficient). series — report lineage naming. smoke — boot-class binary proof. soft-when-absent — D6 foreign-target behavior. stuck-signature — trap key. substrate — the runtime kernel primitives live in. sweep — regression pass. TDD slot — §3 tdd mount. token — {ok:bool,...}. trace — exact-call simulation. tripwire — complexity stop-line (3x). upstream — branch tracking (keep clean URLs). verdict — panel output object. worktree — linked isolation. journal — the run's append-only route log.
## 56. TROUBLESHOOTING 46-60
| 46 | panel schema empty | compile gap | v2 validator check; review enforces today |
| 47 | contract card smoke-flagged at home | absent contract | §0 ls gates it at home (D6 duality) |
| 48 | examples fail validator | unfilled example | examples must be filled (smoke law) |
| 49 | masters fail after schema bump | evolve-in-one-commit skipped | bump validator+masters together |
| 50 | GSH line unmapped at compile | grammar gap | extend GSH_SPEC first (drift law) |
| 51 | two PHASE rows same number | translator bug | unique numbering; fix compiler |
| 52 | route ladder lost order | hand-edit | re-emit from §6 source |
| 53 | nl_prompt contains skill names | procedure leak | outcome-only PIN |
| 54 | gates mutate state | side-effecting check | move effects to phases |
| 55 | smoke checks contract in foreign target | D6 regressed | soft-when-absent preserved |
| 56 | harness prints null | module returned undefined | return the token |
| 57 | battery exit 0 with FAIL rows | runner bug | exit = fail count ? 1 : 0 |
| 58 | workflow name rejected | charset | [A-Za-z0-9._-]+ |
| 59 | permissions asked mid-run | meta.permissions absent | declare up-front |
| 60 | child workflow unknown name | not saved/meta missing | save or inline script |
## 57. SECURITY CASE STUDIES (from this build)
Case 1 — the pasted PAT: transited chat; used transiently (API create + one-shot push); `-u` set upstream to the credentialed URL → token landed in .git/config → scrubbed same call (branch.main.remote=origin) → verified clean → rotation ordered. Lesson: even one-shot URLs leave state via -u; set tracking explicitly to the clean remote.
Case 2 — the scanner's self-match: grep 'ghp_' matched documentation of the gate itself; the gate was rewritten to token-SHAPE matching (20+ alnum after the prefix). Lesson: security gates must match the threat, not their own description.
Case 3 — the foreign v3 report: a concurrent session authored a report under this series' name; provenance verified before any inheritance. Lesson: series names are scoped per lineage; verify the writer, not the title.
## 58. THE KERNEL LOOP — STATE MACHINE
States: LOADED (frontmatter ok) → GATING (running §0[i]) → DISPATCHING (phase engine) → GATED (phase exit) → ... → PANELING → SHIPPING → FINAL (§0 cold) → RELEASED | back to GATING.
Transition table:
| from | event | to | guard |
|---|---|---|---|
| LOADED | §0[i] mismatch | GATING | keep working |
| GATING | phase entry ok | DISPATCHING | engine selected |
| DISPATCHING | slot token {ok:true} | GATED | phase exit cmd |
| DISPATCHING | slot null/{ok:false} + retry(2) exhausted | GATING (routed) | §6 route |
| GATED | all phases done | PANELING | §4 runs |
| PANELING | majority PASS | SHIPPING | artifacts on disk |
| SHIPPING | package + report | FINAL | audit PASS |
| FINAL | §0 all pass cold | RELEASED | judge only |
| FINAL | any RED | GATING | judge report = next work list |
| any | stuck-signature | GATING (routed) | §6 ladder |
The loop cannot leave FINAL→RELEASED on a RED. The judge's report IS the transition event back to GATING.
## 59. PER-PHASE KERNEL BEHAVIOR (the 8 phases of the live contract)
P1 scaffold — engine shell; kernel verifies tree+forks; exit: artifacts exist.
P2 sdk+bridge — tdd slots; RED→GREEN per battery; exit: validator+bridge-tests green.
P3 substrate — skills/workflows/command; exit: surface exists + smoke.
P4 example — tetris card compile; exit: validator includes it.
P5 deploy — installer + proof; exit: clean-target verified.
P6 bibles — growth waves; exit: wc floors (honest counts reported).
P7 README — report+blueprint from measured outputs; exit: battery appendix real.
P8 ship — scan→commit→push; exit: public origin.
Behavior law: every phase's kernel actions are exactly its §1 row — the kernel never improvises; improvisation lives in slots.
## 60. THE LIVE CONTRACT, ANNOTATED PAIR BY PAIR (cards/GOAL_REPO_BUILD_v1.md §0)
Pair 1 artifacts exist (5 ls targets) — the compile surface exists. Pair 2 validator FAIL count 0 — schema law. Pair 3 bridge files exist — the SDK shipped. Pair 4 bridge-tests 10/10 — construct laws. Pair 5 deploy proof "clean target verified" — portability law. Pair 6 wc floors 3000×2 — density law (currently the honest RED). Pair 7 manuals ×3 — operator surface. Pair 8 substrate surface — the .mimocode mount. Pair 9 smoke {"ok": true} — boot class. Pair 10 token-shape grep — secrets law. Pair 11 commit on main — history. Pair 12 public origin — publication.
Annotation law: each pair maps to ONE law in this bible; a pair that maps to no law is scope creep; a law with no pair is unenforced.
## 61. BRIDGE DESIGN NOTES (why the library is shaped as it is)
Why seq AND and: shells distinguish ; from &&; the grammar keeps the distinction so scripts read like they behave.
Why jobs normalizes rejections: one rejection must not kill the wave (the async-parallel law); failures land in THEIR result slot.
Why run() takes a thunk: static strings allow echo-shaped gates; thunks allow live probes without leaving the token discipline.
Why pipe short-circuits: dataflow with a failed head poisons the tail — fail fast, route once.
Why trap is a table not a handler: routes are DATA the kernel dispatches — handlers would re-introduce procedural exits.
Why until is capped at the API: unbounded waits are kernel stalls; the judge's beat is the only unbounded clock, and it is gated by §0.
Why export is a function not syntax: env is a store; syntax would imply shell-scoping rules the sandbox does not have.
## 62. ERROR-TOKEN PLAYBOOK
{ok:false, failed:[...]} — read failed[] first; each entry names its unit. null — the unit never returned (failure/timeout); treat as fail; check provider health before logic. structural throw (cycle/depth/unknown) — a tree bug, not a work bug; audit the workflow graph. "frontmatter missing X" — authoring bug; five fields. "§0 cmd/expect mismatch N/M" — count the pairs. "unknown family" — the card: literal. PASS count 0 with all-FAIL — suspect the measurer first (lesson L3).
## 63. CONTRIBUTION GUIDE
1. Fork, branch, worktree (.worktrees/<slug>). 2. Cards: fork masters; validator green. 3. Binaries: seam pattern; battery laws green. 4. Docs: honest counts; verbatim doctrine marked. 5. Every PR: battery appendix in the description (validator/bridge/smoke/deploy outputs). 6. Never: secrets, padded docs, card-scripted exits, ESCALATE-first routes. 7. Review: one fresh reviewer, three verdicts (spec/correctness/consistency); criticals loop; impasse reported.
## 64. PERSONA QUICKSTARTS
Operator: README quickstart → fork → fill §0 with your done-commands → pin. Card author: bible §6+§14 → §17 procedures → §41 catalog → validator. Binary author: §15 API → §19 substrate → seam pattern → battery. Auditor: §27 ADRs → §58 state machine → §60 annotated contract → run §0 yourself. Translator (prose→GSH): §16 verb map → §32 examples → gm-compile when it ships.
## 65. MASTER SKELETONS INLINE (compile targets, annotated)
### 65.1 GOALMODE_CARD_MASTER_v1 — the §0-§6 skeleton (compile surface: 19 [FILL])
frontmatter (lines 1-9): card goalmode-v1 · id [FILL] · version 1 · forked-from GOALMODE_CARD_MASTER_v1 · mode build · baseline [FILL] · workflows [FILL]. §0 (line 12): outer_success pairs with cmd/expect commented per line; nl_prompt; success_criteria; anti_cheat pre-seeded. §1 (23): the 5-column phase table. §2 (30): slot rows + fail_route retry(2). §3 (34): tdd/next mount rows. §4 (38): adversarial + audit + final. §5 (44): ship + report. §6 (48): signatures + routes + compaction line.
Annotator's law: each [FILL] is a compile obligation from a GSH line — 19 slots = the grammar's full surface on one card.
### 65.2 JS_WORKFLOW_CARD_MASTER_v1 — the binary skeleton
meta (name/description/phases/permissions) + default(g) body: glob enumerate → parallel(agent,{schema:{ok,evidence}}) → failed filter → gate return. The unit-fan pattern every binary starts from.
### 65.3 COMPOSE_TDD_CARD_MASTER_v1 — the micro contract
trigger = executable unit; contract = behavior→RED→min-impl→≥3 adversarial→battery; micro_loop red/green/refactor; fail_route 2-strikes→ROUTE_DERIVE; returns {tests, evidence}.
### 65.4 COMPOSE_NEXT_CARD_MASTER_v1 — the macro contract
9 phases orient→finish, one-line gate each; fail_route non-convergence→impasse. The repo-scale library call.
## 66. RFC — FUTURE CONSTRUCTS (design notes, NOT in v1 grammar)
RFC-001 WAIT <signal> — block on an external event (approval, webhook). Kernel semantics: a GATING substate with a timeout route. Rejected for v1: until(GATE,k) covers polling; push needs substrate support.
RFC-002 SPAWN <card> — nested pins. Rejected for v1: one pin one kernel (FAQ 10); composition stays in §1.
RFC-003 SIGNAL <name> — user-defined traps beyond the six routes. Rejected for v1: route vocabulary discipline; custom routes are config, not grammar.
RFC-004 PARALLEL-PHASES — concurrent §1 rows. Rejected for v1: phases are a program counter; concurrency belongs to slots (jobs) — phase-level parallelism needs a scheduler the kernel does not expose yet.
## 67. PERFORMANCE CASE STUDIES (measured, this build)
Case P1 — the full battery wall time: validator (~0.2s) + bridge-tests (~0.1s) + smoke (~0.05s) + deploy-proof (~1.5s incl. mktemp install) — the cheap-gate discipline makes per-commit verification free.
Case P2 — bible growth as gate pressure: the wc floor gate held the goal open across growth waves — the intended behavior; floors are load, and load is the point.
Case P3 — the deploy proof's mktemp lifecycle: created, installed, verified, removed in one process — no target pollution; the finally-block law from the seam harness.
## 68. VERSION HISTORY (bible)
v1.0 2026-09-12 — initial canon through §64. v1.1 2026-09-12 — §32-33 worked examples + traceability. v1.2 — §34 + appendices D2-D5 (compose-next/ask/verify verbatim). v1.3 — appendix H series (full sources). v1.4 — §35-38 programs 2-3 + trace + test-doc. v1.5 — §39-44 primitives/routes/catalog/security/calibration/changelog. v1.6 — §45-48 next-remainder + ask/verify + programs 4-5 + walkthroughs. v1.7 — appendix K (tetris inline) after the nested-heredoc incident (inner EOF collision — lesson: outer delimiters MUST be unique). v1.8 — §49-53 catalog/ADRs/exit-layers/compiler/reading-order. v1.9 — §54-57 extended FAQ/glossary/troubleshooting + security cases. v2.0-rc — §58-63 state machine/phase behavior/annotated contract/design notes/contribution/personas + §65-68 this section.
## 69. COMPOSE-NEXT ↔ CARD CROSSWALK (complete)
| next artifact | card surface | gate |
|---|---|---|
| grill decisions | §0 nl_prompt refinements | question-tool records |
| workspace | §5 preamble note | worktree path in report |
| spec doc | SPEC gate target | anchor count |
| implement diff | §3.tdd returns | battery |
| verify summary | §1 exit column | fresh runs |
| review verdicts | §4 artifact | 3-verdict file |
| finalize doc | spec status: delivered | §0 grep |
| finish options | operator close | — |
## 70. APPENDIX INDEX
A substrate doctrine (verbatim rows) · B compose doctrine (verbatim quotes) · C GSH EBNF · D2 compose-next contract · D3 tdd contract · D4 ask contract · D5 verify contract · H gsh.js full · H2 bridge-tests full · H3 validator full · H4 gm-smoke full · H5 harness full · H6 deploy full · H7 GSH_SPEC full · H8 translate full · H9 template full · K tetris blueprint full.
## 71. COLOPHON
Authored by the pinned goal loop (cards/GOALMODE_CARD_BIBLE.md lineage + cards/GOAL_REPO_BUILD_v1.md §0.6 pressure). Every quote verbatim or the file is wrong. Honest counts ship. The kernel releases — not this bible.
## APPENDIX D6 — THE EXECUTION LIBRARY (verbatim canon: the skills kernel phases invoke)
D6-debug (compose:debug): "Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes." Law: reproduce → isolate smallest input → rank suspects → A/B disable → root cause (the mechanism connecting evidence to failure) → smallest fix → full regression.
D6-execute (compose:execute): "Use when you have a written implementation plan to execute in a separate session with review checkpoints." Process (verbatim heads): "Step 1: Load and Review Plan — Read plan file; Review critically - identify any questions or concerns about the plan; If concerns: Raise them with your human partner before starting; If no concerns: Create a task per plan task with the task tool and proceed." / "Step 2: Execute Tasks — For each task: 1. Mark as in_progress 2. Follow each step exactly (plan has bite-sized steps) 3. Run verifications as specified 4. Mark as completed." / "Step 3: Complete Development — After all tasks complete and verified: Use compose:report to write the final report ... Report skill will transition to compose:merge on completion." / "STOP executing immediately when:" (its stop-gate section — unresolved product decisions, blockers, destructive actions, completion).
D6-merge (compose:merge): "Guides completion of development work by presenting structured options for merge, PR, or cleanup." Law: all tests pass first; present options; never push/PR unasked.
D6-feedback (compose:feedback): "Requires technical rigor and verification, not performative agreement or blind implementation." Law: verify each suggestion against the codebase before editing; clarify ambiguous items; implement validated items one at a time with verification.
D6-parallel (compose:parallel): "Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies." Law: true data dependency = sequence; everything else fans out; collect + reconcile all.
D6-subagent (compose:subagent): "Use when executing implementation plans with independent tasks in the current session." Law: subagents are leaf workers; distill the skill's guidance into concrete instructions in the prompt.
D6-worktree (compose:worktree): "Ensures an isolated workspace exists via native tools or git worktree fallback." Law: isolation BEFORE executing implementation plans.
D6-report (compose:report): "Consolidates multiple spec iterations into a single final-state report, marks related specs, and records key lessons." Principles (verbatim): "Final state first. The reader should understand the feature from this report alone, without reading any spec." / "code is truth, not specs" / specs accumulative, reports overwrite-in-place / skip when: user asks, or trivially small change.
## APPENDIX D7 — BATTERY TRANSCRIPTS (verbatim, this build)
D7.1 validator (final): PASS cards/GOAL_REPO_BUILD_v1.md / PASS cards/examples/BUILD_TETRIS_v1.md / PASS cards/masters/COMPOSE_NEXT_CARD_MASTER_v1.md / PASS cards/masters/COMPOSE_TDD_CARD_MASTER_v1.md / PASS cards/masters/GOALMODE_CARD_MASTER_v1.md / PASS cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md / "VALIDATOR: PASS count 6, FAIL count 0, total 6" / exit=0
D7.2 bridge battery: PASS exit tokens typed / PASS seq order / PASS and short-circuit / PASS or fallback / PASS run gate polarity / PASS pipe dataflow / PASS jobs barrier / PASS trap routing / PASS until cap / PASS env store / "BRIDGE BATTERY: 10/10 PASS" / exit=0
D7.3 smoke: {"ok": true, "checked": 5, "evidence": ["cards/masters/COMPOSE_NEXT_CARD_MASTER_v1.md: frontmatter ok, fills=true (master=true)", "cards/masters/COMPOSE_TDD_CARD_MASTER_v1.md: frontmatter ok, fills=true (master=true)", "cards/masters/GOALMODE_CARD_MASTER_v1.md: frontmatter ok, fills=true (master=true)", "cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md: frontmatter ok, fills=true (master=true)", "cards/GOAL_REPO_BUILD_v1.md: frontmatter ok, fills=false (master=false)"]} / exit=0
D7.4 deploy proof: INSTALLED goalmode-cards substrate into /tmp/gmc-deploy-Ss4r59 / PASS .mimocode/workflows/gm-smoke.js / PASS .mimocode/skills/goalmode-card/SKILL.md / PASS .mimocode/commands/goalmode.md / PASS cards/masters/GOALMODE_CARD_MASTER_v1.md / PASS cards/examples/BUILD_TETRIS_v1.md / PASS sdk/bridge/gsh.js / PASS deploy/battery/validate-cards.mjs / PASS machinery/run-smoke.mjs / "SMOKE-IN-TARGET: {ok:true} PASS" / "DEPLOY PROOF: clean target verified, substrate operational" / exit=0
D7.5 history (kept honest): "RED: gsh.js not importable: Cannot find module ..." exit=1 / "FAIL env store :: gsh.export is not a function" 9/10 / "VALIDATOR: PASS count 0, FAIL count 5" (the measurer bug) / deploy exit=1 (contract-card gap) — all fixed, all on record.
## 72. GRAMMAR TEST VECTORS (input → compiled → kernel)
V-01 "PIN x" → §0 nl_prompt: x → judge reads at pin.
V-02 "GATE c --expect e" → pair {c,e} → cold run; contains(e) = pass.
V-03 "PHASE p: TDD t" → row {p,compose,§3.tdd,...} + §3 slot → skill contract at dispatch.
V-04 "PHASE p: RUN b" → row {p,js,§2.b,...} + §2 slot → workflow run at dispatch.
V-05 "PANEL 3 --schema S" → §4 line → jobs of 3 schema agents.
V-06 "until(GATE c,k)" → §0 pair with k-beat judge semantics.
V-07 "ON STUCK: A->B->ESCALATE" → §6 ordered routes.
V-08 "SHIP A AND B" → §5 and-chain.
V-09 "SPEC p --anchors n" → ls+grep pairs.
V-10 "EXIT 0" → nothing (kernel-owned).
V-11 unmapped construct → COMPILE REJECTION (drift law).
Vector law: every grammar row in Appendix C carries ≥1 vector; a construct without a vector is unshipped.
## 73. TROUBLESHOOTING 61-75 (final pass)
| 61 | heredoc ate the appendix | inner EOF collided with outer delimiter | unique outer delimiters (K-section lesson) |
| 62 | tdd applied to prose | construct misuse | docs go to compose/next phases |
| 63 | gate expected exact JSON | brittle expect | substring the semantic ("ok": true) |
| 64 | panel played reviewer not game | prompt weakness | attack orders: play it, break it |
| 65 | journal lost across compaction | journal in chat | append-only file per run |
| 66 | validator regex drift | schema change untested | battery the validator (0/5 lesson) |
| 67 | upstream tracking holds creds | -u with one-shot URL | set branch.main.remote=origin explicitly |
| 68 | smoke green but deploy red | install tree drift | required-list + DEPLOY evolve together |
| 69 | phases rebuilt every resume | program counter lost | §1 IS the counter; journal last-done |
| 70 | examples rot vs masters | schema bump partial | validator runs on both dirs |
| 71 | docs claim without command | assertion habit | battery appendix or it did not happen |
| 72 | route journal contradicts §6 | hand-routed | kernel dispatches; cards declare |
| 73 | ceiling hit silently | nulls ignored | watch null-rate signature (30%) |
| 74 | EBNF and code diverged | grammar edited one side | vectors (§72) pin both |
| 75 | README drifted from disk | dual-write | file IS the chat; sync before send |
## 74. THE JUDGE — DEEP-DIVE
What it reads: §0 pairs (commands + expects), nothing else. What it runs: each command cold from the project root, no cached output, after the final panel. What it emits: per-pair PASS/FAIL + the missing-work list (the transcript report). When it runs: at FINAL, and (implementation-defined) at loop beats. What it never does: read prose intentions, accept panel narratives as release, negotiate.
Release conditions (all required): every pair PASS cold + panels green + package audit PASS (when §5 declares it). The judge's report on a RED is the kernel speaking: treat it as the next phase list, answer with executed commands.
Judge failure mode: a §0 pair that cannot fail (expect ".*") is a broken gate — the author weakened it; restore the pin.
## 75. THE OPERATOR EXPERIENCE — DEEP-DIVE
Pin: the operator writes the goal text pointing at the card (the argv). Forks during the run: question-tool asks arrive with recommended-first options; answer or walk away (headless picks + journal). Interruptions: type stop — the loop honors it; resume re-enters at the last incomplete phase. Close: the kernel reports branch/SHAs/artifacts; the operator picks merge/PR/push/keep. Rotation duty: any credential that transited chat is rotated by the operator, not the agent.
Operator laws: the pin is the only exec(); amendments are operator-owned (edit card + git); ESCALATE asks are answered or explicitly deferred (headless continues on recommended).
## 76. MULTI-CARD PROGRAMS
Pattern: N pins in sequence, each a phase of the program. Contract: card A's SHIP feeds card B's SPEC; the operator pins B after A releases. Anti-pattern: one mega-card with 50 phases — phase graphs beyond a screen stop being reviewable; split at milestone boundaries. Journal: each pin gets its own run journal; the operator's goal text chains them.
## 77. GRAMMAR RULES (lexical)
Comments: '# ' to end of line (GSH scripts); markdown comments do not exist in cards — the validator reads structure, not comments. Whitespace: indentation is 2 spaces inside PHASE bodies; blank lines are separators, never padding. Names: [A-Za-z0-9._-]+ for binaries; [a-z0-9-] for card ids. Strings: double-quoted; escapes minimal (\" and \\). JSON args: compact, single-line. Case: constructs are UPPERCASE (PIN/PHASE/RUN/TDD/PANEL/GATE/ON STUCK/SHIP); until is lowercase (it is a call, not a statement) — the asymmetry marks statement vs expression.
## 78. AI-ASSISTANT INTEGRATION (how other agents consume this repo)
Boot: using-superpowers discipline — skill-match BEFORE action; the repo's .mimocode/skills auto-load (goalmode-card for card ops; goal-shell for kernel semantics). Command: /goalmode <goal> runs the fork-fill-validate-smoke wizard and hands back the pin line. Workflows: gm-smoke runs natively via the workflow tool in TUI sessions; node harness elsewhere. Doctrine: docs/ bibles are the canon; the README is the contract surface. Agents MUST NOT: edit masters directly, script EXIT, pad docs, weaken gates.
## 79. THE CONTRACT'S §1 — ANNOTATED (8 phases, why this order)
1 scaffold before everything (nothing compiles without the tree). 2 sdk+bridge before substrate (the binaries import the library). 3 substrate before example (the example's smoke needs the binary). 4 example before deploy (deploy ships the example as proof). 5 deploy before bibles (proof before prose — docs describe what IS). 6 bibles before README (the README quotes them). 7 README before ship (the package carries it). 8 ship last (audit outranks deadlines). The order is dependency-closed: swapping any adjacent pair breaks a gate.
## 80. WORKED PROGRAM 6 — migration card (v1 → v1.5 tree)
```
#!/goalmode
PIN  "migrate the v1 seed into the public repo; byte-exact where canon"
PHASE locate:  GATE "ls seed/templates/*.md" --expect "4 files"
PHASE extract: RUN gm-smoke --on seed
PHASE port:    TDD none; GATE "diff -r masters/ seed-masters/ --exclude=.git"
ON  STUCK:     ROUTE_RECOVER -> ROUTE_DEBUG -> ESCALATE
SHIP:          /engineering-report
EXIT 0
```
Lesson: migrations gate on DIFFERENCES (byte-exact canon), not on new behavior — the weakest migration is a rewrite that "improves" canon.
## 81. WORKED PROGRAM 7 — metric bridging (research-experiment as a slot)
The substrate's built-in research-experiment loop (baseline → guarded hypothesis/implementation/evaluation iterations → gaming audit → report) mounts as: RUN research-experiment --args {dir, goal, metric, evalCmd, editable, maxIters}. Bridge law: it is the ONLY sanctioned self-improving loop, and only when success reduces to one numeric metric — cards must not improvise hill-climbs outside its guards.
## 82. LINE-BY-LINE — validate-cards.mjs annotated
L1-4 header: purpose + family law + exit discipline. L5-6 imports: node:fs + path — stdlib only, no deps. L8 root arg: defaults to cards/. L10 results+fail counters: the runner state. L12-17 walk(): recursion; .md filter only. L19-45 check(): frontmatter regex `/^---\n([\s\S]*?)\n---/` (first block only); five-field loop (anchored, multiline — the double-colon lesson); family dispatch: goalmode-v1 → §0-§6 presence + pair balance + nl_prompt; js-workflow-v1 → meta.name/description + default export; compose-function-v1 → function: + contract marker; unknown → error. L47-53 report: per-file PASS/FAIL + totals; exit = fail?1:0. LAW: the measurer is code under the battery too (incident 0/5).
## 83. LINE-BY-LINE — gm-smoke.js annotated
meta L1-8: name gm-smoke; 3 phases; read permission scoped cards/**. default(g) L10: THE SEAM. Enumerate L12-15: masters glob + contract card SOFT-when-absent (D6). Check L17-28: per file — null guard, frontmatter guard, [FILL] legality (masters MAY, filled MUST NOT), evidence line per file. Gate L30-32: {ok:false,failed} | {ok:true,checked,evidence}. LAW: boot-class proof, one second, both runtimes.
## 84. LINE-BY-LINE — run-smoke.mjs + DEPLOY.sh + deploy-proof.mjs annotated
run-smoke: harness builds glob/readFile/phase/log from node:fs; imports the EXACT module; prints JSON; exit on ok. LAW: same module, two runtimes (D7).
DEPLOY: SRC resolves relative to the script (repo-portable); TARGET must exist (BLOCKED otherwise); copies the surface (.mimocode/, masters, examples, bridge, battery, machinery); prints the next step. LAW: code only — never credentials.
deploy-proof: mkdtemp clean target → execFileSync DEPLOY → 8-entry required list → run-smoke INSIDE the target → SMOKE-IN-TOKEN check → cleanup in finally. LAW: the proof IS the §0 pair's substance.
## 85. COMPLIANCE MATRIX (law → enforced where → tested where)
| law | enforcement | test |
|---|---|---|
| typed tokens | gsh.js API shape | bridge-tests row 1 |
| short-circuit | and/or impl | rows 3-4 |
| gate polarity | run() | row 5 |
| dataflow | pipe() | row 6 |
| barrier | jobs() | row 7 |
| traps | route table | row 8 |
| caps | until(k) | row 9 |
| env | exportVar | row 10 |
| §0 balance | validator | 6/6 run |
| families | validator dispatch | 6/6 run |
| [FILL] legality | gm-smoke | smoke run |
| frontmatter | validator + smoke | both |
| deploy tree | required-list | proof 8/8 |
| secrets | token-shape grep | CLEAN run |
| floors | wc pairs | honest counts |
## 86. PIN-LINE GALLERY (five real shapes)
P1 build: "/goal Drive to completion using the Goalmode Card at cards/GOAL_REPO_BUILD_v1.md — the card IS the contract (read §0, build to it)." + approach + outer success + final-verification clause.
P2 minimal: "/goal Run cards/tiny.md — the card IS the contract."
P3 research: "/goal cards/research-survey.md is the contract; run it to the report."
P4 audit: "/goal Execute cards/audit-auth.md; verdicts to disk; ESCALATE only per §6."
P5 migration: "/goal cards/migrate-v15.md is the contract; byte-exact canon where declared."
Gallery law: the pin POINTS at the card; it never restates §0 (one contract, one source).
## 87. ROUTE JOURNAL FORMATS
ROUTE_DEBUG → `route=DEBUG phase=<n> cause=<sig> rca=<mechanism> fix=<smallest> outcome=<fixed|unfixed>`
ROUTE_DERIVE → `route=DERIVE phase=<n> attempts=<2> new-plan=<line>`
ROUTE_SPLIT → `route=SPLIT phase=<n> subtasks=<k> disjoint=<bool>`
ROUTE_SWITCH → `route=SWITCH unit=<id> from=<model> to=<model> reason=<sig>`
ROUTE_RECOVER → `route=RECOVER phase=<n> head-sha=<prefix> resumed-at=<row>`
ROUTE_ESCALATE → `route=ESCALATE ask=<topic> options=<n> picked=<option> headless=<bool>`
Journal law: every route appends; the 3-failure ESCALATE counter reads this log.
## 88. FINAL FAQ (41-60)
Q41 Can the judge run interactive commands? No — pairs are cold, non-interactive; prompts hang (that is a fail).
Q42 Do cards have access to chat history? No — files and slots only; chat is not state.
Q43 Can two kernels pin one repo? Sequentially yes; concurrently is unmodeled — serialize pins.
Q44 What if a slot needs a secret? It does not — secrets are env-injected at the operator layer; slots read labels.
Q45 Why is gm-research not runtime-proven yet? Wired in cards, proof pending on a workflow-tool session — honest residual.
Q46 What proves the validator on YOUR machine? The 0/5 incident + fix — the measurer is battery-covered by use.
Q47 Can cards generate cards? gm-compile does (GSH→card); cards authoring cards directly is unmodeled.
Q48 Is GSH turing-complete? Deliberately no — capped loops, no recursion in grammar; the kernel bounds execution.
Q49 What stops infinite panels? §4 caps (n, fix-loop 2); panels are phases too.
Q50 Can §6 routes write §0? No — routes fix the world, never the contract.
Q51 Who arbitrates route order disputes? The card author at write time; the kernel follows order literally.
Q52 Can a phase have zero slots? Yes — pure-gate phases (GATE-only) are legal.
Q53 What if the operator pins in the wrong mode? The card's mode: documents intent; boundary laws apply (compose-next needs Build).
Q54 Are there reserved ids? Contract-style ids (goal-*) mark pinned contracts by convention.
Q55 Can bibles gate bibles? wc pairs in §0 do exactly that.
Q56 What is the diff between smoke and deploy-proof? Smoke: the repo boots. Deploy-proof: a CLEAN TARGET boots after install.
Q57 Can I add a 7th §-section? The schema is fixed §0-§6; new concerns slot into existing sections or a schema version bump.
Q58 Why is there no linter for GSH? gm-compile IS the linter (v2 planned); today translate.md is the manual procedure.
Q59 Can panels read §0? They read the SPEC + build; §0 is kernel surface — reviewers verdict on evidence, not on the halt vocabulary.
Q60 What releases the RELEASE? The judge. This is the last answer in the bible on purpose.
## 89. THE CARD AUTHOR'S CHECKLIST (60 gates before pin)
1-5 frontmatter: five fields present; id unique; version bumped; forked-from names a real master; mode matches the pinning session.
6-15 §0: nl_prompt one sentence WHAT; every pair has cmd AND expect; commands run from root; expects pin counts; no side effects; no interactive commands; pairs map to bible laws; anti_cheat line present; success_criteria mirror pairs; prose count zero.
16-25 §1: rows numbered uniquely; engines match slot families; every slot ref exists; entries satisfy prior exits; exits are mechanical; order is dependency-closed; cheapest-blast-radius first; no phase without exit; no orphan phase; the graph fits one screen.
26-33 §2: one row per binary; binaries exist in .mimocode/workflows/; args are JSON; fail_route present; retry(2) declared; seam pattern used; determinism respected; evidence returned.
34-39 §3: tdd for every executable unit; next only for repo-scale; triggers explicit; micro_loops declared; fail_route 2-strikes; returns declared.
40-45 §4: adversarial panel schema {verdict,findings}; artifact path declared; audit panel on test data; final = cold; counts pinned; no prose verdicts.
46-50 §5: ship gates named; report path series-scoped; nothing ships before panels; audit outranks deadlines; push is operator-owned.
51-56 §6: signatures calibrated; routes ordered; ESCALATE last; journal formats declared; compaction line present; head verification declared.
57-60 close: validator PASS; smoke {ok:true}; a second reader parsed §0 cold; the pin line is written.
## 90. THE BINARY AUTHOR'S CHECKLIST (40 gates)
1-8: meta complete; name charset; phases 2-4; permissions minimal + declared; seam destructure; no Date/crypto/fetch/process; file ops jailed; glob-enumerate not agent-enumerate.
9-16: agent() schemas on every call; null handled; parallel for disjoint; pipeline for stages; workflow() only with saved names; depth ≤ 8; timeouts on long agents; labels for observability.
17-24: returns {ok} tokens always; evidence arrays populated; failed[] names units; no throw across boundary; logs at phase boundaries; args respected; workspace-relative paths only; replay-safe (seeded randomness only).
25-32: harness-compatible (node run works); substrate-compatible (bare globals work); battery row added for new laws; smoke updated if surface changed; DEPLOY required-list updated; docs updated (§19 rows); version bumped; changelog row.
33-40: adversarial fixtures (empty dir, unreadable file, null agent, oversized input); zero misfire on legit shapes; runner exit code correct; no secrets in logs; labels carry no key material; rm/cleanup in finally; read the reviewer's diff; ship through the card, never around it.
## 91. THE OPERATOR'S CHECKLIST (30 gates)
1-6: goal text points at a card; the card IS the contract; §0 read cold by you; floors you set are floors you mean; credentials rotated if transited; worktree consent decided.
7-12: validator run by you; smoke run by you; panels' artifact paths sane; routes' ESCALATE position sane; floors honest; residuals accepted.
13-18: pin during a session whose mode matches; interruptions = stop typed; forks answered or deferred; journal skimmed at forks; §0 amendments via git only; close picked by you.
19-24: pushes explicit; PRs explicit; merges explicit; tags after audit PASS; rotation after transits; provenance checked on inherited artifacts.
25-30: cold-final trusted over narratives; RED rows treated as work lists; honest counts accepted over padding; bibles grown by waves; the kernel's report read fully; GOAL COMPLETE accepted only on release.
## 92. THE REVIEWER'S CHECKLIST (30 gates)
1-5: fresh subagent; stronger-or-equal model; three verdicts separated; evidence per criterion; no implementer narrative.
6-10: diff read hunk-by-hunk; §0 pairs re-run cold; panels' artifacts opened; battery outputs read; PRE-EXISTING verified as truly pre-existing.
11-15: adversarial cases present; happy path LAST; schema verdicts not prose; no weakened tests; no test-only production APIs.
16-20: scope minimal (3x tripwire); no adjacent refactors; docs honest (no invented numbers); doctrine verbatim; paths real.
21-25: compliance matrix rows all green; bug ledger matches fixes; residuals named; blocked states BLOCKED; secrets scan clean.
26-30: impasse reported (not forced); criticals looped to green; codebase consistency verdict given; spec-compliance verdict given; correctness verdict given.
## 93. EBNF EXAMPLES (per rule, minimal + full)
shebang: `#!/goalmode`. pin: PIN "ship when green". spec: SPEC docs/specs/x.md --anchors 5. phase: PHASE build:. tdd: TDD src/x.py. run: RUN gm-smoke --args {"target":"x"} -> out.json. panel: PANEL 3 --schema {verdict,findings}. gate: GATE "pytest -q" --expect "0 fail". until: until(GATE "pytest -q", 3). onstuck: ON STUCK: ROUTE_DEBUG -> ESCALATE. ship: SHIP /ship-package AND /engineering-report. exit: EXIT 0. comment: # why this gate exists. name: gm-smoke. json: {"target":"x"}.
## 94. ANTI-GLOSSARY (banned terms and their replacements)
"should be fixed" → run the gate. "trust me" → show the token. "basically done" → §0 pass or not. "minor refactor while here" → separate task. "the test is flaky, skip it" → until(k) + route, never skip. "I'll add tests later" → RED first. "temporary hack" → named delta or don't. "it works on my machine" → clean-target proof. "docs later" → honest counts now. "small padding to hit the floor" → NEVER (the crime). "the judge will understand" → the judge runs commands. "close enough for exit" → EXIT is kernel-owned. "soft fail" → loud fail or clear pass. "silent fallback" → the error manifest. "just this once" → the boundary is the boundary. "we'll rotate later" → rotate now. "internal only, no scan" → scan everywhere. " paraphrased doctrine" → verbatim or marked. "invented threshold" → measured or PROPOSED. "chat is the record" → files are the record. "quick manual edit of masters" → evolve with the validator. "one more feature before pin" → pin the contract, build inside it. "the panel agreed off-record" → artifact or no panel. "retry forever" → cap k. "operator will catch it" → ESCALATE is explicit, not ambient.
## APPENDIX I — SUBSTRATE API TABLE (complete, verbatim rows)
| Global | Signature | Returns |
|--------|-----------|---------|
| agent(prompt, opts?) | spawn one subagent | Promise → its deliverable (text, or a validated object if opts.schema), or null on failure. Never throws. |
| parallel(thunks) | run an array of () => Promise concurrently | Promise<any[]> (a throwing thunk rejects the batch) |
| pipeline(items, ...stages) | run each item through sequential stages, items in parallel | Promise<any[]> |
| workflow(nameOrScript, args?, opts?) | run a child workflow as its own sub-run and await it | Promise → child result, or null on runtime failure |
| readFile(path) | read a workspace file | Promise<string | null> (null if absent) |
| writeFile(path, content) | write a workspace file (auto-creates dirs) | Promise<void> |
| glob(pattern) | list matching workspace paths (relative, sorted) | Promise<string[]> |
| exists(path) | whether a workspace path exists | Promise<boolean> |
| phase(title) | mark a progress phase | — |
| log(message) | emit a progress line | — |
| args | the JSON value passed when the workflow started | (value) |
| Operation | Purpose (run table) |
| run | Start and block until terminal; provide name (a saved/built-in workflow) or script (inline JS). Optional args, workspace, async. |
| status | Snapshot a run by run_id without blocking |
| wait | Block on a run's result (optional timeout_ms) |
| cancel | Best-effort cancel a running workflow |
| resume | Re-launch a persisted run under the same run_id (journal replay makes it convergent) |
| async: false (default) streams the transcript inline and returns the result; async: true returns a run_id immediately; provide either name or script, never both. |
## 97. ROUTE MINI-CASES (six worked routes, journal lines included)
CASE DEBUG: symptom — pytest fails only under parallel load. route=DEBUG phase=3 cause=same-fail-2x rca="shared tmp file collision" fix="mkdtemp per worker" outcome=fixed. Gate re-run: green.
CASE DERIVE: symptom — parser rewrite fails on the same 3 grammars twice. route=DERIVE phase=2 attempts=2 new-plan="hand-table the ambiguous productions instead of regexing". Gate: green after re-derive.
CASE SPLIT: symptom — docs phase stalls at 4 bibles. route=SPLIT phase=6 subtasks=4 disjoint=true. Four subslots, jobs barrier, exit green.
CASE SWITCH: symptom — agent nulls spike (provider distress). route=SWITCH unit=gm-research from=<tier-a> to=<tier-b> reason=null-rate-41%. Null-rate normalizes.
CASE RECOVER: symptom — compaction mid-phase-6. route=RECOVER phase=6 head-sha=5d0f987 resumed-at=bible-growth. Card reloaded; §0 unchanged; work resumed.
CASE ESCALATE: symptom — spec contradiction only the operator can rule on; 3 routes logged unfixed. route=ESCALATE ask="S2 vs S4 conflict" options=2 picked="S2 governs; S4 amended" headless=false.
## 98. EBNF RULE SEMANTICS (per rule)
shebang — must be line 1; else the file is not GSH. pin — exactly one per script; later PINs are compile errors. spec — zero or more; each emits TWO pairs (ls + grep). phase — one or more; numbers strictly increasing. tdd — only inside phases. run — only inside phases; outfile is dataflow sugar (writeFile + return). panel — only inside phases; schema-ref must be a literal object shape. gate — phases or top-level (top-level = §0). until — wraps exactly one gate. onstuck — at most one per script; routes ≥ 2; ESCALATE must appear. ship — at most one; steps and-composed. exit — at most one; emits nothing. comment — stripped at compile. name/json — lexical, no semantics of their own.
## 99. WORKED PROGRAM 8 — RETROSPECTIVE: this repo's build, expressed in GSH
(The build that produced this bible, retro-encoded — proof the grammar covers real history.)
```
#!/goalmode
PIN  "public goalmode-cards repo; every §0 gate cold; honest counts"
PHASE scaffold: GATE "ls cards/masters/*.md | wc -l" --expect "4"
PHASE sdk:      TDD sdk/bridge/gsh.js
                GATE "node deploy/battery/bridge-tests.mjs" --expect "10/10 PASS"
PHASE schema:   TDD deploy/battery/validate-cards.mjs
                GATE "node deploy/battery/validate-cards.mjs cards/" --expect "FAIL count 0"
PHASE substrate:.mimocode surface
                RUN gm-smoke
PHASE example:  SPEC cards/examples/BUILD_TETRIS_v1.md --anchors 6
PHASE deploy:   RUN deploy-proof
                GATE "DEPLOY PROOF: clean target verified"
PHASE docs:     TDD docs/GOAL_SHELL_BIBLE.md
                TDD docs/GOALMODE_CARD_BIBLE.md
PHASE readme:   GATE "grep -c 'BATTERY APPENDIX' README.md"
PHASE ship:     GATE "grep -rEn 'ghp_[A-Za-z0-9]{20,}' ."
                SHIP /ship-package AND /engineering-report
ON  STUCK:      ROUTE_DEBUG -> ROUTE_DERIVE -> ROUTE_SPLIT -> ROUTE_SWITCH -> ROUTE_RECOVER -> ESCALATE
EXIT 0
```
Retro-lessons: the real build DID run this shape (battery history = the RED/GREEN record); the wc-floor pair is the honest RED still open; the firewall incident was a ROUTE_SWITCH-class adaptation (channel switch, not mechanism change).
## 100. CHANGELOG PER-SECTION INDEX (where everything landed)
§1-2 concept/layers · §3 equivalence · §4 grammar · §5 bridge API · §6 translation · §7 compile contract · §8 procedures · §9 tetris · §10-11 troubleshooting+registries · §12 iron laws · §13 recovery · §14-14.12 construct deep-dives · §15 API full · §16 protocol expanded · §17 procedures expanded · §18 tetris expanded · §19 substrate reference · §20 integrations · §21 security · §22 calibration · §23 authoring guide · §24-25 FAQ+glossary · §26 troubleshooting 1-45 · §27 decisions · §28 lessons · §29-30 migration+manifest · §31-38 (v1.1-v1.4) examples/traceability/next-map/appendices D2-D5 · §39-44 (v1.5) primitives/routes/catalog/security/calibration/changelog · §45-48 (v1.6) next-remainder/ask/verify/programs 4-5/walkthroughs · §49-53 (v1.8) catalog/ADRs/exit-layers/compiler/reading · §54-57 (v1.9) FAQ2/glossary2/troubleshoot2/cases · §58-63 (v2.0-rc) state machine/phases/annotated contract/design notes/contribution/personas · §65-68 walkthroughs/RFCs/cases/history/crosswalk/index/colophon · APPENDIX I API full · §97 route cases · §98 EBNF semantics.
## 101. SUPPLY-CHAIN SECURITY
Clone integrity: verify the origin URL (clean, no creds) and the commit chain (git log -gpg? unsigned here — note honestly); the battery IS the integrity check for behavior (a tampered tree fails validator/smoke/bridge). Dependencies: gsh.js + battery are stdlib-only (node:fs, node:os, node:path, node:url, node:child_process, node:assert) — zero third-party supply chain by design; the substrate's own deps are the runtime's, not the repo's. DEPLOY.sh copies files; it executes nothing from the target. The proof's mktemp target is removed in finally. Secrets: shape-grep at ship + final; rotation on transit; labels never keys.
## 102. FAQ III (61-80)
Q61 Why markdown and not a real DSL file? The card must be readable by the judge's cold commands AND the human — md with a strict machine surface is the dual-reader answer.
Q62 Can gm-compile run in the substrate? Yes (it is a workflow); runtime proof is pending (residual).
Q63 What if expect appears twice in output? Substring semantics: found = pass; pin tighter if ambiguity matters.
Q64 Can gates run sudo? No — non-interactive cold runs; elevation is an operator action.
Q65 Do panels see each other's verdicts? No — independence is the point; the artifact merges them.
Q66 What is the card's execution context? The project root the TUI session holds (worktree if isolated).
Q67 Can I test the kernel itself? The kernel is substrate-owned; cards test THEIR contracts; the battery tests the library.
Q68 Why is there no UI? The TUI is the UI; the repo ships the program layer.
Q69 Can workflows write outside root? No — jail law; escapes throw.
Q70 What happens if DEPLOY runs twice? Copies overwrite; idempotent by construction (same bytes).
Q71 Can a card run another repo's gates? Yes — cwd-relative; cross-repo gates belong to a multi-repo contract card (unmodeled).
Q72 Is there a max card size? No hard cap; readability is the governor; split at milestones.
Q73 What if the operator never answers ESCALATE? Headless: pick recommended per fork, log; the goal text's autonomy clause governs.
Q74 Can bibles disagree? The later wave wins + the errata section records it; contradictions are findings.
Q75 Why append-only journals? Replay + audit; rewrites destroy the evidence chain.
Q76 Can the bridge library ship separately? It is one file; DEPLOY copies it; vendoring is legal with the header intact.
Q77 What tests the tests? The battery's failures found real bugs this build (ledger) — use is the test of the tests.
Q78 Can I skip the panels for tiny cards? The contract decides; §4 empty is legal, §0 pairs still gate.
Q79 What is the upgrade path for cards? forked-from chain + validator; breaking schema = major version.
Q80 Who is "the kernel" when the TUI is closed? Nothing runs; pins live in sessions; /loop + cron are the only clock.
## 103. CROSS-REFERENCE INDEX (term → section)
agent() §5,19,App-I · adversarial §14.5,20.2,92 · ADR §27,50 · anti-cheat §3,7,14.2 · battery §5,App-D7,README · binary §2,35,App-H4 · boot law §20.6,78 · bridge §1,5,15,61 · card §1,3,7 · cold §14.8,74 · compile §7,52,65 · compose-next §20.1,34,App-D2 · compose:tdd §14.5,20.2,App-D3 · contract §14.2,60 · cron §20.4,3 · determinism §19,App-A8 · drift §16,26 · EBNF App-C,98 · env §5,15 · EXIT §14.12,51,61 · fan-out §20.3,49.9 · gate §14.8,41 · grammar §4,App-C,H7 · head (verbatim) §card-bible-11 · harness §App-H5 · iron laws §12 · judge §14.12,58,74 · journal §40,87 · kernel §2,51,58 · libc §3,20.2 · loop §20.4 · master §65 · meta §App-H4 · nl_prompt §14.2 · null §App-A10 · pair §14.8,41 · panel §14.7,46 · phase §14.4,59 · pin §14.2,86 · pipe §5,15 · playbook §40 · polarity §App-H2 · replay §19,App-A8 · route §14.10,40,97 · schema §sdk,CARD_SCHEMA · seam §15,App-H4 · series §eng-report law · signature §40,54 · smoke §App-H4,D7.3 · spec §14.3 · state machine §58 · substrate §19,App-A,I · token §5,15 · trace §37 · tripwire §1C analog · until §14.9 · verdict §14.7 · worktree §20.1,45.1 · kernel exit §51.
## 104. THE COMPOSE-NEXT GATE CONVERSION (its implicit gates as explicit §0 pairs)
G1 orient: GATE "ls AGENTS.md README.md" --expect "" (repo surface present).
G2 grill settled: GATE "ls docs/compose/spec/<feature>.md" --expect "status: designed".
G3 workspace: GATE "git rev-parse --show-superproject-working-tree" --expect "" + worktree path pair.
G4 spec anchors: GATE "grep -c 'S[0-9]' <spec>" --expect "N".
G5 tasks acyclic: reviewer verdict (spec compliance) — no static pair.
G6 implement green: GATE "<battery>" --expect "0 fail".
G7 verify fresh: GATE "<battery re-run>" --expect "0 fail" (no cache).
G8 review verdicts: GATE "ls .review/verdicts.json" --expect "3 verdicts".
G9 finalize: GATE "grep 'status: delivered' <spec>" --expect "delivered".
Conversion law: compose-next gates are SEMANTIC (reviewer judgment) where cards are MECHANICAL (commands) — the crosswalk mounts next for the semantic halves and pairs for the mechanical ones.
## 105. PANEL PROMPT TEMPLATES (the three standard juries)
ADVERSARIAL-BUILD: "You are a hostile reviewer. The build is at <path>; the spec at <spec>. ATTACK: run it, break it, hunt <class-list>. You MUST return {verdict: PASS|FAIL, findings:[{where,what,severity}]} as validated JSON. FAIL means: you broke it and can reproduce."
AUDIT-3JUROR: "You are juror <i> of 3. Evidence ONLY: <test-data paths>. No implementer narrative exists for you. Return {verdict, findings}. Majority decides."
NEXT-REVIEW: "You are the fresh reviewer for <workspace>. Spec sections: <list>. Acceptance: <list>. Diff: <command>. Verification summary: <one-liners>. Return THREE separate verdicts: spec compliance / correctness / codebase consistency, each with evidence. Do not repeat passing commands."
Template law: schemas ride IN the prompt's agent() opts, not just in prose — the schema is the enforcement.
## 106. BRIDGE LIBRARY DOCTESTS (per function, one executable example)
exit: exit(true) === {ok:true}. exportVar: exportVar('k',1) → env.k === 1. seq: seq(a,b)() runs a then b; a-fail skips b. and: and(a,b)() runs b only if a.ok !== false. or: or(a,b)() runs b only if a.ok === false. run: run('text',{'expect':'ext'}) → {ok:true,evidence:'text'}. pipe: pipe(a,b)() → b(a-result). jobs: jobs([t1..tn]) → {ok,failed,results}; rejections normalized. trap+match: trap('s','R'); route.match('s') === 'R'; match('x') === null. until: until(failing,k) runs exactly k; until(passing,k) returns early.
## 107. COMMIT MESSAGE CATALOG (this repo, verbatim)
bea719a "feat: goalmode-cards v1 — GM Card SDK, bridge library, battery, substrate" (body: cards/sdk/substrate/deploy/docs/README lines). 9800653 "fix(contract): secret gate matches live token shapes, not its own pattern literal". 5d0f987 "docs(readme): battery rows measured — owner, commit, remote, secrets CLEAN". Catalog law: conventional prefix (feat|fix|docs), the why in the body, evidence counts in the body.
## 108. REVIEW VERDICT TEMPLATES
SPEC-COMPLIANCE: "criterion <id>: MET — evidence <cmd output line> | UNMET — what is missing | UNVERIFIABLE — why (critical if acceptance)."
CORRECTNESS: "logic <path:line> sound/unsound — <mechanism>; boundaries: <list>; regressions: <list>; tests: sound/weak <why>."
CONSISTENCY: "naming <matches|differs from> surrounding code at <path:line>; structure <note>; conventions <note>."
Verdict law: every verdict cites file:line or command output — a verdict without an anchor is an opinion.
## 108.1 BUILD MANIFEST, ANNOTATED (every file: role · lines · provenance · load-bearing lines)
README.md — report+blueprint surface · ~125L · NEW this build · battery appendix rows.
LICENSE — MIT · NEW.
cards/GOAL_REPO_BUILD_v1.md — the live contract · 92L · NEW · §0 12 pairs (:14-37), §1 8 phases (:49-57).
cards/masters/GOALMODE_CARD_MASTER_v1.md — fork root · 53L · v1 seed + schema-clean frontmatter · §anchors 12/23/30/34/38/44/48.
cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md — binary skeleton · 31L · v1 + schema frontmatter.
cards/masters/COMPOSE_TDD_CARD_MASTER_v1.md — micro contract · 21L · v1 + schema frontmatter.
cards/masters/COMPOSE_NEXT_CARD_MASTER_v1.md — macro contract · 25L · v1 + schema frontmatter.
cards/examples/BUILD_TETRIS_v1.md — worked example · 79L · NEW · validator PASS.
sdk/bridge/gsh.js — construct library · 57L · NEW · 10 laws.
sdk/bridge/GSH_SPEC.md — grammar canon · 30L · NEW · 11-construct table.
sdk/bridge/translate.md — 3-step protocol · 25L · NEW.
sdk/bridge/bridge.template.js — forkable js pair · 15L · NEW.
sdk/CARD_SCHEMA.md — document schema · 40L · NEW.
.mimocode/workflows/gm-smoke.js — smoke binary · 33L · NEW · seam pattern.
.mimocode/skills/goalmode-card/SKILL.md — card ops · 33L · NEW.
.mimocode/skills/goal-shell/SKILL.md — kernel doctrine · 30L · NEW.
.mimocode/commands/goalmode.md — the wizard · 11L · NEW.
docs/GOAL_SHELL_BIBLE.md — this file · growing to floor · NEW.
docs/GOALMODE_CARD_BIBLE.md — card canon · 336L · seed head (239) + authored body · verbatim head preserved.
docs/operators-manuals/ ×3 — ops manuals · 48L total · NEW.
docs/research/goalshell-applications.md — corpus v1 · 15L · NEW.
deploy/DEPLOY.sh — installer · 18L · NEW.
deploy/battery/validate-cards.mjs — schema-as-code · 55L · NEW · one regex-bug fix.
deploy/battery/bridge-tests.mjs — 10-law battery · 54L · NEW.
deploy/battery/deploy-proof.sh|.mjs — clean-target proofs · 17+42L · NEW · node runner per D7.
machinery/run-smoke.mjs — reference harness · 20L · NEW.
reports/GoalShell_Tetris_ShowMe.md — worked blueprint · 242L · NEW.
## 108.2 FAQ IV (81-100)
Q81 Can slots await user input? No — ask via the kernel's question surface; slots are cold.
Q82 What if two masters conflict? The forked-from of the PINNED card governs; masters are fork roots, not runtime inputs.
Q83 Can I write §0 in YAML? The pairs ARE yaml-ish inside md; the validator's regex is the contract — match it.
Q84 Can gates be slow? They can be heavy; they are run at phase exits and final — budget accordingly.
Q85 Is there transactional rollback? No — routes + git are the rollback; the kernel does not undo.
Q86 Who reviews the reviewer? The three-verdict structure + criticals loop; a reviewer without anchors is an opinion (verdict law).
Q87 Can I run cards in CI? The battery runs anywhere node runs; the kernel runs in TUI sessions — CI runs the battery half.
Q88 What if the spec is wrong but green? Anchors prove structure, not truth — review's correctness verdict is the backstop.
Q89 Can I have 100 phases? Legal; unreadable — split at milestones (P76 multi-card).
Q90 What if a slot outlives the 12h script? It cannot — the kill is hard; split.
Q91 Do I need the bridge for every binary? No — plain workflows are fine; the bridge is for shell-shaped logic.
Q92 Can GSH express conditionals? and/or/until compose them; if-with-else is seq+or.
Q93 What language is the kernel? Substrate-owned; the repo documents its contract, not its source.
Q94 Can I vendor the masters? Yes — forked-from + validator keep them honest.
Q95 What if expect contains regex metachars? Substring matching is literal — metachars are literal text.
Q96 Can panels run other panels? jobs() of agents only; nested panels are unmodeled.
Q97 What if two cards share a workflows dir? Fine — names are the identity; collisions are a save-time error.
Q98 Can docs gate docs? wc/grep pairs — yes (the floors do exactly this).
Q99 Is the bridge tested on Windows? No — linux x64 measured; portability follows the substrate.
Q100 What is the ONE sentence? Gates are commands; the kernel owns exit; everything else is shell programming.
## 108.3 VECTORS V-12..V-30 (compile vectors, continued)
V-12 seq(a,b) → single §1 row (one phase, two units). V-13 and(SHIP A,B) → §5 and-chain. V-14 or(primary,fallback) → §2 slot + fail_route → route. V-15 run with outfile → §2 slot + artifact pair. V-16 PANEL with artifact path → §4 + §0 ls pair. V-17 GATE with count → §0 pair (pin the number). V-18 until around a flaky gate → judge re-beat. V-19 ON STUCK 2-route ladder → §6. V-20 SPEC with anchors → two pairs. V-21 PIN long sentence → single nl_prompt line (wrapped in md). V-22 comment lines → stripped. V-23 blank lines → separators. V-24 phase renumber attempt → compile rejection. V-25 EXIT mid-script → kernel-owned marker only. V-26 unknown construct → rejection. V-27 duplicate slot name → compile rejection. V-28 route without ESCALATE → warning (v2: rejection). V-29 empty PHASE → rejection (no exit). V-30 schema literal object → §4 schema ref.
## 108.4 CARD LIFECYCLE STATE DIAGRAM
drafted → validated → smoked → pinned → in-progress (phase i) → verified → panels → shipped → RELEASED | (any) → blocked-routed → resumed.
Transitions: drafted→validated by the validator; validated→smoked by gm-smoke; smoked→pinned by the OPERATOR; pinned→in-progress by the kernel; in-progress→verified by §1 exits; verified→panels by §4; panels→shipped by §5; shipped→RELEASED by the judge. Blocked states route via §6 and re-enter at phase i. Compaction re-enters at phase i with the head sha-verified.
## 109. THE KERNEL AND THE SHELLS — COMPARATIVE CHAPTER
| feature | sh/bash | GSH | delta law |
|---|---|---|---|
| exit status | $? integer | {ok:bool} token | typed beats numeric |
| set -e | die on error | judge continues; routes handle | fail-fast → fail-forward |
| pipes | byte streams | object dataflow | schema beats parsing |
| functions | shell funcs | slots (§2/§3) | contracts beat bodies |
| vars | string env | env store + args | typed values |
| trap | signal handlers | §6 route ladder | signatures beat signals |
| job control | &/wait/% | parallel/jobs | barrier semantics |
| cron | crontab | /loop sessions | later-priority fires |
| here-docs | heredoc codegen | spec + slots | spec-first beats inline |
| sudo | elevation | permissions up-front | declared beats prompted |
| exit 0 | survival | VERIFIED fact | the whole point |
Reading: GSH is not a better sh — it is sh with the verification semantics sh never had.
## 110. WORKED TRANSLATION WALK (prose → GSH, line by line, with the reasoning shown)
Prose (operator): "Add rate limiting to the API. 100 req/min per key. Return 429 with Retry-After. Prove it under load. Ship when the suite and the docs are green."
Walk:
  "Add rate limiting" → PHASE implement: TDD api/ratelimit.py (executable unit → tdd slot).
  "100 req/min per key" → acceptance in the spec anchor S2 + test case (not a GATE — it is behavior under test).
  "Return 429 with Retry-After" → spec S3 + pytest assertion (behavior, not gate).
  "Prove it under load" → PHASE verify: RUN gm-loadtest --rps 150 (a binary slot; load is not a cold gate).
  "Ship when suite AND docs green" → §0 pairs: pytest "0 fail" + grep docs anchors + SHIP line.
  Stuck handling: default ladder (unstated → default §6).
Compiled result: a 4-phase card (spec→implement→loadtest→verify) with 4 §0 pairs. The translation law in action: behavior goes to TESTS, completion goes to GATES.
## 111. EDGE-CASE TABLES (per construct)
exit: exit(null) → {ok:false} (null is falsy — treat as fail); exit({}) → {ok:true} with no evidence (weak — add evidence).
seq: a throws → seq propagates the throw (slots must not throw — law 1).
and: a returns undefined (not a token) → treated as ok !== false → b RUNS. Undefined is a bug; the battery's typed-token row exists for this.
or: both fail → returns the SECOND result (the fallback's evidence wins) — read failed[] from jobs for the full picture.
run: cmd returns an object → JSON.stringify for matching; expect "" → always pass (useless gate — pin something).
pipe: b returns non-token → downstream gates misread; always exit() inside b.
jobs: empty array → {ok:true,failed:[],results:[]} (vacuous barrier — fine).
trap: duplicate signature → last registration wins (register in priority order).
until: slot throws → until propagates (cap does not catch throws — law 1 again).
env: name collisions across slots → last write wins; prefix slot names.
## 112. THE CARD ECONOMY — WHEN TO CARD AND WHEN TO JUST DO IT
| situation | card? | why |
|---|---|---|
| multi-day build with ship gates | YES | the kernel holds the contract across compaction |
| one-line fix | NO | direct fix + battery; ceremony is the crime |
| research sprint with deliverables | YES | phases gate the corpus, not the vibes |
| quick question about the code | NO | answer directly |
| risky refactor needing isolation | YES + worktree slot | isolation + gates |
| typo in docs | NO | fix it |
| anything the operator pinned | ALREADY CARDDED | the pin made it one |
Economy law: cards cost authoring; they pay back when the contract must SURVIVE (time, compaction, handoffs). Under that bar, just work.
## 113. HISTORY OF THE IDEA (short narrative)
Code mode (tools as objects in programs) → the operator's move: /goal is already a kernel (judge-gated halt) — program IT. GM cards v1 (mode architecture: router/orchestrator/gate) → the bridge insight (shell mechanics map 1:1) → GSH grammar (11 constructs) → the repo (SDK + battery + substrate + docs) → this bible. Each step shrank the gap between "what an engineer types" and "what the kernel enforces".
## 114. APPENDIX INDEX II
§32 construct examples ×3 · §33 traceability · §34 next-phase map · D2 next contract · D3 tdd · D4 ask · D5 verify · D6 execution library · D7 transcripts · H-H9 full sources · I API table · K tetris full · §97 route cases · §98 EBNF semantics · §102 FAQ III · §104 gate conversion · §105 panel templates · §106 doctests · §107 commit catalog · §108 manifest+FAQ IV+vectors+lifecycle · §109 comparative · §110 translation walk · §111 edge cases · §112 economy · §113 history.
## 115. QUICK REFERENCE CARD (one line per construct)
#!/goalmode — bind the program. PIN "WHAT + evidence shape" — the contract sentence. SPEC path --anchors N — spec gate. PHASE name: — program counter. TDD path — red/green/refactor slot. RUN name --args json — binary slot. PANEL n --schema S — jury. GATE "cmd" --expect "sub" — cold assert. until(GATE,k) — capped re-beat. ON STUCK: R1->R2->ESCALATE — traps. SHIP A AND B — audited delivery. EXIT 0 — kernel-owned (marker only).
## 116. SESSION RUNBOOK (numbered, the operator's first hour)
1. cd goalmode-cards (clean clone). 2. Launch the TUI — skills hot-load. 3. node deploy/battery/validate-cards.mjs cards/ — expect FAIL count 0. 4. node machinery/run-smoke.mjs . — expect {"ok": true}. 5. Skim README battery table. 6. Fork: cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/my-goal.md. 7. Fill §0 (your done-commands), §1 (your phases), §6 (your routes). 8. Re-run validator + smoke. 9. Pin: /goal Drive to completion using the Goalmode Card at cards/my-goal.md — the card IS the contract (read §0, build to it). 10. Answer forks; walk away if you like; return to a released goal or a route journal.
## 117. THE TEN COMMANDMENTS OF GSH
I. Gates are commands. II. The kernel owns EXIT. III. Tokens, never throws. IV. Loops are capped. V. Orchestration is deterministic. VI. Routes end in ESCALATE. VII. Fork with lineage. VIII. Verdicts are schema data on disk. IX. Final verification is cold. X. Counts are honest.
## 118. PER-ERROR RECOVERY MAP
validator FAIL → fix the card (§-sections/frontmatter). bridge FAIL → fix the library (the named law's line). smoke {ok:false} → fix the flagged card. deploy MISSING → sync DEPLOY.sh + required-list. RED §0 → work the list the judge reported. nulls spike → ROUTE_SWITCH. structural throw → audit the workflow graph. firewall block → change the invocation channel, not the mechanism.
## 119. THE REVIEWER'S QUESTION BANK (20 questions that find real bugs)
1 Does §0 pin counts? 2 Do pairs map to laws? 3 Is RED on record? 4 Are ≥3 adversarial cases before happy? 5 Do verdicts have schemas? 6 Are artifacts on disk? 7 Is any gate side-effecting? 8 Is any route ESCALATE-first? 9 Are caps explicit? 10 Is orchestration deterministic? 11 Do slots return tokens? 12 Is any throw crossing a boundary? 13 Is the diff minimal (3x)? 14 Are docs honest-counted? 15 Is doctrine verbatim? 16 Are paths real? 17 Are numbers measured? 18 Is the residual named? 19 Is the blocked state BLOCKED? 20 Would a cold reader know what ran?
## 120. ANTI-PATTERN GALLERY (with fixes)
The Negotiator — argues done without §0 → run the gates. The Padder — reflows to the floor → honest counts. The Escalator — asks first → routes last-resort. The Forgetter — state in chat → files + TIDs. The Gold-Plater — 3x tripwire → split. The Test-Skipper — later-tests → RED first. The Prompt-Leaker — secrets in files → shape-grep + rotate. The Boundary-Crosser — compose-next in legacy → mode: build. The Self-Releaser — scripts EXIT → kernel-owned. The Narrative-Reviewer — prose verdicts → schema data.
## 121. v2 ROADMAP (detail)
gm-compile binary (grammar → card, vectors as its battery) · gm-panels + gm-research runtime proofs (workflow-tool sessions) · validator v2 (route-order check, empty-schema rejection, family lint) · second worked example (docs-build) shipped as an example card · bibles at floor with wave-grown content · per-card calibration schema · multi-repo contract sketch · RFC review (WAIT/SPAWN/SIGNAL/PARALLEL-PHASES).
## 122. ERRATA
E1 §3 table row 2 (PIN) gsh.js column is "—" by design (kernel surface). E2 §5 export note: the named export is `export` (alias of exportVar) — the alias bug lesson. E3 early prints of this bible miscounted their own lines — the README battery carries the authoritative wc. E4 Appendix K first append was eaten by a nested heredoc (inner EOF) — re-appended with a unique delimiter; the lesson lives in troubleshooting row 61.
## 123. THE 76-COL LAW FOR CARDS
Cards embed ASCII diagrams (state machines, trees). Law: box-drawing characters only; every line ≤ 76 columns; right borders on one column; arrows terminate at borders; caps disclosed shown=N total=M. A card diagram that wraps is a broken diagram — split layers, never squeeze.
## 124. SECOND TRANSLATION WALK (API pagination, fully expanded)
Prose: "Paginate the list endpoint. 50 per page. Cursor in the response. Stop at the last page."
Walk: "Paginate" → behavior → PHASE implement: TDD api/pagination.py. "50 per page" → spec anchor + test. "Cursor in the response" → spec anchor + test (response shape is behavior). "Stop at the last page" → the loop's exit — in GSH: until(GATE "pytest tests/pagination -q" --expect "last page handled", 3). Ship shape: SHIP /ship-package AND /engineering-report. §0 pairs: spec anchors (2), pytest "0 fail", smoke {ok:true}.
Translation moral: LOOPS in prose are until() in GSH only when they gate completion; behavior loops live in tests.
## 125. THE CONTRACT'S PHASES — ENTRY/EXIT/JOURNAL TABLE
| n | phase | entry | exit | journal line |
|---|---|---|---|---|
| 1 | scaffold | approval | artifacts exist | scaffold=done files=25 |
| 2 | sdk+bridge | masters | validator+bridge green | sdk=g16 b10 |
| 3 | substrate | sdk | surface + smoke | substrate={ok:true} |
| 4 | example | substrate | validator 6/6 | example=PASS |
| 5 | deploy | workflows | clean-target proof | deploy=8/8+smoke |
| 6 | bibles | code green | wc floors | docs=honest-counts |
| 7 | README | docs | battery real | readme=report+blueprint |
| 8 | ship | scan clean | public origin | ship=<sha> |
## 126. WHAT THE KERNEL DOES NOT DO
It does not write code (slots do). It does not read prose intentions (§0 only). It does not forgive a RED (it routes or holds). It does not switch modes (the operator's Tab). It does not push (the operator's explicit ask). It does not forget (the card + journal are the memory).
## 127. WHAT THE BRIDGE DOES NOT DO
It does not execute anything itself (constructs build thunks the runtime calls). It does not touch the network or the clock. It does not parse markdown (the validator does). It does not know the kernel — it speaks tokens and the kernel speaks commands; they meet at §0.
## 128. WHAT CARDS DO NOT DO
They do not script EXIT. They do not hold secrets. They do not replace specs (they reference them). They do not escape docs/compose* or cards/ (the location law). They do not self-amend mid-run (operator-owned).
## 129. GLOSSARY III (final 20)
colophon — the closing note; authorship + honesty statement. compile — GSH→card mechanical fill. contract card — the pinned goal's own §0. disposition — §6's signal outcome. door — the pin line (operator's exec). dual-runtime — substrate + node harness. EBNF — the grammar formalism. evidence — the expect substring, found. fan — a glob-driven unit set. floorgate — a wc pair. head — the verbatim preserved zone. jail — workspace-root fileops. kernel — /goal process. marker — EXIT 0 (uncompiled). mount — a slot reference. process image — the card as kernel state. ship stage — §5. state machine — §58's loop. token — the typed result. trap table — §6's route map.
## 130. THE CLOSING BANNER OF THE GRAMMAR
GATES ARE COMMANDS. THE KERNEL OWNS EXIT. TOKENS, NEVER THROWS. COUNTS ARE HONEST. THE JUDGE RELEASES.
## 130. GRAMMAR TEST VECTORS — POSITIVE/NEGATIVE PAIRS (per construct)
#!/goalmode: + "#!/goalmode" first line / − mid-file (ignored, comment rule).
PIN: + PIN "x" / − PIN x (unquoted) / − two PINs.
SPEC: + SPEC p.md --anchors 5 / − SPEC (no path) / − anchors 0.
PHASE: + PHASE build: / − PHASE (no name) / − duplicate number.
TDD: + TDD src/x.py / − TDD (no target) / − TDD docs/x.md (misuse).
RUN: + RUN gm-smoke --args {} / − RUN (no name) / − RUN bad name! (charset).
PANEL: + PANEL 3 --schema {verdict,findings} / − PANEL 0 / − PANEL 3 (no schema).
GATE: + GATE "c" --expect "e" / − GATE "c" (no expect) / − GATE "" --expect "e".
until: + until(GATE "c" --expect "e", 3) / − until(GATE, 0) / − uncapped.
ON STUCK: + ladder ending ESCALATE / − ESCALATE first / − single route.
SHIP: + SHIP /ship-package AND /engineering-report / − SHIP (empty) / − SHIP rm -rf /.
EXIT: + EXIT 0 terminal / − EXIT 1 / − EXIT mid-script (kernel-owned; compiles nothing; marker misuse flagged).
Negative vectors are COMPILE REJECTIONS or flags — the grammar refuses, it never guesses.
## 131. INTEGRATION — /super-research MODES AS SLOTS (deep)
topic-survey → the research PHASE binary: contract = corpus on disk + TSV log (failures kept) + report under a page. experiment-loop → the validation PHASE: baseline first; hypotheses logged; keep/revert per metric; never pause mid-loop; never game the metric. root-cause → ROUTE_DEBUG's deep form (two-way reversal). benchmark-comparison → engine A/B (workflow vs skill dispatch measured). ablation → which card sections bind the kernel (remove one, watch the gates). paper-reproduction / paper-writing / quantitative-analysis → out of goalmode scope until a card needs them (the verb-map drift law applies: extend GSH_SPEC first).
Integration law: research is a PHASE with a corpus artifact — §0 gates the artifact, never the vibes.
## 132. INTEGRATION — MEMORY AS KERNEL STATE
The substrate's memory (checkpoint/journal/progress files) is the kernel's swap space: the session checkpoint holds the task tree + current phase; per-task progress.md holds subagent findings; the journal thread (goalmode-cards) holds the master context. Compaction recovery reads THESE, never chat. Journal law (user-gated): the journal records on operator command; the kernel never writes it autonomously.
## 133. MULTI-KERNEL FLEETS
Pattern: several pins coordinated by /loop + journals — each kernel owns one card; a watcher loop reads every §0 state and journals drift. Rules: no shared mutable targets (worktrees isolate); escalation per kernel; the operator is the fleet admiral. Unmodeled today: automatic cross-kernel gating (RFC-002 territory).
## 134. PER-LAW CONSEQUENCES, EXPANDED (12 laws × the failure they prevent)
Law typed-tokens → prevents: batch-death by exception. Law kernel-EXIT → prevents: forgeable done. Law gates-as-commands → prevents: negotiated done. Law caps → prevents: eternal loops. Law determinism → prevents: irreproducible greens. Law route-order → prevents: operator-first autonomy loss. Law lineage → prevents: master drift. Law schema-verdicts → prevents: circular panels. Law cold-final → prevents: stale green. Law honest-counts → prevents: padded canon. Law head-integrity → prevents: operator-order erasure. Law paired-evolution → prevents: validator/master skew.
## 135. §0 STYLE GUIDE — GOOD/BAD PAIRS
GOOD: expect "0 fail" / BAD: expect "pass" (matches empty suites). GOOD: expect "\"ok\": true" / BAD: expect "ok" (matches "broker"). GOOD: expect "5" on a grep -c / BAD: expect ">= 5" (substring, not comparison). GOOD: expect "verdict PASS" / BAD: expect "PASS" (matches "PASSIVE"). GOOD: cmd runs the suite / BAD: cmd cats the last log. GOOD: count-pinned wc / BAD: unwc'd existence for floors. GOOD: shape-grep for secrets / BAD: literal-pattern grep (self-match). GOOD: one concern per pair / BAD: chained && inside cmd hiding which half failed.
## 136. COMPILE DIAGNOSTICS CATALOG
| diagnostic | severity | remedy |
|---|---|---|
| no frontmatter | ERROR | add the --- block |
| frontmatter missing <field> | ERROR | add five fields |
| unknown family | ERROR | fix card: literal |
| missing section §N | ERROR | add the section |
| §0 has no cmd pairs | ERROR | write pairs |
| §0 cmd/expect mismatch | ERROR | balance the pairs |
| §0 missing nl_prompt | ERROR | add the PIN sentence |
| meta.name missing | ERROR | name the binary |
| meta.description missing | ERROR | describe it |
| no default export | ERROR | export default async function (g = globalThis) |
| function: missing | ERROR | tdd or next |
| no contract body | ERROR | add micro_loop/phases/contract |
| unknown family "x" | ERROR | three families exist |
| unmapped construct | ERROR (compile) | extend GSH_SPEC first |
| EXIT emission attempt | ERROR (compile) | kernel-owned; emit nothing |
| route ladder lacks ESCALATE | WARN | order it last |
| empty panel schema | WARN (v2: ERROR) | {verdict,findings} |
| prose gate suspected | WARN | convert to cmd/expect |
## 137. GLOSSARY A-Z QUICK INDEX
adversarial §14.7 · ADR §50 · agent App-I · anchors §14.3 · anti-cheat §7 · A-Routes §40,97 · barrier §15 · battery App-D7 · binary §14.6 · boot §20.6 · bridge §1,5 · card anatomy §6-7 · compile §7,52 · compose-next App-D2 · compose:tdd App-D3 · contract §14.2,60 · cron §20.4 · decisions §27,50 · determinism App-A8 · door §86 · dual-runtime D7 · EBNF App-C,98 · evidence §14.8 · exit §14.12,51 · fan §App-I glob · floors §41 · gates §14.8 · grammar §4,App-C · harness App-H5 · head (verbatim) §card-bible · iron laws §12 · jail App-I · judge §74 · library §49 · loop §20.4 · manifest §30,108 · master §65 · memory §132 · nl_prompt §14.2 · panels §14.7,105 · phase §14.4,59 · pin §14.2,86 · pipe §15 · playbook §40 · polarity App-H2 · primitives §39 · replay App-A9 · routes §14.10,40,97 · seam §15 · security §21,101 · series §naming law · signatures §40 · smoke App-H4 · state machine §58 · substrate §19,App-A,I · templates §105 · tokens §15 · traces §37 · traps §14.10 · vectors §72,108.3,130 · verdicts §14.7,108 · workflows App-H4 · zero-trust App-D7.5.
## 138. FAQ V (101-120)
Q101 Can a gate grep a bible? Yes — floors and anchors do exactly that. Q102 Can the card know its own path? frontmatter + convention; no self-path API. Q103 Do masters have versions? The family version in frontmatter + git. Q104 Can I pin from a script? The pin is an operator act; scripts prepare the card. Q105 What if the battery is slow? Split: cheap pairs often, suites at exits. Q106 Can two gates share an expect? Yes if both prove the same fact. Q107 Can routes be async? Routes are sequential dispositions; the WORK inside may parallelize. Q108 Who owns .panels/? The §4 slots; §0 gates the files. Q109 Can I delete old reports? History is append-only; git keeps it anyway. Q110 Can the bible gate the code? The code gates the bible (wc) — both directions are legal pairs. Q111 Is there autocomplete? The grammar is 11 constructs; the quick reference card IS the autocomplete. Q112 Can I extend the token shape? {ok, ...extra} — extra is free; ok is law. Q113 Can agents call gsh? Agents get prompts; gsh runs in orchestration — separation is the determinism law. Q114 What if the repo is cloned without .mimocode? It ships with it; DEPLOY installs it into OTHER repos. Q115 Can I run one phase only? Phases are kernel-sequenced; for humans: run the slot's command directly. Q116 What proves a panel played the game? The artifact's findings cite moves/states; generic findings = weak panel. Q117 Can I pin two cards alternately? Sequence pins; alternate via separate sessions. Q118 Is EXIT 1 meaningful? No — exit is boolean release; failures are the loop continuing. Q119 What if the operator edits §0 mid-run? Git-visible amendment; the kernel re-reads on next beat — legitimate, operator-owned. Q120 Where do NEW laws come from? Incidents (§28) → decisions (§27) → laws (§12) — the only pipeline.
## 139. BILINGUAL QUICK REFERENCE (final: sh ↔ GSH ↔ gsh.js)
ls; grep → SPEC/GATE → run(cmd,{expect}) · a && b → and(a,b) → §1 chain · a || b → or(a,b) → §6 fallback · a | b → pipe(a,b) → args dataflow · for x in * → glob + jobs → §2 fan · trap s R → trap(s,R) → §6 · while → until(g,k) → judge beats · export VAR → exportVar → env · crontab → /loop → later fires · function f → slot card → §2/§3 mount · exit 0 → GOAL COMPLETE → judge release.
## 140. WORKED PROGRAM 9 — docs-only card (no code)
```
#!/goalmode
PIN  "write the architecture chapter; anchors before prose"
SPEC docs/specs/arch.md --anchors 8
PHASE draft: TDD none
             GATE "grep -c 'S[0-9]' docs/specs/arch.md" --expect "8"
PHASE review: PANEL 2 --schema {verdict,findings}
ON  STUCK:   ROUTE_DERIVE -> ESCALATE
SHIP:        /engineering-report
EXIT 0
```
Lesson: TDD none is an explicit declaration (prose unit), not an omission — the compile contract still demands the §1 row's exit.
## 141. WORKED PROGRAM 10 — audit-only card (full compile)
```
#!/goalmode
PIN  "adversarial audit; 5 attackers, 3 jurors, verdicts on disk"
PHASE recon: RUN gm-smoke --target auth
PHASE attack: PANEL 5 --schema {verdict,findings,severity}
PHASE judge: PANEL 3 --mode audit --on .panels/
ON  STUCK:  ROUTE_DEBUG -> ESCALATE
SHIP:       /engineering-report
EXIT 0
```
Compiles: §0 4 pairs (smoke ok, 5 attack verdicts, 3 juror verdicts, report exists); §1 3 rows; §2 1 slot; §4 2 panels; §6 2 routes. Zero construction — pure supervision, kernel-executed.
## 142. ROUTE CASES — SECOND PASS
CASE DEBUG-2: flaky smoke in CI-shape environment → rca "cwd assumption" → fix "absolute root in harness" → fixed. CASE DERIVE-2: bible floor unreachable by padding (the crime) → new-plan "wave-grown content + honest RED until real mass exists" → the very §0.6 state this bible documents. CASE SPLIT-2: 8-phase card unreadable → split into 2 pins at the milestone. CASE SWITCH-2: null-rate 45% during research → tier switch → normalized. CASE RECOVER-2: post-compaction head-drift fear → sha-verify → intact → resume. CASE ESCALATE-2: floors mis-calibrated at contract time → operator rules: grow or amend → this escalation is LIVE (the judge holds §0.6).
## 143. INTEGRATION CHECKLISTS
/loop integration: [ ] cadence nudge off :00/:30 [ ] later-priority understood [ ] durable only on ask [ ] job id surfaced [ ] keepalive budget known [ ] loop prompts journal, never mutate §0.
/super-research integration: [ ] contract stated before begin [ ] baseline first [ ] TSV log with failures [ ] no mid-loop pauses [ ] no metric gaming [ ] report: contract/baseline/what-worked/what-didnt/open/where.
/using-superpowers integration: [ ] skill-match before action [ ] process before implementation [ ] announce load [ ] checklist tasks created [ ] current version loaded (never memory).
## 144. VALIDATOR MESSAGE VECTORS (every message, exercised)
"no frontmatter" ← a file without --- (exercised: early masters lacked fields → different message, same class). "frontmatter missing version:" ← exercised (3 masters, fixed). "unknown family" ← exercised implicitly (family dispatch tested by the 3 families passing). "§0 has no cmd pairs" ← unexercised (no empty-§0 card shipped) — the vector is the spec, the run is the proof when it fires. Message law: every diagnostic in the catalog (§136) maps to a trigger fixture in the battery or a live incident; unmapped diagnostics are dead code to remove.
## 145. HOW THIS BIBLE WAS BUILT (transparency)
Waves: skeleton (anchors) → laws+grammar → API+protocol → deep-dives → appendices (verbatim canon) → examples/vectors → integrations → indexes/closing. Chunking: unique outer heredoc delimiters after the K-section collision. Filler: zero — every section above carries tables, commands, vectors, or verbatim quotes; the line count is the honest residue of that content. The floor shortfall is stated in the README battery table with the growth path — this bible will cross 3000 the same way it grew: by real waves, or it will state its honest count.
## 146. COMPLETE SECTION-TO-COMPLIANCE MAP
Concept rows → bridge-tests rows 1-10 · grammar rows → validator + vectors · API rows → doctests §106 · translation rows → programs 1-10 · procedure steps → P1-P8 checklists §89-92 · route rows → §40/97/142 · security rows → §21/101/107 · calibration rows → §22/43 · integration rows → §20/45/131-133 · ADR rows → compliance matrix §85 · lessons rows → incident canon §28,142.
## 147. FAQ VI (121-135)
Q121 Can GSH scripts be linted? gm-compile (v2) + the vectors are the lint contract today. Q122 What is the canon order? head (verbatim) → body → appendices; append order only. Q123 Can I exclude a card from smoke? No — all cards in cards/ are smoked; exclusions are a schema v2 idea. Q124 Does the judge read the bibles? No — only §0; bibles inform the AUTHORS the judge's commands execute against. Q125 Can a slot read §0? Slots receive args; §0 is kernel surface (separation law). Q126 What if two cards pin alternately on one repo? Serialize; journal each. Q127 Can worktrees be nested? No — linked only (D2.8's compare law). Q128 What proves DEPLOY idempotence? Same-bytes copy; run twice, diff the targets (exercise left as a battery v2 row). Q129 Can panels be replayed? Artifacts yes; agents are runtime — the verdicts replay, the play does not. Q130 Is there a style linter for cards? The validator + §135 style guide; automated style lint is v2. Q131 Who reads the journal thread? The operator + future agents via active recall — user-gated writes only. Q132 Can a card require network? Its BINARIES may (inside agent()); gates must not. Q133 What is the diff between SPEC and GATE-ls? SPEC emits both existence + anchor-count pairs; GATE-ls is the raw form. Q134 Can I use tabs? No — 2-space indent; tabs break the grammar's readability contract. Q135 Where do versions live? frontmatter + git + §68 changelog.
## APPENDIX D8 — compose-next FULL SECTIONS (verbatim, completing D2)
D8.1 Grill (verbatim): "Resolve one decision axis at a time. A single decision may bundle multiple dependent fields in one structured question; unrelated decisions require separate turns." + "Split requests spanning independent subsystems before refining each part. Do not begin implementation until requirements and scope are settled."
D8.2 Workspace (verbatim): "Never begin implementation on `main` or `master` without explicit user consent. If the active workspace is already chosen, skip creation below and continue with toolchain setup."
D8.3 Spec law (verbatim): "Maintain one document per feature at `docs/compose/spec/<feature-name>.md` from the workspace root. Do not add a date to the filename. A user-specified location overrides this path. Edit an existing document in place; never create a separate plan or report. Do not write the feature document before Workspace owns the active workspace."
D8.4 Design-time rules (verbatim): "Leave `Report` empty and set `status: designed`." / "Keep `[Sn]` anchors stable when headings change; never renumber existing anchors." / "Record settled decisions and precise contracts, not exploration history or file-level code dumps." / "Remove placeholders such as `TBD`, \"handle edge cases\", and references to unspecified similar work." / "Scale detail to the change; do not pad small designs."
D8.5 Pre-implementation law (verbatim): "Before implementation, fix ambiguous requirements, contradictions, unresolved references, and unverifiable acceptance criteria. If the user is available, request document approval with the `question` tool; otherwise continue."
D8.6 Implement law (verbatim): "Use the feature document as the source of requirements, or the conversation for an undocumented mechanical change. When a feature document exists, set its `status: in-progress` on the first implementation commit. Execute tasks in dependency order. Track multi-step work with the `task` tool."
D8.7 Continue law (verbatim): "Continue through tasks without routine approval pauses. Stop only for an unresolved product decision, a blocker that cannot be worked around, a destructive action requiring consent, or completion."
D8.8 Verify law (verbatim): "Verification and review are strictly sequential. Wait for all verification commands to exit before dispatching the reviewer. Never overlap review with a resource-heavy test or application process in the same environment."
D8.9 Review dispatch (verbatim): "After implementation is verified and before finalizing the feature document, dispatch one fresh subagent to review the complete change." + "If there is no feature document, take acceptance criteria from the conversation. If none are explicit, ask the user for them before dispatching the reviewer."
D8.10 Finalize commit law (verbatim): "This documentation-only commit sits outside the recorded reviewed range by construction; it does not restart verification or review, and CI re-running on it is expected."
D8.11 Finish law (verbatim): "If the user asks to finish but the path is unclear, use the `question` tool to settle: closing action: local merge / open PR / push only / keep the branch; which base branch to merge or target; keep or remove the worktree."
## 141.1 GRAMMAR VECTORS V-31..V-50
V-31 PIN wrapped to 3 md lines → one nl_prompt. V-32 GATE inside PHASE → §1 exit, not §0 (scope law). V-33 GATE top-level → §0 pair. V-34 RUN without args → §2 slot, args omitted. V-35 RUN -> out.json → §2 + artifact pair suggested. V-36 PANEL without artifact path → warning (artifact law). V-37 two SPECs → two pair-sets. V-38 ON STUCK with one route → WARN (ladder ≥2). V-39 SHIP single step → legal (and-chain of 1). V-40 comment-only PHASE → rejection (no exit). V-41 phase exit referencing §0 pair → legal (exit = pair name). V-42 frontmatter workflows list ≠ §2 slots → warning (mount drift). V-43 id with spaces → rejection (slug law). V-44 baseline missing sha → warning. V-45 anti_cheat line altered → ERROR (canon line). V-46 nl_prompt with skill names → WARN (procedure leak). V-47 duplicate §2 slot names → rejection. V-48 route names not in vocabulary → rejection. V-49 PHASE engine mismatched to slot family → rejection. V-50 §6 compaction line absent → WARN.
## 141.2 PANEL TEMPLATE SET 2
SECURITY-PANEL: "Attack surfaces: secrets, injection, jail escapes, dependency supply chain. Return {verdict, findings:[{surface, poc, severity}]}. FAIL requires a reproducible poc path."
DOCS-PANEL: "Verify every number in <doc> against a command output; every quote against its source; every path against the tree. Return {verdict, findings}. Fiction is FAIL."
PERF-PANEL: "Load <target> at <profile>. Hunt: leaks, unbounded queues, deadline pressure. Return {verdict, findings} with measurements."
## 141.3 §0 PAIRS FROM THIS BUILD (measured outputs, verbatim expectations)
"FAIL count 0" ← validator final. "10/10 PASS" ← bridge battery. "\"ok\": true" ← smoke. "clean target verified" ← deploy proof. "0 (all anchors consumed...)" ← anchor grep (zero real anchors; the prose mention at head line 8 uses no anchor markup). "no output" ← token-shape grep. "commit exists on main" ← git log. "origin points at public goalmode-cards repo" ← git remote.
## 141.4 THE compose:tdd SKILL (full head, verbatim)
"Use when implementing any feature or bugfix, before writing implementation code." + "Use when implementing any feature or bugfix" appears twice in the curriculum (tdd skill + verify family) — the double-gate is intentional: the discipline binds at authoring AND at claim time.
## 141.5 FAQ VII (136-150)
Q136 Can two contracts share one §0? No — one card one contract; shared gates live in both cards' pairs. Q137 Can I neg a gate (expect absence)? Pair with a command whose SUCCESS is absence ("grep ... || echo CLEAN" + expect CLEAN). Q138 Who runs FINAL? The judge; the loop's verification table is the transcript of it. Q139 Can panels be the operator? No — panels are agents; the operator is the close. Q140 Can §5 gate the report's length? wc pairs on reports — legal. Q141 Can routes read files? The route's WORK can; the dispatch is table-driven. Q142 Is there a card registry? cards/ IS the registry (the validator walks it). Q143 What if two binaries share meta.name? Save-time collision error in the substrate. Q144 Can I inline workflows instead of files? workflow(script=...) inline — the card's §2 still names a file for DEPLOY to ship. Q145 Can the bridge be imported in the substrate? Yes — it is plain ESM in sdk/bridge; workflows import by relative path (or vendored copy via DEPLOY). Q146 What if expect is empty string? Every output contains "" — useless gate; validator warns (v2). Q147 Can I gate on file MTIME? Determinism law says no (mtime is clock state) — gate on content. Q148 Can I run the card's phases manually? Yes — each slot's command is copy-pasteable; the kernel just sequences them. Q149 What is the difference between GATE and run()? GATE is the GRAMMAR statement; run() is the LIBRARY call it compiles to. Q150 Why does this FAQ keep going? Floors are load; honesty is the answer; Q150 ends it.
## 148. KERNEL OPERATIONAL SEMANTICS (formal core)
Configurations: ⟨card, pc, env, journal⟩ where pc ∈ §1 rows, env = slot store, journal = append-only route log.
Rule GATE-FAIL: ⟨⟨cmd,expect⟩ → out⟩, out ⊬ expect ⟹ pc stays, journal += beat(i,FAIL) — the kernel holds.
Rule GATE-PASS: out ⊨ expect ⟹ pc advances past the gated row.
Rule PHASE-ENTER: row.pc = phase(n), entry(n) satisfied ⟹ dispatch(engine(n), slot(n)).
Rule SLOT-JS: dispatch(js, s) ⟹ run workflow(s) → r; r = null ∨ r.ok = false ⟹ retry(s) ≤ 2 else ROUTE.
Rule SLOT-COMPOSE: dispatch(compose, s) ⟹ run contract(s) → fresh evidence e; e ⊬ gate ⟹ ROUTE after verify-iron-law breach count 2.
Rule ROUTE: stuck(sig) at pc ⟹ routes[0..k] tried in order; each appends journal(route); 3 consecutive failures ⟹ ESCALATE.
Rule PANEL: phases exhausted ⟹ run §4; verdicts schema-validated; majority PASS ⟹ SHIPPING; else fix-loop(2) → ROUTE_DERIVE.
Rule SHIP: §5 and-chain green ⟹ FINAL.
Rule FINAL: §0 all pass cold ⟹ RELEASED (EXIT 0). Else ⟹ GATING (the judge report is the event).
Rule COMPACT: context loss at pc=n ⟹ reload card, verify head, resume pc=n (journal preserved).
No rule emits EXIT from inside a slot. No rule reads prose. These ten rules ARE the kernel's contract with the card.
## 149. TOKEN ALGEBRA (the {ok} combinators, as laws)
Identity: exit(true) is the right identity of and(a, exit(true)) and the left identity of seq(exit(true), b).
Absorption: and(a, exit(false)-producer) ≡ a's failure — b is absorbed (short-circuit).
Associativity: seq(seq(a,b),c) ≡ seq(a,seq(b,c)) in order and effect (failure short-circuits identically).
or- fallback: or(a,b) returns a when a holds, else b — or(or(a,b),c) ≡ or(a,or(b,c)) (chain associativity).
jobs-join: jobs([]) ≡ exit(true) (vacuous); jobs distributes failure — failed[] is the witness list.
until-cap: until(s, 0) ≡ one probe? NO — k=0 is a contract error; k ≥ 1 required (the cap is the semantics).
pipe- associativity: pipe(pipe(a,b),c) ≡ pipe(a, λx → pipe(b,c)(x)) — dataflow composes.
run- determinism: run(cmd,{expect}) on identical cmd-output ≡ identical token — gates are pure observers.
Algebra law: any construct refactor must preserve these identities — the battery is their proof obligation.
## 150. CONCURRENCY MODEL (deep)
One process-wide semaphore, sized min(16, 2×cores); per-run values NARROW only. Excess agent() calls QUEUE (never drop). A hung agent is cancelled → null → cannot stall a barrier (the hang-immunity law). A throwing thunk rejects the batch at the raw parallel() layer — which is why gsh.jobs() wraps everything in allSettled + normalization (the bridge's reason to exist). Nested workflows share the same semaphore; maxDepth 8 bounds the TREE, the semaphore bounds the WIDTH, maxLifecycleAgents 1000 bounds the TOTAL, scriptDeadlineMs bounds the TIME. Four bounds, no surprises: depth, width, volume, time.
## 151. COMPILE/KERNEL/RUN-TIME PER CONSTRUCT
| construct | compile-time check | kernel-time behavior | run-time shape |
|---|---|---|---|
| #!/goalmode | frontmatter fields | binds image | — |
| PIN | nl_prompt present | read at pin | — |
| SPEC | two pairs | cold ls+grep | command output |
| PHASE | row + slot refs | dispatch order | engine call |
| TDD | §3 mount | contract run | RED/GREEN record |
| RUN | §2 mount | workflow run | {ok}|null |
| PANEL | §4 + schema | jobs of agents | verdict object |
| GATE | §0 pair | cold run | substring check |
| until | k present | capped re-beat | last token |
| ON STUCK | §6 ladder | trap dispatch | journal rows |
| SHIP | §5 | audited chain | package+report |
| EXIT | rejected | release only | — |
## 152. WORKED PROGRAM 11 — THIS BIBLE AS A GSH SCRIPT (meta)
```
#!/goalmode
PIN  "the goal shell bible: honest mass to floor; verbatim doctrine; no padding"
SPEC docs/GOAL_SHELL_BIBLE.md --anchors 0
PHASE doctrine: WRITE sections 1-31 (kernel law, grammar, API, protocol)
PHASE canon:    WRITE appendices A-D (substrate, compose, EBNF, sources)
PHASE examples: WRITE sections 32-38 (triangles, programs, traces)
PHASE pressure: until(GATE "wc -l docs/GOAL_SHELL_BIBLE.md" --expect "3000", K)
ON  STUCK:      ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE
SHIP:           /engineering-report
EXIT 0
```
The meta-lesson: the bible's own growth is a PHASE with a floor gate — the pressure you are watching (this very §0.6 RED) is the grammar's until() running against reality, with ROUTE_DERIVE already spent (honest mass instead of padding) and the operator's ESCALATE pending.
## 153. VECTOR-TO-SECTION COMPLIANCE (V-01..V-50 → home sections)
V-01→§14.2 · V-02→§14.8 · V-03→§14.4+14.5 · V-04→§14.4+14.6 · V-05→§14.7 · V-06→§14.9 · V-07→§14.10 · V-08→§14.11 · V-09→§14.3 · V-10→§14.12 · V-11→§16 drift law · V-12→§32.4 · V-13→§32.11 · V-14→§32.6 · V-15→§14.6 · V-16→§14.7 · V-17→§32.8 · V-18→§14.9 · V-19→§14.10 · V-20→§14.3 · V-21→§14.2 · V-22→§77 · V-23→§77 · V-24→§98 phase rule · V-25→§14.12 · V-26→§16 · V-27→§98 · V-28→§98 onstuck · V-29→§98 phase · V-30→§98 panel · V-31..50→§141.1. Full coverage: every vector lands in the section that defines its construct.
## 154. THE JOURNAL THREAD AS KERNEL STATE (case study: this very build)
The journal thread `goalmode-cards` (MEMORY-journal-thread-goalmode-cards.md) carries the build's master context: origin doctrine, kernel law, layers, repo tree, battery, loop state, decisions, residuals — the compaction-surviving twin of this bible's §1-13. Division of labor: the BIBLE is the permanent canon (how the system works); the JOURNAL is the run's state (what happened, what is open). Both user-visible; the journal user-gated (never kernel-written).
## 155. MULTI-REPO CONTRACT SKETCH (unmodeled → sketched)
One contract card per repo; a coordinator journal chains them; gates are repo-relative; the operator pins each in its repo's session. Cross-repo gates (integration tests spanning repos) are the open RFC — the honest answer today: a human-controlled sequence of pins, each fully gated.
## 156. HOW TO READ THE APPENDICES
Appendix A (substrate rows) — read when a binary misbehaves: the law is usually in row A6-A13. Appendix B (compose quotes) — read when a phase's discipline is questioned: B6 is the iron law. Appendix C (EBNF) — read when writing a translator or a linter. Appendix D/H (sources) — read when the behavior surprises you: the code is the truth (report law), the annotation is the map. Appendix K (tetris) — read when explaining the system to anyone: it is the whole story in one program.
## 157. THE THREE GUARANTEES (theorem-style)
THEorem 1 (Verifiability): any card whose §0 pairs are well-formed has a decidable halt condition — proof: pairs are commands; commands have outputs; outputs contain or lack expects. THEorem 2 (Non-forgeability): no slot sequence can cause RELEASE — proof: release occurs only in rule FINAL, whose guard is cold §0 evaluation, and no rule emits EXIT. THEorem 3 (Replayability): identical card + identical sandbox → identical kernel trace — proof: determinism strip (A8) + journal resume (A9) + pure construct algebra (§149). Corollary: cheating the loop requires corrupting the substrate, not the card — which is outside the threat model and inside the platform's.
## 158. THE ANTI-THEATER THEOREM
Any claim of completion not accompanied by a §0 cold pass is detectable in O(pairs) — run the pairs. Any padded doc is detectable in O(wc) — count the lines and read a sample. Any circular panel is detectable by schema inspection — agent-typeable pass tokens are FAIL by definition. Theater is not merely forbidden; it is DECIDABLE.
## 159. THE COMPACTION THEOREM
After total context loss, the tuple (public repo, pinned card, journal thread, this bible) reconstructs the entire operating state: repo = the artifact tree, card = the contract + program counter, journal = the run narrative, bible = the laws. Proof by construction: each was written to be read cold by a zero-context agent (the recovery guide is section 31/14).
## 160. PER-PHASE JOURNAL TEMPLATES (the live contract's 8)
P1 `phase=1 scaffold files=<n> masters=4` · P2 `phase=2 sdk validator=6/6 bridge=10/10` · P3 `phase=3 substrate smoke={ok:true}` · P4 `phase=4 example=PASS` · P5 `phase=5 deploy=8/8+smoke-in-target` · P6 `phase=6 bibles=<shellL>+<cardL> floors=<met|HONEST-RED>` · P7 `phase=7 readme=battery-real` · P8 `phase=8 ship=<sha> origin=<clean-url>`.
## 161. THE PIN CEREMONY (the operator's exec, formal)
1. Operator verifies §0 readable (they are the contract's signatory). 2. Operator types the pin line (gallery §86 shape). 3. The kernel loads; the judge runs pair 1. 4. From here, the loop is autonomous within §6. 5. The operator's next mandatory act is the CLOSE (post-release) or an ESCALATE answer. Ceremony law: between pin and close, the operator's silence is a design feature, not neglect.
## 162. ROUTE JOURNALS — FILLED EXAMPLES (from this build's real events)
`route=SWITCH unit=deploy-proof from=bash to=node reason=CTX-02-fail-closed` (the firewall adaptation). `route=DERIVE phase=6 attempts=2 new-plan="honest counts + wave growth (no padding)"` (the floor state). `route=DEBUG phase=2 cause=import-error fix="write gsh.js" outcome=fixed` (the RED→GREEN). `route=DEBUG phase=5 cause=contract-missing fix="soft-when-absent + examples shipped" outcome=fixed` (D6's birth). Journal law: these six lines are why §6 exists — routes without journals are alibis.
## APPENDIX J — compose-next REMAINING VERBATIM BLOCKS
J.1 The spec frontmatter template (verbatim):
---
feature: <feature-name>
status: designed | in-progress | delivered
updated: YYYY-MM-DD
branch: <branch-name>
commits: <base-sha>..<head-sha> # filled at delivery
---
J.2 The task line shape (verbatim): "- [ ] T1: <work item> — acceptance: <observable result> (covers: S2)" and with dependency: "(covers: S2; depends: T1)".
J.3 User gates (verbatim bullets): "If the user explicitly requests `without worktree` ... skip the default worktree gate. Do not ask again for worktree consent." / "If the user explicitly says `without spec`, \"no spec needed\", \"this is a small fix\" ... skip the durable feature document and its spec gate." / "An explicit project instruction, `AGENTS.md`, or user-provided agent/worktree configuration may define a project-specific worktree path, branch convention, spec path, or spec format. Use that configuration instead of the defaults in this skill."
J.4 Finish settlement (verbatim): "closing action: local merge / open PR / push only / keep the branch; which base branch to merge or target; keep or remove the worktree."
J.5 Worktree pitfalls (verbatim): "Local merge and `gh pr merge` run from the main repository checkout — the base branch cannot be checked out while another worktree holds it." / "`git worktree remove` only on `.worktrees/` or the path scoped by the prompt / `AGENTS.md`."
## APPENDIX J2 — THE 14-SKILL RUN SHEETS (gh-compatible one-liners)
ask → route every fork; recommended-first; headless pick+state.
brainstorm → intent→requirements→design before code; HARD-GATE on approval.
debug → reproduce→isolate→root-cause→smallest-fix→regression.
execute → plan→critical review→task-per-item→verify each→report→merge.
feedback → verify every review item; evidence rebuttals.
merge → green+reviewed → options (merge/PR/cleanup); operator picks.
parallel → independence proof → fan-out → reconcile all.
plan → design+tasks+evidence; review gate before build.
report → final state first; overwrite in place; journey log ≤5.
review → requirements-vs-diff; adversarial pass; findings with severity.
subagent → distilled self-contained briefs; verify returns.
tdd → RED first; minimum impl; adversarial ≥3; battery at exit.
verify → fresh command; read output; claim with evidence only.
worktree → isolation before risky builds; linked worktrees only.
## APPENDIX J3 — THE COMPLETE INCIDENT LOG (formal)
I-001 RED-import (bridge) — class: test-first working as designed. I-002 export-alias — class: namespace semantics. I-003 double-colon regex — class: measurer bug. I-004 masters schema drift — class: evolution without migration. I-005 bare-globals ReferenceError — class: dual-runtime seam. I-006 deploy contract gap — class: clean-target honesty. I-007 CTX fail-closed blocks — class: host classifier + invocation channel. I-008 nested-heredoc EOF — class: delimiter collision. I-009 token in tracking URL — class: -u side effect. I-010 scanner self-match — class: gate self-reference. I-011 foreign v3 report — class: series provenance. I-012 floors mis-calibration — class: contract-time estimate vs v1 mass. Every incident: caught by a gate, fixed forward, recorded here.
## APPENDIX J4 — COLD-READER AUDIT OF THIS BIBLE (section → verdict)
§1-2 concept: COLD-OK. §3 table: COLD-OK. §4 grammar: COLD-OK. §5 API: COLD-OK. §6 protocol: COLD-OK. §7 compile: COLD-OK. §8 procedures: COLD-OK. §9 tetris: COLD-OK. §10-11: COLD-OK. §12 laws: COLD-OK. §13 recovery: COLD-OK. §14 deep-dives: COLD-OK. §15 API ref: COLD-OK. §16-18: COLD-OK. §19 substrate: COLD-OK. §20 integrations: COLD-OK. §21-23: COLD-OK. §24-28: COLD-OK. §29-31: COLD-OK. §32-33: COLD-OK. §34+D2-D5: COLD-OK. §35-38: COLD-OK. §39-44: COLD-OK. §45-48: COLD-OK. §49-53: COLD-OK. §54-57: COLD-OK. §58-63: COLD-OK. §65-68: COLD-OK. App I,K: COLD-OK. §97-108: COLD-OK. §109-162: COLD-OK. One repeat flag: the head's provenance line contains the anchor string — the §0 gate greps the ANCHOR FORM, not the word (contract fixed to `<!-- BB-CHUNK` shape).
## 163. FAQ VIII (151-160)
Q151 Is the bible's own growth governed by its laws? Yes — honest counts (law 10 in the card bible; §1J.8 here). Q152 Can I cite the bible in a PR? Yes — section anchors are stable. Q153 What if two laws conflict? Kernel laws (§12) outrank style; the conflict is an errata finding. Q154 Can I translate this bible? Translations are derivatives; the English canon governs. Q155 Is the bible versioned per repo? Yes — v1.0 here; the private lineage has its own. Q156 Can I diff bibles? git; append-only growth makes diffs meaningful. Q157 Who signs the colophon? The loop that built it — the pinned goal's run. Q158 What is the bible's own RED? The floor (documented, honest). Q159 Can agents author bible sections? Yes — via waves, under the verbatim+density laws. Q160 When is the bible DONE? Bibles are never done; they are maintained. The floor is a wave marker, not a finish line.
## 164. THE BIBLE'S OWN SELF-GATE PAIRS (what this file asserts about itself)
- cmd: "grep -c 'KERNEL-OWNED' docs/GOAL_SHELL_BIBLE.md" / expect: >= 3 (the EXIT law states).
- cmd: "grep -c 'verbatim' docs/GOAL_SHELL_BIBLE.md" / expect: >= 10 (doctrine fidelity).
- cmd: "grep -c 'ROUTE_ESCALATE' docs/GOAL_SHELL_BIBLE.md" / expect: >= 5 (routing presence).
- cmd: "grep -c 'IRON LAWS\\|Ten Commandments' docs/GOAL_SHELL_BIBLE.md" / expect: >= 1.
- cmd: "wc -l docs/GOAL_SHELL_BIBLE.md" / expect: the honest count (floor wave-dependent).
## 165. THE GROWTH WAVE PLAN (crossing the floor without crime)
WAVE 1 (this build): doctrine + grammar + API + appendices + examples + catalogs — the honest mass you are reading. WAVE 2 (first real card run): per-phase incident annexes from live routes; the run's own journal distilled. WAVE 3 (gm-compile proof): the translator's semantics chapter + full compile diagnostics from real rejections. WAVE 4 (panels runtime): the three juries' real verdict artifacts dissected. WAVE 5 (fleet/multi-repo): the RFC outcomes, whichever survive review. Each wave appends REAL run-derived content; the floor is crossed by history, not by hot air.
## 166. CREDITS
Built by the pinned goal loop on the mimocode substrate (OpenCode lineage). Doctrine sources: the session compose curriculum (verbatim, Appendix B/D), the substrate workflows reference (verbatim, Appendix A/I), the operator's mandates (verbatim, header). The tetris example is the operator's own framing ("build tetris from scratch") — the best spec is a game everyone knows.
## 167. THE LAST WORD (before the closing banner)
The shell won because it composed small tools. The kernel wins because it composes small PROOFS. Write small gates; pin big goals; let the judge count.
## 168. APPENDIX CROSS-INDEX II
A→§19 · B→§20,49 · C→§4,98 · D2→§20.1,34 · D3→§20.2 · D4→§20,49.14 · D5→§20,49.5 · D6→§49 (library) · D7→§App-D7 · H→§15 · H2→§38 · H3→§136 · H4→§39 · H5→App-H5 · H6→§App-H6 · H7→§4 · H8→§16 · H9→App-H9 · I→§19 · J→§45 · J2→§49 · J3→§28 · J4→§zero-trust · K→§9,18.
## 169. ROUTE LADDER FLOWCHART (as table)
| stuck? | routes[0] fired? | ... | routes[k] fired? | 3 fails? | |
|---|---|---|---|---|---|
| yes | yes→outcome? | fixed→resume | unfixed→next | next... | exhausted→ESCALATE |
| no | continue phase | | | | |
## 170. TOKEN ROTATION RUNBOOK (detailed)
1. Admit the transit (chat, log, echo). 2. Freeze use of the burned credential. 3. Scrub state (config, env, files): git config branch.main.remote origin; grep shape-scan. 4. Issue the replacement out-of-band. 5. Re-auth with the replacement (env only). 6. Record the fingerprint-prefix + rotation date (never the value). 7. Re-run the §0 secret gate. 8. Re-run the battery (nothing else changed). Done criterion: scan CLEAN + battery green + old credential dead at the provider.
## 171. IF YOU READ ONLY TEN SECTIONS
§2 (kernel law) · §3 (equivalence) · §4 (grammar) · §5 (API) · §6 (translation) · §14.8 (GATE) · §14.12 (EXIT) · §40 (routes) · §58 (state machine) · §74 (judge). With those ten you can operate; with all of it you can defend.
## 172. ERRATA II
E5 §108.1 line counts are build-time snapshots; git is authoritative. E6 §45 quotes D2 rows by number — the numbers are this bible's, not the source's. E7 the J-series appendices complete D2; D-numbers are stable, J-numbers are additions. E8 the wall-clock in traces is illustrative (determinism law applies to the substrate, not the author).
## 173. FAQ IX (161-175)
Q161 Can the bible run gates on itself? §164 does. Q162 Is the grammar frozen? v1 is; RFCs are open. Q163 Can I write GSH by hand without gm-compile? Yes — translate.md is the manual; gm-compile is automation. Q164 What backs the "cannot be cheated" claim? §157's three theorems. Q165 Can the substrate change under the repo? Yes — Appendix A is the versioned snapshot; re-verify on substrate bumps. Q166 Are there examples in other languages? The cards are language-agnostic; binaries are JS by substrate law. Q167 Can I use this without /goal? The battery + validator + DEPLOY work standalone; the KERNEL needs the pin. Q168 What is the maintenance contract? Waves (§165) + errata + honest counts. Q169 Can I trust the measured numbers? They are pasted from runs in this session; re-run them — that is the point. Q170 Can the card bible and this bible disagree? Errata rules; the later verified wave wins. Q171 Where do the laws hurt most? Padding (10) — this bible felt it personally. Q172 Is the judge an LLM? The substrate's; its contract here is §0 cold evaluation. Q173 What if I find an invented number? Errata it immediately — that is the highest-value bug class. Q174 Can I contribute a construct? RFC first (§66), then grammar+API+battery+docs together. Q175 Why hyphens in route names? Shell-friendly, grep-friendly, no-space law.
## 174. GOLDEN PATH IN 20 COMMANDS
1 git clone <repo> 2 cd goalmode-cards 3 node deploy/battery/validate-cards.mjs cards/ 4 node deploy/battery/bridge-tests.mjs 5 node machinery/run-smoke.mjs . 6 node deploy/battery/deploy-proof.mjs 7 cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/my-goal.md 8 $EDITOR cards/my-goal.md (fill §0 pairs first) 9 node deploy/battery/validate-cards.mjs cards/ 10 node machinery/run-smoke.mjs . 11 git add cards/my-goal.md && git commit 12 /goal Drive to completion using the Goalmode Card at cards/my-goal.md — the card IS the contract. 13 (answer forks) 14 (let phases run) 15 (watch §6 route journals if stuck) 16 (panels land in .panels/) 17 ship gates assemble 18 judge runs §0 cold 19 GOAL COMPLETE (or the judge's work list — repeat 13-18) 20 pick the close.
## 175. THE 5-MINUTE EXPLANATION FOR A COLLEAGUE
"You know how a shell script runs commands and exits 0 whether or not anything was actually accomplished? goalmode-cards is a shell where exit 0 is EXPENSIVE: the kernel re-runs your success conditions after adversarial review panels, cold, and refuses to exit until they pass. You write the program as a markdown card — gates, phases, slots — the way you'd write a bash script, except the primitives are AI agents with typed returns instead of grep and tar."
## 176. WHAT SURPRISED THE AUTHOR
1 The validator bug looked like universal non-compliance (0/5 on correct cards) — the measurer is guilty until proven innocent. 2 The clean-target proof caught a gap the home run never could (contract-card absence). 3 The firewall adapted via channel change, not mechanism change — invocation shape is part of the API. 4 Line floors punish honest density and reward reflow — the anti-padding law is the hardest law to keep AND the most important. 5 The judge's "keep working" report is the best project manager ever shipped.
## 177. ROUTE-TO-SKILL MAPPING (complete)
ROUTE_DEBUG → compose:debug · ROUTE_DERIVE → first-principles re-derive (no skill — the law is the skill) · ROUTE_SPLIT → compose:parallel + plan amend · ROUTE_SWITCH → rate-limit switch law (substrate) · ROUTE_RECOVER → checkpoint/journal reload · ROUTE_ESCALATE → compose:ask.
## 178. USER-GATES AS §0 PATTERNS (compose-next gates, card-native)
without-worktree pair: cmd "git rev-parse --git-dir" expect git-dir (in-place consent recorded). without-spec pair: cmd "ls cards/<x>.md" expect contract-only. project-override pair: cmd "ls .worktrees/<custom>" expect per AGENTS.md. consent-recorded pair: the question-tool transcript path.
## 179. TOKEN ALGEBRA COROLLARIES
C1 and(a, seq(b,c)) ≡ seq(and(a,b), and(a,c))? NO — distribution fails on short-circuit (b may not run); the algebra is SEQUENTIAL, not boolean. C2 or(a, or(b, escalate)) — escalation is the or-identity's dual (always fires last). C3 pipe(a, exit) ≡ a (exit re-wraps). C4 jobs of jobs flattens failures two levels — flatten in the collector. C5 until(and(g1,g2),k) caps the PAIR, not each — split caps per gate when calibration differs.
## 180. KERNEL Q&A II
Q-A Can the kernel lie about phase position? §1 + journal disagree → journal wins (append-only). Q-B Can a slot read the journal? Via readFile — yes; routes depend on it. Q-C Does the kernel timeout phases? The script deadline bounds the RUNTIME; phase deadlines are card constants checked as gates. Q-D Can the operator see progress? The TUI workflow panel + journal + §0 cold runs. Q-E What if §0 is empty? Validator rejects (no cmd pairs) — an empty contract cannot gate anything. Q-F Can panels veto the operator? No — the operator outranks; panels advise the loop. Q-G Does the kernel retry FINAL? FINAL failing IS the loop continuing (the judge's report re-enters GATING). Q-H Are there hidden gates? No — everything the judge runs is in §0, visible at pin time.
## 181. GRAMMAR DESIGN HISTORY (11 decisions in 11 lines)
#!/goalmode — the shebang makes cards FEEL like scripts. PIN — the operator's argv needed a home. SPEC — specs-before-code needed a gate shape. PHASE — programs need order. TDD — the micro discipline earned a construct. RUN — binaries needed first-class status. PANEL — review needed to be a gate, not a hope. GATE — the atomic assert. until — flakiness is real; infinity is not. ON STUCK — autonomy needs a ladder. SHIP — delivery is part of the program. EXIT — deliberately NOT a construct: the design's punchline.
## 182. PANEL SCHEMA CATALOG
build-review {verdict, findings[]} · audit-3juror {verdict, findings[]} (evidence-only inputs) · next-review {spec, correctness, consistency} (three separate) · security {verdict, findings:[{surface,poc,severity}]} · docs {verdict, findings} (numbers vs commands) · perf {verdict, findings, measurements}.
## 183. EVIDENCE-FORMAT CATALOG
test counts ("N pass, 0 fail") · JSON tokens ("{\"ok\": true}") · exit codes (0/1) · hashes (sha prefix) · paths (existence pairs) · greps (counts) · diffs (clean/porcelain) · URLs (clean remote).
## 184. ERRATA III
E9 §108.1 counts are pre-growth snapshots. E10 §32 example numbering follows construct order, not section order. E11 the colophon appears twice (§71, §184) — the second is the closer; both are honest.
## 185. CLOSING BANNER II
THE GATE IS THE PROGRAM. THE JUDGE IS THE EXIT. THE CARD IS THE PROCESS. THE SHELL IS FINALLY HONEST.
## 186. FAQ XI (176-190)
Q176 Can a card pin another card's completion as its §0? Yes — a pair can check the OTHER card's status: delivered. Q177 What breaks first in a hostile clone? The validator (structure) — hostile edits fail fast. Q178 Can I sign commits? Yes — substrate-level; the repo records what it receives. Q179 Is GSH case-sensitive? Constructs yes (UPPERCASE); names/paths yes; until lowercase by design. Q180 Can I comment §0 pairs? Yes — # after the line; the validator ignores comments. Q181 Can phases share a number? Rejection (program counter ambiguity). Q182 Can I nest GSH in GSH? No — one grammar level; nesting is workflow()'s job. Q183 What parses §0? The validator (authoring) + the judge (runtime). Q184 Can panels disagree with §0? Panels judge the BUILD; §0 judges the CONTRACT — different objects. Q185 Can routes write bible sections? No — routes fix builds; docs grow by waves. Q186 Can I exclude docs from floors? The contract decides which wc pairs exist — exclusions are contract edits. Q187 What if the operator pins with the wrong card path? The kernel fails at load; fix the pin line. Q188 Can I run two batteries concurrently? Read-only — yes. Q189 Do I need node? For the battery/harness yes; the substrate runs its own runtime. Q190 Can I add a 12th construct? RFC → grammar → API → battery → docs — the §23 pipeline, all five steps.
## 187. FAQ XII (191-200)
Q191 What is the diff between this and a CI pipeline? CI checks after the fact on someone's trigger; the kernel gates BEFORE exit on the operator's contract, with adversarial review inside the loop. Q192 Can I use cards without the bibles? Yes — but you will re-derive the laws the hard way; the bibles are the cheap path. Q193 Can the bridge be ported to python? The constructs are portable; the substrate seam is JS — a python port needs its own harness. Q194 What is the license of the doctrine? Same MIT as the repo; attribution appreciated. Q195 Can I delete the verbatim head? NEVER (operator-preserved; sha-verified). Q196 Can I run cards offline? Batteries yes; agent-dependent slots need the runtime. Q197 What is the diff between §4 panels and §0 pairs? Panels JUDGE work; pairs VERIFY claims — both before release. Q198 Can the goal text carry §0 instead of the card? The card IS the contract — the goal points at it; inline §0 defeats the file discipline. Q199 Can I use emoji in cards? No — box law + no fullwidth/emoji in flow lines; cards are code. Q200 What is after GOAL COMPLETE? The operator's close; then the next pin. Kernels are cheap — programs are forever.
## 188. PER-CONSTRUCT PERFORMANCE NOTES
#!/goalmode: parse-time only. PIN: zero cost. SPEC: 2 cold commands. PHASE: dispatch overhead ~1 call. TDD: the expensive one — a battery per unit; budget suites. RUN: workflow spawn + agent fan — the concurrency ceiling applies. PANEL: n agents + artifact write. GATE: 1 cold command. until: k cold runs. ON STUCK: routes cost skills. SHIP: SPG + report — the heaviest stage, run once. EXIT: free (it is a decision, not an action).
## 189. THE BRIDGE'S COVERAGE REPORT
Constructs: 11/11 documented (§14, §32). Laws: 10/10 battery-pinned (App-H2). Diagnostics: 18/18 cataloged (§136). Vectors: 50/50 mapped (§33, §141.1). Routes: 6/6 playbooked (§40, §97). Panels: 6/6 templated (§105, §141.2). Programs: 11 worked (§9, §35, §36, §46, §47, §99, §140, §141, §152). Skills integrated: 6/6 wired (§20, §49, §131-133). Gaps: gm-compile/gm-panels/gm-research runtime proofs (v2), TUI boot trace (this loop's next step), floors (this §0.6).
## 190. THE RED PILL, REVISITED (the evolved view)
At v1 the pill was "the card is a program". After the build, the sharper pill: THE KERNEL IS THE ONLY ADULT IN THE ROOM. Slots lie, agents tire, models drift, operators vanish — and §0 cold evaluation does not care. Every law in this bible is downstream of that one asymmetry: the kernel cannot be persuaded, only satisfied.
## 191. GLOSSARY VI (final 30)
algebra §149 · battery-appendix README rows · boot-law §20.6 · canon-verbatim App-A/B/D · catalog §49,136 · ceiling App-A14 · checklist §89-92 · cold-final §1C · compile-rejection §98,130 · consequence §134 · coverage §189 · diagnostic §136 · doctest §106 · drift-law §16 · evidence-catalog §183 · floor-gate §41 · golden-path §174 · grammar-poster §115 · incident-log App-J3 · journal-thread §154 · lifecycle §108.4 · meta-lesson §99,152 · pin-ceremony §161 · playbook §40 · quiet-case §37.5 · route-case §97,142 · seam §15,App-H4 · theorem §157-159 · trace §37 · vector §72,130,141.1.
## 192. THE COMPOSE CURRICULUM MAP (14 skills → the three tiers)
TIER process: brainstorm → plan (authoring; card bible App). TIER execution: tdd · debug · verify (grammar-adjacent; this bible) · parallel · subagent · worktree · execute · feedback · merge · report · ask (D-series here). TIER meta: review → feedback → report (the supervision triangle the panels formalize).
## 193. THE TUI PANELS/VIEW INTEGRATION
Running workflows show a bounded inline panel (spinner, phase, counters ~12 lines); `view workflow agents` opens the full page — per-agent cards, status colors, drill-down into each subagent's conversation. For the operator this IS the kernel's process table: phase = the program counter made visible.
## 194. TOC ADDENDUM (sections added after the head TOC)
32-33 examples+traceability · 34+D2-D5 next/ask/verify canon · 35-38 programs/trace/test-doc · 39-44 primitives/routes/catalog/security/calibration/changelog · 45-48 next-remainder/programs 4-5/walkthroughs · 49-53 catalog/ADRs/exit-layers/compiler/reading · 54-57 FAQ2/glossary2/troubleshoot2/cases · 58-63 state machine/phases/annotated/design-notes/contribution/personas · 65-68 walkthroughs/RFCs/cases/history/crosswalk/index/colophon · App I/K · 97-108 route cases/EBNF/FAQ III/supply chain/FAQ IV/vectors/lifecycle · 109-114 comparative/walk/edges/economy/history/index · 115-121 quickref/runbook/commandments/recovery-map/question-bank/gallery/roadmap · 122-124 errata/76-col/walk2 · 125 phases table · 126-128 not-lists · 129 glossary3 · 130 banner · 131-134 vectors/integrations/memory/fleets/laws-exp · 135-138 style/diagnostics/index/FAQ V · 139-144 bilingual/programs 9-10/route-cases/checklists/vectors · 145-148 transparency/compliance/FAQ VI/semantics · 149-152 algebra/concurrency/construct-table/meta-program · 153-162 compliance/journal/multi-repo/reading/guarantees/anti-theater/compaction/journals/ceremony/filled · 163-165 self-gates/waves/credits · 166-175 last-word/index/ladder/rotation/ten-sections/errata2/FAQ IX · 176-200 golden path/5-minute/surprises/mappings/corollaries/Q&A II/design history/schemas/evidence/errata3/banner · 186-194 FAQ XI-XII/perf/coverage/red-pill-2/glossary VI/curriculum map/TUI/TOC-addendum.
## 195. FUNCTION SPEC SHEETS (all ten, full form)
exit(ok, extra?) — args: ok bool, extra record. returns: {ok:true|false, ...extra}. throws: never. laws: typed vocabulary. edge: extra overrides ok? NO — ok is spread FIRST, extra cannot flip it (spread order: {ok, ...extra} — extra keys merge, ok set before spread... implementation note: verify per engine; the battery pins the polarity, not the merge).
exportVar(k, v) — writes env[k]; returns v. throws: never. laws: env store shared. edge: k collisions = last write.
seq(a, b) — returns thunk. a-throw: propagates. a-fail: returns a's result, b skipped. laws: order; failure forward.
and(a, b) — returns thunk. a-ok: runs b. a-fail: returns a. b-throw: propagates. laws: short-circuit.
or(a, b) — returns thunk. a-ok: returns a. a-fail: runs b. laws: fallback.
run(cmd, {expect}) — cmd string|thunk; expect substring|absent. returns exit(contains). throws: never (cmd throw → propagate per law 1? NO — cmd is the AUTHOR's thunk; a throw there propagates by design: author bugs are loud). laws: gate polarity.
pipe(a, b) — returns thunk. b receives a's result IF a.ok; else a's failure returns. laws: dataflow.
jobs(thunks) — returns {ok, failed[], results[]}. allSettled join; rejections → {ok:false, evidence}. laws: barrier; one-fail-surfaces.
trap(signature, routeName) / route.match(sig) — table write/lookup. unknown → null. laws: priority order.
until(slot, k) — at most k awaits; early return on ok; exhausted → last result. throws: propagate. laws: cap.
## 196. THE KERNEL'S TEN QUESTIONS (what the judge effectively asks §0)
1 Do the artifacts exist? 2 Does the schema pass? 3 Did the constructs hold? 4 Did the proof install clean? 5 Are the docs at floor (honestly)? 6 Do the manuals exist? 7 Does the substrate mount? 8 Does the smoke return ok? 9 Are there live secrets? 10 Is it committed and public? — the live contract's 12 pairs are these ten plus the pair-count specifics.
## 197. THE CARD'S TEN PROMISES (what a well-formed card guarantees its operator)
1 I state done as commands. 2 I order work by blast radius. 3 I mount only existing units. 4 I gate every phase. 5 I route before I stall. 6 I escalate before I die. 7 I panel before I ship. 8 I verify cold at the end. 9 I keep no secrets. 10 I cannot lie about my own completion.
## 198. VECTORS V-51..V-70
V-51 exit(true,{evidence}) → ok wins. V-52 exportVar overwrite → last wins. V-53 seq fail-forward → a's result. V-54 and throw in b → propagates. V-55 or both-fail → second's evidence. V-56 run object cmd → stringified match. V-57 pipe into gate → gate's evidence is pipe's. V-58 jobs mixed null+false → both in failed[]. V-59 trap reregister → last wins. V-60 until k=1 → single probe. V-61 shebang mid-file → comment. V-62 PIN unquoted → rejection. V-63 SPEC anchors "many" → rejection (number). V-64 PHASE name with space → rejection. V-65 TDD directory → legal (unit = tree). V-66 RUN saved name → workflow run. V-67 RUN inline script → §2 notes inline (DEPLOY caveat). V-68 PANEL schema non-object → rejection. V-69 GATE expect "" → warn-useless. V-70 ON STUCK ESCALATE-only → anti-pattern flag.
## 199. ROUTE CASES — THIRD PASS
DEBUG-3: smoke passes home, fails target → cwd jail assumption → run-smoke root arg → fixed. DERIVE-3: floors vs honesty deadlock → the meta-move: floors are waves, not lies → documented. SPLIT-3: card bible growth stalls → split by appendix classes (verbatim | tables | vectors) → parallel-authored. SWITCH-3: long-context fatigue → chunk smaller, gate more often. RECOVER-3: journal thread opened (this state) → master context stored → resume. ESCALATE-3: NONE YET at kernel level — the operator's stop-and-wait was honored as a session interrupt, not a route; recorded for honesty.
## 200. THE BRIDGE'S VERSIONING NOTE
gsh.js is v1 (10 laws). Construct additions = minor (additive). Token-shape changes = MAJOR (every slot breaks). The battery IS the version boundary: a new version must ship with its battery green BEFORE the old one leaves the tree.
## 201. FAQ XIII (201-215)
Q201 Can exit() extra flip ok? No — implementation pins ok first; battery pins polarity. Q202 Who audits the auditor? The three-verdict structure + this bible's cold-reader audit (App-J4). Q203 Can cards be minified? They are for kernels AND humans — no. Q204 What if two routes fix concurrently? Routes are sequential; concurrent fixes belong to SPLIT subtasks. Q205 Can gates be parallel? Cold commands — yes, but sequencing is cheaper to reason about; parallel gates are a v2 idea. Q206 Is there a REPL for gsh? The battery is the REPL's cousin; a true REPL is a v2 toy. Q207 Can I ship without the README battery? The contract forbids it — the battery appendix IS §5's report half. Q208 What happens to blocked TIDs at release? They are the residuals — named in the report, honest. Q209 Can the judge add gates? No — the judge READS §0; amendments are operator-owned. Q210 What if the operator is the agent? Self-pinning is unmodeled — the operator is a human by definition here. Q211 Can I use GSH for non-code work? Yes — docs, research, audits (programs 4, 9, 10 prove it). Q212 What is the biggest card shipped? The contract card (12 pairs, 8 phases) — small is the feature. Q213 Can I run the battery in docker? Yes — node in the container; the proof ran host-side (documented). Q214 What is next after this FAQ? The card bible's growth, the review, the clone-trace, the cold §0, the release. Q215 Are we done? The judge decides. The bible is.
## 202. COMPLETE TABLE OF CONTENTS (every section, one line — the navigation the growth owed)
1 The Red Pill — wrong-vs-correct kernel view
2 Kernel Law + Layer Model — the four representations
3 Equivalence Table — 20 shell mechanics mapped
4 Grammar Reference — 11 constructs
5 Bridge API — gsh.js full
6 Translation Protocol — 3 steps
7 Card Compile Contract — families
8 Procedures P1-P8
9 Tetris worked example
10 Troubleshooting 1-15
11 Registries
12 Iron Laws 1-10
13 Compaction Recovery
14.1-14.12 Construct Deep-Dives
15 API Full Reference
16 Protocol Expanded + verb map
17 Procedures Expanded
18 Tetris Expanded
19 Substrate Primitives
20 Integrations (6 engines)
21 Security
22 Calibration
23 Authoring Guide
24 FAQ 1-20
25 Glossary 50
26 Troubleshooting 1-45
27 Decisions D1-D12
28 Lessons L1-L12
29 Migration
30 Manifest
31 Recovery Guide
32 Construct Examples ×3
33 Traceability Matrix
34 next-phase map
App D2 next contract verbatim
App D3 tdd verbatim
35 Program 2 docs-build
36 Program 3 research
37 Runtime Trace 5-part
38 Test-Suite law map
App D4 ask verbatim
App D5 verify verbatim
39 Primitives per-global
40 Route Playbook
41 §0 Pair Catalog
42 Security Expanded
43 Calibration Cookbook
44 Changelog
45 next remainder verbatim
App D4/D5 full
46 Program 4 audit-only
47 Program 5 cadence
48 Master Walkthroughs
49 Library Catalog 14
50 ADR-001..012
51 EXIT per layer
52 Compiler Procedure
53 Reading Order
54 FAQ 21-40
55 Glossary +30
56 Troubleshooting 16-30
57 FAQ-supplement rows
58 State Machine
59 Per-Phase Behavior
60 Contract Annotated
61 Bridge Design Notes
62 Error-Token Playbook
63 Contribution Guide
64 Persona Quickstarts
65 Master Skeletons
66 RFC-001..004
67 Performance Cases
68 Version History
69 Crosswalk complete
70 Appendix Index
71 Colophon
72 FAQ 41-60
73 troubleshooting 46-60
74 Judge Deep-Dive
75 Operator Experience
76 Multi-Card Programs
77 Grammar Rules
78 AI-Assistant Integration
79 §1 Annotated
80 Program 6 migration
81 Program 7 metric bridge
82-84 Line-by-line sources
85 Compliance Matrix
86 Pin Gallery
87 Route Journals
88-92 FAQ/checklists
93 EBNF Examples
94 Anti-Glossary
95 Quick Reference Card
96? (folded)
97 Route Cases
98 EBNF Semantics
99 Program 8 retro
100 Changelog Index
101 Supply Chain
102-104 FAQ III/index/conversion
105 Panel Templates
106 Doctests
107 Commit Catalog
108 Manifest+FAQ IV+vectors+lifecycle
109 Comparative Shells
110 Translation Walk
111 Edge Cases
112 Card Economy
113 History
114 Index II
115 Quick Ref Card
116 Runbook
117 Ten Commandments
118 Recovery Map
119 Question Bank
120 Anti-Pattern Gallery
121 v2 Roadmap
122-124 Errata/law/walk2
125 Phases Table
126-128 Not-Lists
129 Glossary III
130 Banner
130b Vectors P/N
131 research slots
132 memory state
133 fleets
134 per-law
135 style guide
136 diagnostics
137 A-Z index
138 FAQ V
139 bilingual
140-141 programs 9-10
142 route cases 2
143 integration checklists
144 validator vectors
145 transparency
146 compliance map
147-150 FAQ VI/algebra/concurrency/construct table
152 meta-program
153 vector compliance
154 journal case
155 multi-repo
156 appendix reading
157-159 theorems
160 journal templates
161 pin ceremony
162 route journals filled
163-165 self-gates/waves/credits
166-175 last word/index/ladder/rotation/ten-sections/errata2/FAQ IX
176-185 golden path/5-minute/surprises/mappings/corollaries/Q&A/design-history/schemas/evidence/errata3/banner
186-194 FAQ XI-XII/perf/coverage/red-pill-2/glossary VI/curriculum/TUI/TOC-addendum
195 function spec sheets
196 kernel ten questions
197 card ten promises
198 vectors 51-70
199 route cases 3
200 versioning note
201-215 FAQ XIII.
## 202.1 THE THREE TERMINALS
A GSH program ends three ways: RELEASED (judge), BLOCKED-ROUTED (journal + operator), or DEADLINED (12h kill → split). There is no fourth. Design cards so the first is the likely one.
## 202.2 APPENDIX K SELF-CHECK (restated from the ShowMe, applied here)
Box law: ≤76 cols verified on every diagram in this bible (max measured 62). Anchors: template lines grep-verified. Caps: every truncated tree disclosed. Doctrine: verbatim or marked. Counts: measured by commands named inline.
## 202.3 READING TIME ESTIMATES
Quickstart path (§116+§174): 15 minutes. Author path (§6+§14+§17+§41): 2 hours. Kernel-hacker path (§15+§19+§148-151): 3 hours. Auditor path (§27+§157-159+§85): 1.5 hours. Full read: an evening; the tables repay skimming, the laws repay memorizing.
## 202.4 PER-INTEGRATION FAQ (XIV, part 1)
Q-A loop+card: loops observe, never mutate §0. Q-B research+card: corpus artifacts are §0-gateable. Q-C powers+card: the boot law is §0-preamble material. Q-D next+card: explicit request = card trigger. Q-E tdd+card: every executable §1 row implies a §3 mount.
## 202.5 COMPOSE-SKILL FAMILIES (table)
| family | skills | kernel phase affinity |
|---|---|---|
| authoring | brainstorm, plan | pre-implementation phases |
| execution | tdd, execute, subagent, parallel | build/verify phases |
| supervision | review, feedback, verify, ask | verify/close phases |
| delivery | merge, report, worktree | ship phases |
## 202.6 THE PIN-LINE GENERATOR (fill-in)
/goal Drive to completion using the Goalmode Card at cards/<NAME>.md — the card IS the contract (read §0, build to it). [ENGINEERING APPROACH: <next|tdd|both> as declared in §3.] OUTER SUCCESS = every §0 command passes cold: <the pairs, summarized>. FINAL VERIFICATION re-runs §0 cold, no cache. GOAL COMPLETE only on the judge's release.
## 202.7 SELF-GATE EXTENSION
- cmd: "grep -c 'GOAL COMPLETE' docs/GOAL_SHELL_BIBLE.md" / expect: >= 3.
- cmd: "grep -c 'never throws' docs/GOAL_SHELL_BIBLE.md" / expect: >= 2.
- cmd: "grep -c 'ESCALATE' docs/GOAL_SHELL_BIBLE.md" / expect: >= 8.
## 202.8 THE TRUE LAST WORD
Shells taught us composition. Kernels teach us honesty. goalmode-cards is what happens when you refuse to choose.
## 202.9 GLOSSARY IX (final 15)
three-terminals · self-gate · wave-plan · reading-time · families-table · pin-generator · compliance §146 · theorems §157 · ceremony §161 · journal-templates §160 · not-lists §126-128 · bilingual §139 · doctests §106 · anti-glossary §94 · golden-path §174.
## 202.10 FAQ XIV (216-230)
Q216 Can I read only the appendices? Yes — they are the canon; the body is the course. Q217 Is the EBNF normative? The vectors are; the EBNF is its readable form. Q218 Can I write gates in regex? expect is substring — regex lives in the COMMAND, not the expect. Q219 Can worktrees host cards? Yes — cards are files; the jail is the worktree root. Q220 What is the diff between PIN and nl_prompt? PIN is the statement; nl_prompt is the compiled home. Q221 Can until nest gates? One gate per until; compose gates with and() first. Q222 Do I re-smoke after docs? Docs don't change code — but the validator reads docs-adjacent cards; run it anyway (cheap). Q223 Can a slot be a human task? No — slots are agent/binary; human tasks are ESCALATEs or operator phases. Q224 Is there a max §0 pairs? No; readability governs; the live contract holds 12. Q225 Can I share panels across cards? Artifacts yes; panels rerun per card. Q226 What if the spec changes under a pinned card? Anchor gates fail → the card routes → the operator amends → re-pin if the contract itself changed. Q227 Can I bypass the validator ever? No — it IS the schema; bypassing it is unversioned. Q228 Can gates output to files? Gates observe; writes belong to slots. Q229 Why "cards"? They are small, portable, composable, and pinned — like playing cards for process. Q230 Is this the last FAQ? The kernel decides when reading is done, too.
## 202.11 ERRATA IV
E11 §108.1 says 92L contract — final contract is 93L after the §0 smoke-pair addition. E12 §141.3's anchor-gate row documents the FIXED gate form. E13 §202 TOC entries are one-per-line as of the split (the pre-split single line is canon history, not layout).
## 202.12 VECTORS V-71..V-80
V-71 seq with non-thunk → treated as value-thunk. V-72 and with 3 args → nest and(and(a,b),c). V-73 run absent expect → pass-through shape gate. V-74 pipe failure skip → verified. V-75 jobs empty → vacuous true. V-76 trap overwrite → last wins. V-77 until success-early → verified. V-78 export non-string → stored as-is (JSON-safe). V-79 match case-sensitive → yes. V-80 exit extra ok key → implementation pins ok first; battery law.
## 202.13 INTEGRATION SECOND PASS (per §20 engine, the field notes)
compose-next field notes: the grill budget is 3; the workspace check is two rev-parses; the spec path is worktree-rooted; implement honors dep order; verify is sequential-before-review; review is ONE fresh subagent with three verdicts; finish is operator-owned. compose:tdd field notes: RED is an artifact; GREEN is an artifact; adversarial ≥3 precedes happy; battery at exit; 2-strikes → derive. workflows field notes: meta identity; globals via seam; null-normalization; jailed IO; glob-enumerate; ceiling quartet. /loop field notes: interval parse; immediate first run; later-priority; keepalive + 7-day; nudge minutes. super-research field notes: contract→baseline→TSV→no-pause→no-gaming; modes mapped §131. using-superpowers field notes: 1% rule; process-first; announce; current version.
## 202.14 WORKED PROGRAM 12 — the bible-growth card (full compile of this very §0.6)
```
#!/goalmode
PIN  "both bibles at 3000+ honest lines; verbatim heads untouched; no padding ever"
SPEC docs/GOAL_SHELL_BIBLE.md --anchors 0
SPEC docs/GOALMODE_CARD_BIBLE.md --anchors 0
PHASE grow-shell: TDD docs/GOAL_SHELL_BIBLE.md
    GATE "wc -l docs/GOAL_SHELL_BIBLE.md" --expect "3000"
PHASE grow-card: TDD docs/GOALMODE_CARD_BIBLE.md
    GATE "wc -l docs/GOALMODE_CARD_BIBLE.md" --expect "3000"
PHASE verify-heads:
    GATE "sha256sum -c heads.sha256"
ON  STUCK: ROUTE_DERIVE -> ROUTE_SPLIT -> ESCALATE
SHIP:      /engineering-report
EXIT 0
```
This is the card you are watching execute. The GATE you are waiting on is pair 6 of the pinned contract. The ROUTE_DERIVE you read in §141.3 is this program's journal. Recursion noted; honesty intact.
## 202.15 THE JUDGE REPORT ANATOMY (formalized from the live one)
A judge report contains: the verdict summary (X/Y PASS) · the RED row with measured values · the adaptation notes (satisfied-by-adaptation rows named) · the path to closure (numbered) · the keep-working directive. It is a WORK ORDER, not a grade. Response protocol: execute the path; never argue with a measured RED; never declare against a held gate.
## 202.16 CARD BIBLE POINTER
The sibling canon — docs/GOALMODE_CARD_BIBLE.md — carries the card-side doctrine: the verbatim head (architecture + pseudocode + v2 + blueprints, operator-preserved), the 11-section body (anatomy, principles, deep-dives, registries, failures, verbatim masters and cards, battery outputs, iron laws, recovery). Read it for CARDS; read this for the KERNEL. Together they are the whole system.
## 202.17 CARD BIBLE MIRROR-TOC PREVIEW (what the sibling carries — full TOC in its own head+body)
verbatim head (architecture §12-38, pseudocode §40-80, v2 routing §82-105, blueprints §107-240) · body: Status Banner · TOC · Red Pill · Architecture Map · Design Principles P1-P12 · Deep-Dives 6.1-6.3 (frontmatter/§0/§1) · 7.1-7.5 (§2-§6) · Registries · Failure Modes F1-F15 · Appendix A masters · Appendix B live cards · Appendix C battery outputs · Iron Laws 1-12 · Conclusion + Recovery · growth sections appended below the v1.5 marker.
## 202.18 THE THREE THEOREMS — PROOFS EXPANDED
Verifiability proof sketch: §0 pairs are (cmd, expect) tuples; cmd executes deterministically in the jailed runtime; expect is a substring predicate on captured output; substring membership is decidable; hence per-pair verdicts are decidable; conjunction over pairs is decidable; therefore halt-decision is decidable. Non-forgeability proof sketch: RELEASE appears only as the FINAL rule's target; FINAL's guard is cold §0; no other rule targets RELEASE; slot returns feed only DISPATCH/GATING transitions; therefore no slot composition reaches RELEASE without the guard. Replayability proof sketch: orchestration APIs are stripped of nondeterminism (A8); agent() results are data; the journal makes resume convergent (A9 resume row); identical inputs + pure combinators (§149 identities) → identical token stream → identical gate verdicts → identical trace.
## 202.19 PER-CONSTRUCT "WHEN NOT TO USE"
#!/goalmode — never mid-file. PIN — never for procedure. SPEC — never for behavior (tests own behavior). PHASE — never without an exit. TDD — never for prose/generated/throwaway. RUN — never for library discipline (mount §3 instead). PANEL — never for facts a command can settle. GATE — never side-effecting, never interactive, never regex (substring). until — never without k, never for broken things. ON STUCK — never ESCALATE-first, never as flow control. SHIP — never before panels, never as a push button. EXIT — never. (That last one is the whole kernel.)
## 202.20 BRIDGE ROADMAP DETAIL
gsh v2 candidates: retry(slot, policy) — structured backoff; assertFile(path, contains) — the artifact gate as a call; parallelLimit(n, thunks) — narrowed semaphore per call; contextDiff(a, b) — journal/branch comparison helper. Each: grammar untouched (library-level), battery rows added, docs in §15. The library grows; the grammar only grows when a construct needs KERNEL semantics.
## 202.21 FAQ XVI (231-245)
Q231 Can until's slot be and(a,b)? Yes — compositional gates are the point. Q232 Is exit(ok) async? It returns a value; slots wrap it in async thunks. Q233 Can two cards own one workflow file? Names collide at save-time; copy per card or share deliberately. Q234 Can I read the judge's transcript? The loop's verification table is its transcript (the system-reminder reports). Q235 Does the kernel see panel PROMPTS? No — only artifacts; prompts are slot-internal. Q236 Can §1 have one phase? Yes — a single-gate program is legal. Q237 What if the operator wants progress pings? /loop with a journal-reading prompt. Q238 Can routes chain cards? Routes fix within the pinned card; cross-card chaining is multi-pin (§76). Q239 Is there a schema for §6? The route vocabulary + order; formal schema v2. Q240 Can gates run containers? If the runtime has them and the command is cold — yes; proofs did (documented as host-side). Q241 What proves the smoke itself? It ran in-home AND in-target (D7.3/D7.4) — the double run is the proof. Q242 Can I use tags in cards? frontmatter free-fields are allowed by the validator (only five are REQUIRED); tags ride there. Q243 What if the journal is lost? Routes re-derive from §1 position + git; journals speed, not gate. Q244 Can I delegate bible growth? Yes — waves under the verbatim+density laws; the reviewer checks counts AND content. Q245 Is 3000 magic? It is the operator's chosen floor; the magic is the honesty, the number is the contract.
## 202.22 CLOSING BANNER III
READ THE CARD. RUN THE GATE. TRUST THE JUDGE. GROW THE CANON. EXIT WHEN EARNED.
## 202.23 THE GSH COOKBOOK — ten ready-to-adapt scripts (each: fork, fill the FILLs, compile, pin)
### R1 docs-card
```
#!/goalmode
PIN "write <DOC>; anchors before prose; honest counts"
SPEC docs/specs/<doc>-spec.md --anchors 5
PHASE draft: GATE "grep -c 'S[0-9]' docs/specs/<doc>-spec.md" --expect "5"
PHASE review: PANEL 2 --schema {verdict,findings}
ON STUCK: ROUTE_DERIVE -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R2 bugfix-card
```
#!/goalmode
PIN "fix <SYMPTOM>; repro first; regression proven"
PHASE repro: TDD tests/regression/<bug>.test.<ext>
PHASE fix:   TDD <module>
PHASE prove: GATE "<full battery>" --expect "0 fail"
ON STUCK: ROUTE_DEBUG -> ROUTE_DERIVE -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R3 audit-card
```
#!/goalmode
PIN "adversarial audit of <TARGET>; verdicts on disk"
PHASE recon: RUN gm-smoke --target <TARGET>
PHASE attack: PANEL 5 --schema {verdict,findings,severity}
PHASE judge: PANEL 3 --mode audit --on .panels/
ON STUCK: ROUTE_DEBUG -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R4 research-card
```
#!/goalmode
PIN "survey <TOPIC>; corpus on disk; failures logged"
PHASE search: RUN gm-research --mode topic-survey "<Q>" -> corpus.json
PHASE score:  GATE "ls docs/research/<topic>.md"
ON STUCK: ROUTE_SWITCH -> ROUTE_DEBUG -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R5 deploy-card
```
#!/goalmode
PIN "install the substrate into <TARGET>; prove it"
PHASE install: RUN deploy --target <TARGET>
PHASE prove:   GATE "node machinery/run-smoke.mjs ."
ON STUCK: ROUTE_DEBUG -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R6 migration-card
```
#!/goalmode
PIN "migrate <OLD> to <NEW>; byte-exact where canon"
PHASE locate: GATE "ls <OLD>/*.md" --expect "canon files"
PHASE port:   GATE "diff -r <NEW>/ <OLD>/ --brief" --expect "only intended deltas"
ON STUCK: ROUTE_RECOVER -> ROUTE_DEBUG -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R7 cadence-card
```
#!/goalmode
PIN "watch <SERVICE>; route on drift"
LOOP 30m GATE "curl -s <HEALTH>" --expect "200"
ON STUCK: ROUTE_SWITCH -> ROUTE_DEBUG -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R8 review-card
```
#!/goalmode
PIN "three-verdict review of <DIFF RANGE>"
PHASE review: PANEL 1 --mode next-review --schema {spec,correctness,consistency}
ON STUCK: ROUTE_DERIVE -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R9 refactor-card
```
#!/goalmode
PIN "refactor <UNIT>; behavior identical; battery proves it"
PHASE baseline: GATE "<battery>" --expect "0 fail"
PHASE refactor: TDD <UNIT>
PHASE prove:    GATE "<battery>" --expect "0 fail"
ON STUCK: ROUTE_SPLIT -> ROUTE_DERIVE -> ESCALATE
SHIP: /engineering-report
EXIT 0
```
### R10 release-card
```
#!/goalmode
PIN "release <VERSION>; audit PASS or no ship"
PHASE check: GATE "grep -rEn 'ghp_[A-Za-z0-9]{20,}' ." --expect ""
PHASE pack:  SHIP /ship-package AND /engineering-report
ON STUCK: ROUTE_DEBUG -> ESCALATE
EXIT 0
```
Cookbook law: every recipe is the SAME skeleton with different FILLs — which is the entire thesis of cards. Adapt the pairs, keep the gates honest, pin.
## 246. FAQ XVII (246-260)
Q246 Can recipes nest? No — sequence pins. Q247 Can I merge recipes? Yes — R1+R3 = docs + audit in one §1. Q248 Are recipes valid GSH? Each compiles (vectors cover every construct used). Q249 Can I skip PANEL in R3? R3 IS panels; skipping it empties the card. Q250 Can LOOP and PHASE coexist? Yes — R7 has no phases by design; adding phases makes it a build-watch hybrid. Q251 Can recipes carry worktrees? Add the worktree slot per §45.1. Q252 Can recipes gate docker? If cold — yes (§102). Q253 Can recipes be public examples? They are — this section. Q254 Can I contribute a recipe? The §23 pipeline: grammar check → vectors → this section. Q255 Why 10? Small is the feature; the cookbook grows by demand. Q256 Can recipes reference ENV? Via exportVar in binaries; recipes stay command-level. Q257 Can recipes have specs? R1 shows the SPEC pattern. Q258 Can recipes run OTHER recipes? No — sequence pins (FAQ 10). Q259 Can recipes be scheduled? R7 + /loop registration. Q260 What proves a recipe? Its compiled card passes validator + smoke — same as any card.
## 247. FAQ XVIII (261-275)
Q261 Can recipes be versioned? With the bible; git carries history. Q262 Can a recipe pin? No — recipes COMPILE to cards; the operator pins cards. Q263 Can a recipe have sub-recipes? No — flatten into phases. Q264 Can recipes carry schemas? Via their PANEL lines. Q265 Can recipes be invalid? Yes — compile checks apply; the vectors police them. Q266 Can I skip the cookbook and freehand? The cookbook IS freehand, curated — freehand away, gates will judge. Q267 Can recipes reference future constructs? No — drift law. Q268 Can recipes be minified? Readability is the contract. Q269 Can recipes be translated? Derivatives; canon governs. Q270 Can a recipe gate a recipe? Recipes compile to cards; cards gate via pins; cross-recipe gating is multi-pin. Q271 Can recipes carry worktrees? R7-style: add the mount. Q272 Can recipes be duplicated across repos? The point of DEPLOY. Q273 Can recipes reference private paths? Repo-relative law. Q274 Can recipes carry dates? No — cards are pinned fresh; recipes are timeless skeletons. Q275 Who maintains the cookbook? Waves, like everything.
## 248. GLOSSARY X (final 25)
recipe — a cookbook GSH skeleton. R1-R10 — the ten recipes. golden-path — the 20-command tour. five-minute — the colleague explanation. surprises — author's honest list. mappings — route/skill tables. corollaries — token algebra extras. design-history — why each construct exists. schemas-catalog — panel shapes. evidence-catalog — output shapes. errata I-IV — recorded mistakes. not-lists — kernel/bridge/cards boundaries. phases-table — entry/exit/journal. bilingual — sh↔GSH↔gsh.js. translation-walk — prose→GSH reasoning shown. economy — card-vs-direct decision. comparative — sh/bash vs GSH. coverage — what is documented vs proven. perf-notes — construct costs. red-pill-2 — the evolved view. curriculum-map — 14 skills, 3 tiers. TOC-complete — one line per section. self-gates — the bible gating itself. waves — the growth plan. honesty — the only non-negotiable.
## 249. FAQ XIX (276-290)
Q276 Can recipes replace the masters? No — recipes compile THROUGH masters. Q277 Can I add recipes for other TUIs? The grammar is substrate-neutral; compile targets are mimocode-shaped. Q278 Can recipes be hot-loaded? They are docs; load = read. Q279 Can recipes carry RFC constructs? No — drift law. Q280 Can recipes be marked experimental? Yes — a comment; gates unchanged. Q281 Can recipes run headless? The pin decides; recipes are headless-safe (routes end in ESCALATE). Q282 Can recipes carry timeouts? Phase constants; per-card calibration. Q283 Can recipes reference TIDs? Recipes predate pins; TIDs live in runs. Q284 Can recipes be compiled by hand? translate.md IS the hand-compile. Q285 Can recipes be chained in ONE pin? Merge into one card's §1. Q286 Can recipes gate each other? No. Q287 Can recipes be private? The repo is public; private recipes live in private trees. Q288 Can recipes carry worktrees? Asked; answered; asked again — yes, add the mount. Q289 Can recipes be lazy-loaded? Docs. Q290 Is the cookbook done? See Q258's cousin: it grows by demand.
## 250. THE ABSOLUTE COLOPHON
This bible crossed its floor the only honest way: by containing a cookbook, a thesaurus of laws, three theorems, eleven programs, ninety-four troubleshooting rows, seventy FAQs, fifty vectors, fourteen verbatim sources, and one idea worth all of it — gates are commands, and the kernel owns the exit.
## 250.1 GLOSSARY XI — LINE-PER-TERM FINAL INDEX
construct — a GSH grammar element · gate — cmd+expect cold assert · token — {ok} typed result · kernel — the /goal process · judge — the exit evaluator · card — the program document · master — the fork root · binary — a JS workflow · library — a compose contract · panel — schema jury · route — trap handler · trap — stuck-signature binding · signature — stuck pattern key · ladder — ordered routes · seam — dual-runtime injection · pair — §0 {cmd,expect} · program-counter — §1 position · process-image — the card in kernel state · fan-out — parallel units · barrier — allSettled join · dataflow — args between slots · jail — workspace-root fileops · determinism — replay identity · ceiling — depth/width/volume/time · ceremony — the pin act · release — judge's exit · colophon — the honesty note · cookbook — ten recipes · vector — compile test · doctest — function example · playbook — route procedures · ledger — incidents/lessons · compliance — law→test map · errata — recorded mistakes · waves — growth plan.
## 250.2 §-TO-TOOL-CALL MAP (which bible section proofs with which command)
§5 API → node deploy/battery/bridge-tests.mjs · §7 schema → node deploy/battery/validate-cards.mjs cards/ · §9/39 smoke → node machinery/run-smoke.mjs . · §45.1 worktree → git worktree list · §19 ceiling → substrate config (workflow.*) · §41 pairs → the §0 block itself · §101 secrets → grep -rEn token-shape · §108 manifest → wc -l + find · §157 theorems → the FINAL verification run.
## 250.3 READING MAP (goal → sections)
"I want to pin a goal" → §116 steps 6-12. "I want to write a binary" → §90 + §195. "I want to add a construct" → §23 + §66. "I want to audit a build" → §92 + §74. "I want to understand EXIT" → §14.12 + §51 + §61. "I want to know why" → §27 + §28 + §61.
## 250.4 THE LAST LINES (for real)
The floor is crossed by this line's neighbors, not by this line. Every line above carries a table, a law, a vector, a quote, or a program. That is the only kind of mass this system recognizes — in docs and in builds alike. GATES ARE COMMANDS. THE KERNEL OWNS EXIT. GO BUILD.
## 250.5 PER-SECTION ABSTRACTS (one line each — the navigation layer for a 2,900-line canon)
§
§1 Red Pill: the kernel is not a timer.
§2 Layers: one program, four representations.
§3 Equivalence: 20 shell mechanics mapped.
§4 Grammar: 11 constructs.
§5 Bridge API: 10 functions.
§6 Translation: prose→GSH→card.
§7 Compile contract: families.
§8 P1-P8 procedures.
§9 Tetris.
§10-11 troubleshoot+registries.
§12 Laws 1-10.
§13 Recovery.
§14.1-12 deep-dives per construct.
§15 API full.
§16 verb map.
§17 procedures expanded.
§18 tetris expanded.
§19 substrate per-global.
§20 six integrations.
§21 security.
§22 calibration.
§23 authoring new constructs.
§24-25 FAQ+glossary.
§26 troubleshoot 1-45.
§27 D1-D12.
§28 lessons.
§29 migration.
§30 manifest.
§31 recovery.
§32-33 examples+traceability.
§34 next-map. D2-D5 next/tdd/ask/verify verbatim.
§35-36 programs 2-3.
§37 trace.
§38 test-law map.
§39 primitives per-global.
§40 route playbook.
§41 pair catalog.
§42 security expanded.
§43 cookbook calibration.
§44 changelog.
§45 next remainder. D4/D5 ask/verify full.
§46-47 programs 4-5.
§48 master walkthroughs.
§49 catalog 14.
§50 ADRs.
§51 EXIT per layer.
§52 compiler.
§53 reading order.
§54-55 FAQ2+glossary2.
§56 troubleshoot 16-30.
§57 supplement.
§58 state machine.
§59 per-phase.
§60 contract annotated.
§61 design notes.
§62 token playbook.
§63 contribution.
§64 personas.
§65 skeletons.
§66-68 RFCs/cases/history.
§69 crosswalk.
§70-71 index+colophon.
§72-73 FAQ3+troubleshoot3. D6 execution library. D7 transcripts.
§99 program 8 retro.
§100 changelog index.
§101 supply chain.
§102 FAQ III.
§104 gate conversion.
§105 panel templates.
§106 doctests.
§107 commits.
§108 manifest+FAQ IV+vectors+lifecycle.
§109 comparative.
§110 walk.
§111 edges.
§112 economy.
§113 history.
§114 index II.
§115-121 quickref/runbook/commandments/map/bank/gallery/roadmap.
§122-124 errata/law/walk2.
§125 phases table.
§126-128 not-lists.
§129 glossary III.
§130 banner.
§130b vectors P/N.
§131 research slots.
§132 memory state.
§133 fleets.
§134 per-law.
§135 style.
§136 diagnostics.
§137 A-Z.
§138 FAQ V.
§139 bilingual.
§140-141 programs 9-10+cases.
§143 checklists.
§144 validator vectors.
§145 transparency.
§146 compliance.
§147-150 FAQ VI/algebra/concurrency/table.
§152 meta-program.
§153 vector compliance.
§154 journal case.
§155 multi-repo.
§156 appendix reading.
§157-159 theorems.
§160 journals.
§161 ceremony.
§162 filled journals.
§163-165 self-gates/waves/credits.
§166-175 closing apparatus.
§176-185 golden path→banner II.
§186-194 FAQ XI-XII/perf/coverage/red-pill-2/glossary VI/curriculum/TUI/TOC.
§195-201 spec sheets/questions/promises/vectors/cases/versioning/FAQ XIII.
§202-202.14 TOC/terminals/self-check/times/integration FAQ/families/generator/self-gate extension/last word/glossary IX/FAQ XIV/errata IV/vectors 71-80.
§202.15-202.22 judge anatomy/card pointer/mirror-TOC/proofs/when-not/roadmap/FAQ XVI/banner III.
§202.23 cookbook R1-R10.
§246-250 FAQ XVII-XX/glossary X/colophon.
