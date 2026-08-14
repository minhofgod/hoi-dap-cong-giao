'use client';

import { useEffect, useRef, useState } from 'react';
import type { ResolvedReference } from '@/lib/bibleRefs';
import type { ResolvedCatechism } from '@/lib/content';
import { VersePopover } from './VersePopover';
import { CatechismPopover } from './CatechismPopover';
import styles from './ScriptureBody.module.css';

/**
 * Renders an answer's HTML and makes its inline references open a popover:
 *  - Scripture references (marked `data-sref` by enrichAnswerHtml) → the verse popover, only when
 *    the CGKPV licensing flag is on (otherwise `data` is empty and they're plain text).
 *  - Catechism references (marked `data-ccc` by enrichCatechismHtml) → the Catechism popover;
 *    always available, since the Catechism is public.
 *
 * One delegated click handler covers every reference in the prose; one popover is open at a time.
 */
type Active = { kind: 'sref' | 'ccc'; key: string; el: HTMLElement };

export function ScriptureBody({
  html,
  data,
  ccc,
  className,
}: {
  html: string;
  data: Record<string, ResolvedReference>;
  ccc?: Record<string, ResolvedCatechism>;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Active | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const sEl = target.closest<HTMLElement>('[data-sref]');
      if (sEl && container.contains(sEl)) {
        const key = sEl.getAttribute('data-sref');
        if (key && data[key]) {
          e.preventDefault();
          setActive((prev) => (prev && prev.el === sEl ? null : { kind: 'sref', key, el: sEl }));
          return;
        }
      }
      const cEl = target.closest<HTMLElement>('[data-ccc]');
      if (cEl && container.contains(cEl)) {
        const key = cEl.getAttribute('data-ccc');
        if (key && ccc?.[key]) {
          e.preventDefault();
          setActive((prev) => (prev && prev.el === cEl ? null : { kind: 'ccc', key, el: cEl }));
        }
      }
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [data, ccc]);

  // Reflect the open state on the clicked reference (styling + a11y).
  useEffect(() => {
    if (!active) return;
    const el = active.el;
    const openClass = active.kind === 'sref' ? 'scripture-inline-ref--open' : 'catechism-inline-ref--open';
    el.classList.add(openClass);
    el.setAttribute('aria-expanded', 'true');
    return () => {
      el.classList.remove(openClass);
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
      {active?.kind === 'sref' && data[active.key] && (
        <VersePopover data={data[active.key]} anchor={active.el} onClose={() => setActive(null)} />
      )}
      {active?.kind === 'ccc' && ccc?.[active.key] && (
        <CatechismPopover data={ccc[active.key]} anchor={active.el} onClose={() => setActive(null)} />
      )}
    </>
  );
}
