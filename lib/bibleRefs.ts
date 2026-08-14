// Resolves a Vietnamese Scripture reference (e.g. "Ga 20,23", "1 Cr 13,12", "Kh 6,9-11")
// to its CGKPV verse text, reading the build-time content/bible.json.
//
// SERVER-ONLY: this imports the full copyrighted CGKPV text via fs. Never import it into a
// client component. Pages resolve references server-side and pass the small resolved result
// down as props, so the browser only ever receives the verses actually cited on that page —
// and only when the licensing flag is on (see lib/scriptureFlag.ts).

import fs from 'node:fs';
import path from 'node:path';
import { SCRIPTURE_POPOVER_ENABLED } from './scriptureFlag';
import { resolveCatechism, type ResolvedCatechism } from './content';

interface BibleData {
  translation: string;
  books: Record<string, { order: number; testament: string; abbrevs: string[] }>;
  abbrevIndex: Record<string, string>;
  verses: Record<string, Record<string, Record<string, string>>>;
}

export interface ResolvedVerse {
  n: number;
  text: string;
}

export interface ResolvedReference {
  /** The reference as written, e.g. "Ga 20,23". */
  ref: string;
  /** Full canonical Vietnamese book name for the label, e.g. "Gioan". */
  bookVi: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  /** The requested verse(s). */
  verses: ResolvedVerse[];
  /** A wider window for "Xem thêm ngữ cảnh", e.g. "Ga 20,19–23". */
  context: string;
  /** The verses of that wider window, ready to render in place. */
  contextVerses: ResolvedVerse[];
  translation: string;
}

let cache: BibleData | null = null;

function load(): BibleData | null {
  if (cache) return cache;
  const file = path.join(process.cwd(), 'content', 'bible.json');
  if (!fs.existsSync(file)) return null;
  cache = JSON.parse(fs.readFileSync(file, 'utf-8')) as BibleData;
  return cache;
}

function norm(s: string): string {
  return s.trim().normalize('NFC').toLowerCase().replace(/\.$/, '').replace(/\s+/g, ' ');
}

interface ParsedRef {
  bookToken: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
}

/** Parse a single clean reference string. Vietnamese convention: comma between chapter and
 *  verse ("20,23"); hyphen or en-dash for a same-chapter range ("9-11"). Also accepts a colon.
 *  Returns null on anything it doesn't cleanly recognize (e.g. cross-chapter ranges). */
export function parseRef(input: string): ParsedRef | null {
  const s = input.trim().normalize('NFC');
  const m = s.match(/^(.+?)\s+(\d+)\s*[,:]\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/u);
  if (!m) return null;
  const [, bookToken, chapter, vStart, vEnd] = m;
  const start = Number(vStart);
  const end = vEnd ? Number(vEnd) : start;
  if (end < start) return null;
  return { bookToken: bookToken.trim(), chapter: Number(chapter), verseStart: start, verseEnd: end };
}

const CONTEXT_PAD = 4;

/** Resolve a reference to its CGKPV text, or null if the reference can't be parsed or the
 *  verse isn't in the data. Callers MUST gate on SCRIPTURE_POPOVER_ENABLED before calling —
 *  otherwise copyrighted verse text would reach the client. */
export function resolveReference(ref: string): ResolvedReference | null {
  const data = load();
  if (!data) return null;

  const parsed = parseRef(ref);
  if (!parsed) return null;

  const bookVi = data.abbrevIndex[norm(parsed.bookToken)];
  if (!bookVi) return null;

  const chapterMap = data.verses[bookVi]?.[String(parsed.chapter)];
  if (!chapterMap) return null;

  const pick = (from: number, to: number): ResolvedVerse[] => {
    const out: ResolvedVerse[] = [];
    for (let n = from; n <= to; n++) {
      const text = chapterMap[String(n)];
      if (text) out.push({ n, text });
    }
    return out;
  };

  const verses = pick(parsed.verseStart, parsed.verseEnd);
  if (verses.length === 0) return null;

  // Context window, clamped to verses that actually exist in the chapter.
  const chapterVerseNums = Object.keys(chapterMap).map(Number).filter(Number.isFinite);
  const maxVerse = chapterVerseNums.length ? Math.max(...chapterVerseNums) : parsed.verseEnd;
  const ctxStart = Math.max(1, parsed.verseStart - CONTEXT_PAD);
  const ctxEnd = Math.min(maxVerse, parsed.verseEnd + CONTEXT_PAD);
  const contextVerses = pick(ctxStart, ctxEnd);
  const context = `${parsed.bookToken} ${parsed.chapter},${ctxStart}–${ctxEnd}`;

  return {
    ref: ref.trim(),
    bookVi,
    chapter: parsed.chapter,
    verseStart: parsed.verseStart,
    verseEnd: parsed.verseEnd,
    verses,
    context,
    contextVerses,
    translation: data.translation,
  };
}

export interface EnrichedAnswer {
  html: string;
  data: Record<string, ResolvedReference>;
  /** Inline Catechism (GLHTCG) references, keyed by paragraph number. Always populated (the
   *  Catechism text is public — no licensing gate, unlike Scripture). */
  ccc?: Record<string, ResolvedCatechism>;
}

// An inline Catechism reference in prose: "GLHTCG 956" (with one or more spaces). Validated
// against the real paragraph index via resolveCatechism, so bad numbers are left untouched.
const CCC_CANDIDATE = /GLHTCG\s+(\d{1,4})/g;

// A Scripture-reference candidate: optional "1 " book prefix, a short book token, then
// "chapter,verse" (Vietnamese comma) or "chapter:verse" (English colon), with an optional
// "-verse" range. Deliberately loose — every candidate is validated against the real book index
// via resolveReference, so non-refs (e.g. "GLHTCG 1023" with no ",verse", "câu 3,16", or a time
// like "10:30" whose token isn't a book) are simply left untouched.
const REF_CANDIDATE = /(?<![\p{L}\d])((?:[1-3]\s)?[\p{L}]{1,4})\s(\d{1,3})\s*[,:]\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?(?![\d,:])/gu;

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/**
 * Turn recognized Scripture references inside answer HTML (from marked) into clickable
 * buttons carrying a `data-sref` key, and resolve each to its verse text. Only rewrites text
 * that resolves to a real CGKPV verse; leaves everything else — including references already
 * inside <a> links — exactly as-is.
 *
 * SERVER-ONLY (reads bible.json). Call only when SCRIPTURE_POPOVER_ENABLED is true.
 */
export function enrichAnswerHtml(html: string): EnrichedAnswer {
  const dataMap: Record<string, ResolvedReference> = {};
  let inAnchor = 0;

  // Split into tag / text tokens so replacement only touches visible text, never attributes.
  const tokens = html.split(/(<[^>]+>)/);
  const out = tokens.map((token, i) => {
    if (i % 2 === 1) {
      if (/^<a\b/i.test(token)) inAnchor += 1;
      else if (/^<\/a>/i.test(token)) inAnchor = Math.max(0, inAnchor - 1);
      return token;
    }
    if (inAnchor > 0) return token;

    return token.replace(REF_CANDIDATE, (match) => {
      const key = match.trim();
      const resolved = dataMap[key] ?? resolveReference(key);
      if (!resolved) return match;
      dataMap[key] = resolved;
      return `<button type="button" class="scripture-inline-ref" data-sref="${escapeAttr(key)}">${match}</button>`;
    });
  });

  return { html: out.join(''), data: dataMap };
}

/** Wrap inline Catechism references (GLHTCG NNN) in clickable buttons and collect their resolved
 *  paragraph text. Not gated — the Catechism is shown publicly in the reader already. */
function enrichCatechismHtml(html: string): { html: string; ccc: Record<string, ResolvedCatechism> } {
  const ccc: Record<string, ResolvedCatechism> = {};
  const tokens = html.split(/(<[^>]+>)/);
  const out = tokens.map((token, i) => {
    if (i % 2 === 1) return token; // an HTML tag — never touch attributes
    return token.replace(CCC_CANDIDATE, (match, num) => {
      const id = Number(num);
      const resolved = resolveCatechism(id);
      if (!resolved) return match;
      ccc[String(id)] = resolved;
      return `<button type="button" class="catechism-inline-ref" data-ccc="${id}">${match}</button>`;
    });
  });
  return { html: out.join(''), ccc };
}

/**
 * Enrichment for ANY content body that may cite the Catechism and/or Scripture — Giải Đáp answers,
 * Công Đồng / Giáo Phụ prose, Video blogs. Catechism (GLHTCG) references ALWAYS become clickable
 * (public text); Scripture references only when the CGKPV licensing flag is on. Render the result
 * with <ScriptureBody {...enrichReferences(html)} /> (or via <ScriptureBi2>). See CLAUDE.md.
 */
export function enrichReferences(html: string): EnrichedAnswer {
  const withCcc = enrichCatechismHtml(html);
  if (SCRIPTURE_POPOVER_ENABLED) {
    const withScripture = enrichAnswerHtml(withCcc.html);
    return { html: withScripture.html, data: withScripture.data, ccc: withCcc.ccc };
  }
  return { html: withCcc.html, data: {}, ccc: withCcc.ccc };
}

/** @deprecated Use enrichReferences — kept as an alias so existing callers keep working. */
export function enrichBody(html: string): EnrichedAnswer {
  return enrichReferences(html);
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Enrich a PLAIN-TEXT (non-markdown) string: escape it first, then enrich Catechism (always) +
 *  Scripture (flag-gated). Use for content stored as plain prose — e.g. Giáo Phụ / Công Đồng
 *  fields — where there's no markdown to parse, just paragraphs that may mention refs. */
export function enrichPlain(text: string): EnrichedAnswer {
  return enrichReferences(escapeHtml(text ?? ''));
}

/** Enrich both languages of a bilingual plain-text value, ready for <ScriptureBi2>. */
export function enrichBi(value: { vi: string; en: string } | null | undefined): {
  vi: EnrichedAnswer;
  en: EnrichedAnswer;
} {
  return { vi: enrichPlain(value?.vi ?? ''), en: enrichPlain(value?.en ?? '') };
}
