// One-off migration script: reads the old flat 30-figure Church Fathers dataset (EN + VI) plus
// the 5 markdown files with expanded `sections[]` content for figures 1-5, and writes one
// content/giao-phu/<slug>.json per figure matching the schema in HANDOFF-giao-phu.md section 9.
//
// Run: node scripts/migrate-giao-phu.mjs
//
// This script is intentionally a one-off (not wired into the build). Re-running it is safe and
// idempotent — it always regenerates all 30 files from the same sources.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'giao-phu');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'church-fathers');
const NOTES_DIR = 'D:\\Dropbox\\Claude\\Church Fathers\\Notes';

const en = JSON.parse(readFileSync(path.join(CONTENT_DIR, 'church-fathers.json'), 'utf8')).figures;
const vi = JSON.parse(readFileSync(path.join(CONTENT_DIR, 'church-fathers-vi.json'), 'utf8')).figures;
const viById = new Map(vi.map((f) => [f.id, f]));

// ---- slug logic, copied 1:1 from lib/churchFathers.ts so slugs/images stay stable ----
const COMBINING_MARKS = /[\u0300-\u036f]/g;
const SLUG_OVERRIDES = {
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
function slugifyText(text) {
  return text
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
function slugify(fullName, id) {
  if (SLUG_OVERRIDES[id]) return SLUG_OVERRIDES[id];
  return slugifyText(fullName.split('(')[0].trim());
}
function stripParen(name) {
  return name.split('(')[0].trim();
}
function parenContent(name) {
  const m = name.match(/\(([^)]+)\)\s*$/);
  return m ? m[1].trim() : stripParen(name);
}
// For the 9 figures whose EN full_name is recorded "Formal Latin Name (Common Name)" (the same
// ids SLUG_OVERRIDES exists for), the common English name people actually recognize is the
// parenthetical, not the leading text — e.g. "Aurelius Augustinus (Augustine of Hippo)" must
// display as "Augustine of Hippo", not "Aurelius Augustinus". The VI dataset writes these same
// figures in the opposite order (common name first, Latin/formal in parens), so VI keeps the
// normal stripParen() extraction.
function extractEnName(fullNameEn, id) {
  return SLUG_OVERRIDES[id] ? parenContent(fullNameEn) : stripParen(fullNameEn);
}

// ---- era mapping (HANDOFF section 4 exact id ranges) ----
function eraFor(id) {
  if (id >= 1 && id <= 4) return 'apostolic';
  if (id >= 5 && id <= 12) return 'ante-nicene';
  if (id >= 13 && id <= 20) return 'nicene';
  return 'post-nicene';
}

// ---- portrait metadata overrides ----
// Generic "Traditional portrait" is the fallback for images downloaded in bulk without per-image
// medium/date/source tracking. As images get sourced more carefully (or re-verified), add an
// entry here keyed by slug with the real medium/date and source page.
// `license` defaults to 'public domain' when omitted. For CC-licensed images the license MUST be
// set here AND the author credited in `source` (CC BY / BY-SA require attribution).
const PORTRAIT_META = {
  'ignatius-of-antioch': {
    medium: {
      vi: 'Tranh sơn dầu, trường phái Napoli, thế kỷ XVII (có thể của Cesare Fracanzano)',
      en: 'Oil painting, Neapolitan school, 17th century (possibly Cesare Fracanzano)',
    },
    source: 'Wikimedia Commons (Galleria Borghese)',
  },
  // --- CC-licensed images: author credited in source, real license set (not public domain) ---
  'irenaeus-of-lyons': {
    medium: { vi: 'Biểu tượng (icon)', en: 'Icon' },
    source: 'Wikimedia Commons / Ted',
    license: 'CC BY-SA 2.0',
  },
  'athanasius-of-alexandria': {
    medium: { vi: 'Biểu tượng (icon)', en: 'Icon' },
    source: 'Wikimedia Commons / Ted',
    license: 'CC BY-SA 2.0',
  },
  'cyril-of-alexandria': {
    medium: { vi: 'Biểu tượng (icon)', en: 'Icon' },
    source: 'Wikimedia Commons / Ted',
    license: 'CC BY-SA 2.0',
  },
  'leo-the-great': {
    medium: { vi: 'Tranh khảm, Cappella Palatina (Palermo)', en: 'Mosaic, Cappella Palatina, Palermo' },
    source: 'Wikimedia Commons',
    license: 'CC BY 4.0',
  },
};

// ---- image availability ----
const existingImages = new Set(
  readdirSync(IMAGES_DIR)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((f) => f.toLowerCase())
);
function findImage(slug) {
  for (const ext of ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG']) {
    const candidate = `${slug}.${ext}`;
    if (existingImages.has(candidate.toLowerCase())) {
      // Recover the real on-disk casing.
      const real = readdirSync(IMAGES_DIR).find((f) => f.toLowerCase() === candidate.toLowerCase());
      return real;
    }
  }
  return null;
}

// ---- date parsing ----
function parseYear(str) {
  // Prefer a 3-4 digit token (the year) over a 1-2 digit token (a day-of-month, e.g. the "13" in
  // "November 13, 354 AD"). Only fall back to 1-2 digits for 1st/2nd-century dates with no
  // day-month prefix at all, e.g. "c. 35 AD".
  const m4 = str.match(/\b\d{3,4}\b/);
  if (m4) return parseInt(m4[0], 10);
  const m2 = str.match(/\b\d{1,2}\b/);
  return m2 ? parseInt(m2[0], 10) : null;
}
function hasCirca(str) {
  return /\bc\.\s*/i.test(str);
}
function formatDatePart(str) {
  const year = parseYear(str);
  if (year === null) return str.trim();
  return hasCirca(str) ? `c. ${year}` : `${year}`;
}

// ---- martyr heuristic for the role line ----
const MARTYR_NEGATION = /not\s+(a\s+)?martyr|died\s+naturally|not\s+martyred/i;
const MARTYR_POSITIVE = /martyr|beheaded|burned|burnt|thrown\s+(to|into)|killed\s+by|executed|stoned|drowned|at\s+the\s+stake|wild\s+beasts/i;
function isMartyr(martyrdomEn) {
  return MARTYR_POSITIVE.test(martyrdomEn) && !MARTYR_NEGATION.test(martyrdomEn);
}

// ---- works: title/latin split + best-effort date from description ----
const LATIN_STOPWORDS = /\b(the|of|and|to|a|an|his|on|in|for|with|from)\b/i;
function looksLatin(s) {
  return !LATIN_STOPWORDS.test(s) && /^[A-Za-z][A-Za-z\s.]*$/.test(s);
}
function splitTitle(rawTitle) {
  const m = rawTitle.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { title: rawTitle.trim(), latin: '' };
  const [, main, paren] = m;
  if (looksLatin(paren)) return { title: main.trim(), latin: paren.trim() };
  return { title: rawTitle.trim(), latin: '' };
}
function bestEffortDate(description) {
  if (!description) return '';
  const m = description.match(/\bc\.?\s*\d{3,4}(?:[-–]\d{2,4})?\s*AD\b/i) || description.match(/\b\d{3,4}(?:[-–]\d{2,4})?\s*AD\b/);
  if (!m) return '';
  return m[0].replace(/\s+/g, ' ').replace(/AD$/i, '').trim().replace(/^c\.?/i, 'c.');
}

// ---- apologetics: topic -> natural question ----
function apologeticsQuestion(topic, shortName, { vi: isVi, canonized }) {
  if (isVi) {
    const who = canonized ? `Thánh ${shortName}` : shortName;
    return `${who} dạy gì về ${topic}?`;
  }
  return `What does ${shortName} teach about ${topic}?`;
}
function firstWord(name) {
  return name.split(/\s+/)[0];
}

// ---- facts ----
function buildFacts(f, vf) {
  const facts = [];
  facts.push({
    label: { vi: 'Sinh', en: 'Born' },
    value: { vi: vf.birth_year, en: f.birth_year },
  });
  facts.push({
    label: { vi: 'Qua đời', en: 'Died' },
    value: { vi: vf.death_year, en: f.death_year },
  });
  facts.push({
    label: { vi: 'Nơi hoạt động', en: 'Region / See' },
    value: { vi: vf.region_see, en: f.region_see },
  });
  if (f.feast_day) {
    facts.push({
      label: { vi: 'Lễ kính', en: 'Feast day' },
      value: { vi: vf.feast_day, en: f.feast_day },
    });
  }
  if (f.pope.is_pope === true) {
    facts.push({
      label: { vi: 'Giáo hoàng', en: 'Pope' },
      value: { vi: 'Có', en: 'Yes' },
    });
  }
  if (f.doctor_of_the_church) {
    facts.push({
      label: { vi: 'Tiến sĩ Hội Thánh', en: 'Doctor of the Church' },
      value: { vi: 'Có', en: 'Yes' },
    });
  }
  facts.push({
    label: { vi: 'Được phong thánh', en: 'Canonized' },
    value: f.canonized ? { vi: 'Có', en: 'Yes' } : { vi: 'Không', en: 'No' },
  });
  const workCount = f.key_writings.length;
  if (workCount > 0) {
    facts.push({
      label: { vi: 'Tác phẩm còn lại', en: 'Surviving works' },
      value: {
        vi: `${workCount} tác phẩm`,
        en: `${workCount} work${workCount === 1 ? '' : 's'}`,
      },
    });
  }
  return facts;
}

// ---- markdown section parser for figures 1-5 ----
const MD_FILES = {
  1: '01_Clement_of_Rome_Content.md',
  2: '02_Ignatius_of_Antioch_Content.md',
  3: '03_Polycarp_of_Smyrna_Content.md',
  4: '04_Justin_Martyr_Content.md',
  5: '05_Irenaeus_of_Lyons_Content.md',
  6: '06_Clement_of_Alexandria_Content.md',
  7: '07_Tertullian_Content.md',
  8: '08_Hippolytus_of_Rome_Content.md',
  9: '09_Origen_Content.md',
  10: '10_Cyprian_of_Carthage_Content.md',
  11: '11_Anthony_the_Great_Content.md',
  12: '12_Pachomius_Content.md',
  13: '13_Athanasius_of_Alexandria_Content.md',
  14: '14_Ephrem_the_Syrian_Content.md',
  15: '15_Hilary_of_Poitiers_Content.md',
  16: '16_Cyril_of_Jerusalem_Content.md',
  17: '17_Gregory_of_Nazianzus_Content.md',
  18: '18_Basil_the_Great_Content.md',
  19: '19_Gregory_of_Nyssa_Content.md',
  20: '20_Ambrose_of_Milan_Content.md',
  21: '21_Jerome_Content.md',
  22: '22_John_Chrysostom_Content.md',
  23: '23_Augustine_of_Hippo_Content.md',
  24: '24_John_Cassian_Content.md',
  25: '25_Cyril_of_Alexandria_Content.md',
  26: '26_Leo_the_Great_Content.md',
  27: '27_Gregory_the_Great_Content.md',
  28: '28_Isidore_of_Seville_Content.md',
  29: '29_Maximus_the_Confessor_Content.md',
  30: '30_John_of_Damascus_Content.md',
};

function parseSections(id) {
  const filename = MD_FILES[id];
  if (!filename) return [];
  const filePath = path.join(NOTES_DIR, filename);
  if (!existsSync(filePath)) {
    console.warn(`  WARNING: expected markdown file not found for id ${id}: ${filePath}`);
    return [];
  }
  const text = readFileSync(filePath, 'utf8');
  const startIdx = text.indexOf('## Expanded content');
  if (startIdx === -1) {
    console.warn(`  WARNING: no "## Expanded content" heading found in ${filename}`);
    return [];
  }
  const body = text.slice(startIdx);
  // Split on "### N. Title / VietnameseTitle" headings.
  const headingRe = /^### \d+\.\s*(.+?)\s*\/\s*(.+?)\s*$/gm;
  const matches = [...body.matchAll(headingRe)];
  const sections = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const titleEn = m[1].trim();
    const titleVi = m[2].trim();
    const sectionStart = m.index + m[0].length;
    const sectionEnd = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const chunk = body.slice(sectionStart, sectionEnd);

    const idMatch = chunk.match(/`id:\s*"([^"]+)"`/);
    const sectionId = idMatch ? idMatch[1] : slugifyText(titleEn);

    // Body text: the **EN:** paragraph and **VI:** paragraph, each running until the next
    // **EN:**/**VI:** marker or a line starting with "*Verified" (a human-only research note
    // that must be stripped from site content) or the end of the chunk.
    const enMatch = chunk.match(/\*\*EN:\*\*\s*([\s\S]*?)(?=\n\*\*VI:\*\*|\n\*Verified|\n### |$)/);
    const viMatch = chunk.match(/\*\*VI:\*\*\s*([\s\S]*?)(?=\n\*\*EN:\*\*|\n\*Verified|\n### |$)/);

    const clean = (s) =>
      (s || '')
        // Strip markdown emphasis (**bold**, *italic*) — the source notes use it for book
        // titles and emphasis, but the profile page renders these as plain prose, not markdown.
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();

    sections.push({
      id: sectionId,
      title: { vi: titleVi, en: titleEn },
      body: { vi: clean(viMatch?.[1]), en: clean(enMatch?.[1]) },
      open: false,
    });
  }
  return sections;
}

// ---- build one figure ----
function buildFigure(f) {
  const vf = viById.get(f.id);
  if (!vf) throw new Error(`No VI record for id ${f.id}`);

  const slug = slugify(f.full_name, f.id);
  const nameEn = extractEnName(f.full_name, f.id);
  const nameVi = stripParen(vf.full_name);
  const shortEn = firstWord(nameEn);
  const shortVi = firstWord(nameVi);

  const martyr = isMartyr(f.martyrdom);
  const roleEn = martyr && !/martyr/i.test(f.role) ? `${f.role} · Martyr` : f.role;
  const roleVi = martyr && !/tử đạo/i.test(vf.role) ? `${vf.role} · Tử đạo` : vf.role;

  const bornYear = parseYear(f.birth_year);
  const diedYear = parseYear(f.death_year);
  const displayDate = `${formatDatePart(f.birth_year)} — ${formatDatePart(f.death_year)}`;

  const works = f.key_writings.map((w, i) => {
    const { title: titleEn, latin } = splitTitle(w.title);
    const viWriting = vf.key_writings[i];
    const { title: titleVi } = viWriting ? splitTitle(viWriting.title) : { title: w.title };
    return {
      title: { vi: titleVi, en: titleEn },
      latin,
      date: bestEffortDate(w.description),
    };
  });

  const apologetics = f.apologetics_corner.map((a, i) => {
    const viA = vf.apologetics_corner[i] ?? a;
    return {
      q: {
        vi: apologeticsQuestion(viA.topic, shortVi, { vi: true, canonized: f.canonized }),
        en: apologeticsQuestion(a.topic, shortEn, { vi: false, canonized: f.canonized }),
      },
      a: { vi: viA.text, en: a.text },
    };
  });

  const image = findImage(slug);

  return {
    no: f.id,
    slug,
    era: eraFor(f.id),
    name: { vi: nameVi, en: nameEn },
    role: { vi: roleVi, en: roleEn },
    dates: { display: displayDate, born: bornYear, died: diedYear },
    quote: {
      vi: vf.key_quote.text,
      en: f.key_quote.text,
      source: { vi: vf.key_quote.citation, en: f.key_quote.citation },
    },
    life: [
      { vi: vf.lineage, en: f.lineage },
      { vi: vf.known_for, en: f.known_for },
    ],
    facts: buildFacts(f, vf),
    works,
    works_note: { vi: '', en: '' },
    sections: parseSections(f.id),
    apologetics,
    ccc_refs: [],
    portrait: image
      ? {
          src: `/images/church-fathers/${image}`,
          medium: PORTRAIT_META[slug]?.medium ?? { vi: 'Chân dung truyền thống', en: 'Traditional portrait' },
          source: PORTRAIT_META[slug]?.source ?? 'Wikimedia Commons',
          license: PORTRAIT_META[slug]?.license ?? 'public domain',
          available: true,
        }
      : {
          src: '',
          medium: { vi: '', en: '' },
          source: '',
          license: '',
          available: false,
        },
  };
}

// ---- run ----
const results = en
  .slice()
  .sort((a, b) => a.id - b.id)
  .map(buildFigure);

let warnings = 0;
for (const fig of results) {
  for (const [key, val] of Object.entries(fig)) {
    if (val && typeof val === 'object' && 'vi' in val && 'en' in val) {
      if (!val.vi || !val.en) {
        console.warn(`  WARNING: ${fig.slug} field "${key}" missing a language: vi="${val.vi}" en="${val.en}"`);
        warnings++;
      }
    }
  }
  const outPath = path.join(CONTENT_DIR, `${fig.slug}.json`);
  writeFileSync(outPath, JSON.stringify(fig, null, 2).normalize('NFC') + '\n', 'utf8');
  console.log(`wrote ${fig.slug}.json (no. ${fig.no}, era: ${fig.era}, portrait: ${fig.portrait.available}, sections: ${fig.sections.length})`);
}

console.log(`\nDone. ${results.length} files written, ${warnings} field-level language-pair warnings.`);
