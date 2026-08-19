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

const ANIM_MS = 240;
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The landing hero (design README §3): a real featured question with a short answer teaser.
 *  "Câu khác" — or a horizontal swipe on touch — swaps in the next question: the answer follows the
 *  finger, then slides out and the next slides in (or springs back if the swipe was short). On
 *  mobile the teaser is collapsed behind a toggle so the hero stays short and the sections sit close. */
export function FeaturedQuestion({ questions }: { questions: HeroQuestion[] }) {
  const len = questions.length;
  const [i, setI] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [dx, setDx] = useState(0); // live horizontal offset of the answer panel (px)
  const [animate, setAnimate] = useState(false); // whether dx is CSS-transitioned vs. following a finger

  const rootRef = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const dragDx = useRef(0);
  const phase = useRef<'idle' | 'out' | 'in'>('idle');
  const width = useRef(400);

  const swap = (d: number) => {
    setI((v) => (v + d + len) % len);
    setExpanded(false); // each question starts collapsed (short) again
  };

  // Animated change: slide the current answer out, swap, slide the next one in. Uses timers (not
  // transitionend) so it can never get stuck if a transition event is missed.
  const commit = (d: number) => {
    if (len < 2 || phase.current !== 'idle') return;
    const w = rootRef.current?.offsetWidth || width.current;
    width.current = w;
    if (prefersReducedMotion()) {
      swap(d);
      setAnimate(false);
      setDx(0);
      return;
    }
    phase.current = 'out';
    setAnimate(true);
    setDx(-d * w); // slide the current panel out (next → to the left)

    window.setTimeout(() => {
      swap(d);
      setAnimate(false);
      setDx(d * w); // the incoming answer waits just off-screen on the far side
      // Two frames so that off-screen position paints before we transition it back to centre.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setDx(0);
        })
      );
      // Safety net: guarantee we return to a clean resting state even if a frame is dropped.
      window.setTimeout(() => {
        phase.current = 'idle';
        setAnimate(false);
        setDx(0);
      }, ANIM_MS + 80);
    }, ANIM_MS + 20);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (phase.current !== 'idle' || len < 2) return;
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
    dragging.current = false;
    dragDx.current = 0;
    width.current = rootRef.current?.offsetWidth || width.current;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!start.current) return;
    const t = e.touches[0];
    const mx = t.clientX - start.current.x;
    const my = t.clientY - start.current.y;
    if (!dragging.current) {
      if (Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) {
        dragging.current = true;
        setAnimate(false); // follow the finger 1:1, no transition
      } else if (Math.abs(my) > 8) {
        start.current = null; // vertical intent — let the page scroll
        return;
      } else {
        return;
      }
    }
    dragDx.current = mx;
    setDx(mx);
  };
  const onTouchEnd = () => {
    const wasDragging = dragging.current;
    start.current = null;
    dragging.current = false;
    if (!wasDragging) return;
    const threshold = Math.min(80, width.current * 0.22);
    if (Math.abs(dragDx.current) > threshold) {
      commit(dragDx.current < 0 ? 1 : -1);
    } else {
      setAnimate(!prefersReducedMotion()); // spring back to centre
      setDx(0);
    }
  };

  if (len === 0) return null;
  const q = questions[i % len];
  const sliderStyle = {
    transform: `translateX(${dx}px)`,
    transition: animate ? `transform ${ANIM_MS}ms ease` : 'none',
  };

  return (
    <div
      className={styles.left}
      ref={rootRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>
          <T vi="Câu hỏi" en="Question" />
        </span>
        <span className={styles.rule} />
        {len > 1 && (
          <button type="button" className={styles.cauKhac} onClick={() => commit(1)}>
            <RotateCw size={13} strokeWidth={2.2} />
            <T vi="Câu khác" en="Another" />
          </button>
        )}
      </div>

      <div className={styles.slider} style={sliderStyle}>
        <h1 className={styles.question}>{q.question}</h1>

        {/* First paragraph is always shown as the answer preview. */}
        {q.lede[0] && <p className={styles.lede}>{q.lede[0]}</p>}

        {/* The rest collapses on mobile behind the toggle (desktop always shows it, toggle hidden). */}
        {q.lede.length > 1 && (
          <>
            <div className={expanded ? styles.detailsOpen : styles.details}>
              {q.lede.slice(1).map((p, idx) => (
                <p key={idx} className={styles.lede}>
                  {p}
                </p>
              ))}
            </div>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              <T vi={expanded ? 'Thu gọn' : 'Xem thêm'} en={expanded ? 'Show less' : 'Show more'} />
              <ChevronDown
                size={15}
                strokeWidth={2.2}
                className={expanded ? `${styles.toggleIcon} ${styles.toggleIconOpen}` : styles.toggleIcon}
              />
            </button>
          </>
        )}

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
    </div>
  );
}
