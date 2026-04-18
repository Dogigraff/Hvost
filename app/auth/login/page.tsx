'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Logo } from '@/components/brand/logo';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginInput } from '@/lib/schemas/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setServerError('Email не подтверждён. Проверьте почту.');
        } else {
          setServerError('Неверный email или пароль');
        }
        return;
      }
      router.push('/app');
      router.refresh();
    } catch {
      toast.error('Ошибка соединения. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Logo size={28} />
            </span>
            <span className="font-heading text-lg font-bold text-text">Хвост</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-text">С возвращением</h1>
            <p className="mt-1 text-sm text-text-muted">Рады видеть вас снова!</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-7 shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="login-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="login-password"
                label="Пароль"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              {serverError && (
                <div className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {serverError}
                </div>
              )}

              <Button type="submit" loading={isLoading} fullWidth className="mt-2" size="lg">
                Войти
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Нет аккаунта?{' '}
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
