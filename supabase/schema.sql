-- ELMADHI database schema
-- Run in the Supabase SQL editor (or via the CLI) to provision the platform.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles — user accounts (linked to Supabase auth)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text unique,
  gender text check (gender in ('male', 'female')),
  age int check (age between 10 and 100),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- assessment_results — onboarding assessment outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  goal text not null,
  result_type text not null check (result_type in ('Cut', 'Build', 'Recomp')),
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- question_submissions — community Q&A suggestions ("suggest a question")
-- ---------------------------------------------------------------------------
create table if not exists public.question_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  question text not null,
  status text not null default 'pending' check (status in ('pending', 'answered', 'archived')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- private_questions — the "10 personal questions" feature
-- ---------------------------------------------------------------------------
create table if not exists public.private_questions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  question text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- waitlist — pre-launch signups (primary conversion goal)
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  gender text not null check (gender in ('male', 'female')),
  age int check (age between 10 and 100),
  goal text not null check (goal in ('fat_loss', 'muscle_gain', 'fitness', 'recomposition')),
  created_at timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.assessment_results enable row level security;
alter table public.question_submissions enable row level security;
alter table public.private_questions enable row level security;
alter table public.waitlist enable row level security;

-- Anyone (anon) may join the waitlist, but nobody can read it from the client.
drop policy if exists "waitlist_public_insert" on public.waitlist;
create policy "waitlist_public_insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Profiles: users manage their own row.
drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self"
  on public.profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Assessment results / private questions: scoped to the owner.
drop policy if exists "assessment_owner" on public.assessment_results;
create policy "assessment_owner"
  on public.assessment_results for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "private_questions_owner" on public.private_questions;
create policy "private_questions_owner"
  on public.private_questions for all
  to authenticated
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Question submissions: anyone can suggest a question.
drop policy if exists "question_submissions_insert" on public.question_submissions;
create policy "question_submissions_insert"
  on public.question_submissions for insert
  to anon, authenticated
  with check (true);
