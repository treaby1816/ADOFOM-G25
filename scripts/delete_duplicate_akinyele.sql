-- ============================================================
-- DELETE DUPLICATE: AKINYELE, Oluwatosin
-- ============================================================
-- Keeping: ID 39b8bf4b-3b8a-4375-9015-190946c6ced8
--   Email: oluwatosinakinyele03@gmail.com (original, has photo, approved)
--
-- Deleting: ID 6dd727b9-a2d1-4e58-a7bf-6393fcd4efdd
--   Email: akinyeleoluwatosin1996@gmail.com (duplicate, added during batch onboarding)
-- ============================================================

DELETE FROM administrative_officers
WHERE id = '6dd727b9-a2d1-4e58-a7bf-6393fcd4efdd';

-- Verify the deletion:
SELECT id, full_name, email_address, is_approved, created_at
FROM administrative_officers
WHERE full_name ILIKE '%AKINYELE%';
