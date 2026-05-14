'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { ExtractedColor, ExtractionMode, UploadedImage } from '@/lib/types';
import { normalizeColor } from '@/lib/color-utils';

interface ImagePreviewProps {
  image: UploadedImage;
  mode: ExtractionMode;
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
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <div className="relative w-full aspect-video">
        <img
          key={`${image.src}-${mode}`}
          ref={imageRef}
          src={image.src}
          alt="Uploaded image"
          className={`h-full w-full object-contain ${isEyedropperMode ? 'cursor-crosshair' : ''}`}
          onLoad={drawToCanvas}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          draggable={false}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {isEyedropperMode && (
        <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-3 py-2 text-xs text-white shadow-lg">
          Click the image to add exact pixel colors
        </div>
      )}

      {isEyedropperMode && hoverSample && (
        <div
          className="fixed z-20 pointer-events-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-xl backdrop-blur-sm"
          style={hoverTooltipStyle}
        >
          <div className="flex items-center gap-3 p-3">
            <div
              className="h-10 w-10 rounded-md border border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: hoverSample.color.hex }}
            />
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Hovered color</p>
              <p className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {hoverSample.color.hex}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onRemove}
        className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Remove image"
      >
        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>

      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {image.file.name} • {(image.file.size / 1024).toFixed(1)} KB
          {image.width && image.height && ` • ${image.width} × ${image.height}px`}
        </p>
        {isEyedropperMode && hoverSample && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Previewing {hoverSample.color.hex}
          </p>
        )}
      </div>
    </div>
  );
}