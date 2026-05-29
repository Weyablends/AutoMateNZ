'use client';
import { useState } from 'react';
import {
  X, CheckCircle2, AlertTriangle, XCircle, Info,
  ChevronDown, ChevronRight, Wrench, Download, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPreflightItems } from '@/lib/mockData';
import { runPreflight } from '@/lib/preflightEngine';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import type { PreflightItem, PreflightStatus } from '@/lib/types';

const MM_TO_PX = 3.78;
const PADDING = 80;

function StatusIcon({ status }: { status: PreflightStatus }) {
  switch (status) {
    case 'pass':    return <CheckCircle2 className="w-4 h-4 text-forge-success shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-forge-warning shrink-0" />;
    case 'fail':    return <XCircle className="w-4 h-4 text-forge-error shrink-0" />;
    case 'info':    return <Info className="w-4 h-4 text-forge-info shrink-0" />;
  }
}

function PreflightRow({ item, onFix }: { item: PreflightItem; onFix?: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={cn('border rounded-lg overflow-hidden', {
      'border-green-500/20 bg-green-500/5':   item.status === 'pass',
      'border-yellow-500/20 bg-yellow-500/5': item.status === 'warning',
      'border-red-500/20 bg-red-500/5':       item.status === 'fail',
      'border-blue-500/20 bg-blue-500/5':     item.status === 'info',
    })}>
      <div className="flex items-start gap-3 p-3">
        <StatusIcon status={item.status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-forge-text">{item.label}</span>
            <span className="text-2xs text-forge-dim">{item.category}</span>
          </div>
          <p className="text-xs text-forge-muted mt-0.5">{item.message}</p>
        </div>
        {item.fixable && onFix && (
          <Button
            variant="outline"
            size="xs"
            icon={<Wrench className="w-3 h-3" />}
            onClick={() => onFix(item.id)}
            className="shrink-0"
          >
            Fix
          </Button>
        )}
        {item.detail && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-forge-dim hover:text-forge-muted p-0.5 shrink-0"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
      {expanded && item.detail && (
        <div className="px-4 pb-3 pt-0">
          <p className="text-xs text-forge-muted leading-relaxed bg-forge-panel rounded-lg p-2.5 border border-forge-border">
            {item.detail}
          </p>
        </div>
      )}
    </div>
  );
}

interface Props {
  onClose: () => void;
  onExport: () => void;
  fabricRef: React.MutableRefObject<any>;
}

export default function PreflightPanel({ onClose, onExport, fabricRef }: Props) {
  const { templateAnalysis, setExportOptions } = useEditorStore();
  const [filter, setFilter] = useState('all' as PreflightStatus | 'all');

  function computeItems(): PreflightItem[] {
    const canvas = fabricRef.current;
    if (!canvas || !templateAnalysis) return mockPreflightItems;
    const acked = templateAnalysis.instructions.filter((i) => i.acknowledged).length;
    return runPreflight(canvas, templateAnalysis, acked);
  }

  const [allItems, setAllItems] = useState(() => computeItems());

  function refresh() {
    setAllItems(computeItems());
  }

  async function applyFix(itemId: string) {
    const canvas = fabricRef.current;
    if (!canvas || !templateAnalysis) return;

    const dims = templateAnalysis.dimensions;
    const bleed = templateAnalysis.bleed;
    const safe = templateAnalysis.safeZone;
    const labelX = PADDING;
    const labelY = PADDING;
    const labelW = dims.width * MM_TO_PX;
    const labelH = dims.height * MM_TO_PX;
    const safeX = labelX + safe.left * MM_TO_PX;
    const safeY = labelY + safe.top * MM_TO_PX;
    const safeW = labelW - (safe.left + safe.right) * MM_TO_PX;
    const safeH = labelH - (safe.top + safe.bottom) * MM_TO_PX;

    const artObjects = canvas.getObjects().filter((o: any) => o.data?.type !== 'guide' && o.data?.type !== 'grid');

    switch (itemId) {
      case 'pf-bleed-art': {
        const { fabric } = await import('fabric');
        const bg = new fabric.Rect({
          left: labelX - bleed.left * MM_TO_PX,
          top: labelY - bleed.top * MM_TO_PX,
          width: labelW + (bleed.left + bleed.right) * MM_TO_PX,
          height: labelH + (bleed.top + bleed.bottom) * MM_TO_PX,
          fill: '#FFFFFF',
          data: { id: `bg-bleed-${Date.now()}`, layer: 'artwork' },
        });
        canvas.add(bg);
        canvas.sendToBack(bg);
        canvas.getObjects()
          .filter((o: any) => o.data?.type === 'guide' || o.data?.type === 'grid')
          .forEach((o: any) => canvas.sendToBack(o));
        canvas.renderAll();
        break;
      }

      case 'pf-safe-text': {
        const textObjs = artObjects.filter((o: any) => o.type === 'text' || o.type === 'i-text');
        textObjs.forEach((o: any) => {
          const b = o.getBoundingRect(true);
          let newLeft = o.left ?? 0;
          let newTop = o.top ?? 0;
          if (b.left < safeX) newLeft += safeX - b.left + 2;
          if (b.top < safeY) newTop += safeY - b.top + 2;
          if (b.left + b.width > safeX + safeW) newLeft -= (b.left + b.width) - (safeX + safeW) + 2;
          if (b.top + b.height > safeY + safeH) newTop -= (b.top + b.height) - (safeY + safeH) + 2;
          o.set({ left: newLeft, top: newTop });
        });
        canvas.renderAll();
        break;
      }

      case 'pf-safe-img': {
        const imgObjs = artObjects.filter((o: any) => o.type === 'image' || (o.type === 'group' && o.data?.name !== 'EAN-13 Barcode'));
        imgObjs.forEach((o: any) => {
          const b = o.getBoundingRect(true);
          let newLeft = o.left ?? 0;
          let newTop = o.top ?? 0;
          if (b.left < safeX) newLeft += safeX - b.left + 2;
          if (b.top < safeY) newTop += safeY - b.top + 2;
          o.set({ left: newLeft, top: newTop });
        });
        canvas.renderAll();
        break;
      }

      case 'pf-colour-rgb': {
        // Flag objects with RGB-only fills by adding a visual highlight; user must remap manually
        break;
      }

      case 'pf-fontsize': {
        const MIN_PX = 6 * 1.333;
        artObjects
          .filter((o: any) => (o.type === 'text' || o.type === 'i-text') && (o.fontSize || 12) < MIN_PX)
          .forEach((o: any) => o.set({ fontSize: Math.ceil(MIN_PX) }));
        canvas.renderAll();
        break;
      }

      case 'pf-fonts': {
        setExportOptions({ outlineFonts: true });
        break;
      }

      case 'pf-barcode': {
        (window as any).__lf_addBarcode?.();
        break;
      }

      case 'pf-barcode-qz': {
        const barcodes = artObjects.filter((o: any) => o.data?.layer === 'barcode' || o.data?.name?.toLowerCase().includes('barcode'));
        if (barcodes.length) {
          const bc = barcodes[0];
          const minQZ = 5 * MM_TO_PX;
          const bcW = bc.getScaledWidth();
          let newLeft = bc.left ?? 0;
          if (newLeft - labelX < minQZ) newLeft = labelX + minQZ;
          if ((labelX + labelW) - (newLeft + bcW) < minQZ) newLeft = labelX + labelW - bcW - minQZ;
          bc.set({ left: newLeft });
          canvas.renderAll();
        }
        break;
      }

      case 'pf-nutrition': {
        (window as any).__lf_addNutritionPanel?.({});
        break;
      }

      case 'pf-origin': {
        const { fabric } = await import('fabric');
        const t = new fabric.IText('Made in New Zealand', {
          left: labelX + 10,
          top: labelY + labelH - 20,
          fontSize: 8, fill: '#000000', fontFamily: 'Inter, sans-serif',
          data: { id: `text-origin-${Date.now()}`, layer: 'text' },
        });
        canvas.add(t);
        canvas.setActiveObject(t);
        canvas.renderAll();
        break;
      }
    }

    refresh();
  }

  const items = filter === 'all' ? allItems : allItems.filter((i) => i.status === filter);

  const counts = {
    pass:    allItems.filter((i) => i.status === 'pass').length,
    warning: allItems.filter((i) => i.status === 'warning').length,
    fail:    allItems.filter((i) => i.status === 'fail').length,
    info:    allItems.filter((i) => i.status === 'info').length,
  };

  const canExport = counts.fail === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-forge-border shrink-0">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-forge-text">Preflight Check</h2>
            <p className="text-xs text-forge-muted">Review all issues before exporting your print-ready file</p>
          </div>
          <button
            onClick={refresh}
            title="Re-run preflight"
            className="p-1.5 rounded-lg hover:bg-forge-panel text-forge-muted hover:text-forge-text transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-forge-panel text-forge-muted hover:text-forge-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary bar */}
        <div className="flex gap-2 px-5 py-3 border-b border-forge-border bg-forge-panel/30 shrink-0 flex-wrap">
          {([
            { status: 'pass' as const,    label: 'Pass',    color: 'text-forge-success', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            { status: 'warning' as const, label: 'Warning', color: 'text-forge-warning', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
            { status: 'fail' as const,    label: 'Fail',    color: 'text-forge-error',   icon: <XCircle className="w-3.5 h-3.5" /> },
            { status: 'info' as const,    label: 'Info',    color: 'text-forge-info',    icon: <Info className="w-3.5 h-3.5" /> },
          ]).map(({ status, label, color, icon }) => (
            <button
              key={status}
              onClick={() => setFilter(filter === status ? 'all' : status)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                filter === status
                  ? `${color} bg-forge-panel border-current`
                  : 'text-forge-muted border-forge-border hover:border-forge-border-light'
              )}
            >
              <span className={color}>{icon}</span>
              {counts[status]} {label}
            </button>
          ))}
          <button
            onClick={() => setFilter('all')}
            className={cn('ml-auto px-3 py-1.5 rounded-lg text-xs transition-all border',
              filter === 'all'
                ? 'bg-forge-panel border-forge-accent text-forge-accent'
                : 'text-forge-muted border-forge-border hover:text-forge-text'
            )}
          >
            All ({allItems.length})
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {items.map((item) => (
            <PreflightRow key={item.id} item={item} onFix={applyFix} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-forge-border bg-forge-panel/20 shrink-0">
          {canExport ? (
            <p className="text-xs text-forge-success flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              No critical errors — ready to export
            </p>
          ) : (
            <p className="text-xs text-forge-error flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              {counts.fail} critical error{counts.fail !== 1 ? 's' : ''} must be resolved
            </p>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={onExport}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
