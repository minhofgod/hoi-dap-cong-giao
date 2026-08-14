'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState, type ComponentType } from 'react';
import {
  Search,
  BookOpen,
  Droplet,
  Flame,
  Wheat,
  HeartHandshake,
  Cross,
  Hand,
  Heart,
  Flower2,
  Scroll,
  ScrollText,
  Sparkles,
} from 'lucide-react';
import { findArticleStartForParagraph } from '@/lib/tocUtils';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Toc, Paragraph } from '@/lib/types';
import { T } from './T';
import styles from './CatechismBrowser.module.css';

type Topic = {
  id: string;
  vi: string;
  en: string;
  desc: string;
  descEn: string;
  href: string;
  range: string;
  keywords: string; // extra vi/en synonyms for the card filter
  Icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
};

// Curated topics → the article each one opens the reader at (verified against the TOC).
const TOPICS: Topic[] = [
  { id: 'rua-toi', vi: 'Rửa Tội', en: 'Baptism', desc: 'Bí tích khai tâm, tái sinh trong nước và Thánh Thần.', descEn: 'The sacrament of initiation — rebirth in water and the Spirit.', href: '/giao-ly/1210', range: '1213–1284', keywords: 'baptism thanh tay nuoc khai tam bi tich', Icon: Droplet },
  { id: 'them-suc', vi: 'Thêm Sức', en: 'Confirmation', desc: 'Được đóng ấn và kiện toàn bởi Chúa Thánh Thần.', descEn: 'Sealed and perfected by the Holy Spirit.', href: '/giao-ly/1285', range: '1285–1321', keywords: 'confirmation chua thanh than bi tich', Icon: Flame },
  { id: 'thanh-the', vi: 'Thánh Thể', en: 'Eucharist', desc: 'Mình và Máu Chúa Kitô — nguồn mạch đời sống Kitô hữu.', descEn: 'The Body and Blood of Christ — the source of Christian life.', href: '/giao-ly/1322', range: '1322–1419', keywords: 'eucharist thanh le mass minh mau chua bi tich', Icon: Wheat },
  { id: 'hoa-giai', vi: 'Hòa Giải', en: 'Reconciliation', desc: 'Ơn tha thứ tội lỗi và giao hòa với Thiên Chúa.', descEn: 'Forgiveness of sins and reconciliation with God.', href: '/giao-ly/1420', range: '1422–1498', keywords: 'penance confession xung toi thong hoi tha thu bi tich', Icon: HeartHandshake },
  { id: 'xuc-dau', vi: 'Xức Dầu Bệnh Nhân', en: 'Anointing of the Sick', desc: 'Ơn nâng đỡ và chữa lành cho người đau yếu.', descEn: 'Grace, strength, and healing for the sick.', href: '/giao-ly/1499', range: '1499–1532', keywords: 'anointing sick benh nhan chua lanh bi tich', Icon: Cross },
  { id: 'truyen-chuc', vi: 'Truyền Chức Thánh', en: 'Holy Orders', desc: 'Chức giám mục, linh mục và phó tế.', descEn: 'The order of bishops, priests, and deacons.', href: '/giao-ly/1533', range: '1536–1600', keywords: 'holy orders linh muc giam muc pho te chuc thanh bi tich', Icon: Hand },
  { id: 'hon-phoi', vi: 'Hôn Phối', en: 'Matrimony', desc: 'Giao ước tình yêu vợ chồng trong Chúa.', descEn: 'The covenant of married love in the Lord.', href: '/giao-ly/1601', range: '1601–1666', keywords: 'marriage matrimony vo chong gia dinh bi tich', Icon: Heart },
  { id: 'muoi-dieu-ran', vi: 'Mười Điều Răn', en: 'The Ten Commandments', desc: 'Luật của Thiên Chúa cho đời sống luân lý.', descEn: "God's law for the moral life.", href: '/giao-ly/2052', range: '2052–2557', keywords: 'ten commandments dieu ran thap gioi luan ly', Icon: Scroll },
  { id: 'kinh-tin-kinh', vi: 'Kinh Tin Kính', en: 'The Creed', desc: 'Điều chúng ta tin, tuyên xưng qua các tín điều.', descEn: 'What we believe, professed in the articles of faith.', href: '/giao-ly/185', range: '185–1065', keywords: 'creed tin kinh tuyen xung duc tin tin dieu', Icon: ScrollText },
  { id: 'kinh-lay-cha', vi: 'Kinh Lạy Cha', en: 'The Our Father', desc: 'Lời kinh chính Chúa Giêsu đã dạy.', descEn: 'The prayer Jesus himself taught.', href: '/giao-ly/2759', range: '2759–2865', keywords: 'our father lord prayer lay cha cau nguyen kinh', Icon: Sparkles },
  { id: 'duc-maria', vi: 'Đức Maria', en: 'Mary', desc: 'Mẹ Đức Kitô và Mẹ Hội Thánh.', descEn: 'Mother of Christ and Mother of the Church.', href: '/giao-ly/963', range: '963–975', keywords: 'mary maria me thien chua duc me', Icon: Flower2 },
];

// Topics with a sacred-art banner in /public/images/catechism/<id>.jpg (all 11 now covered).
const WITH_IMAGE = new Set([
  'rua-toi',
  'them-suc',
  'thanh-the',
  'hoa-giai',
  'xuc-dau',
  'truyen-chuc',
  'hon-phoi',
  'muoi-dieu-ran',
  'kinh-tin-kinh',
  'kinh-lay-cha',
  'duc-maria',
]);

const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function CatechismBrowser({ toc, total }: { toc: Toc; total: number }) {
  const uiLang = useLang();
  const [query, setQuery] = useState('');
  const [fuse, setFuse] = useState<import('fuse.js').default<Paragraph> | null>(null);

  const onSearchFocus = async () => {
    if (fuse) return;
    const res = await fetch('/search-content.json');
    const data: Paragraph[] = await res.json();
    const Fuse = (await import('fuse.js')).default;
    setFuse(new Fuse(data, { keys: ['vi', 'en'], threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2 }));
  };

  const q = query.trim();

  const filteredTopics = useMemo(() => {
    if (!q) return TOPICS;
    const nq = norm(q);
    return TOPICS.filter((t) => norm(`${t.vi} ${t.en} ${t.keywords}`).includes(nq));
  }, [q]);

  const num = Number(q);
  const numJump =
    /^\d+$/.test(q) && num >= 1 && num <= total
      ? { n: num, start: findArticleStartForParagraph(toc, num) ?? num }
      : null;

  const textResults = useMemo(() => {
    if (!fuse || q.length < 2) return [];
    return fuse.search(q).slice(0, 20);
  }, [q, fuse]);

  const searching = q.length > 0;
  const noResults = searching && filteredTopics.length === 0 && !numJump && textResults.length === 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>
          <T vi="Giáo Lý" en="Catechism" />
        </div>
        <h1 className={styles.title}>
          <T vi="Giáo Lý Hội Thánh Công Giáo" en="Catechism of the Catholic Church" />
        </h1>
        <p className={styles.subtitle}>
          <T
            vi={`${total} số · song ngữ Việt–Anh. Chọn một chủ đề để bắt đầu, hoặc tìm theo số đoạn và từ khoá.`}
            en={`${total} paragraphs · Vietnamese–English. Pick a topic to begin, or search by number or keyword.`}
          />
        </p>
      </div>

      <div className={styles.searchWrap}>
        <Search size={18} strokeWidth={2.2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder={
            uiLang === 'en'
              ? 'Search topics, paragraph numbers, or keywords…'
              : 'Tìm chủ đề, số đoạn, hoặc từ khoá…'
          }
          value={query}
          onFocus={onSearchFocus}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {(!searching || filteredTopics.length > 0) && (
        <section className={styles.section}>
          {searching && (
            <div className={styles.sectionLabel}>
              <T vi="Chủ đề" en="Topics" />
            </div>
          )}
          <div className={styles.grid}>
            {filteredTopics.map((t) => (
              <Link key={t.id} href={t.href} className={styles.card}>
                {WITH_IMAGE.has(t.id) && (
                  <span className={styles.banner}>
                    <Image
                      src={`/images/catechism/${t.id}.jpg`}
                      alt={t.vi}
                      fill
                      sizes="(max-width: 900px) 50vw, 240px"
                      className={styles.bannerImg}
                    />
                  </span>
                )}
                <div className={styles.cardBody}>
                  {!WITH_IMAGE.has(t.id) && (
                    <t.Icon size={26} strokeWidth={1.6} className={styles.cardIcon} />
                  )}
                  <div className={styles.cardName}>{t.vi}</div>
                  <div className={styles.cardEn}>{t.en}</div>
                  <div className={styles.cardDesc}>
                    <T vi={t.desc} en={t.descEn} />
                  </div>
                  <div className={styles.cardRange}>{t.range}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {searching && (numJump || textResults.length > 0) && (
        <section className={styles.section}>
          <div className={styles.sectionLabel}>
            <T vi="Trong Giáo Lý" en="In the Catechism" />
          </div>
          <div className={styles.results}>
            {numJump && (
              <Link href={`/giao-ly/${numJump.start}#${numJump.n}`} className={styles.resultRow}>
                <span className={styles.resultNum}>§{numJump.n}</span>
                <span className={styles.resultText}>
                  <T vi={`Đi tới số ${numJump.n}`} en={`Go to §${numJump.n}`} />
                </span>
              </Link>
            )}
            {textResults.map((r) => {
              const start = findArticleStartForParagraph(toc, r.item.id) ?? r.item.id;
              return (
                <Link key={r.item.id} href={`/giao-ly/${start}#${r.item.id}`} className={styles.resultRow}>
                  <span className={styles.resultNum}>§{r.item.id}</span>
                  <span className={styles.resultText}>{r.item.vi}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {noResults && (
        <div className={styles.empty}>
          {uiLang === 'en'
            ? `No topics or paragraphs found for “${q}”.`
            : `Không tìm thấy chủ đề hay đoạn nào cho “${q}”.`}
        </div>
      )}

      <div className={styles.footerRow}>
        <Link href="/giao-ly/1" className={styles.readAll}>
          <BookOpen size={18} strokeWidth={2} />
          <T vi="Đọc toàn bộ Giáo Lý từ đầu" en="Read the whole Catechism from the start" />
        </Link>
      </div>
    </div>
  );
}
