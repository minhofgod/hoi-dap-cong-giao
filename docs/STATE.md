# Project state & how to resume — START HERE

If you've lost your sessions (or Claude), this is the single entry point. A new Claude session in
this folder auto-loads the memory index, so it already knows the project; this file adds the current
state, the active work streams, and how to recover.

## How to resume
1. **Memory auto-loads.** Any new Claude session in this folder gets the memory index (`MEMORY.md` +
   notes: project overview, deployment, sections, roadmap). It already knows the stack + conventions.
2. **Read, in order:** this file → `docs/roadmap.md` (the plan + locked decisions) →
   `docs/content-guide.md` (how to author content). **This file is the authority on what exists** —
   `PROGRESS.md` is an older status doc kept for its deployment/setup detail; don't trust it for
   what's been built.
3. **See recent work:** `git log --oneline -30`.
4. **Recover a lost chat:** in the terminal, `claude --resume` (or `claude -r`) lists past sessions
   in this folder to reopen — transcripts are saved on disk, so they're recoverable.
5. **Lost EVERYTHING?** → **"Restarting a lost session"** at the bottom of this file: copy-paste
   prompts to rebuild the coordinator and every lane from scratch, plus what lives outside git.

## Where things stand (snapshot — 2026-08-15)
**Live on `main` → Vercel:** Catechism reader; Giáo Phụ (30 Church Fathers); **Công Đồng — all 21
councils**; Video (3); Giải Đáp Q&A with the 3-level taxonomy (9 categories, 30 tags) + category/tag
filters; global search; bilingual VI/EN; CCC + inline-`GLHTCG` popovers.
**Built but gated OFF in production** (flag unset on Vercel, set locally): Scripture verse popover
(`NEXT_PUBLIC_SCRIPTURE_POPOVER`, CGKPV licensing); Canvas `/so-do` (`NEXT_PUBLIC_CANVAS`); the
Đồng hành companion `/dong-hanh` (`NEXT_PUBLIC_COMPANION`).
**Newly on `main` (no entry point yet — Session 8 to wire):** Các Thánh `/cac-thanh` (21 saints) and
**Phép Lạ & Hiện Ra `/phep-la`** (18 cases + the `/phep-la/hoi-thanh-tham-dinh` groundwork page).
**In progress:** the Đồng hành companion (finishing the flag-gating + folding videos into its pool);
video ↔ Q&A linking via shared tags (see `docs/roadmap.md` "Content link model").

## The sessions (numbered registry)
Several parallel Claude sessions run at once — refer to them by **number**. Each owns a **disjoint**
set of files so they don't collide (see the watch-points below). If one is lost, reopen it with
`claude --resume`, or restart it from scratch using **"Restarting a lost session"** at the bottom of
this file.

| # | Session | Owns (its lane) | Does | Status |
|---|---|---|---|---|
| 1 | Video Blog Companion | `content/video`, `public/images/video` | video blog companions + video tagging | active |
| 2 | Q&A taxonomy / website | `app/giai-dap`, `app/tim-kiem`, `app/video`, `components/GiaiDapBrowser`, `lib/giaiDap*`, `lib/giaiDapTaxonomy` | framework; taxonomy + filters; video↔Q&A cross-links | taxonomy done · next: auto cross-links |
| 3 | Content setup (script → Q&A) | `content/giai-dap`, `public/images/giai-dap` | Giải Đáp Q&A clusters **+ their card banners** | active |
| 4 | Script Wikilink | Obsidian `Video Scripts/` → `Processed Video Scripts/` | add CGKPV wikilinks so a script is Q&A-ready | active |
| 5 | Ecumenical Councils | `content/cong-dong`, `app/cong-dong` | the 21 councils | DONE (21/21) |
| 6 | Bible backend | `scripts/build-bible.mjs`, `content/bible.json` | verse-lookup / scripture popover data | done |
| 7 | Companion (Đồng hành) | `app/dong-hanh`, `components/DongHanh*`, `lib/dongHanh`, `lib/videos`, `lib/companionFlag` | the `/dong-hanh` guided tool | building (gating + video pool) |
| 8 | Site Design & Shell | `app/page.tsx` (homepage), `components/SiteHeader`, cross-section **hub** routes that GROUP existing sections (e.g. `app/lich-su-hoi-thanh` = Fathers+Councils) + all entry-point wiring | homepage, global nav, cross-section hubs, IA/design | **All sections wired.** Church History hub LIVE · Các Thánh (card + nav + footer) · Phép Lạ (card w/ `la-vang.jpg` + nav + footer + sitemap) · gated entry points for Đồng hành, `/bang-chung` (card+nav+footer+sitemap), Tổng luận. **Nav is now a single "Menu" button at every width** (flat icon list, mirrors homepage card order) — replaced the old inline-items-→-hamburger limit, so it scales to any section count. Homepage mobile is content-first (compact 2-col cards, featured-Q hero with swipe + collapsible teaser). Pre-launch shell in (OG/apple images, 404, error boundary, manifest, favicon.ico). iPad JS-death fixed via browserslist (`dc8f1e9`). **`a57d078` reverted → compact header gated width-only (`2cdb53d`)**: the touch-device routing rested on a disproven premise (real cause = the Safari <16.4 JS failure), so touch users at tablet/desktop widths get the inline VI/EN toggle back; CSS comment now records the true root cause. **Open (owner):** confirm the OG card via Facebook Sharing Debugger post-deploy; real-iPad tap-check of the inline toggle. |
| 10 | Companion relevance-curation (research) | `docs/companion-relevance-audit.md` **only** (analysis session — emits proposals, edits NO runtime files) | audits the corrected `matchResources` baseline (04fad3d): situation routes, follow-up chains, tag gaps | **audit written** — proposals hand off to Sessions 2 (tags) / 3 (`related`/`tags`) / 7 (situation config + new `seedPins` field) |
| 11 | Phép Lạ & Hiện Ra (Miracles) | `app/phep-la`, `lib/miracles*`, `content/phep-la`, `components/phep-la`, `public/images/phep-la` | builds the whole Miracles & Apparitions section — event model + list/detail pages + content | **FIRST BATCH LIVE — 18 entries** (5 Thánh Thể · 7 hiện ra · 3 chữa lành · 2 không hư nát · 1 ảnh tượng), grouped by `type`. NEW event model (`lib/miracles/types.ts` client-safe + `lib/miraclesV2.ts` loader) with a required **`limits`** field ("what this does NOT establish") rendered as the page's dark band, and a `status` axis (`approved` / `venerated` / `not-ruled` / `cure-approved` / `other-church`) badged on every row — `other-church` exists for Zeitoun, recognised by the Coptic Orthodox Church while Rome deliberately deferred. Also `/phep-la/hoi-thanh-tham-dinh` — the groundwork page on public vs private revelation + the 2024 DDF norms. Carlo Acutis dedication on the index. Saint bridges LANDED: `carlo-acutis`, `juan-diego`, `bernadette-soubirous` forward-links flipped to `available:true` (touched 3 files in Session 9's `content/cac-thanh` — the only cross-lane edit, agreed at kickoff). Images ARE in (16 of 18, places/shrines only — never the contested object; PD/CC from Wikimedia, originals + CREDITS rows in the shared Catholic Images library). `buenos-aires-1996` and `zeitoun` have no usable Commons photograph and render none. **§A of `docs/miracles-taxonomy-and-evidence-stage.md` DONE** — miracles now carry `category` + `tags` from `lib/giaiDapTaxonomy` (no new vocabulary), all 18 tagged, loader normalizes them, and `getMiraclesByTag()` is the selector downstream should use instead of hardcoded slugs. `scripts/check-tags.mjs` extended to JSON + `content/phep-la` (141 files pass; verified it fails on a typo'd/empty tag). **→ Session 7: A2 — fold miracles into the companion pool. → Session 13: §B stage 4. → Session 2: `/tim-kiem` indexes ONLY Q&A, so miracles are still absent from search — the doc's benefit #3 needs your lane.** **→ Session 8 can wire the homepage card + nav link** (nav is at its inline limit — see row 8). |
| 9 | Các Thánh (Saints) | `app/cac-thanh`, `lib/saints*` (mirror `churchFathersV2`), `content/cac-thanh`, `public/images/cac-thanh` | builds the whole Saints section — data model + list/detail pages + content | **COMPLETE — all 21 live** (theme-grouped: 7 martyrs-vn · 6 modern · 2 converts · 3 bridge · 3 patrons). List + `[slug]` detail + `/cac-thanh/tu-dao-viet-nam` overview. Every VN name/fact/quote HĐGM-verified. Bridge forward-links to `/phep-la` are LIVE (Session 11 flipped Carlo/Bernadette/Juan Diego); Mônica → `/dong-hanh` + Augustinô; JP II → the VN martyrs. **Life STORIES** shipped: `story` field on the model + detail-page centerpiece (VN-primary, EN falls back to the `life[]` summary, refs→popovers); Thérèse + Carlo stories fact-checked & in. **Portraits: 16/21 have images** — PD + CC BY / CC BY-SA (per the 2026-08-18 licensing widening; TASL `source`/`sourceUrl`/`license` filled, Catholic Images/CREDITS rows, CC-BY files committed unmodified). Remaining 5 honestly empty (anre-phu-yen + the 4 lay/teen martyrs — no properly-licensed dignified image exists; the one Phú Yên candidate was a graphic execution scene, rejected). **→ Session 8 can wire the homepage card + nav link.** |

| 12 | Fact-verification audit (research) | `docs/fact-verification-audit.md` in pass 1; then `content/giao-phu` + `content/cong-dong` in pass 2 | web-verifies every hard fact (dates, quotes, works, canons) + VN terminology in the two oldest sections, which predate the verify-facts rule | **specced, not started** — `docs/fact-verification-audit-spec.md`. Giáo Phụ (30) first, then Công Đồng (21). Two passes: report → owner approves → apply. Not a launch blocker. |

| 13 | Evidence path (Bằng chứng về Chúa Giêsu) | `app/bang-chung`, `components/bang-chung`, `lib/evidencePath*`, `lib/evidencePathFlag.ts` | the guided 4-stage walk through the case for Jesus | **BUILT `8f02cf8`** — 4 stages over 4 existing clusters, **LOCAL-ONLY** behind `NEXT_PUBLIC_EVIDENCE_PATH` (default off, Canvas shape; routes `notFound()` and `generateStaticParams` returns `[]` when gated). Answers render **INLINE** (the no-navigate-away rule) — read from the cluster `.md` at build time, so no text is duplicated, and bodies mount only on expand so they stay out of crawlable HTML. Built **no** entry points by design. Verified: tsc + lint clean. **→ hand-off in `docs/evidence-path-handoff.md`: Session 8** (homepage card · nav · footer · **sitemap routes** — all flag-gated) and **Session 7** (`doubt-evidence` CTA). **→ owner:** proofread the 4 bridge paragraphs, add them to the tracker, then set the flag on Vercel. |

| 14 | Tổng luận Thần học (The Summa, Explained) | `docs/tong-luan-verification.md` in pass 1; then `content/tong-luan`, `app/tong-luan`, `lib/tongLuan*` | verifies then builds the 37-chapter Aquinas reader | **specced, not started** — `docs/tong-luan-spec.md`. **Source text is AI-GENERATED = unverified**, so VERIFY FIRST, BUILD SECOND; pilot on the intro + Phần I before committing to all 37. Gate behind `NEXT_PUBLIC_TONG_LUAN`. |

*The next session you start becomes 15.*

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

**Open threads (refreshed against the repo 2026-08-20 — verify before trusting; these go stale fast):**

**ACTIVE — in flight**
0. ✅ **CLOSED 2026-08-20 — site-wide metadata** (`docs/metadata-audit-urgent.md`, fully addressed).
   Session 8, commit **`a9074b2`** (25 files). Root cause was the hardcoded `openGraph.url = SITE_URL`
   in `app/layout.tsx`, which made every shared link resolve to the homepage card. Shipped: a shared
   **`lib/pageMetadata.ts`** helper (one implementation, no per-section drift) building self-referential
   canonical + `og:url`; `generateMetadata` on all 9 content detail routes; per-page metadata on all 6
   section indexes and every standalone page; doubled site-name titles fixed on **5** routes (the brief
   named 2 — `/tong-luan`, `/tong-luan/[slug]`, `/video/[slug]` had it too). `tsc` + lint clean,
   verified in dev.
   - ⚠️ **Cross-lane notice — Sessions 2 / 5 / 9 / 11 / 14 (and 7/13-adjacent gated routes):** Session 8
     added `generateMetadata` inside routes you own, under the doc's one-session exception. **Metadata
     only; no other logic touched.** Don't edit those routes' metadata concurrently — coordinate first.
   - Regression caught and fixed in-flight, worth remembering: **Next merges metadata shallowly**, so
     overriding `openGraph` on a page *replaces the whole object* and silently dropped the inherited OG
     card image. Fixed with `resolveParentImages(parent)`. Any future per-page `openGraph` override must
     carry the parent image forward or it loses its card.
   - ✅ **Checklist 4 DONE — verified in the Facebook Sharing Debugger 2026-08-20.** Scraped
     `www.hoidapconggiao.com/giai-dap/me-thien-chua-nu-vuong-…`: **200**, **canonical == fetched URL**
     (no bounce to `/`), and the Link Preview renders **the question** with VN diacritics and curly
     quotes intact — so Session 8's `og:url` fix *and* Session 2's per-Q&A cards are both confirmed live.
     Also confirms the **www** canonical (`edf399e`): no redirect hop on the image.
     *(The debugger's `fb:app_id` "missing required property" warning is **safe to ignore** — it only
     enables Facebook Insights share analytics and is irrelevant to previews, as that very scrape shows.)*
   - **→ owner (checklist 5, still open):** **request indexing** on a couple of detail URLs in Search
     Console.
   - Deliberate non-changes, not blockers: `/tim-kiem` (search — arguably should be `noindex`; note it's
     already `Disallow`ed in `robots.txt`) and `app/bang-chung/**` (titles already bare/unique, gated off
     in prod, root fix covers its `og:url`) → **Session 13** can add canonical/per-page OG at launch.
1. **Session 2 — per-Q&A OG share cards** (`docs/og-share-cards-spec.md`) — *sent 2026-08-20.* Builds
   `app/giai-dap/[slug]/opengraph-image.tsx` so shared links preview the **question** instead of the
   generic site card. Watch the three pitfalls in the spec (font subsetting → VN diacritics, long-question
   clamping, curly quotes) and the Facebook-debugger verification.
2. ~~**Session 11 — miracles taxonomy (§A)**~~ **✅ DONE 2026-08-20 — verified: 18/18 miracles tagged, `check-tags` extended to `content/phep-la`, 141 files passing.** Q&A↔miracle cross-links (Eucharist→Lanciano, Mary→Lộ Đức) now work by shared tag with no per-page wiring. *(original brief:)* (`docs/miracles-taxonomy-and-evidence-stage.md`) — **the
   unblocker; send next.** Miracles carry `type`/`status`/`related_saint` but **no taxonomy `tags`**, so
   18 entries are invisible to every automatic cross-link. Adding tags unlocks Q&A↔miracle links
   (Eucharist→Lanciano, Mary→Lộ Đức), the companion pool, search, and lets evidence stage 4 select by tag.
2b. ✅ **CLOSED 2026-08-20 — Baptism cluster restructured** (Session 3, `a1acd73`). Topic renamed
   *Rửa tội trẻ em* → **Phép Rửa**; new necessity anchor `phep-rua-co-can-thiet-de-duoc-cuu-do-khong`
   (CCC 1257–1261); infant baptism demoted to a member; banner `git mv`d; salvation cross-links wired
   both ways. **The CCC 1261 paragraph is written to the bereaved** — leads with hope, renders 1261
   as "cho phép chúng ta hy vọng" (not a guarantee), and ends by pointing to a priest. Verified.
2c. ✅ **CLOSED 2026-08-20 — Confession cluster** (Session 3, `f1d36a2`, `b1f3d2c`). +2 members:
   `xung-toi-voi-tu-te-co-goc-trong-cuu-uoc-khong` (OT roots — cites Lv 5,5-6 **and** Dt 10,4, so it
   argues roots without claiming the old sacrifices sufficed) and
   `linh-muc-co-tiet-lo-dieu-toi-xung-khong` (the seal; CCC 1467, 2490 + CIC can. 1386). Plus the
   reword, the "God works THROUGH people" argument, and **Mt 18,15-18** now cited in the anchor —
   the binding/loosing text the cluster had been missing. Anchor un-ticked (2 parts joined).
2d. ✅ **CLOSED 2026-08-20 — Sola Scriptura §E1/§E2 verified** (coordinator + Session 3, `b57c074`,
   `137d553`). **§E1** (*paradosis*): no fix needed — the existing text already says *some* versions,
   names *Bản Truyền Thống*, and concedes the rendering is not wrong. ⚠️ **Never write it as
   "Protestant Bibles hide the word"** — RVV11 (HTTLVN's own revision) and BD2011 both say
   *truyền thống*. **§E2** (*apostellō*): the argument works, but **pin it on Ga 17,18**, which uses
   *apostellō* in BOTH clauses — **not Ga 20,21, which switches to *pempō***. It rests on the
   etymology + Rm 10,15, deliberately NOT on the contested *apostellō*-vs-*pempō* contrast.
   Full record: `docs/proofread-fixes-round2-sola-scriptura.md` §E1/§E2.
2e. ✅ **CLOSED 2026-08-20 — Sola Scriptura cluster reworked around AUTHORITY** (Session 3,
   `33a75b1`, `46c2257`; owner-directed from his Obsidian canvas "Authority: Catholicism vs
   Protestantism"). Anchor + 11 → **anchor + 13**; the anchor now frames the authority question with
   **Apostolic Succession as the explicit foundation**. NEW:
   `thanh-than-huong-dan-moi-nguoi-sao-van-chia-re` (if the Spirit guides every reader, why the
   divisions?) and the capstone `giao-phu-co-tranh-luan-bang-chi-kinh-thanh-khong` (Tertullian,
   *De Praescriptione Haereticorum* 19, web-verified at New Advent, flagged as a translation).
   **The inflated "33,000 denominations" figure was deliberately avoided** — the right call: it is a
   widely-repeated miscount and using it would hand a skeptic a free rebuttal.
2f. **→ a website lane (unspecced) — the authority FLOWCHART as a `/so-do` canvas.** Session 3
   flags that the reworked cluster now has all the content for a visual "where does authority come
   from?" diagram. Pure presentation build, no new writing. Canvas is already gated behind
   `NEXT_PUBLIC_CANVAS` (off in prod), so it can be built safely. **Owner to decide whether to spec
   it** — note the canvas section has been dormant and the flag has never been turned on.

**READY — thread 2 (§A) is DONE, both unblocked 2026-08-20**
3. **Session 13 — evidence-path stage 4** (§B, same doc): "Is God still acting?" — miracles as the
   *final* stage, selecting by tag. Keep the `limits` field and "approval ≠ proof"; lead with the Lourdes
   Medical Bureau (a body that *rejects* most claims persuades this audience).
4. **Session 7 — miracles into the companion pool** (§A2) as a resource kind, mirroring `'video'`.

**CLOSED (verified in the repo — do not re-send)**
5b. **Session 8 — `a57d078` false-premise cleanup** → **DONE `2cdb53d`** (verified). The compact layout
   is gated on **width only** again, so touch users at tablet/desktop widths get the inline VI/EN toggle
   back; the CSS comment now records the true root cause and warns against re-adding the pointer routing.
   **→ OWNER follow-up (not a session):** a live real-iPad tap check of the inline toggle — the failure
   mode provably no longer exists, but a device confirmation is the honest final tick.
5c. **`docs/nav-and-phep-la-wiring.md` RETIRED** — its work shipped and the nav has since evolved past it
   (now a single "Menu" button / flat icon list at every width). The file carries an OBSOLETE banner.
   **Do not hand it to a session.**
6. **Safari <16.4 got ZERO JavaScript site-wide** → FIXED `dc8f1e9` (`browserslist: ["defaults",
   "safari >= 15"]`); verified 0 `static {` blocks in the deployed chunks. Case study + portable lessons:
   **`docs/web-project-checklist.md`**. Key heuristic: *links work but buttons don't → JS isn't running;
   stop looking at CSS.*
7. **Session 8 — nav redesign + Phép Lạ wiring + `/bang-chung` entry points.** Done: Phép Lạ is in the
   nav and on the homepage; `/bang-chung` has card, nav, and 4 sitemap routes.
8. **Session 3 — the "his sacrifice cost him nothing" objection** → written as
   `hy-sinh-cua-chua-giesu-co-that-su-lon-khong`, already in the crucifixion anchor's `parts:`.
9. **Session 3 — citation defect** on the Indulgences/Reformation Q&A → fixed `9e6f8eb`.
10. **`docs/proofread-fixes-round1.md`** fully resolved (§A/§B/§C `83b3cc7`, §D scrollspy `1a69e19`).
    **§E decided:** the evidence walk is a *linear learning path*, not a companion branch → built as
    Session 13, `/bang-chung`, flag-gated.
11. **Companion naming** — SETTLED as `Đồng hành` / `/dong-hanh`; the paper rename to "Đi Tìm Lời Giải"
    was never executed and is superseded. Don't "fix" it.

**OWNER'S TRACK (not routed to a session)**
12. **Pre-launch proofreading** — the gate before pointing the GoDaddy domain at the site. Offline
    tracker in Obsidian (*Hỏi Đáp — Proofreading Tracker*); ~215 pieces, re-sync it as content lands.
13. **Content ideas approved, not yet specced:** ⭐ **ancestor veneration (thờ cúng ông bà tổ tiên)** —
    the most distinctive gap on the site; Vietnamese Catholic history (incl. quốc ngữ); "how to go to
    confession"; cultural objections (*"đạo nào cũng tốt"*). Prayers → decided to live on **Visual
    Rosary** instead (prayer *texts* there; *questions about* prayer stay here).
14. **Features approved, not yet specced:** feast-day / liturgical-calendar hook; offline/PWA; a
    "start here" path for the newly curious.
15. **Backlog:** retrofit `sources` onto Councils/Fathers/Saints · 5 remaining saint portraits · audio
    reader (owner to run an ElevenLabs Vietnamese voice test first) · advanced search / topical-verse
    tool (retrieval-first, **no LLM generating theology**) · English translation strategy (hand-authored
    vs machine — undecided) · `docs/check-sources-spec.md` parked by design.
16. **Specced, not spawned:** Văn Kiện Hội Thánh (`docs/van-kien-spec.md`), Các Đức Giáo Hoàng
    (`docs/cac-giao-hoang-spec.md`), fact-verification audit of Fathers + Councils, development-of-
    doctrine cluster (`docs/proofread-fixes-round2-sola-scriptura.md` §G).

**Standing note:** the bottleneck has shifted from *making* content (~215 pieces) to *helping people
find it*. Rank work as: (1) can they use it? (2) can they find it? (3) is there more of it?

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

---

## Restarting a lost session — TOTAL-LOSS RECOVERY

**If every chat is gone, this section is how the project comes back.** Open one new session in this
folder, tell it *"read `docs/STATE.md` and help me restart my sessions"*, and work down this list.

Order matters: **restart the coordinator FIRST**, then let it hand out the lane prompts. Nothing here
depends on chat history — the registry above plus the specs in `docs/` are the whole state.

### 1. The coordinator (do this one first)

```
You are the Coordinator session for the Hỏi Đáp Công Giáo project — the unnumbered
architect/routing role, not a lane session.

Read, in this order: docs/STATE.md (especially "The Coordinator session" and the open
threads), docs/roadmap.md, docs/content-guide.md, CLAUDE.md. Then skim
git log --oneline -30.

Design and spec with me, write specs to docs/ with a hand-off table, and give me one-line
pointers to relay to lane sessions — never walls of detail. Watch for cross-lane traps.
Don't build features or write section content yourself; route it.

Give me a short read of where things stand and what you'd do first.
```

### 2. Lane sessions — one template, filled from the registry

**Do not restart sessions marked DONE** (5 Councils, 6 Bible backend, 9 Saints, 10 relevance audit)
unless there is new work for that lane. Restart only what the open threads actually need.

Paste this, substituting `<N>`, `<name>`, and `<lane>` from that session's row in the registry above:

```
You are Session <N> (<name>) on the Hỏi Đáp Công Giáo project, in
"D:\Dropbox\Claude\MinhofGod Websites\Hoi Dap Cong Giao Website".

Read docs/STATE.md and find your row (Session <N>) in the session registry — that is your
lane, what you own, and where you left off. Also read docs/content-guide.md if you touch
content, and any spec doc your row names.

You own ONLY <lane>. Never edit another session's files. Never `git add -A` — stage only
your own lane's files. If a task crosses lanes or you are unsure who owns it, hand it to
the coordinator rather than guessing.

Before changing anything, tell me your plan and what you think your current task is.
```

**Sessions with their own written brief** — point them at it instead of relying on the row alone:

| # | Session | Brief to read |
|---|---|---|
| 4 | Script Wikilink | `docs/session-4-script-wikilink.md` (+ the vault's `CGKPV_Wikilink_Rules.md`) |
| 8 | Site Design & Shell | `docs/nav-and-phep-la-wiring.md`, `docs/evidence-path-handoff.md` |
| 9 | Các Thánh | `docs/image-sourcing-brief.md` |
| 11 | Phép Lạ | `docs/phep-la-spec.md`, `docs/image-sourcing-brief.md` |
| 12 | Fact-verification audit | `docs/fact-verification-audit-spec.md` |
| 13 | Evidence path | `docs/evidence-path-spec.md`, `docs/evidence-path-handoff.md` |

### 3. What is NOT in this repo (recover these separately)

- **The Obsidian vault** — `D:\Dropbox\Obsidian Vault\`: the video scripts + CGKPV Bible (Session 4's
  lane), the **content pipeline tracker**, and the **pre-launch proofreading tracker**. The trackers are
  the owner's, live outside git, and are the only record of what has been proofread.
- **`.env.local`** — gitignored by design. Recreate it to preview flag-gated work locally:
  `NEXT_PUBLIC_SCRIPTURE_POPOVER=1`, `NEXT_PUBLIC_CANVAS=1`, `NEXT_PUBLIC_COMPANION=1`,
  `NEXT_PUBLIC_EVIDENCE_PATH=1`. **None of these should be set on Vercel** except where a row says so.
- **Claude memory** — auto-loads per folder, but it is keyed to the folder a session STARTS in. A session
  started in the vault gets a different memory store. Start sessions in the website folder.

### 4. Sanity checks after a restart

```bash
git log --oneline -30          # what actually landed
git status --short             # any session's in-flight work
npx tsc --noEmit && npm run lint
```

Then reconcile the two trackers against the real files before trusting either — both have drifted
before. The files are always the source of truth, never a tracker or a memory.

