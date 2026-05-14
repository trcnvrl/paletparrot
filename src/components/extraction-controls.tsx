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
        <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          Extraction Mode
        </label>
        <div className="glass-subpanel grid gap-2 rounded-[1.4rem] p-2 sm:grid-cols-3">
          <button
            onClick={() => onModeChange('auto')}
            className={`
              rounded-[1rem] px-4 py-3.5 text-sm font-semibold transition-all duration-300
              ${mode === 'auto'
                ? 'button-sheen bg-[linear-gradient(135deg,#22d3ee_0%,#6366f1_52%,#a855f7_100%)] text-white shadow-[0_14px_38px_rgba(99,102,241,0.32)]'
                : 'text-slate-700 hover:bg-white/12 dark:text-slate-300 dark:hover:bg-white/8'
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
                ? 'button-sheen bg-[linear-gradient(135deg,#22d3ee_0%,#6366f1_52%,#a855f7_100%)] text-white shadow-[0_14px_38px_rgba(99,102,241,0.32)]'
                : 'text-slate-700 hover:bg-white/12 dark:text-slate-300 dark:hover:bg-white/8'
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
                ? 'button-sheen bg-[linear-gradient(135deg,#22d3ee_0%,#6366f1_52%,#a855f7_100%)] text-white shadow-[0_14px_38px_rgba(99,102,241,0.32)]'
                : 'text-slate-700 hover:bg-white/12 dark:text-slate-300 dark:hover:bg-white/8'
              }
            `}
            disabled={isExtracting}
          >
            Eyedropper
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {mode === 'auto' 
            ? 'Automatically detect all unique colors in simple swatches'
            : mode === 'manual'
              ? 'Select the number of colors to extract from complex images'
              : 'Click directly on the image to pick exact pixel colors one by one'
          }
        </p>
      </div>

      {mode === 'manual' && (
        <div className="glass-subpanel rounded-[1.5rem] p-5">
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="color-count" className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Number of Colors
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min="2"
              max="20"
              className="glass-input w-20 rounded-xl px-3 py-2 text-center text-sm font-semibold text-slate-950 outline-none transition focus:border-cyan-300/60 dark:text-slate-50"
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
            className="glass-range w-full cursor-pointer"
            disabled={isExtracting}
          />
          <div className="mt-2 flex justify-between text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            <span>2</span>
            <span>20</span>
          </div>
        </div>
      )}

      {mode === 'eyedropper' ? (
        <div className="glass-subpanel rounded-[1.5rem] border border-cyan-300/20 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-800 dark:text-cyan-100">
              Pick colors from the image preview
            </span>
            <span className="text-sm text-slate-600 dark:text-cyan-200/80">
              {pickedColorCount} {pickedColorCount === 1 ? 'color picked' : 'colors picked'}
            </span>
          </div>
          {!hasImage && (
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-100/70">
              Upload an image to start picking colors.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={onExtract}
          disabled={!hasImage || isExtracting}
          className="button-sheen w-full rounded-[1.4rem] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45"
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #ec4899 100%)',
            boxShadow: '0 24px 60px rgba(99, 102, 241, 0.3)',
          }}
        >
          {isExtracting ? 'Extracting Colors...' : 'Extract Palette'}
        </button>
      )}
    </div>
  );
}
