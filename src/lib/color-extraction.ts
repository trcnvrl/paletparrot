import { getPaletteSync } from 'colorthief';
import type { ExtractedColor } from './types';
import { normalizeColor, areColorsSimilar } from './color-utils';

/**
 * Extract colors for manual mode.
 * First checks if the image is a simple palette (few distinct colors).
 * If so, uses direct pixel reading for exact colors.
 * Otherwise falls back to ColorThief quantization.
 */
export async function extractColorsManual(
  imageSrc: string,
  colorCount: number
): Promise<ExtractedColor[]> {
  // Quick check: is this a simple palette image?
  const isSimple = await isSimplePalette(imageSrc);
  
  if (isSimple) {
    const autoColors = await extractColorsAuto(imageSrc, 20, 2);
    if (autoColors.length > 0) {
      return autoColors.slice(0, colorCount);
    }
  }

  // Complex image: use ColorThief
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
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageSrc;
  });
}

/**
 * Quick heuristic to determine if an image is a simple color palette.
 * Checks the number of unique exact pixel colors in a small sample.
 * Simple palettes typically have < 100 unique colors even at full resolution.
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

        // Use small size for quick check
        const maxDim = 150;
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
          // If we've found many unique colors, it's definitely not a simple palette
          if (uniqueColors.size > 100) {
            resolve(false);
            return;
          }
        }

        // Simple palette: few unique colors
        resolve(uniqueColors.size <= 50);
      } catch {
        resolve(false);
      }
    };
    
    img.onerror = () => resolve(false);
    img.src = imageSrc;
  });
}

/**
 * Extract all unique colors for auto mode (flat swatch detection)
 * For simple palette images, scans ALL pixels to get exact colors.
 */
export async function extractColorsAuto(
  imageSrc: string,
  threshold: number = 20,
  tolerance: number = 2
): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Use original size for small images; only downscale very large ones
        const maxPixels = 250000; // 500x500 equivalent
        let w = img.width;
        let h = img.height;
        if (w * h > maxPixels) {
          const scale = Math.sqrt(maxPixels / (w * h));
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        canvas.width = w;
        canvas.height = h;
        // Disable smoothing to preserve exact pixel colors
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const pixels = imageData.data;
        const totalPixels = w * h;
        
        // First pass: count exact colors to determine if this is a simple palette
        const exactColorCounts = new Map<string, { r: number; g: number; b: number; count: number }>();
        
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          if (a < 128) continue;
          
          const key = `${r},${g},${b}`;
          const existing = exactColorCounts.get(key);
          if (existing) {
            existing.count++;
          } else {
            exactColorCounts.set(key, { r, g, b, count: 1 });
          }
        }
        
        // Group similar colors together using the tolerance
        // The group leader (most frequent exact color) represents the group
        const groups: { rgb: { r: number; g: number; b: number }; count: number; leaderCount: number }[] = [];
        
        // Sort by count descending so the most frequent exact pixel becomes group leader
        const sortedColors = Array.from(exactColorCounts.values()).sort((a, b) => b.count - a.count);
        
        for (const color of sortedColors) {
          let matched = false;
          for (const group of groups) {
            if (areColorsSimilar({ r: color.r, g: color.g, b: color.b }, group.rgb, tolerance)) {
              group.count += color.count;
              matched = true;
              break;
            }
          }
          if (!matched) {
            // The first (most frequent) exact color in the group becomes the leader
            groups.push({ rgb: { r: color.r, g: color.g, b: color.b }, count: color.count, leaderCount: color.count });
          }
        }
        
        // Filter out noise: only keep colors that represent at least 1% of the image
        const minPixelRatio = 0.01;
        const significantGroups = groups.filter(g => g.count / totalPixels >= minPixelRatio);
        
        // If under threshold, this is a simple palette — return exact colors
        if (significantGroups.length <= threshold) {
          const colors = significantGroups
            .sort((a, b) => b.count - a.count)
            .map((color) => normalizeColor([color.rgb.r, color.rgb.g, color.rgb.b], color.count));
          resolve(colors);
        } else {
          // Too many colors - fall back to ColorThief
          const palette = getPaletteSync(img, { colorCount: Math.min(threshold, 10), quality: 10 });
          
          if (palette) {
            const colors = palette.map((color) => {
              const rgb = color.rgb();
              return normalizeColor([rgb.r, rgb.g, rgb.b]);
            });
            resolve(colors);
          } else {
            reject(new Error('Failed to extract colors'));
          }
        }
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageSrc;
  });
}
