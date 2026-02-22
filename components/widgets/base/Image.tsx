"use client";

import { useState } from 'react';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';
import { ImageProps } from '../schema';

export function Image({ 
  src,
  alt,
  width = '100%',
  height = '200px',
  fit = 'cover',
  fallback = '/placeholder-food.svg',
  className 
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const fitStyles = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
  };

  return (
    <div 
      className={cn('relative bg-muted', className)}
      style={{ width, height }}
    >
      <NextImage
        src={imgSrc}
        alt={alt}
        fill
        className={cn(
          fitStyles[fit],
          isLoading && 'opacity-0',
          'transition-opacity duration-300'
        )}
        onError={() => setImgSrc(fallback)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
