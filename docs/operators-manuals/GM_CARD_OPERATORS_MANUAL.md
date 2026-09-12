# GM CARD — OPERATORS MANUAL
What this is: the operating manual for forking, filling, validating, pinning, and living with Goalmode Cards. Audience: an engineer who has never seen one. Companion: docs/GOALMODE_CARD_BIBLE.md (canon), sdk/CARD_SCHEMA.md (schema).

1. MENTAL MODEL. A card is a program the /goal kernel executes. You write the contract (§0), the kernel enforces it. You do not ask the kernel to stop; it stops when §0 verifies cold.
2. FORK. cp cards/masters/GOALMODE_CARD_MASTER_v1.md cards/<name>.md. Fill id/version/forked-from/mode. Never edit masters — fork them.
3. FILL §0. Write nl_prompt (one sentence: WHAT + evidence shape). Then every done-condition as a pair:
     - cmd: "python3 -m pytest tests/ -q"
       expect: "0 fail"
   Rules: commands run from project root; expect is a substring; pin counts ("12 pass" not "pass"); no side effects in gates; every pair balanceable.
4. FILL SLOTS. §2 one row per deterministic binary (name/args/fail_route). §3 one row per library contract (tdd for every executable unit; next for repo-scale phases). §4 panels with schemas + artifact paths. §6 routes ordered, ESCALATE last.
5. FILL §1. One row per phase; engine matches the slot family; entry/exit mechanical; cheapest-blast-radius first.
6. VALIDATE. node deploy/battery/validate-cards.mjs cards/ → PASS count all, FAIL 0. Fix until green — the card is code.
7. SMOKE. node machinery/run-smoke.mjs . → {"ok": true}. (Substrate-native: workflow run gm-smoke.)
8. PIN. Hand the operator: /goal Drive to completion using the Goalmode Card at cards/<name>.md — the card IS the contract (read §0, build to it).
9. OPERATE. The loop runs phases, gates, panels, ship. Your job: answer forks (question tool), stay absent otherwise — headless picks recommended options and journals them.
10. CLOSE. When §0 passes cold after the final panel, the kernel releases. You pick the close: merge / PR / push / keep.
Common failures: prose gates (validator rejects), [FILL] leaked into pinned cards (smoke rejects), dangling §1 slot refs (first dispatch nulls), ESCALATE-first routing (autonomy lost). All fifteen: bible section 9.
Golden rule: if you cannot write the command that proves done, you do not know what done is — settle that before pinning.
