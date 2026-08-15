// Visibility gate for the "Đồng hành" guided companion flow (/dong-hanh).
//
// While this is false, the /dong-hanh route 404s and the entry CTA (DongHanhCta) renders nothing —
// so the tool stays unpublished on Vercel while it's being polished. Turn on locally with
// NEXT_PUBLIC_COMPANION=1 (in .env.local, which is gitignored) to preview; flip the default to
// true when the flow is ready to ship.
//
// Client-safe (no fs) so both server and client code can read it.
export const COMPANION_ENABLED = process.env.NEXT_PUBLIC_COMPANION === '1' ? true : false;
