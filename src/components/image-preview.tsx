'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { ExtractedColor, ExtractionMode, UploadedImage } from '@/lib/types';
import { normalizeColor } from '@/lib/color-utils';

interface ImagePreviewProps {
  image: UploadedImage;
  mode: ExtractionMode;
  accentColor?: string;
  onRemove: () => void;
  onPickColor?: (color: ExtractedColor) => void;
}

interface HoverSample {
  clientX: number;
  clientY: number;
  color: ExtractedColor;
}

export function ImagePreview({
  image,
  mode,
  accentColor = '#67E8F9',
  onRemove,
  onPickColor,
}: ImagePreviewProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverSample, setHoverSample] = useState<HoverSample | null>(null);

  const isEyedropperMode = mode === 'eyedropper';

  const drawToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
      return;
    }

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      return;
    }

    setHoverSample(null);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  const getContainedImageRect = useCallback(() => {
    const img = imageRef.current;
    if (!img || img.naturalWidth === 0 || img.naturalHeight === 0) {
      return null;
    }

    const rect = img.getBoundingClientRect();
    const imageAspectRatio = img.naturalWidth / img.naturalHeight;
    const containerAspectRatio = rect.width / rect.height;

    if (imageAspectRatio > containerAspectRatio) {
      const displayedHeight = rect.width / imageAspectRatio;
      const offsetY = (rect.height - displayedHeight) / 2;

      return {
        left: rect.left,
        top: rect.top + offsetY,
        width: rect.width,
        height: displayedHeight,
      };
    }

    const displayedWidth = rect.height * imageAspectRatio;
    const offsetX = (rect.width - displayedWidth) / 2;

    return {
      left: rect.left + offsetX,
      top: rect.top,
      width: displayedWidth,
      height: rect.height,
    };
  }, []);

  const getPixelFromPointer = useCallback((clientX: number, clientY: number) => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const visibleImageRect = getContainedImageRect();

    if (!img || !canvas || !visibleImageRect) {
      return null;
    }

    const relativeX = clientX - visibleImageRect.left;
    const relativeY = clientY - visibleImageRect.top;

    if (
      relativeX < 0 ||
      relativeY < 0 ||
      relativeX > visibleImageRect.width ||
      relativeY > visibleImageRect.height
    ) {
      return null;
    }

    const pixelX = Math.min(
      img.naturalWidth - 1,
      Math.max(0, Math.floor((relativeX / visibleImageRect.width) * img.naturalWidth))
    );
    const pixelY = Math.min(
      img.naturalHeight - 1,
      Math.max(0, Math.floor((relativeY / visibleImageRect.height) * img.naturalHeight))
    );

    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      return null;
    }

    const pixel = context.getImageData(pixelX, pixelY, 1, 1).data;

    return {
      color: normalizeColor([pixel[0], pixel[1], pixel[2]]),
      pixelX,
      pixelY,
    };
  }, [getContainedImageRect]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!isEyedropperMode) {
      return;
    }

    const sample = getPixelFromPointer(event.clientX, event.clientY);
    if (!sample) {
      setHoverSample(null);
      return;
    }

    setHoverSample({
      clientX: event.clientX,
      clientY: event.clientY,
      color: sample.color,
    });
  }, [getPixelFromPointer, isEyedropperMode]);

  const handleMouseLeave = useCallback(() => {
    setHoverSample(null);
  }, []);

  const handleClick = useCallback((event: React.MouseEvent<HTMLImageElement>) => {
    if (!isEyedropperMode || !onPickColor) {
      return;
    }

    const sample = getPixelFromPointer(event.clientX, event.clientY);
    if (!sample) {
      return;
    }

    onPickColor(sample.color);
  }, [getPixelFromPointer, isEyedropperMode, onPickColor]);

  const hoverTooltipStyle = useMemo(() => {
    if (!hoverSample) {
      return { opacity: 0 };
    }

    return {
      left: hoverSample.clientX + 18,
      top: hoverSample.clientY + 18,
      opacity: 1,
    };
  }, [hoverSample]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/12 bg-white/8"
      style={{
        boxShadow: `0 28px 80px ${accentColor}33`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-80"
        style={{
          boxShadow: `inset 0 0 0 1px ${accentColor}30`,
        }}
      />
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.45rem] bg-slate-950/70">
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-100"
          style={{
            background: `linear-gradient(180deg, ${accentColor}18 0%, rgba(15,23,42,0) 30%, rgba(15,23,42,0.35) 100%)`,
          }}
        />
        <img
          key={`${image.src}-${mode}`}
          ref={imageRef}
          src={image.src}
          alt="Uploaded image"
          className={`relative z-0 h-full w-full object-contain transition-transform duration-500 ${isEyedropperMode ? 'cursor-crosshair' : ''}`}
          onLoad={drawToCanvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          draggable={false}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {isEyedropperMode && (
        <div className="glass-pill absolute left-4 top-4 rounded-full px-4 py-2 text-xs uppercase tracking-[0.28em] text-white shadow-lg">
          Click the image to add exact pixel colors
        </div>
      )}

      {isEyedropperMode && hoverSample && (
        <div
          className="glass-subpanel fixed z-20 pointer-events-none rounded-2xl shadow-2xl"
          style={hoverTooltipStyle}
        >
          <div className="flex items-center gap-3 p-3">
            <div
              className="h-10 w-10 rounded-xl border border-white/20"
              style={{ backgroundColor: hoverSample.color.hex }}
            />
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Hovered color
              </p>
              <p className="font-mono text-sm text-slate-950 dark:text-slate-50">
                {hoverSample.color.hex}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onRemove}
        className="glass-pill absolute right-4 top-4 rounded-full p-2.5 text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20"
        aria-label="Remove image"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="glass-subpanel mt-3 rounded-[1.35rem] px-4 py-3">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {image.file.name} • {(image.file.size / 1024).toFixed(1)} KB
          {image.width && image.height && ` • ${image.width} × ${image.height}px`}
        </p>
        {isEyedropperMode && hoverSample && (
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Previewing {hoverSample.color.hex}
          </p>
        )}
      </div>
    </div>
  );
}