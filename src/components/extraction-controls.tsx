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
    <div className="w-full space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Extraction Mode
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => onModeChange('auto')}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-all
              ${mode === 'auto'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            disabled={isExtracting}
          >
            Auto-detect
          </button>
          <button
            onClick={() => onModeChange('manual')}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-all
              ${mode === 'manual'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            disabled={isExtracting}
          >
            Manual
          </button>
          <button
            onClick={() => onModeChange('eyedropper')}
            className={`
              flex-1 px-4 py-3 rounded-lg font-medium transition-all
              ${mode === 'eyedropper'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
            disabled={isExtracting}
          >
            Eyedropper
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {mode === 'auto' 
            ? 'Automatically detect all unique colors in simple swatches'
            : mode === 'manual'
              ? 'Select the number of colors to extract from complex images'
              : 'Click directly on the image to pick exact pixel colors one by one'
          }
        </p>
      </div>

      {mode === 'manual' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="color-count" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Colors
            </label>
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              min="2"
              max="20"
              className="w-16 px-2 py-1 text-center border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            disabled={isExtracting}
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>2</span>
            <span>20</span>
          </div>
        </div>
      )}

      {mode === 'eyedropper' ? (
        <div className="px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Pick colors from the image preview
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400">
              {pickedColorCount} {pickedColorCount === 1 ? 'color picked' : 'colors picked'}
            </span>
          </div>
          {!hasImage && (
            <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              Upload an image to start picking colors.
            </p>
          )}
        </div>
      ) : (
        <button
          onClick={onExtract}
          disabled={!hasImage || isExtracting}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-700 dark:disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {isExtracting ? 'Extracting Colors...' : 'Extract Palette'}
        </button>
      )}
    </div>
  );
}
