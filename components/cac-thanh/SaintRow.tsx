'use client';

import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import { SaintPortrait } from './SaintPortrait';
import type { Saint } from '@/lib/saintsV2';
import styles from '../../app/cac-thanh/cac-thanh.module.css';

/** One row of the index's per-theme list card (mirrors components/giao-phu/FigureRow.tsx).
 *
 *  The meta line follows the same bilingual rule as the Fathers: VI/EN-only modes carry just the
 *  role (no cross-language leakage); Cả hai carries the English name paired with the Vietnamese
 *  role on one line. Reuses the shared oval Portrait (with its available:false fallback). */
export function SaintRow({ saint }: { saint: Saint }) {
  const lang = useLang();

  const primaryName = lang === 'en' ? saint.name.en : saint.name.vi;
  const meta =
    lang === 'vi'
      ? saint.role.vi
      : lang === 'en'
        ? saint.role.en
        : `${saint.name.en} · ${saint.role.vi}`;

  return (
    <Link href={`/cac-thanh/${saint.slug}`} className={styles.row}>
      <SaintPortrait portrait={saint.portrait} name={saint.name} size="row" />
      <span className={styles.rowText}>
        <span className={styles.rowName}>{primaryName}</span>
        <span className={styles.rowMeta}>{meta}</span>
      </span>
      <span className={styles.rowRight}>
        <span className={styles.rowDates}>{saint.dates.display}</span>
        <span className={styles.rowNo}>{String(saint.no).padStart(2, '0')}</span>
      </span>
    </Link>
  );
}
