import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
}

function Card({ className, elevated, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface p-5 shadow-md',
        elevated && 'shadow-lg',
        interactive && 'cursor-pointer transition-shadow hover:shadow-lg',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3', className)} {...props} />;
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-semibold text-lg text-text', className)} {...props} />;
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
