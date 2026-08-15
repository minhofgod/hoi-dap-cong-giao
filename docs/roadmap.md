# Roadmap & ideas — Hỏi Đáp Công Giáo

Captured 2026-08-14. Directional, not final — see "open questions" and brainstorm before building.

## 1. Q&A taxonomy — categories + tags (foundational)

**Why:** the site serves believers *and* seekers/atheists. Broad, audience-facing categories let a
non-believer find "Science" or "Evidence" answers, not only "Theology." Also needed to organize the
**council Q&As**, which are currently ungrouped (they just appear under "Công Đồng · Vấn đáp").

**Proposed 3-level model:**
- **Category** (broad, pick 1 — audience-facing): e.g. Science, Evidence/History, Theology,
  Morality & Life, Scripture, The Church. *(final list TBD — brainstorm)*
- **Topic / cluster** (what the current `category` field already does): "Cầu nguyện với các thánh",
  a council name, etc. May rename the field `topic` to free up `category` for the broad level.
- **Tags** (cross-cutting, many per Q&A): Mary, Papacy, Faith, Works, Eucharist, Trinity,
  Resurrection, Saints, Suffering, Marriage/mixed-marriage, Evolution, Miracles… *(seed list TBD)*

**Work breakdown:**
- [ ] Finalize the category list + an initial tag vocabulary (with the owner).
- [ ] Data model: add `category` (broad) + `tags: []` to giai-dap frontmatter; decide whether to
      rename the current `category` → `topic`. *(website session)*
- [ ] Council Q&As: give each a category + tags (they're generated from council `apologetics` — add
      the fields to the council JSON or a mapping). *(website + content)*
- [ ] Browse/filter UI on `/giai-dap`: filter by category and tag; show tag chips on Q&A pages;
      fold category/tags into search. *(website session)*
- [ ] Backfill categories/tags on existing Q&As. *(content session)*

## 2. Guided "find answers" tool → (later) content AI

**Tier A — Guided flow (MVP, no LLM):** a button → the visitor answers a few questions **about
themselves / their situation** (NOT submitting a question for the owner to answer — this is
self-assessment, not an inbox) → the tool routes them to curated Q&As / Bible passages / evidence
that fit. E.g. "science makes me doubt" → Science/Evidence answers; "my spouse doesn't believe" →
marriage + evangelization answers; "is there evidence for the Resurrection?" → the History/Evidence
cluster. A deterministic decision tree keyed off the taxonomy (#1): the intake answers map to
categories/tags, which retrieve matching content. Safe, cheap, no hallucination, doctrinally
reliable. **Depends on the taxonomy being in place.**

The **result adapts** to their answers: a tailored "path" page — a few sentences of advice/
encouragement fitted to their situation (deepening faith, or where to find evidence for God) +
the matched Q&As, Scripture, and evidence, in a sensible order. Even without an LLM this feels
personalized because the branch + assembled resources are specific to what they said. (A later AI
tier could make the advice text more fluid — same doctrinal-safety constraints apply.)

**Tier B — Content AI (bigger):** an LLM that answers from the site's verified content (retrieval +
citations), optionally online sources *with verification*. Risks to design around:
- **Doctrinal accuracy** — an AI stating wrong Catholic teaching on an authoritative apologetics
  site is unacceptable. Constrain it to the site's verified content, answer *with citations*, and
  prefer "here's what the Church teaches / here's the Q&A" over free-form theology.
- **Online sources** — verification burden + copyright; treat as a later, gated add-on.
- **Pastoral sensitivity** — topics like an unbelieving spouse or suffering: route to human-written
  content and "talk to a priest," not AI-generated counsel. Frame AI output as assistive.
- **Cost / moderation / abuse.**

**Recommended sequencing:** taxonomy (#1) → guided flow (2A) → evaluate content AI (2B).

## Decisions (2026-08-14)
- **3-level taxonomy**: Category (broad) + Topic (existing cluster) + Tags (cross-cutting).
- **Advice text = hand-written snippets** keyed to situations (no LLM to start; AI is a later layer).
- **Build order**: taxonomy + browse/filter first → then the companion flow → then evaluate AI.

### Companion tool — final naming & copy (locked 2026-08-15)
- **Name / nav / entry:** Đi Tìm Lời Giải · EN **Find Answers**. Route `/tim-loi-giai`.
  (Rejected: "Đồng Hành" — in VN it reads as a fundraising/sponsorship ask; "Đi Tìm Sự Thật" — too
  narrow, excludes the strengthen-my-faith / need-advice audiences.)
- **Tagline:** "Dù bạn đang tìm bằng chứng, muốn vững tin hơn, hay cần một lời khuyên — hãy bắt đầu tại đây."
  / "Whether you're looking for evidence, want to grow in faith, or need advice — start here."
- **Opening question:** "Điều gì đưa bạn đến đây?" / "What brings you here?"
- **Entry points:** homepage (prominent) + header nav. Bilingual, no LLM, advice text hand-authored.

## Final vocabulary (locked 2026-08-14)

Ids are ascii-kebab, defined in `lib/giaiDapTaxonomy.ts` (website session's file).

**Categories (9)** — pick 1 per Q&A: `science-faith`, `evidence-history`, `god-meaning`,
`theology-doctrine`, `the-church`, `mary-saints`, `scripture`, `morality-life`, and NEW
`other-religions` (Tôn giáo khác & Phản đối).

**Tags (30)** — the 27 seed tags + NEW `sacraments` (Bí tích), `sin` (Tội & lương tâm),
`afterlife` (Đời sau).

### To apply — website session, `lib/giaiDapTaxonomy.ts`
- Add to CATEGORIES: `{ id: 'other-religions', vi: 'Tôn giáo khác & Phản đối', en: 'Other Religions & Objections' }`
- Add to TAGS: `{ id: 'sacraments', vi: 'Bí tích', en: 'Sacraments' }` · `{ id: 'sin', vi: 'Tội & lương tâm', en: 'Sin & conscience' }` · `{ id: 'afterlife', vi: 'Đời sau', en: 'Afterlife' }`

### Mobile filter UX — website session
On `/giai-dap` the category+tag chips push all content below the fold on mobile (and worsen as more
Q&As get tagged). Collapse them behind a **"Bộ lọc / Filter" button next to the search bar** — a
toggle that reveals the chip panel — with an active-filter count badge. Desktop can keep the same
toggle or stay expanded.

## Content link model — videos ↔ Q&As (2026-08-15)

Videos and Q&As are **siblings, not source-and-transcript.** A script is working source material;
the video (spoken) and the Q&A/blog (written) are two independent expressions of the same topic and
may diverge in wording — each is authored and VERIFIED on its own, in its own register. So:

- **Link by shared taxonomy (tags/category), not by derivation.** Same vocabulary as Q&As
  (`lib/giaiDapTaxonomy`). This is what makes the companion, the `/giai-dap` filters, and search pull
  a video and its sibling Q&As together automatically — with no assumption one came from the other.
- **Page cross-links — DO THIS; it's how a companion reader finds the Q&As.** Each video page shows a
  "Câu hỏi liên quan / Related questions" section, and each Q&A shows "Xem video / Watch the video."
  Populate them AUTOMATICALLY from shared tags (a video surfaces Q&As whose tags overlap — the same
  matching the companion uses), so no manual wiring and it stays current as Q&As are added. Optional
  explicit pins (`related_qa` on a video, `related_video` on a Q&A anchor) can force a specific pairing
  to the top. Shown as "related," never "the source/transcript."
- **Every finished script → a Q&A cluster** (published-video scripts included, not just the unpublished
  ones) so no video is represented only by its thin companion blog. One topic → up to 3 siblings: the
  video (watch), the companion blog (read-alongside, may add more than the video), the Q&A cluster
  (find the specific answer) — all linked by tags.
- **Scripts are not a published content type** — they're drafts. Track "script → video? → Q&A?" in an
  OFF-SITE tracker (sheet/Notion) so finished-but-unmade scripts don't fall through the cracks. The
  site only publishes videos + Q&As.

**Build order:** Layer 1 — add `category` + `tags` to video frontmatter (content) + parse them in
`lib/videos.ts` (website) + add videos to the companion's resource pool as `kind: 'video'` with a
play-icon treatment (companion session). Layer 2 — the optional `related_video`/`related_qa` page
cross-links.

## Future sections + homepage IA (brainstorm 2026-08-15)

**Group the sections into families:**
- **Đồng hành (Companion)** — front-door CTA for seekers, top of homepage.
- **Học hỏi đức tin (Learn):** Giáo Lý (Catechism) · Giải Đáp (Q&A) · Video.
- **Lịch sử & chứng nhân (History & witnesses):**
  - **Lịch Sử Hội Thánh (Church History)** — a HUB grouping Giáo Phụ (Fathers) + Công Đồng (Councils),
    both already era-organized. Replaces the standalone Church Fathers card on the homepage and
    surfaces the Councils without adding a new top-level card. (Route e.g. `/lich-su-hoi-thanh`.)
  - **Các Thánh (Saints)** [future] — life stories / inspiration; broader than the Fathers (all eras,
    martyrs, mystics, modern). Overlap note: the Fathers *are* saints but sit under Church History for
    their doctrinal role; Saints is the devotional lens. **Curate, don't cover everything** (like the
    30 Fathers); organize by theme (Vietnamese · martyrs · mystics · modern · patrons), grow over time.
    **Priority order:** (1) **Các Thánh Tử Đạo Việt Nam** — the 117 Vietnamese Martyrs (Anrê Dũng-Lạc +
    companions); the audience's own heritage, most distinctive, nothing else on the site covers it.
    (2) a curated ~12–15 POST-patristic beloved/inspiring set — modern (Carlo Acutis, Têrêsa Hài Đồng
    Giêsu / Thérèse, Padre Pio, Maximilianô Kolbe, Faustina, Têrêsa Calcutta), converts (Inhaxiô Loyola,
    Edith Stein), and BRIDGE saints: Mônica → the companion's "loved one drifted" path; Bernadette
    (Lourdes) / Juan Diego (Guadalupe) / Carlo Acutis → the Miracles & Apparitions section. Verify all
    VN names per the terminology rule when building.
  - **Phép Lạ & Hiện Ra (Miracles & Apparitions)** [future] — Eucharistic miracles + Marian
    apparitions (à la Carlo Acutis's "Eucharistic Miracles of the World" + his Marian apparitions
    catalogue), plus Lourdes healings, incorrupt bodies, miraculous images (Guadalupe). Strong for the
    seeker/evidence audience (ties to the `evidence-history` / `science-faith` categories).

**Homepage:** hero + Đồng hành CTA, then the two families as card groups. The Church History hub is
the immediate actionable (it surfaces the Councils now); Saints + Miracles are reserved slots.

### Build order: Saints BEFORE Miracles (decided 2026-08-15)
Do **Các Thánh first**, then **Phép Lạ & Hiện Ra**. Why: (1) the Vietnamese Martyrs are the unique
heritage anchor — highest distinctiveness, strongest identity pull; (2) a saint entry reuses the
existing Giáo Phụ model (person + era + portrait + bio) — Miracles needs a NEW event/evidence model;
(3) Saints lays the **on-ramps into Miracles** — Bernadette→Lộ Đức, Juan Diego→Guadalupe, Carlo
Acutis→Eucharistic miracles — so each bridge saint ends with "→ đọc về phép lạ" pointing into the
future section; build Miracles first and it has no front doors. Carlo Acutis is the connective
tissue (the millennial saint who himself catalogued Eucharistic miracles; canonized 7 Sep 2025).

### Session 9 — Các Thánh: starting lineup (ready to hand off)
Same philosophy as the 30 Fathers: **curate, don't cover everything.** ~21 entries for the first
pass (≈ councils/fathers scale), grouped by theme, room to grow. Reuse the Giáo Phụ content model.

**Tier 1 — Các Thánh Tử Đạo Việt Nam (heritage anchor):** an overview page (the 117 canonized by
John Paul II, 1988 + Bl. Anrê Phú Yên) + ~7 individuals chosen for *diversity*, not just clergy:
Anrê Dũng-Lạc (priest, namesake) · Á Thánh Anrê Phú Yên (protomartyr ~1644, catechist) · Anê Lê Thị
Thành (the ONE woman of the 117, a mother/laywoman) · Tôma Trần Văn Thiện (teen seminarian) ·
Emmanuel Lê Văn Phụng (layman/head of household) · Phaolô Lê Bảo Tịnh (priest, left prison letters) ·
Thánh Ven / Théophane Vénard (foreign missionary).

**Tier 2 — ~14 curated post-patristic saints (devotional lens):**
- *Modern witnesses:* Carlo Acutis **[→ bridge to Miracles: Eucharistic]** · Têrêsa Hài Đồng Giêsu
  (Thérèse of Lisieux) · Cha Piô / Piô Năm Dấu (Padre Pio) · Maximilianô Kolbe · Faustina (Divine
  Mercy) · Têrêsa Calcutta.
- *Converts / intellectuals (for the seeker audience):* Inhaxiô Loyola · Têrêsa Bênêđicta Thánh Giá
  (Edith Stein).
- *Bridge saints → Miracles & Apparitions:* Bernadette **[→ Lộ Đức/Lourdes]** · Juan Diego
  **[→ Guadalupe]**.
- *Bridge → the companion's "loved one drifted" path:* Mônica.
- *Beloved patrons:* Phanxicô Assisi · Thánh Giuse (St. Joseph) · Gioan Phaolô II (**also** the pope
  who canonized the 117 VN Martyrs — links back to Tier 1).

**Two build flags for Session 9:**
1. **Verify every VN name** per the terminology rule (site content → HĐGM VN, NEVER VN Wikipedia).
   The forms above (e.g. *Piô Năm Dấu*, *Têrêsa Hài Đồng Giêsu*, *Lộ Đức*) are best-guesses — confirm
   before authoring. Also re-verify the two Carlo Acutis miracle healings' names/dates vs the Vatican
   Dicastero source when writing his entry (Brazilian boy Mattheus, 2013, beatification; Costa Rican
   Valeria Valverde, 2022, canonization).
2. **Each bridge entry ends with a forward link** ("→ đọc về phép lạ") into the future Miracles
   section, so Saints-first pre-lays the on-ramps.

**Lane:** `app/cac-thanh` (list + detail) · `lib/saints*` (may mirror `churchFathersV2`) ·
`content/cac-thanh/*.json` (per-saint, bilingual) · `public/images/cac-thanh` (PD portraits + a
Catholic Images/CREDITS row each). Session 8 only adds the homepage card + nav link.

## Still open
- **Q&A card banner fallback (website, Session 2).** `components/GiaiDapBrowser` renders the topic-card
  banner from `/images/giai-dap/<anchor>.jpg` unconditionally — a missing file shows a BROKEN image
  (recurring bug). Add a graceful fallback: on `next/image` error, swap to a placeholder (a colored
  tile / topic icon / initials) so a forgotten banner degrades cleanly. Same pattern is worth checking
  anywhere else the site renders a slug-derived image (e.g. council/father portraits already handle
  `available:false` — Q&A cards don't).
- Content AI later: site-content-only with citations (recommended) vs. also online sources.
- Languages: companion flow bilingual (like the rest of the site) — assumed yes.
