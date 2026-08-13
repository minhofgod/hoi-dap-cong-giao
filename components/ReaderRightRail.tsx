'use client';

import { Bookmark, Printer, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Paragraph } from '@/lib/types';
import styles from './ReaderRightRail.module.css';

const SAVED_KEY = 'hdcg.saved.giao-ly';

export function ReaderRightRail({ paragraphs, articleTitle }: { paragraphs: Paragraph[]; articleTitle: string }) {
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

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: articleTitle, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <aside className={styles.rail}>
      <div className={styles.section}>
        <div className={styles.eyebrow}>Trong bài này</div>
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
          {saved ? 'Đã lưu' : 'Lưu bài này'}
        </button>
        <button type="button" className={styles.actionButton} onClick={share}>
          <Share2 size={15} strokeWidth={2.4} />
          Chia sẻ
        </button>
        <button type="button" className={styles.actionButton} onClick={() => window.print()}>
          <Printer size={15} strokeWidth={2.4} />
          In / PDF
        </button>
      </div>

      <div className={styles.shortcuts}>
        Phím tắt: <strong>J</strong> / <strong>K</strong> chuyển đoạn · <strong>G</strong> nhảy tới số ·{' '}
        <strong>/</strong> tìm kiếm
      </div>
    </aside>
  );
}
