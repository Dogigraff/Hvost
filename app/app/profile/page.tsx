import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnimatedBlock } from '@/components/ui/animated';
import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <AnimatedBlock className="pb-4 pt-2">
        <h1 className="font-heading text-2xl font-extrabold text-text">Профиль</h1>
      </AnimatedBlock>
      <ProfileForm
        userId={user.id}
        email={user.email ?? ''}
        displayName={profile?.display_name ?? ''}
        avatarUrl={profile?.avatar_url ?? null}
      />
    </div>
  );
}
