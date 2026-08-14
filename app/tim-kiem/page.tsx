import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { GlobalSearch } from '@/components/GlobalSearch';
import { toc, content } from '@/lib/content';
import { getAllQuestions } from '@/lib/giaiDap';
import { getAllFathers } from '@/lib/churchFathers';
import { getAllVideos } from '@/lib/videos';
import styles from './tim-kiem.module.css';

export const metadata: Metadata = {
  title: 'Tìm kiếm · Hỏi Đáp Công Giáo',
  description: 'Tìm trong Giải Đáp, Giáo Lý, Giáo Phụ và Video.',
};

export default function SearchPage() {
  const questions = getAllQuestions().map((q) => ({
    slug: q.slug,
    question: q.questionVi,
    category: q.category,
  }));
  const fathers = getAllFathers().map((f) => ({
    slug: f.slug,
    name: f.fullName.vi,
    meta: f.era.vi,
    keywords: `${f.fullName.en} ${f.nickname.vi} ${f.nickname.en} ${f.era.en}`,
  }));
  const videos = getAllVideos().map((v) => ({ slug: v.slug, title: v.title, summary: v.summary }));

  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <h1 className={styles.title}>Tìm kiếm</h1>
        <Suspense fallback={null}>
          <GlobalSearch
            toc={toc}
            questions={questions}
            fathers={fathers}
            videos={videos}
            catechismTotal={content.length}
          />
        </Suspense>
      </main>
    </>
  );
}
