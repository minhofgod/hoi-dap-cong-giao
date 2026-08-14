import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { CanvasViewer } from '@/components/CanvasViewer';
import { getCanvas } from '@/lib/canvas';
import { CANVAS_ENABLED } from '@/lib/canvasFlag';
import styles from '../so-do.module.css';

export const metadata: Metadata = {
  title: 'Sola Fide — Sơ đồ · Hỏi Đáp Công Giáo',
  description:
    'Sơ đồ trực quan về Sola Fide: đức tin, việc làm và ơn cứu độ, với các đoạn Kinh Thánh liên quan.',
};

export default function SolaFideCanvasPage() {
  if (!CANVAS_ENABLED) notFound();
  const data = getCanvas('sola-fide');
  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <Link href="/giai-dap/duc-tin-va-viec-lam" className={styles.back}>
          ‹ Đức tin và việc làm
        </Link>
        <div className={styles.head}>
          <div className={styles.eyebrow}>Sơ đồ</div>
          <h1 className={styles.title}>Sola Fide — Đức tin và việc làm</h1>
          <p className={styles.hint}>
            Kéo để di chuyển · cuộn hoặc chụm hai ngón để phóng to · nút ⤢ để vừa khung.
          </p>
        </div>
        <CanvasViewer data={data} />
      </main>
    </>
  );
}
