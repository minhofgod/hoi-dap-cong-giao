'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { LanguageToggle } from './LanguageToggle';
import { T } from './T';
import { useLang } from '@/lib/giao-phu/useLang';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import styles from './SiteHeader.module.css';

interface Section {
  href: string;
  vi: string;
  en: string;
  /** Extra route prefixes that should also mark this item active (e.g. hub child routes). */
  also?: string[];
}

const SECTIONS: Section[] = [
  // Đồng hành companion — front-door for seekers, first nav item. Gated so it vanishes (along
  // with the route + homepage band) when NEXT_PUBLIC_COMPANION=0, leaving no dead link.
  ...(COMPANION_ENABLED ? [{ href: '/dong-hanh', vi: 'Đồng hành', en: 'Companion' }] : []),
  { href: '/giai-dap', vi: 'Giải Đáp', en: 'Q&A' },
  { href: '/giao-ly', vi: 'Giáo Lý', en: 'Catechism' },
  // The Church History hub groups Giáo Phụ (Fathers) + Công Đồng (Councils) into one nav item,
  // surfacing the Councils without a separate top-level entry (docs/roadmap.md — homepage IA).
  // `also` keeps the hub highlighted on its child routes (the Fathers/Councils detail pages).
  { href: '/lich-su-hoi-thanh', vi: 'Lịch Sử Hội Thánh', en: 'Church History', also: ['/giao-phu', '/cong-dong'] },
  { href: '/video', vi: 'Video', en: 'Videos' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const isActive = (s: Section) =>
    [s.href, ...(s.also ?? [])].some((prefix) => pathname.startsWith(prefix));

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
            className={isActive(s) ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            <T vi={s.vi} en={s.en} />
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
          <input
            name="q"
            type="text"
            placeholder={lang === 'en' ? 'Search…' : 'Tìm kiếm…'}
            className={styles.searchInput}
          />
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
              className={isActive(s) ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink}
              onClick={() => setOpen(false)}
            >
              <T vi={s.vi} en={s.en} />
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
