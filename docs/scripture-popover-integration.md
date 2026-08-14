# Scripture & Catechism reference popovers — integration guide

Any content whose body can mention a Bible verse or a Catechism (§) paragraph must make those
references open the reference popover instead of sitting as plain text. This applies to **every**
content type that renders a markdown/HTML body — Giải Đáp answers, Video blogs, and anything added
later. When you add a new content type or a new rendered body, wire it as below.

## The rule

**Never render a content body with a bare `dangerouslySetInnerHTML`.** Route it through
`<ScriptureBody>` so inline verse references become clickable popovers.

### Inline references in prose (the common case)

Bodies come from `marked.parse(...)` as an HTML string. Instead of:

```tsx
<div className={styles.body} dangerouslySetInnerHTML={{ __html: body }} />
```

write:

```tsx
import { ScriptureBody } from '@/components/ScriptureBody';
import { enrichBody } from '@/lib/bibleRefs';

<ScriptureBody className={styles.body} {...enrichBody(body)} />
```

`enrichBody(html)` (server-side) detects Bible references in the HTML text, resolves each to its
CGKPV verse, and returns `{ html, data }`. `ScriptureBody` renders that html and opens the popover
on click. `enrichBody` is **flag-gated** by `SCRIPTURE_POPOVER_ENABLED` — when the licensing flag
is off it returns the html untouched with empty data, so no copyrighted text ships. Don't add your
own flag check; `enrichBody` already does it.

### Multiple bodies on one page (e.g. bilingual VI/EN)

Wrap each body separately, preserving its own classes:

```tsx
<ScriptureBody className={`${styles.body} bi-vi`} {...enrichBody(video.bodyHtml)} />
<ScriptureBody className={`${styles.body} bi-en`} {...enrichBody(video.bodyHtmlEn)} />
```

The detector matches both the Vietnamese `Ga 20,23` (comma) and the colon form `John 20:23`.

Two caveats for **English** content:
- The popover always shows the **CGKPV Vietnamese** verse text (that is the only Bible data we
  have); an English body's references therefore reveal Vietnamese text. If that's not wanted, only
  enrich the VI body.
- Book lookup uses the abbreviations baked into `content/bible.json` from the vault's frontmatter,
  which are inconsistent for English: **full names resolve** (`John 20:23`, `Luke 4:18`) but many
  short English abbreviations do **not** (`Jn`, `Lk`, `Mk` are often absent). Prefer full English
  book names in English prose. To make short English abbreviations reliable, add a canonical
  abbreviation map in `scripts/build-bible.mjs` and re-run it — decide this with whoever owns the
  English content before regenerating.

### Frontmatter reference chips (`refs_scripture`, `refs_ccc`)

If a content type lists references in frontmatter and renders them as chips, use the components,
not plain spans/links — resolve data server-side:

```tsx
import { ScriptureRef } from '@/components/ScriptureRef';
import { CatechismRef } from '@/components/CatechismRef';
import { resolveReference } from '@/lib/bibleRefs';
import { resolveCatechism } from '@/lib/content';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';

{ccc.map((n) => <CatechismRef key={n} number={n} data={resolveCatechism(n)} />)}
{scripture.map((ref) => (
  <ScriptureRef
    key={ref}
    refLabel={ref}
    variant="chip"
    data={SCRIPTURE_POPOVER_ENABLED ? resolveReference(ref) : null}
  />
))}
```

## How to write references so they are detected (content authoring)

Detection is automatic in the prose — you just write the reference in the normal Vietnamese
Catholic form and it becomes clickable:

- `Ga 20,23` · `Mt 5,3` — book abbreviation, space, `chapter,verse`.
- `Kh 6,9-11` · `Mt 5,3-6` — a same-chapter range with a hyphen.
- Inside parentheses / after `x.` is fine: `(x. 1 Cr 13,12)`.
- Use the standard CGKPV abbreviations (`Ga, Mt, Lc, Cv, Rm, 1 Cr, Kh, Tv, St, Dt, …`). English
  abbreviations/names also resolve (`John 20:23`, `Jn 20:23`).

Not detected (by design):
- Catechism refs like `GLHTCG 1023` — those aren't Scripture; they stay plain text. (Catechism
  paragraphs get the popover only via `refs_ccc` chips / `<CatechismRef>`, not inline yet.)
- Cross-chapter ranges (`Ga 20,19-21,5`) — parsed as not-a-single-ref and left as text.
- Anything whose book abbreviation isn't in the CGKPV index — left as text.

## Pieces (for reference)

- `lib/bibleRefs.ts` — `enrichBody`, `enrichAnswerHtml`, `resolveReference`, `parseRef` (server-only).
- `lib/content.ts` — `resolveCatechism` (server-only).
- `components/ScriptureBody.tsx` — renders an enriched body, delegates clicks to the popover.
- `components/ScriptureRef.tsx` / `components/CatechismRef.tsx` — chip / standalone references.
- `components/VersePopover.tsx` / `components/ReferencePopover.tsx` — the shared popover card.
- `lib/scriptureFlag.ts` — `SCRIPTURE_POPOVER_ENABLED` (licensing gate for Bible text; Catechism
  has no gate). See `docs/cgkpv-permission-email.md` for the CGKPV permission status.

## Data regeneration

Bible verse data lives in `content/bible.json` (gitignored, copyrighted CGKPV text). Rebuild it
from the vault with `node scripts/build-bible.mjs` if the source changes.
