const fs = require('fs');

const parsedFile = 'd:\\Projects\\ondo-admin-directory\\parsed_new_officers.json';
const newEntries = require(parsedFile);

let sql = `-- =====================================================================\n`;
sql += `-- ADOFOM E-Platform: SQL Injection for 62 Unique New Officers\n`;
sql += `-- Purpose: Pre-populate the administrative_officers table so users bypass\n`;
sql += `-- unauthorized blocks during signup and redirect safely to Profile Setup.\n`;
sql += `-- =====================================================================\n\n`;

sql += `BEGIN;\n\n`;

const uniqueEntries = [];
const seen = new Set();

for (const entry of newEntries) {
  if (!seen.has(entry.email_address)) {
    uniqueEntries.push(entry);
    seen.add(entry.email_address);
  }
}

sql += `-- 1. Clean Up / Upsert Logic to Prevent Duplicates\n`;
sql += `INSERT INTO public.administrative_officers (id, email_address, full_name, is_approved, must_change_password)\nVALUES\n`;

const values = uniqueEntries.map((entry) => {
  const name = entry.full_name.replace(/'/g, "''");
  return `  (gen_random_uuid(), '${entry.email_address}', '${name}', false, true)`;
});

sql += values.join(',\n');
sql += `\nON CONFLICT (email_address) \nDO UPDATE SET \n`;
sql += `  full_name = EXCLUDED.full_name,\n`;
sql += `  is_approved = EXCLUDED.is_approved;\n\n`;

sql += `-- 2. Verification check to see duplicate anomalies\n`;
sql += `SELECT email_address, COUNT(*) as occurrence_count \nFROM public.administrative_officers \nGROUP BY email_address \nHAVING COUNT(*) > 1;\n\n`;

sql += `COMMIT;\n`;

fs.writeFileSync('d:\\Projects\\ondo-admin-directory\\scripts\\insert_new_officers.sql', sql, 'utf8');
console.log('SQL Script generated successfully.');
