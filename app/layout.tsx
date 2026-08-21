import type { Metadata } from "next";
import { Source_Serif_4, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { BackToTop } from "@/components/BackToTop";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["vietnamese"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const SITE_NAME = "Hỏi Đáp Công Giáo";
const SITE_DESCRIPTION =
  "Câu hỏi và giải đáp đức tin Công Giáo, Giáo Lý Hội Thánh Công Giáo song ngữ Việt–Anh, và các bản văn Giáo Phụ.";

export const metadata: Metadata = {
  // metadataBase makes Open Graph / canonical URLs absolute. Without it Next warns at build and
  // social previews resolve against localhost. Single source of truth: lib/siteUrl.ts.
  metadataBase: new URL(SITE_URL),
  // `template` lets section pages set just their own title (e.g. "Giải Đáp") and get
  // "Giải Đáp · Hỏi Đáp Công Giáo" without repeating the site name by hand. `default` is the
  // home/untitled fallback.
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Vietnamese-first social card (a bare link on Facebook/Zalo otherwise shows no title/image).
  // The image comes from app/opengraph-image.tsx via the file-based convention.
  // NOTE: no `openGraph.url` here on purpose. A hardcoded root URL made EVERY page advertise
  // og:url = the homepage, so Facebook/Zalo resolved every shared link back to "/". With it
  // omitted, each content route sets its own url via lib/pageMetadata; pages without one fall back
  // to the fetched URL, which is correct. metadataBase still makes those relative URLs absolute.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "vi_VN",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

const LANG_PREPAINT_SCRIPT = `
(function () {
  try {
    var v = localStorage.getItem('hdcg.lang');
    if (v === 'vi' || v === 'en' || v === 'both') {
      document.documentElement.setAttribute('data-lang', v);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      data-lang="vi"
      suppressHydrationWarning
      className={`${sourceSerif4.variable} ${beVietnamPro.variable}`}
    >
      <body suppressHydrationWarning>
        <Script id="lang-prepaint" strategy="beforeInteractive">
          {LANG_PREPAINT_SCRIPT}
        </Script>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
