-- Add portfolio_url column to administrative_officers table
ALTER TABLE administrative_officers
ADD COLUMN IF NOT EXISTS portfolio_url TEXT DEFAULT '';
