'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResolvedReference } from '@/lib/bibleRefs';
import { VersePopover } from './VersePopover';
import styles from './ScriptureBody.module.css';

/**
 * Renders an answer's HTML and makes the inline Scripture references inside it (marked up by
 * enrichAnswerHtml with `data-sref`) open the shared verse popover. One delegated click
 * handler covers every reference in the prose; one popover is open at a time.
 *
 * When the licensing flag is off the caller passes the raw html and empty `data`, so this is
 * just a plain div — no references, no verse text.
 */
export function ScriptureBody({
  html,
  data,
  className,
}: {
  html: string;
  data: Record<string, ResolvedReference>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<{ key: string; el: HTMLElement } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-sref]');
      if (!el || !container.contains(el)) return;
      e.preventDefault();
      const key = el.getAttribute('data-sref');
      if (!key || !data[key]) return;
      setActive((prev) => (prev && prev.el === el ? null : { key, el }));
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [data]);

  // Reflect the open state on the clicked reference (styling + a11y).
  useEffect(() => {
    if (!active) return;
    const el = active.el;
    el.classList.add('scripture-inline-ref--open');
    el.setAttribute('aria-expanded', 'true');
    return () => {
      el.classList.remove('scripture-inline-ref--open');
      el.removeAttribute('aria-expanded');
    };
  }, [active]);

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.body} ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {active && data[active.key] && (
        <VersePopover data={data[active.key]} anchor={active.el} onClose={() => setActive(null)} />
      )}
    </>
  );
}
