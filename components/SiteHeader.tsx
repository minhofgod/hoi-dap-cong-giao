'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Menu,
  X,
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
  /** Icon shown beside the label — only on mobile; the desktop menu is text-only. */
  icon?: LucideIcon;
  /** Render as an accent CTA tile (the companion front-door). */
  cta?: boolean;
}

// A single flat section list drives the menu at EVERY width — the header uses one "Menu" button
// (desktop) / hamburger (mobile) that opens this list, instead of inline nav. The order mirrors the
// homepage cards, with Video and the Đồng hành CTA last. Evidence/companion are gated so they drop
// out (no dead link) when their flag is off.
const NAV: NavLink[] = [
  { href: '/giai-dap', vi: 'Giải Đáp', en: 'Q&A', icon: MessagesSquare },
  ...(EVIDENCE_PATH_ENABLED
    ? [{ href: '/bang-chung', vi: 'Bằng chứng về Chúa Giêsu', en: 'The Evidence for Jesus', icon: Route } as NavLink]
    : []),
  { href: '/giao-ly', vi: 'Giáo Lý', en: 'Catechism', icon: BookOpen },
  {
    href: '/lich-su-hoi-thanh',
    vi: 'Lịch Sử Hội Thánh',
    en: 'Church History',
    also: ['/giao-phu', '/cong-dong'],
    icon: Landmark,
  },
  { href: '/cac-thanh', vi: 'Các Thánh', en: 'Saints', icon: Users },
  { href: '/phep-la', vi: 'Phép Lạ & Hiện Ra', en: 'Miracles & Apparitions', icon: Sparkles },
  { href: '/video', vi: 'Video', en: 'Videos', icon: Play },
  ...(COMPANION_ENABLED
    ? [{ href: '/dong-hanh', vi: 'Đồng hành', en: 'Companion', icon: Compass, cta: true } as NavLink]
    : []),
];

export function SiteHeader() {
  const pathname = usePathname();
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close the menu on navigation (render-time compare, not an effect, so no stale menu paints).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const linkActive = (l: NavLink) =>
    [l.href, ...(l.also ?? [])].some((prefix) => pathname.startsWith(prefix));

  // Close the menu on a click outside the header, or on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const renderLink = (l: NavLink) => {
    const Icon = l.icon;
    const cls = [
      styles.menuLink,
      l.cta ? styles.menuCta : '',
      linkActive(l) ? styles.menuLinkActive : '',
    ]
      .filter(Boolean)
      .join(' ');
    return (
      <Link key={l.href} href={l.href} className={cls} onClick={() => setOpen(false)}>
        {Icon && (
          <Icon size={l.cta ? 22 : 20} strokeWidth={2} className={styles.menuIcon} aria-hidden="true" />
        )}
        <span className={styles.menuLabel}>
          <T vi={l.vi} en={l.en} />
        </span>
        {l.cta && (
          <ArrowRight size={18} strokeWidth={2.2} className={styles.menuCtaArrow} aria-hidden="true" />
        )}
      </Link>
    );
  };

  return (
    <header ref={headerRef} className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Hỏi Đáp Công Giáo">
        <BrandMark size={47} cut={8} id="site" className={styles.brandMark} />
        <span className={styles.brandName}>Hỏi Đáp Công Giáo</span>
      </Link>

      {/* Language + search stay inline on desktop; hidden on mobile (the menu carries the toggle). */}
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
        {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
        <span className={styles.menuButtonLabel}>
          <T vi="Menu" en="Menu" />
        </span>
      </button>

      {open && (
        <div className={styles.menuPanel}>
          {NAV.map(renderLink)}
          <div className={styles.menuLangRow}>
            <LanguageToggle />
          </div>
        </div>
      )}
    </header>
  );
}
