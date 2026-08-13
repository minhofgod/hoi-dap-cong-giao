'use client';

import { useEffect, useRef } from 'react';
import { setMaxParagraphReached } from './ReadingProgress';

export function ProgressTracker({ paragraphIds }: { paragraphIds: number[] }) {
  const throttleRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (throttleRef.current) return;
      throttleRef.current = window.setTimeout(() => {
        throttleRef.current = null;
        let furthest = 0;
        for (const id of paragraphIds) {
          const el = document.getElementById(String(id));
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.75) {
            furthest = id;
          }
        }
        if (furthest > 0) setMaxParagraphReached(furthest);
      }, 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (throttleRef.current) window.clearTimeout(throttleRef.current);
    };
  }, [paragraphIds]);

  return null;
}
