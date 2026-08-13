'use client';

import { useCallback, useState } from 'react';
import type { ResolvedReference } from '@/lib/bibleRefs';
import { SCRIPTURE_POPOVER_ENABLED } from '@/lib/scriptureFlag';
import { VersePopover } from './VersePopover';
import styles from './ScriptureRef.module.css';

type Variant = 'inline' | 'chip';

function ActiveRef({
  refLabel,
  data,
  variant,
  className,
}: {
  refLabel: string;
  data: ResolvedReference;
  variant: Variant;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    anchorEl?.focus();
  }, [anchorEl]);

  return (
    <span className={styles.anchor}>
      <button
        ref={setAnchorEl}
        type="button"
        className={`${variant === 'chip' ? styles.chipRef : styles.ref} ${className ?? ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {refLabel}
      </button>
      {open && <VersePopover data={data} anchor={anchorEl} onClose={close} />}
    </span>
  );
}

/**
 * An inline Scripture reference. When the licensing flag is on and verse data is present,
 * it opens a popover with the CGKPV text; otherwise it renders as an inert sage chip.
 *
 * `data` should be resolved server-side (see lib/bibleRefs.ts) and only when
 * SCRIPTURE_POPOVER_ENABLED is true, so no copyrighted text ships while the flag is off.
 */
export function ScriptureRef({
  refLabel,
  data,
  variant = 'inline',
  className,
}: {
  refLabel: string;
  data: ResolvedReference | null;
  variant?: Variant;
  className?: string;
}) {
  if (!SCRIPTURE_POPOVER_ENABLED || !data) {
    const inert = variant === 'chip' ? styles.chipInert : styles.inlineInert;
    return <span className={`${inert} ${className ?? ''}`}>{refLabel}</span>;
  }
  return <ActiveRef refLabel={refLabel} data={data} variant={variant} className={className} />;
}
