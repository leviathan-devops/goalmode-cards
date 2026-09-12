# RE-REVIEW — goalmode-cards @ e344cb5 (fixes for first-review C1, C2, C3, M1-M3, CONS-1..4)

Reviewer: fresh re-review of the affected areas only. All evidence re-run by this reviewer at HEAD `e344cb5`
(clean tree), labs in /tmp built fresh and deleted after every run.

---

## PER-FIX VERDICTS

### 1. C1 (vacuous bridge battery) — **FIXED**

Evidence:
- `deploy/battery/bridge-tests.mjs:12-15` — `T` is now `async` and `await fn()`s the body; PASS is pushed only
  after the assertions actually ran.
- `:18-68` — every test site is `await T(...)`.
- `:73` — `process.exitCode = fail ? 1 : 0` (no premature `process.exit`; pending microtasks drain before exit).

Mutation protocol (your spec, executed verbatim):
- Restore-scenario: real `sdk/bridge/gsh.js` → **12/12 PASS, exit 0** (run in-repo and in the /tmp lab copy; both
  exit 0, and the lab's restored-to-real sanity run also exited 0).
- Mutant-AND (`and()` always runs b and returns b's result — never short-circuits) →
  `FAIL and short-circuit :: true !== false` printed as a row, **exit 1**.
- Mutant-OLDSEQ (pre-fix short-circuiting `seq` restored) → caught by the NEW row:
  `FAIL seq returns b result :: undefined !== 'b'`, **exit 1** — the two new seq rows genuinely bite.
- Mutant-RUNPOL (`run` expect polarity inverted) → `FAIL run gate polarity :: false !== true`, **exit 1**.
- 12 rows total (10 original + `seq runs b always` + `seq returns b result`; the old vacuous `seq order` was
  replaced by `seq order kept` with a real assertion at :26).

The battery can now go red for every async law it names. C1 is closed.

### 2. C2 (js-workflow family substring bypass) — **FIXED**

Evidence (`deploy/battery/validate-cards.mjs:39-42`):
- `name:` check now anchored `^\s*name:\s*"(\[FILL[^\]]*\]|[A-Za-z0-9._-]+)"` — line-start, quoted, charset or
  `[FILL]` placeholder.
- `description:` anchored `^\s*description:\s*\S`.
- `export default async function` checked in frontmatter-stripped body (`:41-42`).

Adversarial re-run:
- **BAD5** (original bypass: `nickname: "x"` + `self-description:` + prose-mention export) → **FAIL** with all
  three errors named: `meta.name missing or bad charset; meta.description missing; no default export`. ✓
- Real cards: validator 6/6 PASS, exit 0 — no false rejections introduced. ✓

**NEW residual finding (N1 — MINOR)**: probe BAD5b — legit-looking `name: "bad5b-flow"` +
`description: looks structured, is prose` + a FLUSH-LEFT, UNFENCED prose line
`export default async function () { ... }` → **PASSES**. The export check strips only frontmatter, so any
line-start prose mention satisfies it, while the fix's own comment (:41 "export must live in code, not prose")
claims more. Mitigating context: the family's own master (`cards/masters/JS_WORKFLOW_CARD_MASTER_v1.md`) authors
its export flush-left unfenced in markdown — line-start IS the family's convention — and the attacker must now
author two real frontmatter fields plus the marker line. Not a regression; residual shallowness, honestly scoped.

### 3. C3 (section presence inside code fences) — **FIXED for closed fences**

Evidence (`validate-cards.mjs:29`): `const unfenced = text.replace(/```[\s\S]*?```/g, '')` applied before
section presence and before §0 pair extraction (:32).

Adversarial re-run:
- **BAD6** (original: entire §0-§6 contract inside a closed ``` fence) → **FAIL** with all seven
  `missing section ## §N` errors + `§0 has no cmd pairs` + `§0 missing nl_prompt`. ✓

**NEW finding (N2 — MAJOR)**: probe BAD6b — identical fake contract inside an **UNCLOSED** fence → **PASSES**.
The strip regex requires a closing ```; an unterminated fence never matches, nothing is stripped, and the fake
`## §0 … ## §6` block counts as real. This is the same class as the original C3 (a prose card whose contract is
a quoted example passes validation, contradicting GSH_SPEC.md:24 "A prose gate is invalid (validator rejects)").
Fix is one line-class away: also strip an unterminated trailing fence (e.g. `text.replace(/```[\s\S]*$/, '')`
after the pairwise strip, or a fence-parity pass).

### 4. M1 / M2 / M3 — **FIXED**

- **M1**: `sdk/bridge/gsh.js:13-15` — `seq(a,b)` is now `async () => { await a(); return b(); }`:
  b runs unconditionally (shell `a; b` semantics), result is b's. Pinned by the two new battery rows
  (`seq runs b always`, `seq returns b result`); mutation-verified both ways (Mutant-OLDSEQ caught; real 12/12).
  The seq≡and duplication is gone — `and()` (:17-19) keeps short-circuit semantics, distinct again.
- **M2**: unused `failIO` stub removed from bridge-tests.mjs (was :16). Confirmed absent in the new file.
- **M3**: unused `get` helper removed from validate-cards.mjs (was :25). Confirmed absent (:25 is now the
  required-keys loop).

### 5. CONS-1..4

- **CONS-1 — FIXED**: `reports/GoalShell_Tetris_ShowMe.md` now exists — **exactly 242 lines**, matching the
  GOAL_SHELL_BIBLE.md:683 catalog claim "(242L)" and README:48's pointer. The 9 dangling references now resolve.
- **CONS-2 — FIXED**: README battery commit row now reads "live HEAD (see git log; review-fix series on main)" —
  the falsifiable pinned sha (9800653) is gone; the row can no longer go stale by construction.
- **CONS-3 — FIXED**: README FILE MANIFEST now shows GOAL_SHELL_BIBLE (3,004L, floor MET) and
  GOALMODE_CARD_BIBLE (3,010L, verbatim head preserved, floor MET) — matches measured wc (3004/3010) and the
  DOCS FLOORS note. The manifest/floors-note self-contradiction is gone.
- **CONS-4 — NOT-FIXED**: the DOCS FLOORS note density row is byte-identical to the first review
  ("37 worked fragment pairs, 110 FAQs, 100 glossary terms, 55 troubleshooting rows"). Recounted exactly:
  fragments **37 ✓** (exact), glossary **100 ✓** (exact, 50+50), FAQs **120 actual** vs "110" claimed
  (underclaim — honest direction, but still not the measured number), troubleshooting **50 actual**
  (25 §34 + 25 §44, header rows excluded) vs **"55" claimed — overclaim by 5 stands**. The request said
  "corrected where wrong"; the wrong number was not corrected.

---

## NO-REGRESSION VERIFICATION AT e344cb5 (all re-run cold)

| gate | result |
|---|---|
| `node deploy/battery/validate-cards.mjs cards/` | PASS count 6, FAIL count 0, exit 0 |
| `node deploy/battery/bridge-tests.mjs` | 12/12 PASS, exit 0 |
| `node machinery/run-smoke.mjs .` | `{"ok": true, "checked": 5}`, exit 0 |
| `node deploy/battery/deploy-proof.mjs` | 8/8 + `SMOKE-IN-TARGET: {ok:true} PASS` + `DEPLOY PROOF: clean target verified, substrate operational`, exit 0 |
| `grep -rEn 'ghp_[A-Za-z0-9]{20,}' .` | no output — clean |
| verbatim head `head -n 239 docs/GOALMODE_CARD_BIBLE.md \| sha256sum` | `a1eee52ccc8dd1b513f975598212adaff93e5778a2e81e97fc571b11f5a48edb` — byte-exact, intact through the fix commit |
| `wc -l` bibles | 3004 + 3010 — floors hold |

(Note, carried from the first review: `deploy/battery/deploy-proof.sh` remains unexecutable in THIS review
environment — a host-side tool firewall fail-closes the invocation; the node twin is the sanctioned equivalent
and passes with the superset check set.)

## NEW FINDINGS INTRODUCED/RESIDUAL

| id | severity | finding | evidence |
|----|----------|---------|----------|
| N1 | MINOR | js-family export check is line-anchored presence only; flush-left unfenced prose satisfies it, contra the fix's own "code, not prose" comment (validate-cards.mjs:41-42). Hard exploit requires two real frontmatter fields + marker line; matches the family's own authored convention. | BAD5b probe → PASS |
| N2 | MAJOR | Unclosed-fence bypass of the C3 strip: `/```[\s\S]*?```/g` needs a terminator; unterminated fence → nothing stripped → fake §0 counts (validate-cards.mjs:29). Same class as the original C3. | BAD6b probe → PASS |
| — | — | CONS-4 remains open (see per-fix §5): troubleshooting "55" vs 50 actual; FAQs "110" vs 120 actual. | recounted at e344cb5 |

## FINAL VERDICT

**NO-SHIP** — but it is now a two-liner away. The CRITICAL (C1) is closed and mutation-proven: the battery
genuinely pins its laws. C2 and closed-fence C3 are fixed with zero regressions across the full §0 battery.
What blocks ship:

1. **N2 (MAJOR)** — close the unclosed-fence hole in `validate-cards.mjs:29` (strip an unterminated trailing
   fence after the pairwise strip; re-run BAD6b → must FAIL).
2. **CONS-4 (MINOR)** — correct the DOCS FLOORS note to the measured numbers (110→120 FAQs, 55→50
   troubleshooting) or re-derive the claim honestly.

N1 is acceptable as documented residual (presence-check by design), no code change demanded.

Once N2 and CONS-4 land, every finding from both review rounds is closed and this reviewer's verdict flips to
**SHIP**.
