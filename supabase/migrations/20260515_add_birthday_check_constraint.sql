-- Migration: Add CHECK constraint for birth_month_day column
-- Purpose: Ensures that birth_month_day values match either the new "Month/Day" format
--          (e.g., "May/27", "January/3") or the legacy "MM-DD" numeric format (e.g., "05-27").
--          Also allows empty strings and NULLs for officers who haven't set their birthday yet.
--
-- Author: ADOFOM Admin Directory System
-- Date: 2026-05-15

BEGIN;

-- Drop the constraint if it already exists (safe re-run)
ALTER TABLE administrative_officers
  DROP CONSTRAINT IF EXISTS chk_birth_month_day_format;

-- Add the CHECK constraint
-- Accepts:
--   NULL or empty string (birthday not yet set)
--   "Month/Day" format: Full month name / 1-31 day number
--   "MM-DD" legacy format: 01-31 month-day numeric
ALTER TABLE administrative_officers
  ADD CONSTRAINT chk_birth_month_day_format CHECK (
    birth_month_day IS NULL
    OR birth_month_day = ''
    OR birth_month_day ~ '^(January|February|March|April|May|June|July|August|September|October|November|December)\/(3[01]|[12][0-9]|[1-9])$'
    OR birth_month_day ~ '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$'
  );

COMMENT ON CONSTRAINT chk_birth_month_day_format ON administrative_officers IS
  'Validates birth_month_day is either Month/Day format (e.g. May/27) or legacy MM-DD format (e.g. 05-27). NULLs and empty strings are allowed.';

COMMIT;
