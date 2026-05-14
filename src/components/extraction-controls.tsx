'use client';

import { useState } from 'react';
import type { ExtractionMode } from '@/lib/types';

interface ExtractionControlsProps {
  mode: ExtractionMode;
  colorCount: number;
  pickedColorCount: number;
  onModeChange: (mode: ExtractionMode) => void;
  onColorCountChange: (count: number) => void;
  onExtract: () => void;
  isExtracting: boolean;
  hasImage: boolean;
}

export function ExtractionControls({
  mode,
  colorCount,
  pickedColorCount,
  onModeChange,
  onColorCountChange,
  onExtract,
  isExtracting,
  hasImage,
}: ExtractionControlsProps) {
  const [inputValue, setInputValue] = useState(colorCount.toString());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 2 && num <= 20) {
      onColorCountChange(num);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value, 10);
    onColorCountChange(num);
    setInputValue(num.toString());
  };

  return (
    <div className="w-full space-y-7">
      <div>
        <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
          Extraction mode
        </label>
        <div className="subpanel grid gap-2 rounded-[1.4rem] p-2 sm:grid-cols-3">
          <button
            onClick={() => onModeChange('auto')}
            className={`
              rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition-all duration-300
              ${mode === 'auto'
                ? 'bg-[linear-gradient(135deg,#E8000A_0%,#1A0066_56%,#0015E8_100%)] text-white shadow-[0_14px_32px_rgba(26,0,102,0.24)]'
                : 'text-slate-700 hover:bg-white'
              }
            `}
            disabled={isExtracting}
          >
            Auto-detect
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`
              rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition-all duration-300
              ${mode === 'manual'
                ? 'bg-[linear-gradient(135deg,#E8000A_0%,#1A0066_56%,#0015E8_100%)] text-white shadow-[0_14px_32px_rgba(26,0,102,0.24)]'
                : 'text-slate-700 hover:bg-white'
              }
            `}
            disabled={isExtracting}
          >
            Manual
          </button>
          <button
            onClick={() => onModeChange('eyedropper')}
            className={`
              rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition-all duration-300
              ${mode === 'eyedropper'
                ? 'bg-[linear-gradient(135deg,#E8000A_0%,#1A0066_56%,#0015E8_100%)] text-white shadow-[0_14px_32px_rgba(26,0,102,0.24)]'
                : 'text-slate-700 hover:bg-white'
              }
            `}
            disabled={isExtracting}
          >
            Eyedropper
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {mode === 'auto' 
            ? 'Find exact colors in simple images with flat areas.'
            : mode === 'manual'
              ? 'Choose how many dominant colors to pull from the image.'
              : 'Click the image to pick exact pixel colors one by one.'
          }
        </p>
      </div>

      {mode === 'manual' && (
        <div className="subpanel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="color-count" className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Number of colors
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min="2"
              max="20"
              className="field w-20 rounded-xl px-3 py-2 text-center text-sm font-semibold text-slate-950 outline-none transition focus:border-[color:var(--brand-blue)]"
              disabled={isExtracting}
            />
          </div>
          <input
            id="color-count"
            type="range"
            min="2"
            max="20"
            value={colorCount}
            onChange={handleSliderChange}
            className="range-input w-full cursor-pointer"
            disabled={isExtracting}
          />
          <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
            <span>2</span>
            <span>20</span>
          </div>
        </div>
      )}

      {mode === 'eyedropper' ? (
        <div className="subpanel rounded-[1.5rem] border border-slate-200 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-800">
              Pick colors from the image preview
            </span>
            <span className="text-sm text-slate-600">
              {pickedColorCount} {pickedColorCount === 1 ? 'color picked' : 'colors picked'}
            </span>
          </div>
          {!hasImage && (
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              Upload an image to start picking colors.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={onExtract}
          disabled={!hasImage || isExtracting}
          className="w-full rounded-[1.4rem] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            background: 'linear-gradient(135deg, #E8000A 0%, #1A0066 52%, #0015E8 100%)',
            boxShadow: '0 20px 42px rgba(26, 0, 102, 0.22)',
          }}
        >
          {isExtracting ? 'Extracting colors...' : 'Extract colors'}
        </button>
      )}
    </div>
  );
}
