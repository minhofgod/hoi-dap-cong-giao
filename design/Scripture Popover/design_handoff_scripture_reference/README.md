# Scripture reference component — Hỏi Đáp Công Giáo

An inline Bible reference inside answer prose that opens a small popover with the verse text. Vietnamese-first, light and dark mode, one component used everywhere a Giải Đáp answer cites Scripture.

`reference/scripture-reference.html` is a **working standalone demo** — open it in a browser, click a reference. It is a spec artifact, not production code: reimplement it in your framework, but keep the values.

## Tokens this component needs
```
--ground        #FBF8F3     --text        #241F1B
--surface       #FFFFFF     --text-quiet  #8A837C
--border        #EDE4D6     --text-faint  #A29A91
--rule          #F2EAE0
--sage          #7A8A5E     verse numbers, focus ring
--sage-deep     #56663B     the reference itself, labels
--sage-tint     #E9EEDF     hover
--sage-press    #DCE4CB     open state
--sage-card     #F2F4EC     mobile action pill
dark:  bg #15130F · card #1E1B16 · border #322D25 · rule #2B2721
       text #EDE5D8 · muted #6E655A · sage #A8BC84 · underline #6B7A50 · hover #232A1B
fonts: 'Be Vietnam Pro' (UI) + 'Source Serif 4' (verse text) — Vietnamese subset required
```

## The inline reference
`(Ga 20,23)` — Be Vietnam Pro 500 at **1px below the surrounding body size**, `--sage-deep`, `border-bottom:1px dotted #9AA97C`, `padding:1px 3px`, `margin:0 -1px`, `border-radius:5px`, `white-space:nowrap`.

It is a `<button>` (or `role="button"` + `tabindex="0"`) — **not an `<a>`**: it opens a panel, it does not navigate.
```
rest     --sage-deep, dotted #9AA97C underline
hover    background --sage-tint, underline solidifies to --sage-deep
open     background --sage-press, text #3F4C29
focus    outline 2px --sage, offset 2px
transition: background 120ms ease-out
```
Noticeable but quiet: no pill, no icon, no color-blocking — in a paragraph it should read as a footnote, not a button. The sage reference **chips** in a "Tham chiếu" row open the same popover (hover `--sage-press`).

## The popover
326px wide · `--surface` · 1px `--border` · radius 14px · `box-shadow: 0 10px 30px rgba(36,31,27,.12)` · padding `15px 17px 16px` · an 11px rotated-square caret at `left:26px`.

1. **Label row** — "Gioan 20,23" in 600 11px Be Vietnam Pro, `letter-spacing:.11em`, uppercase, `--sage-deep`; translation ("· CGKPV") in `--text-faint`; 22px round close button right (11px ✕, stroke `--text-quiet` 2.6, hover `#F4EFE6`). Spell the book name out in full in the label even though the inline reference is abbreviated.
2. **Verse text** — **Source Serif 4** 400 16px/1.74, `--text`, `text-wrap:pretty`. Superscript verse number: 600 10.5px Be Vietnam Pro, `--sage`, `vertical-align:super`, `margin-right:4px`.
3. 1px `--rule`, then a footer row: **"Xem thêm ngữ cảnh"** (500 12px `--sage-deep`, hover `#3F4C29`) left, the expanded range ("Ga 20,19–23") in 400 10.5px `--text-faint` right.

A range renders as consecutive verses in one text block, each with its own superscript number.

## Behavior
- Closed by default. Click or Enter/Space opens; close button, `Esc`, or a click outside closes. **One popover open at a time.**
- Anchored below the reference, left-aligned to it; **flips above** when there is under ~200px of room below; clamps horizontally to a 16px viewport margin. Focus returns to the reference on close.
- **Mobile: the card does not float.** It inserts into the flow directly below the paragraph, full width, and "Xem thêm ngữ cảnh" becomes a 44px `--sage-card` pill. A floating card would cover the sentence being read.
- "Xem thêm ngữ cảnh" expands the surrounding verses **in place**; it never navigates.
- Verse text comes from a static JSON keyed by canonical reference. Prefetch on hover, cache per session. No spinner — if the text isn't ready, keep the card closed.
- Tap targets ≥44px on touch, even though the close button is drawn at 22–28px.

## Data shape
```json
{
  "Ga 20,23": {
    "book_vi": "Gioan", "chapter": 20,
    "verses": [{ "n": 23, "text": "…" }],
    "context": "Ga 20,19–23",
    "translation": "CGKPV"
  }
}
```
Store text as **NFC** and normalize on ingest — mixed normalization is what breaks Vietnamese search and sort.

## Licensing gate — read this
The verse text in the demo is **my own plain rendering, not CGKPV.** CGKPV is under copyright; that is the same reason the site's Kinh Thánh section is off in v1.

Build the component behind a flag. With no licensed text, references render as **inert sage chips with the popover disabled** — no dotted underline, no pointer cursor, no click handler. Turn it on when permission is in hand.

## Files
- `reference/scripture-reference.html` — working demo: desktop light, dark, and mobile frames, plus a rest/hover/open state strip.
- `screenshots/scripture-popover.png` — the same, rendered.
