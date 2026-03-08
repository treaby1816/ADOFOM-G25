// migration script
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'officer-photos';
const TEMP_DIR = path.join(__dirname, 'temp_images');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// Function to extract Google Drive File ID from URL
function extractDriveId(url) {
    if (!url) return null;
    const match = url.match(/(?:id=|file\/d\/|v=)([\w-]{25,})/);
    return match ? match[1] : null;
}

// Function to download image from Google Drive
async function downloadImage(url, tempFilePath) {
    const driveId = extractDriveId(url);

    if (!driveId) {
        console.log(`Could not extract Drive ID from: ${url}`);
        return false;
    }

    // Uses a common public export URL format for Drive
    const exportUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;

    try {
        const response = await fetch(exportUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${exportUrl}: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(tempFilePath, Buffer.from(buffer));
        return true;
    } catch (err) {
        console.error(`Error downloading image ${driveId}:`, err);
        return false;
    }
}

async function migratePhotos() {
    console.log('--- STARTING PHOTO MIGRATION ---');

    // 1. Fetch all officers where photo_url contains "drive.google.com"
    const { data: officers, error: fetchError } = await supabase
        .from('administrative_officers')
        .select('id, full_name, photo_url')
        .like('photo_url', '%drive.google.com%');

    if (fetchError) {
        console.error('Error fetching officers:', fetchError);
        return;
    }

    console.log(`Found ${officers.length} officers with Google Drive photos.`);

    let successCount = 0;

    // 2. Process each officer
    for (const officer of officers) {
        console.log(`\nProcessing: ${officer.full_name} (${officer.id})`);

        // Create a safe, unique filename
        const sanitizedName = (officer.full_name || 'officer').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${sanitizedName}_${officer.id.substring(0, 6)}.jpg`;
        const tempFilePath = path.join(TEMP_DIR, fileName);

        // 3. Download the photo
        console.log(`  Downloading from: ${officer.photo_url}`);
        const downloaded = await downloadImage(officer.photo_url, tempFilePath);

        if (!downloaded) {
            console.log(`  Skipping ${officer.full_name} due to download failure.`);
            continue;
        }

        // 4. Upload to Supabase Storage
        console.log(`  Uploading to Supabase bucket: ${BUCKET_NAME}`);
        const fileBuffer = fs.readFileSync(tempFilePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, fileBuffer, {
                contentType: 'image/jpeg',
                upsert: false
            });

        if (uploadError) {
            console.error(`  Upload Error for ${officer.full_name}:`, uploadError);
            continue;
        }

        // 5. Get the Public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(uploadData.path);

        const publicUrl = urlData.publicUrl;
        console.log(`  New URL: ${publicUrl}`);

        // 6. Update the Database Record
        const { error: updateError } = await supabase
            .from('administrative_officers')
            .update({ photo_url: publicUrl })
            .eq('id', officer.id);

        if (updateError) {
            console.error(`  DB Update Error for ${officer.full_name}:`, updateError);
        } else {
            console.log(`  Successfully updated DB for ${officer.full_name}!`);
            successCount++;
        }
    }

    console.log(`\n--- MIGRATION COMPLETE ---`);
    console.log(`Successfully migrated ${successCount} out of ${officers.length} photos.`);
}

migratePhotos();
