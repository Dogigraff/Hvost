import { cn } from '@/lib/utils/cn';

type LogoProps = {
  className?: string;
  size?: number;
  title?: string;
};

/** Геометрическая лапка: 4 овала (пальцы) + подушечка. */
export function Logo({ className, size = 32, title }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={cn('shrink-0 text-primary', className)}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="9" cy="9" rx="3.2" ry="4" className="fill-current" />
      <ellipse cx="15" cy="7.5" rx="3.2" ry="4.2" className="fill-current" />
      <ellipse cx="21" cy="7.5" rx="3.2" ry="4.2" className="fill-current" />
      <ellipse cx="27" cy="9" rx="3.2" ry="4" className="fill-current" />
      <ellipse cx="18" cy="20" rx="11" ry="9" className="fill-current" />
    </svg>
  );
}
