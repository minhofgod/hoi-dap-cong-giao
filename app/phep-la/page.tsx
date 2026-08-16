import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { CarloDedication } from '@/components/phep-la/CarloDedication';
import { MiraclesBrowser } from '@/components/phep-la/MiraclesBrowser';
import { getTypeBlocks, PRIVATE_REVELATION_NOTE } from '@/lib/miraclesV2';
import { enrichBi } from '@/lib/bibleRefs';
import styles from './phep-la.module.css';

const HERO_TITLE = { vi: 'Phép Lạ & Hiện Ra', en: 'Miracles & Apparitions' };
const HERO_LEDE = {
  vi: 'Dành cho người đang hỏi: "có bằng chứng nào không?" Chỉ những trường hợp Hội Thánh đã nhìn nhận, và mỗi trường hợp đều nói rõ Hội Thánh đã nói gì — và chưa nói gì. Chúng tôi không thổi phồng chứng cứ, không biến việc chuẩn nhận thành chứng minh, và ghi rõ nguồn để bạn tự kiểm chứng.',
  en: 'For anyone asking: “is there any evidence?” Only cases the Church has recognised, and every one of them says plainly what the Church has said — and what it has not. We do not inflate the evidence, we do not turn approval into proof, and we cite sources so you can check them yourself.',
};

const NOTE_HEADING = { vi: 'Xin đọc trước', en: 'Read this first' };
const APPROVAL_NOTE = {
  vi: 'Khi Hội Thánh "chuẩn nhận" một cuộc hiện ra hay một phép lạ, điều đó có nghĩa: sau khi điều tra, không thấy gì nghịch với đức tin và luân lý, và các tín hữu được phép tin cách khôn ngoan. Đó không phải là tín điều, và cũng không phải là một kết luận khoa học. Ngược lại, một kết luận y khoa "không giải thích được" cũng chưa phải là lời tuyên bố của Hội Thánh. Hai điều ấy luôn được tách riêng ở đây.',
  en: 'When the Church “approves” an apparition or a miracle, it means: after investigation, nothing was found contrary to faith or morals, and the faithful may prudently believe. That is not a dogma, and it is not a scientific finding. Conversely, a medical verdict of “unexplained” is not yet a statement by the Church. The two are always kept apart here.',
};

const EXPLAINER = {
  kicker: { vi: 'Nền tảng', en: 'Groundwork' },
  title: {
    vi: 'Hội Thánh thẩm định một phép lạ thế nào?',
    en: 'How does the Church judge a miracle?',
  },
  body: {
    vi: 'Mặc khải công và mặc khải tư, sáu kết luận có thể trong bộ quy tắc năm 2024 của Bộ Giáo lý Đức tin, và lý do vì sao từ nay Hội Thánh thường sẽ không còn tuyên bố một hiện tượng là "có nguồn gốc siêu nhiên". Nên đọc trang này trước.',
    en: 'Public and private revelation, the six possible conclusions in the 2024 norms of the Dicastery for the Doctrine of the Faith, and why the Church will now, as a rule, no longer declare a phenomenon to be “of supernatural origin.” Worth reading first.',
  },
};

export default function PhepLaIndexPage() {
  const blocks = getTypeBlocks();

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
              value={{ vi: 'Phép lạ & hiện ra', en: 'Miracles' }}
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

        <CarloDedication />

        <div className={styles.standingNote}>
          <Bi2 value={NOTE_HEADING} as="div" className={styles.noteHeading} />
          <ScriptureBi2
            {...enrichBi(PRIVATE_REVELATION_NOTE)}
            viClassName={styles.noteBody}
            enClassName={styles.noteBody}
            enRecessedClassName={styles.noteBodyEnRecessed}
          />
          <ScriptureBi2
            {...enrichBi(APPROVAL_NOTE)}
            viClassName={styles.noteBody}
            enClassName={styles.noteBody}
            enRecessedClassName={styles.noteBodyEnRecessed}
          />
        </div>

        <Link href="/phep-la/hoi-thanh-tham-dinh" className={styles.overviewCard}>
          <span className={styles.overviewText}>
            <Bi2
              value={EXPLAINER.kicker}
              as="span"
              className={styles.overviewKicker}
              enRecessedClassName={styles.overviewKickerEnRecessed}
            />
            <Bi2
              value={EXPLAINER.title}
              as="span"
              className={styles.overviewTitle}
              enRecessedClassName={styles.overviewTitleEnRecessed}
            />
            <Bi2
              value={EXPLAINER.body}
              as="span"
              viClassName={styles.overviewBody}
              enClassName={styles.overviewBody}
              enRecessedClassName={styles.overviewBodyEnRecessed}
            />
          </span>
          <span className={styles.overviewArrow} aria-hidden="true">
            →
          </span>
        </Link>

        <MiraclesBrowser blocks={blocks} />
      </div>
    </>
  );
}
