// Data Consolidation and Mapping Utilities
// Handles standardizing LGA names to the 18 official LGAs in Ondo State
// and merging synonymous MDA names.

const ONDO_LGAS = [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-East",
    "Akoko South-West",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji/Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo"
];

const LGA_MAPPING: Record<string, string> = {
    // Akoko North-East
    "akoko northeast": "Akoko North-East",
    "akoko north east": "Akoko North-East",
    "akoko n/e": "Akoko North-East",
    "akoko ne": "Akoko North-East",
    // Akoko North-West
    "akoko northwest": "Akoko North-West",
    "akoko north west": "Akoko North-West",
    "akoko n/w": "Akoko North-West",
    "akoko nw": "Akoko North-West",
    // Akoko South-East
    "akoko southeast": "Akoko South-East",
    "akoko south east": "Akoko South-East",
    "akoko s/e": "Akoko South-East",
    "akoko se": "Akoko South-East",
    // Akoko South-West
    "akoko southwest": "Akoko South-West",
    "akoko south west": "Akoko South-West",
    "akoko s/w": "Akoko South-West",
    "akoko sw": "Akoko South-West",
    // Akure North
    "akure north": "Akure North",
    "akure-north": "Akure North",
    "akure n": "Akure North",
    // Akure South
    "akure south": "Akure South",
    "akure-south": "Akure South",
    "akure s": "Akure South",
    // Ese Odo
    "ese odo": "Ese Odo",
    "ese-odo": "Ese Odo",
    "eseodo": "Ese Odo",
    // Idanre
    "idanre": "Idanre",
    // Ifedore
    "ifedore": "Ifedore",
    "ife dore": "Ifedore",
    // Ilaje
    "ilaje": "Ilaje",
    // Ile Oluji/Okeigbo
    "ile oluji/okeigbo": "Ile Oluji/Okeigbo",
    "ile oluji okeigbo": "Ile Oluji/Okeigbo",
    "ile oluji": "Ile Oluji/Okeigbo",
    "okeigbo": "Ile Oluji/Okeigbo",
    "ile-oluji": "Ile Oluji/Okeigbo",
    // Irele
    "irele": "Irele",
    // Odigbo
    "odigbo": "Odigbo",
    // Okitipupa
    "okitipupa": "Okitipupa",
    // Ondo East
    "ondo east": "Ondo East",
    "ondo-east": "Ondo East",
    "ondo e": "Ondo East",
    // Ondo West
    "ondo west": "Ondo West",
    "ondo-west": "Ondo West",
    "ondo w": "Ondo West",
    // Ose
    "ose": "Ose",
    // Owo
    "owo": "Owo",
};

export function normalizeLGA(lgaName: string | null | undefined): string {
    if (!lgaName) return "Unknown LGA";

    // Clean up input
    const cleanName = lgaName.trim().toLowerCase().replace(/\s+/g, " ");

    // Check direct mapping
    if (LGA_MAPPING[cleanName]) {
        return LGA_MAPPING[cleanName];
    }

    // Check partial matches if no direct mapping
    for (const [key, value] of Object.entries(LGA_MAPPING)) {
        if (cleanName.includes(key) || key.includes(cleanName)) {
            return value;
        }
    }

    // If no match found, capitalize words as best effort fallback, 
    // though ideally it should always map to the 18 standard LGAs.
    return lgaName
        .trim()
        .split(/[\s-]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}


const MDA_MAPPING: Record<string, string> = {
    "service matters": "Service Matters Department",
    "service matters dept": "Service Matters Department",
    "service matters dept.": "Service Matters Department",
    "dept of service matters": "Service Matters Department",
    "department of service matters": "Service Matters Department",

    "civil service commission": "Civil Service Commission",
    "csc": "Civil Service Commission",

    "ministry of health": "Ministry of Health",
    "moh": "Ministry of Health",
    "health ministry": "Ministry of Health",

    "ministry of education": "Ministry of Education",
    "moe": "Ministry of Education",
    "education ministry": "Ministry of Education",

    "ministry of agriculture": "Ministry of Agriculture",
    "moa": "Ministry of Agriculture",
    "agriculture ministry": "Ministry of Agriculture",

    "ministry of finance": "Ministry of Finance",
    "mof": "Ministry of Finance",
    "finance ministry": "Ministry of Finance",

    "ministry of works": "Ministry of Works",
    "mow": "Ministry of Works",
    "works ministry": "Ministry of Works",
    "works and infrastructure": "Ministry of Works and Infrastructure",
    "ministry of works & infrastructure": "Ministry of Works and Infrastructure",

    "ministry of justice": "Ministry of Justice",
    "moj": "Ministry of Justice",
    "justice ministry": "Ministry of Justice",

    "ondo state signage and advertisement agency": "Ondo State Signage and Advertisement Agency",
    "ossaa": "Ondo State Signage and Advertisement Agency",

    "board of internal revenue": "Board of Internal Revenue",
    "bir": "Board of Internal Revenue",
    "ondo state board of internal revenue": "Board of Internal Revenue",
    "osbir": "Board of Internal Revenue",

    "hospitals management board": "Hospitals Management Board",
    "hmb": "Hospitals Management Board",

    "teaching service commission": "Teaching Service Commission",
    "tescom": "Teaching Service Commission",

    "local government service commission": "Local Government Service Commission",
    "lgsc": "Local Government Service Commission",
};

export function normalizeMDA(mdaName: string | null | undefined): string {
    if (!mdaName) return "Unknown MDA";

    // Clean up input
    const cleanName = mdaName.trim().toLowerCase().replace(/\s+/g, " ");

    // Check direct mapping
    if (MDA_MAPPING[cleanName]) {
        return MDA_MAPPING[cleanName];
    }

    // Standardize "Ministry of X", "Dept object Y" etc.
    const stylizedName = cleanName
        .split(' ')
        .map(word => {
            if (['of', 'and', '&', 'the', 'in', 'on', 'at', 'to', 'for', 'a', 'an'].includes(word) && word !== cleanName) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ')
        .replace("Dept", "Department")
        .replace("Dept.", "Department");

    return stylizedName;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

export function formatBirthday(bday: string | null | undefined): string {
    if (!bday) return "";
    const clean = bday.trim();

    // Check if it's in MM/DD or M/D format
    if (clean.includes("/") || clean.includes("-")) {
        const parts = clean.split(/[-/]/);
        if (parts.length === 2) {
            const m = parseInt(parts[0], 10);
            const d = parseInt(parts[1], 10);
            if (!isNaN(m) && !isNaN(d) && m >= 1 && m <= 12) {
                return `${MONTH_NAMES[m - 1]}/${d}`; // E.g., March/22
            }
        }
    }

    // Otherwise return as is (e.g. if already "March 22")
    return clean;
}
