import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { EvidenceAnswers } from '@/components/bang-chung/EvidenceAnswers';
import { getResolvedStage, getResolvedStages } from '@/lib/evidencePath';
import { enrichBi } from '@/lib/bibleRefs';
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
import styles from '../bang-chung.module.css';

type Params = { stage: string };

export function generateStaticParams(): Params[] {
  // Nothing is prerendered while the flag is off — the routes 404 in that build anyway.
  if (!EVIDENCE_PATH_ENABLED) return [];
  return getResolvedStages().map((s) => ({ stage: s.stage.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { stage: slug } = await params;
  const resolved = EVIDENCE_PATH_ENABLED ? getResolvedStage(slug) : undefined;
  if (!resolved) return {};
  const { stage } = resolved;
  return {
    title: `${stage.title.vi} — Bằng chứng về Chúa Giêsu · Hỏi Đáp Công Giáo`,
    description: stage.bridge.vi,
  };
}

export default async function EvidenceStagePage({ params }: { params: Promise<Params> }) {
  // LOCAL-ONLY: 404 unless NEXT_PUBLIC_EVIDENCE_PATH=1 (see lib/evidencePathFlag.ts).
  if (!EVIDENCE_PATH_ENABLED) notFound();

  const { stage: slug } = await params;
  const stages = getResolvedStages();
  const index = stages.findIndex((s) => s.stage.slug === slug);
  if (index === -1) notFound();

  const { stage, anchor, parts, partial } = stages[index];
  const prev = index > 0 ? stages[index - 1] : null;
  const next = index < stages.length - 1 ? stages[index + 1] : null;
  const total = stages.length;

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topBar}>
          <Link href="/bang-chung" className={styles.back}>
            <Bi2
              value={{ vi: '‹ Bằng chứng về Chúa Giêsu', en: '‹ The Evidence for Jesus' }}
              as="span"
              enRecessedClassName={styles.backEnRecessed}
            />
          </Link>
          <LanguageToggle />
        </div>

        <main className={styles.stagePage}>
          {/* Progress: one segment per stage, filled up to and including this one. */}
          <div className={styles.progress}>
            <div className={styles.progressBars} aria-hidden="true">
              {stages.map((s, i) => (
                <span
                  key={s.stage.slug}
                  className={i <= index ? styles.progressBarDone : styles.progressBar}
                />
              ))}
            </div>
            <Bi2
              value={{
                vi: `Bước ${stage.step} / ${total}`,
                en: `Step ${stage.step} of ${total}`,
              }}
              as="div"
              className={styles.progressLabel}
              enRecessedClassName={styles.progressLabelEnRecessed}
            />
          </div>

          <Bi2
            value={stage.title}
            as="h1"
            className={styles.stagePageTitle}
            enRecessedClassName={styles.stagePageTitleEnRecessed}
          />

          {/* The bridge — the one piece of new writing on this path. Rendered through ScriptureBi2
              so any Scripture/CCC reference in it opens the popover rather than shipping as plain
              text (CLAUDE.md). */}
          <section className={styles.bridge}>
            <div className={styles.bridgeKicker}>
              <Bi2
                value={
                  prev
                    ? { vi: 'Từ bước trước', en: 'From the previous step' }
                    : { vi: 'Bắt đầu từ đây', en: 'Starting here' }
                }
                as="span"
                enRecessedClassName={styles.bridgeKickerEnRecessed}
              />
            </div>
            <ScriptureBi2
              {...enrichBi(stage.bridge)}
              viClassName={styles.bridgeBody}
              enClassName={styles.bridgeBody}
              enRecessedClassName={styles.bridgeBodyEnRecessed}
            />
          </section>

          <EvidenceAnswers anchor={anchor} parts={parts} partial={partial} />

          <nav className={styles.stageNav}>
            {prev ? (
              <Link href={`/bang-chung/${prev.stage.slug}`} className={styles.navPrev}>
                <Bi2
                  value={{ vi: `← Bước ${prev.stage.step}`, en: `← Step ${prev.stage.step}` }}
                  as="span"
                  className={styles.navMeta}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={prev.stage.title}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            ) : (
              <span className={styles.navEmpty} />
            )}
            {next ? (
              <Link href={`/bang-chung/${next.stage.slug}`} className={styles.navNext}>
                <Bi2
                  value={{ vi: `Bước ${next.stage.step} →`, en: `Step ${next.stage.step} →` }}
                  as="span"
                  className={styles.navMetaNext}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={next.stage.title}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            ) : (
              <Link href="/giai-dap" className={styles.navNext}>
                <Bi2
                  value={{ vi: 'Hết con đường', en: 'End of the path' }}
                  as="span"
                  className={styles.navMetaNext}
                  enRecessedClassName={styles.navMetaEnRecessed}
                />
                <Bi2
                  value={{ vi: 'Xem tất cả Giải Đáp', en: 'Browse all Q&A' }}
                  as="span"
                  className={styles.navTitle}
                  enRecessedClassName={styles.navTitleEnRecessed}
                />
              </Link>
            )}
          </nav>

          {/* Stages stay jumpable — plenty of readers arrive caring only about step 4. */}
          <div className={styles.jump}>
            <Bi2
              value={{ vi: 'Nhảy tới bước:', en: 'Jump to step:' }}
              as="span"
              className={styles.jumpLabel}
              enRecessedClassName={styles.jumpLabelEnRecessed}
            />
            {stages.map((s) => (
              <Link
                key={s.stage.slug}
                href={`/bang-chung/${s.stage.slug}`}
                className={s.stage.slug === slug ? styles.jumpPillCurrent : styles.jumpPill}
                aria-current={s.stage.slug === slug ? 'page' : undefined}
              >
                {s.stage.step}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
