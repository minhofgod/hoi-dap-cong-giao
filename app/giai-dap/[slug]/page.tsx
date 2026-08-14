import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { getAllQuestions, getQuestionBySlug, type GiaiDapQuestion } from '@/lib/giaiDap';
import { categoryLabel, tagLabel } from '@/lib/giaiDapTaxonomy';
import { ScriptureRef } from '@/components/ScriptureRef';
import { ScriptureBody } from '@/components/ScriptureBody';
import { CatechismRef } from '@/components/CatechismRef';
import { enrichReferences, resolveReference } from '@/lib/bibleRefs';
import { resolveCatechism } from '@/lib/content';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { CANVAS_ENABLED } from '@/lib/canvasFlag';
import styles from './answer.module.css';

// Topics that have a visual diagram at /so-do/<slug> (shown only when the canvas flag is on).
const CANVAS_FOR: Record<string, string> = {
  'duc-tin-va-viec-lam': 'sola-fide',
};

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

// Make inline references in the answer prose clickable: Catechism (GLHTCG) always, Scripture only
// when the licensing flag is on. enrichReferences handles both gates internally.
function enrichBody(html: string) {
  return enrichReferences(html);
}

// Broad category + tag chips for a Q&A. The broad category (from the taxonomy) leads; if a Q&A
// isn't yet migrated to a category, its cluster name (`topic`) stands in so a chip is always shown.
function TaxonomyChips({ question }: { question: GiaiDapQuestion }) {
  const cat = question.category ? categoryLabel(question.category) : null;
  return (
    <div className={styles.chipRow}>
      {cat ? (
        <span className={styles.categoryChip}>
          <T vi={cat.vi} en={cat.en} />
        </span>
      ) : (
        <span className={styles.categoryChip}>{question.topic}</span>
      )}
      {question.tags.map((t) => {
        const l = tagLabel(t);
        return (
          <span key={t} className={styles.tagChip}>
            <T vi={l.vi} en={l.en} />
          </span>
        );
      })}
      {question.subcategory && <span className={styles.subcategory}>{question.subcategory}</span>}
    </div>
  );
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

function PrevNext({ prev, next }: { prev?: GiaiDapQuestion; next?: GiaiDapQuestion }) {
  if (!prev && !next) return null;
  return (
    <nav className={styles.navRow}>
      {prev ? (
        <Link href={`/giai-dap/${prev.slug}`} className={styles.navPrev}>
          <span className={styles.navLabel}>
            <T vi="← Câu trước" en="← Previous" />
          </span>
          <span className={styles.navQ}>{prev.questionVi}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/giai-dap/${next.slug}`} className={styles.navNext}>
          <span className={styles.navLabel}>
            <T vi="Câu sau →" en="Next →" />
          </span>
          <span className={styles.navQ}>{next.questionVi}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
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

  // Prev/next across all questions (vi-alphabetical order from getAllQuestions).
  const all = getAllQuestions();
  const idx = all.findIndex((q) => q.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : undefined;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined;

  // Main/anchor question → assemble the whole article with a side nav.
  if (parts.length > 0) {
    return (
      <>
        <SiteHeader />
        <div className={styles.page}>
          <div className={styles.articleLayout}>
            <article className={styles.articleBody}>
              <Link href="/giai-dap" className={styles.backLink}>
                ‹ <T vi="Tất cả câu hỏi" en="All questions" />
              </Link>
              <TaxonomyChips question={question} />
              <h1 className={styles.question}>{question.questionVi}</h1>

              {CANVAS_ENABLED && CANVAS_FOR[question.slug] && (
                <Link href={`/so-do/${CANVAS_FOR[question.slug]}`} className={styles.diagramLink}>
                  <span aria-hidden="true">◈</span>{' '}
                  <T vi="Xem sơ đồ trực quan" en="View the diagram" />
                </Link>
              )}

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
                  <div className={styles.eyebrow}>
                <T vi="CÂU HỎI LIÊN QUAN" en="RELATED QUESTIONS" />
              </div>
                  <ul className={styles.relatedList}>
                    {related.map((r) => (
                      <li key={r.slug} className={styles.relatedRow}>
                        <Link href={`/giai-dap/${r.slug}`}>{r.questionVi}</Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <PrevNext prev={prev} next={next} />
            </article>

            <aside className={styles.toc}>
              <div className={styles.tocLabel}>
                <T vi="Trong bài này" en="In this article" />
              </div>
              <nav className={styles.tocNav}>
                <a href="#tong-quan" className={styles.tocLink}>
                  <T vi="Tổng quan" en="Overview" />
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
      </>
    );
  }

  // Single question (including a sub-question that belongs to an article).
  return (
    <>
      <SiteHeader />
      <div className={styles.page}>
        <div className={styles.layout}>
          {parent ? (
            <Link href={`/giai-dap/${parent.slug}`} className={styles.backLink}>
              ‹ <T vi="Thuộc loạt bài:" en="Part of:" /> {parent.questionVi}
            </Link>
          ) : (
            <Link href="/giai-dap" className={styles.backLink}>
              ‹ <T vi="Tất cả câu hỏi" en="All questions" />
            </Link>
          )}
          <TaxonomyChips question={question} />
          <h1 className={styles.question}>{question.questionVi}</h1>
          <ScriptureBody className={styles.answer} {...enrichBody(question.bodyHtml)} />

          {(question.refsCcc.length > 0 || question.refsScripture.length > 0) && (
            <div className={styles.refsSection}>
              <div className={styles.eyebrow}>
                <T vi="THAM CHIẾU" en="REFERENCES" />
              </div>
              <Refs ccc={question.refsCcc} scripture={question.refsScripture} />
            </div>
          )}

          {related.length > 0 && (
            <>
              <div className={styles.hairline} />
              <div className={styles.eyebrow}>
                <T vi="CÂU HỎI LIÊN QUAN" en="RELATED QUESTIONS" />
              </div>
              <ul className={styles.relatedList}>
                {related.map((r) => (
                  <li key={r.slug} className={styles.relatedRow}>
                    <Link href={`/giai-dap/${r.slug}`}>{r.questionVi}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <PrevNext prev={prev} next={next} />
        </div>
      </div>
    </>
  );
}
