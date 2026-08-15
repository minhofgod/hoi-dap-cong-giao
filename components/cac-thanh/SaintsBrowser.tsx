'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { SaintRow } from './SaintRow';
import type { GroupBlock } from '@/lib/saintsV2';
import styles from '../../app/cac-thanh/cac-thanh.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** The Các Thánh index list with a live name filter (mirrors the Giáo Phụ browser). Filtering
 *  keeps the theme grouping — groups with no match are dropped. The Vietnamese Martyrs group leads
 *  with a prominent card linking to its overview page (the 117 + Bl. Anrê Phú Yên). */
export function SaintsBrowser({ groups }: { groups: GroupBlock[] }) {
  const uiLang = useLang();
  const [query, setQuery] = useState('');
  const q = query.trim();

  const filtered = useMemo(() => {
    if (!q) return groups;
    const nq = norm(q);
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((s) =>
          norm(`${s.name.vi} ${s.name.en} ${s.role.vi} ${s.role.en} ${s.no}`).includes(nq)
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
          placeholder={uiLang === 'en' ? 'Search saints by name…' : 'Tìm các thánh theo tên…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.noResults}>
          {uiLang === 'en' ? `No saints found for “${q}”.` : `Không tìm thấy vị thánh nào cho “${q}”.`}
        </div>
      ) : (
        filtered.map((g) => (
          <div key={g.group} className={styles.eraBlock}>
            <div className={styles.eraBand}>
              <div>
                <Bi2 value={g.kicker} as="div" className={styles.eraSpan} enRecessedClassName={styles.eraSpanEnRecessed} />
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

            {g.group === 'martyrs-vn' && !q && (
              <Link href="/cac-thanh/tu-dao-viet-nam" className={styles.overviewCard}>
                <span className={styles.overviewText}>
                  <Bi2
                    value={{ vi: 'Tổng quan', en: 'Overview' }}
                    as="span"
                    className={styles.overviewKicker}
                    enRecessedClassName={styles.overviewKickerEnRecessed}
                  />
                  <Bi2
                    value={{
                      vi: '117 vị Thánh Tử Đạo Việt Nam — và Á Thánh Anrê Phú Yên',
                      en: 'The 117 Martyrs of Vietnam — and Bl. Anrê Phú Yên',
                    }}
                    as="span"
                    className={styles.overviewTitle}
                    enRecessedClassName={styles.overviewTitleEnRecessed}
                  />
                  <Bi2
                    value={{
                      vi: 'Ba thế kỷ bách hại, hàng trăm ngàn chứng nhân, và cuộc tuyên thánh năm 1988. Bắt đầu từ bức tranh lớn trước khi gặp từng vị.',
                      en: 'Three centuries of persecution, hundreds of thousands of witnesses, and the 1988 canonization. Start with the whole picture before meeting each one.',
                    }}
                    as="span"
                    viClassName={styles.overviewBody}
                    enClassName={styles.overviewBody}
                    enRecessedClassName={styles.overviewBodyEnRecessed}
                  />
                </span>
                <span className={styles.overviewArrow} aria-hidden="true">→</span>
              </Link>
            )}

            <div className={styles.listCard}>
              {g.items.map((s) => (
                <SaintRow key={s.slug} saint={s} />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );
}
