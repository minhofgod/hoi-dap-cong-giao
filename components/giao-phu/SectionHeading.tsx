'use client';

import { useLang } from '@/lib/giao-phu/useLang';
import type { Bi } from '@/lib/churchFathersV2';
import styles from './SectionHeading.module.css';

/** "Cuộc đời · Life" style heading: the always-open sections (Life, Major writings) pair their
 *  Vietnamese and English titles inline on one line, the English half recessed to 400 weight and
 *  a quieter tone (HANDOFF section 2: "section heading 600 22px/1.25 Source Serif 4 ('· Life'
 *  half at 400 #A29A91)"). In VI/EN-only modes only that language's word renders — no dot, no
 *  cross-language leakage. */
export function SectionHeading({ vi, en }: Bi) {
  const lang = useLang();

  if (lang === 'vi') return <h2 className={styles.heading}>{vi}</h2>;
  if (lang === 'en') return <h2 className={styles.heading}>{en}</h2>;
  return (
    <h2 className={styles.heading}>
      {vi}
      <span className={styles.sub}> · {en}</span>
    </h2>
  );
}
