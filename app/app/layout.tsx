import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell, type AppShellDog } from '@/components/layout/app-shell';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: dogsRows } = await supabase
    .from('dogs')
    .select('id, name, photo_path')
    .eq('owner_id', user.id)
    .order('created_at');

  const dogs: AppShellDog[] = [];
  if (dogsRows) {
    for (const dog of dogsRows) {
      let photoUrl: string | null = null;
      if (dog.photo_path) {
        const { data } = await supabase.storage.from('dog-photos').createSignedUrl(dog.photo_path, 3600);
        if (data?.signedUrl) photoUrl = data.signedUrl;
      }
      dogs.push({ id: dog.id, name: dog.name, photoUrl });
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <AppShell
      dogs={dogs}
      user={{ id: user.id, email: user.email ?? null }}
      profile={{
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
