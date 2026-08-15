import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';
import { T } from './T';
import styles from './DongHanhCta.module.css';

/**
 * Entry point for the "Đồng hành" guided flow (/dong-hanh). A single sage panel used both as a
 * band on the homepage and above the Giải Đáp browser — one design so the invitation reads the
 * same everywhere. Server-safe (pure Link + <T>).
 */
export function DongHanhCta({ className }: { className?: string }) {
  return (
    <Link href="/dong-hanh" className={`${styles.cta} ${className ?? ''}`}>
      <span className={styles.icon} aria-hidden="true">
        <Compass size={26} strokeWidth={1.8} />
      </span>
      <span className={styles.body}>
        <span className={styles.eyebrow}>
          <T vi="ĐỒNG HÀNH" en="COMPANION" />
        </span>
        <span className={styles.title}>
          <T vi="Chưa biết bắt đầu từ đâu?" en="Not sure where to start?" />
        </span>
        <span className={styles.sub}>
          <T
            vi="Trả lời vài câu ngắn về hoàn cảnh của bạn — chúng tôi sẽ gợi ý giải đáp, Lời Chúa và bước tiếp theo hợp với bạn."
            en="Answer a few short questions about your situation — we'll point you to answers, Scripture, and a next step that fit you."
          />
        </span>
      </span>
      <span className={styles.action}>
        <T vi="Bắt đầu" en="Begin" />
        <ArrowRight size={17} strokeWidth={2.2} />
      </span>
    </Link>
  );
}
