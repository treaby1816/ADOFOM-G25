-- ============================================================================
-- Phase 2 & 3: Exco Leadership + News Feed Migration
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PHASE 2: Add exco_portfolio column to administrative_officers
-- ============================================================================
ALTER TABLE administrative_officers
ADD COLUMN IF NOT EXISTS exco_portfolio TEXT DEFAULT NULL;

-- ============================================================================
-- PHASE 3: Create adofom_news table for news/announcements
-- ============================================================================
CREATE TABLE IF NOT EXISTS adofom_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',  -- general | event | announcement | update
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'ADOFOM Admin',
  is_published BOOLEAN NOT NULL DEFAULT true,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for fast queries
CREATE INDEX IF NOT EXISTS idx_adofom_news_created_at ON adofom_news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adofom_news_category ON adofom_news(category);
CREATE INDEX IF NOT EXISTS idx_adofom_news_pinned ON adofom_news(pinned);

-- ============================================================================
-- RLS Policies for adofom_news
-- ============================================================================
ALTER TABLE adofom_news ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read published news
CREATE POLICY "Authenticated users can read published news"
  ON adofom_news FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Only admins can insert news
CREATE POLICY "Admins can insert news"
  ON adofom_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can update news
CREATE POLICY "Admins can update news"
  ON adofom_news FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Only admins can delete news
CREATE POLICY "Admins can delete news"
  ON adofom_news FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================================
-- Auto-update the updated_at timestamp on adofom_news
-- ============================================================================
CREATE OR REPLACE FUNCTION update_adofom_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_adofom_news_updated_at
  BEFORE UPDATE ON adofom_news
  FOR EACH ROW
  EXECUTE FUNCTION update_adofom_news_updated_at();
