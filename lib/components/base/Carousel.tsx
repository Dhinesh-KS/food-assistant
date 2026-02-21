"use client";

import { ReactNode, useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CarouselProps } from '../schema';

interface CarouselComponentProps extends CarouselProps {
  children?: ReactNode;
}

export function Carousel({ 
  showArrows = true,
  showDots = true,
  slidesToShow = 1.2,
  gap = '16px',
  className,
  children 
}: CarouselComponentProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className={cn('relative', className)}>
      <div 
        className="overflow-hidden px-16 relative"
        ref={emblaRef}
        style={{
          maskImage: 'linear-gradient(to right, black calc(100% - 60px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 60px), transparent)',
        }}
      >
        <div className="flex items-stretch" style={{ gap }}>
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex"
              style={{ 
                flex: `0 0 auto`,
                minWidth: 0,
                maxWidth: '360px',
                width: '360px'
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && childrenArray.length > 1 && (
        <div className="flex justify-between items-center gap-2 mt-6 w-full">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            aria-label="Previous slide"
            className={cn(
              'inline-flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'transition-all duration-200',
              prevBtnEnabled 
                ? 'bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-900 hover:border-gray-400 shadow-sm hover:shadow cursor-pointer' 
                : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div className="w-px h-5 bg-gray-300" />
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            aria-label="Next slide"
            className={cn(
              'inline-flex items-center justify-center',
              'w-10 h-10 rounded-full',
              'transition-all duration-200',
              nextBtnEnabled 
                ? 'bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-900 hover:border-gray-400 shadow-sm hover:shadow cursor-pointer' 
                : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {showDots && childrenArray.length > 1 && (
        <div className="flex justify-center items-center gap-2.5 mt-5 mb-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300 ease-in-out',
                index === selectedIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/40 hover:bg-muted-foreground/60 w-1.5'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
