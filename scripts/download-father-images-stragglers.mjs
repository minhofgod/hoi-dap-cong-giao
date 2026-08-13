// Final pass for portraits still missing after the main retries kept hitting Wikimedia's 429.
// Difference from download-father-images-missing.mjs: fetches the ~900px THUMBNAIL, not the full
// original. Much smaller (≈100–250 KB vs multi-MB), which both suits a 184px portrait frame and
// is far less likely to trip the bandwidth throttle. Long, fixed spacing between files.
//
// Idempotent: only fetches slugs with no file on disk. Usage: node scripts/download-father-images-stragglers.mjs
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'church-fathers');
const UA = 'HoiDapCongGiaoWebsite/1.0 (personal non-commercial project; contact via project owner)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Same candidate filenames as the missing-set script.
const CANDIDATES = {
  'polycarp-of-smyrna': 'St_Polycarp-ApollinareNuovoRavenna.JPG',
  'irenaeus-of-lyons': 'Saint_Irenaeus_icon.jpg',
  'clement-of-alexandria': 'Clement_alexandrin.jpg',
  'tertullian': 'Tertullian.jpg',
  'hippolytus-of-rome': 'HippolytusStatue.JPG',
  'origen': 'Origen.jpg',
  'athanasius-of-alexandria': 'St._Athanasius_Icon_(10335730335).jpg',
  'gregory-of-nyssa': 'St._Gregory_of_Nyssa.jpg',
  'jerome': 'Saint_Jerome_Writing-Caravaggio_(1605-6).jpg',
  'augustine-of-hippo': 'Augustine_of_Hippo_Sandro_Botticelli.jpg',
  'john-cassian': 'Cassianus.jpg',
  'cyril-of-alexandria': 'Icon_St._Cyril_of_Alexandria.jpg',
  'leo-the-great': 'Mosaic_of_Saint_Pope_Leo_I_the_Great_at_the_Cappella_Palatina_in_Palermo.jpg',
  'gregory-the-great': 'Gregorythegreat.jpg',
  'isidore-of-seville': 'Isidore_de_Séville.jpg',
};

const hasPortrait = (slug) =>
  fs.existsSync(OUT_DIR) && fs.readdirSync(OUT_DIR).some((f) => f.replace(/\.[a-z]+$/i, '') === slug);

async function thumbUrl(fileTitle, attempt = 1) {
  const api =
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + fileTitle)}` +
    `&prop=imageinfo&iiprop=url|mime&iiurlwidth=900&format=json&formatversion=2`;
  const res = await fetch(api, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  const text = await res.text();
  if (res.status === 429 || !text.trim().startsWith('{')) {
    if (attempt < 6) { await sleep(8000 * attempt); return thumbUrl(fileTitle, attempt + 1); }
    throw new Error(`API 429 (HTTP ${res.status})`);
  }
  const page = JSON.parse(text).query.pages[0];
  if (!page.imageinfo) throw new Error('no imageinfo');
  return page.imageinfo[0].thumburl || page.imageinfo[0].url;
}

async function download(url, outNoExt, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const ct = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const isHtml = ct.includes('html') || buf.subarray(0, 15).toString('utf-8').trim().startsWith('<!DOCTYPE');
  if (res.status === 429 || !res.ok || isHtml || buf.length < 4000) {
    if (attempt < 6) { await sleep(10000 * attempt); return download(url, outNoExt, attempt + 1); }
    throw new Error(`image ${res.status} (${ct}, ${buf.length}B)`);
  }
  const ext = ct.includes('png') ? 'png' : 'jpg';
  fs.writeFileSync(`${outNoExt}.${ext}`, buf);
  return Math.round(buf.length / 1024);
}

const todo = Object.entries(CANDIDATES).filter(([slug]) => !hasPortrait(slug));
console.log(`${todo.length} still missing: ${todo.map(([s]) => s).join(', ') || '(none)'}`);

// Let Wikimedia's rate-limit window reset after the earlier aggressive passes before we touch it again.
const COOLDOWN_MS = 90000;
if (todo.length) {
  console.log(`Cooling down ${COOLDOWN_MS / 1000}s before starting…\n`);
  await sleep(COOLDOWN_MS);
}

let ok = 0;
for (const [slug, fileTitle] of todo) {
  try {
    const url = await thumbUrl(fileTitle);
    const kb = await download(url, path.join(OUT_DIR, slug));
    ok++;
    console.log(`OK   ${slug} (${kb} KB)`);
  } catch (e) {
    console.log(`FAIL ${slug}: ${e.message || e}`);
  }
  await sleep(12000); // long, polite gap between files to stay under the throttle
}
console.log(`\nDownloaded ${ok}/${todo.length}. Re-run: node scripts/migrate-giao-phu.mjs`);
