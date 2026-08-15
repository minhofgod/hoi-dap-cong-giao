import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'video');

export interface Video {
  slug: string;
  title: string;
  titleEn?: string;
  youtubeId: string;
  duration?: string;
  summary: string;
  summaryEn?: string;
  // Q&A taxonomy (shared with Giải Đáp — see lib/giaiDapTaxonomy). One broad category id + tag ids,
  // so videos can surface alongside Q&As in the Đồng hành companion. Optional until the video .md
  // files are tagged: category is undefined and tags is [] when absent.
  category?: string;
  tags: string[];
  // Optional explicit pin(s): Q&A slug(s) to force to the front of this video's "Related questions"
  // (frontmatter `related_qa`). Auto tag-overlap fills the rest — see lib/relatedContent.
  relatedQa: string[];
  order: number;
  hasBody: boolean;
  bodyHtml: string;
  // English companion (from <slug>.en.md, optional). When present the watch page shows the
  // VI/EN toggle and renders both bodies (CSS picks the visible one via [data-lang]).
  hasBodyEn: boolean;
  bodyHtmlEn: string;
}

function render(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

// Normalize a frontmatter pin field (a single slug string or a list) to a clean string[].
function toSlugArray(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
}

function loadFile(filename: string): Video {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data, content: body } = matter(raw);
  const trimmed = body.trim();

  // Optional English companion: <slug>.en.md (body, and an optional English summary).
  const enPath = path.join(CONTENT_DIR, `${slug}.en.md`);
  let bodyHtmlEn = '';
  let summaryEn: string | undefined;
  let titleEn: string | undefined;
  if (fs.existsSync(enPath)) {
    const en = matter(fs.readFileSync(enPath, 'utf-8'));
    const enTrimmed = en.content.trim();
    bodyHtmlEn = enTrimmed ? render(en.content) : '';
    summaryEn = en.data.summary;
    titleEn = en.data.title;
  }

  return {
    slug,
    title: data.title ?? '',
    titleEn,
    youtubeId: data.youtube_id ?? '',
    duration: data.duration,
    summary: data.summary ?? '',
    summaryEn,
    category: typeof data.category === 'string' ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags : [],
    relatedQa: toSlugArray(data.related_qa),
    order: data.order ?? 999,
    hasBody: trimmed.length > 0,
    bodyHtml: trimmed ? render(body) : '',
    hasBodyEn: bodyHtmlEn.length > 0,
    bodyHtmlEn,
  };
}

export function getAllVideos(): Video[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'))
    .map(loadFile)
    .sort((a, b) => a.order - b.order);
}

export function getVideoBySlug(slug: string): Video | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return loadFile(`${slug}.md`);
}
