const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findAndRemoveDuplicates() {
  console.log('========================================');
  console.log('  ADOFOM Duplicate Detection & Removal');
  console.log('========================================\n');

  // Fetch ALL officers
  const { data: officers, error } = await supabase
    .from('administrative_officers')
    .select('id, full_name, email_address, photo_url, current_mda, is_approved, created_at, induction_year')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching officers:', error.message);
    return;
  }

  console.log(`Total records in database: ${officers.length}\n`);

  // Group by normalized full_name
  const nameMap = {};
  officers.forEach(officer => {
    const key = (officer.full_name || '').trim().toUpperCase();
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(officer);
  });

  // Find groups with more than one entry (duplicates)
  const duplicateGroups = Object.entries(nameMap).filter(([, group]) => group.length > 1);

  if (duplicateGroups.length === 0) {
    console.log('✅ No duplicates found! Database is clean.');
    return;
  }

  console.log(`⚠️  Found ${duplicateGroups.length} duplicate name(s):\n`);

  const toDelete = [];

  duplicateGroups.forEach(([name, group]) => {
    console.log(`--- DUPLICATE: "${name}" (${group.length} records) ---`);
    group.forEach((o, i) => {
      console.log(`  [${i + 1}] ID: ${o.id}`);
      console.log(`      Email:   ${o.email_address || 'N/A'}`);
      console.log(`      MDA:     ${o.current_mda || 'N/A'}`);
      console.log(`      Photo:   ${o.photo_url ? '✅ Yes' : '❌ None'}`);
      console.log(`      Approved: ${o.is_approved ? '✅ Yes' : '❌ No'}`);
      console.log(`      Created: ${o.created_at}`);
    });

    // Keep strategy:
    // 1. Prefer record with a photo
    // 2. Prefer approved record
    // 3. Prefer the older (first created) record
    const sorted = [...group].sort((a, b) => {
      // Photo presence
      const aHasPhoto = a.photo_url ? 1 : 0;
      const bHasPhoto = b.photo_url ? 1 : 0;
      if (bHasPhoto !== aHasPhoto) return bHasPhoto - aHasPhoto;

      // Approval status
      const aApproved = a.is_approved ? 1 : 0;
      const bApproved = b.is_approved ? 1 : 0;
      if (bApproved !== aApproved) return bApproved - aApproved;

      // Older record wins
      return new Date(a.created_at) - new Date(b.created_at);
    });

    const keep = sorted[0];
    const remove = sorted.slice(1);

    console.log(`  ✅ KEEPING: ID ${keep.id} (${keep.photo_url ? 'has photo' : 'no photo'}, ${keep.is_approved ? 'approved' : 'not approved'})`);
    remove.forEach(r => {
      console.log(`  🗑️  DELETING: ID ${r.id}`);
      toDelete.push(r.id);
    });
    console.log('');
  });

  if (toDelete.length === 0) {
    console.log('No records to delete.');
    return;
  }

  console.log(`\n🗑️  Preparing to delete ${toDelete.length} duplicate record(s)...`);
  console.log('IDs to delete:', toDelete);

  // Delete the duplicates
  const { error: deleteError, count } = await supabase
    .from('administrative_officers')
    .delete()
    .in('id', toDelete);

  if (deleteError) {
    console.error('\n❌ Error deleting duplicates:', deleteError.message);
    console.error('Full error:', JSON.stringify(deleteError, null, 2));
  } else {
    console.log(`\n✅ Successfully deleted ${toDelete.length} duplicate record(s)!`);
  }

  // Final verification
  const { data: finalData, error: finalError } = await supabase
    .from('administrative_officers')
    .select('id, full_name')
    .order('full_name');

  if (!finalError) {
    console.log(`\n📊 Database now has ${finalData.length} total records.`);

    // Double-check no more duplicates
    const finalNameMap = {};
    finalData.forEach(o => {
      const key = (o.full_name || '').trim().toUpperCase();
      if (!finalNameMap[key]) finalNameMap[key] = 0;
      finalNameMap[key]++;
    });

    const remainingDups = Object.entries(finalNameMap).filter(([, c]) => c > 1);
    if (remainingDups.length === 0) {
      console.log('✅ Final check: Database is now clean — no duplicates remain.');
    } else {
      console.log(`⚠️  Final check: ${remainingDups.length} duplicate(s) still remain:`, remainingDups);
    }
  }
}

findAndRemoveDuplicates().catch(console.error);
