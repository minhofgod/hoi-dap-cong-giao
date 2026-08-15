import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { SaintsBrowser } from '@/components/cac-thanh/SaintsBrowser';
import { getGroupBlocks } from '@/lib/saintsV2';
import styles from './cac-thanh.module.css';

const HERO_TITLE = { vi: 'Các Thánh', en: 'The Saints' };
const HERO_LEDE = {
  vi: 'Không phải để bao quát hết, mà để chọn lọc — những gương mặt bạn nên biết. Bắt đầu từ các Thánh Tử Đạo Việt Nam, rồi tới những chứng nhân thời hiện đại, những người trở lại, và những vị bạn đường thân quen. Vào bất cứ đâu cũng được.',
  en: 'Not to cover everyone, but to curate — the faces worth knowing. Beginning with the Martyrs of Vietnam, then modern witnesses, converts, and beloved companions. Start anywhere.',
};

export default function CacThanhIndexPage() {
  const groups = getGroupBlocks();

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
              value={{ vi: 'Các Thánh', en: 'Saints' }}
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
        </div>

        <SaintsBrowser groups={groups} />
      </div>
    </>
  );
}
