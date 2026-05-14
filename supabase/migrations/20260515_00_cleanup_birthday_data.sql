-- ============================================================================
-- Migration: Clean up birth_month_day data to canonical "Month/Day" format
-- Purpose:   Normalize ALL existing birthday formats before applying the
--            CHECK constraint. Must run BEFORE 20260515_add_birthday_check_constraint.sql
--
-- Format conversions:
--   "8/16"        → "August/16"       (M/D numeric → Month/Day)
--   "26/09/1986"  → "September/26"    (DD/MM/YYYY full dates)
--   "May-27"      → "May/27"          (Mon-DD with hyphen)
--   "27-7-1991"   → "July/27"         (DD-M-YYYY)
--   "29/05"       → "May/29"          (DD/MM reversed)
--   "05-14"       → "May/14"          (MM-DD legacy numeric)
--
-- Author: ADOFOM Admin Directory System
-- Date: 2026-05-15
-- ============================================================================

BEGIN;

-- ──────────────────────────────────────────────────────────────────
-- STEP 1: Convert M/D numeric format where month ≤ 12
-- Examples: "8/16" → "August/16", "5/27" → "May/27", "10/18" → "October/18"
-- Pattern: one or two digit number / one or two digit number (no year)
-- Only matches when the first number is a valid month (1-12)
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day =
  CASE (split_part(birth_month_day, '/', 1))::int
    WHEN 1  THEN 'January'
    WHEN 2  THEN 'February'
    WHEN 3  THEN 'March'
    WHEN 4  THEN 'April'
    WHEN 5  THEN 'May'
    WHEN 6  THEN 'June'
    WHEN 7  THEN 'July'
    WHEN 8  THEN 'August'
    WHEN 9  THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END || '/' || (split_part(birth_month_day, '/', 2))::int
WHERE birth_month_day ~ '^\d{1,2}/\d{1,2}$'
  AND (split_part(birth_month_day, '/', 1))::int BETWEEN 1 AND 12
  AND (split_part(birth_month_day, '/', 2))::int BETWEEN 1 AND 31;

-- ──────────────────────────────────────────────────────────────────
-- STEP 2: Convert DD/MM format where day > 12 (unambiguously day-first)
-- Example: "29/05" → "May/29"
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day =
  CASE (split_part(birth_month_day, '/', 2))::int
    WHEN 1  THEN 'January'
    WHEN 2  THEN 'February'
    WHEN 3  THEN 'March'
    WHEN 4  THEN 'April'
    WHEN 5  THEN 'May'
    WHEN 6  THEN 'June'
    WHEN 7  THEN 'July'
    WHEN 8  THEN 'August'
    WHEN 9  THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END || '/' || (split_part(birth_month_day, '/', 1))::int
WHERE birth_month_day ~ '^\d{1,2}/\d{1,2}$'
  AND (split_part(birth_month_day, '/', 1))::int > 12
  AND (split_part(birth_month_day, '/', 2))::int BETWEEN 1 AND 12;

-- ──────────────────────────────────────────────────────────────────
-- STEP 3: Convert DD/MM/YYYY full date format (Nigerian date convention)
-- Examples: "26/09/1986" → "September/26", "08/01/1995" → "January/8"
-- Pattern: DD/MM/YYYY where first part is day, second is month
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day =
  CASE (split_part(birth_month_day, '/', 2))::int
    WHEN 1  THEN 'January'
    WHEN 2  THEN 'February'
    WHEN 3  THEN 'March'
    WHEN 4  THEN 'April'
    WHEN 5  THEN 'May'
    WHEN 6  THEN 'June'
    WHEN 7  THEN 'July'
    WHEN 8  THEN 'August'
    WHEN 9  THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END || '/' || (split_part(birth_month_day, '/', 1))::int
WHERE birth_month_day ~ '^\d{2}/\d{2}/\d{4}$'
  AND (split_part(birth_month_day, '/', 2))::int BETWEEN 1 AND 12;

-- ──────────────────────────────────────────────────────────────────
-- STEP 4: Convert DD-M-YYYY or DD-MM-YYYY hyphenated full dates
-- Example: "27-7-1991" → "July/27"
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day =
  CASE (split_part(birth_month_day, '-', 2))::int
    WHEN 1  THEN 'January'
    WHEN 2  THEN 'February'
    WHEN 3  THEN 'March'
    WHEN 4  THEN 'April'
    WHEN 5  THEN 'May'
    WHEN 6  THEN 'June'
    WHEN 7  THEN 'July'
    WHEN 8  THEN 'August'
    WHEN 9  THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END || '/' || (split_part(birth_month_day, '-', 1))::int
WHERE birth_month_day ~ '^\d{1,2}-\d{1,2}-\d{4}$'
  AND (split_part(birth_month_day, '-', 2))::int BETWEEN 1 AND 12;

-- ──────────────────────────────────────────────────────────────────
-- STEP 5: Convert Mon-DD short month with hyphen
-- Examples: "May-27" → "May/27", "Mar-21" → "March/21", "Oct-17" → "October/17"
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day = 'May/27'
WHERE id = '36b6d74d-b38c-458e-a294-c5a73f69e46a' AND birth_month_day = 'May-27';

UPDATE administrative_officers
SET birth_month_day = 'March/21'
WHERE id = 'ccaee6d6-3d45-419c-84d4-c5b63327f78c' AND birth_month_day = 'Mar-21';

UPDATE administrative_officers
SET birth_month_day = 'October/17'
WHERE id = '20465250-36fa-4203-92d6-c2400e4f6552' AND birth_month_day = 'Oct-17';

-- ──────────────────────────────────────────────────────────────────
-- STEP 6: Convert MM-DD legacy numeric format
-- Examples: "05-14" → "May/14", "01-07" → "January/7"
-- Pattern: two padded digits - two padded digits (no year)
-- ──────────────────────────────────────────────────────────────────
UPDATE administrative_officers
SET birth_month_day =
  CASE (split_part(birth_month_day, '-', 1))::int
    WHEN 1  THEN 'January'
    WHEN 2  THEN 'February'
    WHEN 3  THEN 'March'
    WHEN 4  THEN 'April'
    WHEN 5  THEN 'May'
    WHEN 6  THEN 'June'
    WHEN 7  THEN 'July'
    WHEN 8  THEN 'August'
    WHEN 9  THEN 'September'
    WHEN 10 THEN 'October'
    WHEN 11 THEN 'November'
    WHEN 12 THEN 'December'
  END || '/' || (split_part(birth_month_day, '-', 2))::int
WHERE birth_month_day ~ '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$';

COMMIT;
