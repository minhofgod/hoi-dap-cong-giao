'use client';

import { useLang } from '@/lib/giao-phu/useLang';
import { ScriptureBody } from './ScriptureBody';
import type { EnrichedAnswer } from '@/lib/bibleRefs';

/**
 * Bilingual sibling of <Bi2> for prose that may contain Bible references. It keeps Bi2's
 * language behavior — VI only / EN only / both (Vietnamese primary, English recessed) driven by
 * the language toggle — but renders each body through <ScriptureBody>, so inline verse references
 * open the shared verse popover.
 *
 * The `vi`/`en` enriched bodies are produced SERVER-SIDE by enrichBi() (lib/bibleRefs), so the
 * copyrighted CGKPV text and the resolver never reach the client bundle. When the licensing flag
 * is off, each body is just escaped text with no data — same output as plain Bi2, no popover.
 */
export function ScriptureBi2({
  vi,
  en,
  viClassName,
  enClassName,
  enRecessedClassName,
}: {
  vi: EnrichedAnswer;
  en: EnrichedAnswer;
  viClassName?: string;
  enClassName?: string;
  enRecessedClassName?: string;
}) {
  const lang = useLang();
  const hasVi = (vi?.html ?? '').trim().length > 0;
  const hasEn = (en?.html ?? '').trim().length > 0;

  if (lang === 'vi') return hasVi ? <ScriptureBody className={viClassName} {...vi} /> : null;
  if (lang === 'en') return hasEn ? <ScriptureBody className={enClassName ?? viClassName} {...en} /> : null;

  return (
    <>
      {hasVi && <ScriptureBody className={viClassName} {...vi} />}
      {hasEn && <ScriptureBody className={enRecessedClassName ?? enClassName} {...en} />}
    </>
  );
}
