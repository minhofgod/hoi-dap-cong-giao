// Server loader for "Công Giáo và Tin Lành" (/cong-giao-va-tin-lanh). Joins the branch definitions
// in lib/congGiaoTinLanhPath.ts to the REAL Giải Đáp content through lib/giaiDap.
//
// SERVER ONLY — this reads content/giai-dap via fs. Client components import
// lib/congGiaoTinLanhPath.ts (config, no fs) and receive the resolved data below as props.
//
// The path owns NO answer text. Every question, excerpt and body here is read from the cluster's
// own .md files at build time, so the path can never drift from the answers or double the
// proofreading burden. A branch's questions come from its anchors' `parts:` in the cluster's own
// order — add a part to a cluster and it appears here automatically.
//
// Structurally this is the evidence path's loader (lib/evidencePath.ts) with one difference: a
// branch here walks ONE OR MORE clusters, not exactly one, because "how are we saved?" is two
// clusters (faith-and-works, indulgences) and "the sacraments" is two more (confession, baptism).

import { getAllQuestions, type GiaiDapQuestion } from '@/lib/giaiDap';
import { enrichBody, type EnrichedAnswer } from '@/lib/bibleRefs';
import { CG_TL_BRANCHES, type CgTlBranch } from '@/lib/congGiaoTinLanhPath';

/** One answer on a branch page — a cluster anchor, or one of its `parts:`. */
export interface CgTlAnswer {
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

/** One Giải Đáp cluster inside a branch: its anchor, and the anchor's parts in order. */
export interface ResolvedCluster {
  /** The cluster's own name (the anchor's `topic:`), e.g. "Duy Kinh Thánh (Sola Scriptura)". */
  topic: string;
  anchor: CgTlAnswer;
  parts: CgTlAnswer[];
  /** anchor + parts — what the card's "N giải đáp" counts. */
  answerCount: number;
}

/** A branch with its content resolved. */
export interface ResolvedBranch {
  branch: CgTlBranch;
  clusters: ResolvedCluster[];
  /** Every answer in the branch, across all its clusters. */
  answerCount: number;
}

/** A short plain-text preview of an answer, for the collapsed row. Strips Markdown and inline verse
 *  references (e.g. "(Ga 20,23)"), which belong to the full answer with its clickable popover, not
 *  a teaser. Same treatment the companion and the evidence path use. */
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

function toAnswer(q: GiaiDapQuestion): CgTlAnswer {
  return {
    slug: q.slug,
    questionVi: q.questionVi,
    questionEn: q.questionEn,
    href: `/giai-dap/${q.slug}`,
    excerpt: preview(q.bodyRaw),
    body: enrichBody(q.bodyHtml),
  };
}

/** Resolve every branch that has content. An anchor missing from content/giai-dap is DROPPED
 *  rather than rendered half-empty, and a branch left with no clusters at all disappears — so a
 *  renamed or deleted cluster degrades to a shorter path instead of leaving a dead card behind. */
export function getResolvedBranches(): ResolvedBranch[] {
  const bySlug = new Map(getAllQuestions().map((q) => [q.slug, q]));

  return CG_TL_BRANCHES.flatMap((branch): ResolvedBranch[] => {
    const clusters = branch.anchors.flatMap((anchorSlug): ResolvedCluster[] => {
      const anchorQ = bySlug.get(anchorSlug);
      if (!anchorQ) return [];

      const parts = anchorQ.parts
        .map((slug) => bySlug.get(slug))
        .filter((q): q is GiaiDapQuestion => Boolean(q))
        .map(toAnswer);

      return [
        {
          topic: anchorQ.topic,
          anchor: toAnswer(anchorQ),
          parts,
          answerCount: 1 + parts.length,
        },
      ];
    });

    if (clusters.length === 0) return [];

    return [
      {
        branch,
        clusters,
        answerCount: clusters.reduce((n, c) => n + c.answerCount, 0),
      },
    ];
  });
}

/** One resolved branch by URL segment, or undefined (→ notFound). */
export function getResolvedBranch(slug: string): ResolvedBranch | undefined {
  return getResolvedBranches().find((b) => b.branch.slug === slug);
}

/** Lightweight landing-card data: no answer bodies, so the landing page never ships 58 answers. */
export interface BranchCard {
  branch: CgTlBranch;
  answerCount: number;
}

export function getBranchCards(): BranchCard[] {
  return getResolvedBranches().map(({ branch, answerCount }) => ({ branch, answerCount }));
}
