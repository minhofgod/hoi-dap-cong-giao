import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { DongHanh } from '@/components/DongHanh';
import { getAllQuestions } from '@/lib/giaiDap';
import { getCouncilApologetics } from '@/lib/councilsV2';
import { getAllVideos } from '@/lib/videos';
import { getAllMiracles } from '@/lib/miraclesV2';
import { categoryLabel } from '@/lib/giaiDapTaxonomy';
import { SITUATIONS, type Resource } from '@/lib/dongHanh';
import {
  resolveReference,
  enrichBody,
  enrichBi,
  enrichReferences,
  type EnrichedAnswer,
  type ResolvedReference,
} from '@/lib/bibleRefs';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import { staticPageMetadata } from '@/lib/pageMetadata';

// Bare title only — the root layout's title.template appends " · Hỏi Đáp Công Giáo".
export const generateMetadata = staticPageMetadata({
  title: 'Đồng hành',
  description:
    'Một vài câu hỏi ngắn để tìm đúng những giải đáp, đoạn Kinh Thánh và bước tiếp theo hợp với hoàn cảnh của bạn.',
  path: '/dong-hanh',
});

// A short plain-text preview of an answer — shown inline as the reader walks the branching path.
// Strips Markdown and inline Scripture refs (e.g. "(Ga 20,23)"), which belong to the full answer
// page (with its clickable popover), not a teaser.
function preview(md: string, max = 240): string {
  const text = md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/[`_]/g, '')
    .replace(/\s*\([^)]{0,24}\d[.,]\d[^)]{0,12}\)/g, '') // drop inline verse refs like (Mt 5,3-6)
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

const escapeHtml = (s: string) =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Compose a bilingual ScriptureBody-ready block from Bi paragraphs (miracle prose is plain text
// with inline refs). Each paragraph is escaped, wrapped in <p>, then enriched so its Catechism /
// Scripture references still open the popover — the same enrichment the /phep-la page uses per-block.
function enrichParagraphs(
  paras: { vi: string; en: string }[]
): { vi: EnrichedAnswer; en: EnrichedAnswer } {
  const build = (lang: 'vi' | 'en') =>
    enrichReferences(paras.map((p) => `<p>${escapeHtml(p[lang])}</p>`).join(''));
  return { vi: build('vi'), en: build('en') };
}

export default function DongHanhPage() {
  // Gated OFF in production (404) while the flow is polished; visible locally with
  // NEXT_PUBLIC_COMPANION=1. Same pattern as the Canvas flag.
  if (!COMPANION_ENABLED) notFound();

  // Unify native Giải Đáp questions and council apologetics into one taxonomy-scored pool. The
  // matching itself runs on the client (the flow is interactive), so we only pass lightweight cards.
  const native: Resource[] = getAllQuestions().map((q) => {
    const p = preview(q.bodyRaw);
    // Enrich the full answer once (VI-only content), ready for inline ScriptureBody rendering.
    const b = enrichBody(q.bodyHtml);
    return {
      key: `n:${q.slug}`,
      kind: 'native',
      href: `/giai-dap/${q.slug}`,
      questionVi: q.questionVi,
      questionEn: q.questionEn ?? q.questionVi,
      metaVi: q.topic,
      metaEn: q.category ? categoryLabel(q.category).en : q.topic,
      category: q.category,
      tags: q.tags,
      featured: q.featured,
      // Native answers are VI-only, so the EN preview reuses the VI text (the answer page is VI too).
      excerpt: { vi: p, en: p },
      // VI-only content → ship one body; EN readers see the VI answer (as on the Q&A page).
      body: { vi: b },
      // Content pins: sibling Q&As + a pinned video are forced to the top of this item's follow-ups.
      pins: [...q.related.map((s) => `n:${s}`), ...q.relatedVideo.map((s) => `v:${s}`)],
      // short: <- populate once lib/giaiDap exposes a bilingual `short:` field (Sessions 2/3).
    };
  });

  const council: Resource[] = getCouncilApologetics().map((qa) => ({
    key: `c:${qa.id}`,
    kind: 'council',
    href: qa.href,
    questionVi: qa.question.vi,
    questionEn: qa.question.en,
    metaVi: qa.councilName.vi,
    metaEn: qa.councilName.en,
    category: qa.category,
    tags: qa.tags,
    excerpt: { vi: preview(qa.answer.vi), en: preview(qa.answer.en) },
    // Council answers are plain prose (with inline refs) and truly bilingual → enrichBi.
    body: enrichBi(qa.answer),
  }));

  // Videos join the same taxonomy-scored pool. Left without `featured`, so they never come through
  // the explore-basics/showCommon path — a video only surfaces when it genuinely matches a
  // situation's category/tags.
  const video: Resource[] = getAllVideos().map((v) => ({
    key: `v:${v.slug}`,
    kind: 'video',
    href: `/video/${v.slug}`,
    questionVi: v.title,
    questionEn: v.titleEn ?? v.title,
    metaVi: 'Video',
    metaEn: 'Video',
    category: v.category,
    tags: v.tags,
    excerpt: { vi: v.summary, en: v.summaryEn ?? v.summary },
    pins: v.relatedQa.map((s) => `n:${s}`),
  }));

  // Church-recognised miracles (Phép Lạ) join the same taxonomy-scored pool via their shared
  // `category`/`tags` (Session 11). No `featured`, so they never come through explore-basics. The
  // inline body is the summary + evidence; the `limits` ("what this does NOT establish") rides in
  // its own field so that honesty is never lost when a miracle surfaces in a walk.
  const miracle: Resource[] = getAllMiracles().map((m) => ({
    key: `m:${m.slug}`,
    kind: 'miracle',
    href: `/phep-la/${m.slug}`,
    questionVi: m.title.vi,
    questionEn: m.title.en,
    metaVi: 'Phép lạ',
    metaEn: 'Miracle',
    category: m.category,
    tags: m.tags,
    excerpt: { vi: preview(m.summary.vi), en: preview(m.summary.en) },
    body: enrichParagraphs([m.summary, ...m.evidence]),
    limits: enrichParagraphs(m.limits),
  }));

  const pool = [...native, ...council, ...video, ...miracle];

  // Resolve each situation's Scripture reference to verse data — only when the licensing flag is
  // on, so no copyrighted CGKPV text ships while it's off (matches the rest of the site). When the
  // flag is off every value is null and the reference renders as an inert chip.
  const scriptureData: Record<string, ResolvedReference | null> = {};
  for (const sit of Object.values(SITUATIONS)) {
    const ref = sit.scripture.ref;
    if (!(ref in scriptureData)) {
      scriptureData[ref] = SCRIPTURE_POPOVER_ENABLED ? resolveReference(ref) : null;
    }
  }

  return (
    <>
      <SiteHeader />
      <DongHanh pool={pool} scriptureData={scriptureData} />
    </>
  );
}
