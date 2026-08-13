'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import type { ResolvedCatechism } from '@/lib/content';
import { ReferencePopover } from './ReferencePopover';
import styles from './CatechismRef.module.css';

function CatechismPopover({
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

/**
 * A Catechism (Giáo Lý) reference. Opens a popover with the paragraph text instead of
 * navigating to the full reader page. Falls back to a plain link when the paragraph isn't found.
 *
 * `data` is resolved server-side (see lib/content.ts resolveCatechism) and passed as a prop, so
 * the whole Catechism isn't bundled into the client. Unlike Scripture, the Catechism text is
 * already shown publicly in the reader, so there's no licensing gate here.
 */
export function CatechismRef({
  number,
  data,
  className,
}: {
  number: number;
  data: ResolvedCatechism | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    anchorEl?.focus();
  }, [anchorEl]);

  if (!data) {
    return (
      <Link href={`/giao-ly/${number}#${number}`} className={`${styles.chip} ${className ?? ''}`}>
        § {number}
      </Link>
    );
  }

  return (
    <span className={styles.anchor}>
      <button
        ref={setAnchorEl}
        type="button"
        className={`${styles.chip} ${className ?? ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        § {number}
      </button>
      {open && <CatechismPopover data={data} anchor={anchorEl} onClose={close} />}
    </span>
  );
}
