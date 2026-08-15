# Companion audit — ready-to-send hand-off blocks

Routed instructions derived from `docs/companion-relevance-audit.md` (Session 10's relevance-curation
audit). Copy the relevant block to each session when you're ready. **None of this generates content** —
it's tuning + linking *existing* Q&As plus one tiny additive code field. New writing (the F5 content
gaps) stays the owner's track, at their pace. Nothing here is blocked or depends on v2 being finished.

## Priority order

> ⚠️ **Ship-first live bug (all platforms — mobile AND desktop) — see "→ Session 7 (BUG)" below.** The companion loses its whole
> journey and resets to step 1 whenever you follow *any* outbound link (read full answer / suggested
> read / watch video) and press Back. This breaks the tool's core loop on mobile; its `sessionStorage`
> half is small and shippable ahead of the rest of v2. Do this before the tuning items.

1. **Now — three one-line edits, verified, zero risk:** Session 7's `authority` drop + `doubt-suffering`
   re-tag, and Session 3's paired re-tag. Fixes two real relevance defects.
2. **Next — small code + quality pins:** Session 7 adds the `seedPins` field, then the Nicaea II pin +
   the single suffering pin.
3. **Alongside v2 whenever:** Session 3's follow-up chains (v2 fuel — ready now, improves current
   follow-ups too).
4. **Deferred / owner call:** Session 2's optional `consolation` tag (only once ≥3–4 pastoral pieces
   exist); the `science-faith` re-categorization (owner decision).

> ⚠️ **Coupling to coordinate:** the `doubt-suffering` edit (Session 7) and the `sao-chua-khong-tao…`
> re-tag (Session 3) are a **pair** — have **Session 7 go first**, so `doubt-suffering` keeps that answer
> via the `free-will` tag before Session 3 strips `suffering` off it.

---

## → Session 7 (BUG — ship first)  *(lane: `components/DongHanh.tsx`)*

**Companion loses its place — resets to step 1 on Back after any outbound link. ALL platforms
(confirmed mobile + desktop — it's platform-agnostic React re-mount behavior, nothing mobile-specific).**

**Repro (any browser, live in prod):** on `/dong-hanh`, answer a few questions to reach an answer → tap
**any** outbound link — "Đọc câu trả lời đầy đủ / read the full answer", a "Gợi ý đọc trước" suggestion,
or a watch-video link → land on that page → press browser Back → the companion has reset to the **first
question**. The journey (`trail`) is gone, so you can't keep choosing the next path.

**Cause (confirmed by reading the code):** `components/DongHanh.tsx` holds the whole flow in `useState`
(`stack`, `sitId`, `trail`, `ended`) with **no URL/history/storage sync**. ANY navigation away from
`/dong-hanh` re-mounts the component on return → resets to `[START_STEP]`. Every outbound link hits this,
not just one. No per-step history entry is pushed either, so browser Back never steps back one question.

**Fix (fold into v2, but #1 is small and independently shippable now):**
1. **Persist `{stack, sitId, trail, ended}` to `sessionStorage`** on change, restore on mount. One fix
   covers *every* outbound link (read-full-answer, suggested reads, watch-video) — you return to exactly
   where you were, trail intact, and keep walking. This is the ship-first piece.
2. **Make Back step back one screen** — `window.history.pushState` per step/answer; on `popstate`, pop
   `stack`/`trail`. Back = previous question; only Back from the first screen exits the tool.
3. *Optional:* a compact `?p=` URL param → shareable/bookmarkable, and makes 1 & 2 fall out naturally.
4. *Fallback* if App-Router history sync is fiddly: at minimum add a visible in-UI "Quay lại / Back"
   control so users aren't dependent on the browser Back.

**Acceptance (mobile):** answer 2–3 questions → open the full answer (or a suggested read, or a video) →
Back → you return to the same answer, trail intact, able to keep choosing the next path; and Back within
the flow steps back one question, not to the start.

---

## → Session 7  *(lane: `lib/dongHanh.ts`)* — relevance-audit config items

Three items from the relevance audit (`docs/companion-relevance-audit.md`, hand-off table). Can be done
independent of / alongside the v2 work.

**1. Two config quick-wins (do first — one-liners, verified in the audit):**
- `explore-jesus-church`: drop `authority` from tags → `['jesus', 'church-history', 'trinity']`. (It was
  dragging medieval papal-politics councils in front of an *explorer* — reads as a lecture.)
- `doubt-suffering`: tags → `['suffering', 'free-will']`. (Keeps the free-will theodicy answer for this
  *intellectual* path.) **Land this before** Session 3 re-tags
  `sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot`, so the piece stays reachable here via `free-will`.

**2. Add the `seedPins` field** (audit Appendix A): optional `seedPins?: string[]` on `Situation`,
honored in `matchResources` (pinned keys lead in listed order, then the existing tag-scored rest). ~10
lines, additive, backward-compatible — brings the anchor step to parity with how `followUps` already
honors pins.

**3. Apply two pins (needs the field):**
- `defend-images.seedPins = ['c:nicaea-ii-hoi-1']` — surfaces Nicaea II (the council that *defined* icon
  veneration), currently buried under 8 native Q&As.
- `suffering.seedPins = ['n:tai-sao-chua-giesu-chiu-dong-dinh']` — **only this one** (the
  Good-Thief/atonement pins were dropped on tone grounds). Apply with the pastoral lens: the situation's
  hand-written `advice` stays **primary**, the pin is secondary, gentle present-first framing. Follow
  `docs/content-guide.md` "Pastoral tone."

**Cross-cutting:** for the grief paths (`suffering`, `doubt-suffering`, `loved-one-*`), **tone overrides
tag-score**, and the priest/RCIA off-ramp must stay visible across the *entire* v2 walk, not just the
first screen.

---

## → Session 3  *(lane: `content/giai-dap` frontmatter — linking existing Q&As, no new content)*

From the relevance audit (`docs/companion-relevance-audit.md`):

**1. Re-tag (do AFTER Session 7's `doubt-suffering` edit):**
`content/giai-dap/sao-chua-khong-tao-con-nguoi-chi-lam-viec-tot.md` → `tags: ["free-will"]` (remove
`suffering`). It's a free-will *argument*, not consolation, and it was leaking into the pastoral
suffering path. Then run `node scripts/check-tags.mjs` (must exit 0).

**2. Fill empty `related`** on the 7 non-anchor faith/works Q&As — use the ordered lists in the audit's
"Deliverable 2 §A" table (first entry = strongest next question).

**3. Add cross-cluster bridges** — the 5 `related` entries in "Deliverable 2 §B" (append to existing
`related`, don't replace). These are the reader's natural next jumps that tag-overlap can't make (e.g.
"why the cross?" → "so how does that save *me*?").

---

## → Session 2  *(lane: `lib/giaiDapTaxonomy.ts` — deferred, no action yet)*

Two items parked from the relevance audit — **hold both for now:**
- Optional new tag `consolation` (vi: *An ủi & hy vọng* / en: *Consolation & hope*) — only worth adding
  once ≥3–4 genuinely pastoral pieces will carry it. Until then the `suffering` path uses `seedPins`.
  Don't add a tag nothing uses.
  - **Auto-reminder (no need to watch this manually):** `scripts/check-tags.mjs` — which you run before
    every content commit — nudges you once ≥4 Q&As are tagged `suffering` (the pastoral-content proxy),
    pointing back to this block. It prints as a `⏰ deferred reminder` (exit stays 0, not a failure) and
    **self-clears** the moment `consolation` is added to `lib/giaiDapTaxonomy.ts`. So you'll be told when
    it's time; you don't have to remember.
- The `science-faith` category is currently used by zero Q&As (the cosmology cluster lives under
  `god-meaning`). Re-categorizing is an **owner decision** (it moves things in the `/giai-dap` filters
  too) — flagged, not actioned.

---

## Owner's own track (not a session instruction)

The audit's biggest finding: the matcher is healthy; **content gaps are the real lever** (F5). Write
order for maximum companion lift, at your pace, from your video scripts:
1. "Who is God / the Trinity, gently" → fills `explore-god`'s *"who is he?"* half.
2. 2–3 genuinely consoling/pastoral pieces (grief, hope in loss, a saint who *relied* on God) → fills
   the `suffering` path, which today has almost nothing that consoles rather than explains.
3. A mixed-marriage witness piece → fills `loved-one-spouse`.
4. An evolution & faith piece → fills `doubt-science`'s dangling `evolution` tag.

When a batch of this lands, re-run the relevance-curation pass (it's read-only) and re-route its updated
proposals through this file.
