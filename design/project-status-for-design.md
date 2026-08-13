# Hỏi Đáp Công Giáo — status summary for Claude Design

## What this is
A bilingual (Vietnamese/English) Catholic reference website, built with Next.js. Three content
sections:

1. **Giáo Lý** — the full Catechism of the Catholic Church, 2,865 numbered paragraphs, bilingual,
   with a collapsible contents tree and a reading progress tracker. **Fully built and live.**
2. **Giải Đáp** — short Q&A on common questions about the faith, written by the site owner
   (sourced/informed by the Catechism, Church Fathers, and resources like Catholic Answers, but in
   the owner's own words). **Structure built, no content yet** — the owner hasn't written any
   questions.
3. **Giáo Phụ** (Church Fathers) — profile pages for 30 early Church Fathers, Clement of Rome
   (1st c.) through John of Damascus (8th c.). **Built and live, fully bilingual.** See below —
   this section's scope is actively growing.

## The Giáo Phụ section's history (relevant context)
This section did **not** start as part of the website. It began as a **separate, standalone
project**: a one-page study-guide card per Church Father (16 fixed fields — name, dates, era, key
quote, key writings, martyrdom, feast day, an "apologetics corner," etc.), meant to be printed or
read individually.

That dataset was later folded into the website as the Giáo Phụ section — each of the 30 figures
became a full profile page instead of a standalone card. **The scope is no longer "one page per
Father."** The site owner's collaborator is currently researching to add substantially more
content per figure than the original 16-field study-guide template held. Expect the content model
to keep growing.

**Resolved**: the owner wants Giáo Phụ **redesigned** — a fresh visual direction, not
a match to either the original study-guide cards or the website's current theme below. Giáo Lý and
the rest of the site are explicitly **out of scope** for this redesign and should stay as they
are; this is scoped to Giáo Phụ only. Treat the current design system below as background/context
for what the *rest* of the site looks like (so Design understands the brand it's a sibling to), not
as a constraint on the new Giáo Phụ direction.

## Current visual design (already built, in production)
Warm, editorial, print-adjacent aesthetic:
- **Colors**: cream/parchment background (`#FBF8F3`), white cards, three hue identities per
  section — terracotta for Giáo Lý (`#C67139`), sage green for Giải Đáp (`#7A8A5E`), gold for
  Giáo Phụ (`#B08A3E`)
- **Type**: Source Serif 4 for headings, Be Vietnam Pro for body/UI — both self-hosted via
  `next/font/google` with the Vietnamese diacritic subset
- **Bilingual toggle**: every content page has a VI / EN / "Cả hai" (both) switch, applied
  instantly with no flash, persisted across the whole site
- Cards use a 1px hairline border, no shadow; radii range from 12–24px depending on the element;
  generous whitespace

## The immediate need: real photos/artwork for the 30 Church Fathers
The Giáo Phụ profile pages currently have **no imagery** — text only. The owner wants historical
portraits (paintings, mosaics, icons, manuscript illuminations), **not AI-generated images**,
**not stock/commercial icon-shop photos**. A research pass is underway to find public-domain
candidates on Wikimedia Commons, one per figure, to eventually place on each profile page.

What would help from Design: how imagery should actually be *treated* on the page once sourced —
placement, framing/wash treatment (the earlier app-side design spec used a
`saturate(.82) contrast(.94)` wash over photography to keep images sitting inside the warm
palette rather than looking like stock photos dropped in) — and whether/how a portrait changes the
page layout that already exists.

## What Design is being asked for
A full redesign of the **Giáo Phụ section only** (index/browse page + individual profile page) —
free of the current site's warm/terracotta theme and the Giáo Lý reader's layout. 30 historical
portraits (real paintings/mosaics/icons, sourced from Wikimedia Commons, public domain — see
above) are being downloaded now and will be available to design with/around. The content itself
(bio fields, quote, writings, apologetics corner) is described above and is expected to keep
growing beyond its current 16 fields, so favor a layout that can absorb more content sections
later rather than one sized tightly to what exists today.
