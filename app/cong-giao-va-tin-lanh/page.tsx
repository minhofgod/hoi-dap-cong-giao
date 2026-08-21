import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { getBranchCards } from '@/lib/congGiaoTinLanh';
import {
  CG_TL_DESCRIPTION,
  CG_TL_LANDING,
  CG_TL_ROUTE,
  CG_TL_TITLE,
} from '@/lib/congGiaoTinLanhPath';
import { CG_TL_ENABLED } from '@/lib/congGiaoTinLanhFlag';
import { enrichBi } from '@/lib/bibleRefs';
import { staticPageMetadata } from '@/lib/pageMetadata';
import styles from './cong-giao-va-tin-lanh.module.css';

// Bare title only — the root layout's title.template appends " · Hỏi Đáp Công Giáo". Routed through
// staticPageMetadata (not a plain `metadata` export) so the page gets a self-referential canonical
// and carries the root OG card forward: this surface exists precisely so the URL can be SHARED —
// someone sending it to a Protestant spouse or sibling — so the card is not optional here even
// though the page is deliberately kept off the homepage.
export const generateMetadata = staticPageMetadata({
  title: CG_TL_TITLE.vi,
  description: CG_TL_DESCRIPTION,
  path: CG_TL_ROUTE,
});

export default function CongGiaoVaTinLanhPage() {
  // LOCAL-ONLY: 404 unless NEXT_PUBLIC_CG_TL=1 (see lib/congGiaoTinLanhFlag.ts).
  if (!CG_TL_ENABLED) notFound();

  const cards = getBranchCards();

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
              value={CG_TL_LANDING.eyebrow}
              as="div"
              className={styles.eyebrow}
              enRecessedClassName={styles.eyebrowEnRecessed}
            />
            <Bi2 value={CG_TL_TITLE} as="h1" className={styles.heroTitle} />
            <Bi2
              value={CG_TL_LANDING.lede}
              as="p"
              viClassName={styles.heroLede}
              enClassName={styles.heroLede}
              enRecessedClassName={styles.heroLedeEnRecessed}
            />
          </div>
        </div>

        {/* Shared ground comes BEFORE the branch cards, not after them — a reader who scrolls past
            the hero must meet what we hold together before they meet a list of what divides us.
            Rendered through ScriptureBi2 so the two Catechism citations inside it open the popover
            instead of shipping as inert text (CLAUDE.md). */}
        <section className={styles.sharedGround}>
          <Bi2
            value={CG_TL_LANDING.sharedGround.kicker}
            as="div"
            className={styles.sharedGroundKicker}
            enRecessedClassName={styles.sharedGroundKickerEnRecessed}
          />
          <ScriptureBi2
            {...enrichBi(CG_TL_LANDING.sharedGround.body)}
            viClassName={styles.sharedGroundBody}
            enClassName={styles.sharedGroundBody}
            enRecessedClassName={styles.sharedGroundBodyEnRecessed}
          />
        </section>

        <section className={styles.honestNote}>
          <Bi2
            value={CG_TL_LANDING.honestNote.kicker}
            as="div"
            className={styles.honestNoteKicker}
            enRecessedClassName={styles.honestNoteKickerEnRecessed}
          />
          <Bi2
            value={CG_TL_LANDING.honestNote.body}
            as="p"
            viClassName={styles.honestNoteBody}
            enClassName={styles.honestNoteBody}
            enRecessedClassName={styles.honestNoteBodyEnRecessed}
          />
        </section>

        {/* An unordered list on purpose: these are peers. The root card is first and says so in its
            meta line, but nothing here numbers them or implies a sequence. */}
        <ul className={styles.branchCards}>
          {cards.map(({ branch, answerCount }) => (
            <li key={branch.slug}>
              <Link
                href={`${CG_TL_ROUTE}/${branch.slug}`}
                className={branch.root ? styles.branchCardRoot : styles.branchCard}
              >
                <span className={styles.branchText}>
                  <Bi2
                    value={{
                      vi: branch.root
                        ? `Nên bắt đầu ở đây · ${answerCount} giải đáp`
                        : `${answerCount} giải đáp`,
                      en: branch.root
                        ? `A good place to start · ${answerCount} answers`
                        : `${answerCount} answers`,
                    }}
                    as="span"
                    className={styles.branchMeta}
                    enRecessedClassName={styles.branchMetaEnRecessed}
                  />
                  <Bi2
                    value={branch.title}
                    as="span"
                    className={styles.branchTitle}
                    enRecessedClassName={styles.branchTitleEnRecessed}
                  />
                  <Bi2
                    value={branch.covers}
                    as="span"
                    viClassName={styles.branchBlurb}
                    enClassName={styles.branchBlurb}
                    enRecessedClassName={styles.branchBlurbEnRecessed}
                  />
                </span>
                <span className={styles.branchArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.indexNote}>
          <Bi2
            value={CG_TL_LANDING.closing}
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
