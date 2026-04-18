import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

import { EventFormPage } from './event-form-page';

interface Props {
  params: { dogId: string };
}

export default async function NewEventPage({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: dog } = await supabase
    .from('dogs')
    .select('id, name')
    .eq('id', params.dogId)
    .eq('owner_id', user.id)
    .single();

  if (!dog) notFound();

  return <EventFormPage dogId={dog.id} dogName={dog.name} />;
}
