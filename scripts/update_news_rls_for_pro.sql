-- ============================================================================
-- Update RLS Policies for adofom_news to allow PRO access
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Drop the old policies
DROP POLICY IF EXISTS "Admins can insert news" ON adofom_news;
DROP POLICY IF EXISTS "Admins can update news" ON adofom_news;
DROP POLICY IF EXISTS "Admins can delete news" ON adofom_news;

-- Recreate policies allowing both Admins AND PROs

-- Allow admins and PROs to insert news
CREATE POLICY "Admins and PROs can insert news"
  ON adofom_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        exco_portfolio ILIKE '%PRO%' OR
        exco_portfolio ILIKE '%P.R.O%' OR
        exco_portfolio ILIKE '%PUBLIC RELATIONS%'
      )
    )
  );

-- Allow admins and PROs to update news
CREATE POLICY "Admins and PROs can update news"
  ON adofom_news FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        exco_portfolio ILIKE '%PRO%' OR
        exco_portfolio ILIKE '%P.R.O%' OR
        exco_portfolio ILIKE '%PUBLIC RELATIONS%'
      )
    )
  );

-- Allow admins and PROs to delete news
CREATE POLICY "Admins and PROs can delete news"
  ON adofom_news FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        exco_portfolio ILIKE '%PRO%' OR
        exco_portfolio ILIKE '%P.R.O%' OR
        exco_portfolio ILIKE '%PUBLIC RELATIONS%'
      )
    )
  );
