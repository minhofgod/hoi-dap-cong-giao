import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteUrl';

// Points crawlers at the sitemap and keeps the internal search page out of the index
// (/tim-kiem renders search results — Google's guidance is not to index those).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/tim-kiem',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
