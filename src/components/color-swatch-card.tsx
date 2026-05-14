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
    <div className="flex flex-col gap-3 group">
      <div className="relative">
        <div
          className="w-full aspect-square rounded-lg shadow-md transition-transform group-hover:scale-105"
          style={{ backgroundColor: color.hex }}
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
            aria-label={`Remove ${color.hex}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Label
        </label>
        <input
          type="text"
          list={suggestionsId}
          value={color.label}
          onChange={(event) => onLabelChange?.(event.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none transition-colors focus:border-blue-500 dark:focus:border-blue-400"
          placeholder="primary"
          aria-label={`Label for ${color.hex}`}
        />
        <datalist id={suggestionsId}>
          {COMMON_LABELS.map((label) => (
            <option key={label} value={label} />
          ))}
        </datalist>
      </div>

      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">HEX</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100">{color.hex}</span>
            <button
              onClick={() => handleCopy(color.hex)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label={`Copy ${color.hex}`}
            >
              {copiedValue === color.hex ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 dark:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">RGB</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100 text-xs">
              {rgbValue}
            </span>
            <button
              onClick={() => handleCopy(rgbValue)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label={`Copy ${rgbValue}`}
            >
              {copiedValue === rgbValue ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 dark:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">CMYK</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100 text-xs">
              {cmykValue}
            </span>
            <button
              onClick={() => handleCopy(cmykValue)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              aria-label={`Copy ${cmykValue}`}
            >
              {copiedValue === cmykValue ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400 dark:text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
