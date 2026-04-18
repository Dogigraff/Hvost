'use client';

import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface FabProps {
  onClick: () => void;
  className?: string;
}

export function Fab({ onClick, className }: FabProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Добавить событие"
      className={cn(
        'fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-all duration-150 hover:bg-primary-hover active:scale-95',
        className
      )}
    >
      <motion.span whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
        <Plus size={26} strokeWidth={2.5} />
      </motion.span>
    </button>
  );
}
