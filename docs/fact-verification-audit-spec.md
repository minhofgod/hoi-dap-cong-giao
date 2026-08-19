# Fact-verification audit — Giáo Phụ + Công Đồng (Session 12)

Commissioned by the owner 2026-08-18. These two sections were authored **before** the standing
"Verify facts before they ship" rule existed (`CLAUDE.md`, commit `7d7ba3e`) and before the `sources`
field existed. They are also the most fact-dense content on the site. The owner has said plainly that
he cannot independently verify dates/names/events and would make mistakes attempting it himself — so
this is delegated to a verification session rather than left to the pre-launch proofreading pass.

**Not a launch blocker.** The domain can go live while this runs.

## Scope

| Section | Entries | Files |
|---|---|---|
| **Giáo Phụ (Church Fathers) — DO FIRST** | 30 | `content/giao-phu/*.json` |
| Công Đồng (Councils) | 21 | `content/cong-dong/*.json` |

**Giáo Phụ first** because it carries **two** known gaps rather than one: unverified hard facts *and*
the standing ⚠️ in `docs/content-guide.md` that its Vietnamese names/terms predate the terminology rule
and were never spot-checked.

## What to verify, per entry

The Giáo Phụ shape is `{ no, slug, era, name, role, dates, quote, life, facts, works, works_note,
sections, apologetics, ccc_refs, portrait }`. Councils mirror it. Check:

1. **`dates`** (`born` / `died` / `display`) — the highest-yield field. Many patristic dates are
   genuinely **contested or approximate**; where scholarship gives a range or a "c.", the entry must
   say so rather than assert a false precision. *"The sources disagree" is a finding, not a failure.*
2. **`name` / `role` / `era`** — is the person correctly placed and described?
3. **`quote`** — **the highest-risk field on the site.** Verify the wording is genuinely that Father's,
   and that the attribution (work, book, section) is real. Patristic quotes circulate widely in
   misattributed or paraphrased form. If a quote can't be traced to a real work, **say so** — do not
   quietly swap in a different quote.
4. **`facts` / `life` / `sections`** — biographical and historical claims: exile, martyrdom, offices
   held, councils attended, who condemned whom.
5. **`works` / `works_note`** — do the named works exist, and are they actually by this author?
   (Several patristic works have long-disputed authorship — flag, don't assert.)
6. **`ccc_refs`** — does the cited Catechism paragraph actually say what the entry implies?
7. **Councils specifically** — year(s), the convoking pope/emperor, canon counts, what was actually
   defined vs popularly believed to have been defined, and which heresy was condemned.
8. **Vietnamese terminology** — one `grep` per proper name against the site's own Catechism content
   (`content/content.json`), then HĐGM VN for anything absent. **Never Vietnamese Wikipedia.** This
   costs almost nothing while the entry is already open, and Giáo Phụ has the standing ⚠️.

## Standard of proof (`CLAUDE.md` / `docs/content-guide.md`)

- **Primary/official first:** Vatican.va, the actual conciliar texts, the Catechism, critical editions
  of the Fathers. Then serious scholarship. **Wikipedia and any LLM's memory are pointers to confirm
  elsewhere — never the final word.**
- **Triangulate: ≥2 independent good sources** per corrected fact.
- **Flag, don't fake.** `[cần kiểm chứng]` or an explicit "unverifiable" verdict beats a smooth guess.

## The guards that make this audit worth running

An agent asked to verify 51 entries will happily report "all verified." That outcome teaches the owner
nothing and is worse than not running the audit. Therefore:

- **`unverifiable` and `contested` are REQUIRED verdicts in the vocabulary** and are expected to appear.
  **A report with zero flags across 51 entries should itself be treated as suspect** and re-run.
- **Every non-`confirmed` verdict carries its source URLs** so the owner can spot-check without redoing
  the work.
- **Report first, fix second.** A verifier that edits as it reads can quietly replace one error with a
  different error, and nobody would see it.
- **Do not "improve" prose, tone, or theology.** This audit is about *facts*. Wording is out of scope.

## Output

`docs/fact-verification-audit.md` — grouped by entry, listing **only** claims that are not plainly
confirmed, plus a short summary of what was checked. Per row:

| Entry | Field | Claim as written | What the sources say | Verdict | Sources |
|---|---|---|---|---|---|

Verdicts: `confirmed` (omit from the report unless notable) · `corrected` (propose exact new value) ·
`contested` (sources genuinely disagree — propose hedged wording) · `unverifiable` (couldn't confirm;
propose flagging or removing the claim).

End with a **findings summary**: systemic patterns (e.g. "N entries assert precise dates where
scholarship gives ranges"), and the count by verdict.

## Two-pass workflow (owner's call 2026-08-18)

1. **Pass 1 — report.** Verify and write `docs/fact-verification-audit.md`. **Change no content.**
2. **Owner reviews** and marks which corrections to apply.
3. **Pass 2 — apply only the approved rows**, in the same session. No other session is active on
   `content/giao-phu` or `content/cong-dong` (Session 5 finished), so this session owns those files for
   the duration — no lane conflict.

**Pace it.** 51 entries is large; the situations are independent, so this fans out well (a batch or an
entry per agent). Do Giáo Phụ fully — report, approve, apply — before starting Công Đồng, so the
owner can judge the audit's quality on the first 30 before committing to the rest.

## Follow-on (do NOT fold into this audit)

The roadmap's **`sources` retrofit** for these sections (`docs/roadmap.md` → "Still open") is a natural
sequel — this audit will have found and cited the sources anyway. But adding a `sources` field means a
**data-model + detail-page change**, which is a different kind of work. Keep it separate; note in the
report which citations are worth keeping for it.

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **12** | Pass 1 — verify Giáo Phụ (30), write the report. Change no content. |
| 2 | owner | Review + approve corrections. |
| 3 | **12** | Pass 2 — apply approved rows to `content/giao-phu`. Then repeat 1–3 for Công Đồng (21). |
| 4 | owner | Tick the entries in the proofreading tracker as each batch is signed off. |

Verify `npx tsc --noEmit` + `npm run lint` clean before committing pass-2 edits; commit only
`content/giao-phu` / `content/cong-dong` and the report.
