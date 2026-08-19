import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'tong-luan');

/** The parts of the Summa, in reading order. `dir` is the folder under content/tong-luan; the
 *  intro and conclusion live at the root and are keyed by their frontmatter `part` value. */
export const TONG_LUAN_PARTS = [
  { id: 'mo-dau', vi: 'Mở đầu', en: 'Introduction', blurbVi: 'Thánh Tôma là ai, và đọc bộ Tổng luận thế nào', blurbEn: 'Who Aquinas was, and how to read the Summa' },
  { id: 'phan-i', vi: 'Phần I — Thiên Chúa và công trình sáng tạo', en: 'Part I — God and creation', blurbVi: 'Thiên Chúa, Ba Ngôi, các thiên thần, và con người', blurbEn: 'God, the Trinity, the angels, and man' },
  { id: 'phan-i-ii', vi: 'Phần I-II — Con người hướng về Thiên Chúa', en: "Part I-II — Man's journey to God", blurbVi: 'Hạnh phúc, hành động nhân linh, nhân đức, luật và ân sủng', blurbEn: 'Happiness, human acts, virtue, law and grace' },
  { id: 'phan-ii-ii', vi: 'Phần II-II — Các nhân đức cụ thể', en: 'Part II-II — The particular virtues', blurbVi: 'Tin, cậy, mến và bốn nhân đức trụ', blurbEn: 'Faith, hope, charity and the four cardinal virtues' },
  { id: 'phan-iii', vi: 'Phần III — Đức Kitô và các Bí tích', en: 'Part III — Christ and the sacraments', blurbVi: 'Nhập thể, Thương Khó, các Bí tích và cánh chung', blurbEn: 'Incarnation, Passion, the sacraments and the last things' },
  { id: 'ket-luan', vi: 'Phần Kết', en: 'Conclusion', blurbVi: 'Vì sao ngài ngừng viết, và nhìn lại toàn bộ lộ trình', blurbEn: 'Why he stopped writing, and a look back over the road' },
] as const;

export type TongLuanPartId = (typeof TONG_LUAN_PARTS)[number]['id'];

const PART_INDEX = new Map<string, number>(TONG_LUAN_PARTS.map((p, i) => [p.id, i]));

export interface TongLuanSource {
  label: string;
  url?: string;
}

export interface TongLuanChapter {
  slug: string;
  titleVi: string;
  titleEn: string;
  part: string;
  order: number;
  /** The Summa location this chapter expounds, e.g. "I, q.2, Tiết 3". May be empty. */
  summaRef: string;
  /** Set to "supplementum" on chapters expounding text Aquinas did not write himself. When
   *  present the page renders a visible caveat — see summaNote. */
  summaSource?: string;
  summaNote?: string;
  /** The "A. Về Thiên Chúa"-style grouping heading lifted off the top of the body, when present. */
  section?: string;
  refsCcc: number[];
  refsScripture: string[];
  sources: TongLuanSource[];
  bodyHtml: string;
}

function toSources(value: unknown): TongLuanSource[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): TongLuanSource[] => {
    if (typeof entry === 'string') {
      const label = entry.trim();
      return label ? [{ label }] : [];
    }
    if (entry && typeof entry === 'object') {
      const { label, url } = entry as { label?: unknown; url?: unknown };
      if (typeof label !== 'string' || !label.trim()) return [];
      const trimmedUrl = typeof url === 'string' && url.trim() ? url.trim() : undefined;
      return [{ label: label.trim(), ...(trimmedUrl ? { url: trimmedUrl } : {}) }];
    }
    return [];
  });
}

/**
 * The .md files open with a heading block that the page chrome already renders — the part name
 * (h1), an optional section heading (h2), the chapter title (h3), and the italic Summa citation.
 * Strip those so the body starts at the actual prose, and hand back the section heading, which is
 * the only one of the four not already in frontmatter.
 */
function stripLeadingChrome(body: string): { body: string; section?: string } {
  const lines = body.split('\n');
  let i = 0;
  let section: string | undefined;
  const isBlank = (s: string) => s.trim() === '';
  const isItalicOnly = (s: string) => /^\*\(.*\)\*\s*$/.test(s.trim());

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      if (heading[1] === '##') section = heading[2].trim();
      i++;
      continue;
    }
    if (isItalicOnly(line)) {
      i++;
      continue;
    }
    break;
  }
  return { body: lines.slice(i).join('\n').trimStart(), section };
}

function loadFile(filePath: string): TongLuanChapter {
  const slug = path.basename(filePath, '.md').replace(/^\d+-/, '');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const { body, section } = stripLeadingChrome(content);

  return {
    slug,
    titleVi: typeof data.title_vi === 'string' ? data.title_vi : slug,
    titleEn: typeof data.title_en === 'string' ? data.title_en : '',
    part: typeof data.part === 'string' ? data.part : 'phan-i',
    order: typeof data.order === 'number' ? data.order : 0,
    summaRef: typeof data.summa_ref === 'string' ? data.summa_ref : '',
    summaSource: typeof data.summa_source === 'string' ? data.summa_source : undefined,
    summaNote: typeof data.summa_note === 'string' ? data.summa_note : undefined,
    section,
    refsCcc: Array.isArray(data.refs_ccc) ? data.refs_ccc.filter((n: unknown): n is number => typeof n === 'number') : [],
    refsScripture: Array.isArray(data.refs_scripture)
      ? data.refs_scripture.filter((s: unknown): s is string => typeof s === 'string')
      : [],
    sources: toSources(data.sources),
    bodyHtml: marked.parse(body, { async: false }) as string,
  };
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.md') ? [full] : [];
  });
}

/** Every chapter, in reading order: by part (intro → I → I-II → II-II → III → conclusion), then
 *  by the frontmatter `order` within each part. This ordering drives the index, the sidebar and
 *  prev/next, so all three stay in step. */
export function getAllChapters(): TongLuanChapter[] {
  return walk(CONTENT_DIR)
    .map(loadFile)
    .sort((a, b) => {
      const pa = PART_INDEX.get(a.part) ?? 99;
      const pb = PART_INDEX.get(b.part) ?? 99;
      return pa !== pb ? pa - pb : a.order - b.order;
    });
}

export function getChapterBySlug(slug: string): TongLuanChapter | undefined {
  return getAllChapters().find((c) => c.slug === slug);
}

/** Chapters grouped by part, in reading order, skipping parts that have no chapters. */
export function getChaptersByPart(): {
  part: (typeof TONG_LUAN_PARTS)[number];
  chapters: TongLuanChapter[];
}[] {
  const all = getAllChapters();
  return TONG_LUAN_PARTS.map((part) => ({
    part,
    chapters: all.filter((c) => c.part === part.id),
  })).filter((g) => g.chapters.length > 0);
}

/** The previous and next chapter in reading order, for the chapter footer nav. */
export function getNeighbours(slug: string): {
  prev?: TongLuanChapter;
  next?: TongLuanChapter;
} {
  const all = getAllChapters();
  const i = all.findIndex((c) => c.slug === slug);
  if (i === -1) return {};
  return { prev: all[i - 1], next: all[i + 1] };
}
