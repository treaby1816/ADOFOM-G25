
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPhotos() {
    console.log('--- PHOTO REPAIR VERIFICATION ---');
    const names = ['ALABI', 'AKINFULIE', 'ONIYI', 'OMOTERE'];

    for (const name of names) {
        const { data, error } = await supabase
            .from('administrative_officers')
            .select('full_name, photo_url')
            .ilike('full_name', `%${name}%`)
            .limit(1);

        if (error) {
            console.error(`Error checking ${name}:`, error);
        } else if (data && data.length > 0) {
            console.log(`Officer: ${data[0].full_name}`);
            console.log(`Photo URL: ${data[0].photo_url}`);
            console.log('---');
        }
    }
}

checkPhotos();
