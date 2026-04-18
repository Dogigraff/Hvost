import { redirect, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatAge } from '@/lib/utils/date';
import { DogDeleteButton } from './dog-delete-button';
import { DogTabs } from './dog-tabs';
import { AnimatedBlock, AnimatedStagger, AnimatedChild } from '@/components/ui/animated';

interface Props {
  params: { dogId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DogPage({ params, searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: dog } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', params.dogId)
    .eq('owner_id', user.id)
    .single();

  if (!dog) notFound();

  // Get signed photo URL
  let photoUrl: string | null = null;
  if (dog.photo_path) {
    const { data } = await supabase.storage
      .from('dog-photos')
      .createSignedUrl(dog.photo_path, 3600);
    photoUrl = data?.signedUrl ?? null;
  }

  // Load planned events
  const { data: plannedEvents } = await supabase
    .from('events')
    .select('*')
    .eq('dog_id', dog.id)
    .eq('status', 'planned')
    .order('starts_at', { ascending: true });

  // Load history events with URL-driven filters
  const periodParam = searchParams?.period;
  const typeParam = searchParams?.type;
  const parsedPeriod =
    typeof periodParam === 'string' && ['7', '30', '90'].includes(periodParam)
      ? Number(periodParam)
      : 30;
  const historyType =
    typeof typeParam === 'string'
      && ['all', 'vaccine', 'tick_pill', 'deworming', 'grooming', 'procedure', 'other'].includes(typeParam)
      ? typeParam
      : 'all';
  const periodCutoff = new Date(Date.now() - parsedPeriod * 24 * 60 * 60 * 1000).toISOString();

  const historyBaseQuery = supabase
    .from('events')
    .select('*')
    .eq('dog_id', dog.id)
    .in('status', ['done', 'missed'])
    .gte('starts_at', periodCutoff);
  const historyQuery =
    historyType === 'all'
      ? historyBaseQuery
      : historyBaseQuery.eq('type', historyType);
  const { data: historyEvents } = await historyQuery
    .order('starts_at', { ascending: false });

  return (
    <AnimatedStagger className="flex flex-col pb-4">
      {/* Photo header */}
      <AnimatedChild className="relative">
        <div className="h-52 overflow-hidden rounded-t-2xl bg-primary/10 md:h-80">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={dog.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <span className="text-8xl opacity-30">🐕</span>
            </div>
          )}
        </div>

        <div className="absolute right-4 top-4 flex gap-2">
          <Link
            href={`/app/dogs/${dog.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 shadow-sm transition-colors hover:bg-surface"
          >
            <Pencil size={16} className="text-text" />
          </Link>
          <DogDeleteButton dogId={dog.id} />
        </div>
      </AnimatedChild>

      {/* Dog info */}
      <AnimatedChild className="-mt-5 rounded-xl border border-border bg-surface px-5 py-5 shadow-lg md:-mt-6">
        <h1 className="font-heading text-[28px] font-extrabold text-text">{dog.name}</h1>
        <div className="mt-1 flex flex-wrap gap-2 text-sm text-text-muted">
          {dog.breed && (
            <span className="rounded-full bg-bg px-3 py-1">
              {dog.breed}
            </span>
          )}
          {dog.birth_date && (
            <span className="rounded-full bg-bg px-3 py-1">
              {formatAge(dog.birth_date)}
            </span>
          )}
          {dog.weight_kg && (
            <span className="rounded-full bg-bg px-3 py-1">
              {dog.weight_kg} кг
            </span>
          )}
          {dog.sex && (
            <span className="rounded-full bg-bg px-3 py-1">
              {dog.sex === 'male' ? '♂ Мальчик' : '♀ Девочка'}
            </span>
          )}
        </div>

        {dog.features && (
          <div className="mt-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">Особенности</p>
            <p className="text-sm text-text">{dog.features}</p>
          </div>
        )}

        {dog.notes && (
          <div className="mt-3 rounded-lg border border-border bg-bg p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Заметки</p>
            <p className="text-sm text-text">{dog.notes}</p>
          </div>
        )}
      </AnimatedChild>

      {/* Add event button */}
      <AnimatedChild className="mb-4 mt-4">
        <Link
          href={`/app/dogs/${dog.id}/events/new`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          <Plus size={18} />
          Добавить событие
        </Link>
      </AnimatedChild>

      {/* Tabs */}
      <AnimatedBlock delay={0.1}>
        <DogTabs
          plannedEvents={plannedEvents ?? []}
          historyEvents={historyEvents ?? []}
        />
      </AnimatedBlock>
    </AnimatedStagger>
  );
}
