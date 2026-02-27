
const fs = require('fs');

const content = fs.readFileSync('Administrative Cadre Directory Profile  (Responses) - Form Responses 1 (1).csv', 'utf8');
const lines = content.split('\n');

const akinrow = lines.find(l => l.toLowerCase().includes('akinrogunde') && l.toLowerCase().includes('omoniyi'));

if (akinrow) {
    // Regex to split CSV correctly handling quoted fields
    const parts = akinrow.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

    if (parts) {
        parts.forEach((p, i) => {
            console.log(`${i}: ${p}`);
        });
    } else {
        // Fallback to simple split
        akinrow.split(',').forEach((p, i) => {
            console.log(`${i}: ${p}`);
        });
    }
} else {
    console.log('Not found.');
}
