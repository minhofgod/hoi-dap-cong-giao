# ⛔ OBSOLETE — DONE, DO NOT RE-ISSUE (retired 2026-08-20)

> This brief's work **shipped** and the design has since moved past it. Phép Lạ has its homepage card,
> nav item and footer link; `/bang-chung` has its card, nav item and sitemap routes. The nav then
> **evolved past what this doc describes** — it's now a single "Menu" button (flat icon list) at every
> width, not the inline items specced here. Kept only as a record of the reasoning.
>
> **Do not hand this to a session.** Current work lives in `docs/STATE.md` → "Open threads."

---

# Nav grouping + wiring Phép Lạ — Session 8 brief

Written 2026-08-18 (coordinator). **Session 8 owns this whole doc's work** — it's all shell:
`app/page.tsx`, `components/SiteHeader*`, and the homepage footer.

## Why now

`/phep-la` (Phép Lạ & Hiện Ra, 17 verified cases) has been live on `main` since 4fbd36e with **no
homepage card, no nav item, and no footer link** — it is reachable only by typing the URL. Các Thánh
was wired; Miracles was not. A finished section that nobody can find is the most expensive kind of
unfinished work, and the owner is at the pre-launch proofreading gate.

The blocker is that **the nav is full**: 6 inline items (5 + the flag-gated companion), hamburger
below 1200px. Phép Lạ makes 7. So the grouping question has to be settled first — hence two tasks,
in order.

---

## Task 1 — Nav grouping (design it, then build it)

**The owner's call (2026-08-18): Session 8 designs the shape.** This section gives the constraints,
not the answer. Propose the shape to the owner before building it.

### What has to fit
Current inline items: Giải Đáp · Giáo Lý · Lịch Sử Hội Thánh · Các Thánh · Video · Đồng hành *(gated)*.
Add **Phép Lạ & Hiện Ra** = 7. Two more sections are already specced and will land later:
**Văn Kiện Hội Thánh** (`docs/van-kien-spec.md`) and **Các Đức Giáo Hoàng** (`docs/cac-giao-hoang-spec.md`).
So design for ~9, not 7 — the point is to stop revisiting the nav every time a section ships.

### Existing IA input (docs/roadmap.md → "Future sections + homepage IA")
The roadmap already groups the site into two families, which is the natural seam:
- **Học hỏi đức tin (Learn):** Giáo Lý · Giải Đáp · Video *(+ Văn Kiện later)*
- **Lịch sử & chứng nhân (History & witnesses):** Lịch Sử Hội Thánh *(a hub that already groups
  Giáo Phụ + Công Đồng)* · Các Thánh · Phép Lạ *(+ Các Đức Giáo Hoàng later)*

Candidate shapes, in rough order of how much they disturb what exists:
1. **One dropdown** — collapse the History & witnesses family; leave Giải Đáp/Giáo Lý/Video inline.
   Drops to 5 inline, absorbs both future sections in the existing groups.
2. **Two family dropdowns** — matches the roadmap IA exactly, but buries Giải Đáp (the site's core
   section) a click down; the owner flagged that as the cost.
3. **Fold into the existing hub instead of a dropdown** — `/lich-su-hoi-thanh` already *is* a
   cross-section hub route. Saints + Miracles could join it rather than getting a nav dropdown.
   Cheapest nav change; biggest claim about what "Church History" means (Saints is the devotional
   lens, deliberately *not* filed under history — see the roadmap). Raise with the owner if you like it.

### Constraints that are easy to miss
- **Bilingual.** Every label goes through `<T vi en />`. A group label needs a verified Vietnamese
  form, not a translation — see `docs/content-guide.md` → "Vietnamese terminology."
- **Active state.** `SiteHeader`'s `Section.also?: string[]` already marks a hub active on its child
  routes (`/lich-su-hoi-thanh` lights up on `/giao-phu` + `/cong-dong`). A group needs the same
  treatment for every route it contains.
- **The companion stays flag-gated.** `COMPANION_ENABLED` must still remove its item (and the
  homepage band) cleanly — including from inside any new group. No dead link when the flag is off.
- **The companion's name is settled: `Đồng hành` / `Companion` / `/dong-hanh`.** Confirmed
  2026-08-18. `docs/roadmap.md` records a superseded 2026-08-15 rename to "Đi Tìm Lời Giải" that was
  never executed — **do not apply it.**
- **Mobile.** The hamburger below 1200px already exists; make sure a dropdown degrades into it rather
  than nesting a menu inside a menu.
- **Keyboard + a11y.** A dropdown is real work: focus management, `aria-expanded`, Escape to close,
  click-outside. If that cost isn't worth it, say so and propose shape 3 instead.

---

## Task 2 — Wire Phép Lạ (after the shape is settled)

Three entry points, matching how Các Thánh was wired:

| Where | File | Note |
|---|---|---|
| Homepage section card | `app/page.tsx` | Alongside the Giải Đáp / Giáo Lý / Lịch Sử / Các Thánh cards |
| Nav item | `components/SiteHeader.tsx` | Per whatever Task 1 settles |
| Footer link | `app/page.tsx` | The footer lists Giải Đáp · Giáo Lý · Lịch Sử · Các Thánh — Phép Lạ is missing |

- **Labels:** `Phép Lạ & Hiện Ra` / `Miracles & Apparitions` (as `app/phep-la/page.tsx` `HERO_TITLE`).
- **Count:** `getAllMiracles().length` from `lib/miraclesV2.ts` — same pattern as `saintsCount`.
- **⚠️ There is no card image, and sourcing one is NOT your lane.** `public/images/phep-la/` does not
  exist (the section deliberately ships `image.available:false` honest empty states), and that folder
  belongs to **Session 11**. Do not render a slug-derived `<Image>` that resolves to a missing file —
  that's the recurring broken-image bug already tracked in `docs/roadmap.md` → "Still open." Two clean
  options: ship the card with a **text/pattern treatment and no image**, or **borrow an existing
  verified banner** the way the Các Thánh card borrows
  `/images/giai-dap/nguoi-cong-giao-co-tho-nguong-tuong-khong.jpg`. Prefer the former — nothing in
  `public/images/giai-dap/` is Eucharistic or Marian, so any borrow here would be a mismatch. A proper
  PD banner is a follow-up for Session 11 (Guadalupe tilma / a Eucharistic-miracle image), and it must
  carry a `Catholic Images/CREDITS.csv` row per the images rule.
- **Card copy** should say what the section actually is — verified cases with a `limits` field stating
  what each does *not* establish, and a `status` axis (approved / venerated / not-ruled /
  cure-approved). Don't oversell it as proof; that restraint is the section's whole design.

---

## Do NOT (lane discipline)

- Don't edit `app/phep-la/**`, `lib/miracles*`, `content/phep-la`, or `public/images/phep-la` — that's
  **Session 11**. You import and link; you don't touch the section.
- Don't add an in-section CTA inside `/giai-dap` — that's **Session 2**.
- Don't rename the companion (see above).

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **8** | Design the nav shape → confirm with the owner → build it. |
| 2 | **8** | Wire Phép Lạ: homepage card + nav item + footer link, no missing-file image. |
| 3 | **11** | *(follow-up, not blocking)* Source a PD banner into `public/images/phep-la/` + a CREDITS row, so the card can get real art. |

Verify `npx tsc --noEmit` and `npm run lint` clean before committing; commit only Session 8's lane
files (never `git add -A`).
