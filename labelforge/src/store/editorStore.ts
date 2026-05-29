import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  TemplateAnalysis,
  ToolMode,
  CanvasLayer,
  ObjectProperties,
  SidebarTab,
  BrandColor,
  ExportOptions,
} from '@/lib/types';
import { mockBrandColors } from '@/lib/mockData';

interface EditorState {
  // Template
  templateAnalysis: TemplateAnalysis | null;
  templateFile: { name: string; type: string } | null;
  designFile: { name: string; type: string } | null;
  templateDataUrl: string | null;

  // Tool
  activeTool: ToolMode;
  sidebarTab: SidebarTab;

  // Canvas
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showRulers: boolean;
  showGuides: boolean;
  snapToGrid: boolean;

  // Selection
  selectedObjectId: string | null;
  selectedProperties: ObjectProperties | null;

  // Layers
  layers: CanvasLayer[];

  // History
  historyIndex: number;
  historyLength: number;

  // Brand
  brandColors: BrandColor[];

  // Export
  exportOptions: ExportOptions;

  // UI
  isExporting: boolean;
  preflightOpen: boolean;
  qrModalOpen: boolean;
  pendingExport: boolean;
}

interface EditorActions {
  setTemplateAnalysis: (analysis: TemplateAnalysis) => void;
  setTemplateFile: (file: { name: string; type: string } | null) => void;
  setDesignFile: (file: { name: string; type: string } | null) => void;
  setTemplateDataUrl: (url: string | null) => void;
  setActiveTool: (tool: ToolMode) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  toggleGrid: () => void;
  toggleRulers: () => void;
  toggleGuides: () => void;
  toggleSnap: () => void;
  setSelectedObject: (id: string | null, props: ObjectProperties | null) => void;
  setLayers: (layers: CanvasLayer[]) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setHistoryState: (index: number, length: number) => void;
  addBrandColor: (color: BrandColor) => void;
  setExportOptions: (opts: Partial<ExportOptions>) => void;
  setIsExporting: (v: boolean) => void;
  setPreflightOpen: (v: boolean) => void;
  setQrModalOpen: (v: boolean) => void;
  setPendingExport: (v: boolean) => void;
  acknowledgeInstruction: (id: string) => void;
}

const defaultExportOptions: ExportOptions = {
  format: 'pdf',
  colorProfile: 'CMYK',
  resolution: 300,
  includeBleed: true,
  includeTrimMarks: true,
  includeColorBars: false,
  flattenTransparency: true,
  outlineFonts: true,
  embedImages: true,
  includeGuides: false,
  pageSize: 'template',
};

export const useEditorStore = create<EditorState & EditorActions>()(
  immer((set) => ({
    templateAnalysis: null,
    templateFile: null,
    designFile: null,
    templateDataUrl: null,
    activeTool: 'select',
    sidebarTab: 'tools',
    zoom: 1,
    panX: 0,
    panY: 0,
    showGrid: false,
    showRulers: true,
    showGuides: true,
    snapToGrid: true,
    selectedObjectId: null,
    selectedProperties: null,
    layers: [
      { id: 'layer-template', name: 'Template / Guides', type: 'template', visible: true, locked: true, objectIds: [] },
      { id: 'layer-dieline', name: 'Dieline', type: 'dieline', visible: true, locked: true, objectIds: [] },
      { id: 'layer-artwork', name: 'Artwork', type: 'artwork', visible: true, locked: false, objectIds: [] },
      { id: 'layer-images', name: 'Images', type: 'image', visible: true, locked: false, objectIds: [] },
      { id: 'layer-text', name: 'Text', type: 'text', visible: true, locked: false, objectIds: [] },
      { id: 'layer-barcode', name: 'Barcode / QR', type: 'barcode', visible: true, locked: false, objectIds: [] },
    ],
    historyIndex: 0,
    historyLength: 1,
    brandColors: mockBrandColors,
    exportOptions: defaultExportOptions,
    isExporting: false,
    preflightOpen: false,
    qrModalOpen: false,
    pendingExport: false,

    setTemplateAnalysis: (analysis) => set((s) => { s.templateAnalysis = analysis; }),
    setTemplateFile: (file) => set((s) => { s.templateFile = file; }),
    setDesignFile: (file) => set((s) => { s.designFile = file; }),
    setTemplateDataUrl: (url) => set((s) => { s.templateDataUrl = url; }),
    setActiveTool: (tool) => set((s) => { s.activeTool = tool; }),
    setSidebarTab: (tab) => set((s) => { s.sidebarTab = tab; }),
    setZoom: (zoom) => set((s) => { s.zoom = Math.min(5, Math.max(0.1, zoom)); }),
    setPan: (x, y) => set((s) => { s.panX = x; s.panY = y; }),
    toggleGrid: () => set((s) => { s.showGrid = !s.showGrid; }),
    toggleRulers: () => set((s) => { s.showRulers = !s.showRulers; }),
    toggleGuides: () => set((s) => { s.showGuides = !s.showGuides; }),
    toggleSnap: () => set((s) => { s.snapToGrid = !s.snapToGrid; }),
    setSelectedObject: (id, props) => set((s) => { s.selectedObjectId = id; s.selectedProperties = props; }),
    setLayers: (layers) => set((s) => { s.layers = layers; }),
    toggleLayerVisibility: (id) =>
      set((s) => {
        const l = s.layers.find((x) => x.id === id);
        if (l) l.visible = !l.visible;
      }),
    toggleLayerLock: (id) =>
      set((s) => {
        const l = s.layers.find((x) => x.id === id);
        if (l) l.locked = !l.locked;
      }),
    setHistoryState: (index, length) => set((s) => { s.historyIndex = index; s.historyLength = length; }),
    addBrandColor: (color) => set((s) => { s.brandColors.push(color); }),
    setExportOptions: (opts) => set((s) => { Object.assign(s.exportOptions, opts); }),
    setIsExporting: (v) => set((s) => { s.isExporting = v; }),
    setPreflightOpen: (v) => set((s) => { s.preflightOpen = v; }),
    setQrModalOpen: (v) => set((s) => { s.qrModalOpen = v; }),
    setPendingExport: (v) => set((s) => { s.pendingExport = v; }),
    acknowledgeInstruction: (id) =>
      set((s) => {
        if (s.templateAnalysis) {
          const instr = s.templateAnalysis.instructions.find((i) => i.id === id);
          if (instr) instr.acknowledged = !instr.acknowledged;
        }
      }),
  }))
);
