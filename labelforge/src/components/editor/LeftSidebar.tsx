'use client';
import { Wrench, Layers, Package } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';
import ToolsPanel from './ToolsPanel';
import LayersPanel from './LayersPanel';
import AssetsPanel from './AssetsPanel';
import type { SidebarTab } from '@/lib/types';

const TABS: { id: SidebarTab; icon: React.ReactNode; label: string }[] = [
  { id: 'tools', icon: <Wrench className="w-4 h-4" />, label: 'Tools' },
  { id: 'layers', icon: <Layers className="w-4 h-4" />, label: 'Layers' },
  { id: 'assets', icon: <Package className="w-4 h-4" />, label: 'Assets' },
];

export default function LeftSidebar() {
  const { sidebarTab, setSidebarTab } = useEditorStore();

  return (
    <aside className="w-56 bg-forge-surface border-r border-forge-border flex flex-col shrink-0 overflow-hidden">
      {/* Tab buttons */}
      <div className="flex border-b border-forge-border shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            title={tab.label}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-2.5 text-2xs transition-all border-b-2 -mb-px',
              sidebarTab === tab.id
                ? 'border-forge-accent text-forge-accent bg-forge-panel/40'
                : 'border-transparent text-forge-dim hover:text-forge-muted hover:bg-forge-panel/20'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {sidebarTab === 'tools' && <ToolsPanel />}
        {sidebarTab === 'layers' && <LayersPanel />}
        {sidebarTab === 'assets' && <AssetsPanel />}
      </div>
    </aside>
  );
}
