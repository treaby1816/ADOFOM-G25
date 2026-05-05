-- ============================================================================
-- Add linkedin_url column to administrative_officers table
-- Run this in your Supabase SQL Editor
-- ============================================================================

ALTER TABLE administrative_officers
ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT NULL;
