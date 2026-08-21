import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import {
  getAllQuestions,
  getQuestionBySlug,
  type GiaiDapQuestion,
  type GiaiDapSource,
} from '@/lib/giaiDap';
import { getAllVideos, type Video } from '@/lib/videos';
import { relatedByTaxonomy } from '@/lib/relatedContent';
import { ArticleToc } from '@/components/ArticleToc';
import { ShareButton } from '@/components/ShareButton';
import { CG_TL_ENABLED } from '@/lib/congGiaoTinLanhFlag';
import { categoryLabel, tagLabel } from '@/lib/giaiDapTaxonomy';
import { ScriptureRef } from '@/components/ScriptureRef';
import { ScriptureBody } from '@/components/ScriptureBody';
import { CatechismRef } from '@/components/CatechismRef';
import { enrichReferences, resolveReference } from '@/lib/bibleRefs';
import { resolveCatechism } from '@/lib/content';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { CANVAS_ENABLED } from '@/lib/canvasFlag';
import { pageMetadata, plainExcerpt, resolveParentImages } from '@/lib/pageMetadata';
import type { Metadata, ResolvingMetadata } from 'next';
import styles from './answer.module.css';

// Topics that have a visual diagram at /so-do/<slug> (shown only when the canvas flag is on).
const CANVAS_FOR: Record<string, string> = {
  'duc-tin-va-viec-lam': 'sola-fide',
};

export function generateStaticParams() {
  return getAllQuestions().map((q) => ({ slug: q.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) return {};
  return pageMetadata({
    title: question.questionVi,
    description: plainExcerpt(question.bodyRaw),
    path: `/giai-dap/${question.slug}`,
    type: 'article',
    images: await resolveParentImages(parent),
  });
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

// "Watch the video" — videos whose taxonomy overlaps this Q&A (auto tag/category match, explicit
// `related_video` pinned first). Renders nothing when there's no overlapping video.
function WatchVideo({ videos }: { videos: Video[] }) {
  if (videos.length === 0) return null;
  return (
    <>
      <div className={styles.hairline} />
      <div className={styles.eyebrow}>
        <T vi="XEM VIDEO" en="WATCH THE VIDEO" />
      </div>
      <div className={styles.videoCards}>
        {videos.map((v) => (
          <Link key={v.slug} href={`/video/${v.slug}`} className={styles.videoCard}>
            <span className={styles.videoThumb}>
              {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className={styles.videoThumbImg}
              />
              <span className={styles.videoPlay} aria-hidden="true">
                ▶
              </span>
              {v.duration && <span className={styles.videoDuration}>{v.duration}</span>}
            </span>
            <span className={styles.videoCardTitle}>
              {v.titleEn ? (
                <>
                  <span className="bi-vi">{v.title}</span>
                  <span className="bi-en">{v.titleEn}</span>
                </>
              ) : (
                v.title
              )}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

// The "see also" cluster (watch-video + related-questions), rendered once and reused by both
// layouts. In a sticky sidebar it reads as a calm "Xem thêm / See also" group; stacked at the
// bottom (mobile, or a sparse single page) it keeps the original per-block eyebrows. Renders
// nothing when there's neither a matching video nor a related question.
function SeeAlsoContent({ videos, related }: { videos: Video[]; related: GiaiDapQuestion[] }) {
  if (videos.length === 0 && related.length === 0) return null;
  return (
    <>
      <div className={styles.seeAlsoHead}>
        <T vi="XEM THÊM" en="SEE ALSO" />
      </div>
      <WatchVideo videos={videos} />
      {related.length > 0 && (
        <div className={styles.relatedBlock}>
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
        </div>
      )}
    </>
  );
}

// For a Q&A that answers a Protestant objection: a quiet offer of the guided "Công Giáo và Tin Lành"
// path — framed as something written FOR a Protestant reader, not more apologetics. Lives in the
// rendering layer (not `related:`, which only holds Q&A slugs) and is gated on CG_TL_ENABLED, so no
// dead link ships while the path is off. Shows only on pages tagged `protestant-objections`.
function ProtestantPathOffer({ tags }: { tags: string[] }) {
  if (!CG_TL_ENABLED || !tags.includes('protestant-objections')) return null;
  return (
    <Link href="/cong-giao-va-tin-lanh" className={styles.cgtlOffer}>
      <span className={styles.cgtlOfferText}>
        <T
          vi={
            <>
              Bạn đang đọc điều này với tư cách một người Tin Lành? Có một trang được viết{' '}
              <strong>cho bạn</strong> — về những gì chúng ta cùng tin, và những gì còn khác biệt.
            </>
          }
          en={
            <>
              Reading this as a Protestant? There&rsquo;s a page written <strong>for you</strong> — on
              what we share, and where we differ.
            </>
          }
        />
      </span>
      <span className={styles.cgtlOfferName}>
        <T vi="Công Giáo và Tin Lành" en="Catholic and Protestant" /> →
      </span>
    </Link>
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

// External citations for a question/part — a plain "Nguồn tham khảo" list (books, papers, datasets),
// links opening safely in a new tab. Distinct from <Refs> (Bible/Catechism popover chips); never a
// popover. Renders nothing when there are no sources.
function Sources({ sources }: { sources: GiaiDapSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className={styles.sourcesSection}>
      <div className={styles.eyebrow}>
        <T vi="NGUỒN THAM KHẢO" en="SOURCES" />
      </div>
      <ul className={styles.sourcesList}>
        {sources.map((s) => (
          <li key={s.url ?? s.label} className={styles.sourceItem}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sourceLink}
              >
                {s.label}
              </a>
            ) : (
              s.label
            )}
          </li>
        ))}
      </ul>
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

  // Videos whose taxonomy overlaps this Q&A (auto tag/category match; explicit `related_video`
  // pinned first) — see lib/relatedContent.
  const relatedVideos = relatedByTaxonomy(question, getAllVideos(), {
    limit: 2,
    pins: question.relatedVideo,
  });

  // Enough "see also" material to warrant the calm sticky rail on wide desktop? A lone link looks
  // sparse in a rail, so require a video + a related question, or ≥3 items total — otherwise keep
  // it at the bottom (docs/ux-inline-answer-and-sidebars.md, Session 2). The rail itself is desktop-
  // only via CSS; mobile/tablet always stack it at the bottom, unchanged.
  const seeAlsoTotal = relatedVideos.length + related.length;
  const useRail =
    seeAlsoTotal >= 3 || (relatedVideos.length >= 1 && related.length >= 1);

  // Single-layout "see also": rendered once. Sits at the bottom by default; the `.hasRail` grid
  // lifts this <aside> into the right margin (sticky) on wide desktop.
  const hasSeeAlso = relatedVideos.length > 0 || related.length > 0;
  const seeAlso = hasSeeAlso ? (
    <aside className={styles.seeAlso}>
      <SeeAlsoContent videos={relatedVideos} related={related} />
    </aside>
  ) : null;

  // Section list for the article side nav (scrollspy): overview + each part, in reading order.
  // Parts are Vietnamese-only, so vi === en (matching how they render as plain questionVi).
  const tocSections = [
    { id: 'tong-quan', vi: 'Tổng quan', en: 'Overview' },
    ...parts.map((p) => ({ id: p.slug, vi: p.questionVi, en: p.questionVi })),
  ];

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
                <Sources sources={question.sources} />
              </section>

              {parts.map((p) => (
                <section key={p.slug} id={p.slug} className={styles.section}>
                  <h2 className={styles.sectionHeading}>{p.questionVi}</h2>
                  <ScriptureBody className={styles.answer} {...enrichBody(p.bodyHtml)} />
                  <Refs ccc={p.refsCcc} scripture={p.refsScripture} />
                  <Sources sources={p.sources} />
                </section>
              ))}

              <ProtestantPathOffer tags={question.tags} />

              <div className={styles.shareRow}>
                <ShareButton title={question.questionVi} className={styles.shareButton} iconSize={16} />
              </div>
            </article>

            <aside className={styles.toc}>
              <div className={styles.tocInner}>
                <ArticleToc sections={tocSections} />
              </div>
              <SeeAlsoContent videos={relatedVideos} related={related} />
            </aside>

            <PrevNext prev={prev} next={next} />
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
        <div className={`${styles.layout} ${useRail ? styles.hasRail : ''}`}>
          <div className={styles.reading}>
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

            <Sources sources={question.sources} />

            <ProtestantPathOffer tags={question.tags} />

            <div className={styles.shareRow}>
              <ShareButton title={question.questionVi} className={styles.shareButton} iconSize={16} />
            </div>
          </div>

          {seeAlso}

          <PrevNext prev={prev} next={next} />
        </div>
      </div>
    </>
  );
}
