const fs = require('fs');

const csvContent = fs.readFileSync('new_officers.csv/ADOFOM E-PLATFORM — Onboarding2 (Responses).csv', 'utf8');
const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('FULL-NAME:'));

const officers = [];

for (const line of lines) {
    // Basic CSV parsing for lines that might have quotes
    let parsed = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            parsed.push(current);
            current = '';
        } else {
            current += line[i];
        }
    }
    parsed.push(current);
    
    if (parsed.length < 2) continue;

    let fullName = parsed[0].replace(/"/g, '').trim();
    const email = parsed[1].replace(/"/g, '').trim().toLowerCase();
    
    if (!email) continue;
    
    // Clean up name like """FEMI-AYODELE, Rachael Oludaisi Iyadunni "
    fullName = fullName.replace(/^"+|"+$/g, '').trim();

    // Format Name: SURNAME, Other Names
    const commaIndex = fullName.indexOf(',');
    let surname = '';
    let otherNames = '';
    
    if (commaIndex !== -1) {
        surname = fullName.substring(0, commaIndex).trim().toUpperCase();
        otherNames = fullName.substring(commaIndex + 1).trim();
    } else {
        const parts = fullName.split(/\s+/);
        if (parts.length > 0) {
            surname = parts[0].toUpperCase();
            otherNames = parts.slice(1).join(' ');
        }
    }
    
    // Capitalize other names
    if (otherNames) {
        otherNames = otherNames.split(/\s+/).map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ');
    }
    
    const finalName = otherNames ? `${surname}, ${otherNames}` : surname;
    
    officers.push({
        email,
        full_name: finalName,
        is_approved: true
    });
}

// Generate the TypeScript code to inject
let injectStr = '';
for (const officer of officers) {
    injectStr += `  "${officer.email}": {\n`;
    injectStr += `    full_name: "${officer.full_name}",\n`;
    injectStr += `    is_approved: true,\n`;
    injectStr += `    current_mda: "Pending Setup",\n`;
    injectStr += `  },\n`;
}

// Read the whitelist file
const whitelistPath = 'src/lib/whitelist-data.ts';
let whitelistContent = fs.readFileSync(whitelistPath, 'utf8');

// Inject before the closing bracket of WHITELIST_OFFICERS
const closingBracketIndex = whitelistContent.lastIndexOf('};');
if (closingBracketIndex !== -1) {
    whitelistContent = whitelistContent.substring(0, closingBracketIndex) + injectStr + '};\n';
    fs.writeFileSync(whitelistPath, whitelistContent);
    console.log(`Successfully added ${officers.length} officers.`);
} else {
    console.error("Could not find closing bracket in whitelist-data.ts");
}
