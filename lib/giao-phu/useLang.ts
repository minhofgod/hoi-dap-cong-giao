'use client';

import { useSyncExternalStore } from 'react';

export type Lang = 'vi' | 'en' | 'both';

/** The site persists the language choice in localStorage under 'hdcg.lang' and applies it to
 *  `document.documentElement`'s `data-lang` attribute before first paint via a beforeInteractive
 *  script in app/layout.tsx (see LANG_PREPAINT_SCRIPT there). The rest of the site reads that
 *  attribute purely in CSS (components/Bi.tsx + the .bi-vi/.bi-en rules in app/globals.css),
 *  which never needs this hook because both language versions stay in the DOM.
 *
 *  Giáo Phụ is different (HANDOFF-giao-phu.md section 1): the wrong-language string must be
 *  removed from the DOM entirely, not CSS-hidden. That means the *rendering itself* — which
 *  React nodes get mounted — must depend on the current lang, which requires reading it in
 *  JS. useSyncExternalStore is the React-idiomatic way to do that safely alongside SSG/SSR:
 *   - getServerSnapshot() returns 'vi', matching the hard-coded `data-lang="vi"` default the
 *     root layout renders before the prepaint script runs — so hydration never mismatches.
 *   - getSnapshot() reads the live attribute (already corrected by the prepaint script by the
 *     time hydration runs for a returning visitor). React syncs to it immediately on mount,
 *     before the next paint, so the correction is not a user-visible flash in practice.
 *   - subscribe() watches the attribute with a MutationObserver so the language toggle
 *     (components/LanguageToggle.tsx, which sets the attribute directly via the DOM rather than
 *     through React state) is picked up instantly by every Bi2 on the page. */

function getSnapshot(): Lang {
  const v = document.documentElement.getAttribute('data-lang');
  return v === 'vi' || v === 'en' || v === 'both' ? v : 'vi';
}

function getServerSnapshot(): Lang {
  return 'vi';
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.attributeName === 'data-lang')) callback();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  return () => observer.disconnect();
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Resolve a { vi, en } pair to a single string for contexts that can't render two DOM nodes
 *  (alt text, aria-label, <title>). 'both' picks Vietnamese, matching the rest of the section's
 *  "Vietnamese primary" convention. */
export function useBiText(pair: { vi: string; en: string } | undefined | null): string {
  const lang = useLang();
  if (!pair) return '';
  if (lang === 'en') return pair.en || pair.vi;
  return pair.vi || pair.en;
}

