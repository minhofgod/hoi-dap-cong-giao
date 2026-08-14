'use client';

import { useLang } from '@/lib/giao-phu/useLang';
import styles from './LanguageToggle.module.css';

type Lang = 'vi' | 'en' | 'both';

const OPTIONS: { value: Lang; label: string }[] = [
  { value: 'vi', label: 'VI' },
  { value: 'en', label: 'EN' },
  { value: 'both', label: 'Cả hai' },
];

export function LanguageToggle() {
  // Read the live language from <html data-lang> (useLang observes it), so every toggle
  // instance — header, mobile menu, reader pages — stays in sync when any one is used.
  const lang = useLang();

  const choose = (value: Lang) => {
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
