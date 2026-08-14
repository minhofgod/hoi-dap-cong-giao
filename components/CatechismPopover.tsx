'use client';

import Link from 'next/link';
import type { ResolvedCatechism } from '@/lib/content';
import { ReferencePopover } from './ReferencePopover';
import styles from './CatechismRef.module.css';

/** The Catechism (Giáo Lý) reference popover: paragraph text + a link into the reader. Shared by
 *  the <CatechismRef> chip and the inline `data-ccc` references enriched into prose bodies. */
export function CatechismPopover({
  data,
  anchor,
  onClose,
}: {
  data: ResolvedCatechism;
  anchor: HTMLElement | null;
  onClose: () => void;
}) {
  return (
    <ReferencePopover
      label={`§ ${data.id}`}
      translation="GLHTCG"
      labelTone="var(--accent-deep)"
      anchor={anchor}
      onClose={onClose}
    >
      <div className={styles.para}>
        <span className="bi-vi">{data.vi}</span>
        <span className="bi-en">{data.en}</span>
      </div>
      <div className={styles.footer}>
        <Link href={data.href} className={styles.footerLink} onClick={onClose}>
          Mở trong Giáo Lý →
        </Link>
      </div>
    </ReferencePopover>
  );
}
