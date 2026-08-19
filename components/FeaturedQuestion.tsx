'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronRight, ChevronDown, RotateCw } from 'lucide-react';
import type { ResolvedReference } from '@/lib/bibleRefs';
import type { ResolvedCatechism } from '@/lib/content';
import { T } from './T';
import styles from './FeaturedQuestion.module.css';

export type HeroQuestion = {
  slug: string;
  question: string;
  lede: string[];
  ccc: number[];
  scripture: string[];
  scriptureData: Record<string, ResolvedReference | null>;
  cccData: Record<string, ResolvedCatechism | null>;
};

/** The landing hero (design README §3): a real featured question with a short answer teaser.
 *  "Câu khác" (or a horizontal swipe on touch) swaps in the next question client-side. On mobile
 *  the teaser is collapsed behind a toggle so the hero stays short and the sections sit close. */
export function FeaturedQuestion({ questions }: { questions: HeroQuestion[] }) {
  const [i, setI] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const len = questions.length;

  // Change the shown question and re-collapse the teaser (so each one starts short on mobile).
  const go = (delta: number) => {
    if (len < 2) return;
    setI((v) => (v + delta + len) % len);
    setExpanded(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Only a clearly-horizontal swipe changes the question (so it never fights vertical scrolling).
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  if (len === 0) return null;
  const q = questions[i % len];

  return (
    <div className={styles.left} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>
          <T vi="Câu hỏi" en="Question" />
        </span>
        <span className={styles.rule} />
        {len > 1 && (
          <button type="button" className={styles.cauKhac} onClick={() => go(1)}>
            <RotateCw size={13} strokeWidth={2.2} />
            <T vi="Câu khác" en="Another" />
          </button>
        )}
      </div>

      <h1 className={styles.question}>{q.question}</h1>

      {/* Toggle is mobile-only (hidden on desktop, where the teaser always shows). */}
      {q.lede.length > 0 && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <T vi={expanded ? 'Thu gọn' : 'Xem trước câu trả lời'} en={expanded ? 'Show less' : 'Preview the answer'} />
          <ChevronDown
            size={15}
            strokeWidth={2.2}
            className={expanded ? `${styles.toggleIcon} ${styles.toggleIconOpen}` : styles.toggleIcon}
          />
        </button>
      )}

      <div className={expanded ? styles.detailsOpen : styles.details}>
        {q.lede.map((p, idx) => (
          <p key={idx} className={styles.lede}>
            {p}
          </p>
        ))}
      </div>

      <div className={styles.buttons}>
        <Link href={`/giai-dap/${q.slug}`} className={styles.primary}>
          <T vi="Đọc trọn câu trả lời" en="Read the full answer" />
          <ChevronRight size={17} strokeWidth={2.4} />
        </Link>
        <Link href="/giai-dap" className={styles.secondary}>
          <T vi="Xem tất cả câu hỏi" en="See all questions" />
        </Link>
      </div>
    </div>
  );
}
