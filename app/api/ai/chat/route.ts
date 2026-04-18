import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/ai/rate-limit';
import { buildDogContext, formatDogContextString, formatEventsContextString } from '@/lib/ai/context';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { chat } from '@/lib/ai/client';
import { chatRequestSchema } from '@/lib/schemas/chat';


export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { dogId, threadId: existingThreadId, message } = parsed.data;

    // Rate limit check
    const rateResult = await checkRateLimit(user.id);
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: rateResult.reason ?? 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Verify dog ownership
    const { data: dog } = await supabase
      .from('dogs')
      .select('id')
      .eq('id', dogId)
      .eq('owner_id', user.id)
      .single();

    if (!dog) {
      return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
    }

    // Get or create thread
    let threadId = existingThreadId;
    if (!threadId) {
      const { data: newThread, error: threadError } = await supabase
        .from('chat_threads')
        .insert({ dog_id: dogId })
        .select('id')
        .single();

      if (threadError || !newThread) {
        console.error('Thread creation error:', threadError);
        return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
      }
      threadId = newThread.id;
    }

    // Load existing messages (last 10)
    const { data: existingMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('thread_id', threadId)
      .neq('role', 'system')
      .order('created_at', { ascending: false })
      .limit(10);

    const conversationHistory = (existingMessages ?? [])
      .reverse()
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    // Build dog context
    const dogContext = await buildDogContext(dogId);
    const dogContextStr = dogContext ? formatDogContextString(dogContext) : 'Данные недоступны';
    const eventsContextStr = dogContext ? formatEventsContextString(dogContext) : 'Нет данных';

    // Build system prompt
    const systemPrompt = buildSystemPrompt(dogContextStr, eventsContextStr);

    // Add user message to history
    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: message },
    ];

    // Call OpenAI
    const { content: assistantContent, usage } = await chat(systemPrompt, messages);

    // Save user message
    await supabase.from('chat_messages').insert({
      thread_id: threadId,
      role: 'user',
      content: message,
      meta: { dog_snapshot: dogContext?.dog ?? null },
    });

    // Save assistant message
    await supabase.from('chat_messages').insert({
      thread_id: threadId,
      role: 'assistant',
      content: assistantContent,
      meta: {
        model: 'gpt-4o-mini',
        input_tokens: usage.input,
        output_tokens: usage.output,
        dog_snapshot: dogContext?.dog ?? null,
      },
    });

    return NextResponse.json({
      assistantMessage: assistantContent,
      threadId,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
