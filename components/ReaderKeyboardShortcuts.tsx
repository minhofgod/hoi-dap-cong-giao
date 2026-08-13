'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toc } from '@/lib/toc-client';
import { findArticleStartForParagraph } from '@/lib/tocUtils';

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}

export function ReaderKeyboardShortcuts({ paragraphIds }: { paragraphIds: number[] }) {
  const router = useRouter();
  const indexRef = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      if (e.key === '/') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('[data-giao-ly-search]');
        input?.focus();
        return;
      }

      if (e.key === 'g' || e.key === 'G') {
        const raw = window.prompt('Nhảy tới số:');
        const n = Number(raw);
        if (raw && n > 0) {
          const start = findArticleStartForParagraph(toc, n);
          if (start) router.push(`/giao-ly/${start}#${n}`);
        }
        return;
      }

      if (e.key === 'j' || e.key === 'J') {
        indexRef.current = Math.min(indexRef.current + 1, paragraphIds.length - 1);
        const id = paragraphIds[indexRef.current];
        document.getElementById(String(id))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.history.replaceState(null, '', `#${id}`);
      }

      if (e.key === 'k' || e.key === 'K') {
        indexRef.current = Math.max(indexRef.current - 1, 0);
        const id = paragraphIds[indexRef.current];
        document.getElementById(String(id))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.history.replaceState(null, '', `#${id}`);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [paragraphIds, router]);

  return null;
}
