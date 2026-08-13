'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import styles from '../app/giai-dap/giai-dap.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export type GiaiDapCard = {
  slug: string;
  questionVi: string;
  category: string;
  subcategory?: string;
  featured: boolean;
  excerpt: string;
};

/** The Giải Đáp index with a live question filter (mirrors the Catechism / Giáo Phụ search).
 *  Keeps the category ("topic") grouping; the featured/anchor question leads each group. */
export function GiaiDapBrowser({ questions }: { questions: GiaiDapCard[] }) {
  const [query, setQuery] = useState('');
  const q = query.trim();

  const groups = useMemo(() => {
    const nq = norm(q);
    const matched = q
      ? questions.filter((x) => norm(`${x.questionVi} ${x.category} ${x.subcategory ?? ''}`).includes(nq))
      : questions;
    const cats = [...new Set(matched.map((x) => x.category))];
    return cats.map((category) => ({
      category,
      items: matched
        .filter((x) => x.category === category)
        .sort((a, b) => Number(b.featured) - Number(a.featured)),
    }));
  }, [q, questions]);

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm câu hỏi…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {groups.length === 0 ? (
        <div className={styles.noResults}>Không tìm thấy câu hỏi nào cho “{q}”.</div>
      ) : (
        <div className={styles.groups}>
          {groups.map((group) => (
            <section key={group.category} className={styles.topicGroup}>
              <div className={styles.topicHeader}>
                <h2 className={styles.topicTitle}>{group.category}</h2>
                <span className={styles.topicCount}>{group.items.length} câu hỏi</span>
              </div>
              <ul className={styles.list}>
                {group.items.map((qq) => (
                  <li key={qq.slug} className={styles.row}>
                    <Link href={`/giai-dap/${qq.slug}`} className={styles.rowLink}>
                      {qq.featured ? (
                        <span className={styles.anchorBadge}>Câu hỏi chính</span>
                      ) : (
                        qq.subcategory && <span className={styles.rowCategory}>{qq.subcategory}</span>
                      )}
                      <span className={styles.rowQuestion}>{qq.questionVi}</span>
                      <span className={styles.rowExcerpt}>{qq.excerpt}…</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
