'use client';
import { useState } from 'react';
import { Move, RotateCw, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

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
    <div className="flex items-center gap-2 bg-forge-panel border border-forge-border rounded-lg px-2 py-1.5 focus-within:border-forge-accent transition-colors">
      <div className="w-4 h-4 rounded shrink-0 border border-forge-border" style={{ background: color }} />
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-xs text-forge-text font-mono focus:outline-none min-w-0"
      />
      <input
        type="color"
        value={color.startsWith('#') ? color : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-5 h-5 rounded cursor-pointer border-0 p-0 opacity-0 absolute"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}

export default function PropertiesPanel({ fabricRef }: { fabricRef: React.MutableRefObject<any> }) {
  const { selectedProperties } = useEditorStore();
  const [colorMode, setColorMode] = useState<'hex' | 'cmyk'>('hex');

  function updateProp(key: string, value: any) {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const obj = canvas.getActiveObject();
    if (!obj) return;
    if (key === 'x') obj.set('left', value);
    else if (key === 'y') obj.set('top', value);
    else if (key === 'width') obj.scaleToWidth(Math.max(1, value));
    else if (key === 'height') obj.scaleToHeight(Math.max(1, value));
    else if (key === 'rotation') obj.set('angle', value);
    else if (key === 'opacity') obj.set('opacity', value / 100);
    else if (key === 'fill') obj.set('fill', value);
    else if (key === 'stroke') obj.set('stroke', value);
    else if (key === 'strokeWidth') obj.set('strokeWidth', value);
    else if (key === 'fontSize') obj.set('fontSize', value);
    else if (key === 'fontWeight') obj.set('fontWeight', value);
    canvas.renderAll();
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
          <NumberInput label="Rotation" value={p.rotation} unit="°" onChange={(v) => updateProp('rotation', v)} />
          <NumberInput label="Opacity" value={Math.round(p.opacity * 100)} unit="%" onChange={(v) => updateProp('opacity', v)} />
        </div>
      </div>

      {/* Appearance */}
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
          <ColorSwatch color={p.fill || 'transparent'} onChange={(v) => updateProp('fill', v)} />
        </div>
        <div className="space-y-1.5">
          <Label>Stroke</Label>
          <ColorSwatch color={p.stroke || 'transparent'} onChange={(v) => updateProp('stroke', v)} />
          <NumberInput label="Stroke width" value={p.strokeWidth} unit="px" onChange={(v) => updateProp('strokeWidth', v)} step={0.5} />
        </div>
      </div>

      {/* Text properties */}
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
              { icon: <Bold className="w-3 h-3" />, action: () => updateProp('fontWeight', p.fontWeight === 'bold' ? 'normal' : 'bold'), active: p.fontWeight === 'bold' },
              { icon: <Italic className="w-3 h-3" />, action: () => {}, active: false },
              { icon: <Underline className="w-3 h-3" />, action: () => {}, active: false },
              { icon: <AlignLeft className="w-3 h-3" />, action: () => updateProp('textAlign', 'left'), active: false },
              { icon: <AlignCenter className="w-3 h-3" />, action: () => updateProp('textAlign', 'center'), active: false },
              { icon: <AlignRight className="w-3 h-3" />, action: () => updateProp('textAlign', 'right'), active: false },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={btn.action}
                className={cn('flex-1 py-1.5 rounded border text-xs flex items-center justify-center transition-all',
                  btn.active ? 'bg-forge-accent/20 border-forge-accent text-forge-accent' : 'border-forge-border text-forge-muted hover:bg-forge-panel hover:text-forge-text'
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
