'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Check, Clock, AlertTriangle, CalendarCheck, Pill, Scissors, Sparkles, Activity, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { ru as ruLocale } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/client';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ru } from '@/lib/i18n/ru';
import { isOverdue } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/supabase/types';

interface EventListProps {
  events: Event[];
  mode: 'planned' | 'history';
  periodDays?: 7 | 30 | 90;
  onPeriodChange?: (days: 7 | 30 | 90) => void;
}

export function EventList({ events, mode, periodDays, onPeriodChange }: EventListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const periodFromUrl = searchParams.get('period');
  const typeFromUrl = searchParams.get('type');
  const selectedPeriod: 7 | 30 | 90 =
    periodFromUrl === '7' || periodFromUrl === '30' || periodFromUrl === '90'
      ? (Number(periodFromUrl) as 7 | 30 | 90)
      : (periodDays ?? 30);
  const selectedType =
    typeFromUrl && ['all', 'vaccine', 'tick_pill', 'deworming', 'grooming', 'procedure', 'other'].includes(typeFromUrl)
      ? typeFromUrl
      : 'all';

  const updateHistoryFilters = (nextPeriod: 7 | 30 | 90, nextType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', String(nextPeriod));
    params.set('type', nextType);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const markDone = async (eventId: string) => {
    setLoadingId(eventId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .update({ status: 'done', done_at: new Date().toISOString() })
        .eq('id', eventId);
      if (error) throw error;
      toast.success('Отмечено как выполнено');
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#F1C40F', '#4ADE80', '#FB923C'],
      });
      setHiddenIds((prev) => new Set(prev).add(eventId));
      setTimeout(() => router.refresh(), 280);
    } catch {
      toast.error('Не удалось обновить событие');
    } finally {
      setLoadingId(null);
    }
  };

  const markMissed = async (eventId: string) => {
    setLoadingId(eventId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .update({ status: 'missed', missed_at: new Date().toISOString() })
        .eq('id', eventId);
      if (error) throw error;
      toast.success('Отмечено как пропущено');
      router.refresh();
    } catch {
      toast.error('Не удалось обновить событие');
    } finally {
      setLoadingId(null);
    }
  };

  const TYPE_ICONS = {
    vaccine: CalendarCheck,
    tick_pill: Pill,
    deworming: Sparkles,
    grooming: Scissors,
    procedure: Activity,
    other: Circle,
  } as const;

  return (
    <div className="space-y-3">
      {mode === 'history' && onPeriodChange && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              onClick={() => {
                onPeriodChange(days);
                updateHistoryFilters(days, selectedType);
              }}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                selectedPeriod === days
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-muted hover:bg-gray-200'
              )}
            >
              {days} дней
            </button>
          ))}
          <select
            value={selectedType}
            onChange={(e) => updateHistoryFilters(selectedPeriod, e.target.value)}
            className="ml-auto h-8 rounded-full border border-border bg-white px-3 text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label="Фильтр по типу события"
          >
            <option value="all">Все типы</option>
            <option value="vaccine">{ru.events.eventTypeLabel.vaccine}</option>
            <option value="tick_pill">{ru.events.eventTypeLabel.tick_pill}</option>
            <option value="deworming">{ru.events.eventTypeLabel.deworming}</option>
            <option value="grooming">{ru.events.eventTypeLabel.grooming}</option>
            <option value="procedure">{ru.events.eventTypeLabel.procedure}</option>
            <option value="other">{ru.events.eventTypeLabel.other}</option>
          </select>
        </div>
      )}

      {events.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <Clock size={40} className="text-gray-200 mb-3" />
          <p className="text-text-muted font-medium">
            {mode === 'planned' ? 'Нет запланированных событий' : 'История пуста'}
          </p>
        </div>
      )}

      {events.map((event) => {
        const overdue = mode === 'planned' && isOverdue(event.starts_at);
        const effectiveStatus = overdue ? 'overdue' : event.status;
        const EventTypeIcon = TYPE_ICONS[event.type] ?? Circle;
        const hidden = hiddenIds.has(event.id);
        const stripeClass =
          effectiveStatus === 'done'
            ? 'bg-success'
            : effectiveStatus === 'missed' || effectiveStatus === 'overdue'
              ? 'bg-danger'
              : 'bg-primary';

        return (
          <div
            key={event.id}
            className={cn(
              'fade-in relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-md transition-all',
              hidden && 'pointer-events-none translate-y-2 opacity-0'
            )}
          >
            <span className={cn('absolute inset-y-0 left-0 w-1', stripeClass)} />
            <div className="ml-2 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <EventTypeIcon size={16} />
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    {ru.events.eventTypeLabel[event.type] ?? event.type}
                  </span>
                  <StatusBadge status={effectiveStatus} />
                </div>
                <p className="truncate text-base font-heading font-bold text-text">{event.title}</p>
                <p className="mt-0.5 text-sm text-text-muted">
                  {format(new Date(event.starts_at), 'd MMMM, HH:mm', { locale: ruLocale })}
                </p>
                {event.notes && (
                  <p className="mt-1.5 line-clamp-2 text-sm text-text-muted">{event.notes}</p>
                )}
              </div>

              {mode === 'planned' && (
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => markDone(event.id)}
                    loading={loadingId === event.id}
                    className="gap-1.5"
                  >
                    <Check size={14} />
                    Готово
                  </Button>
                  {overdue && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => markMissed(event.id)}
                      loading={loadingId === event.id}
                    >
                      <AlertTriangle size={14} />
                      Пропущено
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
