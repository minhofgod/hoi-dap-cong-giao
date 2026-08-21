# 🔴 URGENT — site-wide metadata is missing: ~210 pages share one title

Found 2026-08-20 while verifying the Facebook Sharing Debugger after the OG-card work. **This is the
biggest discoverability problem on the site** and it silently undoes a large share of the content work.

---

## The finding (verified on production)

**Every content detail page emits the site defaults, not its own metadata:**

| Page | `<title>` | `meta description` | `og:url` | `og:title` | canonical |
|---|---|---|---|---|---|
| `/giai-dap/<any of 120>` | `Hỏi Đáp Công Giáo` | site description | **site root** | site name | **none** |
| `/cac-thanh/<21>` | `Hỏi Đáp Công Giáo` | site description | site root | site name | none |
| `/phep-la/<18>` | `Hỏi Đáp Công Giáo` | site description | site root | site name | none |
| `/cong-dong/<21>` | `Hỏi Đáp Công Giáo` | site description | site root | site name | none |
| `/giao-phu/<30>` | `Hỏi Đáp Công Giáo` | site description | site root | site name | none |

**Index pages too:** `/`, `/giai-dap`, `/cac-thanh`, `/phep-la`, `/cong-dong`, `/giao-phu`, `/giao-ly`
all render `<title>Hỏi Đáp Công Giáo</title>`.

**And the two routes that DO set a title double the site name:**
`/dong-hanh` → `Đồng hành · Hỏi Đáp Công Giáo · Hỏi Đáp Công Giáo`; `/video` likewise. Their `title`
already contains the site name, and the root `template: '%s · Hỏi Đáp Công Giáo'` appends it again.

## Why it happens
`app/layout.tsx` sets sensible defaults — including a **hardcoded `openGraph.url: SITE_URL`** — and the
content routes have **no `generateMetadata` at all**, so every page inherits the homepage's identity.

## Why it's severe
1. **Search:** Google shows the `<title>` in results. Every page of yours competes as "Hỏi Đáp Công
   Giáo" with an identical description — duplicate-title/description signals across ~210 URLs. Your
   researched content is effectively undifferentiated to search, which is very likely why a
   site-name search surfaces only the homepage.
2. **Social:** `og:url` points at the root, so **Facebook/Threads/Zalo resolve every shared link to the
   homepage and render the homepage card** — confirmed in the Sharing Debugger's "Redirect Path"
   (`og:url Meta Tag → https://www.hoidapconggiao.com/`). This defeats Session 2's per-Q&A OG images
   entirely: the images are correct, but scrapers never reach them.
3. It undermines the **share button** work too — links shared from the page would still preview as the
   homepage.

---

## The fix

### 1. Root layout (`app/layout.tsx`)
- **Remove the hardcoded `openGraph.url: SITE_URL`.** With `metadataBase` set, each page supplies its
  own relative `url`; when absent, scrapers fall back to the fetched URL, which is correct behaviour.
  A hardcoded root is never right for a child page.
- Keep `metadataBase`, `title.template`, `title.default`, `siteName`, locale.

### 2. Every content route — add `generateMetadata`
Pattern (Q&A shown; the others are identical in shape):
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const q = /* load the question */;
  const path = `/giai-dap/${q.slug}`;
  const description = /* 1–2 sentence excerpt, plain text, ~150–160 chars */;
  return {
    title: q.questionVi,                    // template appends " · Hỏi Đáp Công Giáo" — do NOT repeat it
    description,
    alternates: { canonical: path },
    openGraph: { type: 'article', url: path, title: q.questionVi, description },
  };
}
```
Apply to: `app/giai-dap/[slug]` · `app/cac-thanh/[slug]` · `app/phep-la/[slug]` · `app/cong-dong/[slug]`
· `app/giao-phu/[slug]` · `app/giao-ly/[number]` · and the **index** pages of each section.

### 3. Fix the doubled titles
`/dong-hanh` and `/video`: their `title` includes the site name AND gets the template suffix. Set the
bare section name only (`'Đồng hành'`), and let the template add the rest.

### ⚠️ Don't repeat the site name in `title`
The root `template` is `'%s · Hỏi Đáp Công Giáo'`. Pages pass **only their own name**.

---

## Lane note — this is a deliberate exception
The fix spans routes owned by Sessions 2, 5, 8, 9, 11 and more. **Have ONE session do the whole pass**
rather than six doing it piecemeal — it's the same mechanical change repeated, and six independent
implementations would drift in description length, canonical style, and `og:type`. **Recommend Session
8** (it owns `app/layout.tsx` and site-wide shell/IA concerns), with explicit permission to add
`generateMetadata` to the section routes **for this task only** — no other changes in those files.
Announce it so other sessions don't edit those routes concurrently.

## Verify (production, after deploy)
1. Fetch 3–4 detail pages across different sections; confirm each `<title>` is **unique** and each
   `description` differs.
2. Confirm `og:url` matches the page's own URL and a `<link rel="canonical">` exists.
3. Confirm no title contains "Hỏi Đáp Công Giáo" twice.
4. Re-run the **Facebook Sharing Debugger** → *Scrape Again* → the "Redirect Path" should no longer
   bounce `og:url` to the homepage, and the preview should show the question.
5. In Search Console, request indexing on a couple of detail URLs; expect titles to update over days.

*(The Sharing Debugger's `fb:app_id` warning is unrelated and safe to ignore — it's only needed for
Facebook Insights, not for link previews.)*
