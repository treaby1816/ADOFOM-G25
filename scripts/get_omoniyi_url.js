
const fs = require('fs');

const content = fs.readFileSync('Administrative Cadre Directory Profile  (Responses) - Form Responses 1 (1).csv', 'utf8');
const lines = content.split('\n');

const akinrow = lines.find(l => l.toLowerCase().includes('akinrogunde') && l.toLowerCase().includes('omoniyi'));

if (akinrow) {
    const parts = akinrow.split(',');
    // In index 7, but let's be careful with commas. 
    // Usually the photo URL is a drive link starting with https://
    const photoUrl = akinrow.match(/https:\/\/drive\.google\.com\/open\?id=[^\s,"]+/);
    if (photoUrl) {
        console.log('FOUND_URL:', photoUrl[0]);
    } else {
        console.log('URL not found in row.');
    }
} else {
    console.log('Akinrogunde not found.');
}
