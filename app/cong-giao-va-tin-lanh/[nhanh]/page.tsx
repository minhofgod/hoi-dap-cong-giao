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
  // Peers, not "next" — the reader picks, or leaves. Kept in config order so the root stays first
  // in the list wherever the reader happens to be standing.
  const siblings = branches.filter((b) => b.branch.slug !== nhanh);

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

          <nav className={styles.siblings}>
            <Bi2
              value={{ vi: 'Những phần khác', en: 'The other parts' }}
              as="div"
              className={styles.siblingsLabel}
              enRecessedClassName={styles.siblingsLabelEnRecessed}
            />
            <ul className={styles.siblingList}>
              {siblings.map(({ branch: sib }) => (
                <li key={sib.slug}>
                  <Link href={`${CG_TL_ROUTE}/${sib.slug}`} className={styles.sibling}>
                    <Bi2
                      value={sib.title}
                      as="span"
                      className={styles.siblingTitle}
                      enRecessedClassName={styles.siblingTitleEnRecessed}
                    />
                    <span className={styles.siblingArrow} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
    </>
  );
}
