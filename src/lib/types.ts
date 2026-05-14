export interface UploadedImage {
  file: File;
  src: string;
  width?: number;
  height?: number;
  mimeType: string;
}

export interface ExtractedColor {
  label: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  cmyk: { c: number; m: number; y: number; k: number };
  population?: number;
}

export type ExtractionMode = 'auto' | 'manual' | 'eyedropper';

export type ExportFormat = 'pdf' | 'html' | 'jpg' | 'png' | 'css' | 'scss' | 'tailwind';
