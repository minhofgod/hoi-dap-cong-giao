'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import type { EraGroup, Council } from '@/lib/councilsV2';
import { ERA_LABEL_SHORT } from '@/lib/cong-dong/eras';
import styles from './Rail.module.css';

function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** The timeline rail — fixed to the left gutter on the council profile page, mirroring Giáo Phụ.
 *  All councils are listed by name in era groups; the current one's row is gold. Hovering shows an
 *  image card via a portal (position: fixed, never shifts the rail). Collapses to a dot strip < 900px. */
export function Rail({ groups, current }: { groups: EraGroup[]; current: Council }) {
  const lang = useLang();
  const railRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [hover, setHover] = useState<{ slug: string; top: number } | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    const el = activeRef.current;
    if (rail && el && rail.scrollHeight > rail.clientHeight) {
      rail.scrollTop = el.offsetTop - rail.clientHeight / 2 + el.offsetHeight / 2;
    }
  }, []);

  const all = groups.flatMap((g) => g.items);
  const hoveredItem = hover ? all.find((c) => c.slug === hover.slug) : null;
  const hoveredName = hoveredItem ? (lang === 'en' ? hoveredItem.name.en : hoveredItem.name.vi) : '';

  return (
    <nav
      ref={railRef}
      className={styles.rail}
      aria-label={lang === 'en' ? 'Timeline of the councils' : 'Dòng thời gian các Công đồng'}
      onMouseLeave={() => setHover(null)}
    >
      <div className={styles.groups}>
        {groups.map((g) => {
          const isActiveEra = g.era === current.era;
          const label = lang === 'en' ? ERA_LABEL_SHORT[g.era].en : ERA_LABEL_SHORT[g.era].vi;
          return (
            <div key={g.era} className={styles.group}>
              <span
                className={isActiveEra ? `${styles.groupLabel} ${styles.groupLabelActive}` : styles.groupLabel}
              >
                {label}
              </span>
              <div className={styles.dots}>
                {g.items.map((c) => {
                  const isCurrent = c.slug === current.slug;
                  const name = lang === 'en' ? c.name.en : c.name.vi;
                  return (
                    <Link
                      key={c.slug}
                      ref={isCurrent ? activeRef : undefined}
                      href={`/cong-dong/${c.slug}`}
                      className={styles.dotLink}
                      aria-current={isCurrent ? 'page' : undefined}
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const center = r.top + r.height / 2;
                        setHover({
                          slug: c.slug,
                          top: Math.max(120, Math.min(center, window.innerHeight - 120)),
                        });
                      }}
                    >
                      <span className={cx(styles.dot, isCurrent && styles.dotCurrent)} />
                      <span className={cx(styles.name, isCurrent && styles.nameCurrent)}>{name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {hoveredItem &&
        createPortal(
          <div className={styles.preview} style={{ top: hover!.top }}>
            <span className={styles.previewPortrait}>
              {hoveredItem.image?.available && hoveredItem.image.src ? (
                <Image src={hoveredItem.image.src} alt="" fill sizes="64px" className={styles.previewImg} />
              ) : (
                <span className={styles.previewEmpty} aria-hidden="true" />
              )}
            </span>
            <span className={styles.previewInfo}>
              <span className={styles.previewName}>{hoveredName}</span>
              <span className={styles.previewDates}>{hoveredItem.dates.display}</span>
            </span>
          </div>,
          document.body
        )}
    </nav>
  );
}
