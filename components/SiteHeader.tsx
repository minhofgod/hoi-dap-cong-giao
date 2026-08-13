'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const pathname = usePathname();
  const navClass = (prefix: string) =>
    pathname.startsWith(prefix) ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        Hỏi Đáp Công Giáo
      </Link>
      <nav className={styles.nav}>
        <Link href="/giai-dap" className={navClass('/giai-dap')}>
          Giải Đáp
        </Link>
        <Link href="/giao-ly" className={navClass('/giao-ly')}>
          Giáo Lý
        </Link>
        <Link href="/giao-phu" className={navClass('/giao-phu')}>
          Giáo Phụ
        </Link>
      </nav>
      <div className={styles.actions}>
        <form action="/giao-ly/1" className={styles.searchForm}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input name="q" type="text" placeholder="Tìm kiếm…" className={styles.searchInput} />
        </form>
        <Link href="/ve-trang-nay" className={styles.helpButton} aria-label="Về trang này">
          ?
        </Link>
      </div>
    </header>
  );
}
