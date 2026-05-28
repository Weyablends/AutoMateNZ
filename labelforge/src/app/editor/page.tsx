'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import TopBar from '@/components/editor/TopBar';
import LeftSidebar from '@/components/editor/LeftSidebar';
import RightSidebar from '@/components/editor/RightSidebar';
import RulerOverlay from '@/components/editor/RulerOverlay';
import PreflightPanel from '@/components/preflight/PreflightPanel';
import ExportModal from '@/components/editor/ExportModal';
import QRModal from '@/components/editor/QRModal';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

// Dynamic import of canvas to avoid SSR
const EditorCanvas = dynamic(() => import('@/components/editor/EditorCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-checker">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl border-2 border-forge-accent border-t-transparent animate-spin" />
        <p className="text-xs text-forge-muted">Loading editor…</p>
      </div>
    </div>
  ),
});

const TOOL_LABELS: Record<string, string> = {
  select: 'Select', pan: 'Pan', text: 'Text', rect: 'Rectangle',
  ellipse: 'Ellipse', pen: 'Pen', zoom_in: 'Zoom In', zoom_out: 'Zoom Out',
};

function StatusBar() {
  const { zoom, selectedProperties, activeTool, exportOptions, templateAnalysis } = useEditorStore();
  const dims = templateAnalysis?.dimensions;
  const dimStr = dims ? `${dims.width}×${dims.height}mm` : '—';
  return (
    <div className="h-6 bg-forge-surface border-t border-forge-border flex items-center px-3 gap-4 shrink-0 select-none">
      <span className="text-2xs text-forge-dim">{TOOL_LABELS[activeTool] ?? activeTool}</span>
      <div className="h-3 w-px bg-forge-border" />
      {selectedProperties ? (
        <span className="text-2xs text-forge-muted font-mono">
          x: {selectedProperties.x} y: {selectedProperties.y} w: {selectedProperties.width} h: {selectedProperties.height} °{selectedProperties.rotation}
        </span>
      ) : (
        <span className="text-2xs text-forge-dim">No selection</span>
      )}
      <div className="ml-auto flex items-center gap-3">
        <span className="text-2xs text-forge-dim font-mono">{Math.round(zoom * 100)}%</span>
        <span className="text-2xs text-forge-dim">{exportOptions.colorProfile} · {exportOptions.resolution} DPI · {dimStr}</span>
      </div>
    </div>
  );
}

export default function EditorPage() {
  const router = useRouter();
  const fabricRef = useRef<any>(null);
  const {
    templateAnalysis, preflightOpen, setPreflightOpen,
    qrModalOpen, setQrModalOpen, pendingExport, setPendingExport,
  } = useEditorStore();
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    if (!templateAnalysis) router.replace('/');
  }, [templateAnalysis, router]);

  useEffect(() => {
    if (pendingExport) {
      setPendingExport(false);
      setExportOpen(true);
    }
  }, [pendingExport, setPendingExport]);

  if (!templateAnalysis) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-forge-bg">
      {/* Top bar */}
      <TopBar fabricRef={fabricRef} onExport={() => setExportOpen(true)} />

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <LeftSidebar />

        {/* Canvas */}
        <div className="flex-1 overflow-hidden relative">
          <RulerOverlay />
          <EditorCanvas fabricRef={fabricRef} />

          {/* Guide legend overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-forge-surface/80 backdrop-blur border border-forge-border rounded-lg px-2.5 py-1.5 pointer-events-none">
            {[
              { color: '#FF6B35', label: 'Bleed' },
              { color: '#FF3B30', label: 'Trim' },
              { color: '#34C759', label: 'Safe' },
              { color: '#5B7FFF', label: 'Barcode' },
            ].map((g) => (
              <span key={g.label} className="flex items-center gap-1 text-2xs text-forge-muted">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: g.color }} />
                {g.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar fabricRef={fabricRef} />
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Modals */}
      {preflightOpen && (
        <PreflightPanel
          onClose={() => setPreflightOpen(false)}
          onExport={() => { setPreflightOpen(false); setExportOpen(true); }}
          fabricRef={fabricRef}
        />
      )}
      {exportOpen && (
        <ExportModal
          onClose={() => setExportOpen(false)}
          fabricRef={fabricRef}
        />
      )}
      {qrModalOpen && (
        <QRModal onClose={() => setQrModalOpen(false)} />
      )}
    </div>
  );
}
