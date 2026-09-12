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
