# Logo update — Hỏi Đáp Công Giáo

Replaces the previous type-only wordmark (a Source Serif "?" + the words). Anywhere that lockup appears, use this instead.

## Brand / wordmark

The lockup is a **mark plus wordmark**: the HĐ ligature in `--accent`, then "Hỏi Đáp Công Giáo" in **Source Serif 4 600**, `--text-heading`, `letter-spacing:-.015em`, vertically centred, gap 9–11px.

**The mark.** An H/Đ ligature with a Latin cross cut out of it, supplied as SVG in `logo/` — `hoi-dap-cong-giao-mark.svg` (terracotta), `-currentcolor.svg` (inherits CSS `color`, for dark mode), `-solid.svg` (no cross cut, for use below 20px). Never rasterise it above 2×; never redraw it.

Geometry, in its `0 0 158 100` viewBox: H stems 22 wide at `x0` and `x61` · crossbar 22 tall (`y38–60`) running to `x105` · a **4-unit gap at x83–87** so a clear line separates the H from the D top to bottom · the D is a constant-width ring (18 units) from `x87`: flats `y0–18` and `y82–100`, outer arc 46×50, counter 28×32, open on the left where the Đ bar runs into it. The cross cut is 7 units wide.

**The cross cut must widen as the mark shrinks** — it is the first thing to close up:
```
≥60px wide   cut 7      the supplied SVG as-is
47px (landing header)    cut 8
41px (reader header)     cut 8
35px (mobile, footer)    cut 9
44px tile                cut 9–10
<20px                    no cut — use -solid.svg
```

**Sizes and colors in use.**
```
landing header 74px    mark 47×30 --accent      wordmark 19px
reader header 64px     mark 41×26 --accent      wordmark 17px
mobile header 56px     mark 35×22 --accent      wordmark 14.5px
footer                 mark 35×22 #A29A91       wordmark 15px --text-muted
dark grounds           mark #E08A4A             wordmark --ground
empty state / 404 / print header   mark alone, --accent at 28% opacity, no wordmark
```
Clear space is one stem width (22 units) on all sides. The mark appears **only** in those places — not on cards, section headers or buttons; those keep their Lucide line icons.

**Favicon and app tile.** The full mark reversed in `--accent`, inside a rounded tile: radius 26 on a 100px tile, 9 at 32px, 5 at 16px. At 16px use the solid mark with generous tile padding and let the tab title carry the name. Do not crop the mark to the Đ.

## Files
- `hoi-dap-cong-giao-mark.svg` — terracotta `#C67139`, cross cut out (transparent, so it sits on any ground)
- `hoi-dap-cong-giao-mark-currentcolor.svg` — inherits CSS `color`; use for dark mode (`#E08A4A`) and the muted footer (`#A29A91`)
- `hoi-dap-cong-giao-mark-solid.svg` — no cross cut, for use below 20px
- `preview.png` — what it should look like

## Implementation notes
- Inline the SVG (or use `next/image` with `unoptimized`) — do not `background-image` it; the transparent cross needs to show the page ground through it.
- The mask `id` inside each SVG must be unique per document if you inline more than one copy — suffix it, or render one `<symbol>` and `<use>` it.
- The lockup is `display:flex; align-items:center` with the stated gap — not baseline-aligned, since the mark has no baseline.
- The mark is a link to `/` in the headers; give it `aria-label="Hỏi Đáp Công Giáo"` and mark the SVG `aria-hidden="true"` when the wordmark text sits beside it.
- To widen the cross cut per size, scale the two mask rects only — never the outer geometry.
