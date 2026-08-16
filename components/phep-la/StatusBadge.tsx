'use client';

import { useLang } from '@/lib/giao-phu/useLang';
import { STATUS_LABEL, type RecognitionStatus } from '@/lib/miracles/types';
import styles from './StatusBadge.module.css';

const TONE: Record<RecognitionStatus, string> = {
  approved: styles.approved,
  venerated: styles.venerated,
  'not-ruled': styles.notRuled,
  'cure-approved': styles.approved,
};

/** The recognition badge — the one piece of metadata this section must never let a reader miss.
 *  It states the CANONICAL act on record, not how convincing the case looks. `not-ruled` is
 *  deliberately styled as a plain outline rather than anything that reads as an endorsement, so a
 *  case the Church has never judged (La Vang) can sit beside an approved one without borrowing its
 *  authority. Rendered on every index row and at the top of every detail page. */
export function StatusBadge({
  status,
  size = 'row',
}: {
  status: RecognitionStatus;
  size?: 'row' | 'detail';
}) {
  const lang = useLang();
  const label = STATUS_LABEL[status];
  const text = lang === 'en' ? label.en : label.vi;
  const sizeClass = size === 'detail' ? styles.detail : styles.row;

  return <span className={`${styles.badge} ${sizeClass} ${TONE[status]}`}>{text}</span>;
}
