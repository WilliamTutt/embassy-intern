const fs = require('fs');

const raw = fs.readFileSync('raw_data.txt', 'utf8');
const blocks = raw.split('---');

const mapData = [];

// Helper to clean pipe-separated table rows
function parseRows(text, ngoName) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
    lines.forEach(line => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 4) {
            let partnerName, lat, lng;
            
            if (ngoName === "11.11.11") {
                partnerName = parts[2];
                lat = parseFloat(parts[3]);
                lng = parseFloat(parts[4]);
            } else if (ngoName === "Solidagro" || ngoName === "TRIAS") {
                partnerName = parts[1];
                lat = parseFloat(parts[2]);
                lng = parseFloat(parts[3]);
            } else if (ngoName === "CSA (Collectif Stratégies Alimentaires)" || ngoName === "VIVA SALUD") {
                partnerName = parts[1];
                lat = parseFloat(parts[2]);
                lng = parseFloat(parts[3]);
            }

            // Remove prefixes like "1. ", "A. ", "A1. "
            partnerName = partnerName.replace(/^([0-9A-Z]{1,2})\.\s/, '');

            if (!isNaN(lat) && !isNaN(lng)) {
                mapData.push({
                    ngo: ngoName,
                    partnerName,
                    coordinates: { lat, lng }
                });
            }
        }
    });
}

parseRows(blocks[0], "11.11.11");
parseRows(blocks[1], "Solidagro");
parseRows(blocks[2], "CSA (Collectif Stratégies Alimentaires)");
parseRows(blocks[3], "VIVA SALUD");
parseRows(blocks[4], "TRIAS");

const output = `const mapData = ${JSON.stringify(mapData, null, 2)};`;
fs.writeFileSync('data.js', output);
console.log(`Generated data.js with ${mapData.length} records.`);
