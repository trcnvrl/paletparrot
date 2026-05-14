'use client';

import { Copy, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedColor } from '@/lib/types';
import { formatRgb, formatCmyk } from '@/lib/color-utils';

interface ColorSwatchCardProps {
  color: ExtractedColor;
  suggestionsId: string;
  onLabelChange?: (label: string) => void;
  onRemove?: () => void;
}

const COMMON_LABELS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
  'text',
  'border',
  'success',
  'warning',
  'error',
];

export function ColorSwatchCard({ color, suggestionsId, onLabelChange, onRemove }: ColorSwatchCardProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const rgbValue = formatRgb(color.rgb);
  const cmykValue = formatCmyk(color.cmyk);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="panel group relative flex flex-col gap-4 overflow-hidden rounded-[1.75rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.14)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{
          background: `radial-gradient(circle at top, ${color.hex}55 0%, transparent 42%)`,
        }}
      />
      <div className="relative">
        <div
          className="w-full aspect-square rounded-[1.35rem] shadow-md transition-transform duration-300 group-hover:scale-[1.02]"
          style={{ backgroundColor: color.hex }}
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="pill absolute right-3 top-3 translate-y-1 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 opacity-0 transition-all duration-300 hover:bg-slate-100 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label={`Remove ${color.hex}`}
          >
            <span className="flex items-center gap-1.5">
              <X className="h-3.5 w-3.5" />
              Remove
            </span>
          </button>
        )}
      </div>

      <div className="subpanel space-y-2 rounded-[1.35rem] p-4">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
          Label
        </label>
        <input
          type="text"
          list={suggestionsId}
          value={color.label}
          onChange={(event) => onLabelChange?.(event.target.value)}
          className="field w-full rounded-xl px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-[color:var(--brand-blue)]"
          placeholder="primary"
          aria-label={`Label for ${color.hex}`}
        />
        <datalist id={suggestionsId}>
          {COMMON_LABELS.map((label) => (
            <option key={label} value={label} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2 text-sm">
        <div className="subpanel flex items-center justify-between rounded-2xl px-3 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">HEX</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-950">{color.hex}</span>
            <button
              onClick={() => handleCopy(color.hex)}
              className="relative rounded-full p-1.5 transition-colors hover:bg-slate-200"
              aria-label={`Copy ${color.hex}`}
            >
              {copiedValue === color.hex ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
        
        <div className="subpanel flex items-center justify-between rounded-2xl px-3 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">RGB</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-950">
              {rgbValue}
            </span>
            <button
              onClick={() => handleCopy(rgbValue)}
              className="rounded-full p-1.5 transition-colors hover:bg-slate-200"
              aria-label={`Copy ${rgbValue}`}
            >
              {copiedValue === rgbValue ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
        
        <div className="subpanel flex items-center justify-between rounded-2xl px-3 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">CMYK</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-950">
              {cmykValue}
            </span>
            <button
              onClick={() => handleCopy(cmykValue)}
              className="rounded-full p-1.5 transition-colors hover:bg-slate-200"
              aria-label={`Copy ${cmykValue}`}
            >
              {copiedValue === cmykValue ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {copiedValue && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 animate-flash rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          Copied: {copiedValue}
        </div>
      )}
    </div>
  );
}
