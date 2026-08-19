import type { MetadataRoute } from 'next';

// Web app manifest — lets the site be added to a phone home screen with a proper name/icon/colours,
// and gives Android Chrome a theme colour. Vietnamese-first, matching the brand palette
// (--ground / --accent from app/globals.css).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hỏi Đáp Công Giáo',
    short_name: 'Hỏi Đáp CG',
    description:
      'Câu hỏi và giải đáp đức tin Công Giáo, Giáo Lý Hội Thánh Công Giáo song ngữ Việt–Anh, và các bản văn Giáo Phụ.',
    lang: 'vi',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF8F3',
    theme_color: '#C67139',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}
