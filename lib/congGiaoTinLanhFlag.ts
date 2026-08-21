// Visibility gate for "Công Giáo và Tin Lành" (/cong-giao-va-tin-lanh).
//
// OFF by default (the Canvas / evidence-path shape, NOT the companion's on-by-default one). While
// this is false the routes 404 and nothing is prerendered, so the path stays LOCAL-ONLY: a normal
// Vercel build never renders it and no action is required to keep it private.
//
// Preview locally with NEXT_PUBLIC_CG_TL=1 in .env.local (gitignored). Do NOT set this variable on
// Vercel until the owner has proofread the framing text — the landing copy and the four branch
// intros in lib/congGiaoTinLanhPath.ts. Those five pieces of prose are the only new public writing
// on this surface, and they are the whole risk: see docs/cong-giao-tin-lanh-spec.md → "Voice and
// tone".
//
// Client-safe (no fs) so both server and client code can read it.
export const CG_TL_ENABLED = process.env.NEXT_PUBLIC_CG_TL === '1';
