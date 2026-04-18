import { z } from 'zod';

export const eventSchema = z.object({
  type: z.enum(['vaccine', 'tick_pill', 'deworming', 'grooming', 'procedure', 'other']),
  title: z.string().min(1, 'Заголовок обязателен'),
  starts_at: z.string().min(1, 'Дата и время обязательны'),
  notes: z.string().optional(),
});

export type EventInput = z.infer<typeof eventSchema>;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  vaccine: 'Прививка',
  tick_pill: 'Таблетка от клещей',
  deworming: 'Дегельминтизация',
  grooming: 'Груминг',
  procedure: 'Процедура',
  other: 'Другое',
};

export const EVENT_TYPE_DEFAULTS: Record<string, string> = {
  vaccine: 'Прививка',
  tick_pill: 'Таблетка от клещей',
  deworming: 'Дегельминтизация',
  grooming: 'Груминг',
  procedure: 'Процедура',
  other: 'Событие',
};
