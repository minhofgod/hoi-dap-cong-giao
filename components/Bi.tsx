import type { ElementType, ReactNode } from 'react';
import type { Bi as BiValue } from '@/lib/churchFathers';

/** Renders a bilingual text field, visibility-controlled by the page's language toggle
 *  ([data-lang] on <html>) — same mechanism as the Giáo Lý reader's VI/EN/Cả hai toggle,
 *  just without that toggle's paragraph-reading-specific typography. */
export function Bi({
  value,
  as: Tag = 'span',
  className,
  prefix,
}: {
  value: BiValue;
  as?: ElementType;
  className?: string;
  prefix?: ReactNode;
}) {
  return (
    <>
      <Tag className={className}>
        {prefix}
        <span className="bi-vi">{value.vi}</span>
        <span className="bi-en">{value.en}</span>
      </Tag>
    </>
  );
}
