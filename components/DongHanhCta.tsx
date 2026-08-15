import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import { T } from './T';
import styles from './DongHanhCta.module.css';

/**
 * Entry point for the "Đồng hành" guided flow (/dong-hanh). One sage panel, two sizes: the full
 * `band` (homepage front door) and a slimmer `compact` row (in-section entry above the Giải Đáp
 * browser) — same invitation, lighter footprint where it sits among other content. Server-safe
 * (pure Link + <T>).
 *
 * Renders nothing while the companion flag is off, so no dead link to the (404'd) route ships in
 * production. Every entry point calls this, so gating here covers the homepage and /giai-dap.
 */
export function DongHanhCta({
  className,
  variant = 'band',
}: {
  className?: string;
  variant?: 'band' | 'compact';
}) {
  if (!COMPANION_ENABLED) return null;
  const compact = variant === 'compact';
  return (
    <Link href="/dong-hanh" className={`${styles.cta} ${compact ? styles.compact : ''} ${className ?? ''}`}>
      <span className={styles.icon} aria-hidden="true">
        <Compass size={compact ? 20 : 26} strokeWidth={1.8} />
      </span>
      <span className={styles.body}>
        {!compact && (
          <span className={styles.eyebrow}>
            <T vi="ĐỒNG HÀNH" en="COMPANION" />
          </span>
        )}
        <span className={styles.title}>
          <T vi="Chưa biết bắt đầu từ đâu?" en="Not sure where to start?" />
        </span>
        {!compact && (
          <span className={styles.sub}>
            <T
              vi="Trả lời vài câu ngắn về hoàn cảnh của bạn — chúng tôi sẽ gợi ý giải đáp, Lời Chúa và bước tiếp theo hợp với bạn."
              en="Answer a few short questions about your situation — we'll point you to answers, Scripture, and a next step that fit you."
            />
          </span>
        )}
      </span>
      <span className={styles.action}>
        <T vi="Bắt đầu" en="Begin" />
        <ArrowRight size={17} strokeWidth={2.2} />
      </span>
    </Link>
  );
}
