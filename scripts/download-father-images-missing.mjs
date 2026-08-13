// Browser-free retry for the 15 Church Father portraits that hit HTTP 429 on the first pass.
// - Only fetches figures missing from public/images/church-fathers/ (idempotent; safe to re-run).
// - Pulls Commons `extmetadata` so licensing is verified via the API, never by opening a page.
// - Conservative pacing + 429-aware backoff to stay well under Wikimedia's rate limits.
//
// Usage:
//   node scripts/download-father-images-missing.mjs            # verify licensing + download free images
//   node scripts/download-father-images-missing.mjs --dry-run  # verify licensing only, download nothing
import fs from 'node:fs';
import path from 'node:path';

const DRY_RUN = process.argv.includes('--dry-run');
const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'church-fathers');
fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'HoiDapCongGiaoWebsite/1.0 (personal non-commercial project; contact via project owner)';

// Candidate Commons filenames carried over from download-father-images.mjs (the 15 that 429'd).
const MISSING = [
  ['polycarp-of-smyrna', 'St_Polycarp-ApollinareNuovoRavenna.JPG'],
  ['irenaeus-of-lyons', 'Saint_Irenaeus_icon.jpg'],
  ['clement-of-alexandria', 'Clement_alexandrin.jpg'],
  ['tertullian', 'Tertullian.jpg'],
  ['hippolytus-of-rome', 'HippolytusStatue.JPG'],
  ['origen', 'Origen.jpg'],
  ['athanasius-of-alexandria', 'St._Athanasius_Icon_(10335730335).jpg'],
  ['gregory-of-nyssa', 'St._Gregory_of_Nyssa.jpg'],
  ['jerome', 'Saint_Jerome_Writing-Caravaggio_(1605-6).jpg'],
  ['augustine-of-hippo', 'Augustine_of_Hippo_Sandro_Botticelli.jpg'],
  ['john-cassian', 'Иоанн_Кассиан_Римлянин.jpg'],
  ['cyril-of-alexandria', 'Icon_St._Cyril_of_Alexandria.jpg'],
  ['leo-the-great', 'Mosaic_of_Saint_Pope_Leo_I_the_Great_at_the_Cappella_Palatina_in_Palermo.jpg'],
  ['gregory-the-great', 'Gregorythegreat.jpg'],
  ['isidore-of-seville', 'Isidore_de_Séville.jpg'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stripHtml = (s) => (s ? String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '');

// A license string we treat as safe to host. Anything else is flagged for manual review, not downloaded.
function isFreeLicense(licenseShortName) {
  const l = (licenseShortName || '').toLowerCase();
  return l.includes('public domain') || l.startsWith('cc0') || l.startsWith('cc by') || l.startsWith('cc-by');
}

async function commonsImageInfo(fileTitle, attempt = 1) {
  const api =
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + fileTitle)}` +
    `&prop=imageinfo&iiprop=url|mime|extmetadata&format=json&formatversion=2`;
  const res = await fetch(api, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  const text = await res.text();
  if (res.status === 429 || !res.ok || text.trim().startsWith('<')) {
    if (attempt < 5) {
      await sleep(5000 * attempt); // linear backoff: 5s, 10s, 15s, 20s
      return commonsImageInfo(fileTitle, attempt + 1);
    }
    throw new Error(`API failed (HTTP ${res.status})`);
  }
  const page = JSON.parse(text).query.pages[0];
  if (!page.imageinfo) throw new Error('no imageinfo (file may be renamed/deleted)');
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  return {
    url: info.url,
    license: stripHtml(meta.LicenseShortName?.value) || '(unknown)',
    artist: stripHtml(meta.Artist?.value) || '(unknown)',
    credit: stripHtml(meta.Credit?.value),
  };
}

async function downloadImage(url, outPathNoExt, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const isHtml = contentType.includes('html') || buf.subarray(0, 15).toString('utf-8').trim().startsWith('<!DOCTYPE');
  if (res.status === 429 || !res.ok || isHtml || buf.length < 5000) {
    if (attempt < 5) {
      await sleep(5000 * attempt);
      return downloadImage(url, outPathNoExt, attempt + 1);
    }
    throw new Error(`bad image response (HTTP ${res.status}, ${contentType}, ${buf.length}B)`);
  }
  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const outPath = `${outPathNoExt}.${ext}`;
  fs.writeFileSync(outPath, buf);
  return { outPath, sizeKB: Math.round(buf.length / 1024) };
}

const hasPortrait = (slug) =>
  fs.readdirSync(OUT_DIR).some((f) => f.replace(/\.[a-z]+$/i, '') === slug);

const done = [];
const flagged = [];

for (const [slug, fileTitle] of MISSING) {
  if (hasPortrait(slug)) {
    console.log(`SKIP ${slug} — already has a portrait`);
    continue;
  }
  try {
    const info = await commonsImageInfo(fileTitle);
    const free = isFreeLicense(info.license);
    console.log(`\n${slug}`);
    console.log(`  file:    ${fileTitle}`);
    console.log(`  license: ${info.license}  ${free ? '✅ free' : '⚠️ REVIEW'}`);
    console.log(`  artist:  ${info.artist}`);

    if (!free) {
      flagged.push({ slug, fileTitle, license: info.license });
      console.log('  → not clearly free; skipping download, flagged for manual review');
    } else if (DRY_RUN) {
      console.log('  → dry-run, not downloading');
    } else {
      const { outPath, sizeKB } = await downloadImage(info.url, path.join(OUT_DIR, slug));
      done.push({ slug, sizeKB });
      console.log(`  → downloaded ${path.basename(outPath)} (${sizeKB} KB)`);
    }
  } catch (e) {
    flagged.push({ slug, fileTitle, error: String(e.message || e) });
    console.log(`FAIL ${slug}: ${e.message || e}`);
  }
  await sleep(3000); // gentle spacing between figures
}

console.log(`\n──────────\nDownloaded: ${done.length}   Flagged/failed: ${flagged.length}`);
if (flagged.length) flagged.forEach((f) => console.log(`  - ${f.slug}: ${f.license ? 'license ' + f.license : f.error}`));
console.log('\nAfter downloading, re-run: node scripts/migrate-giao-phu.mjs   (regenerates content JSON with portrait:true)');
