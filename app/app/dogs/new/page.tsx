import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DogForm } from '@/components/features/dog-card/dog-form';

export default async function NewDogPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  return (
    <div className="flex flex-col">
      <div className="pb-4 pt-2">
        <h1 className="font-heading font-bold text-2xl text-text">Новый питомец</h1>
        <p className="mt-1 text-sm text-text-muted">Заполните информацию о вашей собаке</p>
      </div>
      <DogForm ownerId={user.id} />
    </div>
  );
}
