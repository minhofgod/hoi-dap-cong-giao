import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { CgTlClusters } from '@/components/cong-giao-tin-lanh/CgTlClusters';
import { getResolvedBranch, getResolvedBranches } from '@/lib/congGiaoTinLanh';
import { CG_TL_ROUTE, CG_TL_TITLE } from '@/lib/congGiaoTinLanhPath';
import { CG_TL_ENABLED } from '@/lib/congGiaoTinLanhFlag';
import { enrichBi } from '@/lib/bibleRefs';
import { pageMetadata, plainExcerpt, resolveParentImages } from '@/lib/pageMetadata';
import styles from '../cong-giao-va-tin-lanh.module.css';

type Params = { nhanh: string };

export function generateStaticParams(): Params[] {
  // Nothing is prerendered while the flag is off — the routes 404 in that build anyway.
  if (!CG_TL_ENABLED) return [];
  return getResolvedBranches().map((b) => ({ nhanh: b.branch.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { nhanh } = await params;
  const resolved = CG_TL_ENABLED ? getResolvedBranch(nhanh) : undefined;
  if (!resolved) return {};
  const { branch } = resolved;
  // Each branch is independently shareable — that is the whole point of this surface — so every
  // one carries its own canonical, title and card rather than inheriting the landing page's.
  return pageMetadata({
    title: `${branch.title.vi} — ${CG_TL_TITLE.vi}`,
    description: plainExcerpt(branch.intro.vi),
    path: `${CG_TL_ROUTE}/${branch.slug}`,
    images: await resolveParentImages(parent),
  });
}

export default async function CgTlBranchPage({ params }: { params: Promise<Params> }) {
  // LOCAL-ONLY: 404 unless NEXT_PUBLIC_CG_TL=1 (see lib/congGiaoTinLanhFlag.ts).
  if (!CG_TL_ENABLED) notFound();

  const { nhanh } = await params;
  const branches = getResolvedBranches();
  const current = branches.find((b) => b.branch.slug === nhanh);
  if (!current) notFound();

  const { branch, clusters } = current;
  // Prev/next through the branches in config order. This was a flat "the other parts" list at
  // first — the branches ARE peers, enterable in any order — but that read badly in practice:
  // finishing branch 2 offered branch 1 at the top of the list, pointing the reader back at where
  // they had just been (owner, 2026-08-21). Ordering them relative to the current branch would
  // have fixed the symptom; a rail says the useful thing outright, which is simply "there is a
  // next one". Entry from any branch still works — that is the landing page's job, plus the
  // back-link above, and the root's intro says it can be skipped.
  const index = branches.findIndex((b) => b.branch.slug === nhanh);
  const prev = index > 0 ? branches[index - 1] : null;
  const next = index < branches.length - 1 ? branches[index + 1] : null;

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <Link href={CG_TL_ROUTE} className={styles.back}>
            <Bi2
              value={{ vi: `‹ ${CG_TL_TITLE.vi}`, en: `‹ ${CG_TL_TITLE.en}` }}
              as="span"
              enRecessedClassName={styles.backEnRecessed}
            />
          </Link>
          <LanguageToggle />
        </div>

        <main className={styles.branchPage}>
          <Bi2
            value={branch.title}
            as="h1"
            className={styles.branchPageTitle}
            enRecessedClassName={styles.branchPageTitleEnRecessed}
          />

          {/* The intro — one of the four pieces of new writing on this path. Through ScriptureBi2
              so a Catechism or Scripture reference inside it opens the popover (CLAUDE.md). */}
          <section className={styles.intro}>
            <ScriptureBi2
              {...enrichBi(branch.intro)}
              viClassName={styles.introBody}
              enClassName={styles.introBody}
              enRecessedClassName={styles.introBodyEnRecessed}
            />
          </section>

          <CgTlClusters clusters={clusters} />

          <nav className={styles.branchNav}>
            {prev ? (
              <Link href={`${CG_TL_ROUTE}/${prev.branch.slug}`} className={styles.navPrev}>
                <Bi2
                  value={{ vi: '← Phần trước', en: '← Previous' }}
                  as="span"
                  className={styles.navMeta}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={prev.branch.title}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            ) : (
              <span className={styles.navEmpty} />
            )}
            {next ? (
              <Link href={`${CG_TL_ROUTE}/${next.branch.slug}`} className={styles.navNext}>
                <Bi2
                  value={{ vi: 'Phần sau →', en: 'Next →' }}
                  as="span"
                  className={styles.navMetaNext}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={next.branch.title}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            ) : (
              // The last branch. Sending the reader to /giai-dap here would hand a Protestant
              // reader the whole Catholic Q&A index as their parting screen; the landing is the
              // better close — it is the page written for them, and its four cards are exactly the
              // "what else is here" they now want.
              <Link href={CG_TL_ROUTE} className={styles.navNext}>
                <Bi2
                  value={{ vi: 'Hết phần cuối', en: 'End of the last part' }}
                  as="span"
                  className={styles.navMetaNext}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={{
                    vi: 'Về đầu trang Công Giáo và Tin Lành',
                    en: 'Back to Catholic and Protestant',
                  }}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            )}
          </nav>
        </main>
      </div>
    </>
  );
}
