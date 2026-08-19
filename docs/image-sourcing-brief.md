# Image sourcing — filling the remaining empty states (Sessions 9 + 11)

Written 2026-08-18. **What changed:** `docs/content-guide.md` now explicitly allows **CC BY / CC BY-SA**
images, not just public domain — verified against the CC BY-SA legal code (a Collection is not an
Adaptation, so using an unmodified image does **not** license the site under CC BY-SA). That widens the
pool a lot for exactly the entries still empty, which are mostly **modern** figures behind a copyright
wall.

**Read `docs/content-guide.md` → "Images" first** (licensing table + TASL attribution). This brief is
only the sourcing job.

## What's still empty

**Session 9 — `content/cac-thanh` (11 of 21):**

*Vietnamese martyrs (6):* `anre-dung-lac` · `anre-phu-yen` · `ane-le-thi-thanh` ·
`emmanuel-le-van-phung` · `phaolo-le-bao-tinh` · `toma-tran-van-thien`

*Modern / converts (5):* `edith-stein` · `faustina-kowalska` · `maximilian-kolbe` · `padre-pio` ·
`teresa-calcutta`

**Session 11 — `content/phep-la` (2 of 18):** `buenos-aires-1996` · `zeitoun`
*(Both were already searched once and had no usable Commons photograph — re-check under the widened
CC BY-SA rule, but a second empty result is a perfectly good answer.)*

**Giáo Phụ is complete** (30/30 — the two files without images are index files, not entries).

## The realistic route for modern figures — and its trap

A 20th-century photograph of Padre Pio, Kolbe, Faustina, Edith Stein or Teresa Calcutta is usually
**still in copyright**, and being on Wikimedia Commons is not by itself proof otherwise. The route that
actually works is what the existing **Carlo Acutis** portrait already used (commit `9c899cb`): a
**freely-licensed photograph of a statue, shrine, mosaic, or memorial**, which is CC BY-SA from the
photographer.

**⚠️ The trap: that depends on Freedom of Panorama, which varies by country and is genuinely
restrictive in some.** Carlo's worked on a *UK* FoP relief specifically. **Do not assume it transfers**
to a statue in Italy, Poland, Vietnam, or India.

**How to handle it:** read the **Commons file page itself** for each candidate — Commons tags FoP
status, the photographer's licence, and any deletion discussion. If the page is unclear or contested,
**treat it as unusable**. Do not reason about copyright law from memory, yours or mine; the file page is
the evidence.

Other options that often work: the shrine/church/tomb associated with the saint (a building photo is
usually straightforward), a PD historical photo where the photographer died long enough ago, or an
old holy card / engraving that is genuinely PD by age.

## Hard guards

1. **An honest empty state beats a doubtful licence.** `available:false` already renders cleanly — it
   is *not* a broken image. With 11 slots open there is real pressure to accept a marginal file;
   don't. **"Found nothing properly licensed" is a correct, acceptable result for any entry.**
2. **Never modify the image file** — no recolouring, no compositing, no editing-and-resaving a crop.
   That would make it an *adaptation* and drag ShareAlike onto our derived work. Display cropping via
   CSS is fine.
3. **Verify the licence on the Commons file page before downloading**, and record what it actually
   says — not what the search result summarised.
4. **Dignity for the martyrs.** Several Vietnamese martyrs were executed; avoid graphic execution
   imagery. Prefer a portrait, a shrine, a church, or the canonisation-era group image. The
   content-guide's pastoral-tone rule applies to pictures too.
5. **Vietnamese captions** follow the terminology rule — verify names against the site's own content /
   HĐGM VN, never Vietnamese Wikipedia.

## What to fill in

Per entry, the existing data shape (`portrait` for saints, `image` for miracles):

```json
{ "src": "/images/<section>/<slug>.jpg", "caption": { "vi": "…", "en": "…" },
  "source": "<Photographer or artist> / Wikimedia Commons",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:…",
  "license": "CC BY-SA 4.0",
  "available": true }
```

- **`sourceUrl` and `license` are required for anything non-PD** — that's the TASL attribution.
- **Also add it to the shared Catholic Images library**: copy into `..\Catholic Images\images\` under
  its original Commons filename + append a `CREDITS.csv` row (content-guide "Images"). That library is
  internal provenance and does **not** replace on-page attribution.

## Known render gap (not these sessions' job unless asked)

The saint/father credit blocks render `medium. source, license.` as **plain text**, ignoring the
`sourceUrl` already in the data. CC's recommended practice is to hyperlink the source file page and the
licence deed. Small change, worth doing in each section's detail page — route separately.

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **9** | Source images for the 11 empty `content/cac-thanh` entries + `public/images/cac-thanh`. Fill `source`/`sourceUrl`/`license`, flip `available:true` only where a licence is confirmed. |
| 2 | **11** | Re-check `buenos-aires-1996` + `zeitoun` under the widened CC BY-SA rule. A second empty result is fine — report it. |
| 3 | owner | Nothing blocking. This is post-launch polish; the empty states are honest today. |

Verify `npx tsc --noEmit` + `npm run lint` clean; commit only your own lane's files.
