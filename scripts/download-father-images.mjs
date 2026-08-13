import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'images', 'church-fathers');
fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = 'HoiDapCongGiaoWebsite/1.0 (personal non-commercial project; contact via project owner)';

const FIGURES = [
  ['clement-of-rome', 'Clemens_Romanus.jpg'],
  ['ignatius-of-antioch', 'Hosios_Loukas_(south_west_chapel,_south_side)_-_Ignatios.jpg'],
  ['polycarp-of-smyrna', 'St_Polycarp-ApollinareNuovoRavenna.JPG'],
  ['justin-martyr', 'Saint_Justin_Martyr_by_Theophanes_the_Cretan.jpg'],
  ['irenaeus-of-lyons', 'Saint_Irenaeus_icon.jpg'],
  ['clement-of-alexandria', 'Clement_alexandrin.jpg'],
  ['tertullian', 'Tertullian.jpg'],
  ['hippolytus-of-rome', 'HippolytusStatue.JPG'],
  ['origen', 'Origen.jpg'],
  ['cyprian-of-carthage', 'Cyprian_von_Karthago2.jpg'],
  ['anthony-the-great', 'Saint_Anthony_the_Great_icon_(16th_century).jpg'],
  ['pachomius', 'StPakhom.jpg'],
  ['athanasius-of-alexandria', 'St._Athanasius_Icon_(10335730335).jpg'],
  ['ephrem-the-syrian', 'Ephrem_the_Syrian_(mosaic_in_Nea_Moni).jpg'],
  ['hilary-of-poitiers', 'Hilaryofpoitiers.jpg'],
  ['cyril-of-jerusalem', 'Saint_Cyril_of_Jerusalem.jpg'],
  ['gregory-of-nazianzus', 'Gregory_of_Nazianzus.jpg'],
  ['basil-of-caesarea', 'Basil_of_Caesarea.jpg'],
  ['gregory-of-nyssa', 'St._Gregory_of_Nyssa.jpg'],
  ['ambrose-of-milan', 'AmbroseOfMilan.jpg'],
  ['jerome', 'Saint_Jerome_Writing-Caravaggio_(1605-6).jpg'],
  ['john-chrysostom', 'Johnchrysostom.jpg'],
  ['augustine-of-hippo', 'Augustine_of_Hippo_Sandro_Botticelli.jpg'],
  ['john-cassian', 'Иоанн_Кассиан_Римлянин.jpg'],
  ['cyril-of-alexandria', 'Icon_St._Cyril_of_Alexandria.jpg'],
  ['leo-the-great', 'Mosaic_of_Saint_Pope_Leo_I_the_Great_at_the_Cappella_Palatina_in_Palermo.jpg'],
  ['gregory-the-great', 'Gregorythegreat.jpg'],
  ['isidore-of-seville', 'Isidore_de_Séville.jpg'],
  ['maximus-the-confessor', 'Maximus_the_Confessor.jpg'],
  ['john-of-damascus', 'John-of-Damascus_01.jpg'],
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
    if (attempt < 4) {
      await sleep(2000 * attempt);
      return getDirectUrl(fileTitle, attempt + 1);
    }
    throw new Error(`API failed for ${fileTitle}: HTTP ${res.status}, body starts: ${text.slice(0, 80)}`);
  }
  const json = JSON.parse(text);
  const page = json.query.pages[0];
  if (!page.imageinfo) throw new Error(`No imageinfo for ${fileTitle}`);
  return page.imageinfo[0];
}

async function downloadImage(url, outPathNoExt, attempt = 1) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const contentType = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());

  const isHtml = contentType.includes('html') || buf.subarray(0, 15).toString('utf-8').trim().startsWith('<!DOCTYPE');
  if (!res.ok || isHtml || buf.length < 5000) {
    if (attempt < 4) {
      await sleep(2500 * attempt);
      return downloadImage(url, outPathNoExt, attempt + 1);
    }
    throw new Error(`Bad image response (status ${res.status}, type ${contentType}, len ${buf.length})`);
  }

  const ext = contentType.includes('png') ? 'png' : contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : path.extname(new URL(url).pathname).slice(1) || 'jpg';
  const outPath = `${outPathNoExt}.${ext.toLowerCase()}`;
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
  await sleep(1200);
}

const failed = results.filter((r) => !r.ok);
console.log(`\nDone. ${results.length - failed.length}/${results.length} succeeded.`);
if (failed.length) {
  console.log('Failed:');
  failed.forEach((f) => console.log(`  - ${f.slug} (${f.fileTitle}): ${f.error}`));
}
