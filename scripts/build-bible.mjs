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
    console.error(`Source folder not found: ${SOURCE}`);
    process.exit(1);
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

        // Register the book + its abbreviations (derived from `aliases`, which are
        // "<abbrev> <chapter>" — strip the trailing chapter number to get the abbrev).
        if (!books[book]) {
          const abbrevs = [];
          for (const alias of data.aliases ?? []) {
            const ab = String(alias).replace(/\s+\d+[a-z]?$/, '').trim();
            if (ab && !abbrevs.includes(ab)) abbrevs.push(ab);
          }
          books[book] = { order, testament, abbrevs };
          // Index every abbrev + the full book name -> canonical book name.
          for (const key of [book, ...abbrevs]) abbrevIndex[norm(key)] = book;
        }

        const chapterVerses = parseVerses(content);
        if (!verses[book]) verses[book] = {};
        verses[book][chapter] = chapterVerses;
        chapterCount += 1;
        verseCount += Object.keys(chapterVerses).length;
      }
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
      `  size:     ${(bytes / 1024 / 1024).toFixed(2)} MB`,
  );
}

build();
