'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Sidebar, type AppShellDog, type AppShellProfile, type AppShellUser } from './sidebar';
import { cn } from '@/lib/utils/cn';

type MobileHeaderProps = {
  dogs: AppShellDog[];
  user: AppShellUser;
  profile: AppShellProfile;
};

export function MobileHeader({ dogs, user, profile }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-text transition-colors hover:bg-bg"
          aria-label="Открыть меню"
        >
          <Menu className="h-6 w-6" strokeWidth={2} />
        </button>

        <Link href="/app" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Logo size={28} />
          </span>
          <span className="font-heading text-lg font-bold text-text">Хвост</span>
        </Link>

        <Link
          href="/app/profile"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary/15 text-sm font-bold text-text"
        >
          {profile.display_name?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase() ?? '?'}
        </Link>
      </header>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              'fixed inset-0 z-50 bg-black/45 backdrop-blur-sm',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
            )}
          />
          <DialogPrimitive.Content
            className={cn(
              'fixed left-0 top-0 z-50 flex h-full w-[min(100%,280px)] flex-col border-r border-border bg-surface shadow-lg outline-none',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left-2 data-[state=open]:slide-in-from-left-2'
            )}
            aria-describedby={undefined}
          >
            <DialogPrimitive.Title className="sr-only">Навигация</DialogPrimitive.Title>
            <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <Sidebar
                dogs={dogs}
                user={user}
                profile={profile}
                forceExpanded
                onNavigate={() => setOpen(false)}
                className="h-full w-full border-0"
              />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
