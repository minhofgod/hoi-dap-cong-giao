'use client';

import { Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { T } from './T';

/**
 * Share affordance for content pages. Uses the native share sheet where available (mobile — includes
 * Zalo / Messenger on a Vietnamese reader's phone), and falls back to copying the URL on desktop with
 * a transient "Đã sao chép / Copied" confirmation. Both `navigator.share` and `navigator.clipboard`
 * need a secure context (fine in production); the `if (navigator.share)` guard handles absence.
 *
 * Presentation-agnostic: the caller passes `className` so it can be the rail's action button on the
 * Catechism reader or a quiet pill on a Q&A page.
 */
export function ShareButton({
  title,
  url,
  className,
  iconSize = 15,
}: {
  title: string;
  url?: string;
  className?: string;
  iconSize?: number;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const shareUrl = url ?? window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // user cancelled / share dismissed — nothing to do
      }
      return;
    }
    // Desktop fallback: copy the link. `writeText` THROWS when the document isn't focused or in some
    // restricted contexts, so guard it — and confirm success so the copy isn't silent.
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable / blocked — fail quietly
    }
  };

  return (
    <button type="button" className={className} onClick={share} aria-live="polite">
      {copied ? (
        <>
          <Check size={iconSize} strokeWidth={2.4} />
          <T vi="Đã sao chép" en="Copied" />
        </>
      ) : (
        <>
          <Share2 size={iconSize} strokeWidth={2.4} />
          <T vi="Chia sẻ" en="Share" />
        </>
      )}
    </button>
  );
}
