'use client';
import { Settings, SlidersHorizontal } from 'lucide-react';
import PropertiesPanel from './PropertiesPanel';

export default function RightSidebar({ fabricRef }: { fabricRef: React.MutableRefObject<any> }) {
  return (
    <aside className="w-60 bg-forge-surface border-l border-forge-border flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="h-9 border-b border-forge-border flex items-center px-3 gap-2 shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5 text-forge-muted" />
        <span className="text-xs font-medium text-forge-text">Properties</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <PropertiesPanel fabricRef={fabricRef} />
      </div>
    </aside>
  );
}
