'use client';

import { useEffect, useState } from 'react';
import { T } from './T';
import styles from '../app/giai-dap/[slug]/answer.module.css';

export type TocSection = { id: string; vi: string; en: string };

/**
 * The "Trong bài này" side nav on a topic (anchor) page, with scrollspy: as the reader scrolls, the
 * entry for the section currently in view is highlighted. Client-only behavior (IntersectionObserver);
 * renders the full nav server-side too, so it works — just without the live highlight — before hydration.
 */
export function ArticleToc({ sections }: { sections: TocSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? '');

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // A section counts as "current" while it overlaps a thin band near the top of the viewport
    // (top inset 15%, bottom inset 70%). When several overlap mid-scroll, the topmost in document
    // order wins, so the highlight advances as each heading reaches the band.
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = sections.find((s) => visible.has(s.id));
        if (current) setActive(current.id);
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      <div className={styles.tocLabel}>
        <T vi="Trong bài này" en="In this article" />
      </div>
      <nav className={styles.tocNav}>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? 'true' : undefined}
            className={`${styles.tocLink} ${active === s.id ? styles.tocLinkActive : ''}`}
          >
            <T vi={s.vi} en={s.en} />
          </a>
        ))}
      </nav>
    </>
  );
}
