'use client';

import { useCallback, useState } from 'react';
import { Palette } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageUploader } from '@/components/image-uploader';
import { ImagePreview } from '@/components/image-preview';
import { ExtractionControls } from '@/components/extraction-controls';
import { PaletteGrid } from '@/components/palette-grid';
import { ExportActions } from '@/components/export-actions';
import type { UploadedImage, ExtractedColor, ExtractionMode } from '@/lib/types';
import { extractColorsAuto, extractColorsManual } from '@/lib/color-extraction';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [extractionMode, setExtractionMode] = useState<ExtractionMode>('manual');
  const [colorCount, setColorCount] = useState<number>(5);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (image: UploadedImage) => {
    setUploadedImage(image);
    setExtractedColors([]);
    setError(null);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setExtractedColors([]);
    setError(null);
  };

  const handleModeChange = useCallback((mode: ExtractionMode) => {
    setExtractionMode(mode);
    setExtractedColors([]);
    setError(null);
  }, []);

  const handlePickColor = useCallback((color: ExtractedColor) => {
    setExtractedColors((currentColors) => [...currentColors, color]);
    setError(null);
  }, []);

  const handleRemoveColor = useCallback((indexToRemove: number) => {
    setExtractedColors((currentColors) =>
      currentColors.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleExtractColors = async () => {
    if (!uploadedImage || extractionMode === 'eyedropper') return;

    setIsExtracting(true);
    setError(null);

    try {
      let colors: ExtractedColor[];
      
      if (extractionMode === 'auto') {
        colors = await extractColorsAuto(uploadedImage.src);
      } else {
        colors = await extractColorsManual(uploadedImage.src, colorCount);
      }

      setExtractedColors(colors);
    } catch (err) {
      console.error('Color extraction failed:', err);
      setError('Failed to extract colors. Please try a different image.');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ChromaSnap
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Extract Color Palettes from Images
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload any image and instantly generate a beautiful color palette with HEX, RGB, and CMYK values
          </p>
        </div>

        {/* Upload Section */}
        {!uploadedImage ? (
          <div className="max-w-2xl mx-auto">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Image Preview */}
            <div className="space-y-6">
              <ImagePreview
                key={`${uploadedImage.src}-${extractionMode}`}
                image={uploadedImage}
                mode={extractionMode}
                onRemove={handleRemoveImage}
                onPickColor={handlePickColor}
              />
              
              {extractedColors.length > 0 && (
                <ExportActions colors={extractedColors} />
              )}
            </div>

            {/* Right Column: Extraction Controls */}
            <div>
              <ExtractionControls
                mode={extractionMode}
                colorCount={colorCount}
                pickedColorCount={extractedColors.length}
                onModeChange={handleModeChange}
                onColorCountChange={setColorCount}
                onExtract={handleExtractColors}
                isExtracting={isExtracting}
                hasImage={!!uploadedImage}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Palette Display */}
        {extractedColors.length > 0 && (
          <div className="pt-8">
            <PaletteGrid colors={extractedColors} onRemoveColor={handleRemoveColor} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
