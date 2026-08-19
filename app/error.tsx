'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import styles from './error.module.css';

// Segment error boundary (must be a Client Component). Renders inside the root layout, so the shell
// (fonts, <html lang>) stays intact. `reset()` re-renders the failed segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No external logging is wired up; surface it to the console for debugging.
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <div className={styles.panel}>
          <h1 className={styles.title}>
            <T vi="Đã có lỗi xảy ra" en="Something went wrong" />
          </h1>
          <p className={styles.body}>
            <T
              vi="Xin lỗi, trang gặp sự cố khi tải. Bạn có thể thử lại, hoặc quay về trang chủ."
              en="Sorry — something broke while loading this page. You can try again, or head back home."
            />
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={() => reset()}>
              <T vi="Thử lại" en="Try again" />
            </button>
            <Link href="/" className={styles.secondary}>
              <T vi="Về trang chủ" en="Back home" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
