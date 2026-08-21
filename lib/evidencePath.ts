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
import { getMiraclesByTag, type Miracle } from '@/lib/miraclesV2';
import type { Bi, RecognitionStatus } from '@/lib/miracles/types';

/** Recognition statuses the evidence path will show. §B of
 *  docs/miracles-taxonomy-and-evidence-stage.md says "approved cases only", which in the actual
 *  status vocabulary means these two — and only these two:
 *
 *   • `approved`      Church authority investigated and issued a formal act on the event itself.
 *   • `cure-approved` a medical board found the case unexplained, THEN a bishop recognised it.
 *
 *  Deliberately excluded, with reasons the entries' own STATUS_NOTE already spells out:
 *   • `venerated`    — veneration is permitted, but "no modern act has adjudicated the event
 *                      itself; a long tradition is not the same thing as historical evidence."
 *                      This drops every Eucharistic case (Lanciano, Bolsena, Santarém, Siena), both
 *                      incorrupt bodies and the Guadalupe tilma. They are the famous ones, and
 *                      that is exactly why showing them here would cost the section its credibility.
 *   • `not-ruled`    — no formal ruling on the reported event (Buenos Aires, La Vang).
 *   • `other-church` — recognised by another Church, with Rome deferring rather than ruling (Zeitoun).
 *
 *  Note `cure-approved` is NOT a subset of `approved`: the Lourdes Medical Bureau entry that §B
 *  requires the stage to LEAD with carries `cure-approved`, so a literal `status === 'approved'`
 *  filter would have excluded the one case the brief names. */
const RECOGNISED: ReadonlySet<RecognitionStatus> = new Set<RecognitionStatus>([
  'cure-approved',
  'approved',
]);

/** One Church-recognised case on the miracles stage. Flattened from `Miracle` so the client
 *  component never receives the whole record (stories, sources, images, related links). */
export interface EvidenceMiracle {
  slug: string;
  href: string;
  title: Bi;
  location: Bi;
  dateDisplay: string;
  status: RecognitionStatus;
  summary: Bi;
  /** Why anyone takes this case seriously — the disciplined part. */
  evidence: Bi[];
  /** WHAT THIS DOES NOT ESTABLISH. Required by §B and the reason the section is credible at all;
   *  it is rendered as its own block, never folded into the prose. */
  limits: Bi[];
}

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

/** A stage with its content resolved. Mirrors `StageSource`: a cluster stage carries an anchor and
 *  its members, a miracles stage carries recognised cases. Discriminated so a page can never read
 *  `anchor` off a miracles stage. */
export type ResolvedStage = { stage: EvidenceStage; answerCount: number } & (
  | {
      kind: 'cluster';
      anchor: EvidenceAnswer;
      parts: EvidenceAnswer[];
      /** True when the stage deliberately shows only a SLICE of its cluster (`only` is set and the
       *  cluster really does have more). The UI says so and points at the full cluster, so taking
       *  the evidential part of a theology-heavy cluster never reads as "this is all there is". */
      partial: boolean;
    }
  | {
      kind: 'miracles';
      miracles: EvidenceMiracle[];
      /** How many tagged cases were filtered out for not being formally recognised. Shown, not
       *  hidden: a section whose whole claim is honesty about evidence should say that it is
       *  leaving cases out, and why. */
      excludedCount: number;
    }
);

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
    if (stage.source.kind === 'miracles') return resolveMiracleStage(stage, stage.source.tags);

    const anchorQ = bySlug.get(stage.source.anchor);
    if (!anchorQ) return [];

    // `only` narrows a theology-heavy cluster to the evidential slice the path needs — it's scoped
    // to the anchor's own members so a stage can never pull in an unrelated Q&A, and unknown slugs
    // just drop out. Without `only` the stage walks the whole cluster.
    const memberSlugs = stage.source.only
      ? stage.source.only.filter((slug) => anchorQ.parts.includes(slug))
      : anchorQ.parts;
    const parts = memberSlugs
      .map((slug) => bySlug.get(slug))
      .filter((q): q is GiaiDapQuestion => Boolean(q))
      .map(toAnswer);

    return [
      {
        kind: 'cluster',
        stage,
        anchor: toAnswer(anchorQ),
        parts,
        answerCount: 1 + parts.length,
        partial: parts.length < anchorQ.parts.length,
      },
    ];
  });
}

/** Resolve a miracles stage: select by tag, keep only formally recognised cases, and order them so
 *  the medically investigated ones come first.
 *
 *  That ordering is what §B means by "lead with the Lourdes Medical Bureau", expressed as a RULE
 *  rather than a hardcoded slug: `cure-approved` cases are the ones with a documented process that
 *  says "no" far more often than "yes", and a process that refuses thousands of claims persuades a
 *  skeptical reader in a way a list of wonders never will. The Lourdes Medical Bureau entry comes
 *  out first on its own because it is the lowest-numbered such case — and if a new medically
 *  investigated case is added, it slots in by section order without anyone editing this file. */
function resolveMiracleStage(stage: EvidenceStage, tags: string[]): ResolvedStage[] {
  const tagged = getMiraclesByTag(tags);
  const recognised = tagged.filter((m) => RECOGNISED.has(m.status));
  if (recognised.length === 0) return [];

  const rank = (m: Miracle) => (m.status === 'cure-approved' ? 0 : 1);
  const ordered = [...recognised].sort((a, b) => rank(a) - rank(b) || a.no - b.no);

  return [
    {
      kind: 'miracles',
      stage,
      miracles: ordered.map(toEvidenceMiracle),
      answerCount: ordered.length,
      excludedCount: tagged.length - recognised.length,
    },
  ];
}

function toEvidenceMiracle(m: Miracle): EvidenceMiracle {
  return {
    slug: m.slug,
    href: `/phep-la/${m.slug}`,
    title: m.title,
    location: m.location,
    dateDisplay: m.date.display,
    status: m.status,
    summary: m.summary,
    evidence: m.evidence,
    limits: m.limits,
  };
}

/** One resolved stage by URL segment, or undefined (→ notFound). */
export function getResolvedStage(slug: string): ResolvedStage | undefined {
  return getResolvedStages().find((s) => s.stage.slug === slug);
}

/** Lightweight index-card data: no answer bodies, so the index page never ships 23 answers.
 *
 *  The card renders `stage.title` (the step's question) over `stage.covers` (what's inside it), NOT
 *  the anchor's own question — on stages 1 and 4 the stage name and the anchor question are nearly
 *  the same sentence, so showing both made the card say one thing twice. */
export interface StageCard {
  stage: EvidenceStage;
  answerCount: number;
}

export function getStageCards(): StageCard[] {
  return getResolvedStages().map(({ stage, answerCount }) => ({ stage, answerCount }));
}
