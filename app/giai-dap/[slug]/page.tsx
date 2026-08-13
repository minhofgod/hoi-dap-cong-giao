import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getAllQuestions, getQuestionBySlug, type GiaiDapQuestion } from '@/lib/giaiDap';
import { ScriptureRef } from '@/components/ScriptureRef';
import { ScriptureBody } from '@/components/ScriptureBody';
import { CatechismRef } from '@/components/CatechismRef';
import { enrichAnswerHtml, resolveReference } from '@/lib/bibleRefs';
import { resolveCatechism } from '@/lib/content';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import styles from './answer.module.css';

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

// Make inline Scripture references in the answer prose clickable — but only when the licensing
// flag is on. Off: pass the raw html through untouched (no verse text, no markup changes).
function enrichBody(html: string) {
  return SCRIPTURE_POPOVER_ENABLED ? enrichAnswerHtml(html) : { html, data: {} };
}

function Refs({ ccc, scripture }: { ccc: number[]; scripture: string[] }) {
  if (ccc.length === 0 && scripture.length === 0) return null;
  return (
    <div className={styles.refsRow}>
      {ccc.map((n) => (
        <CatechismRef key={n} number={n} data={resolveCatechism(n)} />
      ))}
      {scripture.map((ref) => (
        <ScriptureRef
          key={ref}
          refLabel={ref}
          variant="chip"
          data={SCRIPTURE_POPOVER_ENABLED ? resolveReference(ref) : null}
        />
      ))}
    </div>
  );
}

function MobileBar() {
  return (
    <header className={styles.mobileHeader}>
      <Link href="/giai-dap" className={styles.iconButton} aria-label="Quay lại">
        <ChevronLeft size={20} color="var(--accent-deep)" />
      </Link>
      <span className={styles.mobileBrand}>Hỏi Đáp Công Giáo</span>
    </header>
  );
}

export default async function GiaiDapAnswerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  const load = (slugs: string[]) =>
    slugs.map((s) => getQuestionBySlug(s)).filter((q): q is GiaiDapQuestion => Boolean(q));

  const parts = load(question.parts);
  const related = load(question.related);
  const parent = question.partOf ? getQuestionBySlug(question.partOf) : undefined;

  // Main/anchor question → assemble the whole article with a side nav.
  if (parts.length > 0) {
    return (
      <div className={styles.page}>
        <MobileBar />
        <div className={styles.articleLayout}>
          <article className={styles.articleBody}>
            <div className={styles.chipRow}>
              <span className={styles.categoryChip}>{question.category}</span>
              {question.subcategory && <span className={styles.subcategory}>{question.subcategory}</span>}
            </div>
            <h1 className={styles.question}>{question.questionVi}</h1>

            <section id="tong-quan" className={styles.section}>
              <ScriptureBody className={styles.answer} {...enrichBody(question.bodyHtml)} />
              <Refs ccc={question.refsCcc} scripture={question.refsScripture} />
            </section>

            {parts.map((p) => (
              <section key={p.slug} id={p.slug} className={styles.section}>
                <h2 className={styles.sectionHeading}>{p.questionVi}</h2>
                <ScriptureBody className={styles.answer} {...enrichBody(p.bodyHtml)} />
                <Refs ccc={p.refsCcc} scripture={p.refsScripture} />
              </section>
            ))}

            {related.length > 0 && (
              <>
                <div className={styles.hairline} />
                <div className={styles.eyebrow}>CÂU HỎI LIÊN QUAN</div>
                <ul className={styles.relatedList}>
                  {related.map((r) => (
                    <li key={r.slug} className={styles.relatedRow}>
                      <Link href={`/giai-dap/${r.slug}`}>{r.questionVi}</Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <aside className={styles.toc}>
            <div className={styles.tocLabel}>Trong bài này</div>
            <nav className={styles.tocNav}>
              <a href="#tong-quan" className={styles.tocLink}>
                Tổng quan
              </a>
              {parts.map((p) => (
                <a key={p.slug} href={`#${p.slug}`} className={styles.tocLink}>
                  {p.questionVi}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    );
  }

  // Single question (including a sub-question that belongs to an article).
  return (
    <div className={styles.page}>
      <MobileBar />
      <div className={styles.layout}>
        {parent && (
          <Link href={`/giai-dap/${parent.slug}`} className={styles.partOf}>
            ‹ Thuộc loạt bài: {parent.questionVi}
          </Link>
        )}
        <div className={styles.chipRow}>
          <span className={styles.categoryChip}>{question.category}</span>
          {question.subcategory && <span className={styles.subcategory}>{question.subcategory}</span>}
        </div>
        <h1 className={styles.question}>{question.questionVi}</h1>
        <ScriptureBody className={styles.answer} {...enrichBody(question.bodyHtml)} />

        {(question.refsCcc.length > 0 || question.refsScripture.length > 0) && (
          <div className={styles.refsSection}>
            <div className={styles.eyebrow}>THAM CHIẾU</div>
            <Refs ccc={question.refsCcc} scripture={question.refsScripture} />
          </div>
        )}

        {related.length > 0 && (
          <>
            <div className={styles.hairline} />
            <div className={styles.eyebrow}>CÂU HỎI LIÊN QUAN</div>
            <ul className={styles.relatedList}>
              {related.map((r) => (
                <li key={r.slug} className={styles.relatedRow}>
                  <Link href={`/giai-dap/${r.slug}`}>{r.questionVi}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
