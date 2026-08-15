// Unified timeline for the "Lịch Sử Hội Thánh / Church History" hub — a client-safe module (no
// node:fs imports) so the client timeline component can import the band metadata and item type
// directly. The Fathers (lib/churchFathersV2) and Councils (lib/councilsV2) each have their OWN era
// scheme; this hub ignores both and places every item on ONE shared chronological line, keyed off
// the raw dates, using the combined early/medieval/modern band scheme defined here.

export interface Bi {
  vi: string;
  en: string;
}

export type ItemKind = 'father' | 'council';
export type BandId = 'early' | 'medieval' | 'modern';

export interface TimelineItem {
  kind: ItemKind;
  slug: string;
  href: string; // /giao-phu/<slug> or /cong-dong/<slug>
  name: Bi;
  meta: Bi; // a Father's role, or a Council's subtitle
  dates: string; // display string, e.g. "c. 293 — 373" or "1962–1965"
  year: number; // representative placement year (sort key)
  image: { src: string | null; available: boolean };
}

export interface TimelineBand {
  id: BandId;
  label: Bi;
  span: string;
  blurb: Bi;
  items: TimelineItem[]; // Fathers + Councils interleaved by year (ascending)
}

export const BAND_ORDER: BandId[] = ['early', 'medieval', 'modern'];

export const BAND_LABEL: Record<BandId, Bi> = {
  early: { vi: 'Hội Thánh sơ khai', en: 'The Early Church' },
  medieval: { vi: 'Thời Trung Cổ', en: 'The Medieval Church' },
  modern: { vi: 'Thời Cận – Hiện đại', en: 'The Modern Church' },
};

export const BAND_SPAN: Record<BandId, string> = {
  early: 'Thế kỷ I – IX',
  medieval: 'Thế kỷ XII – XVI',
  modern: 'Thế kỷ XVI – XX',
};

export const BAND_SPAN_EN: Record<BandId, string> = {
  early: '1st – 9th c.',
  medieval: '12th – 16th c.',
  modern: '16th – 20th c.',
};

export const BAND_BLURB: Record<BandId, Bi> = {
  early: {
    vi: 'Từ các Giáo Phụ Tông đồ đến tám công đồng chung đầu tiên — thời Hội Thánh vừa làm chứng vừa xác định đức tin về Chúa Ba Ngôi và về Đức Kitô. Đây là nơi các Giáo Phụ và các Công Đồng đan xen nhau trên cùng một dòng thời gian.',
    en: 'From the Apostolic Fathers to the first eight ecumenical councils — the age when the Church both bore witness and defined its faith in the Trinity and in Christ. This is where the Fathers and the Councils interleave on one line of time.',
  },
  medieval: {
    vi: 'Mười công đồng ở Tây phương, từ các Công đồng Latêranô đến Latêranô V — cải tổ Hội Thánh, các cuộc Thập Tự Chinh, và nỗ lực hiệp nhất với Đông phương.',
    en: 'Ten Western councils, from the Lateran councils to Lateran V — Church reform, the Crusades, and attempts at reunion with the East.',
  },
  modern: {
    vi: 'Ba công đồng định hình Hội Thánh hiện đại: Trentô (Triđentinô) đáp lại cuộc Cải Cách, Vaticanô I về quyền tối thượng, và Vaticanô II về Hội Thánh giữa thế giới hôm nay.',
    en: 'Three councils that shaped the modern Church: Trent answering the Reformation, Vatican I on papal primacy, and Vatican II on the Church in the modern world.',
  },
};

/** The hub's own unified band scheme, driven purely by the raw year (NOT the source sections'
 *  separate era fields). The medieval/modern cut sits at 1520 so Lateran V (1512–1517) stays with
 *  the other medieval councils and Trent (1545) opens the modern band. */
export function bandForYear(year: number): BandId {
  if (year < 1000) return 'early';
  if (year < 1520) return 'medieval';
  return 'modern';
}
