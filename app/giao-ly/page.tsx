import { SiteHeader } from '@/components/SiteHeader';
import { CatechismBrowser } from '@/components/CatechismBrowser';
import { content, toc } from '@/lib/content';

export default function GiaoLyIndexPage() {
  return (
    <>
      <SiteHeader />
      <CatechismBrowser toc={toc} total={content.length} />
    </>
  );
}
