// Builds content/bible.json from the CGKPV markdown vault.
//
// The Bible text lives OUTSIDE this repo (an Obsidian vault). This script parses
// every chapter file once and bakes a lookup table into content/bible.json, which
// IS committed. At runtime the app only reads that JSON — the vault is not needed.
//
// Re-run whenever the vault changes:
//   node scripts/build-bible.mjs
//   node scripts/build-bible.mjs "D:/path/to/CGKPV"   (override source path)
//
// Output shape (content/bible.json):
//   {
//     translation: "CGKPV",
//     books: { "Mátthêu": { order, testament, abbrevs: [...] }, ... },
//     abbrevIndex: { "mt": "Mátthêu", "matthew": "Mátthêu", ... },   // normalized keys
//     verses: { "Mátthêu": { "5": { "3": "Phúc thay...", ... } }, ... }
//   }

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_SOURCE = 'D:/Dropbox/Obsidian Vault/Bible/CGKPV';
const SOURCE = process.argv[2] || DEFAULT_SOURCE;
const OUT = path.join(process.cwd(), 'content', 'bible.json');

const TESTAMENTS = ['Cựu Ước', 'Tân Ước'];

// Canonical abbreviations, keyed by the book's frontmatter `book:` name. The vault's own aliases
// (full English name + Vietnamese abbrev) stay authoritative; these fill in the STANDARD SHORT
// forms (mostly English: Jn, Lk, Heb…) that the vault omits, so English references resolve too.
// Vietnamese abbreviations always win a clash — an English short form that collides with a
// Vietnamese one (e.g. English "Mk" for Mark vs Vietnamese "Mk" for Mikha) is skipped and logged.
const EXTRA_ABBREVS = {
  'Sáng Thế': ['Gen'],
  'Xuất Hành': ['Ex', 'Exod'],
  'Lêvi': ['Lev'],
  'Dân Số': ['Num'],
  'Đệ Nhị Luật': ['Deut'],
  'Giôsuê': ['Josh'],
  'Thủ Lãnh': ['Judg'],
  'Rút': ['Ru'],
  '1 Samuen': ['1 Sam'],
  '2 Samuen': ['2 Sam'],
  '1 Các Vua': ['1 Kgs', '1 Kings'],
  '2 Các Vua': ['2 Kgs', '2 Kings'],
  '1 Sử Biên': ['1 Chr', '1 Chron'],
  '2 Sử Biên': ['2 Chr', '2 Chron'],
  'Étra': ['Er', 'Ezr'], // Er = correct CGKPV abbrev; the wrong "Et" is removed below
  'Nơkhêmia': ['Neh'],
  'Tôbia': ['Tob'],
  'Giuđitha': ['Jdt'],
  'Étte': ['Esth', 'Est'],
  '1 Macabê': ['1 Macc', '1 Mac'],
  '2 Macabê': ['2 Macc', '2 Mac'],
  'Gióp': ['Job'],
  'Thánh Vịnh': ['Ps', 'Pss'],
  'Châm Ngôn': ['Prov'],
  'Giảng Viên': ['Eccl', 'Qoh'],
  'Diễm Ca': ['Song'],
  'Khôn Ngoan': ['Wis'],
  'Huấn Ca': ['Sir'],
  'Isaia': ['Isa'],
  'Giêrêmia': ['Jer'],
  'Ai Ca': ['Lam'],
  'Barúc': ['Bar'],
  'Êdêkien': ['Ezek', 'Ezk'],
  'Đanien': ['Dan'],
  'Hôsê': ['Hos'],
  'Giôen': ['Joel', 'Jl'],
  'Amốt': ['Amos'],
  'Ôvađia': ['Obad', 'Ob'],
  'Giôna': ['Jonah', 'Jon'],
  'Mikha': ['Mic'],
  'Nakhum': ['Nah'],
  'Khabacúc': ['Hab'],
  'Xôphônia': ['Zeph'],
  'Khácgai': ['Hag'],
  'Dacaria': ['Zech'],
  'Malakhi': ['Mal'],
  'Mátthêu': ['Mt'],
  'Máccô': ['Mk'],
  'Luca': ['Lk'],
  'Gioan': ['Jn'],
  'Công Vụ Tông Đồ': ['Acts'],
  'Rôma': ['Rom'],
  '1 Côrintô': ['1 Cor'],
  '2 Côrintô': ['2 Cor'],
  'Galát': ['Gal'],
  'Êphêsô': ['Eph'],
  'Philípphê': ['Phil', 'Php'],
  'Côlôxê': ['Col'],
  '1 Thêxalônica': ['1 Thess', '1 Thes'],
  '2 Thêxalônica': ['2 Thess', '2 Thes'],
  '1 Timôthê': ['1 Tim'],
  '2 Timôthê': ['2 Tim'],
  'Titô': ['Titus', 'Tit'],
  'Philêmon': ['Phlm', 'Phm'],
  'Do thái': ['Heb'],
  'Giacôbê': ['Jas'],
  '1 Phêrô': ['1 Pet', '1 Pt'],
  '2 Phêrô': ['2 Pet', '2 Pt'],
  '1 Gioan': ['1 Jn'],
  '2 Gioan': ['2 Jn'],
  '3 Gioan': ['3 Jn'],
  'Giuđa': ['Jude'],
  'Khải Huyền': ['Rev', 'Apoc'],
};

// Abbreviations to DROP from a book — data errors in the vault. "Et" is Esther (Étte); the vault
// mistakenly also gave it to Ezra (Étra), so the two collided. Ezra's correct abbrev is "Er".
const WRONG_ABBREVS = {
  'Étra': ['Et'],
};

/** Normalize an abbreviation/name for the lookup index: lowercase, collapse spaces,
 *  drop a trailing period ("Mt." -> "mt"). Keeps Vietnamese diacritics intact. */
function norm(s) {
  return s.trim().normalize('NFC').toLowerCase().replace(/\.$/, '').replace(/\s+/g, ' ');
}

/** Parse the verse bodies out of a chapter file body.
 *  Verses are marked `###### N`; the text runs until the next heading of any level.
 *  Section intertitles (`#### ...`, `##### ...`) are skipped, not folded into a verse. */
function parseVerses(body) {
  const lines = body.split(/\r?\n/);
  const verses = {};
  let current = null;
  let buffer = [];

  const flush = () => {
    if (current !== null) {
      // NFC-normalize: the vault mixes composed and combining diacritics, which is what
      // renders as artifacts (â´y, câ`m) and breaks Vietnamese search/sort downstream.
      const text = buffer.join(' ').replace(/\s+/g, ' ').trim().normalize('NFC');
      if (text) verses[current] = text;
    }
    buffer = [];
  };

  for (const line of lines) {
    const verseMatch = line.match(/^######\s+(\d+[a-z]?)\s*$/);
    if (verseMatch) {
      flush();
      current = verseMatch[1];
      continue;
    }
    // Any other heading ends the current verse and is itself skipped.
    if (/^#{1,6}\s/.test(line)) {
      flush();
      current = null;
      continue;
    }
    if (current !== null) buffer.push(line);
  }
  flush();
  return verses;
}

function build() {
  if (!fs.existsSync(SOURCE)) {
    // Not an error: the vault may simply be unavailable here (a CI/Vercel build, or Dropbox not
    // synced yet). Skip regeneration and keep any existing content/bible.json, so `npm run dev`
    // and production builds still succeed. Pass the vault path as an argument to override.
    console.warn(`build-bible: vault not found at "${SOURCE}" — skipping Bible regeneration.`);
    return;
  }

  const books = {};
  const abbrevIndex = {};
  const verses = {};
  let chapterCount = 0;
  let verseCount = 0;

  for (const testament of TESTAMENTS) {
    const testDir = path.join(SOURCE, testament);
    if (!fs.existsSync(testDir)) continue;

    for (const bookFolder of fs.readdirSync(testDir)) {
      const bookDir = path.join(testDir, bookFolder);
      if (!fs.statSync(bookDir).isDirectory()) continue;

      const orderMatch = bookFolder.match(/^(\d+)/);
      const order = orderMatch ? Number(orderMatch[1]) : 999;

      for (const file of fs.readdirSync(bookDir)) {
        if (!file.endsWith('.md')) continue;
        const raw = fs.readFileSync(path.join(bookDir, file), 'utf-8');
        const { data, content } = matter(raw);
        const book = data.book;
        const chapter = String(data.chapter);
        if (!book || data.chapter == null) continue;

        // Register the book with its vault aliases ("<abbrev> <chapter>" — strip the chapter
        // number). The abbreviation index is built after the loop so the canonical map can
        // supplement it and resolve collisions deterministically.
        if (!books[book]) {
          const vaultAbbrevs = [];
          for (const alias of data.aliases ?? []) {
            const ab = String(alias).replace(/\s+\d+[a-z]?$/, '').trim();
            if (ab && !vaultAbbrevs.includes(ab)) vaultAbbrevs.push(ab);
          }
          books[book] = { order, testament, vaultAbbrevs };
        }

        const chapterVerses = parseVerses(content);
        if (!verses[book]) verses[book] = {};
        verses[book][chapter] = chapterVerses;
        chapterCount += 1;
        verseCount += Object.keys(chapterVerses).length;
      }
    }
  }

  // Build the abbreviation index in two phases so Vietnamese/existing entries stay authoritative.
  // Phase 1 — core: the canonical book name + its vault aliases, minus any known-wrong ones.
  for (const [name, meta] of Object.entries(books)) {
    const wrong = new Set((WRONG_ABBREVS[name] ?? []).map(norm));
    meta.abbrevs = [];
    for (const key of [name, ...meta.vaultAbbrevs]) {
      if (wrong.has(norm(key))) continue;
      const k = norm(key);
      const owner = abbrevIndex[k];
      if (owner && owner !== name) {
        console.warn(`  ! core-abbrev collision "${key}": ${owner} vs ${name} (kept ${owner})`);
        continue;
      }
      abbrevIndex[k] = name;
      if (key !== name && !meta.abbrevs.includes(key)) meta.abbrevs.push(key);
    }
    delete meta.vaultAbbrevs;
  }

  // Phase 2 — canonical extras (standard short forms). Added only when the key is free, so a
  // Vietnamese abbreviation already claimed in phase 1 always wins the clash.
  const skipped = [];
  let added = 0;
  for (const [name, extras] of Object.entries(EXTRA_ABBREVS)) {
    if (!books[name]) {
      console.warn(`  ! EXTRA_ABBREVS has unknown book "${name}"`);
      continue;
    }
    for (const ab of extras) {
      const k = norm(ab);
      const owner = abbrevIndex[k];
      if (owner === name) continue; // already present via the vault
      if (owner) {
        skipped.push(`${ab} → wanted ${name}, taken by ${owner}`);
        continue;
      }
      abbrevIndex[k] = name;
      books[name].abbrevs.push(ab);
      added += 1;
    }
  }

  const out = { translation: 'CGKPV', books, abbrevIndex, verses };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out), 'utf-8');

  const bytes = fs.statSync(OUT).size;
  console.log(
    `Wrote ${OUT}\n` +
      `  books:    ${Object.keys(books).length}\n` +
      `  chapters: ${chapterCount}\n` +
      `  verses:   ${verseCount}\n` +
      `  size:     ${(bytes / 1024 / 1024).toFixed(2)} MB\n` +
      `  canonical abbrevs added: ${added}`,
  );
  if (skipped.length) {
    console.log(`  skipped (key already owned, Vietnamese wins):`);
    for (const s of skipped) console.log(`    - ${s}`);
  }
}

build();
