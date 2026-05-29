'use client';
import { useRef, useState } from 'react';
import { Search, Upload, Plus, ChevronDown, ChevronUp, ImageIcon } from 'lucide-react';
import { mockAssets, mockBrandColors } from '@/lib/mockData';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

const SVG_CATEGORIES = ['All', 'Fruit', 'Products', 'Claims', 'NZ', 'Decorative'];

type DragPayload =
  | { type: 'svg'; svgContent: string; name: string }
  | { type: 'image'; dataUrl: string; name: string };

function setDragData(e: React.DragEvent, payload: DragPayload) {
  e.dataTransfer.setData('application/labelforge-asset', JSON.stringify(payload));
  e.dataTransfer.effectAllowed = 'copy';
}

export default function AssetsPanel() {
  const { extractedAssets, extractedColors } = useEditorStore();
  const [search, setSearch] = useState('');
  const [svgCategory, setSvgCategory] = useState('All');
  const [libOpen, setLibOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSvg = mockAssets.filter((a) => {
    const matchCat = svgCategory === 'All' || a.category === svgCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function handleCustomUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  const hasExtracted = extractedAssets.length > 0;
  const allBrandColors = [...extractedColors, ...mockBrandColors];

  return (
    <div className="flex flex-col h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={handleCustomUpload}
      />

      <div className="flex-1 overflow-y-auto">
        {/* ── FROM YOUR REFERENCE ─────────────────────────── */}
        {hasExtracted ? (
          <div className="p-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <p className="text-2xs text-forge-accent uppercase tracking-wider font-semibold">From Your Reference</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-forge-accent/10 border border-forge-accent/30 text-forge-accent text-xs hover:bg-forge-accent/20 transition-all"
              >
                <Plus className="w-3 h-3" /> Upload
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {/* Custom upload tile */}
              <button
                onClick={() => fileInputRef.current?.click()}
                draggable={false}
                className="aspect-square bg-forge-panel border border-dashed border-forge-border rounded-lg hover:border-forge-accent transition-all flex flex-col items-center justify-center gap-1 p-1.5 group"
                title="Upload custom PNG or SVG"
              >
                <Upload className="w-5 h-5 text-forge-dim group-hover:text-forge-accent transition-colors" />
                <span className="text-2xs text-forge-dim group-hover:text-forge-muted text-center leading-tight">Upload</span>
              </button>

              {extractedAssets.map((asset) => (
                <div
                  key={asset.id}
                  draggable={true}
                  onDragStart={(e) => setDragData(e, { type: 'image', dataUrl: asset.dataUrl, name: asset.name })}
                  onClick={() => (window as any).__lf_addImage?.(asset.dataUrl, asset.name)}
                  title={`${asset.name} — click or drag to add`}
                  className="aspect-square bg-forge-panel border border-forge-border rounded-lg hover:border-forge-accent transition-all flex flex-col items-center justify-center gap-1 p-1 group cursor-grab active:cursor-grabbing"
                >
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.dataUrl}
                      alt={asset.name}
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <span className="text-2xs text-forge-dim group-hover:text-forge-muted truncate w-full text-center px-0.5">
                    {asset.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* No reference uploaded — show upload prompt */
          <div className="p-3">
            <div className="border border-dashed border-forge-border rounded-xl p-4 flex flex-col items-center gap-2 text-center">
              <ImageIcon className="w-8 h-8 text-forge-dim" />
              <p className="text-xs font-medium text-forge-text">No brand reference yet</p>
              <p className="text-2xs text-forge-dim leading-relaxed">
                Go back to the home page and upload a brand reference image — colours &amp; assets will appear here automatically.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forge-accent/10 border border-forge-accent/30 text-forge-accent text-xs hover:bg-forge-accent/20 transition-all mt-1"
              >
                <Upload className="w-3 h-3" /> Upload Asset Manually
              </button>
            </div>
          </div>
        )}

        <div className="h-px bg-forge-border mx-2" />

        {/* ── SVG LIBRARY (collapsible) ────────────────────── */}
        <div className="p-2">
          <button
            onClick={() => setLibOpen(!libOpen)}
            className="flex items-center justify-between w-full px-1 py-1 mb-1 group"
          >
            <p className="text-2xs text-forge-dim uppercase tracking-wider group-hover:text-forge-muted transition-colors">
              SVG Library ({mockAssets.length})
            </p>
            {libOpen
              ? <ChevronUp className="w-3 h-3 text-forge-dim" />
              : <ChevronDown className="w-3 h-3 text-forge-dim" />}
          </button>

          {libOpen && (
            <div className="mt-1">
              {/* Search */}
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-forge-dim" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search library…"
                  className="w-full bg-forge-panel border border-forge-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-forge-text placeholder-forge-dim focus:outline-none focus:border-forge-accent transition-colors"
                />
              </div>
              {/* Category pills */}
              <div className="flex gap-1 pb-2 flex-wrap">
                {SVG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSvgCategory(cat)}
                    className={cn(
                      'px-2 py-0.5 rounded-full text-xs transition-all',
                      svgCategory === cat
                        ? 'bg-forge-accent text-white'
                        : 'bg-forge-panel border border-forge-border text-forge-muted hover:text-forge-text'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {filteredSvg.map((asset) => (
                  <div
                    key={asset.id}
                    draggable={true}
                    onDragStart={(e) => asset.svgContent && setDragData(e, { type: 'svg', svgContent: asset.svgContent, name: asset.name })}
                    onClick={() => asset.svgContent && (window as any).__lf_addSVG?.(asset.svgContent, asset.name)}
                    title={`${asset.name} — click or drag to add`}
                    className="aspect-square bg-forge-panel border border-forge-border rounded-lg hover:border-forge-accent transition-all flex flex-col items-center justify-center gap-1 p-1.5 group cursor-grab active:cursor-grabbing"
                  >
                    {asset.svgContent ? (
                      <div
                        className="w-10 h-10 flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: asset.svgContent }}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-forge-border rounded" />
                    )}
                    <span className="text-2xs text-forge-dim group-hover:text-forge-muted truncate w-full text-center">{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-forge-border mx-2" />

        {/* ── BRAND COLOURS ───────────────────────────────── */}
        <div className="p-2">
          <p className="text-2xs text-forge-dim uppercase tracking-wider px-1 mb-2">Brand Colours</p>
          {extractedColors.length > 0 && (
            <div className="mb-2">
              <p className="text-2xs text-forge-accent/70 px-1 mb-1.5">Extracted from reference</p>
              <div className="flex flex-wrap gap-1.5 px-1 mb-2">
                {extractedColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => (window as any).__lf_setFill?.(color.hex)}
                    className="group flex flex-col items-center gap-1"
                    title={`Apply ${color.name} (${color.hex})`}
                  >
                    <div
                      className="w-7 h-7 rounded-full border-2 border-forge-border group-hover:border-forge-accent transition-all shadow-sm"
                      style={{ background: color.hex }}
                    />
                    <span className="text-2xs text-forge-dim" style={{ fontSize: '9px' }}>{color.hex}</span>
                  </button>
                ))}
              </div>
              <div className="h-px bg-forge-border/50 mb-2" />
            </div>
          )}
          <div className="flex flex-col gap-1">
            {mockBrandColors.map((color) => (
              <button
                key={color.id}
                onClick={() => (window as any).__lf_setFill?.(color.hex)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-forge-panel transition-all"
                title={`Apply ${color.name} to selected object`}
              >
                <div className="w-5 h-5 rounded border border-forge-border shrink-0" style={{ background: color.hex }} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs text-forge-text truncate">{color.name}</p>
                  {color.pantone && <p className="text-2xs text-forge-dim truncate">{color.pantone}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
