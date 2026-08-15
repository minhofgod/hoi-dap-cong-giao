import Link from 'next/link';
import { Landmark, UserRound } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { HistoryTimeline } from '@/components/lich-su-hoi-thanh/HistoryTimeline';
import { getAllFigures } from '@/lib/churchFathersV2';
import { getAllCouncils } from '@/lib/councilsV2';
import {
  BAND_ORDER,
  BAND_LABEL,
  BAND_SPAN,
  BAND_BLURB,
  bandForYear,
  type TimelineBand,
  type TimelineItem,
} from '@/lib/lich-su-hoi-thanh/bands';
import styles from './lich-su-hoi-thanh.module.css';

export const metadata = {
  title: 'Lịch Sử Hội Thánh / Church History',
  description:
    'Các Giáo Phụ và các Công Đồng Chung trên cùng một dòng thời gian — the Church Fathers and the Ecumenical Councils on one shared timeline.',
};

const HERO_TITLE = { vi: 'Lịch Sử Hội Thánh', en: 'Church History' };
const HERO_LEDE = {
  vi: 'Các Giáo Phụ và các Công Đồng Chung trên cùng một dòng thời gian — từ những chứng nhân đầu tiên nghe chính các Tông đồ, đến hai mươi mốt công đồng nơi Hội Thánh cùng nhau xác định đức tin. Vào bất cứ đâu cũng được.',
  en: 'The Church Fathers and the Ecumenical Councils on one shared line of time — from the first witnesses who heard the Apostles themselves, to the twenty-one councils where the Church defined the faith together. Start anywhere.',
};

/** A Father's placement year: the midpoint of birth and death (their floruit), so they interleave
 *  fairly with the point-in-time councils rather than all clustering at their year of death. */
function floruit(born: number | null, died: number | null): number {
  if (born != null && died != null) return Math.round((born + died) / 2);
  return died ?? born ?? 0;
}

function buildBands(): TimelineBand[] {
  const fathers: TimelineItem[] = getAllFigures().map((f) => ({
    kind: 'father',
    slug: f.slug,
    href: `/giao-phu/${f.slug}`,
    name: f.name,
    meta: f.role,
    dates: f.dates.display,
    year: floruit(f.dates.born, f.dates.died),
    image: { src: f.portrait?.src ?? null, available: !!f.portrait?.available },
  }));

  const councils: TimelineItem[] = getAllCouncils().map((c) => ({
    kind: 'council',
    slug: c.slug,
    href: `/cong-dong/${c.slug}`,
    name: c.name,
    meta: c.subtitle,
    dates: c.dates.display,
    year: c.dates.start ?? c.dates.end ?? 0,
    image: { src: c.image?.src ?? null, available: !!c.image?.available },
  }));

  const all = [...fathers, ...councils];

  return BAND_ORDER.map((id) => ({
    id,
    label: BAND_LABEL[id],
    span: BAND_SPAN[id],
    blurb: BAND_BLURB[id],
    items: all
      .filter((i) => bandForYear(i.year) === id)
      // Interleave Fathers and Councils strictly by year; on a tie, the Father (whose floruit spans
      // the year) sits just above the Council event of that same year.
      .sort((a, b) => a.year - b.year || (a.kind === b.kind ? 0 : a.kind === 'father' ? -1 : 1)),
  })).filter((b) => b.items.length > 0);
}

export default function ChurchHistoryHubPage() {
  const bands = buildBands();
  const fathersTotal = bands.reduce((n, b) => n + b.items.filter((i) => i.kind === 'father').length, 0);
  const councilsTotal = bands.reduce((n, b) => n + b.items.filter((i) => i.kind === 'council').length, 0);

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
              value={{ vi: 'Lịch Sử & Chứng Nhân', en: 'History & Witnesses' }}
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

            <div className={styles.quickLinks}>
              <Link href="/giao-phu" className={styles.quickLink}>
                <span className={`${styles.quickDot} ${styles.quickDotFather}`} aria-hidden="true" />
                <Bi2 value={{ vi: 'Xem tất cả Giáo Phụ', en: 'See all Church Fathers' }} as="span" />
                <span className={styles.quickArrow} aria-hidden="true">→</span>
              </Link>
              <Link href="/cong-dong" className={styles.quickLink}>
                <span className={`${styles.quickDot} ${styles.quickDotCouncil}`} aria-hidden="true" />
                <Bi2 value={{ vi: 'Xem tất cả Công Đồng', en: 'See all Councils' }} as="span" />
                <span className={styles.quickArrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <aside className={styles.legend}>
            <Bi2
              value={{ vi: 'Chú giải', en: 'Legend' }}
              as="div"
              className={styles.legendTitle}
              enRecessedClassName={styles.legendTitleEnRecessed}
            />
            <div className={styles.legendRow}>
              <span className={`${styles.legendMarker} ${styles.legendMarkerFather}`} aria-hidden="true">
                <UserRound size={15} strokeWidth={2.2} />
              </span>
              <div className={styles.legendText}>
                <Bi2 value={{ vi: 'Giáo Phụ', en: 'Church Father' }} as="span" className={styles.legendName} />
                <span className={styles.legendCount}>{fathersTotal}</span>
              </div>
            </div>
            <div className={styles.legendRow}>
              <span className={`${styles.legendMarker} ${styles.legendMarkerCouncil}`} aria-hidden="true">
                <Landmark size={15} strokeWidth={2.2} />
              </span>
              <div className={styles.legendText}>
                <Bi2 value={{ vi: 'Công Đồng Chung', en: 'Ecumenical Council' }} as="span" className={styles.legendName} />
                <span className={styles.legendCount}>{councilsTotal}</span>
              </div>
            </div>
          </aside>
        </div>

        <HistoryTimeline bands={bands} />
      </div>
    </>
  );
}
