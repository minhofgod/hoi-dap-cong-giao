import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Không tìm thấy trang',
};

// Global 404. This is load-bearing here: flag-gated routes (/bang-chung, /so-do/*) 404 BY DESIGN
// while their flag is off, so real visitors and crawlers land here on purpose — hence a gentle
// "may not be available yet" wording, not just a typo message, plus a clear way back.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <div className={styles.panel}>
          <div className={styles.code} aria-hidden="true">
            404
          </div>
          <h1 className={styles.title}>
            <T vi="Không tìm thấy trang" en="Page not found" />
          </h1>
          <p className={styles.body}>
            <T
              vi="Trang bạn tìm không tồn tại, hoặc có thể chưa được mở. Mời bạn quay về trang chủ hoặc xem mục Giải Đáp."
              en="The page you’re looking for doesn’t exist, or may not be available yet. Head back home, or browse the Q&A."
            />
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.primary}>
              <T vi="Về trang chủ" en="Back home" />
            </Link>
            <Link href="/giai-dap" className={styles.secondary}>
              <T vi="Xem Giải Đáp" en="Browse the Q&A" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
