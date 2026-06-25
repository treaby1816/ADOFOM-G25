const fs = require('fs');

/**
 * Standardizes a name to ADOFOM convention: "SURNAME, Other Names"
 * - Surname in ALL CAPS
 * - Other names in Title Case
 * - Handles "Last First" and "LAST, First" and "Last, First" formats
 */
function standardizeName(raw) {
  if (!raw || !raw.trim()) return raw;
  const trimmed = raw.trim();

  let surname, otherNames;

  if (trimmed.includes(',')) {
    // Format: "SURNAME, Other Names" or "Surname, Other Names"
    const commaIdx = trimmed.indexOf(',');
    surname = trimmed.substring(0, commaIdx).trim().toUpperCase();
    otherNames = trimmed.substring(commaIdx + 1).trim()
      .split(/\s+/)
      .map(w => w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
      .join(' ');
  } else {
    // Format: "Firstname Surname" or "FIRSTNAME SURNAME" - first word is surname
    const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
    if (parts.length === 0) return trimmed;
    surname = parts[0].toUpperCase();
    if (parts.length === 1) return surname;
    otherNames = parts.slice(1)
      .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  return otherNames ? `${surname}, ${otherNames}` : surname;
}

// ---------- 1. Fix whitelist-data.ts ----------
const whitelistPath = 'd:\\Projects\\ondo-admin-directory\\src\\lib\\whitelist-data.ts';
let content = fs.readFileSync(whitelistPath, 'utf8');

// Find all full_name values and replace
let fixCount = 0;
content = content.replace(/"full_name":\s*"([^"]+)"/g, (match, name) => {
  const fixed = standardizeName(name);
  if (fixed !== name) {
    fixCount++;
    console.log(`  FIXED: "${name}" → "${fixed}"`);
  }
  return `"full_name": "${fixed}"`;
});

fs.writeFileSync(whitelistPath, content, 'utf8');
console.log(`\nWhitelist: Fixed ${fixCount} names.\n`);

// ---------- 2. Generate SQL UPDATE for the database ----------
// Load ALL whitelist entries and generate SQL to sync names to DB
const whitelistModule = fs.readFileSync(whitelistPath, 'utf8');

// Parse all email → full_name pairs from the TS file using regex
const pairs = [];
const pairRegex = /"([^"]+@[^"]+)":\s*\{[^}]*?"full_name":\s*"([^"]+)"/g;
let match;
while ((match = pairRegex.exec(whitelistModule)) !== null) {
  pairs.push({ email: match[1], full_name: match[2] });
}

let sql = `-- =====================================================================\n`;
sql += `-- ADOFOM E-Platform: Fix Officer Names to SURNAME, Other Names Format\n`;
sql += `-- Run this in Supabase SQL Editor to update existing DB records.\n`;
sql += `-- =====================================================================\n\n`;
sql += `BEGIN;\n\n`;

for (const { email, full_name } of pairs) {
  const safeName = full_name.replace(/'/g, "''");
  const safeEmail = email.replace(/'/g, "''");
  sql += `UPDATE public.administrative_officers\n`;
  sql += `  SET full_name = '${safeName}'\n`;
  sql += `  WHERE email_address = '${safeEmail}'\n`;
  sql += `    AND full_name IS DISTINCT FROM '${safeName}';\n\n`;
}

sql += `-- Verify: show any names that still don't match the SURNAME, Other Names pattern\n`;
sql += `SELECT id, email_address, full_name\n`;
sql += `FROM public.administrative_officers\n`;
sql += `WHERE full_name NOT SIMILAR TO '[A-Z ,-]+,? [A-Za-z ]+'\n`;
sql += `ORDER BY full_name;\n\n`;
sql += `COMMIT;\n`;

const sqlPath = 'd:\\Projects\\ondo-admin-directory\\scripts\\fix_officer_names.sql';
fs.writeFileSync(sqlPath, sql, 'utf8');

console.log(`SQL script generated: ${sqlPath}`);
console.log(`Total DB UPDATE statements: ${pairs.length}`);
