---
card: compose-function-v1
version: 1
forked-from: COMPOSE_NEXT_CARD_MASTER_v1.md
mode: build
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
