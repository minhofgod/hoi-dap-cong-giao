'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import type { GroupBlock, Saint } from '@/lib/saintsV2';
import { GROUP_LABEL_SHORT } from '@/lib/saints/groups';
import styles from './SaintsRail.module.css';

function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** The theme rail — fixed to the left gutter on a saint's profile page (mirrors the Giáo Phụ
 *  timeline Rail). All saints are listed by name in their theme groups; the current saint's row is
 *  gold. Hovering a name shows a portrait card, rendered through a portal so it is fixed to the
 *  viewport and never shifts the rail's layout. Hidden below 900px via SaintsRail.module.css. */
export function SaintsRail({ groups, current }: { groups: GroupBlock[]; current: Saint }) {
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
  const hoveredFig = hover ? all.find((s) => s.slug === hover.slug) : null;
  const hoveredName = hoveredFig ? (lang === 'en' ? hoveredFig.name.en : hoveredFig.name.vi) : '';

  return (
    <nav
      ref={railRef}
      className={styles.rail}
      aria-label={lang === 'en' ? 'The saints, by theme' : 'Các thánh, theo chủ đề'}
      onMouseLeave={() => setHover(null)}
    >
      <div className={styles.groups}>
        {groups.map((g) => {
          const isActiveGroup = g.group === current.group;
          const label = lang === 'en' ? GROUP_LABEL_SHORT[g.group].en : GROUP_LABEL_SHORT[g.group].vi;
          return (
            <div key={g.group} className={styles.group}>
              <span
                className={isActiveGroup ? `${styles.groupLabel} ${styles.groupLabelActive}` : styles.groupLabel}
              >
                {label}
              </span>
              <div className={styles.dots}>
                {g.items.map((s) => {
                  const isCurrent = s.slug === current.slug;
                  const name = lang === 'en' ? s.name.en : s.name.vi;
                  return (
                    <Link
                      key={s.slug}
                      ref={isCurrent ? activeRef : undefined}
                      href={`/cac-thanh/${s.slug}`}
                      className={styles.dotLink}
                      aria-current={isCurrent ? 'page' : undefined}
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const center = r.top + r.height / 2;
                        setHover({
                          slug: s.slug,
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

      {hoveredFig &&
        createPortal(
          <div className={styles.preview} style={{ top: hover!.top }}>
            <span className={styles.previewPortrait}>
              {hoveredFig.portrait?.available && hoveredFig.portrait.src ? (
                <Image src={hoveredFig.portrait.src} alt="" fill sizes="64px" className={styles.previewImg} />
              ) : (
                <span className={styles.previewEmpty} aria-hidden="true" />
              )}
            </span>
            <span className={styles.previewInfo}>
              <span className={styles.previewName}>{hoveredName}</span>
              <span className={styles.previewDates}>{hoveredFig.dates.display}</span>
            </span>
          </div>,
          document.body
        )}
    </nav>
  );
}
