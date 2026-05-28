'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { mockAssets, mockBrandColors } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Fruit', 'Claims', 'Decorative'];

export default function AssetsPanel() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

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

  return (
    <div className="flex flex-col h-full">
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
        <p className="text-2xs text-forge-dim uppercase tracking-wider px-1 mb-2">SVG Assets</p>
        <div className="grid grid-cols-3 gap-1.5 mb-4">
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
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-forge-panel transition-all"
              title={color.pantone || color.hex}
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
