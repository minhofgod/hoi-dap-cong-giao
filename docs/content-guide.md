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

**Writing the companion piece** — the Markdown may come from Grok (which has no repo access, so it
only produces text to paste in) or be written directly. Typical flow with Grok:

1. Send the blog prompt (appendix below) to Grok — it returns a 300–500 word Vietnamese Markdown
   companion with inline scripture refs and a `## Nguồn tham khảo` sources list. (Or write/paste
   the Markdown yourself.)
2. Paste the Markdown **below the frontmatter** in the matching file.
3. **Spot-check the sources** — Grok (or any LLM) can invent citations; verify before publishing.

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

## Appendix — Grok blog prompt

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
