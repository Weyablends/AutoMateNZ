export interface CMYK { c: number; m: number; y: number; k: number }
export interface RGB  { r: number; g: number; b: number }

export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): RGB {
  const r = 255 * (1 - c / 100) * (1 - k / 100);
  const g = 255 * (1 - m / 100) * (1 - k / 100);
  const b = 255 * (1 - y / 100) * (1 - k / 100);
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

export function cmykToHex(c: number, m: number, y: number, k: number): string {
  const { r, g, b } = cmykToRgb(c, m, y, k);
  return rgbToHex(r, g, b);
}

export function hexToCmyk(hex: string): CMYK | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToCmyk(rgb.r, rgb.g, rgb.b);
}

/** Rough check: colours with equal R,G,B (greys) or obvious CMYK primaries are "safe" */
export function isRgbOnly(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
  // Colours that need more than one CMYK channel mixed in unusual proportions
  // are flagged as "likely RGB-only" design assets
  const channelsUsed = [cmyk.c, cmyk.m, cmyk.y, cmyk.k].filter((v) => v > 5).length;
  return channelsUsed > 2 && cmyk.k < 5;
}

export interface PantoneColor {
  name: string;
  code: string;
  hex: string;
  cmyk: CMYK;
}

export const PANTONE_SWATCHES: PantoneColor[] = [
  { name: 'Process Black C', code: 'BLACK C', hex: '#2B2B2B', cmyk: { c: 0, m: 0, y: 0, k: 100 } },
  { name: 'Warm Red C', code: '485 C', hex: '#DA291C', cmyk: { c: 0, m: 95, y: 100, k: 0 } },
  { name: 'Rubine Red C', code: '185 C', hex: '#E4003A', cmyk: { c: 0, m: 100, y: 60, k: 0 } },
  { name: 'Rhodamine Red C', code: 'RHODAMINE RED C', hex: '#E4126B', cmyk: { c: 0, m: 95, y: 20, k: 0 } },
  { name: 'Purple C', code: '267 C', hex: '#570861', cmyk: { c: 68, m: 100, y: 0, k: 30 } },
  { name: 'Reflex Blue C', code: 'REFLEX BLUE C', hex: '#001489', cmyk: { c: 100, m: 80, y: 0, k: 5 } },
  { name: 'Process Blue C', code: '801 C', hex: '#0085CA', cmyk: { c: 100, m: 20, y: 0, k: 0 } },
  { name: 'Green C', code: '354 C', hex: '#00A850', cmyk: { c: 100, m: 0, y: 100, k: 0 } },
  { name: 'Yellow C', code: 'YELLOW C', hex: '#FFD700', cmyk: { c: 0, m: 0, y: 100, k: 0 } },
  { name: 'Orange 021 C', code: 'ORANGE 021 C', hex: '#FE5000', cmyk: { c: 0, m: 65, y: 100, k: 0 } },
  { name: 'Silver 877 C', code: '877 C', hex: '#8A8D8F', cmyk: { c: 0, m: 0, y: 0, k: 45 } },
  { name: 'Gold 871 C', code: '871 C', hex: '#84754E', cmyk: { c: 25, m: 35, y: 65, k: 10 } },
  { name: 'White', code: 'WHITE', hex: '#FFFFFF', cmyk: { c: 0, m: 0, y: 0, k: 0 } },
  { name: 'Cool Gray 1 C', code: 'COOL GRAY 1 C', hex: '#D9D9D6', cmyk: { c: 0, m: 0, y: 0, k: 17 } },
  { name: 'Cool Gray 5 C', code: 'COOL GRAY 5 C', hex: '#B1B3B3', cmyk: { c: 0, m: 0, y: 0, k: 33 } },
  { name: 'Cool Gray 11 C', code: 'COOL GRAY 11 C', hex: '#53565A', cmyk: { c: 0, m: 0, y: 0, k: 71 } },
  { name: 'Teal C', code: '326 C', hex: '#00B2A9', cmyk: { c: 100, m: 0, y: 25, k: 0 } },
  { name: 'Aqua C', code: '3115 C', hex: '#00A9CE', cmyk: { c: 100, m: 10, y: 0, k: 0 } },
  { name: 'Lime Green C', code: '382 C', hex: '#C5E86C', cmyk: { c: 20, m: 0, y: 75, k: 0 } },
  { name: 'Sky Blue C', code: '292 C', hex: '#69B3E7', cmyk: { c: 50, m: 10, y: 0, k: 0 } },
];
