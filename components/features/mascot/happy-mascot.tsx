import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export type HappyMascotProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function HappyMascot({ size = 240, className, priority = false }: HappyMascotProps) {
  return (
    <Image
      src="/mascot/happy.png"
      alt="Маскот Хвост, радостно"
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn('h-auto w-auto max-w-full object-contain', className)}
      priority={priority}
    />
  );
}
