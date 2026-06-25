const fs = require('fs');

const parsedFile = 'd:\\Projects\\ondo-admin-directory\\parsed_new_officers.json';
const newEntries = require(parsedFile);

const uniqueEntries = [];
const seen = new Set();
for (const entry of newEntries) {
  if (!seen.has(entry.email_address)) {
    uniqueEntries.push(entry);
    seen.add(entry.email_address);
  }
}

let finalSql = `-- =====================================================================\n`
  + `-- ADOFOM E-Platform: SQL Injection for 62 Unique New Officers\n`
  + `-- Purpose: Pre-populate the administrative_officers table safely.\n`
  + `-- =====================================================================\n\n`
  + `-- 1. Verification check to see ANY existing duplicate anomalies in the database\n`
  + `SELECT email_address, COUNT(*) as occurrence_count \nFROM public.administrative_officers \nGROUP BY email_address \nHAVING COUNT(*) > 1;\n\n`
  + `-- 2. Safe Insert Logic (Bypassing ON CONFLICT and handling NOT NULL constraints)\n`
  + `INSERT INTO public.administrative_officers (id, email_address, full_name, is_approved, must_change_password, current_mda, phone_number, grade_level, lga, birth_month_day)\n`
  + `SELECT new_data.id, new_data.email_address, new_data.full_name, new_data.is_approved, new_data.must_change_password, new_data.current_mda, new_data.phone_number, new_data.grade_level, new_data.lga, new_data.birth_month_day\n`
  + `FROM (\n`;

const selectValues = uniqueEntries.map((entry) => {
  const name = entry.full_name.replace(/'/g, "''");
  return `  SELECT gen_random_uuid() as id, '${entry.email_address}'::text as email_address, '${name}'::text as full_name, false as is_approved, true as must_change_password, 'Pending Setup'::text as current_mda, '00000000000'::text as phone_number, 'Pending'::text as grade_level, 'Pending'::text as lga, '01-01'::text as birth_month_day`;
});

finalSql += selectValues.join('\n  UNION ALL\n');
finalSql += `\n) as new_data\n`;
finalSql += `WHERE NOT EXISTS (\n`;
finalSql += `  SELECT 1 FROM public.administrative_officers \n`;
finalSql += `  WHERE administrative_officers.email_address = new_data.email_address\n`;
finalSql += `);\n`;

fs.writeFileSync('d:\\Projects\\ondo-admin-directory\\scripts\\insert_new_officers.sql', finalSql, 'utf8');
console.log('Fixed SQL Script generated successfully with NOT NULL handling.');
