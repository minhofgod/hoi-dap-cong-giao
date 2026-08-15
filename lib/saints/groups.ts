// Theme metadata for the Các Thánh (Saints) section — the devotional counterpart to the Giáo Phụ
// section's era metadata (lib/giao-phu/eras.ts). Deliberately its own client-safe module with NO
// filesystem imports: lib/saintsV2.ts re-exports these for server components, while client
// components (components/cac-thanh/SaintsRail.tsx, SaintsBrowser.tsx) import directly from here so
// the `node:fs` content loader in saintsV2.ts is never bundled for the browser.
//
// Unlike the Fathers, Saints are organized by THEME, not chronology (roadmap "Session 9 — Các
// Thánh: starting lineup"). So `group` replaces `era`, and each group carries a short bilingual
// `kicker` (where the Fathers show a date span) rather than a calendar range.

import type { Bi } from '@/lib/giao-phu/eras';

export type { Bi };

export type SaintGroup = 'martyrs-vn' | 'modern' | 'converts' | 'bridge' | 'patrons';

export const GROUP_ORDER: SaintGroup[] = ['martyrs-vn', 'modern', 'converts', 'bridge', 'patrons'];

export const GROUP_LABEL: Record<SaintGroup, Bi> = {
  'martyrs-vn': { vi: 'Các Thánh Tử Đạo Việt Nam', en: 'Martyrs of Vietnam' },
  modern: { vi: 'Chứng nhân thời hiện đại', en: 'Modern witnesses' },
  converts: { vi: 'Trở lại & trí thức', en: 'Converts & intellectuals' },
  bridge: { vi: 'Những nhịp cầu', en: 'Bridges' },
  patrons: { vi: 'Các thánh gần gũi', en: 'Beloved patrons' },
};

/** Short form used by the rail's group labels (mirrors ERA_LABEL_SHORT). */
export const GROUP_LABEL_SHORT: Record<SaintGroup, Bi> = {
  'martyrs-vn': { vi: 'Tử đạo VN', en: 'VN Martyrs' },
  modern: { vi: 'Hiện đại', en: 'Modern' },
  converts: { vi: 'Trở lại', en: 'Converts' },
  bridge: { vi: 'Nhịp cầu', en: 'Bridges' },
  patrons: { vi: 'Gần gũi', en: 'Patrons' },
};

/** The uppercase gold kicker line above each group (where the Fathers show a date span). */
export const GROUP_KICKER: Record<SaintGroup, Bi> = {
  'martyrs-vn': { vi: 'Di sản Việt Nam', en: 'Vietnamese heritage' },
  modern: { vi: 'Thế kỷ 19 — 21', en: '19th — 21st century' },
  converts: { vi: 'Từ hoài nghi đến đức tin', en: 'From doubt to faith' },
  bridge: { vi: 'Dẫn tới phép lạ & hiện ra', en: 'Toward miracles & apparitions' },
  patrons: { vi: 'Người bạn đường', en: 'Companions for the journey' },
};

export const GROUP_BLURB: Record<SaintGroup, Bi> = {
  'martyrs-vn': {
    vi: 'Những người con của đất Việt đã lấy máu mình làm chứng cho đức tin. 117 vị được tuyên thánh năm 1988, cùng Á Thánh Anrê Phú Yên — vị tử đạo tiên khởi.',
    en: 'Sons and daughters of Vietnam who bore witness to the faith with their blood. The 117 canonized in 1988, together with Bl. Anrê Phú Yên, the protomartyr.',
  },
  modern: {
    vi: 'Các thánh của thời gần đây — một thiếu niên thời internet, một nữ tu ẩn mình, một cha giải tội mang dấu thánh — cho thấy sự thánh thiện vẫn sống động trong thế giới hôm nay.',
    en: 'Saints of the recent past — an internet-age teenager, a hidden nun, a stigmatic confessor — showing that holiness is still alive in the world we know.',
  },
  converts: {
    vi: 'Những người đã đi qua hoài nghi, triết học, hay một đời sống khác trước khi gặp Đức Kitô — tiếng nói quen thuộc cho ai đang tìm kiếm bằng lý trí.',
    en: 'Those who passed through doubt, philosophy, or another life before meeting Christ — familiar voices for anyone searching by way of reason.',
  },
  bridge: {
    vi: 'Những vị thánh mà câu chuyện dẫn ta xa hơn: tới một cuộc hiện ra, một phép lạ, hay tới lời cầu nguyện cho một người thân đã xa Chúa.',
    en: 'Saints whose stories lead somewhere further: to an apparition, a miracle, or to prayer for a loved one who has drifted from God.',
  },
  patrons: {
    vi: 'Những người bạn đường được yêu mến qua bao thế kỷ — dễ gần, dễ cầu xin, luôn có mặt trong đời sống đạo bình dị.',
    en: 'Beloved companions across the centuries — approachable, easy to turn to, ever-present in ordinary devotion.',
  },
};
