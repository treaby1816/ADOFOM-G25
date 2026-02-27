
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listFiles() {
    const { data: files, error } = await supabase.storage
        .from('officer-photos')
        .list('', { limit: 100 });

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    console.log('--- STORAGE FILES ---');
    files.forEach(f => console.log(f.name));
}

listFiles();
