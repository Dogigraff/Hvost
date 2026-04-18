import { createClient } from '@/lib/supabase/server';
import { formatAge } from '@/lib/utils/date';
import { EVENT_TYPE_LABELS } from '@/lib/schemas/event';
import type { Dog, Event } from '@/lib/supabase/types';

export interface DogContext {
  dog: Dog;
  upcomingEvents: Event[];
  recentEvents: Event[];
}

export async function buildDogContext(dogId: string): Promise<DogContext | null> {
  const supabase = createClient();

  const { data: dog, error: dogError } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', dogId)
    .single();

  if (dogError || !dog) return null;

  const now = new Date().toISOString();

  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .eq('dog_id', dogId)
    .eq('status', 'planned')
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(5);

  const { data: recentEvents } = await supabase
    .from('events')
    .select('*')
    .eq('dog_id', dogId)
    .in('status', ['done', 'missed'])
    .order('starts_at', { ascending: false })
    .limit(10);

  return {
    dog,
    upcomingEvents: upcomingEvents ?? [],
    recentEvents: recentEvents ?? [],
  };
}

export function formatDogContextString(ctx: DogContext): string {
  const { dog } = ctx;
  const age = dog.birth_date ? formatAge(dog.birth_date) : 'не указан';

  return [
    `Имя: ${dog.name}`,
    dog.breed ? `Порода: ${dog.breed}` : null,
    `Возраст: ${age}`,
    dog.weight_kg ? `Вес: ${dog.weight_kg} кг` : null,
    dog.sex ? `Пол: ${dog.sex === 'male' ? 'самец' : 'самка'}` : null,
    dog.features ? `Особенности: ${dog.features}` : null,
    dog.notes ? `Заметки: ${dog.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatEventsContextString(ctx: DogContext): string {
  const lines: string[] = [];

  if (ctx.upcomingEvents.length > 0) {
    lines.push('Предстоящие события:');
    ctx.upcomingEvents.forEach((e) => {
      lines.push(`- ${EVENT_TYPE_LABELS[e.type] ?? e.type}: ${e.title} (${new Date(e.starts_at).toLocaleDateString('ru-RU')})`);
    });
  }

  if (ctx.recentEvents.length > 0) {
    lines.push('Последние выполненные/пропущенные события:');
    ctx.recentEvents.forEach((e) => {
      const statusLabel = e.status === 'done' ? 'выполнено' : 'пропущено';
      lines.push(`- ${EVENT_TYPE_LABELS[e.type] ?? e.type}: ${e.title} — ${statusLabel} (${new Date(e.starts_at).toLocaleDateString('ru-RU')})`);
    });
  }

  return lines.length > 0 ? lines.join('\n') : 'Нет событий';
}
