'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function DogDeleteButton({ dogId }: { dogId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('dogs').delete().eq('id', dogId);
      if (error) throw error;
      toast.success('Питомец удалён');
      router.push('/app');
      router.refresh();
    } catch {
      toast.error('Не удалось удалить питомца');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Удалить питомца">
        <p className="text-text-muted mb-6">
          Вы уверены? Все данные питомца, события и история чата будут удалены безвозвратно.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={handleDelete}>
            Удалить
          </Button>
        </div>
      </Dialog>
    </>
  );
}
