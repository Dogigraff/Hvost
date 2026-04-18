import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CalendarClock,
  CalendarPlus,
  Flame,
  Plus,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DogSelector } from '@/components/features/dog-selector/dog-selector';
import { AnimatedStagger, AnimatedChild } from '@/components/ui/animated';
import { StatusBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { HeroMascot } from '@/components/features/mascot/hero-mascot';
import { ThinkingMascot } from '@/components/features/mascot/thinking-mascot';
import { formatAge, formatEventDate, isOverdue } from '@/lib/utils/date';
import { EVENT_TYPE_LABELS } from '@/lib/schemas/event';
import { UpcomingDoneButton } from './upcoming-done-button';
import type { Dog, Event } from '@/lib/supabase/types';
import { differenceInCalendarDays, isSameDay, startOfDay } from 'date-fns';

function pluralEvents(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} событие`;
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${n} события`;
  return `${n} событий`;
}

function pluralDaysStreak(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} день подряд`;
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return `${n} дня подряд`;
  return `${n} дней подряд`;
}

function nextEventLabel(startsAt: string): string {
  const start = startOfDay(new Date(startsAt));
  const today = startOfDay(new Date());
  const d = differenceInCalendarDays(start, today);
  if (d < 0) return 'Есть просроченное';
  if (d === 0) return 'Событие сегодня';
  if (d === 1) return 'След. событие завтра';
  return `След. событие через ${d} дн.`;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();

  const { data: dogs } = await supabase
    .from('dogs')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at');

  const photoUrls: Record<string, string> = {};
  if (dogs) {
    for (const dog of dogs) {
      if (dog.photo_path) {
        const { data } = await supabase.storage.from('dog-photos').createSignedUrl(dog.photo_path, 3600);
        if (data?.signedUrl) photoUrls[dog.id] = data.signedUrl;
      }
    }
  }

  const dogList = (dogs ?? []) as Dog[];
  const hasDogs = dogList.length > 0;
  const firstDog = dogList[0];
  const displayName = profile?.display_name?.trim() || user.email?.split('@')[0] || 'друг';

  let plannedNear: Event[] = [];
  let recentDone: Event[] = [];
  let nextPlanned: Event | null = null;
  let todayPlannedCount = 0;
  // TODO: streak — consecutive calendar days with no missed events for this dog (reset on any missed)
  const streakDays = 0;

  if (firstDog) {
    const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: planned } = await supabase
      .from('events')
      .select('*')
      .eq('dog_id', firstDog.id)
      .eq('status', 'planned')
      .gte('starts_at', cutoff)
      .order('starts_at', { ascending: true })
      .limit(5);

    plannedNear = (planned ?? []) as Event[];

    const { data: recent } = await supabase
      .from('events')
      .select('*')
      .eq('dog_id', firstDog.id)
      .in('status', ['done', 'missed'])
      .order('starts_at', { ascending: false })
      .limit(5);

    recentDone = (recent ?? []) as Event[];

    const { data: nextRow } = await supabase
      .from('events')
      .select('*')
      .eq('dog_id', firstDog.id)
      .eq('status', 'planned')
      .gte('starts_at', cutoff)
      .order('starts_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    nextPlanned = (nextRow ?? null) as Event | null;

    todayPlannedCount = plannedNear.filter((e) => isSameDay(new Date(e.starts_at), new Date())).length;
  }

  const subtitle =
    hasDogs && firstDog
      ? todayPlannedCount === 0
        ? `Сегодня у ${firstDog.name} всё спокойно`
        : `Сегодня ${pluralEvents(todayPlannedCount)} для ${firstDog.name}`
      : 'Добавьте питомца, чтобы вести журнал и напоминания';

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AnimatedStagger className="mx-auto w-full max-w-[720px] space-y-8">
        {/* Page header */}
        <AnimatedChild className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-heading text-[32px] font-extrabold leading-tight text-text">
              Привет, {displayName}
            </h1>
            <p className="mt-1 text-base text-text-muted">{subtitle}</p>
          </div>
          {hasDogs && firstDog && (
            <Link
              href={`/app/dogs/${firstDog.id}/events/new`}
              className={cn(
                'relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading text-base font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none sm:mt-1'
              )}
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              Добавить событие
            </Link>
          )}
        </AnimatedChild>

        {hasDogs && (
          <AnimatedChild className="md:hidden">
            <DogSelector dogs={dogList} currentDogId={firstDog?.id} photoUrls={photoUrls} />
          </AnimatedChild>
        )}

        {!hasDogs && (
          <AnimatedChild className="rounded-xl border border-border bg-surface p-8 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-full bg-primary/15">
              <HeroMascot size={144} />
            </div>
            <h2 className="mb-2 font-heading text-2xl font-extrabold text-text">Добавьте первую собаку</h2>
            <p className="mb-6 text-sm text-text-muted">
              Начните вести журнал здоровья — напоминания и советы будут под рукой.
            </p>
            <Link
              href="/app/dogs/new"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-heading font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none"
            >
              <Plus size={18} />
              Добавить питомца
            </Link>
          </AnimatedChild>
        )}

        {hasDogs && firstDog && (
          <>
            {/* Hero dog card */}
            <AnimatedChild>
              <div className="max-w-[720px] rounded-xl bg-surface p-8 shadow-lg">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full bg-primary/15">
                    {photoUrls[firstDog.id] ? (
                      <Image
                        src={photoUrls[firstDog.id]}
                        alt={firstDog.name}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <HeroMascot size={112} />
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <h2 className="font-heading text-2xl font-bold text-text">{firstDog.name}</h2>
                    <div className="flex flex-wrap gap-2">
                      {firstDog.birth_date && (
                        <span className="rounded-full bg-bg px-3 py-1 text-sm font-medium text-text-muted">
                          {formatAge(firstDog.birth_date)}
                        </span>
                      )}
                      {firstDog.breed && (
                        <span className="rounded-full bg-bg px-3 py-1 text-sm font-medium text-text">
                          {firstDog.breed}
                        </span>
                      )}
                      {firstDog.weight_kg != null && (
                        <span className="rounded-full bg-bg px-3 py-1 text-sm font-medium text-text-muted">
                          {firstDog.weight_kg} кг
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <span className="inline-flex items-center gap-2 font-medium text-text">
                        <Flame className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
                        {pluralDaysStreak(streakDays)}
                      </span>
                      <span className="inline-flex items-center gap-2 text-text-muted">
                        <CalendarClock className="h-5 w-5 shrink-0" strokeWidth={2} />
                        {nextPlanned ? nextEventLabel(nextPlanned.starts_at) : 'Нет запланированных'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedChild>

            {/* Grid */}
            <AnimatedChild className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Ближайшие — full width */}
              <section className="rounded-xl border border-border bg-surface p-5 shadow-md md:col-span-2">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-bold text-text">Ближайшие события</h3>
                  <Link
                    href={`/app/dogs/${firstDog.id}`}
                    className="inline-flex h-9 items-center justify-center rounded-xl px-3 font-heading text-sm font-bold text-text-muted transition-colors hover:bg-primary/10 hover:text-text"
                  >
                    Все
                  </Link>
                </div>
                {plannedNear.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-bg/50 py-8 text-center">
                    <CalendarPlus className="h-10 w-10 text-text-muted" strokeWidth={1.5} />
                    <p className="text-sm text-text-muted">Пока ничего не запланировано</p>
                    <Link
                      href={`/app/dogs/${firstDog.id}/events/new`}
                      className="inline-flex h-9 items-center justify-center rounded-xl border-2 border-border bg-surface px-4 font-heading text-sm font-bold text-text shadow-sm transition-colors hover:bg-bg"
                    >
                      Запланировать первое
                    </Link>
                  </div>
                ) : (
                  <ul className="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1 md:max-h-none">
                    {plannedNear.map((event) => {
                      const overdue = isOverdue(event.starts_at);
                      return (
                        <li
                          key={event.id}
                          className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                            overdue ? 'border-danger/30 bg-danger/5' : 'border-border bg-bg/80'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                              {EVENT_TYPE_LABELS[event.type] ?? event.type}
                              {overdue && <span className="ml-2 text-danger">Просрочено</span>}
                            </p>
                            <p className="font-heading text-lg font-bold text-text">{event.title}</p>
                            <p className="text-sm text-text-muted">{formatEventDate(event.starts_at)}</p>
                          </div>
                          <UpcomingDoneButton eventId={event.id} />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              {/* Последние */}
              <section className="rounded-xl border border-border bg-surface p-5 shadow-md">
                <h3 className="mb-4 font-heading text-lg font-bold text-text">Последние события</h3>
                {recentDone.length === 0 ? (
                  <p className="text-sm text-text-muted">Пока ничего не записано</p>
                ) : (
                  <ul className="space-y-3">
                    {recentDone.map((event) => (
                      <li
                        key={event.id}
                        className="flex flex-wrap items-start justify-between gap-2 border-b border-border/80 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-text">{event.title}</p>
                          <p className="text-xs text-text-muted">{formatEventDate(event.starts_at)}</p>
                        </div>
                        <StatusBadge
                          status={event.status === 'done' ? 'done' : 'missed'}
                          className="shrink-0"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Совет */}
              <section className="rounded-xl border border-border bg-surface p-5 shadow-md">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15">
                    <ThinkingMascot size={48} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-3">
                    <h3 className="font-heading text-lg font-bold text-text">Совет дня</h3>
                    <p className="text-sm leading-relaxed text-text-muted">
                      Проверяйте уши собаки раз в неделю — так можно заметить воспаление на ранней стадии.
                      После прогулки загляните во внутреннюю сторону раковины.
                    </p>
                    <Link
                      href={`/app/dogs/${firstDog.id}/chat`}
                      className="inline-flex h-9 w-fit items-center justify-center rounded-xl px-3 font-heading text-sm font-bold text-text-muted transition-colors hover:bg-primary/10 hover:text-text"
                    >
                      Задать вопрос
                    </Link>
                  </div>
                </div>
              </section>
            </AnimatedChild>
          </>
        )}
      </AnimatedStagger>

      {hasDogs && firstDog && (
        <Link
          href={`/app/dogs/${firstDog.id}/events/new`}
          className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-all duration-150 hover:bg-primary-hover active:scale-95 md:hidden"
          aria-label="Добавить событие"
        >
          <Plus size={26} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}
