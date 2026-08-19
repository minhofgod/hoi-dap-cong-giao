'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { LanguageToggle } from './LanguageToggle';
import { T } from './T';
import { useLang } from '@/lib/giao-phu/useLang';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import styles from './SiteHeader.module.css';

interface NavLink {
  href: string;
  vi: string;
  en: string;
  /** Extra route prefixes that also mark this link active (e.g. a hub's child routes). */
  also?: string[];
}
interface NavGroup {
  vi: string;
  en: string;
  children: NavLink[];
}
type NavEntry = NavLink | NavGroup;
const isGroup = (e: NavEntry): e is NavGroup => 'children' in e;

// Nav shape: two flagship links flank two family dropdowns (docs/nav-and-phep-la-wiring.md, Option A).
// Grouping keeps the bar to 4 top-level items as sections grow (Văn Kiện, Các Đức Giáo Hoàng slot into
// the existing groups without a new top-level entry).
const NAV: NavEntry[] = [
  { href: '/giai-dap', vi: 'Giải Đáp', en: 'Q&A' },
  {
    vi: 'Học hỏi đức tin',
    en: 'Learn',
    children: [
      { href: '/giao-ly', vi: 'Giáo Lý', en: 'Catechism' },
      { href: '/video', vi: 'Video', en: 'Videos' },
      // + Văn Kiện Hội Thánh (/van-kien) when that section ships.
    ],
  },
  {
    vi: 'Lịch sử & chứng nhân',
    en: 'History & Witnesses',
    children: [
      // The Church History hub already groups Giáo Phụ + Công Đồng; `also` keeps it active there.
      { href: '/lich-su-hoi-thanh', vi: 'Lịch Sử Hội Thánh', en: 'Church History', also: ['/giao-phu', '/cong-dong'] },
      { href: '/cac-thanh', vi: 'Các Thánh', en: 'Saints' },
      { href: '/phep-la', vi: 'Phép Lạ & Hiện Ra', en: 'Miracles & Apparitions' },
      // + Các Đức Giáo Hoàng (/cac-giao-hoang) when that section ships.
    ],
  },
  // Đồng hành companion — gated so it vanishes (with the route + homepage band) when the flag is off.
  ...(COMPANION_ENABLED
    ? [{ href: '/dong-hanh', vi: 'Đồng hành', en: 'Companion' } as NavLink]
    : []),
];

export function SiteHeader() {
  const pathname = usePathname();
  const lang = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Close everything on navigation. Done as a render-time comparison (not an effect) so a stale
  // dropdown never paints on the new route — React re-renders immediately with the reset state.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpenGroup(null);
    setMobileOpen(false);
  }

  const linkActive = (l: NavLink) =>
    [l.href, ...(l.also ?? [])].some((prefix) => pathname.startsWith(prefix));
  const groupActive = (g: NavGroup) => g.children.some(linkActive);

  // Click outside the nav closes an open desktop dropdown.
  useEffect(() => {
    if (openGroup === null) return;
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openGroup]);

  // Escape closes the open dropdown and returns focus to its trigger (disclosure-menu a11y).
  const onNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && openGroup !== null) {
      const i = openGroup;
      setOpenGroup(null);
      triggerRefs.current[i]?.focus();
    }
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Hỏi Đáp Công Giáo">
        <BrandMark size={47} cut={8} id="site" className={styles.brandMark} />
        <span className={styles.brandName}>Hỏi Đáp Công Giáo</span>
      </Link>

      <nav className={styles.nav} ref={navRef} onKeyDown={onNavKeyDown}>
        {NAV.map((entry, i) =>
          isGroup(entry) ? (
            <div key={entry.vi} className={styles.navGroup}>
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                className={
                  groupActive(entry)
                    ? `${styles.navItem} ${styles.navTrigger} ${styles.navItemActive}`
                    : `${styles.navItem} ${styles.navTrigger}`
                }
                aria-expanded={openGroup === i}
                aria-haspopup="true"
                onClick={() => setOpenGroup(openGroup === i ? null : i)}
              >
                <T vi={entry.vi} en={entry.en} />
                <ChevronDown size={15} strokeWidth={2.2} className={styles.chevron} aria-hidden="true" />
              </button>
              {openGroup === i && (
                <div className={styles.dropdown}>
                  {entry.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={
                        linkActive(c)
                          ? `${styles.dropdownLink} ${styles.dropdownLinkActive}`
                          : styles.dropdownLink
                      }
                      onClick={() => setOpenGroup(null)}
                    >
                      <T vi={c.vi} en={c.en} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={entry.href}
              href={entry.href}
              className={linkActive(entry) ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
            >
              <T vi={entry.vi} en={entry.en} />
            </Link>
          )
        )}
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
        aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X size={22} strokeWidth={2.2} /> : <Menu size={22} strokeWidth={2.2} />}
      </button>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {NAV.map((entry) =>
            isGroup(entry) ? (
              // Groups flatten into a labelled section — no menu-nested-in-menu on mobile.
              <div key={entry.vi} className={styles.mobileGroup}>
                <div className={styles.mobileGroupLabel}>
                  <T vi={entry.vi} en={entry.en} />
                </div>
                {entry.children.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={
                      linkActive(c)
                        ? `${styles.mobileLink} ${styles.mobileSubLink} ${styles.mobileLinkActive}`
                        : `${styles.mobileLink} ${styles.mobileSubLink}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <T vi={c.vi} en={c.en} />
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={entry.href}
                href={entry.href}
                className={linkActive(entry) ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                <T vi={entry.vi} en={entry.en} />
              </Link>
            )
          )}
          <div className={styles.mobileLangRow}>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
