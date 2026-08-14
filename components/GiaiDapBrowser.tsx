'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { T } from './T';
import styles from '../app/giai-dap/giai-dap.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export type GiaiDapCard = {
  slug: string;
  questionVi: string;
  questionEn?: string;
  category: string;
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

type Topic = { category: string; anchor: GiaiDapCard; count: number };

/** Giải Đáp index: one card per topic (category), led by that topic's anchor question
 *  and its sacred-art image — mirroring the Catechism topic grid. Searching also surfaces
 *  matching individual questions (native + from the Councils), in both languages. */
export function GiaiDapBrowser({
  questions,
  councilQuestions,
}: {
  questions: GiaiDapCard[];
  councilQuestions: CouncilQACard[];
}) {
  const [query, setQuery] = useState('');
  const uiLang = useLang();
  const q = query.trim();
  const nq = norm(q);
  const en = uiLang === 'en';

  const topics = useMemo<Topic[]>(() => {
    const cats = [...new Set(questions.map((x) => x.category))];
    return cats.map((category) => {
      const items = questions.filter((x) => x.category === category);
      const anchor = items.find((x) => x.featured) ?? items[0];
      return { category, anchor, count: items.length };
    });
  }, [questions]);

  const filteredTopics = useMemo(
    () =>
      q
        ? topics.filter((t) =>
            norm(`${t.category} ${t.anchor.questionVi} ${t.anchor.questionEn ?? ''}`).includes(nq)
          )
        : topics,
    [q, nq, topics]
  );

  const questionMatches = useMemo(
    () =>
      q
        ? questions.filter((x) =>
            norm(`${x.questionVi} ${x.questionEn ?? ''} ${x.category} ${x.subcategory ?? ''}`).includes(nq)
          )
        : [],
    [q, nq, questions]
  );

  const councilMatches = useMemo(
    () =>
      q
        ? councilQuestions.filter((x) =>
            norm(`${x.questionVi} ${x.questionEn} ${x.councilVi} ${x.councilEn}`).includes(nq)
          )
        : [],
    [q, nq, councilQuestions]
  );

  const searching = q.length > 0;
  const noResults =
    searching &&
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

      {(!searching || filteredTopics.length > 0) && (
        <section className={styles.section}>
          {searching && (
            <div className={styles.sectionLabel}>
              <T vi="Chủ đề" en="Topics" />
            </div>
          )}
          <div className={styles.grid}>
            {filteredTopics.map((t) => (
              <Link key={t.category} href={`/giai-dap/${t.anchor.slug}`} className={styles.card}>
                <span className={styles.banner}>
                  <Image
                    src={`/images/giai-dap/${t.anchor.slug}.jpg`}
                    alt={t.category}
                    fill
                    sizes="(max-width: 640px) 100vw, 420px"
                    className={styles.bannerImg}
                  />
                </span>
                <div className={styles.cardBody}>
                  <div className={styles.cardName}>{t.category}</div>
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

      {searching && questionMatches.length > 0 && (
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
                <span className={styles.resultTopic}>{x.category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {searching && councilMatches.length > 0 && (
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

      {/* Not searching: the Councils Q&A list sits below the topic grid. */}
      {!searching && councilQuestions.length > 0 && (
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
          {en ? `No questions found for “${q}”.` : `Không tìm thấy câu hỏi nào cho “${q}”.`}
        </div>
      )}
    </>
  );
}
