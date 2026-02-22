"use client";

import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CarouselProps } from '@/types/component';
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateScrollState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on('select', updateScrollState);
    api.on('reInit', updateScrollState);

    return () => {
      api.off('select', updateScrollState);
      api.off('reInit', updateScrollState);
    };
  }, [api]);

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-3 w-full">
        {showArrows && childrenArray.length > 1 && (
          <button
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
            aria-label="Previous slide"
            className={cn(
              'flex-shrink-0 inline-flex items-center justify-center',
              'h-10 w-10 rounded-full',
              'bg-white hover:bg-gray-50',
              'border border-gray-200',
              'shadow-sm hover:shadow-md',
              'transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-sm'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        <div className="flex-1 relative overflow-hidden">
          <div 
            className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to left, rgba(255,255,255,0.7) 0%, transparent 100%)',
              opacity: canScrollNext ? 1 : 0,
            }}
          />
          <div 
            className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,0.7) 0%, transparent 100%)',
              opacity: canScrollPrev ? 1 : 0,
            }}
          />
          <ShadcnCarousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: false,
            }}
          >
            <CarouselContent className="-ml-4">
              {childrenArray.map((child, index) => (
                <CarouselItem 
                  key={index}
                  className="pl-4 basis-1/2 min-w-0"
                >
                  {child}
                </CarouselItem>
              ))}
            </CarouselContent>
          </ShadcnCarousel>
        </div>

        {showArrows && childrenArray.length > 1 && (
          <button
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
            aria-label="Next slide"
            className={cn(
              'flex-shrink-0 inline-flex items-center justify-center',
              'h-10 w-10 rounded-full',
              'bg-white hover:bg-gray-50',
              'border border-gray-200',
              'shadow-sm hover:shadow-md',
              'transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-sm'
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {showDots && childrenArray.length > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 mb-1">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'rounded-full transition-all duration-300 ease-out',
                'hover:scale-110',
                index === current
                  ? 'bg-orange-500 w-8 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
