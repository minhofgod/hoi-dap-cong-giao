'use client';

import { useLang } from '@/lib/giao-phu/useLang';
import { ScriptureBody } from '@/components/ScriptureBody';
import type { EnrichedAnswer } from '@/lib/bibleRefs';

/** The saint's life narrative (roadmap "Saints are life STORIES"). The narrative `story` is
 *  VN-primary; the shorter bilingual `life[]` summary is the English fallback. So:
 *   - VI mode  → the VN story (or the VN summary, if this saint has no story yet).
 *   - EN mode  → the English `life[]` summary (never blank, even for a VN-only story).
 *   - Cả hai   → the VN story, then the English summary recessed beneath it.
 *  Entries with no `story` render exactly as before (the bilingual summary), so this is a safe
 *  drop-in for the previous `life[].map(<ScriptureBi2>)` block. Bodies are enriched server-side by
 *  enrichPlain / enrichBi, so the CGKPV resolver never reaches the client. */
export function SaintStory({
  story,
  life,
  viClassName,
  enClassName,
  enRecessedClassName,
}: {
  /** Enriched VN story paragraphs (empty when the saint has no story yet). */
  story: EnrichedAnswer[];
  /** Enriched bilingual summary paragraphs. */
  life: { vi: EnrichedAnswer; en: EnrichedAnswer }[];
  viClassName?: string;
  enClassName?: string;
  enRecessedClassName?: string;
}) {
  const lang = useLang();
  const hasStory = story.length > 0;
  const has = (a: EnrichedAnswer | undefined) => ((a?.html ?? '').trim().length > 0);
  const viParas = hasStory ? story : life.map((p) => p.vi);

  if (lang === 'en') {
    return (
      <>
        {life.map((p, i) => (has(p.en) ? <ScriptureBody key={i} className={enClassName} {...p.en} /> : null))}
      </>
    );
  }

  if (lang === 'vi') {
    return (
      <>
        {viParas.map((p, i) => (has(p) ? <ScriptureBody key={i} className={viClassName} {...p} /> : null))}
      </>
    );
  }

  // Cả hai — VN narrative, then the English summary recessed beneath.
  return (
    <>
      {viParas.map((p, i) => (has(p) ? <ScriptureBody key={`v${i}`} className={viClassName} {...p} /> : null))}
      {life.map((p, i) => (has(p.en) ? <ScriptureBody key={`e${i}`} className={enRecessedClassName} {...p.en} /> : null))}
    </>
  );
}
