import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PreflightStatus, InstructionPriority } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MM_TO_PX = 3.7795275591;

export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX);
}

export function pxToMm(px: number): number {
  return Math.round((px / MM_TO_PX) * 10) / 10;
}

export function formatMm(value: number): string {
  return `${value} mm`;
}

export function priorityLabel(p: InstructionPriority): string {
  return { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' }[p];
}

export function priorityColor(p: InstructionPriority): string {
  return {
    critical: 'text-forge-error bg-forge-error-muted border-forge-error/30',
    high: 'text-forge-warning bg-forge-warning-muted border-forge-warning/30',
    medium: 'text-forge-info bg-forge-accent-muted/40 border-forge-info/30',
    low: 'text-forge-muted bg-forge-panel border-forge-border',
  }[p];
}

export function statusColor(s: PreflightStatus): string {
  return {
    pass: 'text-forge-success',
    warning: 'text-forge-warning',
    fail: 'text-forge-error',
    info: 'text-forge-info',
  }[s];
}

export function statusBg(s: PreflightStatus): string {
  return {
    pass: 'bg-forge-success-muted border-forge-success/20',
    warning: 'bg-forge-warning-muted border-forge-warning/20',
    fail: 'bg-forge-error-muted border-forge-error/20',
    info: 'bg-forge-accent-muted/40 border-forge-accent/20',
  }[s];
}

export function fileTypeAccept(types: string[]): Record<string, string[]> {
  const map: Record<string, string[]> = {
    PDF: ['application/pdf'],
    SVG: ['image/svg+xml'],
    PNG: ['image/png'],
    JPG: ['image/jpeg'],
    JPEG: ['image/jpeg'],
    AI: ['application/postscript', 'application/illustrator'],
    EPS: ['application/postscript'],
    DXF: ['image/vnd.dxf', 'application/dxf'],
  };
  const result: Record<string, string[]> = {};
  types.forEach((t) => {
    const mimes = map[t];
    if (mimes) mimes.forEach((m) => { result[m] = [`.${t.toLowerCase()}`]; });
  });
  return result;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export const CANVAS_SCALE = 3.78;

export function getLabelPixelSize(widthMm: number, heightMm: number) {
  return {
    width: Math.round(widthMm * CANVAS_SCALE),
    height: Math.round(heightMm * CANVAS_SCALE),
  };
}
