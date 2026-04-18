import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export type HeroMascotProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function HeroMascot({ size = 240, className, priority = false }: HeroMascotProps) {
  return (
    <Image
      src="/mascot/hero.png"
      alt="Маскот Хвост, нейтрально"
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn('h-auto w-auto max-w-full object-contain', className)}
      priority={priority}
    />
  );
}
