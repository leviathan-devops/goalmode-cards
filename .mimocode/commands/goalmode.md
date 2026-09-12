---
description: Goalmode card operations — fork a master, fill §0-§6, validate, smoke, and hand back the pin-ready card
---

Fork and fill a Goalmode Card per the goalmode-card skill:

1. Ask the operator for the goal (WHAT + evidence shape), or take it from $ARGUMENTS.
2. Fork `cards/masters/GOALMODE_CARD_MASTER_v1.md` to `cards/<name>.md`.
3. Fill §0 as cmd/expect command pairs (never prose), §1 phase graph, §2/§3 slots, §6 routing.
4. Run `node deploy/battery/validate-cards.mjs cards/` and `workflow run gm-smoke`.
5. Hand the operator the pin line: `/goal Drive to completion using the Goalmode Card at cards/<name>.md — the card IS the contract (read §0, build to it).`
