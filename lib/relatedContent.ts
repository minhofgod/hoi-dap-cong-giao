// Shared taxonomy-overlap scorer for auto cross-links between content types (videos ↔ Q&As, and
// anything else carrying the Giải Đáp taxonomy). Videos and Q&As are siblings linked by shared
// tags/category — see docs/roadmap.md "Content link model". This is the single scorer; the page
// cross-links (video → related Q&As, Q&A → watch the video) and the Đồng hành companion all use it,
// so they agree on what "related" means.

/** Anything carrying the Giải Đáp taxonomy: one broad category id + tag ids. */
export interface Taxonomized {
  category?: string;
  tags: string[];
}

/** Overlap score between two taxonomized items: +3 for the same broad category, +1 per shared tag. */
export function taxonomyScore(a: Taxonomized, b: Taxonomized): number {
  let score = 0;
  if (a.category && b.category && a.category === b.category) score += 3;
  if (a.tags.length > 0 && b.tags.length > 0) {
    const bTags = new Set(b.tags);
    for (const t of a.tags) if (bTags.has(t)) score += 1;
  }
  return score;
}

export interface RankOptions<T> {
  /** Max results to return (default 3). */
  limit?: number;
  /** Slugs forced to the front, in the given order — even at zero overlap (explicit pins). */
  pins?: string[];
  /** Collapse results sharing a key to the first (highest-ranked) one — e.g. one Q&A per cluster. */
  dedupeKey?: (item: T) => string | undefined;
}

/** Rank `candidates` by taxonomy overlap with `target`, highest score first. Pinned slugs lead
 *  (in pin order); the rest are candidates with score > 0. `candidates` order is the stable
 *  tiebreak for equal scores, so pass them pre-sorted the way ties should resolve. The target is
 *  never in its own candidate list here (videos vs. Q&As are distinct sets), so no self-match. */
export function relatedByTaxonomy<T extends Taxonomized & { slug: string }>(
  target: Taxonomized,
  candidates: T[],
  options: RankOptions<T> = {}
): T[] {
  const { limit = 3, pins = [], dedupeKey } = options;
  const pinSet = new Set(pins);

  const pinned = pins
    .map((slug) => candidates.find((c) => c.slug === slug))
    .filter((c): c is T => Boolean(c));

  const scored = candidates
    .map((item) => ({ item, score: taxonomyScore(target, item) }))
    .filter(({ item, score }) => score > 0 && !pinSet.has(item.slug))
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);

  const ordered = [...pinned, ...scored];

  const result: T[] = [];
  const seen = new Set<string>();
  for (const item of ordered) {
    const key = dedupeKey?.(item);
    if (key !== undefined) {
      if (seen.has(key)) continue;
      seen.add(key);
    }
    result.push(item);
    if (result.length >= limit) break;
  }
  return result;
}
