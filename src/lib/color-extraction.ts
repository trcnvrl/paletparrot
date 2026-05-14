import { getPaletteSync } from 'colorthief';
import type { ExtractedColor } from './types';
import { normalizeColor, areColorsSimilar } from './color-utils';

/**
 * Quick heuristic to determine if an image is a simple color palette.
 * Returns true only if the image has very few distinct colors.
 */
function isSimplePalette(imageSrc: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(false); return; }

        // Use original size for small images, cap at 200px for larger
        const maxDim = 200;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const pixels = imageData.data;
        const uniqueColors = new Set<string>();

        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i + 3] < 128) continue;
          uniqueColors.add(`${pixels[i]},${pixels[i+1]},${pixels[i+2]}`);
          if (uniqueColors.size > 200) {
            resolve(false);
            return;
          }
        }

        resolve(uniqueColors.size <= 80);
      } catch {
        resolve(false);
      }
    };
    
    img.onerror = () => resolve(false);
    img.src = imageSrc;
  });
}

/**
 * Extract exact colors from a simple palette image using direct pixel analysis.
 */
function extractExactColors(imageSrc: string): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No canvas context')); return; }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
        const totalPixels = img.width * img.height;

        // Count exact pixel colors
        const colorCounts = new Map<string, { r: number; g: number; b: number; count: number }>();

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          if (a < 128) continue;

          const key = `${r},${g},${b}`;
          const existing = colorCounts.get(key);
          if (existing) {
            existing.count++;
          } else {
            colorCounts.set(key, { r, g, b, count: 1 });
          }
        }

        // Group very similar colors (tolerance 2) to handle minor anti-aliasing
        const groups: { rgb: { r: number; g: number; b: number }; count: number }[] = [];
        const sorted = Array.from(colorCounts.values()).sort((a, b) => b.count - a.count);

        for (const color of sorted) {
          let matched = false;
          for (const group of groups) {
            if (areColorsSimilar(color, group.rgb, 2)) {
              group.count += color.count;
              matched = true;
              break;
            }
          }
          if (!matched) {
            groups.push({ rgb: { r: color.r, g: color.g, b: color.b }, count: color.count });
          }
        }

        // Filter noise (< 2% of image)
        const significant = groups
          .filter(g => g.count / totalPixels >= 0.02)
          .sort((a, b) => b.count - a.count);

        if (significant.length === 0) {
          reject(new Error('No significant colors found'));
          return;
        }

        const colors = significant.map(g => normalizeColor([g.rgb.r, g.rgb.g, g.rgb.b], g.count));
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}

/**
 * Extract colors using ColorThief for complex images (photos, etc.)
 */
function extractWithColorThief(imageSrc: string, colorCount: number): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const palette = getPaletteSync(img, { colorCount, quality: 10 });

        if (!palette || palette.length === 0) {
          reject(new Error('Failed to extract colors'));
          return;
        }

        const colors = palette.map((color) => {
          const rgb = color.rgb();
          return normalizeColor([rgb.r, rgb.g, rgb.b]);
        });

        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}

/**
 * Manual mode: extract N colors.
 * Uses exact pixel reading for simple palettes, ColorThief for complex images.
 */
export async function extractColorsManual(
  imageSrc: string,
  colorCount: number
): Promise<ExtractedColor[]> {
  const simple = await isSimplePalette(imageSrc);

  if (simple) {
    try {
      const exactColors = await extractExactColors(imageSrc);
      return exactColors.slice(0, colorCount);
    } catch {
      // Fall through to ColorThief
    }
  }

  return extractWithColorThief(imageSrc, colorCount);
}

/**
 * Auto-detect mode: for simple palettes returns all exact colors,
 * for complex images uses ColorThief with default count.
 */
export async function extractColorsAuto(
  imageSrc: string,
  threshold: number = 20,
  tolerance: number = 2
): Promise<ExtractedColor[]> {
  const simple = await isSimplePalette(imageSrc);

  if (simple) {
    try {
      const exactColors = await extractExactColors(imageSrc);
      return exactColors;
    } catch {
      // Fall through to ColorThief
    }
  }

  // Complex image: use ColorThief
  return extractWithColorThief(imageSrc, Math.min(threshold, 10));
}
