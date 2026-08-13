'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useLang } from '@/lib/giao-phu/useLang';
import type { EraGroup, Figure } from '@/lib/churchFathersV2';
import { ERA_LABEL_SHORT } from '@/lib/giao-phu/eras';
import styles from './Rail.module.css';

function cx(...parts: (string | undefined | false)[]): string {
  return parts.filter(Boolean).join(' ');
}

/** The timeline rail — fixed to the left gutter on the profile page (HANDOFF section 5).
 *  All thirty Fathers are listed by name in four era groups; the current figure's row is gold.
 *  Hovering a name shows a portrait card, rendered through a portal so it is `position: fixed`
 *  relative to the viewport — it never shifts the rail's layout (which is what caused the old
 *  hover flicker) and never triggers the rail's scrollbar. Collapses to a horizontal dot strip
 *  (names hidden, no card) under 900px via Rail.module.css. */
export function Rail({ groups, current }: { groups: EraGroup[]; current: Figure }) {
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
  const hoveredFig = hover ? all.find((f) => f.slug === hover.slug) : null;
  const hoveredName = hoveredFig ? (lang === 'en' ? hoveredFig.name.en : hoveredFig.name.vi) : '';

  return (
    <nav
      ref={railRef}
      className={styles.rail}
      aria-label={lang === 'en' ? 'Timeline of Church Fathers' : 'Dòng thời gian Giáo Phụ'}
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
                {g.items.map((f) => {
                  const isCurrent = f.slug === current.slug;
                  const name = lang === 'en' ? f.name.en : f.name.vi;
                  return (
                    <Link
                      key={f.slug}
                      ref={isCurrent ? activeRef : undefined}
                      href={`/giao-phu/${f.slug}`}
                      className={styles.dotLink}
                      aria-current={isCurrent ? 'page' : undefined}
                      onMouseEnter={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const center = r.top + r.height / 2;
                        setHover({
                          slug: f.slug,
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
