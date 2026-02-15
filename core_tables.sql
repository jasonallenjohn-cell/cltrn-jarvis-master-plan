-- Enable pgvector extension
create extension if not exists vector;

-- 1. K0RE Scores Table
create table if not exists kore_scores (
  user_id uuid references auth.users(id) on delete cascade primary key,
  financial_mastery integer default 0 check (financial_mastery between 0 and 100),
  business_growth integer default 0 check (business_growth between 0 and 100),
  health_vitality integer default 0 check (health_vitality between 0 and 100),
  relationships integer default 0 check (relationships between 0 and 100),
  personal_development integer default 0 check (personal_development between 0 and 100),
  spiritual_alignment integer default 0 check (spiritual_alignment between 0 and 100),
  overall_score integer generated always as (
    (financial_mastery + business_growth + health_vitality + relationships + personal_development + spiritual_alignment) / 6
  ) stored,
  updated_at timestamptz default now()
);

-- 2. K0RE Score Snapshots (for trend analysis)
create table if not exists kore_score_snapshots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date default current_date not null,
  financial_mastery integer not null,
  business_growth integer not null,
  health_vitality integer not null,
  relationships integer not null,
  personal_development integer not null,
  spiritual_alignment integer not null,
  overall_score integer not null,
  created_at timestamptz default now(),
  unique(user_id, date)
);

-- 3. Persistent Memories (with pgvector)
create type memory_type as enum ('explicit', 'observed', 'derived');

create table if not exists memories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  embedding vector(1536), -- for OpenAI text-embedding-ada-002 or text-embedding-3-small
  type memory_type default 'explicit',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Create index for vector similarity search
create index on memories using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Enable RLS
alter table kore_scores enable row level security;
alter table kore_score_snapshots enable row level security;
alter table memories enable row level security;

-- RLS Policies

-- Scores: Users can view their own scores
create policy "Users can view own scores"
  on kore_scores for select
  using (auth.uid() = user_id);

-- Scores: Service role (admin/AI) can update scores
create policy "Service role can update scores"
  on kore_scores for all
  using (true)
  with check (true);

-- Snapshots: Users can view own history
create policy "Users can view own score history"
  on kore_score_snapshots for select
  using (auth.uid() = user_id);

-- Memories: Users can view own memories
create policy "Users can view own memories"
  on memories for select
  using (auth.uid() = user_id);

-- Memories: Service role can manage memories
create policy "Service role can manage memories"
  on memories for all
  using (true)
  with check (true);
