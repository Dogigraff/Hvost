'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Dog } from '@/lib/supabase/types';

interface DogSelectorProps {
  dogs: Dog[];
  currentDogId?: string;
  photoUrls?: Record<string, string>;
}

export function DogSelector({ dogs, currentDogId, photoUrls }: DogSelectorProps) {
  if (dogs.length === 0) return null;

  return (
    <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-2">
      {dogs.map((dog) => {
        const isActive = dog.id === currentDogId;
        const photoUrl = photoUrls?.[dog.id];

        return (
          <Link
            key={dog.id}
            href={`/app/dogs/${dog.id}`}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div
              className={cn(
                'h-14 w-14 overflow-hidden rounded-full border-2 border-transparent bg-surface transition-all duration-200',
                isActive ? 'scale-105 border-primary shadow-md' : 'hover:border-border'
              )}
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={dog.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🐕</span>
                </div>
              )}
            </div>
            <span
              className={cn(
                'text-xs font-medium max-w-[56px] truncate',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              {dog.name}
            </span>
          </Link>
        );
      })}
      <Link
        href="/app/dogs/new"
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-border bg-surface transition-colors hover:border-primary">
          <Plus size={20} className="text-text-muted" />
        </div>
        <span className="text-xs text-text-muted">Добавить</span>
      </Link>
    </div>
  );
}
