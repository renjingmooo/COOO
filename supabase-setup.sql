-- Create the private-album bucket in Supabase Storage and keep it PRIVATE.
-- This table is read only by the unlock-album Edge Function using the server secret key.
create table if not exists public.private_memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  place text not null default '',
  date date not null,
  story text not null default '',
  media jsonb not null default '[]'::jsonb
);

alter table public.private_memories enable row level security;
revoke all on public.private_memories from anon, authenticated;
grant all on public.private_memories to service_role;
