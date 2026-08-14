'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { CATEGORIES, TAGS, categoryLabel } from '@/lib/giaiDapTaxonomy';
import { T } from './T';
import styles from '../app/giai-dap/giai-dap.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export type GiaiDapCard = {
  slug: string;
  questionVi: string;
  questionEn?: string;
  topic: string;
  category?: string;
  tags: string[];
  subcategory?: string;
  featured: boolean;
  excerpt: string;
};

// A council apologetics Q&A, surfaced alongside the native questions (links to its own Q&A page).
export type CouncilQACard = {
  id: string;
  questionVi: string;
  questionEn: string;
  councilVi: string;
  councilEn: string;
  href: string;
};

type Topic = { topic: string; anchor: GiaiDapCard; count: number };

/** Giải Đáp index: one card per topic (cluster), led by that topic's anchor question and its
 *  sacred-art image — mirroring the Catechism topic grid. Above the grid, filter chips narrow by
 *  broad category and by tag (both from the taxonomy). Searching also surfaces matching individual
 *  questions (native + from the Councils), in both languages. */
export function GiaiDapBrowser({
  questions,
  councilQuestions,
}: {
  questions: GiaiDapCard[];
  councilQuestions: CouncilQACard[];
}) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const uiLang = useLang();
  const q = query.trim();
  const nq = norm(q);
  const en = uiLang === 'en';

  // Only offer filters that actually occur in the content — so nothing shows until the .md files
  // carry categories/tags, and the vocabulary stays authored in one place (the taxonomy lists).
  const availableCats = useMemo(() => {
    const present = new Set(questions.map((x) => x.category).filter(Boolean) as string[]);
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [questions]);

  const availableTags = useMemo(() => {
    const present = new Set(questions.flatMap((x) => x.tags));
    return TAGS.filter((t) => present.has(t.id));
  }, [questions]);

  const toggleTag = (id: string) =>
    setActiveTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const filtersActive = activeCat !== null || activeTags.length > 0;

  // Category + tag filters narrow the pool of questions; the topic grid and question matches both
  // derive from the narrowed pool. A question must match the active category (if any) AND carry
  // every active tag.
  const pool = useMemo(
    () =>
      questions.filter(
        (x) =>
          (activeCat === null || x.category === activeCat) &&
          activeTags.every((t) => x.tags.includes(t))
      ),
    [questions, activeCat, activeTags]
  );

  const topics = useMemo<Topic[]>(() => {
    const names = [...new Set(pool.map((x) => x.topic))];
    return names.map((topic) => {
      const items = pool.filter((x) => x.topic === topic);
      const anchor = items.find((x) => x.featured) ?? items[0];
      return { topic, anchor, count: items.length };
    });
  }, [pool]);

  const filteredTopics = useMemo(
    () =>
      q
        ? topics.filter((t) =>
            norm(`${t.topic} ${t.anchor.questionVi} ${t.anchor.questionEn ?? ''}`).includes(nq)
          )
        : topics,
    [q, nq, topics]
  );

  const questionMatches = useMemo(
    () =>
      q
        ? pool.filter((x) =>
            norm(`${x.questionVi} ${x.questionEn ?? ''} ${x.topic} ${x.subcategory ?? ''}`).includes(nq)
          )
        : [],
    [q, nq, pool]
  );

  // Council Q&As have no taxonomy yet, so any active category/tag filter excludes them.
  const councilMatches = useMemo(
    () =>
      q && !filtersActive
        ? councilQuestions.filter((x) =>
            norm(`${x.questionVi} ${x.questionEn} ${x.councilVi} ${x.councilEn}`).includes(nq)
          )
        : [],
    [q, nq, councilQuestions, filtersActive]
  );

  const searching = q.length > 0;
  const noResults =
    (searching || filtersActive) &&
    filteredTopics.length === 0 &&
    questionMatches.length === 0 &&
    councilMatches.length === 0;

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder={en ? 'Search questions or topics…' : 'Tìm câu hỏi hoặc chủ đề…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {(availableCats.length > 0 || availableTags.length > 0) && (
        <div className={styles.filters}>
          {availableCats.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>
                <T vi="Chủ đề lớn" en="Category" />
              </span>
              <div className={styles.filterChips}>
                <button
                  type="button"
                  className={`${styles.filterChip} ${activeCat === null ? styles.filterChipActive : ''}`}
                  onClick={() => setActiveCat(null)}
                >
                  <T vi="Tất cả" en="All" />
                </button>
                {availableCats.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={activeCat === c.id}
                    className={`${styles.filterChip} ${activeCat === c.id ? styles.filterChipActive : ''}`}
                    onClick={() => setActiveCat((prev) => (prev === c.id ? null : c.id))}
                  >
                    {en ? c.en : c.vi}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableTags.length > 0 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>
                <T vi="Nhãn" en="Tags" />
              </span>
              <div className={styles.filterChips}>
                {availableTags.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-pressed={activeTags.includes(t.id)}
                    className={`${styles.filterChip} ${styles.tagChip} ${
                      activeTags.includes(t.id) ? styles.filterChipActive : ''
                    }`}
                    onClick={() => toggleTag(t.id)}
                  >
                    {en ? t.en : t.vi}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(!searching || filteredTopics.length > 0) && (
        <section className={styles.section}>
          {searching && (
            <div className={styles.sectionLabel}>
              <T vi="Chủ đề" en="Topics" />
            </div>
          )}
          <div className={styles.grid}>
            {filteredTopics.map((t) => (
              <Link key={t.topic} href={`/giai-dap/${t.anchor.slug}`} className={styles.card}>
                <span className={styles.banner}>
                  <Image
                    src={`/images/giai-dap/${t.anchor.slug}.jpg`}
                    alt={t.topic}
                    fill
                    sizes="(max-width: 640px) 100vw, 420px"
                    className={styles.bannerImg}
                  />
                </span>
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{t.topic}</div>
                  <div className={styles.cardDesc}>
                    {en && t.anchor.questionEn ? t.anchor.questionEn : t.anchor.questionVi}
                  </div>
                  <div className={styles.cardCount}>
                    <T vi={`${t.count} câu hỏi`} en={`${t.count} questions`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {questionMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <T vi="Câu hỏi" en="Questions" />
          </div>
          <div className={styles.results}>
            {questionMatches.map((x) => (
              <Link key={x.slug} href={`/giai-dap/${x.slug}`} className={styles.resultRow}>
                <span className={styles.resultQuestion}>
                  {en && x.questionEn ? x.questionEn : x.questionVi}
                </span>
                <span className={styles.resultTopic}>
                  {en && x.category ? categoryLabel(x.category).en : x.topic}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {councilMatches.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <T vi="Công Đồng · Vấn đáp" en="Councils · Q&amp;A" />
          </div>
          <div className={styles.results}>
            {councilMatches.map((x) => (
              <Link key={x.id} href={x.href} className={styles.resultRow}>
                <span className={styles.resultQuestion}>{en ? x.questionEn : x.questionVi}</span>
                <span className={styles.resultTopic}>{en ? x.councilEn : x.councilVi}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Not searching or filtering: the Councils Q&A list sits below the topic grid. */}
      {!searching && !filtersActive && councilQuestions.length > 0 && (
        <section className={styles.councilSection}>
          <div className={styles.councilLabel}>
            <T vi="Từ các Công Đồng" en="From the Councils" />
          </div>
          <ul className={styles.councilList}>
            {councilQuestions.map((x) => (
              <li key={x.id}>
                <Link href={x.href} className={styles.councilRow}>
                  <span className={styles.councilRowQ}>{en ? x.questionEn : x.questionVi}</span>
                  <span className={styles.councilRowMeta}>{en ? x.councilEn : x.councilVi}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {noResults && (
        <div className={styles.noResults}>
          {en
            ? `No questions found${q ? ` for “${q}”` : ''}.`
            : `Không tìm thấy câu hỏi nào${q ? ` cho “${q}”` : ''}.`}
        </div>
      )}
    </>
  );
}
