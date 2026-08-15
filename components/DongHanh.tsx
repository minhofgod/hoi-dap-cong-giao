'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Compass, Play, RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import {
  STEPS,
  START_STEP,
  SITUATIONS,
  matchResources,
  type Bi,
  type Resource,
} from '@/lib/dongHanh';
import { ScriptureRef } from './ScriptureRef';
import type { ResolvedReference } from '@/lib/bibleRefs';
import { T } from './T';
import styles from '../app/dong-hanh/dong-hanh.module.css';

/**
 * "Đồng hành" — the guided self-assessment flow (see lib/dongHanh.ts + docs/roadmap.md). A small
 * deterministic state machine walks the intake tree (STEPS); each terminal answer resolves to a
 * SITUATION whose hand-written advice, Scripture, and taxonomy-matched Q&As assemble the result.
 * No LLM — every string is authored and the matching is pure.
 */
export function DongHanh({
  pool,
  scriptureData,
}: {
  pool: Resource[];
  scriptureData: Record<string, ResolvedReference | null>;
}) {
  const uiLang = useLang();
  const en = uiLang === 'en';
  const pick = (b: Bi) => (en ? b.en : b.vi);

  // The stack of intake steps shown so far (last = current). `result` holds the resolved
  // situation id once the flow reaches a leaf.
  const [stack, setStack] = useState<string[]>([START_STEP]);
  const [result, setResult] = useState<string | null>(null);

  const restart = () => {
    setStack([START_STEP]);
    setResult(null);
  };
  const back = () => {
    if (result) setResult(null);
    else if (stack.length > 1) setStack((s) => s.slice(0, -1));
  };

  const situation = result ? SITUATIONS[result] : null;
  const matches = useMemo(
    () => (situation ? matchResources(situation, pool) : []),
    [situation, pool]
  );

  const canGoBack = result !== null || stack.length > 1;

  return (
    <div className={styles.wrap}>
      <header className={styles.intro}>
        <div className={styles.eyebrow}>
          <Compass size={14} strokeWidth={2.2} />
          <T vi="ĐỒNG HÀNH" en="COMPANION" />
        </div>
        <h1 className={styles.pageTitle}>
          <T vi="Tìm câu trả lời" en="Find answers" />
        </h1>
        <p className={styles.pageSub}>
          <T
            vi="Trả lời một vài câu ngắn về hoàn cảnh của bạn, và chúng tôi sẽ gợi ý những giải đáp, một đoạn Lời Chúa và bước tiếp theo hợp với bạn."
            en="Answer a few short questions about your situation, and we'll suggest the answers, a line of Scripture, and a next step that fit you."
          />
        </p>
      </header>

      {situation ? (
        <ResultView
          situation={situation}
          matches={matches}
          scripture={scriptureData[situation.scripture.ref] ?? null}
          en={en}
          pick={pick}
          onBack={back}
          onRestart={restart}
        />
      ) : (
        <IntakeView
          stepId={stack[stack.length - 1]}
          stepIndex={stack.length}
          pick={pick}
          canGoBack={canGoBack}
          onBack={back}
          onChoose={(goto) => {
            if ('step' in goto) setStack((s) => [...s, goto.step]);
            else setResult(goto.situation);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ intake */

function IntakeView({
  stepId,
  stepIndex,
  pick,
  canGoBack,
  onBack,
  onChoose,
}: {
  stepId: string;
  stepIndex: number;
  pick: (b: Bi) => string;
  canGoBack: boolean;
  onBack: () => void;
  onChoose: (goto: { step: string } | { situation: string }) => void;
}) {
  const step = STEPS[stepId];
  if (!step) return null;

  return (
    <div className={styles.card}>
      <div className={styles.stepMeta}>
        <span className={styles.stepCount}>
          <T vi={`Câu ${stepIndex}`} en={`Question ${stepIndex}`} />
        </span>
        {canGoBack && (
          <button type="button" className={styles.backLink} onClick={onBack}>
            <ArrowLeft size={15} strokeWidth={2.2} />
            <T vi="Quay lại" en="Back" />
          </button>
        )}
      </div>

      <h2 className={styles.question}>{pick(step.question)}</h2>
      {step.intro && <p className={styles.questionIntro}>{pick(step.intro)}</p>}

      <div className={styles.choices}>
        {step.choices.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.choice}
            onClick={() => onChoose(c.goto)}
          >
            <span className={styles.choiceText}>
              <span className={styles.choiceLabel}>{pick(c.label)}</span>
              {c.hint && <span className={styles.choiceHint}>{pick(c.hint)}</span>}
            </span>
            <ArrowRight size={18} strokeWidth={2} className={styles.choiceArrow} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ result */

function ResultView({
  situation,
  matches,
  scripture,
  en,
  pick,
  onBack,
  onRestart,
}: {
  situation: (typeof SITUATIONS)[string];
  matches: Resource[];
  scripture: ResolvedReference | null;
  en: boolean;
  pick: (b: Bi) => string;
  onBack: () => void;
  onRestart: () => void;
}) {
  const resourcesLabel = situation.resourcesLabel;

  return (
    <div className={styles.result}>
      <div className={styles.stepMeta}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={2.2} />
          <T vi="Đổi câu trả lời" en="Change answer" />
        </button>
        <button type="button" className={styles.backLink} onClick={onRestart}>
          <RotateCcw size={14} strokeWidth={2.2} />
          <T vi="Bắt đầu lại" en="Start over" />
        </button>
      </div>

      <div className={styles.resultLead}>{pick(situation.lead)}</div>
      <h2 className={styles.resultTitle}>{pick(situation.title)}</h2>

      <div className={styles.advice}>
        {situation.advice.map((p, i) => (
          <p key={i}>{pick(p)}</p>
        ))}
      </div>

      <figure className={styles.scripture}>
        <blockquote className={styles.scriptureGloss}>{pick(situation.scripture.gloss)}</blockquote>
        <figcaption className={styles.scriptureCite}>
          <ScriptureRef refLabel={situation.scripture.ref} data={scripture} variant="chip" />
        </figcaption>
      </figure>

      {matches.length > 0 && (
        <section className={styles.resources}>
          <div className={styles.resourcesLabel}>
            {resourcesLabel ? (
              pick(resourcesLabel)
            ) : (
              <T vi="Bắt đầu với những câu này" en="Start with these" />
            )}
          </div>
          <ul className={styles.resourceList}>
            {matches.map((r) => {
              const isVideo = r.kind === 'video';
              return (
                <li key={r.key}>
                  <Link href={r.href} className={styles.resourceRow}>
                    <span className={styles.resourceQ}>
                      {isVideo && (
                        <span className={styles.resourcePlay} aria-hidden="true">
                          <Play size={11} fill="currentColor" strokeWidth={0} />
                        </span>
                      )}
                      {en ? r.questionEn : r.questionVi}
                    </span>
                    <span
                      className={`${styles.resourceMeta} ${isVideo ? styles.resourceMetaVideo : ''}`}
                    >
                      {isVideo ? <T vi="Video" en="Video" /> : en ? r.metaEn : r.metaVi}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <Link href={situation.nextStep.href} className={styles.nextStep}>
        <span className={styles.nextStepLabel}>
          <T vi="Bước tiếp theo" en="Next step" />
        </span>
        <span className={styles.nextStepText}>
          {pick(situation.nextStep.label)}
          <ArrowRight size={17} strokeWidth={2.2} />
        </span>
      </Link>

      <p className={styles.resultFoot}>
        <T
          vi="Còn thắc mắc khác? Bạn có thể tìm trong toàn bộ mục Giải Đáp."
          en="Have another question? You can search the whole Q&A."
        />{' '}
        <Link href="/giai-dap" className={styles.footLink}>
          <T vi="Mở Giải Đáp →" en="Open the Q&A →" />
        </Link>
      </p>
    </div>
  );
}
