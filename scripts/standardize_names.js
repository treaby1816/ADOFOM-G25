const fs = require('fs');

/**
 * Standardizes an officer name to the ADOFOM convention:
 * "SURNAME, Other Names" — surname in ALL CAPS, rest in Title Case.
 * 
 * Handles inputs like:
 *   "Ogunlade Samuel Somo"   → "OGUNLADE, Samuel Somo"
 *   "OJUMU, Glory Taiwo"     → "OJUMU, Glory Taiwo"  (already correct)
 *   "OROGUN Nathaniel"       → "OROGUN, Nathaniel"
 *   "oshodi Michael Adeteye" → "OSHODI, Michael Adeteye"
 */
function standardizeName(raw) {
  if (!raw || !raw.trim()) return raw;

  const trimmed = raw.trim();

  // If name already has a comma, it's in "SURNAME, Other Names" format
  if (trimmed.includes(',')) {
    const [surnamePart, ...rest] = trimmed.split(',');
    const surname = surnamePart.trim().toUpperCase();
    const otherNames = rest.join(',').trim()
      .split(' ')
      .map(w => w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : '')
      .join(' ');
    return `${surname}, ${otherNames}`;
  }

  // No comma — split by spaces, assume FIRST word is surname
  const parts = trimmed.split(/\s+/).filter(p => p.length > 0);
  if (parts.length === 0) return trimmed;

  const surname = parts[0].toUpperCase();

  if (parts.length === 1) return surname;

  const otherNames = parts.slice(1)
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return `${surname}, ${otherNames}`;
}

// Load parsed entries
const parsedFile = 'd:\\Projects\\ondo-admin-directory\\parsed_new_officers.json';
const newEntries = require(parsedFile);

// Deduplicate and standardize names
const uniqueEntries = [];
const seen = new Set();
for (const entry of newEntries) {
  if (!seen.has(entry.email_address)) {
    uniqueEntries.push({
      ...entry,
      full_name: standardizeName(entry.full_name)
    });
    seen.add(entry.email_address);
  }
}

// Save back the standardized entries
fs.writeFileSync(parsedFile, JSON.stringify(uniqueEntries, null, 2), 'utf8');
console.log(`Standardized ${uniqueEntries.length} unique officer names.`);

// Preview first 10
uniqueEntries.slice(0, 10).forEach(e => console.log(`  ${e.full_name} <${e.email_address}>`));
