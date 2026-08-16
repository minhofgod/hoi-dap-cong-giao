import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Bi2 } from '@/components/giao-phu/Bi2';
import { SectionHeading } from '@/components/giao-phu/SectionHeading';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import { CatechismRef } from '@/components/CatechismRef';
import { StatusBadge } from '@/components/phep-la/StatusBadge';
import {
  getAllMiracles,
  getMiracleBySlug,
  getAdjacentMiracles,
  TYPE_LABEL_SHORT,
  STATUS_NOTE,
  PRIVATE_REVELATION_NOTE,
  type Bi,
} from '@/lib/miraclesV2';
import { getSaintBySlug } from '@/lib/saintsV2';
import { resolveCatechism } from '@/lib/content';
import { enrichBi } from '@/lib/bibleRefs';
import styles from './miracle.module.css';

export function generateStaticParams() {
  return getAllMiracles().map((m) => ({ slug: m.slug }));
}

const UI = {
  no: { vi: (n: number) => `Số ${n}`, en: (n: number) => `No. ${n}` },
  story: { vi: 'Chuyện đã xảy ra', en: 'What happened' },
  recognition: { vi: 'Hội Thánh đã nói gì', en: 'What the Church has said' },
  evidence: { vi: 'Chứng cứ', en: 'The evidence' },
  limits: { vi: 'Điều này KHÔNG chứng minh', en: 'What this does NOT establish' },
  significance: { vi: 'Vì sao điều này quan trọng', en: 'Why it matters' },
  facts: { vi: 'Tóm tắt', en: 'At a glance' },
  ccc: { vi: 'Liên hệ Giáo Lý', en: 'Catechism cross-references' },
  sources: { vi: 'Nguồn tham khảo', en: 'Sources' },
  readOn: { vi: 'Đọc tiếp', en: 'Read on' },
  soon: { vi: 'Sắp có', en: 'Coming soon' },
  meansKicker: { vi: 'Tình trạng này nghĩa là gì', en: 'What this status means' },
  privateRevelation: { vi: 'Về mặc khải tư', en: 'On private revelation' },
  credit: { vi: 'Nguồn ảnh', en: 'Image credit' },
  prev: { vi: 'Trường hợp trước', en: 'Previous' },
  next: { vi: 'Trường hợp sau', en: 'Next' },
  saintBridge: { vi: 'Người trong câu chuyện', en: 'The person in this story' },
};

const LICENSE_LABEL: Record<string, Bi> = {
  'public domain': { vi: 'phạm vi công cộng', en: 'public domain' },
};

/** A run of bilingual paragraphs, each enriched so inline Scripture / GLHTCG references open the
 *  shared popover (CLAUDE.md — reference popover rule). */
function Prose({
  paragraphs,
  viClassName,
  enRecessedClassName,
}: {
  paragraphs: Bi[];
  viClassName: string;
  enRecessedClassName: string;
}) {
  return (
    <>
      {paragraphs.map((p, i) => (
        <ScriptureBi2
          key={i}
          {...enrichBi(p)}
          viClassName={viClassName}
          enClassName={viClassName}
          enRecessedClassName={enRecessedClassName}
        />
      ))}
    </>
  );
}

export default async function MiraclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const miracle = getMiracleBySlug(slug);
  if (!miracle) notFound();

  const { prev, next } = getAdjacentMiracles(slug);
  const typeLabel = TYPE_LABEL_SHORT[miracle.type];
  const eyebrow: Bi = {
    vi: `${UI.no.vi(miracle.no)} · ${typeLabel.vi}`,
    en: `${UI.no.en(miracle.no)} · ${typeLabel.en}`,
  };

  const facts = miracle.facts ?? [];
  const cccRefs = miracle.ccc_refs ?? [];
  const related = miracle.related ?? [];
  const saint = miracle.related_saint ? getSaintBySlug(miracle.related_saint) : undefined;
  const license = LICENSE_LABEL[miracle.image.license] ?? {
    vi: miracle.image.license,
    en: miracle.image.license,
  };

  return (
    <>
      <SiteHeader />
      <div className={styles.wrap}>
        <div className={styles.topRow}>
          <Link href="/phep-la" className={styles.backLink}>
            <Bi2
              value={{ vi: '← Phép Lạ & Hiện Ra', en: '← Miracles & Apparitions' }}
              as="span"
            />
          </Link>
          <LanguageToggle />
        </div>

        <div className={styles.frontispiece}>
          <Bi2 value={eyebrow} as="div" className={styles.eyebrow} />
          <Bi2
            value={miracle.title}
            as="h1"
            recessedAs="div"
            viClassName={styles.name}
            enClassName={styles.name}
            enRecessedClassName={styles.nameEnRecessed}
          />
          <Bi2
            value={miracle.location}
            as="div"
            viClassName={styles.place}
            enClassName={styles.place}
            enRecessedClassName={styles.placeEnRecessed}
          />
          <div className={styles.dates}>{miracle.date.display}</div>
          <div className={styles.badgeRow}>
            <StatusBadge status={miracle.status} size="detail" />
          </div>
        </div>

        <div className={styles.column}>
          <Bi2
            value={miracle.summary}
            as="p"
            viClassName={styles.summary}
            enClassName={styles.summary}
            enRecessedClassName={styles.summaryEnRecessed}
          />

          {/* The status caption sits BEFORE the narrative on purpose: the reader learns what the
              Church actually did before they are moved by the story, not after. */}
          <div className={styles.statusNote}>
            <Bi2 value={UI.meansKicker} as="div" className={styles.statusNoteKicker} />
            <Bi2
              value={STATUS_NOTE[miracle.status]}
              as="p"
              viClassName={styles.statusNoteBody}
              enClassName={styles.statusNoteBody}
              enRecessedClassName={styles.statusNoteBodyEnRecessed}
            />
          </div>

          <SectionHeading {...UI.story} />
          <Prose
            paragraphs={miracle.story}
            viClassName={styles.bodyVi}
            enRecessedClassName={styles.bodyEnRecessed}
          />

          <SectionHeading {...UI.recognition} />
          <Prose
            paragraphs={miracle.recognition}
            viClassName={styles.bodyVi}
            enRecessedClassName={styles.bodyEnRecessed}
          />

          {miracle.type === 'marian-apparition' && (
            <div className={styles.revelationNote}>
              <Bi2 value={UI.privateRevelation} as="div" className={styles.statusNoteKicker} />
              <ScriptureBi2
                {...enrichBi(PRIVATE_REVELATION_NOTE)}
                viClassName={styles.statusNoteBody}
                enClassName={styles.statusNoteBody}
                enRecessedClassName={styles.statusNoteBodyEnRecessed}
              />
            </div>
          )}

          <SectionHeading {...UI.evidence} />
          <Prose
            paragraphs={miracle.evidence}
            viClassName={styles.bodyVi}
            enRecessedClassName={styles.bodyEnRecessed}
          />
        </div>

        {/* The limits block gets its own full-width dark band — same visual weight as a pull-quote,
            because in this section it carries the same weight as the story. */}
        <div className={styles.limitsOuter}>
          <div className={styles.limitsBand}>
            <Bi2 value={UI.limits} as="h2" className={styles.limitsTitle} />
            <Prose
              paragraphs={miracle.limits}
              viClassName={styles.limitsBody}
              enRecessedClassName={styles.limitsBodyEnRecessed}
            />
          </div>
        </div>

        <div className={styles.column}>
          <SectionHeading {...UI.significance} />
          <Prose
            paragraphs={miracle.significance}
            viClassName={styles.bodyVi}
            enRecessedClassName={styles.bodyEnRecessed}
          />

          {cccRefs.length > 0 && (
            <div className={styles.cccRow}>
              <span className={styles.cccLabelWrap}>
                <Bi2 value={UI.ccc} as="span" className={styles.cccLabel} />
              </span>
              {cccRefs.map((n) => (
                <CatechismRef
                  key={n}
                  number={n}
                  data={resolveCatechism(n)}
                  className={styles.cccChip}
                />
              ))}
            </div>
          )}

          {facts.length > 0 && (
            <>
              <SectionHeading {...UI.facts} />
              <div className={styles.factsCard}>
                {facts.map((f, i) => (
                  <div key={i} className={styles.factRow}>
                    <span className={styles.factLabelCell}>
                      <Bi2 value={f.label} as="span" className={styles.factLabel} />
                    </span>
                    <span className={styles.factValueCell}>
                      <Bi2
                        value={f.value}
                        as="span"
                        className={styles.factValue}
                        enRecessedClassName={styles.factValueEnRecessed}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {miracle.sources.length > 0 && (
            <div className={styles.sourcesSection}>
              <Bi2 value={UI.sources} as="div" className={styles.sourcesHeading} />
              <ul className={styles.sourcesList}>
                {miracle.sources.map((s) => (
                  <li key={s.url ?? s.label} className={styles.sourceItem}>
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
          )}
        </div>

        {(saint || related.length > 0) && (
          <div className={styles.readOn}>
            <Bi2 value={UI.readOn} as="div" className={styles.readOnHeading} />
            {saint && (
              <Link href={`/cac-thanh/${saint.slug}`} className={styles.readOnCard}>
                <span className={styles.readOnText}>
                  <Bi2
                    value={saint.name}
                    as="span"
                    className={styles.readOnLabel}
                    enRecessedClassName={styles.readOnLabelEnRecessed}
                  />
                  <Bi2
                    value={UI.saintBridge}
                    as="span"
                    viClassName={styles.readOnNote}
                    enClassName={styles.readOnNote}
                    enRecessedClassName={styles.readOnNoteEnRecessed}
                  />
                </span>
                <span className={styles.readOnArrow} aria-hidden="true">
                  →
                </span>
              </Link>
            )}
            {related.map((r, i) =>
              r.available ? (
                <Link key={i} href={r.href} className={styles.readOnCard}>
                  <span className={styles.readOnText}>
                    <Bi2
                      value={r.label}
                      as="span"
                      className={styles.readOnLabel}
                      enRecessedClassName={styles.readOnLabelEnRecessed}
                    />
                    {r.note && (
                      <Bi2
                        value={r.note}
                        as="span"
                        viClassName={styles.readOnNote}
                        enClassName={styles.readOnNote}
                        enRecessedClassName={styles.readOnNoteEnRecessed}
                      />
                    )}
                  </span>
                  <span className={styles.readOnArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : (
                <div key={i} className={`${styles.readOnCard} ${styles.readOnCardSoon}`}>
                  <span className={styles.readOnText}>
                    <Bi2
                      value={r.label}
                      as="span"
                      className={styles.readOnLabel}
                      enRecessedClassName={styles.readOnLabelEnRecessed}
                    />
                    {r.note && (
                      <Bi2
                        value={r.note}
                        as="span"
                        viClassName={styles.readOnNote}
                        enClassName={styles.readOnNote}
                        enRecessedClassName={styles.readOnNoteEnRecessed}
                      />
                    )}
                  </span>
                  <Bi2 value={UI.soon} as="span" className={styles.readOnSoonTag} />
                </div>
              )
            )}
          </div>
        )}

        {miracle.image.available && (
          <div className={styles.column}>
            <div className={styles.creditBlock}>
              <Bi2 value={UI.credit} as="div" className={styles.creditHeading} />
              <Bi2
                value={{
                  vi: `${miracle.image.caption.vi}. ${miracle.image.source}, ${license.vi}.`,
                  en: `${miracle.image.caption.en}. ${miracle.image.source}, ${license.en}.`,
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
              <Link href={`/phep-la/${prev.slug}`} className={styles.navPrev}>
                <Bi2 value={UI.prev} as="span" className={styles.navLabel} />
                <Bi2
                  value={prev.title}
                  as="span"
                  className={styles.navName}
                  enRecessedClassName={styles.navNameEnRecessed}
                />
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/phep-la/${next.slug}`} className={styles.navNext}>
                <Bi2 value={UI.next} as="span" className={styles.navLabel} />
                <Bi2
                  value={next.title}
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
