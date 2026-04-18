import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DogForm } from '@/components/features/dog-card/dog-form';

interface Props {
  params: { dogId: string };
}

export default async function EditDogPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: dog } = await supabase
    .from('dogs')
    .select('*')
    .eq('id', params.dogId)
    .eq('owner_id', user.id)
    .single();

  if (!dog) notFound();

  let currentPhotoUrl: string | null = null;
  if (dog.photo_path) {
    const { data } = await supabase.storage
      .from('dog-photos')
      .createSignedUrl(dog.photo_path, 3600);
    currentPhotoUrl = data?.signedUrl ?? null;
  }

  return (
    <div className="flex flex-col">
      <div className="pb-4 pt-2">
        <h1 className="font-heading font-bold text-2xl text-text">Редактировать</h1>
        <p className="mt-1 text-sm text-text-muted">{dog.name}</p>
      </div>
      <DogForm dog={dog} ownerId={user.id} currentPhotoUrl={currentPhotoUrl} />
    </div>
  );
}
