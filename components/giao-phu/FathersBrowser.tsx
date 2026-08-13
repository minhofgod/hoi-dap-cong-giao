'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Bi2 } from './Bi2';
import { FigureRow } from './FigureRow';
import type { EraGroup } from '@/lib/churchFathersV2';
import styles from '../../app/giao-phu/giao-phu.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** The Giáo Phụ index list with a live name filter (mirrors the Catechism browser's search).
 *  Filtering keeps the era grouping — eras with no match are dropped. */
export function FathersBrowser({ groups }: { groups: EraGroup[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim();

  const filtered = useMemo(() => {
    if (!q) return groups;
    const nq = norm(q);
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((f) =>
          norm(`${f.name.vi} ${f.name.en} ${f.role.vi} ${f.role.en} ${f.no}`).includes(nq)
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [q, groups]);

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm Giáo Phụ theo tên…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.noResults}>Không tìm thấy Giáo Phụ nào cho “{q}”.</div>
      ) : (
        filtered.map((g) => (
          <div key={g.era} className={styles.eraBlock}>
            <div className={styles.eraBand}>
              <div>
                <div className={styles.eraSpan}>{g.span}</div>
                <Bi2
                  value={g.label}
                  as="div"
                  enAs="div"
                  viClassName={styles.eraName}
                  enClassName={styles.eraName}
                  enRecessedClassName={styles.eraNameEnRecessed}
                />
              </div>
              <div>
                <Bi2
                  value={g.blurb}
                  as="p"
                  viClassName={styles.eraBlurbVi}
                  enClassName={styles.eraBlurbEn}
                  enRecessedClassName={styles.eraBlurbEnRecessed}
                />
                <Bi2
                  value={{
                    vi: `${g.items.length} vị`,
                    en: `${g.items.length} figure${g.items.length === 1 ? '' : 's'}`,
                  }}
                  as="div"
                  className={styles.eraCount}
                  enRecessedClassName={styles.eraCountEnRecessed}
                />
              </div>
            </div>
            <div className={styles.listCard}>
              {g.items.map((f) => (
                <FigureRow key={f.slug} figure={f} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
