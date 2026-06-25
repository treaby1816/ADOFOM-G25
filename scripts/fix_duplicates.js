const fs = require('fs');
const file = 'd:\\Projects\\ondo-admin-directory\\src\\lib\\whitelist-data.ts';
let content = fs.readFileSync(file, 'utf8');

const keysToRemove = [
  'debayodan@gmail.com',
  'fagbaanu@gmail.com',
  'nittygirl4real@gmail.com',
  'olubisosea@gmail.com',
  'ebikedasanami@gmail.com',
  'chencocomputers17@gmail.com',
  'pelumifakinlede@outlook.com',
  'alabimayode999@gmail.com'
];

keysToRemove.forEach(key => {
  // We look for exactly how my previous script injected them
  // e.g.   "email@gmail.com": {\n    "full_name": "...",\n    "email_address": "email@gmail.com",\n    "is_approved": false\n  },
  
  // We can just use a regex to match the key and the object block that has is_approved: false
  // Since we know these are exactly the ones we appended.
  const regex = new RegExp(`\\s*"${key}": \\{\\s*"full_name": "[^"]+",\\s*"email_address": "${key}",\\s*"is_approved": false\\s*\\},?`, 'g');
  content = content.replace(regex, '');
});

fs.writeFileSync(file, content, 'utf8');
console.log('Duplicates removed.');
