# Per-Q&A social share cards (Open Graph images)

**Why:** when anyone shares a link on Facebook / Zalo / Messenger / Twitter, the platform fetches the
page's OG image and shows it as the preview. Today **every** URL on the site — homepage or a specific
answer — returns the same generic card (`app/opengraph-image.tsx`: "Hỏi Đáp Công Giáo" + tagline). So a
shared answer about the Resurrection previews as a logo instead of as **the question itself**.

**The win:** passive and compounding. Written once, every share by every visitor forever gets a card
that shows a real question — the thing that actually stops a scroll. Nothing to maintain per-answer.

**Lane:** Session 2 (`app/giai-dap`). Extends later to saints / miracles / councils (see bottom).

---

## What to build
Add **`app/giai-dap/[slug]/opengraph-image.tsx`** — Next's file-based convention wires it into
`og:image` + `twitter:image` automatically for that route (resolved absolute via `metadataBase`, see
`lib/siteUrl.ts`). No metadata plumbing needed.

Mirror the existing global card's structure (`app/opengraph-image.tsx`) — same `ImageResponse`,
`loadBrandFont`, `size = {width:1200, height:630}`, `contentType = 'image/png'`.

### Layout — the QUESTION is the hero
The global card is centered brand-first. This one is content-first:
- **Eyebrow:** the cluster `topic` (small, `#5C554E`, uppercase-ish) — gives context.
- **Hero:** `question_vi`, large, `#201E1D`, left-aligned, max ~3–4 lines.
- **Footer row:** the `HĐ` monogram tile (small — ~64px, radius ~14, `#C67139` bg, `#FBF8F3` text) +
  "Hỏi Đáp Công Giáo" so the brand is present but not dominant.
- **Background** `#FBF8F3`; keep the `#C67139` accent rule as a divider.

Reuse the exact brand tokens from the global card: bg `#FBF8F3` · accent `#C67139` · heading `#201E1D`
· muted `#5C554E` · monogram text `HĐ` (Satori has no reliable inline-SVG, so the mark is drawn as text).

### ⚠️ Three things that will bite
1. **Font subsetting — pass the question text.** `loadBrandFont(text)` subsets to the glyphs you give
   it. The global card passes `${TITLE}${TAGLINE}${MARK}·`. If you don't pass the question, **Vietnamese
   diacritics will be missing or render as tofu.** Pass the full question + topic + brand string.
2. **Long questions.** Some `question_vi` run long (one was flagged in proofreading as too long even for
   a card). Clamp: truncate at a sensible character count with `…`, and/or step the font size down a
   tier when the question exceeds a threshold. Never let it overflow the 630px canvas.
3. **Escaping/quotes.** Questions contain curly quotes `" "` and em dashes — verify they render rather
   than breaking layout.

### Generation
These are static content, so generate at build time (the route is already statically generated for 120
Q&As). Confirm the build doesn't slow unacceptably; if it does, consider `runtime = 'edge'` /
on-demand generation.

### Also export `alt`
Per-route `alt` should be the question text, not the generic site alt — it's the accessible description
platforms read.

---

## Verify (don't assume it works)
1. Fetch the generated image directly: `https://<site>/giai-dap/<slug>/opengraph-image` — confirm it
   renders, Vietnamese diacritics included.
2. Test a long-question slug and a short one; check clamping.
3. Run a real URL through the **Facebook Sharing Debugger** and a Twitter/X card validator. Note both
   **cache aggressively** — use their "scrape again" to force a refresh.
4. Check the page's `<head>` actually points `og:image` at the per-route URL, not the global one.

---

## Extend later (same pattern, other lanes)
Once this works, the identical approach applies to `app/cac-thanh/[slug]` (saint name + dates),
`app/phep-la/[slug]` (miracle + location/date), `app/cong-dong/[slug]` (council + year). Each is its own
section session's lane. Do the Q&A one first and let it prove the pattern.
