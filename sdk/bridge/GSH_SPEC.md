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
