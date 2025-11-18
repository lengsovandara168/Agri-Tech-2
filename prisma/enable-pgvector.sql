-- Enable pgvector extension for embeddings support
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/vcfbhjzvucfruskclrid/sql

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is enabled
SELECT * FROM pg_extension WHERE extname = 'vector';
