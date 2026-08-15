'use client';

import Image from 'next/image';
import { useBiText } from '@/lib/giao-phu/useLang';
import type { Portrait as PortraitData, Bi } from '@/lib/saintsV2';
import styles from '@/components/giao-phu/Portrait.module.css';

/** The oval portrait for the Saints section. Reuses the Giáo Phụ Portrait frame styling, but its
 *  empty state differs on purpose: the Fathers render "No portrait survives" (true for antiquity),
 *  whereas many saints here are modern and well-photographed — we simply haven't licensed a
 *  public-domain image yet. So `available: false` renders a neutral empty frame with NO caption,
 *  never a misleading claim and never a broken image. */
export function SaintPortrait({
  portrait,
  name,
  size = 'row',
}: {
  portrait: PortraitData;
  name: Bi;
  size?: 'row' | 'frontispiece';
}) {
  const alt = useBiText(name);
  const frameClass = size === 'frontispiece' ? styles.frameFrontispiece : styles.frameRow;

  if (portrait.available && portrait.src) {
    return (
      <span className={frameClass}>
        <Image
          src={portrait.src}
          alt={alt}
          fill
          sizes={size === 'frontispiece' ? '184px' : '56px'}
          className={styles.image}
          style={{ objectPosition: size === 'frontispiece' ? '50% 20%' : '50% 22%' }}
        />
      </span>
    );
  }

  return <span className={`${frameClass} ${styles.empty}`} aria-hidden={size === 'row' ? 'true' : undefined} />;
}
