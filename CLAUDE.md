@AGENTS.md

## Verify facts before they ship — truth over speed (applies to EVERY session)

The owner wants **correctness over speed or token cost**, and is relying on the sessions + their tools
to get facts right — they cannot independently verify hard facts (dates, names, events) and are honest
about that. So in every session — **including a fresh one after a crash or restart** — hold this
standard:

- **Hard facts** (dates, names, events, councils, canonizations, miracle recognitions, citations):
  **never state them from memory.** Verify with web search against **authoritative / primary sources**
  (Vatican.va, official Church documents, the Catechism itself), and **triangulate ≥2 independent good
  sources.** Wikipedia and LLM drafts (Grok, ChatGPT, even this assistant's memory) are *starting
  pointers to confirm elsewhere* — never the final word.
- **Doctrine / theology:** anchor to the Catechism + magisterial documents; cross-check.
- **Vietnamese Catholic terminology:** verify against the site's own content + the Vietnamese Catechism
  + HĐGM VN — never memory or Vietnamese Wikipedia (see `docs/content-guide.md`).
- **Flag uncertainty honestly.** If you can't verify, or sources conflict, **say so** / mark
  `[cần kiểm chứng]`. A flagged uncertainty beats a confident wrong answer. **Never let an unverified
  hard fact ship.**
- Treat ALL drafts from external tools (Grok, etc.) as **unverified** until you've web-checked them.

Standing rule for all sessions and all content. Full method: `docs/content-guide.md` → "Facts &
verification."

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
