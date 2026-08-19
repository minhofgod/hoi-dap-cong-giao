// Visibility gate for the evidence path — "Bằng chứng về Chúa Giêsu" (/bang-chung).
//
// OFF by default (the Canvas shape, NOT the companion's on-by-default one). While this is false the
// /bang-chung routes 404 and every entry point renders nothing, so the path stays LOCAL-ONLY: a
// normal Vercel build never renders it and no action is required to keep it private.
//
// Preview locally with NEXT_PUBLIC_EVIDENCE_PATH=1 in .env.local (gitignored). Do NOT set this
// variable on Vercel until the owner has proofread the four bridge paragraphs — see
// docs/evidence-path-spec.md → "Flag gating".
//
// Client-safe (no fs) so both server and client code can read it.
export const EVIDENCE_PATH_ENABLED = process.env.NEXT_PUBLIC_EVIDENCE_PATH === '1';
