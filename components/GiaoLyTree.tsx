'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { formatTocLabel } from '@/lib/titleFormat';
import { findArticleStartForParagraph } from '@/lib/tocUtils';
import { ReadingProgressBar } from './ReadingProgress';
import type { Toc, TocNode, Paragraph } from '@/lib/types';
import styles from './GiaoLyTree.module.css';

const EXPANDED_KEY = 'hdcg.giaoLy.expandedNodes';

function findAncestorIds(nodes: TocNode[], targetId: string, trail: string[] = []): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return trail;
    if (node.children.length > 0) {
      const found = findAncestorIds(node.children, targetId, [...trail, node.id]);
      if (found) return found;
    }
  }
  return null;
}

function Row({
  node,
  depth,
  expanded,
  toggle,
  currentArticleId,
}: {
  node: TocNode;
  depth: number;
  expanded: Set<string>;
  toggle: (id: string) => void;
  currentArticleId: string;
}) {
  const isLeaf = node.children.length === 0;
  const isOpen = expanded.has(node.id);
  const label = formatTocLabel(node);
  const indent = [8, 26, 44, 62][Math.min(depth, 3)];

  if (isLeaf) {
    const isCurrent = node.id === currentArticleId;
    return (
      <Link
        href={`/giao-ly/${node.paragraphRange[0]}`}
        className={isCurrent ? `${styles.leafRow} ${styles.leafRowActive}` : styles.leafRow}
        style={{ paddingLeft: indent }}
      >
        <span className={styles.leafTitle}>{label.title}</span>
        <span className={isCurrent ? styles.leafRangeActive : styles.leafRange}>
          {label.rangeCaption}
        </span>
      </Link>
    );
  }

  const chevronColor = depth === 0 ? 'var(--accent-deep)' : depth === 1 ? 'var(--accent)' : 'var(--text-fainter)';

  return (
    <div>
      <button
        type="button"
        onClick={() => toggle(node.id)}
        className={depth === 0 && isOpen ? `${styles.branchRow} ${styles.partRowOpen}` : styles.branchRow}
        style={{ paddingLeft: indent }}
      >
        {isOpen ? (
          <ChevronDown size={depth === 0 ? 18 : 15} strokeWidth={2.7} color={chevronColor} />
        ) : (
          <ChevronRight size={depth === 0 ? 18 : 15} strokeWidth={2.7} color="var(--text-fainter)" />
        )}
        <span className={depth === 0 ? styles.partTitle : styles.branchTitle}>
          {label.levelWord && label.numeral ? `${label.levelWord} ${label.numeral} — ` : ''}
          {label.title}
        </span>
      </button>
      {isOpen &&
        node.children.map((child) => (
          <Row key={child.id} node={child} depth={depth + 1} expanded={expanded} toggle={toggle} currentArticleId={currentArticleId} />
        ))}
    </div>
  );
}

export function GiaoLyTree({
  toc,
  currentArticleId,
  totalParagraphs,
}: {
  toc: Toc;
  currentArticleId: string;
  totalParagraphs: number;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<import('fuse.js').default<Paragraph> | null>(null);

  useEffect(() => {
    const ancestors = findAncestorIds(toc, currentArticleId) ?? [];
    let seeded = new Set(ancestors);
    try {
      const stored = window.localStorage.getItem(EXPANDED_KEY);
      if (stored) seeded = new Set([...JSON.parse(stored), ...ancestors]);
    } catch {
      // ignore
    }
    // Seed expanded nodes from localStorage + the current article's ancestors after mount
    // (browser-only; deferred behind the `ready` gate to avoid a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setExpanded(seeded);
    setReady(true);
  }, [currentArticleId, toc]);

  useEffect(() => {
    if (ready) window.localStorage.setItem(EXPANDED_KEY, JSON.stringify([...expanded]));
  }, [expanded, ready]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSearchFocus = async () => {
    if (fuse) return;
    const res = await fetch('/search-content.json');
    const data: Paragraph[] = await res.json();
    const Fuse = (await import('fuse.js')).default;
    setFuse(new Fuse(data, { keys: ['vi', 'en'], threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2 }));
  };

  const results = useMemo(() => {
    if (!fuse || query.trim().length < 2) return [];
    return fuse.search(query).slice(0, 30);
  }, [query, fuse]);

  // A pure-number query jumps straight to that Catechism paragraph — searching "847"
  // should offer § 847, not "not found". Works before the text index even loads.
  const trimmed = query.trim();
  const num = Number(trimmed);
  const numJump =
    /^\d+$/.test(trimmed) && num >= 1 && num <= totalParagraphs
      ? { n: num, start: findArticleStartForParagraph(toc, num) ?? num }
      : null;
  const showSearch = trimmed.length >= 2 || numJump !== null;

  if (!ready) return <nav className={styles.tree} />;

  return (
    <nav className={styles.tree}>
      <div className={styles.searchWrap}>
        <Search size={14} className={styles.searchIcon} />
        <input
          data-giao-ly-search
          className={styles.searchInput}
          placeholder="Tìm số đoạn hoặc từ khoá…"
          value={query}
          onFocus={onSearchFocus}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {showSearch ? (
        <div className={styles.searchResults}>
          {numJump && (
            <Link
              href={`/giao-ly/${numJump.start}#${numJump.n}`}
              className={styles.searchResultRow}
            >
              <span className={styles.searchResultNumber}>§{numJump.n}</span>
              <span className={styles.searchResultSnippet}>Đi tới số {numJump.n}</span>
            </Link>
          )}
          {results.map((r) => {
            const start = findArticleStartForParagraph(toc, r.item.id) ?? r.item.id;
            return (
              <Link key={r.item.id} href={`/giao-ly/${start}#${r.item.id}`} className={styles.searchResultRow}>
                <span className={styles.searchResultNumber}>{r.item.id}</span>
                <span className={styles.searchResultSnippet}>{r.item.vi}</span>
              </Link>
            );
          })}
          {!numJump && results.length === 0 && <div className={styles.searchEmpty}>Không tìm thấy</div>}
        </div>
      ) : (
        <>
          <div className={styles.progressMini}>
            <div className={styles.progressMiniLabel}>Tiến độ</div>
            <ReadingProgressBar total={totalParagraphs} />
          </div>
          {toc.map((node) => (
            <Row key={node.id} node={node} depth={0} expanded={expanded} toggle={toggle} currentArticleId={currentArticleId} />
          ))}
        </>
      )}
    </nav>
  );
}
