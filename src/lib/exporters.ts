import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ExtractedColor } from './types';
import { formatRgb, formatCmyk } from './color-utils';

interface ExportToken {
  key: string;
  hex: string;
  label: string;
}

async function renderExportCanvas(elementId: string): Promise<HTMLCanvasElement> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  if (canvas.width === 0 || canvas.height === 0) {
    throw new Error('Canvas rendered with zero dimensions. Ensure the target element is visible.');
  }

  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error(`Failed to create ${type} blob`));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sanitizeLabel(label: string): string {
  const sanitized = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitized || 'color';
}

function buildExportTokens(colors: ExtractedColor[]): ExportToken[] {
  const usedKeys = new Map<string, number>();

  return colors.map((color, index) => {
    const baseKey = sanitizeLabel(color.label || `color-${index + 1}`);
    const count = (usedKeys.get(baseKey) ?? 0) + 1;
    usedKeys.set(baseKey, count);

    return {
      key: count === 1 ? baseKey : `${baseKey}-${count}`,
      hex: color.hex,
      label: color.label || `color-${index + 1}`,
    };
  });
}

export function getCodeExportPreview(
  colors: ExtractedColor[],
  format: 'css' | 'scss' | 'tailwind'
): string {
  const tokens = buildExportTokens(colors);

  switch (format) {
    case 'css':
      return `:root {\n${tokens
        .map((token) => `  --color-${token.key}: ${token.hex};`)
        .join('\n')}\n}`;
    case 'scss':
      return tokens
        .map((token) => `$color-${token.key}: ${token.hex};`)
        .join('\n');
    case 'tailwind':
      return `const colors = {\n${tokens
        .map((token) => `  '${token.key}': '${token.hex}',`)
        .join('\n')}\n};\n\nexport default colors;`;
  }
}

/**
 * Export palette as PNG
 */
export async function exportAsPng(elementId: string, filename: string = 'chromasnap-palette.png'): Promise<void> {
  const canvas = await renderExportCanvas(elementId);
  const blob = await canvasToBlob(canvas, 'image/png');
  downloadBlob(blob, filename);
}

/**
 * Export palette as JPG
 */
export async function exportAsJpg(elementId: string, filename: string = 'chromasnap-palette.jpg'): Promise<void> {
  const canvas = await renderExportCanvas(elementId);
  const blob = await canvasToBlob(canvas, 'image/jpeg', 0.95);
  downloadBlob(blob, filename);
}

/**
 * Export palette as PDF
 */
export async function exportAsPdf(elementId: string, filename: string = 'chromasnap-palette.pdf'): Promise<void> {
  const canvas = await renderExportCanvas(elementId);
  const imgData = canvas.toDataURL('image/jpeg', 1.0);

  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageRatio = canvas.width / canvas.height;
  const pageRatio = pageWidth / pageHeight;

  let imageWidth: number;
  let imageHeight: number;

  if (imageRatio > pageRatio) {
    imageWidth = pageWidth;
    imageHeight = pageWidth / imageRatio;
  } else {
    imageHeight = pageHeight;
    imageWidth = pageHeight * imageRatio;
  }

  const x = (pageWidth - imageWidth) / 2;
  const y = (pageHeight - imageHeight) / 2;

  pdf.addImage(imgData, 'JPEG', x, y, imageWidth, imageHeight);
  pdf.save(filename);
}

/**
 * Export palette as standalone HTML
 */
export function exportAsHtml(colors: ExtractedColor[], filename: string = 'chromasnap-palette.html'): void {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChromaSnap Palette</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f9fafb;
      padding: 2rem;
      line-height: 1.5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 2rem;
      color: #111827;
    }
    .palette {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    .swatch {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .color-block {
      width: 100%;
      height: 120px;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .color-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
    }
    .color-label {
      display: inline-flex;
      align-self: flex-start;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: lowercase;
    }
    .color-value {
      display: flex;
      justify-content: space-between;
      color: #6b7280;
    }
    .color-value strong {
      color: #374151;
      font-weight: 600;
    }
    .footer {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>ChromaSnap Color Palette</h1>
    <div class="palette">
      ${colors.map(color => `
        <div class="swatch">
          <div class="color-block" style="background-color: ${color.hex};"></div>
          <div class="color-info">
            <span class="color-label">${color.label}</span>
            <div class="color-value">
              <strong>HEX</strong>
              <span>${color.hex}</span>
            </div>
            <div class="color-value">
              <strong>RGB</strong>
              <span>${formatRgb(color.rgb)}</span>
            </div>
            <div class="color-value">
              <strong>CMYK</strong>
              <span>${formatCmyk(color.cmyk)}</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="footer">
      Generated by ChromaSnap
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  downloadBlob(blob, filename);
}

export function exportAsCss(colors: ExtractedColor[], filename: string = 'chromasnap-palette.css'): void {
  const content = `${getCodeExportPreview(colors, 'css')}\n`;
  const blob = new Blob([content], { type: 'text/css' });
  downloadBlob(blob, filename);
}

export function exportAsScss(colors: ExtractedColor[], filename: string = 'chromasnap-palette.scss'): void {
  const content = `${getCodeExportPreview(colors, 'scss')}\n`;
  const blob = new Blob([content], { type: 'text/x-scss' });
  downloadBlob(blob, filename);
}

export function exportAsTailwind(colors: ExtractedColor[], filename: string = 'chromasnap-tailwind-colors.js'): void {
  const content = `${getCodeExportPreview(colors, 'tailwind')}\n`;
  const blob = new Blob([content], { type: 'text/javascript' });
  downloadBlob(blob, filename);
}
