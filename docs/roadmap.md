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

## Draft vocabulary — TO REFINE with the owner (not final)

**Categories** (broad, audience-facing — a seeker/atheist should see themselves here; pick 1 per Q&A):
1. Science & Faith — evolution, cosmology, miracles vs. science
2. Evidence & History — Resurrection, historicity of Jesus, reliability of the Bible, archaeology
3. God & Meaning — does God exist, suffering/problem of evil, purpose (most seeker-facing)
4. Theology & Doctrine — Trinity, Christ, grace, salvation, sacraments
5. The Church — papacy, authority, Church history, unity, scandals
6. Mary & the Saints
7. Scripture — interpretation, apparent contradictions, canon
8. Morality & Life — relationships, marriage/mixed-marriage, moral questions

**Tags** (cross-cutting, many per Q&A — seed list): Mary · Papacy · Eucharist · Trinity · Jesus ·
Resurrection · Saints · Faith · Works · Grace · Salvation · Bible · Confession · Prayer · Suffering ·
Marriage · Evangelization · Science · Evolution · Miracles · Church history · Authority · Icons ·
Purgatory · Baptism · Atheism · Protestant objections · Free will.

## Still open
- Finalize the category list + tag vocabulary above.
- Rename the frontmatter `category` → `topic`, or add a new broad `category` alongside it? (leaning:
  add `category` for the broad level, rename the existing one `topic`, add `tags: []`.)
- Content AI later: site-content-only with citations (recommended) vs. also online sources.
- Languages: companion flow bilingual (like the rest of the site) — assumed yes.
