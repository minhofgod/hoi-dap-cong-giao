import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { FathersBrowser } from '@/components/giao-phu/FathersBrowser';
import Image from 'next/image';
import { getEraGroups, getFigureBySlug } from '@/lib/churchFathersV2';
import styles from './giao-phu.module.css';

// Re-pick the featured 3 on every request (random on load).
export const dynamic = 'force-dynamic';

// Pool of Fathers (each has a portrait) + a one-line "why" — 3 are drawn at random per load.
const FEATURED_POOL: { slug: string; why: { vi: string; en: string } }[] = [
  { slug: 'ignatius-of-antioch', why: { vi: 'Vị tử đạo với bảy bức thư ngắn và một câu nói để đời.', en: 'A martyr with seven short letters and one line for the ages.' } },
  { slug: 'polycarp-of-smyrna', why: { vi: 'Môn đệ của thánh Gioan Tông Đồ, tử đạo khi đã cao niên.', en: 'A disciple of the Apostle John, martyred in old age.' } },
  { slug: 'justin-martyr', why: { vi: 'Triết gia trở lại đạo, người đầu tiên trình bày đức tin cho thế giới ngoại giáo.', en: 'A philosopher-convert who first explained the faith to the pagan world.' } },
  { slug: 'athanasius-of-alexandria', why: { vi: 'Một mình đứng vững bảo vệ tín điều Nicêa qua năm lần lưu đày.', en: 'Stood alone for the Nicene faith through five exiles.' } },
  { slug: 'basil-of-caesarea', why: { vi: 'Cha đẻ đời sống đan tu Đông phương, nhà bảo vệ thần tính Chúa Thánh Thần.', en: 'Father of Eastern monasticism, defender of the Spirit’s divinity.' } },
  { slug: 'gregory-of-nazianzus', why: { vi: '“Nhà Thần Học” — lời lẽ tinh tế về mầu nhiệm Ba Ngôi.', en: '“The Theologian” — luminous on the mystery of the Trinity.' } },
  { slug: 'ambrose-of-milan', why: { vi: 'Giám mục đã rửa tội cho Augustinô và dám dạy cả hoàng đế.', en: 'The bishop who baptized Augustine and instructed emperors.' } },
  { slug: 'john-chrysostom', why: { vi: '“Miệng Vàng” — nhà giảng thuyết lừng danh nhất Đông phương.', en: '“Golden-mouth” — the East’s most celebrated preacher.' } },
  { slug: 'jerome', why: { vi: 'Dịch trọn bộ Kinh Thánh sang tiếng Latinh — bản Vulgata.', en: 'Translated the whole Bible into Latin — the Vulgate.' } },
  { slug: 'augustine-of-hippo', why: { vi: 'Nhà thần học có ảnh hưởng nhất Tây phương — nơi khởi đầu tốt nhất.', en: 'The West’s most influential theologian — the best place to start.' } },
];

function pickThree<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 3);
}

const HERO_TITLE = { vi: 'Các Giáo Phụ Hội Thánh', en: 'The Church Fathers' };
const HERO_LEDE = {
  vi: 'Từ Clêmentê thành Rôma đến Gioan Đamascô — bảy thế kỷ đầu, xếp theo dòng thời gian. Không cần đọc theo thứ tự; vào bất cứ đâu cũng được.',
  en: 'From Clement of Rome to John of Damascus, along the line of time. Nothing here needs to be read in order — start anywhere.',
};
const WHERE_TO_START = { vi: 'Bắt đầu từ đâu', en: 'Where to start' };

export default function GiaoPhuIndexPage() {
  const groups = getEraGroups();
  const pool = FEATURED_POOL.map(({ slug, why }) => ({ figure: getFigureBySlug(slug), why })).filter(
    (x): x is { figure: NonNullable<ReturnType<typeof getFigureBySlug>>; why: { vi: string; en: string } } =>
      !!x.figure && !!x.figure.portrait?.available && !!x.figure.portrait.src
  );
  const featured = pickThree(pool);

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <LanguageToggle />
        </div>
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <Bi2
              value={{ vi: 'Giáo Phụ', en: 'Church Fathers' }}
              as="div"
              className={styles.eyebrow}
              enRecessedClassName={styles.eyebrowEnRecessed}
            />
            <Bi2 value={HERO_TITLE} as="h1" className={styles.heroTitle} />
            <Bi2
              value={HERO_LEDE}
              as="p"
              viClassName={styles.heroLedeVi}
              enClassName={styles.heroLedeEn}
              enRecessedClassName={styles.heroLedeEnRecessed}
            />
          </div>
          <div className={styles.featured}>
            <Bi2
              value={WHERE_TO_START}
              as="div"
              className={styles.starterKicker}
              enRecessedClassName={styles.starterKickerEnRecessed}
            />
            <div className={styles.featuredGrid}>
              {featured.map(({ figure, why }) => (
                <a key={figure.slug} href={`/giao-phu/${figure.slug}`} className={styles.featuredCard}>
                  <span className={styles.featuredPortrait}>
                    <Image
                      src={figure.portrait.src as string}
                      alt={figure.name.vi}
                      fill
                      sizes="56px"
                      className={styles.featuredImg}
                    />
                  </span>
                  <div className={styles.featuredInfo}>
                    <Bi2 value={figure.name} as="div" className={styles.featuredName} />
                    <Bi2
                      value={why}
                      as="div"
                      viClassName={styles.featuredWhy}
                      enClassName={styles.featuredWhy}
                      enRecessedClassName={styles.featuredWhyRecessed}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <FathersBrowser groups={groups} />
      </div>
    </>
  );
}
