// Guard: every published Q&A + video must carry a valid `category` and at least one valid `tag`.
//
// Why this exists: the /dong-hanh companion (and the /giai-dap filters + search) match content by
// taxonomy. A file with a missing/empty `tags` scores 0 and is INVISIBLE to the companion; a typo'd
// id silently won't match. This fails the build before such a file can ship. See
// docs/content-guide.md "How new content reaches the companion".
//
// Run:  node scripts/check-tags.mjs
// Exits 1 (with a report) if anything is missing/empty/unknown; 0 if all clean.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- valid ids, extracted from the single source of truth ---------------------------------------
const taxo = readFileSync(join(root, 'lib/giaiDapTaxonomy.ts'), 'utf8');
const idsIn = (constName) => {
  const start = taxo.indexOf(`export const ${constName}`);
  if (start === -1) return new Set();
  const end = taxo.indexOf('] as const', start);
  const block = taxo.slice(start, end === -1 ? undefined : end);
  return new Set([...block.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]));
};
const CATEGORIES = idsIn('CATEGORIES');
const TAGS = idsIn('TAGS');
if (!CATEGORIES.size || !TAGS.size) {
  console.error('check-tags: could not parse CATEGORIES/TAGS from lib/giaiDapTaxonomy.ts');
  process.exit(2);
}

// --- tiny frontmatter reader (no deps) ----------------------------------------------------------
function frontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end);
}
function readField(fm, key) {
  // inline array:  tags: ["a", "b"]   |   scalar:  category: "x"  or  category: x
  const line = fm.split('\n').find((l) => new RegExp(`^${key}:`).test(l.trim()) || new RegExp(`^${key}:`).test(l));
  if (!line) return { present: false, values: [] };
  const raw = line.slice(line.indexOf(':') + 1).trim();
  if (raw.startsWith('[')) {
    const values = [...raw.matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
    return { present: true, values };
  }
  const scalar = raw.replace(/^["']|["']$/g, '').trim();
  return { present: true, values: scalar ? [scalar] : [] };
}

// --- what to check ------------------------------------------------------------------------------
const targets = [
  { dir: 'content/giai-dap', label: 'Q&A' },
  { dir: 'content/video', label: 'video' },
];

const problems = [];
let checked = 0;
let sufferingCount = 0; // pastoral-content proxy — drives the deferred `consolation`-tag reminder below

for (const { dir, label } of targets) {
  const abs = join(root, dir);
  if (!existsSync(abs)) continue;
  for (const file of readdirSync(abs)) {
    if (!file.endsWith('.md')) continue; // skips EXAMPLE.md.txt
    if (file.endsWith('.en.md')) continue; // English sidecars inherit taxonomy from the main file
    checked++;
    const fm = frontmatter(readFileSync(join(abs, file), 'utf8'));
    const rel = `${dir}/${file}`;
    if (!fm) { problems.push([rel, 'no frontmatter']); continue; }

    const cat = readField(fm, 'category');
    if (!cat.present || cat.values.length === 0) problems.push([rel, 'missing category']);
    else if (!CATEGORIES.has(cat.values[0])) problems.push([rel, `unknown category "${cat.values[0]}"`]);

    const tags = readField(fm, 'tags');
    if (!tags.present || tags.values.length === 0) problems.push([rel, 'missing/empty tags']);
    else {
      const bad = tags.values.filter((t) => !TAGS.has(t));
      if (bad.length) problems.push([rel, `unknown tag(s): ${bad.join(', ')}`]);
    }
    if (dir === 'content/giai-dap' && tags.values.includes('suffering')) sufferingCount++;
  }
}

// --- deferred triggers: nudge the owner when a parked action's condition is met ------------------
// From docs/companion-audit-handoff.md ("→ Session 2"). Each fires only while its trigger holds AND
// the action is still undone — so it self-clears once the work lands. Not a failure; just a reminder.
const reminders = [];
// `consolation` tag (Session 2): planned once enough pastoral content exists to carry it. Proxy =
// number of Q&As tagged `suffering`. Self-clears once `consolation` is added to lib/giaiDapTaxonomy.ts.
const CONSOLATION_THRESHOLD = 4;
if (!TAGS.has('consolation') && sufferingCount >= CONSOLATION_THRESHOLD) {
  reminders.push(
    `${sufferingCount} Q&As are now tagged \`suffering\` — likely enough pastoral content to add the \`consolation\` tag.\n` +
    `      → Send the "→ Session 2" note in docs/companion-audit-handoff.md. (This reminder self-clears once \`consolation\` exists.)`,
  );
}

if (problems.length) {
  console.error(`\ncheck-tags: ${problems.length} problem(s) in ${checked} file(s):\n`);
  for (const [file, why] of problems) console.error(`  ✗ ${file} — ${why}`);
  console.error(`\nFix: add a valid category + ≥1 tag from lib/giaiDapTaxonomy.ts (add the id there first if it's new).\n`);
  process.exit(1);
}
console.log(`check-tags: ✓ all ${checked} Q&A/video files have a valid category + tags.`);
if (reminders.length) {
  console.log(`\ncheck-tags: ⏰ ${reminders.length} deferred reminder(s):`);
  for (const r of reminders) console.log(`  • ${r}`);
}
