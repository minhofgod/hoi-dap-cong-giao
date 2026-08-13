'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import styles from './BackToTop.module.css';

/** Floating "back to top" control. Appears once the reader has scrolled about a
 *  screenful (600px) down any page; smooth-scrolls to the top on click. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Lên đầu trang"
      className={visible ? `${styles.button} ${styles.visible}` : styles.button}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronUp size={22} strokeWidth={2.4} />
    </button>
  );
}
