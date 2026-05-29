'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Tag, CheckCircle2, AlertTriangle, XCircle, Info,
  Download, Wrench, ChevronRight, Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockPreflightItems } from '@/lib/mockData';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import type { PreflightStatus } from '@/lib/types';

function StatusIcon({ status, className }: { status: PreflightStatus; className?: string }) {
  const base = cn('shrink-0', className);
  switch (status) {
    case 'pass': return <CheckCircle2 className={cn(base, 'text-forge-success')} />;
    case 'warning': return <AlertTriangle className={cn(base, 'text-forge-warning')} />;
    case 'fail': return <XCircle className={cn(base, 'text-forge-error')} />;
    case 'info': return <Info className={cn(base, 'text-forge-info')} />;
  }
}

const CATEGORY_ORDER = ['Dimensions', 'Bleed', 'Safe Zone', 'Colour', 'Typography', 'Images', 'Barcode', 'Dieline', 'Legal', 'Structure'];

export default function PreflightPage() {
  const router = useRouter();
  const { templateAnalysis, exportOptions, setExportOptions, isExporting, setPendingExport, setPreflightOpen } = useEditorStore();
  const [filterStatus, setFilterStatus] = useState('all' as PreflightStatus | 'all');
  const [expandedItem, setExpandedItem] = useState(null as string | null);

  useEffect(() => {
    if (!templateAnalysis) router.replace('/');
  }, [templateAnalysis, router]);

  if (!templateAnalysis) return null;

  const counts = {
    pass: mockPreflightItems.filter((i) => i.status === 'pass').length,
    warning: mockPreflightItems.filter((i) => i.status === 'warning').length,
    fail: mockPreflightItems.filter((i) => i.status === 'fail').length,
    info: mockPreflightItems.filter((i) => i.status === 'info').length,
  };

  const canExport = counts.fail === 0;

  const filteredItems = filterStatus === 'all'
    ? mockPreflightItems
    : mockPreflightItems.filter((i) => i.status === filterStatus);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = filteredItems.filter((i) => i.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {} as Record<string, typeof mockPreflightItems>);

  return (
    <div className="min-h-screen bg-forge-bg flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-forge-border bg-forge-surface flex items-center px-4 gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={() => router.push('/editor')}>
          Back to Editor
        </Button>
        <div className="h-4 w-px bg-forge-border" />
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-forge-accent" />
          <span className="font-semibold text-sm text-forge-text">LabelForge</span>
          <span className="text-forge-dim text-xs">/</span>
          <span className="text-xs text-forge-muted">Preflight & Export</span>
        </div>
        <div className="ml-auto">
          <Button
            variant="primary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            disabled={!canExport}
            loading={isExporting}
            onClick={() => { setPendingExport(true); router.push('/editor'); }}
          >
            Export Print-Ready PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Status hero */}
          <div className={cn(
            'rounded-2xl p-6 mb-6 border',
            canExport
              ? 'bg-forge-success-muted border-forge-success/30'
              : 'bg-forge-error-muted border-forge-error/30'
          )}>
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center',
                canExport ? 'bg-forge-success/20' : 'bg-forge-error/20'
              )}>
                {canExport
                  ? <CheckCircle2 className="w-6 h-6 text-forge-success" />
                  : <XCircle className="w-6 h-6 text-forge-error" />}
              </div>
              <div>
                <h2 className={cn('text-base font-semibold', canExport ? 'text-forge-success' : 'text-forge-error')}>
                  {canExport ? 'Ready to Export' : 'Issues Must Be Resolved'}
                </h2>
                <p className="text-sm text-forge-muted mt-0.5">
                  {canExport
                    ? `${counts.pass} checks passed, ${counts.warning} warnings (non-blocking), ${counts.info} informational`
                    : `${counts.fail} critical error${counts.fail !== 1 ? 's' : ''} must be fixed before export`}
                </p>
              </div>
              <div className="ml-auto flex gap-4">
                {([
                  { status: 'pass', label: 'Pass', color: 'text-forge-success' },
                  { status: 'warning', label: 'Warn', color: 'text-forge-warning' },
                  { status: 'fail', label: 'Fail', color: 'text-forge-error' },
                  { status: 'info', label: 'Info', color: 'text-forge-info' },
                ] as const).map(({ status, label, color }) => (
                  <div key={status} className="text-center">
                    <p className={cn('text-xl font-bold', color)}>{counts[status]}</p>
                    <p className="text-2xs text-forge-dim">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-4">
            <p className="text-xs text-forge-muted mr-2">Filter:</p>
            {(['all', 'fail', 'warning', 'pass', 'info'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn('px-2.5 py-1 rounded-lg text-xs transition-all border',
                  filterStatus === s
                    ? 'bg-forge-accent/20 border-forge-accent text-forge-accent'
                    : 'border-forge-border text-forge-muted hover:text-forge-text'
                )}
              >
                {s === 'all' ? `All (${mockPreflightItems.length})` : s.charAt(0).toUpperCase() + s.slice(1) + ` (${counts[s as PreflightStatus]})`}
              </button>
            ))}
          </div>

          {/* Grouped results */}
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-forge-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  {category}
                  <span className="text-forge-dim normal-case font-normal">({items.length})</span>
                </h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={cn('border rounded-xl overflow-hidden transition-all', {
                        'border-forge-success/20 bg-forge-success-muted/10': item.status === 'pass',
                        'border-forge-warning/30 bg-forge-warning-muted/20': item.status === 'warning',
                        'border-forge-error/30 bg-forge-error-muted/20': item.status === 'fail',
                        'border-forge-accent/20 bg-forge-accent-muted/10': item.status === 'info',
                      })}
                    >
                      <div className="flex items-start gap-3 p-3.5">
                        <StatusIcon status={item.status} className="w-4 h-4 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-forge-text">{item.label}</p>
                          <p className="text-xs text-forge-muted mt-0.5">{item.message}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.fixable && (
                            <Button
                              variant="outline"
                              size="xs"
                              icon={<Wrench className="w-3 h-3" />}
                              onClick={() => { setPreflightOpen(true); router.push('/editor'); }}
                            >
                              Fix in Editor
                            </Button>
                          )}
                          {item.detail && (
                            <button
                              onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                              className="p-1 rounded hover:bg-forge-border transition-colors text-forge-dim hover:text-forge-muted"
                            >
                              <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', expandedItem === item.id && 'rotate-90')} />
                            </button>
                          )}
                        </div>
                      </div>
                      {expandedItem === item.id && item.detail && (
                        <div className="px-4 pb-3.5 pt-0">
                          <div className="bg-forge-panel border border-forge-border rounded-lg p-3">
                            <p className="text-xs text-forge-muted leading-relaxed">{item.detail}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Export sidebar */}
        <aside className="w-72 border-l border-forge-border bg-forge-surface flex flex-col shrink-0 overflow-y-auto p-4 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-forge-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Export Settings
            </h3>

            {/* Format */}
            <div className="mb-3">
              <p className="text-xs text-forge-muted mb-1.5">Format</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(['pdf', 'png', 'svg', 'jpg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setExportOptions({ format: fmt })}
                    className={cn('py-1.5 rounded-lg text-xs border transition-all uppercase font-medium',
                      exportOptions.format === fmt
                        ? 'border-forge-accent bg-forge-accent/15 text-forge-accent'
                        : 'border-forge-border text-forge-muted hover:text-forge-text'
                    )}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour */}
            <div className="mb-3">
              <p className="text-xs text-forge-muted mb-1.5">Colour Profile</p>
              <div className="flex flex-col gap-1">
                {(['CMYK', 'RGB', 'Pantone'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setExportOptions({ colorProfile: p })}
                    className={cn('flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-xs border transition-all',
                      exportOptions.colorProfile === p
                        ? 'border-forge-accent bg-forge-accent/10 text-forge-accent'
                        : 'border-forge-border text-forge-muted hover:text-forge-text'
                    )}
                  >
                    <div className={cn('w-1.5 h-1.5 rounded-full', exportOptions.colorProfile === p ? 'bg-forge-accent' : 'bg-forge-dim')} />
                    {p}
                    {p === 'CMYK' && <span className="ml-auto text-2xs text-forge-dim">Recommended</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="mb-3">
              <p className="text-xs text-forge-muted mb-1.5">Resolution</p>
              <div className="flex gap-1.5">
                {([150, 300, 600] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setExportOptions({ resolution: r })}
                    className={cn('flex-1 py-1.5 rounded-lg text-xs border transition-all',
                      exportOptions.resolution === r
                        ? 'border-forge-accent bg-forge-accent/10 text-forge-accent'
                        : 'border-forge-border text-forge-muted hover:text-forge-text'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-2xs text-forge-dim mt-1">DPI — 300 minimum required</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {([
                { key: 'includeBleed', label: 'Include 3mm bleed' },
                { key: 'includeTrimMarks', label: 'Trim marks' },
                { key: 'includeColorBars', label: 'Colour bars' },
                { key: 'outlineFonts', label: 'Outline all fonts' },
                { key: 'embedImages', label: 'Embed all images' },
                { key: 'flattenTransparency', label: 'Flatten transparency' },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={exportOptions[key] as boolean}
                    onChange={(e) => setExportOptions({ [key]: e.target.checked })}
                    className="w-3.5 h-3.5 accent-forge-accent"
                  />
                  <span className="text-xs text-forge-muted group-hover:text-forge-text transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-forge-border" />

          {/* File info */}
          <div className="text-xs space-y-1.5">
            <p className="text-forge-dim uppercase text-2xs tracking-wider mb-2">Output File</p>
            <div className="flex justify-between">
              <span className="text-forge-dim">Filename</span>
              <span className="text-forge-text truncate max-w-[120px]">{templateAnalysis.fileName.replace(/\.[^.]+$/, '')}-print-ready.pdf</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forge-dim">Page size</span>
              <span className="text-forge-text">{templateAnalysis.dimensions.width + (exportOptions.includeBleed ? 6 : 0)} × {templateAnalysis.dimensions.height + (exportOptions.includeBleed ? 6 : 0)} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forge-dim">Colour</span>
              <span className="text-forge-text">{exportOptions.colorProfile}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-forge-dim">Resolution</span>
              <span className="text-forge-text">{exportOptions.resolution} DPI</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<Download className="w-4 h-4" />}
            disabled={!canExport}
            loading={isExporting}
            onClick={() => { setPendingExport(true); router.push('/editor'); }}
            className="w-full"
          >
            Export {exportOptions.format.toUpperCase()}
          </Button>

          {!canExport && (
            <p className="text-xs text-forge-error text-center">
              Resolve {counts.fail} critical error{counts.fail !== 1 ? 's' : ''} to enable export
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
