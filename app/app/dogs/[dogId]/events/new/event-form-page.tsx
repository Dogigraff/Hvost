'use client';

import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/features/event-form/event-form';

interface Props {
  dogId: string;
  dogName: string;
}

export function EventFormPage({ dogId, dogName }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <div className="pb-4 pt-2">
        <h1 className="font-heading font-bold text-2xl text-text">Новое событие</h1>
        <p className="mt-1 text-sm text-text-muted">{dogName}</p>
      </div>
      <div>
        <EventForm
          dogId={dogId}
          onSuccess={() => router.push(`/app/dogs/${dogId}`)}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
