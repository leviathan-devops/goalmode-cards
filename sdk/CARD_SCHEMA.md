# CARD_SCHEMA — the GM Card document schema (v1)

## Frontmatter (ALL families)
| field | required | values |
|---|---|---|
| card | yes | goalmode-v1 \| js-workflow-v1 \| compose-function-v1 |
| id | yes | unique slug |
| version | yes | integer |
| forked-from | yes | lineage master name |
| mode | yes | build (executing agent mode) |

## goalmode-v1 sections (in order)
§0 GOAL CONTRACT — outer_success[] of {cmd, expect} command pairs +
nl_prompt + anti_cheat line. THE KERNEL SURFACE: prose here is invalid.
§1 PHASE GRAPH — table: #, phase, engine (js|compose), slot ref, entry, exit.
§2 JS WORKFLOW SLOTS — slot/card/args + fail_route retry(2) -> §6 route.
§3 COMPOSE FUNCTION SLOTS — slot/card (tdd|next)/trigger + micro_loop.
§4 REVIEW PANELS — adversarial (schema {verdict,findings}), 3-juror, final cold.
§5 SHIP GATES — /ship-package + /engineering-report.
§6 RECOVERY + ROUTING — stuck_signatures, ordered routes, ESCALATE last,
compaction re-entry.

## js-workflow-v1
meta{name[A-Za-z0-9._-], description, phases[], permissions[]} +
export default async function (g = globalThis) — g carries the sandbox
globals (glob/readFile/phase/log); default keeps substrate compatibility,
explicit injection keeps node testability.

## compose-function-v1
function: (compose:tdd | compose-next) + trigger + contract body +
micro_loop + fail_route. See cards/masters/.

Validator: deploy/battery/validate-cards.mjs (family-aware, exit 1 on
any FAIL). Schema evolution rule: the validator IS the schema; masters
must always pass it.
