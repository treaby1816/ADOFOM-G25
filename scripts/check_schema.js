
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data: officers, error } = await supabase
        .from('administrative_officers')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching:', error.message);
        return;
    }

    if (officers.length > 0) {
        console.log('Columns found:', Object.keys(officers[0]));
    } else {
        console.log('No data found in table.');
    }
}

checkSchema();
