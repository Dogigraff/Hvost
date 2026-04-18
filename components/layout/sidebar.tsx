'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, User, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ru } from '@/lib/i18n/ru';
import { Logo } from '@/components/brand/logo';

export type AppShellDog = { id: string; name: string; photoUrl: string | null };

export type AppShellUser = { id: string; email: string | null };

export type AppShellProfile = { display_name: string | null; avatar_url: string | null };

type SidebarProps = {
  dogs: AppShellDog[];
  user: AppShellUser;
  profile: AppShellProfile;
  forceExpanded?: boolean;
  onNavigate?: () => void;
  className?: string;
};

function chatHref(firstDogId?: string) {
  return firstDogId ? `/app/dogs/${firstDogId}/chat` : '/app/dogs/new';
}

export function Sidebar({
  dogs,
  user,
  profile,
  forceExpanded = false,
  onNavigate,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const firstDogId = dogs[0]?.id;

  const isHome = pathname === '/app' || pathname === '/app/';
  const isProfile = pathname.startsWith('/app/profile');
  const isChat = pathname.includes('/chat');

  const navItems = [
    { href: '/app' as const, label: ru.nav.home, icon: Home, active: isHome },
    { href: chatHref(firstDogId), label: ru.nav.chat, icon: MessageCircle, active: isChat },
    { href: '/app/profile' as const, label: ru.nav.profile, icon: User, active: isProfile },
  ];

  const showText = forceExpanded ? true : undefined;

  return (
    <aside
      className={cn(
        'flex h-dvh flex-col border-r border-border bg-surface',
        forceExpanded ? 'w-[280px]' : 'w-[72px] lg:w-[280px]',
        className
      )}
    >
      <div className={cn('shrink-0 border-b border-border px-3 py-5', forceExpanded ? 'px-5' : 'px-2 lg:px-5')}>
        <Link
          href="/app"
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-2 rounded-lg transition-colors hover:bg-bg',
            forceExpanded ? 'justify-start' : 'justify-center lg:justify-start'
          )}
          title="Хвост"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Logo size={32} />
          </span>
          <span
            className={cn(
              'font-heading text-[22px] font-bold text-text',
              forceExpanded ? 'inline' : 'hidden lg:inline'
            )}
          >
            Хвост
          </span>
        </Link>
      </div>

      <nav className={cn('flex flex-col gap-1 p-2', forceExpanded ? '' : 'items-stretch')}>
        {navItems.map(({ href, label, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={showText === undefined && !forceExpanded ? label : undefined}
            className={cn(
              'relative flex h-11 items-center gap-3 rounded-md border-l-[3px] pl-3 pr-2 text-sm font-medium transition-colors',
              forceExpanded ? 'justify-start' : 'justify-center lg:justify-start',
              active
                ? 'border-primary bg-primary/15 text-text'
                : 'border-transparent text-text-muted hover:bg-bg hover:text-text'
            )}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
            <span className={cn(forceExpanded ? 'inline' : 'hidden lg:inline')}>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mx-3 my-2 h-px bg-border lg:mx-5" />

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <p
          className={cn(
            'px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wide text-text-muted',
            forceExpanded ? 'block' : 'hidden lg:block'
          )}
        >
          Мои собаки
        </p>
        <ul className="flex flex-col gap-1">
          {dogs.map((dog) => {
            const dogActive = pathname.startsWith(`/app/dogs/${dog.id}`);
            return (
              <li key={dog.id}>
                <Link
                  href={`/app/dogs/${dog.id}`}
                  onClick={onNavigate}
                  title={showText === undefined && !forceExpanded ? dog.name : undefined}
                  className={cn(
                    'relative flex min-h-[52px] items-center gap-3 rounded-md border-l-[3px] py-1.5 pl-3 pr-2 text-sm font-medium transition-colors',
                    forceExpanded ? 'justify-start' : 'justify-center lg:justify-start',
                    dogActive
                      ? 'border-primary bg-primary/15 text-text'
                      : 'border-transparent text-text-muted hover:bg-bg hover:text-text'
                  )}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-sm font-bold text-text">
                    {dog.photoUrl ? (
                      <Image
                        src={dog.photoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                        sizes="40px"
                      />
                    ) : (
                      dog.name[0]?.toUpperCase() ?? '?'
                    )}
                  </span>
                  <span className={cn('min-w-0 flex-1 truncate', forceExpanded ? 'inline' : 'hidden lg:inline')}>
                    {dog.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/app/dogs/new"
          onClick={onNavigate}
          className={cn(
            'mt-1 flex h-11 items-center gap-2 rounded-md border-l-[3px] border-transparent px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10',
            forceExpanded ? 'justify-start' : 'justify-center lg:justify-start'
          )}
          title={!forceExpanded ? 'Добавить собаку' : undefined}
        >
          <Plus className="h-5 w-5 shrink-0" />
          <span className={cn(forceExpanded ? 'inline' : 'hidden lg:inline')}>Добавить</span>
        </Link>
      </div>

      <div className="mt-auto border-t border-border p-3">
        <Link
          href="/app/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-bg"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-text">
            {profile.display_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
          </span>
          <div className={cn('min-w-0 flex-1 overflow-hidden', forceExpanded ? 'block' : 'hidden lg:block')}>
            <p className="truncate text-sm font-medium text-text">{profile.display_name ?? 'Профиль'}</p>
            <p
              className="max-w-[140px] truncate text-ellipsis whitespace-nowrap text-xs text-text-muted"
              title={user.email ?? undefined}
            >
              {user.email}
            </p>
          </div>
          <Settings className={cn('h-5 w-5 shrink-0 text-text-muted', forceExpanded ? '' : 'hidden lg:block')} />
        </Link>
      </div>
    </aside>
  );
}
