'use client';

import { Upload, Image as ImageIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import type { UploadedImage } from '@/lib/types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'];

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndProcessFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please upload a valid image file (JPG, PNG, SVG, WebP, or GIF)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        
        const img = new window.Image();
        img.onload = () => {
          onImageUpload({
            file,
            src,
            width: img.width,
            height: img.height,
            mimeType: file.type,
          });
        };
        img.onerror = () => {
          setError('Failed to load image. Please try another file.');
        };
        img.src = src;
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndProcessFile(file);
      }
    },
    [validateAndProcessFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndProcessFile(file);
      }
    },
    [validateAndProcessFile]
  );

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          glass-panel group relative overflow-hidden rounded-[2rem] border border-white/12 p-12 transition-all duration-300 cursor-pointer
          ${isDragging 
            ? 'scale-[1.01] border-cyan-300/60 shadow-[0_0_0_1px_rgba(103,232,249,0.25),0_30px_80px_rgba(34,211,238,0.22)]' 
            : 'hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_28px_90px_rgba(15,23,42,0.24)]'
          }
        `}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_35%)] opacity-80" />
        <div className="pointer-events-none absolute inset-[1px] rounded-[calc(2rem-1px)] border border-white/10" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:animate-pulse-glow" />

        <input
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload image file"
        />
        
        <div className="relative flex flex-col items-center gap-5 text-center pointer-events-none">
          {isDragging ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-cyan-200/30 bg-cyan-300/15 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
              <Upload className="h-10 w-10 animate-bounce text-cyan-200" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-white/12 bg-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
              <ImageIcon className="h-10 w-10 text-slate-500 dark:text-slate-300" />
            </div>
          )}
          
          <div>
            <p className="font-display text-2xl font-semibold text-slate-950 dark:text-slate-50">
              {isDragging ? 'Drop your image here' : 'Drag & drop an image'}
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              or click to browse
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Upload a JPG, PNG, SVG, WebP, or GIF to extract colors from the image.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Supports JPG, PNG, SVG, WebP, GIF
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-subpanel mt-4 rounded-2xl border border-rose-400/25 px-4 py-3">
          <p className="text-sm text-rose-600 dark:text-rose-200">{error}</p>
        </div>
      )}
    </div>
  );
}
