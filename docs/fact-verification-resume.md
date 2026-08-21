# Fact-verification audit — resume brief (Session 12)

Written by the coordinator 2026-08-21, after the owner reviewed Session 12's report
(`docs/fact-verification-audit.md`, committed `a6700cc`).

**Owner's decisions:**
1. **Continue the audit** — and the spend limit gets raised so the fan-out can run. The rule is
   `CLAUDE.md` → *correctness over speed or token cost*, and this is exactly that trade. Solo would be
   slower **and** cost more per entry, so paying more to avoid raising a limit is the worse deal.
2. **Entries 5 and 6 get finished first** — see step 1 below.

---

## Why this is not "polish" — read this before deciding anything is low priority

The six verified entries produced **37 flagged rows, ~6 per entry, and not one came back clean.**
The dominant failure is **quotations that are almost right**:

- **Clement of Rome** — the headline quote's key phrase, *"added an appendix"*, appears in **no**
  standard translation, **and the site's apostolic-succession argument hangs on that clause.**
- **Ignatius** — **two different letters spliced inside one set of quotation marks**, cited to only one.
- **Polycarp** — the relic quote is a hybrid of ANF and Lightfoot, matching neither.

**All 30 entries are live on the public domain right now.** On a site whose entire claim is being
sourced and checkable, a fabricated patristic quote is the most damaging possible defect — worse than
a wrong date, because it is doing argumentative work.

---

## Order of work

### 1. FINISH entries 5 and 6 — do this first, it is small
`irenaeus-of-lyons` and `clement-of-alexandria` are marked **verified** in the report, but their
`sections[]` bodies were never opened. **That is where entries 1–3 hid their worst problems.**

A false ✔ is worse than a known gap: it is how these two get skipped permanently. Open the
`sections[]` bodies and re-verify at the full standard, then correct their status in the report.

### 2. Verify TERTULLIAN, CYRIL OF JERUSALEM, JEROME next — out of order, deliberately
These three are **quoted inside the Giải Đáp clusters**, where their words do argumentative work
rather than sit in a biography. None is verified:

| Father | Citations in Q&As | Why it matters |
|---|---|---|
| **Tertullian** | **4** | incl. the capstone Q&A of the **Duy Kinh Thánh** cluster (`giao-phu-co-tranh-luan-bang-chi-kinh-thanh-khong`) — the site's newest and most contested argument |
| Cyril of Jerusalem | 1 | |
| Jerome | 1 | |

**The Clement of Rome finding is the precedent:** a bad quote in a *load-bearing* position damaged an
argument, not just a bio. Tertullian now occupies that position in the Sola Scriptura cluster.

*(Method: `grep` each Father's Vietnamese name across `content/giai-dap/*.md`. Re-run it later —
Session 3 adds clusters continually, so the load-bearing set grows.)*

### 3. Then the remaining 21 entries, by fan-out
Resume per the report's **"How to resume pass 1"** section. The brief is reusable as-is.

### 4. In parallel: apply the 15 `corrected` rows from the six verified entries
These are **decided, not pending** — they need no further verification, only application. ⚠️ Per the
report's **S3**, corrections must land in **three files**, not one: the per-slug file and the legacy
dataset are not independent witnesses.

---

## Structural findings to carry through (report §S1–S4)

- **S1 — `ccc_refs` is empty on all 30 entries.** The Catechism cross-links the model supports are
  simply unpopulated site-wide.
- **S3 — corrections land in three files.** The per-slug `content/giao-phu/<slug>.json` and the legacy
  dataset duplicate each other; fixing one leaves the other wrong.
- **S4 — five entries disagree with the site's own Vietnamese Catechism** on names. The content-guide's
  standing ⚠️ about Giáo Phụ predating the terminology rule is now confirmed, not hypothetical.

## Still entirely untouched

**Công Đồng — 21 councils, 0 verified.** The audit spec covered Fathers *then* Councils; only the
Fathers were started. Councils are the second half of this job and have not begun.

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **12** | Finish entries 5–6 (`sections[]`); then Tertullian / Cyril / Jerome; then the remaining 21 by fan-out. Report-only — no content edits during verification. |
| 2 | **12** (2nd pass) | Apply the approved `corrected` rows — remembering S3's three files. |
| 3 | owner | Raise the spend limit before the fan-out. Approve corrections between passes. |
| 4 | later | Công Đồng (21) — not started. |

**Not a launch blocker in the sense that the site is already live** — which is precisely why the
known-bad quotes should be corrected promptly rather than queued behind the full audit.
