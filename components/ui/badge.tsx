import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  status: 'planned' | 'done' | 'missed' | 'overdue';
  className?: string;
}

const BADGE_STYLES: Record<string, string> = {
  planned: 'bg-info/15 text-info',
  done: 'bg-success/15 text-success',
  missed: 'bg-danger/15 text-danger',
  overdue: 'bg-warning/20 text-warning',
};

const BADGE_LABELS: Record<string, string> = {
  planned: 'Запланировано',
  done: 'Выполнено',
  missed: 'Пропущено',
  overdue: 'Просрочено',
};

const DOT_STYLES: Record<string, string> = {
  planned: 'bg-info',
  done: 'bg-success',
  missed: 'bg-danger',
  overdue: 'bg-warning',
};

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide',
        BADGE_STYLES[status],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', DOT_STYLES[status])} />
      {BADGE_LABELS[status]}
    </span>
  );
}
