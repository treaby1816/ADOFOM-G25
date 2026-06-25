const fs = require('fs');

const whitelistPath = 'd:\\Projects\\ondo-admin-directory\\src\\lib\\whitelist-data.ts';
let content = fs.readFileSync(whitelistPath, 'utf8');

const newEntries = require('d:\\Projects\\ondo-admin-directory\\parsed_new_officers.json');

// We want to insert before the last closing brace of the object.
// The file ends with:
//   "oluwatosinaugustine@gmail.com": {
//     "full_name": "ADEOYE Augustine Oluwatosin",
//     ...
//   }
// }

let injection = '';
for (const entry of newEntries) {
  if (entry.email_address && entry.full_name) {
    injection += `,\n  "${entry.email_address}": {\n    "full_name": "${entry.full_name.replace(/"/g, '\\"')}",\n    "email_address": "${entry.email_address}",\n    "is_approved": false\n  }`;
  }
}

// Find the last closing brace
const lastBraceIndex = content.lastIndexOf('}');
if (lastBraceIndex !== -1) {
  content = content.substring(0, lastBraceIndex) + injection + '\n' + content.substring(lastBraceIndex);
  fs.writeFileSync(whitelistPath, content, 'utf8');
  console.log('Successfully appended ' + newEntries.length + ' entries to whitelist-data.ts');
} else {
  console.error('Could not find closing brace');
}
