import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReaderHeader } from '@/components/ReaderHeader';
import { GiaoLyTree } from '@/components/GiaoLyTree';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ReaderRightRail } from '@/components/ReaderRightRail';
import { ReaderKeyboardShortcuts } from '@/components/ReaderKeyboardShortcuts';
import { ProgressTracker } from '@/components/ProgressTracker';
import {
  content,
  toc,
  flatArticles,
  getArticleByStartNumber,
  getAdjacentArticlesByStartNumber,
  getParagraphsForArticle,
} from '@/lib/content';
import { formatTocLabel } from '@/lib/titleFormat';
import { pageMetadata, plainExcerpt, resolveParentImages } from '@/lib/pageMetadata';
import type { Metadata, ResolvingMetadata } from 'next';
import styles from './reader.module.css';

export function generateStaticParams() {
  return flatArticles.map((a) => ({ number: String(a.paragraphRange[0]) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ number: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { number } = await params;
  const article = getArticleByStartNumber(Number(number));
  if (!article) return {};
  const label = formatTocLabel(article);
  const firstPara = getParagraphsForArticle(article.id)[0]?.vi ?? '';
  return pageMetadata({
    title: `${label.title} (GLHTCG)`,
    description: plainExcerpt(firstPara),
    path: `/giao-ly/${article.paragraphRange[0]}`,
    type: 'article',
    images: await resolveParentImages(parent),
  });
}

export default async function GiaoLyReaderPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;
  const article = getArticleByStartNumber(Number(number));
  if (!article) notFound();

  const paragraphs = getParagraphsForArticle(article.id);
  const { prev, next } = getAdjacentArticlesByStartNumber(Number(number));
  const label = formatTocLabel(article);
  const breadcrumb = article.breadcrumbVi
    .map((t) => formatTocLabel({ titleVi: t, paragraphRange: article.paragraphRange }).title)
    .join(' · ');

  return (
    <>
    <ReaderHeader />
    <div className={styles.grid}>
      <ReaderKeyboardShortcuts paragraphIds={paragraphs.map((p) => p.id)} />
      <ProgressTracker paragraphIds={paragraphs.map((p) => p.id)} />

      <div className={styles.treeCol}>
        <GiaoLyTree toc={toc} currentArticleId={article.id} totalParagraphs={content.length} />
      </div>

      <div className={styles.readingCol}>
        <div className={styles.readerHeader}>
          <div className={styles.breadcrumb}>{breadcrumb}</div>
          <LanguageToggle />
        </div>

        {label.levelWord && label.numeral && (
          <div className={styles.eyebrow}>
            {label.levelWord.toUpperCase()} {label.numeral}
          </div>
        )}
        <h1 className={styles.title}>{label.title}</h1>
        <div className={styles.rangeLabel}>Số {label.rangeCaption}</div>

        <div className={styles.paragraphs}>
          {paragraphs.map((p) => (
            <div key={p.id} id={String(p.id)} className={styles.paragraphRow}>
              <a href={`#${p.id}`} className={styles.paraNumber}>
                {p.id}
              </a>
              <div className={styles.paraTextBlock}>
                <p className="viText">{p.vi}</p>
                <p className="enText">{p.en}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.navRow}>
          {prev ? (
            <Link href={`/giao-ly/${prev.paragraphRange[0]}`} className={styles.navPrev}>
              ← {formatTocLabel(prev).title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/giao-ly/${next.paragraphRange[0]}`} className={styles.navNext}>
              {formatTocLabel(next).title} →
            </Link>
          )}
        </div>
      </div>

      <div className={styles.railCol}>
        <ReaderRightRail paragraphs={paragraphs} articleTitle={label.title} />
      </div>
    </div>
    </>
  );
}
