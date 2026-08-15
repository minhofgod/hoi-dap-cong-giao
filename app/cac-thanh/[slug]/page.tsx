import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { Portrait } from '@/components/giao-phu/Portrait';
import { SectionHeading } from '@/components/giao-phu/SectionHeading';
import { CollapsibleSection } from '@/components/giao-phu/CollapsibleSection';
import { SaintsRail } from '@/components/cac-thanh/SaintsRail';
import {
  getAllSaints,
  getSaintBySlug,
  getAdjacentSaints,
  getGroupBlocks,
  GROUP_LABEL,
  type Bi,
} from '@/lib/saintsV2';
import { CatechismRef } from '@/components/CatechismRef';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { resolveCatechism } from '@/lib/content';
import { enrichBi } from '@/lib/bibleRefs';
import styles from './saint.module.css';

export function generateStaticParams() {
  return getAllSaints().map((s) => ({ slug: s.slug }));
}

const UI = {
  no: { vi: (n: number) => `Số ${n}`, en: (n: number) => `No. ${n}` },
  life: { vi: 'Cuộc đời', en: 'Life' },
  ccc: { vi: 'Liên hệ Giáo Lý', en: 'Catechism cross-references' },
  works: { vi: 'Tác phẩm & di sản', en: 'Writings & legacy' },
  apologeticsKicker: { vi: 'Góc hộ giáo', en: 'Apologetics corner' },
  apologeticsTitle: { vi: 'Vấn đáp hộ giáo', en: 'Questions & answers' },
  readOn: { vi: 'Đọc tiếp', en: 'Read on' },
  soon: { vi: 'Sắp có', en: 'Coming soon' },
  credit: { vi: 'Nguồn ảnh', en: 'Image credit' },
  prev: { vi: 'Vị trước', en: 'Previous' },
  next: { vi: 'Vị sau', en: 'Next' },
};

const LICENSE_LABEL: Record<string, Bi> = {
  'public domain': { vi: 'phạm vi công cộng', en: 'public domain' },
};

export default async function SaintPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const saint = getSaintBySlug(slug);
  if (!saint) notFound();

  const { prev, next } = getAdjacentSaints(slug);
  const groups = getGroupBlocks();
  const groupLabel = GROUP_LABEL[saint.group];
  const eyebrow: Bi = {
    vi: `${UI.no.vi(saint.no)} · ${groupLabel.vi}`,
    en: `${UI.no.en(saint.no)} · ${groupLabel.en}`,
  };
  const license = LICENSE_LABEL[saint.portrait.license] ?? { vi: saint.portrait.license, en: saint.portrait.license };

  const works = saint.works ?? [];
  const sections = saint.sections ?? [];
  const apologetics = saint.apologetics ?? [];
  const cccRefs = saint.ccc_refs ?? [];
  const related = saint.related ?? [];
  const worksHeading = saint.works_label ?? UI.works;

  return (
    <>
      <SiteHeader />
      <SaintsRail groups={groups} current={saint} />
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <LanguageToggle />
        </div>

        <div className={styles.frontispiece}>
          <Portrait portrait={saint.portrait} name={saint.name} size="frontispiece" />
          <Bi2 value={eyebrow} as="div" className={styles.eyebrow} />
          <Bi2
            value={saint.name}
            as="h1"
            recessedAs="div"
            viClassName={styles.name}
            enClassName={styles.name}
            enRecessedClassName={styles.nameEnRecessed}
          />
          <div className={styles.dates}>{saint.dates.display}</div>
          <Bi2
            value={saint.role}
            as="div"
            viClassName={styles.role}
            enClassName={styles.role}
            enRecessedClassName={styles.roleEnRecessed}
          />
        </div>

        {(saint.quote.vi || saint.quote.en) && (
          <div className={styles.quoteBandOuter}>
            <div className={styles.quoteBand}>
              <Bi2
                value={{ vi: saint.quote.vi, en: saint.quote.en }}
                as="p"
                viClassName={styles.quoteVi}
                enClassName={styles.quoteViOnDark}
                enRecessedClassName={styles.quoteEnRecessed}
              />
              <Bi2 value={saint.quote.source} as="div" className={styles.quoteSource} />
            </div>
          </div>
        )}

        <div className={styles.column}>
          <SectionHeading {...UI.life} />
          {saint.life.map((p, i) => (
            <ScriptureBi2
              key={i}
              {...enrichBi(p)}
              viClassName={styles.bodyVi}
              enClassName={styles.bodyVi}
              enRecessedClassName={styles.bodyEnRecessed}
            />
          ))}

          {cccRefs.length > 0 && (
            <div className={styles.cccRow}>
              <span className={styles.cccLabelWrap}>
                <Bi2 value={UI.ccc} as="span" className={styles.cccLabel} />
              </span>
              {cccRefs.map((n) => (
                <CatechismRef key={n} number={n} data={resolveCatechism(n)} className={styles.cccChip} />
              ))}
            </div>
          )}

          <div className={styles.factsCard}>
            {saint.facts.map((f, i) => (
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

          {works.length > 0 && (
            <>
              <SectionHeading {...worksHeading} />
              <div className={styles.worksCard}>
                {works.map((w, i) => (
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
          {saint.works_note && (saint.works_note.vi || saint.works_note.en) && (
            <ScriptureBi2
              {...enrichBi(saint.works_note)}
              viClassName={styles.worksNote}
              enClassName={styles.worksNote}
              enRecessedClassName={styles.worksNoteEnRecessed}
            />
          )}

          {sections.length > 0 && (
            <div className={styles.collapsibles}>
              {sections.map((s) => (
                <CollapsibleSection key={s.id} section={s} body={enrichBi(s.body)} />
              ))}
            </div>
          )}
        </div>

        {apologetics.length > 0 && (
          <div className={styles.apologeticsOuter}>
            <div className={styles.apologeticsBand}>
              <Bi2 value={UI.apologeticsKicker} as="div" className={styles.apologeticsKicker} />
              <Bi2 value={UI.apologeticsTitle} as="h2" className={styles.apologeticsTitle} />
              <div className={styles.apologeticsGrid}>
                {apologetics.map((item, i) => (
                  <div key={i} className={styles.apologeticsItem}>
                    <Bi2 value={item.q} as="div" className={styles.apologeticsQ} />
                    <ScriptureBi2
                      {...enrichBi(item.a)}
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

        {related.length > 0 && (
          <div className={styles.readOn}>
            <Bi2 value={UI.readOn} as="div" className={styles.readOnHeading} />
            {related.map((r, i) =>
              r.available ? (
                <Link key={i} href={r.href} className={styles.readOnCard}>
                  <span className={styles.readOnText}>
                    <Bi2 value={r.label} as="span" className={styles.readOnLabel} enRecessedClassName={styles.readOnLabelEnRecessed} />
                    {r.note && (
                      <Bi2 value={r.note} as="span" viClassName={styles.readOnNote} enClassName={styles.readOnNote} enRecessedClassName={styles.readOnNoteEnRecessed} />
                    )}
                  </span>
                  <span className={styles.readOnArrow} aria-hidden="true">→</span>
                </Link>
              ) : (
                <div key={i} className={`${styles.readOnCard} ${styles.readOnCardSoon}`}>
                  <span className={styles.readOnText}>
                    <Bi2 value={r.label} as="span" className={styles.readOnLabel} enRecessedClassName={styles.readOnLabelEnRecessed} />
                    {r.note && (
                      <Bi2 value={r.note} as="span" viClassName={styles.readOnNote} enClassName={styles.readOnNote} enRecessedClassName={styles.readOnNoteEnRecessed} />
                    )}
                  </span>
                  <Bi2 value={UI.soon} as="span" className={styles.readOnSoonTag} />
                </div>
              )
            )}
          </div>
        )}

        {saint.portrait.available && (
          <div className={styles.column}>
            <div className={styles.creditBlock}>
              <Bi2 value={UI.credit} as="div" className={styles.creditHeading} />
              <Bi2
                value={{
                  vi: `${saint.portrait.medium.vi}. ${saint.portrait.source}, ${license.vi}.`,
                  en: `${saint.portrait.medium.en}. ${saint.portrait.source}, ${license.en}.`,
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
              <Link href={`/cac-thanh/${prev.slug}`} className={styles.navPrev}>
                <Bi2 value={UI.prev} as="span" className={styles.navLabel} />
                <Bi2 value={prev.name} as="span" className={styles.navName} enRecessedClassName={styles.navNameEnRecessed} />
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/cac-thanh/${next.slug}`} className={styles.navNext}>
                <Bi2 value={UI.next} as="span" className={styles.navLabel} />
                <Bi2 value={next.name} as="span" className={styles.navName} enRecessedClassName={styles.navNameEnRecessed} />
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
