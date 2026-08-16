# Phép Lạ & Hiện Ra (Miracles & Apparitions) — Session 11 section spec

The site's **evidence/seeker-facing** section: Church-recognized miracles + apparitions, presented with
rigor for people asking *"is there any evidence?"* Ties to the `evidence-history` / `science-faith`
audience. **Continues the work of St. Carlo Acutis** (who catalogued the Eucharistic miracles) — credit
him openly (dedication + the bridge from his saint page). Build AFTER Saints (done). Curate (~12–18 first
pass); grow over time.

## Content model — NEW, event-based (not the person model). JSON, bilingual.
Per entry (`content/phep-la/<slug>.json`):
- `slug`, `title { vi, en }`
- `type`: `eucharistic | marian-apparition | healing | incorrupt | miraculous-image`
- `location { vi, en }`, `date` (display + year)
- `summary { vi, en }` — one line
- `story { vi, en }` — what happened (narrative), rendered via `ScriptureBody`/`enrichBody`
- `recognition { vi, en }` — the Church's status: who/when investigated/approved, and **what that
  approval means** (see rules)
- `evidence { vi, en }` — the scientific/historical findings, stated honestly (not inflated)
- `significance { vi, en }` — why it matters
- `sources: [{ label, url? }]` — **reuse the Q&A `sources` shape** (Session 2 built `GiaiDapSource`) for citations
- image (PD) + a Catholic Images / CREDITS row
- `related_saint: <slug>` — bridge back (e.g. guadalupe → `juan-diego`)

Group the list by `type`.

## Doctrinal & evidentiary rules — THE INTEGRITY BACKBONE (non-negotiable)
1. **ONLY Church-recognized / approved cases.** No unapproved or contested ones. Omit Medjugorje (not
   ruled on) — or if ever included, mark it *explicitly* as not-yet-approved. Better to omit than to blur.
2. **Public vs private revelation — state it plainly.** Public revelation closed with the apostles
   (GLHTCG 66–67). Apparitions are **private revelation**: even Church-approved ones are "worthy of
   belief" and can help the faith of a period, but are **NOT binding *de fide***. Carry a short standing
   note on the section + the status per entry.
3. **"Church approval" ≠ dogma and ≠ scientific proof.** It means "nothing contrary to faith/morals,
   worthy of belief." Word every `recognition` carefully; never imply the Church *proves* a miracle.
4. **Evidence honesty.** State what the investigation actually found; distinguish "the Church
   recognizes" from "science proves." Cite sources. No sensational/tabloid tone — reverent and sober.
5. **Verify everything.** Every date, recognition, and scientific claim → check against authoritative
   sources (Vatican, the sanctuary's own records, the Lourdes Medical Bureau, peer-reviewed where it
   exists). If a draft (e.g. from Grok) is used, resolve every `[cần kiểm chứng]` before shipping.

## Curated starting lineup (verify each before it ships)
- **Eucharistic:** Lanciano (8th c.) · Buenos Aires (1996, investigated under then-Card. Bergoglio) ·
  Bolsena–Orvieto (1263 → the feast of Corpus Christi) · Santarém (Portugal).
- **Marian apparitions:** Guadalupe (1531, the tilma) · Lộ Đức / Lourdes (1858) · Fatima (1917, the
  "Miracle of the Sun").
- **Healings:** the **Lourdes Medical Bureau** — its rigorous vetting process + the ~70 Church-recognized
  cures (a strong evidence story in itself).
- **Incorrupt bodies:** Bernadette Soubirous · others as researched.
- **Miraculous image:** the Guadalupe tilma (the image itself — cross-link with the apparition entry).

## Bridges (saints ↔ miracles) — on-ramps already stubbed
The saint pages already carry "→ /phep-la (coming soon)" forward-links (Session 9). Session 11 makes them
land + adds reciprocal `related_saint` links back:
- Guadalupe ↔ `juan-diego` · Lộ Đức/Lourdes ↔ `bernadette-soubirous` · Eucharistic miracles ↔
  `carlo-acutis` (the dedication).

## Carlo Acutis dedication (the owner's inspiration for this section)
A visible, humble dedication on the section — the owner wants to name Carlo as the inspiration. Draft
(refine): *"Phần này được lấy cảm hứng từ Thánh Carlô Acutis — người đã dùng khả năng của mình để sưu tầm
các phép lạ Thánh Thể được Hội Thánh công nhận, hầu giúp mọi người đến gần Chúa hơn. Chúng tôi tiếp nối
công việc ấy bằng những công cụ của thời đại mình."* Pair with the `carlo-acutis` → `/phep-la` bridge.

## Lane / ownership
Session 11 builds the whole section: `app/phep-la` (list + detail), `lib/miracles*` (the event model),
`content/phep-la/*.json`, `public/images/phep-la`, `components/phep-la`. **Owns no entry points** —
Session 8 adds the homepage card + nav once there's a first batch (entry-point rule in STATE.md). Follow
the scripture-popover rule for the `story` body. Add a Session 11 row to the STATE.md registry.
