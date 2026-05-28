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

function StatusIcon({ status }: { status: PreflightStatus }) {
  switch (status) {
    case 'pass':    return <CheckCircle2 className="w-4 h-4 text-forge-success shrink-0" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-forge-warning shrink-0" />;
    case 'fail':    return <XCircle className="w-4 h-4 text-forge-error shrink-0" />;
    case 'info':    return <Info className="w-4 h-4 text-forge-info shrink-0" />;
  }
}

function PreflightRow({ item }: { item: PreflightItem }) {
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
        {item.fixable && (
          <Button variant="outline" size="xs" icon={<Wrench className="w-3 h-3" />} className="shrink-0">
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
  const { templateAnalysis } = useEditorStore();
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
            <PreflightRow key={item.id} item={item} />
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
