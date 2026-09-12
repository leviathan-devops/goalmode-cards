# COMPOSE FUNCTIONS — OPERATORS MANUAL
What this is: operating manual for the library calls a card mounts in §3 — compose:tdd (micro) and compose-next (macro). These are skill contracts, not code; the card's trigger is their invocation.

compose:tdd (micro discipline — every executable artifact):
1. State the behavior contract (inputs/outputs/edges) BEFORE tests.
2. Write the failing test FIRST. Run it. RED is recorded (its output is an artifact).
3. Implement the MINIMUM. Run. GREEN recorded.
4. Adversarial >= 3 (empty, boundary, malformed, concurrency) BEFORE the happy path; happy path runs LAST as confirmation.
5. Fresh battery before slot exit. No RED on record = no implementation happened.
6. After 2 failed fixes: stop patching → ROUTE_DERIVE (re-derive from first principles).
Skips (contract-sanctioned): generated code, config-only, throwaway prototypes, explicit user direction.

compose-next (macro contract — repo-scale phases; Build agent; explicit request = the card's trigger):
orient (read repo before asking) → grill (one decision axis per turn, question tool, recommended-first; headless picks resolve) → workspace (.worktrees/<slug>; never main without consent) → spec (docs/compose/spec/<feature>.md; S1 Problem/S2 Design/S3 Out of Scope; tasks with acceptance/covers/depends, acyclic; anchors stable) → implement (dependency order; tdd slots inside) → verify (fresh runs recorded; PRE-EXISTING marked) → review (ONE fresh subagent; three verdicts: spec compliance / correctness / codebase consistency; criticals loop; non-convergence → impasse report, never forced pass) → finalize (status delivered; Report block: what was built / verification / journey log <=5) → finish (OPERATOR picks: merge / PR / push-only / keep).
Failure modes: boundary violation (compose-next in legacy compose — cards declare mode: build); blind feedback implementation (verify each item first); autonomous push (finish is operator-owned).
Golden rule: the macro contract structures the build; the micro discipline makes every unit honest. Neither substitutes for §0 — the kernel judges, they only build.
