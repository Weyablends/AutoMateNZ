'use client';
import { useEffect, useRef, useCallback } from 'react';
import { useEditorStore } from '@/store/editorStore';
import type { ObjectProperties } from '@/lib/types';

// Scale: 3.78px per mm
const SCALE = 3.78;
const PADDING = 80; // canvas padding around label

function mmToPx(mm: number) { return Math.round(mm * SCALE); }

interface Props {
  fabricRef: React.MutableRefObject<any>;
}

export default function EditorCanvas({ fabricRef }: Props) {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(0);
  const isPanningRef = useRef(false);
  const lastPanRef = useRef({ x: 0, y: 0 });

  const {
    templateAnalysis, activeTool, showGrid, showGuides,
    zoom, setZoom, setSelectedObject, setHistoryState, layers,
  } = useEditorStore();

  const dims = templateAnalysis?.dimensions ?? { width: 150, height: 210 };
  const bleed = templateAnalysis?.bleed ?? { top: 3, right: 3, bottom: 3, left: 3 };
  const safe = templateAnalysis?.safeZone ?? { top: 5, right: 5, bottom: 5, left: 5 };

  const labelW = mmToPx(dims.width);
  const labelH = mmToPx(dims.height);
  const bleedT = mmToPx(bleed.top);
  const bleedR = mmToPx(bleed.right);
  const bleedB = mmToPx(bleed.bottom);
  const bleedL = mmToPx(bleed.left);
  const safeT = mmToPx(safe.top);
  const safeR = mmToPx(safe.right);
  const safeB = mmToPx(safe.bottom);
  const safeL = mmToPx(safe.left);

  const canvasW = labelW + PADDING * 2;
  const canvasH = labelH + PADDING * 2;
  const labelOriginX = PADDING;
  const labelOriginY = PADDING;

  const saveHistory = useCallback((canvas: any) => {
    const json = JSON.stringify(canvas.toDatalessJSON(['selectable', 'evented', 'hoverCursor', 'data']));
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(json);
    historyIdxRef.current = historyRef.current.length - 1;
    setHistoryState(historyIdxRef.current, historyRef.current.length);
  }, [setHistoryState]);

  const buildGuides = useCallback((fabric: any, canvas: any) => {
    const guides: any[] = [];
    const commonProps = { selectable: false, evented: false, hoverCursor: 'default', excludeFromExport: true };

    // Label background
    guides.push(new fabric.Rect({
      left: labelOriginX, top: labelOriginY,
      width: labelW, height: labelH,
      fill: '#FFFFFF', shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.4)', blur: 24, offsetX: 0, offsetY: 8 }),
      ...commonProps, data: { type: 'guide', layer: 'template' },
    }));

    // Bleed area pattern fill
    guides.push(new fabric.Rect({
      left: labelOriginX - bleedL, top: labelOriginY - bleedT,
      width: labelW + bleedL + bleedR, height: labelH + bleedT + bleedB,
      fill: 'transparent',
      stroke: '#FF6B35', strokeWidth: 1.5, strokeDashArray: [5, 4],
      ...commonProps, data: { type: 'guide', layer: 'bleed' },
    }));

    // Trim line
    guides.push(new fabric.Rect({
      left: labelOriginX, top: labelOriginY,
      width: labelW, height: labelH,
      fill: 'transparent',
      stroke: '#FF3B30', strokeWidth: 1.5,
      ...commonProps, data: { type: 'guide', layer: 'dieline' },
    }));

    // Safe zone
    if (showGuides) {
      guides.push(new fabric.Rect({
        left: labelOriginX + safeL, top: labelOriginY + safeT,
        width: labelW - safeL - safeR, height: labelH - safeT - safeB,
        fill: 'transparent',
        stroke: '#34C759', strokeWidth: 1, strokeDashArray: [4, 4],
        ...commonProps, data: { type: 'guide', layer: 'safe_zone' },
      }));
    }

    // Bleed corner labels
    const labelStyle = { fontSize: 8, fill: '#FF6B35', fontFamily: 'JetBrains Mono, monospace', selectable: false, evented: false };
    guides.push(new fabric.Text(`BLEED ${bleed.top}mm`, {
      left: labelOriginX - bleedL + 2, top: labelOriginY - bleedT - 10,
      ...labelStyle, data: { type: 'guide' },
    }));

    // Grid
    if (showGrid) {
      const gridSize = mmToPx(5);
      for (let x = labelOriginX; x <= labelOriginX + labelW; x += gridSize) {
        guides.push(new fabric.Line([x, labelOriginY, x, labelOriginY + labelH], {
          stroke: 'rgba(91,127,255,0.12)', strokeWidth: 0.5, ...commonProps, data: { type: 'grid' },
        }));
      }
      for (let y = labelOriginY; y <= labelOriginY + labelH; y += gridSize) {
        guides.push(new fabric.Line([labelOriginX, y, labelOriginX + labelW, y], {
          stroke: 'rgba(91,127,255,0.12)', strokeWidth: 0.5, ...commonProps, data: { type: 'grid' },
        }));
      }
    }

    // Barcode zone indicator (from mock template)
    guides.push(new fabric.Rect({
      left: labelOriginX + labelW - mmToPx(44), top: labelOriginY + labelH - mmToPx(36),
      width: mmToPx(40), height: mmToPx(28),
      fill: 'rgba(91,127,255,0.04)', stroke: '#5B7FFF', strokeWidth: 1, strokeDashArray: [3, 3],
      ...commonProps, data: { type: 'guide', layer: 'barcode' },
    }));
    guides.push(new fabric.Text('BARCODE\nZONE', {
      left: labelOriginX + labelW - mmToPx(44) + 4,
      top: labelOriginY + labelH - mmToPx(36) + 4,
      fontSize: 7, fill: '#5B7FFF', fontFamily: 'JetBrains Mono, monospace',
      selectable: false, evented: false, data: { type: 'guide' },
    }));

    // Silver foil zone indicator
    guides.push(new fabric.Rect({
      left: labelOriginX, top: labelOriginY,
      width: labelW, height: mmToPx(35),
      fill: 'rgba(157,158,160,0.08)',
      ...commonProps, data: { type: 'guide', layer: 'foil' },
    }));

    guides.forEach((obj) => canvas.add(obj));
    return guides;
  }, [labelOriginX, labelOriginY, labelW, labelH, bleedL, bleedT, bleedR, bleedB, safeL, safeT, safeR, safeB, bleed, showGrid, showGuides]);

  const objectToProps = (obj: any): ObjectProperties => ({
    id: obj.data?.id || String(obj.__uid || Date.now()),
    type: obj.type === 'i-text' || obj.type === 'text' ? 'text' : obj.type,
    x: Math.round(obj.left ?? 0),
    y: Math.round(obj.top ?? 0),
    width: Math.round((obj.width ?? 0) * (obj.scaleX ?? 1)),
    height: Math.round((obj.height ?? 0) * (obj.scaleY ?? 1)),
    rotation: Math.round(obj.angle ?? 0),
    opacity: Math.round((obj.opacity ?? 1) * 100) / 100,
    fill: typeof obj.fill === 'string' ? obj.fill : '#000000',
    stroke: typeof obj.stroke === 'string' ? obj.stroke : 'transparent',
    strokeWidth: obj.strokeWidth ?? 0,
    fontSize: obj.fontSize,
    fontFamily: obj.fontFamily,
    fontWeight: obj.fontWeight,
    fontStyle: obj.fontStyle,
    underline: obj.underline,
    textAlign: obj.textAlign,
    text: obj.text,
  });

  useEffect(() => {
    if (!canvasElRef.current) return;
    let canvas: any;
    let isDrawingShape = false;
    let shapeStart = { x: 0, y: 0 };
    let activeShape: any = null;
    let clickCount = 0;

    import('fabric').then(({ fabric }) => {
      canvas = new fabric.Canvas(canvasElRef.current!, {
        width: canvasW, height: canvasH,
        backgroundColor: '#1C1C28',
        selection: true,
        preserveObjectStacking: true,
      });

      fabricRef.current = canvas;

      // Add guides
      buildGuides(fabric, canvas);

      // Initial history snapshot
      saveHistory(canvas);

      // Object selection
      canvas.on('selection:created', (e: any) => {
        const obj = e.selected?.[0];
        if (obj) setSelectedObject(obj.data?.id || 'obj', objectToProps(obj));
      });
      canvas.on('selection:updated', (e: any) => {
        const obj = e.selected?.[0];
        if (obj) setSelectedObject(obj.data?.id || 'obj', objectToProps(obj));
      });
      canvas.on('selection:cleared', () => {
        setSelectedObject(null, null);
      });
      canvas.on('object:modified', () => saveHistory(canvas));

      // Snap to grid
      canvas.on('object:moving', (opt: any) => {
        if (!useEditorStore.getState().snapToGrid) return;
        const gridPx = mmToPx(5);
        const obj = opt.target;
        obj.set({
          left: Math.round((obj.left ?? 0) / gridPx) * gridPx,
          top: Math.round((obj.top ?? 0) / gridPx) * gridPx,
        });
      });

      // Mouse events for tools
      canvas.on('mouse:down', (opt: any) => {
        const { e, pointer } = opt;
        const tool = useEditorStore.getState().activeTool;

        if (tool === 'pan' || e.altKey) {
          isPanningRef.current = true;
          lastPanRef.current = { x: e.clientX, y: e.clientY };
          canvas.selection = false;
          return;
        }

        if (tool === 'rect') {
          canvas.selection = false;
          isDrawingShape = true;
          shapeStart = { x: pointer.x, y: pointer.y };
          activeShape = new fabric.Rect({
            left: pointer.x, top: pointer.y,
            width: 0, height: 0,
            fill: 'rgba(91,127,255,0.2)',
            stroke: '#5B7FFF', strokeWidth: 1.5,
            data: { id: `rect-${Date.now()}`, layer: 'artwork' },
          });
          canvas.add(activeShape);
        }

        if (tool === 'ellipse') {
          canvas.selection = false;
          isDrawingShape = true;
          shapeStart = { x: pointer.x, y: pointer.y };
          activeShape = new fabric.Ellipse({
            left: pointer.x, top: pointer.y,
            rx: 0, ry: 0,
            fill: 'rgba(91,127,255,0.2)',
            stroke: '#5B7FFF', strokeWidth: 1.5,
            data: { id: `ellipse-${Date.now()}`, layer: 'artwork' },
          });
          canvas.add(activeShape);
        }

        if (tool === 'text') {
          clickCount++;
          if (clickCount === 1) {
            const text = new fabric.IText('Double-click to edit', {
              left: pointer.x, top: pointer.y,
              fontSize: 20, fill: '#1C1C1C',
              fontFamily: 'Inter, sans-serif',
              data: { id: `text-${Date.now()}`, layer: 'text' },
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            saveHistory(canvas);
          }
          setTimeout(() => { clickCount = 0; }, 500);
        }
      });

      canvas.on('mouse:move', (opt: any) => {
        const { e, pointer } = opt;

        if (isPanningRef.current) {
          const vpt = canvas.viewportTransform.slice();
          vpt[4] += e.clientX - lastPanRef.current.x;
          vpt[5] += e.clientY - lastPanRef.current.y;
          canvas.setViewportTransform(vpt);
          lastPanRef.current = { x: e.clientX, y: e.clientY };
          return;
        }

        if (!isDrawingShape || !activeShape) return;
        const dx = pointer.x - shapeStart.x;
        const dy = pointer.y - shapeStart.y;

        if (activeShape.type === 'rect') {
          activeShape.set({
            left: dx < 0 ? pointer.x : shapeStart.x,
            top: dy < 0 ? pointer.y : shapeStart.y,
            width: Math.abs(dx), height: Math.abs(dy),
          });
        } else if (activeShape.type === 'ellipse') {
          activeShape.set({
            left: dx < 0 ? pointer.x : shapeStart.x,
            top: dy < 0 ? pointer.y : shapeStart.y,
            rx: Math.abs(dx) / 2, ry: Math.abs(dy) / 2,
          });
        }
        canvas.renderAll();
      });

      canvas.on('mouse:up', () => {
        if (isPanningRef.current) {
          isPanningRef.current = false;
          canvas.selection = true;
          return;
        }
        if (isDrawingShape && activeShape) {
          isDrawingShape = false;
          canvas.setActiveObject(activeShape);
          useEditorStore.getState().setActiveTool('select');
          saveHistory(canvas);
          activeShape = null;
        }
      });

      // Zoom with wheel
      canvas.on('mouse:wheel', (opt: any) => {
        opt.e.preventDefault();
        const delta = opt.e.deltaY;
        let z = canvas.getZoom();
        z *= 0.999 ** delta;
        z = Math.min(5, Math.max(0.1, z));
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, z);
        setZoom(z);
      });

      // Keyboard shortcuts
      const handleKey = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            // Redo
            if (historyIdxRef.current < historyRef.current.length - 1) {
              historyIdxRef.current++;
              canvas.loadFromJSON(historyRef.current[historyIdxRef.current], () => canvas.renderAll());
              setHistoryState(historyIdxRef.current, historyRef.current.length);
            }
          } else {
            // Undo
            if (historyIdxRef.current > 0) {
              historyIdxRef.current--;
              canvas.loadFromJSON(historyRef.current[historyIdxRef.current], () => canvas.renderAll());
              setHistoryState(historyIdxRef.current, historyRef.current.length);
            }
          }
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          const active = canvas.getActiveObjects();
          if (active.length) {
            active.forEach((obj: any) => { if (obj.selectable) canvas.remove(obj); });
            canvas.discardActiveObject();
            canvas.renderAll();
            saveHistory(canvas);
          }
        }
        if (e.key === 'Escape') {
          canvas.discardActiveObject();
          canvas.renderAll();
          useEditorStore.getState().setActiveTool('select');
        }
      };
      window.addEventListener('keydown', handleKey);
      return () => {
        window.removeEventListener('keydown', handleKey);
        canvas.dispose();
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasW, canvasH]);

  // Rebuild guides when grid/guides toggle
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    import('fabric').then(({ fabric }) => {
      const toRemove = canvas.getObjects().filter((o: any) => o.data?.type === 'guide' || o.data?.type === 'grid');
      toRemove.forEach((o: any) => canvas.remove(o));
      buildGuides(fabric, canvas);
      canvas.renderAll();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGrid, showGuides]);

  // Sync tool cursor
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const cursorMap: Record<string, string> = {
      select: 'default', pan: 'grab', text: 'text',
      rect: 'crosshair', ellipse: 'crosshair', pen: 'crosshair',
      zoom_in: 'zoom-in', zoom_out: 'zoom-out',
    };
    const cursor = cursorMap[activeTool] || 'default';
    canvas.defaultCursor = cursor;
    canvas.hoverCursor = activeTool === 'select' ? 'move' : cursor;
    if (activeTool === 'select') {
      canvas.selection = true;
      canvas.getObjects().forEach((obj: any) => {
        if (obj.selectable !== false) obj.set({ selectable: true, evented: true });
      });
    } else if (activeTool !== 'rect' && activeTool !== 'ellipse' && activeTool !== 'text') {
      canvas.selection = false;
    }
    canvas.renderAll();
  }, [activeTool, fabricRef]);

  // Expose addImage method
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    (window as any).__lf_addImage = (dataUrl: string, name: string) => {
      import('fabric').then(({ fabric }) => {
        fabric.Image.fromURL(dataUrl, (img: any) => {
          img.scaleToWidth(mmToPx(60));
          img.set({ left: labelOriginX + 20, top: labelOriginY + 20, data: { id: `img-${Date.now()}`, layer: 'images', name } });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveHistory(canvas);
        });
      });
    };
    (window as any).__lf_addSVG = (svgString: string, name: string) => {
      import('fabric').then(({ fabric }) => {
        fabric.loadSVGFromString(svgString, (objects: any[], options: any) => {
          const group = fabric.util.groupSVGElements(objects, options);
          group.scaleToWidth(mmToPx(30));
          group.set({ left: labelOriginX + 20, top: labelOriginY + 60, data: { id: `svg-${Date.now()}`, layer: 'artwork', name } });
          canvas.add(group);
          canvas.setActiveObject(group);
          canvas.renderAll();
          saveHistory(canvas);
        });
      });
    };
    (window as any).__lf_addBarcode = () => {
      import('fabric').then(({ fabric }) => {
        const barcodeGroup = [];
        // Barcode bars
        const barW = mmToPx(40);
        const barH = mmToPx(25);
        const barcodeOriginX = labelOriginX + labelW - mmToPx(44);
        const barcodeOriginY = labelOriginY + labelH - mmToPx(38);

        // White background
        barcodeGroup.push(new fabric.Rect({ left: 0, top: 0, width: barW + mmToPx(10), height: barH + mmToPx(8), fill: 'white', rx: 2, ry: 2 }));
        // Generate fake barcode bars
        let x = mmToPx(5);
        const barPattern = [3,1,2,1,1,4,1,2,1,1,3,2,1,1,2,4,1,1,2,1,3,1,2,1,1];
        barPattern.forEach((w, i) => {
          if (i % 2 === 0) {
            barcodeGroup.push(new fabric.Rect({ left: x, top: mmToPx(2), width: w * 1.5, height: barH - mmToPx(4), fill: '#000000' }));
          }
          x += w * 1.5 + 1.5;
        });
        barcodeGroup.push(new fabric.Text('4 012345 678901', { left: mmToPx(5), top: barH - mmToPx(1), fontSize: 8, fontFamily: 'JetBrains Mono, monospace', fill: '#000000' }));

        const group = new fabric.Group(barcodeGroup, {
          left: barcodeOriginX, top: barcodeOriginY,
          data: { id: `barcode-${Date.now()}`, layer: 'barcode', name: 'EAN-13 Barcode' },
        });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        saveHistory(canvas);
      });
    };
    (window as any).__lf_addQRCode = (dataUrl: string, sizeMm: number) => {
      import('fabric').then(({ fabric }) => {
        fabric.Image.fromURL(dataUrl, (img: any) => {
          img.scaleToWidth(mmToPx(sizeMm));
          img.set({ left: labelOriginX + 20, top: labelOriginY + 20, data: { id: `qr-${Date.now()}`, layer: 'barcode', name: 'QR Code' } });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          saveHistory(canvas);
        });
      });
    };
    (window as any).__lf_addNutritionPanel = (data: any) => {
      import('fabric').then(({ fabric }) => {
        const lines = [
          { text: 'NUTRITION INFORMATION', bold: true, size: 10 },
          { text: 'Serving size: 250 mL', bold: false, size: 8 },
          { text: '─────────────────────', bold: false, size: 7 },
          { text: 'Energy         420 kJ / 100 kcal', bold: false, size: 7.5 },
          { text: 'Protein        0.2 g', bold: false, size: 7.5 },
          { text: 'Fat, total     0.0 g', bold: false, size: 7.5 },
          { text: '  – saturated  0.0 g', bold: false, size: 7.5 },
          { text: 'Carbohydrate   24 g', bold: false, size: 7.5 },
          { text: '  – sugars     22 g', bold: false, size: 7.5 },
          { text: 'Sodium         18 mg', bold: false, size: 7.5 },
          { text: '─────────────────────', bold: false, size: 7 },
        ];
        const fabricLines: any[] = [];
        let y = 0;
        lines.forEach((l) => {
          const t = new fabric.Text(l.text, {
            left: 0, top: y,
            fontSize: l.size, fontFamily: 'JetBrains Mono, monospace',
            fontWeight: l.bold ? 'bold' : 'normal',
            fill: '#000000',
          });
          fabricLines.push(t);
          y += l.size + 2;
        });
        const group = new fabric.Group(fabricLines, {
          left: labelOriginX + 10, top: labelOriginY + labelH * 0.5,
          data: { id: `nutrition-${Date.now()}`, layer: 'text', name: 'Nutrition Panel' },
        });
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        saveHistory(canvas);
      });
    };
  }, [fabricRef, labelOriginX, labelOriginY, labelW, labelH, saveHistory]);

  // Sync layer visibility
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj: any) => {
      if (!obj.data?.layer) return;
      const layerId = `layer-${obj.data.layer}`;
      const layer = layers.find((l) => l.id === layerId);
      if (layer) {
        obj.set({ visible: layer.visible, selectable: layer.visible && !layer.locked });
      }
    });
    canvas.renderAll();
  }, [layers, fabricRef]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-checker">
      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.05s linear' }}>
        <canvas ref={canvasElRef} />
      </div>
    </div>
  );
}
