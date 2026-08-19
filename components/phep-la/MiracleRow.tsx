'use client';

import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import { StatusBadge } from './StatusBadge';
import { MiracleThumb } from './MiracleFigure';
import type { Miracle } from '@/lib/miraclesV2';
import styles from '../../app/phep-la/phep-la.module.css';

/** One row of a type's list card (mirrors components/cac-thanh/SaintRow.tsx). Where the Saints row
 *  carries a portrait, this one carries the recognition badge — the reader should be able to tell
 *  "the Church ruled on this" from "the Church never ruled on this" without opening the entry. */
export function MiracleRow({ miracle }: { miracle: Miracle }) {
  const lang = useLang();

  const title = lang === 'en' ? miracle.title.en : miracle.title.vi;
  const place =
    lang === 'vi'
      ? miracle.location.vi
      : lang === 'en'
        ? miracle.location.en
        : `${miracle.location.vi} · ${miracle.title.en}`;

  return (
    <Link href={`/phep-la/${miracle.slug}`} className={styles.row}>
      <MiracleThumb image={miracle.image} />
      <span className={styles.rowText}>
        <span className={styles.rowName}>{title}</span>
        <span className={styles.rowMeta}>{place}</span>
      </span>
      <span className={styles.rowRight}>
        <StatusBadge status={miracle.status} />
        <span className={styles.rowDates}>{miracle.date.display}</span>
      </span>
    </Link>
  );
}
