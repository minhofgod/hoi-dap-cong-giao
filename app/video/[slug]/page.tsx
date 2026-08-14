import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { VideoEmbed } from '@/components/VideoEmbed';
import { getAllVideos, getVideoBySlug } from '@/lib/videos';
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

  return (
    <>
      <SiteHeader />
      <main className={styles.watchWrap}>
        <Link href="/video" className={styles.back}>
          ‹ Tất cả video
        </Link>
        <h1 className={styles.watchTitle}>{video.title}</h1>

        <VideoEmbed id={video.youtubeId} title={video.title} />

        {video.summary && <p className={styles.watchSummary}>{video.summary}</p>}

        {video.hasBody && (
          <article className={styles.body} dangerouslySetInnerHTML={{ __html: video.bodyHtml }} />
        )}

        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ytLink}
        >
          Xem trên YouTube ↗
        </a>
      </main>
    </>
  );
}
