import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { T } from '@/components/T';
import { getChaptersByPart } from '@/lib/tongLuan';
import { TONG_LUAN_ENABLED } from '@/lib/tongLuanFlag';
import styles from './tong-luan.module.css';

export const metadata: Metadata = {
  title: 'Tổng luận Thần học · Hỏi Đáp Công Giáo',
  description:
    'Đọc bộ Tổng luận thần học của Thánh Tôma Aquinô qua 35 chương ngắn: Thiên Chúa, con người, nhân đức, Đức Kitô và các Bí tích.',
};

export default function TongLuanIndexPage() {
  if (!TONG_LUAN_ENABLED) notFound();
  const groups = getChaptersByPart();

  return (
    <>
      <SiteHeader />
      <main className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <T vi="Tổng luận Thần học" en="The Summa, Explained" />
          </div>
          <h1 className={styles.title}>
            <T vi="Tổng luận Thần học" en="The Summa, Explained" />
          </h1>
          <p className={styles.subtitle}>
            <T
              vi="Thánh Tôma Aquinô (k. 1225 – 1274)"
              en="St Thomas Aquinas (c. 1225 – 1274)"
            />
          </p>
          <p className={styles.lede}>
            <T
              vi="Bộ Tổng luận thần học là tác phẩm lớn nhất của Thánh Tôma Aquinô — và cũng là một bộ sách khiến nhiều người ngại mở ra. Loạt 35 chương ngắn này đi theo đúng lộ trình của ngài: từ Thiên Chúa, qua công trình sáng tạo và con người, đến Đức Kitô và các Bí tích. Mỗi chương ghi rõ vị trí trong bộ gốc, để bạn có thể tra cứu và tự kiểm chứng."
              en="The Summa Theologiae is Aquinas's greatest work — and the one most people are afraid to open. These 35 short chapters follow his own route: from God, through creation and man, to Christ and the sacraments. Each names its exact place in the original, so you can look it up and check it yourself."
            />
          </p>
        </header>

        {groups.map(({ part, chapters }) => (
          <section key={part.id} className={styles.part}>
            <div className={styles.partHead}>
              <h2 className={styles.partTitle}>
                <T vi={part.vi} en={part.en} />
              </h2>
              <p className={styles.partBlurb}>
                <T vi={part.blurbVi} en={part.blurbEn} />
              </p>
            </div>
            <ul className={styles.chapterList}>
              {chapters.map((c, i) => (
                <li key={c.slug}>
                  <Link href={`/tong-luan/${c.slug}`} className={styles.chapterRow}>
                    <span className={styles.num}>{i + 1}.</span>
                    <span className={styles.rowMain}>
                      <span className={styles.rowTitle}>
                        {c.titleVi}
                        {c.summaSource === 'supplementum' && (
                          <span className={styles.supplTag}>
                            <T vi="Phụ lục" en="Supplement" />
                          </span>
                        )}
                      </span>
                      {c.titleEn && <span className={styles.rowTitleEn}>{c.titleEn}</span>}
                    </span>
                    {c.summaRef && <span className={styles.rowRef}>{c.summaRef}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
