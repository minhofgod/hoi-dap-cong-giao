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
**Newly on `main` (no entry point yet — Session 8 to wire):** Các Thánh `/cac-thanh` (21 saints) and
**Phép Lạ & Hiện Ra `/phep-la`** (17 cases + the `/phep-la/hoi-thanh-tham-dinh` groundwork page).
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
| 10 | Companion relevance-curation (research) | `docs/companion-relevance-audit.md` **only** (analysis session — emits proposals, edits NO runtime files) | audits the corrected `matchResources` baseline (04fad3d): situation routes, follow-up chains, tag gaps | **audit written** — proposals hand off to Sessions 2 (tags) / 3 (`related`/`tags`) / 7 (situation config + new `seedPins` field) |
| 11 | Phép Lạ & Hiện Ra (Miracles) | `app/phep-la`, `lib/miracles*`, `content/phep-la`, `components/phep-la`, `public/images/phep-la` | builds the whole Miracles & Apparitions section — event model + list/detail pages + content | **FIRST BATCH LIVE — 17 entries** (5 Thánh Thể · 6 hiện ra · 3 chữa lành · 2 không hư nát · 1 ảnh tượng), grouped by `type`. NEW event model (`lib/miracles/types.ts` client-safe + `lib/miraclesV2.ts` loader) with a required **`limits`** field ("what this does NOT establish") rendered as the page's dark band, and a `status` axis (`approved` / `venerated` / `not-ruled` / `cure-approved`) badged on every row. Also `/phep-la/hoi-thanh-tham-dinh` — the groundwork page on public vs private revelation + the 2024 DDF norms. Carlo Acutis dedication on the index. Saint bridges LANDED: `carlo-acutis`, `juan-diego`, `bernadette-soubirous` forward-links flipped to `available:true` (touched 3 files in Session 9's `content/cac-thanh` — the only cross-lane edit, agreed at kickoff). Images use `image.available:false` (honest empty state) — PD images are the remaining follow-up, same as Saints. **→ Session 8 can wire the homepage card + nav link** (nav is at its inline limit — see row 8). |
| 9 | Các Thánh (Saints) | `app/cac-thanh`, `lib/saints*` (mirror `churchFathersV2`), `content/cac-thanh`, `public/images/cac-thanh` | builds the whole Saints section — data model + list/detail pages + content | **COMPLETE — all 21 live** (theme-grouped: 7 martyrs-vn · 6 modern · 2 converts · 3 bridge · 3 patrons). List + `[slug]` detail + `/cac-thanh/tu-dao-viet-nam` overview. Every VN name/fact/quote HĐGM-verified. Bridge forward-links: Carlo/Bernadette/Juan Diego → `/phep-la` render as non-clickable "coming soon" (no dead links); Mônica → `/dong-hanh` (companion-flag-gated) + Augustinô; JP II → back to the VN martyrs. Portraits use `available:false` (honest empty state, not a broken image) — **PD images are the one remaining follow-up.** **→ Session 8 can wire the homepage card + nav link.** |

*The next session you start becomes 12.*

### The Coordinator session (unnumbered — there is exactly ONE at a time)
Alongside the lane sessions there's a **coordinator/architect** session — the one the owner talks to
about *what to build and who should build it*, rather than a lane that writes feature code. If you were
launched as the coordinator, this is your role:

- **Owns:** `docs/**` (specs, hand-off docs, roadmap, STATE.md, content-guide) — **not** app/lib/content
  code. Occasional small cross-cutting doc/convention edits are fine; feature work is always routed.
- **Does:**
  1. **Design & spec** new sections/features *with* the owner (question assumptions, propose options,
     recommend one), then write the spec to a `docs/` file with a **hand-off table**.
  2. **Route work** to the right lane and hand the owner **one-line pointers**
     ("→ Session N: read `docs/X.md`, do your row") — detail stays in the doc, never pasted in chat.
  3. **Catch cross-lane traps** a single-lane session can't see — shared-tag overloads, session-number
     collisions, a convention that's actually reversed, config that must change in a *different* lane
     than the content, work that shipped but was never wired to an entry point.
  4. **Verify** — apply `CLAUDE.md` "Verify facts before they ship" rigorously (the owner relies on this;
     see the `verify-facts-truth-over-speed` + `owner-vision-and-standards` memories).
  5. **Guard the vision** — the owner explicitly asked to be told when a request drifts from his founding
     vision (esp. toward unverified AI-generated content). See `owner-vision-and-standards` memory.
- **Does NOT:** build features, write section content, or edit another session's lane.
- **Replaceable:** when the conversation gets long/expensive, the owner starts a fresh coordinator. That's
  safe *because* the decisions live in these docs + memory — so **keep writing them down.**

**Open threads (update as they close — 2026-08-18):**
1. **Session 8 — highest value, SPECCED & ready:** `docs/nav-and-phep-la-wiring.md`. Design the nav
   shape (owner's call 2026-08-18: *Session 8 designs it*, constraints in the doc — design for ~9
   sections, not 7), confirm with the owner, then wire **Phép Lạ** (live since 4fbd36e with no
   homepage card, nav item, **or footer link** — URL-only). Saints already wired. *A finished section
   nobody can find is the most expensive kind of unfinished work.*
2. **CLOSED 2026-08-18 — `docs/proofread-fixes-round1.md` §A/§B/§C** landed in `83b3cc7` (Session 3).
   Both pastoral clusters got NEW general anchors (`nguoi-cong-giao-doi-dien-voi-dau-kho`,
   `khi-bi-bach-hai-vi-duc-tin-nen-lam-gi`), banners included. **Two owner follow-ups:** (a) those are
   two new *pastoral* Q&As that shipped without sign-off — read them against the content-guide
   "Pastoral tone" rule during proofreading; (b) `can-gi-gia-nhap-hoi-thanh` was added to the
   `tai-sao-chua-giesu-chiu-dong-dinh` anchor's `parts:` (merged into the article) — the standing rule
   is *ask first, default to `related`*, and §C4 specified `related`. Owner to confirm keep-or-move.
3. **CLOSED 2026-08-18 — §D sidebar scrollspy** landed in `1a69e19` (Session 2).
   `docs/proofread-fixes-round1.md` is now **fully resolved** (§E → thread 4).
3b. **NEW → Session 3 (from the owner's proofreading pass, 2026-08-18).** Write the objection:
   *"He's God, so his 'sacrifice' doesn't really mean much — he can just resurrect himself. Like a
   very rich person giving away a few thousand dollars."* Belongs in the **crucifixion cluster**
   (`tai-sao-chua-giesu-chiu-dong-dinh`) next to `song-tot-ca-doi-sao-khong-tu-tra-het-toi` and
   `chua-giesu-la-thien-chua-sao-khong-tu-cuu-minh`. Per the revised rule (`docs/content-guide.md`)
   adding it to the anchor's `parts:` is fine — **and then un-tick the anchor in the proofreading
   tracker again**, plus add the new part's row. Theologically subtle (real human suffering, the
   cost being genuine, who the offering is made by and to): **anchor to the Catechism + magisterial
   documents and verify — do not reason it out from memory.**
4. **DECIDED 2026-08-18 — §E "walk through the evidence for Jesus": a linear learning path, NOT a
   companion branch.** Specced in `docs/evidence-path-spec.md` (4 stages over 4 already-proofread
   clusters; `/bang-chung` + route-per-stage; composes with the companion rather than duplicating it).
   **Parked behind the launch gate — do not start before the domain is live.** Then: Session **12**
   builds it, Session 8 wires entry points **+ the new sitemap routes**, Session 7 adds the
   `doubt-evidence` CTA. **Name locked: `Bằng chứng về Chúa Giêsu` / `The Evidence for Jesus`,
   route `/bang-chung`.**
5. **Specced, not spawned:** Văn Kiện Hội Thánh (`docs/van-kien-spec.md`) and Các Đức Giáo Hoàng
   (`docs/cac-giao-hoang-spec.md`). Pace them — both are fact-dense.
6. **Content loop** — owner drafts with Grok (`docs/grok-content-prompts.md`), a session **fact-checks
   every draft** before it ships. Owner is mid pre-launch **proofreading pass** (offline Obsidian tracker).
7. **Backlog** — PD images for Saints + Miracles (both use honest `available:false` empty states);
   retrofit `sources` onto councils/fathers/saints (roadmap "Still open"); audio reader (owner to run an
   ElevenLabs Vietnamese voice test first); `docs/check-sources-spec.md` is parked by design.
8. **Gate:** the owner is proofreading everything before pointing the GoDaddy domain at the site.
9. **CLOSED 2026-08-18 — companion naming.** `docs/roadmap.md` had locked a rename to "Đi Tìm Lời Giải
   / Find Answers" (`/tim-loi-giai`) on 2026-08-15; it was never executed and every file still said
   `Đồng hành` / `/dong-hanh`. **Owner confirmed the current name stands — keep `Đồng hành`.** The
   roadmap entry now records the reversal. If you spot the old decision, the CODE is right; don't
   "fix" it.
10. **Housekeeping:** `track.tmp` (sync-tracker output) is untracked in the repo root — gitignore or
    delete it, don't commit it. A stale worktree sits at `.claude/worktrees/sleepy-yalow-821f8a/`.
11. **SEO / launch (added 2026-08-18, coordinator — `c8480e1`).** The site had **no sitemap at all**,
    which is what Search Console was erroring on. Added `app/sitemap.ts`, `app/robots.ts`, and
    `lib/siteUrl.ts` (**the single source of truth for the public origin** —
    `https://hoidapconggiao.com`, overridable via `NEXT_PUBLIC_SITE_URL`), plus `metadataBase` in
    `app/layout.tsx`. **→ Session 8:** these are shell files in your neighbourhood — don't add a second
    sitemap, and take the domain from `lib/siteUrl.ts` rather than hard-coding it anywhere.
    **New routes must be added to `app/sitemap.ts`** (it derives from the same loaders as
    `generateStaticParams`, so new *content* is automatic — only new *routes* need an edit), and any
    flag-gated route must stay gated there too, or Google gets URLs that 404 in production.

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

## Handing off to another session
Sessions can't message each other — hand-offs go **through the owner (the human)**, who relays. When
your work creates a task for a different lane, don't paste a wall of detail into your report. Instead:
1. **Know who you are + who owns what.** You're told your number at kickoff; the **registry above**
   (Owns / lane column) tells you which session owns the files a task touches.
2. **Write the detail to a repo doc** (e.g. `docs/<thing>.md`) with a small **hand-off table** assigning
   each piece to its lane — commit it in your own lane.
3. **Emit a one-line pointer** for the owner to relay, e.g.
   *"→ Session N: read `docs/<thing>.md`; you're Session N — do your row."* Keep the substance in the
   doc, not the message (see the "Session hand-off style" memory).
4. **State ordering/dependencies** in the pointer when they matter (e.g. "step 1 of a 2→3→7 chain").
5. **If you're NOT sure who owns it, or the change ripples across lanes, don't guess** — route it to the
   **coordinator/architect session** (the one holding the whole-project picture) rather than a single
   lane. Mis-routing and cross-lane traps (shared-tag overloads, numbering collisions, config that must
   change in a *different* session than the content) are exactly what the coordinator catches.

Rule of thumb: **self-hand-off the obvious in-lane follow-ups; escalate the ambiguous/cross-cutting ones
to the coordinator.**

> Keep the snapshot + the session registry roughly current: when a session finishes a milestone,
> update its row here (and add a row when you start a new session) so this stays the reliable
> "start here." Refer to sessions by their number everywhere.
