'use client';

import { useState } from 'react';
import { EventList } from '@/components/features/event-list/event-list';
import { cn } from '@/lib/utils/cn';
import type { Event } from '@/lib/supabase/types';

interface DogTabsProps {
  plannedEvents: Event[];
  historyEvents: Event[];
}

export function DogTabs({ plannedEvents, historyEvents }: DogTabsProps) {
  const [activeTab, setActiveTab] = useState<'planned' | 'history'>('planned');
  const [periodDays, setPeriodDays] = useState<7 | 30 | 90>(30);

  return (
    <div className="px-5">
      {/* Tab headers */}
      <div className="mb-4 flex rounded-full border border-border bg-surface p-1">
        <button
          onClick={() => setActiveTab('planned')}
          className={cn(
            'flex-1 rounded-full py-2 text-sm font-semibold transition-all',
            activeTab === 'planned' ? 'bg-primary text-primary-fg shadow-sm' : 'text-text-muted'
          )}
        >
          События
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex-1 rounded-full py-2 text-sm font-semibold transition-all',
            activeTab === 'history' ? 'bg-primary text-primary-fg shadow-sm' : 'text-text-muted'
          )}
        >
          История
        </button>
      </div>

      {activeTab === 'planned' && (
        <EventList events={plannedEvents} mode="planned" />
      )}
      {activeTab === 'history' && (
        <EventList
          events={historyEvents}
          mode="history"
          periodDays={periodDays}
          onPeriodChange={setPeriodDays}
        />
      )}
    </div>
  );
}
