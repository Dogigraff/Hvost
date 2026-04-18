'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { eventSchema, EVENT_TYPE_LABELS, EVENT_TYPE_DEFAULTS, type EventInput } from '@/lib/schemas/event';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EventFormProps {
  dogId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EVENT_TYPES = ['vaccine', 'tick_pill', 'deworming', 'grooming', 'procedure', 'other'] as const;

export function EventForm({ dogId, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultDateTime = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      type: 'vaccine',
      title: 'Прививка',
      starts_at: defaultDateTime,
    },
  });

  const selectedType = watch('type');

  const handleTypeChange = (type: string) => {
    setValue('type', type as EventInput['type']);
    setValue('title', EVENT_TYPE_DEFAULTS[type] ?? 'Событие');
  };

  const onSubmit = async (data: EventInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('events').insert({
        dog_id: dogId,
        type: data.type,
        title: data.title,
        starts_at: new Date(data.starts_at).toISOString(),
        notes: data.notes || null,
        status: 'planned',
      });

      if (error) throw error;

      toast.success('Событие добавлено');
      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create event:', err);
      toast.error('Не удалось добавить событие');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Type selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-text">Тип</label>
        <div className="grid grid-cols-2 gap-2">
          {EVENT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeChange(type)}
              className={`rounded-lg border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                selectedType === type
                  ? 'border-primary bg-primary text-primary-fg shadow-sm'
                  : 'border-border bg-surface text-text-muted hover:border-primary/50'
              }`}
            >
              {EVENT_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <Input
        id="event-title"
        label="Заголовок"
        placeholder="Название события"
        error={errors.title?.message}
        {...register('title')}
      />

      <Input
        id="event-datetime"
        label="Дата и время"
        type="datetime-local"
        error={errors.starts_at?.message}
        {...register('starts_at')}
      />

      <Textarea
        id="event-notes"
        label="Заметка (опционально)"
        placeholder="Дополнительная информация..."
        rows={3}
        {...register('notes')}
      />

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button type="submit" loading={isLoading} className="flex-1">
          Сохранить
        </Button>
      </div>
    </form>
  );
}
