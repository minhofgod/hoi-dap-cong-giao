import { SiteHeader } from '@/components/SiteHeader';
import { CatechismBrowser } from '@/components/CatechismBrowser';
import { content, toc } from '@/lib/content';
import { staticPageMetadata } from '@/lib/pageMetadata';

export const generateMetadata = staticPageMetadata({
  title: 'Giáo Lý Hội Thánh Công Giáo',
  description:
    'Giáo Lý Hội Thánh Công Giáo (GLHTCG) song ngữ Việt–Anh, trình bày theo từng mục để dễ đọc và tra cứu, với tham chiếu Kinh Thánh.',
  path: '/giao-ly',
});

export default function GiaoLyIndexPage() {
  return (
    <>
      <SiteHeader />
      <CatechismBrowser toc={toc} total={content.length} />
    </>
  );
}
