// Server loader for the evidence path (/bang-chung). Joins the four stage definitions in
// lib/evidencePathStages.ts to the REAL Giải Đáp content through lib/giaiDap.
//
// SERVER ONLY — this reads content/giai-dap via fs. Client components import
// lib/evidencePathStages.ts (config, no fs) and receive the resolved data below as props.
//
// The path owns NO answer text. Every question, excerpt and body here is read from the cluster's
// own .md files at build time, so the path can never drift from the answers or double the
// proofreading burden. A stage's member questions come from the anchor's `parts:` in its own
// order — add a part to the cluster and it appears here automatically.

import { getAllQuestions, type GiaiDapQuestion } from '@/lib/giaiDap';
import { enrichBody, type EnrichedAnswer } from '@/lib/bibleRefs';
import { EVIDENCE_STAGES, type EvidenceStage } from '@/lib/evidencePathStages';

/** One answer on a stage page — the cluster anchor, or one of its `parts:`. */
export interface EvidenceAnswer {
  slug: string;
  questionVi: string;
  questionEn?: string;
  /** Standalone page, for the quiet "open as its own page" share link. */
  href: string;
  /** Short plain-text teaser shown while the answer is collapsed. */
  excerpt: string;
  /** The full answer, enriched server-side so inline Scripture/CCC refs open the popover. Rendered
   *  in place when the reader expands the row — never a navigation away from the path. */
  body: EnrichedAnswer;
}

/** A stage with its content resolved: the config, the anchor, and the anchor's parts in order. */
export interface ResolvedStage {
  stage: EvidenceStage;
  anchor: EvidenceAnswer;
  parts: EvidenceAnswer[];
  /** anchor + parts — what "5 giải đáp" on the index card counts. */
  answerCount: number;
}

/** A short plain-text preview of an answer, for the collapsed row. Strips Markdown and inline verse
 *  references (e.g. "(Ga 20,23)"), which belong to the full answer with its clickable popover, not
 *  a teaser. Same treatment the companion uses — see app/dong-hanh/page.tsx. */
function preview(md: string, max = 260): string {
  const text = md
    .replace(/^#+\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/[`_]/g, '')
    .replace(/\s*\([^)]{0,24}\d[.,]\d[^)]{0,12}\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 140 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function toAnswer(q: GiaiDapQuestion): EvidenceAnswer {
  return {
    slug: q.slug,
    questionVi: q.questionVi,
    questionEn: q.questionEn,
    href: `/giai-dap/${q.slug}`,
    excerpt: preview(q.bodyRaw),
    body: enrichBody(q.bodyHtml),
  };
}

/** Resolve every stage that has content. A stage whose anchor is missing from content/giai-dap is
 *  DROPPED rather than rendered half-empty — the path only ever shows answers that really exist,
 *  so a renamed or deleted cluster can never leave a dead step behind. */
export function getResolvedStages(): ResolvedStage[] {
  const bySlug = new Map(getAllQuestions().map((q) => [q.slug, q]));

  return EVIDENCE_STAGES.flatMap((stage): ResolvedStage[] => {
    const anchorQ = bySlug.get(stage.anchor);
    if (!anchorQ) return [];
    const parts = anchorQ.parts
      .map((slug) => bySlug.get(slug))
      .filter((q): q is GiaiDapQuestion => Boolean(q))
      .map(toAnswer);
    return [
      {
        stage,
        anchor: toAnswer(anchorQ),
        parts,
        answerCount: 1 + parts.length,
      },
    ];
  });
}

/** One resolved stage by URL segment, or undefined (→ notFound). */
export function getResolvedStage(slug: string): ResolvedStage | undefined {
  return getResolvedStages().find((s) => s.stage.slug === slug);
}

/** Lightweight index-card data: no answer bodies, so the index page never ships 23 answers. */
export interface StageCard {
  stage: EvidenceStage;
  answerCount: number;
  /** The anchor's own question — the concrete thing this step argues about. */
  anchorQuestionVi: string;
  anchorQuestionEn?: string;
}

export function getStageCards(): StageCard[] {
  return getResolvedStages().map(({ stage, anchor, answerCount }) => ({
    stage,
    answerCount,
    anchorQuestionVi: anchor.questionVi,
    anchorQuestionEn: anchor.questionEn,
  }));
}
