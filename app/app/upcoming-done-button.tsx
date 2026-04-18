'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function UpcomingDoneButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDone = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('events')
        .update({ status: 'done', done_at: new Date().toISOString() })
        .eq('id', eventId);
      if (error) throw error;
      toast.success('Выполнено! 🎉');
      router.refresh();
    } catch {
      toast.error('Не удалось обновить событие');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDone}
      disabled={loading}
      className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-bold rounded-[14px] hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-60 shadow-sm flex-shrink-0"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Check size={16} />
      )}
      Готово
    </button>
  );
}
