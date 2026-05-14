'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { Download, Droplets, Eye, ScanSearch, Sparkles, Upload } from 'lucide-react';
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
    return `rgba(232, 0, 10, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const WORKFLOW_STEPS = [
  {
    icon: Upload,
    title: 'Upload an image',
    text: 'Start with a photo, screenshot, logo, or illustration.',
  },
  {
    icon: ScanSearch,
    title: 'Choose extraction mode',
    text: 'Switch between automatic, manual, or precise eyedropper selection.',
  },
  {
    icon: Droplets,
    title: 'Label each color',
    text: 'Turn raw swatches into names that stay useful in design and code.',
  },
  {
    icon: Download,
    title: 'Export instantly',
    text: 'Send the palette to documents, code, or image formats.',
  },
];

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
      const colors =
        extractionMode === 'auto'
          ? await extractColorsAuto(uploadedImage.src)
          : await extractColorsManual(uploadedImage.src, colorCount);

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
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f4ec_100%)]">
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur-md">
          <div className="flex w-full items-center px-4 py-4 sm:px-6 lg:px-8">
            <Image
              src="/logo-header.png"
              alt="PaletParrot"
              width={400}
              height={100}
              className="h-14 w-auto sm:h-16 md:h-[72px]"
              preload
            />
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <section className="panel overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
            <div className="mx-auto max-w-6xl space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600">
                  <Sparkles className="h-4 w-4 text-[var(--brand-red)]" />
                  Upload, extract, label, export
                </div>
              </div>

              <div className="space-y-5 text-center">
                <div className="mx-auto space-y-4">
                  <h1 className="font-display mx-auto max-w-5xl text-4xl font-semibold leading-[0.95] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                    Clean color extraction for designers, developers, and brand teams.
                  </h1>
                  <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                    Drop in an image, pull out the colors you need, rename them clearly, and export the palette in the format your workflow already uses.
                  </p>
                </div>

                <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-3">
                  <div className="subpanel space-y-2 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Modes</p>
                    <p className="font-display text-3xl text-slate-950">3</p>
                    <p className="text-sm leading-6 text-slate-600">Auto-detect, manual extraction, and eyedropper picking.</p>
                  </div>
                  <div className="subpanel space-y-2 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Exports</p>
                    <p className="font-display text-3xl text-slate-950">7</p>
                    <p className="text-sm leading-6 text-slate-600">PDF, PNG, JPG, HTML, CSS, SCSS, and Tailwind output.</p>
                  </div>
                  <div className="subpanel space-y-2 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Palette</p>
                    <p className="font-display text-3xl text-slate-950">{extractedColors.length}</p>
                    <p className="text-sm leading-6 text-slate-600">Colors currently ready to label, copy, or export.</p>
                  </div>
                </div>
              </div>

              {!uploadedImage && <ImageUploader onImageUpload={handleImageUpload} />}
            </div>
          </section>

          {uploadedImage && (
            <section className="grid w-full gap-8 2xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.8fr)]">
              <div className="space-y-6">
                <div className="panel p-4 sm:p-5">
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
                  <div className="panel p-5 sm:p-6">
                    <ExportActions colors={extractedColors} />
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="panel p-5 sm:p-6">
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
                    className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4"
                    style={{ boxShadow: `0 20px 46px ${withAlpha('#FB7185', 0.12)}` }}
                  >
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                )}

                <div className="subpanel p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Current palette preview
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    {[accentColor, secondaryAccent, tertiaryAccent].map((color) => (
                      <div
                        key={color}
                        className="h-14 flex-1 rounded-2xl border border-white"
                        style={{
                          backgroundColor: color,
                          boxShadow: `0 16px 36px ${withAlpha(color, 0.18)}`,
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

        <footer className="mt-auto border-t border-slate-200 bg-white/80">
          <div className="flex w-full flex-col gap-3 px-4 py-5 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:text-left">
            <p className="text-sm text-slate-600">Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Upload image • Extract colors • Export palette
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}