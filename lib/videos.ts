import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'video');

export interface Video {
  slug: string;
  title: string;
  youtubeId: string;
  duration?: string;
  summary: string;
  order: number;
  hasBody: boolean;
  bodyHtml: string;
}

function loadFile(filename: string): Video {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data, content: body } = matter(raw);
  const trimmed = body.trim();
  return {
    slug,
    title: data.title ?? '',
    youtubeId: data.youtube_id ?? '',
    duration: data.duration,
    summary: data.summary ?? '',
    order: data.order ?? 999,
    hasBody: trimmed.length > 0,
    bodyHtml: trimmed ? (marked.parse(body, { async: false }) as string) : '',
  };
}

export function getAllVideos(): Video[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(loadFile)
    .sort((a, b) => a.order - b.order);
}

export function getVideoBySlug(slug: string): Video | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return loadFile(`${slug}.md`);
}
