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

### Companion tool — final naming & copy (locked 2026-08-15 · **name REVERSED 2026-08-18**)
- **Name / nav / entry — SETTLED: `Đồng hành` · EN `Companion`. Route `/dong-hanh`.** This is what the
  code, the nav, the homepage band, the saint bridge links, and the docs have always used — the rename
  below was locked on paper but never executed, and on 2026-08-18 the owner confirmed the current name
  stands. **Do not "fix" this to match the old decision.**
  - *Superseded (2026-08-15):* "Đi Tìm Lời Giải / Find Answers" at `/tim-loi-giai`, on the concern that
    "Đồng Hành" reads in VN as a fundraising/sponsorship ask. Recorded so it isn't revisited.
  - *Also rejected then and still rejected:* "Đi Tìm Sự Thật" — too narrow, excludes the
    strengthen-my-faith / need-advice audiences.
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

### Các Giáo Hoàng tiêu biểu (Notable Popes) — [future idea, noted 2026-08-15]
A future **person-model** section (reuses the Giáo Phụ / Các Thánh model: portrait + bio + era/theme)
profiling notable popes — the **papacy/history angle**, not the doctrinal one the Fathers already cover.
**Curate, don't cover 260+**: a themed set (e.g. early martyr-popes, the great reformers,
council-conveners like Leo XIII / John XXIII, defining moderns). **Overlap is the main design issue** —
many popes are already Church Fathers (Clement of Rome, Leo the Great, Gregory the Great) or already
in Các Thánh (Gioan Phaolô II, Gioan XXIII); don't re-cover them — cross-link instead, and pick popes
notable *as popes* (governance, councils, reform, history) so the section earns its place beside Giáo
Phụ and Các Thánh under the **History & witnesses** family. Not scheduled; slot after Saints/Miracles
unless prioritized. (PD portraits: easy for pre-1900 popes; modern ones will hit the same
copyright wall as the modern saints — expect the `available:false` fallback for recent pontiffs.)

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

**Saints are life STORIES, not summaries (refinement 2026-08-15).** Unlike the Fathers (under Church
History for their *doctrinal* role — a summary of what they taught fits), the Saints are the
*devotional* lens, where **the story is the point**. So a saint entry should carry a **narrative life
story**, and longer is natural. Model: a short scannable **header** (name, dates, patronage, one-line
who-they-are) + the **full life story as the centerpiece** below, rendered through
`ScriptureBody`/`enrichBody` so verse/CCC refs in the story become popovers (same rule as Q&As). The
framework should support a rich story for all; depth can vary (VN Martyrs, Carlo, Mônica deserve full
treatment). This is a Session 9 enhancement to the saint model + detail page + the content itself.

**Lane:** `app/cac-thanh` (list + detail) · `lib/saints*` (may mirror `churchFathersV2`) ·
`content/cac-thanh/*.json` (per-saint, bilingual) · `public/images/cac-thanh` (PD portraits + a
Catholic Images/CREDITS row each). Session 8 only adds the homepage card + nav link.

**Follow-up once Saints ships — add a companion branch (NOT Session 9's lane).** The Đồng hành
companion auto-*routes* to any tagged content, so tagged saint entries become findable on their own —
BUT the companion only *asks* about topics hand-authored into `lib/dongHanh.ts` (that's Session 7's
lane). So after Tier 1 is live, ask the **companion session (7)** to add a Saints branch/situation
(e.g. "muốn tìm một vị thánh bổn mạng / a saint's story to learn from" → routes to `mary-saints` +
the martyr/patron tags). Without it, Saints is findable via search/filters/cross-links but the
companion won't surface it. See `docs/content-guide.md` "How new content reaches the companion."

## Companion — guided branching path (v2 spec, ready for Session 7)

**Problem it fixes.** Today the companion is a one-shot router: 2–3 intake questions → one situation →
a batch of Q&As, then it dead-ends — it hand-holds for two minutes, then abandons ("here's a pile,
go figure it out"). v2 makes it a **guided journey** that keeps walking with the seeker until they're
satisfied or gets a graceful, warm hand-off.

**The mechanic (confirmed with owner 2026-08-15):**
- After each answer, show **~4 short follow-up questions** as multiple choice — the questions a reader
  would naturally have next.
- Pick one → read that answer → get a **fresh** set of ~4.
- **Every answer already read is removed** from future suggestions (a `visited` set); the pool shrinks
  as they explore.
- Continue until the good suggestions run out **or** a cycle cap (`MAX_CYCLES`, ~5) is hit.
- Then (or via an always-present exit) ask **"Câu trả lời này có giúp được bạn không? / Did this
  help?"** — Có / Chưa / Có lẽ.

**Follow-ups are generated automatically, by shared tags (no LLM, deterministic):**
- After a reader finishes Q&A X, candidates = all **unvisited** pool items scored by **tag overlap**
  with X (secondarily the original intake situation's category/tags); take the top ~4.
- Reuses the existing `matchResources` scoring (category +3 / tag +1). The full pool is already handed
  to the client, so **the entire walk runs client-side** — no server round-trips, instant.
- Optional `related_qa` pin on a Q&A forces a specific follow-up to the top (already in the content-
  link model). Council Q&As + videos share the pool, so a chain can surface a "Xem video" or a council
  answer mid-path.

**Short-form button text (content field):**
- Add an optional `short:` frontmatter field to `content/giai-dap/*.md` — a punchy 4–8 word phrasing
  for the button; **falls back to the Q&A title** when absent, so it works before any backfill.

**Never a maze — exits at every step:**
- Every step keeps visible: "Đọc câu trả lời đầy đủ" (full Q&A), "Xem video" (if any), and a quiet
  **"Tôi đã tìm được điều cần / I found what I needed"** self-declared exit. True satisfaction is hard
  to detect, so let them leave whenever; `MAX_CYCLES` is the backstop, not the primary end.

**The dead-end — warm handoff, NO inbox (keeps the "not an inbox" decision intact):**
On cap reached / follow-ups exhausted / "Chưa" to the satisfaction check — DON'T dump a list:
1. **Honest apology + warm, pre-seeded handoff:** *"Xin lỗi, có lẽ chúng tôi chưa có sẵn câu trả lời
   đúng điều bạn cần."* → link to the `/giai-dap` browser **already filtered to their path's category
   + tags** (not the full list), plus focused search and the related videos — everything scoped to the
   trail they walked.
2. **Pastoral / human off-ramp on the heavy branches** (suffering / doubting / loved-one): a gentle
   *"Nếu đây là điều đang đè nặng trong lòng bạn, đôi khi trò chuyện với một linh mục còn giúp nhiều
   hơn một trang web."* — a priest / RCIA / their parish. No build cost; doctrinally the right move.
- **No backend** — no form, database, serverless function, or email capture. The whole v2 feature is
  client-side.

**Deliberately NOT doing (and why):**
- **No "submit a question" inbox** — it would need a backend on a static site AND reverse the locked
  "companion = self-assessment, not an inbox" decision. The warm handoff + human off-ramp cover the
  same need without either cost.
- The inbox's real goal (learning what content is missing) is better served later by **passively
  logging which paths dead-end in "Chưa"** — an analytics signal telling the owner what to write, with
  nothing asked of the user and no email exposed. Separate future add (needs analytics), not this spec.

**Ownership / lanes:**
- **Session 7 (companion)** owns the bulk: the branching state machine + UI in `lib/dongHanh.ts`
  (follow-up selection by tag overlap, `visited` set, `MAX_CYCLES`, satisfaction step, warm-dead-end
  config) and `components/DongHanh*`.
- **The `short:` field** is content (Session 3, `content/giai-dap`) + a one-line loader parse
  (Session 2, `lib/giaiDap*`) — both optional/backward-compatible via the title fallback, so Session 7
  is **not blocked**: ship with title-fallback, backfill `short` labels later.
- **No entry-point, homepage, or backend changes** — nothing for Session 8; the existing
  `COMPANION_ENABLED` flag still covers the whole tool.

## Companion — relevance-curation pass (research session — number it when you start it)

**Why.** Even with Session 7's scoring/config fix, purely-algorithmic matching (`matchResources`) still
misses: a 30-tag vocabulary can't capture every "these two Q&As are *experientially* related" or "this
is the natural *next* question." This is an **offline analysis pass** that produces a reviewed
relevance map — better first-answers per situation, plus the follow-up chains v2 needs. (Triggered by
the suffering-path bug: broad category `god-meaning` pulled abstract "Ai Tạo Ra Chúa" answers above the
crucifixion cluster for a hurting user.)

**Not a runtime component.** The agent runs offline; the runtime stays deterministic (no LLM at request
time — the doctrinal-safety guarantee). It emits **proposals** the owner reviews and signs off; the
approved bits are then committed as data/config the existing matcher + v2 read. It changes NO runtime
behavior directly.

**Inputs:** all Q&As (`content/giai-dap/*.md`), council apologetics (`content/cong-dong/*.json`),
videos (`content/video/*.md`), the intake tree (`lib/dongHanh.ts` `SITUATIONS`/`STEPS`), and the
taxonomy (`lib/giaiDapTaxonomy.ts`).

**Deliverables (all as reviewable tables / proposed diffs):**
1. **Situation audit + curated routes.** For each of the ~15 situations: show what `matchResources`
   returns now (top ~6), flag off-topic pulls, and propose the fix — a **config edit** (the situation's
   category/tag list) where that suffices, or **explicit seed pins** where curation is needed. Judge
   each candidate against the situation's *intent* (its lead/advice text), not just taxonomy overlap:
   "would a hurting person find this consoling, or would it read as a lecture?"
2. **Follow-up chains (the v2 fuel).** For each Q&A (+ council Q&A), propose the 3–5 best "natural next
   question" follow-ups — model the reader's next move (curiosity / objection / deepening) from the
   actual pool. Encode as `related_qa` pins on the source Q&A — **optional overrides** that rank above
   pure tag-overlap, NOT a wholesale hand-map (tag-overlap stays the scalable default; pins are just the
   high-value corrections).
3. **Tag audit.** Flag mis-tags and gaps where 30 tags are too coarse to separate experientially-
   different Q&As (e.g. abstract-apologetics vs pastoral-consolation both under `god-meaning`). Propose
   specific new tags / re-tags — any new id goes into `lib/giaiDapTaxonomy.ts` first and must pass
   `scripts/check-tags.mjs`.
4. **Findings report** — the systemic patterns (e.g. "N situations lean on an over-broad category").

**Prefer config/tag fixes (scalable) over pins (manual);** use pins only where the algorithm can't get
there. Can be run as a fan-out (one agent per situation) since the situations are independent.

**Sequencing / dependencies:**
- Runs **AFTER** Session 7's scoring/config fix lands, so it audits the corrected baseline, not the
  known-broken one.
- Feeds BOTH the live tool (better routes now) and v2 (the follow-up chains). **Session 7 is not
  blocked** waiting for it — v2 ships on tag-overlap + the `short:` title fallback; approved pins/tags
  layer in as they're signed off.

**Lane / ownership.** This is an analysis session — it writes only the proposal doc. Applying approved
results is handed to the owning lanes (keeps lane discipline): new tags → **Session 2**
(`lib/giaiDapTaxonomy.ts`); `related_qa`/`tags`/`short` frontmatter → **Session 3**
(`content/giai-dap`); situation config → **Session 7** (`lib/dongHanh.ts`).

## Companion — "companions in suffering" (saints bridge, ready for Session 7)

**What.** A small, hand-curated element in the two suffering situations (`suffering`, `doubt-suffering`)
that introduces **1–2 saints as companions who *relied on God through* suffering**, linking to their
now-live Saints pages (`/cac-thanh/<slug>`).

**Why this is the right — and probably the only — "grow closer to God" bridge we need.** Suffering met
by reliance on God, the way the saints did, *is* growing closer to him. So this one bridge does double
duty: it **consoles AND carries the "grow deeper" desire**, through the pastoral path rather than a
separate "spirituality" branch. **Decision:** we likely do NOT need a standalone "grow closer to God"
door — growth runs *through* the pastoral situations, with the saints as the models of reliance.

**Framing — follow the content-guide "Pastoral tone" rule exactly** (docs/content-guide.md → "Pastoral
tone — suffering, grief, and the saints"). Presence → reliance → closeness: *"others walked through
this darkness and leaned on God — you can ask them to walk with you."* An **invitation, never "so
should you."** Lead with presence; reliance is an open door, not an assignment.

**Hand-curated, NOT tag-matched.** Pastoral tone is too important to leave to `matchResources` — a
tonally-wrong saint here does real harm. Author the shortlist by hand in the situation config; do NOT
surface saints in these situations algorithmically.

**Saint shortlist (reliance-first, all live in `/cac-thanh`):**
- `carlo-acutis` — a teen who offered his leukemia with peace; modern, relatable to illness / young grief.
- `therese-lisieux` — the "little way": trust and abandonment to God through hidden suffering + illness.
- **Các Thánh Tử Đạo VN** (`/cac-thanh/tu-dao-viet-nam`, e.g. `anre-dung-lac`) — relied on God unto
  death; the heritage anchor.
- `teresa-calcutta` — kept faith through years of interior darkness; apt for someone who feels God
  *absent* in grief.
- (also fitting: `bernadette-soubirous` chronic illness · `maximilian-kolbe` / `edith-stein` self-gift
  in Auschwitz · `padre-pio` · `faustina-kowalska`.)

Pick **1–2 per situation** (minimal — an invitation, not a catalogue):
- `suffering` (grief/loss, "You do not walk alone"): **Carlo Acutis + Thérèse** (illness/trust,
  young/relatable); optional heritage link to the VN Martyrs.
- `doubt-suffering` ("how can a good God allow this"): **the VN Martyrs + Teresa Calcutta** — witnesses
  who kept faith in the dark; anchors the branch's existing line "God entered our suffering on the cross."

**Implementation (Session 7 lane):**
- Add an optional `companions?: { href; name: Bi; line: Bi }[]` to the `Situation` type (where `line`
  is the one-sentence reliance, *shown not told*), populated only on the two suffering situations.
  Render under advice/scripture as a gentle **"Những người đã đi qua đêm tối / Companions who walked
  through the dark"** element, each item linking to `/cac-thanh/<slug>`.
- Keep 1–2 items, invitation framing, sitting **alongside** (never replacing) the pastoral "talk to a
  priest" off-ramp. Whole tool is already `COMPANION_ENABLED`-gated and the saint pages are live, so no
  dead links.

**Lane:** Session 7 (`lib/dongHanh.ts` situation config + `components/DongHanh*` to render). Links into
Session 9's live saint pages.

## Advanced search / topical-verse tool — retrieval-first (idea 2026-08-15)

A "smarter search bar": a visitor types a **situation or request in free text** — *"verses for grief,"
*"what do I do when my marriage is failing"* — and gets back **relevant Scripture (with a short gloss),
Catechism refs, and existing Q&As.** Essentially **the companion with a free-text box instead of guided
buttons** — same deterministic taxonomy engine, same Q&A pool, same hand-written glosses; different door.

**Firm line: RETRIEVAL, not generation. No AI for now (decided 2026-08-15).**
- ✅ **Build:** free-text input → **curated** content only — matching existing Q&As, a **topical verse
  index** (hand-picked verses per theme: grief / anxiety / hope / temptation / doubt / marriage… each
  with a *hand-authored* one-line gloss), and Catechism refs. Everything shown is human-verified.
- ⚠️ **Do NOT:** have an LLM write fresh commentary on verses per query — that's the roadmap's Tier-B
  risk (one wrong/heterodox reading quietly erodes trust on an apologetics site, and you can't review
  what you didn't write). kpv.vn's topical-verse feature is *curated/editorial*, not machine-generated —
  which supports the curated approach, not an LLM.
- **Where AI could safely enter LATER:** an LLM only to *interpret/route* a messy free-text query —
  never to *generate* the answer. Content stays curated; same doctrinal-safety gate.

**New pieces vs. what exists:** the engine (taxonomy matching, Q&A pool, glosses) already exists in the
companion. Genuinely new: (a) a **topical verse index** with hand-authored glosses, (b) free-text→
taxonomy input handling, (c) the search UI. **Dependency:** showing actual verse *text* rides on the
same **CGKPV licensing gate** as the scripture popover (`NEXT_PUBLIC_SCRIPTURE_POPOVER`) — until that's
resolved, the tool can show verse *references* + hand-glosses, not the full CGKPV text.

## Still open
- **Retrofit external `sources` / citations onto the OLDER content sections — Công Đồng (councils),
  Giáo Phụ (church fathers), Các Thánh (saints).** These were built *before* the `sources` field existed
  (Q&As have it; Miracles/Documents/Popes bake it in). The owner wants to go back and add cited sources so
  the hard facts (dates, events, quotes) show their provenance — consistent with the verify-facts /
  primary-source ethos (`CLAUDE.md`). **Two parts per section:** (a) add a `sources` field to that
  section's data model + detail-page rendering *(the section's owning session)*; (b) populate **verified**
  citations *(content)*. Reuse the `GiaiDapSource { label, url? }` shape. Substantial (~72 entries:
  30 fathers · 21 councils · 21 saints) — **pace it; prioritize the most fact-dense entries first**, and
  every citation web-verified before it ships.
- **Q&A card banner fallback (website, Session 2).** `components/GiaiDapBrowser` renders the topic-card
  banner from `/images/giai-dap/<anchor>.jpg` unconditionally — a missing file shows a BROKEN image
  (recurring bug). Add a graceful fallback: on `next/image` error, swap to a placeholder (a colored
  tile / topic icon / initials) so a forgotten banner degrades cleanly. Same pattern is worth checking
  anywhere else the site renders a slug-derived image (e.g. council/father portraits already handle
  `available:false` — Q&A cards don't).
- Content AI later: site-content-only with citations (recommended) vs. also online sources.
- Languages: companion flow bilingual (like the rest of the site) — assumed yes.
