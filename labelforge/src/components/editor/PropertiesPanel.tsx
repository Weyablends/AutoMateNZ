'use client';
import { useState } from 'react';
import { Move, RotateCw, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { hexToCmyk, cmykToHex } from '@/lib/colorUtils';
import { cn } from '@/lib/utils';
import type { ObjectProperties } from '@/lib/types';

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-2xs text-forge-dim uppercase tracking-wider">{children}</span>;
}

function NumberInput({
  label, value, unit = '', onChange, step = 1,
}: {
  label: string; value: number; unit?: string; onChange: (v: number) => void; step?: number;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Label>{label}</Label>
      <div className="flex items-center bg-forge-panel border border-forge-border rounded-lg overflow-hidden focus-within:border-forge-accent transition-colors">
        <input
          type="number"
          value={Math.round(value)}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-2 py-1.5 text-xs text-forge-text min-w-0 focus:outline-none"
        />
        {unit && <span className="pr-2 text-2xs text-forge-dim shrink-0">{unit}</span>}
      </div>
    </div>
  );
}

function ColorSwatch({ color, onChange }: { color: string; onChange: (v: string) => void }) {
  return (
    <div className="relative flex items-center gap-2 bg-forge-panel border border-forge-border rounded-lg px-2 py-1.5 focus-within:border-forge-accent transition-colors">
      <label className="w-4 h-4 rounded shrink-0 border border-forge-border cursor-pointer overflow-hidden" style={{ background: color }}>
        <input
          type="color"
          value={color.startsWith('#') && color.length === 7 ? color : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="opacity-0 w-full h-full cursor-pointer"
        />
      </label>
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-xs text-forge-text font-mono focus:outline-none min-w-0"
      />
    </div>
  );
}

function CmykSliders({ hex, onChange }: { hex: string; onChange: (hex: string) => void }) {
  const cmyk = hexToCmyk(hex) || { c: 0, m: 0, y: 0, k: 0 };
  const channels = ['c', 'm', 'y', 'k'] as const;
  const labels = { c: 'C', m: 'M', y: 'Y', k: 'K' };
  const colors = { c: '#00BFFF', m: '#FF69B4', y: '#FFD700', k: '#888' };
  return (
    <div className="space-y-1.5">
      {channels.map((ch) => (
        <div key={ch} className="flex items-center gap-2">
          <span className="w-3.5 text-2xs font-bold shrink-0" style={{ color: colors[ch] }}>{labels[ch]}</span>
          <input
            type="range" min={0} max={100} step={1}
            value={cmyk[ch]}
            onChange={(e) => {
              const updated = { ...cmyk, [ch]: Number(e.target.value) };
              onChange(cmykToHex(updated.c, updated.m, updated.y, updated.k));
            }}
            className="flex-1 h-1.5 accent-forge-accent cursor-pointer"
          />
          <span className="w-7 text-right text-2xs text-forge-dim font-mono shrink-0">{cmyk[ch]}%</span>
        </div>
      ))}
    </div>
  );
}

export default function PropertiesPanel({ fabricRef }: { fabricRef: React.MutableRefObject<any> }) {
  const { selectedProperties, setSelectedObject } = useEditorStore();
  const [colorMode, setColorMode] = useState('hex' as 'hex' | 'cmyk');

  function readObjProps(obj: any): ObjectProperties {
    return {
      id: obj.data?.id || 'obj',
      type: (obj.type === 'i-text' || obj.type === 'text') ? 'text' : obj.type,
      x: Math.round(obj.left ?? 0),
      y: Math.round(obj.top ?? 0),
      width: Math.round((obj.width ?? 0) * (obj.scaleX ?? 1)),
      height: Math.round((obj.height ?? 0) * (obj.scaleY ?? 1)),
      rotation: Math.round(obj.angle ?? 0),
      opacity: Math.round((obj.opacity ?? 1) * 100) / 100,
      fill: typeof obj.fill === 'string' ? obj.fill : '#000000',
      stroke: typeof obj.stroke === 'string' ? obj.stroke : 'transparent',
      strokeWidth: obj.strokeWidth ?? 0,
      fontSize: obj.fontSize,
      fontFamily: obj.fontFamily,
      fontWeight: obj.fontWeight,
      fontStyle: obj.fontStyle,
      underline: obj.underline,
      textAlign: obj.textAlign,
      text: obj.text,
    };
  }

  function updateProp(key: string, value: any) {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;

    if (key === 'x')           obj.set('left', value);
    else if (key === 'y')      obj.set('top', value);
    else if (key === 'width')  obj.scaleToWidth(Math.max(1, value));
    else if (key === 'height') obj.scaleToHeight(Math.max(1, value));
    else                       obj.set(key, key === 'opacity' ? value / 100 : value);

    canvas.renderAll();
    setSelectedObject(obj.data?.id || 'obj', readObjProps(obj));
  }

  if (!selectedProperties) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3">
        <div className="w-12 h-12 rounded-xl bg-forge-panel border border-forge-border flex items-center justify-center">
          <Move className="w-5 h-5 text-forge-dim" />
        </div>
        <div>
          <p className="text-xs font-medium text-forge-muted mb-1">No selection</p>
          <p className="text-2xs text-forge-dim leading-relaxed">Select an object on the canvas to edit its properties</p>
        </div>
      </div>
    );
  }

  const p = selectedProperties;
  const isText = p.type === 'text';

  return (
    <div className="flex flex-col gap-0 overflow-y-auto">
      {/* Object type header */}
      <div className="px-3 py-2.5 border-b border-forge-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-sm bg-forge-accent" />
        <span className="text-xs font-medium text-forge-text capitalize">{p.type}</span>
        <span className="ml-auto text-2xs text-forge-dim font-mono">{p.id?.substring(0, 8)}</span>
      </div>

      {/* Transform */}
      <div className="px-3 py-3 border-b border-forge-border space-y-2">
        <Label>Position & Size</Label>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={p.x} unit="px" onChange={(v) => updateProp('x', v)} />
          <NumberInput label="Y" value={p.y} unit="px" onChange={(v) => updateProp('y', v)} />
          <NumberInput label="W" value={p.width} unit="px" onChange={(v) => updateProp('width', v)} />
          <NumberInput label="H" value={p.height} unit="px" onChange={(v) => updateProp('height', v)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Rotation" value={p.rotation} unit="deg" onChange={(v) => updateProp('angle', v)} />
          <NumberInput label="Opacity" value={Math.round(p.opacity * 100)} unit="%" onChange={(v) => updateProp('opacity', v)} />
        </div>
      </div>

      {/* Colour */}
      <div className="px-3 py-3 border-b border-forge-border space-y-2.5">
        <div className="flex items-center justify-between">
          <Label>Colour</Label>
          <div className="flex gap-0.5">
            {(['hex', 'cmyk'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setColorMode(mode)}
                className={cn('px-1.5 py-0.5 rounded text-2xs transition-all uppercase',
                  colorMode === mode ? 'bg-forge-accent text-white' : 'text-forge-dim hover:text-forge-muted'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Fill</Label>
          {colorMode === 'cmyk' && p.fill?.startsWith('#') ? (
            <CmykSliders hex={p.fill} onChange={(hex) => updateProp('fill', hex)} />
          ) : (
            <ColorSwatch color={p.fill || 'transparent'} onChange={(v) => updateProp('fill', v)} />
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Stroke</Label>
          <ColorSwatch color={p.stroke || 'transparent'} onChange={(v) => updateProp('stroke', v)} />
          <NumberInput label="Stroke width" value={p.strokeWidth} unit="px" onChange={(v) => updateProp('strokeWidth', v)} step={0.5} />
        </div>
      </div>

      {/* Typography */}
      {isText && (
        <div className="px-3 py-3 border-b border-forge-border space-y-2.5">
          <Label>Typography</Label>
          <div className="flex flex-col gap-1.5">
            <Label>Font family</Label>
            <select
              value={p.fontFamily || 'Inter'}
              onChange={(e) => updateProp('fontFamily', e.target.value)}
              className="w-full bg-forge-panel border border-forge-border rounded-lg px-2 py-1.5 text-xs text-forge-text focus:outline-none focus:border-forge-accent"
            >
              {['Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'JetBrains Mono', 'Courier New'].map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <NumberInput label="Font size" value={p.fontSize || 16} unit="pt" onChange={(v) => updateProp('fontSize', v)} />
          <div className="flex gap-1">
            {[
              {
                icon: <Bold className="w-3 h-3" />,
                action: () => updateProp('fontWeight', p.fontWeight === 'bold' ? 'normal' : 'bold'),
                active: p.fontWeight === 'bold',
              },
              {
                icon: <Italic className="w-3 h-3" />,
                action: () => updateProp('fontStyle', p.fontStyle === 'italic' ? 'normal' : 'italic'),
                active: p.fontStyle === 'italic',
              },
              {
                icon: <Underline className="w-3 h-3" />,
                action: () => updateProp('underline', !p.underline),
                active: !!p.underline,
              },
              {
                icon: <AlignLeft className="w-3 h-3" />,
                action: () => updateProp('textAlign', 'left'),
                active: (p.textAlign || 'left') === 'left',
              },
              {
                icon: <AlignCenter className="w-3 h-3" />,
                action: () => updateProp('textAlign', 'center'),
                active: p.textAlign === 'center',
              },
              {
                icon: <AlignRight className="w-3 h-3" />,
                action: () => updateProp('textAlign', 'right'),
                active: p.textAlign === 'right',
              },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={cn(
                  'flex-1 py-1.5 rounded border text-xs flex items-center justify-center transition-all',
                  btn.active
                    ? 'bg-forge-accent/20 border-forge-accent text-forge-accent'
                    : 'border-forge-border text-forge-muted hover:bg-forge-panel hover:text-forge-text'
                )}
              >
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layer assignment */}
      <div className="px-3 py-3 space-y-2">
        <Label>Layer</Label>
        <select
          value={p.layer || 'artwork'}
          className="w-full bg-forge-panel border border-forge-border rounded-lg px-2 py-1.5 text-xs text-forge-text focus:outline-none focus:border-forge-accent"
        >
          {['artwork', 'text', 'images', 'barcode'].map((l) => (
            <option key={l} value={l} className="capitalize">{l}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
