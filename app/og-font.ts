// Load a SUBSETTED Google font (only the glyphs in `text`, via `&text=`) as an ArrayBuffer for
// next/og ImageResponse, so Vietnamese diacritics render. An old-UA-style `format('truetype')` is
// what Satori can consume. Returns null on any failure so a flaky build still produces an image
// (Latin fallback) rather than failing the build. Shared by opengraph-image + apple-icon.
export async function loadBrandFont(text: string): Promise<ArrayBuffer | null> {
  const url = `https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&text=${encodeURIComponent(text)}`;
  try {
    const css = await (await fetch(url)).text();
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (match) {
      const res = await fetch(match[1]);
      if (res.ok) return await res.arrayBuffer();
    }
  } catch {
    // fall through to null
  }
  return null;
}
