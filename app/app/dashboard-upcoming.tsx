import { createClient } from '@/lib/supabase/server';
import { formatEventDate, isOverdue } from '@/lib/utils/date';
import { EVENT_TYPE_LABELS } from '@/lib/schemas/event';
import { HappyMascot } from '@/components/features/mascot/happy-mascot';
import { UpcomingDoneButton } from './upcoming-done-button';

interface Props {
  dogId: string;
}

export async function DashboardUpcoming({ dogId }: Props) {
  const supabase = createClient();
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('dog_id', dogId)
    .eq('status', 'planned')
    .gte('starts_at', cutoff)
    .order('starts_at', { ascending: true })
    .limit(3);

  if (!events || events.length === 0) {
    return (
      <div className="fade-in rounded-xl border border-border bg-surface p-6 text-center shadow-md">
        <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl bg-primary/15">
          <HappyMascot size={96} />
        </div>
        <p className="mb-1 font-heading text-lg font-bold text-text">Всё под контролем</p>
        <p className="text-sm text-text-muted">На сегодня ничего не запланировано</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 fade-in">
      <h2 className="px-1 font-heading text-lg font-bold text-text">Ближайшее</h2>
      {events.map((event) => {
        const overdue = isOverdue(event.starts_at);
        return (
          <div
            key={event.id}
            className={`rounded-xl border p-5 shadow-md ${overdue ? 'border-danger/40 bg-danger/5' : 'border-border bg-surface'}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="mb-0.5 text-xs font-semibold text-text-muted">
                  {EVENT_TYPE_LABELS[event.type] ?? event.type}
                  {overdue && (
                    <span className="ml-2 font-semibold text-danger">• Просрочено</span>
                  )}
                </p>
                <p className="truncate font-heading text-xl font-extrabold text-text">{event.title}</p>
                <p className="mt-0.5 text-base text-text-muted">
                  {formatEventDate(event.starts_at)}
                </p>
              </div>
              <UpcomingDoneButton eventId={event.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
