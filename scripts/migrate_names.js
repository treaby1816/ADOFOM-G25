
const { createClient } = require('@supabase/supabase-js');

// Using keys from .env.local
const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Rules for Name Standardization:
 * - Format: "SURNAME, Other Names"
 * - Example: "Adewole Felix Bamidele" -> "ADEWOLE, Felix Bamidele"
 * - If name has a comma, we assume it was already processed or partially formatted.
 */
function standardizeName(fullName) {
    if (!fullName) return '';

    // Split by comma or space
    const parts = fullName.replace(/,/g, ' ').trim().split(/\s+/);
    if (parts.length === 0) return '';

    // First word is the Surname
    const surname = parts[0].toUpperCase();

    // Remaining words are Other Names
    const otherNames = parts.slice(1).map(part => {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join(' ');

    return otherNames ? `${surname}, ${otherNames}` : surname;
}

async function runMigration() {
    console.log('--- SENIOR DEV MIGRATION START ---');

    const { data: officers, error: fetchError } = await supabase
        .from('administrative_officers')
        .select('id, full_name, photo_url');

    if (fetchError) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    console.log(`Analyzing ${officers.length} rows...`);

    for (const officer of officers) {
        const newName = standardizeName(officer.full_name);
        let photo_url = officer.photo_url;

        // Repair image URLs for these specific officers
        const n = officer.full_name.toUpperCase();
        if (n.includes('MAYODE')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/mayode%20(1).jpeg';
        } else if (n.includes('AKINFULIE') && n.includes('BLESSING')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Akinfulie%20Blessing%20Solomon.png';
        } else if (n.includes('ONIYI')) { // Standardized name might be ONIYI, Oluwaseun Esther
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Oluwaseun%20Oniyi.HEIC';
        } else if (n.includes('OMOTERE')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Omotere.jpeg';
        }

        // Only update if something changed
        if (newName !== officer.full_name || photo_url !== officer.photo_url) {
            const { error: updateError } = await supabase
                .from('administrative_officers')
                .update({
                    full_name: newName,
                    photo_url: photo_url
                })
                .eq('id', officer.id);

            if (updateError) {
                console.error(`[FAIL] ID ${officer.id} | ${officer.full_name}: ${updateError.message}`);
                console.log(`Tip: RLS might be blocking UPDATE for this key. Ensure 'anon' has UPDATE permissions or use Service Key.`);
            } else {
                console.log(`[OK] ${officer.full_name} -> ${newName}`);
            }
        }
    }

    console.log('--- MIGRATION COMPLETE ---');
}

runMigration();
