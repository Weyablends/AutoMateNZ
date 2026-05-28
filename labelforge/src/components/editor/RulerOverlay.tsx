'use client';
import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';

const RULER_SIZE = 20;
const PX_PER_MM = 3.78;

interface Tick { px: number; mm: number; isMajor: boolean }

function buildTicks(spanPx: number, zoom: number): Tick[] {
  const pxPerMm = PX_PER_MM * zoom;
  const tickMm = pxPerMm >= 30 ? 1 : pxPerMm >= 12 ? 5 : 10;
  const majorEvery = tickMm * 5;
  const count = Math.ceil(spanPx / (pxPerMm * tickMm)) + 2;
  const result: Tick[] = [];
  for (let i = 0; i < count; i++) {
    const mm = i * tickMm;
    const px = mm * pxPerMm;
    result.push({ px, mm, isMajor: mm % majorEvery === 0 });
  }
  return result;
}

export default function RulerOverlay() {
  const { zoom, showRulers } = useEditorStore();
  const hTicks = useMemo(() => buildTicks(2400, zoom), [zoom]);
  const vTicks = useMemo(() => buildTicks(1800, zoom), [zoom]);

  if (!showRulers) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
      {/* Horizontal ruler */}
      <svg className="absolute top-0 left-0" width="100%" height={RULER_SIZE} style={{ display: 'block' }}>
        <rect width="100%" height={RULER_SIZE} fill="#111118" />
        <line x1={0} y1={RULER_SIZE - 0.5} x2="100%" y2={RULER_SIZE - 0.5} stroke="#242432" strokeWidth={1} />
        {hTicks.map(({ px, mm, isMajor }) => {
          const x = px + RULER_SIZE;
          return (
            <g key={mm}>
              <line x1={x} y1={RULER_SIZE} x2={x} y2={isMajor ? 7 : 13} stroke="#4B4B5F" strokeWidth={0.75} />
              {isMajor && (
                <text x={x + 2} y={8} fontSize={7} fill="#6B6B84" fontFamily="monospace">{mm}</text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Vertical ruler */}
      <svg className="absolute top-0 left-0" width={RULER_SIZE} height="100%" style={{ display: 'block' }}>
        <rect width={RULER_SIZE} height="100%" fill="#111118" />
        <line x1={RULER_SIZE - 0.5} y1={0} x2={RULER_SIZE - 0.5} y2="100%" stroke="#242432" strokeWidth={1} />
        {vTicks.map(({ px, mm, isMajor }) => {
          const y = px + RULER_SIZE;
          return (
            <g key={mm}>
              <line x1={RULER_SIZE} y1={y} x2={isMajor ? 7 : 13} y2={y} stroke="#4B4B5F" strokeWidth={0.75} />
              {isMajor && (
                <text
                  transform={`translate(9, ${y + 1}) rotate(-90)`}
                  fontSize={7} fill="#6B6B84" fontFamily="monospace" textAnchor="middle"
                >
                  {mm}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Corner square */}
      <div
        className="absolute top-0 left-0 bg-forge-bg border-r border-b border-forge-border"
        style={{ width: RULER_SIZE, height: RULER_SIZE }}
      />
    </div>
  );
}
