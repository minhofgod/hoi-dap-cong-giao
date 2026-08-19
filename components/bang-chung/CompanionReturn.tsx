'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { T } from '@/components/T';
import { COMPANION_ENABLED } from '@/lib/companionFlag';
import styles from '@/app/bang-chung/bang-chung.module.css';

/**
 * A quiet way back to the companion, shown only when the reader arrived from it
 * (`/bang-chung?from=dong-hanh`). Requested by Session 7: following the companion's CTA was a
 * one-way door with no return.
 *
 * Deliberately an escape hatch, not a nav item — it is the same muted treatment as the stage
 * pages' back link, and it renders on the index only, where "this isn't what I wanted" actually
 * happens. Once someone is inside a stage they are engaged with the path, and Back is the natural
 * return; a persistent chrome link there would read as navigation.
 *
 * The destination is HARDCODED. `from` is matched exactly against one known value and is never
 * used to build the href, so a crafted `?from=https://evil.example` cannot turn this into an open
 * redirect.
 *
 * Client-side on purpose: reading search params on the server would opt the whole index out of
 * static rendering for the sake of one link. Inside a <Suspense> boundary (see the index page),
 * only this component is client-rendered and the rest of the page stays prerendered.
 */
export function CompanionReturn() {
  const searchParams = useSearchParams();

  // No dead link if the companion is ever switched off in production — same rule its own entry
  // points follow.
  if (!COMPANION_ENABLED) return null;
  if (searchParams.get('from') !== 'dong-hanh') return null;

  return (
    <Link href="/dong-hanh" className={styles.companionReturn}>
      <ArrowLeft size={14} strokeWidth={2.2} />
      <T vi="Quay lại Đồng hành" en="Back to the companion" />
    </Link>
  );
}
