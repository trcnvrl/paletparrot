import type { ExtractedColor } from './types';

/**
 * Convert RGB to HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Normalize a color array [r, g, b] to ExtractedColor
 */
export function normalizeColor(rgb: [number, number, number], population?: number): ExtractedColor {
  const [r, g, b] = rgb;
  const hex = rgbToHex(r, g, b);
  const cmyk = rgbToCmyk(r, g, b);

  return {
    label: '',
    hex,
    rgb: { r, g, b },
    cmyk,
    population,
  };
}

/**
 * Format CMYK for display
 */
export function formatCmyk(cmyk: { c: number; m: number; y: number; k: number }): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

/**
 * Format RGB for display
 */
export function formatRgb(rgb: { r: number; g: number; b: number }): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Check if two colors are similar within a tolerance
 */
export function areColorsSimilar(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number },
  tolerance: number = 10
): boolean {
  return (
    Math.abs(rgb1.r - rgb2.r) <= tolerance &&
    Math.abs(rgb1.g - rgb2.g) <= tolerance &&
    Math.abs(rgb1.b - rgb2.b) <= tolerance
  );
}
