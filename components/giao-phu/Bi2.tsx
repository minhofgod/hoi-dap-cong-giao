'use client';

import type { ElementType } from 'react';
import { useLang } from '@/lib/giao-phu/useLang';
import type { Bi as BiPair } from '@/lib/churchFathersV2';

function cx(...parts: (string | undefined | false)[]): string | undefined {
  const joined = parts.filter(Boolean).join(' ');
  return joined || undefined;
}

/** THE bilingual rendering primitive for Giáo Phụ (HANDOFF-giao-phu.md section 1).
 *
 *  Unlike components/Bi.tsx (the rest of the site's CSS-hide pattern, where both languages stay
 *  in the DOM at all times), this component actually mounts/unmounts React nodes based on the
 *  current language — the wrong-language string is never in the DOM at all in VI/EN modes.
 *
 *  - VI mode: renders `value.vi` only, using `viClassName`.
 *  - EN mode: renders `value.en` only, using `enClassName` (English is primary here, not
 *    recessed — per HANDOFF, weight 400 minimum, never the muted "Cả hai" treatment).
 *  - Cả hai (both): renders `value.vi` (viClassName) followed by `value.en`
 *    (enRecessedClassName ?? enClassName) — Vietnamese primary, English recessed below.
 *
 *  If one language is missing for a given field, the available language still renders alone
 *  (per HANDOFF: "render the available language ... never silently mix"). */
export function Bi2({
  value,
  as: Tag = 'span',
  enAs,
  recessedAs,
  viClassName,
  enClassName,
  enRecessedClassName,
  className,
}: {
  value: BiPair | undefined | null;
  as?: ElementType;
  /** Tag for the English node when EN is primary (EN mode). Defaults to `as`. Kept separate from
   *  `recessedAs` so an EN-mode heading stays a real heading tag (e.g. <h1>) even though the same
   *  field renders as a small recessed <div> underneath the Vietnamese heading in Cả hai mode. */
  enAs?: ElementType;
  /** Tag for the English node when it's recessed under Vietnamese (Cả hai mode). Defaults to `as`. */
  recessedAs?: ElementType;
  viClassName?: string;
  enClassName?: string;
  enRecessedClassName?: string;
  className?: string;
}) {
  const lang = useLang();
  if (!value) return null;
  const vi = (value.vi ?? '').trim();
  const en = (value.en ?? '').trim();
  if (!vi && !en) return null;

  const ViTag = Tag;

  if (lang === 'vi') {
    if (!vi) return null;
    return <ViTag className={cx(className, viClassName)}>{vi}</ViTag>;
  }
  if (lang === 'en') {
    if (!en) return null;
    const EnPrimaryTag = enAs ?? Tag;
    return <EnPrimaryTag className={cx(className, enClassName)}>{en}</EnPrimaryTag>;
  }
  const RecessedTag = recessedAs ?? Tag;
  return (
    <>
      {vi && <ViTag className={cx(className, viClassName)}>{vi}</ViTag>}
      {en && <RecessedTag className={cx(className, enRecessedClassName ?? enClassName)}>{en}</RecessedTag>}
    </>
  );
}
