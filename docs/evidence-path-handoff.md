# Evidence path — built, gated off. Hand-off to Sessions 8 and 7

Session 13 finished step 1 of the chain in `docs/evidence-path-spec.md` → "Hand-off" on 2026-08-18.
`/bang-chung` and its four stage routes are **on `main` and 404 in production**, because
`NEXT_PUBLIC_EVIDENCE_PATH` is unset on Vercel and the flag defaults to off.

Sequencing: **13 → then 8 and 7 in parallel → owner proofreads the four bridge paragraphs → flag on.**
Sessions 8 and 7 can both start now; their work is invisible until the flag flips, which is the point.

## What shipped

| Path | What it is |
|---|---|
| `lib/evidencePathFlag.ts` | `EVIDENCE_PATH_ENABLED` — OFF by default (the `canvasFlag` shape). **Import this in every entry point.** |
| `lib/evidencePathStages.ts` | Client-safe config: 4 stages, bilingual titles/blurbs, the 4 bridge paragraphs, anchor slugs. No `fs`. |
| `lib/evidencePath.ts` | Server loader — joins the stages to `content/giai-dap` through `lib/giaiDap`. |
| `components/bang-chung/EvidenceAnswers.tsx` | The expand-in-place answer list (client). |
| `app/bang-chung/page.tsx` | Index — hero + 4 stage cards. |
| `app/bang-chung/[stage]/page.tsx` | One dynamic route, 4 static params. |
| `app/bang-chung/bang-chung.module.css` | Reuses the site's band + list-card system. |

**Verified:** `tsc --noEmit` and `eslint` both exit 0. With the flag ON all 5 routes return 200, an
unknown stage 404s, answers expand in place, and a `GLHTCG 105` reference opens the Catechism
popover. With the flag OFF all 5 routes return 404 and the rest of the site is untouched (tested by
flipping `.env.local`, not assumed).

## Design decision worth knowing before you wire anything

The spec said stage pages should "link to the cluster." **They don't** — the owner corrected this
during the build: the click-out-and-come-back round trip is the exact problem the companion's v2
already solved (`components/DongHanh.tsx:500` renders the full answer inline; `:513` demotes the
standalone link to a quiet "Mở trang riêng"). The evidence path now does the same.

The spec's *reason* for that line is still honoured: no answer text is duplicated in `content/`, and
because the bodies mount only on expand, they stay out of the server-rendered HTML. Measured on
stage 3 — of 12,795 chars of crawlable text, member answer bodies appear **0** times. So the path
does not compete with `/giai-dap` in search.

---

## → Session 8 — entry points + sitemap (ONE combined job)

You own all four. Session 13 deliberately built **no** entry point.

**Every one of these must be gated on `EVIDENCE_PATH_ENABLED`**, the same way the companion's are —
otherwise a dead link ships to the live site the moment this merges.

```ts
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
```

1. **Homepage card** (`app/page.tsx`)
2. **Nav item** (`components/SiteHeader`) — this lands inside the new nav grouping you're designing
   in `docs/nav-and-phep-la-wiring.md`; it's another item for that count.
3. **Footer link**
4. **`app/sitemap.ts`** — ⚠️ **the trap.** Content is automatic in that file; **new routes are not.**
   Follow the existing `COMPANION_ENABLED` / `CANVAS_ENABLED` blocks at the bottom:

```ts
if (EVIDENCE_PATH_ENABLED) {
  entries.push({ url: url('/bang-chung'), changeFrequency: 'monthly', priority: 0.8 });
  entries.push(
    ...getResolvedStages().map((s) => ({
      url: url(`/bang-chung/${s.stage.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );
}
```

`getResolvedStages` comes from `@/lib/evidencePath` — deriving the URLs from the same loader the
route's `generateStaticParams` uses, so the sitemap can never list a stage that wasn't built.

**Name — use verbatim, no variants** (locked in the spec): VI `Bằng chứng về Chúa Giêsu` ·
EN `The Evidence for Jesus` · route `/bang-chung`.

The four stage slugs, if you want them anywhere: `nguyen-nhan-dau-tien`, `vu-tru-duoc-thiet-ke`,
`kinh-thanh-co-dang-tin`, `chua-giesu-song-lai`.

---

## → Session 7 — the companion CTA

Add a CTA from the `doubt-evidence` situation into the path, in `lib/dongHanh.ts` (your lane, not
Session 13's). Sense of it: *"muốn đi qua toàn bộ lập luận từ đầu?"* → `/bang-chung`.

**Gate it on `EVIDENCE_PATH_ENABLED`** so it renders nothing while the path is off — the companion
is live in production, so an ungated CTA there is a dead link on the real site, not a local one.

Use the locked destination label above.

---

## → Owner — before the flag goes on

The four **bridge paragraphs** are the only new public writing on this path (~2–4 sentences each,
bilingual). They're in `lib/evidencePathStages.ts`, one `bridge:` field per stage.

They were written to a deliberate constraint: **pure connective logic, no new hard facts** — no
dates, names, events, councils or citations of their own, so there is nothing in them that needs
external verification. They only restate what the previous stage established and why it forces the
next question. Everything else on the path is already-proofread cluster content.

Per the spec: proofread them → add them to the proofreading tracker → **then** set
`NEXT_PUBLIC_EVIDENCE_PATH=1` on Vercel. That deliberate act is the only thing that makes this
public.
