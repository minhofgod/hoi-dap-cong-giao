import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ERA_ORDER, ERA_LABEL, ERA_LABEL_SHORT, ERA_SPAN, ERA_BLURB, type Era, type Bi } from '@/lib/giao-phu/eras';

export type { Era, Bi };
export { ERA_ORDER, ERA_LABEL, ERA_LABEL_SHORT, ERA_SPAN, ERA_BLURB };

export interface Fact {
  label: Bi;
  value: Bi;
}

export interface Work {
  title: Bi;
  latin: string;
  date: string;
}

export interface Section {
  id: string;
  title: Bi;
  body: Bi;
  open: boolean;
}

export interface ApologeticsItem {
  q: Bi;
  a: Bi;
}

export interface Portrait {
  src: string;
  medium: Bi;
  source: string;
  license: string;
  available: boolean;
}

export interface Figure {
  no: number;
  slug: string;
  era: Era;
  name: Bi;
  role: Bi;
  dates: { display: string; born: number | null; died: number | null };
  quote: { vi: string; en: string; source: Bi };
  life: Bi[];
  facts: Fact[];
  works: Work[];
  works_note: Bi;
  sections: Section[];
  apologetics: ApologeticsItem[];
  ccc_refs: number[];
  portrait: Portrait;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'giao-phu');
const EXCLUDE = new Set(['church-fathers.json', 'church-fathers-vi.json']);

function loadFigures(): Figure[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json') && !EXCLUDE.has(f));
  const figures = files.map((f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), 'utf8')) as Figure);
  figures.sort((a, b) => a.no - b.no);
  return figures;
}

let cache: Figure[] | null = null;
function all(): Figure[] {
  if (!cache) cache = loadFigures();
  return cache;
}

export function getAllFigures(): Figure[] {
  return all();
}

export function getFigureBySlug(slug: string): Figure | undefined {
  return all().find((f) => f.slug === slug);
}

export function getAdjacentFigures(slug: string): { prev?: Figure; next?: Figure } {
  const figures = all();
  const index = figures.findIndex((f) => f.slug === slug);
  if (index === -1) return {};
  return { prev: figures[index - 1], next: figures[index + 1] };
}

// Era metadata (label/span/blurb constants) lives in lib/giao-phu/eras.ts, imported above and
// re-exported for this module's callers — kept in its own file with no `node:fs` import so client
// components (e.g. components/giao-phu/Rail.tsx) can import the constants directly without
// pulling this file's filesystem-based content loader into the browser bundle.

export interface EraGroup {
  era: Era;
  label: Bi;
  span: string;
  blurb: Bi;
  items: Figure[];
}

export function getEraGroups(): EraGroup[] {
  const figures = all();
  return ERA_ORDER.map((era) => ({
    era,
    label: ERA_LABEL[era],
    span: ERA_SPAN[era],
    blurb: ERA_BLURB[era],
    items: figures.filter((f) => f.era === era),
  }));
}
