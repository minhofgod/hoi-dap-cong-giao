interface TitledRange {
  titleVi: string;
  paragraphRange: [number, number];
}

const ORDINAL_ROMAN: Record<string, string> = {
  'THỨ NHẤT': 'I',
  'THỨ HAI': 'II',
  'THỨ BA': 'III',
  'THỨ TƯ': 'IV',
};

const ORDINAL_WORD: Record<string, string> = {
  'THỨ NHẤT': 'thứ nhất',
  'THỨ HAI': 'thứ hai',
  'THỨ BA': 'thứ ba',
  'THỨ TƯ': 'thứ tư',
};

// Recurring proper nouns/titles that should stay capitalized when the surrounding source text
// is all-caps and gets sentence-cased. Not exhaustive — a handful of unusual titles may fall
// back to plain sentence case for a term not in this list, which is an acceptable approximation.
const PROPER_NOUNS = [
  'Đức Chúa Thánh Thần',
  'Chúa Thánh Thần',
  'Đức Chúa Trời',
  'Chúa Giêsu Kitô',
  'Con Một Thiên Chúa',
  'Hội Thánh Công Giáo',
  'Hội Thánh',
  'Thiên Chúa',
  'Đức Kitô',
  'Chúa Giêsu',
  'Kinh Lạy Cha',
  'Tin Mừng',
  'Phongxiô Philatô',
  'Ba Ngôi',
  'Thánh Kinh',
  'Đức Mẹ',
  'Maria',
  'Kitô Giáo',
  'Kitô hữu',
  'Kitô',
  'Chúa',
];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PROPER_NOUN_LOOKUP = new Map(PROPER_NOUNS.map((p) => [p.toLowerCase(), p]));
const PROPER_NOUN_RE = new RegExp(
  [...PROPER_NOUNS].sort((a, b) => b.length - a.length).map((p) => escapeRegExp(p.toLowerCase())).join('|'),
  'gu'
);

function applyProperNouns(lower: string): string {
  return lower.replace(PROPER_NOUN_RE, (m) => PROPER_NOUN_LOOKUP.get(m) ?? m);
}

function capFirstLetter(s: string): string {
  return s.replace(/^(\P{L}*)(\p{L})/u, (_, pre, ch) => pre + ch.toUpperCase());
}

function looksAllCaps(s: string): boolean {
  return /\p{Lu}/u.test(s) && !/\p{Ll}/u.test(s);
}

function toSentenceCase(raw: string): string {
  let s = applyProperNouns(raw.toLowerCase());
  s = capFirstLetter(s);
  // Each "· " introduces an independent clause (we only insert "·" between originally separate
  // quoted clauses), so its first letter should be capitalized too.
  s = s.replace(/· (\p{Ll})/gu, (_, c: string) => `· ${c.toUpperCase()}`);
  return s;
}

function toTitleCase(raw: string): string {
  const lower = applyProperNouns(raw.toLowerCase());
  return lower.split(' ').map(capFirstLetter).join(' ');
}

function stripTrailingRanges(s: string): string {
  return s
    .replace(/\s*\[\d+[-–]\d+\]\s*$/u, '')
    .replace(/\s*\(\d+[-–]\d+\)\s*$/u, '')
    .trim();
}

function fixQuoteDash(s: string): string {
  return s.replace(/”\s*-\s*“/gu, '” · “');
}

export interface TocLabel {
  numeral: string | null;
  levelWord: string | null;
  title: string;
  rangeCaption: string;
}

function detectLevelWord(label: string): string | null {
  if (/^CHƯƠNG\b/u.test(label)) return 'Chương';
  if (/^Mục\b/u.test(label)) return 'Mục';
  if (/^Tiết\b/u.test(label)) return 'Tiết';
  return null;
}

export function formatTocLabel(node: TitledRange): TocLabel {
  const raw = stripTrailingRanges(node.titleVi);
  const [start, end] = node.paragraphRange;
  const rangeText = start === end ? `${start}` : `${start}–${end}`;

  const ordinalMatch = raw.match(/^(PHẦN|ĐOẠN)\s+(THỨ\s+(?:NHẤT|HAI|BA|TƯ))\s*:\s*(.+)$/u);
  if (ordinalMatch) {
    const isPhan = ordinalMatch[1] === 'PHẦN';
    const ordinalKey = ordinalMatch[2].replace(/\s+/g, ' ');
    const numeral = ORDINAL_ROMAN[ordinalKey] ?? null;
    const rawTitle = fixQuoteDash(ordinalMatch[3].trim());
    const title = isPhan ? toTitleCase(rawTitle) : toSentenceCase(rawTitle);
    const rangeCaption = isPhan ? `Phần ${ORDINAL_WORD[ordinalKey] ?? ''} · ${rangeText}` : rangeText;
    return { numeral, levelWord: isPhan ? 'Phần' : 'Đoạn', title, rangeCaption };
  }

  const colonIdx = raw.indexOf(':');
  if (colonIdx > -1) {
    const label = raw.slice(0, colonIdx).trim();
    let title = fixQuoteDash(raw.slice(colonIdx + 1).trim());
    if (looksAllCaps(title)) title = toSentenceCase(title);
    const numeralMatch = label.match(/([IVXLCDM]+|\d+)\s*$/u);
    return { numeral: numeralMatch ? numeralMatch[1] : null, levelWord: detectLevelWord(label), title, rangeCaption: rangeText };
  }

  let title = fixQuoteDash(raw);
  if (looksAllCaps(title)) title = toSentenceCase(title);
  return { numeral: null, levelWord: null, title, rangeCaption: rangeText };
}
