'use client';

import { useState, useRef, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils/cn';
import type { ChatMessage } from '@/lib/supabase/types';

const QUICK_TIPS = [
  'Что ему нельзя есть?',
  'Когда следующая прививка?',
  'Как понять, что пора к ветеринару?',
];

interface ChatInterfaceProps {
  dogId: string;
  initialMessages?: ChatMessage[];
  initialThreadId?: string;
}

export function ChatInterface({ dogId, initialMessages = [], initialThreadId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      thread_id: threadId ?? '',
      created_at: new Date().toISOString(),
      role: 'user',
      content: text.trim(),
      meta: {},
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dogId, threadId, message: text.trim() }),
      });

      if (res.status === 429) {
        toast.error('Превышен лимит запросов. Попробуйте позже.');
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error('AI request failed');

      const data: { assistantMessage: string; threadId: string } = await res.json();
      setThreadId(data.threadId);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        thread_id: data.threadId,
        created_at: new Date().toISOString(),
        role: 'assistant',
        content: data.assistantMessage,
        meta: {},
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      toast.error('Произошла ошибка. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🐾</span>
            </div>
            <h3 className="font-semibold text-text text-lg mb-1">Хвост-Помощник</h3>
            <p className="text-text-muted text-sm max-w-xs">
              Задайте любой вопрос о вашем питомце. Я помогу разобраться!
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            {msg.role === 'assistant' && (
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg">
                <PawPrint size={14} />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-primary text-primary-fg'
                  : 'rounded-bl-sm border border-border bg-surface text-text'
              )}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-headings:text-text prose-p:text-text prose-li:text-text prose-strong:text-text">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg">
              <PawPrint size={14} />
            </div>
            <div className="rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-xs">Хвост думает...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Tips */}
      {messages.length === 0 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {QUICK_TIPS.map((tip) => (
            <button
              key={tip}
              onClick={() => sendMessage(tip)}
              className="flex-shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {tip}
            </button>
          ))}
        </div>
      )}

      {/* Input — stays at bottom of chat column (main area), not viewport */}
      <div className="sticky bottom-0 shrink-0 border-t border-border bg-surface px-4 pb-4 pt-2">
        <div className="flex items-end gap-3 rounded-full border-2 border-border bg-surface px-4 py-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите о вашем питомце..."
            rows={1}
            className="flex-1 bg-transparent resize-none focus:outline-none text-sm text-text placeholder:text-text-muted max-h-32"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-40"
          >
            <PawPrint size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
