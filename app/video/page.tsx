import type { Metadata } from 'next';
import Link from 'next/link';
import { Play } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { getAllVideos } from '@/lib/videos';
import styles from './video.module.css';

export const metadata: Metadata = {
  title: 'Video · Hỏi Đáp Công Giáo',
  description: 'Các video ngắn về đức tin Công giáo — hộ giáo, Kinh Thánh và đời sống Kitô hữu.',
};

export default function VideoIndexPage() {
  const videos = getAllVideos();
  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <div className={styles.head}>
          <div className={styles.eyebrow}>
            <T vi="Video" en="Videos" />
          </div>
          <h1 className={styles.title}>
            <T vi="Video" en="Videos" />
          </h1>
          <p className={styles.sub}>
            <T
              vi="Các video ngắn về đức tin Công giáo — hộ giáo, Kinh Thánh và đời sống Kitô hữu."
              en="Short videos on the Catholic faith — apologetics, Scripture, and Christian life."
            />
          </p>
        </div>

        <div className={styles.grid}>
          {videos.map((v) => (
            <Link key={v.slug} href={`/video/${v.slug}`} className={styles.card}>
              <span className={styles.thumbWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt=""
                  className={styles.thumb}
                  loading="lazy"
                />
                {v.duration && <span className={styles.duration}>{v.duration}</span>}
                <span className={styles.playDot}>
                  <Play size={22} fill="currentColor" strokeWidth={0} />
                </span>
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>
                  {v.titleEn ? (
                    <>
                      <span className="bi-vi">{v.title}</span>
                      <span className="bi-en">{v.titleEn}</span>
                    </>
                  ) : (
                    v.title
                  )}
                </span>
                <span className={styles.cardSummary}>
                  {v.summaryEn ? (
                    <>
                      <span className="bi-vi">{v.summary}</span>
                      <span className="bi-en">{v.summaryEn}</span>
                    </>
                  ) : (
                    v.summary
                  )}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
