document.addEventListener("DOMContentLoaded", async () => {
    // State
    let currentYear = 2026;
    let currentMonth = 0; // 0 = Full Year Poster, 1-12 = Specific Month
    let showAcademic = true;
    let showEconomic = true;
    let showDemocracy = true;
    let showVisits = true;
    let showBelgianDays = true;

    // Fetch Live Data from Google Sheets CSV
    let holidayData = {};
    const sheetCsvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2GkYQG5XHRr49-funrZZ1heRplc3mUuKlLLi6otj-FMv_reH6FfFz6RbxuwlHW8v_Bn6IIqGDfHHT/pub?gid=0&single=true&output=csv";
    
    try {
        const resp = await fetch(sheetCsvUrl);
        if (!resp.ok) throw new Error("HTTP " + resp.status);
        
        const csvText = await resp.text();
        console.log("Raw CSV content from Google Sheets:\n", csvText);
        
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        console.log("Parsed JSON data:\n", parsed.data);
        
        // Group by year
        parsed.data.forEach(row => {
            const dateRaw = row.Date;
            if (!dateRaw) return;
            
            // Normalize date to YYYY-MM-DD format
            const d = new Date(dateRaw);
            if (isNaN(d.getTime())) return;
            
            const year = d.getFullYear().toString();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            if (!holidayData[year]) holidayData[year] = [];
            
            holidayData[year].push({
                date: dateStr,
                name: row.Name,
                type: row.Type,
                flag: row.Flag,
                desc: row.Description
            });
        });
        console.log("Loaded live data from Google Sheets");
    } catch (e) {
        console.warn("Could not fetch from Google Sheets. Using fallback data.", e);
        if (typeof embassyHolidays !== "undefined") {
            holidayData = embassyHolidays;
        }
    }

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayShortNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // UI Elements
    const yearSelect = document.getElementById("year-select");
    const monthSelect = document.getElementById("month-select");
    const checkAcademic = document.getElementById("check-academic");
    const checkEconomic = document.getElementById("check-economic");
    const checkDemocracy = document.getElementById("check-democracy");
    const checkVisits = document.getElementById("check-visits");
    const checkBelgianDays = document.getElementById("check-belgian-days");
    const posterCanvas = document.getElementById("poster-canvas");
    const posterContent = document.getElementById("poster-content");
    const exportBtn = document.getElementById("export-btn");

    // Modal Elements
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close");

    // Helper: Get holidays for selected year filtered by user settings
    function getActiveHolidays(year) {
        const yearHolidays = (holidayData[year] || []);
        return yearHolidays.filter(h => {
            if (h.type === "academic" && !showAcademic) return false;
            if (h.type === "economic" && !showEconomic) return false;
            if (h.type === "democracy" && !showDemocracy) return false;
            if (h.type === "visits" && !showVisits) return false;
            if (h.type === "belgian_days" && !showBelgianDays) return false;
            return true;
        });
    }

    // Helper: Map holidays by YYYY-MM-DD string
    function getHolidaysMap(year) {
        const holidays = getActiveHolidays(year);
        const map = {};
        holidays.forEach(h => {
            if (!map[h.date]) map[h.date] = [];
            map[h.date].push(h);
        });
        return map;
    }

    function formatConsolidatedDate(dates) {
        if (dates.length === 1) {
            const d = new Date(dates[0]);
            return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        }
        
        dates.sort();
        const start = new Date(dates[0]);
        const end = new Date(dates[dates.length - 1]);
        
        const startMonth = start.toLocaleDateString("en-US", { month: "short" });
        const startDay = start.toLocaleDateString("en-US", { day: "2-digit" });
        const endMonth = end.toLocaleDateString("en-US", { month: "short" });
        const endDay = end.toLocaleDateString("en-US", { day: "2-digit" });

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay}–${endDay}`;
        } else {
            return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
        }
    }

    function groupEventsByCategory(holidaysMap) {
        const categories = {
            "economic": { title: "Economic & Maritime Cooperation", events: [] },
            "democracy": { title: "Democracy, Human Rights & Governance", events: [] },
            "academic": { title: "Academic & Public Diplomacy", events: [] },
            "visits": { title: "Visits & Missions", events: [] },
            "belgian_days": { title: "Belgian Days", events: [] },
            "custom": { title: "Other / Custom Events", events: [] }
        };
        
        const allEvents = [];
        Object.values(holidaysMap).forEach(eventArray => {
            allEvents.push(...eventArray);
        });
        allEvents.sort((a, b) => a.date.localeCompare(b.date));
        
        const eventGroups = {};
        allEvents.forEach(evt => {
            const type = evt.type;
            const key = `${type}_${evt.name}`;
            if (!eventGroups[key]) {
                eventGroups[key] = { ...evt, dates: [evt.date] };
            } else {
                eventGroups[key].dates.push(evt.date);
            }
        });
        
        Object.values(eventGroups).forEach(group => {
            const dateStr = formatConsolidatedDate(group.dates);
            if (categories[group.type]) {
                categories[group.type].events.push({
                    dateStr: dateStr,
                    name: group.name,
                    dates: group.dates
                });
            }
        });

        Object.values(categories).forEach(cat => {
            cat.events.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));
        });
        
        return categories;
    }

    function renderMonthBox(year, monthIndex, holidaysMap) {
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        let monthHtml = `
            <div class="month-box">
                <div class="month-title">${monthNames[monthIndex]}</div>
                <div class="month-calendar-grid">
        `;

        dayShortNames.forEach(d => {
            monthHtml += `<div class="day-name">${d}</div>`;
        });

        for (let i = 0; i < firstDay; i++) {
            monthHtml += `<div class="day-cell other-month"></div>`;
        }

        const categoryPastels = {
            academic: "rgba(34, 197, 94, 0.25)",
            economic: "rgba(168, 85, 247, 0.25)",
            democracy: "rgba(234, 179, 8, 0.25)",
            visits: "rgba(249, 115, 22, 0.25)",
            belgian_days: "rgba(56, 189, 248, 0.25)",
            custom: "rgba(253, 218, 36, 0.35)"
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const holidays = holidaysMap[dateStr];
            const dayOfWeek = (firstDay + day - 1) % 7;
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

            let classes = ["day-cell"];
            if (isWeekend) classes.push("weekend");

            let styleStr = "";
            let titleStr = dateStr;

            if (holidays && holidays.length > 0) {
                classes.push("has-holiday");
                titleStr = holidays.map(h => h.name).join(" | ");

                // If only 1 type of event, use the original CSS class
                const uniqueTypes = [...new Set(holidays.map(h => h.type))];
                
                if (uniqueTypes.length === 1) {
                    const type = uniqueTypes[0];
                    if (type === "belgian_days") classes.push("event-belgian-days");
                    else classes.push("event-" + type);
                } else {
                    // For multiple types, use a gradient of pastels and dark text
                    const colors = uniqueTypes.map(type => categoryPastels[type] || "#eee");
                    if (colors.length === 2) {
                        styleStr = `background: linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%); color: #0f172a; border: 1px solid #94a3b8;`;
                    } else if (colors.length === 3) {
                        styleStr = `background: linear-gradient(135deg, ${colors[0]} 33%, ${colors[1]} 33% 66%, ${colors[2]} 66%); color: #0f172a; border: 1px solid #94a3b8;`;
                    } else {
                        styleStr = `background: linear-gradient(135deg, ${colors[0]} 25%, ${colors[1]} 25% 50%, ${colors[2]} 50% 75%, ${colors[3]} 75%); color: #0f172a; border: 1px solid #94a3b8;`;
                    }
                }
            }

            monthHtml += `
                <div class="${classes.join(' ')}" data-date="${dateStr}" title="${titleStr}" style="${styleStr}">
                    <span>${day}</span>
                </div>
            `;
        }

        monthHtml += `
                </div>
            </div>
        `;
        return monthHtml;
    }

    function renderHolidaysSummary(year, categories) {
        let summaryHtml = `
            <div class="events-summary-box">
                <div class="events-summary-title">Official Calendar Legend & Notes ${year}</div>
                <div class="events-summary-grid-grouped">
        `;

        const order = ["economic", "democracy", "academic", "visits", "belgian_days", "custom"];
        
        order.forEach(type => {
            const cat = categories[type];
            if (cat.events.length === 0) return;
            
            summaryHtml += `
                <div class="legend-category">
                    <h3 class="legend-header ${type}-header">${cat.title}</h3>
                    <ul class="legend-list">
            `;
            cat.events.forEach(evt => {
                summaryHtml += `<li><span class="legend-date">${evt.dateStr}:</span> <span class="legend-name">${evt.name}</span></li>`;
            });
            summaryHtml += `
                    </ul>
                </div>
            `;
        });

        summaryHtml += `
                </div>
            </div>
        `;
        
        const economicCat = categories["economic"];
        if (economicCat.events.length > 0) {
            summaryHtml += `
                <div class="stakeholder-section-poster">
                    <div class="events-summary-title table-header">Combined Calendar for Economic Stakeholders</div>
                    <table class="stakeholder-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Initiative</th>
                                <th>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            economicCat.events.forEach(evt => {
                let owner = "Embassy of Belgium";
                if (evt.name.toLowerCase().includes("belgian trade office")) {
                    owner = "Belgian Trade Office";
                } else if (evt.name.toLowerCase().includes("atomnia")) {
                    owner = "Atomnia";
                } else if (evt.name.toLowerCase().includes("adb")) {
                    owner = "ADB";
                }
                
                summaryHtml += `
                            <tr>
                                <td>${evt.dateStr}</td>
                                <td>${evt.name}</td>
                                <td>${owner}</td>
                            </tr>
                `;
            });
            summaryHtml += `
                        </tbody>
                    </table>
                </div>
            `;
        }

        return summaryHtml;
    }

    function renderYearPoster(year) {
        const holidaysMap = getHolidaysMap(year);
        const categories = groupEventsByCategory(holidaysMap);
        
        let html = `
            <div class="poster-header">
                <div class="poster-header-titles">
                    <h1>Embassy Official Calendar ${year}</h1>
                    <p>Kingdom of Belgium • Embassy in Manila, Philippines</p>
                </div>
                <div class="poster-header-crest">
                    <div class="coat">B</div>
                    <div>Manila</div>
                </div>
            </div>
            
            <div class="year-grid">
        `;

        for (let m = 0; m < 12; m++) {
            html += renderMonthBox(year, m, holidaysMap);
        }

        html += `</div>`;

        html += renderHolidaysSummary(year, categories);

        posterContent.innerHTML = html;
        attachDayCellClickListeners(holidaysMap);
    }

    // Attach click events to day cells to view events
    function attachDayCellClickListeners(holidaysMap) {
        document.querySelectorAll(".day-cell[data-date]").forEach(cell => {
            cell.addEventListener("click", () => {
                const date = cell.getAttribute("data-date");
                const holidays = holidaysMap[date];
                
                if (holidays && holidays.length > 0) {
                    const existingHtml = holidays.map(h => `<div style="padding: 10px; background: #f8fafc; border-left: 3px solid var(--belgium-red); margin-bottom: 8px; border-radius: 6px; font-size: 0.95rem;"><strong>${h.name}</strong><br><span style="color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; display: inline-block;">${h.type.replace('_', ' ')}</span></div>`).join('');
                    document.getElementById("modal-existing-events").innerHTML = existingHtml;
                    document.getElementById("modal-main-header").textContent = "Events for " + date;
                    modalOverlay.classList.add("active");
                }
            });
        });
    }

    // Render Calendar
    function render() {
        renderYearPoster(currentYear);
    }

    // Event Listeners
    yearSelect.addEventListener("change", (e) => {
        currentYear = parseInt(e.target.value);
        render();
    });

    monthSelect.addEventListener("change", (e) => {
        currentMonth = parseInt(e.target.value);
        render();
    });

    checkAcademic.addEventListener("change", (e) => {
        showAcademic = e.target.checked;
        render();
    });

    checkEconomic.addEventListener("change", (e) => {
        showEconomic = e.target.checked;
        render();
    });

    checkDemocracy.addEventListener("change", (e) => {
        showDemocracy = e.target.checked;
        render();
    });

    checkVisits.addEventListener("change", (e) => {
        showVisits = e.target.checked;
        render();
    });

    checkBelgianDays.addEventListener("change", (e) => {
        showBelgianDays = e.target.checked;
        render();
    });

    // Modal actions
    modalCloseBtn.addEventListener("click", () => {
        modalOverlay.classList.remove("active");
    });

    // Export to Word
    const exportWordBtn = document.getElementById("export-word-btn");
    exportWordBtn.addEventListener("click", () => {
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Embassy Calendar Export</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + posterContent.innerHTML + footer;
        
        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `Belgian_Embassy_Calendar_${currentYear}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    });

    // High Resolution PDF Export
    exportBtn.addEventListener("click", async () => {
        exportBtn.textContent = "Generating PDF...";

        await new Promise(r => setTimeout(r, 300));

        try {
            const { jsPDF } = window.jspdf;
            const canvas = await html2canvas(posterCanvas, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#fdfcf7"
            });

            const imgData = canvas.toDataURL("image/png");
            
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? "l" : "p",
                unit: "px",
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save(`Belgian_Embassy_Calendar_${currentYear}.pdf`);

        } catch (err) {
            console.error("PDF generation failed:", err);
            alert("Export failed. Please try again.");
        } finally {
            exportBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download PDF Poster`;
        }
    });

    // Initial render
    render();
});
