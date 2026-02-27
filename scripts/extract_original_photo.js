
const fs = require('fs');

const content = fs.readFileSync('Administrative Cadre Directory Profile  (Responses) - Form Responses 1 (1).csv', 'utf8');
const lines = content.split('\n');

const akinrow = lines.find(l => l.toLowerCase().includes('akinrogunde') && l.toLowerCase().includes('omoniyi'));

if (akinrow) {
    // CSV parsing is tricky with quotes, but let's try a simple split first
    // Columns: Timestamp, full_name, email, mda, grade, lga, birthday, photo_url, phone, hobbies, about
    const parts = akinrow.split('","');
    console.log('Original Row Parts:', parts);
    // Usually photo_url is 8th column (index 7)
    // Actually let's just log everything
} else {
    console.log('Akinrogunde not found in CSV.');
}
