// Visibility gate for the "Đồng hành" guided companion flow (/dong-hanh).
//
// LAUNCHED 2026-08-15 — live in production. While being polished this was gated off (the route
// 404'd and the entry CTA rendered nothing) unless NEXT_PUBLIC_COMPANION=1; per the plan it's now
// flipped on by default for launch, so /dong-hanh renders everywhere. An explicit
// NEXT_PUBLIC_COMPANION=0 still forces it back off (kill switch); set that on Vercel — or flip the
// fallback below to false — to hide it again.
//
// Client-safe (no fs) so both server and client code can read it.
export const COMPANION_ENABLED = process.env.NEXT_PUBLIC_COMPANION === '0' ? false : true;
