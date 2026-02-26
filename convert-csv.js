/**
 * CSV Header Converter for Supabase Import
 *
 * Converts Google Form response CSV headers to match the Supabase table columns.
 * Handles multi-line fields (e.g. long "About Me" bios that span multiple CSV lines)
 * and removes completely empty rows.
 *
 * Usage:
 *   node convert-csv.js <input.csv> [output.csv]
 *
 * If no output file is specified, it defaults to "converted_output.csv".
 */

const fs = require('fs');
const path = require('path');

// ── Header mapping: trimmed/lowercased CSV header → Supabase column name ──
const HEADER_MAP = {
    'timestamp': null, // drop this column
    'full name': 'full_name',
    'email address': 'email_address',
    'professional photograph': 'photo_url',
    'current mda': 'current_mda',
    'position/grade level': 'grade_level',
    'local government area (lga)': 'lga',
    'date of birth': 'birth_month_day',
    'whatsapp phone number': 'phone_number',
    'hobbies & interests': 'hobbies',
    'about me (professional bio)': 'about_me',
};

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Properly parse an entire CSV string, handling quoted fields that may contain
 * newlines, commas, and escaped quotes.
 */
function parseCSV(text) {
    const rows = [];
    let current = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < text.length && text[i + 1] === '"') {
                    field += '"';
                    i++; // skip escaped quote
                } else {
                    inQuotes = false;
                }
            } else {
                field += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ',') {
                current.push(field);
                field = '';
            } else if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
                if (ch === '\r') i++; // skip \r in \r\n
                current.push(field);
                field = '';
                rows.push(current);
                current = [];
            } else {
                field += ch;
            }
        }
    }
    // Push last field & row
    current.push(field);
    if (current.length > 1 || current[0].trim() !== '') {
        rows.push(current);
    }

    return rows;
}

function escapeCSVField(value) {
    // Flatten any internal newlines into spaces so each record is one line
    let s = (value || '').toString().replace(/[\r\n]+/g, ' ').trim();
    if (s.includes(',') || s.includes('"')) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

function isEmptyRow(fields) {
    return fields.every(f => f.trim() === '');
}

/**
 * Detect "overflow" rows — lines that are NOT empty but are missing most fields.
 * These are continuation text from a multi-line field that wasn't properly quoted.
 * We merge them back into the previous valid row's last non-empty field.
 */
function isOverflowRow(fields, expectedCols) {
    if (fields.length < expectedCols) return true;
    // If the first field has content but most others are empty, it's likely overflow
    const nonEmpty = fields.filter(f => f.trim() !== '').length;
    return nonEmpty <= 2 && fields.length >= expectedCols;
}

// ── Main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('Usage: node convert-csv.js <input.csv> [output.csv]');
    process.exit(1);
}

const inputFile = path.resolve(args[0]);
const outputFile = path.resolve(args[1] || 'converted_output.csv');

if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found → ${inputFile}`);
    process.exit(1);
}

const raw = fs.readFileSync(inputFile, 'utf-8');
const allRows = parseCSV(raw);

if (allRows.length === 0) {
    console.error('Error: CSV file is empty.');
    process.exit(1);
}

// Parse the header row
const originalHeaders = allRows[0];
const expectedCols = originalHeaders.length;

// Build the index map
const columnPlan = originalHeaders.map(h => {
    const key = h.trim().toLowerCase();
    if (key in HEADER_MAP) {
        return HEADER_MAP[key]; // null means "drop"
    }
    console.warn(`⚠  Unknown header "${h}" — kept as "${key.replace(/\s+/g, '_')}"`);
    return key.replace(/\s+/g, '_');
});

// Indices to keep (non-null)
const keepIndices = columnPlan
    .map((col, i) => (col !== null ? i : -1))
    .filter(i => i !== -1);

const newHeaders = keepIndices.map(i => columnPlan[i]);

// ── Clean data rows: merge overflow lines, skip empty rows ──────────────
const cleanedRows = [];
let skippedEmpty = 0;
let mergedOverflow = 0;

for (let r = 1; r < allRows.length; r++) {
    const row = allRows[r];

    // Skip completely empty rows
    if (isEmptyRow(row)) {
        skippedEmpty++;
        continue;
    }

    // If it looks like an overflow/continuation row, merge into previous
    if (isOverflowRow(row, expectedCols) && cleanedRows.length > 0) {
        const prev = cleanedRows[cleanedRows.length - 1];
        // Find the overflow text (first non-empty field)
        const overflowText = row.find(f => f.trim() !== '') || '';
        if (overflowText) {
            // Append to the last field of the previous row (usually "about_me")
            const lastIdx = prev.length - 1;
            prev[lastIdx] = (prev[lastIdx] + ' ' + overflowText.trim()).trim();
        }
        mergedOverflow++;
        continue;
    }

    // Normal row — pad to expected column count if needed
    while (row.length < expectedCols) row.push('');
    cleanedRows.push(row);
}

// ── Build output ────────────────────────────────────────────────────────────
const outputLines = [newHeaders.map(escapeCSVField).join(',')];

for (const row of cleanedRows) {
    const mapped = keepIndices.map(i => escapeCSVField(row[i] || ''));
    outputLines.push(mapped.join(','));
}

fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

console.log(`\n✅ Conversion complete!`);
console.log(`   Input:           ${inputFile}`);
console.log(`   Output:          ${outputFile}`);
console.log(`   Valid rows:      ${cleanedRows.length}`);
console.log(`   Empty removed:   ${skippedEmpty}`);
console.log(`   Overflow merged: ${mergedOverflow}`);
console.log(`   Columns:         ${newHeaders.join(', ')}`);
