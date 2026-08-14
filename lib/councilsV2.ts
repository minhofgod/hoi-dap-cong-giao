import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ERA_ORDER, ERA_LABEL, ERA_LABEL_SHORT, ERA_SPAN, ERA_BLURB, type Era, type Bi } from '@/lib/cong-dong/eras';

export type { Era, Bi };
export { ERA_ORDER, ERA_LABEL, ERA_LABEL_SHORT, ERA_SPAN, ERA_BLURB };

export interface Fact {
  label: Bi;
  value: Bi;
}

// A key document / creed / canon / constitution the council produced.
export interface Doc {
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

// Same shape as the Giáo Phụ Portrait so the shared Portrait component accepts it.
export interface CouncilImage {
  src: string;
  medium: Bi;
  source: string;
  license: string;
  available: boolean;
}

export interface Council {
  no: number;
  slug: string;
  era: Era;
  name: Bi; // e.g. "Công đồng Nicêa I"
  subtitle: Bi; // e.g. "Công đồng chung thứ 1 · chống lạc thuyết Ariô"
  dates: { display: string; start: number | null; end: number | null };
  location: Bi;
  quote: { vi: string; en: string; source: Bi };
  background: Bi[]; // what led to it + what happened
  facts: Fact[]; // year, place, convener, pope, number of bishops…
  documents: Doc[]; // creeds, canons, constitutions
  documents_note: Bi;
  sections: Section[]; // heresy condemned, key decisions, significance…
  apologetics: ApologeticsItem[];
  ccc_refs: number[];
  image: CouncilImage;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'cong-dong');

function loadCouncils(): Council[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
  const councils = files.map(
    (f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), 'utf8')) as Council
  );
  councils.sort((a, b) => a.no - b.no);
  return councils;
}

let cache: Council[] | null = null;
function all(): Council[] {
  if (!cache) cache = loadCouncils();
  return cache;
}

export function getAllCouncils(): Council[] {
  return all();
}

export function getCouncilBySlug(slug: string): Council | undefined {
  return all().find((c) => c.slug === slug);
}

export function getAdjacentCouncils(slug: string): { prev?: Council; next?: Council } {
  const councils = all();
  const i = councils.findIndex((c) => c.slug === slug);
  if (i === -1) return {};
  return { prev: councils[i - 1], next: councils[i + 1] };
}

export interface EraGroup {
  era: Era;
  label: Bi;
  span: string;
  blurb: Bi;
  items: Council[];
}

export function getEraGroups(): EraGroup[] {
  const councils = all();
  return ERA_ORDER.map((era) => ({
    era,
    label: ERA_LABEL[era],
    span: ERA_SPAN[era],
    blurb: ERA_BLURB[era],
    items: councils.filter((c) => c.era === era),
  }));
}
