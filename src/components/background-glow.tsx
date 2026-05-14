'use client';

import { useMemo } from 'react';
import type { ExtractedColor } from '@/lib/types';

interface BackgroundGlowProps {
  extractedColors: ExtractedColor[];
}

const DEFAULT_GLOW_COLORS = ['#7C3AED', '#22D3EE', '#F97316', '#F43F5E'];

const BLOB_POSITIONS = [
  {
    className: '-top-32 left-[-8rem] h-[26rem] w-[26rem] sm:h-[34rem] sm:w-[34rem]',
    animationClass: 'animate-float-slow',
    opacity: 0.34,
  },
  {
    className: 'right-[-7rem] top-[8%] h-[22rem] w-[22rem] sm:h-[30rem] sm:w-[30rem]',
    animationClass: 'animate-float-delayed',
    opacity: 0.28,
  },
  {
    className: 'bottom-[-10rem] left-[10%] h-[20rem] w-[20rem] sm:h-[28rem] sm:w-[28rem]',
    animationClass: 'animate-float-reverse',
    opacity: 0.22,
  },
  {
    className: 'bottom-[8%] right-[10%] h-[18rem] w-[18rem] sm:h-[24rem] sm:w-[24rem]',
    animationClass: 'animate-float-slow',
    opacity: 0.18,
  },
];

function withAlpha(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    return `rgba(124, 58, 237, ${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function BackgroundGlow({ extractedColors }: BackgroundGlowProps) {
  const palette = useMemo(() => {
    const uniqueColors = extractedColors
      .map((color) => color.hex)
      .filter((hex, index, list) => list.indexOf(hex) === index);

    const source = uniqueColors.length > 0 ? uniqueColors : DEFAULT_GLOW_COLORS;
    return BLOB_POSITIONS.map((_, index) => source[index % source.length]);
  }, [extractedColors]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,#040611_0%,#09111f_48%,#030611_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_32%),linear-gradient(135deg,#040611_0%,#09111f_48%,#030611_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(4,6,17,0.28),rgba(4,6,17,0.82))] dark:bg-[linear-gradient(to_bottom,rgba(4,6,17,0.28),rgba(4,6,17,0.82))]" />
      {BLOB_POSITIONS.map((blob, index) => (
        <div
          key={`${palette[index]}-${index}`}
          className={`absolute rounded-full blur-3xl transition-all duration-1000 ${blob.className} ${blob.animationClass}`}
          style={{
            background: `radial-gradient(circle at center, ${withAlpha(palette[index], blob.opacity)} 0%, ${withAlpha(
              palette[index],
              blob.opacity * 0.62
            )} 35%, ${withAlpha(palette[index], 0)} 72%)`,
          }}
        />
      ))}
      <div className="absolute inset-0 opacity-40 dark:opacity-55 ambient-grid" />
    </div>
  );
}