import type { Metadata } from 'next';
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { CompanionReturn } from '@/components/bang-chung/CompanionReturn';
import { getStageCards } from '@/lib/evidencePath';
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
import styles from './bang-chung.module.css';

export const metadata: Metadata = {
  // No site-name suffix here: app/layout.tsx's title `template` appends "· Hỏi Đáp Công Giáo".
  title: 'Bằng chứng về Chúa Giêsu',
  description:
    'Bảy bước lần theo lập luận: từ câu hỏi vũ trụ này là ngẫu nhiên hay được thiết kế, qua sự sống lại của Chúa Giêsu, đến điều Thiên Chúa muốn nơi bạn — và những phép lạ Hội Thánh đã nhìn nhận. Mỗi bước dựa trên bước trước, và bạn có thể bắt đầu ở bất cứ bước nào.',
};

const HERO_EYEBROW = { vi: 'Lần theo lập luận', en: 'Follow the argument' };
const HERO_TITLE = { vi: 'Bằng chứng về Chúa Giêsu', en: 'The Evidence for Jesus' };
const HERO_LEDE = {
  vi: 'Sáu bước đi từ câu hỏi nền tảng nhất đến chính lời tuyên bố, rồi đến điều lời ấy đòi hỏi nơi bạn — và một bước cuối cùng nhìn sang những phép lạ Hội Thánh đã chính thức nhìn nhận. Mỗi bước dựa trên bước trước, nên đọc theo thứ tự sẽ thấy lập luận mạnh nhất — nhưng bạn hoàn toàn có thể bắt đầu ở bất cứ bước nào bạn quan tâm.',
  en: 'Six steps running from the most basic question to the claim itself, then to what that claim asks of you — and a last step turning to the miracles the Church has formally recognised. Each step rests on the one before it, so reading in order shows the argument at its strongest — but you are free to start at whichever step you came for.',
};

const NOTE = {
  vi: 'Con đường này không nói điều gì mới. Mọi câu trả lời ở đây đều đã có sẵn trong mục Giải Đáp — việc của trang này chỉ là xếp chúng lại theo đúng thứ tự của lập luận, và nói rõ vì sao bước trước dẫn tới bước sau.',
  en: 'This path says nothing new. Every answer here already exists in the Giải Đáp section — all this page does is put them in the order the argument actually runs, and say why each step leads to the next.',
};

export default function BangChungIndexPage() {
  // LOCAL-ONLY: 404 unless NEXT_PUBLIC_EVIDENCE_PATH=1 (see lib/evidencePathFlag.ts).
  if (!EVIDENCE_PATH_ENABLED) notFound();

  const cards = getStageCards();

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          {/* Suspense keeps the rest of this page prerendered: useSearchParams client-renders only
              the tree up to the nearest boundary (next/dist/docs → use-search-params, "Prerendering").
              Without it the whole index would drop out of static generation for one escape hatch. */}
          <Suspense fallback={null}>
            <CompanionReturn />
          </Suspense>
          <LanguageToggle />
        </div>

        <div className={styles.hero}>
          <div className={styles.heroText}>
            <Bi2
              value={HERO_EYEBROW}
              as="div"
              className={styles.eyebrow}
              enRecessedClassName={styles.eyebrowEnRecessed}
            />
            <Bi2 value={HERO_TITLE} as="h1" className={styles.heroTitle} />
            <Bi2
              value={HERO_LEDE}
              as="p"
              viClassName={styles.heroLede}
              enClassName={styles.heroLede}
              enRecessedClassName={styles.heroLedeEnRecessed}
            />
          </div>

          {/* The Blue Marble (Apollo 17) — NASA, public domain, already in the shared image library
              with its CREDITS.csv row (it is the "Vũ trụ được thiết kế" topic banner). Referenced by
              path rather than copied: one asset, one credit, and it is exactly what step 1 opens on.
              Decorative here — the heading already says what the page is — so alt="" and aria-hidden
              keep it out of the accessibility tree instead of narrating a photo to someone who
              cannot see it. Placed after the text so the DOM order leads with the title. */}
          <div className={styles.heroMedia} aria-hidden="true">
            <Image
              src="/images/giai-dap/vu-tru-ngau-nhien-hay-duoc-thiet-ke.jpg"
              alt=""
              width={1200}
              height={1201}
              sizes="(max-width: 860px) 200px, 300px"
              priority
              className={styles.heroImage}
            />
          </div>
        </div>

        <ol className={styles.stageCards}>
          {cards.map(({ stage, answerCount }) => (
            <li key={stage.slug}>
              <Link href={`/bang-chung/${stage.slug}`} className={styles.stageCard}>
                <span className={styles.stageNum}>{stage.step}</span>
                <span className={styles.stageText}>
                  <Bi2
                    value={{
                      vi: `Bước ${stage.step} / ${cards.length} · ${answerCount} giải đáp`,
                      en: `Step ${stage.step} of ${cards.length} · ${answerCount} answers`,
                    }}
                    as="span"
                    className={styles.stageMeta}
                    enRecessedClassName={styles.stageMetaEnRecessed}
                  />
                  <Bi2
                    value={stage.title}
                    as="span"
                    className={styles.stageTitle}
                    enRecessedClassName={styles.stageTitleEnRecessed}
                  />
                  <Bi2
                    value={stage.covers}
                    as="span"
                    viClassName={styles.stageBlurb}
                    enClassName={styles.stageBlurb}
                    enRecessedClassName={styles.stageBlurbEnRecessed}
                  />
                </span>
                <span className={styles.stageArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <div className={styles.indexNote}>
          <Bi2
            value={NOTE}
            as="p"
            viClassName={styles.indexNoteBody}
            enClassName={styles.indexNoteBody}
            enRecessedClassName={styles.indexNoteBodyEnRecessed}
          />
          <Link href="/giai-dap" className={styles.indexNoteLink}>
            <Bi2
              value={{ vi: 'Xem tất cả Giải Đáp →', en: 'Browse all Q&A →' }}
              as="span"
              enRecessedClassName={styles.indexNoteLinkEnRecessed}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
