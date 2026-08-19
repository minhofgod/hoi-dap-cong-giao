# Evidence path — built, gated off. Hand-off to Sessions 8 and 7

Session 13 finished step 1 of the chain in `docs/evidence-path-spec.md` → "Hand-off" on 2026-08-18.
`/bang-chung` and its six stage routes are **on `main` and 404 in production**, because
`NEXT_PUBLIC_EVIDENCE_PATH` is unset on Vercel and the flag defaults to off.

Sequencing: **13 → then 8 and 7 in parallel → owner proofreads the six bridge paragraphs → flag on.**
Sessions 8 and 7 can both start now; their work is invisible until the flag flips, which is the point.

## What shipped

| Path | What it is |
|---|---|
| `lib/evidencePathFlag.ts` | `EVIDENCE_PATH_ENABLED` — OFF by default (the `canvasFlag` shape). **Import this in every entry point.** |
| `lib/evidencePathStages.ts` | Client-safe config: the 6 stages, bilingual names, the 6 bridge paragraphs, anchor slugs, `only`. No `fs`. |
| `lib/evidencePath.ts` | Server loader — joins the stages to `content/giai-dap` through `lib/giaiDap`. |
| `components/bang-chung/EvidenceAnswers.tsx` | The expand-in-place answer list (client). |
| `app/bang-chung/page.tsx` | Index — hero + 6 stage cards. |
| `app/bang-chung/[stage]/page.tsx` | One dynamic route, 6 static params. |
| `app/bang-chung/bang-chung.module.css` | Reuses the site's band + list-card system. |

**Verified:** `tsc --noEmit` and `eslint` both exit 0. With the flag ON all 7 routes return 200, an
unknown stage 404s, answers expand in place, sliced stages show their partial note, and a
`GLHTCG 105` reference opens the Catechism popover. With the flag OFF all routes return 404 and the
rest of the site is untouched (tested by flipping `.env.local`, not assumed).

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

**SIX stages** as of 2026-08-18 (the spec says four — it predates two owner revisions). Each step
answers the question the previous one provokes.

| # | Slug | VI | EN | Answers |
|---|---|---|---|---|
| 1 | `vu-tru-duoc-thiet-ke` | Vũ trụ được tạo ra ngẫu nhiên hay được thiết kế? | Was the universe made by chance, or was it designed? | 4 |
| 2 | `ai-tao-ra-chua` | Nếu Chúa tạo ra vũ trụ, thì ai tạo ra Chúa? | If God made the universe, then who made God? | 5 |
| 3 | `tan-uoc-co-dang-tin` | Thiên Chúa là ai, và bản văn kể về Ngài có đáng tin không? | Who is God — and can the record about him be trusted? | 5 |
| 4 | `chua-giesu-tuyen-bo-la-thien-chua` | Chúa Giêsu có tuyên bố mình là Thiên Chúa không? | Did Jesus claim to be God? | 2 |
| 5 | `chua-giesu-song-lai` | Chúa Giêsu có thật sự sống lại? | Did Jesus really rise from the dead? | 9 |
| 6 | `thien-chua-muon-gi` | Vậy Thiên Chúa muốn gì nơi chúng ta? | So what does God want from us? | 3 |

28 answers. Steps 4 and 6 are short hinges either side of the long Resurrection stage, sliced with
`only` — see "Slicing a cluster" below.

Two naming decisions, recorded so they aren't reopened:

- **Stage 3 is `tan-uoc`, not `kinh-thanh`** — that cluster is about the New Testament specifically,
  not the whole Bible.
- **`duyên khởi` was rejected** for stage 1 (proposed, then dropped). It is the Vietnamese for
  *paṭiccasamuppāda* — dependent origination — which Vietnamese Buddhist sources call the core of
  all Buddhist philosophy, and it means arising *from conditions*, close to the opposite of "from
  nothing, by chance." Don't reintroduce it.

**⚠️ Names are long questions, and they change.** Don't retype them into a nav item or a card —
import from `EVIDENCE_STAGES` in `@/lib/evidencePathStages` so a rename propagates. For a nav item
that needs something short, use the section name (`Bằng chứng về Chúa Giêsu`), not a stage name.

---

## → Session 7 — the companion CTA

Add a CTA from the `doubt-evidence` situation into the path, in `lib/dongHanh.ts` (your lane, not
Session 13's). Sense of it: *"muốn đi qua toàn bộ lập luận từ đầu?"* → `/bang-chung`.

**Gate it on `EVIDENCE_PATH_ENABLED`** so it renders nothing while the path is off — the companion
is live in production, so an ungated CTA there is a dead link on the real site, not a local one.

Use the locked destination label above.

---

## Slicing a cluster — `only`, and why steps 4 and 6 use it

**The constraint (owner, 2026-08-18):**

> The cluster will have many parts. The path only needs **one verse or argument** named — not the
> whole thing. The point is still for people to learn about **evidence, not theology yet.**

The code enforces this rather than trusting anyone to remember it. `EvidenceStage.only?: string[]`
names the members a stage shows; omit it and the stage walks the whole cluster (steps 1, 2, 3, 5).
It is scoped to the anchor's own `parts:` so a stage can never pull in an unrelated Q&A, unknown
slugs drop out rather than crash, and a sliced stage renders a note plus a link to the full cluster
— so a slice never reads as "this is all there is."

- **Step 4** takes 1 of 3 from `chua-giesu-co-tuyen-bo-minh-la-thien-chua-khong`:
  `toi-va-chua-cha-la-mot-nghia-la-gi` (Ga 10,30 + 10,33). Chosen because it carries the claim **and
  the reaction of the people who heard it** — so the argument rests on how they understood it, not
  on how a modern reader parses the words. `toma-goi-chua-giesu-la-thien-chua-cua-con` (Ga 20,28) is
  the alternative; `chua-cha-lon-hon-toi…` is a defence against an objection, not a claim.
- **Step 6** takes 2 of 8 from `tai-sao-chua-giesu-chiu-dong-dinh`. The other six are the doctrinal
  mechanics (grace, the unevangelised, joining the Church) — good content, but they would make the
  path end with its heaviest stage exactly where readers drop off, and would push it from 28 answers
  to 34.

**Why the claim sits at 4, before the Resurrection, and not after** (both were considered): the
Resurrection cluster is self-contained — all 8 parts argue "did it happen", none argue "therefore he
is God" — so the reverse order works logically. It loses on the reader's experience. Step 5 is the
longest, most forensic stage on the path, and a reader who already knows the claim reads those nine
answers with stakes instead of doing tomb forensics for no stated reason. Two answers buy the whole
stage its motivation.

⚠️ **The step-4 cluster is new (`ba51dd4`) and NOT yet proofread.** It is live in `/giai-dap`
regardless of this path, and needs rows in the proofreading tracker.

---

## → Owner — before the flag goes on

The six **bridge paragraphs** are the only new public writing on this path (~2–4 sentences each,
bilingual). They're in `lib/evidencePathStages.ts`, one `bridge:` field per stage.

They were written to a deliberate constraint: **pure connective logic, no new hard facts** — no
dates, names, events, councils or citations of their own, so there is nothing in them that needs
external verification. They only restate what the previous stage established and why it forces the
next question. Everything else on the path is already-proofread cluster content.

Per the spec: proofread them → add them to the proofreading tracker → **then** set
`NEXT_PUBLIC_EVIDENCE_PATH=1` on Vercel. That deliberate act is the only thing that makes this
public.
