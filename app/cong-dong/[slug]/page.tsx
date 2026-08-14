import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { Portrait } from '@/components/giao-phu/Portrait';
import { SectionHeading } from '@/components/giao-phu/SectionHeading';
import { CollapsibleSection } from '@/components/giao-phu/CollapsibleSection';
import { Rail } from '@/components/cong-dong/Rail';
import {
  getAllCouncils,
  getCouncilBySlug,
  getAdjacentCouncils,
  getEraGroups,
  ERA_LABEL,
  type Bi,
} from '@/lib/councilsV2';
import { CatechismRef } from '@/components/CatechismRef';
import { resolveCatechism } from '@/lib/content';
import styles from './council.module.css';

export function generateStaticParams() {
  return getAllCouncils().map((c) => ({ slug: c.slug }));
}

const UI = {
  no: { vi: (n: number) => `Số ${n}`, en: (n: number) => `No. ${n}` },
  background: { vi: 'Bối cảnh', en: 'Background' },
  ccc: { vi: 'Liên hệ Giáo Lý', en: 'Catechism cross-references' },
  facts: { vi: 'Sơ lược', en: 'At a glance' },
  documents: { vi: 'Văn kiện chính', en: 'Key documents' },
  apologeticsKicker: { vi: 'Góc hộ giáo', en: 'Apologetics corner' },
  apologeticsTitle: { vi: 'Vấn đáp hộ giáo', en: 'Questions & answers' },
  credit: { vi: 'Nguồn ảnh', en: 'Image credit' },
  prev: { vi: 'Công đồng trước', en: 'Previous' },
  next: { vi: 'Công đồng sau', en: 'Next' },
};

const LICENSE_LABEL: Record<string, Bi> = {
  'public domain': { vi: 'phạm vi công cộng', en: 'public domain' },
};

export default async function CouncilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const council = getCouncilBySlug(slug);
  if (!council) notFound();

  const { prev, next } = getAdjacentCouncils(slug);
  const eraGroups = getEraGroups();
  const eraLabel = ERA_LABEL[council.era];
  const eyebrow: Bi = {
    vi: `${UI.no.vi(council.no)} · ${eraLabel.vi}`,
    en: `${UI.no.en(council.no)} · ${eraLabel.en}`,
  };
  const license =
    LICENSE_LABEL[council.image.license] ?? { vi: council.image.license, en: council.image.license };

  return (
    <>
      <SiteHeader />
      <Rail groups={eraGroups} current={council} />
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <LanguageToggle />
        </div>

        <div className={styles.frontispiece}>
          <Portrait portrait={council.image} name={council.name} size="frontispiece" />
          <Bi2 value={eyebrow} as="div" className={styles.eyebrow} />
          <Bi2
            value={council.name}
            as="h1"
            recessedAs="div"
            viClassName={styles.name}
            enClassName={styles.name}
            enRecessedClassName={styles.nameEnRecessed}
          />
          <div className={styles.dates}>{council.dates.display}</div>
          <Bi2
            value={council.subtitle}
            as="div"
            viClassName={styles.role}
            enClassName={styles.role}
            enRecessedClassName={styles.roleEnRecessed}
          />
        </div>

        <div className={styles.quoteBandOuter}>
          <div className={styles.quoteBand}>
            <Bi2
              value={{ vi: council.quote.vi, en: council.quote.en }}
              as="p"
              viClassName={styles.quoteVi}
              enClassName={styles.quoteViOnDark}
              enRecessedClassName={styles.quoteEnRecessed}
            />
            <Bi2 value={council.quote.source} as="div" className={styles.quoteSource} />
          </div>
        </div>

        <div className={styles.column}>
          <SectionHeading {...UI.background} />
          {council.background.map((p, i) => (
            <Bi2
              key={i}
              value={p}
              as="p"
              viClassName={styles.bodyVi}
              enClassName={styles.bodyVi}
              enRecessedClassName={styles.bodyEnRecessed}
            />
          ))}

          {council.ccc_refs.length > 0 && (
            <div className={styles.cccRow}>
              <span className={styles.cccLabelWrap}>
                <Bi2 value={UI.ccc} as="span" className={styles.cccLabel} />
              </span>
              {council.ccc_refs.map((n) => (
                <CatechismRef key={n} number={n} data={resolveCatechism(n)} className={styles.cccChip} />
              ))}
            </div>
          )}

          <div className={styles.factsCard}>
            {council.facts.map((f, i) => (
              <div key={i} className={styles.factRow}>
                <span className={styles.factLabelCell}>
                  <Bi2 value={f.label} as="span" className={styles.factLabel} />
                </span>
                <span className={styles.factValueCell}>
                  <Bi2 value={f.value} as="span" className={styles.factValue} enRecessedClassName={styles.factValueEnRecessed} />
                </span>
              </div>
            ))}
          </div>

          {council.documents.length > 0 && (
            <>
              <SectionHeading {...UI.documents} />
              <div className={styles.worksCard}>
                {council.documents.map((w, i) => (
                  <div key={i} className={styles.workRow}>
                    <span className={styles.workNo}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={styles.workTitleWrap}>
                      <Bi2
                        value={w.title}
                        as="span"
                        className={styles.workTitle}
                        enRecessedClassName={styles.workTitleEnRecessed}
                      />
                      {w.latin && <span className={styles.workLatin}>{w.latin}</span>}
                    </span>
                    <span className={styles.workDate}>{w.date}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {(council.documents_note.vi || council.documents_note.en) && (
            <Bi2
              value={council.documents_note}
              as="p"
              viClassName={styles.worksNote}
              enClassName={styles.worksNote}
              enRecessedClassName={styles.worksNoteEnRecessed}
            />
          )}

          {council.sections.length > 0 && (
            <div className={styles.collapsibles}>
              {council.sections.map((s) => (
                <CollapsibleSection key={s.id} section={s} />
              ))}
            </div>
          )}
        </div>

        {council.apologetics.length > 0 && (
          <div className={styles.apologeticsOuter}>
            <div className={styles.apologeticsBand}>
              <Bi2 value={UI.apologeticsKicker} as="div" className={styles.apologeticsKicker} />
              <Bi2 value={UI.apologeticsTitle} as="h2" className={styles.apologeticsTitle} />
              <div className={styles.apologeticsGrid}>
                {council.apologetics.map((item, i) => (
                  <div key={i} id={`hoi-${i + 1}`} className={styles.apologeticsItem}>
                    <Bi2 value={item.q} as="div" className={styles.apologeticsQ} />
                    <Bi2
                      value={item.a}
                      as="p"
                      viClassName={styles.apologeticsA}
                      enClassName={styles.apologeticsA}
                      enRecessedClassName={styles.apologeticsAEnRecessed}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {council.image.available && (
          <div className={styles.column}>
            <div className={styles.creditBlock}>
              <Bi2 value={UI.credit} as="div" className={styles.creditHeading} />
              <Bi2
                value={{
                  vi: `${council.image.medium.vi}. ${council.image.source}, ${license.vi}.`,
                  en: `${council.image.medium.en}. ${council.image.source}, ${license.en}.`,
                }}
                as="p"
                viClassName={styles.creditBody}
                enClassName={styles.creditBody}
                enRecessedClassName={styles.creditBodyEnRecessed}
              />
            </div>
          </div>
        )}

        <div className={styles.column}>
          <div className={styles.navRow}>
            {prev ? (
              <Link href={`/cong-dong/${prev.slug}`} className={styles.navPrev}>
                <Bi2 value={UI.prev} as="span" className={styles.navLabel} />
                <Bi2
                  value={prev.name}
                  as="span"
                  className={styles.navName}
                  enRecessedClassName={styles.navNameEnRecessed}
                />
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/cong-dong/${next.slug}`} className={styles.navNext}>
                <Bi2 value={UI.next} as="span" className={styles.navLabel} />
                <Bi2
                  value={next.name}
                  as="span"
                  className={styles.navName}
                  enRecessedClassName={styles.navNameEnRecessed}
                />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
