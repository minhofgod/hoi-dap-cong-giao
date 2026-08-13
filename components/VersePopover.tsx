'use client';

import { useState } from 'react';
import type { ResolvedReference, ResolvedVerse } from '@/lib/bibleRefs';
import { ReferencePopover } from './ReferencePopover';
import styles from './ScriptureRef.module.css';

function verseRangeLabel(start: number, end: number): string {
  return end > start ? `${start}–${end}` : `${start}`;
}

function Verses({ verses }: { verses: ResolvedVerse[] }) {
  return (
    <p className={styles.verses}>
      {verses.map((v) => (
        <span key={v.n}>
          <sup className={styles.vnum}>{v.n}</sup>
          {v.text}{' '}
        </span>
      ))}
    </p>
  );
}

/**
 * The Scripture verse card: label + verse text, with a "Xem thêm ngữ cảnh" expander that swaps
 * in the surrounding verses in place. Positioning/close/portal live in ReferencePopover.
 */
export function VersePopover({
  data,
  anchor,
  onClose,
}: {
  data: ResolvedReference;
  anchor: HTMLElement | null;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? data.contextVerses : data.verses;
  const label = `${data.bookVi} ${data.chapter},${verseRangeLabel(data.verseStart, data.verseEnd)}`;

  return (
    <ReferencePopover label={label} translation={data.translation} anchor={anchor} onClose={onClose}>
      <Verses verses={shown} />
      <div className={styles.footer}>
        <button type="button" className={styles.more} onClick={() => setExpanded((x) => !x)}>
          {expanded ? 'Thu gọn' : 'Xem thêm ngữ cảnh'}
        </button>
        <span className={styles.contextLabel}>{data.context}</span>
      </div>
    </ReferencePopover>
  );
}
