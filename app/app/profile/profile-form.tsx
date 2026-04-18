'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { profileSchema, type ProfileInput } from '@/lib/schemas/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface ProfileFormProps {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export function ProfileForm({ userId, email, displayName }: ProfileFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { display_name: displayName },
  });

  const onSubmit = async (data: ProfileInput) => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: data.display_name })
        .eq('id', userId);
      if (error) throw error;
      toast.success('Сохранено');
      router.refresh();
    } catch {
      toast.error('Не удалось сохранить');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch {
      toast.error('Ошибка при выходе');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar placeholder */}
      <div className="flex justify-center py-2">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/20">
          <span className="text-4xl font-heading font-bold text-text">
            {displayName?.[0]?.toUpperCase() ?? email?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
      </div>

      {/* Email (readonly) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text">Email</label>
        <div className="rounded-lg border-2 border-border bg-bg px-4 py-3 text-base text-text-muted">
          {email}
        </div>
      </div>

      {/* Display name */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="profile-name"
          label="Имя"
          placeholder="Ваше имя"
          error={errors.display_name?.message}
          {...register('display_name')}
        />
        <Button type="submit" loading={isSaving} fullWidth>
          Сохранить
        </Button>
      </form>

      <div className="space-y-3 rounded-xl border border-border bg-surface p-4 shadow-sm">
        <p className="text-sm font-semibold text-text">Настройки</p>
        <div className="flex items-center justify-between rounded-lg border border-border bg-bg px-3 py-2">
          <span className="text-sm text-text">Тема</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-border/50">
        <Button
          variant="danger"
          className="w-full"
          loading={isLoggingOut}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
