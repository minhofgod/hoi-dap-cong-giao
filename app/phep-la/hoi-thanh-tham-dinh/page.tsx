import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { SectionHeading } from '@/components/giao-phu/SectionHeading';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { CatechismRef } from '@/components/CatechismRef';
import { resolveCatechism } from '@/lib/content';
import { enrichBi } from '@/lib/bibleRefs';
import type { Bi } from '@/lib/miraclesV2';
import styles from './explainer.module.css';

// The section's groundwork page: public vs private revelation, the 2024 DDF norms, and the four
// sentences a reader needs before any individual case can be read honestly. Linked from the index
// card and referenced by the standing note. Every claim here is sourced to the Vatican text itself.

const HERO_TITLE = {
  vi: 'Hội Thánh thẩm định một phép lạ thế nào?',
  en: 'How does the Church judge a miracle?',
};
const HERO_LEDE = {
  vi: 'Phần lớn hiểu lầm về phép lạ và các cuộc hiện ra bắt nguồn từ một chỗ: người ta tưởng "Hội Thánh chuẩn nhận" nghĩa là "Hội Thánh chứng minh". Không phải vậy. Trang này giải thích Hội Thánh thật sự làm gì, nói gì, và cố ý không nói gì.',
  en: 'Most confusion about miracles and apparitions comes from one place: people take “the Church approved it” to mean “the Church proved it.” It does not. This page sets out what the Church actually does, what it says, and what it deliberately declines to say.',
};

const SECTIONS: { heading: Bi; paragraphs: Bi[] }[] = [
  {
    heading: { vi: 'Mặc khải công khai đã kết thúc', en: 'Public revelation is closed' },
    paragraphs: [
      {
        vi: 'Điều Thiên Chúa muốn tỏ bày cho nhân loại đã được nói trọn vẹn nơi Đức Giêsu Kitô, và mặc khải ấy kết thúc với cái chết của vị Tông Đồ cuối cùng. Sẽ không còn một mặc khải công khai nào khác trước ngày Chúa lại đến trong vinh quang (GLHTCG 66).',
        en: 'What God wished to reveal to humanity was said in full in Jesus Christ, and that revelation closed with the death of the last apostle. No further public revelation is to be expected before Christ returns in glory (GLHTCG 66).',
      },
      {
        vi: 'Vì thế, mọi cuộc hiện ra — kể cả Lộ Đức, Fatima hay Guadalupe — đều thuộc loại "mặc khải tư". Chúng không bổ sung gì vào kho tàng đức tin, cũng không sửa chữa hay hoàn thiện nó. Vai trò của chúng, theo chính lời Sách Giáo Lý, là "giúp sống trọn vẹn hơn" đức tin ấy trong một giai đoạn lịch sử nhất định (GLHTCG 67).',
        en: 'So every apparition — Lourdes, Fatima, Guadalupe included — belongs to the category of “private revelation.” They add nothing to the deposit of faith, and they neither correct nor complete it. Their role, in the Catechism’s own words, is to help the faithful “live more fully” by that faith at a particular moment in history (GLHTCG 67).',
      },
      {
        vi: 'Điều đó có một hệ quả thực tế mà nhiều người ngạc nhiên: một người Công giáo hoàn toàn có thể không tin vào Fatima mà vẫn là người Công giáo trọn vẹn. Không tin Chúa Kitô phục sinh thì không. Đó là khác biệt giữa mặc khải công khai và mặc khải tư.',
        en: 'That has a practical consequence which surprises many people: a Catholic may decline to believe in Fatima and remain a Catholic in good standing. Declining to believe in the resurrection of Christ is another matter entirely. That is the difference between public and private revelation.',
      },
    ],
  },
  {
    heading: { vi: 'Bộ quy tắc năm 2024', en: 'The 2024 norms' },
    paragraphs: [
      {
        vi: 'Ngày 17-5-2024, Bộ Giáo lý Đức tin ban hành bộ quy tắc mới về việc phân định các hiện tượng siêu nhiên được cho là đã xảy ra, có hiệu lực từ ngày 19-5-2024, thay thế bộ quy tắc năm 1978. Đây là khung pháp lý hiện hành cho mọi trường hợp mới.',
        en: 'On 17 May 2024 the Dicastery for the Doctrine of the Faith issued new norms for discerning alleged supernatural phenomena, in force from 19 May 2024, replacing the norms of 1978. This is the framework now governing every new case.',
      },
      {
        vi: 'Thay đổi lớn nhất — và cũng là điều ít được nhắc tới nhất — nằm ở câu này: theo lệ thường, cả giám mục giáo phận, cả các hội đồng giám mục, lẫn chính Bộ Giáo lý Đức tin đều sẽ KHÔNG tuyên bố rằng các hiện tượng ấy có nguồn gốc siêu nhiên, ngay cả khi đã ban Nihil obstat. Hội Thánh vẫn phân định, nhưng không còn tự đặt mình vào vị trí của người thẩm định phép lạ.',
        en: 'The largest change — and the least discussed — is this sentence: as a rule, neither the diocesan bishop, nor the episcopal conferences, nor the Dicastery itself will declare that these phenomena are of supernatural origin, even when a Nihil obstat is granted. The Church still discerns; it no longer places itself in the position of adjudicating the miracle.',
      },
      {
        vi: 'Nihil obstat, kết luận thuận lợi nhất trong sáu kết luận có thể, chỉ có nghĩa: nhận thấy nhiều dấu chỉ tích cực, không thấy điều gì nghịch với đức tin và luân lý, và các tín hữu "được phép gắn bó cách khôn ngoan". Bản văn nói thẳng rằng những hiện tượng ấy "không trở thành đối tượng của đức tin" và không ai buộc phải tin.',
        en: 'A Nihil obstat, the most favourable of the six possible conclusions, means only this: many positive signs are recognised, nothing contrary to faith or morals is found, and the faithful “are authorised to give to it their adherence in a prudent manner.” The text says outright that such phenomena “do not become objects of faith” and that no one is obliged to assent.',
      },
    ],
  },
];

const CONCLUSIONS: { latin: string; gloss: Bi }[] = [
  {
    latin: 'Nihil obstat',
    gloss: {
      vi: 'Nhận thấy nhiều dấu chỉ tích cực và không có điều gì nghịch với đức tin; giám mục được khuyến khích cổ võ giá trị mục vụ của hiện tượng. Vẫn không phải là tuyên bố về nguồn gốc siêu nhiên.',
      en: 'Many positive signs are recognised and nothing contrary to the faith is found; the bishop is encouraged to promote its pastoral value. Still not a statement about supernatural origin.',
    },
  },
  {
    latin: 'Prae oculis habeatur',
    gloss: {
      vi: 'Có dấu chỉ tích cực, nhưng cũng có những điểm dễ gây lẫn lộn hoặc rủi ro; cần tiếp tục phân định kỹ và có thể phải làm sáng tỏ về mặt đạo lý.',
      en: 'Positive signs are present, but so are confusions or risks; careful ongoing discernment is needed, and doctrinal clarification may be required.',
    },
  },
  {
    latin: 'Curatur',
    gloss: {
      vi: 'Có những vấn đề nghiêm trọng, nhưng lòng sùng kính đã lan rộng và sinh hoa trái; giám mục được yêu cầu không cổ võ, và hướng tín hữu sang những hình thức đạo đức khác.',
      en: 'Significant critical elements exist, yet the devotion is widespread and bearing fruit; the bishop is asked not to encourage it and to offer alternative devotions.',
    },
  },
  {
    latin: 'Sub mandato',
    gloss: {
      vi: 'Bản thân hiện tượng thì tích cực, nhưng đang bị một số người hay nhóm lợi dụng — vì tiền bạc, vì hành vi sai trái, hay vì hoạt động mục vụ không được phép.',
      en: 'The phenomenon itself is positive, but individuals or groups are misusing it — for financial gain, immoral conduct, or unauthorised pastoral activity.',
    },
  },
  {
    latin: 'Prohibetur et obstruatur',
    gloss: {
      vi: 'Vấn đề nghiêm trọng đến mức việc công khai gắn bó bị tuyên bố là không được phép; giám mục phải dạy giáo lý giải thích lý do.',
      en: 'The problems are grave enough that public adherence is declared impermissible; the bishop must catechise on the reasons for the decision.',
    },
  },
  {
    latin: 'Declaratio de non supernaturalitate',
    gloss: {
      vi: 'Tuyên bố hiện tượng không có tính siêu nhiên — nhưng chỉ dựa trên bằng chứng cụ thể, ví dụ người liên quan thú nhận nói dối, hoặc có chứng cứ dàn dựng.',
      en: 'A declaration that the phenomenon is not supernatural — but only on concrete evidence, such as an admission of lying or proof of fabrication.',
    },
  },
];

const READING: { heading: Bi; paragraphs: Bi[] }[] = [
  {
    heading: { vi: 'Cách đọc phần này', en: 'How to read this section' },
    paragraphs: [
      {
        vi: 'Mỗi trường hợp ở đây mang một nhãn tình trạng: đã được phê chuẩn, được tôn kính lâu đời, chưa có phán quyết, hoặc đã được công nhận (với các ơn chữa lành). Nhãn ấy nói về văn kiện của Hội Thánh, không nói về sức thuyết phục của chứng cứ. Một trường hợp có chứng cứ y khoa rất mạnh vẫn có thể chưa từng được phán quyết, và ngược lại.',
        en: 'Every case here carries a status label: formally approved, long venerated, no formal ruling, or officially recognised (for cures). The label describes the Church’s act on record, not how convincing the evidence looks. A case with strong medical documentation may never have been ruled on, and the reverse is also true.',
      },
      {
        vi: 'Mỗi trang cũng có một mục tên là "Điều này KHÔNG chứng minh". Đó không phải là sự dè dặt lịch sự — đó là phần quan trọng nhất của mỗi bài. Hầu hết những gì lan truyền trên mạng về các phép lạ đều đúng ở phần đầu và sai ở phần cuối, và mục ấy là nơi chúng tôi chỉ ra chỗ lời khẳng định phải dừng lại.',
        en: 'Every page also carries a block titled “What this does NOT establish.” That is not polite hedging — it is the most important part of each entry. Most of what circulates online about miracles is right at the start and wrong at the end, and that block is where we mark the point at which the claim has to stop.',
      },
      {
        vi: 'Cuối mỗi bài là danh sách nguồn. Xin cứ kiểm chứng. Nếu bạn tìm thấy chỗ nào chúng tôi nói quá, đó là một lỗi cần sửa, chứ không phải một chi tiết nhỏ.',
        en: 'At the foot of each entry there is a source list. Please check it. If you find somewhere we have overstated the case, that is an error to be fixed, not a detail.',
      },
    ],
  },
];

const CCC_REFS = [66, 67, 156, 548];

const SOURCES = [
  {
    label:
      'Dicastery for the Doctrine of the Faith, “Norms for Proceeding in the Discernment of Alleged Supernatural Phenomena” (17 May 2024)',
    url: 'https://www.vatican.va/roman_curia/congregations/cfaith/documents/rc_ddf_doc_20240517_norme-fenomeni-soprannaturali_en.html',
  },
  {
    label: 'Sách Giáo Lý Hội Thánh Công Giáo, số 65–67 (mặc khải công khai và mặc khải tư), 156, 548',
  },
];

export default function ThamDinhPage() {
  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <Link href="/phep-la" className={styles.backLink}>
            <Bi2 value={{ vi: '← Phép Lạ & Hiện Ra', en: '← Miracles & Apparitions' }} as="span" />
          </Link>
          <LanguageToggle />
        </div>

        <div className={styles.hero}>
          <div className={styles.heroText}>
            <Bi2
              value={{ vi: 'Nền tảng', en: 'Groundwork' }}
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

        <div className={styles.column}>
          {SECTIONS.map((s, i) => (
            <div key={i}>
              <SectionHeading {...s.heading} />
              {s.paragraphs.map((p, j) => (
                <ScriptureBi2
                  key={j}
                  {...enrichBi(p)}
                  viClassName={styles.bodyVi}
                  enClassName={styles.bodyVi}
                  enRecessedClassName={styles.bodyEnRecessed}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.column}>
          <SectionHeading vi="Sáu kết luận có thể" en="The six possible conclusions" />
          <div className={styles.conclusionsCard}>
            {CONCLUSIONS.map((c, i) => (
              <div key={c.latin} className={styles.conclusionRow}>
                <span className={styles.conclusionNo}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.conclusionText}>
                  <span className={styles.conclusionLatin}>{c.latin}</span>
                  <Bi2
                    value={c.gloss}
                    as="span"
                    viClassName={styles.conclusionGloss}
                    enClassName={styles.conclusionGloss}
                    enRecessedClassName={styles.conclusionGlossEnRecessed}
                  />
                </span>
              </div>
            ))}
          </div>

          {READING.map((s, i) => (
            <div key={i}>
              <SectionHeading {...s.heading} />
              {s.paragraphs.map((p, j) => (
                <ScriptureBi2
                  key={j}
                  {...enrichBi(p)}
                  viClassName={styles.bodyVi}
                  enClassName={styles.bodyVi}
                  enRecessedClassName={styles.bodyEnRecessed}
                />
              ))}
            </div>
          ))}

          <div className={styles.cccRow}>
            <span className={styles.cccLabelWrap}>
              <Bi2
                value={{ vi: 'Liên hệ Giáo Lý', en: 'Catechism cross-references' }}
                as="span"
                className={styles.cccLabel}
              />
            </span>
            {CCC_REFS.map((n) => (
              <CatechismRef
                key={n}
                number={n}
                data={resolveCatechism(n)}
                className={styles.cccChip}
              />
            ))}
          </div>

          <div className={styles.sourcesSection}>
            <Bi2
              value={{ vi: 'Nguồn tham khảo', en: 'Sources' }}
              as="div"
              className={styles.sourcesHeading}
            />
            <ul className={styles.sourcesList}>
              {SOURCES.map((s) => (
                <li key={s.label} className={styles.sourceItem}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.sourceLink}
                    >
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.backRow}>
            <Link href="/phep-la" className={styles.backCard}>
              <Bi2
                value={{ vi: 'Xem các trường hợp', en: 'See the cases' }}
                as="span"
                className={styles.backCardLabel}
              />
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
