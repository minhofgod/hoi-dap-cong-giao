# Handoff: Hỏi Đáp Công Giáo — bilingual Catholic reference website

## Overview
A Vietnamese/English Catholic reading and reference site for a parish-scale audience (roughly 18–35, Vietnamese-first). Three content sections ship:

1. **Giải Đáp** — short, sourced answers to common questions. This is the front door: the landing page hero *is* a real question and its answer.
2. **Giáo Lý** — the Catechism of the Catholic Church, 2865 numbered paragraphs, bilingual, with a contents tree and reading progress.
3. **Giáo Phụ** — Church Fathers texts (public-domain), Vietnamese translation alongside the English/original, cross-linked to Catechism numbers.

**Kinh Thánh (Bible) is deliberately out of scope for v1** — no copyright-clear modern Vietnamese translation is available. A Bible reader screen exists in the design file but is hidden (`#1c`, `display:none`). Keep the URL space `/kinh-thanh/...` free and keep verse references (e.g. "Ga 20,23") rendering as *inert sage chips* rather than links, so the section can be switched on later without a redesign.

A **Visual Rosary** is a possible future companion — most likely a separate site this one links out to. Nothing designed; do not build.

## About the design files
The files in `reference/` are **design references created in HTML** — prototypes showing intended look and behavior. They are *not* production code to copy. They use a custom preview runtime (`<x-dc>`, `support.js`, `image-slot.js`) that is irrelevant to the real site; the value is in the markup's exact colors, type, spacing and structure.

Your task is to **recreate these designs in a real web codebase**. There is no existing codebase, so pick the stack. Recommended, and what the design assumes:

- **Next.js (App Router) + TypeScript**, static-first. Content is a fixed corpus that changes rarely — pre-render everything (`generateStaticParams`), no database needed for v1.
- **Content as flat files**: MDX or JSON per unit, committed to the repo. See *Content model* below.
- **Plain CSS or CSS modules with custom properties** for the token set below, or Tailwind with these tokens in `theme.extend`. Both are fine; do not pull in a component library — the surface is small and typographic.
- Client-side JS is minimal: language toggle, sidebar tree expand/collapse, mobile drawer, keyboard shortcuts, reading-progress persistence. No global state library required.

## Fidelity
**High-fidelity.** Colors, type sizes, line-heights, radii and spacing in the reference file are final and should be matched. Where the reference shows a static state (a hovered row, an open tree branch), implement the full interactive behavior described under *Interactions*.

The one thing that is *not* final: photography. Every image is a drop-slot placeholder. See *Assets*.

## Design tokens

### Color
```
--ground            #FBF8F3   page background
--surface           #FFFFFF   cards, inputs, raised rows
--surface-warm      #F1EDE1   the Giáo Phụ feature band
--surface-quiet     #F6F1E7   keyboard-hints box
--border            #EDE4D6   all hairlines
--border-strong     #DFD4C2   button outlines, input borders (#E4D9C8 on search fields)
--text              #241F1B   reading text
--text-heading      #201E1D   headings, brand
--text-body         #3A342E   secondary reading text, list items
--text-muted        #5C554E   nav rest state, prose in support sections
--text-quiet        #8A837C   metadata, counts, percentages
--text-faint        #A29A91   uppercase eyebrows, placeholder text
--text-fainter      #B4ABA1   inactive tree numbers, collapsed chevrons

accent (Giáo Lý, terracotta)
--accent            #C67139   fills, active underline, progress bars
--accent-deep       #A8562A   accent text on light (AA-safe), icon strokes
--accent-tint       #F6E7DA   reference pills, active tree row
--accent-tint-2     #FCF6EE   active tree leaf background
--accent-number     #C99A6E   Catechism paragraph numbers in the margin
--accent-press      #B0602F   pressed/hover state of accent fills

sage (Giải Đáp)
--sage              #7A8A5E
--sage-deep         #56663B
--sage-tint         #E9EEDF   (#EAEEE0 used interchangeably on chips — pick #E9EEDF)
--sage-card         #F2F4EC   landing section card fill

gold (Giáo Phụ)
--gold              #B08A3E
--gold-deep         #8A6A2A
--gold-tint         #F8F3E7   landing section card fill
--gold-border       #DCCFB4
--highlight         #F4E9CE   text-selection / saved-passage highlight

english text        #8C8479 at weight 300  (see Bilingual rules)
```
Section identity is carried by these three hues and nothing else — no per-section fonts, no per-section layouts.

### Type
Two families, both Google Fonts, both with full Vietnamese diacritic coverage. **Vietnamese subset must be loaded** — `&subset=vietnamese` / `font-display:swap`, and do not substitute either face for a system fallback that lacks stacked diacritics.

- **Source Serif 4** — headings only. Weights 400, 600, 700 + italic 400.
- **Be Vietnam Pro** — all body, UI, numbers. Weights 300, 400, 500, 600, 700.

```
brand (desktop header)      600 19px Source Serif 4, tracking -0.01em
brand (reader header)       600 17px Source Serif 4
brand (mobile)              600 14.5px Source Serif 4
h1 landing hero question    600 44px/1.2 Source Serif 4, tracking -0.018em
h1 reader title             600 34px/1.2 Source Serif 4, tracking -0.012em
h1 mobile answer            600 27px/1.24 Source Serif 4, tracking -0.01em
h2 section                  600 27px/1.22 Source Serif 4
h2 support                  600 22px/1.25 Source Serif 4
card title                  600 17px/1.3  Source Serif 4
eyebrow (uppercase)         600 10.5–11px Be Vietnam Pro, tracking .14–.16em, uppercase
nav item                    400/500 14px Be Vietnam Pro
reading text — desktop      400 18px/1.76 Be Vietnam Pro
reading text — mobile       400 16.5px/1.78 Be Vietnam Pro
reading text — landing lede 400 17.5px/1.78 Be Vietnam Pro
english undertext           300 15.5px/1.65 (desktop) · 13.5px/1.62 (compact)
prose / support copy        400 14.5px/1.78 Be Vietnam Pro
metadata                    400 12–13px Be Vietnam Pro
pill / chip label           600 12.5px Be Vietnam Pro
margin paragraph number     600 12.5px Be Vietnam Pro
verse superscript           600 11px Be Vietnam Pro, vertical-align:super, 4px right margin
```
Apply `text-wrap: pretty` to every heading and every reading paragraph — Vietnamese wraps badly without it.

### Spacing, radius, elevation
```
page gutter (desktop)   56px   ·  reader gutter 32px  ·  reading column padding 44px 60px 60px
mobile gutter           22px   ·  mobile header 16px
section rhythm          52–64px between bands
radius: pill 999px · card 20px · band 24px · panel/window 16px · tree row 9–10px · chip 999px · numeral badge 12px
elevation: cards use a 1px #EDE4D6 border and NO shadow
           the language toggle knob: 0 1px 2px rgba(32,30,29,.10)
           (the big 0 18px 50px shadow in the reference is the mock's browser frame — not part of the site)
```

### Layout
```
desktop canvas assumed      1280px
landing hero grid           1fr 366px, gap 64px
landing part cards          4 columns, gap 18px
landing section cards       3 columns, gap 14px
Giáo Lý reader grid         300px | 1fr | 210px
reading measure             max-width 600px (Catechism) / 660px (flowing prose) — never wider
header height               74px landing · 64px reader · 56px mobile
```

## Screens

### 1. Landing — `/`  (reference `#1a`)
**Purpose:** answer one real question immediately, then offer the three sections and a way back into whatever the reader was last reading.

Top to bottom:

1. **Header** (74px, bottom border `--border`): brand "Hỏi Đáp Công Giáo" flush left; centered nav *Giải Đáp · Giáo Lý · Giáo Phụ* (active = weight 500, `--text-heading`, 2px `--accent` bottom border, 2px below the text); right side a 230px pill search field (38px tall, white, 1px `#E4D9C8`, magnifier stroked `--accent-deep`, placeholder "Tìm kiếm…") and a 38px circular `?` button.
2. **Section cards** (26px 56px band, bottom border): three tinted cards, `grid-template-columns: repeat(3,1fr)`, gap 14px, each 18px 20px, radius 16px, fills `--sage-card` / `#FAF1E9` / `--gold-tint`. Each holds a **30px line icon with no container**, stroke = the section hue, stroke-width 1.5, then title (600 14px) + count (400 11.5px `--text-quiet`). Counts: "48 câu hỏi", "2865 số", "32 bản văn" — drive these from the content index, don't hard-code.
3. **Hero** (`1fr 366px`, gap 64px, padding 52px 56px 56px):
   - Left, max-width 640px: eyebrow row "CÂU HỎI" + hairline + a "Câu khác" refresh control (13px rotate icon, `--text-faint`) that swaps in another question. Then h1 question, two lede paragraphs, a references row (label "Tham chiếu" then chips: terracotta `§` chips link into Giáo Lý, sage scripture chips are inert in v1), then two buttons: **primary** "Đọc trọn câu trả lời" (48px pill, `--accent` fill, white 600 14.5px, trailing chevron) → the answer page; **secondary** "Xem tất cả câu hỏi" (48px pill, 1px `--border-strong`) → the Giải Đáp index.
   - Right rail: a 220px washed photograph (radius 20px, `filter: saturate(.82) contrast(.94)`); a **"Tiếp tục đọc"** card (white, radius 20px) showing last position — title, "Giáo Lý · Phần I · Chương I · đang ở § 28", and a 44px `--accent-tint` "Đọc tiếp" pill; a **"Được hỏi nhiều"** card listing three questions separated by 1px `#F2EAE0` rules.
   - If there is no reading history, the "Tiếp tục đọc" card is **omitted** (not shown empty) and the rail closes up.
4. **Giáo Lý band**: h2 + "2865 số · song ngữ Việt–Anh" + right-aligned "Mục lục đầy đủ →"; a 520px-max overall progress bar (6px, `--border` track, `--accent` fill) with "Đã đọc 12% · 344/2865 số"; then the four Parts as cards — 108px washed image, a 36px radius-12 numeral badge (`--accent-tint` fill, `--accent-deep` Source Serif numeral, 3px white border, pulled up 42px to straddle the image edge), title, number range, and a 4px per-part progress bar (`#F2EAE0` track). Ranges: I 26–1065, II 1066–1690, III 1691–2557, IV 2558–2865.
5. **Giáo Phụ band**: radius 24px `--surface-warm` panel, `1fr 300px`, gold eyebrow, h2, prose, buttons "Mở thư mục Giáo Phụ" (`--gold` fill) + "Đoạn đã lưu" (1px `--gold-border`); right side a 180px washed image over a white pull-quote card attributed "Th. Inhaxiô Antiôkia".
6. **Full-bleed washed photograph**, 280px, radius 24px.
7. **Two-column support copy**: "Về trang này" and "Nguồn".
8. **Footer**: brand, credit lines (Catechism translation source, "Bản văn Giáo Phụ: phạm vi công cộng", maintainer), and two link columns — *Nội dung* (Giải Đáp / Giáo Lý / Giáo Phụ) and *Trang* (Về trang này / Hướng dẫn sử dụng / Liên hệ).

### 2. Giáo Lý reader — `/giao-ly/[number]`  (reference `#1b`)
**Purpose:** read the Catechism in sequence, bilingually, and know where you are.

Three columns: **300px tree | reading column | 210px rail.**

- **Left tree** (right border, padding 24px 20px 40px): a scoped search pill ("Tìm trong Giáo Lý…"), a "Tiến độ" mini progress block (label row + 12% + 5px bar), then the contents tree. Indent steps are **8 → 26 → 44 → 62px** of left padding for Part → Section (Đoạn) → Chapter → Tiết. Expanded branches use a down chevron, collapsed a right chevron, stroke-width 2.7; chevron color tracks depth/state (`--accent-deep`, `--accent`, `--text-fainter`). The open Part row sits on `--accent-tint`, radius 10px. The **current leaf** has a 2px `--accent` left border, `--accent-tint-2` background, radius `0 10px 10px 0`, weight 600, and its number range in `--accent-deep`; inactive leaves show their range in `--text-fainter`. The tree is independently scrollable and keeps the current node in view on load (do not use `scrollIntoView` on the window — scroll the container).
- **Reading column** (padding 44px 60px 60px): a breadcrumb line "Phần I · Đoạn I · Chương I" on the left and the **language toggle** on the right — a 999px `#F1E9DD` track with 3px padding and three 7px/15px options **VI · EN · Cả hai**; the active one is a white knob with the small shadow, `--text-heading`; inactive `--text-quiet` 600 12px. Then eyebrow "TIẾT 1", h1, "Số 27–30", then the paragraphs.
  - Each paragraph is a flex row, gap 22px: a **32px right-aligned number column** (600 12.5px `--accent-number`, 5px top padding) and the text block (max-width 600px). Vietnamese first at 18px/1.76 `--text`; English below at 300 15.5px/1.65 `#8C8479`, 11px above. 32px between paragraphs.
  - Each paragraph number is an anchor: `/giao-ly/27#28` targets ¶28 and highlights it briefly with `--highlight`.
- **Right rail** (left border, padding 44px 22px): "Trong bài này" — the paragraph numbers in this Tiết with a short gloss, current one in `--accent`, others `--text-fainter`/`--text-quiet`; a hairline; then actions **Lưu bài này / Chia sẻ / In / PDF** (15px icons, stroke `--text-quiet`, 2.4 weight); then a `--surface-quiet` radius-16 box listing the shortcuts: "Phím tắt: **J** / **K** chuyển đoạn · **G** nhảy tới số · **/** tìm kiếm".

### 3. Giáo Phụ reader — `/giao-phu/[author]/[work]`  (not yet drawn)
Not in the reference file. Build it as the **Giáo Lý reader with the gold hue** and two structural changes: the left tree is *author → work → section* instead of Part → Chapter → Tiết, and the right rail's "Trong bài này" becomes **"Liên hệ Giáo Lý"** — the Catechism paragraph numbers this passage is cited by, as terracotta `§` chips linking to `/giao-ly/<n>`. Bilingual pairing, measure, toggle and progress behave identically. Ask before inventing anything beyond that.

### 4. Giải Đáp answer — `/giai-dap/[slug]`  (reference `#1d`, drawn at 390px)
**Purpose:** one question, answered, with its sources.

Mobile header 56px: back chevron (`--accent-deep`), brand, search, hamburger — all 36px round hit areas. **On real devices every tap target must be ≥44px** even though the icon box is drawn at 36 — pad it out.

Body (padding 26px 22px 24px): a sage category chip "GIẢI ĐÁP" + subcategory ("Bí tích"); h1 question; the **language toggle right-aligned above the text** (same control, 6px/14px options, 11.5px); answer paragraphs at 16.5px/1.78; "THAM CHIẾU" eyebrow + chips; hairline; "CÂU HỎI LIÊN QUAN" list with rules between.

The desktop version of this page is the same content on the landing page's measure — reading column max 660px, no left tree, references and related questions move to a right rail.

### 5. Giải Đáp index — `/giai-dap`  (not yet drawn)
The "Xem tất cả câu hỏi" destination. Not designed. Build as a filtered list — categories as sage chips across the top, then question rows with a one-line excerpt. Confirm the design before shipping it.

## Interactions & behavior

**Language toggle (VI / EN / Cả hai).** The core interaction. Floats above the reading text on every reading surface — right-aligned on mobile, opposite the breadcrumb on desktop. VI hides the English block; EN shows English *in the Vietnamese block's typography* (400 18px `--text`) rather than dimming it; Cả hai shows both with English recessed by weight and color. Persist the choice in `localStorage` and apply it before first paint to avoid a flash. Never indicate language with a bordered box or a flag.

**Reading progress.** Per-Part and overall percentages come from the furthest paragraph reached, stored locally (`localStorage`, keyed by section). No accounts in v1. "Tiếp tục đọc" reads the same store. Update on scroll, throttled.

**Hover / active / focus.**
```
tree row & list row hover   background #FBF6EE
accent pill hover           background #B0602F
outline button hover        border #C9BCA6, background #FBF6EE
chip hover                  tint one step deeper; scripture chips are not interactive in v1
link                        color #A8562A · hover #8F4620 · underline on hover
focus-visible               outline 2px #C67139, offset 2px  (never the browser default)
transitions                 background/color 120ms ease-out; nothing else animates
```

**Keyboard.** `J`/`K` next/previous paragraph (moves focus and scrolls the container). `G` opens a "jump to number" prompt → `/giao-ly/<n>`. `/` focuses search. `Esc` closes the drawer or overlay. All shortcuts suppressed while a text input has focus.

**Responsive.**
```
≥1200px    three columns as drawn
900–1199   drop the right rail; its actions move to a row under the title
<900       left tree becomes a drawer behind the hamburger; single column; type drops to the mobile scale (#1d)
```
The reading measure never exceeds 660px at any width.

**Search.** v1 is client-side over a prebuilt index (a JSON index shipped with the build; MiniSearch or Lunr is plenty at this corpus size). It must match **diacritic-insensitively both ways** — "giao ly" finds "Giáo Lý" and vice versa — by indexing an `NFD`-stripped form alongside the original. Bible-reference syntax ("Ga 3,16") can stay unimplemented while Kinh Thánh is off.

**Empty / loading / error.** Static pages mean no spinners on navigation. No reading history → hide the continue card. Search with no hits → "Không tìm thấy" plus the three most-asked questions. Unknown route → a 404 that offers search and the three sections.

## State
All client state is local and small:
```
lang            'vi' | 'en' | 'both'      localStorage, applied pre-paint
progress        { 'giao-ly': maxParagraph, 'giao-phu': {workId: maxSection} }   localStorage
saved           array of { type, id, label, savedAt }    localStorage (the "Lưu" actions)
treeOpen        set of open node ids       localStorage, seeded from the current route
drawerOpen      boolean                    ephemeral
heroQuestion    index into the featured-question list; "Câu khác" advances it, ephemeral
```
No server state, no auth, no analytics specified.

## Content model
Suggested shape — the design assumes these fields exist.
```
content/giao-ly/paragraphs.json
  [{ n: 27, vi: "…", en: "…", tiet: "1-1-1", refs: ["Ga 20,23"] }]
content/giao-ly/tree.json
  parts → sections(đoạn) → chapters → tiết { id, title_vi, title_en, range: [27,30] }
content/giai-dap/<slug>.mdx
  frontmatter: question_vi, question_en, category, subcategory,
               refs_ccc: [1441,1461], refs_scripture: ["Ga 20,23"],
               featured: bool, related: [slug]
content/giao-phu/<author>/<work>.json
  { author_vi, author_en, work_vi, work_en, sections: [{ n, vi, en, ccc_refs: [] }], source, license }
```
Every Giải Đáp answer must carry at least one `refs_ccc` — sourcing is the point of the site. Store text as **NFC**, and normalize on ingest; mixed normalization is what breaks Vietnamese search and sort.

## Assets
- **Fonts**: Source Serif 4 and Be Vietnam Pro, Google Fonts, Vietnamese subset included. Self-host with `next/font` for stability.
- **Icons**: line icons at ~1.5 stroke in content (the three section marks) and 2.4–2.7 in UI (chevrons, search, bookmark, share, print). The reference file has them inline as hand-tuned paths; **Lucide** matches the vocabulary and is the recommended source. Section marks: speech-bubble-with-question (Giải Đáp), open-book (Giáo Lý), scroll/quill (Giáo Phụ) — no container shape, stroke in the section hue.
- **Photography**: NOT SUPPLIED. Every image in the reference is an empty drop slot: hero side image (366×220), four Part cards (108px tall), Giáo Phụ band (180px), full-bleed about image (280px). All are wrapped with `filter: saturate(.82) contrast(.94)` and rounded — the wash is what makes them sit into the warm ground. Source real, licensed photography before launch (churches, manuscripts, candles, community); do not ship stock-looking gradients or AI imagery in their place.
- **Favicon / social card**: not designed.

## Legal / editorial notes
- Confirm the licensing of the Vietnamese Catechism translation before publishing — the footer has a `[nguồn]` placeholder for it, and it is the one unresolved rights question in v1.
- Church Fathers texts are public-domain by age, but record the specific edition and translator for each work in its `source` field.
- The Bible section is off precisely because no clear-rights modern Vietnamese translation was found. Do not quietly re-enable it with a scraped text.

## Files in this bundle
- `reference/Catechism Web.dc.html` — **the website design.** Turn 1: `#1a` landing, `#1b` Giáo Lý reader, `#1c` Bible reader (hidden, out of scope), `#1d` Giải Đáp answer on mobile, `#1e` design notes. Turn 2: `#2a–#2d` palette explorations — **`#2a` is the shipped palette**; the others are rejected and are there for context only.
- `reference/Catechism App.dc.html` — the shelved native-app designs (Trang Chủ hub, section tree, reading screen, Q&A cards, search, bookmarks). Same token set. Useful only as a reference for the mobile web layouts and for future app parity; not part of this build.
- `reference/organic-styles.css` — the "Organic" design system stylesheet the palette derives from, for its ramps and radii.

Open the reference files in a browser to view them.

Rendered screenshots of the three designed screens are in `screenshots/`:
- `01-landing.png` — landing page, full height (1280px wide)
- `02-giao-ly-reader.png` — Giáo Lý reader, desktop
- `03-giai-dap-mobile.png` — Giải Đáp answer, mobile web (390pt @2x)

The screenshots are for orientation; take exact values from this README and the HTML, not from pixel-measuring the images.
