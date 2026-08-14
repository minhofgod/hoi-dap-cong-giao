'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { CouncilRow } from './CouncilRow';
import type { EraGroup } from '@/lib/councilsV2';
import styles from '../../app/cong-dong/cong-dong.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** The councils index list with a live name filter — mirrors Giáo Phụ's FathersBrowser.
 *  Filtering keeps the era grouping; eras with no match are dropped. */
export function CouncilsBrowser({ groups }: { groups: EraGroup[] }) {
  const uiLang = useLang();
  const [query, setQuery] = useState('');
  const q = query.trim();

  const filtered = useMemo(() => {
    // Hide era bands with no councils yet (the section is filled in over time).
    if (!q) return groups.filter((g) => g.items.length > 0);
    const nq = norm(q);
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((c) =>
          norm(`${c.name.vi} ${c.name.en} ${c.subtitle.vi} ${c.subtitle.en} ${c.no}`).includes(nq)
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
          placeholder={uiLang === 'en' ? 'Search councils by name…' : 'Tìm công đồng theo tên…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.noResults}>
          {uiLang === 'en' ? `No councils found for “${q}”.` : `Không tìm thấy công đồng nào cho “${q}”.`}
        </div>
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
                    vi: `${g.items.length} công đồng`,
                    en: `${g.items.length} council${g.items.length === 1 ? '' : 's'}`,
                  }}
                  as="div"
                  className={styles.eraCount}
                  enRecessedClassName={styles.eraCountEnRecessed}
                />
              </div>
            </div>
            <div className={styles.listCard}>
              {g.items.map((c) => (
                <CouncilRow key={c.slug} council={c} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
