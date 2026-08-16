# Q&A `sources` field — external citations

Add a structured `sources` field to Giải Đáp Q&As for **external citations** (books, papers,
historians, datasets — the science/history apologetics lean on them), rendered as a tidy
"Nguồn tham khảo" block on the answer page.

**Distinct from `refs_scripture` / `refs_ccc`** (those are popover chips into the Bible/Catechism).
`sources` are **plain external references**, some with links — **no popover**.

## Schema (frontmatter — optional, backward-compatible; absent = nothing rendered)
```yaml
sources:
  - label: "Stephen Hawking, A Brief History of Time (Bantam, 1988), ch. 8"
    url: "https://example.org/…"      # optional; omit if no stable link
  - label: "Edwards WD et al., “On the Physical Death of Jesus Christ,” JAMA 1986;255:1455–1463"
```
`label` = full human-readable citation; `url` = optional stable link.

## Work — Session 2 (Website/framework) · lane `lib/giaiDap*`, `app/giai-dap/[slug]`, components/CSS
**Don't touch `content/giai-dap/*.md` bodies — that's the content session's lane.**

1. **`lib/giaiDap.ts`** — add `sources: { label: string; url?: string }[]` to the question type; parse
   `data.sources ?? []` (mirror `refsCcc` / `refsScripture` at ~lines 29–30, 71–72).
2. **`app/giai-dap/[slug]/page.tsx`** — render a "Nguồn tham khảo" section per question/part that has
   `sources`, alongside the existing `<Refs …/>` (see ~lines 245, 252, 303–308). Each source is a list
   item: **plain text**, or an **anchor** when `url` is present (external → `target="_blank"
   rel="noopener noreferrer"`). **NOT a popover.** If the companion's inline reading view reuses this
   rendering it comes along for free; otherwise leave it to the detail page.
3. **`answer.module.css`** — style the block to match the existing refs section (small, muted,
   unobtrusive).

**Verify:** `npx tsc --noEmit` + `npm run lint` clean. Render a Q&A with a couple `sources` (one linked,
one unlinked) and confirm the block shows and external links open safely.

## Hand-off — Session 3 (Content), once the field ships
Populate `sources:` on the science/history clusters — each citation **verified before it ships**, links
only where stable:
- **Vũ trụ được thiết kế** — Hawking, Penrose, Rees, NASA
- **Khoa học và Đức tin** — Lemaître, Hubble, Einstein (1933)
- **Bằng chứng Chúa Giêsu sống lại** — Tacitus, Josephus, JAMA 1986
- **Bằng chứng lịch sử của Kinh Thánh** — Tacitus / Josephus, manuscript data

## Hand-off table
| Session | Task |
|---|---|
| **2** | Build the `sources` field: type + parse (`lib/giaiDap.ts`), render "Nguồn tham khảo" block (`app/giai-dap/[slug]`), style it (CSS). tsc + lint clean. |
| **3** | *(after 2 ships)* Populate `sources:` on the science/history clusters above — citations verified, stable links only. |

Order: **2 → 3** (the field must exist before content can use it). Independent of the other Session 2
UX work (the "See also" rail) — same file, same session sequences it.
