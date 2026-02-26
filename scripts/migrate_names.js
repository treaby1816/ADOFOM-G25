
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for the migration script (pulled from .env.local)
const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

function formatName(fullName) {
    if (!fullName) return '';
    // Remove existing commas if any to re-parse from scratch
    const cleanName = fullName.replace(/,/g, '').trim();
    const parts = cleanName.split(/\s+/);
    if (parts.length === 0) return '';

    // As per user request: SURNAME, Other Names
    // We assume the first word is the surname (standard Nigerian directory format)
    const surname = parts[0].toUpperCase();
    const otherNames = parts.slice(1).map(name =>
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ).join(' ');

    return otherNames ? `${surname}, ${otherNames}` : surname;
}

async function migrate() {
    console.log('Starting name standardization...');

    const { data: officers, error } = await supabase
        .from('administrative_officers')
        .select('id, full_name, photo_url');

    if (error) {
        console.error('Error fetching officers:', error);
        return;
    }

    console.log(`Processing ${officers.length} officers...`);

    for (const officer of officers) {
        const newName = formatName(officer.full_name);
        let photo_url = officer.photo_url;

        // Fix specific broken images mentioned by user
        const n = officer.full_name.toUpperCase();
        if (n.includes('MAYODE')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/mayode%20(1).jpeg';
        } else if (n.includes('AKINFULIE') && n.includes('BLESSING')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Akinfulie%20Blessing%20Solomon.png';
        } else if (n.includes('ONIYI') && n.includes('SEUN')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Oluwaseun%20Oniyi.HEIC';
        } else if (n.includes('OMOTERE')) {
            photo_url = 'https://vggkiprlyxainiysftom.supabase.co/storage/v1/object/public/officer-photos/Omotere.jpeg';
        }

        const { error: updateError } = await supabase
            .from('administrative_officers')
            .update({
                full_name: newName,
                photo_url: photo_url
            })
            .eq('id', officer.id);

        if (updateError) {
            console.error(`Failed to update ID ${officer.id} (${officer.full_name}):`, updateError.message);
        } else {
            console.log(`Updated: ${officer.full_name} -> ${newName}`);
        }
    }

    console.log('Migration complete.');
}

migrate();
