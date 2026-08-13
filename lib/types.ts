export type Lang = 'vi' | 'en';

export interface Paragraph {
  id: number;
  articleId: string;
  en: string;
  vi: string;
}

export interface TocNode {
  id: string;
  titleEn: string;
  titleVi: string;
  paragraphRange: [number, number];
  children: TocNode[];
}

export type Toc = TocNode[];
