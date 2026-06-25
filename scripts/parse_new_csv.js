const fs = require('fs');
const path = require('path');
const csvFile = 'd:\\Projects\\ondo-admin-directory\\new_officers.csv\\ADOFOM E-PLATFORM — Onboarding (Responses).csv';
const lines = fs.readFileSync(csvFile, 'utf8').split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');
let newEntries = [];
for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  if (parts.length >= 2) {
    const fullName = parts.slice(0, parts.length - 1).join(',').replace(/^"|"$/g, '').trim();
    const email = parts[parts.length - 1].replace(/^"|"$/g, '').trim().toLowerCase();
    if (email) {
      newEntries.push({ full_name: fullName, email_address: email, is_approved: false });
    }
  }
}
console.log('Parsed ' + newEntries.length + ' entries.');
fs.writeFileSync('d:\\Projects\\ondo-admin-directory\\parsed_new_officers.json', JSON.stringify(newEntries, null, 2));
