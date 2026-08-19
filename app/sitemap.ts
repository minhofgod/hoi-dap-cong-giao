import type { MetadataRoute } from 'next';
import { flatArticles } from '@/lib/content';
import { getAllFigures } from '@/lib/churchFathersV2';
import { getAllCouncils, getCouncilApologetics } from '@/lib/councilsV2';
import { getAllQuestions } from '@/lib/giaiDap';
import { getAllSaints } from '@/lib/saintsV2';
import { getAllMiracles } from '@/lib/miraclesV2';
import { getAllVideos } from '@/lib/videos';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import { CANVAS_ENABLED } from '@/lib/canvasFlag';
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
import { getResolvedStages } from '@/lib/evidencePath';
import { TONG_LUAN_ENABLED } from '@/lib/tongLuanFlag';
import { getAllChapters } from '@/lib/tongLuan';
import { SITE_URL } from '@/lib/siteUrl';

// Every URL is derived from the SAME loader each route's generateStaticParams uses, so the sitemap
// can never list a page that wasn't built (a 404 in a sitemap is a Search Console error).
//
// Deliberately EXCLUDED:
//  - /tim-kiem — a search box; Google's guidance is not to index internal search pages.
//  - flag-gated routes while their flag is off (/dong-hanh, /so-do/*) — those routes 404 in
//    production when gated, so submitting them would report errors. They appear automatically
//    once the flag is on.
//
// `lastModified` is deliberately omitted: the content files' real edit dates aren't available to
// the loaders, and stamping build time would tell Google every page changed on every deploy —
// an unreliable signal it learns to discount. Omitting it is honest and costs nothing.

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;

  const entries: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },

    // Section indexes
    { url: url('/giai-dap'), changeFrequency: 'weekly', priority: 0.9 },
    { url: url('/giao-ly'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/lich-su-hoi-thanh'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/giao-phu'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/cong-dong'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/cac-thanh'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/phep-la'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/video'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/ve-trang-nay'), changeFrequency: 'yearly', priority: 0.3 },

    // Standalone overview pages inside sections
    { url: url('/cac-thanh/tu-dao-viet-nam'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/phep-la/hoi-thanh-tham-dinh'), changeFrequency: 'monthly', priority: 0.7 },

    // Giải Đáp Q&As — the site's core content
    ...getAllQuestions().map((q) => ({
      url: url(`/giai-dap/${q.slug}`),
      changeFrequency: 'monthly' as const,
      priority: q.featured ? 0.8 : 0.7,
    })),

    // Council apologetics rendered as standalone Q&A pages
    ...getCouncilApologetics().map((qa) => ({
      url: url(`/giai-dap/cong-dong/${qa.id}`),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),

    // Catechism reader — one page per article (not per paragraph)
    ...flatArticles.map((a) => ({
      url: url(`/giao-ly/${a.paragraphRange[0]}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),

    ...getAllFigures().map((f) => ({
      url: url(`/giao-phu/${f.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getAllCouncils().map((c) => ({
      url: url(`/cong-dong/${c.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getAllSaints().map((s) => ({
      url: url(`/cac-thanh/${s.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getAllMiracles().map((m) => ({
      url: url(`/phep-la/${m.slug}`),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...getAllVideos().map((v) => ({
      url: url(`/video/${v.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  if (COMPANION_ENABLED) {
    entries.push({ url: url('/dong-hanh'), changeFrequency: 'monthly', priority: 0.9 });
  }
  if (CANVAS_ENABLED) {
    entries.push({ url: url('/so-do/sola-fide'), changeFrequency: 'yearly', priority: 0.5 });
  }
  // The evidence path (/bang-chung) + its stage routes. Content pages are automatic above, but new
  // ROUTES are not — this is the block that keeps /bang-chung from launching with no sitemap entry.
  // Stage URLs come from the same loader the route's generateStaticParams uses, so the sitemap can
  // never list a stage that wasn't built.
  if (EVIDENCE_PATH_ENABLED) {
    entries.push({ url: url('/bang-chung'), changeFrequency: 'monthly', priority: 0.8 });
    entries.push(
      ...getResolvedStages().map((s) => ({
        url: url(`/bang-chung/${s.stage.slug}`),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );
  }
  // Tổng luận Thần học (/tong-luan) index + every chapter. Chapter URLs come from the same loader
  // the route's generateStaticParams uses, so the sitemap can never list a chapter that wasn't built.
  if (TONG_LUAN_ENABLED) {
    entries.push({ url: url('/tong-luan'), changeFrequency: 'monthly', priority: 0.8 });
    entries.push(
      ...getAllChapters().map((c) => ({
        url: url(`/tong-luan/${c.slug}`),
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      }))
    );
  }

  return entries;
}
