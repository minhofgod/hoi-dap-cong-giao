'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { findArticleStartForParagraph } from '@/lib/tocUtils';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Toc, Paragraph } from '@/lib/types';
import { T } from './T';
import styles from '../app/tim-kiem/tim-kiem.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export type QItem = { slug: string; question: string; category: string };
export type FItem = { slug: string; name: string; meta: string; keywords: string };
export type VItem = { slug: string; title: string; summary: string };
export type CQItem = { id: string; question: string; council: string; keywords: string; href: string };

export function GlobalSearch({
  toc,
  questions,
  councilQuestions,
  fathers,
  videos,
  catechismTotal,
}: {
  toc: Toc;
  questions: QItem[];
  councilQuestions: CQItem[];
  fathers: FItem[];
  videos: VItem[];
  catechismTotal: number;
}) {
  const params = useSearchParams();
  const uiLang = useLang();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [loaded, setLoaded] = useState(false);
  const [fuse, setFuse] = useState<import('fuse.js').default<Paragraph> | null>(null);

  // Load the Catechism full-text index once (same one the reader search uses).
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch('/search-content.json');
      const data: Paragraph[] = await res.json();
      const Fuse = (await import('fuse.js')).default;
      if (!active) return;
      setFuse(
        new Fuse(data, { keys: ['vi', 'en'], threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2 })
      );
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const q = query.trim();
  const nq = norm(q);

  const qResults = useMemo(
    () => (q ? questions.filter((x) => norm(`${x.question} ${x.category}`).includes(nq)).slice(0, 8) : []),
    [q, nq, questions]
  );
  const cqResults = useMemo(
    () =>
      q
        ? councilQuestions
            .filter((x) => norm(`${x.question} ${x.council} ${x.keywords}`).includes(nq))
            .slice(0, 8)
        : [],
    [q, nq, councilQuestions]
  );
  const fResults = useMemo(
    () => (q ? fathers.filter((x) => norm(`${x.name} ${x.meta} ${x.keywords}`).includes(nq)).slice(0, 8) : []),
    [q, nq, fathers]
  );
  const vResults = useMemo(
    () => (q ? videos.filter((x) => norm(`${x.title} ${x.summary}`).includes(nq)).slice(0, 8) : []),
    [q, nq, videos]
  );

  const num = Number(q);
  const numJump =
    /^\d+$/.test(q) && num >= 1 && num <= catechismTotal
      ? { n: num, start: findArticleStartForParagraph(toc, num) ?? num }
      : null;

  const cResults = useMemo(() => {
    if (!fuse || q.length < 2) return [];
    return fuse.search(q).slice(0, 10);
  }, [q, fuse]);

  const searching = q.length > 0;
  const total =
    qResults.length +
    cqResults.length +
    fResults.length +
    vResults.length +
    cResults.length +
    (numJump ? 1 : 0);
  const catechismPending = searching && q.length >= 2 && !loaded;

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder={
            uiLang === 'en'
              ? 'Search Q&A, Catechism, Church Fathers, Videos…'
              : 'Tìm trong Giải Đáp, Giáo Lý, Giáo Phụ, Video…'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!searching && (
        <p className={styles.hint}>
          <T vi="Nhập từ khoá để tìm trên toàn trang." en="Type a keyword to search the whole site." />
        </p>
      )}

      {searching && (
        <div className={styles.results}>
          {qResults.length > 0 && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>
                <T vi="Giải Đáp" en="Q&amp;A" />
              </div>
              {qResults.map((x) => (
                <Link key={x.slug} href={`/giai-dap/${x.slug}`} className={styles.row}>
                  <span className={styles.rowTitle}>{x.question}</span>
                  <span className={styles.rowMeta}>{x.category}</span>
                </Link>
              ))}
            </section>
          )}

          {cqResults.length > 0 && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>
                <T vi="Công Đồng · Vấn đáp" en="Councils · Q&amp;A" />
              </div>
              {cqResults.map((x) => (
                <Link key={x.id} href={x.href} className={styles.row}>
                  <span className={styles.rowTitle}>{x.question}</span>
                  <span className={styles.rowMeta}>{x.council}</span>
                </Link>
              ))}
            </section>
          )}

          {(numJump || cResults.length > 0) && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>
                <T vi="Giáo Lý" en="Catechism" />
              </div>
              {numJump && (
                <Link href={`/giao-ly/${numJump.start}#${numJump.n}`} className={styles.row}>
                  <span className={styles.rowNum}>§{numJump.n}</span>
                  <span className={styles.rowTitle}>
                    <T vi={`Đi tới số ${numJump.n}`} en={`Go to §${numJump.n}`} />
                  </span>
                </Link>
              )}
              {cResults.map((r) => {
                const start = findArticleStartForParagraph(toc, r.item.id) ?? r.item.id;
                return (
                  <Link key={r.item.id} href={`/giao-ly/${start}#${r.item.id}`} className={styles.row}>
                    <span className={styles.rowNum}>§{r.item.id}</span>
                    <span className={styles.rowText}>{r.item.vi}</span>
                  </Link>
                );
              })}
            </section>
          )}

          {fResults.length > 0 && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>
                <T vi="Giáo Phụ" en="Church Fathers" />
              </div>
              {fResults.map((x) => (
                <Link key={x.slug} href={`/giao-phu/${x.slug}`} className={styles.row}>
                  <span className={styles.rowTitle}>{x.name}</span>
                  <span className={styles.rowMeta}>{x.meta}</span>
                </Link>
              ))}
            </section>
          )}

          {vResults.length > 0 && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>
                <T vi="Video" en="Videos" />
              </div>
              {vResults.map((x) => (
                <Link key={x.slug} href={`/video/${x.slug}`} className={styles.row}>
                  <span className={styles.rowTitle}>{x.title}</span>
                </Link>
              ))}
            </section>
          )}

          {catechismPending && total === 0 && (
            <p className={styles.hint}>
              <T vi="Đang tìm trong Giáo Lý…" en="Searching the Catechism…" />
            </p>
          )}
          {!catechismPending && total === 0 && (
            <p className={styles.empty}>
              {uiLang === 'en' ? `No results for “${q}”.` : `Không tìm thấy kết quả nào cho “${q}”.`}
            </p>
          )}
        </div>
      )}
    </>
  );
}
