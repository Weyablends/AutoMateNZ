'use client';
import { useRouter } from 'next/navigation';
import {
  Tag, ChevronLeft, Undo2, Redo2, ZoomIn, ZoomOut, Grid3X3, Ruler,
  Eye, EyeOff, Download, AlertCircle, CheckCircle2, Magnet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

interface Props {
  fabricRef: React.MutableRefObject<any>;
  onExport: () => void;
}

export default function TopBar({ fabricRef, onExport }: Props) {
  const router = useRouter();
  const {
    templateAnalysis, zoom, setZoom, showGrid, showRulers, showGuides, snapToGrid,
    toggleGrid, toggleRulers, toggleGuides, toggleSnap,
    historyIndex, historyLength, setPreflightOpen,
  } = useEditorStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyLength - 1;

  function undo() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    // Triggered via keydown also, this is the button fallback
    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true });
    window.dispatchEvent(event);
  }
  function redo() {
    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: true, bubbles: true });
    window.dispatchEvent(event);
  }

  const unackedCritical = templateAnalysis?.instructions.filter((i) => i.priority === 'critical' && !i.acknowledged).length ?? 0;
  const unackedTotal = templateAnalysis?.instructions.filter((i) => !i.acknowledged).length ?? 0;
  const preflightIssues = unackedCritical > 0 ? unackedCritical : unackedTotal;

  return (
    <header className="h-11 bg-forge-surface border-b border-forge-border flex items-center px-3 gap-2 shrink-0 select-none">
      {/* Logo / Back */}
      <div className="flex items-center gap-1.5 mr-2">
        <button
          onClick={() => router.push('/analyze')}
          className="flex items-center gap-1.5 text-forge-muted hover:text-forge-text transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <div className="w-5 h-5 rounded bg-forge-accent flex items-center justify-center">
            <Tag className="w-3 h-3 text-white" />
          </div>
        </button>
      </div>

      <div className="h-4 w-px bg-forge-border" />

      {/* File name */}
      <span className="text-xs text-forge-muted truncate max-w-[160px]">
        {(templateAnalysis?.fileName ?? 'Untitled Label').replace(/\.[^.]+$/, '')}
      </span>

      <div className="h-4 w-px bg-forge-border mx-1" />

      {/* Undo/Redo */}
      <Tooltip content="Undo (⌘Z)" side="bottom">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded hover:bg-forge-panel text-forge-muted hover:text-forge-text disabled:opacity-30 transition-all"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
      </Tooltip>
      <Tooltip content="Redo (⌘⇧Z)" side="bottom">
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded hover:bg-forge-panel text-forge-muted hover:text-forge-text disabled:opacity-30 transition-all"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-forge-border mx-1" />

      {/* Zoom controls */}
      <Tooltip content="Zoom out" side="bottom">
        <button
          onClick={() => setZoom(zoom / 1.25)}
          className="p-1.5 rounded hover:bg-forge-panel text-forge-muted hover:text-forge-text transition-all"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </Tooltip>
      <button
        onClick={() => setZoom(1)}
        className="px-2 py-1 rounded hover:bg-forge-panel text-xs text-forge-text font-mono min-w-[52px] text-center transition-all"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Tooltip content="Zoom in" side="bottom">
        <button
          onClick={() => setZoom(zoom * 1.25)}
          className="p-1.5 rounded hover:bg-forge-panel text-forge-muted hover:text-forge-text transition-all"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
      </Tooltip>

      <div className="h-4 w-px bg-forge-border mx-1" />

      {/* View toggles */}
      <div className="flex items-center gap-0.5">
        <Tooltip content={`${showGrid ? 'Hide' : 'Show'} grid`} side="bottom">
          <button
            onClick={toggleGrid}
            className={cn('p-1.5 rounded transition-all', showGrid ? 'bg-forge-accent/20 text-forge-accent' : 'hover:bg-forge-panel text-forge-dim hover:text-forge-muted')}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        <Tooltip content={`${showRulers ? 'Hide' : 'Show'} rulers`} side="bottom">
          <button
            onClick={toggleRulers}
            className={cn('p-1.5 rounded transition-all', showRulers ? 'bg-forge-accent/20 text-forge-accent' : 'hover:bg-forge-panel text-forge-dim hover:text-forge-muted')}
          >
            <Ruler className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
        <Tooltip content={`${showGuides ? 'Hide' : 'Show'} guides`} side="bottom">
          <button
            onClick={toggleGuides}
            className={cn('p-1.5 rounded transition-all', showGuides ? 'bg-forge-accent/20 text-forge-accent' : 'hover:bg-forge-panel text-forge-dim hover:text-forge-muted')}
          >
            {showGuides ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>
        <Tooltip content={`Snap to grid: ${snapToGrid ? 'on' : 'off'}`} side="bottom">
          <button
            onClick={toggleSnap}
            className={cn('p-1.5 rounded transition-all', snapToGrid ? 'bg-forge-accent/20 text-forge-accent' : 'hover:bg-forge-panel text-forge-dim hover:text-forge-muted')}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      <div className="flex-1" />

      {/* Preflight */}
      <button
        onClick={() => setPreflightOpen(true)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
          preflightIssues > 0
            ? 'bg-forge-warning-muted border border-forge-warning/30 text-forge-warning hover:bg-forge-warning-muted/70'
            : 'bg-forge-success-muted border border-forge-success/30 text-forge-success hover:bg-forge-success-muted/70'
        )}
      >
        {preflightIssues > 0 ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        Preflight {preflightIssues > 0 ? `(${preflightIssues})` : 'Ready'}
      </button>

      <Button
        variant="primary"
        size="sm"
        icon={<Download className="w-3.5 h-3.5" />}
        onClick={onExport}
      >
        Export
      </Button>
    </header>
  );
}
