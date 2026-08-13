import rawEn from '@/content/giao-phu/church-fathers.json';
import rawVi from '@/content/giao-phu/church-fathers-vi.json';

interface RawWriting {
  title: string;
  description: string;
}
interface RawApologetics {
  topic: string;
  text: string;
}
interface RawFigure {
  id: number;
  chronological_order?: number;
  full_name: string;
  nickname: string;
  birth_year: string;
  death_year: string;
  era: string;
  region_see: string;
  role: string;
  pope: { is_pope: boolean; detail: string | null };
  lineage: string;
  known_for: string;
  key_writings: RawWriting[];
  key_quote: { text: string; citation: string };
  controversy_councils: string;
  martyrdom: string;
  feast_day: string | null;
  doctor_of_the_church: boolean;
  canonized: boolean;
  apologetics_corner: RawApologetics[];
}

export interface Bi {
  vi: string;
  en: string;
}

export interface ChurchFather {
  slug: string;
  id: number;
  chronologicalOrder: number;
  fullName: Bi;
  nickname: Bi;
  birthYear: Bi;
  deathYear: Bi;
  era: Bi;
  regionSee: Bi;
  role: Bi;
  pope: { isPope: boolean; detail: Bi | null };
  lineage: Bi;
  knownFor: Bi;
  keyWritings: { title: Bi; description: Bi }[];
  keyQuote: { text: Bi; citation: Bi };
  controversyCouncils: Bi;
  martyrdom: Bi;
  feastDay: Bi | null;
  doctorOfTheChurch: boolean;
  canonized: boolean;
  apologeticsCorner: { topic: Bi; text: Bi }[];
}

const COMBINING_MARKS = /[̀-ͯ]/g;

// A handful of figures are recorded "Formal Latin Name (Common Name)" rather than the reverse —
// the naive split-on-"(" would slug them by the Latin name (e.g. "titus-flavius-clemens"),
// which nobody recognizes. Override with the name people actually know them by.
const SLUG_OVERRIDES: Record<number, string> = {
  6: 'clement-of-alexandria',
  7: 'tertullian',
  9: 'origen',
  10: 'cyprian-of-carthage',
  21: 'jerome',
  22: 'john-chrysostom',
  23: 'augustine-of-hippo',
  26: 'leo-the-great',
  27: 'gregory-the-great',
};

function slugifyText(text: string): string {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function slugify(fullName: string, id: number): string {
  if (SLUG_OVERRIDES[id]) return SLUG_OVERRIDES[id];
  return slugifyText(fullName.split('(')[0].trim());
}

function bi(en: string, vi: string): Bi {
  return { en, vi };
}

function merge(en: RawFigure, vi: RawFigure): ChurchFather {
  return {
    slug: slugify(en.full_name, en.id),
    id: en.id,
    chronologicalOrder: en.chronological_order ?? en.id,
    fullName: bi(en.full_name, vi.full_name),
    nickname: bi(en.nickname, vi.nickname),
    birthYear: bi(en.birth_year, vi.birth_year),
    deathYear: bi(en.death_year, vi.death_year),
    era: bi(en.era, vi.era),
    regionSee: bi(en.region_see, vi.region_see),
    role: bi(en.role, vi.role),
    pope: {
      isPope: en.pope.is_pope,
      detail: en.pope.detail && vi.pope.detail ? bi(en.pope.detail, vi.pope.detail) : null,
    },
    lineage: bi(en.lineage, vi.lineage),
    knownFor: bi(en.known_for, vi.known_for),
    keyWritings: en.key_writings.map((w, i) => ({
      title: bi(w.title, vi.key_writings[i]?.title ?? w.title),
      description: bi(w.description, vi.key_writings[i]?.description ?? w.description),
    })),
    keyQuote: {
      text: bi(en.key_quote.text, vi.key_quote.text),
      citation: bi(en.key_quote.citation, vi.key_quote.citation),
    },
    controversyCouncils: bi(en.controversy_councils, vi.controversy_councils),
    martyrdom: bi(en.martyrdom, vi.martyrdom),
    feastDay: en.feast_day && vi.feast_day ? bi(en.feast_day, vi.feast_day) : null,
    doctorOfTheChurch: en.doctor_of_the_church,
    canonized: en.canonized,
    apologeticsCorner: en.apologetics_corner.map((a, i) => ({
      topic: bi(a.topic, vi.apologetics_corner[i]?.topic ?? a.topic),
      text: bi(a.text, vi.apologetics_corner[i]?.text ?? a.text),
    })),
  };
}

const viById = new Map((rawVi as { figures: RawFigure[] }).figures.map((f) => [f.id, f]));

const figures: ChurchFather[] = (rawEn as { figures: RawFigure[] }).figures
  .map((en) => merge(en, viById.get(en.id) ?? en))
  .sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);

export function getAllFathers(): ChurchFather[] {
  return figures;
}

export function getFatherBySlug(slug: string): ChurchFather | undefined {
  return figures.find((f) => f.slug === slug);
}

export function getEras(): string[] {
  return [...new Set(figures.map((f) => f.era.vi))];
}

export function getAdjacentFathers(slug: string): { prev?: ChurchFather; next?: ChurchFather } {
  const index = figures.findIndex((f) => f.slug === slug);
  if (index === -1) return {};
  return { prev: figures[index - 1], next: figures[index + 1] };
}
