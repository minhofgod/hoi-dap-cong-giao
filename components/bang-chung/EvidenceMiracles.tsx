'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import { STATUS_LABEL, STATUS_NOTE, TYPE_BLURB, PRIVATE_REVELATION_NOTE } from '@/lib/miracles/types';
import type { EvidenceMiracle } from '@/lib/evidencePath';
import { T } from '@/components/T';
import styles from '@/app/bang-chung/bang-chung.module.css';

/**
 * The Church-recognised miracle cases on the final stage of the evidence path.
 *
 * Framing is fixed by docs/miracles-taxonomy-and-evidence-stage.md §B and is what makes this
 * persuasive rather than credulous:
 *  - every case shows its `limits` — WHAT IT DOES NOT ESTABLISH — as its own block, not buried in
 *    prose. That honesty is the section's entire credibility.
 *  - the recognition badge is always visible, with the note that says what the label does and does
 *    not mean. Church approval is never scientific proof.
 *  - recognised cases only, ordered so the medically investigated ones lead.
 *
 * The badge label and its note come from lib/miracles/types (STATUS_LABEL / STATUS_NOTE) rather
 * than being restated here: that text already carries the distinction verbatim — `approved` ends
 * "not a dogma, and not a scientific proof", `cure-approved` spells out the two separate steps,
 * medicine saying "unexplained" before the Church says "miracle". Reusing it means this stage
 * cannot drift from the Miracles section, and none of that theology is re-authored in this lane.
 *
 * Same expand-in-place behaviour as the cluster stages — nobody is sent away and asked to find
 * their way back.
 */
export function EvidenceMiracles({
  miracles,
  excludedCount,
}: {
  miracles: EvidenceMiracle[];
  excludedCount: number;
}) {
  const lang = useLang();
  const en = lang === 'en';
  const pick = (b: { vi: string; en: string }) => (en && b.en ? b.en : b.vi);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      {/* Standing note, ABOVE the list and outside any expander. The recognition badge shows on the
          collapsed row, so "Đã được phê chuẩn" would otherwise be readable without the sentence
          that says what it does not mean — §B requires saying that plainly, as /phep-la does.
          PRIVATE_REVELATION_NOTE is Session 11's exported text; only the first line is authored
          here, and it should be replaced by /phep-la's own APPROVAL_NOTE if that is ever exported,
          so the two cannot drift. */}
      <section className={styles.standingNote}>
        <div className={styles.noteHeading}>
          <T vi="Xin đọc trước" en="Read this first" />
        </div>
        <p className={styles.noteBody}>
          <T
            vi="Hội Thánh phê chuẩn một trường hợp có nghĩa là: sau khi điều tra, không thấy gì nghịch với đức tin và luân lý, và tín hữu có thể tin cách khôn ngoan. Điều đó không bao giờ có nghĩa là Hội Thánh đã chứng minh biến cố ấy, và cũng không phải là một kết luận khoa học."
            en="For the Church to approve a case means: after investigation, nothing was found contrary to faith or morals, and the faithful may prudently believe it. It never means the Church has proved the event, and it is not a scientific finding."
          />
        </p>
        <p className={styles.noteBody}>{pick(PRIVATE_REVELATION_NOTE)}</p>
      </section>

      {/* Why the medically investigated cases lead: a process that refuses far more often than it
          accepts. Session 11's verified figures (7,000+ claims at Lourdes, 70 recognised) — not
          restated here, read from the section's own exported blurb. */}
      <p className={styles.miracleLede}>{pick(TYPE_BLURB.healing)}</p>

      <div className={styles.listLabel}>
        <T
          vi={`${miracles.length} trường hợp Hội Thánh đã chính thức nhìn nhận`}
          en={`${miracles.length} cases the Church has formally recognised`}
        />
      </div>

      {/* Said out loud rather than quietly filtered. A section arguing for honesty about evidence
          has to disclose that it is leaving cases out — and why. */}
      {excludedCount > 0 && (
        <p className={styles.partialNote}>
          <T
            vi={`Còn ${excludedCount} trường hợp khác trong mục Phép Lạ không có ở đây: đó là những trường hợp được tôn kính lâu đời, chưa có phán quyết chính thức, hoặc do một Giáo hội khác công nhận. Truyền thống lâu đời không phải là bằng chứng lịch sử, nên chúng không thuộc về một trang nói về bằng chứng.`}
            en={`Another ${excludedCount} cases in the Miracles section are not shown here: those long venerated, those never formally ruled on, and one recognised by a different Church. A long tradition is not historical evidence, so they do not belong on a page about evidence.`}
          />{' '}
          <Link href="/phep-la" className={styles.partialLink}>
            <T vi="Xem tất cả trong Phép Lạ →" en="See them all in Phép Lạ →" />
          </Link>
        </p>
      )}

      <ol className={styles.answerList}>
        {miracles.map((m, i) => {
          const isOpen = open === m.slug;
          return (
            <li key={m.slug} className={isOpen ? styles.answerRowOpen : styles.answerRow}>
              <button
                type="button"
                className={styles.answerHead}
                aria-expanded={isOpen}
                onClick={() => setOpen((p) => (p === m.slug ? null : m.slug))}
              >
                <span className={styles.answerNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.miracleHeadText}>
                  <span className={styles.answerQuestion}>{pick(m.title)}</span>
                  <span className={styles.miracleMeta}>
                    {pick(m.location)} · {m.dateDisplay}
                  </span>
                </span>
                <span className={styles.statusBadge}>{pick(STATUS_LABEL[m.status])}</span>
                <ChevronDown
                  size={17}
                  strokeWidth={2}
                  className={isOpen ? styles.chevronOpen : styles.chevron}
                />
              </button>

              {isOpen && (
                <div className={styles.answerPanel}>
                  {/* What the badge actually means — so "approved" can never be read as "proved". */}
                  <p className={styles.statusNote}>{pick(STATUS_NOTE[m.status])}</p>

                  <p className={styles.miracleSummary}>{pick(m.summary)}</p>

                  {m.evidence.length > 0 && (
                    <section className={styles.miracleBlock}>
                      <div className={styles.miracleBlockLabel}>
                        <T vi="Bằng chứng" en="The evidence" />
                      </div>
                      {m.evidence.map((p, k) => (
                        <p key={k} className={styles.miracleBlockBody}>
                          {pick(p)}
                        </p>
                      ))}
                    </section>
                  )}

                  {/* The point of the whole section. Dark band, like /phep-la, so it reads as
                      part of the case rather than as a disclaimer tucked underneath it. */}
                  {m.limits.length > 0 && (
                    <section className={styles.limitsBlock}>
                      <div className={styles.limitsLabel}>
                        <T vi="Điều này KHÔNG chứng minh" en="What this does NOT establish" />
                      </div>
                      {m.limits.map((p, k) => (
                        <p key={k} className={styles.limitsBody}>
                          {pick(p)}
                        </p>
                      ))}
                    </section>
                  )}

                  <div className={styles.answerActions}>
                    <Link href={m.href} className={styles.openPage}>
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
  );
}
