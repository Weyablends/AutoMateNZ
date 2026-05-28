import type { TemplateAnalysis, TemplateLayer, TemplateInstruction, LayerType, FileType } from './types';
import { mockTemplateAnalysis } from './mockData';

const MM_PER_PT = 0.352778;

function ptToMm(pt: number): number {
  return Math.round(pt * MM_PER_PT * 10) / 10;
}

async function parsePdfDimensions(buffer: ArrayBuffer): Promise<{ width: number; height: number } | null> {
  try {
    const text = new TextDecoder('latin1').decode(new Uint8Array(buffer));
    const match = text.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
    if (match) {
      const w = parseFloat(match[3]) - parseFloat(match[1]);
      const h = parseFloat(match[4]) - parseFloat(match[2]);
      return { width: ptToMm(w), height: ptToMm(h) };
    }
  } catch (_) { /* ignore */ }
  return null;
}

function extractPdfTextStrings(buffer: ArrayBuffer): string[] {
  try {
    const text = new TextDecoder('latin1').decode(new Uint8Array(buffer));
    const strings: string[] = [];
    // Extract text between parentheses (BT ... ET blocks)
    const parenthesisRe = /\(([^)]{8,200})\)/g;
    let m: RegExpExecArray | null;
    while ((m = parenthesisRe.exec(text)) !== null) {
      const s = m[1].replace(/\\n/g, ' ').replace(/\\r/g, ' ').trim();
      if (s.length > 8 && /[a-zA-Z]/.test(s)) strings.push(s);
    }
    return Array.from(new Set(strings));
  } catch (_) {
    return [];
  }
}

function parseSvgDimensions(text: string): { width: number; height: number } | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  const svg = doc.documentElement;
  const vb = svg.getAttribute('viewBox');
  if (vb) {
    const parts = vb.split(/[\s,]+/).map(Number);
    if (parts.length === 4) {
      // Assume viewBox units are mm if no explicit unit, otherwise parse width/height
      const w = parseFloat(svg.getAttribute('width') || String(parts[2]));
      const h = parseFloat(svg.getAttribute('height') || String(parts[3]));
      return { width: w, height: h };
    }
  }
  const w = parseFloat(svg.getAttribute('width') || '0');
  const h = parseFloat(svg.getAttribute('height') || '0');
  if (w && h) return { width: w, height: h };
  return null;
}

function detectSvgLayers(text: string): TemplateLayer[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  const layers: TemplateLayer[] = [];
  const strokeColorMap: Record<string, { type: LayerType; name: string }> = {
    '#ff0000': { type: 'trim_line', name: 'Trim / Dieline' },
    '#ff3b30': { type: 'trim_line', name: 'Trim / Dieline' },
    '#ff00ff': { type: 'bleed', name: 'Bleed Area' },
    '#ff6b35': { type: 'bleed', name: 'Bleed Area' },
    '#00ff00': { type: 'safe_zone', name: 'Safe Zone' },
    '#34c759': { type: 'safe_zone', name: 'Safe Zone' },
    '#0000ff': { type: 'cut_line', name: 'Cut Line' },
    '#5b7fff': { type: 'barcode_zone', name: 'Barcode Zone' },
  };
  const seen = new Set<string>();
  doc.querySelectorAll('[stroke]').forEach((el) => {
    const stroke = (el.getAttribute('stroke') || '').toLowerCase();
    const key = stroke;
    if (!seen.has(key) && strokeColorMap[key]) {
      seen.add(key);
      const entry = strokeColorMap[key];
      layers.push({ id: `svgl-${layers.length}`, name: entry.name, type: entry.type, color: stroke, locked: true, visible: true });
    }
  });
  // Also check <g id="..."> or <g inkscape:label="..."> for named layers
  doc.querySelectorAll('g[id], g[inkscape\\:label]').forEach((el) => {
    const id = el.getAttribute('id') || el.getAttribute('inkscape:label') || '';
    if (id && !seen.has(id.toLowerCase())) {
      seen.add(id.toLowerCase());
      layers.push({ id: `svgl-${layers.length}`, name: id, type: 'artwork', color: '#888', locked: false, visible: true });
    }
  });
  return layers;
}

function matchInstructionsFromText(strings: string[]): TemplateInstruction[] {
  const instructions: TemplateInstruction[] = [];
  const categories: Array<{ keywords: string[]; cat: TemplateInstruction['category']; priority: TemplateInstruction['priority'] }> = [
    { keywords: ['cmyk', 'colour', 'color', 'rgb', 'pantone', 'spot'], cat: 'colour', priority: 'critical' },
    { keywords: ['bleed', 'mm bleed', '3mm', '5mm'], cat: 'bleed', priority: 'critical' },
    { keywords: ['barcode', 'ean', 'upc', 'quiet zone'], cat: 'barcode', priority: 'critical' },
    { keywords: ['font', 'outlined', 'text', 'minimum'], cat: 'text', priority: 'high' },
    { keywords: ['dpi', 'resolution', 'ppi'], cat: 'resolution', priority: 'high' },
    { keywords: ['dieline', 'die line', 'layer'], cat: 'dieline', priority: 'high' },
    { keywords: ['nutrition', 'ingredient', 'allergen', 'legal'], cat: 'legal', priority: 'critical' },
    { keywords: ['recycle', 'arl', 'symbol'], cat: 'legal', priority: 'medium' },
  ];

  strings.slice(0, 30).forEach((s, i) => {
    const lower = s.toLowerCase();
    for (const cat of categories) {
      if (cat.keywords.some((kw) => lower.includes(kw))) {
        instructions.push({
          id: `parsed-${i}`,
          text: s,
          priority: cat.priority,
          category: cat.cat,
          acknowledged: false,
        });
        break;
      }
    }
  });
  return instructions;
}

export async function parseTemplateFile(file: File): Promise<TemplateAnalysis> {
  const base: TemplateAnalysis = {
    ...mockTemplateAnalysis,
    fileName: file.name,
    fileType: file.name.split('.').pop()?.toUpperCase() as FileType ?? 'PDF',
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    analysedAt: new Date().toISOString(),
  };

  try {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (ext === 'svg') {
      const text = await file.text();
      const dims = parseSvgDimensions(text);
      const layers = detectSvgLayers(text);
      return {
        ...base,
        dimensions: dims
          ? { width: Math.round(dims.width), height: Math.round(dims.height), unit: 'mm' }
          : base.dimensions,
        layers: layers.length > 0
          ? [...layers, ...base.layers.filter((l) => l.type === 'notes')]
          : base.layers,
      };
    }

    if (ext === 'pdf') {
      const buf = await file.arrayBuffer();
      const dims = await parsePdfDimensions(buf);
      const strings = extractPdfTextStrings(buf);
      const parsedInstructions = matchInstructionsFromText(strings);
      return {
        ...base,
        dimensions: dims
          ? { width: Math.round(dims.width), height: Math.round(dims.height), unit: 'mm' }
          : base.dimensions,
        instructions: parsedInstructions.length >= 3
          ? parsedInstructions
          : base.instructions,
        manufacturerNotes: strings.find((s) => s.length > 40) || base.manufacturerNotes,
      };
    }

    if (ext === 'ai' || ext === 'eps') {
      const text = await file.text();
      const bbMatch = text.match(/%%BoundingBox:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
      if (bbMatch) {
        const w = ptToMm(parseFloat(bbMatch[3]) - parseFloat(bbMatch[1]));
        const h = ptToMm(parseFloat(bbMatch[4]) - parseFloat(bbMatch[2]));
        return { ...base, dimensions: { width: Math.round(w), height: Math.round(h), unit: 'mm' } };
      }
    }

    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      const url = URL.createObjectURL(file);
      const dims = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Assume 300 DPI → 1px = 0.0846mm
          resolve({ width: Math.round(img.naturalWidth * 0.0846), height: Math.round(img.naturalHeight * 0.0846) });
          URL.revokeObjectURL(url);
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve({ width: 150, height: 210 }); };
        img.src = url;
      });
      return { ...base, dimensions: { ...dims, unit: 'mm' } };
    }
  } catch (_) { /* fall through to mock */ }

  return base;
}
