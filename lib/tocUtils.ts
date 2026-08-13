import type { TocNode } from './types';

/** Pure, client-safe: finds the start paragraph number of the leaf article containing `n`.
 *  Operates only on the (small, ~52KB) toc tree — never import content.json into client code. */
export function findArticleStartForParagraph(nodes: TocNode[], n: number): number | null {
  for (const node of nodes) {
    if (n < node.paragraphRange[0] || n > node.paragraphRange[1]) continue;
    if (node.children.length === 0) return node.paragraphRange[0];
    const found = findArticleStartForParagraph(node.children, n);
    if (found !== null) return found;
  }
  return null;
}
