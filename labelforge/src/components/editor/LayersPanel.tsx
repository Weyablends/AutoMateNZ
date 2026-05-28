'use client';
import { Eye, EyeOff, Lock, Unlock, GripVertical, Layers } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

const LAYER_ICONS: Record<string, string> = {
  template: '⊞', dieline: '✂', artwork: '◆', image: '🖼', text: 'T', barcode: '▦', guide: '⊡',
};

const LAYER_COLORS: Record<string, string> = {
  template: '#6B6B84', dieline: '#FF3B30', artwork: '#5B7FFF', image: '#F59E0B', text: '#3DD68C', barcode: '#38BDF8',
};

export default function LayersPanel() {
  const { layers, toggleLayerVisibility, toggleLayerLock } = useEditorStore();

  return (
    <div className="flex flex-col">
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-forge-muted" />
        <span className="text-xs font-medium text-forge-text">Layers</span>
      </div>

      <div className="flex flex-col gap-0.5 px-1.5 pb-2">
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={cn(
              'group flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all cursor-default',
              'hover:bg-forge-panel border border-transparent hover:border-forge-border'
            )}
          >
            <GripVertical className="w-3 h-3 text-forge-border group-hover:text-forge-dim shrink-0" />
            <div
              className="w-2 h-2 rounded-sm shrink-0"
              style={{ background: LAYER_COLORS[layer.type] || '#6B6B84' }}
            />
            <span className="text-xs text-forge-muted shrink-0 w-3 text-center">
              {LAYER_ICONS[layer.type] || '◯'}
            </span>
            <span className={cn('flex-1 text-xs truncate', layer.visible ? 'text-forge-text' : 'text-forge-dim')}>
              {layer.name}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => toggleLayerVisibility(layer.id)}
                className="p-0.5 rounded hover:bg-forge-border transition-colors"
                title={layer.visible ? 'Hide layer' : 'Show layer'}
              >
                {layer.visible
                  ? <Eye className="w-3 h-3 text-forge-muted" />
                  : <EyeOff className="w-3 h-3 text-forge-dim" />}
              </button>
              <button
                onClick={() => toggleLayerLock(layer.id)}
                className="p-0.5 rounded hover:bg-forge-border transition-colors"
                title={layer.locked ? 'Unlock layer' : 'Lock layer'}
              >
                {layer.locked
                  ? <Lock className="w-3 h-3 text-forge-warning" />
                  : <Unlock className="w-3 h-3 text-forge-muted" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-3 h-px bg-forge-border" />

      {/* Guide legend */}
      <div className="px-3 py-2">
        <p className="text-2xs text-forge-dim uppercase tracking-wider mb-2">Guide Colours</p>
        {[
          { color: '#FF6B35', label: 'Bleed boundary' },
          { color: '#FF3B30', label: 'Trim / Dieline' },
          { color: '#34C759', label: 'Safe zone' },
          { color: '#5B7FFF', label: 'Barcode zone' },
          { color: '#9D9EA0', label: 'Silver foil zone' },
        ].map((g) => (
          <div key={g.label} className="flex items-center gap-2 py-0.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: g.color }} />
            <span className="text-2xs text-forge-dim">{g.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
