'use client';
import { useRef, useState } from 'react';
import { Search, Upload, Plus } from 'lucide-react';
import { mockAssets, mockBrandColors } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Fruit', 'Products', 'Claims', 'NZ', 'Decorative'];

export default function AssetsPanel() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = mockAssets.filter((a) => {
    const matchCat = category === 'All' || a.category === category;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  function addAsset(asset: typeof mockAssets[0]) {
    if (asset.svgContent) {
      (window as any).__lf_addSVG?.(asset.svgContent, asset.name);
    }
  }

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

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input for custom uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={handleCustomUpload}
      />

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-forge-dim" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets…"
            className="w-full bg-forge-panel border border-forge-border rounded-lg pl-7 pr-3 py-1.5 text-xs text-forge-text placeholder-forge-dim focus:outline-none focus:border-forge-accent transition-colors"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 px-2 pb-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-2 py-0.5 rounded-full text-xs transition-all',
              category === cat
                ? 'bg-forge-accent text-white'
                : 'bg-forge-panel border border-forge-border text-forge-muted hover:text-forge-text'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="h-px bg-forge-border" />

      {/* Assets grid */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Upload custom asset */}
        <div className="flex items-center justify-between px-1 mb-2">
          <p className="text-2xs text-forge-dim uppercase tracking-wider">SVG &amp; Image Assets</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-forge-accent/10 border border-forge-accent/30 text-forge-accent text-xs hover:bg-forge-accent/20 transition-all"
            title="Upload your own PNG or SVG"
          >
            <Plus className="w-3 h-3" />
            Upload
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {/* Custom upload tile */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square bg-forge-panel border border-dashed border-forge-border rounded-lg hover:border-forge-accent hover:bg-forge-panel-hover transition-all flex flex-col items-center justify-center gap-1 p-1.5 group"
            title="Upload custom PNG or SVG"
          >
            <Upload className="w-6 h-6 text-forge-dim group-hover:text-forge-accent transition-colors" />
            <span className="text-2xs text-forge-dim group-hover:text-forge-muted text-center leading-tight">My Asset</span>
          </button>

          {filtered.map((asset) => (
            <button
              key={asset.id}
              onClick={() => addAsset(asset)}
              title={`Add ${asset.name}`}
              className="aspect-square bg-forge-panel border border-forge-border rounded-lg hover:border-forge-accent hover:bg-forge-panel-hover transition-all flex flex-col items-center justify-center gap-1 p-1.5 group"
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
            </button>
          ))}
        </div>

        {/* Brand colours */}
        <div className="h-px bg-forge-border mb-3" />
        <p className="text-2xs text-forge-dim uppercase tracking-wider px-1 mb-2">Brand Colours</p>
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
  );
}
