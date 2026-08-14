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

## Giải Đáp Q&A

See the `giai-dap-content-workflow` memory. Files: `content/giai-dap/*.md`. A topic = a cluster:
one anchor (`featured: true`) + member questions (`part_of: <anchor-slug>`, and listed in the
anchor's `parts:`). Frontmatter keys: `question_vi`, `question_en`, `category`, `subcategory`,
`part_of` / `parts`, `refs_ccc`, `refs_scripture`, `featured`, `related`.

## Verify + deploy

- Before finishing: `npx tsc --noEmit` and `npm run lint` both clean.
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
