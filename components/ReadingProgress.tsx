'use client';

import { useEffect, useState } from 'react';
import styles from './ReadingProgress.module.css';

const PROGRESS_KEY = 'hdcg.progress.giao-ly';

export function getMaxParagraphReached(): number {
  if (typeof window === 'undefined') return 0;
  const stored = window.localStorage.getItem(PROGRESS_KEY);
  return stored ? Number(stored) || 0 : 0;
}

export function setMaxParagraphReached(n: number) {
  if (typeof window === 'undefined') return;
  const current = getMaxParagraphReached();
  if (n > current) window.localStorage.setItem(PROGRESS_KEY, String(n));
}

export function ReadingProgressBar({ total }: { total: number }) {
  const [maxReached, setMaxReached] = useState(0);

  useEffect(() => {
    // Read persisted progress from localStorage after mount (browser-only; deferred to keep SSR/hydration in sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxReached(getMaxParagraphReached());
  }, []);

  const pct = total > 0 ? Math.round((maxReached / total) * 100) : 0;

  return (
    <div className={styles.progressBlock}>
      <div className={styles.progressLabel}>
        Đã đọc {pct}% · {maxReached}/{total} số
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PartProgressBar({ start, end }: { start: number; end: number }) {
  const [maxReached, setMaxReached] = useState(0);

  useEffect(() => {
    // Read persisted progress from localStorage after mount (browser-only; deferred to keep SSR/hydration in sync).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxReached(getMaxParagraphReached());
  }, []);

  const total = end - start + 1;
  const reached = Math.max(0, Math.min(total, maxReached - start + 1));
  const pct = total > 0 ? Math.round((reached / total) * 100) : 0;

  return (
    <div className={styles.partProgressTrack}>
      <div className={styles.partProgressFill} style={{ width: `${pct}%` }} />
    </div>
  );
}
