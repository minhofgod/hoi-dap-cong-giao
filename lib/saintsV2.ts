import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  GROUP_ORDER,
  GROUP_LABEL,
  GROUP_LABEL_SHORT,
  GROUP_KICKER,
  GROUP_BLURB,
  type SaintGroup,
  type Bi,
} from '@/lib/saints/groups';

export type { SaintGroup, Bi };
export { GROUP_ORDER, GROUP_LABEL, GROUP_LABEL_SHORT, GROUP_KICKER, GROUP_BLURB };

// A Saint entry is structurally a Church Father entry (mirrors lib/churchFathersV2.ts) with two
// differences: `era` becomes `group` (theme, not chronology), and several fields the Fathers always
// carry are OPTIONAL here — a martyred laywoman has no `works`, and a modern saint may have no
// `apologetics`. The detail page guards every optional block, so a saint may fill only what fits.

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

/** A forward link on a bridge saint (Bernadette → Lộ Đức, Juan Diego → Guadalupe, Carlo Acutis →
 *  Eucharistic miracles, Mônica → the companion's "loved one drifted" path). When `available` is
 *  false the target section isn't built yet (e.g. /phep-la): render as a clearly-marked "coming
 *  soon" note, NEVER a live link that 404s. */
export interface RelatedLink {
  href: string;
  label: Bi;
  note?: Bi;
  available: boolean;
}

export interface Portrait {
  src: string;
  medium: Bi;
  source: string;
  license: string;
  available: boolean;
  /** Optional CSS object-position override for the circular crop (e.g. "50% 34%"). Defaults to the
   *  top-weighted framing tuned for painted portraits; set it when a face sits lower in the source
   *  (e.g. a relief or full-figure image). */
  objectPosition?: string;
}

export interface Saint {
  no: number;
  slug: string;
  group: SaintGroup;
  name: Bi;
  role: Bi;
  dates: { display: string; born: number | null; died: number | null };
  quote: { vi: string; en: string; source: Bi };
  life: Bi[];
  facts: Fact[];
  /** Optional writings/legacy. `works_label` overrides the default "Major writings" heading
   *  (e.g. "Di sản để lại" / "What they left behind" for a saint who wrote no books). */
  works?: Work[];
  works_label?: Bi;
  works_note?: Bi;
  sections?: Section[];
  apologetics?: ApologeticsItem[];
  ccc_refs?: number[];
  related?: RelatedLink[];
  portrait: Portrait;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'cac-thanh');

function loadSaints(): Saint[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
  const saints = files.map((f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), 'utf8')) as Saint);
  saints.sort((a, b) => a.no - b.no);
  return saints;
}

// Memoized once per server process (mirrors churchFathersV2). In `next dev` this means edits to a
// content JSON only appear after this module itself reloads; a production build reads the files
// once at build time, so the cache is always fresh there.
let cache: Saint[] | null = null;
function all(): Saint[] {
  if (!cache) cache = loadSaints();
  return cache;
}

export function getAllSaints(): Saint[] {
  return all();
}

export function getSaintBySlug(slug: string): Saint | undefined {
  return all().find((s) => s.slug === slug);
}

export function getAdjacentSaints(slug: string): { prev?: Saint; next?: Saint } {
  const saints = all();
  const index = saints.findIndex((s) => s.slug === slug);
  if (index === -1) return {};
  return { prev: saints[index - 1], next: saints[index + 1] };
}

export interface GroupBlock {
  group: SaintGroup;
  label: Bi;
  kicker: Bi;
  blurb: Bi;
  items: Saint[];
}

export function getGroupBlocks(): GroupBlock[] {
  const saints = all();
  return GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABEL[group],
    kicker: GROUP_KICKER[group],
    blurb: GROUP_BLURB[group],
    items: saints.filter((s) => s.group === group),
  })).filter((g) => g.items.length > 0);
}
