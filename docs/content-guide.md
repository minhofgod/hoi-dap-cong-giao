# Content guide — Hỏi Đáp Công Giáo

Reference for adding/editing **content** (videos, Q&A, images). Written so a content-focused
session can work without touching the app framework.

## Scope — what "content" means here

- **Video blog posts:** `content/video/*.md`
- **Giải Đáp Q&A:** `content/giai-dap/*.md`
- **Canvas diagrams** (currently unpublished, flag-gated): `content/canvas/*.canvas`
- **Images:** `public/images/**`

Leave `app/`, `components/`, `lib/`, styling, and config to the **main (website) session**. If a
content need requires a framework change (new field, new layout), flag it for the main session
rather than editing components directly — that keeps the two lanes from colliding.

## Vietnamese terminology — verify, don't translate (applies to ALL content)

The Vietnamese must read like real Vietnamese Catholic writing, **not** translated English. Proper
names — councils, heresies, saints, popes, technical theology terms — all have established Vietnamese
Catholic conventions, and getting them wrong is the #1 quality risk. For every entry:

1. **Verify each key term against the site's own Vietnamese content first** — it's derived from
   official Vietnamese Catholic translations and is the in-house authority for consistency:
   ```bash
   grep -oF "Nicêa" content/content.json          # Catechism VI
   grep -oF "Athanasiô" content/giao-phu/*.json    # Giáo Phụ VI
   ```
2. **For terms not yet in the site**, use an authoritative Vietnamese Catholic source —
   **HĐGM Việt Nam (hdgmvietnam.com)** or the Vietnamese CCC — not a fresh transliteration.
3. **Do NOT trust Vietnamese Wikipedia for terminology** — it's often translated from English and
   uses scholarly Latin forms ("Nicaea", "Trentô", "Constantinopolis") instead of the traditional
   phonetic Catholic forms the site uses ("Nicêa", "Triđentinô", "Constantinôpôli").
4. **Prefer the traditional Vietnamese Catholic phonetic forms.** Write both languages together,
   anchoring the Vietnamese to these sources — never English→VN or VN→EN as a blind translation.

**Verified reference (from the Catechism VI):** Councils — Nicêa I/II · Constantinôpôli I/II/III/IV ·
Êphêsô · Chalcêđônia · Latêranô I–V · Lyon I/II · Vienne · Constance · Basel/Florentia · **Triđentinô**
(Trent) · Vaticanô I/II. Ecumenical council = "Công đồng chung". Heresies — lạc thuyết Ariô · Nestôriô ·
Nhất tính thuyết (Monophysitism) · Nhất chí thuyết (Monothelitism) · Bài trừ ảnh tượng (Iconoclasm).
Athanasius = "Athanasiô".

> ⚠️ **Audit existing content:** the Giáo Phụ (Church Fathers) entries predate this rule — spot-check
> their Vietnamese names/terms against the sources above (likely mostly fine, but not verified).

**Quote marks:** for a quoted word or phrase inside prose, use curly double quotes `“ ”` — that's what
the Catechism content (`content.json`) uses throughout. Do **not** use French guillemets `« »`, even
though they're valid Vietnamese typography; they'd be inconsistent with the rest of the site.

## Images — every new image also goes in the Catholic Images library (applies to ALL content)

When you add ANY image to the site (`public/images/**`), also add it to the shared **Catholic Images
library**, so provenance is never lost and images can be reused across the user's sites. Two steps:

1. Copy the file into `..\Catholic Images\images\`, named with its **original Wikimedia filename**
   (the library's convention, e.g. `Gregorythegreat.jpg`).
2. Append a row to `..\Catholic Images\CREDITS.csv` — 7 quoted columns:
   `original_filename, title, artist, subject, wikimedia_source, Visual Rosary Website,
   Hỏi Đáp Công Giáo Website`. Fill the **last** column with where it's used on this site
   (e.g. `"Công Đồng · Nicaea I — council image"`); leave the Visual Rosary column empty unless it's
   used there.

Always prefer public-domain images and confirm the license on the image's Wikimedia Commons page
before using it.

## Pastoral tone — suffering, grief, and the saints (applies to ALL content)

Any content a hurting or grieving person might reach — the companion's suffering branches, saint
stories of martyrdom/illness, Q&As on suffering / evil / loss, and the videos/blogs — must be framed
as **companionship and an invitation to lean on God**, never as instruction, comparison, or demand.

- **Do:** *"others walked through this darkness too — you can ask them to walk with you."* Lead with
  presence. Then, gently, the reliance-as-growth arc: the saints didn't grow closer to God *despite*
  their suffering but *through* it, by leaning on him — so the reader is **invited** (never told) that
  they can lean on him here too. Presence → reliance → closeness.
- **Don't:** *"look how they suffered, so should you"* — to someone in fresh grief this reads as
  dismissive. Avoid comparing their pain to a saint's as a lesson, minimizing the pain, or tossing off
  "offer it up" as a glib instruction. Reliance is an open door, not an assignment.
- **Choose saints who visibly *relied* on God, not merely suffered** — the martyrs (trusted God unto
  death), Carlo Acutis (offered his illness), someone who grieved and held on. Show the reliance in the
  story; don't preach it.
- This **complements, never replaces**, the "talk to a priest / a real person" off-ramp. For acute
  grief, a webpage is a companion, not a counselor.

Rooted in the faith's own answer to suffering: *God did not stay outside our suffering — he entered it
on the cross* (the companion's `doubt-suffering` situation already says this). The saints are simply
the people who took him up on that.

## Video blog posts

File: `content/video/<slug>.md`. Frontmatter:

```yaml
---
title: "Tại Sao Chúa Giêsu Chịu Đóng Đinh?"   # page title
youtube_id: "q5QbqmQ74Mg"                      # 11-char YouTube ID
duration: "9:31"
order: 1                                        # display order on /video
summary: "1–2 câu tóm tắt."                     # shown under the player + on the index card
---
```

Everything **below** the `---` is the optional written companion (Markdown), rendered under the
player. Supported: `##`/`###` headings, `**bold**`, `-` lists, `>` blockquotes, links, images.

**Bilingual (optional):** add an English version as `content/video/<slug>.en.md` — its body is the
English companion, and its frontmatter may carry an English `summary`. When that file exists, the
watch page shows the VI/EN/Cả hai toggle and renders both; with no `.en.md`, the page is Vietnamese
only. (The global toggle lives in the site header.)

**Writing the companion piece** — the Markdown may come from Grok (which has no repo access, so it
only produces text to paste in) or be written directly. Typical flow with Grok:

1. Send the blog prompt (appendix below) to Grok — it returns a 300–500 word Vietnamese Markdown
   companion with inline scripture refs and a `## Nguồn tham khảo` sources list. (Or write/paste
   the Markdown yourself.)
2. Paste the Markdown **below the frontmatter** in the matching file.
3. **Spot-check the sources** — Grok (or any LLM) can invent citations; verify before publishing.

For **evidence-heavy videos** (lots of sources, few verses — e.g. the Resurrection), it works
better to have Grok **dump all its research first** (Appendix B), then write/condense the companion
*here* from that dump — verifying the `[cần kiểm chứng]` sources with WebSearch/WebFetch and
dropping any that can't be confirmed before publishing.

**Images in a post:**

- Put files in `public/images/video/<slug>/<name>.jpg`; reference as `/images/video/<slug>/<name>.jpg`.
- Prefer public-domain sacred art / historical images; keep a note of the source.

## Current videos (from youtube.com/@MinhofGod)

More videos will be added over time — create a new `content/video/<slug>.md` for each.

| slug | youtube_id |
|------|-----------|
| `tai-sao-chua-giesu-chiu-dong-dinh` | q5QbqmQ74Mg |
| `bang-chung-chua-giesu-song-lai` | H09DOyx93Rc |
| `bang-chung-lich-su-cua-kinh-thanh` | 6raOadKc54Q |

## Giải Đáp Q&A — turning a source into questions

This is the workflow for converting a **source** — a video script, a blog post you wrote elsewhere,
or a back-and-forth with someone in the comments — into Giải Đáp Q&A content. (The
`giai-dap-content-workflow` memory has the same workflow in brief; this is the fuller version.)

### The data model

Files: `content/giai-dap/<slug>.md`. The slug is the URL (`/giai-dap/<slug>`). `EXAMPLE.md.txt` in
that folder is a format reference (the `.md.txt` extension keeps it unpublished). Frontmatter:

```yaml
---
question_vi: "Câu hỏi bằng tiếng Việt, hỏi như một người thật sẽ hỏi"
question_en: "The same question in English"      # used by search + future EN
topic: "Tên chủ đề (cụm)"                         # cluster name — the /giai-dap index groups by this
category: "mary-saints"                           # ONE broad category id (see taxonomy below)
tags: ["saints", "prayer"]                        # cross-cutting tag ids (see taxonomy below)
subcategory: "Nhánh nhỏ của chủ đề"
refs_ccc: [956, 2683]                             # CCC paragraph numbers → link into Giáo Lý
refs_scripture: ["Lc 20,38", "Gc 5,16"]           # inert chips (VN abbreviations)
featured: false                                   # true = the cluster's anchor
part_of: "<anchor-slug>"                          # members only — back-link to the anchor
parts: []                                         # anchor only — ordered member slugs
related: []                                       # see-also sibling slugs
---
Body in Vietnamese Markdown (paragraphs, **bold**, lists, > blockquotes). VI only — the
detail page renders questionVi + one body, no language toggle.
```

### The 3-level taxonomy — `topic`, `category`, `tags`

Three separate axes, all defined in one place: **`lib/giaiDapTaxonomy.ts`** (bilingual labels).

- **`topic`** — the *cluster* name (free Vietnamese text, e.g. `"Cầu nguyện với các thánh"`). The
  `/giai-dap` grid shows one card per topic. (This is what the old `category` field held — it was
  renamed to `topic`.)
- **`category`** — ONE broad, audience-facing category, stored as a **stable id** (not a label) so a
  seeker/atheist can filter to it. Valid ids: `science-faith`, `evidence-history`, `god-meaning`,
  `theology-doctrine`, `the-church`, `mary-saints`, `scripture`, `morality-life`.
- **`tags`** — cross-cutting tag **ids**, many per Q&A: `mary`, `papacy`, `eucharist`, `trinity`,
  `jesus`, `resurrection`, `saints`, `faith`, `works`, `grace`, `salvation`, `bible`, `confession`,
  `prayer`, `suffering`, `marriage`, `evangelization`, `science`, `evolution`, `miracles`,
  `church-history`, `authority`, `icons`, `purgatory`, `baptism`, `atheism`, `protestant-objections`,
  `free-will`.

Use the **ids** verbatim (ascii-kebab), not the display labels — the labels resolve from the
taxonomy file in both languages. To add or rename a category/tag, edit `lib/giaiDapTaxonomy.ts`
(that's the whole change). Unknown ids still render (they fall back to showing the raw id), so a
typo shows up as an odd chip rather than a crash. Files without `topic`/`category`/`tags` still work
(backward-compatible): the loader reads a legacy `category:` as the `topic`.

### A topic = a cluster

A rich source (a whole video, a long blog) becomes a **cluster**: one **anchor** question
(`featured: true`) that gives the overview, plus several **member** questions, each tackling one
objection. The anchor lists its members in `parts:` (ordered); each member has `part_of:` pointing
back. The anchor's page assembles the overview + every part as sections with a side nav; the member
pages stay separate for search/SEO (no content duplication). `featured: true` also leads its group
on `/giai-dap` and can appear in the homepage hero.

A single comment or one-off objection becomes **one** Q&A, `related`-linked to an existing cluster
if it fits. **Owner-set rule:** never auto-add a new question to an existing anchor's `parts:` —
**ask** whether to merge it into the article (`parts`) or just cross-link it (`related`). Default to
`related`.

### The process (per source)

1. **Read the source, extract the real questions.** List the distinct objections/misconceptions it
   answers, each phrased as a *real person* would ask (natural, even skeptical) — not a soft
   catechism prompt. **Show the user this question list and get a nod before writing the answers.**
2. **Decide cluster vs single**, and whether it extends an existing `category` (reuse the exact
   category name so it groups) or starts a new one.
3. **Write each answer** in Vietnamese: lead with the short direct answer (often "Không. …" or
   "Có. …"), then the reasoning, then Scripture, then tie it to the Catechism, then a one-line
   takeaway. Use the source's arguments as the backbone; you may strengthen with Scripture, CCC, and
   standard Catholic teaching, but **never invent** facts, quotes, citations, dates, or numbers.
4. **Source every answer.** Each answer carries **≥1 `refs_ccc`** (sourcing is the point of the
   site). Verify Scripture refs and **extract verse text from CGKPV** (see below) — do not hand-type
   sacred text. Render a quoted verse as a `>` blockquote with a `— Abbr C,V (CGKPV)` citation.
5. **Verify terminology** per the "Vietnamese terminology" section above (grep the site + HĐGM VN;
   never VN Wikipedia). Keep the tone **charitable**, not polemical — especially for Protestant or
   other objections (the "Cầu nguyện với các thánh" cluster models this).
6. **Wire the cluster:** anchor `parts:` lists the real member slugs in order; each member has
   `part_of:` + `related:`. Double-check every slug in `parts`/`related` matches an actual file.
7. **Verify before done:** `npx tsc --noEmit` and `npm run lint` clean; the new files parse; the
   pages render at `/giai-dap/<slug>`.

### CGKPV — extracting verse text (never hand-type)

The CGKPV Vietnamese Bible lives at `D:\Dropbox\Obsidian Vault\Bible\CGKPV` → `Cựu Ước` / `Tân Ước`
→ `NN Book\Book C.md` (one file per chapter). Verses are `###### N` headings followed by the text;
the file's frontmatter `aliases` holds the VN abbreviation (Lc, Gc, 1 Tm, Kh, Dt, Mt, 1 Cr, Ga,
Đnl…). Extract a verse with a small node script that slices between `###### N` markers. Multi-verse
quotes use superscript verse numbers (¹²³).

### Good-Q&A checklist

- One question = one real objection, in a real person's voice.
- Direct answer first, then reasoning → Scripture → Catechism → takeaway.
- ≥1 `refs_ccc`; Scripture verified + extracted from CGKPV; nothing invented.
- Charitable tone; verified Vietnamese terminology.
- Slug is descriptive kebab-case from the Vietnamese, no diacritics.
- Inline refs written as VN abbreviations `(Lc 20,38)` so the Scripture popover can detect them.
- **Anchor image — REQUIRED for a `featured: true` anchor.** The topic card renders a banner from
  `public/images/giai-dap/<anchor-slug>.jpg`; if the file is missing the card shows a **broken image**
  (this has bitten us more than once). So every featured cluster anchor MUST get a banner
  (public-domain; follow the Images rule above — also add it to the Catholic Images library). Sanity
  check after creating a cluster: `ls public/images/giai-dap/<anchor-slug>.jpg`.
  *(Framework safety net: the card should also fall back to a placeholder when the file is missing so a
  forgotten banner never breaks — tracked in docs/roadmap.md.)*

## Videos ↔ Q&A — two expressions of one topic (applies to both)

A **script** is working source material; the **video** (spoken) and the **Q&A/blog** (written) are two
INDEPENDENT expressions of the same topic. They're siblings, not source-and-transcript:

- **Author + verify each on its own, in its own register.** A Q&A written from a video's script is
  NOT its transcript — write it in Q&A style, cite its own sources, and don't edit it to match the
  video's wording (or vice versa). The spoken video drifting from the written Q&A is fine and expected.
- **They link by shared tags, not by derivation** — give a video the same `category` + `tags`
  (from `lib/giaiDapTaxonomy`) as its topic. That alone lets the companion tool, the `/giai-dap`
  filters, and search connect a video with its sibling Q&As, with no "one came from the other" claim.
- **Optional, symmetric cross-links only:** `related_video: <slug>` on a Q&A cluster anchor and
  `related_qa: [<slugs>]` on a video — rendered as "related," never "the source." Add only for a
  genuinely close pairing.
- **Every finished script → a Q&A cluster** — whether or not it also became a video. Don't leave a
  published video represented only by its companion blog: run its script through the Giải Đáp workflow
  into a proper cluster too, so the video's questions are individually findable. (The companion blog
  stays — it's its own complementary piece and may add more than the video says.) So one topic can
  carry three siblings: the video (watch), the companion blog (read-alongside), the Q&A cluster (find
  the specific answer) — all linked by shared tags.
- **Scripts stay OFF the site** (they're drafts). Track which finished scripts have become a video
  and/or a Q&A in a separate off-site tracker; here we publish only videos + Q&As.

## How new content reaches the companion (Đồng hành)

The `/dong-hanh` companion has two halves that update very differently — know which you're touching:

- **The content it routes people TO → updates automatically.** The pool is rebuilt every deploy from
  `getAllQuestions()` + `getCouncilApologetics()` + `getAllVideos()`, then scored against each intake
  situation by `category` (+3) and each `tag` (+1). So a **new Q&A/video appears in the companion on
  the next build with zero companion edits** — *provided it's tagged.* An untagged item (`category`/
  `tags` missing) scores 0 and is **invisible** to the companion. This is the whole reason the tagging
  step is non-negotiable: tag it and the companion stays current for free. (Note: each situation shows
  only its top ~6, so new content *competes* on relevance — the best matches surface, not literally
  everything.)
- **The questions it ASKS → hand-authored, never automatic.** The intake branches and the ~15
  situations live in `lib/dongHanh.ts` (deterministic, no LLM, doctrinally curated). Adding content
  does **not** create a new question, branch, or choice. Edit `lib/dongHanh.ts` by hand **only** when a
  new body of content opens a situation the tree doesn't yet ask about (e.g. a Saints section → a new
  "find a patron / a saint's story" branch). Content that merely deepens an existing category needs no
  tree edit — it flows into the matching situations on its own.

**Takeaway:** tag every Q&A/video and the companion's *answers* self-update; only touch
`lib/dongHanh.ts` when you want to expand the *questions it asks*.

## Verify + deploy

- Before finishing: `npx tsc --noEmit` and `npm run lint` both clean.
- **Tag guard — run `node scripts/check-tags.mjs`.** Fails if any `content/giai-dap/*.md` or
  `content/video/*.md` is missing a `category`, has empty `tags`, or uses an id not in
  `lib/giaiDapTaxonomy.ts` — i.e. anything the companion/filters would silently drop. Must exit 0
  before you commit content. (English `*.en.md` sidecars are skipped — they inherit taxonomy from the
  main file.) If you add a genuinely new tag, add its id to `lib/giaiDapTaxonomy.ts` first.
- Commit + push to `main` → Vercel auto-deploys.
- Note: `.next` sits inside Dropbox, so hot-reload can stall — restart `next dev` after edits if
  the preview stops updating.

---

## Appendix A — Grok blog prompt (Grok writes the companion)

Paste this into the Grok chat that already has the video's research. It's generic — it refers to
"the video" (whatever that chat is about), so the same prompt works for every video.

```text
I have research and evidence in this chat about the topic of a video I made. Compile it into a
short, well-sourced written companion for the BLOG POST that will appear under that video on my
Vietnamese Catholic website.

Write in VIETNAMESE, natural and accessible (audience: Vietnamese Catholics and curious
inquirers). It is a companion to the video, not a transcript.

OUTPUT FORMAT (it will be pasted into a Markdown file — follow exactly):
- Markdown only. No YAML/frontmatter. NO H1 / no top-level title. Do NOT wrap the whole answer
  in a code fence.
- Start with a 1–2 sentence intro, then 2–4 short sections using ## (and ### if needed) headings
  that follow the video's argument, then a one-sentence takeaway.
- Length: 300–500 words.
- Allowed formatting: ##/### headings, **bold**, - lists, > blockquotes, [text](url) links.

SCRIPTURE:
- Cite verses inline with Vietnamese abbreviations, e.g. (Ga 3,16), (Mt 28,5-6), (1 Cr 15,3-4).
- Quote a verse (as a > blockquote) only when central; keep it short and name the translation.

SOURCES & ACCURACY (the priority):
- End with a section "## Nguồn tham khảo" listing the REAL, verifiable sources behind the claims
  (books, papers, primary texts, encyclopedic entries); add links only if you are confident the
  link is real and stable.
- NEVER invent sources, quotes, authors, dates, or numbers. If unsure something is real, leave
  it out.
- For historical claims (manuscripts, ancient authors, archaeology, etc.), clearly separate
  historical/scholarly CONSENSUS from FAITH claims — say which is which, and do not overstate.

IMAGES (suggest 1–3, as TEXT ONLY — do NOT use Markdown image syntax):
- Where an image would help, put a plain marker on its own line, exactly like this:
  **[Ảnh gợi ý: mô tả ảnh cần tìm — nguồn phạm vi công cộng, ví dụ tên bức tranh + tác giả trên Wikimedia Commons]**
- Do NOT output ![...](...) or any image link — only the bold-text marker, so nothing tries to load.

Give me the finished Markdown, ready to paste.
```

The content session then converts each `**[Ảnh gợi ý: …]**` marker into a real image (sources a
public-domain file into `public/images/video/<slug>/`) and adds any internal cross-links.

## Appendix B — Grok research-dump prompt (you condense it here)

Use this when a Grok chat holds a lot of researched evidence (esp. from back-and-forth questions).
It dumps everything — including dead links and images it showed — so nothing is lost in handoff.
The content session then rewrites it into a focused companion and verifies the flagged sources.

```text
In THIS chat we researched the topic of a video I made. Before I move on, compile EVERYTHING
you've gathered here into one organized reference document I can hand to another tool to turn into
an article. Don't summarize away detail — this is raw material, so be thorough.

Include:
- Every piece of evidence / argument we discussed, each with a short note on what it is and why it
  matters.
- For each, the SOURCES — author / title / date and the link, EVEN IF the link is now broken or
  you're unsure it works. Include the URL anyway and mark it "[link có thể đã hỏng]".
- Any images or photos you showed earlier — describe what each depicted and give its source/URL
  (even if no longer accessible), so it can be re-found later.
- Relevant context: dates, names, places, counterarguments, and scholarly disagreements.

Organize with ##/### headings grouped by theme (e.g. by type of evidence) and bullet lists. Write
in Vietnamese; keep proper names and source titles in their original language.

ACCURACY — important:
- Do NOT invent sources, quotes, numbers, or links. Include only what actually came up here or
  that you can genuinely stand behind.
- Tag each source: "[chắc chắn]" if you're confident it's real and accurately described, or
  "[cần kiểm chứng]" if you're not sure. Flagging doubt is better than guessing.
- Clearly separate historical/scholarly CONSENSUS from FAITH claims and from DISPUTED points.

This is a data dump for handoff, not a finished article — completeness and honest sourcing matter
more than polish or length.
```
