'use client';

import { useState } from 'react';
import { Bi2 } from './Bi2';
import type { Section } from '@/lib/churchFathersV2';
import styles from './CollapsibleSection.module.css';

/** One of the profile page's six optional collapsible sections (HANDOFF section 5, item 8).
 *  All start collapsed; the +/- sign is typographic, not an icon glyph, per spec. */
export function CollapsibleSection({ section }: { section: Section }) {
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
          <Bi2 value={section.body} as="p" viClassName={styles.bodyVi} enClassName={styles.bodyEn} enRecessedClassName={styles.bodyEnRecessed} />
        </div>
      )}
    </div>
  );
}
