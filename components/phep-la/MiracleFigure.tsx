'use client';

import Image from 'next/image';
import { useBiText } from '@/lib/giao-phu/useLang';
import { Bi2 } from '@/components/giao-phu/Bi2';
import type { MiracleImage } from '@/lib/miraclesV2';
import styles from './MiracleFigure.module.css';

/** The detail page's lead image, and the index row's thumbnail.
 *
 *  Every image in this section is of a PLACE — a church, a grotto, a bell tower — never of the
 *  contested object. That is a content rule (see the MiracleImage docblock in lib/miraclesV2), and
 *  it is why the caption is a plain descriptive line rather than anything that reads as a claim.
 *
 *  When `available` is false, both render NOTHING rather than an empty frame: a missing wide
 *  photograph reads as a broken layout in a way a missing oval portrait does not. */
export function MiracleFigure({ image }: { image: MiracleImage }) {
  const alt = useBiText(image.caption);
  if (!image.available || !image.src) return null;

  return (
    <figure className={styles.figure}>
      <span className={styles.frame}>
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes="(max-width: 899px) 100vw, 700px"
          className={styles.image}
          style={{ objectPosition: image.objectPosition ?? '50% 50%' }}
          priority
        />
      </span>
      <figcaption>
        <Bi2
          value={image.caption}
          as="span"
          viClassName={styles.caption}
          enClassName={styles.caption}
          enRecessedClassName={styles.captionEnRecessed}
        />
      </figcaption>
    </figure>
  );
}

/** Row thumbnail for the index. Decorative — the row's own text carries the meaning — so it is
 *  hidden from assistive tech rather than repeating the title as alt text. */
export function MiracleThumb({ image }: { image: MiracleImage }) {
  if (!image.available || !image.src) return <span className={styles.thumbEmpty} aria-hidden="true" />;

  return (
    <span className={styles.thumb} aria-hidden="true">
      <Image
        src={image.src}
        alt=""
        fill
        sizes="96px"
        className={styles.image}
        style={{ objectPosition: image.objectPosition ?? '50% 50%' }}
      />
    </span>
  );
}
