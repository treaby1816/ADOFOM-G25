-- SQL Script to set up the Leadership Portfolios table

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.leadership_portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.leadership_portfolios ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Everyone can read the portfolios
CREATE POLICY "Allow public read access to leadership_portfolios" 
ON public.leadership_portfolios FOR SELECT 
USING (true);

-- Only Admins can insert/update/delete
CREATE POLICY "Allow admin insert to leadership_portfolios" 
ON public.leadership_portfolios FOR INSERT 
WITH CHECK (
    auth.uid() IN (SELECT id FROM public.administrative_officers WHERE is_admin = true)
);

CREATE POLICY "Allow admin update to leadership_portfolios" 
ON public.leadership_portfolios FOR UPDATE 
USING (
    auth.uid() IN (SELECT id FROM public.administrative_officers WHERE is_admin = true)
);

CREATE POLICY "Allow admin delete to leadership_portfolios" 
ON public.leadership_portfolios FOR DELETE 
USING (
    auth.uid() IN (SELECT id FROM public.administrative_officers WHERE is_admin = true)
);

-- 4. Seed with initial default portfolios
INSERT INTO public.leadership_portfolios (title, sort_order)
VALUES 
    ('President', 1),
    ('Vice President', 2),
    ('General Secretary', 3),
    ('Assistant Secretary', 4),
    ('Financial Secretary', 5),
    ('Treasurer', 6),
    ('Public Relations Officer (PRO)', 7),
    ('Social Secretary', 8),
    ('Auditor', 9)
ON CONFLICT (title) DO NOTHING;
