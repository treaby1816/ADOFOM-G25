const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchUniqueMDAs() {
    const { data, error } = await supabase
        .from('administrative_officers')
        .select('current_mda');

    if (error) {
        console.error('Error fetching MDAs:', error);
        return;
    }

    const uniqueMDAs = [...new Set(data.map(d => (d.current_mda || '').trim()))].sort();
    console.log("----- UNIQUE MDAS -----");
    uniqueMDAs.forEach(mda => console.log(mda));
    console.log("-----------------------");
}

fetchUniqueMDAs();
