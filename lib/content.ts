import rawContent from '@/content/content.json';
import rawToc from '@/content/toc.json';
import type { Paragraph, Toc, TocNode } from './types';

export const content: Paragraph[] = rawContent as Paragraph[];
export const toc: Toc = rawToc as unknown as Toc;

const paragraphsByArticle = new Map<string, Paragraph[]>();
for (const paragraph of content) {
  const list = paragraphsByArticle.get(paragraph.articleId) ?? [];
  list.push(paragraph);
  paragraphsByArticle.set(paragraph.articleId, list);
}

export function getParagraphsForArticle(articleId: string): Paragraph[] {
  return paragraphsByArticle.get(articleId) ?? [];
}

export function getParagraphById(id: number): Paragraph | undefined {
  return content.find((p) => p.id === id);
}

export interface ResolvedCatechism {
  id: number;
  vi: string;
  en: string;
  /** Link to the full paragraph in the Giáo Lý reader. */
  href: string;
}

/** Resolve a Catechism paragraph number to its bilingual text for the reference popover.
 *  Server-side (reads the bundled content) — pass the result to CatechismRef as a prop so the
 *  whole Catechism isn't shipped to the client. */
export function resolveCatechism(id: number): ResolvedCatechism | null {
  const p = getParagraphById(id);
  if (!p) return null;
  return { id: p.id, vi: p.vi, en: p.en, href: `/giao-ly/${p.id}#${p.id}` };
}

export interface FlatArticle {
  id: string;
  titleEn: string;
  titleVi: string;
  paragraphRange: [number, number];
  breadcrumbEn: string[];
  breadcrumbVi: string[];
}

function isLeaf(node: TocNode): boolean {
  return node.children.length === 0;
}

function flattenLeaves(nodes: TocNode[], ancestorsEn: string[], ancestorsVi: string[]): FlatArticle[] {
  return nodes.flatMap((node) => {
    if (isLeaf(node)) {
      return [
        {
          id: node.id,
          titleEn: node.titleEn,
          titleVi: node.titleVi,
          paragraphRange: node.paragraphRange,
          breadcrumbEn: ancestorsEn,
          breadcrumbVi: ancestorsVi,
        },
      ];
    }
    return flattenLeaves(node.children, [...ancestorsEn, node.titleEn], [...ancestorsVi, node.titleVi]);
  });
}

export const flatArticles: FlatArticle[] = flattenLeaves(toc, [], []);

export function getArticleById(articleId: string): FlatArticle | undefined {
  return flatArticles.find((a) => a.id === articleId);
}

export function getAdjacentArticles(articleId: string): { prev?: FlatArticle; next?: FlatArticle } {
  const index = flatArticles.findIndex((a) => a.id === articleId);
  if (index === -1) return {};
  return {
    prev: flatArticles[index - 1],
    next: flatArticles[index + 1],
  };
}

/** The website routes Giáo Lý articles by paragraph number (e.g. /giao-ly/27, or /giao-ly/963
 *  linking straight to a paragraph mid-article) rather than the app's slugified id — cleaner,
 *  citable URLs for a reference site. Matches any paragraph within the article's range, not just
 *  its first — generateStaticParams only pre-renders the start numbers, but Next.js renders
 *  other in-range numbers on demand since dynamicParams isn't disabled. */
export function getArticleByStartNumber(n: number): FlatArticle | undefined {
  return flatArticles.find((a) => n >= a.paragraphRange[0] && n <= a.paragraphRange[1]);
}

export function getAdjacentArticlesByStartNumber(n: number): { prev?: FlatArticle; next?: FlatArticle } {
  const index = flatArticles.findIndex((a) => n >= a.paragraphRange[0] && n <= a.paragraphRange[1]);
  if (index === -1) return {};
  return {
    prev: flatArticles[index - 1],
    next: flatArticles[index + 1],
  };
}
