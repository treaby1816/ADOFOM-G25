-- ============================================================
-- ADOFOM Portal: Phase 1 — Database & Admin Bootstrap
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================
-- 1b. Security State Column
-- ============================================
ALTER TABLE public.administrative_officers
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT true;

-- ============================================
-- 1a. Felix Bootstrap (Satisfies ALL NOT-NULL constraints)
-- ============================================
INSERT INTO public.administrative_officers (
  id,
  email_address,
  full_name,
  phone_number,
  birth_month_day,
  is_approved,
  is_admin,
  current_mda,
  grade_level,
  lga,
  must_change_password
)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'felixadewole16@gmail.com'),
  'felixadewole16@gmail.com',
  'ADEWOLE, Felix Bamidele',
  '08065136221',
  '05-27',
  true,
  true,
  'Service Matters Department',
  'GL 10',
  'Ondo West',
  false
)
ON CONFLICT (id) DO UPDATE SET
  is_approved = true,
  is_admin = true,
  phone_number = '08065136221',
  birth_month_day = '05-27',
  current_mda = 'Service Matters Department',
  grade_level = 'GL 10',
  lga = 'Ondo West',
  must_change_password = false;

-- ============================================
-- 1c. Row Level Security Policies
-- ============================================

-- Enable RLS on the table
ALTER TABLE public.administrative_officers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (safe re-run)
DROP POLICY IF EXISTS "Approved users can view directory" ON public.administrative_officers;
DROP POLICY IF EXISTS "Admins can view all" ON public.administrative_officers;
DROP POLICY IF EXISTS "Users can update own profile" ON public.administrative_officers;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.administrative_officers;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.administrative_officers;

-- SELECT: Approved users can view all rows
CREATE POLICY "Approved users can view directory"
ON public.administrative_officers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.administrative_officers ao
    WHERE ao.id = auth.uid() AND ao.is_approved = true
  )
);

-- SELECT: Admins can view all profiles (including unapproved, for admin panel)
CREATE POLICY "Admins can view all"
ON public.administrative_officers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.administrative_officers ao
    WHERE ao.id = auth.uid() AND ao.is_admin = true
  )
);

-- UPDATE: Users can update their own row
CREATE POLICY "Users can update own profile"
ON public.administrative_officers FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- INSERT: Users can insert their own row (signup registration)
CREATE POLICY "Users can insert own profile"
ON public.administrative_officers FOR INSERT
WITH CHECK (id = auth.uid());

-- UPDATE: Admins can update any row (for approvals)
CREATE POLICY "Admins can update any profile"
ON public.administrative_officers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.administrative_officers ao
    WHERE ao.id = auth.uid() AND ao.is_admin = true
  )
);

-- ============================================
-- Verification: Check Felix's row
-- ============================================
SELECT id, email_address, full_name, is_approved, is_admin, must_change_password
FROM public.administrative_officers
WHERE email_address = 'felixadewole16@gmail.com';
