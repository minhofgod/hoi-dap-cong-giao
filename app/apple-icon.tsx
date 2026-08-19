import { ImageResponse } from 'next/og';
import { loadBrandFont } from './og-font';

// iOS home-screen icon. app/icon.svg covers favicons, but Apple wants a raster PNG — so draw the
// brand monogram ("HĐ", cream on terracotta) at 180×180. iOS applies its own rounded mask.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

const MARK = 'HĐ';

export default async function AppleIcon() {
  const fontData = await loadBrandFont(MARK);
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#C67139',
          color: '#FBF8F3',
          fontFamily: 'brand',
          fontSize: 92,
          fontWeight: 600,
        }}
      >
        {MARK}
      </div>
    ),
    { ...size, fonts }
  );
}
