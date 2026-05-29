import type { TemplateAnalysis, PreflightItem, BrandColor, AssetItem } from './types';

export const mockTemplateAnalysis: TemplateAnalysis = {
  fileName: 'BVRG-Pouch-250ml-V2.3.pdf',
  fileType: 'PDF',
  fileSize: '2.4 MB',
  manufacturer: 'PacPrint Industries Ltd',
  version: '2.3',
  analysedAt: new Date().toISOString(),
  dimensions: { width: 150, height: 210, unit: 'mm' },
  bleed: { top: 3, right: 3, bottom: 3, left: 3, unit: 'mm' },
  safeZone: { top: 5, right: 5, bottom: 5, left: 5, unit: 'mm' },
  colorMode: 'CMYK',
  resolution: '300 DPI minimum (600 DPI recommended for fine text)',
  cmykProfile: 'ISO Coated v2 300% (ECI)',
  pantoneRequirements: ['PANTONE 485 C', 'PANTONE 877 C (Silver)'],
  detectedElements: [
    'Trim line (red)',
    'Bleed boundary (magenta)',
    'Safe zone (green dashed)',
    'Fold lines × 2',
    'Barcode zone (back panel, lower right)',
    'White ink layer',
    'Silver foil zone (front panel top)',
    'Tear notch (top right corner)',
    'Hang hole (top centre)',
  ],
  layers: [
    { id: 'l1', name: 'Dieline', type: 'dieline', color: '#FF3B30', locked: true, visible: true },
    { id: 'l2', name: 'Bleed Area', type: 'bleed', color: '#FF6B35', locked: true, visible: true },
    { id: 'l3', name: 'Safe Zone', type: 'safe_zone', color: '#34C759', locked: true, visible: true },
    { id: 'l4', name: 'Fold Lines', type: 'fold_line', color: '#5B7FFF', locked: true, visible: true },
    { id: 'l5', name: 'White Ink', type: 'white_ink', color: '#FFFFFF', locked: false, visible: true },
    { id: 'l6', name: 'PANTONE 485 C', type: 'spot_color', color: '#DA291C', locked: false, visible: true },
    { id: 'l7', name: 'PANTONE 877 C', type: 'spot_color', color: '#9D9EA0', locked: false, visible: true },
    { id: 'l8', name: 'Varnish (Gloss)', type: 'varnish', color: '#E8E8E800', locked: false, visible: true },
    { id: 'l9', name: 'Barcode Zone', type: 'barcode_zone', color: '#0055FF', locked: true, visible: true },
    { id: 'l10', name: 'Notes / Annotations', type: 'notes', color: '#888888', locked: true, visible: true },
  ],
  instructions: [
    {
      id: 'i01',
      text: 'ALL artwork must be CMYK only. No RGB, LAB or indexed colours anywhere in the file.',
      priority: 'critical',
      category: 'colour',
      acknowledged: false,
    },
    {
      id: 'i02',
      text: 'Bleed must extend exactly 3 mm beyond the trim edge on all four sides. Bleed layer must not be deleted.',
      priority: 'critical',
      category: 'bleed',
      acknowledged: false,
    },
    {
      id: 'i03',
      text: 'All live text and logos must remain entirely within the safe zone (5 mm inside trim). Critical content such as barcodes, legal text and nutritional info must be at least 8 mm from trim.',
      priority: 'critical',
      category: 'text',
      acknowledged: false,
    },
    {
      id: 'i04',
      text: 'Barcode: EAN-13 format, minimum width 32 mm, height 22 mm, 5 mm quiet zone each side. Place within barcode zone on back panel only. Background must be white or very light.',
      priority: 'critical',
      category: 'barcode',
      acknowledged: false,
    },
    {
      id: 'i05',
      text: 'Silver foil area (top 35 mm of front panel) must use spot colour named exactly "PANTONE 877 C" — no variation in naming. Do not simulate with CMYK.',
      priority: 'critical',
      category: 'colour',
      acknowledged: false,
    },
    {
      id: 'i06',
      text: 'Primary brand colour must use spot colour named exactly "PANTONE 485 C". Convert all instances before supply.',
      priority: 'critical',
      category: 'colour',
      acknowledged: false,
    },
    {
      id: 'i07',
      text: 'Nutritional information panel is mandatory on the back panel. Minimum font size 7 pt. Must follow local food-labelling regulations.',
      priority: 'critical',
      category: 'legal',
      acknowledged: false,
    },
    {
      id: 'i08',
      text: 'All fonts must be outlined/converted to paths, OR the font files must be embedded. No live unembedded fonts in the final PDF.',
      priority: 'high',
      category: 'text',
      acknowledged: false,
    },
    {
      id: 'i09',
      text: 'All raster/bitmap images must be minimum 300 DPI at final print size. Images below 200 DPI will be rejected.',
      priority: 'high',
      category: 'resolution',
      acknowledged: false,
    },
    {
      id: 'i10',
      text: 'Do NOT place any artwork or text within 4 mm of the tear notch area (top-right corner, 8×8 mm). This area is structurally cut.',
      priority: 'high',
      category: 'dieline',
      acknowledged: false,
    },
    {
      id: 'i11',
      text: 'Hang hole area (top-centre, 5 mm diameter) must remain clear. No ink within 2 mm of the hang hole edge.',
      priority: 'high',
      category: 'dieline',
      acknowledged: false,
    },
    {
      id: 'i12',
      text: 'Recycling logo (minimum 15 mm diameter) required in bottom-right area of back panel. Must be the approved Australasian Recycling Label (ARL) mark.',
      priority: 'high',
      category: 'legal',
      acknowledged: false,
    },
    {
      id: 'i13',
      text: 'Country of origin statement must appear above or immediately adjacent to the barcode. Minimum 8 pt.',
      priority: 'high',
      category: 'legal',
      acknowledged: false,
    },
    {
      id: 'i14',
      text: 'The Dieline layer must be preserved as a separate layer in the final PDF, named exactly "Dieline". Do not flatten or merge it with artwork layers.',
      priority: 'high',
      category: 'dieline',
      acknowledged: false,
    },
    {
      id: 'i15',
      text: 'White ink: Where white is required on coloured/foil backgrounds, add artwork to the "White Ink" layer. White ink prints separately — do not rely on paper white.',
      priority: 'medium',
      category: 'colour',
      acknowledged: false,
    },
    {
      id: 'i16',
      text: 'Minimum text size anywhere on label: 6 pt. Legal/allergen declarations: minimum 7 pt.',
      priority: 'medium',
      category: 'text',
      acknowledged: false,
    },
    {
      id: 'i17',
      text: 'Allergen information must be clearly differentiated (bold, different colour, or highlighted) from surrounding ingredient text.',
      priority: 'medium',
      category: 'legal',
      acknowledged: false,
    },
    {
      id: 'i18',
      text: 'Total ink coverage must not exceed 300% (ISO Coated v2 profile). Use the supplied ICC profile for soft-proofing.',
      priority: 'medium',
      category: 'colour',
      acknowledged: false,
    },
    {
      id: 'i19',
      text: 'Gloss varnish will be applied to the entire front panel. Ensure no matte/satin varnish zones conflict with the Varnish layer.',
      priority: 'low',
      category: 'structure',
      acknowledged: false,
    },
    {
      id: 'i20',
      text: 'Supply artwork as a single multi-layer PDF/X-4 file. Do not supply flattened files or separate layers as individual files.',
      priority: 'low',
      category: 'structure',
      acknowledged: false,
    },
  ],
  manufacturerNotes:
    'Template v2.3 — Updated March 2024. Replaces v2.1. Changes: Silver foil zone expanded by 5mm, hang hole relocated to centre. For technical queries contact prepress@pacprint.co.nz or call 09-555-0198 (Mon–Fri 8am–4pm NZT). Proof approval required before print run commences.',
};

export const mockPreflightItems: PreflightItem[] = [
  { id: 'pf01', category: 'Dimensions', label: 'Page dimensions', status: 'pass', message: '150 × 210 mm — matches template', fixable: false },
  { id: 'pf02', category: 'Bleed', label: 'Bleed present', status: 'pass', message: '3 mm bleed on all sides', fixable: false },
  { id: 'pf03', category: 'Bleed', label: 'Artwork extends to bleed', status: 'warning', message: 'Background colour does not reach bleed edge on right side', detail: 'Extend background 3mm further right to fill bleed area.', fixable: true },
  { id: 'pf04', category: 'Safe Zone', label: 'Text inside safe zone', status: 'pass', message: 'All text objects are within the safe zone', fixable: false },
  { id: 'pf05', category: 'Safe Zone', label: 'Logos inside safe zone', status: 'warning', message: '1 image object is partially outside the safe zone', detail: 'The logo on the front panel overlaps the safe zone boundary by 2 px.', fixable: true },
  { id: 'pf06', category: 'Colour', label: 'Colour mode', status: 'warning', message: '2 objects use RGB colour values', detail: 'Objects #img-03 and #rect-07 are RGB. Convert to CMYK before export.', fixable: true },
  { id: 'pf07', category: 'Colour', label: 'PANTONE 485 C present', status: 'pass', message: 'Spot colour PANTONE 485 C found and correctly named', fixable: false },
  { id: 'pf08', category: 'Colour', label: 'PANTONE 877 C present', status: 'fail', message: 'Required spot colour PANTONE 877 C is missing', detail: 'Silver foil zone on front panel requires this exact spot colour. Add it or the file will be rejected.', fixable: true },
  { id: 'pf09', category: 'Colour', label: 'Ink density ≤ 300%', status: 'pass', message: 'Maximum ink density 248% — within spec', fixable: false },
  { id: 'pf10', category: 'Typography', label: 'Fonts outlined/embedded', status: 'warning', message: '3 text objects use live fonts that are not embedded', detail: '"Inter", "Inter Bold" are not embedded. Outline all text or embed fonts before export.', fixable: true },
  { id: 'pf11', category: 'Typography', label: 'Minimum font size', status: 'pass', message: 'All text is 6 pt or larger', fixable: false },
  { id: 'pf12', category: 'Images', label: 'Image resolution', status: 'warning', message: '1 raster image below 300 DPI at final size', detail: '"product-photo.jpg" is 187 DPI. Replace with higher-resolution version.', fixable: false },
  { id: 'pf13', category: 'Barcode', label: 'Barcode present', status: 'pass', message: 'EAN-13 barcode found in barcode zone', fixable: false },
  { id: 'pf14', category: 'Barcode', label: 'Barcode quiet zone', status: 'pass', message: '5.2 mm quiet zone — meets 5 mm minimum', fixable: false },
  { id: 'pf15', category: 'Dieline', label: 'Dieline layer preserved', status: 'pass', message: 'Dieline layer present and locked', fixable: false },
  { id: 'pf16', category: 'Dieline', label: 'Tear notch clear', status: 'pass', message: 'No artwork within tear notch exclusion zone', fixable: false },
  { id: 'pf17', category: 'Legal', label: 'Nutrition panel', status: 'info', message: 'Nutrition panel detected — verify content is accurate before export', detail: 'The app cannot validate nutritional values. Please confirm all values with your nutritionist.', fixable: false },
  { id: 'pf18', category: 'Legal', label: 'Recycling mark', status: 'warning', message: 'No ARL recycling mark detected', detail: 'Add an Australasian Recycling Label (ARL) to the back panel before submitting.', fixable: false },
  { id: 'pf19', category: 'Legal', label: 'Country of origin', status: 'pass', message: '"Made in New Zealand" text found adjacent to barcode', fixable: false },
  { id: 'pf20', category: 'Structure', label: 'Instructions acknowledged', status: 'warning', message: '3 template instructions have not been acknowledged', detail: 'Complete the instruction checklist in the Analyze step.', fixable: false },
];

export const mockBrandColors: BrandColor[] = [
  { id: 'bc1', name: 'Brand Red', hex: '#DA291C', pantone: 'PANTONE 485 C', cmyk: { c: 0, m: 95, y: 100, k: 0 } },
  { id: 'bc2', name: 'Silver Foil', hex: '#9D9EA0', pantone: 'PANTONE 877 C', cmyk: { c: 0, m: 0, y: 0, k: 40 } },
  { id: 'bc3', name: 'Deep Navy', hex: '#0A1628', cmyk: { c: 95, m: 80, y: 40, k: 35 } },
  { id: 'bc4', name: 'Pure White', hex: '#FFFFFF', cmyk: { c: 0, m: 0, y: 0, k: 0 } },
  { id: 'bc5', name: 'Rich Black', hex: '#0C0C0C', cmyk: { c: 60, m: 40, y: 40, k: 100 } },
  { id: 'bc6', name: 'Citrus Gold', hex: '#F5A623', cmyk: { c: 0, m: 35, y: 90, k: 0 } },
];

export const mockAssets: AssetItem[] = [
  // ── Fruit ──────────────────────────────────────────────────────────────────
  {
    id: 'a01', name: 'Lemon', category: 'Fruit', thumbnail: 'lemon',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="28" ry="22" fill="#FFE034"/><ellipse cx="32" cy="32" rx="22" ry="16" fill="#FFD116"/><path d="M32 10 Q36 16 36 32 Q36 48 32 54 Q28 48 28 32 Q28 16 32 10Z" fill="#FFBE00" opacity="0.4"/><ellipse cx="10" cy="32" rx="4" ry="6" fill="#FFE034"/><ellipse cx="54" cy="32" rx="4" ry="6" fill="#FFE034"/></svg>`,
  },
  {
    id: 'a02', name: 'Lime', category: 'Fruit', thumbnail: 'lime',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#5CB85C"/><circle cx="32" cy="32" r="22" fill="#4CAF50"/><path d="M32 8 Q36 16 36 32 Q36 48 32 56 Q28 48 28 32 Q28 16 32 8Z" fill="#388E3C" opacity="0.4"/></svg>`,
  },
  {
    id: 'a03', name: 'Raspberry', category: 'Fruit', thumbnail: 'raspberry',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="30" r="12" fill="#C41E3A"/><circle cx="38" cy="30" r="12" fill="#C41E3A"/><circle cx="32" cy="20" r="12" fill="#D62345"/><circle cx="32" cy="40" r="12" fill="#D62345"/><circle cx="26" cy="30" r="4" fill="#A01830" opacity="0.6"/><circle cx="38" cy="30" r="4" fill="#A01830" opacity="0.6"/><circle cx="32" cy="20" r="4" fill="#A01830" opacity="0.6"/><circle cx="32" cy="40" r="4" fill="#A01830" opacity="0.6"/><path d="M28 8 L32 12 L36 8 L34 4 L30 4Z" fill="#2D5A1B"/></svg>`,
  },
  {
    id: 'a09', name: 'Strawberry', category: 'Fruit', thumbnail: 'strawberry',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 56 C16 44 8 28 12 18 Q16 10 24 12 Q28 13 32 18 Q36 13 40 12 Q48 10 52 18 C56 28 48 44 32 56Z" fill="#E53935"/><ellipse cx="24" cy="30" rx="2" ry="2.5" fill="#FFF176"/><ellipse cx="32" cy="24" rx="2" ry="2.5" fill="#FFF176"/><ellipse cx="40" cy="30" rx="2" ry="2.5" fill="#FFF176"/><ellipse cx="27" cy="40" rx="2" ry="2.5" fill="#FFF176"/><ellipse cx="37" cy="40" rx="2" ry="2.5" fill="#FFF176"/><path d="M24 12 Q20 4 16 8 Q20 14 24 12Z" fill="#43A047"/><path d="M32 10 Q32 2 28 6 Q30 12 32 10Z" fill="#43A047"/><path d="M40 12 Q44 4 48 8 Q44 14 40 12Z" fill="#43A047"/></svg>`,
  },
  {
    id: 'a10', name: 'Orange', category: 'Fruit', thumbnail: 'orange',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="34" r="26" fill="#FF8C00"/><circle cx="32" cy="34" r="20" fill="#FFA500"/><path d="M32 14 Q36 24 36 34 Q36 44 32 54 Q28 44 28 34 Q28 24 32 14Z" fill="#FF6F00" opacity="0.5"/><path d="M12 34 Q22 30 32 34 Q22 38 12 34Z" fill="#FF6F00" opacity="0.5"/><path d="M52 34 Q42 30 32 34 Q42 38 52 34Z" fill="#FF6F00" opacity="0.5"/><path d="M28 8 Q30 2 32 8 L34 12 Q32 8 30 12Z" fill="#43A047" stroke="#2E7D32" stroke-width="0.5"/></svg>`,
  },
  {
    id: 'a11', name: 'Mango', category: 'Fruit', thumbnail: 'mango',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 8 C48 8 58 22 56 38 C54 52 44 60 32 60 C20 60 10 52 8 38 C6 22 16 8 32 8Z" fill="#FF8F00"/><path d="M32 12 C44 12 52 24 50 38 C48 50 40 56 32 56" fill="none" stroke="#FFB300" stroke-width="4" opacity="0.5"/><path d="M28 4 Q32 0 34 6 L32 10 Q30 4 28 4Z" fill="#33691E"/></svg>`,
  },
  {
    id: 'a12', name: 'Apple', category: 'Fruit', thumbnail: 'apple',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M20 16 C10 16 6 28 6 38 C6 52 14 60 24 60 C28 60 30 58 32 58 C34 58 36 60 40 60 C50 60 58 52 58 38 C58 28 54 16 44 16 C40 16 36 18 32 18 C28 18 24 16 20 16Z" fill="#E53935"/><path d="M14 28 C14 22 18 16 24 16" fill="none" stroke="#FFCDD2" stroke-width="3" stroke-linecap="round"/><path d="M32 18 L32 8" stroke="#5D4037" stroke-width="2" stroke-linecap="round"/><path d="M32 8 Q38 4 40 10" fill="none" stroke="#43A047" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'a13', name: 'Pineapple', category: 'Fruit', thumbnail: 'pineapple',
    svgContent: `<svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="52" rx="20" ry="26" fill="#FDD835"/><line x1="32" y1="26" x2="32" y2="78" stroke="#F9A825" stroke-width="2"/><line x1="12" y1="40" x2="52" y2="64" stroke="#F9A825" stroke-width="1.5"/><line x1="52" y1="40" x2="12" y2="64" stroke="#F9A825" stroke-width="1.5"/><line x1="12" y1="52" x2="52" y2="52" stroke="#F9A825" stroke-width="1.5"/><path d="M24 26 Q20 12 28 4 Q32 12 32 26Z" fill="#33691E"/><path d="M32 26 Q32 10 38 4 Q44 10 40 26Z" fill="#43A047"/><path d="M32 26 Q28 12 22 8 Q18 16 24 26Z" fill="#2E7D32"/></svg>`,
  },
  {
    id: 'a14', name: 'Kiwifruit', category: 'Fruit', thumbnail: 'kiwifruit',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="28" fill="#8BC34A"/><circle cx="32" cy="32" r="22" fill="#F5F5DC"/><circle cx="32" cy="32" r="6" fill="#6D4C41"/><line x1="32" y1="10" x2="32" y2="54" stroke="#8BC34A" stroke-width="1.5" opacity="0.7"/><line x1="10" y1="32" x2="54" y2="32" stroke="#8BC34A" stroke-width="1.5" opacity="0.7"/><line x1="16" y1="16" x2="48" y2="48" stroke="#8BC34A" stroke-width="1.5" opacity="0.7"/><line x1="48" y1="16" x2="16" y2="48" stroke="#8BC34A" stroke-width="1.5" opacity="0.7"/></svg>`,
  },
  {
    id: 'a15', name: 'Watermelon', category: 'Fruit', thumbnail: 'watermelon',
    svgContent: `<svg viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg"><path d="M4 44 Q4 4 40 4 Q76 4 76 44Z" fill="#4CAF50"/><path d="M10 44 Q10 10 40 10 Q70 10 70 44Z" fill="#F5F5F5" stroke="none"/><path d="M14 44 Q14 14 40 14 Q66 14 66 44Z" fill="#E53935"/><ellipse cx="28" cy="32" rx="3" ry="4" fill="#212121" transform="rotate(-15 28 32)"/><ellipse cx="40" cy="36" rx="3" ry="4" fill="#212121"/><ellipse cx="52" cy="32" rx="3" ry="4" fill="#212121" transform="rotate(15 52 32)"/></svg>`,
  },
  {
    id: 'a16', name: 'Blueberries', category: 'Fruit', thumbnail: 'blueberries',
    svgContent: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="38" r="14" fill="#3949AB"/><circle cx="42" cy="38" r="14" fill="#3949AB"/><circle cx="32" cy="26" r="14" fill="#5C6BC0"/><circle cx="22" cy="38" r="5" fill="#7986CB" opacity="0.5"/><circle cx="42" cy="38" r="5" fill="#7986CB" opacity="0.5"/><circle cx="32" cy="26" r="5" fill="#7986CB" opacity="0.5"/><path d="M22 24 L22 16 L28 12" fill="none" stroke="#43A047" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  },
  // ── Products ───────────────────────────────────────────────────────────────
  {
    id: 'a17', name: 'Beverage Can', category: 'Products', thumbnail: 'can',
    svgContent: `<svg viewBox="0 0 50 76" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="10" width="38" height="56" rx="3" fill="#E0E0E0"/><ellipse cx="25" cy="10" rx="19" ry="5" fill="#BDBDBD"/><ellipse cx="25" cy="66" rx="19" ry="5" fill="#9E9E9E"/><rect x="8" y="18" width="8" height="48" fill="white" opacity="0.25" rx="2"/><rect x="6" y="20" width="38" height="32" fill="#5B7FFF"/><text x="25" y="40" text-anchor="middle" font-family="sans-serif" font-size="6" font-weight="bold" fill="white">BEVERAGE</text><ellipse cx="25" cy="8" rx="8" ry="2.5" fill="#9E9E9E"/><rect x="21" y="4" width="8" height="4" rx="1.5" fill="#757575"/></svg>`,
  },
  {
    id: 'a18', name: 'Glass Bottle', category: 'Products', thumbnail: 'bottle',
    svgContent: `<svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="4" width="16" height="8" rx="2" fill="#90A4AE"/><path d="M8 20 Q4 24 4 32 L4 68 Q4 72 8 72 L32 72 Q36 72 36 68 L36 32 Q36 24 32 20 L28 12 L12 12 Z" fill="#B3E5FC" opacity="0.85"/><rect x="6" y="36" width="28" height="20" fill="#29B6F6" opacity="0.4" rx="1"/><rect x="8" y="24" width="6" height="44" fill="white" opacity="0.2" rx="2"/><ellipse cx="20" cy="68" rx="14" ry="3" fill="#78909C" opacity="0.3"/></svg>`,
  },
  {
    id: 'a19', name: 'Pouch', category: 'Products', thumbnail: 'pouch',
    svgContent: `<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg"><path d="M10 8 Q10 4 18 4 L42 4 Q50 4 50 8 L54 68 Q54 76 30 76 Q6 76 6 68 Z" fill="#E3F2FD"/><path d="M10 8 Q10 4 18 4 L42 4 Q50 4 50 8 L54 68 Q54 76 30 76 Q6 76 6 68 Z" fill="none" stroke="#90CAF9" stroke-width="2"/><rect x="14" y="24" width="32" height="28" fill="#5B7FFF" opacity="0.6" rx="3"/><circle cx="30" cy="6" r="3" fill="#1565C0"/><rect x="10" y="4" width="40" height="6" rx="3" fill="#1565C0" opacity="0.5"/></svg>`,
  },
  {
    id: 'a20', name: 'Water Drop', category: 'Products', thumbnail: 'water',
    svgContent: `<svg viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg"><path d="M24 4 L40 32 Q40 52 24 56 Q8 52 8 32 Z" fill="#29B6F6"/><path d="M24 4 L40 32 Q40 52 24 56 Q8 52 8 32 Z" fill="none" stroke="#0288D1" stroke-width="1.5"/><path d="M16 36 Q18 28 24 26" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/></svg>`,
  },
  // ── Claims ─────────────────────────────────────────────────────────────────
  {
    id: 'a04', name: 'Organic', category: 'Claims', thumbnail: 'organic',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,4 52,12 64,8 68,20 78,28 74,40 78,52 68,60 64,72 52,68 40,76 28,68 16,72 12,60 2,52 6,40 2,28 12,20 16,8 28,12" fill="#2E7D32" stroke="#1B5E20" stroke-width="1.5"/><text x="40" y="34" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="white">CERTIFIED</text><text x="40" y="46" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="white">ORGANIC</text></svg>`,
  },
  {
    id: 'a05', name: 'Non-GMO', category: 'Claims', thumbnail: 'nongmo',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="36" fill="none" stroke="#388E3C" stroke-width="3"/><text x="40" y="34" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="#388E3C">NON</text><text x="40" y="44" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="#388E3C">GMO</text><path d="M16 62 Q40 52 64 62" fill="none" stroke="#388E3C" stroke-width="2"/></svg>`,
  },
  {
    id: 'a06', name: 'Gluten Free', category: 'Claims', thumbnail: 'glutenfree',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="72" height="72" rx="8" fill="#F57C00" stroke="#E65100" stroke-width="1.5"/><text x="40" y="30" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="white">GLUTEN</text><text x="40" y="42" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="white">FREE</text><line x1="12" y1="52" x2="68" y2="52" stroke="white" stroke-width="1.5" opacity="0.5"/><text x="40" y="62" text-anchor="middle" font-family="sans-serif" font-size="6" fill="white">CERTIFIED</text></svg>`,
  },
  {
    id: 'a21', name: 'Vegan', category: 'Claims', thumbnail: 'vegan',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="36" fill="#43A047"/><text x="40" y="36" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="white">100%</text><text x="40" y="50" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="bold" fill="white">VEGAN</text></svg>`,
  },
  {
    id: 'a22', name: 'Dairy Free', category: 'Claims', thumbnail: 'dairyfree',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="36" fill="#1565C0" stroke="#0D47A1" stroke-width="1.5"/><text x="40" y="34" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="white">DAIRY</text><text x="40" y="46" text-anchor="middle" font-family="sans-serif" font-size="8" font-weight="bold" fill="white">FREE</text><line x1="14" y1="14" x2="66" y2="66" stroke="white" stroke-width="3" opacity="0.3"/></svg>`,
  },
  {
    id: 'a23', name: 'Sugar Free', category: 'Claims', thumbnail: 'sugarfree',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="72" height="72" rx="36" fill="#6A1B9A"/><text x="40" y="34" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="white">NO ADDED</text><text x="40" y="46" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="bold" fill="white">SUGAR</text></svg>`,
  },
  {
    id: 'a24', name: 'Fair Trade', category: 'Claims', thumbnail: 'fairtrade',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="36" fill="#00796B" stroke="#004D40" stroke-width="1.5"/><path d="M40 20 L46 34 L62 34 L48 44 L54 58 L40 48 L26 58 L32 44 L18 34 L34 34Z" fill="#FDD835"/></svg>`,
  },
  // ── NZ Icons ───────────────────────────────────────────────────────────────
  {
    id: 'a25', name: 'Silver Fern', category: 'NZ', thumbnail: 'fern',
    svgContent: `<svg viewBox="0 0 48 80" xmlns="http://www.w3.org/2000/svg"><path d="M24 76 Q24 40 24 4" stroke="#9E9E9E" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M24 60 Q12 52 8 40" stroke="#9E9E9E" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M24 60 Q36 52 40 40" stroke="#BDBDBD" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.5"/><path d="M24 44 Q14 36 10 26" stroke="#9E9E9E" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M24 44 Q34 36 38 26" stroke="#BDBDBD" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.5"/><path d="M24 30 Q16 22 14 14" stroke="#9E9E9E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M24 30 Q32 22 34 14" stroke="#BDBDBD" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/></svg>`,
  },
  {
    id: 'a26', name: 'Kiwi Bird', category: 'NZ', thumbnail: 'kiwi',
    svgContent: `<svg viewBox="0 0 80 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="36" rx="28" ry="22" fill="#6D4C41"/><ellipse cx="40" cy="36" rx="22" ry="16" fill="#795548"/><path d="M16 30 Q4 28 2 36 L14 40 Q16 38 16 30Z" fill="#6D4C41"/><path d="M2 36 L0 38 L4 40 L8 38Z" fill="#FF8F00" stroke="#E65100" stroke-width="0.5"/><circle cx="18" cy="28" r="3" fill="#212121"/><circle cx="19" cy="27" r="1" fill="white"/><path d="M30 50 L26 60 L34 58Z" fill="#5D4037"/><path d="M50 50 L48 62 L56 58Z" fill="#5D4037"/></svg>`,
  },
  {
    id: 'a27', name: 'Made in NZ', category: 'NZ', thumbnail: 'madeinNZ',
    svgContent: `<svg viewBox="0 0 100 56" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="96" height="52" rx="6" fill="#00247D" stroke="#CCCCCC" stroke-width="1"/><line x1="2" y1="2" x2="98" y2="54" stroke="white" stroke-width="3"/><line x1="98" y1="2" x2="2" y2="54" stroke="white" stroke-width="3"/><rect x="2" y="22" width="96" height="12" fill="white"/><rect x="2" y="22" width="96" height="12" fill="#CC142B" opacity="0.85"/><text x="50" y="38" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="white">MADE IN NEW ZEALAND</text></svg>`,
  },
  // ── Decorative ─────────────────────────────────────────────────────────────
  {
    id: 'a07', name: 'Wave', category: 'Decorative', thumbnail: 'wave',
    svgContent: `<svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg"><path d="M0 20 C20 5, 40 35, 60 20 S100 5, 120 20 S160 35, 180 20 S200 5, 200 20" fill="none" stroke="#5B7FFF" stroke-width="3"/><path d="M0 28 C20 13, 40 43, 60 28 S100 13, 120 28 S160 43, 180 28 S200 13, 200 28" fill="none" stroke="#5B7FFF" stroke-width="2" opacity="0.5"/></svg>`,
  },
  {
    id: 'a08', name: 'Starburst', category: 'Decorative', thumbnail: 'burst',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,2 44,30 72,20 52,42 78,54 48,52 50,80 40,58 30,80 32,52 2,54 28,42 8,20 36,30" fill="#FFB347"/></svg>`,
  },
  {
    id: 'a28', name: 'Ribbon Banner', category: 'Decorative', thumbnail: 'ribbon',
    svgContent: `<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><path d="M0 8 L10 20 L0 32 L110 32 L120 20 L110 8Z" fill="#DA291C"/><path d="M0 8 L10 20 L0 32 L110 32 L120 20 L110 8Z" fill="none" stroke="#B71C1C" stroke-width="1"/><text x="60" y="24" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="white">PREMIUM</text></svg>`,
  },
  {
    id: 'a29', name: 'Quality Seal', category: 'Decorative', thumbnail: 'seal',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><polygon points="40,2 48,10 58,6 62,16 72,18 70,28 78,34 72,42 76,52 66,56 64,66 54,66 48,74 40,70 32,74 26,66 16,66 14,56 4,52 8,42 2,34 10,28 8,18 18,16 22,6 32,10" fill="#FFD700" stroke="#FFA000" stroke-width="1.5"/><text x="40" y="36" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#5D4037">QUALITY</text><text x="40" y="48" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#5D4037">ASSURED</text></svg>`,
  },
  {
    id: 'a30', name: 'Leaf', category: 'Decorative', thumbnail: 'leaf',
    svgContent: `<svg viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg"><path d="M24 60 Q4 44 4 24 Q4 4 24 4 Q44 4 44 24 Q44 44 24 60Z" fill="#4CAF50"/><path d="M24 60 L24 4" stroke="#2E7D32" stroke-width="2" stroke-linecap="round"/><path d="M24 44 Q14 36 8 28" stroke="#2E7D32" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M24 32 Q14 24 10 16" stroke="#2E7D32" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M24 44 Q34 36 40 28" stroke="#388E3C" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'a31', name: 'Splash', category: 'Decorative', thumbnail: 'splash',
    svgContent: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 10 Q50 30 70 28 Q52 36 62 56 Q44 44 40 64 Q36 44 18 56 Q28 36 10 28 Q30 30 40 10Z" fill="#29B6F6"/><circle cx="40" cy="40" r="10" fill="#0288D1"/></svg>`,
  },
];
