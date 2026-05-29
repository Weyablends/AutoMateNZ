'use client';
import {
  MousePointer2, Hand, Type, Square, Circle, Pen,
  Image as ImageIcon, Barcode, Table2, ZoomIn, ZoomOut, QrCode,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import type { ToolMode } from '@/lib/types';
import { useRef } from 'react';

const TOOLS: { mode: ToolMode; icon: React.ReactNode; label: string; shortcut?: string }[] = [
  { mode: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select / Move', shortcut: 'V' },
  { mode: 'pan', icon: <Hand className="w-4 h-4" />, label: 'Pan Canvas', shortcut: 'H' },
  { mode: 'text', icon: <Type className="w-4 h-4" />, label: 'Text', shortcut: 'T' },
  { mode: 'rect', icon: <Square className="w-4 h-4" />, label: 'Rectangle', shortcut: 'R' },
  { mode: 'ellipse', icon: <Circle className="w-4 h-4" />, label: 'Ellipse', shortcut: 'E' },
  { mode: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Pen Tool', shortcut: 'P' },
];

const SPECIAL_TOOLS: { label: string; icon: React.ReactNode; action: string }[] = [
  { label: 'Place Image', icon: <ImageIcon className="w-3.5 h-3.5" />, action: 'image' },
  { label: 'Add Barcode', icon: <Barcode className="w-3.5 h-3.5" />, action: 'barcode' },
  { label: 'QR Code', icon: <QrCode className="w-3.5 h-3.5" />, action: 'qr' },
  { label: 'Nutrition Panel', icon: <Table2 className="w-3.5 h-3.5" />, action: 'nutrition' },
];

export default function ToolsPanel() {
  const { activeTool, setActiveTool, setQrModalOpen, zoom, setZoom } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSpecialTool(action: string) {
    if (action === 'image') {
      fileInputRef.current?.click();
    } else if (action === 'barcode') {
      (window as any).__lf_addBarcode?.();
    } else if (action === 'qr') {
      setQrModalOpen(true);
    } else if (action === 'nutrition') {
      (window as any).__lf_addNutritionPanel?.({});
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    if (file.type === 'image/svg+xml') {
      reader.onload = (ev) => (window as any).__lf_addSVG?.(ev.target?.result as string, file.name);
      reader.readAsText(file);
    } else {
      reader.onload = (ev) => (window as any).__lf_addImage?.(ev.target?.result as string, file.name);
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Main tools */}
      <div className="flex flex-col gap-0.5">
        {TOOLS.map((tool) => (
          <Tooltip key={tool.mode} content={`${tool.label}${tool.shortcut ? ` (${tool.shortcut})` : ''}`} side="right">
            <button
              onClick={() => setActiveTool(tool.mode)}
              className={cn(
                'flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs transition-all',
                activeTool === tool.mode
                  ? 'bg-forge-accent/20 text-forge-accent'
                  : 'text-forge-muted hover:bg-forge-panel hover:text-forge-text'
              )}
            >
              {tool.icon}
              <span>{tool.label}</span>
              {tool.shortcut && (
                <kbd className="ml-auto text-2xs bg-forge-border/60 px-1 rounded text-forge-dim">{tool.shortcut}</kbd>
              )}
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="h-px bg-forge-border my-1" />

      {/* Special tools */}
      <p className="px-2.5 text-2xs text-forge-dim uppercase tracking-wider mb-1">Insert</p>
      {SPECIAL_TOOLS.map((tool) => (
        <button
          key={tool.action}
          onClick={() => handleSpecialTool(tool.action)}
          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs text-forge-muted hover:bg-forge-panel hover:text-forge-text transition-all"
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}

      <div className="h-px bg-forge-border my-1" />

      {/* Zoom */}
      <p className="px-2.5 text-2xs text-forge-dim uppercase tracking-wider mb-1">Zoom</p>
      <button
        onClick={() => setZoom(Math.min(5, zoom * 1.25))}
        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs text-forge-muted hover:bg-forge-panel hover:text-forge-text transition-all"
      >
        <ZoomIn className="w-3.5 h-3.5" /> Zoom In
      </button>
      <button
        onClick={() => setZoom(Math.max(0.1, zoom / 1.25))}
        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs text-forge-muted hover:bg-forge-panel hover:text-forge-text transition-all"
      >
        <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
      </button>
      <button
        onClick={() => setZoom(1)}
        className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs text-forge-muted hover:bg-forge-panel hover:text-forge-text transition-all"
      >
        <span className="w-3.5 h-3.5 text-center text-2xs font-bold">1:1</span> Reset Zoom
      </button>
    </div>
  );
}
