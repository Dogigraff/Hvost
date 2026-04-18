import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export type ThinkingMascotProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function ThinkingMascot({ size = 48, className, priority = false }: ThinkingMascotProps) {
  return (
    <Image
      src="/mascot/thinking.png"
      alt="Маскот Хвост, задумчиво"
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn('h-auto w-auto max-w-full object-contain', className)}
      priority={priority}
    />
  );
}
