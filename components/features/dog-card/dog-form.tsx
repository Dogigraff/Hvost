'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { dogSchema, type DogInput } from '@/lib/schemas/dog';
import { validateImageFile, compressImage } from '@/lib/utils/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Dog } from '@/lib/supabase/types';

interface DogFormProps {
  dog?: Dog;
  ownerId: string;
  currentPhotoUrl?: string | null;
}

export function DogForm({ dog, ownerId, currentPhotoUrl }: DogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhotoUrl ?? null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DogInput>({
    resolver: zodResolver(dogSchema),
    defaultValues: dog
      ? {
          name: dog.name,
          breed: dog.breed ?? '',
          sex: (dog.sex as 'male' | 'female') ?? undefined,
          birth_date: dog.birth_date ?? '',
          weight_kg: dog.weight_kg?.toString() ?? '',
          features: dog.features ?? '',
          notes: dog.notes ?? '',
        }
      : undefined,
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setPhotoFile(file);
  };

  const uploadPhoto = async (file: File, dogId: string): Promise<string | null> => {
    const supabase = createClient();
    const compressed = await compressImage(file);
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${ownerId}/${dogId}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('dog-photos')
      .upload(path, compressed, { upsert: true });

    if (error) {
      console.error('Photo upload error:', error);
      return null;
    }
    return path;
  };

  const onSubmit = async (data: DogInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      if (dog) {
        // Update
        let photoPath = dog.photo_path;
        if (photoFile) {
          photoPath = await uploadPhoto(photoFile, dog.id);
        }

        const { error } = await supabase
          .from('dogs')
          .update({
            name: data.name,
            breed: data.breed || null,
            sex: data.sex || null,
            birth_date: data.birth_date || null,
            weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
            features: data.features || null,
            notes: data.notes || null,
            photo_path: photoPath,
          })
          .eq('id', dog.id);

        if (error) throw error;
        toast.success('Изменения сохранены');
        router.push(`/app/dogs/${dog.id}`);
      } else {
        // Create
        const { data: newDog, error } = await supabase
          .from('dogs')
          .insert({
            owner_id: ownerId,
            name: data.name,
            breed: data.breed || null,
            sex: data.sex || null,
            birth_date: data.birth_date || null,
            weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
            features: data.features || null,
            notes: data.notes || null,
          })
          .select()
          .single();

        if (error) throw error;

        // Upload photo if provided
        if (photoFile && newDog) {
          const photoPath = await uploadPhoto(photoFile, newDog.id);
          if (photoPath) {
            await supabase.from('dogs').update({ photo_path: photoPath }).eq('id', newDog.id);
          }
        }

        toast.success('Питомец добавлен!');
        router.push(`/app/dogs/${newDog.id}`);
      }

      router.refresh();
    } catch (err) {
      console.error('Dog form error:', err);
      toast.error('Произошла ошибка. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-5 pb-10">
      {/* Photo upload */}
      <div className="flex justify-center py-4">
        <label className="relative cursor-pointer group">
          <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-dashed border-primary/30 bg-primary/10 transition-colors group-hover:border-primary">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Фото питомца"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <Camera size={24} className="text-primary/50" />
                <span className="text-xs text-primary/50">Фото</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="sr-only"
          />
          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-fg shadow-md">
            <Camera size={14} />
          </div>
        </label>
      </div>

      <Input
        id="dog-name"
        label="Кличка *"
        placeholder="Барсик"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="dog-breed"
        label="Порода"
        placeholder="Лабрадор"
        {...register('breed')}
      />

      {/* Sex */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text">Пол</label>
        <div className="flex gap-3">
          {[
            { value: 'male', label: '♂ Мальчик' },
            { value: 'female', label: '♀ Девочка' },
          ].map(({ value, label }) => (
            <label key={value} className="flex-1">
              <input type="radio" value={value} className="sr-only" {...register('sex')} />
              <span className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-border py-2.5 text-sm font-semibold transition-colors hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-fg">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Input
        id="dog-birth-date"
        label="Дата рождения"
        type="date"
        {...register('birth_date')}
      />

      <Input
        id="dog-weight"
        label="Вес (кг)"
        type="number"
        step="0.1"
        min="0"
        placeholder="12.5"
        error={errors.weight_kg?.message}
        {...register('weight_kg')}
      />

      <Textarea
        id="dog-features"
        label="Особенности (аллергии, диеты)"
        placeholder="Аллергия на курицу, принимает таблетки..."
        rows={3}
        {...register('features')}
      />

      <Textarea
        id="dog-notes"
        label="Заметки"
        placeholder="Любая дополнительная информация..."
        rows={3}
        {...register('notes')}
      />

      <Button type="submit" loading={isLoading} fullWidth size="lg">
        {dog ? 'Сохранить изменения' : 'Добавить питомца'}
      </Button>
    </form>
  );
}
