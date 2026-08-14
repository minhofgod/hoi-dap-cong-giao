'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { findArticleStartForParagraph } from '@/lib/tocUtils';
import type { Toc, Paragraph } from '@/lib/types';
import styles from '../app/tim-kiem/tim-kiem.module.css';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export type QItem = { slug: string; question: string; category: string };
export type FItem = { slug: string; name: string; meta: string; keywords: string };
export type VItem = { slug: string; title: string; summary: string };

export function GlobalSearch({
  toc,
  questions,
  fathers,
  videos,
  catechismTotal,
}: {
  toc: Toc;
  questions: QItem[];
  fathers: FItem[];
  videos: VItem[];
  catechismTotal: number;
}) {
  const params = useSearchParams();
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
    qResults.length + fResults.length + vResults.length + cResults.length + (numJump ? 1 : 0);
  const catechismPending = searching && q.length >= 2 && !loaded;

  return (
    <>
      <div className={styles.searchBar}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm trong Giải Đáp, Giáo Lý, Giáo Phụ, Video…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!searching && <p className={styles.hint}>Nhập từ khoá để tìm trên toàn trang.</p>}

      {searching && (
        <div className={styles.results}>
          {qResults.length > 0 && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>Giải Đáp</div>
              {qResults.map((x) => (
                <Link key={x.slug} href={`/giai-dap/${x.slug}`} className={styles.row}>
                  <span className={styles.rowTitle}>{x.question}</span>
                  <span className={styles.rowMeta}>{x.category}</span>
                </Link>
              ))}
            </section>
          )}

          {(numJump || cResults.length > 0) && (
            <section className={styles.group}>
              <div className={styles.groupLabel}>Giáo Lý</div>
              {numJump && (
                <Link href={`/giao-ly/${numJump.start}#${numJump.n}`} className={styles.row}>
                  <span className={styles.rowNum}>§{numJump.n}</span>
                  <span className={styles.rowTitle}>Đi tới số {numJump.n}</span>
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
              <div className={styles.groupLabel}>Giáo Phụ</div>
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
              <div className={styles.groupLabel}>Video</div>
              {vResults.map((x) => (
                <Link key={x.slug} href={`/video/${x.slug}`} className={styles.row}>
                  <span className={styles.rowTitle}>{x.title}</span>
                </Link>
              ))}
            </section>
          )}

          {catechismPending && total === 0 && <p className={styles.hint}>Đang tìm trong Giáo Lý…</p>}
          {!catechismPending && total === 0 && (
            <p className={styles.empty}>Không tìm thấy kết quả nào cho “{q}”.</p>
          )}
        </div>
      )}
    </>
  );
}
