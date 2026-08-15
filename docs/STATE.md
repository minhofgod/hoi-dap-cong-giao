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

## The sessions (numbered registry)
Several parallel Claude sessions run at once — refer to them by **number**. Each owns a **disjoint**
set of files so they don't collide (see the watch-points below). If one is lost, restart it with the
matching prompt in `docs/roadmap.md` / the content-guide, or `claude --resume`.

| # | Session | Owns (its lane) | Does | Status |
|---|---|---|---|---|
| 1 | Video Blog Companion | `content/video`, `public/images/video` | video blog companions + video tagging | active |
| 2 | Q&A taxonomy / website | `app/giai-dap`, `app/tim-kiem`, `app/video`, `components/GiaiDapBrowser`, `lib/giaiDap*`, `lib/giaiDapTaxonomy` | framework; taxonomy + filters; video↔Q&A cross-links | taxonomy done · next: auto cross-links |
| 3 | Content setup (script → Q&A) | `content/giai-dap`, `public/images/giai-dap` | Giải Đáp Q&A clusters **+ their card banners** | active |
| 4 | Script Wikilink | Obsidian `Video Scripts/` → `Processed Video Scripts/` | add CGKPV wikilinks so a script is Q&A-ready | active |
| 5 | Ecumenical Councils | `content/cong-dong`, `app/cong-dong` | the 21 councils | DONE (21/21) |
| 6 | Bible backend | `scripts/build-bible.mjs`, `content/bible.json` | verse-lookup / scripture popover data | done |
| 7 | Companion (Đồng hành) | `app/dong-hanh`, `components/DongHanh*`, `lib/dongHanh`, `lib/videos`, `lib/companionFlag` | the `/dong-hanh` guided tool | building (gating + video pool) |
| 8 | Site Design & Shell | `app/page.tsx` (homepage), `components/SiteHeader`, cross-section **hub** routes that GROUP existing sections (e.g. `app/lich-su-hoi-thanh` = Fathers+Councils) + all entry-point wiring | homepage, global nav, cross-section hubs, IA/design | Church History hub LIVE · Đồng hành entry points **wired** (homepage band + nav item, gated) · Các Thánh **wired** (homepage card + nav item + footer; card uses the communion-of-saints icon as a stopgap until Session 9 adds `/images/cac-thanh` portraits) · nav at its inline limit (6 items → hamburger below 1200px); **next: nav grouping/dropdowns before Miracles adds a 7th item** |
| 9 | Các Thánh (Saints) | `app/cac-thanh`, `lib/saints*` (mirror `churchFathersV2`), `content/cac-thanh`, `public/images/cac-thanh` | builds the whole Saints section — data model + list/detail pages + content | **COMPLETE — all 21 live** (theme-grouped: 7 martyrs-vn · 6 modern · 2 converts · 3 bridge · 3 patrons). List + `[slug]` detail + `/cac-thanh/tu-dao-viet-nam` overview. Every VN name/fact/quote HĐGM-verified. Bridge forward-links: Carlo/Bernadette/Juan Diego → `/phep-la` render as non-clickable "coming soon" (no dead links); Mônica → `/dong-hanh` (companion-flag-gated) + Augustinô; JP II → back to the VN martyrs. Portraits use `available:false` (honest empty state, not a broken image) — **PD images are the one remaining follow-up.** **→ Session 8 can wire the homepage card + nav link.** |

*Also planned:* **10 — Phép Lạ & Hiện Ra (Miracles)** → `app/phep-la`, `content/phep-la`, images (a NEW event/evidence model, not the person model). Build AFTER Saints — see roadmap "Saints BEFORE Miracles."

**Coordination watch-points (the only places lanes could touch):**
- **1 & 3 are both content** — keep them disjoint: **1 owns `content/video`**, **3 owns `content/giai-dap`**. Don't have both editing the same folder at once.
- **`lib/videos.ts`** is needed by both **2** (video-page cross-links) and **7** (video pool) — whoever adds the `category`/`tags` parse first, the other just consumes it; don't both edit it at once.
- **Entry-point ownership.** The GLOBAL shell — homepage (`app/page.tsx`) + nav (`components/SiteHeader`)
  — is owned by **8**; features route their homepage card / nav link through 8 (they don't edit those
  themselves). An **in-section CTA** (e.g. a companion nudge inside `/giai-dap`) belongs to **that
  section's session** (Session 2 for `/giai-dap`), not 8 and not the feature. A **feature session
  (e.g. 7) owns NO entry points.** Every companion entry point MUST be gated by `COMPANION_ENABLED` so
  no dead link ships while the tool is off in prod. A feature's CTA *component* (e.g.
  `components/DongHanhCta`, which carries the look + the flag gate) may live in the feature's lane; the
  shell/section session that places it just IMPORTS it — import ≠ edit, so one gated CTA component is
  reused rather than re-written.

## Rules that keep parallel sessions safe
- Each session commits **only its own lane's files** — never `git add -A`.
- Push to `main` → Vercel auto-deploys (no PRs; solo project). To keep unfinished work off the public
  site, gate it behind a `NEXT_PUBLIC_*` flag (unset on Vercel = hidden) rather than reverting.
- Verify `npx tsc --noEmit` + `npm run lint` clean before committing.

> Keep the snapshot + the session registry roughly current: when a session finishes a milestone,
> update its row here (and add a row when you start a new session) so this stays the reliable
> "start here." Refer to sessions by their number everywhere.
