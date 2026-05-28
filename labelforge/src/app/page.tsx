'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Layers, Zap, Shield, CheckCircle2, ArrowRight,
  Scissors, Tag, Sparkles, Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, sleep, formatFileSize } from '@/lib/utils';
import { useEditorStore } from '@/store/editorStore';
import { mockTemplateAnalysis } from '@/lib/mockData';

type UploadStep = 'idle' | 'uploading' | 'analysing' | 'done';

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

const ACCEPTED_TEMPLATE: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/postscript': ['.ai', '.eps'],
};

const ACCEPTED_DESIGN: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/postscript': ['.ai'],
};

function AnalysisStep({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 py-2 transition-all', active ? 'opacity-100' : (!active && !done ? 'opacity-30' : ''))}>
      <div className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center shrink-0',
        done ? 'bg-forge-success' : (active ? 'bg-forge-accent' : 'bg-forge-border'),
      )}>
        {done ? (
          <CheckCircle2 className="w-3 h-3 text-white" />
        ) : active ? (
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-forge-muted" />
        )}
      </div>
      <span className={cn('text-sm', done ? 'text-forge-text' : (active ? 'text-forge-accent' : 'text-forge-dim'))}>
        {label}
      </span>
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const { setTemplateAnalysis, setTemplateFile, setDesignFile } = useEditorStore();

  const [templateFile, setTemplateFileLocal] = useState(null as FileInfo | null);
  const [designFile, setDesignFileLocal] = useState(null as FileInfo | null);
  const [step, setStep] = useState('idle' as UploadStep);
  const [analysisStep, setAnalysisStep] = useState(0);

  const onTemplateDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (f) setTemplateFileLocal({ name: f.name, size: f.size, type: f.type });
  }, []);

  const onDesignDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (f) setDesignFileLocal({ name: f.name, size: f.size, type: f.type });
  }, []);

  const templateDz = useDropzone({
    onDrop: onTemplateDrop,
    accept: ACCEPTED_TEMPLATE,
    multiple: false,
    disabled: step !== 'idle',
  });

  const designDz = useDropzone({
    onDrop: onDesignDrop,
    accept: ACCEPTED_DESIGN,
    multiple: false,
    disabled: step !== 'idle',
  });

  const analysisSteps = [
    'Parsing file structure...',
    'Detecting dieline layers...',
    'Extracting trim & bleed marks...',
    'Identifying safe zones...',
    'Scanning for colour profiles...',
    'Reading manufacturer notes...',
    'Building instruction checklist...',
    'Analysis complete',
  ];

  async function handleAnalyse() {
    if (!templateFile) return;
    setStep('uploading');
    await sleep(600);
    setStep('analysing');
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      await sleep(380 + Math.random() * 200);
    }
    const extRaw = templateFile.name.split('.').pop() || 'pdf';
    const analysis = {
      ...mockTemplateAnalysis,
      fileName: templateFile.name,
      fileType: extRaw.toUpperCase() as 'PDF',
      fileSize: formatFileSize(templateFile.size),
    };
    setTemplateAnalysis(analysis);
    setTemplateFile({ name: templateFile.name, type: templateFile.type });
    if (designFile) setDesignFile({ name: designFile.name, type: designFile.type });
    setStep('done');
    await sleep(400);
    router.push('/analyze');
  }

  const isDone = step === 'done';
  const isAnalysing = step === 'analysing' || step === 'uploading';

  return (
    <div className="min-h-screen bg-forge-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-forge-border bg-forge-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-forge-accent flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-forge-text tracking-tight">LabelForge</span>
            <span className="text-forge-dim text-xs ml-1">beta</span>
          </div>
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm">Documentation</Button>
            <Button variant="ghost" size="sm">Pricing</Button>
            <Button variant="primary" size="sm">Sign in</Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-accent-muted border border-forge-accent/30 text-forge-accent text-xs mb-6">
          <Sparkles className="w-3 h-3" />
          Manufacturer-ready labels in minutes
        </div>
        <h1 className="text-4xl font-bold text-forge-text leading-tight mb-4">
          Upload your dieline.{' '}
          <span className="text-forge-accent">Design your label.</span>
          <br />Export print-ready.
        </h1>
        <p className="text-forge-muted text-lg max-w-2xl mx-auto leading-relaxed">
          LabelForge reads your manufacturer&apos;s template and guides you through creating a compliant, print-ready label.
        </p>
      </section>

      {/* Upload Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 pb-16">
        {!isAnalysing && !isDone ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Template upload */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-forge-error/20 flex items-center justify-center">
                  <Scissors className="w-3 h-3 text-forge-error" />
                </div>
                <span className="text-sm font-medium text-forge-text">Manufacturer Template</span>
                <span className="text-forge-error text-xs ml-auto">Required</span>
              </div>
              <div
                {...templateDz.getRootProps()}
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[200px]',
                  templateDz.isDragActive
                    ? 'border-forge-accent bg-forge-accent-muted/20'
                    : templateFile
                    ? 'border-forge-success bg-forge-success-muted/20'
                    : 'border-forge-border hover:border-forge-accent/60 bg-forge-surface hover:bg-forge-panel'
                )}
              >
                <input {...templateDz.getInputProps()} />
                {templateFile ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-forge-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-forge-success" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-forge-text truncate max-w-[200px]">{templateFile.name}</p>
                      <p className="text-xs text-forge-muted">{formatFileSize(templateFile.size)}</p>
                    </div>
                    <p className="text-xs text-forge-muted">Drop a different file to replace</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-forge-panel border border-forge-border flex items-center justify-center">
                      <Upload className="w-6 h-6 text-forge-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-forge-text">Drop manufacturer template here</p>
                      <p className="text-xs text-forge-muted mt-1">or click to browse</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 mt-1">
                      {['PDF', 'AI', 'SVG', 'EPS', 'DXF', 'PNG'].map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-forge-panel border border-forge-border text-forge-dim text-xs">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Design upload */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-forge-accent/20 flex items-center justify-center">
                  <Package className="w-3 h-3 text-forge-accent" />
                </div>
                <span className="text-sm font-medium text-forge-text">Your Brand Design</span>
                <span className="text-forge-muted text-xs ml-auto">Optional</span>
              </div>
              <div
                {...designDz.getRootProps()}
                className={cn(
                  'relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[200px]',
                  designDz.isDragActive
                    ? 'border-forge-accent bg-forge-accent-muted/20'
                    : designFile
                    ? 'border-forge-info bg-forge-accent-muted/20'
                    : 'border-forge-border hover:border-forge-accent/60 bg-forge-surface hover:bg-forge-panel'
                )}
              >
                <input {...designDz.getInputProps()} />
                {designFile ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-forge-accent/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-forge-accent" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-forge-text truncate max-w-[200px]">{designFile.name}</p>
                      <p className="text-xs text-forge-muted">{formatFileSize(designFile.size)}</p>
                    </div>
                    <p className="text-xs text-forge-muted">Drop a different file to replace</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-forge-panel border border-forge-border flex items-center justify-center">
                      <Layers className="w-6 h-6 text-forge-muted" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-forge-text">Upload existing design</p>
                      <p className="text-xs text-forge-muted mt-1">or start from scratch in the editor</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1 mt-1">
                      {['PDF', 'AI', 'SVG', 'PNG', 'JPG'].map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-forge-panel border border-forge-border text-forge-dim text-xs">{t}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-forge-surface border border-forge-border rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forge-accent/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-forge-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-forge-text truncate">{templateFile?.name}</p>
                <p className="text-xs text-forge-muted">Analysing template...</p>
              </div>
            </div>
            <div className="flex flex-col gap-0">
              {analysisSteps.map((label, i) => (
                <AnalysisStep
                  key={label}
                  label={label}
                  done={i < analysisStep}
                  active={i === analysisStep}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!isAnalysing && !isDone && (
            <Button
              variant="primary"
              size="lg"
              disabled={!templateFile}
              onClick={handleAnalyse}
              iconRight={<ArrowRight className="w-4 h-4" />}
            >
              Analyse Template
            </Button>
          )}
        </div>

        {/* How it works */}
        {!isAnalysing && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                color: 'text-forge-accent bg-forge-accent-muted',
                icon: <Upload className="w-5 h-5" />,
                title: '1. Upload Template',
                desc: 'Drop your manufacturer dieline. LabelForge extracts every dimension, colour spec, and instruction automatically.',
              },
              {
                color: 'text-forge-warning bg-forge-warning-muted',
                icon: <Layers className="w-5 h-5" />,
                title: '2. Design Your Label',
                desc: 'Use the professional editor to add your logo, text, images, barcode, and claims — all snapped to safe zones.',
              },
              {
                color: 'text-forge-success bg-forge-success-muted',
                icon: <Zap className="w-5 h-5" />,
                title: '3. Export Print-Ready',
                desc: 'Run the preflight check, then export a CMYK/Pantone PDF that meets every print specification.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-forge-surface border border-forge-border rounded-xl p-5">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center mb-3', item.color)}>
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold text-forge-text mb-1.5">{item.title}</h3>
                <p className="text-xs text-forge-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Feature pills */}
        {!isAnalysing && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {[
              'Detects trim, bleed & safe zones',
              'CMYK & Pantone colour validation',
              'Barcode quiet zone check',
              'Font embedding verification',
              'Manufacturer checklist',
              'PDF/X-4 export',
              'Vector SVG support',
              '300 DPI resolution check',
            ].map((f) => (
              <span key={f} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-forge-surface border border-forge-border text-xs text-forge-muted">
                <Shield className="w-3 h-3 text-forge-success shrink-0" />
                {f}
              </span>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
