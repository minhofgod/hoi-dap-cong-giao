import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { ScriptureBody } from '@/components/ScriptureBody';
import { ScriptureRef } from '@/components/ScriptureRef';
import { CatechismRef } from '@/components/CatechismRef';
import { enrichBody, resolveReference } from '@/lib/bibleRefs';
import { resolveCatechism } from '@/lib/content';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { TONG_LUAN_ENABLED } from '@/lib/tongLuanFlag';
import {
  getAllChapters,
  getChapterBySlug,
  getChaptersByPart,
  getNeighbours,
  TONG_LUAN_PARTS,
  type TongLuanSource,
} from '@/lib/tongLuan';
import { pageMetadata, resolveParentImages } from '@/lib/pageMetadata';
import type { ResolvingMetadata } from 'next';
import styles from '../tong-luan.module.css';

export function generateStaticParams() {
  if (!TONG_LUAN_ENABLED) return [];
  return getAllChapters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return {};
  // Bare title (+ section context) only — the root layout's title.template appends the site name.
  return pageMetadata({
    title: `${chapter.titleVi} · Tổng luận Thần học`,
    description: chapter.summaRef
      ? `${chapter.titleVi} — Tổng luận thần học, ${chapter.summaRef}.`
      : chapter.titleVi,
    path: `/tong-luan/${slug}`,
    type: 'article',
    images: await resolveParentImages(parent),
  });
}

// Bible/Catechism popover chips declared in frontmatter. The Catechism is public so its chips are
// always live; Scripture chips go inert while the CGKPV licensing flag is off.
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

function Sources({ sources }: { sources: TongLuanSource[] }) {
  if (sources.length === 0) return null;
  return (
    <div className={styles.sources}>
      <div className={styles.sourcesTitle}>
        <T vi="Nguồn tham khảo" en="Sources" />
      </div>
      <ul className={styles.sourcesList}>
        {sources.map((s) => (
          <li key={s.label}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer">
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

export default async function TongLuanChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!TONG_LUAN_ENABLED) notFound();
  const { slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const groups = getChaptersByPart();
  const { prev, next } = getNeighbours(slug);
  const partLabel = TONG_LUAN_PARTS.find((p) => p.id === chapter.part);
  const isSuppl = chapter.summaSource === 'supplementum';

  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <Link href="/tong-luan" className={styles.back}>
          <T vi="‹ Tổng luận Thần học" en="‹ The Summa, Explained" />
        </Link>

        <div className={styles.layout}>
          <nav className={styles.sidebar} aria-label="Mục lục">
            {groups.map(({ part, chapters }) => (
              <div key={part.id} className={styles.sideGroup}>
                <div className={styles.sideGroupTitle}>
                  <T vi={part.vi} en={part.en} />
                </div>
                {chapters.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tong-luan/${c.slug}`}
                    className={`${styles.sideLink} ${c.slug === slug ? styles.sideLinkActive : ''}`}
                    aria-current={c.slug === slug ? 'page' : undefined}
                  >
                    <T vi={c.titleVi} en={c.titleEn || c.titleVi} />
                  </Link>
                ))}
              </div>
            ))}
          </nav>

          <article className={styles.article}>
            <header className={styles.chapterHead}>
              {partLabel && (
                <div className={styles.partLabel}>
                  <T vi={partLabel.vi} en={partLabel.en} />
                  {chapter.section ? ` · ${chapter.section}` : ''}
                </div>
              )}
              {/* Title swaps with the language toggle rather than stacking both — the site's <T>
                  contract. summaRef is a citation ("I, q.2, a.3"), so it stays in both. */}
              <h1 className={styles.chapterTitle}>
                <T vi={chapter.titleVi} en={chapter.titleEn || chapter.titleVi} />
              </h1>
              {chapter.summaRef && <div className={styles.summaRef}>{chapter.summaRef}</div>}
            </header>

            {isSuppl && (
              <div className={styles.supplNote}>
                <div className={styles.supplNoteTitle}>
                  <T
                    vi="Chương này thuộc Phần Phụ lục"
                    en="This chapter belongs to the Supplement"
                  />
                </div>
                <T
                  vi={
                    chapter.summaNote ??
                    'Thánh Tôma dừng bút ở Phần III, Câu hỏi 90. Phần Phụ lục do các môn đệ biên soạn sau khi ngài qua đời.'
                  }
                  en="Aquinas stopped writing at Part III, Question 90. The Supplement was compiled by his disciples after his death, drawn from his earlier works — so the thought is his, but the text is not."
                />
              </div>
            )}

            <Refs ccc={chapter.refsCcc} scripture={chapter.refsScripture} />

            <ScriptureBody className={styles.body} {...enrichBody(chapter.bodyHtml)} />

            <Sources sources={chapter.sources} />

            <nav className={styles.neighbours}>
              {prev ? (
                <Link href={`/tong-luan/${prev.slug}`} className={styles.neighbour}>
                  <div className={styles.neighbourLabel}>
                    <T vi="Chương trước" en="Previous" />
                  </div>
                  <div className={styles.neighbourTitle}><T vi={prev.titleVi} en={prev.titleEn || prev.titleVi} /></div>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={`/tong-luan/${next.slug}`}
                  className={`${styles.neighbour} ${styles.neighbourNext}`}
                >
                  <div className={styles.neighbourLabel}>
                    <T vi="Chương sau" en="Next" />
                  </div>
                  <div className={styles.neighbourTitle}><T vi={next.titleVi} en={next.titleEn || next.titleVi} /></div>
                </Link>
              )}
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
