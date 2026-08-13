'use client';

import Image from 'next/image';
import { useBiText } from '@/lib/giao-phu/useLang';
import type { Portrait as PortraitData } from '@/lib/churchFathersV2';
import type { Bi } from '@/lib/churchFathersV2';
import styles from './Portrait.module.css';

const NO_PORTRAIT_CAPTION: Bi = {
  vi: 'Không có chân dung nào còn lại',
  en: 'No portrait survives',
};

/** The oval portrait treatment shared by the index list rows and the profile frontispiece
 *  (HANDOFF section 6). Renders the empty --tint-warm frame with the "no portrait survives"
 *  caption when `portrait.available` is false — never a substitute image or icon. */
export function Portrait({
  portrait,
  name,
  size = 'row',
}: {
  portrait: PortraitData;
  name: Bi;
  size?: 'row' | 'frontispiece';
}) {
  const alt = useBiText(name);
  const caption = useBiText(NO_PORTRAIT_CAPTION);

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

  return (
    <figure className={styles.emptyWrap}>
      <span className={`${frameClass} ${styles.empty}`} />
      {size === 'frontispiece' && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
