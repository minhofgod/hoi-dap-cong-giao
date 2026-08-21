import { MessageCircleQuestion } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { GiaiDapBrowser } from '@/components/GiaiDapBrowser';
import { DongHanhCta } from '@/components/DongHanhCta';
import { getAllQuestions } from '@/lib/giaiDap';
import { getCouncilApologetics } from '@/lib/councilsV2';
import { staticPageMetadata } from '@/lib/pageMetadata';
import styles from './giai-dap.module.css';

export const generateMetadata = staticPageMetadata({
  title: 'Giải Đáp',
  description:
    'Những câu hỏi thường gặp về đức tin Công Giáo, được giải đáp rõ ràng và song ngữ Việt–Anh, kèm tham chiếu Kinh Thánh và Giáo Lý Hội Thánh Công Giáo.',
  path: '/giai-dap',
});

// Plain-text excerpt from the Markdown body: drop emphasis, headings, blockquote
// markers and link syntax so the list preview reads as prose, not raw Markdown.
function excerpt(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
    .replace(/[#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

export default function GiaiDapIndexPage() {
  const questions = getAllQuestions();
  const cards = questions.map((q) => ({
    slug: q.slug,
    questionVi: q.questionVi,
    questionEn: q.questionEn,
    topic: q.topic,
    category: q.category,
    tags: q.tags,
    subcategory: q.subcategory,
    featured: q.featured,
    excerpt: excerpt(q.bodyRaw),
  }));
  const councilCards = getCouncilApologetics().map((qa) => ({
    id: qa.id,
    questionVi: qa.question.vi,
    questionEn: qa.question.en,
    councilVi: qa.councilName.vi,
    councilEn: qa.councilName.en,
    category: qa.category,
    tags: qa.tags,
    href: `/giai-dap/cong-dong/${qa.id}`,
  }));

  const hasContent = questions.length > 0 || councilCards.length > 0;

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <T vi="GIẢI ĐÁP" en="Q&amp;A" />
          </div>
          <h1 className={styles.title}>
            <T vi="Câu hỏi thường gặp" en="Frequently asked questions" />
          </h1>
        </div>

        {hasContent ? (
          <>
            {/* In-section companion entry (compact) — self-gates on the companion flag. */}
            <DongHanhCta variant="compact" className={styles.companionCta} />
            <GiaiDapBrowser questions={cards} councilQuestions={councilCards} />
          </>
        ) : (
          <div className={styles.empty}>
            <MessageCircleQuestion size={36} strokeWidth={1.5} color="var(--sage)" />
            <p className={styles.emptyTitle}>
              <T vi="Chưa có câu hỏi nào" en="No questions yet" />
            </p>
            <p className={styles.emptyBody}>
              <T
                vi="Các câu hỏi thường gặp về đức tin, cùng câu trả lời có trích dẫn Giáo Lý, đang được biên soạn. Sắp có."
                en="Common questions about the faith, with answers citing the Catechism, are being written. Coming soon."
              />
            </p>
          </div>
        )}
      </div>
    </>
  );
}
