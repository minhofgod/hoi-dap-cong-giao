import { SiteHeader } from '@/components/SiteHeader';
import { staticPageMetadata } from '@/lib/pageMetadata';
import styles from '../coming-soon.module.css';

export const generateMetadata = staticPageMetadata({
  title: 'Về trang này',
  description:
    'Hỏi Đáp Công Giáo là một trang tham khảo song ngữ Việt–Anh về đức tin Công Giáo: Giải Đáp, Giáo Lý Hội Thánh Công Giáo, và các bản văn Giáo Phụ.',
  path: '/ve-trang-nay',
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <h1 className={styles.title}>Về trang này</h1>
        <p className={styles.body}>
          Hỏi Đáp Công Giáo là một trang tham khảo song ngữ Việt–Anh về đức tin Công Giáo, gồm Giải
          Đáp (hỏi đáp), Giáo Lý Hội Thánh Công Giáo, và các bản văn Giáo Phụ.
        </p>
      </div>
    </>
  );
}
