import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'church-fathers');
const UA = 'HoiDapCongGiaoWebsite/1.0 (personal non-commercial project; contact via project owner)';

const FIGURES = [
  ['ignatius-of-antioch', 'Hosios_Loukas_(south_west_chapel,_south_side)_-_Ignatios.jpg'],
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getDirectUrl(fileTitle, attempt = 1) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    'File:' + fileTitle
  )}&prop=imageinfo&iiprop=url|mime&format=json&formatversion=2`;
  const res = await fetch(api, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  const text = await res.text();
  if (!res.ok || text.trim().startsWith('<')) {
    if (attempt < 6) {
      await sleep(8000 * attempt);
      return getDirectUrl(fileTitle, attempt + 1);
    }
    throw new Error(`API failed: HTTP ${res.status}`);
  }
  const json = JSON.parse(text);
  const page = json.query.pages[0];
  if (!page.imageinfo) throw new Error(`No imageinfo`);
  return page.imageinfo[0];
}

async function downloadImage(url, outPathNoExt, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const isHtml = contentType.includes('html') || buf.subarray(0, 15).toString('utf-8').trim().startsWith('<!DOCTYPE');

  if (!res.ok || isHtml || buf.length < 5000) {
    if (attempt < 6) {
      await sleep(8000 * attempt);
      return downloadImage(url, outPathNoExt, attempt + 1);
    }
    throw new Error(`Bad response (status ${res.status}, type ${contentType}, len ${buf.length})`);
  }

  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const outPath = `${outPathNoExt}.${ext}`;
  fs.writeFileSync(outPath, buf);
  return { outPath, sizeKB: Math.round(buf.length / 1024) };
}

const results = [];

for (const [slug, fileTitle] of FIGURES) {
  try {
    const info = await getDirectUrl(fileTitle);
    const { outPath, sizeKB } = await downloadImage(info.url, path.join(OUT_DIR, slug));
    results.push({ slug, ok: true, outPath, sizeKB });
    console.log(`OK   ${path.basename(outPath)}  (${sizeKB} KB)`);
  } catch (e) {
    results.push({ slug, fileTitle, ok: false, error: String(e.message || e) });
    console.log(`FAIL ${slug}: ${e.message || e}`);
  }
  await sleep(6000);
}

const failed = results.filter((r) => !r.ok);
console.log(`\nDone. ${results.length - failed.length}/${results.length} succeeded.`);
if (failed.length) {
  console.log('Still failed:');
  failed.forEach((f) => console.log(`  - ${f.slug} (${f.fileTitle}): ${f.error}`));
}
