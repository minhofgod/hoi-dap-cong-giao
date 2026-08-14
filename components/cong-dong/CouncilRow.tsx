'use client';

import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Council } from '@/lib/councilsV2';
import { Portrait } from '@/components/giao-phu/Portrait';
import styles from '../../app/cong-dong/cong-dong.module.css';

/** One row of the index's per-era list card — mirrors Giáo Phụ's FigureRow. */
export function CouncilRow({ council }: { council: Council }) {
  const lang = useLang();

  const primaryName = lang === 'en' ? council.name.en : council.name.vi;
  const meta =
    lang === 'vi'
      ? council.subtitle.vi
      : lang === 'en'
        ? council.subtitle.en
        : `${council.name.en} · ${council.subtitle.vi}`;

  return (
    <Link href={`/cong-dong/${council.slug}`} className={styles.row}>
      <Portrait portrait={council.image} name={council.name} size="row" />
      <span className={styles.rowText}>
        <span className={styles.rowName}>{primaryName}</span>
        <span className={styles.rowMeta}>{meta}</span>
      </span>
      <span className={styles.rowRight}>
        <span className={styles.rowDates}>{council.dates.display}</span>
        <span className={styles.rowNo}>{String(council.no).padStart(2, '0')}</span>
      </span>
    </Link>
  );
}
