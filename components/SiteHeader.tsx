'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  MessagesSquare,
  BookOpen,
  Play,
  Landmark,
  Users,
  Sparkles,
  Compass,
  Route,
  type LucideIcon,
} from 'lucide-react';
import { BrandMark } from './BrandMark';
import { LanguageToggle } from './LanguageToggle';
import { T } from './T';
import { useLang } from '@/lib/giao-phu/useLang';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import { EVIDENCE_PATH_ENABLED } from '@/lib/evidencePathFlag';
import styles from './SiteHeader.module.css';

interface NavLink {
  href: string;
  vi: string;
  en: string;
  /** Extra route prefixes that also mark this link active (e.g. a hub's child routes). */
  also?: string[];
  /** Icon shown beside the label in the mobile menu (desktop nav stays text-only). */
  icon?: LucideIcon;
  /** Render as an accent CTA tile in the mobile menu (the companion front-door). */
  cta?: boolean;
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
  { href: '/giai-dap', vi: 'Giải Đáp', en: 'Q&A', icon: MessagesSquare },
  {
    vi: 'Học hỏi đức tin',
    en: 'Learn',
    children: [
      { href: '/giao-ly', vi: 'Giáo Lý', en: 'Catechism', icon: BookOpen },
      { href: '/video', vi: 'Video', en: 'Videos', icon: Play },
      // + Văn Kiện Hội Thánh (/van-kien) when that section ships.
    ],
  },
  {
    vi: 'Lịch sử & chứng nhân',
    en: 'History & Witnesses',
    children: [
      // The Church History hub already groups Giáo Phụ + Công Đồng; `also` keeps it active there.
      { href: '/lich-su-hoi-thanh', vi: 'Lịch Sử Hội Thánh', en: 'Church History', also: ['/giao-phu', '/cong-dong'], icon: Landmark },
      { href: '/cac-thanh', vi: 'Các Thánh', en: 'Saints', icon: Users },
      { href: '/phep-la', vi: 'Phép Lạ & Hiện Ra', en: 'Miracles & Apparitions', icon: Sparkles },
      // The evidence path — a guided walk through the case for Jesus. Belongs with the evidence /
      // witnesses family. Gated so it appears only once the flag is on (no dead link before then).
      ...(EVIDENCE_PATH_ENABLED
        ? [{ href: '/bang-chung', vi: 'Bằng chứng về Chúa Giêsu', en: 'The Evidence for Jesus', icon: Route }]
        : []),
      // + Các Đức Giáo Hoàng (/cac-giao-hoang) when that section ships.
    ],
  },
  // Đồng hành companion — gated so it vanishes (with the route + homepage band) when the flag is off.
  // `cta` gives it the accent tile treatment in the mobile menu (the seeker front-door).
  ...(COMPANION_ENABLED
    ? [{ href: '/dong-hanh', vi: 'Đồng hành', en: 'Companion', icon: Compass, cta: true } as NavLink]
    : []),
];

// The mobile menu is a FLAT icon list — the per-item icons already distinguish the sections, so the
// desktop family grouping (dropdowns) doesn't need repeating as labelled sub-sections here. The
// order MIRRORS the homepage cards (Giải Đáp → Bằng chứng → Giáo Lý → Lịch Sử → Các Thánh → Phép
// Lạ), with Video and the Đồng hành CTA at the end. Built from NAV's leaves so gating still drops
// evidence/companion when their flag is off (a missing href just isn't in the list).
const MOBILE_ORDER = [
  '/giai-dap',
  '/bang-chung',
  '/giao-ly',
  '/lich-su-hoi-thanh',
  '/cac-thanh',
  '/phep-la',
  '/video',
  '/dong-hanh',
];
const MOBILE_LEAVES: NavLink[] = NAV.flatMap((e) => (isGroup(e) ? e.children : [e]));
const MOBILE_LINKS: NavLink[] = MOBILE_ORDER.map((href) =>
  MOBILE_LEAVES.find((l) => l.href === href)
).filter((l): l is NavLink => Boolean(l));

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

  // One mobile-menu row: icon + label, with the companion rendered as an accent CTA tile.
  const renderMobileLink = (l: NavLink) => {
    const Icon = l.icon;
    const cls = [
      styles.mobileLink,
      l.cta ? styles.mobileCta : '',
      linkActive(l) ? styles.mobileLinkActive : '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <Link key={l.href} href={l.href} className={cls} onClick={() => setMobileOpen(false)}>
        {Icon && (
          <Icon size={l.cta ? 22 : 20} strokeWidth={2} className={styles.mobileIcon} aria-hidden="true" />
        )}
        <span className={styles.mobileLabel}>
          <T vi={l.vi} en={l.en} />
        </span>
        {l.cta && (
          <ArrowRight size={18} strokeWidth={2.2} className={styles.mobileCtaArrow} aria-hidden="true" />
        )}
      </Link>
    );
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
          {MOBILE_LINKS.map((l) => renderMobileLink(l))}
          <div className={styles.mobileLangRow}>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
