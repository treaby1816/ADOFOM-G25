
-- SENIOR DEV MIGRATION SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR (https://supabase.com/dashboard/project/vggkiprlyxainiysftom/sql)

-- 1. Create a function to standardize names to "SURNAME, Other Names"
CREATE OR REPLACE FUNCTION standardize_officer_name(name_text TEXT) 
RETURNS TEXT AS $$
DECLARE
    parts TEXT[];
    surname TEXT;
    other_names TEXT;
    r TEXT;
    i INT;
BEGIN
    IF name_text IS NULL OR name_text = '' THEN
        RETURN name_text;
    END IF;

    -- Replace commas with spaces and split
    parts := string_to_array(trim(regexp_replace(name_text, ',', ' ', 'g')), ' ');
    
    -- Filter out empty parts
    parts := array(select p from unnest(parts) p where p <> '');
    
    IF array_length(parts, 1) = 0 THEN
        RETURN name_text;
    END IF;

    surname := upper(parts[1]);
    
    IF array_length(parts, 1) = 1 THEN
        RETURN surname;
    END IF;

    other_names := '';
    FOR i IN 2..array_length(parts, 1) LOOP
        r := parts[i];
        r := upper(left(r, 1)) || lower(right(r, -1));
        IF i = 2 THEN
            other_names := r;
        ELSE
            other_names := other_names || ' ' || r;
        END IF;
    END LOOP;

    RETURN surname || ', ' || other_names;
END;
$$ LANGUAGE plpgsql;

-- 2. Update all officer names
UPDATE administrative_officers 
SET full_name = standardize_officer_name(full_name);

-- 3. Fix specific reported broken images
UPDATE administrative_officers 
SET photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/mayode%20(1).jpeg'
WHERE full_name ILIKE '%MAYODE%';

UPDATE administrative_officers 
SET photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Akinfulie%20Blessing%20Solomon.png'
WHERE full_name ILIKE '%AKINFULIE%' AND full_name ILIKE '%BLESSING%';

UPDATE administrative_officers 
SET photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Oluwaseun%20Oniyi.HEIC'
WHERE full_name ILIKE '%ONIYI%';

UPDATE administrative_officers 
SET photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Omotere.jpeg'
WHERE full_name ILIKE '%OMOTERE%';

-- 4. Clean up the function
-- DROP FUNCTION standardize_officer_name(TEXT);

SELECT count(*) as updated_rows FROM administrative_officers;
