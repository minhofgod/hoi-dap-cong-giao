import type { Metadata } from "next";
import { Source_Serif_4, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { BackToTop } from "@/components/BackToTop";
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

export const metadata: Metadata = {
  title: "Hỏi Đáp Công Giáo",
  description: "Câu hỏi và giải đáp đức tin Công Giáo, Giáo Lý Hội Thánh Công Giáo song ngữ Việt–Anh, và các bản văn Giáo Phụ.",
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
