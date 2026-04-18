import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatInterface } from '@/components/features/chat/chat-interface';

interface Props {
  params: { dogId: string };
}

export default async function ChatPage({ params }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: dog } = await supabase
    .from('dogs')
    .select('id, name')
    .eq('id', params.dogId)
    .eq('owner_id', user.id)
    .single();

  if (!dog) notFound();

  const { data: thread } = await supabase
    .from('chat_threads')
    .select('id')
    .eq('dog_id', dog.id)
    .order('created_at')
    .limit(1)
    .maybeSingle();

  let messages = [];
  if (thread) {
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('thread_id', thread.id)
      .neq('role', 'system')
      .order('created_at', { ascending: true })
      .limit(50);
    messages = msgs ?? [];
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-3 text-center text-sm text-text-muted md:mb-4">
        <span className="font-heading font-semibold text-text">{dog.name}</span>
        {' · '}
        Хвост-Помощник
      </p>
      <div className="flex min-h-0 min-h-[50dvh] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface/50 md:min-h-[420px]">
        <ChatInterface dogId={dog.id} initialMessages={messages} initialThreadId={thread?.id} />
      </div>
    </div>
  );
}
