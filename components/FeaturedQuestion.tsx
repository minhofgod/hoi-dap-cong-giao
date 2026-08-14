'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, RotateCw } from 'lucide-react';
import type { ResolvedReference } from '@/lib/bibleRefs';
import type { ResolvedCatechism } from '@/lib/content';
import { ScriptureRef } from './ScriptureRef';
import { CatechismRef } from './CatechismRef';
import { T } from './T';
import styles from './FeaturedQuestion.module.css';

export type HeroQuestion = {
  slug: string;
  question: string;
  lede: string[];
  ccc: number[];
  scripture: string[];
  scriptureData: Record<string, ResolvedReference | null>;
  cccData: Record<string, ResolvedCatechism | null>;
};

/** The landing hero (design README §3): a real featured question with a two-paragraph
 *  answer teaser. "Câu khác" swaps in the next question client-side. */
export function FeaturedQuestion({ questions }: { questions: HeroQuestion[] }) {
  const [i, setI] = useState(0);
  if (questions.length === 0) return null;
  const q = questions[i % questions.length];

  return (
    <div className={styles.left}>
      <div className={styles.eyebrowRow}>
        <span className={styles.eyebrow}>
          <T vi="Câu hỏi" en="Question" />
        </span>
        <span className={styles.rule} />
        {questions.length > 1 && (
          <button
            type="button"
            className={styles.cauKhac}
            onClick={() => setI((v) => (v + 1) % questions.length)}
          >
            <RotateCw size={13} strokeWidth={2.2} />
            <T vi="Câu khác" en="Another" />
          </button>
        )}
      </div>

      <h1 className={styles.question}>{q.question}</h1>

      {q.lede.map((p, idx) => (
        <p key={idx} className={styles.lede}>
          {p}
        </p>
      ))}

      {(q.ccc.length > 0 || q.scripture.length > 0) && (
        <div className={styles.refs}>
          <span className={styles.refsLabel}>
            <T vi="Tham chiếu" en="References" />
          </span>
          {q.ccc.map((n) => (
            <CatechismRef key={n} number={n} data={q.cccData[n] ?? null} />
          ))}
          {q.scripture.map((s) => (
            <ScriptureRef key={s} refLabel={s} variant="chip" data={q.scriptureData[s] ?? null} />
          ))}
        </div>
      )}

      <div className={styles.buttons}>
        <Link href={`/giai-dap/${q.slug}`} className={styles.primary}>
          <T vi="Đọc trọn câu trả lời" en="Read the full answer" />
          <ChevronRight size={17} strokeWidth={2.4} />
        </Link>
        <Link href="/giai-dap" className={styles.secondary}>
          <T vi="Xem tất cả câu hỏi" en="See all questions" />
        </Link>
      </div>
    </div>
  );
}
