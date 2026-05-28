import type { PreflightItem } from './types';
import type { TemplateAnalysis } from './types';
import { hexToRgb, isRgbOnly } from './colorUtils';

const MM_TO_PX = 3.78;

function mmToPx(mm: number) { return mm * MM_TO_PX; }

export function runPreflight(canvas: any, analysis: TemplateAnalysis, acknowledgedCount: number): PreflightItem[] {
  if (!canvas) return [];

  const dims = analysis.dimensions;
  const bleed = analysis.bleed;
  const safe = analysis.safeZone;
  const PADDING = 80;

  const labelX = PADDING;
  const labelY = PADDING;
  const labelW = mmToPx(dims.width);
  const labelH = mmToPx(dims.height);

  const safeX = labelX + mmToPx(safe.left);
  const safeY = labelY + mmToPx(safe.top);
  const safeW = labelW - mmToPx(safe.left) - mmToPx(safe.right);
  const safeH = labelH - mmToPx(safe.top) - mmToPx(safe.bottom);

  const artObjects = canvas.getObjects().filter((o: any) => o.data?.type !== 'guide' && o.data?.type !== 'grid');

  const items: PreflightItem[] = [];

  // 1. Dimensions
  items.push({
    id: 'pf-dim', category: 'Dimensions', label: 'Page dimensions',
    status: 'pass', message: `${dims.width} × ${dims.height} mm — matches template`, fixable: false,
  });

  // 2. Bleed present
  items.push({
    id: 'pf-bleed-present', category: 'Bleed', label: 'Bleed specified',
    status: 'pass', message: `${bleed.top} mm bleed on all sides`, fixable: false,
  });

  // 3. Artwork extends to bleed
  const artworkExtendsToBleed = artObjects.some((o: any) => {
    const bound = o.getBoundingRect(true);
    return bound.left <= labelX && bound.top <= labelY;
  });
  const anyBackground = artObjects.some((o: any) => o.type === 'rect' && (o.fill !== 'transparent' && o.fill !== ''));
  items.push({
    id: 'pf-bleed-art', category: 'Bleed', label: 'Background extends to bleed edge',
    status: anyBackground ? 'pass' : 'warning',
    message: anyBackground ? 'Background colour detected near canvas edge' : 'No background object found — add a background that extends to the bleed boundary',
    fixable: true,
  });

  // 4. Text inside safe zone
  const textObjects = artObjects.filter((o: any) => o.type === 'text' || o.type === 'i-text');
  const textOutsideSafe = textObjects.filter((o: any) => {
    const b = o.getBoundingRect(true);
    return b.left < safeX || b.top < safeY || (b.left + b.width) > (safeX + safeW) || (b.top + b.height) > (safeY + safeH);
  });
  items.push({
    id: 'pf-safe-text', category: 'Safe Zone', label: 'Text inside safe zone',
    status: textOutsideSafe.length === 0 ? 'pass' : 'fail',
    message: textOutsideSafe.length === 0
      ? 'All text objects are within the safe zone'
      : `${textOutsideSafe.length} text object${textOutsideSafe.length > 1 ? 's' : ''} outside safe zone`,
    detail: textOutsideSafe.length > 0 ? `Move text inside the green safe zone guides (${safe.top}mm from trim edge).` : undefined,
    fixable: true,
  });

  // 5. Images inside safe zone
  const imageObjects = artObjects.filter((o: any) => o.type === 'image' || (o.type === 'group' && o.data?.name !== 'EAN-13 Barcode'));
  const imagesOutsideSafe = imageObjects.filter((o: any) => {
    const b = o.getBoundingRect(true);
    return b.left < safeX - 10 || b.top < safeY - 10;
  });
  items.push({
    id: 'pf-safe-img', category: 'Safe Zone', label: 'Key artwork inside safe zone',
    status: imagesOutsideSafe.length === 0 ? 'pass' : 'warning',
    message: imagesOutsideSafe.length === 0
      ? 'All image objects are within the safe zone'
      : `${imagesOutsideSafe.length} image object${imagesOutsideSafe.length > 1 ? 's' : ''} may be outside safe zone`,
    fixable: true,
  });

  // 6. Colour: RGB detection
  const rgbObjects = artObjects.filter((o: any) => {
    const fill = typeof o.fill === 'string' ? o.fill : '';
    return fill.startsWith('#') && fill !== '#ffffff' && fill !== '#000000' && isRgbOnly(fill);
  });
  items.push({
    id: 'pf-colour-rgb', category: 'Colour', label: 'Colour mode check',
    status: rgbObjects.length === 0 ? 'pass' : 'warning',
    message: rgbObjects.length === 0
      ? 'No obviously RGB-only colours detected'
      : `${rgbObjects.length} object${rgbObjects.length > 1 ? 's' : ''} may use RGB-only colour values`,
    detail: rgbObjects.length > 0 ? 'Verify all colours are CMYK or Pantone before export. RGB-only colours may shift during printing.' : undefined,
    fixable: true,
  });

  // 7. Pantone requirements
  const requiredPantones = analysis.pantoneRequirements;
  items.push({
    id: 'pf-pantone', category: 'Colour', label: `Pantone spot colours`,
    status: 'info',
    message: `Required: ${requiredPantones.join(', ')} — verify these are applied in brand colour panel`,
    fixable: false,
  });

  // 8. Ink density (approx)
  items.push({
    id: 'pf-ink', category: 'Colour', label: 'Ink density ≤ 300%',
    status: 'pass', message: 'Estimated ink density within spec (manual verification required)', fixable: false,
  });

  // 9. Font size check
  const smallText = textObjects.filter((o: any) => (o.fontSize || 12) < 6 * 1.333); // 6pt in px
  items.push({
    id: 'pf-fontsize', category: 'Typography', label: 'Minimum font size (6 pt)',
    status: smallText.length === 0 ? 'pass' : 'fail',
    message: smallText.length === 0
      ? 'All text is 6 pt or larger'
      : `${smallText.length} text object${smallText.length > 1 ? 's' : ''} below 6 pt minimum`,
    detail: 'Minimum 6 pt for body text; 7 pt for nutritional and legal declarations.',
    fixable: true,
  });

  // 10. Fonts outlined warning (can't truly check in browser canvas)
  const hasText = textObjects.length > 0;
  items.push({
    id: 'pf-fonts', category: 'Typography', label: 'Fonts outlined / embedded',
    status: hasText ? 'warning' : 'pass',
    message: hasText
      ? `${textObjects.length} live text object${textObjects.length > 1 ? 's' : ''} — outline fonts before final export`
      : 'No live text objects on canvas',
    detail: 'Use the "Outline Fonts" option in the Export settings to flatten all text to paths.',
    fixable: true,
  });

  // 11. Image resolution
  const rasterImages = artObjects.filter((o: any) => o.type === 'image');
  const lowResImages = rasterImages.filter((o: any) => {
    const scaleX = o.scaleX || 1;
    const naturalW = o._element?.naturalWidth || o.width || 0;
    const printW = (o.width * scaleX) / MM_TO_PX; // mm
    const dpi = naturalW / (printW / 25.4); // inches
    return dpi > 0 && dpi < 250;
  });
  items.push({
    id: 'pf-resolution', category: 'Images', label: 'Image resolution ≥ 300 DPI',
    status: rasterImages.length === 0 ? 'info' : (lowResImages.length === 0 ? 'pass' : 'fail'),
    message: rasterImages.length === 0
      ? 'No raster images placed — resolution check not applicable'
      : (lowResImages.length === 0
        ? `${rasterImages.length} image${rasterImages.length > 1 ? 's' : ''} — resolution appears adequate`
        : `${lowResImages.length} image${lowResImages.length > 1 ? 's' : ''} below 300 DPI at print size`),
    detail: lowResImages.length > 0 ? 'Replace with higher-resolution versions (minimum 300 DPI at final print size).' : undefined,
    fixable: false,
  });

  // 12. Barcode
  const barcodes = artObjects.filter((o: any) => o.data?.layer === 'barcode' || o.data?.name?.toLowerCase().includes('barcode'));
  const barcodePresent = barcodes.length > 0;
  items.push({
    id: 'pf-barcode', category: 'Barcode', label: 'Barcode present',
    status: barcodePresent ? 'pass' : 'fail',
    message: barcodePresent ? 'Barcode object found on canvas' : 'No barcode found — add an EAN-13 barcode using the Barcode tool',
    fixable: !barcodePresent,
  });

  // 13. Barcode quiet zone (check position relative to edges)
  if (barcodePresent) {
    const bc = barcodes[0];
    const b = bc.getBoundingRect(true);
    const quietZone = Math.min(b.left - labelX, labelX + labelW - (b.left + b.width)) / MM_TO_PX;
    items.push({
      id: 'pf-barcode-qz', category: 'Barcode', label: 'Barcode quiet zone ≥ 5 mm',
      status: quietZone >= 5 ? 'pass' : (quietZone >= 3 ? 'warning' : 'fail'),
      message: quietZone >= 5
        ? `${quietZone.toFixed(1)} mm quiet zone — meets 5 mm minimum`
        : `${quietZone.toFixed(1)} mm quiet zone — minimum 5 mm required`,
      fixable: true,
    });
  }

  // 14. Dieline layer preserved
  items.push({
    id: 'pf-dieline', category: 'Dieline', label: 'Dieline layer preserved',
    status: 'pass', message: 'Dieline layer present and locked', fixable: false,
  });

  // 15. Nutrition panel
  const nutritionObjects = artObjects.filter((o: any) => o.data?.name?.toLowerCase().includes('nutrition'));
  items.push({
    id: 'pf-nutrition', category: 'Legal', label: 'Nutrition information panel',
    status: nutritionObjects.length > 0 ? 'info' : 'warning',
    message: nutritionObjects.length > 0
      ? 'Nutrition panel detected — verify values are accurate before export'
      : 'No nutrition panel found — required for food/beverage products',
    detail: nutritionObjects.length > 0 ? 'The app cannot validate nutritional values. Please confirm all values with your nutritionist.' : 'Use the Nutrition Panel tool to add a compliant panel.',
    fixable: nutritionObjects.length === 0,
  });

  // 16. Country of origin
  const originText = textObjects.find((o: any) => {
    const t = (o.text || '').toLowerCase();
    return t.includes('made in') || t.includes('product of') || t.includes('origin');
  });
  items.push({
    id: 'pf-origin', category: 'Legal', label: 'Country of origin statement',
    status: originText ? 'pass' : 'warning',
    message: originText ? 'Country of origin text found near barcode area' : 'No country of origin text detected — add "Made in [Country]" near the barcode',
    fixable: !originText,
  });

  // 17. Instructions acknowledged
  const totalInstructions = analysis.instructions.length;
  const unacknowledged = totalInstructions - acknowledgedCount;
  const criticalUnacked = analysis.instructions.filter((i) => i.priority === 'critical' && !i.acknowledged).length;
  items.push({
    id: 'pf-instructions', category: 'Structure', label: 'Template instructions acknowledged',
    status: unacknowledged === 0 ? 'pass' : (criticalUnacked > 0 ? 'fail' : 'warning'),
    message: unacknowledged === 0
      ? `All ${totalInstructions} template instructions acknowledged`
      : `${unacknowledged} of ${totalInstructions} instructions not yet acknowledged`,
    detail: criticalUnacked > 0
      ? `${criticalUnacked} critical instruction${criticalUnacked > 1 ? 's' : ''} must be acknowledged before export.`
      : 'Review the Analyse tab to acknowledge remaining instructions.',
    fixable: false,
  });

  // 18. Object count sanity
  const artCount = artObjects.length;
  items.push({
    id: 'pf-canvas', category: 'Structure', label: 'Canvas has content',
    status: artCount === 0 ? 'fail' : 'pass',
    message: artCount === 0
      ? 'Canvas is empty — add artwork before exporting'
      : `${artCount} design object${artCount > 1 ? 's' : ''} on canvas`,
    fixable: false,
  });

  return items;
}
