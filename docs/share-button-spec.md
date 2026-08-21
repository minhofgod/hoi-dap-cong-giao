# Share button on content pages

**Why now.** Session 2 shipped per-Q&A OG cards, so a shared `/giai-dap/<slug>` link now previews as the
**question**. But there is **no share affordance on the page** — the cards only pay off when a visitor
manually copies the URL from the address bar. Adding the button is what converts that work into actual
shares.

**The audience angle:** `navigator.share` opens the **native share sheet**, which on a Vietnamese
reader's phone includes **Zalo and Messenger** — the channels this content actually travels through.

---

## The good news: it already exists, just reuse it
`components/ReaderRightRail.tsx` (mounted **only** on `app/giao-ly/[number]`) already implements the
right pattern:

```ts
const share = async () => {
  const url = window.location.href;
  if (navigator.share) {
    try { await navigator.share({ title: articleTitle, url }); } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(url);
  }
};
```
Native sheet where supported (mobile), clipboard copy as the desktop fallback, labeled
**"Chia sẻ" / "Share"**. Proven and shipped — don't reinvent it.

## The work
1. **Extract a standalone `components/ShareButton.tsx`** from that logic (don't mount the whole rail —
   it's a TOC + share, and Q&A pages don't want the TOC). Props: the title to share (and optionally the
   URL, defaulting to `window.location.href`). `'use client'`.
2. **Refactor `ReaderRightRail` to use it** so there's one implementation, not two copies.
3. **Mount it on the Q&A detail page** (`app/giai-dap/[slug]`) — near the end of the answer, alongside
   the existing "XEM THÊM / SEE ALSO" and "NGUỒN THAM KHẢO" blocks. Pass `question_vi` as the title.
   Keep it quiet — a text/icon button, not a loud CTA. This is a reference site, not a social app.

### ⚠️ One gap in the current implementation to fix while extracting
The clipboard branch **gives no feedback** — the URL is copied and nothing visibly happens, so the user
can't tell it worked. Add a transient confirmation (e.g. the label swaps to **"Đã sao chép" / "Copied"**
for ~2s). Also wrap the `clipboard.writeText` in `try/catch`: it **throws** when the document isn't
focused or in some restricted contexts (same class of failure as the storage rule in
`docs/web-project-checklist.md`).

### Notes
- `navigator.share` and `navigator.clipboard` both need a **secure context** — fine in production, and
  the `if (navigator.share)` guard already handles absence.
- No third-party share SDKs (no Facebook/Zalo JS). The native sheet covers it, ships nothing, and adds
  no trackers.

## Extend later (same component, other lanes)
Once it's proven on Q&A pages, mount it on `app/cac-thanh/[slug]`, `app/phep-la/[slug]`, and
`app/cong-dong/[slug]` — each that section session's lane. Those pages will want per-route OG cards
first (see `docs/og-share-cards-spec.md` → "Extend later"), so the preview matches what's shared.

## Hand-off
| Session | Task |
|---|---|
| **2** | Extract `components/ShareButton.tsx` from `ReaderRightRail`, add copy-confirmation + `try/catch`, refactor the rail to use it, mount on `app/giai-dap/[slug]`. |
| later | Section sessions mount it on saints / miracles / councils, after those get per-route OG cards. |
