'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Sparkles, WandSparkles } from 'lucide-react';
import { BackgroundGlow } from '@/components/background-glow';
import { ThemeToggle } from '@/components/theme-toggle';
import { ImageUploader } from '@/components/image-uploader';
import { ImagePreview } from '@/components/image-preview';
import { ExtractionControls } from '@/components/extraction-controls';
import { PaletteGrid } from '@/components/palette-grid';
import { ExportActions } from '@/components/export-actions';
import type { UploadedImage, ExtractedColor, ExtractionMode } from '@/lib/types';
import { extractColorsAuto, extractColorsManual } from '@/lib/color-extraction';

function withDefaultLabels(colors: ExtractedColor[]): ExtractedColor[] {
  return colors.map((color, index) => ({
    ...color,
    label: color.label?.trim() || `color-${index + 1}`,
  }));
}

function getNextDefaultLabel(colors: ExtractedColor[]): string {
  const highestUsedIndex = colors.reduce((highest, color) => {
    const match = color.label.match(/^color-(\d+)$/);
    if (!match) {
      return highest;
    }

    return Math.max(highest, Number.parseInt(match[1], 10));
  }, 0);

  return `color-${highestUsedIndex + 1}`;
}

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return `rgba(103, 232, 249, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

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
    setExtractedColors((currentColors) => [
      ...currentColors,
      {
        ...color,
        label: getNextDefaultLabel(currentColors),
      },
    ]);
    setError(null);
  }, []);

  const handleLabelChange = useCallback((indexToUpdate: number, label: string) => {
    setExtractedColors((currentColors) =>
      currentColors.map((color, index) =>
        index === indexToUpdate ? { ...color, label } : color
      )
    );
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

      setExtractedColors(withDefaultLabels(colors));
    } catch (err) {
      console.error('Color extraction failed:', err);
      setError('Failed to extract colors. Please try a different image.');
    } finally {
      setIsExtracting(false);
    }
  };

  const accentColor = extractedColors[0]?.hex ?? '#E8000A';
  const secondaryAccent = extractedColors[1]?.hex ?? '#1A0066';
  const tertiaryAccent = extractedColors[2]?.hex ?? '#0015E8';

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <BackgroundGlow extractedColors={extractedColors} />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-stone-950/40 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center">
                <Image
                  src="/logo-icon-color.svg"
                  alt="PaletParrot logo"
                  width={44}
                  height={44}
                  className="h-11 w-11"
                  priority
                />
              </div>
              <div>
                <p className="font-sans text-xl font-bold tracking-tight text-white">
                  PaletParrot
                </p>
                <p className="text-xs uppercase tracking-[0.28em] text-white/55">
                  Image color palette tool
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <section className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
              <div className="space-y-6">
                <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-100/80">
                  <Sparkles className="h-4 w-4" />
                  Extract colors from images
                </div>
                <div className="space-y-4">
                  <h1 className="font-display max-w-4xl text-4xl font-bold leading-none sm:text-5xl lg:text-7xl">
                    <span className="text-gradient-brand">Extract color palettes from any image.</span>
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg dark:text-slate-300">
                    Upload an image, get the colors, label them, and export the palette as code or an image.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="glass-subpanel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Modes</p>
                    <p className="font-display mt-2 text-2xl text-slate-950 dark:text-white">3</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Auto, manual, eyedropper</p>
                  </div>
                  <div className="glass-subpanel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Exports</p>
                    <p className="font-display mt-2 text-2xl text-slate-950 dark:text-white">7</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">PDF, PNG, JPG, HTML, CSS, SCSS, Tailwind</p>
                  </div>
                  <div className="glass-subpanel rounded-2xl px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                      Picked colors
                    </p>
                    <p className="font-display mt-2 text-2xl text-slate-950 dark:text-white">
                      {Math.max(extractedColors.length, 2)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Shown in the current palette</p>
                  </div>
                </div>
              </div>

              <div className="glass-subpanel rounded-[1.75rem] p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, ${secondaryAccent})`,
                      boxShadow: `0 18px 42px ${withAlpha(accentColor, 0.35)}`,
                    }}
                  >
                    <WandSparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      What you can do
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                      Pick colors your way
                    </h2>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Use auto-detect for simple images, extract dominant colors from photos, or click with the eyedropper.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!uploadedImage && (
              <div className="mt-8 max-w-3xl">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            )}
          </section>

          {uploadedImage && (
            <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="glass-panel rounded-[2rem] p-4 sm:p-5">
                  <ImagePreview
                    key={`${uploadedImage.src}-${extractionMode}`}
                    image={uploadedImage}
                    mode={extractionMode}
                    accentColor={accentColor}
                    onRemove={handleRemoveImage}
                    onPickColor={handlePickColor}
                  />
                </div>

                {extractedColors.length > 0 && (
                  <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
                    <ExportActions colors={extractedColors} />
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div className="glass-panel rounded-[2rem] p-5 sm:p-6">
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
                </div>

                {error && (
                  <div
                    className="glass-panel rounded-[1.6rem] border border-rose-400/25 px-5 py-4"
                    style={{ boxShadow: `0 20px 46px ${withAlpha('#FB7185', 0.18)}` }}
                  >
                    <p className="text-sm text-rose-600 dark:text-rose-200">{error}</p>
                  </div>
                )}

                <div className="glass-subpanel rounded-[1.6rem] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    Current palette preview
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    {[accentColor, secondaryAccent, tertiaryAccent].map((color) => (
                      <div
                        key={color}
                        className="h-12 flex-1 rounded-2xl border border-white/20 shadow-lg"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 16px 36px ${withAlpha(color, 0.34)}`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {extractedColors.length > 0 && (
            <PaletteGrid
              colors={extractedColors}
              onLabelChange={handleLabelChange}
              onRemoveColor={handleRemoveColor}
            />
          )}
        </main>

        <footer className="relative z-10 mt-auto border-t border-white/10 bg-stone-950/25 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-500">
              Upload image • Extract colors • Export palette
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}