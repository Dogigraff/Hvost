import { BottomNav } from '@/components/features/bottom-nav/bottom-nav';
import { MobileHeader } from './mobile-header';
import { Sidebar, type AppShellDog, type AppShellProfile, type AppShellUser } from './sidebar';

export type { AppShellDog, AppShellProfile, AppShellUser };

type AppShellProps = {
  children: React.ReactNode;
  dogs: AppShellDog[];
  user: AppShellUser;
  profile: AppShellProfile;
};

export function AppShell({ children, dogs, user, profile }: AppShellProps) {
  const firstDogId = dogs[0]?.id;

  return (
    <div className="min-h-dvh bg-bg md:grid md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar
        dogs={dogs}
        user={user}
        profile={profile}
        className="hidden md:flex"
      />
      <div className="flex min-h-dvh min-w-0 flex-col md:col-start-2">
        <MobileHeader dogs={dogs} user={user} profile={profile} />
        <main className="flex min-h-0 flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col min-h-0 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-8">
            {children}
          </div>
        </main>
        <BottomNav currentDogId={firstDogId} />
      </div>
    </div>
  );
}
