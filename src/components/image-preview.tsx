'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import type { UploadedImage } from '@/lib/types';

interface ImagePreviewProps {
  image: UploadedImage;
  onRemove: () => void;
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <div className="relative w-full aspect-video">
        <Image
          src={image.src}
          alt="Uploaded image"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
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
      </div>
    </div>
  );
}
