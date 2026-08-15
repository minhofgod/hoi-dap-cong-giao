import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { DongHanh } from '@/components/DongHanh';
import { getAllQuestions } from '@/lib/giaiDap';
import { getCouncilApologetics } from '@/lib/councilsV2';
import { categoryLabel } from '@/lib/giaiDapTaxonomy';
import { SITUATIONS, type Resource } from '@/lib/dongHanh';
import { resolveReference, type ResolvedReference } from '@/lib/bibleRefs';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';

export const metadata: Metadata = {
  title: 'Đồng hành · Hỏi Đáp Công Giáo',
  description:
    'Một vài câu hỏi ngắn để tìm đúng những giải đáp, đoạn Kinh Thánh và bước tiếp theo hợp với hoàn cảnh của bạn.',
};

export default function DongHanhPage() {
  // Unify native Giải Đáp questions and council apologetics into one taxonomy-scored pool. The
  // matching itself runs on the client (the flow is interactive), so we only pass lightweight cards.
  const native: Resource[] = getAllQuestions().map((q) => ({
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
  }));

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
  }));

  const pool = [...native, ...council];

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
