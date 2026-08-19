# The evidence path — a guided walk through the case for Jesus (spec)

Decided 2026-08-18 with the owner. Resolves `docs/proofread-fixes-round1.md` §E — the last open item
from proofreading round 1.

**BUILD STARTED 2026-08-18 (owner) — behind a flag.** This was originally parked until after launch.
It doesn't need to be, because there is **no staging environment**: anything pushed to `main` deploys
to the live domain either way. So the actual protection isn't *when* it's built, it's the standing
project rule (`docs/STATE.md` → "Rules that keep parallel sessions safe"): **gate unfinished work
behind a `NEXT_PUBLIC_*` flag, unset on Vercel, rather than delaying or reverting it.**

### Flag gating — REQUIRED, build it in from the first commit

Add `lib/evidencePathFlag.ts` mirroring `lib/canvasFlag.ts` (the OFF-by-default shape, not the
companion's on-by-default one):

```ts
export const EVIDENCE_PATH_ENABLED = process.env.NEXT_PUBLIC_EVIDENCE_PATH === '1';
```

- The routes **404 while the flag is off**, exactly like `/so-do` does today.
- **Every entry point must be gated too** (nav item, homepage card, footer, companion CTA) so no dead
  link ships — same rule the companion follows.
- **`app/sitemap.ts` must gate its routes on the flag**, following the existing `COMPANION_ENABLED` /
  `CANVAS_ENABLED` blocks there. Otherwise Google is handed URLs that 404 in production.
**This makes it LOCAL-ONLY, which is what the owner asked for (2026-08-18).** The default is `off`, so
a normal Vercel build never renders it — no kill switch needed, no action required to keep it private.
Preview it with `NEXT_PUBLIC_EVIDENCE_PATH=1` in `.env.local`, which is **gitignored and never leaves
the machine**. Add it there with the same comment style the other local-only flags use:

```
# Local-only: preview the evidence path (/bang-chung). Do NOT set this on Vercel until the
# four bridge paragraphs are proofread.
NEXT_PUBLIC_EVIDENCE_PATH=1
```

**Do NOT set this variable on Vercel.** It goes public only by that one deliberate act, and only after
the owner has proofread the four bridge paragraphs. That's the real gate — not the calendar.

## The decision: a linear learning path, NOT another companion branch

§E posed a fork — (a) a fixed curated journey vs (b) one more branch inside `/dong-hanh`. **We chose
(a).** The reason is structural, not stylistic:

The companion's v2 design is *deliberately* exploratory. `followUps()` picks the next ~4 questions by
tag overlap, a `visited` set shrinks the pool as you read, `MAX_CYCLES` caps the walk, and it ends in a
warm hand-off. **It reorders itself per user by design** — follow your curiosity, leave when satisfied.

The case for Jesus is the opposite shape. It is **cumulative**: each step earns the next, and a reader
who skips one gets a weaker argument than the site can actually make. A fixed cumulative sequence
cannot sit on an engine whose whole purpose is to not be fixed — you would either fight the follow-up
scorer or hardcode a chain through it, which is building (a) anyway, tangled into `lib/dongHanh.ts`.

**They compose instead of competing** (this is what removes (a)'s only real downside — duplicating what
the companion already routes to):

- The path **links into the existing cluster anchors. It never restates an answer.**
- The companion's `doubt-evidence` situation gains a CTA into the path
  (*"muốn đi qua toàn bộ lập luận từ đầu?"*).

So the companion stays the door for *"here's where I am"*; the path is the door for *"show me the whole
case."* Each feeds the other.

## The four stages

The order runs: **is there a God → can we trust the record → did this actually happen.** It maps
exactly onto four clusters that are already written, verified, and ticked in the proofreading tracker.

| # | Stage | Cluster anchor | Parts | The question it answers |
|---|---|---|---|---|
| 1 | Why is there anything at all | `ai-tao-ra-chua` | 5 | first cause — must something uncaused exist? |
| 2 | What kind of cause | `vu-tru-ngau-nhien-hay-duoc-thiet-ke` | 4 | fine-tuning / design |
| 3 | Can the record be trusted | `bang-chung-lich-su-cua-kinh-thanh` | 5 | are the documents historically reliable? |
| 4 | Did it actually happen | `bang-chung-chua-giesu-song-lai` | 9 | the Resurrection — the claim itself |

**23 answers, all already proofread.** Stages must remain **jumpable** — plenty of seekers arrive
caring only about the Resurrection, and a path that refuses to let them start at stage 4 loses them.

## Structure — one route per stage (recommended)

`/bang-chung` (index, free — no route collision) + `/bang-chung/<stage-slug>` per stage.

Why route-per-stage rather than one scrolling page:
- Each stage is **linkable and shareable** — you can send someone straight to "the Resurrection one."
- Each is **separately indexable**, and gets its own entry in `app/sitemap.ts`.
- "Progress" becomes a real position you can leave and come back to, not a scroll offset.
- It matches every other section on the site (index + detail), so it reuses existing page furniture.

**Each stage page carries:**
1. A `Bước N / 4` indicator and the stage title.
2. A short **bridge paragraph** (2–4 sentences): what the previous stage established, and why that
   forces this question. *This is the one piece of genuinely new writing — see below.*
3. The cluster anchor's overview, with a link to read the full cluster in `/giai-dap`.
4. The member questions as links (the anchor's `parts:` order).
5. Prev / next stage, plus "jump to any stage."

**No persisted progress state in v1.** No `localStorage`, no resume logic — the URL *is* the position.
Deterministic, shareable, nothing to debug.

## Honest scope note — there IS a little new writing

The earlier framing of "almost no new content" is true of the *answers* but not the *connective tissue*.
Four bridge paragraphs (~2–4 sentences each) have to be written, and they carry the argument's logic, so
they matter more than their length suggests. They are **new public content** and therefore:

- go through the normal content standards (`docs/content-guide.md`), and
- get **added to the proofreading tracker** and read before the path goes live on the official domain.

Everything else is presentation over already-verified material. **No AI-generated theology, no new
claims** — the path asserts nothing the clusters don't already say.

## Naming — LOCKED 2026-08-18

**VI `Bằng chứng về Chúa Giêsu` · EN `The Evidence for Jesus` · route `/bang-chung`.**

Use this verbatim for the nav item, homepage card, page `<title>`, and the companion CTA's
destination label — one name everywhere, no variants.

*(Rejected: "Lần theo bằng chứng" / Follow the Evidence; "Từng bước tìm hiểu bằng chứng" / The Evidence,
Step by Step. These were ordinary Vietnamese phrasing choices, not technical Catholic terminology, so
this was a taste call rather than a terminology-verification question. Recorded so it isn't reopened.)*

## Cross-lane traps

- **Entry points are Session 8's, and so is the sitemap.** A new section session owns **no** entry
  points. When the path is built, hand Session 8 **one** request covering all of it: homepage card, nav
  item (it lands inside the new nav grouping), footer link, **and the new routes in `app/sitemap.ts`**.
  Content is automatic in that sitemap; **new routes are not** — miss this and the whole section is
  invisible to Google. (Same trap that left Phép Lạ with no front door — see
  `docs/nav-and-phep-la-wiring.md`.)
- **The companion CTA is Session 7's**, not the path session's — `lib/dongHanh.ts` situation config.
- **Don't copy answer text into the path.** Link to the clusters. Duplicated prose competes with the
  originals in search and doubles the proofreading burden.
- **Bilingual VI/EN like the rest of the site**, via `<T>` / the `Bi` pattern; bridge paragraphs need
  both.
- Any Scripture/CCC refs in the bridge text render through `ScriptureBody` + `enrichBody` — never a bare
  `dangerouslySetInnerHTML` (`CLAUDE.md`).

## Hand-off

| # | Session | Task |
|---|---|---|
| 1 | **13** (12 is the fact-verification audit) | Build `/bang-chung` + the four stage routes behind `EVIDENCE_PATH_ENABLED`; write the four bilingual bridge paragraphs; link into the existing clusters. Owns `app/bang-chung`, `lib/evidencePath*`, `lib/evidencePathFlag.ts`, and nothing else. |
| 2 | **8** | On completion: homepage card + nav item + footer link + **the new routes in `app/sitemap.ts`** — **all four gated on the flag**. One combined hand-off. |
| 3 | **7** | Add the `doubt-evidence` → path CTA in `lib/dongHanh.ts`, gated on the flag. |
| 4 | owner | Proofread the four bridge paragraphs → add them to the proofreading tracker → **then** set `NEXT_PUBLIC_EVIDENCE_PATH=1` on Vercel. |

**Sequencing:** 1 → then 2 and 3 in parallel → owner proofreads → flag on. Building before launch is
fine *because* of the flag; without it there is no staging and `main` is production.
