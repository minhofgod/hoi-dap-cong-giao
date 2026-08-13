import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'giai-dap');

export interface GiaiDapQuestion {
  slug: string;
  questionVi: string;
  questionEn?: string;
  category: string;
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
  bodyHtml: string;
  bodyRaw: string;
}

function loadFile(filename: string): GiaiDapQuestion {
  const slug = filename.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), 'utf-8');
  const { data, content: body } = matter(raw);
  return {
    slug,
    questionVi: data.question_vi ?? '',
    questionEn: data.question_en,
    category: data.category ?? 'Giải Đáp',
    subcategory: data.subcategory,
    refsCcc: data.refs_ccc ?? [],
    refsScripture: data.refs_scripture ?? [],
    featured: Boolean(data.featured),
    related: data.related ?? [],
    parts: data.parts ?? [],
    partOf: data.part_of,
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

export function getCategories(questions: GiaiDapQuestion[]): string[] {
  return [...new Set(questions.map((q) => q.category))];
}
