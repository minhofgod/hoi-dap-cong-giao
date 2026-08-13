'use client';

import { useEffect, useState } from 'react';
import styles from './LanguageToggle.module.css';

type Lang = 'vi' | 'en' | 'both';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'vi', label: 'VI' },
  { value: 'en', label: 'EN' },
  { value: 'both', label: 'Cả hai' },
];

export function LanguageToggle() {
  const [lang, setLang] = useState<Lang>('vi');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-lang') as Lang | null;
    // Sync from the DOM attribute set pre-hydration (browser-only; deferred to avoid a hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (current) setLang(current);
  }, []);

  const choose = (value: Lang) => {
    setLang(value);
    document.documentElement.setAttribute('data-lang', value);
    try {
      window.localStorage.setItem('hdcg.lang', value);
    } catch {
      // ignore
    }
  };

  return (
    <div className={styles.track}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={lang === opt.value ? `${styles.option} ${styles.optionActive}` : styles.option}
          onClick={() => choose(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
