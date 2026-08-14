'use client';

import { useState } from 'react';
import { Bi2 } from './Bi2';
import { ScriptureBi2 } from '@/components/ScriptureBi2';
import type { Section } from '@/lib/churchFathersV2';
import type { EnrichedAnswer } from '@/lib/bibleRefs';
import styles from './CollapsibleSection.module.css';

/** One of the profile page's six optional collapsible sections (HANDOFF section 5, item 8).
 *  All start collapsed; the +/- sign is typographic, not an icon glyph, per spec.
 *
 *  When `body` (a server-enriched vi/en pair from enrichBi) is passed, the body renders through
 *  ScriptureBi2 so inline Bible references open the verse popover; otherwise it falls back to the
 *  plain-text Bi2 rendering of `section.body`. */
export function CollapsibleSection({
  section,
  body,
}: {
  section: Section;
  body?: { vi: EnrichedAnswer; en: EnrichedAnswer };
}) {
  const [open, setOpen] = useState(section.open);

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Bi2 value={section.title} as="span" className={styles.title} enRecessedClassName={styles.titleEnRecessed} />
        <span className={styles.sign} aria-hidden="true">
          {open ? '–' : '+'}
        </span>
      </button>
      {open && (
        <div className={styles.body}>
          {body ? (
            <ScriptureBi2
              vi={body.vi}
              en={body.en}
              viClassName={styles.bodyVi}
              enClassName={styles.bodyEn}
              enRecessedClassName={styles.bodyEnRecessed}
            />
          ) : (
            <Bi2 value={section.body} as="p" viClassName={styles.bodyVi} enClassName={styles.bodyEn} enRecessedClassName={styles.bodyEnRecessed} />
          )}
        </div>
      )}
    </div>
  );
}
