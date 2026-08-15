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
- **Optional page cross-links are symmetric + loose:** `related_video: <slug>` on a Q&A cluster
  anchor, `related_qa: [<slugs>]` on a video — shown as "related," NEVER as "the source/transcript."
  Add only where a pairing is genuinely close, so divergence never reads as a contradiction.
- **Scripts are not a published content type** — they're drafts. Track "script → video? → Q&A?" in an
  OFF-SITE tracker (sheet/Notion) so finished-but-unmade scripts don't fall through the cracks. The
  site only publishes videos + Q&As.

**Build order:** Layer 1 — add `category` + `tags` to video frontmatter (content) + parse them in
`lib/videos.ts` (website) + add videos to the companion's resource pool as `kind: 'video'` with a
play-icon treatment (companion session). Layer 2 — the optional `related_video`/`related_qa` page
cross-links.

## Still open
- Content AI later: site-content-only with citations (recommended) vs. also online sources.
- Languages: companion flow bilingual (like the rest of the site) — assumed yes.
