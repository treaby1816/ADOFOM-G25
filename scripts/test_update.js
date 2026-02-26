
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

function standardizeName(fullName) {
    if (!fullName) return '';
    const parts = fullName.replace(/,/g, ' ').trim().split(/\s+/);
    if (parts.length === 0) return '';
    const surname = parts[0].toUpperCase();
    const otherNames = parts.slice(1).map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
    return otherNames ? `${surname}, ${otherNames}` : surname;
}

async function testUpdate() {
    console.log('--- DB UPDATE TEST ---');

    // Fetch one officer
    const { data: officer, error: fetchError } = await supabase
        .from('administrative_officers')
        .select('*')
        .limit(1)
        .single();

    if (fetchError || !officer) {
        console.error('Fetch Error:', fetchError);
        return;
    }

    console.log(`Testing with officer: ${officer.full_name} (${officer.id})`);

    const newName = standardizeName(officer.full_name);
    console.log(`Proposed new name: ${newName}`);

    const { data: updateData, error: updateError } = await supabase
        .from('administrative_officers')
        .update({ full_name: newName })
        .eq('id', officer.id)
        .select();

    if (updateError) {
        console.error('UPDATE FAILED! Error:', updateError);
        console.log('Tips: If error is PGRST116 or null data, check RLS policies for anon update.');
    } else {
        console.log('Update Success Response:', updateData);
        if (updateData && updateData.length > 0 && updateData[0].full_name === newName) {
            console.log('VERIFIED: Name updated in DB successfully.');
        } else {
            console.log('WARNING: Update returned success but data did not change or returned empty. This usually means RLS "silently" blocked the update.');
        }
    }
}

testUpdate();
