-- ============================================================================
-- COMPLETE FIX: adofom_news RLS Policies
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and click RUN
-- ============================================================================

-- Step 1: Drop ALL existing policies on adofom_news (clean slate)
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname FROM pg_policies WHERE tablename = 'adofom_news'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON adofom_news', pol.policyname);
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled on the table
ALTER TABLE adofom_news ENABLE ROW LEVEL SECURITY;

-- Step 3: Ensure the image_url column exists
ALTER TABLE adofom_news ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;

-- Step 4: Allow ALL authenticated users to READ news (everyone can see news)
CREATE POLICY "Anyone can read news"
  ON adofom_news FOR SELECT
  TO authenticated
  USING (true);

-- Step 5: Allow Admins and PROs to INSERT news
CREATE POLICY "Admins and PROs can insert news"
  ON adofom_news FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        LOWER(exco_portfolio) LIKE '%pro%' OR
        LOWER(exco_portfolio) LIKE '%p.r.o%' OR
        LOWER(exco_portfolio) LIKE '%public relations%'
      )
    )
  );

-- Step 6: Allow Admins and PROs to UPDATE news
CREATE POLICY "Admins and PROs can update news"
  ON adofom_news FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        LOWER(exco_portfolio) LIKE '%pro%' OR
        LOWER(exco_portfolio) LIKE '%p.r.o%' OR
        LOWER(exco_portfolio) LIKE '%public relations%'
      )
    )
  );

-- Step 7: Allow Admins and PROs to DELETE news
CREATE POLICY "Admins and PROs can delete news"
  ON adofom_news FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM administrative_officers
      WHERE id = auth.uid() AND (
        is_admin = true OR
        LOWER(exco_portfolio) LIKE '%pro%' OR
        LOWER(exco_portfolio) LIKE '%p.r.o%' OR
        LOWER(exco_portfolio) LIKE '%public relations%'
      )
    )
  );

-- Step 8: Verify your admin account has is_admin = true
-- (Uncomment and replace with your email to check)
-- SELECT id, full_name, email_address, is_admin, exco_portfolio
-- FROM administrative_officers
-- WHERE LOWER(email_address) = LOWER('your_email@example.com');

-- ============================================================================
-- DONE! If you still can't publish, run the query in Step 8 above
-- to confirm your account has is_admin = true. If it shows false or NULL, run:
--
--   UPDATE administrative_officers
--   SET is_admin = true
--   WHERE LOWER(email_address) = LOWER('your_email@example.com');
--
-- ============================================================================
