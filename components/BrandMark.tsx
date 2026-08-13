// The Hỏi Đáp Công Giáo mark: an H/Đ ligature with a Latin cross cut out (see the logo handoff
// in design/logo/README.md). Inlined SVG — the cross is transparent, so the page ground shows
// through it; never use it as a background-image. `fill: currentColor`, so set the color on it
// per placement (--accent in headers, #A29A91 in the footer, #E08A4A on dark grounds).
//
// `cut` is the cross-stroke width in the 158×100 viewBox — it must WIDEN as the mark shrinks
// (it's the first thing to close up): 8 at header sizes, 9 for mobile/footer. `id` must be unique
// per rendered copy on a page so the mask ids don't collide.

export function BrandMark({
  size = 47,
  cut = 8,
  id = 'hd',
  className,
}: {
  size?: number;
  cut?: number;
  id?: string;
  className?: string;
}) {
  const maskId = `hd-cross-${id}`;
  const vx = 72 - cut / 2; // vertical cross bar, kept centred
  const hy = 49 - cut / 2; // horizontal cross bar, kept centred
  return (
    <svg
      width={size}
      height={(size * 100) / 158}
      viewBox="0 0 158 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <mask id={maskId}>
          <rect width="158" height="100" fill="#fff" />
          <rect x={vx} y="10" width={cut} height="80" fill="#000" />
          <rect x="52" y={hy} width="42" height={cut} fill="#000" />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect x="0" y="0" width="22" height="100" />
        <rect x="61" y="0" width="22" height="100" />
        <rect x="0" y="38" width="105" height="22" />
        <path d="M87 0h25a46 50 0 0 1 0 100H87V82h25a28 32 0 0 0 0-64H87Z" />
      </g>
    </svg>
  );
}
