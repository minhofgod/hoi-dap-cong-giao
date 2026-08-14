'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchContentRef,
} from 'react-zoom-pan-pinch';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import type { CanvasData, CanvasNode } from '@/lib/canvas';
import styles from './CanvasViewer.module.css';

// Obsidian preset node/edge colors (1–6) → hex; a raw hex passes through untouched.
const PRESET: Record<string, string> = {
  '1': '#C0503F',
  '2': '#C67139',
  '3': '#B08A3E',
  '4': '#57853F',
  '5': '#3F94A8',
  '6': '#7A6DB8',
};
const resolveColor = (c?: string) => (c ? PRESET[c] ?? c : null);

type Pt = { x: number; y: number; dx: number; dy: number };

function anchor(n: CanvasNode, side: string | undefined, minX: number, minY: number): Pt {
  const x = n.x - minX;
  const y = n.y - minY;
  switch (side) {
    case 'top':
      return { x: x + n.width / 2, y, dx: 0, dy: -1 };
    case 'bottom':
      return { x: x + n.width / 2, y: y + n.height, dx: 0, dy: 1 };
    case 'left':
      return { x, y: y + n.height / 2, dx: -1, dy: 0 };
    case 'right':
      return { x: x + n.width, y: y + n.height / 2, dx: 1, dy: 0 };
    default:
      return { x: x + n.width / 2, y: y + n.height, dx: 0, dy: 1 };
  }
}

export function CanvasViewer({ data }: { data: CanvasData }) {
  const { nodes, edges, bounds } = data;
  const apiRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // Measure the viewport before paint so the diagram can start already fitted — this is a
  // layout read, not derived render state, hence the scoped lint exception.
  useLayoutEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const measure = () => setSize({ w: vp.clientWidth, h: vp.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  const fitScale = size ? Math.min(size.w / bounds.width, size.h / bounds.height) * 0.9 : 0.5;
  const fitX = size ? (size.w - bounds.width * fitScale) / 2 : 0;
  const fitY = size ? (size.h - bounds.height * fitScale) / 2 : 0;

  const fit = () => {
    if (!size) return;
    apiRef.current?.setTransform(fitX, fitY, fitScale, 250);
  };

  return (
    <div className={styles.viewport} ref={viewportRef}>
      {size && (
        <TransformWrapper
          ref={apiRef}
          key={`${size.w}x${size.h}`}
          initialScale={fitScale}
          initialPositionX={fitX}
          initialPositionY={fitY}
          minScale={0.05}
          maxScale={2.5}
          limitToBounds={false}
          centerOnInit={false}
          doubleClick={{ disabled: true }}
          wheel={{ step: 0.08 }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%' }}
            contentStyle={{ width: bounds.width, height: bounds.height }}
          >
            <div className={styles.plane} style={{ width: bounds.width, height: bounds.height }}>
              <svg
                className={styles.edges}
                width={bounds.width}
                height={bounds.height}
                viewBox={`0 0 ${bounds.width} ${bounds.height}`}
              >
                <defs>
                  <marker
                    id="cv-arrow"
                    markerWidth="9"
                    markerHeight="9"
                    refX="7"
                    refY="4.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M1,1 L8,4.5 L1,8 Z" fill="var(--edge)" />
                  </marker>
                </defs>
                {edges.map((e) => {
                  const from = byId.get(e.fromNode);
                  const to = byId.get(e.toNode);
                  if (!from || !to) return null;
                  const s = anchor(from, e.fromSide, bounds.minX, bounds.minY);
                  const t = anchor(to, e.toSide, bounds.minX, bounds.minY);
                  const dist = Math.hypot(t.x - s.x, t.y - s.y);
                  const k = Math.max(28, Math.min(dist * 0.5, 150));
                  const d = `M ${s.x} ${s.y} C ${s.x + s.dx * k} ${s.y + s.dy * k} ${t.x + t.dx * k} ${
                    t.y + t.dy * k
                  } ${t.x} ${t.y}`;
                  const stroke = resolveColor(e.color) ?? 'var(--edge)';
                  return (
                    <g key={e.id}>
                      <path d={d} fill="none" stroke={stroke} strokeWidth={2} markerEnd="url(#cv-arrow)" />
                      {e.label && (
                        <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2} className={styles.edgeLabel}>
                          {e.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {nodes.map((n) => {
                const accent = resolveColor(n.color);
                const left = n.x - bounds.minX;
                const top = n.y - bounds.minY;
                if (n.type === 'group') {
                  return (
                    <div
                      key={n.id}
                      className={styles.group}
                      style={{ left, top, width: n.width, height: n.height, borderColor: accent ?? undefined }}
                    >
                      {n.label && <span className={styles.groupLabel}>{n.label}</span>}
                    </div>
                  );
                }
                return (
                  <div
                    key={n.id}
                    className={styles.card}
                    style={{
                      left,
                      top,
                      width: n.width,
                      minHeight: n.height,
                      borderTopColor: accent ?? undefined,
                      borderTopWidth: accent ? 3 : undefined,
                    }}
                    dangerouslySetInnerHTML={n.html ? { __html: n.html } : undefined}
                  />
                );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>
      )}

      <div className={styles.controls}>
        <button type="button" aria-label="Phóng to" onClick={() => apiRef.current?.zoomIn()}>
          <Plus size={17} strokeWidth={2.2} />
        </button>
        <button type="button" aria-label="Thu nhỏ" onClick={() => apiRef.current?.zoomOut()}>
          <Minus size={17} strokeWidth={2.2} />
        </button>
        <button type="button" aria-label="Vừa khung" onClick={fit}>
          <Maximize2 size={15} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
