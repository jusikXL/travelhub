import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

interface ScrollCardProps {
  image: string;
  title: string;
  aspectRatio?: 'portrait' | 'square';
  width?: number;
  height?: number;
}

export function ScrollCardComponent({
  content,
  image,
  title,
  aspectRatio = 'portrait',
  width,
  height,
  className,
  ...props
}: ScrollCardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Image
          src={image}
          alt="Hotel or Organisation image"
          width={width}
          height={height}
          className={cn(
            'h-auto w-auto object-cover transition-all hover:scale-105',
            aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square'
          )}
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{title}</h3>
      </div>
    </div>
  );
}
