const fs = require('fs');

const whitelistPath = 'd:\\Projects\\ondo-admin-directory\\src\\lib\\whitelist-data.ts';
let content = fs.readFileSync(whitelistPath, 'utf8');

// Load standardized entries
const newEntries = require('d:\\Projects\\ondo-admin-directory\\parsed_new_officers.json');

// For each new entry, find the block we previously injected and update the full_name
for (const entry of newEntries) {
  const email = entry.email_address;
  const correctName = entry.full_name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

  // Match the block for this email with is_approved: false (the ones we injected)
  // and replace only the full_name line inside it
  const blockRegex = new RegExp(
    `("${email}":\\s*\\{[^}]*?"full_name":\\s*)"[^"]*"`,
    'g'
  );

  content = content.replace(blockRegex, `$1"${correctName}"`);
}

fs.writeFileSync(whitelistPath, content, 'utf8');
console.log('Whitelist names standardized successfully.');
