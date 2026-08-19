# PROGRESS — Hỏi Đáp Công Giáo

> ## ⚠️ STALE — read `docs/STATE.md` instead (flagged 2026-08-19)
>
> This file was last updated **2026-08-14** and has fallen five days behind. Since then the site
> gained **Công Đồng, Các Thánh, Phép Lạ, the Đồng hành companion, the Q&A taxonomy, sitemap/robots,
> and the evidence path** — none of which are described below. Its "Sections" list names only three.
>
> **`docs/STATE.md` is the single reliable entry point** (current snapshot, the numbered session
> registry, open threads, and the rules for parallel sessions). Use this file only for the
> deployment/setup detail it still carries, and trust nothing here about *what exists*.

> There is also an auto-loaded Claude Code memory for this project (index at
> `.claude/projects/<...>/memory/MEMORY.md`). This file is the in-repo, human-readable backup.

---

## What this is

A bilingual (vi/en) Vietnamese Catholic reference website on a **customized Next.js 16** (App Router)
+ React 19 + TypeScript.

⚠️ This Next.js has breaking changes vs. stock — read `node_modules/next/dist/docs/` before writing
framework code (see `AGENTS.md`).

Sections (`app/`):
- `giai-dap/` — Q&A ("Giải Đáp"). Content: `content/giai-dap/`, `content/content.json`.
- `giao-ly/`  — catechism reader ("Giáo Lý"). Content: `content/toc.json` + `content/content.json` (~3.2MB).
- `giao-phu/` — Church Fathers ("Giáo Phụ"). **Most recent active work** — see below.

---

## Deployment

- **GitHub:** https://github.com/minhofgod/hoi-dap-cong-giao (owner `minhofgod`, branch `main`).
- **Vercel:** connected via the GitHub integration (Vercel dashboard → Add New → Import repo), same
  pattern as the Visual Rosary site. **Every push to `main` auto-deploys** — no CLI needed. Vercel
  auto-detects Next.js; no `vercel.json` required.
- **To ship a change:** stage **only your own lane's files**, commit, then `git push origin main` →
  Vercel builds + deploys automatically.
  > ⚠️ **Corrected 2026-08-19.** This line used to say `git add -A`. That is now **wrong and unsafe** —
  > multiple sessions work in this repo at once, and `git add -A` sweeps up another session's
  > in-progress files. The standing rule is in `docs/STATE.md` → "Rules that keep parallel sessions
  > safe": **each session commits only its own lane's files, never `git add -A`.**
- **Env vars (both unset on Vercel by default):** `NEXT_PUBLIC_SCRIPTURE_POPOVER` — leave unset to keep
  the Scripture popover off (copyrighted CGKPV text; `content/bible.json` is gitignored, `lib/bibleRefs.ts`
  degrades to inert chips when absent). `NEXT_PUBLIC_CANVAS` — leave unset to keep the `/so-do` canvas
  diagrams hidden (route 404s + links hidden); set to `1` to publish them once finalized.
- Initial commit `c481fad`; git identity `minhofgod <minh.c.tran1992@gmail.com>` (repo-local).

---

## Current status

### Since 2026-08-13 — major additions (all live unless noted)

- **Deployed & live** at hoi-dap-cong-giao.vercel.app (auto-deploys on push to `main`).
- **Video library** (`/video`): index + watch pages for the 3 youtube.com/@MinhofGod videos.
  `content/video/*.md` (frontmatter: title, youtube_id, duration, order, summary; body = optional
  written companion). Facade YouTube embed (`components/VideoEmbed.tsx`, no cookies until play).
  Bilingual via optional `content/video/<slug>.en.md` (English body + title + summary). "Video khác"
  suggested list on watch pages. `lib/videos.ts`.
- **Global search** (`/tim-kiem`, `components/GlobalSearch.tsx`): the header search now points here and
  searches Giải Đáp + Giáo Lý (full-text via `public/search-content.json`) + Giáo Phụ + Video, grouped,
  reads `?q`. (Was previously a dead box that dumped into `/giao-ly/1`.)
- **Bilingual UI chrome:** `<T vi en>` helper (`components/T.tsx`) + `.ui-vi/.ui-en` in `globals.css`.
  Header nav, homepage, and the Video / Giải Đáp / search / Catechism / Fathers browsers + reader
  chrome all switch on the VI/EN/Cả hai toggle (now global in `SiteHeader`). `LanguageToggle` reads live
  `data-lang` via `useLang` so every instance stays in sync.
- **Sticky header** (`SiteHeader` is `position: sticky`).
- **Homepage redesign:** the 3 section cards are photo banners (sacred art); added a **Video** band and a
  **Đọc Kinh Mân Côi** companion band (→ dockinhmancoi.com, Murillo *Annunciation* image). About band +
  placeholder footer credits removed (commented out, not deleted).
- **Canvas diagrams** (`/so-do`, `components/CanvasViewer.tsx` + `lib/canvas.ts`): pan/zoom viewer for
  Obsidian `.canvas` files. **Gated OFF on Vercel** behind `NEXT_PUBLIC_CANVAS` (on locally via
  `.env.local`). First one: Sola Fide. Renders markdown + Obsidian callouts, strips vault wikilinks.
- **New logo:** `components/BrandMark.tsx` (inline SVG) + `app/icon.svg` favicon.
- **Giải Đáp:** 2nd cluster "Đức tin và việc làm" (Sola Fide); index redesigned as **topic cards**
  (`components/GiaiDapBrowser.tsx`); answer pages gained SiteHeader + prev/next + back links.
- **Two-session workflow:** content vs website split; conventions + the Grok blog prompts live in
  `docs/content-guide.md`. eslint now ignores nested `.next` (subagent worktree build output).
- ⚠️ **Dropbox + `.next`:** the repo is inside Dropbox; Dropbox syncing `.next` causes EPERM / broken
  HMR — restart `next dev` after edits, and exclude `.next` + `node_modules` from Dropbox sync.

### Giáo Phụ (Church Fathers) — active
- Data migrated to a **V2 layer**: `lib/churchFathersV2.ts`. All pages/components import from V2.
- ⚠️ Migration is **partial**: `app/page.tsx` (`getAllFathers`) and `components/Bi.tsx` (`Bi` type) still
  import the old `lib/churchFathers.ts` (V1). Finish = repoint those to V2, then delete V1.
- **32 per-father JSON files** in `content/giao-phu/*.json`, generated by `scripts/migrate-giao-phu.mjs`.
- Portraits in `public/images/church-fathers/`, fetched via `scripts/download-father-images*.mjs`
  (Wikimedia Commons **API**, no browser needed).
- **Portrait status: 27 / 30 done.** Remaining 3: john-cassian, gregory-the-great, isidore-of-seville —
  blocked by a sustained Wikimedia 429 IP-throttle after heavy session use. Finish later once the
  cooldown clears: `node scripts/download-father-images-stragglers.mjs` (grabs ~900px thumbnails) then
  `node scripts/migrate-giao-phu.mjs`. The 4 CC-licensed images (irenaeus, athanasius, cyril-of-alexandria,
  leo-the-great) now carry correct license + author credit via `PORTRAIT_META` in the migration.
- ⚠️ Verify a portrait's licensing via the Commons API `extmetadata` — do **not** open heavy image
  aggregator pages (picryl.com etc.) in the in-app browser; that crashed Claude repeatedly.
- Pages: `app/giao-phu/page.tsx` (list, grouped by era) + `app/giao-phu/[slug]/page.tsx` (detail).
- Components: `components/giao-phu/` (Portrait, Rail, CollapsibleSection, FigureRow, SectionHeading, Bi2).
- Era metadata: `lib/giao-phu/eras.ts`. Language hook: `lib/giao-phu/useLang.ts`.

### Giải Đáp (Q&A) — has content now
- First topic cluster built: **"Cầu nguyện với các thánh"** — 6 `.md` files in `content/giai-dap/`
  (1 featured anchor + 5 sub-questions), from the user's video script. Verses quoted in exact CGKPV
  wording pulled from the user's Obsidian vault (`D:\Dropbox\Obsidian Vault\Bible\CGKPV`, one .md per
  chapter, verses under `###### N` headings). Each carries `refs_ccc` (link into Giáo Lý) + `refs_scripture`.
- Convention for organizing clusters: `category` = topic (index groups by it), `featured: true` on the
  anchor. Index (`app/giai-dap/page.tsx`) groups by category, anchor first.
- **Article assembly:** the anchor carries `parts: [sub-slugs]`; its detail page composes overview + each
  part as a section with a sticky "Trong bài này" side nav. Subs carry `part_of` for a back-link. `parts` is
  the fixed original set; `related` is growable see-also. RULE: when adding a new related Q&A, PROMPT whether
  to merge into `parts` or just link as `related` (see memory `giai-dap-content-workflow`).
- Landing hero (`components/FeaturedQuestion.tsx`) shows a featured question + teaser + "Câu khác" cycler.

### Landing page — redesigned (see "Since 2026-08-13" above)
`app/page.tsx` order: photo section cards → hero (featured Q&A) → Giáo Lý band → Giáo Phụ band →
**Video band** → **Đọc Kinh Mân Côi band** → footer. Real sacred-art images now (no gradient
placeholders); the "Về trang này / Nguồn" band was removed (commented out).

### Reader (Giáo Lý) fixes
- Left-tree search now accepts a **paragraph number** (e.g. `847` → jump to `/giao-ly/811#847`), not just text.
- Right rail is `position: sticky` (viewport height); the "Trong bài này" list scrolls internally so the
  keyboard-shortcuts hint stays visible without scrolling past it.

### Site-wide
- `components/BackToTop.tsx` — floating back-to-top button (appears after 600px scroll), wired in `app/layout.tsx`.

### Health (as of 2026-08-14)
- `npx tsc --noEmit` — ✅ clean. `npm run lint` — ✅ clean. `npx next build` — ✅ (142 static pages).
- eslint ignores build output including nested `.next` under `.claude/worktrees/` (see `eslint.config.mjs`).
- React 19 `set-state-in-effect` post-mount localStorage/DOM reads carry scoped disables + reasons.

---

## Verify before calling any change "done"

Run from the project root and get both to **exit 0**:

```bash
npx tsc --noEmit
npx eslint
```

For larger changes also run `npm run build`. Then note the result.

Gotcha: React 19's `react-hooks/set-state-in-effect` flags valid post-mount localStorage/DOM
reads. Annotate those with a scoped `eslint-disable-next-line` + reason — don't restructure
correct hydration-safe code.

---

## Next / open questions (confirm with the owner)

**Deferred / TODO**
- [ ] **Catechism title i18n** — reader titles, the left TOC sidebar, and homepage part-card titles stay
  Vietnamese in EN mode because `content/toc.json` `titleEn` is misaligned at the article level. Fix by
  re-aligning from the Vatican CCC structure (matches 1:1: 4/8/20/67). Full plan in memory
  `todo-catechism-title-i18n`. The bilingual title rendering was built then reverted this session.
- [ ] English `.en.md` bodies for the other 2 videos (only the Resurrection one is bilingual so far).
- [ ] Finalize the remaining Obsidian canvases, then publish: set `NEXT_PUBLIC_CANVAS=1` in Vercel env
  and add a `/so-do/<slug>` page + `CANVAS_FOR` entry per topic.
- [ ] Fill the footer credit placeholders (`[nguồn]` / `[tên]` — currently commented out in `app/page.tsx`).
- [ ] Finish the last 3 Church Father portraits once Wikimedia's throttle clears (see Portrait status).
- [ ] Remove dead `lib/churchFathers.ts` (V1) once V2 is confirmed final.

**Ongoing**
- [ ] More Giải Đáp clusters + more videos (2 clusters + 3 videos so far).
- [ ] Optional: custom domain for the Hỏi Đáp site (Vercel Hobby allows it) like dockinhmancoi.com.

**Done since last update:** deployed to Vercel · Giải Đáp topic-cards redesign · global header search
(`/tim-kiem`) · Video library · bilingual UI chrome + synced language toggle · sticky header · homepage
photo cards + Video/Rosary bands.
