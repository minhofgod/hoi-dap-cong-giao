// The site's canonical origin — the ONE place the public domain is written down.
//
// Used by app/sitemap.ts, app/robots.ts, and metadataBase in app/layout.tsx (which makes Open
// Graph / canonical URLs absolute).
//
// MUST be **www** — decided 2026-08-20. Vercel serves https://www.hoidapconggiao.com and 301s the
// non-www form to it (verified: navigating to hoidapconggiao.com/giai-dap lands on www). This file
// previously said non-www, so every og:image, canonical and sitemap URL pointed at a host that
// immediately redirected — an extra hop on every social-scraper fetch, and social scrapers are
// unreliable about following redirects for IMAGES, which undermined the per-Q&A share cards.
// Google had also already indexed the www form.
//
// Search Console is a **Domain property** (`hoidapconggiao.com`, DNS-verified), which covers www and
// non-www alike — so it imposes no constraint here and this can be www safely.
//
// Don't flip this back: each canonical-host change costs indexing churn. If it ever must change,
// change Vercel's primary domain in the same deploy so code and serving never disagree.
//
// Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. a preview deployment) — no trailing
// slash, include the scheme. NOTE: if that var is set in Vercel it WINS over the default below.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hoidapconggiao.com'
).replace(/\/+$/, '');
