import { MessageCircleQuestion } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { GiaiDapBrowser } from '@/components/GiaiDapBrowser';
import { getAllQuestions } from '@/lib/giaiDap';
import styles from './giai-dap.module.css';

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
    category: q.category,
    subcategory: q.subcategory,
    featured: q.featured,
    excerpt: excerpt(q.bodyRaw),
  }));

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>GIẢI ĐÁP</div>
          <h1 className={styles.title}>Câu hỏi thường gặp</h1>
        </div>

        {questions.length === 0 ? (
          <div className={styles.empty}>
            <MessageCircleQuestion size={36} strokeWidth={1.5} color="var(--sage)" />
            <p className={styles.emptyTitle}>Chưa có câu hỏi nào</p>
            <p className={styles.emptyBody}>
              Các câu hỏi thường gặp về đức tin, cùng câu trả lời có trích dẫn Giáo Lý, đang được
              biên soạn. Sắp có.
            </p>
          </div>
        ) : (
          <GiaiDapBrowser questions={cards} />
        )}
      </div>
    </>
  );
}
