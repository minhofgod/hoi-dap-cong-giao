import Link from 'next/link';
import { Bi2 } from '@/components/giao-phu/Bi2';
import styles from './CarloDedication.module.css';

const KICKER = { vi: 'Lời đề tặng', en: 'Dedication' };

const BODY = {
  vi: 'Phần này được lấy cảm hứng từ Thánh Carlô Acutis (1991 – 2006) — một thiếu niên đã dùng chính khả năng tin học của mình để lập danh mục các phép lạ Thánh Thể được Hội Thánh nhìn nhận, rồi đưa tất cả lên mạng cho mọi người cùng xem, hầu giúp họ đến gần Chúa hơn. Em qua đời ở tuổi mười lăm, hai tuần sau khi triển lãm trực tuyến ấy ra mắt. Chúng tôi tiếp nối công việc ấy bằng những công cụ của thời đại mình — và cố gắng giữ đúng tinh thần của em: trình bày cẩn thận, không thổi phồng.',
  en: 'This section is inspired by St. Carlo Acutis (1991 – 2006) — a teenager who used his own gift for computers to catalogue the Eucharistic miracles the Church recognises and put the whole exhibition online for anyone to see, so that it might bring them closer to God. He died at fifteen, two weeks after that exhibition went live. We continue that work with the tools of our own moment — and try to keep his temper: careful, never overstated.',
};

const LINK = { vi: 'Đọc về Thánh Carlô Acutis', en: 'Read about St. Carlo Acutis' };

/** The visible dedication the owner asked for (docs/phep-la-spec.md, "Carlo Acutis dedication").
 *  Placed high on the section index, paired with the bridge back to his saint page — the reciprocal
 *  of the `carlo-acutis → /phep-la` forward link Session 9 stubbed. */
export function CarloDedication() {
  return (
    <aside className={styles.card}>
      <Bi2
        value={KICKER}
        as="div"
        className={styles.kicker}
        enRecessedClassName={styles.kickerEnRecessed}
      />
      <Bi2
        value={BODY}
        as="p"
        viClassName={styles.body}
        enClassName={styles.body}
        enRecessedClassName={styles.bodyEnRecessed}
      />
      <Link href="/cac-thanh/carlo-acutis" className={styles.link}>
        <Bi2 value={LINK} as="span" className={styles.linkLabel} />
        <span aria-hidden="true"> →</span>
      </Link>
    </aside>
  );
}
