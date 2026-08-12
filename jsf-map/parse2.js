const fs = require('fs');
const oldData = require('./data.js'); // We'll read the file as a string instead

const dataJsStr = fs.readFileSync('data.js', 'utf8');
const oldMapDataStr = dataJsStr.substring(dataJsStr.indexOf('['), dataJsStr.lastIndexOf(']') + 1);
const oldMapData = JSON.parse(oldMapDataStr);

// Create a coordinate dictionary
const coordsDict = {};
oldMapData.forEach(item => {
    // lowercase for fuzzy matching
    coordsDict[item.location ? item.location.toLowerCase() : item.partnerName.toLowerCase()] = item.coordinates || {lat: item.lat, lng: item.lng};
});

// Hardcode some fallback coords for major regions missing from exact match
const fallbacks = {
    "manila": {lat: 14.5995, lng: 120.9842},
    "pangasinan": {lat: 16.0000, lng: 120.4000},
    "sorsogon": {lat: 12.9810, lng: 123.9996},
    "albay": {lat: 13.1774, lng: 123.5280},
    "camarines sur": {lat: 13.5250, lng: 123.3486},
    "camarines norte": {lat: 14.1025, lng: 122.9530},
    "laguna": {lat: 14.1667, lng: 121.2333},
    "nueva ecija": {lat: 15.5567, lng: 121.0957},
    "zambales": {lat: 15.3272, lng: 119.9772},
    "palawan": {lat: 9.7407, lng: 118.7301},
    "quezon": {lat: 14.1917, lng: 121.7300},
    "bataan": {lat: 14.6761, lng: 120.5361},
    "bulacan": {lat: 14.8444, lng: 120.8117},
    "batangas": {lat: 13.7653, lng: 121.0643},
    "rizal": {lat: 14.5833, lng: 121.1667},
    "mindoro": {lat: 13.2340, lng: 120.6294},
    "isabela": {lat: 16.7000, lng: 121.7000},
    "nueva vizcaya": {lat: 16.4881, lng: 121.1597},
    "cagayan": {lat: 18.2833, lng: 121.8333},
    "cavite": {lat: 14.4933, lng: 120.9083},
    "marinduque": {lat: 13.4483, lng: 121.8418},
    "romblon": {lat: 12.5789, lng: 122.2751},
    "masbate": {lat: 12.3667, lng: 123.6167},
    "iloilo": {lat: 10.7027, lng: 122.5692},
    "negros": {lat: 10.6766, lng: 122.9516},
    "cebu": {lat: 10.3415, lng: 123.8683},
    "bohol": {lat: 9.8594, lng: 124.1975},
    "leyte": {lat: 11.2715, lng: 124.9996},
    "samar": {lat: 11.7950, lng: 124.8968},
    "antique": {lat: 10.7435, lng: 121.9416},
    "misamis": {lat: 8.4542, lng: 124.6319},
    "davao": {lat: 7.1000, lng: 126.2000},
    "agusan": {lat: 8.9406, lng: 125.5340},
    "surigao": {lat: 9.7885, lng: 125.4912},
    "bucas": {lat: 9.6176, lng: 125.9368},
    "zamboanga": {lat: 7.9043, lng: 123.3194},
    "bukidnon": {lat: 8.0515, lng: 124.9230},
    "lanao": {lat: 7.9579, lng: 123.9021},
    "maguindanao": {lat: 6.8581, lng: 124.1486},
    "cotabato": {lat: 6.4974, lng: 124.8472},
    "sarangani": {lat: 5.9300, lng: 124.9900},
    "dinagat": {lat: 10.3253, lng: 125.5572}
};

const getCoords = (locationStr) => {
    let loc = locationStr.toLowerCase();
    for (const key in coordsDict) {
        if (loc.includes(key)) return coordsDict[key];
    }
    for (const key in fallbacks) {
        if (loc.includes(key)) return fallbacks[key];
    }
    return { lat: 12.8797, lng: 121.7740 }; // National default
};

const rawPrompt = fs.readFileSync('prompt2.txt', 'utf8');
const lines = rawPrompt.split('\n').filter(l => l.trim().startsWith('*'));

const newMapData = [];

lines.forEach(line => {
    let text = line.replace(/^\*\s*/, '').trim();
    if (!text.includes(':')) return; // skip
    
    let [locationPart, partnersPart] = text.split(':');
    let locationName = locationPart.trim();
    partnersPart = partnersPart.trim().replace(/\.$/, ''); // remove trailing period

    // Extract exact coords
    const coords = getCoords(locationName);

    // Some lines are NGO -> Partners, others are Province -> Partners
    // If it's Province -> Partners, we parse out the NGOs from the parenthesis
    // Example: Pangasinan: UP Marine Science Institute (TRIAS), ATM, PMCJ
    
    let ngosAssigned = {
        "TRIAS": [],
        "11.11.11": [],
        "Solidagro": [],
        "CSA (Collectif Stratégies Alimentaires)": [],
        "VIVA SALUD": [],
        "We Social Movement (WSM)": []
    };

    if (locationName.includes("11.11.11 Regional") || locationName.includes("11.11.11 Partner")) {
        partnersPart.split(',').forEach(p => ngosAssigned["11.11.11"].push(p.trim().replace(/^and\s/, '')));
    } else if (locationName.includes("Viva Salud")) {
        partnersPart.split(',').forEach(p => ngosAssigned["VIVA SALUD"].push(p.trim().replace(/^and\s/, '')));
    } else if (locationName.includes("WSM Partners")) {
        partnersPart.split(',').forEach(p => ngosAssigned["We Social Movement (WSM)"].push(p.trim().replace(/^and\s/, '')));
    } else if (locationName.includes("CSA Partner")) {
        partnersPart.split(',').forEach(p => ngosAssigned["CSA (Collectif Stratégies Alimentaires)"].push(p.trim().replace(/^and\s/, '')));
    } else if (locationName.includes("TRIAS Partners")) {
        partnersPart.split(',').forEach(p => ngosAssigned["TRIAS"].push(p.trim().replace(/^and\s/, '')));
    } else {
        // Province line
        // Tokenize by commas or 'and'
        let tokens = partnersPart.split(/,(?![^\(\)]*\))| and /).map(t => t.trim()).filter(t => t);
        
        tokens.forEach(token => {
            if (token.includes("(TRIAS)") || token === "TRIAS") {
                ngosAssigned["TRIAS"].push(token.replace("(TRIAS)", "").trim());
            } else if (token.includes("ATM") || token.includes("PMCJ") || token.includes("Synergy Pilipinas")) {
                ngosAssigned["11.11.11"].push(token);
            } else if (token.includes("Solidagro") || token.includes("MASIPAG")) {
                ngosAssigned["Solidagro"].push(token);
            } else if (token.includes("CSA") || token.includes("MASS-SPECC") || token.includes("ACAHP")) {
                ngosAssigned["CSA (Collectif Stratégies Alimentaires)"].push(token);
            } else if (token.includes("(HICO)") || token.includes("GABRIELA")) {
                ngosAssigned["VIVA SALUD"].push(token);
            }
        });
    }

    // Push into map data
    for (const ngo in ngosAssigned) {
        ngosAssigned[ngo].forEach(partner => {
            if (partner && partner !== "") {
                newMapData.push({
                    ngo: ngo,
                    partnerName: partner,
                    location: locationName,
                    coordinates: coords
                });
            }
        });
    }
});

const output = `const mapData = ${JSON.stringify(newMapData, null, 2)};`;
fs.writeFileSync('data.js', output);
console.log(`Generated data.js with ${newMapData.length} records.`);
