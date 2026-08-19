// The site's canonical origin — the ONE place the public domain is written down.
//
// Used by app/sitemap.ts, app/robots.ts, and metadataBase in app/layout.tsx (which makes Open
// Graph / canonical URLs absolute). Search Console treats https://hoidapconggiao.com and
// https://www.hoidapconggiao.com as DIFFERENT properties, so this must match the property that was
// verified, and Vercel should 301 the other form to it.
//
// Override per-environment with NEXT_PUBLIC_SITE_URL (e.g. a preview deployment) — no trailing
// slash, include the scheme.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://hoidapconggiao.com'
).replace(/\/+$/, '');
