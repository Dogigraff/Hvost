'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { createClient } from '@/lib/supabase/client';
import { signupSchema, type SignupInput } from '@/lib/schemas/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { display_name: data.displayName },
        },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSentEmail(data.email);
      setEmailSent(true);
    } catch {
      toast.error('Ошибка соединения. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const topBar = (
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
  );

  if (emailSent) {
    return (
      <div className="min-h-screen bg-bg">
        {topBar}
        <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
          <div className="w-full max-w-[440px]">
            <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Mail size={28} className="text-primary" />
              </div>
              <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center rounded-3xl bg-primary/20 text-xs font-semibold text-text-muted">
                TODO: happy.svg
              </div>
              <h2 className="mb-2 font-heading text-2xl font-bold text-text">Проверьте почту</h2>
              <p className="mb-2 text-text-muted">Мы отправили ссылку подтверждения на</p>
              <p className="mb-4 font-semibold text-text">{sentEmail}</p>
              <p className="text-sm text-text-muted">После подтверждения вы сможете войти в сервис</p>
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 font-heading font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none"
              >
                Открыть Gmail
              </a>
            </div>
            <p className="mt-6 text-center text-sm text-text-muted">
              Уже есть аккаунт?{' '}
              <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {topBar}
      <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-text">Хвост</h1>
            <p className="mt-1 text-sm text-text-muted">Быстро и бесплатно</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-7 shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="signup-name"
                label="Ваше имя (опционально)"
                placeholder="Александра"
                autoComplete="name"
                error={errors.displayName?.message}
                {...register('displayName')}
              />
              <Input
                id="signup-email"
                label="Email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                id="signup-password"
                label="Пароль"
                type="password"
                placeholder="Минимум 6 символов"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button type="submit" loading={isLoading} fullWidth className="mt-2" size="lg">
                Создать аккаунт
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-text-muted">
            Уже есть аккаунт?{' '}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
