'use client';
import { useState } from 'react';
import { X, Download, FileText, Image, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/store/editorStore';
import { cn, sleep } from '@/lib/utils';

interface Props {
  onClose: () => void;
  fabricRef: React.MutableRefObject<any>;
}

export default function ExportModal({ onClose, fabricRef }: Props) {
  const { exportOptions, setExportOptions, isExporting, setIsExporting, templateAnalysis } = useEditorStore();
  const [done, setDone] = useState(false);
  const [exportError, setExportError] = useState('');

  async function doExport() {
    const canvas = fabricRef.current;
    if (!canvas) return;
    setIsExporting(true);
    setExportError('');

    // Hide guides for export
    const guides = canvas.getObjects().filter((o: any) => o.data?.type === 'guide' || o.data?.type === 'grid');
    guides.forEach((o: any) => o.set({ visible: false }));
    canvas.renderAll();

    await sleep(200);

    try {
      if (exportOptions.format === 'png' || exportOptions.format === 'jpg') {
        const dataUrl = canvas.toDataURL({
          format: exportOptions.format === 'jpg' ? 'jpeg' : 'png',
          quality: 0.95,
          multiplier: exportOptions.resolution / 72,
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `label-export-${Date.now()}.${exportOptions.format}`;
        link.click();
      } else if (exportOptions.format === 'svg') {
        const svg = canvas.toSVG();
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `label-export-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Print-ready PDF via pdf-lib
        const { exportPrintReadyPDF } = await import('@/lib/printExport');
        const dims = templateAnalysis?.dimensions ?? { width: 150, height: 210 };
        const bleed = templateAnalysis?.bleed ?? { top: 3, right: 3, bottom: 3, left: 3 };
        const fileName = templateAnalysis?.fileName ?? 'label';
        await exportPrintReadyPDF(canvas, exportOptions, dims, bleed, fileName);
      }

      setDone(true);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Export failed. Please try again.');
    } finally {
      guides.forEach((o: any) => o.set({ visible: true }));
      canvas.renderAll();
      setIsExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-forge-surface border border-forge-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-forge-border">
          <div>
            <h2 className="text-sm font-semibold text-forge-text">Export Label</h2>
            <p className="text-xs text-forge-muted">Generate your print-ready file</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-forge-panel text-forge-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Format */}
          <div>
            <p className="text-xs font-medium text-forge-muted mb-2">Format</p>
            <div className="grid grid-cols-4 gap-2">
              {(['pdf', 'png', 'svg', 'jpg'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportOptions({ format: fmt })}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                    exportOptions.format === fmt
                      ? 'border-forge-accent bg-forge-accent/10 text-forge-accent'
                      : 'border-forge-border text-forge-muted hover:border-forge-border-light hover:text-forge-text'
                  )}
                >
                  {fmt === 'pdf' || fmt === 'svg' ? <FileText className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                  <span className="uppercase">{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colour profile */}
          <div>
            <p className="text-xs font-medium text-forge-muted mb-2">Colour Profile</p>
            <div className="flex gap-2">
              {(['CMYK', 'RGB', 'Pantone'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setExportOptions({ colorProfile: p })}
                  className={cn('flex-1 py-1.5 rounded-lg text-xs border transition-all',
                    exportOptions.colorProfile === p
                      ? 'border-forge-accent bg-forge-accent/10 text-forge-accent'
                      : 'border-forge-border text-forge-muted hover:text-forge-text'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <p className="text-xs font-medium text-forge-muted mb-2">Resolution</p>
            <div className="flex gap-2">
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
                  {r} DPI
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: 'includeBleed', label: 'Include bleed' },
              { key: 'includeTrimMarks', label: 'Trim marks' },
              { key: 'outlineFonts', label: 'Outline fonts' },
              { key: 'embedImages', label: 'Embed images' },
            ] as const).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions[key] as boolean}
                  onChange={(e) => setExportOptions({ [key]: e.target.checked })}
                  className="w-3.5 h-3.5 accent-forge-accent"
                />
                <span className="text-xs text-forge-muted">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-t border-forge-border">
          {exportError ? (
            <p className="text-xs text-forge-error flex-1 min-w-0 truncate">{exportError}</p>
          ) : (
            <div className="flex-1" />
          )}
          <Button variant="secondary" size="sm" onClick={onClose} disabled={isExporting}>Cancel</Button>
          <Button
            variant="primary"
            size="sm"
            loading={isExporting}
            icon={done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            onClick={done ? onClose : doExport}
          >
            {done ? 'Done' : `Export ${exportOptions.format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
