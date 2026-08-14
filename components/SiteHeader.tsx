'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { LanguageToggle } from './LanguageToggle';
import styles from './SiteHeader.module.css';

const SECTIONS = [
  { href: '/giai-dap', label: 'Giải Đáp' },
  { href: '/giao-ly', label: 'Giáo Lý' },
  { href: '/giao-phu', label: 'Giáo Phụ' },
  { href: '/video', label: 'Video' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (prefix: string) => pathname.startsWith(prefix);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Hỏi Đáp Công Giáo">
        <BrandMark size={47} cut={8} id="site" className={styles.brandMark} />
        <span className={styles.brandName}>Hỏi Đáp Công Giáo</span>
      </Link>

      <nav className={styles.nav}>
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={isActive(s.href) ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            {s.label}
          </Link>
        ))}
      </nav>

      <div className={styles.actions}>
        <LanguageToggle />
        <form action="/tim-kiem" className={styles.searchForm}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input name="q" type="text" placeholder="Tìm kiếm…" className={styles.searchInput} />
        </form>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
      </button>

      {open && (
        <div className={styles.mobileMenu}>
          {SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={isActive(s.href) ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              {s.label}
            </Link>
          ))}
          <div className={styles.mobileLangRow}>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
