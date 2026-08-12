/**
 * Belgian & Philippine Official Holidays dataset for Embassy Calendar
 * Includes Belgian National Holidays, PH Public Holidays, and Embassy Closures.
 */

const embassyHolidays = {
    // 2026 Holidays
    2026: [
        // January
        { date: "2026-01-01", name: "New Year's Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "National Holiday in Belgium & Philippines" },
        { date: "2026-01-02", name: "Embassy New Year Recess", type: "embassy", flag: "🏛️", desc: "Embassy Official Closure" },
        { date: "2026-01-23", name: "First Philippine Republic Day", type: "ph", flag: "🇵🇭", desc: "Special Working Holiday (PH)" },

        // February
        { date: "2026-02-17", name: "Chinese New Year", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2026-02-25", name: "EDSA People Power Anniversary", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },

        // April
        { date: "2026-04-02", name: "Maundy Thursday", type: "ph", flag: "🇵🇭", desc: "Holy Week (PH)" },
        { date: "2026-04-03", name: "Good Friday", type: "both", flag: "🇧🇪 🇵🇭", desc: "Holy Week / Good Friday" },
        { date: "2026-04-05", name: "Easter Sunday", type: "be", flag: "🇧🇪", desc: "Pâques / Pasen (BE)" },
        { date: "2026-04-06", name: "Easter Monday", type: "be", flag: "🇧🇪", desc: "Lundi de Pâques / Paasmaandag (BE)" },
        { date: "2026-04-09", name: "Day of Valor (Araw ng Kagitingan)", type: "ph", flag: "🇵🇭", desc: "National Holiday (PH)" },

        // May
        { date: "2026-05-01", name: "Labour Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Fête du Travail / Araw ng Manggagawa" },
        { date: "2026-05-14", name: "Ascension Day", type: "be", flag: "🇧🇪", desc: "Ascension / O.L.V. Hemelvaart (BE)" },
        { date: "2026-05-24", name: "Whit Sunday (Pentecost)", type: "be", flag: "🇧🇪", desc: "Pentecôte / Pinksteren (BE)" },
        { date: "2026-05-25", name: "Whit Monday", type: "be", flag: "🇧🇪", desc: "Lundi de Pentecôte / Pinkstermaandag (BE)" },

        // June
        { date: "2026-06-12", name: "Philippine Independence Day", type: "ph", flag: "🇵🇭", desc: "Araw ng Kalayaan (PH National Day)" },
        { date: "2026-06-17", name: "Eid al-Adha (Feast of Sacrifice)", type: "ph", flag: "🇵🇭", desc: "Islamic Holiday (PH)" },

        // July
        { date: "2026-07-11", name: "Flemish Community Day", type: "be", flag: "🇧🇪", desc: "Feest van de Vlaamse Gemeenschap (BE Regional)" },
        { date: "2026-07-21", name: "Belgian National Day", type: "be", flag: "🇧🇪 🏛️", desc: "Fête Nationale Belge / Nationale Feestdag (Official BE Day)" },

        // August
        { date: "2026-08-15", name: "Assumption of Mary", type: "be", flag: "🇧🇪", desc: "Assomption / O.L.V. Hemelvaart (BE)" },
        { date: "2026-08-21", name: "Ninoy Aquino Day", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2026-08-31", name: "National Heroes Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" },

        // September
        { date: "2026-09-27", name: "French Community Day", type: "be", flag: "🇧🇪", desc: "Fête de la Communauté française (BE Regional)" },

        // November
        { date: "2026-11-01", name: "All Saints' Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Toussaint / Allerheiligen" },
        { date: "2026-11-02", name: "All Souls' Day", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2026-11-11", name: "Armistice Day 1918", type: "be", flag: "🇧🇪 🏛️", desc: "WWI Armistice Commemoration (BE)" },
        { date: "2026-11-15", name: "King's Feast (Fête du Roi)", type: "be", flag: "🇧🇪 🏛️", desc: "Dynasty Day / Feest van de Koning (BE Embassy Observance)" },
        { date: "2026-11-30", name: "Bonifacio Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" },

        // December
        { date: "2026-12-08", name: "Feast of the Immaculate Conception", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2026-12-24", name: "Christmas Eve (Embassy Half-Day)", type: "embassy", flag: "🏛️", desc: "Embassy Special Hours" },
        { date: "2026-12-25", name: "Christmas Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Noël / Kerstmis / Pasko" },
        { date: "2026-12-26", name: "Boxing Day / St. Stephen", type: "be", flag: "🇧🇪", desc: "Saint-Étienne / Tweede Kerstdag (BE)" },
        { date: "2026-12-30", name: "Rizal Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" },
        { date: "2026-12-31", name: "New Year's Eve", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" }
    ],

    // 2027 Holidays
    2027: [
        { date: "2027-01-01", name: "New Year's Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "National Holiday in Belgium & Philippines" },
        { date: "2027-02-06", name: "Chinese New Year", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2027-02-25", name: "EDSA People Power Anniversary", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2027-03-25", name: "Maundy Thursday", type: "ph", flag: "🇵🇭", desc: "Holy Week (PH)" },
        { date: "2027-03-26", name: "Good Friday", type: "both", flag: "🇧🇪 🇵🇭", desc: "Holy Week / Good Friday" },
        { date: "2027-03-28", name: "Easter Sunday", type: "be", flag: "🇧🇪", desc: "Pâques / Pasen (BE)" },
        { date: "2027-03-29", name: "Easter Monday", type: "be", flag: "🇧🇪", desc: "Lundi de Pâques / Paasmaandag (BE)" },
        { date: "2027-04-09", name: "Day of Valor (Araw ng Kagitingan)", type: "ph", flag: "🇵🇭", desc: "National Holiday (PH)" },
        { date: "2027-05-01", name: "Labour Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Fête du Travail / Araw ng Manggagawa" },
        { date: "2027-05-06", name: "Ascension Day", type: "be", flag: "🇧🇪", desc: "Ascension / O.L.V. Hemelvaart (BE)" },
        { date: "2027-05-17", name: "Whit Monday", type: "be", flag: "🇧🇪", desc: "Lundi de Pentecôte (BE)" },
        { date: "2027-06-12", name: "Philippine Independence Day", type: "ph", flag: "🇵🇭", desc: "Araw ng Kalayaan (PH National Day)" },
        { date: "2027-07-21", name: "Belgian National Day", type: "be", flag: "🇧🇪 🏛️", desc: "Fête Nationale Belge (Official BE Day)" },
        { date: "2027-08-15", name: "Assumption of Mary", type: "be", flag: "🇧🇪", desc: "Assomption (BE)" },
        { date: "2027-08-21", name: "Ninoy Aquino Day", type: "ph", flag: "🇵🇭", desc: "Special Non-Working Day (PH)" },
        { date: "2027-08-30", name: "National Heroes Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" },
        { date: "2027-11-01", name: "All Saints' Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Toussaint / Allerheiligen" },
        { date: "2027-11-11", name: "Armistice Day 1918", type: "be", flag: "🇧🇪 🏛️", desc: "WWI Armistice (BE)" },
        { date: "2027-11-15", name: "King's Feast (Fête du Roi)", type: "be", flag: "🇧🇪 🏛️", desc: "Dynasty Day (BE)" },
        { date: "2027-11-30", name: "Bonifacio Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" },
        { date: "2027-12-25", name: "Christmas Day", type: "both", flag: "🇧🇪 🇵🇭", desc: "Noël / Kerstmis / Pasko" },
        { date: "2027-12-30", name: "Rizal Day", type: "ph", flag: "🇵🇭", desc: "Regular Holiday (PH)" }
    ]
};
