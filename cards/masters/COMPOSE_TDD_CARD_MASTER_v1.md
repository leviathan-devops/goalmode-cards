---
card: compose-function-v1
version: 1
forked-from: COMPOSE_TDD_CARD_MASTER_v1.md
mode: build
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
