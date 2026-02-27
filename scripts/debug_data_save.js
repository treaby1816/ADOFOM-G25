const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugData() {
    const { data, error } = await supabase
        .from('administrative_officers')
        .select('current_mda, lga');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const mdas = [...new Set(data.map(d => (d.current_mda || '').trim()))].sort();
    const lgas = [...new Set(data.map(d => (d.lga || '').trim()))].sort();

    const output = { mdas, lgas };
    fs.writeFileSync(path.join(process.cwd(), 'debug_output.json'), JSON.stringify(output, null, 2));
    console.log('Results saved to debug_output.json');
}

debugData();
