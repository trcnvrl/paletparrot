'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedColor } from '@/lib/types';
import { formatRgb, formatCmyk } from '@/lib/color-utils';

interface ColorSwatchCardProps {
  color: ExtractedColor;
}

export function ColorSwatchCard({ color }: ColorSwatchCardProps) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const CopyButton = ({ value }: { value: string }) => (
    <button
      onClick={() => handleCopy(value)}
      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
      aria-label={`Copy ${value}`}
    >
      {copiedValue === value ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-gray-400 dark:text-gray-600" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col gap-3 group">
      <div
        className="w-full aspect-square rounded-lg shadow-md transition-transform group-hover:scale-105"
        style={{ backgroundColor: color.hex }}
      />
      
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">HEX</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100">{color.hex}</span>
            <CopyButton value={color.hex} />
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">RGB</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100 text-xs">
              {formatRgb(color.rgb)}
            </span>
            <CopyButton value={formatRgb(color.rgb)} />
          </div>
        </div>
        
        <div className="flex items-center justify-between px-2 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="font-medium text-gray-600 dark:text-gray-400">CMYK</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-gray-900 dark:text-gray-100 text-xs">
              {formatCmyk(color.cmyk)}
            </span>
            <CopyButton value={formatCmyk(color.cmyk)} />
          </div>
        </div>
      </div>
    </div>
  );
}
