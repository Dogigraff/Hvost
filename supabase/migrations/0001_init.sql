-- =============================================================
-- «Хвост» MVP v1.0 — полная схема БД
-- =============================================================

-- ENUMS
create type public.event_type as enum (
  'vaccine',
  'tick_pill',
  'deworming',
  'grooming',
  'procedure',
  'other'
);

create type public.event_status as enum (
  'planned',
  'done',
  'missed'
);

create type public.chat_role as enum (
  'user',
  'assistant',
  'system'
);

-- TABLES

-- profiles (1:1 с auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  display_name text,
  avatar_url  text
);

-- dogs
create table public.dogs (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  photo_path  text,
  breed       text,
  sex         text,
  birth_date  date,
  weight_kg   numeric(5,2),
  features    text,
  notes       text
);

-- events
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  dog_id      uuid not null references public.dogs(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  type        public.event_type not null,
  title       text not null,
  starts_at   timestamptz not null,
  status      public.event_status not null default 'planned',
  done_at     timestamptz,
  missed_at   timestamptz,
  remind_at   timestamptz,
  notes       text
);

-- chat_threads
create table public.chat_threads (
  id          uuid primary key default gen_random_uuid(),
  dog_id      uuid not null references public.dogs(id) on delete cascade,
  created_at  timestamptz not null default now(),
  title       text
);

-- chat_messages
create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.chat_threads(id) on delete cascade,
  created_at  timestamptz not null default now(),
  role        public.chat_role not null,
  content     text not null,
  meta        jsonb not null default '{}'::jsonb
);

-- INDEXES
create index dogs_owner_created_idx on public.dogs (owner_id, created_at desc);
create index events_dog_starts_idx on public.events (dog_id, starts_at asc);
create index events_planned_idx on public.events (dog_id, starts_at asc) where status = 'planned';
create index chat_messages_thread_created_idx on public.chat_messages (thread_id, created_at asc);

-- TRIGGERS

-- auto-создание profile при регистрации
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger dogs_set_updated_at
  before update on public.dogs
  for each row execute function public.set_updated_at();

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- RLS

-- profiles
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

-- dogs
alter table public.dogs enable row level security;

create policy "dogs_all_own" on public.dogs
  for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- events
alter table public.events enable row level security;

create policy "events_all_via_dog" on public.events
  for all
  using (
    exists (select 1 from public.dogs d where d.id = events.dog_id and d.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.dogs d where d.id = events.dog_id and d.owner_id = auth.uid())
  );

-- chat_threads
alter table public.chat_threads enable row level security;

create policy "chat_threads_all_via_dog" on public.chat_threads
  for all
  using (
    exists (select 1 from public.dogs d where d.id = chat_threads.dog_id and d.owner_id = auth.uid())
  )
  with check (
    exists (select 1 from public.dogs d where d.id = chat_threads.dog_id and d.owner_id = auth.uid())
  );

-- chat_messages
alter table public.chat_messages enable row level security;

create policy "chat_messages_all_via_thread" on public.chat_messages
  for all
  using (
    exists (
      select 1 from public.chat_threads t
      join public.dogs d on d.id = t.dog_id
      where t.id = chat_messages.thread_id and d.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_threads t
      join public.dogs d on d.id = t.dog_id
      where t.id = chat_messages.thread_id and d.owner_id = auth.uid()
    )
  );

-- STORAGE POLICIES для bucket dog-photos
create policy "dog_photos_select_own" on storage.objects
  for select using (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "dog_photos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "dog_photos_update_own" on storage.objects
  for update using (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "dog_photos_delete_own" on storage.objects
  for delete using (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
