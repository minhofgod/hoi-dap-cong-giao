'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { ScriptureBody } from '@/components/ScriptureBody';
import type { EvidenceAnswer } from '@/lib/evidencePath';
import { T } from '@/components/T';
import styles from '@/app/bang-chung/bang-chung.module.css';

/**
 * The answers of one evidence-path stage, each expanding IN PLACE.
 *
 * This deliberately follows the companion's v2 behaviour (components/DongHanh.tsx, ReadingContent):
 * the full answer is rendered inline through <ScriptureBody> so nobody has to navigate away and
 * find their way back — that round trip was tested and rejected. The standalone Giải Đáp page
 * survives only as the companion's quiet "Mở trang riêng" share link.
 *
 * Bodies are enriched SERVER-SIDE (lib/evidencePath → enrichBody), so inline Scripture and
 * Catechism references open the shared popover and no resolver reaches the client bundle. They are
 * also only mounted once expanded, which keeps 23 already-published answers out of the path's
 * server-rendered HTML — the path must not compete with the originals in search.
 */
export function EvidenceAnswers({
  anchor,
  parts,
}: {
  anchor: EvidenceAnswer;
  parts: EvidenceAnswer[];
}) {
  const lang = useLang();
  const en = lang === 'en';
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (slug: string) => setOpen((prev) => (prev === slug ? null : slug));

  const label = (a: EvidenceAnswer) => (en && a.questionEn ? a.questionEn : a.questionVi);

  return (
    <>
      <section className={styles.overview}>
        <div className={styles.overviewKicker}>
          <T vi="Tổng quan chủ đề" en="The topic in overview" />
        </div>
        <h2 className={styles.overviewQuestion}>{label(anchor)}</h2>
        {open === anchor.slug ? (
          <ScriptureBody className={styles.answerBody} {...anchor.body} />
        ) : (
          <p className={styles.overviewExcerpt}>{anchor.excerpt}</p>
        )}
        <div className={styles.answerActions}>
          <button
            type="button"
            className={styles.expand}
            aria-expanded={open === anchor.slug}
            onClick={() => toggle(anchor.slug)}
          >
            <ChevronDown
              size={15}
              strokeWidth={2.2}
              className={open === anchor.slug ? styles.chevronOpen : undefined}
            />
            {open === anchor.slug ? (
              <T vi="Thu gọn" en="Collapse" />
            ) : (
              <T vi="Đọc trọn phần tổng quan" en="Read the full overview" />
            )}
          </button>
          <Link href={anchor.href} className={styles.openPage}>
            <ExternalLink size={13} strokeWidth={2.2} />
            <T vi="Mở trang riêng" en="Open as its own page" />
          </Link>
        </div>
      </section>

      {parts.length > 0 && (
        <>
          <div className={styles.listLabel}>
            <T
              vi={`${parts.length} câu hỏi trong bước này`}
              en={`${parts.length} questions in this step`}
            />
          </div>
          <ol className={styles.answerList}>
            {parts.map((a, i) => {
              const isOpen = open === a.slug;
              return (
                <li key={a.slug} className={isOpen ? styles.answerRowOpen : styles.answerRow}>
                  <button
                    type="button"
                    className={styles.answerHead}
                    aria-expanded={isOpen}
                    onClick={() => toggle(a.slug)}
                  >
                    <span className={styles.answerNum}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.answerQuestion}>{label(a)}</span>
                    <ChevronDown
                      size={17}
                      strokeWidth={2}
                      className={isOpen ? styles.chevronOpen : styles.chevron}
                    />
                  </button>
                  {isOpen && (
                    <div className={styles.answerPanel}>
                      <ScriptureBody className={styles.answerBody} {...a.body} />
                      <div className={styles.answerActions}>
                        <Link href={a.href} className={styles.openPage}>
                          <ExternalLink size={13} strokeWidth={2.2} />
                          <T vi="Mở trang riêng" en="Open as its own page" />
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
