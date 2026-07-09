const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
    const emails = ['igewale@gmail.com', 'odusanya.segun@yahoo.com'];
    for (const email of emails) {
        const { data, error } = await supabase.from('administrative_officers').select('*').ilike('email_address', email);
        console.log(`Checking ${email} in administrative_officers:`, data, error);
    }
}
checkUsers();
