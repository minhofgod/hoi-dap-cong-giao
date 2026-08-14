// Visibility gate for the visual Canvas diagrams (/so-do).
//
// While this is false, the /so-do routes 404 and the "Xem sơ đồ" links are hidden — so the
// diagrams stay unpublished on Vercel. Turn on locally with NEXT_PUBLIC_CANVAS=1 (in .env.local,
// which is gitignored) to preview; flip the default to true when the canvases are finalized.
//
// Client-safe (no fs) so both server and client code can read it.
export const CANVAS_ENABLED = process.env.NEXT_PUBLIC_CANVAS === '1' ? true : false;
