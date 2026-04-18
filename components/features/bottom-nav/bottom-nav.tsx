'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dog, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { href: '/app', label: 'Главная', icon: Home },
  { href: '/app/dogs', label: 'Собаки', icon: Dog },
  { href: '/app/chat', label: 'Чат', icon: MessageCircle },
  { href: '/app/profile', label: 'Профиль', icon: User },
];

interface BottomNavProps {
  currentDogId?: string;
}

export function BottomNav({ currentDogId }: BottomNavProps) {
  const pathname = usePathname();

  const getHref = (base: string) => {
    if (base === '/app/chat' && currentDogId) {
      return `/app/dogs/${currentDogId}/chat`;
    }
    if (base === '/app/chat' && !currentDogId) {
      return '/app/dogs/new';
    }
    if (base === '/app/dogs' && currentDogId) {
      return `/app/dogs/${currentDogId}`;
    }
    if (base === '/app/dogs' && !currentDogId) {
      return '/app/dogs/new';
    }
    return base;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur-xl safe-area-pb md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const resolvedHref = getHref(href);
          const isActive = pathname.startsWith(resolvedHref);

          return (
            <Link
              key={href}
              href={resolvedHref}
              className={cn(
                'relative flex min-w-[72px] flex-col items-center gap-1 px-4 py-3 transition-all duration-200',
                isActive ? 'text-primary' : 'text-text-muted'
              )}
            >
              <Icon
                size={22}
                className={cn(
                  'transition-all duration-200',
                  isActive ? 'scale-110' : 'scale-100'
                )}
              />
              <span className={cn('text-[10px] font-medium', isActive ? 'text-primary' : 'text-text-muted')}>
                {label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-indicator"
                  className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
