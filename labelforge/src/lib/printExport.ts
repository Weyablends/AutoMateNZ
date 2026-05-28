import { PDFDocument, rgb } from 'pdf-lib';
import type { ExportOptions } from './types';

const MM_TO_PT = 2.8346;

interface Dims { width: number; height: number }
interface Bleed { top: number; right: number; bottom: number; left: number }

export async function exportPrintReadyPDF(
  canvas: any,
  options: ExportOptions,
  dims: Dims,
  bleed: Bleed,
  fileName = 'label'
): Promise<void> {
  const bl = options.includeBleed ? bleed : { top: 0, right: 0, bottom: 0, left: 0 };
  const MARK_LEN_MM = 5;
  const MARK_GAP_MM = 2;
  const gutterMm = options.includeTrimMarks ? MARK_LEN_MM + MARK_GAP_MM : 2;

  const pageWmm = bl.left + dims.width + bl.right + gutterMm * 2;
  const pageHmm = bl.top + dims.height + bl.bottom + gutterMm * 2;
  const pageW = pageWmm * MM_TO_PT;
  const pageH = pageHmm * MM_TO_PT;

  // Hide guides, rasterize canvas, restore guides
  const guides = canvas.getObjects().filter((o: any) => o.data?.type === 'guide' || o.data?.type === 'grid');
  guides.forEach((o: any) => o.set({ visible: false }));
  canvas.renderAll();

  const dpiMul = options.resolution / 72;
  const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: dpiMul });

  guides.forEach((o: any) => o.set({ visible: true }));
  canvas.renderAll();

  // Decode base64 PNG to bytes
  const b64 = dataUrl.split(',')[1];
  const raw = atob(b64);
  const imgBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) imgBytes[i] = raw.charCodeAt(i);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(`LabelForge — ${fileName}`);
  pdfDoc.setCreator('LabelForge');
  pdfDoc.setSubject(`CMYK · ${options.resolution} DPI · ${dims.width}x${dims.height}mm`);
  pdfDoc.setKeywords(['CMYK', 'print-ready', 'label', 'packaging']);

  const page = pdfDoc.addPage([pageW, pageH]);
  const pngImage = await pdfDoc.embedPng(imgBytes);

  // Art bounding box (includes bleed) — PDF Y is from bottom
  const artX = gutterMm * MM_TO_PT;
  const artW = (bl.left + dims.width + bl.right) * MM_TO_PT;
  const artH = (bl.top + dims.height + bl.bottom) * MM_TO_PT;
  const artY = gutterMm * MM_TO_PT;

  page.drawImage(pngImage, { x: artX, y: artY, width: artW, height: artH });

  if (options.includeTrimMarks) {
    const trimLeft = (gutterMm + bl.left) * MM_TO_PT;
    const trimRight = (gutterMm + bl.left + dims.width) * MM_TO_PT;
    const trimBottom = (gutterMm + bl.bottom) * MM_TO_PT;
    const trimTop = (gutterMm + bl.bottom + dims.height) * MM_TO_PT;
    const markPt = MARK_LEN_MM * MM_TO_PT;
    const black = rgb(0, 0, 0);
    const lw = 0.5;

    [
      // Top-left
      { start: { x: 0, y: trimTop }, end: { x: markPt, y: trimTop } },
      { start: { x: trimLeft, y: pageH }, end: { x: trimLeft, y: pageH - markPt } },
      // Top-right
      { start: { x: pageW - markPt, y: trimTop }, end: { x: pageW, y: trimTop } },
      { start: { x: trimRight, y: pageH }, end: { x: trimRight, y: pageH - markPt } },
      // Bottom-left
      { start: { x: 0, y: trimBottom }, end: { x: markPt, y: trimBottom } },
      { start: { x: trimLeft, y: 0 }, end: { x: trimLeft, y: markPt } },
      // Bottom-right
      { start: { x: pageW - markPt, y: trimBottom }, end: { x: pageW, y: trimBottom } },
      { start: { x: trimRight, y: 0 }, end: { x: trimRight, y: markPt } },
    ].forEach((m) => page.drawLine({ ...m, thickness: lw, color: black }));
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.replace(/\.[^.]+$/, '')}-print-ready.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
