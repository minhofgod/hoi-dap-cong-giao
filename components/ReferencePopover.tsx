'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './ReferencePopover.module.css';

// One popover open at a time across the whole page: opening any card broadcasts its id, and
// every other open card closes itself. Covers Scripture and Catechism, chips and inline refs.
const OPEN_EVENT = 'reference-popover:open';

interface Placement {
  top: number;
  left: number;
  above: boolean;
  caret: number;
}

/**
 * The shared reference card: a portaled, fixed-positioned popover with a label row and a body.
 * Handles placement (flip above when cramped, clamp to a 16px margin, reflow on scroll/resize
 * and whenever its own content resizes), Esc, click-outside, and single-open coordination.
 * Callers own open/closed state and supply the body via children.
 */
export function ReferencePopover({
  label,
  translation,
  anchor,
  onClose,
  labelTone,
  children,
}: {
  label: string;
  translation?: string;
  anchor: HTMLElement | null;
  onClose: () => void;
  /** Label color (defaults to the sage used for Scripture); Catechism passes the accent. */
  labelTone?: string;
  children: ReactNode;
}) {
  const id = useId();
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Placement | null>(null);

  // Position against the anchor; recompute on scroll, resize, and content-size changes.
  useEffect(() => {
    if (!anchor) return;
    const compute = () => {
      const pop = popRef.current;
      if (!pop) return;
      const a = anchor.getBoundingClientRect();
      const rect = pop.getBoundingClientRect();
      const margin = 16;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = a.left;
      if (left + rect.width > vw - margin) left = vw - margin - rect.width;
      if (left < margin) left = margin;

      const above = vh - a.bottom < rect.height + 24 && a.top > rect.height + 24;
      const top = above ? a.top - rect.height - 9 : a.bottom + 9;
      const caret = Math.max(14, Math.min(rect.width - 26, a.left + a.width / 2 - left));
      setPos({ top, left, above, caret });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (popRef.current) ro.observe(popRef.current);
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [anchor]);

  // Esc + click-outside close (a click on the anchor is the caller's concern, not "outside").
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || anchor?.contains(t)) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [anchor, onClose]);

  // Announce this open card; close if another one opens.
  useEffect(() => {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== id) onClose();
    };
    window.addEventListener(OPEN_EVENT, onOther);
    return () => window.removeEventListener(OPEN_EVENT, onOther);
  }, [id, onClose]);

  const card = (
    <div
      ref={popRef}
      role="dialog"
      aria-label={label}
      className={`${styles.pop} ${pos?.above ? styles.above : ''}`}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      <span className={styles.caret} style={{ left: pos?.caret ?? 26 }} aria-hidden />
      <div className={styles.labelRow}>
        <span className={styles.label} style={labelTone ? { color: labelTone } : undefined}>
          {label}
          {translation && <span className={styles.translation}> · {translation}</span>}
        </span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Đóng">
          ✕
        </button>
      </div>
      {children}
    </div>
  );

  return createPortal(card, document.body);
}
