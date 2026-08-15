'use client';

import Link from 'next/link';
import { Landmark, UserRound } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { BAND_SPAN_EN, type TimelineBand } from '@/lib/lich-su-hoi-thanh/bands';
import styles from '../../app/lich-su-hoi-thanh/lich-su-hoi-thanh.module.css';

function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** One shared, interleaved timeline of Church Fathers + Ecumenical Councils, grouped into the hub's
 *  unified early/medieval/modern bands. Each item is a marker linking to its detail page; Fathers
 *  and Councils are colour- and icon-coded (see the legend in the page hero). */
export function HistoryTimeline({ bands }: { bands: TimelineBand[] }) {
  const lang = useLang();

  return (
    <div className={styles.timeline}>
      {bands.map((band) => {
        const fathers = band.items.filter((i) => i.kind === 'father').length;
        const councils = band.items.filter((i) => i.kind === 'council').length;
        const span = lang === 'en' ? BAND_SPAN_EN[band.id] : band.span;
        return (
          <section key={band.id} className={styles.band}>
            <div className={styles.bandHeader}>
              <div>
                <div className={styles.bandSpan}>{span}</div>
                <Bi2
                  value={band.label}
                  as="h2"
                  enAs="h2"
                  viClassName={styles.bandName}
                  enClassName={styles.bandName}
                  enRecessedClassName={styles.bandNameEnRecessed}
                />
              </div>
              <div>
                <Bi2
                  value={band.blurb}
                  as="p"
                  viClassName={styles.bandBlurbVi}
                  enClassName={styles.bandBlurbEn}
                  enRecessedClassName={styles.bandBlurbEnRecessed}
                />
                <div className={styles.bandCounts}>
                  {fathers > 0 && (
                    <span className={cx(styles.bandCount, styles.bandCountFather)}>
                      <UserRound size={13} strokeWidth={2.4} aria-hidden="true" />
                      <Bi2
                        value={{
                          vi: `${fathers} Giáo Phụ`,
                          en: `${fathers} Father${fathers === 1 ? '' : 's'}`,
                        }}
                        as="span"
                      />
                    </span>
                  )}
                  {councils > 0 && (
                    <span className={cx(styles.bandCount, styles.bandCountCouncil)}>
                      <Landmark size={13} strokeWidth={2.4} aria-hidden="true" />
                      <Bi2
                        value={{
                          vi: `${councils} Công Đồng`,
                          en: `${councils} Council${councils === 1 ? '' : 's'}`,
                        }}
                        as="span"
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>

            <ol className={styles.track}>
              {band.items.map((item) => {
                const primaryName = lang === 'en' ? item.name.en : item.name.vi;
                const meta =
                  lang === 'vi'
                    ? item.meta.vi
                    : lang === 'en'
                      ? item.meta.en
                      : `${item.name.en} · ${item.meta.vi}`;
                const isFather = item.kind === 'father';
                const kindLabel = isFather
                  ? lang === 'en'
                    ? 'Church Father'
                    : 'Giáo Phụ'
                  : lang === 'en'
                    ? 'Ecumenical Council'
                    : 'Công Đồng';
                return (
                  <li key={`${item.kind}-${item.slug}`} className={styles.item}>
                    <Link
                      href={item.href}
                      className={cx(styles.itemLink, isFather ? styles.itemFather : styles.itemCouncil)}
                    >
                      <span className={styles.marker} aria-hidden="true">
                        {isFather ? (
                          <UserRound size={17} strokeWidth={2.2} />
                        ) : (
                          <Landmark size={17} strokeWidth={2.2} />
                        )}
                      </span>
                      <span className={styles.itemBody}>
                        <span className={styles.itemName}>
                          {primaryName}
                          <span className={styles.srKind}> ({kindLabel})</span>
                        </span>
                        <span className={styles.itemMeta}>{meta}</span>
                      </span>
                      <span className={styles.itemDates}>{item.dates}</span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
