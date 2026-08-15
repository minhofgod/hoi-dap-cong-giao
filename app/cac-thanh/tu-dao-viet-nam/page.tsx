import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { getGroupBlocks, type Bi } from '@/lib/saintsV2';
import { enrichBi } from '@/lib/bibleRefs';
import styles from './overview.module.css';

export const metadata: Metadata = {
  title: 'Các Thánh Tử Đạo Việt Nam · Martyrs of Vietnam',
  description:
    'Tổng quan 117 vị Thánh Tử Đạo Việt Nam được tuyên thánh năm 1988, cùng Á Thánh Anrê Phú Yên, vị tử đạo tiên khởi.',
};

const BACK = { vi: '← Các Thánh', en: '← The Saints' };
const HERO_EYEBROW = { vi: 'Di sản Việt Nam', en: 'Vietnamese heritage' };
const HERO_TITLE = {
  vi: '117 vị Thánh Tử Đạo — và Á Thánh Anrê Phú Yên',
  en: 'The 117 Martyrs — and Bl. Anrê Phú Yên',
};
const HERO_LEDE = {
  vi: 'Trong hơn một thế kỷ, hàng trăm ngàn người Công giáo Việt Nam đã lấy máu mình làm chứng cho đức tin. Năm 1988, Đức Gioan Phaolô II tuyên thánh cho 117 vị tiêu biểu. Đây là bức tranh lớn — trước khi bạn gặp từng khuôn mặt.',
  en: 'For more than a century, hundreds of thousands of Vietnamese Catholics bore witness to the faith with their blood. In 1988, John Paul II canonized 117 of them. This is the whole picture — before you meet each face.',
};

const STATS: { num: string; label: Bi }[] = [
  { num: '117', label: { vi: 'Được tuyên thánh ngày 19-6-1988', en: 'Canonized on 19 June 1988' } },
  { num: '~130.000', label: { vi: 'Ước tính số người đã tử đạo qua các đời bách hại', en: 'Estimated martyrs across the persecutions' } },
  { num: '1', label: { vi: 'Người phụ nữ trong số 117: Thánh Anê Lê Thị Thành', en: 'The one woman among the 117: St. Agnes Lê Thị Thành' } },
  { num: '24-11', label: { vi: 'Lễ kính chung các Thánh Tử Đạo Việt Nam', en: 'Their shared feast day' } },
];

const SEC_PERSECUTION = { vi: 'Hơn một thế kỷ bách hại', en: 'More than a century of persecution' };
const PERSECUTION_BODY: Bi[] = [
  {
    vi: 'Kể từ khi Tin Mừng được rao giảng trên đất Việt vào thế kỷ 17, đức tin Công giáo nhiều lần bị đặt ngoài vòng pháp luật. Các sắc lệnh cấm đạo nối tiếp nhau dưới thời chúa Trịnh, chúa Nguyễn, rồi nặng nề nhất dưới ba vị vua nhà Nguyễn: Minh Mạng, Thiệu Trị và Tự Đức, trong khoảng những năm 1820 đến 1862. Người ta ước tính có từ 130.000 đến hơn 300.000 người Công giáo đã bị giết vì đức tin trong các cuộc bách hại ấy.',
    en: 'From the time the Gospel was first preached in Vietnam in the 17th century, the Catholic faith was repeatedly outlawed. Edict followed edict under the Trịnh and Nguyễn lords, and most severely under three Nguyễn emperors — Minh Mạng, Thiệu Trị, and Tự Đức — roughly between 1820 and 1862. It is estimated that between 130,000 and more than 300,000 Catholics were killed for the faith in those persecutions.',
  },
  {
    vi: 'Trong số vô vàn chứng nhân ấy, 117 vị được chọn làm đại diện tiêu biểu. Các ngài gồm 8 giám mục, 50 linh mục và 59 giáo dân; 96 vị là người Việt, 11 vị là tu sĩ Đa Minh người Tây Ban Nha, và 10 vị là thừa sai người Pháp thuộc Hội Thừa Sai Paris. Trong số giáo dân có các thầy giảng, một chủng sinh, và một người mẹ — bà Anê Lê Thị Thành, người phụ nữ duy nhất trong danh sách.',
    en: 'Among that vast host of witnesses, 117 were chosen as representative. They include 8 bishops, 50 priests, and 59 lay faithful; 96 were Vietnamese, 11 were Spanish Dominican friars, and 10 were French missionaries of the Paris Foreign Missions Society. Among the laity were catechists, a seminarian, and a mother — Anê Lê Thị Thành, the only woman on the list.',
  },
];

const SEC_CANONIZATION = { vi: 'Cuộc tuyên thánh năm 1988', en: 'The canonization of 1988' };
const CANONIZATION_BODY: Bi[] = [
  {
    vi: 'Ngày 19 tháng 6 năm 1988, tại quảng trường Thánh Phêrô ở Rôma, Đức Gioan Phaolô II tuyên phong cả 117 vị lên bậc hiển thánh trong cùng một thánh lễ — một trong những cuộc tuyên thánh lớn nhất lịch sử Hội Thánh. Toàn thể các ngài được kính chung trong Lịch Rôma và tại Việt Nam vào ngày 24 tháng 11 mỗi năm, với tước hiệu "Thánh Anrê Trần An Dũng Lạc và các bạn tử đạo".',
    en: 'On 19 June 1988, in St. Peter’s Square in Rome, John Paul II raised all 117 to the altars in a single Mass — one of the largest canonizations in the Church’s history. Together they are honored in the Roman Calendar and in Vietnam each year on 24 November, under the title "St. Andrew Dũng-Lạc and Companions, Martyrs."',
  },
];

const SEC_PROTOMARTYR = { vi: 'Vị tử đạo tiên khởi', en: 'The protomartyr' };
const PROTOMARTYR_BODY: Bi[] = [
  {
    vi: 'Trước cả 117 vị ấy hơn một trăm năm, có một thầy giảng trẻ tên là Anrê Phú Yên. Là môn đệ của cha Đắc Lộ (Alexandre de Rhodes), ngài bị bắt và bị xử tử tại Quảng Nam năm 1644 khi mới khoảng mười chín tuổi, trở thành người Việt Nam đầu tiên chết vì đức tin. Đức Gioan Phaolô II tôn phong ngài lên bậc Á Thánh (Chân phước) năm 2000 với tước hiệu "vị tử đạo tiên khởi của Việt Nam" — nên ngài không nằm trong danh sách 117 vị hiển thánh, nhưng luôn được kể cùng các ngài như người mở đường.',
    en: 'More than a century before those 117, there was a young catechist named Anrê Phú Yên. A disciple of Fr. Alexandre de Rhodes, he was arrested and executed in Quảng Nam in 1644 at about nineteen years old, becoming the first Vietnamese to die for the faith. John Paul II beatified him in 2000 with the title "protomartyr of Vietnam" — so he is not among the 117 canonized saints, but is always counted alongside them as the one who opened the way.',
  },
];

const MEET_HEADING = { vi: 'Gặp gỡ bảy vị', en: 'Meet seven of them' };
const MEET_SUB = {
  vi: 'Không thể kể hết 117 khuôn mặt, nên ở đây chọn bảy vị rất khác nhau — một linh mục, một thầy giảng, một người mẹ, một chủng sinh, một vị trùm họ, một người viết thư từ ngục, và một thừa sai ngoại quốc.',
  en: 'All 117 faces cannot be told here, so seven very different lives are chosen — a priest, a catechist, a mother, a seminarian, a lay leader, a writer of prison letters, and a foreign missionary.',
};

export default function VietnameseMartyrsOverviewPage() {
  const martyrs = getGroupBlocks().find((g) => g.group === 'martyrs-vn')?.items ?? [];

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <Link href="/cac-thanh" className={styles.back}>
            <Bi2 value={BACK} as="span" />
          </Link>
          <LanguageToggle />
        </div>

        <div className={styles.hero}>
          <div className={styles.heroText}>
            <Bi2 value={HERO_EYEBROW} as="div" className={styles.eyebrow} enRecessedClassName={styles.eyebrowEnRecessed} />
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

        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statNum}>{s.num}</div>
              <Bi2
                value={s.label}
                as="div"
                viClassName={styles.statLabel}
                enClassName={styles.statLabel}
                enRecessedClassName={styles.statLabelEnRecessed}
              />
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <Bi2 value={SEC_PERSECUTION} as="h2" className={styles.sectionHeading} enRecessedClassName={styles.sectionHeadingEnRecessed} />
          {PERSECUTION_BODY.map((p, i) => (
            <ScriptureBi2 key={i} {...enrichBi(p)} viClassName={styles.bodyVi} enClassName={styles.bodyEn} enRecessedClassName={styles.bodyEnRecessed} />
          ))}

          <Bi2 value={SEC_CANONIZATION} as="h2" className={styles.sectionHeading} enRecessedClassName={styles.sectionHeadingEnRecessed} />
          {CANONIZATION_BODY.map((p, i) => (
            <ScriptureBi2 key={i} {...enrichBi(p)} viClassName={styles.bodyVi} enClassName={styles.bodyEn} enRecessedClassName={styles.bodyEnRecessed} />
          ))}

          <Bi2 value={SEC_PROTOMARTYR} as="h2" className={styles.sectionHeading} enRecessedClassName={styles.sectionHeadingEnRecessed} />
          {PROTOMARTYR_BODY.map((p, i) => (
            <ScriptureBi2 key={i} {...enrichBi(p)} viClassName={styles.bodyVi} enClassName={styles.bodyEn} enRecessedClassName={styles.bodyEnRecessed} />
          ))}

          <div style={{ marginTop: 48 }}>
            <Bi2 value={MEET_HEADING} as="h2" className={styles.meetHeading} enRecessedClassName={styles.meetHeadingEnRecessed} />
            <Bi2
              value={MEET_SUB}
              as="p"
              viClassName={styles.meetSub}
              enClassName={styles.meetSub}
              enRecessedClassName={styles.meetSub}
            />
            <div className={styles.grid}>
              {martyrs.map((s) => (
                <Link key={s.slug} href={`/cac-thanh/${s.slug}`} className={styles.card}>
                  <span className={styles.cardText}>
                    <Bi2 value={s.name} as="span" className={styles.cardName} />
                    <Bi2
                      value={s.role}
                      as="span"
                      viClassName={styles.cardRole}
                      enClassName={styles.cardRole}
                      enRecessedClassName={styles.cardRole}
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
