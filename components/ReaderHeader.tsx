import Link from 'next/link';
import styles from './ReaderHeader.module.css';

export function ReaderHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        Hỏi Đáp Công Giáo
      </Link>
    </header>
  );
}
