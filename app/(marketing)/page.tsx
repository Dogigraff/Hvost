import Link from 'next/link';
import { ArrowRight, CalendarCheck, Sparkles, PawPrint } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { HeroMascot } from '@/components/features/mascot/hero-mascot';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const FEATURES = [
  {
    icon: CalendarCheck,
    title: 'Умный календарь',
    desc: 'Контролируйте прививки и процедуры без пропусков.',
  },
  {
    icon: Sparkles,
    title: 'AI-помощник',
    desc: 'Подскажет, что делать сейчас и когда идти к ветеринару.',
  },
  {
    icon: PawPrint,
    title: 'Профиль собаки',
    desc: 'Вся история здоровья и ухода в одной аккуратной карточке.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Logo size={36} />
            </span>
            <span className="font-heading text-xl font-extrabold">Хвост</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-text-muted transition-colors hover:text-text"
            >
              Войти
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 font-heading text-sm font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none sm:h-11 sm:px-6"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="min-h-[80vh] px-4 py-12 sm:px-8 sm:py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="fade-in order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-2 text-sm font-semibold text-text">
                <PawPrint size={16} />
                Для владельцев собак
              </div>
              <h1 className="mb-4 text-balance font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
                Журнал здоровья вашей собаки
              </h1>
              <p className="mb-8 max-w-xl text-lg text-text-muted">
                Отслеживайте прививки, процедуры и общайтесь с AI-помощником в одном дружелюбном интерфейсе.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 font-heading text-lg font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none"
                >
                  Начать бесплатно
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-border bg-surface px-6 font-heading text-base font-bold text-text shadow-sm transition-colors hover:bg-bg"
                >
                  Войти
                </Link>
              </div>
            </div>

            <div className="fade-in order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="flex aspect-square w-full max-w-[min(100%,480px)] items-center justify-center rounded-full bg-primary/15 p-6 shadow-inner">
                <HeroMascot size={280} className="max-h-[min(100%,400px)] w-full" priority={true} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-bg px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="fade-in rounded-xl border border-border bg-surface p-6 shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold">{title}</h3>
                <p className="text-sm text-text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-[1200px] rounded-2xl border border-primary/20 bg-primary/10 px-6 py-14 text-center sm:px-10">
            <h2 className="mb-3 font-heading text-2xl font-extrabold text-text sm:text-3xl">Начните бесплатно</h2>
            <p className="mx-auto mb-8 max-w-xl text-text-muted">
              Создайте профиль питомца и получите напоминания и советы в одном месте.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-10 font-heading text-lg font-bold text-primary-fg shadow-press transition-all duration-100 hover:bg-primary-hover active:translate-y-1 active:shadow-none"
            >
              Создать аккаунт
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface/80">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-text-muted sm:flex-row sm:items-center sm:px-8">
          <p>© 2026 Хвост</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-text">
              privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-text">
              terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
