-- ============================================================================
-- Add image_url column to adofom_news table
-- Run this in your Supabase SQL Editor
-- ============================================================================

ALTER TABLE adofom_news
ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;
