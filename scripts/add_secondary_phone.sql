-- Run this script in your Supabase SQL Editor to add the secondary phone number field

ALTER TABLE administrative_officers 
ADD COLUMN IF NOT EXISTS secondary_phone_number TEXT;

-- Optional: If you want to add a comment to the column for documentation
COMMENT ON COLUMN administrative_officers.secondary_phone_number IS 'Optional secondary contact number for the officer';
