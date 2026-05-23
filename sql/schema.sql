-- 1) Enable pgvector
create extension if not exists vector;

-- 2) Create the jobs table.
-- The embedding column matches our 768-dim Gemini embeddings.
create table if not exists jobs (
    job_id text primary key,
    title text not null,
    company text not null,
    location text,
    remote boolean default false,
    employment_type text,
    description text,
    required_skills text[] default '{}',
    nice_to_have_skills text[] default '{}',
    required_experience_years float,
    seniority text,
    apply_link text,
    posted_date text,
    source text default 'jsearch',
    job_json jsonb not null,            -- full normalized Job model
    embedding vector(768) not null,
    inserted_at timestamptz default now()
);

-- 3) HNSW index for cosine similarity.
-- The vector_cosine_ops operator class enforces cosine distance.
create index if not exists jobs_embedding_hnsw_idx
    on jobs
    using hnsw (embedding vector_cosine_ops);

-- 4) RPC function used by the Python client.
-- Returns the top-N most similar jobs by cosine similarity.
-- similarity = 1 - cosine_distance (so 1.0 = identical, 0.0 = orthogonal).
create or replace function match_jobs(
    query_embedding vector(768),
    match_count int default 20,
    filter_remote boolean default null,
    filter_seniority text default null
)
returns table (
    job_id text,
    similarity float,
    job_json jsonb
)
language sql stable
as $$
    select
        j.job_id,
        1 - (j.embedding <=> query_embedding) as similarity,
        j.job_json
    from jobs j
    where
        (filter_remote is null or j.remote = filter_remote)
        and (filter_seniority is null or j.seniority = filter_seniority)
    order by j.embedding <=> query_embedding
    limit match_count;
$$;
