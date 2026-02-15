-- RPC for vector similarity search
create or replace function match_memories (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id uuid
)
returns table (
  id uuid,
  user_id uuid,
  content text,
  type memory_type,
  metadata jsonb,
  created_at timestamptz,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    m.id,
    m.user_id,
    m.content,
    m.type,
    m.metadata,
    m.created_at,
    1 - (m.embedding <=> query_embedding) as similarity
  from memories m
  where m.user_id = filter_user_id
  and 1 - (m.embedding <=> query_embedding) > match_threshold
  order by m.embedding <=> query_embedding
  limit match_count;
end;
$$;
