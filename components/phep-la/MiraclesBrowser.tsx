'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { MiracleRow } from './MiracleRow';
import type { TypeBlock } from '@/lib/miraclesV2';
import styles from '../../app/phep-la/phep-la.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** The Phép Lạ index, grouped by kind of event, with a live filter over title/place/date
 *  (mirrors the Saints browser). Types with no match are dropped. */
export function MiraclesBrowser({ blocks }: { blocks: TypeBlock[] }) {
  const uiLang = useLang();
  const [query, setQuery] = useState('');
  const q = query.trim();

  const filtered = useMemo(() => {
    if (!q) return blocks;
    const nq = norm(q);
    return blocks
      .map((b) => ({
        ...b,
        items: b.items.filter((m) =>
          norm(
            `${m.title.vi} ${m.title.en} ${m.location.vi} ${m.location.en} ${m.date.display}`
          ).includes(nq)
        ),
      }))
      .filter((b) => b.items.length > 0);
  }, [q, blocks]);

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder={
            uiLang === 'en' ? 'Search by name or place…' : 'Tìm theo tên hoặc nơi chốn…'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.noResults}>
          {uiLang === 'en'
            ? `Nothing found for “${q}”.`
            : `Không tìm thấy kết quả nào cho “${q}”.`}
        </div>
      ) : (
        filtered.map((b) => (
          <div key={b.type} className={styles.typeBlock}>
            <div className={styles.typeBand}>
              <div>
                <Bi2
                  value={b.kicker}
                  as="div"
                  className={styles.typeKicker}
                  enRecessedClassName={styles.typeKickerEnRecessed}
                />
                <Bi2
                  value={b.label}
                  as="div"
                  enAs="div"
                  viClassName={styles.typeName}
                  enClassName={styles.typeName}
                  enRecessedClassName={styles.typeNameEnRecessed}
                />
              </div>
              <div>
                <Bi2
                  value={b.blurb}
                  as="p"
                  viClassName={styles.typeBlurbVi}
                  enClassName={styles.typeBlurbEn}
                  enRecessedClassName={styles.typeBlurbEnRecessed}
                />
                <Bi2
                  value={{
                    vi: `${b.items.length} trường hợp`,
                    en: `${b.items.length} case${b.items.length === 1 ? '' : 's'}`,
                  }}
                  as="div"
                  className={styles.typeCount}
                  enRecessedClassName={styles.typeCountEnRecessed}
                />
              </div>
            </div>

            <div className={styles.listCard}>
              {b.items.map((m) => (
                <MiracleRow key={m.slug} miracle={m} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
