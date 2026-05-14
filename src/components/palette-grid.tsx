'use client';

import type { ExtractedColor } from '@/lib/types';
import { ColorSwatchCard } from './color-swatch-card';
import { formatRgb, formatCmyk } from '@/lib/color-utils';

interface PaletteGridProps {
  colors: ExtractedColor[];
  onLabelChange?: (index: number, label: string) => void;
  onRemoveColor?: (index: number) => void;
}

export function PaletteGrid({ colors, onLabelChange, onRemoveColor }: PaletteGridProps) {
  if (colors.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Palette
          </p>
          <h2 className="font-display text-3xl font-bold text-slate-950">
            Extracted colors
          </h2>
        </div>
        <span className="pill rounded-full px-4 py-2 text-sm text-slate-700">
          {colors.length} {colors.length === 1 ? 'color' : 'colors'}
        </span>
      </div>

      <div
        id="palette-export-area"
        className="panel w-full rounded-[2rem] p-5 sm:p-8"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {colors.map((color, index) => (
            <ColorSwatchCard
              key={`${color.hex}-${index}`}
              color={color}
              suggestionsId={`color-label-suggestions-${index}`}
              onLabelChange={onLabelChange ? (label) => onLabelChange(index, label) : undefined}
              onRemove={onRemoveColor ? () => onRemoveColor(index) : undefined}
            />
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
            PaletParrot palette
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
                  <div style={{ marginBottom: '8px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'lowercase'
                      }}
                    >
                      {color.label}
                    </span>
                  </div>
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
    </section>
  );
}
