'use client';

import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Figure } from '@/lib/churchFathersV2';
import { Portrait } from './Portrait';
import styles from '../../app/giao-phu/giao-phu.module.css';

/** One row of the index's per-era list card (HANDOFF section 4, item 3).
 *
 *  The meta line under the name is a special case of the bilingual rule: in VI/EN-only modes it
 *  carries only the role (no cross-language leakage — the prototype got this wrong and showed
 *  the English name in VI mode too; HANDOFF section 10 flags exactly this kind of prototype gap
 *  as "known incomplete, not the spec"). In Cả hai it carries the English name paired with the
 *  Vietnamese role on one line, since Cả hai is the one mode where mixing vi/en is intended. */
export function FigureRow({ figure }: { figure: Figure }) {
  const lang = useLang();

  const primaryName = lang === 'en' ? figure.name.en : figure.name.vi;
  const meta =
    lang === 'vi'
      ? figure.role.vi
      : lang === 'en'
        ? figure.role.en
        : `${figure.name.en} · ${figure.role.vi}`;

  return (
    <Link href={`/giao-phu/${figure.slug}`} className={styles.row}>
      <Portrait portrait={figure.portrait} name={figure.name} size="row" />
      <span className={styles.rowText}>
        <span className={styles.rowName}>{primaryName}</span>
        <span className={styles.rowMeta}>{meta}</span>
      </span>
      <span className={styles.rowRight}>
        <span className={styles.rowDates}>{figure.dates.display}</span>
        <span className={styles.rowNo}>{String(figure.no).padStart(2, '0')}</span>
      </span>
    </Link>
  );
}
