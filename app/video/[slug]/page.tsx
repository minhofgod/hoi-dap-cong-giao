import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { VideoEmbed } from '@/components/VideoEmbed';
import { T } from '@/components/T';
import { getAllVideos, getVideoBySlug } from '@/lib/videos';
import { getAllQuestions } from '@/lib/giaiDap';
import { relatedByTaxonomy } from '@/lib/relatedContent';
import styles from '../video.module.css';

export function generateStaticParams() {
  return getAllVideos().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) return { title: 'Video · Hỏi Đáp Công Giáo' };
  return { title: `${v.title} · Hỏi Đáp Công Giáo`, description: v.summary };
}

export default async function VideoWatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  // Other videos to suggest at the end (in display order, current one excluded).
  const more = getAllVideos()
    .filter((v) => v.slug !== slug)
    .slice(0, 6);

  // Q&As whose taxonomy overlaps this video (auto tag/category match; explicit `related_qa` pinned
  // first). One per cluster so a single topic doesn't fill the list — see lib/relatedContent.
  const relatedQuestions = relatedByTaxonomy(video, getAllQuestions(), {
    limit: 4,
    pins: video.relatedQa,
    dedupeKey: (q) => q.topic,
  });

  return (
    <>
      <SiteHeader />
      <main className={styles.watchWrap}>
        <Link href="/video" className={styles.back}>
          ‹ <T vi="Tất cả video" en="All videos" />
        </Link>
        <h1 className={styles.watchTitle}>
          {video.titleEn ? (
            <>
              <span className="bi-vi">{video.title}</span>
              <span className="bi-en">{video.titleEn}</span>
            </>
          ) : (
            video.title
          )}
        </h1>

        <VideoEmbed id={video.youtubeId} title={video.title} />

        {video.summary &&
          (video.summaryEn ? (
            <>
              <p className={`${styles.watchSummary} bi-vi`}>{video.summary}</p>
              <p className={`${styles.watchSummary} bi-en`}>{video.summaryEn}</p>
            </>
          ) : (
            <p className={styles.watchSummary}>{video.summary}</p>
          ))}

        {video.hasBodyEn ? (
          <>
            <article
              className={`${styles.body} bi-vi`}
              dangerouslySetInnerHTML={{ __html: video.bodyHtml }}
            />
            <article
              className={`${styles.body} bi-en`}
              dangerouslySetInnerHTML={{ __html: video.bodyHtmlEn }}
            />
          </>
        ) : (
          video.hasBody && (
            <article className={styles.body} dangerouslySetInnerHTML={{ __html: video.bodyHtml }} />
          )
        )}

        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ytLink}
        >
          <T vi="Xem trên YouTube ↗" en="Watch on YouTube ↗" />
        </a>

        {relatedQuestions.length > 0 && (
          <section className={styles.relatedQa}>
            <h2 className={styles.relatedQaTitle}>
              <T vi="Câu hỏi liên quan" en="Related questions" />
            </h2>
            <ul className={styles.relatedQaList}>
              {relatedQuestions.map((q) => (
                <li key={q.slug} className={styles.relatedQaRow}>
                  <Link href={`/giai-dap/${q.slug}`} className={styles.relatedQaLink}>
                    {q.questionEn ? (
                      <>
                        <span className="bi-vi">{q.questionVi}</span>
                        <span className="bi-en">{q.questionEn}</span>
                      </>
                    ) : (
                      q.questionVi
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {more.length > 0 && (
          <section className={styles.more}>
            <h2 className={styles.moreTitle}>
              <T vi="Video khác" en="More videos" />
            </h2>
            <div className={styles.moreGrid}>
              {more.map((v) => (
                <Link key={v.slug} href={`/video/${v.slug}`} className={styles.moreCard}>
                  <span className={styles.moreThumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
                    <img
                      src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className={styles.moreThumbImg}
                    />
                    {v.duration && <span className={styles.duration}>{v.duration}</span>}
                  </span>
                  <span className={styles.moreCardTitle}>{v.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
