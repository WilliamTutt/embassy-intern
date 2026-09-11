document.addEventListener("DOMContentLoaded", async () => {
    // State
    let currentYear = 2026;
    let currentMonth = 0; // 0 = Full Year Poster, 1-12 = Specific Month
    let showAcademic = true;
    let showEconomic = true;
    let showDemocracy = true;
    let showVisits = true;
    let showBelgianDays = true;
    let showMasterTable = true;

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
                desc: row.Description,
                eventSource: row['Event Source'] || '',
                commType: row['Communication Type'] || '',
                commPlatform: row['Communication Platform'] || '',
                priorityTheme: row['Priority Theme'] || '',
                urgency: row['Urgency'] || ''
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
    const exportIgBtn = document.getElementById("export-ig-btn");
    const igExportWrapper = document.getElementById("ig-export-wrapper");

    // Modal Elements
    const modalOverlay = document.getElementById("modal-overlay");
    const modalCloseBtn = document.getElementById("modal-close");

    // Helper: Get holidays for selected year filtered by user settings
    function getActiveHolidays(year) {
        const yearHolidays = (holidayData[year] || []);
        
        // Read advanced filters dynamically from DOM
        const allowedSources = Array.from(document.querySelectorAll('.filter-source:checked')).map(cb => cb.value);
        const allowedCommTypes = Array.from(document.querySelectorAll('.filter-comm-type:checked')).map(cb => cb.value);
        const allowedUrgencies = Array.from(document.querySelectorAll('.filter-urgency:checked')).map(cb => cb.value);

        return yearHolidays.filter(h => {
            if (h.type === "academic" && !showAcademic) return false;
            if (h.type === "economic" && !showEconomic) return false;
            if (h.type === "democracy" && !showDemocracy) return false;
            if (h.type === "visits" && !showVisits) return false;
            if (h.type === "belgian_days" && !showBelgianDays) return false;
            
            if (!allowedSources.includes(h.eventSource || '')) return false;
            if (!allowedCommTypes.includes(h.commType || '')) return false;
            if (!allowedUrgencies.includes(h.urgency || '')) return false;

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
                    ...group,
                    dateStr: dateStr
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
        
        // Combined Calendar for Economic Stakeholders
        const economicEvents = categories["economic"] ? categories["economic"].events : [];
        if (economicEvents.length > 0) {
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
            economicEvents.forEach(evt => {
                const owner = evt.eventSource || "Embassy of Belgium";
                summaryHtml += `
                            <tr>
                                <td style="white-space: nowrap;">${evt.dateStr}</td>
                                <td><strong>${evt.name}</strong></td>
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

    function renderMasterTable(categories) {
        let tableHtml = '';
        const allEventsForTable = [];
        Object.values(categories).forEach(cat => {
            allEventsForTable.push(...cat.events);
        });
        allEventsForTable.sort((a, b) => a.dates[0].localeCompare(b.dates[0]));

        if (allEventsForTable.length > 0) {
            tableHtml += `
                <div class="stakeholder-section-poster">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div class="events-summary-title table-header" style="margin-bottom: 0;">Master Communications & Planning Table</div>
                        <button id="toggle-master-table-btn" style="background: var(--belgium-black); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;">
                            ${showMasterTable ? 'Hide Table' : 'Show Table'}
                        </button>
                    </div>
            `;
            
            if (showMasterTable) {
                tableHtml += `
                    <table class="stakeholder-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Initiative</th>
                                <th>Category</th>
                                <th>Source / Owner</th>
                                <th>Comm. Type</th>
                                <th>Platform</th>
                                <th>Urgency</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                allEventsForTable.forEach(evt => {
                    const owner = evt.eventSource || "Embassy of Belgium";
                    const commType = evt.commType || "-";
                    const platform = evt.commPlatform || "-";
                    const urgency = evt.urgency || "-";
                    const typeStr = evt.type ? evt.type.replace('_', ' ').toUpperCase() : "-";
                    
                    tableHtml += `
                                <tr>
                                    <td style="white-space: nowrap;">${evt.dateStr}</td>
                                    <td><strong>${evt.name}</strong></td>
                                    <td style="font-size: 0.8rem; color: #64748b;">${typeStr}</td>
                                    <td>${owner}</td>
                                    <td>${commType}</td>
                                    <td>${platform}</td>
                                    <td><span style="${urgency.toLowerCase().includes('urgent') || urgency.toLowerCase() === 'time sensitive' ? 'color: #e11d48; font-weight: 600;' : ''}">${urgency}</span></td>
                                </tr>
                    `;
                });
                tableHtml += `
                            </tbody>
                        </table>
                `;
            }
            tableHtml += `
                </div>
            `;
        }
        document.getElementById("master-table-container").innerHTML = tableHtml;
        
        const toggleBtn = document.getElementById("toggle-master-table-btn");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                showMasterTable = !showMasterTable;
                render();
            });
        }
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
        
        renderMasterTable(categories);
    }

    // Attach click events to day cells to view events
    function attachDayCellClickListeners(holidaysMap) {
        document.querySelectorAll(".day-cell[data-date]").forEach(cell => {
            cell.addEventListener("click", () => {
                const date = cell.getAttribute("data-date");
                const holidays = holidaysMap[date];
                
                if (holidays && holidays.length > 0) {
                    const existingHtml = holidays.map(h => {
                        let details = '';
                        if (h.eventSource) details += `<div><strong>Source:</strong> ${h.eventSource}</div>`;
                        if (h.priorityTheme) details += `<div><strong>Priority Theme:</strong> ${h.priorityTheme}</div>`;
                        if (h.commType || h.commPlatform) details += `<div><strong>Comm:</strong> ${h.commType} ${h.commPlatform ? `(${h.commPlatform})` : ''}</div>`;
                        if (h.urgency) details += `<div><strong>Urgency:</strong> <span style="${h.urgency.toLowerCase().includes('urgent') || h.urgency.toLowerCase() === 'time sensitive' ? 'color: #e11d48; font-weight: bold;' : ''}">${h.urgency}</span></div>`;
                        
                        return `<div style="padding: 15px; background: #f8fafc; border-left: 4px solid var(--belgium-red); margin-bottom: 12px; border-radius: 6px;">
                                    <strong style="font-size: 1.1rem; color: var(--belgium-black);">${h.name}</strong>
                                    <div style="color: #64748b; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin: 6px 0;">${h.desc || h.type.replace('_', ' ')}</div>
                                    ${details ? `<div style="font-size: 0.9rem; color: #475569; margin-top: 10px; display: flex; flex-direction: column; gap: 4px; padding-top: 10px; border-top: 1px solid #e2e8f0;">${details}</div>` : ''}
                                </div>`;
                    }).join('');
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
        renderAssetGenerators();
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

    const commPlatformSelect = document.getElementById("comm-platform-select");
    if (commPlatformSelect) {
        commPlatformSelect.addEventListener("change", (e) => {
            const val = e.target.value;
            
            const social = document.getElementById("social-media-container");
            const email = document.getElementById("email-blasts-container");
            const privateComm = document.getElementById("private-comm-container");
            const traditional = document.getElementById("traditional-media-container");
            const igStyleWrapper = document.getElementById("ig-style-wrapper");
            
            if (val === "ALL") {
                social.style.display = "block";
                email.style.display = "block";
                privateComm.style.display = "block";
                traditional.style.display = "block";
                igStyleWrapper.style.display = "block";
            } else {
                social.style.display = val.includes("Social Media") ? "block" : "none";
                email.style.display = val.includes("Email Blasts") ? "block" : "none";
                privateComm.style.display = val.includes("Private") ? "block" : "none";
                traditional.style.display = val.includes("Traditional") ? "block" : "none";
                igStyleWrapper.style.display = val.includes("Social Media") ? "block" : "none";
            }
        });
    }

    const igStyleSelect = document.getElementById("ig-style-select");
    igStyleSelect.addEventListener("change", renderAssetGenerators);

    document.querySelectorAll('.filter-source, .filter-comm-type, .filter-urgency').forEach(cb => {
        cb.addEventListener('change', render);
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

    function renderAssetGenerators() {
        const selectedMonth = monthSelect.value;
        const currentYear = yearSelect.value;
        
        const igEmptyState = document.getElementById("ig-empty-state");
        const igPreviewContent = document.getElementById("ig-preview-content");
        
        const emailEmptyState = document.getElementById("email-empty-state");
        const emailPreviewContent = document.getElementById("email-preview-content");
        
        const privateEmptyState = document.getElementById("private-empty-state");
        const privatePreviewContent = document.getElementById("private-preview-content");
        
        const traditionalEmptyState = document.getElementById("traditional-empty-state");
        const traditionalPreviewContent = document.getElementById("traditional-preview-content");
        
        if (selectedMonth === "0") {
            igEmptyState.style.display = "block";
            igPreviewContent.style.display = "none";
            igExportWrapper.innerHTML = '';
            
            emailEmptyState.style.display = "block";
            emailPreviewContent.style.display = "none";
            
            privateEmptyState.style.display = "block";
            privatePreviewContent.style.display = "none";
            
            traditionalEmptyState.style.display = "block";
            traditionalPreviewContent.style.display = "none";
            
            return;
        }
        
        igEmptyState.style.display = "none";
        igPreviewContent.style.display = "block";
        
        emailEmptyState.style.display = "none";
        emailPreviewContent.style.display = "block";
        
        privateEmptyState.style.display = "none";
        privatePreviewContent.style.display = "block";
        
        traditionalEmptyState.style.display = "none";
        traditionalPreviewContent.style.display = "block";
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[parseInt(selectedMonth) - 1];
        const themeClass = `ig-theme-${selectedMonth.padStart(2, '0')}`;
        
        // Get events for this month
        const holidays = getActiveHolidays(currentYear);
        const prefix = `${currentYear}-${selectedMonth.padStart(2, '0')}-`;
        let monthEventsRaw = holidays.filter(h => h.date.startsWith(prefix));
        monthEventsRaw.sort((a, b) => a.date.localeCompare(b.date));
        
        let groupedEvents = [];
        monthEventsRaw.forEach(evt => {
            const dayNum = parseInt(evt.date.split('-')[2], 10);
            if (groupedEvents.length > 0) {
                const last = groupedEvents[groupedEvents.length - 1];
                if (last.name === evt.name && (dayNum === last.endDay + 1 || dayNum === last.endDay)) {
                    last.endDay = dayNum;
                    return;
                }
            }
            groupedEvents.push({
                ...evt,
                startDay: dayNum,
                endDay: dayNum
            });
        });
        
        // -------------------------
        // 1. Social Media Generator
        // -------------------------
        let socialEvents = groupedEvents.filter(e => e.commPlatform && e.commPlatform.includes('Social Media'));
        if (socialEvents.length === 0) socialEvents = groupedEvents;

        const styleVal = document.getElementById("ig-style-select").value;
        let postHtml = '';

        if (styleVal === 'classic') {
            let eventsHtml = '';
            socialEvents.forEach(evt => {
                const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
                eventsHtml += `
                    <div class="ig-event-item">
                        <div class="ig-event-date" style="font-size: ${dayStr.toString().includes('-') ? '35px' : '65px'}; line-height: 1.1;">
                            <span>${monthName.substring(0, 3)}</span>
                            ${dayStr}
                        </div>
                        <div class="ig-event-details">
                            <div class="ig-event-title">${evt.flag} ${evt.name}</div>
                            <div class="ig-event-cat">${evt.desc}</div>
                        </div>
                    </div>
                `;
            });
            if (socialEvents.length === 0) eventsHtml = `<div class="ig-event-item" style="justify-content: center;"><div class="ig-event-title" style="color: #666; margin:0;">No major events.</div></div>`;
            
            postHtml = `
                <div class="ig-post ${themeClass}">
                    <div class="ig-bg-deco"></div>
                    <div class="ig-content">
                        <div class="ig-header">
                            <div class="ig-crest">B</div>
                            <div class="ig-embassy-title">Embassy of Belgium in Manila</div>
                        </div>
                        <div class="ig-month-title">${monthName} ${currentYear}</div>
                        <div class="ig-events-list">
                            ${eventsHtml}
                        </div>
                        <div class="ig-footer">
                            <div class="ig-footer-stripes"><div class="b"></div><div class="y"></div><div class="r"></div></div>
                            <div class="ig-footer-text">@BelgiumPH</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (styleVal === 'editorial') {
            let eventsHtml = '';
            socialEvents.forEach((evt, idx) => {
                const dayStr = evt.startDay === evt.endDay ? String(evt.startDay).padStart(2, '0') : `${evt.startDay}-${evt.endDay}`;
                eventsHtml += `
                    <div class="ig-editorial-item">
                        <div class="ig-editorial-date">${monthName.substring(0, 3).toUpperCase()} ${dayStr}</div>
                        <div class="ig-editorial-details">
                            <div class="ig-editorial-title">${evt.name}</div>
                            <div class="ig-editorial-cat">${evt.desc}</div>
                        </div>
                    </div>
                `;
            });
            if (socialEvents.length === 0) eventsHtml = `<div style="text-align: center; color: #666;">No major events scheduled.</div>`;
            
            postHtml = `
                <div class="ig-post ig-editorial-bg ${themeClass}">
                    <div class="ig-editorial-container">
                        <div class="ig-editorial-header">
                            <span class="ig-editorial-sub">EMBASSY OF BELGIUM IN MANILA</span>
                            <div class="ig-editorial-month">${monthName}</div>
                            <span class="ig-editorial-year">${currentYear}</span>
                        </div>
                        <div class="ig-editorial-list">
                            ${eventsHtml}
                        </div>
                        <div class="ig-editorial-footer">
                            <div class="ig-footer-stripes" style="width: 50px; height: 3px;"><div class="b"></div><div class="y"></div><div class="r"></div></div>
                            <span>WWW.DIPLOMATIE.BELGIUM.BE</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (styleVal === 'split') {
            let eventsHtml = '';
            socialEvents.forEach(evt => {
                const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
                eventsHtml += `
                    <div class="ig-split-item">
                        <div class="ig-split-date" style="font-size: ${dayStr.toString().includes('-') ? '16px' : '24px'};">${dayStr}</div>
                        <div class="ig-split-details">
                            <div class="ig-split-title">${evt.name}</div>
                            <div class="ig-split-cat">${evt.desc}</div>
                        </div>
                    </div>
                `;
            });
            if (socialEvents.length === 0) eventsHtml = `<div class="ig-split-item"><div class="ig-split-title">No major events.</div></div>`;
            
            postHtml = `
                <div class="ig-post ig-split-bg ${themeClass}">
                    <div class="ig-split-left">
                        <div class="ig-crest" style="background: white; color: var(--belgium-black); width: 60px; height: 60px; font-size: 1.5rem; margin-bottom: 20px;">B</div>
                        <div class="ig-split-month">${monthName.toUpperCase()}</div>
                        <div class="ig-split-year">${currentYear}</div>
                        <div class="ig-split-tag">EMBASSY OF BELGIUM<br>MANILA</div>
                        <div class="ig-footer-stripes" style="margin-top: 30px; height: 6px; width: 60px; border-radius: 3px;"><div class="b"></div><div class="y"></div><div class="r"></div></div>
                    </div>
                    <div class="ig-split-right">
                        <div class="ig-split-list">
                            ${eventsHtml}
                        </div>
                    </div>
                </div>
            `;
        } else if (styleVal === 'scrapbook') {
            let eventsHtml = '';
            socialEvents.forEach((evt, i) => {
                const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
                const rot = (i % 2 === 0) ? -2 : 2;
                eventsHtml += `
                    <div class="ig-scrap-item" style="transform: rotate(${rot}deg);">
                        <div class="ig-scrap-tape"></div>
                        <div class="ig-scrap-date">${dayStr} ${monthName.substring(0, 3)}</div>
                        <div class="ig-scrap-details">
                            <div class="ig-scrap-title">${evt.flag} ${evt.name}</div>
                            <div class="ig-scrap-cat">${evt.desc}</div>
                        </div>
                    </div>
                `;
            });
            if (socialEvents.length === 0) eventsHtml = `<div class="ig-scrap-item"><div class="ig-scrap-title">No major events.</div></div>`;
            
            postHtml = `
                <div class="ig-post ig-scrap-bg ${themeClass}">
                    <div class="ig-scrap-header">
                        <h1 class="ig-scrap-month">${monthName} ${currentYear}</h1>
                        <p class="ig-scrap-sub">Embassy Highlights</p>
                        <div class="ig-footer-stripes" style="width: 100px; height: 8px; margin: 15px auto 0; border-radius: 4px;"><div class="b"></div><div class="y"></div><div class="r"></div></div>
                    </div>
                    <div class="ig-scrap-list">
                        ${eventsHtml}
                    </div>
                </div>
            `;
        } else if (styleVal === 'minimalist') {
            let eventsHtml = '';
            socialEvents.forEach(evt => {
                const dayStr = evt.startDay === evt.endDay ? String(evt.startDay).padStart(2, '0') : `${evt.startDay}-${evt.endDay}`;
                eventsHtml += `
                    <div class="ig-min-item">
                        <div class="ig-min-date" style="font-size: ${dayStr.toString().includes('-') ? '16px' : '20px'};">${dayStr}</div>
                        <div class="ig-min-details">
                            <div class="ig-min-title">${evt.name}</div>
                            <div class="ig-min-cat">${evt.desc}</div>
                        </div>
                    </div>
                `;
            });
            if (socialEvents.length === 0) eventsHtml = `<div class="ig-min-item"><div class="ig-min-title">No major events.</div></div>`;
            
            postHtml = `
                <div class="ig-post ig-min-bg ${themeClass}">
                    <div class="ig-min-container">
                        <div class="ig-min-header">
                            <div class="ig-min-month">${monthName} ${currentYear}</div>
                            <div class="ig-footer-stripes" style="width: 30px; height: 3px;"><div class="b"></div><div class="y"></div><div class="r"></div></div>
                        </div>
                        <div class="ig-min-list">
                            ${eventsHtml}
                        </div>
                        <div class="ig-min-footer">Embassy of Belgium</div>
                    </div>
                </div>
            `;
        }
        
        igExportWrapper.innerHTML = postHtml;
        
        // -------------------------
        // 2. Email Blast Generator
        // -------------------------
        let emailEvents = groupedEvents.filter(e => e.commPlatform && e.commPlatform.includes("Email Blasts"));
        if (emailEvents.length === 0) emailEvents = groupedEvents;

        let emailHtml = `
            <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: var(--belgium-black); color: white; padding: 30px; text-align: center; border-bottom: 5px solid var(--belgium-yellow);">
                    <h1 style="margin: 0; font-family: 'Playfair Display', serif;">${monthName} ${currentYear} Events</h1>
                    <p style="margin: 10px 0 0 0; color: #cbd5e1;">Embassy of Belgium in Manila</p>
                </div>
                <div style="padding: 30px;">
                    <p style="color: #475569; line-height: 1.6;">Dear Partners & Stakeholders,</p>
                    <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">Please find below the upcoming events and official closures for ${monthName}.</p>
        `;
        emailEvents.forEach(evt => {
            const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
            emailHtml += `
                    <div style="border-left: 4px solid var(--belgium-red); padding-left: 15px; margin-bottom: 20px;">
                        <div style="color: var(--belgium-black); font-weight: bold; font-size: 1.1rem; margin-bottom: 5px;">${evt.name}</div>
                        <div style="color: #64748b; font-size: 0.9rem;">${monthName} ${dayStr} | ${evt.type.replace('_', ' ').toUpperCase()}</div>
                        ${evt.desc ? `<div style="color: #475569; font-size: 0.95rem; margin-top: 5px;">${evt.desc}</div>` : ''}
                    </div>
            `;
        });
        emailHtml += `
                </div>
                <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                    © ${currentYear} Embassy of Belgium in Manila<br>This is an automated communication.
                </div>
            </div>
            <button class="export-btn" style="background-color: var(--belgium-black); margin-top: 20px;" onclick="alert('Feature coming soon: Export to Mailchimp / Outlook')">Copy Email HTML</button>
        `;
        emailPreviewContent.innerHTML = emailHtml;

        // -------------------------
        // 3. Private Communication Generator
        // -------------------------
        let privateEvents = groupedEvents.filter(e => e.commPlatform && e.commPlatform.includes("Private"));
        if (privateEvents.length === 0) privateEvents = groupedEvents;

        let privateHtml = `
            <div style="max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; font-family: 'Times New Roman', serif; padding: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid black; padding-bottom: 20px;">
                    <h2 style="margin: 0; text-transform: uppercase; letter-spacing: 2px;">Embassy of Belgium</h2>
                    <p style="margin: 5px 0 0 0;">Manila, Philippines</p>
                </div>
                <h1 style="text-align: center; text-transform: uppercase; letter-spacing: 3px; font-size: 1.5rem; margin-bottom: 40px;">INTERNAL MEMORANDUM</h1>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
                    <tr><td style="font-weight: bold; width: 120px; padding: 5px 0;">TO:</td><td>Internal Stakeholders</td></tr>
                    <tr><td style="font-weight: bold; padding: 5px 0;">FROM:</td><td>Ambassador's Office</td></tr>
                    <tr><td style="font-weight: bold; padding: 5px 0;">DATE:</td><td>${new Date().toLocaleDateString()}</td></tr>
                    <tr><td style="font-weight: bold; padding: 5px 0;">SUBJECT:</td><td style="text-transform: uppercase;">Official Schedule for ${monthName} ${currentYear}</td></tr>
                </table>
                <div style="line-height: 1.6; text-align: justify;">
                    <p>This memorandum serves to officially outline the scheduled activities, closures, and diplomatic missions for the month of ${monthName} ${currentYear}.</p>
                    <ul style="margin-top: 20px; padding-left: 20px;">
        `;
        privateEvents.forEach(evt => {
            const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
            privateHtml += `<li style="margin-bottom: 15px;"><strong>${monthName} ${dayStr}: ${evt.name}</strong> - <em>(${evt.type.replace('_', ' ').toUpperCase()})</em> ${evt.desc ? `<br>${evt.desc}` : ''}</li>`;
        });
        privateHtml += `
                    </ul>
                </div>
            </div>
            <button class="export-btn" style="background-color: var(--belgium-black); margin-top: 20px;" onclick="window.print()">Print Memo</button>
        `;
        privatePreviewContent.innerHTML = privateHtml;

        // -------------------------
        // 4. Traditional Media Generator
        // -------------------------
        let mediaEventsRaw = groupedEvents.filter(e => e.commPlatform && e.commPlatform.includes("Traditional Media"));
        let mediaEvents = mediaEventsRaw.length > 0 ? mediaEventsRaw : groupedEvents;
        mediaEvents = mediaEvents.filter(e => !e.type.includes("holiday"));

        let mediaHtml = `
            <div style="max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; font-family: Arial, sans-serif; padding: 50px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--belgium-red); padding-bottom: 20px; margin-bottom: 30px;">
                    <div>
                        <h1 style="margin: 0; font-size: 2rem; color: var(--belgium-black);">FOR IMMEDIATE RELEASE</h1>
                        <p style="margin: 5px 0 0 0; color: #64748b; font-weight: bold;">Press Contact: manila@diplobel.fed.be</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 2rem; font-family: 'Playfair Display', serif; font-weight: 800;">B</div>
                        <p style="margin: 0; font-size: 0.8rem; text-transform: uppercase;">Embassy of Belgium</p>
                    </div>
                </div>
                <h2 style="font-size: 1.4rem; text-align: center; margin-bottom: 30px; line-height: 1.4;">Belgian Embassy Announces Key Initiatives and Events for ${monthName} ${currentYear}</h2>
                <p style="line-height: 1.8; text-align: justify; margin-bottom: 20px;"><strong>MANILA, PHILIPPINES</strong> — The Embassy of Belgium in Manila has officially released its schedule of public events, bilateral missions, and official holidays for ${monthName} ${currentYear}.</p>
        `;
        
        if (mediaEvents.length > 0) {
            mediaHtml += `<p style="line-height: 1.8; text-align: justify; margin-bottom: 20px;">Key highlights for this month include:</p><ul style="line-height: 1.8; margin-bottom: 30px;">`;
            mediaEvents.forEach(evt => {
                const dayStr = evt.startDay === evt.endDay ? evt.startDay : `${evt.startDay}-${evt.endDay}`;
                mediaHtml += `<li><strong>${evt.name} (${monthName} ${dayStr}):</strong> ${evt.desc || 'A key diplomatic engagement.'}</li>`;
            });
            mediaHtml += `</ul>`;
        }
        
        mediaHtml += `
                <p style="line-height: 1.8; text-align: justify; margin-bottom: 30px;">For media inquiries, accreditation, or interview requests regarding any of the above events, please contact the Embassy's press office directly.</p>
                <div style="text-align: center; margin-top: 50px;">
                    <p style="font-weight: bold; letter-spacing: 4px;">###</p>
                </div>
            </div>
            <button class="export-btn" style="background-color: var(--belgium-black); margin-top: 20px;" onclick="alert('Feature coming soon: Download as DOCX')">Download Press Release</button>
        `;
        traditionalPreviewContent.innerHTML = mediaHtml;
        
        // Dynamically adjust negative margin to prevent overlap if the post grows vertically
        setTimeout(() => {
            const postElement = igExportWrapper.querySelector('.ig-post');
            if (postElement) {
                const actualHeight = postElement.scrollHeight;
                const offset = actualHeight - (actualHeight * 0.6);
                const wrapper = document.getElementById('ig-preview-scale-wrapper');
                if (wrapper) wrapper.style.marginBottom = `-${offset}px`;
            }
        }, 50);
    }

    // Instagram Post Export
    exportIgBtn.addEventListener("click", async () => {
        const originalBtnText = exportIgBtn.innerHTML;
        exportIgBtn.textContent = "Generating Post...";
        
        try {
            const selectedMonth = monthSelect.value;
            const currentYear = yearSelect.value;
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthName = monthNames[parseInt(selectedMonth) - 1];

            const postElement = igExportWrapper.querySelector('.ig-post');
            const canvas = await html2canvas(postElement, {
                scale: 2, // High resolution for IG
                useCORS: true,
                backgroundColor: "#ffffff",
                width: 1080,
                height: Math.max(1080, postElement.scrollHeight),
                onclone: (documentClone) => {
                    const wrapper = documentClone.getElementById('ig-preview-scale-wrapper');
                    if (wrapper) {
                        wrapper.style.transform = 'none';
                    }
                }
            });
            
            const imgData = canvas.toDataURL("image/png");
            
            const link = document.createElement('a');
            link.download = `Belgian_Embassy_IG_${monthName}_${currentYear}.png`;
            link.href = imgData;
            link.click();
            
        } catch (err) {
            console.error("IG Post generation failed:", err);
            alert("Instagram Export failed. Please try again.");
        } finally {
            exportIgBtn.innerHTML = originalBtnText;
        }
    });

    // Initial render
    render();
});
