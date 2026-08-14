import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { CouncilsBrowser } from '@/components/cong-dong/CouncilsBrowser';
import Image from 'next/image';
import { getEraGroups, getAllCouncils } from '@/lib/councilsV2';
import styles from './cong-dong.module.css';

// Re-pick the featured 3 on every request (random on load).
export const dynamic = 'force-dynamic';

function pickThree<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 3);
}

const HERO_TITLE = { vi: 'Các Công Đồng Chung', en: 'The Ecumenical Councils' };
const HERO_LEDE = {
  vi: 'Từ Nicêa (325) đến Vaticanô II (1962–1965) — hai mươi mốt công đồng chung, nơi Hội Thánh cùng nhau xác định đức tin. Xếp theo dòng thời gian; vào bất cứ đâu cũng được.',
  en: 'From Nicaea (325) to Vatican II (1962–1965) — the twenty-one ecumenical councils, where the Church defined the faith together. Along the line of time; start anywhere.',
};
const WHERE_TO_START = { vi: 'Bắt đầu từ đâu', en: 'Where to start' };

export default function CongDongIndexPage() {
  const groups = getEraGroups();
  const pool = getAllCouncils().filter((c) => c.image?.available && c.image.src);
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
              value={{ vi: 'Công Đồng', en: 'Councils' }}
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
          {featured.length > 0 && (
            <div className={styles.featured}>
              <Bi2
                value={WHERE_TO_START}
                as="div"
                className={styles.starterKicker}
                enRecessedClassName={styles.starterKickerEnRecessed}
              />
              <div className={styles.featuredGrid}>
                {featured.map((c) => (
                  <a key={c.slug} href={`/cong-dong/${c.slug}`} className={styles.featuredCard}>
                    <span className={styles.featuredPortrait}>
                      <Image src={c.image.src} alt={c.name.vi} fill sizes="56px" className={styles.featuredImg} />
                    </span>
                    <div className={styles.featuredInfo}>
                      <Bi2 value={c.name} as="div" className={styles.featuredName} />
                      <Bi2
                        value={c.subtitle}
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
          )}
        </div>

        <CouncilsBrowser groups={groups} />
      </div>
    </>
  );
}
