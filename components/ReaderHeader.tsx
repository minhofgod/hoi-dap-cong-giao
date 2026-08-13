import Link from 'next/link';
import { BrandMark } from './BrandMark';
import styles from './ReaderHeader.module.css';

export function ReaderHeader() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Hỏi Đáp Công Giáo">
        <BrandMark size={41} cut={8} id="reader" className={styles.brandMark} />
        <span className={styles.brandName}>Hỏi Đáp Công Giáo</span>
      </Link>
    </header>
  );
}
