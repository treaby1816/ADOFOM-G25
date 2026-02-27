
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAgnes() {
    console.log('Updating Omoolorun Agnes...');
    const { data, error } = await supabase
        .from('administrative_officers')
        .update({ photo_position: 'object-top' })
        .ilike('full_name', '%Omoolorun%');

    if (error) {
        console.error('Error updating:', error.message);
        return;
    }

    console.log('Update result:', data);

    // Verify
    const { data: verified } = await supabase
        .from('administrative_officers')
        .select('full_name, photo_position')
        .ilike('full_name', '%Omoolorun%');

    console.log('Verified state:', verified);
}

updateAgnes();
