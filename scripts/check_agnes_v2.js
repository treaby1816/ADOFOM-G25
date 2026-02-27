
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOfficer() {
    console.log('Searching for "Agnes"...');
    const { data: officers, error } = await supabase
        .from('administrative_officers')
        .select('*')
        .ilike('full_name', '%Agnes%');

    if (error) {
        console.error('Error fetching officer:', error.message);
        return;
    }

    if (officers.length === 0) {
        console.log('No Agnes found. Listing all officers to find match...');
        const { data: all } = await supabase
            .from('administrative_officers')
            .select('full_name')
            .limit(10);
        console.log('Samples:', all);
    } else {
        console.log('Officer Data:', JSON.stringify(officers, null, 2));
    }
}

checkOfficer();
