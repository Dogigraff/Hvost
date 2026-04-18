export type EventType = 'vaccine' | 'tick_pill' | 'deworming' | 'grooming' | 'procedure' | 'other';
export type EventStatus = 'planned' | 'done' | 'missed';
export type ChatRole = 'user' | 'assistant' | 'system';

export interface Profile {
  id: string;
  created_at: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface Dog {
  id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  photo_path: string | null;
  breed: string | null;
  sex: string | null;
  birth_date: string | null;
  weight_kg: number | null;
  features: string | null;
  notes: string | null;
}

export interface Event {
  id: string;
  dog_id: string;
  created_at: string;
  updated_at: string;
  type: EventType;
  title: string;
  starts_at: string;
  status: EventStatus;
  done_at: string | null;
  missed_at: string | null;
  remind_at: string | null;
  notes: string | null;
}

export interface ChatThread {
  id: string;
  dog_id: string;
  created_at: string;
  title: string | null;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  created_at: string;
  role: ChatRole;
  content: string;
  meta: Record<string, unknown>;
}
