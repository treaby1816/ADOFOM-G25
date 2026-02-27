
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProfiles() {
    console.log('--- STARTING PROFILE FIX ---');

    // 1. Fix Agnes by ID
    const agnesId = 'ede61718-3886-49dc-8aeb-3508f1a6e79b';
    console.log(`Setting Agnes (${agnesId}) to object-top...`);
    const { error: e1 } = await supabase
        .from('administrative_officers')
        .update({ photo_position: 'object-top' })
        .eq('id', agnesId);

    if (e1) console.error('Error Agnes:', e1.message);
    else console.log('Agnes OK');

    // 2. Check other reported profiles: Sanyade, Olutola, Ajayi, Sunmola
    const names = ['Sanyade', 'Olutola', 'Ajayi', 'Sunmola'];
    for (const name of names) {
        console.log(`Checking ${name}...`);
        const { data, error } = await supabase
            .from('administrative_officers')
            .select('id, full_name, photo_position')
            .ilike('full_name', `%${name}%`);

        if (error) {
            console.error(`Error ${name}:`, error.message);
        } else {
            data.forEach(async (o) => {
                console.log(`Found: ${o.full_name} | Pos: ${o.photo_position}`);
                if (o.photo_position !== 'object-top') {
                    console.log(`Updating ${o.full_name} to object-top...`);
                    const { error: e2 } = await supabase
                        .from('administrative_officers')
                        .update({ photo_position: 'object-top' })
                        .eq('id', o.id);
                    if (e2) console.error(`Error updating ${o.full_name}:`, e2.message);
                    else console.log(`Updated ${o.full_name} OK`);
                }
            });
        }
    }

    console.log('--- PROFILE FIX COMPLETE ---');
}

fixProfiles();
