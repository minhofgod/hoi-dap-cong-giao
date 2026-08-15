# UX: inline answers + sticky "next / see also" sidebars

Two related changes that keep readers moving without breaking their flow. Same design idea (keep the
"where to next" reachable on desktop), but **different prominence** because the two surfaces have
different jobs:
- **Companion** = a *walk* — the choices are the primary action → **prominent** sticky sidebar.
- **Q&A page** = *reading one answer* — related is secondary → **calm** "See also" rail.

---

## Session 7 — companion: full answer inline + prominent sticky choices

**Problem.** The companion ships each Q&A as a lightweight `excerpt` card and links "Đọc câu trả lời
đầy đủ" *out* to `/giai-dap/<slug>`. Reading the full answer means leaving the walk and pressing Back to
continue — the flow break the user reported.

**Fix:**
1. **Render the full answer inline (no navigation).**
   - In `app/dong-hanh/page.tsx`, enrich each pool item's body **server-side** (same `enrichReferences`/
     `enrichBody` path the Q&A page uses, honoring the `SCRIPTURE_POPOVER` gate) and pass it on the
     `Resource` (e.g. a `body` field with the enriched data).
   - In `components/DongHanh.tsx` `ReadingContent`, render that body inline via **`ScriptureBody`**
     (per `CLAUDE.md` — never a bare `dangerouslySetInnerHTML`), replacing the excerpt + outbound link.
   - **Payload:** start with **ship-all bodies** (curated site, ~74 mostly-short answers — likely fine).
     If it measures too heavy, fall back to **lazy-loading** the body on expand (a route handler or
     static per-slug JSON). Measure before optimizing.
   - Demote "read full answer" from a navigation to the inline render; keep a small secondary
     **"mở trang riêng / open as its own page"** link for sharing only.
2. **Sticky choices on desktop.** Two-column on desktop: the answer scrolls in the main column, the
   follow-up choices sit in a **`position: sticky`** sidebar, always in view. **Single-column stacked on
   mobile** (choices below the answer, as today).

**Acceptance:** read a full answer without leaving `/dong-hanh`; on desktop, pick the next question
without scrolling back up. Nothing navigates away, so there's no Back to press.

**Lane:** `components/DongHanh.tsx` + `app/dong-hanh/page.tsx`. Follow the pastoral-tone + scripture-
popover rules for the inline body.

---

## Session 2 — Q&A page: calm sticky "See also" rail (desktop only)

**Problem.** On `app/giai-dap/[slug]`, "WATCH THE VIDEO" + "CÂU HỎI LIÊN QUAN / related questions" sit at
the **bottom** of an 860px single reading column. On wide desktop the side margin is empty and that
content isn't visible while reading.

**Fix (desktop only, secondary/calm):**
- On **wide desktop** (e.g. ≥ ~1100px), move the watch-video + related-questions blocks into a
  **`position: sticky` "See also / Xem thêm" rail** in the margin beside the reading column.
- **Keep it visually QUIET** — it's a secondary aid, not a CTA. It must not compete with the reading
  column (this is a *reading* page; focus matters). Contrast with the companion's sidebar, which is
  deliberately prominent.
- **Only render the rail when there's enough to show** — e.g. a related video and/or ≥2–3 related
  questions. A lone link looks sparse in a rail; if there's little, keep it at the bottom as now.
- **Tablet/mobile unchanged** — keep the current bottom, stacked placement.

**Acceptance:** on wide desktop, related content stays reachable while reading, calm and non-
distracting; mobile is unchanged.

**Lane:** `app/giai-dap/[slug]/page.tsx` + its CSS module.

---

## Hand-off

| Session | Task |
|---|---|
| **7** | Companion: full answer inline (`ScriptureBody`, ship-all bodies then lazy-load if heavy) + **prominent** sticky choices sidebar on desktop, stacked on mobile. |
| **2** | Q&A page: **calm** sticky "See also" rail on wide desktop (watch-video + related questions), only when there's enough to show; bottom placement unchanged on mobile. |

Independent — no ordering between them. Each is its own lane; neither blocks the other.
