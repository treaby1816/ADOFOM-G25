
const fs = require('fs');

const content = fs.readFileSync('Administrative Cadre Directory Profile  (Responses) - Form Responses 1 (1).csv', 'utf8');
const lines = content.split('\n');

const akinrow = lines.find(l => l.toLowerCase().includes('akinrogunde') && l.toLowerCase().includes('omoniyi'));

if (akinrow) {
    // Columns are comma separated but fields might have commas inside quotes.
    // A simple way is to split by '","' if that's the separator used after the first field.
    const parts = akinrow.split(',');
    console.log('Row parts count:', parts.length);
    // Index 7 is likely the photo URL (8th column)
    // 0: Timestamp, 1: Name, 2: Email, 3: MDA, 4: Grade, 5: LGA, 6: Birthday, 7: PhotoURL
    console.log('Part 7 (Photo URL?):', parts[7]);
    console.log('Part 8:', parts[8]);

    // Let's print the whole row clearly
    console.log('Full Row:', akinrow);
} else {
    console.log('Akinrogunde not found.');
}
