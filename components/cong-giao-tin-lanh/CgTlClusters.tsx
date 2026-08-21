'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { ScriptureBody } from '@/components/ScriptureBody';
import type { CgTlAnswer, ResolvedCluster } from '@/lib/congGiaoTinLanh';
import { T } from '@/components/T';
import styles from '@/app/cong-giao-va-tin-lanh/cong-giao-va-tin-lanh.module.css';

/**
 * The clusters of one branch of "Công Giáo và Tin Lành", each answer expanding IN PLACE.
 *
 * This follows the companion (components/DongHanh.tsx) and the evidence path
 * (components/bang-chung/EvidenceAnswers.tsx): the full answer renders inline through
 * <ScriptureBody> so nobody has to navigate away and find their way back — that round trip was
 * tested and rejected. The standalone Giải Đáp page survives as a quiet "Mở trang riêng" link,
 * which matters more here than elsewhere: this whole surface exists so a URL can be SHARED, and a
 * reader who wants to send one answer on to someone else needs its own address.
 *
 * Bodies are enriched SERVER-SIDE (lib/congGiaoTinLanh → enrichBody), so inline Scripture and
 * Catechism references open the shared popover and no resolver reaches the client bundle.
 *
 * They are mounted only once expanded, so no answer text is in the RENDERED DOM of a branch page —
 * which is what keeps this path from competing with the originals in search. Be precise about what
 * that does and does not buy: the bodies are still serialized into the RSC flight payload as props
 * to this client component (verified in .next/server/app/cong-giao-va-tin-lanh/*.html — the prose
 * is inside the __next_f script, `answerPanel` appears zero times). So these pages weigh 150–245KB
 * of HTML. The equivalent comment on components/bang-chung/EvidenceAnswers.tsx claims the answers
 * are kept "out of the server-rendered HTML"; that is true of the DOM but not of the payload. If
 * the weight ever needs to come down, the fix is to fetch a body on expand rather than to ship all
 * of them as props — a change that belongs to both paths at once, not just this one.
 *
 * Only ONE answer is open at a time, across every cluster in the branch. Two clusters open at once
 * would put two long answers on screen with the reader scrolling between them, and the state is
 * deliberately keyed by slug alone (slugs are unique site-wide) so opening a question in the second
 * cluster closes the one still open in the first.
 */
export function CgTlClusters({ clusters }: { clusters: ResolvedCluster[] }) {
  const lang = useLang();
  const en = lang === 'en';
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (slug: string) => setOpen((prev) => (prev === slug ? null : slug));

  // Questions carry an English translation; answers themselves are Vietnamese-only, as everywhere
  // on the site. An EN reader gets the English question and the Vietnamese answer — the same deal
  // the Giải Đáp page itself offers, not a promise this path can't keep.
  const label = (a: CgTlAnswer) => (en && a.questionEn ? a.questionEn : a.questionVi);

  return (
    <>
      {clusters.map((cluster) => (
        <section key={cluster.anchor.slug} className={styles.cluster}>
          <section className={styles.overview}>
            <div className={styles.overviewKicker}>{cluster.topic}</div>
            <h2 className={styles.overviewQuestion}>{label(cluster.anchor)}</h2>
            {open === cluster.anchor.slug ? (
              <ScriptureBody className={styles.answerBody} {...cluster.anchor.body} />
            ) : (
              <p className={styles.overviewExcerpt}>{cluster.anchor.excerpt}</p>
            )}
            <div className={styles.answerActions}>
              <button
                type="button"
                className={styles.expand}
                aria-expanded={open === cluster.anchor.slug}
                onClick={() => toggle(cluster.anchor.slug)}
              >
                <ChevronDown
                  size={15}
                  strokeWidth={2.2}
                  className={open === cluster.anchor.slug ? styles.chevronOpen : undefined}
                />
                {open === cluster.anchor.slug ? (
                  <T vi="Thu gọn" en="Collapse" />
                ) : (
                  <T vi="Đọc trọn phần tổng quan" en="Read the full overview" />
                )}
              </button>
              <Link href={cluster.anchor.href} className={styles.openPage}>
                <ExternalLink size={13} strokeWidth={2.2} />
                <T vi="Mở trang riêng" en="Open as its own page" />
              </Link>
            </div>
          </section>

          {cluster.parts.length > 0 && (
            <>
              <div className={styles.listLabel}>
                <T
                  vi={`${cluster.parts.length} câu hỏi trong phần này`}
                  en={`${cluster.parts.length} questions in this part`}
                />
              </div>
              <ol className={styles.answerList}>
                {cluster.parts.map((a, i) => {
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
        </section>
      ))}
    </>
  );
}
