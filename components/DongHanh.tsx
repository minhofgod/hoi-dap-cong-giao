'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  ExternalLink,
  Play,
  RotateCcw,
  Search,
} from 'lucide-react';
import { useLang } from '@/lib/giao-phu/useLang';
import {
  STEPS,
  START_STEP,
  SITUATIONS,
  followUps,
  matchResources,
  MAX_CYCLES,
  type Bi,
  type Resource,
  type Situation,
} from '@/lib/dongHanh';
import { categoryLabel, tagLabel } from '@/lib/giaiDapTaxonomy';
import { ScriptureRef } from './ScriptureRef';
import { ScriptureBody } from './ScriptureBody';
import type { ResolvedReference } from '@/lib/bibleRefs';
import { T } from './T';
import styles from '../app/dong-hanh/dong-hanh.module.css';

type Pick = (b: Bi) => string;

/* ------------------------------------------------------------------ persisted flow state
 * The whole walk is a serializable snapshot so it survives leaving the page. The `trail` is stored
 * as resource KEYS (not the full objects) and re-resolved from the pool, so a persisted journey
 * degrades gracefully if content changes. Persisted to sessionStorage (restore on re-mount after an
 * outbound link) AND mirrored into history.state per step (so Back — browser or in-UI — steps back
 * one screen instead of exiting or resetting). */
type Ended = null | 'closed' | 'deadend';
type Flow = { stack: string[]; sitId: string | null; trailKeys: string[]; ended: Ended };

const INITIAL_FLOW: Flow = { stack: [START_STEP], sitId: null, trailKeys: [], ended: null };
const STORAGE_KEY = 'hdcg.dong-hanh';
const HISTORY_KEY = 'dongHanh';

/** Read + validate a persisted flow (drop unknown steps/situations so stale storage can't wedge the
 *  UI on a screen that no longer exists). Returns null when there's nothing usable. */
function readPersistedFlow(): Flow | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Partial<Flow>;
    if (!s || typeof s !== 'object') return null;
    const stack = Array.isArray(s.stack)
      ? s.stack.filter((x): x is string => typeof x === 'string' && Boolean(STEPS[x]))
      : [];
    return {
      stack: stack.length ? stack : [START_STEP],
      sitId: typeof s.sitId === 'string' && SITUATIONS[s.sitId] ? s.sitId : null,
      trailKeys: Array.isArray(s.trailKeys)
        ? s.trailKeys.filter((x): x is string => typeof x === 'string')
        : [],
      ended: s.ended === 'closed' || s.ended === 'deadend' ? s.ended : null,
    };
  } catch {
    return null;
  }
}

/**
 * "Đồng hành" — the guided branching companion (lib/dongHanh.ts + docs/roadmap.md v2 spec). The
 * intake tree (STEPS) resolves to a SITUATION; from there it becomes a *journey*: after each answer
 * the reader gets ~4 fresh follow-up questions (deterministic, tag-overlap — `followUps`), read one
 * inline, and keep walking. Already-read answers drop out; the walk ends at a satisfaction check (or
 * the reader's own "I found what I needed" exit), then a warm, scoped hand-off — never a dead dump,
 * never an inbox. No LLM: every string is authored and the selection is pure.
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
  const pick: Pick = (b) => (en ? b.en : b.vi);

  // The whole walk lives in one serializable snapshot (see Flow). Starts at INITIAL_FLOW on both
  // server and first client render (no hydration mismatch); a persisted journey is restored on mount.
  const [flow, setFlow] = useState<Flow>(INITIAL_FLOW);
  const topRef = useRef<HTMLDivElement | null>(null);

  const byKey = useMemo(() => new Map(pool.map((r) => [r.key, r])), [pool]);
  const stack = flow.stack;
  const sitId = flow.sitId;
  const ended = flow.ended;
  const situation = sitId ? SITUATIONS[sitId] : null;
  // Re-resolve the trail from keys against the live pool (dropping any that no longer exist).
  const trail = useMemo(
    () => flow.trailKeys.map((k) => byKey.get(k)).filter((r): r is Resource => Boolean(r)),
    [flow.trailKeys, byKey]
  );
  const current = trail.length ? trail[trail.length - 1] : null;
  const visited = useMemo(() => new Set(trail.map((r) => r.key)), [trail]);

  const suggestions = useMemo(
    () =>
      situation
        ? followUps({ situation, seed: current ?? undefined, pool, visited, limit: 4 })
        : [],
    [situation, current, pool, visited]
  );

  const scrollTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const persist = useCallback((f: Flow) => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(f));
    } catch {
      /* private mode / disabled storage — the flow still works in-memory */
    }
  }, []);

  // Advance to a new screen: update state, persist, and push a history entry carrying the snapshot
  // (preserving any Next.js router state), so Back returns to the previous screen.
  const commit = useCallback(
    (f: Flow) => {
      setFlow(f);
      persist(f);
      try {
        window.history.pushState({ ...(window.history.state ?? {}), [HISTORY_KEY]: f }, '');
      } catch {
        /* history unavailable — state + sessionStorage still carry the flow */
      }
      scrollTop();
    },
    [persist, scrollTop]
  );

  // Restore on mount — covers the re-mount after an outbound link (read full answer / video / etc.),
  // and anchors the current history entry with the restored (or initial) snapshot so Back has a target.
  useEffect(() => {
    const saved = readPersistedFlow();
    // Mount-time restore from sessionStorage: intentional setState-in-effect. First render is
    // always INITIAL_FLOW (server + client agree — no hydration mismatch), then we sync to the
    // saved snapshot once mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setFlow(saved);
    try {
      window.history.replaceState(
        { ...(window.history.state ?? {}), [HISTORY_KEY]: saved ?? INITIAL_FLOW },
        ''
      );
    } catch {
      /* ignore */
    }
  }, []);

  // Back (browser button OR the in-UI control, which calls history.back()) → restore the previous
  // screen's snapshot. Only Back from the first screen (no companion entry) leaves the page.
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const f = (e.state && (e.state as Record<string, unknown>)[HISTORY_KEY]) as Flow | undefined;
      const next = f ?? INITIAL_FLOW;
      setFlow(next);
      persist(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [persist]);

  const restart = () => commit(INITIAL_FLOW);
  const pickFollowUp = (r: Resource) =>
    commit({ ...flow, trailKeys: [...flow.trailKeys, r.key], ended: null });
  const back = () => window.history.back();

  return (
    <div className={styles.wrap} ref={topRef}>
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
            vi="Trả lời một vài câu ngắn về hoàn cảnh của bạn, rồi để chúng tôi cùng bạn đi tiếp — từng câu trả lời một, theo đúng điều bạn thắc mắc."
            en="Answer a few short questions about your situation, then let us walk with you — one answer at a time, following whatever you're wondering next."
          />
        </p>
      </header>

      {situation ? (
        <JourneyView
          pool={pool}
          situation={situation}
          current={current}
          suggestions={suggestions}
          visited={visited}
          cycles={trail.length}
          ended={ended}
          scripture={scriptureData[situation.scripture.ref] ?? null}
          en={en}
          pick={pick}
          onPick={pickFollowUp}
          onBack={back}
          onRestart={restart}
          onClose={() => commit({ ...flow, ended: 'closed' })}
          onDeadEnd={() => commit({ ...flow, ended: 'deadend' })}
        />
      ) : (
        <IntakeView
          stepId={stack[stack.length - 1]}
          stepIndex={stack.length}
          pick={pick}
          canGoBack={stack.length > 1}
          onBack={back}
          onChoose={(goto) => {
            if ('step' in goto) commit({ ...flow, stack: [...flow.stack, goto.step] });
            else commit({ ...flow, sitId: goto.situation, trailKeys: [], ended: null });
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
  pick: Pick;
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
          <button key={c.id} type="button" className={styles.choice} onClick={() => onChoose(c.goto)}>
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

/* ------------------------------------------------------------------ journey */

function JourneyView({
  pool,
  situation,
  current,
  suggestions,
  visited,
  cycles,
  ended,
  scripture,
  en,
  pick,
  onPick,
  onBack,
  onRestart,
  onClose,
  onDeadEnd,
}: {
  pool: Resource[];
  situation: Situation;
  current: Resource | null;
  suggestions: Resource[];
  visited: ReadonlySet<string>;
  cycles: number;
  ended: null | 'closed' | 'deadend';
  scripture: ResolvedReference | null;
  en: boolean;
  pick: Pick;
  onPick: (r: Resource) => void;
  onBack: () => void;
  onRestart: () => void;
  onClose: () => void;
  onDeadEnd: () => void;
}) {
  const atCap = cycles >= MAX_CYCLES;
  const walking = ended === null;
  const showFollowUps = walking && !atCap && suggestions.length > 0;
  const showSatisfaction = walking && (atCap || suggestions.length === 0);

  return (
    <div className={styles.result}>
      <div className={styles.stepMeta}>
        <button type="button" className={styles.backLink} onClick={onBack}>
          <ArrowLeft size={15} strokeWidth={2.2} />
          {current || ended ? (
            <T vi="Quay lại" en="Back" />
          ) : (
            <T vi="Đổi câu trả lời" en="Change answer" />
          )}
        </button>
        <button type="button" className={styles.backLink} onClick={onRestart}>
          <RotateCcw size={14} strokeWidth={2.2} />
          <T vi="Bắt đầu lại" en="Start over" />
        </button>
      </div>

      {/* Header always names their situation so the path stays legible as they walk. */}
      <div className={styles.resultLead}>{pick(situation.lead)}</div>
      <h2 className={styles.resultTitle}>{pick(situation.title)}</h2>

      {ended === 'closed' ? (
        <ClosedView onRestart={onRestart} />
      ) : ended === 'deadend' ? (
        <DeadEndView
          pool={pool}
          situation={situation}
          visited={visited}
          en={en}
          pick={pick}
          onPick={onPick}
          onRestart={onRestart}
        />
      ) : (
        // Two columns on desktop (grid areas): the answer scrolls in the main column while the
        // follow-up choices sit in a sticky sidebar, always in view — pick the next question without
        // scrolling back up. On mobile it collapses to one column: answer → choices → extras.
        <div className={styles.walk}>
          <div className={styles.walkAnswer}>
            {current === null ? (
              <AnchorContent situation={situation} scripture={scripture} pick={pick} />
            ) : (
              <ReadingContent current={current} pool={pool} en={en} pick={pick} />
            )}
          </div>

          <div className={styles.walkSide}>
            {showFollowUps && (
              <FollowUps
                suggestions={suggestions}
                atAnchor={current === null}
                en={en}
                pick={pick}
                onPick={onPick}
                onClose={onClose}
              />
            )}
            {showSatisfaction && <Satisfaction onClose={onClose} onDeadEnd={onDeadEnd} />}
          </div>

          <div className={styles.walkExtra}>
            {/* The curated go-deeper link is a QUIET secondary option (v2: the follow-ups are the
                primary path), and the forward link / safety net on content-poor situations. */}
            {current === null && (
              <Link href={situation.nextStep.href} className={styles.goDeeper}>
                <span className={styles.goDeeperPrefix}>
                  <T vi="Hoặc đọc thêm" en="Or read more" />
                </span>
                <span className={styles.goDeeperLabel}>{pick(situation.nextStep.label)}</span>
                <ArrowRight size={14} strokeWidth={2.2} />
              </Link>
            )}

            {/* Grief paths keep the human off-ramp visible on EVERY step of the walk. */}
            {situation.pastoral && <PastoralOfframp />}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- anchor: the situation's advice + Scripture + one recommended read --- */

function AnchorContent({
  situation,
  scripture,
  pick,
}: {
  situation: Situation;
  scripture: ResolvedReference | null;
  pick: Pick;
}) {
  return (
    <>
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

      {/* Prominent invitation into the guided evidence path. `evidencePath` is only set when the
          EVIDENCE_PATH_ENABLED flag is on (lib/dongHanh.ts), so this is absent — never a dead link
          to the 404'd /bang-chung — until the path is live. */}
      {situation.evidencePath && (
        <Link href={situation.evidencePath.href} className={styles.evidenceCta}>
          <Compass size={20} strokeWidth={1.8} className={styles.evidenceCtaIcon} />
          <span className={styles.evidenceCtaText}>
            <span className={styles.evidenceCtaPrompt}>{pick(situation.evidencePath.prompt)}</span>
            <span className={styles.evidenceCtaLabel}>{pick(situation.evidencePath.label)}</span>
          </span>
          <ArrowRight size={18} strokeWidth={2.2} className={styles.evidenceCtaArrow} />
        </Link>
      )}

      {situation.companions && situation.companions.length > 0 && (
        <section className={styles.companions}>
          <div className={styles.companionsLabel}>
            <T vi="Những người đã đi qua đêm tối" en="Companions who walked through the dark" />
          </div>
          <p className={styles.companionsIntro}>
            <T
              vi="Bạn không phải là người đầu tiên đi qua bóng tối này. Có những người đã đi qua — và họ tựa vào Chúa. Bạn có thể xin họ cùng đồng hành."
              en="You are not the first to walk through this dark. Others walked it — and they leaned on God. You can ask them to walk with you."
            />
          </p>
          <ul className={styles.companionList}>
            {situation.companions.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className={styles.companionRow}>
                  <span className={styles.companionName}>{pick(c.name)}</span>
                  <span className={styles.companionLine}>{pick(c.line)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

/* --- reading: an answer preview inline, with the full answer + video one click away --- */

function ReadingContent({
  current,
  pool,
  en,
  pick,
}: {
  current: Resource;
  pool: Resource[];
  en: boolean;
  pick: Pick;
}) {
  const isVideo = current.kind === 'video';
  // A video explicitly pinned to this Q&A (content link), surfaced as a direct "watch" action.
  const pinnedVideo =
    !isVideo && current.pins?.length
      ? pool.find((r) => r.kind === 'video' && current.pins!.includes(r.key))
      : undefined;
  // The full answer, enriched server-side (native + council). EN only exists for bilingual (council)
  // content; native falls back to VI (VI-only, as on its own page). Videos have none — you watch them.
  const body = current.body ? (en && current.body.en ? current.body.en : current.body.vi) : null;

  return (
    <div className={styles.reading}>
      <div className={styles.readingMeta}>
        {isVideo ? (
          <span className={styles.resourceMetaVideo}>
            <T vi="Video" en="Video" />
          </span>
        ) : (
          <span className={styles.readingTopic}>{en ? current.metaEn : current.metaVi}</span>
        )}
      </div>
      <h3 className={styles.readingQuestion}>{en ? current.questionEn : current.questionVi}</h3>

      {body ? (
        // Full answer rendered INLINE (no navigation) — inline refs open the popover via ScriptureBody.
        <ScriptureBody className={styles.answerBody} html={body.html} data={body.data} ccc={body.ccc} />
      ) : (
        current.excerpt && <p className={styles.readingExcerpt}>{pick(current.excerpt)}</p>
      )}

      <div className={styles.readingActions}>
        {isVideo ? (
          <Link href={current.href} className={styles.readFull}>
            <Play size={15} strokeWidth={2.2} />
            <T vi="Xem video đầy đủ" en="Watch the full video" />
          </Link>
        ) : (
          // "Read the full answer" is now inline; keep only a quiet link to the standalone page (for sharing).
          <Link href={current.href} className={styles.openPage}>
            <ExternalLink size={14} strokeWidth={2.2} />
            <T vi="Mở trang riêng" en="Open as its own page" />
          </Link>
        )}
        {pinnedVideo && (
          <Link href={pinnedVideo.href} className={styles.readVideo}>
            <Play size={14} strokeWidth={2.2} />
            <T vi="Xem video liên quan" en="Watch the related video" />
          </Link>
        )}
      </div>
    </div>
  );
}

/* --- follow-ups: ~4 fresh questions + a quiet self-declared exit --- */

function FollowUps({
  suggestions,
  atAnchor,
  en,
  pick,
  onPick,
  onClose,
}: {
  suggestions: Resource[];
  atAnchor: boolean;
  en: boolean;
  pick: Pick;
  onPick: (r: Resource) => void;
  onClose: () => void;
}) {
  return (
    <section className={styles.followUps}>
      <div className={styles.followLabel}>
        {atAnchor ? (
          <T vi="Bạn có thể muốn hỏi" en="You might want to ask" />
        ) : (
          <T vi="Bạn có thể muốn hỏi tiếp" en="You might also wonder" />
        )}
      </div>
      <div className={styles.choices}>
        {suggestions.map((r) => {
          const isVideo = r.kind === 'video';
          const label = r.short ? pick(r.short) : en ? r.questionEn : r.questionVi;
          return (
            <button key={r.key} type="button" className={styles.choice} onClick={() => onPick(r)}>
              <span className={styles.choiceText}>
                <span className={styles.choiceLabel}>
                  {isVideo && (
                    <span className={styles.resourcePlay} aria-hidden="true">
                      <Play size={10} fill="currentColor" strokeWidth={0} />
                    </span>
                  )}
                  {label}
                </span>
                <span className={styles.choiceHint}>
                  {isVideo ? <T vi="Video" en="Video" /> : en ? r.metaEn : r.metaVi}
                </span>
              </span>
              <ArrowRight size={18} strokeWidth={2} className={styles.choiceArrow} />
            </button>
          );
        })}
      </div>
      <button type="button" className={styles.quietExit} onClick={onClose}>
        <Check size={15} strokeWidth={2.2} />
        <T vi="Tôi đã tìm được điều cần" en="I found what I needed" />
      </button>
    </section>
  );
}

/* --- satisfaction check at the natural end of the walk --- */

function Satisfaction({
  onClose,
  onDeadEnd,
}: {
  onClose: () => void;
  onDeadEnd: () => void;
}) {
  return (
    <section className={styles.satisfaction}>
      <div className={styles.satisfactionQ}>
        <T vi="Câu trả lời này có giúp được bạn không?" en="Did this help you?" />
      </div>
      <div className={styles.satisfactionButtons}>
        <button type="button" className={styles.satYes} onClick={onClose}>
          <T vi="Có" en="Yes" />
        </button>
        <button type="button" className={styles.satMaybe} onClick={onDeadEnd}>
          <T vi="Có lẽ" en="Somewhat" />
        </button>
        <button type="button" className={styles.satNo} onClick={onDeadEnd}>
          <T vi="Chưa" en="Not yet" />
        </button>
      </div>
    </section>
  );
}

/* --- closed: a warm positive send-off --- */

function ClosedView({ onRestart }: { onRestart: () => void }) {
  return (
    <div className={styles.ending}>
      <p className={styles.endingLede}>
        <T
          vi="Tạ ơn Chúa. Ước mong những điều bạn vừa đọc gieo được một chút ánh sáng và bình an trong lòng bạn."
          en="Thank God. May what you've just read leave a little light and peace with you."
        />
      </p>
      <div className={styles.endingActions}>
        <button type="button" className={styles.endingPrimary} onClick={onRestart}>
          <RotateCcw size={15} strokeWidth={2.2} />
          <T vi="Bắt đầu lại" en="Start over" />
        </button>
        <Link href="/giai-dap" className={styles.endingSecondary}>
          <T vi="Xem tất cả Giải Đáp" en="Browse all Q&amp;A" />
        </Link>
      </div>
    </div>
  );
}

/* --- pastoral off-ramp: talk to a real person (shown across the whole grief-path walk) --- */

function PastoralOfframp() {
  return (
    <p className={styles.pastoral}>
      <T
        vi="Và nếu đây là điều đang thật sự đè nặng trong lòng bạn, đôi khi trò chuyện với một linh mục — hay ghé giáo xứ gần bạn, hoặc một lớp tìm hiểu đức tin — còn nâng đỡ hơn bất cứ trang web nào."
        en="And if this is something truly weighing on your heart, sometimes a conversation with a priest — or your local parish, or an RCIA / inquiry group — carries you further than any website can."
      />
    </p>
  );
}

/* --- dead-end: an honest, scoped hand-off (NO inbox) --- */

function DeadEndView({
  pool,
  situation,
  visited,
  en,
  pick,
  onPick,
  onRestart,
}: {
  pool: Resource[];
  situation: Situation;
  visited: ReadonlySet<string>;
  en: boolean;
  pick: Pick;
  onPick: (r: Resource) => void;
  onRestart: () => void;
}) {
  // Everything scoped to the trail they walked — the situation's matches they haven't read yet.
  const unread = matchResources(situation, pool).filter((r) => !visited.has(r.key));

  // A focused search seeded from their path (the situation's leading category or tag label).
  const term: Bi | null = situation.categories[0]
    ? categoryLabel(situation.categories[0])
    : situation.tags[0]
      ? tagLabel(situation.tags[0])
      : null;
  const searchHref = term ? `/tim-kiem?q=${encodeURIComponent(pick(term))}` : '/giai-dap';

  return (
    <div className={styles.ending}>
      <p className={styles.endingLede}>
        <T
          vi="Xin lỗi bạn — có lẽ chúng tôi chưa có sẵn câu trả lời đúng điều bạn đang tìm. Nhưng bạn không bị bỏ lại: dưới đây là vài hướng còn có thể giúp."
          en="We're sorry — we may not have the exact answer you're looking for yet. But you're not left on your own: here are a few directions that may still help."
        />
      </p>

      {unread.length > 0 && (
        <section className={styles.followUps}>
          <div className={styles.followLabel}>
            <T vi="Có thể vẫn đáng đọc" en="Still worth a look" />
          </div>
          <div className={styles.choices}>
            {unread.map((r) => {
              const isVideo = r.kind === 'video';
              return (
                <button key={r.key} type="button" className={styles.choice} onClick={() => onPick(r)}>
                  <span className={styles.choiceText}>
                    <span className={styles.choiceLabel}>
                      {isVideo && (
                        <span className={styles.resourcePlay} aria-hidden="true">
                          <Play size={10} fill="currentColor" strokeWidth={0} />
                        </span>
                      )}
                      {en ? r.questionEn : r.questionVi}
                    </span>
                    <span className={styles.choiceHint}>
                      {isVideo ? <T vi="Video" en="Video" /> : en ? r.metaEn : r.metaVi}
                    </span>
                  </span>
                  <ArrowRight size={18} strokeWidth={2} className={styles.choiceArrow} />
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className={styles.handoffLinks}>
        <Link href={searchHref} className={styles.handoffLink}>
          <Search size={15} strokeWidth={2.2} />
          <T vi="Tìm theo chủ đề này" en="Search this topic" />
        </Link>
        <Link href="/giai-dap" className={styles.handoffLink}>
          <BookOpen size={15} strokeWidth={2.2} />
          <T vi="Xem tất cả Giải Đáp" en="Browse all Q&amp;A" />
        </Link>
      </div>

      {situation.pastoral && <PastoralOfframp />}

      <div className={styles.endingActions}>
        <button type="button" className={styles.endingPrimary} onClick={onRestart}>
          <RotateCcw size={15} strokeWidth={2.2} />
          <T vi="Bắt đầu lại" en="Start over" />
        </button>
      </div>
    </div>
  );
}
