'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Scissors, AlertTriangle, CheckCircle2, Info,
  Tag, Layers, Ruler, Palette, FileText, Eye, Lock, ChevronDown, ChevronUp,
  TriangleAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, priorityLabel, priorityColor } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import type { TemplateInstruction, InstructionPriority } from '@/lib/types';

function LayerDot({ color }: { color: string }) {
  return <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: color }} />;
}

function InstructionRow({ instr, onToggle }: { instr: TemplateInstruction; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={cn(
        'border rounded-lg overflow-hidden transition-all',
        instr.acknowledged ? 'border-forge-border opacity-70' : 'border-forge-border-light'
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={onToggle}
          className={cn(
            'mt-0.5 w-4.5 h-4.5 min-w-[18px] rounded border-2 flex items-center justify-center transition-all',
            instr.acknowledged
              ? 'bg-forge-success border-forge-success'
              : 'border-forge-border-light hover:border-forge-accent bg-transparent'
          )}
        >
          {instr.acknowledged && <CheckCircle2 className="w-3 h-3 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn('px-1.5 py-0.5 rounded text-2xs font-semibold uppercase tracking-wide border', priorityColor(instr.priority))}>
              {priorityLabel(instr.priority)}
            </span>
            <span className="text-2xs text-forge-dim capitalize">{instr.category}</span>
          </div>
          <p className={cn('text-xs leading-relaxed', instr.acknowledged ? 'text-forge-muted line-through' : 'text-forge-text')}>
            {instr.text}
          </p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-forge-dim hover:text-forge-muted p-0.5">
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
      {expanded && (
        <div className="px-4 pb-3 pt-0 text-xs text-forge-muted bg-forge-panel/40">
          Add notes or mark this as reviewed above. For critical items, ensure your design complies before export.
        </div>
      )}
    </div>
  );
}

function DiagramView() {
  return (
    <div className="relative w-full aspect-[3/4] max-w-xs mx-auto">
      {/* Background / bleed */}
      <div className="absolute inset-0 rounded-lg border-2 border-dashed border-forge-bleed/60 bg-forge-bleed/5" />
      {/* Trim line */}
      <div className="absolute inset-3 border-2 border-forge-trim/80 bg-white/5 rounded">
        {/* Safe zone */}
        <div className="absolute inset-3 border border-dashed border-forge-safe/70 rounded" />
        {/* Fold lines */}
        <div className="absolute top-[40%] left-0 right-0 border-t border-dashed border-forge-accent/60" />
        {/* Silver foil top */}
        <div className="absolute top-0 left-0 right-0 h-[22%] bg-forge-muted/10 border-b border-dashed border-forge-dim/40 flex items-center justify-center">
          <span className="text-2xs text-forge-dim">Silver Foil Zone</span>
        </div>
        {/* Hang hole */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-forge-dim/60 bg-forge-bg" />
        {/* Tear notch */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-forge-error/10 border-l border-b border-dashed border-forge-error/40" />
        {/* Barcode zone */}
        <div className="absolute bottom-6 right-3 w-14 h-8 border border-dashed border-forge-accent/50 bg-forge-accent/5 flex items-center justify-center">
          <span className="text-2xs text-forge-dim">Barcode</span>
        </div>
        {/* Label text */}
        <div className="absolute top-[25%] left-0 right-0 flex flex-col items-center gap-1 px-4">
          <div className="h-2 w-3/4 bg-forge-muted/20 rounded" />
          <div className="h-1.5 w-1/2 bg-forge-muted/15 rounded" />
        </div>
      </div>
      {/* Legend */}
      <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-3 flex-wrap">
        {[
          { color: '#FF6B35', label: 'Bleed' },
          { color: '#FF3B30', label: 'Trim' },
          { color: '#34C759', label: 'Safe Zone' },
          { color: '#5B7FFF', label: 'Fold' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1 text-2xs text-forge-muted">
            <span className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  const router = useRouter();
  const { templateAnalysis, acknowledgeInstruction } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'specs' | 'layers' | 'instructions' | 'notes'>('specs');
  const [filterPriority, setFilterPriority] = useState<InstructionPriority | 'all'>('all');

  useEffect(() => {
    if (!templateAnalysis) router.replace('/');
  }, [templateAnalysis, router]);

  if (!templateAnalysis) return null;

  const instructions = filterPriority === 'all'
    ? templateAnalysis.instructions
    : templateAnalysis.instructions.filter((i) => i.priority === filterPriority);

  const criticalUnacked = templateAnalysis.instructions.filter((i) => i.priority === 'critical' && !i.acknowledged);
  const totalUnacked = templateAnalysis.instructions.filter((i) => !i.acknowledged);
  const canContinue = criticalUnacked.length === 0;

  const acknowledgedCount = templateAnalysis.instructions.filter((i) => i.acknowledged).length;
  const total = templateAnalysis.instructions.length;

  return (
    <div className="min-h-screen bg-forge-bg flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-forge-border bg-forge-surface flex items-center px-4 gap-3 sticky top-0 z-10">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />} onClick={() => router.push('/')}>
          Back
        </Button>
        <div className="h-4 w-px bg-forge-border" />
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-forge-accent" />
          <span className="font-semibold text-sm text-forge-text">LabelForge</span>
        </div>
        <div className="flex items-center gap-1.5 text-forge-muted text-xs">
          <span className="text-forge-dim">/</span>
          <FileText className="w-3.5 h-3.5" />
          <span className="truncate max-w-[200px]">{templateAnalysis.fileName}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {totalUnacked.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-forge-warning">
              <AlertTriangle className="w-3.5 h-3.5" />
              {totalUnacked.length} instruction{totalUnacked.length !== 1 ? 's' : ''} unacknowledged
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            disabled={!canContinue}
            iconRight={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => router.push('/editor')}
          >
            Open in Editor
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — diagram */}
        <aside className="w-72 border-r border-forge-border bg-forge-surface p-6 overflow-y-auto shrink-0">
          <h3 className="text-xs font-semibold text-forge-muted uppercase tracking-wider mb-4">Template Preview</h3>
          <DiagramView />
          <div className="mt-14 space-y-3">
            <div className="bg-forge-panel border border-forge-border rounded-lg p-3">
              <p className="text-2xs text-forge-muted uppercase tracking-wider mb-2">Dimensions</p>
              <p className="text-sm font-semibold text-forge-text">
                {templateAnalysis.dimensions.width} × {templateAnalysis.dimensions.height} {templateAnalysis.dimensions.unit}
              </p>
            </div>
            <div className="bg-forge-panel border border-forge-border rounded-lg p-3">
              <p className="text-2xs text-forge-muted uppercase tracking-wider mb-2">Bleed</p>
              <p className="text-sm font-semibold text-forge-text">
                {templateAnalysis.bleed.top} mm (all sides)
              </p>
            </div>
            <div className="bg-forge-panel border border-forge-border rounded-lg p-3">
              <p className="text-2xs text-forge-muted uppercase tracking-wider mb-2">Colour Mode</p>
              <p className="text-sm font-semibold text-forge-text">{templateAnalysis.colorMode}</p>
            </div>
          </div>

          {/* Instruction progress */}
          <div className="mt-4 bg-forge-panel border border-forge-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xs text-forge-muted uppercase tracking-wider">Checklist Progress</p>
              <span className="text-xs text-forge-muted">{acknowledgedCount}/{total}</span>
            </div>
            <div className="h-1.5 bg-forge-border rounded-full overflow-hidden">
              <div
                className="h-full bg-forge-success rounded-full transition-all"
                style={{ width: `${(acknowledgedCount / total) * 100}%` }}
              />
            </div>
            {criticalUnacked.length > 0 && (
              <p className="mt-2 text-2xs text-forge-error flex items-center gap-1">
                <TriangleAlert className="w-3 h-3" />
                {criticalUnacked.length} critical item{criticalUnacked.length > 1 ? 's' : ''} must be acknowledged
              </p>
            )}
            {criticalUnacked.length === 0 && totalUnacked.length > 0 && (
              <p className="mt-2 text-2xs text-forge-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Critical items done — you may proceed
              </p>
            )}
            {totalUnacked.length === 0 && (
              <p className="mt-2 text-2xs text-forge-success flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                All instructions acknowledged
              </p>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="sticky top-0 z-10 bg-forge-surface border-b border-forge-border flex gap-1 px-6 pt-4">
            {([
              ['specs', <Ruler key="r" className="w-3.5 h-3.5" />, 'Specs'],
              ['layers', <Layers key="l" className="w-3.5 h-3.5" />, 'Layers'],
              ['instructions', <FileText key="f" className="w-3.5 h-3.5" />, `Instructions (${templateAnalysis.instructions.length})`],
              ['notes', <Info key="i" className="w-3.5 h-3.5" />, 'Notes'],
            ] as const).map(([id, icon, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-all -mb-px',
                  activeTab === id
                    ? 'border-forge-accent text-forge-accent'
                    : 'border-transparent text-forge-muted hover:text-forge-text'
                )}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 max-w-3xl">
            {/* SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Page Dimensions', value: `${templateAnalysis.dimensions.width} × ${templateAnalysis.dimensions.height} ${templateAnalysis.dimensions.unit}`, icon: <Ruler className="w-4 h-4" /> },
                    { label: 'Bleed', value: `${templateAnalysis.bleed.top} mm all sides`, icon: <Scissors className="w-4 h-4" /> },
                    { label: 'Safe Zone', value: `${templateAnalysis.safeZone.top} mm from trim`, icon: <Eye className="w-4 h-4" /> },
                    { label: 'Colour Mode', value: templateAnalysis.colorMode, icon: <Palette className="w-4 h-4" /> },
                    { label: 'Colour Profile', value: templateAnalysis.cmykProfile, icon: <Palette className="w-4 h-4" /> },
                    { label: 'Min. Resolution', value: templateAnalysis.resolution, icon: <Info className="w-4 h-4" /> },
                  ].map((item) => (
                    <div key={item.label} className="bg-forge-panel border border-forge-border rounded-xl p-4">
                      <div className="flex items-center gap-2 text-forge-muted mb-1.5">
                        {item.icon}
                        <span className="text-2xs uppercase tracking-wider">{item.label}</span>
                      </div>
                      <p className="text-sm font-medium text-forge-text">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-forge-panel border border-forge-border rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-forge-muted uppercase tracking-wider mb-3">Detected Elements</h4>
                  <div className="flex flex-wrap gap-2">
                    {templateAnalysis.detectedElements.map((el) => (
                      <span key={el} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-forge-surface border border-forge-border text-xs text-forge-text">
                        <CheckCircle2 className="w-3 h-3 text-forge-success" />
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-forge-panel border border-forge-border rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-forge-muted uppercase tracking-wider mb-3">Pantone / Spot Colour Requirements</h4>
                  <div className="space-y-2">
                    {templateAnalysis.pantoneRequirements.map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-forge-trim" />
                        <span className="text-sm text-forge-text font-mono">{p}</span>
                        <Badge variant="error">Required</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* LAYERS */}
            {activeTab === 'layers' && (
              <div className="space-y-2 animate-fade-in">
                {templateAnalysis.layers.map((layer) => (
                  <div key={layer.id} className="flex items-center gap-3 bg-forge-panel border border-forge-border rounded-xl p-3">
                    <LayerDot color={layer.color} />
                    <span className="text-sm text-forge-text flex-1">{layer.name}</span>
                    <span className="text-xs text-forge-dim capitalize">{layer.type.replace(/_/g, ' ')}</span>
                    {layer.locked && (
                      <Lock className="w-3.5 h-3.5 text-forge-dim" />
                    )}
                    <div className="w-2 h-2 rounded-full" style={{ background: layer.color }} />
                  </div>
                ))}
              </div>
            )}

            {/* INSTRUCTIONS */}
            {activeTab === 'instructions' && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs text-forge-muted flex-1">
                    Acknowledge each instruction to confirm your design complies. All critical items must be checked before exporting.
                  </p>
                  <div className="flex gap-1">
                    {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={cn(
                          'px-2 py-0.5 rounded text-xs transition-all',
                          filterPriority === p
                            ? 'bg-forge-accent text-white'
                            : 'bg-forge-panel border border-forge-border text-forge-muted hover:text-forge-text'
                        )}
                      >
                        {p === 'all' ? 'All' : priorityLabel(p)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {instructions.map((instr) => (
                    <InstructionRow
                      key={instr.id}
                      instr={instr}
                      onToggle={() => acknowledgeInstruction(instr.id)}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => templateAnalysis.instructions.forEach((i) => !i.acknowledged && acknowledgeInstruction(i.id))}
                  >
                    Acknowledge All
                  </Button>
                  <p className="text-xs text-forge-muted">{acknowledgedCount} of {total} acknowledged</p>
                </div>
              </div>
            )}

            {/* NOTES */}
            {activeTab === 'notes' && (
              <div className="animate-fade-in space-y-4">
                <div className="bg-forge-warning-muted border border-forge-warning/20 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-forge-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-forge-warning mb-1">Manufacturer Notes</p>
                    <p className="text-xs text-forge-text leading-relaxed whitespace-pre-wrap">{templateAnalysis.manufacturerNotes}</p>
                  </div>
                </div>
                <div className="bg-forge-panel border border-forge-border rounded-xl p-4">
                  <p className="text-2xs uppercase tracking-wider text-forge-muted mb-3">File Information</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-forge-dim">Manufacturer:</span> <span className="text-forge-text ml-1">{templateAnalysis.manufacturer}</span></div>
                    <div><span className="text-forge-dim">Template Version:</span> <span className="text-forge-text ml-1">v{templateAnalysis.version}</span></div>
                    <div><span className="text-forge-dim">File Name:</span> <span className="text-forge-text ml-1">{templateAnalysis.fileName}</span></div>
                    <div><span className="text-forge-dim">File Size:</span> <span className="text-forge-text ml-1">{templateAnalysis.fileSize}</span></div>
                    <div><span className="text-forge-dim">File Type:</span> <span className="text-forge-text ml-1">{templateAnalysis.fileType}</span></div>
                    <div><span className="text-forge-dim">Analysed:</span> <span className="text-forge-text ml-1">Just now</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
