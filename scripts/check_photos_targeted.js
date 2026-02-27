
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOfficers() {
    const { data: officers, error } = await supabase
        .from('administrative_officers')
        .select('id, full_name, photo_url, photo_position')
        .or('full_name.ilike.%Agnes%,full_name.ilike.%Omoniyi%');

    if (error) {
        console.error('Error fetching:', error.message);
        return;
    }

    officers.forEach(o => {
        console.log(`--- ${o.full_name} ---`);
        console.log(`ID: ${o.id}`);
        console.log(`Photo URL: ${o.photo_url}`);
        console.log(`Position: ${o.photo_position}`);
    });
}

checkOfficers();
