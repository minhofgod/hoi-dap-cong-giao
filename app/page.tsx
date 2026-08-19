import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Library } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { content, toc, resolveCatechism } from '@/lib/content';
import { formatTocLabel } from '@/lib/titleFormat';
import { getAllFathers } from '@/lib/churchFathers';
import { getAllCouncils } from '@/lib/councilsV2';
import { getAllSaints } from '@/lib/saintsV2';
import { getAllMiracles } from '@/lib/miraclesV2';
import { getStageCards } from '@/lib/evidencePath';
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
import { getAllChapters } from '@/lib/tongLuan';
import { TONG_LUAN_ENABLED } from '@/lib/tongLuanFlag';
import { getAllQuestions } from '@/lib/giaiDap';
import { getAllVideos } from '@/lib/videos';
import { resolveReference } from '@/lib/bibleRefs';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { FeaturedQuestion, type HeroQuestion } from '@/components/FeaturedQuestion';
import { ReadingProgressBar, PartProgressBar } from '@/components/ReadingProgress';
import { BrandMark } from '@/components/BrandMark';
import { DongHanhCta } from '@/components/DongHanhCta';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import { T } from '@/components/T';
import styles from './page.module.css';

// First two body paragraphs as a plain-text teaser (drop quotes, headings, lists, and Markdown).
function ledeParagraphs(bodyRaw: string, count = 2): string[] {
  return bodyRaw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^[>#\-!]/.test(p))
    .map((p) =>
      p
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .slice(0, count);
}

const parts = toc.filter((n) => /^PHẦN/u.test(n.titleVi));
// Sacred-art banner per Catechism Part (from the shared image set), matching the /giao-ly topic cards.
const PART_IMAGES = [
  '/images/catechism/kinh-tin-kinh.jpg', // I — Tuyên Xưng Đức Tin (the Creed)
  '/images/catechism/thanh-the.jpg', // II — Cử Hành Mầu Nhiệm (the Sacraments)
  '/images/catechism/muoi-dieu-ran.jpg', // III — Đời Sống Trong Đức Kitô (the Commandments)
  '/images/catechism/kinh-lay-cha.jpg', // IV — Kinh Nguyện (the Our Father)
];
const fathersCount = getAllFathers().length;
const councilsCount = getAllCouncils().length;
const saintsCount = getAllSaints().length;
const miraclesCount = getAllMiracles().length;
// Evidence path: gated off by default, so the card/count only matter once the flag is on.
const evidenceStagesCount = EVIDENCE_PATH_ENABLED ? getStageCards().length : 0;
// Tổng luận Thần học: gated off by default too.
const tongLuanCount = TONG_LUAN_ENABLED ? getAllChapters().length : 0;
// Section-card grid: 5 base cards plus the two gated ones. Pick a desktop column count that tiles
// cleanly for the total (5 → 5, 6 → 3+3, 7 → 4+3) — see .sectionCards in page.module.css.
const sectionCardCount = 5 + (EVIDENCE_PATH_ENABLED ? 1 : 0) + (TONG_LUAN_ENABLED ? 1 : 0);
const sectionCols = sectionCardCount <= 5 ? 5 : sectionCardCount === 6 ? 3 : 4;
const questions = getAllQuestions();
const questionsCount = questions.length;
const homeVideos = getAllVideos().slice(0, 3);
// Resolve a question's Scripture refs to verse data — only when the licensing flag is on,
// so no copyrighted text ships otherwise (matches the answer page).
const resolveScripture = (refs: string[]) =>
  Object.fromEntries(refs.map((r) => [r, SCRIPTURE_POPOVER_ENABLED ? resolveReference(r) : null]));

// Resolve Catechism (§) refs to their paragraph text for the hero's reference popovers.
const resolveCcc = (nums: number[]) =>
  Object.fromEntries(nums.map((n) => [n, resolveCatechism(n)]));

// Featured question first, so the hero opens on the anchor of each topic.
const heroQuestions: HeroQuestion[] = [...questions]
  .sort((a, b) => Number(b.featured) - Number(a.featured))
  .map((q) => ({
    slug: q.slug,
    question: q.questionVi,
    lede: ledeParagraphs(q.bodyRaw),
    ccc: q.refsCcc,
    scripture: q.refsScripture,
    scriptureData: resolveScripture(q.refsScripture),
    cccData: resolveCcc(q.refsCcc),
  }));

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className={styles.page}>
      <section
        className={styles.sectionCards}
        style={{ '--section-cols': sectionCols } as CSSProperties}
      >
        <Link href="/giai-dap" className={`${styles.card} ${styles.cardSage}`}>
          <span className={styles.cardImage}>
            <Image
              src="/images/giai-dap/ai-tao-ra-chua.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className={styles.cardImg}
            />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>
              <T vi="Giải Đáp" en="Q&amp;A" />
            </span>
            <span className={styles.cardDesc}>
              <T
                vi="Thắc mắc thường gặp, giải đáp ngắn gọn có trích dẫn."
                en="Common questions, answered briefly with citations."
              />
            </span>
            <span className={styles.cardCount}>
              <T vi={`${questionsCount} câu hỏi`} en={`${questionsCount} questions`} />
            </span>
          </span>
        </Link>
        {/* Evidence path — placed right after Giải Đáp (it's built from the Q&A clusters). Gated off
            by default (EVIDENCE_PATH_ENABLED); appears only once the flag is on, so no dead card
            ships before then. Borrows the resurrection banner — the path's climax. */}
        {EVIDENCE_PATH_ENABLED && (
          <Link href="/bang-chung" className={`${styles.card} ${styles.cardEvidence}`}>
            <span className={styles.cardImage}>
              <Image
                src="/images/giai-dap/bang-chung-chua-giesu-song-lai.jpg"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 400px"
                className={styles.cardImg}
              />
            </span>
            <span className={styles.cardBody}>
              <span className={styles.cardTitle}>
                <T vi="Bằng chứng về Chúa Giêsu" en="The Evidence for Jesus" />
              </span>
              <span className={styles.cardDesc}>
                <T
                  vi="Đi qua từng bước lập luận — từ nguyên nhân đầu tiên đến sự phục sinh."
                  en="Walk the argument step by step — from the first cause to the resurrection."
                />
              </span>
              <span className={styles.cardCount}>
                <T vi={`${evidenceStagesCount} chặng`} en={`${evidenceStagesCount} steps`} />
              </span>
            </span>
          </Link>
        )}
        <Link href="/giao-ly" className={`${styles.card} ${styles.cardAccent}`}>
          <span className={styles.cardImage}>
            <Image
              src="/images/catechism/thanh-the.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className={styles.cardImg}
            />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>
              <T vi="Giáo Lý" en="Catechism" />
            </span>
            <span className={styles.cardDesc}>
              <T
                vi="Toàn bộ Giáo Lý Hội Thánh, song ngữ Việt–Anh."
                en="The full Catechism of the Catholic Church, Vietnamese–English."
              />
            </span>
            <span className={styles.cardCount}>
              <T vi={`${content.length} số`} en={`${content.length} paragraphs`} />
            </span>
          </span>
        </Link>
        {/* Tổng luận Thần học — gated off by default (TONG_LUAN_ENABLED); appears only once the flag
            is on, so no dead card ships before then. No section art yet, so use an icon placeholder
            rather than an <Image> that would 404. */}
        {TONG_LUAN_ENABLED && (
          <Link href="/tong-luan" className={`${styles.card} ${styles.cardTongLuan}`}>
            <span className={`${styles.cardImage} ${styles.cardImagePlaceholder}`} aria-hidden="true">
              <Library size={40} strokeWidth={1.5} className={styles.cardPlaceholderIcon} />
            </span>
            <span className={styles.cardBody}>
              <span className={styles.cardTitle}>
                <T vi="Tổng luận Thần học" en="The Summa, Explained" />
              </span>
              <span className={styles.cardDesc}>
                <T
                  vi="Tổng luận Thần học của thánh Tôma Aquinô, giải thích theo từng chương."
                  en="St Thomas Aquinas's Summa Theologiae, walked through chapter by chapter."
                />
              </span>
              <span className={styles.cardCount}>
                <T vi={`${tongLuanCount} chương`} en={`${tongLuanCount} chapters`} />
              </span>
            </span>
          </Link>
        )}
        <Link href="/lich-su-hoi-thanh" className={`${styles.card} ${styles.cardGold}`}>
          <span className={styles.cardImage}>
            <Image
              src="/images/cong-dong/nicaea-i.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className={styles.cardImg}
            />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>
              <T vi="Lịch Sử Hội Thánh" en="Church History" />
            </span>
            <span className={styles.cardDesc}>
              <T
                vi="Các Giáo Phụ và các Công Đồng Chung trên cùng một dòng thời gian."
                en="The Church Fathers and the Ecumenical Councils on one timeline."
              />
            </span>
            <span className={styles.cardCount}>
              <T
                vi={`${fathersCount} Giáo Phụ · ${councilsCount} Công Đồng`}
                en={`${fathersCount} Fathers · ${councilsCount} Councils`}
              />
            </span>
          </span>
        </Link>
        <Link href="/cac-thanh" className={`${styles.card} ${styles.cardRose}`}>
          <span className={styles.cardImage}>
            <Image
              src="/images/giai-dap/nguoi-cong-giao-co-tho-nguong-tuong-khong.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className={styles.cardImg}
            />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>
              <T vi="Các Thánh" en="The Saints" />
            </span>
            <span className={styles.cardDesc}>
              <T
                vi="Chân dung các thánh — tử đạo Việt Nam, chứng nhân hiện đại, người trở lại."
                en="Portraits of the saints — Vietnamese martyrs, modern witnesses, converts."
              />
            </span>
            <span className={styles.cardCount}>
              <T vi={`${saintsCount} vị`} en={`${saintsCount} saints`} />
            </span>
          </span>
        </Link>
        <Link href="/phep-la" className={`${styles.card} ${styles.cardBlue}`}>
          <span className={styles.cardImage}>
            <Image
              src="/images/phep-la/la-vang.jpg"
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className={styles.cardImg}
            />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>
              <T vi="Phép Lạ & Hiện Ra" en="Miracles & Apparitions" />
            </span>
            <span className={styles.cardDesc}>
              <T
                vi="Các trường hợp đã được thẩm định — kèm giới hạn của mỗi phép lạ và mức độ Hội Thánh chuẩn nhận."
                en="Verified cases — each with what it does not establish and how far the Church has ruled."
              />
            </span>
            <span className={styles.cardCount}>
              <T vi={`${miraclesCount} trường hợp`} en={`${miraclesCount} cases`} />
            </span>
          </span>
        </Link>
      </section>

      {/* Front-door companion CTA for seekers, just below the section cards. DongHanhCta self-gates
          (returns null when the companion flag is off); the band wrapper is guarded too so no
          empty bordered strip ships in that case. */}
      {COMPANION_ENABLED && (
        <section className={styles.companionBand}>
          <DongHanhCta />
        </section>
      )}

      {heroQuestions.length > 0 && (
        <section className={styles.hero}>
          <FeaturedQuestion questions={heroQuestions} />
          <aside className={styles.heroRail}>
            <div className={styles.askedCard}>
              <div className={styles.askedTitle}>
                <T vi="Được hỏi nhiều" en="Frequently asked" />
              </div>
              <ul className={styles.askedList}>
                {heroQuestions.slice(0, 3).map((q) => (
                  <li key={q.slug} className={styles.askedRow}>
                    <Link href={`/giai-dap/${q.slug}`} className={styles.askedLink}>
                      {q.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      )}

      <section className={styles.giaoLyBand}>
        <div className={styles.bandHeader}>
          <div>
            <h2 className={styles.bandTitle}>
              <T vi="Giáo Lý Hội Thánh Công Giáo" en="Catechism of the Catholic Church" />
            </h2>
            <p className={styles.bandSub}>
              <T
                vi={`${content.length} số · song ngữ Việt–Anh`}
                en={`${content.length} paragraphs · Vietnamese–English`}
              />
            </p>
          </div>
          <Link href="/giao-ly" className={styles.bandLink}>
            <T vi="Xem tất cả chủ đề →" en="See all topics →" />
          </Link>
        </div>

        <ReadingProgressBar total={content.length} />

        <div className={styles.partGrid}>
          {parts.map((part, i) => {
            const label = formatTocLabel(part);
            return (
            <Link key={part.id} href={`/giao-ly/${part.paragraphRange[0]}`} className={styles.partCard}>
              <div className={styles.partImage}>
                {PART_IMAGES[i] && (
                  <Image
                    src={PART_IMAGES[i]}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 50vw, 260px"
                    className={styles.partImg}
                  />
                )}
              </div>
              <div className={styles.partBadge}>{label.numeral}</div>
              <div className={styles.partCardBody}>
                <div className={styles.partTitle}>{label.title}</div>
                <div className={styles.partRange}>
                  {part.paragraphRange[0]}–{part.paragraphRange[1]}
                </div>
                <PartProgressBar start={part.paragraphRange[0]} end={part.paragraphRange[1]} />
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.fathersBand}>
        <div className={styles.fathersInner}>
          <div className={styles.fathersText}>
            <div className={styles.fathersEyebrow}>
              <T vi="Giáo Phụ" en="Church Fathers" />
            </div>
            <h2 className={styles.fathersTitle}>
              <T vi="Đọc các Giáo Phụ Hội Thánh" en="Read the Fathers of the Church" />
            </h2>
            <p className={styles.fathersProse}>
              <T
                vi="Những bản văn sớm nhất của Hội Thánh — Inhaxiô, Giustinô, Âutinh, Gioan Kim Khẩu — trong bản dịch tiếng Việt, kèm bản gốc tiếng Anh và số Giáo Lý liên quan."
                en="The earliest texts of the Church — Ignatius, Justin, Augustine, John Chrysostom — in Vietnamese translation, with the English original and related Catechism numbers."
              />
            </p>
            <div className={styles.fathersButtons}>
              <Link href="/giao-phu" className={styles.fathersPrimary}>
                <T vi="Mở thư mục Giáo Phụ" en="Open the Church Fathers" />
              </Link>
              <Link href="/giao-phu" className={styles.fathersSecondary}>
                <T vi="Đoạn đã lưu" en="Saved passages" />
              </Link>
            </div>
          </div>
          <div className={styles.fathersAside}>
            <div className={styles.fathersImage}>
              <Image
                src="/images/church-fathers/ignatius-of-antioch.jpg"
                alt="Th. Inhaxiô Antiôkia"
                fill
                sizes="300px"
                className={styles.fathersImg}
              />
            </div>
            <figure className={styles.pullQuote}>
              <blockquote className={styles.pullQuoteText}>
                <T
                  vi="“Ở đâu có Đức Kitô Giêsu, ở đó có Hội Thánh Công Giáo.”"
                  en="“Where Jesus Christ is, there is the Catholic Church.”"
                />
              </blockquote>
              <figcaption className={styles.pullQuoteCite}>
                <T vi="Th. Inhaxiô Antiôkia" en="St Ignatius of Antioch" />
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {homeVideos.length > 0 && (
        <section className={styles.videoBand}>
          <div className={styles.bandHeader}>
            <div>
              <h2 className={styles.bandTitle}>
                <T vi="Video" en="Videos" />
              </h2>
              <p className={styles.bandSub}>
                <T vi="Các video ngắn về đức tin Công giáo" en="Short videos on the Catholic faith" />
              </p>
            </div>
            <Link href="/video" className={styles.bandLink}>
              <T vi="Xem tất cả video →" en="See all videos →" />
            </Link>
          </div>
          <div className={styles.videoGrid}>
            {homeVideos.map((v) => (
              <Link key={v.slug} href={`/video/${v.slug}`} className={styles.videoCard}>
                <span className={styles.videoThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- external YouTube thumbnail */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className={styles.videoThumbImg}
                  />
                  {v.duration && <span className={styles.videoDuration}>{v.duration}</span>}
                  <span className={styles.videoPlay}>
                    <Play size={20} fill="currentColor" strokeWidth={0} />
                  </span>
                </span>
                <span className={styles.videoCardTitle}>
                  {v.titleEn ? (
                    <>
                      <span className="bi-vi">{v.title}</span>
                      <span className="bi-en">{v.titleEn}</span>
                    </>
                  ) : (
                    v.title
                  )}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.rosaryBand}>
        <div className={styles.rosaryInner}>
          <div className={styles.rosaryText}>
            <div className={styles.rosaryEyebrow}>
              <T vi="Trang bạn đồng hành" en="Companion site" />
            </div>
            <h2 className={styles.rosaryTitle}>
              <T vi="Đọc Kinh Mân Côi" en="Pray the Rosary" />
            </h2>
            <p className={styles.rosaryProse}>
              <T
                vi="Một trang trực quan để lần hạt Mân Côi — song ngữ Việt–Anh, dõi theo từng mầu nhiệm và từng hạt kinh trên chuỗi."
                en="A visual companion for praying the Rosary — Vietnamese–English, following each mystery and each bead."
              />
            </p>
            <a
              href="https://dockinhmancoi.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.rosaryButton}
            >
              <T vi="Bắt đầu lần hạt →" en="Start praying →" />
            </a>
          </div>
          <div className={styles.rosaryArt}>
            <span className={styles.rosaryImage}>
              <Image
                src="/images/home/kinh-man-coi.jpg"
                alt=""
                fill
                sizes="(max-width: 900px) 150px, 220px"
                className={styles.rosaryImg}
              />
            </span>
          </div>
        </div>
      </section>

      {/* Empty full-bleed spacer removed at request. */}
      {/* <div className={styles.fullBleed} /> */}

      {/* "Về trang này / Nguồn" band hidden at request — kept here in case it's wanted back.
      <section className={styles.support}>
        <div className={styles.supportCol}>
          <h3 className={styles.supportHeading}>Về trang này</h3>
          <p className={styles.supportBody}>
            Một dự án cá nhân, làm cho bạn bè và giáo xứ. Mục đích là đưa bản văn chính thức của Hội
            Thánh đến gần hơn với người đọc tiếng Việt, cùng với những câu trả lời ngắn cho các thắc
            mắc thường gặp — có trích dẫn nguồn, để ai muốn tra cứu thêm đều có thể lần theo.
          </p>
        </div>
        <div className={styles.supportCol}>
          <h3 className={styles.supportHeading}>Nguồn</h3>
          <p className={styles.supportBody}>
            Bản văn Giáo Lý theo ấn bản chính thức, đối chiếu bản tiếng Anh. Các câu trả lời trong
            mục Giải Đáp do người thực hiện trang biên soạn, kèm số Giáo Lý được trích dẫn.
          </p>
        </div>
      </section>
      */}

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <div className={styles.footerName}>
            <BrandMark size={35} cut={9} id="footer" className={styles.footerMark} />
            <span>Hỏi Đáp Công Giáo</span>
          </div>
          {/* Credit lines hidden for now.
          <p className={styles.footerCredit}>Bản dịch Giáo Lý: [nguồn]</p>
          <p className={styles.footerCredit}>Thực hiện bởi: [tên]</p>
          <p className={styles.footerCredit}>Bản văn Giáo Phụ: phạm vi công cộng</p>
          */}
        </div>
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>
              <T vi="Nội dung" en="Content" />
            </div>
            <Link href="/giai-dap" className={styles.footerLink}>
              <T vi="Giải Đáp" en="Q&amp;A" />
            </Link>
            <Link href="/giao-ly" className={styles.footerLink}>
              <T vi="Giáo Lý" en="Catechism" />
            </Link>
            {TONG_LUAN_ENABLED && (
              <Link href="/tong-luan" className={styles.footerLink}>
                <T vi="Tổng luận Thần học" en="The Summa, Explained" />
              </Link>
            )}
            <Link href="/lich-su-hoi-thanh" className={styles.footerLink}>
              <T vi="Lịch Sử Hội Thánh" en="Church History" />
            </Link>
            <Link href="/cac-thanh" className={styles.footerLink}>
              <T vi="Các Thánh" en="The Saints" />
            </Link>
            <Link href="/phep-la" className={styles.footerLink}>
              <T vi="Phép Lạ & Hiện Ra" en="Miracles & Apparitions" />
            </Link>
            {EVIDENCE_PATH_ENABLED && (
              <Link href="/bang-chung" className={styles.footerLink}>
                <T vi="Bằng chứng về Chúa Giêsu" en="The Evidence for Jesus" />
              </Link>
            )}
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>
              <T vi="Trang" en="Pages" />
            </div>
            <Link href="/giao-ly/1" className={styles.footerLink}>
              <T vi="Đọc Giáo Lý từ đầu" en="Read the Catechism" />
            </Link>
            <Link href="/giao-phu" className={styles.footerLink}>
              <T vi="Thư mục Giáo Phụ" en="Church Fathers directory" />
            </Link>
            <Link href="/cong-dong" className={styles.footerLink}>
              <T vi="Các Công Đồng Chung" en="Ecumenical Councils" />
            </Link>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
