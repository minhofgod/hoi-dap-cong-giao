// Era metadata (HANDOFF-giao-phu.md section 4) — deliberately its own client-safe module with no
// filesystem imports. lib/churchFathersV2.ts re-exports these for server components; client
// components (e.g. components/giao-phu/Rail.tsx) import directly from here instead of from
// churchFathersV2.ts, whose `node:fs` content loader can't be bundled for the browser.

export type Era = 'apostolic' | 'ante-nicene' | 'nicene' | 'post-nicene';

export interface Bi {
  vi: string;
  en: string;
}

export const ERA_ORDER: Era[] = ['apostolic', 'ante-nicene', 'nicene', 'post-nicene'];

export const ERA_LABEL: Record<Era, Bi> = {
  apostolic: { vi: 'Giáo phụ Tông đồ', en: 'Apostolic Fathers' },
  'ante-nicene': { vi: 'Trước Công đồng Nicêa', en: 'Ante-Nicene' },
  nicene: { vi: 'Thời Công đồng Nicêa', en: 'Nicene' },
  'post-nicene': { vi: 'Sau Công đồng Nicêa', en: 'Post-Nicene' },
};

/** Short form used by the rail's era labels (HANDOFF section 5: "not century numerals"). */
export const ERA_LABEL_SHORT: Record<Era, Bi> = {
  apostolic: { vi: 'Tông đồ', en: 'Apostolic' },
  'ante-nicene': { vi: 'Trước Nicêa', en: 'Ante-Nicene' },
  nicene: { vi: 'Nicêa', en: 'Nicene' },
  'post-nicene': { vi: 'Sau Nicêa', en: 'Post-Nicene' },
};

export const ERA_SPAN: Record<Era, string> = {
  apostolic: 'c. 35 — 130',
  'ante-nicene': 'c. 100 — 270',
  nicene: 'c. 260 — 397',
  'post-nicene': 'c. 347 — 749',
};

export const ERA_BLURB: Record<Era, Bi> = {
  apostolic: {
    vi: 'Những vị đã nghe chính các Tông đồ giảng dạy. Các thư của họ là chứng từ xưa nhất còn lại về đời sống Hội Thánh sau Tân Ước.',
    en: 'Those who heard the Apostles themselves. Their letters are the oldest surviving witness to Church life after the New Testament.',
  },
  'ante-nicene': {
    vi: 'Thời của bách hại và của những bản hộ giáo đầu tiên: Hội Thánh phải giải thích mình cho một đế quốc chưa hiểu mình.',
    en: 'The age of persecution and the first apologies: the Church explaining itself to an empire that did not yet understand it.',
  },
  nicene: {
    vi: 'Cuộc tranh luận về thần tính của Đức Kitô. Từ đây Hội Thánh có kinh Tin Kính và một ngôn ngữ chung để nói về Thiên Chúa.',
    en: 'The struggle over Christ’s divinity. Out of it came the Creed and a shared language for speaking of God.',
  },
  'post-nicene': {
    vi: 'Thời của các bộ sách lớn — thần học được viết thành hệ thống, và di sản ấy định hình cả Đông lẫn Tây.',
    en: 'The age of the great works — theology written as a system, shaping East and West alike.',
  },
};
