import { ImageResponse } from 'next/og';
import { loadBrandFont } from '../../og-font';
import { getQuestionBySlug } from '@/lib/giaiDap';

// Per-Q&A social share card (Facebook / Zalo / Twitter). File-based convention: Next wires this into
// og:image + twitter:image for /giai-dap/<slug>, resolved absolute via metadataBase (lib/siteUrl.ts).
// Content-first (the QUESTION is the hero), vs the brand-first global card (app/opengraph-image.tsx).
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand tokens (must match the global card).
const BG = '#FBF8F3';
const ACCENT = '#C67139';
const HEADING = '#201E1D';
const MUTED = '#5C554E';
const MARK = 'HĐ'; // monogram, drawn as text (Satori has no reliable inline-SVG)
const TITLE = 'Hỏi Đáp Công Giáo';

// Truncate to `max` chars at a word boundary (…), so a long question never overflows the canvas.
function clamp(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}

// Step the hero font size down (and cap the length) as the question grows, so it stays within ~4
// lines of the 630px canvas at every length.
function heroLayout(q: string): { text: string; fontSize: number } {
  if (q.length <= 55) return { text: q, fontSize: 62 };
  if (q.length <= 95) return { text: q, fontSize: 52 };
  if (q.length <= 145) return { text: clamp(q, 150), fontSize: 46 };
  return { text: clamp(q, 180), fontSize: 42 };
}

// Per-image alt = the question itself (the accessible description platforms read), not the site alt.
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);
  return [{ id: 'q', alt: q?.questionVi ?? TITLE, size, contentType }];
}

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = getQuestionBySlug(slug);

  const question = q?.questionVi ?? TITLE;
  const topic = (q?.topic ?? '').toUpperCase(); // uppercase in JS (not CSS) so the subset carries the
  // actual glyphs — CSS text-transform would render uppercase glyphs the font subset never requested.
  const hero = heroLayout(question);

  // PITFALL: font subsetting. loadBrandFont(text) returns only the glyphs in `text`; anything shown
  // but not passed renders as tofu. Pass every visible string — hero (already clamped), the uppercased
  // topic, the brand + monogram — plus the punctuation the card can add (…, ·, dashes, curly quotes).
  const subset = `${hero.text}${topic}${TITLE}${MARK}…·—–“”‘’"'`;
  const fontData = await loadBrandFont(subset);
  const fonts = fontData
    ? [{ name: 'brand', data: fontData, style: 'normal' as const, weight: 600 as const }]
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG,
          fontFamily: 'brand',
          padding: '76px 80px',
        }}
      >
        {/* Top: eyebrow (topic) + hero (question), left-aligned. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topic && (
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: 1.5,
                color: MUTED,
                marginBottom: 26,
              }}
            >
              {topic}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              fontSize: hero.fontSize,
              fontWeight: 600,
              lineHeight: 1.18,
              color: HEADING,
              maxWidth: 1040,
            }}
          >
            {hero.text}
          </div>
        </div>

        {/* Bottom: accent rule + monogram tile + brand. */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 104, height: 5, backgroundColor: ACCENT, marginBottom: 28 }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 14,
                backgroundColor: ACCENT,
                color: BG,
                fontSize: 30,
                fontWeight: 600,
              }}
            >
              {MARK}
            </div>
            <div style={{ fontSize: 30, fontWeight: 600, color: HEADING, marginLeft: 20 }}>
              {TITLE}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
