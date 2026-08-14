// Era metadata for the Ecumenical Councils section (mirrors lib/giao-phu/eras.ts) — a client-safe
// module with no filesystem imports, so client components can import the constants directly.

export type Era = 'early' | 'medieval' | 'modern';

export interface Bi {
  vi: string;
  en: string;
}

export const ERA_ORDER: Era[] = ['early', 'medieval', 'modern'];

export const ERA_LABEL: Record<Era, Bi> = {
  early: { vi: 'Công đồng tiên khởi', en: 'Early Councils' },
  medieval: { vi: 'Công đồng Trung Cổ', en: 'Medieval Councils' },
  modern: { vi: 'Công đồng Cận–Hiện đại', en: 'Modern Councils' },
};

export const ERA_LABEL_SHORT: Record<Era, Bi> = {
  early: { vi: 'Tiên khởi', en: 'Early' },
  medieval: { vi: 'Trung Cổ', en: 'Medieval' },
  modern: { vi: 'Cận–Hiện đại', en: 'Modern' },
};

export const ERA_SPAN: Record<Era, string> = {
  early: '325 — 870',
  medieval: '1123 — 1517',
  modern: '1545 — 1965',
};

export const ERA_BLURB: Record<Era, Bi> = {
  early: {
    vi: 'Tám công đồng chung đầu tiên, phần lớn ở Đông phương — nơi Hội Thánh xác định đức tin về Chúa Ba Ngôi và về Đức Kitô, chống lại các lạc thuyết lớn.',
    en: 'The first eight ecumenical councils, mostly in the East — where the Church defined its faith in the Trinity and in Christ against the great heresies.',
  },
  medieval: {
    vi: 'Mười công đồng ở Tây phương, từ các Công đồng Latêranô đến Latêranô V — cải tổ Hội Thánh, các cuộc Thập Tự Chinh và nỗ lực hiệp nhất với Đông phương.',
    en: 'Ten Western councils, from the Lateran councils to Lateran V — Church reform, the Crusades, and attempts at reunion with the East.',
  },
  modern: {
    vi: 'Ba công đồng định hình Hội Thánh hiện đại: Triđentinô đáp lại cuộc Cải Cách, Vaticanô I về quyền tối thượng, và Vaticanô II về Hội Thánh giữa thế giới hôm nay.',
    en: 'Three councils that shaped the modern Church: Trent answering the Reformation, Vatican I on papal primacy, and Vatican II on the Church in the modern world.',
  },
};
