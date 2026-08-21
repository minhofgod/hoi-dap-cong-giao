import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { getCouncilApologetics } from '@/lib/councilsV2';
import { pageMetadata, plainExcerpt, resolveParentImages } from '@/lib/pageMetadata';
import type { Metadata, ResolvingMetadata } from 'next';
import styles from '../../[slug]/answer.module.css';

// Q&A pages sourced dynamically from each council's `apologetics` (see lib/councilsV2
// getCouncilApologetics). The council JSON stays the single source of truth — this page just
// renders one item as a standalone Q&A, with a link to read more about the council itself.
export function generateStaticParams() {
  return getCouncilApologetics().map((qa) => ({ id: qa.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const qa = getCouncilApologetics().find((x) => x.id === id);
  if (!qa) return {};
  return pageMetadata({
    title: qa.question.vi,
    description: plainExcerpt(qa.answer.vi),
    path: `/giai-dap/cong-dong/${qa.id}`,
    type: 'article',
    images: await resolveParentImages(parent),
  });
}

export default async function CouncilQAPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const qa = getCouncilApologetics().find((x) => x.id === id);
  if (!qa) notFound();

  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.layout}>
          <Link href="/giai-dap" className={styles.backLink}>
            ‹ <T vi="Tất cả câu hỏi" en="All questions" />
          </Link>
          <div className={styles.chipRow}>
            <span className={styles.categoryChip}>
              <T vi="Công Đồng" en="Councils" />
            </span>
            <Bi2 value={qa.councilName} as="span" className={styles.subcategory} />
          </div>

          <Bi2
            value={qa.question}
            as="h1"
            viClassName={styles.qaQuestion}
            enClassName={styles.qaQuestion}
            enRecessedClassName={styles.qaQuestionEn}
          />
          <Bi2
            value={qa.answer}
            as="p"
            viClassName={styles.answer}
            enClassName={styles.answer}
            enRecessedClassName={styles.answerEn}
          />

          <Link href={`/cong-dong/${qa.councilSlug}`} className={styles.councilCta}>
            <span className={styles.councilCtaText}>
              <T
                vi={`Đọc thêm về ${qa.councilName.vi}`}
                en={`Read more about the ${qa.councilName.en}`}
              />
            </span>
            <span aria-hidden="true" className={styles.councilCtaArrow}>
              →
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
