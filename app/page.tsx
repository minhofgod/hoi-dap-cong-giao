import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageCircleQuestion, ScrollText } from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { content, toc, resolveCatechism } from '@/lib/content';
import { formatTocLabel } from '@/lib/titleFormat';
import { getAllFathers } from '@/lib/churchFathers';
import { getAllQuestions } from '@/lib/giaiDap';
import { resolveReference } from '@/lib/bibleRefs';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { FeaturedQuestion, type HeroQuestion } from '@/components/FeaturedQuestion';
import { ReadingProgressBar, PartProgressBar } from '@/components/ReadingProgress';
import { BrandMark } from '@/components/BrandMark';
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
const questions = getAllQuestions();
const questionsCount = questions.length;
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
      <section className={styles.sectionCards}>
        <Link href="/giai-dap" className={`${styles.card} ${styles.cardSage}`}>
          <span className={styles.cardIcon}>
            <MessageCircleQuestion size={24} strokeWidth={1.6} color="var(--sage)" />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>Giải Đáp</span>
            <span className={styles.cardDesc}>Thắc mắc thường gặp, giải đáp ngắn gọn có trích dẫn.</span>
            <span className={styles.cardCount}>{questionsCount} câu hỏi</span>
          </span>
        </Link>
        <Link href="/giao-ly" className={`${styles.card} ${styles.cardAccent}`}>
          <span className={styles.cardIcon}>
            <BookOpen size={24} strokeWidth={1.6} color="var(--accent)" />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>Giáo Lý</span>
            <span className={styles.cardDesc}>Toàn bộ Giáo Lý Hội Thánh, song ngữ Việt–Anh.</span>
            <span className={styles.cardCount}>{content.length} số</span>
          </span>
        </Link>
        <Link href="/giao-phu" className={`${styles.card} ${styles.cardGold}`}>
          <span className={styles.cardIcon}>
            <ScrollText size={24} strokeWidth={1.6} color="var(--gold)" />
          </span>
          <span className={styles.cardBody}>
            <span className={styles.cardTitle}>Giáo Phụ</span>
            <span className={styles.cardDesc}>Bản văn các Giáo Phụ tiên khởi của Hội Thánh.</span>
            <span className={styles.cardCount}>{fathersCount} bản văn</span>
          </span>
        </Link>
      </section>

      {heroQuestions.length > 0 && (
        <section className={styles.hero}>
          <FeaturedQuestion questions={heroQuestions} />
          <aside className={styles.heroRail}>
            <div className={styles.askedCard}>
              <div className={styles.askedTitle}>Được hỏi nhiều</div>
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
            <h2 className={styles.bandTitle}>Giáo Lý Hội Thánh Công Giáo</h2>
            <p className={styles.bandSub}>{content.length} số · song ngữ Việt–Anh</p>
          </div>
          <Link href="/giao-ly" className={styles.bandLink}>
            Xem tất cả chủ đề →
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
            <div className={styles.fathersEyebrow}>Giáo Phụ</div>
            <h2 className={styles.fathersTitle}>Đọc các Giáo Phụ Hội Thánh</h2>
            <p className={styles.fathersProse}>
              Những bản văn sớm nhất của Hội Thánh — Inhaxiô, Giustinô, Âutinh, Gioan Kim Khẩu —
              trong bản dịch tiếng Việt, kèm bản gốc tiếng Anh và số Giáo Lý liên quan.
            </p>
            <div className={styles.fathersButtons}>
              <Link href="/giao-phu" className={styles.fathersPrimary}>
                Mở thư mục Giáo Phụ
              </Link>
              <Link href="/giao-phu" className={styles.fathersSecondary}>
                Đoạn đã lưu
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
                “Ở đâu có Đức Kitô Giêsu, ở đó có Hội Thánh Công Giáo.”
              </blockquote>
              <figcaption className={styles.pullQuoteCite}>Th. Inhaxiô Antiôkia</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.rosaryBand}>
        <div className={styles.rosaryInner}>
          <div className={styles.rosaryText}>
            <div className={styles.rosaryEyebrow}>Trang bạn đồng hành</div>
            <h2 className={styles.rosaryTitle}>Đọc Kinh Mân Côi</h2>
            <p className={styles.rosaryProse}>
              Một trang trực quan để lần hạt Mân Côi — song ngữ Việt–Anh, dõi theo từng mầu
              nhiệm và từng hạt kinh trên chuỗi.
            </p>
            <a
              href="https://dockinhmancoi.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.rosaryButton}
            >
              Bắt đầu lần hạt →
            </a>
          </div>
          <div className={styles.rosaryArt} aria-hidden="true">
            <svg viewBox="0 0 200 232" className={styles.rosarySvg}>
              <circle
                cx="100"
                cy="80"
                r="64"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="0.1 20"
              />
              <line
                x1="100"
                y1="150"
                x2="100"
                y2="196"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="0.1 22"
              />
              <g stroke="currentColor" strokeWidth="7" strokeLinecap="round">
                <line x1="100" y1="202" x2="100" y2="226" />
                <line x1="88" y1="213" x2="112" y2="213" />
              </g>
            </svg>
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
          {/* Placeholder credit lines hidden until filled in.
          <p className={styles.footerCredit}>Bản dịch Giáo Lý: [nguồn]</p>
          <p className={styles.footerCredit}>Thực hiện bởi: [tên]</p>
          */}
          <p className={styles.footerCredit}>Bản văn Giáo Phụ: phạm vi công cộng</p>
        </div>
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Nội dung</div>
            <Link href="/giai-dap" className={styles.footerLink}>Giải Đáp</Link>
            <Link href="/giao-ly" className={styles.footerLink}>Giáo Lý</Link>
            <Link href="/giao-phu" className={styles.footerLink}>Giáo Phụ</Link>
          </div>
          <div className={styles.footerCol}>
            <div className={styles.footerColTitle}>Trang</div>
            <Link href="/giao-ly/1" className={styles.footerLink}>Đọc Giáo Lý từ đầu</Link>
            <Link href="/giao-phu" className={styles.footerLink}>Thư mục Giáo Phụ</Link>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
