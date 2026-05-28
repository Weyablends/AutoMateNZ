export type FileType = 'PDF' | 'AI' | 'SVG' | 'EPS' | 'DXF' | 'PNG' | 'JPG' | 'JPEG';

export type LayerType =
  | 'dieline'
  | 'bleed'
  | 'safe_zone'
  | 'trim_line'
  | 'fold_line'
  | 'cut_line'
  | 'spot_color'
  | 'white_ink'
  | 'varnish'
  | 'barcode_zone'
  | 'notes'
  | 'artwork'
  | 'text'
  | 'image'
  | 'background';

export type InstructionPriority = 'critical' | 'high' | 'medium' | 'low';

export interface TemplateInstruction {
  id: string;
  text: string;
  priority: InstructionPriority;
  category: 'colour' | 'bleed' | 'text' | 'barcode' | 'resolution' | 'structure' | 'legal' | 'dieline';
  acknowledged: boolean;
  notes?: string;
}

export interface TemplateLayer {
  id: string;
  name: string;
  type: LayerType;
  color: string;
  locked: boolean;
  visible: boolean;
}

export interface TemplateDimensions {
  width: number;
  height: number;
  unit: 'mm' | 'in' | 'px';
}

export interface TemplateBleed {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: 'mm' | 'in';
}

export interface TemplateAnalysis {
  fileName: string;
  fileType: FileType;
  fileSize: string;
  dimensions: TemplateDimensions;
  bleed: TemplateBleed;
  safeZone: TemplateBleed;
  colorMode: 'CMYK' | 'RGB' | 'Pantone' | 'Mixed';
  resolution: string;
  layers: TemplateLayer[];
  pantoneRequirements: string[];
  cmykProfile: string;
  detectedElements: string[];
  instructions: TemplateInstruction[];
  manufacturerNotes: string;
  manufacturer: string;
  version: string;
  analysedAt: string;
}

export type ToolMode =
  | 'select'
  | 'pan'
  | 'text'
  | 'rect'
  | 'ellipse'
  | 'pen'
  | 'image'
  | 'barcode'
  | 'nutrition'
  | 'zoom_in'
  | 'zoom_out';

export type CanvasLayer = {
  id: string;
  name: string;
  type: 'template' | 'dieline' | 'artwork' | 'text' | 'image' | 'barcode' | 'guide';
  visible: boolean;
  locked: boolean;
  objectIds: string[];
};

export type ObjectProperties = {
  id: string;
  type: 'text' | 'rect' | 'ellipse' | 'image' | 'group' | 'path' | 'barcode';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  text?: string;
  layer?: string;
};

export type PreflightStatus = 'pass' | 'warning' | 'fail' | 'info';

export interface PreflightItem {
  id: string;
  category: string;
  label: string;
  status: PreflightStatus;
  message: string;
  detail?: string;
  fixable: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'jpg';
  colorProfile: 'CMYK' | 'RGB' | 'Pantone';
  resolution: 150 | 300 | 600;
  includeBleed: boolean;
  includeTrimMarks: boolean;
  includeColorBars: boolean;
  flattenTransparency: boolean;
  outlineFonts: boolean;
  embedImages: boolean;
  includeGuides: boolean;
  pageSize: 'template' | 'a4' | 'us-letter';
}

export type SidebarTab = 'tools' | 'layers' | 'assets';

export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  cmyk?: { c: number; m: number; y: number; k: number };
  pantone?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  svgContent?: string;
  thumbnail: string;
}
