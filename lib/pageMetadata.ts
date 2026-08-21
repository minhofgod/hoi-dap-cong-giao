import type { Metadata, ResolvingMetadata } from 'next';

const SITE_NAME = 'Hỏi Đáp Công Giáo';

type OgImages = NonNullable<NonNullable<Metadata['openGraph']>['images']>;

/**
 * Build a page's Metadata with a SELF-referential canonical + Open Graph URL.
 *
 * Three Next-specific reasons this is a shared helper rather than inlined per route (all from the
 * generateMetadata docs in node_modules/next/dist/docs, "Merging"):
 *  1. Metadata merging is shallow and REPLACES whole nested objects. A page that sets `openGraph`
 *     drops the root layout's siteName/locale unless it re-declares them — so we always re-include
 *     them here. Same for `twitter`.
 *  2. It ALSO drops the card image: the root app/opengraph-image.tsx is merged into the root
 *     segment's `openGraph.images`, so once a child overrides `openGraph` that image is gone. The
 *     fix is to pass the resolved parent images back in (`images`); see resolveParentImages below.
 *     A per-route opengraph-image (e.g. app/giai-dap/[slug]/opengraph-image.tsx) still wins over
 *     whatever we pass here, because file-based metadata has higher priority.
 *  3. One place keeps canonical style, og:type, and locale identical across ~210 pages instead of
 *     drifting per section (the failure this metadata pass exists to prevent).
 *
 * `title` is the page's OWN name only. The root layout's title.template appends
 * " · Hỏi Đáp Công Giáo", so never include the site name here (that double-suffix was the bug).
 */
export function pageMetadata(opts: {
  title: string;
  description?: string;
  /** Absolute path from the site root, e.g. "/giai-dap/foo". Resolved against metadataBase. */
  path: string;
  type?: 'website' | 'article';
  /** Parent (root) Open Graph images to carry forward — see resolveParentImages. */
  images?: OgImages;
}): Metadata {
  const { title, path, type = 'website', images } = opts;
  const desc = opts.description?.trim() || undefined;
  const hasImages = Array.isArray(images) ? images.length > 0 : Boolean(images);
  return {
    title,
    ...(desc ? { description: desc } : {}),
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      ...(desc ? { description: desc } : {}),
      url: path,
      locale: 'vi_VN',
      alternateLocale: 'en_US',
      ...(hasImages ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(desc ? { description: desc } : {}),
      ...(hasImages ? { images } : {}),
    },
  };
}

/**
 * The resolved Open Graph images from parent segments — i.e. the root app/opengraph-image.tsx card.
 * Pass the result into pageMetadata's `images` so a page that overrides `openGraph` keeps a card
 * image instead of shipping none. Call from inside a route's generateMetadata:
 *   const images = await resolveParentImages(parent);
 */
export async function resolveParentImages(parent: ResolvingMetadata): Promise<OgImages | undefined> {
  const images = (await parent).openGraph?.images;
  return (images as OgImages | undefined) ?? undefined;
}

/**
 * generateMetadata for a page with NO dynamic params (section indexes, standalone pages). Wraps
 * pageMetadata and carries the parent card image forward so the page keeps an OG image. Use as:
 *   export const generateMetadata = staticPageMetadata({ title, description, path });
 */
export function staticPageMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  type?: 'website' | 'article';
}) {
  return async function generateMetadata(
    _props: unknown,
    parent: ResolvingMetadata,
  ): Promise<Metadata> {
    return pageMetadata({ ...opts, images: await resolveParentImages(parent) });
  };
}

/**
 * Plain-text excerpt for a meta description: strip Markdown/HTML down to readable prose, collapse
 * whitespace, and truncate on a word boundary near `max` chars with an ellipsis. Search engines
 * render descriptions best around 150–160 characters. Safe to pass an already-short summary — it is
 * returned unchanged when under the limit.
 */
export function plainExcerpt(input: string, max = 155): string {
  const text = input
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/<[^>]+>/g, ' ') // HTML tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // ATX headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/[*_`~]/g, '') // emphasis / inline-code marks
    .replace(/\s+/g, ' ') // collapse whitespace/newlines
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…';
}
