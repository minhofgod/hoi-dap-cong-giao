import { ImageResponse } from 'next/og';
import { loadBrandFont } from './og-font';

// The social-share card (Facebook / Zalo / Twitter). File-based convention: Next wires this into
// og:image + twitter:image automatically, resolved absolute via metadataBase (lib/siteUrl.ts).
export const alt = 'Hỏi Đáp Công Giáo';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TITLE = 'Hỏi Đáp Công Giáo';
const TAGLINE = 'Câu hỏi và giải đáp đức tin Công Giáo — song ngữ Việt–Anh';
const MARK = 'HĐ'; // the brand monogram, drawn as text (Satori has no reliable inline-SVG support)

export default async function OpengraphImage() {
  const fontData = await loadBrandFont(`${TITLE}${TAGLINE}${MARK}·`);
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FBF8F3',
          fontFamily: 'brand',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 132,
            height: 132,
            borderRadius: 29,
            backgroundColor: '#C67139',
            color: '#FBF8F3',
            fontSize: 62,
            fontWeight: 600,
          }}
        >
          {MARK}
        </div>
        <div style={{ fontSize: 78, fontWeight: 600, color: '#201E1D', marginTop: 44 }}>{TITLE}</div>
        <div style={{ fontSize: 31, color: '#5C554E', marginTop: 22, textAlign: 'center', maxWidth: 900 }}>
          {TAGLINE}
        </div>
        <div style={{ marginTop: 36, width: 104, height: 5, backgroundColor: '#C67139' }} />
      </div>
    ),
    { ...size, fonts }
  );
}
