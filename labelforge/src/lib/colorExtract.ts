// Client-side color extraction and image tiling utilities

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

function dist(a: number[], b: number[]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function kMeans(pixels: number[][], k: number, iters = 10): number[][] {
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids = Array.from({ length: k }, (_, i) => [...pixels[Math.min(i * step, pixels.length - 1)]]);

  for (let iter = 0; iter < iters; iter++) {
    const sums: number[][] = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array(k).fill(0);

    for (const p of pixels) {
      let minD = Infinity, ci = 0;
      for (let i = 0; i < k; i++) {
        const d = dist(p, centroids[i]);
        if (d < minD) { minD = d; ci = i; }
      }
      sums[ci][0] += p[0]; sums[ci][1] += p[1]; sums[ci][2] += p[2];
      counts[ci]++;
    }

    for (let i = 0; i < k; i++) {
      if (counts[i] > 0) {
        centroids[i] = [sums[i][0] / counts[i], sums[i][1] / counts[i], sums[i][2] / counts[i]];
      }
    }
  }

  return centroids;
}

export async function extractDominantColors(dataUrl: string, count = 6): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxDim = 100;
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) { resolve([]); return; }
      ctx.drawImage(img, 0, 0, w, h);

      const d = ctx.getImageData(0, 0, w, h).data;
      const pixels: number[][] = [];
      for (let i = 0; i < d.length; i += 12) {
        const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
        if (a > 128) {
          const brightness = (r + g + b) / 3;
          if (brightness > 20 && brightness < 238) pixels.push([r, g, b]);
        }
      }

      if (pixels.length < count) { resolve([]); return; }

      const centroids = kMeans(pixels, count);
      const sorted = centroids
        .map(([r, g, b]) => ({ hex: rgbToHex(r, g, b), sat: Math.max(r, g, b) - Math.min(r, g, b) }))
        .sort((a, b) => b.sat - a.sat);

      resolve(sorted.map((c) => c.hex));
    };
    img.onerror = () => resolve([]);
    img.src = dataUrl;
  });
}

async function cropRegion(dataUrl: string, x: number, y: number, w: number, h: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) { resolve(''); return; }
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve('');
    img.src = dataUrl;
  });
}

export interface ImageAsset {
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export async function extractImageAssets(dataUrl: string): Promise<ImageAsset[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const w = img.width, h = img.height;
      const results: ImageAsset[] = [];

      // Full image (capped at 500px for performance)
      const maxDim = 500;
      const fScale = Math.min(maxDim / w, maxDim / h, 1);
      const fc = document.createElement('canvas');
      fc.width = Math.round(w * fScale);
      fc.height = Math.round(h * fScale);
      const fctx = fc.getContext('2d')!;
      fctx.drawImage(img, 0, 0, fc.width, fc.height);
      results.push({ name: 'Full Reference', dataUrl: fc.toDataURL('image/png'), width: fc.width, height: fc.height });

      // Top half
      const topUrl = await cropRegion(dataUrl, 0, 0, w, Math.floor(h / 2));
      if (topUrl) results.push({ name: 'Top Section', dataUrl: topUrl, width: w, height: Math.floor(h / 2) });

      // Bottom half
      const botUrl = await cropRegion(dataUrl, 0, Math.floor(h / 2), w, Math.floor(h / 2));
      if (botUrl) results.push({ name: 'Bottom Section', dataUrl: botUrl, width: w, height: Math.floor(h / 2) });

      // Center crop (50% of dimensions, centered)
      const cx = Math.floor(w * 0.25), cy = Math.floor(h * 0.25);
      const cw = Math.floor(w * 0.5), ch = Math.floor(h * 0.5);
      const centerUrl = await cropRegion(dataUrl, cx, cy, cw, ch);
      if (centerUrl) results.push({ name: 'Center Detail', dataUrl: centerUrl, width: cw, height: ch });

      // Left half
      const leftUrl = await cropRegion(dataUrl, 0, 0, Math.floor(w / 2), h);
      if (leftUrl) results.push({ name: 'Left Side', dataUrl: leftUrl, width: Math.floor(w / 2), height: h });

      // Right half
      const rightUrl = await cropRegion(dataUrl, Math.floor(w / 2), 0, Math.floor(w / 2), h);
      if (rightUrl) results.push({ name: 'Right Side', dataUrl: rightUrl, width: Math.floor(w / 2), height: h });

      resolve(results);
    };
    img.onerror = () => resolve([]);
    img.src = dataUrl;
  });
}
