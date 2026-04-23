-- Run this script in your Supabase SQL Editor

-- 1. Create or replace the function that handles new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_id UUID;
BEGIN
  -- Check if the email already exists in administrative_officers (e.g. from the 97 pre-imported records)
  SELECT id INTO existing_id FROM public.administrative_officers WHERE email_address = NEW.email LIMIT 1;

  IF existing_id IS NOT NULL THEN
    -- If the profile already exists, update its ID to match the new Auth User ID
    -- This links the pre-imported record to the newly signed-up user!
    UPDATE public.administrative_officers 
    SET id = NEW.id 
    WHERE email_address = NEW.email;
  ELSE
    -- If it's a completely new person not in the 97 pre-imported list, insert a new row
    INSERT INTO public.administrative_officers (id, email_address, full_name)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User')
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ensure the trigger is attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
