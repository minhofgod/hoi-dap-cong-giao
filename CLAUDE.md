@AGENTS.md

## Scripture & Catechism references must open the popover

Whenever content on this site mentions a **Bible verse** (e.g. `Ga 20,23`, `Mt 5,3-6`,
`John 20:23`) or a **Catechism paragraph** (`§ 1023`, `refs_ccc`), that reference must be
clickable and open the reference popover — never leave it as plain text, and never render a
content body with a bare `dangerouslySetInnerHTML`.

For any rendered markdown/HTML body (Giải Đáp answers, Video blogs, and future content types):

```tsx
import { ScriptureBody } from '@/components/ScriptureBody';
import { enrichBody } from '@/lib/bibleRefs';

// instead of <div dangerouslySetInnerHTML={{ __html: body }} />
<ScriptureBody className={styles.body} {...enrichBody(body)} />
```

`enrichBody` auto-detects verse references in the prose and is already flag-gated by
`SCRIPTURE_POPOVER_ENABLED` (the CGKPV licensing gate), so no copyrighted text ships while it's
off. Wrap each body separately when there are several (e.g. bilingual `bi-vi` / `bi-en`).
Frontmatter `refs_scripture` / `refs_ccc` chips render via `<ScriptureRef variant="chip">` /
`<CatechismRef>`, not plain spans/links.

Full details, the bilingual snippet, and authoring rules: `docs/scripture-popover-integration.md`.
