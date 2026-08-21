'use client';

import { Bookmark, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Paragraph } from '@/lib/types';
import { ShareButton } from './ShareButton';
import { T } from './T';
import styles from './ReaderRightRail.module.css';

const SAVED_KEY = 'hdcg.saved.giao-ly';

export function ReaderRightRail({ paragraphs, articleTitle }: { paragraphs: Paragraph[]; articleTitle: string }) {
  const uiLang = useLang();
  const [activeId, setActiveId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]');
      // Read saved-state from localStorage after mount (browser-only; deferred to keep SSR/hydration in sync).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(stored.includes(articleTitle));
    } catch {
      // ignore
    }

    const onHashChange = () => {
      const id = Number(window.location.hash.replace('#', ''));
      if (id) setActiveId(id);
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [articleTitle]);

  const toggleSaved = () => {
    try {
      const stored: string[] = JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? '[]');
      const next = saved ? stored.filter((s) => s !== articleTitle) : [...stored, articleTitle];
      window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSaved(!saved);
    } catch {
      // ignore
    }
  };

  return (
    <aside className={styles.rail}>
      <div className={styles.section}>
        <div className={styles.eyebrow}>
          <T vi="Trong bài này" en="In this article" />
        </div>
        <ul className={styles.paraList}>
          {paragraphs.map((p) => (
            <li key={p.id}>
              <a
                href={`#${p.id}`}
                className={p.id === activeId ? `${styles.paraLink} ${styles.paraLinkActive}` : styles.paraLink}
              >
                <span className={styles.paraLinkNumber}>§{p.id}</span> {p.vi.slice(0, 40)}…
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.divider} />

      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} onClick={toggleSaved}>
          <Bookmark size={15} strokeWidth={2.4} fill={saved ? 'var(--accent)' : 'none'} />
          {uiLang === 'en' ? (saved ? 'Saved' : 'Save') : saved ? 'Đã lưu' : 'Lưu bài này'}
        </button>
        <ShareButton title={articleTitle} className={styles.actionButton} />
        <button type="button" className={styles.actionButton} onClick={() => window.print()}>
          <Printer size={15} strokeWidth={2.4} />
          <T vi="In / PDF" en="Print / PDF" />
        </button>
      </div>

      <div className={styles.shortcuts}>
        <T
          vi={
            <>
              Phím tắt: <strong>J</strong> / <strong>K</strong> chuyển đoạn · <strong>G</strong> nhảy tới
              số · <strong>/</strong> tìm kiếm
            </>
          }
          en={
            <>
              Shortcuts: <strong>J</strong> / <strong>K</strong> paragraph · <strong>G</strong> jump to
              § · <strong>/</strong> search
            </>
          }
        />
      </div>
    </aside>
  );
}
