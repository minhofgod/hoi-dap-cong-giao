# Wire Phép Lạ into the taxonomy + add it as evidence-path stage 4

Two related pieces of work from the owner (2026-08-20). The first unlocks the second — and a lot more
besides — so **do §A first.**

---

## §A — Give miracles the shared taxonomy (`tags` + `category`) · Session 11

**The gap.** The miracle model (`lib/miracles/types.ts`, `content/phep-la/*.json`) carries `type`,
`status`, `related_saint`, a manual `related`, `ccc_refs`, and `sources` — but **no `tags`/`category`
from `lib/giaiDapTaxonomy`.** So 18 researched entries are invisible to every automatic linking
mechanism on the site.

**Why this matters more than it looks.** The site's established model is **"link by shared taxonomy,
not by derivation"** (see roadmap, "Content link model"). Everything downstream keys off tags. Adding
them to miracles unlocks, with no further per-page wiring:
1. **Q&A ↔ miracle cross-links.** A Eucharist Q&A automatically surfaces Lanciano / Buenos Aires /
   Bolsena / Santarém / Siena; a Marian Q&A surfaces Lộ Đức / Fatima / Guadalupe / La Vang / Rue du Bac.
   *(This is exactly what the owner asked for — and it's automatic rather than hand-maintained.)*
2. **The companion pool** — miracles become matchable resources, so a seeker on the evidence or doubt
   paths can be routed to them (Session 7 folds `kind: 'miracle'` into the pool, mirroring `'video'`).
3. **Search + filters** pick them up.
4. **Evidence-path stage 4** (§B) can select by tag instead of a hardcoded list.

**The work:**
- Add `tags: string[]` (+ optional `category`) to the miracle type, parsed by the loader — mirror how
  `lib/giaiDap` does it. Ids must come from `lib/giaiDapTaxonomy`; **no new vocabulary** without
  Session 2.
- Tag the 18 entries. Suggested mapping (owner/Session 11 to refine):
  | `type` | tags |
  |---|---|
  | eucharistic | `eucharist`, `miracles` |
  | marian-apparition | `mary`, `miracles` |
  | healing | `miracles`, `science` *(the Lourdes Medical Bureau is a science-facing story)* |
  | incorrupt | `miracles`, `saints` |
  | miraculous-image | `mary`, `miracles` |
  - `category`: mostly `evidence-history`; the medically-investigated cures fit `science-faith`.
- The `miracles` tag **already exists** in the 30-tag vocabulary, so Q&As tagged `miracles` start
  linking immediately.
- Extend `scripts/check-tags.mjs` to cover `content/phep-la` once the field exists, so an untagged
  miracle can't ship invisible (same silent-failure guard as Q&As/videos).

---

## §B — Miracles as evidence-path **stage 4** · Session 13 (`app/bang-chung`)

**Owner's decision (2026-08-20):** miracles belong in the evidence path, but as a **final stage, not an
early one.**

**Why the order matters.** Miracles are weak as an *opening* argument to a skeptic — someone who
doesn't yet grant the Resurrection answers "unexplained ≠ miracle" and dismisses the path. They're
strong as *confirmation* for someone already open. So:

1. Does God exist? (first cause, design)
2. Was Jesus historical?
3. Did he rise?
4. **→ NEW: Is God still acting?** — Church-recognised miracles

**Framing rules (non-negotiable — this is what makes it persuasive rather than credulous):**
- **Carry the `limits` field through.** Every miracle entry already states *what it does NOT establish*;
  that honesty is the section's whole credibility and must survive into the path.
- **"Church approval ≠ scientific proof."** Approval means "nothing contrary to faith; worthy of
  belief" — never that the Church has *proved* an event. Say so plainly, as `/phep-la` already does.
- **Lead with the skeptic-friendly case: the Lourdes Medical Bureau** — a body that *rejects* the
  overwhelming majority of claims. A process that says "no" thousands of times is far more persuasive
  to this audience than a list of wonders.
- Approved cases only; keep the `status` badge visible.

**Build note:** stage 4 should select entries by **tag** (after §A) rather than a hardcoded slug list,
so it stays current as miracles are added. Same inline-answer, no-navigate-away pattern as stages 1–3.
The route is still flag-gated behind `NEXT_PUBLIC_EVIDENCE_PATH` — no entry points here (Session 8 owns
those, per `docs/evidence-path-handoff.md`).

---

## Hand-off
| § | Session | Task |
|---|---|---|
| A | **11** | Add `tags`/`category` to the miracle model + tag the 18 entries; extend `check-tags`. **Do first.** |
| A2 | **7** | Fold miracles into the companion pool as a resource kind (mirrors `'video'`) — after A. |
| B | **13** | Evidence-path stage 4, selecting by tag; `limits` + "approval ≠ proof" framing preserved. |
| — | **2** | Only if new tag ids turn out to be needed (`lib/giaiDapTaxonomy`). Prefer reusing existing ones. |
