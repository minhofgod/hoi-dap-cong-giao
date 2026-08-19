import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import {
  TYPE_ORDER,
  TYPE_LABEL,
  TYPE_LABEL_SHORT,
  TYPE_KICKER,
  TYPE_BLURB,
  STATUS_LABEL,
  STATUS_NOTE,
  PRIVATE_REVELATION_NOTE,
  type MiracleType,
  type RecognitionStatus,
  type Bi,
} from '@/lib/miracles/types';

export type { MiracleType, RecognitionStatus, Bi };
export {
  TYPE_ORDER,
  TYPE_LABEL,
  TYPE_LABEL_SHORT,
  TYPE_KICKER,
  TYPE_BLURB,
  STATUS_LABEL,
  STATUS_NOTE,
  PRIVATE_REVELATION_NOTE,
};

// The Phép Lạ & Hiện Ra content model (docs/phep-la-spec.md). Structurally this mirrors
// lib/saintsV2.ts — JSON per entry, memoized server-side loader, group blocks for the index — but
// the unit is an EVENT, not a person, so the fields differ:
//
//   story        what happened
//   recognition  what the Church actually did about it, and what that act means
//   evidence     what the investigations actually found
//   limits       what this case does NOT establish        ← required, and the point of the section
//   significance why it matters anyway
//
// `limits` is deliberately part of the type rather than an optional afterthought. Every popular
// account of these events over-claims somewhere, so every entry here owes the reader the sentence
// that says where the claim stops. An entry without it is not publishable.

/** An external citation. Same shape as the Q&A section's GiaiDapSource (lib/giaiDap.ts), so the
 *  two sections' citation blocks stay interchangeable — plain reference with an optional link,
 *  never a popover chip. */
export interface MiracleSource {
  label: string;
  url?: string;
}

export interface Fact {
  label: Bi;
  value: Bi;
}

/** A link out of an entry: to a saint (`/cac-thanh/...`), another miracle, or the explainer. */
export interface RelatedLink {
  href: string;
  label: Bi;
  note?: Bi;
  available: boolean;
}

/** Mirrors the Saints' Portrait, with one addition: `sourceUrl`. Most images in this section are
 *  CC BY-SA / CC BY rather than public domain, and those licences require attribution that a
 *  reader can actually follow — so the credit line links back to the Commons file page.
 *
 *  Images here are of PLACES — the church at Lanciano, the grotto at Massabielle, the bell tower
 *  at La Vang — never of the contested object itself. A photograph of a relic would function as an
 *  evidentiary claim on a page whose whole point is that the claim is not settled.
 *
 *  `available: false` renders nothing rather than a broken image, so an entry can ship before a
 *  usable photograph is found (see buenos-aires-1996). */
export interface MiracleImage {
  src: string;
  caption: Bi;
  /** Attribution line: "<author> / Wikimedia Commons". */
  source: string;
  /** Commons file page, so the attribution is followable. Omit for images with no online source. */
  sourceUrl?: string;
  license: string;
  available: boolean;
  objectPosition?: string;
}

export interface Miracle {
  no: number;
  slug: string;
  type: MiracleType;
  status: RecognitionStatus;
  title: Bi;
  location: Bi;
  date: { display: string; year: number | null };
  summary: Bi;
  story: Bi[];
  recognition: Bi[];
  evidence: Bi[];
  /** "What this does not establish." Required — see the note above. */
  limits: Bi[];
  significance: Bi[];
  facts?: Fact[];
  ccc_refs?: number[];
  sources: MiracleSource[];
  /** Slug in content/cac-thanh — the bridge back to the Saints section. */
  related_saint?: string;
  related?: RelatedLink[];
  image: MiracleImage;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'phep-la');

function loadMiracles(): Miracle[] {
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.json'));
  const miracles = files.map(
    (f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), 'utf8')) as Miracle
  );
  miracles.sort((a, b) => a.no - b.no);
  return miracles;
}

// Memoized once per server process (mirrors saintsV2 / churchFathersV2). In `next dev` an edit to a
// content JSON only shows after this module itself reloads; a production build reads the files once
// at build time, so the cache is always fresh there.
let cache: Miracle[] | null = null;
function all(): Miracle[] {
  if (!cache) cache = loadMiracles();
  return cache;
}

export function getAllMiracles(): Miracle[] {
  return all();
}

export function getMiracleBySlug(slug: string): Miracle | undefined {
  return all().find((m) => m.slug === slug);
}

export function getAdjacentMiracles(slug: string): { prev?: Miracle; next?: Miracle } {
  const miracles = all();
  const index = miracles.findIndex((m) => m.slug === slug);
  if (index === -1) return {};
  return { prev: miracles[index - 1], next: miracles[index + 1] };
}

export interface TypeBlock {
  type: MiracleType;
  label: Bi;
  kicker: Bi;
  blurb: Bi;
  items: Miracle[];
}

export function getTypeBlocks(): TypeBlock[] {
  const miracles = all();
  return TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABEL[type],
    kicker: TYPE_KICKER[type],
    blurb: TYPE_BLURB[type],
    items: miracles.filter((m) => m.type === type),
  })).filter((t) => t.items.length > 0);
}
