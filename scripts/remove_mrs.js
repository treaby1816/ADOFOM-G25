const fs = require('fs');
const path = require('path');

const files = [
  'parsed_new_officers.json',
  'src/lib/whitelist-data.ts',
  'scripts/insert_new_officers.sql',
  'scripts/fix_officer_names.sql'
];

files.forEach(file => {
  const filePath = path.join('d:\\Projects\\ondo-admin-directory', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(/ADEGOKE, Folasade Abimbola Mrs/g, 'ADEGOKE, Folasade Abimbola');
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
