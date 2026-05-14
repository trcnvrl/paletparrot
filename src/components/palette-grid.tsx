'use client';

import type { ExtractedColor } from '@/lib/types';
import { ColorSwatchCard } from './color-swatch-card';
import { formatRgb, formatCmyk } from '@/lib/color-utils';

interface PaletteGridProps {
  colors: ExtractedColor[];
}

export function PaletteGrid({ colors }: PaletteGridProps) {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Extracted Palette
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {colors.length} {colors.length === 1 ? 'color' : 'colors'}
        </span>
      </div>

      <div
        id="palette-export-area"
        className="w-full p-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {colors.map((color, index) => (
            <ColorSwatchCard key={`${color.hex}-${index}`} color={color} />
          ))}
        </div>
      </div>

      {/* Off-screen printable version for exports (must not be display:none for html2canvas) */}
      <div id="palette-printable" className="fixed -left-[9999px] top-0 overflow-hidden" style={{ width: '1200px' }} aria-hidden="true">
        <div style={{ 
          padding: '40px', 
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '32px', color: '#111827' }}>
            ChromaSnap Color Palette
          </h1>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '24px' 
          }}>
            {colors.map((color, index) => (
              <div key={`${color.hex}-print-${index}`}>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: color.hex,
                    borderRadius: '8px',
                    marginBottom: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>HEX:</strong> {color.hex}
                  </div>
                  <div style={{ marginBottom: '4px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>RGB:</strong> {formatRgb(color.rgb)}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>CMYK:</strong> {formatCmyk(color.cmyk)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
