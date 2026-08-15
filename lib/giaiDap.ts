import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { CATEGORY_IDS } from './giaiDapTaxonomy';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'giai-dap');

// Normalize a frontmatter pin field (a single slug string or a list) to a clean string[].
function toSlugArray(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return [];
}

export interface GiaiDapQuestion {
  slug: string;
  questionVi: string;
  questionEn?: string;
  // Cluster name — the /giai-dap index groups by this (was the `category` frontmatter field,
  // now `topic`). Always present.
  topic: string;
  // Broad, audience-facing category id from lib/giaiDapTaxonomy (e.g. "mary-saints"). Optional
  // until the .md files are migrated to the 3-level taxonomy.
  category?: string;
  // Cross-cutting tag ids from lib/giaiDapTaxonomy. Empty until migrated.
  tags: string[];
  subcategory?: string;
  refsCcc: number[];
  refsScripture: string[];
  featured: boolean;
  related: string[];
  // Ordered member slugs that make up this question's full "article" (a main/anchor
  // question only). The article page assembles these as sections. Fixed to the original
  // set — new related questions go in `related`, not here, unless explicitly added.
  parts: string[];
  // The anchor slug this question is a part of (a sub-question only) — for the back-link.
  partOf?: string;
  // Optional explicit pin(s): video slug(s) to force to the front of this Q&A's "Watch the video"
  // (frontmatter `related_video`). Auto tag-overlap fills the rest — see lib/relatedContent.
  relatedVideo: string[];
  bodyHtml: string;
  bodyRaw: string;
}

function loadFile(filename: string): GiaiDapQuestion {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data, content: body } = matter(raw);

  // Backward-compatible taxonomy read (migration in progress):
  //  • NEW file: `topic` = cluster name, `category` = a broad taxonomy id, `tags` = ids.
  //  • LEGACY file: no `topic`/`tags`; `category` still holds the cluster name (Vietnamese prose).
  // A `category:` value is treated as the broad category only when it's a known taxonomy id;
  // otherwise it's read as the legacy cluster name (→ topic). The two value spaces are disjoint
  // (ascii-kebab ids vs. Vietnamese prose), so this never misclassifies.
  const rawCategory: string | undefined = data.category;
  const rawTopic: string | undefined = data.topic;
  const categoryIsBroad = typeof rawCategory === 'string' && CATEGORY_IDS.has(rawCategory);
  const topic = rawTopic ?? (categoryIsBroad ? 'Giải Đáp' : rawCategory) ?? 'Giải Đáp';
  const category = categoryIsBroad ? rawCategory : undefined;

  return {
    slug,
    questionVi: data.question_vi ?? '',
    questionEn: data.question_en,
    topic,
    category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    subcategory: data.subcategory,
    refsCcc: data.refs_ccc ?? [],
    refsScripture: data.refs_scripture ?? [],
    featured: Boolean(data.featured),
    related: data.related ?? [],
    parts: data.parts ?? [],
    partOf: data.part_of,
    relatedVideo: toSlugArray(data.related_video),
    bodyHtml: marked.parse(body, { async: false }) as string,
    bodyRaw: body,
  };
}

export function getAllQuestions(): GiaiDapQuestion[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(loadFile)
    .sort((a, b) => a.questionVi.localeCompare(b.questionVi, 'vi'));
}

export function getQuestionBySlug(slug: string): GiaiDapQuestion | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return loadFile(`${slug}.md`);
}

/** Distinct cluster names (topics) present in the given questions, in first-seen order. */
export function getTopics(questions: GiaiDapQuestion[]): string[] {
  return [...new Set(questions.map((q) => q.topic))];
}
