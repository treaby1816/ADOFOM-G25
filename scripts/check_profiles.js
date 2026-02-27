
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOfficers() {
    console.log('Searching for Agnes and Omoniyi...');
    const { data: agnes, error: e1 } = await supabase
        .from('administrative_officers')
        .select('*')
        .ilike('full_name', '%Agnes%');

    const { data: omoniyi, error: e2 } = await supabase
        .from('administrative_officers')
        .select('*')
        .ilike('full_name', '%Omoniyi%');

    if (e1 || e2) {
        console.error('Error fetching:', e1?.message || e2?.message);
        return;
    }

    console.log('Agnes Results:', JSON.stringify(agnes, null, 2));
    console.log('Omoniyi Results:', JSON.stringify(omoniyi, null, 2));
}

checkOfficers();
