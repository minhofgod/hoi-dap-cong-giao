import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

// A parsed Obsidian JSON Canvas (jsoncanvas.org). We render it read-only, so we only
// keep what the viewer needs: node geometry + rendered text, and edge endpoints/sides.

export type CanvasNode = {
  id: string;
  type: string; // 'text' | 'file' | 'link' | 'group'
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  label?: string;
  html?: string; // rendered markdown for text nodes
};

export type CanvasEdge = {
  id: string;
  fromNode: string;
  fromSide?: string; // top | right | bottom | left
  toNode: string;
  toSide?: string;
  label?: string;
  color?: string;
};

export type CanvasData = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  bounds: { minX: number; minY: number; width: number; height: number };
};

const DIR = path.join(process.cwd(), 'content', 'canvas');

// Obsidian wikilinks [[target|display]] / [[target]] point into the vault, which isn't
// published — render them as their display text (styled as a reference elsewhere later).
function stripWikiLinks(md: string): string {
  return md
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Default Vietnamese labels when an Obsidian callout gives no title of its own.
const CALLOUT_TITLES: Record<string, string> = {
  quote: 'Trích dẫn',
  note: 'Ghi chú',
  info: 'Thông tin',
  tip: 'Mẹo',
  warning: 'Lưu ý',
  question: 'Câu hỏi',
  example: 'Ví dụ',
  important: 'Quan trọng',
};

// Convert Obsidian callouts ("> [!type]<fold> Title" + "> body") into titled boxes.
// marked doesn't understand them, so left alone the "[!quote]-" marker leaks as text.
function renderCallouts(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const header = lines[i].match(/^>\s*\[!(\w+)\]([+-]?)\s?(.*)$/);
    if (header) {
      const type = header[1].toLowerCase();
      const title =
        (header[3] || '').trim() || CALLOUT_TITLES[type] || type.charAt(0).toUpperCase() + type.slice(1);
      const body: string[] = [];
      i += 1;
      while (i < lines.length && /^>/.test(lines[i])) {
        body.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      const bodyHtml = marked.parse(body.join('\n'), { async: false }) as string;
      out.push(
        '',
        `<div class="callout" data-callout="${type}"><div class="calloutTitle">${escapeHtml(
          title
        )}</div><div class="calloutBody">${bodyHtml}</div></div>`,
        ''
      );
    } else {
      out.push(lines[i]);
      i += 1;
    }
  }
  return out.join('\n');
}

function renderMarkdown(md: string): string {
  return marked.parse(renderCallouts(stripWikiLinks(md)), { async: false }) as string;
}

export function getCanvasSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.canvas'))
    .map((f) => f.replace(/\.canvas$/, ''));
}

export function getCanvas(slug: string): CanvasData {
  const raw = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.canvas`), 'utf8'));
  const rawNodes: Record<string, unknown>[] = raw.nodes ?? [];

  const nodes: CanvasNode[] = rawNodes.map((n) => ({
    id: n.id as string,
    type: n.type as string,
    x: n.x as number,
    y: n.y as number,
    width: n.width as number,
    height: n.height as number,
    color: n.color as string | undefined,
    label: n.label as string | undefined,
    html: n.type === 'text' ? renderMarkdown((n.text as string) ?? '') : undefined,
  }));

  const edges: CanvasEdge[] = (raw.edges ?? []).map((e: Record<string, unknown>) => ({
    id: e.id as string,
    fromNode: e.fromNode as string,
    fromSide: e.fromSide as string | undefined,
    toNode: e.toNode as string,
    toSide: e.toSide as string | undefined,
    label: e.label as string | undefined,
    color: e.color as string | undefined,
  }));

  const minX = Math.min(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxX = Math.max(...nodes.map((n) => n.x + n.width));
  const maxY = Math.max(...nodes.map((n) => n.y + n.height));

  return { nodes, edges, bounds: { minX, minY, width: maxX - minX, height: maxY - minY } };
}
