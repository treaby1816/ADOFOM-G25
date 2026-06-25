-- Fix: Add missing 'link' column to notifications table
-- This column is required for clickable notification routing (e.g. /?profileId=xxx)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;
