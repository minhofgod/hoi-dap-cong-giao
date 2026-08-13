// Builds a single contact-sheet HTML page previewing the 15 missing Church Father portraits,
// pulling thumbnails straight from Wikimedia Commons (API only — no heavy aggregator pages).
// Output: public/portrait-preview.html  (served by `next dev` at /portrait-preview.html)
import fs from 'node:fs';
import path from 'node:path';

const UA = 'HoiDapCongGiaoWebsite/1.0 (personal non-commercial project; contact via project owner)';
const stripHtml = (s) => (s ? String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MISSING = [
  ['polycarp-of-smyrna', 'Polycarp of Smyrna', 'St_Polycarp-ApollinareNuovoRavenna.JPG'],
  ['irenaeus-of-lyons', 'Irenaeus of Lyons', 'Saint_Irenaeus_icon.jpg'],
  ['clement-of-alexandria', 'Clement of Alexandria', 'Clement_alexandrin.jpg'],
  ['tertullian', 'Tertullian', 'Tertullian.jpg'],
  ['hippolytus-of-rome', 'Hippolytus of Rome', 'HippolytusStatue.JPG'],
  ['origen', 'Origen', 'Origen.jpg'],
  ['athanasius-of-alexandria', 'Athanasius of Alexandria', 'St._Athanasius_Icon_(10335730335).jpg'],
  ['gregory-of-nyssa', 'Gregory of Nyssa', 'St._Gregory_of_Nyssa.jpg'],
  ['jerome', 'Jerome', 'Saint_Jerome_Writing-Caravaggio_(1605-6).jpg'],
  ['augustine-of-hippo', 'Augustine of Hippo', 'Augustine_of_Hippo_Sandro_Botticelli.jpg'],
  ['john-cassian', 'John Cassian', 'Иoанн_Кассиан_Римлянин.jpg'.normalize()],
  ['cyril-of-alexandria', 'Cyril of Alexandria', 'Icon_St._Cyril_of_Alexandria.jpg'],
  ['leo-the-great', 'Leo the Great', 'Mosaic_of_Saint_Pope_Leo_I_the_Great_at_the_Cappella_Palatina_in_Palermo.jpg'],
  ['gregory-the-great', 'Gregory the Great', 'Gregorythegreat.jpg'],
  ['isidore-of-seville', 'Isidore of Seville', 'Isidore_de_Séville.jpg'],
];

async function info(fileTitle, attempt = 1) {
  const api =
    `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + fileTitle)}` +
    `&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=360&format=json&formatversion=2`;
  const res = await fetch(api, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  const text = await res.text();
  if (res.status === 429 || !text.trim().startsWith('{')) {
    if (attempt < 6) {
      await sleep(6000 * attempt); // 6s,12s,18s,24s,30s
      return info(fileTitle, attempt + 1);
    }
    throw new Error(`rate-limited (HTTP ${res.status})`);
  }
  const page = JSON.parse(text).query.pages[0];
  if (!page.imageinfo) throw new Error('no imageinfo');
  const ii = page.imageinfo[0];
  const m = ii.extmetadata || {};
  return {
    thumb: ii.thumburl || ii.url,
    page: ii.descriptionurl,
    license: stripHtml(m.LicenseShortName?.value) || '(unknown)',
    artist: stripHtml(m.Artist?.value) || '(unknown)',
  };
}

const cards = [];
for (const [slug, name, fileTitle] of MISSING) {
  try {
    const d = await info(fileTitle);
    cards.push({ slug, name, fileTitle, ...d });
    console.log(`ok ${slug}`);
  } catch (e) {
    cards.push({ slug, name, fileTitle, thumb: '', page: '#', license: 'ERROR', artist: String(e.message || e) });
    console.log(`FAIL ${slug}: ${e.message || e}`);
  }
  await sleep(1500);
}

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Xem trước chân dung Giáo Phụ (15 còn thiếu)</title>
<style>
  body{font-family:system-ui,sans-serif;margin:0;padding:24px;background:#f7f2ea;color:#2b2620}
  h1{font-size:20px;margin:0 0 4px}
  p.sub{margin:0 0 20px;color:#7a7168}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
  .card{background:#fff;border:1px solid #e4d9c8;border-radius:10px;overflow:hidden;display:flex;flex-direction:column}
  .imgwrap{aspect-ratio:1/1;background:#efe7db;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .imgwrap img{width:100%;height:100%;object-fit:cover}
  .body{padding:10px 12px;font-size:13px}
  .name{font-weight:600;margin-bottom:2px}
  .meta{color:#7a7168;font-size:11.5px;line-height:1.35}
  .lic{display:inline-block;margin-top:6px;font-size:11px;padding:2px 7px;border-radius:20px;background:#eef3ea;color:#3f6b3a}
  a{color:#9a6b2f;text-decoration:none}
</style></head><body>
<h1>Xem trước 15 chân dung Giáo Phụ còn thiếu</h1>
<p class="sub">Nguồn: Wikimedia Commons. Bấm tên tệp để mở trang gốc. Tất cả đều giấy phép tự do (PD / CC).</p>
<div class="grid">
${cards
  .map(
    (c) => `<div class="card">
  <div class="imgwrap">${c.thumb ? `<img src="${c.thumb}" alt="${c.name}" loading="lazy">` : '—'}</div>
  <div class="body">
    <div class="name">${c.name}</div>
    <div class="meta">Họa sĩ/nguồn: ${c.artist}<br><a href="${c.page}" target="_blank">${c.fileTitle}</a></div>
    <span class="lic">${c.license}</span>
  </div>
</div>`
  )
  .join('\n')}
</div></body></html>`;

const out = path.join(process.cwd(), 'public', 'portrait-preview.html');
fs.writeFileSync(out, html);
console.log(`\nWrote ${out}`);
