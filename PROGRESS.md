# PROGRESS — Hỏi Đáp Công Giáo · setup & deployment

> **This file is NOT the project status.** → **`docs/STATE.md`** is the single entry point: current
> snapshot, the numbered session registry, open threads, the rules for parallel sessions, and
> total-loss recovery.
>
> This file was slimmed on 2026-08-19. It had grown into a second "what's been built" doc, drifted five
> days behind, and ended up contradicting `STATE.md` on how to commit — which is exactly the hazard two
> overlapping status docs create. Everything status-shaped now lives in `STATE.md` alone; what remains
> here is the setup/deployment detail worth keeping **in the repo** rather than only in Claude memory.
> The full previous version is in git history (before commit `1c1b810`).

---

## What this is

A bilingual (vi/en) Vietnamese Catholic reference website on a **customized Next.js 16** (App Router)
+ React 19 + TypeScript.

⚠️ This Next.js has breaking changes vs. stock — read `node_modules/next/dist/docs/` before writing
framework code (see `AGENTS.md`).

For the section list and what's built, see `docs/STATE.md`.

---

## Deployment

- **GitHub:** https://github.com/minhofgod/hoi-dap-cong-giao (owner `minhofgod`, branch `main`).
- **Vercel:** connected via the GitHub integration (Vercel dashboard → Add New → Import repo), same
  pattern as the Visual Rosary site. **Every push to `main` auto-deploys** — no CLI needed. Vercel
  auto-detects Next.js; no `vercel.json` required.
- **Public domain:** `hoidapconggiao.com` (GoDaddy → Vercel). The canonical origin is defined **once**
  in `lib/siteUrl.ts` and feeds `app/sitemap.ts`, `app/robots.ts`, and `metadataBase`. **Never hard-code
  the domain anywhere else.**
- **To ship a change:** stage **only your own lane's files**, commit, then `git push origin main` →
  Vercel builds + deploys automatically.
  > ⚠️ **Never `git add -A`.** Multiple sessions work in this repo at once and it sweeps up another
  > session's in-progress files. Standing rule: `docs/STATE.md` → "Rules that keep parallel sessions safe".
- **There is no staging.** `main` **is** production. Keep unfinished work off the public site with a
  `NEXT_PUBLIC_*` flag (unset on Vercel = hidden), never by delaying the commit or reverting.

### Feature flags — all default OFF on Vercel

Set them in `.env.local` (gitignored) to preview locally. **Do not set them on Vercel** unless the note says so.

| Flag | Gates | Why it's off |
|---|---|---|
| `NEXT_PUBLIC_SCRIPTURE_POPOVER` | Scripture verse popover | CGKPV text is copyrighted — stays off until permission is in hand. `content/bible.json` is gitignored; `lib/bibleRefs.ts` degrades to inert chips when absent. |
| `NEXT_PUBLIC_CANVAS` | `/so-do` canvas diagrams | not finalized; routes 404 + links hidden while off |
| `NEXT_PUBLIC_COMPANION` | `/dong-hanh` companion | **on by default** — set to `0` as a kill switch |
| `NEXT_PUBLIC_EVIDENCE_PATH` | `/bang-chung` evidence path | local-only until the 4 bridge paragraphs are proofread |
| `NEXT_PUBLIC_CG_TL` | `/cong-giao-va-tin-lanh` — Công Giáo và Tin Lành | local-only until the owner proofreads the framing text (landing copy + 4 branch intros, all in `lib/congGiaoTinLanhPath.ts`) |
| `NEXT_PUBLIC_TONG_LUAN` | `/tong-luan` — Tổng luận Thần học (35 chapters) | local-only until the owner proofreads them. **The source text was AI-generated** and then fact-checked by Session 14 (`docs/tong-luan-verification.md`) — do not switch this on before that read. |

Anything flag-gated must also be gated in **`app/sitemap.ts`**, or Google gets URLs that 404.

**Not a feature flag, but the same footgun:** `NEXT_PUBLIC_SITE_URL` overrides the canonical origin
in `lib/siteUrl.ts`. **If it is set in Vercel it WINS over the default** — so a stale value there would
silently point every canonical, sitemap and `og:image` URL at the wrong host. Leave it unset in
production.

- Initial commit `c481fad`; git identity `minhofgod <minh.c.tran1992@gmail.com>` (repo-local).

---

## Verify before calling any change "done"

Run from the project root and get both to **exit 0**:

```bash
npx tsc --noEmit
npx eslint
```

For larger changes also run `npm run build`. Then note the result.

**Gotcha:** React 19's `react-hooks/set-state-in-effect` flags valid post-mount localStorage/DOM
reads. Annotate those with a scoped `eslint-disable-next-line` + reason — don't restructure correct
hydration-safe code, and don't blanket-disable the rule to get to exit 0.

---

## Environment gotcha — Dropbox + `.next`

The repo lives inside Dropbox. Dropbox syncing `.next` causes EPERM errors and broken hot-reload —
restart `next dev` after edits, and exclude `.next` + `node_modules` from Dropbox sync. eslint already
ignores build output, including nested `.next` under `.claude/worktrees/` (see `eslint.config.mjs`).
