-- CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- Ensure schema exists
-- CREATE SCHEMA IF NOT EXISTS knowledge_graph_1;

-- Set search path for this session
-- SET search_path TO knowledge_graph_1;

CREATE TABLE IF NOT EXISTS topic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS topic_edge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES topic(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES topic(id) ON DELETE CASCADE,
  score REAL NOT NULL CHECK (score >= 0 AND score <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_edge_source ON topic_edge(source_id);
CREATE INDEX IF NOT EXISTS idx_edge_target ON topic_edge(target_id);
