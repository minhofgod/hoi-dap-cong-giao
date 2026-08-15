'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { CATEGORIES, TAGS, categoryLabel } from '@/lib/giaiDapTaxonomy';
import { T } from './T';
import styles from '../app/giai-dap/giai-dap.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// On-brand tints for the banner fallback tile, so different missing-banner cards don't look
// identical while staying within the site's warm/sage palette.
const FALLBACK_TINTS = ['#E7DFD0', '#DEE6DD', '#EADFCF', '#E1E4DE'];

function pickTint(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return FALLBACK_TINTS[Math.abs(h) % FALLBACK_TINTS.length];
}

/** Topic-card banner: the cluster anchor's sacred-art image, degrading to a monogram tile when the
 *  file is missing (a forgotten `public/images/giai-dap/<anchor>.jpg` must never show a broken
 *  image). Client-side onError swap — the placeholder needs no network. */
function TopicBanner({ slug, topic }: { slug: string; topic: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={styles.banner} style={{ background: pickTint(topic) }} aria-hidden="true">
        <span className={styles.bannerFallback}>{topic.trim().charAt(0).toUpperCase()}</span>
      </span>
    );
  }
  return (
    <span className={styles.banner}>
      <Image
        src={`/images/giai-dap/${slug}.jpg`}
        alt={topic}
        fill
        sizes="(max-width: 640px) 100vw, 420px"
        className={styles.bannerImg}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

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
// Carries the same taxonomy axes as native questions, so it flows through the category/tag filter.
export type CouncilQACard = {
  id: string;
  questionVi: string;
  questionEn: string;
  councilVi: string;
  councilEn: string;
  category?: string;
  tags: string[];
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const uiLang = useLang();
  const q = query.trim();
  const nq = norm(q);
  const en = uiLang === 'en';

  // Only offer filters that actually occur in the content (native Q&As + council Q&As) — so nothing
  // shows until content carries categories/tags, and the vocabulary stays authored in one place
  // (the taxonomy lists).
  const availableCats = useMemo(() => {
    const present = new Set(
      [...questions, ...councilQuestions].map((x) => x.category).filter(Boolean) as string[]
    );
    return CATEGORIES.filter((c) => present.has(c.id));
  }, [questions, councilQuestions]);

  const availableTags = useMemo(() => {
    const present = new Set([...questions, ...councilQuestions].flatMap((x) => x.tags));
    return TAGS.filter((t) => present.has(t.id));
  }, [questions, councilQuestions]);

  const toggleTag = (id: string) =>
    setActiveTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const activeCount = (activeCat !== null ? 1 : 0) + activeTags.length;
  const filtersActive = activeCount > 0;

  // The active category/tag predicate — a Q&A must match the active category (if any) AND carry
  // every active tag. Native and council Q&As share the same shape here.
  const matchesFilters = useCallback(
    (x: { category?: string; tags: string[] }) =>
      (activeCat === null || x.category === activeCat) && activeTags.every((t) => x.tags.includes(t)),
    [activeCat, activeTags]
  );

  // Category + tag filters narrow the pool of questions; the topic grid and question matches both
  // derive from the narrowed pool.
  const pool = useMemo(() => questions.filter(matchesFilters), [questions, matchesFilters]);

  // Council Q&As flow through the very same category/tag filter.
  const councilPool = useMemo(
    () => councilQuestions.filter(matchesFilters),
    [councilQuestions, matchesFilters]
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

  // While searching, council matches are the filtered council pool narrowed by the query.
  const councilMatches = useMemo(
    () =>
      q
        ? councilPool.filter((x) =>
            norm(`${x.questionVi} ${x.questionEn} ${x.councilVi} ${x.councilEn}`).includes(nq)
          )
        : [],
    [q, nq, councilPool]
  );

  const searching = q.length > 0;
  // Councils show as `councilMatches` while searching, else as the `councilPool` list at the bottom.
  const councilShown = searching ? councilMatches.length : councilPool.length;
  const noResults =
    (searching || filtersActive) &&
    filteredTopics.length === 0 &&
    questionMatches.length === 0 &&
    councilShown === 0;

  return (
    <>
      <div className={styles.controls}>
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
          <button
            type="button"
            className={`${styles.filterToggle} ${filtersActive ? styles.filterToggleActive : ''}`}
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <SlidersHorizontal size={16} strokeWidth={2.2} />
            <T vi="Bộ lọc" en="Filter" />
            {activeCount > 0 && <span className={styles.filterBadge}>{activeCount}</span>}
          </button>
        )}
      </div>

      {filtersOpen && (availableCats.length > 0 || availableTags.length > 0) && (
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

          {filtersActive && (
            <button
              type="button"
              className={styles.filterClear}
              onClick={() => {
                setActiveCat(null);
                setActiveTags([]);
              }}
            >
              <T vi="Xóa bộ lọc" en="Clear filters" />
            </button>
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
                <TopicBanner slug={t.anchor.slug} topic={t.topic} />
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

      {/* Not searching: the Councils Q&A list (respecting the active filter) sits below the grid. */}
      {!searching && councilPool.length > 0 && (
        <section className={styles.councilSection}>
          <div className={styles.councilLabel}>
            <T vi="Từ các Công Đồng" en="From the Councils" />
          </div>
          <ul className={styles.councilList}>
            {councilPool.map((x) => (
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
