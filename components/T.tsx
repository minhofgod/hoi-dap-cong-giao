import type { ReactNode } from 'react';

/** Inline bilingual UI label. Renders both languages; CSS ([data-lang] on <html>, see the
 *  .ui-vi/.ui-en rules in globals.css) shows the active one. "Cả hai" shows Vietnamese only,
 *  so short chrome labels never double up. Server-safe — both strings ship in the HTML. */
export function T({ vi, en }: { vi: ReactNode; en: ReactNode }) {
  return (
    <>
      <span className="ui-vi">{vi}</span>
      <span className="ui-en">{en}</span>
    </>
  );
}
