const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vggkiprlyxainiysftom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZ2tpcHJseXhhaW5peXNmdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDU3ODMsImV4cCI6MjA4NzA4MTc4M30.rDTCw-tdzxRatR5aI1oL3R_nVbDskyRw9Ud0FW8s3Fk';
const supabase = createClient(supabaseUrl, supabaseKey);

// Load whitelist
const { WHITELIST } = require('../src/lib/whitelist-data.ts') || {};

async function fullAudit() {
  console.log('==============================================');
  console.log('   ADOFOM FULL AUDIT: Whitelist vs Database');
  console.log('==============================================\n');

  // ── 1. Fetch ALL DB records ─────────────────────────────
  const { data: allOfficers, error } = await supabase
    .from('administrative_officers')
    .select('id, full_name, email_address, is_approved, created_at')
    .order('full_name');

  if (error) {
    console.error('DB Error:', error.message);
    return;
  }

  const totalDB       = allOfficers.length;
  const approvedDB    = allOfficers.filter(o => o.is_approved === true).length;
  const unapprovedDB  = allOfficers.filter(o => o.is_approved === false).length;

  console.log('── DATABASE ────────────────────────────────');
  console.log(`  Total records      : ${totalDB}`);
  console.log(`  Approved (active)  : ${approvedDB}   ← what dashboard shows`);
  console.log(`  Not yet approved   : ${unapprovedDB}`);

  // ── 2. Check for remaining duplicates in DB ─────────────
  const nameMap = {};
  allOfficers.forEach(o => {
    const key = (o.full_name || '').trim().toUpperCase();
    if (!nameMap[key]) nameMap[key] = [];
    nameMap[key].push(o);
  });
  const dupGroups = Object.entries(nameMap).filter(([, g]) => g.length > 1);

  console.log(`\n── DUPLICATES IN DB ────────────────────────`);
  if (dupGroups.length === 0) {
    console.log('  ✅ None found — database is clean!');
  } else {
    dupGroups.forEach(([name, group]) => {
      console.log(`  ⚠️  "${name}" appears ${group.length} times:`);
      group.forEach(o => console.log(`      - ${o.email_address} | approved: ${o.is_approved}`));
    });
  }

  // ── 3. Load whitelist from file directly ────────────────
  const fs = require('fs');
  const wlContent = fs.readFileSync(
    'd:/Projects/ondo-admin-directory/src/lib/whitelist-data.ts', 'utf8'
  );

  // Extract all email keys from whitelist
  const emailRegex = /"([^"]+@[^"]+)"\s*:/g;
  const wlEmails = new Set();
  let match;
  while ((match = emailRegex.exec(wlContent)) !== null) {
    // skip "email_address" field values, only get the top-level keys
    wlEmails.add(match[1].toLowerCase());
  }

  // Remove "email_address" string itself if captured
  wlEmails.delete('email_address');

  // Count is_approved: true and false in whitelist
  const approvedInWL   = (wlContent.match(/"is_approved":\s*true/g) || []).length
                       + (wlContent.match(/is_approved:\s*true/g) || []).length;
  const unapprovedInWL = (wlContent.match(/"is_approved":\s*false/g) || []).length
                       + (wlContent.match(/is_approved:\s*false/g) || []).length;

  console.log(`\n── WHITELIST (whitelist-data.ts) ───────────`);
  console.log(`  Total entries      : ${wlEmails.size}`);
  console.log(`  Approved entries   : ${approvedInWL}`);
  console.log(`  Unapproved entries : ${unapprovedInWL}`);

  // ── 4. Cross-check: who is in whitelist but NOT in DB ───
  const dbEmails = new Set(allOfficers.map(o => (o.email_address || '').toLowerCase()));
  const inWLnotDB = [...wlEmails].filter(e => !dbEmails.has(e));
  const inDBnotWL = allOfficers.filter(o => !wlEmails.has((o.email_address || '').toLowerCase()));

  console.log(`\n── CROSS-CHECK ─────────────────────────────`);
  console.log(`  In whitelist, not yet signed up (no DB record): ${inWLnotDB.length}`);
  if (inWLnotDB.length > 0 && inWLnotDB.length <= 50) {
    inWLnotDB.forEach(e => console.log(`    - ${e}`));
  }

  console.log(`\n  In DB but NOT in whitelist: ${inDBnotWL.length}`);
  if (inDBnotWL.length > 0) {
    inDBnotWL.forEach(o => console.log(`    - ${o.email_address} | ${o.full_name} | approved: ${o.is_approved}`));
  }

  // ── 5. Summary ──────────────────────────────────────────
  console.log(`\n==============================================`);
  console.log(`  SUMMARY`);
  console.log(`==============================================`);
  console.log(`  Whitelist total          : ${wlEmails.size}`);
  console.log(`  DB total (all)           : ${totalDB}`);
  console.log(`  DB approved (active)     : ${approvedDB}  ← dashboard count`);
  console.log(`  DB unapproved            : ${unapprovedDB}`);
  console.log(`  Still waiting to sign up : ${inWLnotDB.length}`);
  console.log(`  DB duplicates remaining  : ${dupGroups.length}`);
  console.log(`==============================================\n`);
}

fullAudit().catch(console.error);
