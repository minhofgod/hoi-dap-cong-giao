# Project state & how to resume — START HERE

If you've lost your sessions (or Claude), this is the single entry point. A new Claude session in
this folder auto-loads the memory index, so it already knows the project; this file adds the current
state, the active work streams, and how to recover.

## How to resume
1. **Memory auto-loads.** Any new Claude session in this folder gets the memory index (`MEMORY.md` +
   notes: project overview, deployment, sections, roadmap). It already knows the stack + conventions.
2. **Read, in order:** this file → `docs/roadmap.md` (the plan + locked decisions) → `PROGRESS.md`
   (what's been built). `docs/content-guide.md` = how to author content.
3. **See recent work:** `git log --oneline -30`.
4. **Recover a lost chat:** in the terminal, `claude --resume` (or `claude -r`) lists past sessions
   in this folder to reopen — transcripts are saved on disk, so they're recoverable.

## Where things stand (snapshot — 2026-08-15)
**Live on `main` → Vercel:** Catechism reader; Giáo Phụ (30 Church Fathers); **Công Đồng — all 21
councils**; Video (3); Giải Đáp Q&A with the 3-level taxonomy (9 categories, 30 tags) + category/tag
filters; global search; bilingual VI/EN; CCC + inline-`GLHTCG` popovers.
**Built but gated OFF in production** (flag unset on Vercel, set locally): Scripture verse popover
(`NEXT_PUBLIC_SCRIPTURE_POPOVER`, CGKPV licensing); Canvas `/so-do` (`NEXT_PUBLIC_CANVAS`); the
Đồng hành companion `/dong-hanh` (`NEXT_PUBLIC_COMPANION`).
**In progress:** the Đồng hành companion (finishing the flag-gating + folding videos into its pool);
video ↔ Q&A linking via shared tags (see `docs/roadmap.md` "Content link model").

## Active work streams (parallel sessions)
Each session owns a **disjoint** set of files so they never collide. If a stream is lost, restart it
with the matching prompt in `docs/roadmap.md` / the content-guide.

| Stream | Does | Owns (files) | Status |
|---|---|---|---|
| Website / Taxonomy | framework; Q&A taxonomy + filters | `app/giai-dap`, `app/tim-kiem`, `components/GiaiDapBrowser`, `lib/giaiDap*`, `lib/giaiDapTaxonomy` | taxonomy DONE |
| Companion (Đồng hành) | `/dong-hanh` guided tool | `app/dong-hanh`, `components/DongHanh*`, `lib/dongHanh`, `lib/videos`, `lib/companionFlag` | building; gating + video pool pending |
| Content — Q&A | scripts → Giải Đáp Q&A | `content/giai-dap`, `public/images` | ongoing |
| Content — Video companions | video blog companions + video tags | `content/video`, `public/images` | ongoing |
| Councils | the 21 ecumenical councils | `content/cong-dong`, `app/cong-dong` | DONE (21/21) |
| Bible backend | verse-lookup / scripture popover data | `scripts/build-bible.mjs`, `content/bible.json` | done |

## Rules that keep parallel sessions safe
- Each session commits **only its own lane's files** — never `git add -A`.
- Push to `main` → Vercel auto-deploys (no PRs; solo project). To keep unfinished work off the public
  site, gate it behind a `NEXT_PUBLIC_*` flag (unset on Vercel = hidden) rather than reverting.
- Verify `npx tsc --noEmit` + `npm run lint` clean before committing.

> Keep the snapshot + the work-streams table roughly current: when a stream finishes a milestone,
> update its row here so this stays the reliable "start here."
