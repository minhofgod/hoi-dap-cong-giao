// Q&A taxonomy — the 3-level model from docs/roadmap.md:
//   • Category (broad, audience-facing, pick 1)  → this file, `CATEGORIES`
//   • Topic / cluster (the `topic` frontmatter field, e.g. "Cầu nguyện với các thánh")
//   • Tags (cross-cutting, many per Q&A)         → this file, `TAGS`
//
// Frontmatter stores the STABLE ids below (ascii-kebab), never the display labels, so a Q&A's
// `category:`/`tags:` never break when wording changes and both languages resolve from one place.
// To rename a label, edit it here. To add a category/tag, add an entry here — that's the whole
// change; the loader, browser, filters and search all read from these lists.
//
// Vietnamese labels verified against the site's own content (the Catechism is the in-house
// authority): "Hội Thánh" (not "Giáo Hội"), "Bằng chứng" (the site's videos), "Kinh Thánh".

export type Bi = { vi: string; en: string };
export type TaxonomyTerm = { id: string } & Bi;

/** Broad, audience-facing categories — a seeker/atheist should find themselves here. Pick 1 per
 *  Q&A. Order here is the display order of the filter chips. */
export const CATEGORIES: readonly TaxonomyTerm[] = [
  { id: 'science-faith', vi: 'Khoa học & Đức tin', en: 'Science & Faith' },
  { id: 'evidence-history', vi: 'Bằng chứng & Lịch sử', en: 'Evidence & History' },
  { id: 'god-meaning', vi: 'Thiên Chúa & Ý nghĩa', en: 'God & Meaning' },
  { id: 'theology-doctrine', vi: 'Thần học & Tín lý', en: 'Theology & Doctrine' },
  { id: 'the-church', vi: 'Hội Thánh', en: 'The Church' },
  { id: 'mary-saints', vi: 'Đức Mẹ & Các Thánh', en: 'Mary & the Saints' },
  { id: 'scripture', vi: 'Kinh Thánh', en: 'Scripture' },
  { id: 'morality-life', vi: 'Luân lý & Đời sống', en: 'Morality & Life' },
  { id: 'other-religions', vi: 'Tôn giáo khác & Phản đối', en: 'Other Religions & Objections' },
] as const;

/** Cross-cutting tags (many per Q&A). Seed vocabulary from docs/roadmap.md — easy to extend. */
export const TAGS: readonly TaxonomyTerm[] = [
  { id: 'mary', vi: 'Đức Mẹ', en: 'Mary' },
  { id: 'papacy', vi: 'Quyền Giáo hoàng', en: 'Papacy' },
  { id: 'eucharist', vi: 'Thánh Thể', en: 'Eucharist' },
  { id: 'trinity', vi: 'Chúa Ba Ngôi', en: 'Trinity' },
  { id: 'jesus', vi: 'Chúa Giêsu', en: 'Jesus' },
  { id: 'resurrection', vi: 'Phục Sinh', en: 'Resurrection' },
  { id: 'saints', vi: 'Các Thánh', en: 'Saints' },
  { id: 'faith', vi: 'Đức tin', en: 'Faith' },
  { id: 'works', vi: 'Việc làm', en: 'Works' },
  { id: 'grace', vi: 'Ân sủng', en: 'Grace' },
  { id: 'salvation', vi: 'Ơn cứu độ', en: 'Salvation' },
  { id: 'bible', vi: 'Kinh Thánh', en: 'Bible' },
  { id: 'confession', vi: 'Xưng tội', en: 'Confession' },
  { id: 'prayer', vi: 'Cầu nguyện', en: 'Prayer' },
  { id: 'suffering', vi: 'Đau khổ', en: 'Suffering' },
  { id: 'marriage', vi: 'Hôn nhân', en: 'Marriage' },
  { id: 'evangelization', vi: 'Loan báo Tin Mừng', en: 'Evangelization' },
  { id: 'science', vi: 'Khoa học', en: 'Science' },
  { id: 'evolution', vi: 'Tiến hóa', en: 'Evolution' },
  { id: 'miracles', vi: 'Phép lạ', en: 'Miracles' },
  { id: 'church-history', vi: 'Lịch sử Hội Thánh', en: 'Church history' },
  { id: 'authority', vi: 'Thẩm quyền', en: 'Authority' },
  { id: 'icons', vi: 'Ảnh tượng', en: 'Icons' },
  { id: 'purgatory', vi: 'Luyện ngục', en: 'Purgatory' },
  { id: 'baptism', vi: 'Rửa tội', en: 'Baptism' },
  { id: 'atheism', vi: 'Vô thần', en: 'Atheism' },
  { id: 'protestant-objections', vi: 'Phản đối của Tin Lành', en: 'Protestant objections' },
  { id: 'free-will', vi: 'Tự do ý chí', en: 'Free will' },
  { id: 'sacraments', vi: 'Bí tích', en: 'Sacraments' },
  { id: 'sin', vi: 'Tội & lương tâm', en: 'Sin & conscience' },
  { id: 'afterlife', vi: 'Đời sau', en: 'Afterlife' },
  { id: 'consolation', vi: 'An ủi & hy vọng', en: 'Consolation & hope' },
  { id: 'persecution', vi: 'Bách hại & làm chứng', en: 'Persecution & witness' },
  { id: 'problem-of-evil', vi: 'Vấn đề sự dữ', en: 'The problem of evil' },
] as const;

const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c]));
const TAG_BY_ID = new Map(TAGS.map((t) => [t.id, t]));

/** Ids the loader uses to tell a NEW broad-category value apart from a LEGACY cluster name
 *  (Vietnamese prose) still sitting in the `category:` field during migration. */
export const CATEGORY_IDS: ReadonlySet<string> = new Set(CATEGORIES.map((c) => c.id));

/** Resolve a category id to its bilingual label. Unknown ids fall back to the raw id so a typo
 *  or a not-yet-listed value still renders something instead of vanishing. */
export function categoryLabel(id: string): Bi {
  return CATEGORY_BY_ID.get(id) ?? { vi: id, en: id };
}

/** Resolve a tag id to its bilingual label (same forgiving fallback as categories). */
export function tagLabel(id: string): Bi {
  return TAG_BY_ID.get(id) ?? { vi: id, en: id };
}

/** A flat, searchable string of every label (both languages) for a category + its tags —
 *  used to make category/tag names matchable in the site search. */
export function taxonomyKeywords(category: string | undefined, tags: string[]): string {
  const parts: string[] = [];
  if (category) {
    const c = categoryLabel(category);
    parts.push(c.vi, c.en);
  }
  for (const t of tags) {
    const l = tagLabel(t);
    parts.push(l.vi, l.en);
  }
  return parts.join(' ');
}
