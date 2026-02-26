
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
    console.log('--- STORAGE AUDIT ---');

    // 1. Check if we can list buckets (might fail with anon key, but let's try)
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.log('Bucket Listing Error (Expected with Anon Key):', bucketError.message);
    } else {
        console.log('Buckets found:', buckets.map(b => b.name));
    }

    // 2. Try to get a public URL for a dummy file to see if the bucket exists
    const testBucket = 'officer-photos';
    const { data: publicUrlData } = supabase.storage.from(testBucket).getPublicUrl('test.jpg');
    console.log(`Public URL for ${testBucket}/test.jpg:`, publicUrlData.publicUrl);

    // 3. Try to upload a tiny blob (this WILL fail with anon key if RLS is on, but the error message is what matters)
    console.log('Attempting trial upload with Anon Key...');
    const dummyBlob = Buffer.from('test');
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from(testBucket)
        .upload('audit-test.txt', dummyBlob, { upsert: true });

    if (uploadError) {
        console.log('Upload Trial Result:', uploadError.message);
        if (uploadError.message.includes('not found')) {
            console.log('CRITICAL: Bucket "officer-photos" was not found. CHECK THE NAME!');
        } else if (uploadError.message.includes('row-level security') || uploadError.message.includes('new row violates')) {
            console.log('INFO: RLS is working (blocked anon). This is expected.');
        }
    } else {
        console.log('WARNING: Anon upload SUCCESSFUL. Your bucket is insecure (no RLS on write)!');
    }
}

checkStorage();
