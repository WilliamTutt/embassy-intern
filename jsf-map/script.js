document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded. Starting map initialization...");

    // Target the fixed poster canvas for D3 layout instead of the fullscreen container
    const posterCanvas = document.getElementById('poster-canvas');
    if (!posterCanvas) console.error("CRITICAL: poster-canvas not found!");
    const width = posterCanvas.clientWidth;
    const height = posterCanvas.clientHeight;
    console.log("Canvas dimensions:", width, height);

    const svg = d3.select("#map-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    console.log("SVG appended to map-container.");

    const g = svg.append("g");

    // Initialize Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "map-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(255, 255, 255, 0.95)")
        .style("color", "#1e293b")
        .style("padding", "12px 16px")
        .style("border-radius", "8px")
        .style("box-shadow", "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)")
        .style("border", "1px solid rgba(0,0,0,0.05)")
        .style("font-family", "'Inter', sans-serif")
        .style("font-size", "0.85rem")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 1000)
        .style("transition", "opacity 0.2s");

    // Hide tooltip when clicking anywhere else on the document
    d3.select("body").on("click", () => {
        tooltip.style("opacity", 0);
    });

    // Projection tuned for Portrait Philippine Map
    const projection = d3.geoMercator()
        .center([122.5, 12.5]) // True geographic center
        .scale(4800) // Scaled down slightly to ensure Batanes and Tawi-Tawi are not cut off
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const ngoColors = {
        "11.11.11": "#f97316", // Orange
        "CSA (Collectif Stratégies Alimentaires)": "#22c55e", // Green
        "Entraide et Fraternite (EF)": "#1d4ed8", // Darker vibrant Blue for better visibility
        "Solidagro": "#a855f7", // Purple
        "TRIAS": "#eab308", // Yellow
        "VIVA SALUD": "#ef4444", // Red
        "We Social Movement (WSM)": "#14b8a6" // Teal
    };

    // Process data to aggregate by NGO
    const ngos = {};
    if (typeof mapData !== 'undefined') {
        console.log("mapData loaded. Processing", mapData.length, "entries.");
        mapData.forEach(p => {
            const name = p.ngo;
            if (!ngos[name]) {
                ngos[name] = {
                    name: name,
                    color: ngoColors[name] || "#475569",
                    partners: new Set(),
                    targets: []
                };
            }
            ngos[name].partners.add(p.partnerName);
            ngos[name].targets.push({ lat: p.coordinates.lat, lng: p.coordinates.lng, details: p });
        });
    } else {
        console.error("CRITICAL: mapData is undefined. Did data.js load?");
    }

    // Function to generate sweeping Bezier curve paths
    function getBezierPath(startX, startY, endX, endY, isRightSide) {
        const controlOffset = Math.abs(endX - startX) * 0.55; 
        const cp1X = startX + (isRightSide ? -controlOffset : controlOffset);
        const cp1Y = startY;
        const cp2X = endX + (isRightSide ? controlOffset : -controlOffset);
        const cp2Y = endY;
        return `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    }

    // Helper for tinting badges
    function hexToRgba(hex, alpha) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    async function loadGeoData() {
        // 1. Check local variable if provinces.js is loaded
        if (typeof geoData !== 'undefined' && geoData && geoData.features) {
            console.log("Loaded from local provinces.js! Features:", geoData.features.length);
            return geoData;
        }

        // 2. Check local geojsonph.json file directly
        try {
            console.log("Checking local geojsonph.json file...");
            const localResp = await fetch('geojsonph.json');
            if (localResp.ok) {
                const localData = await localResp.json();
                if (localData && localData.features && localData.features.length > 0) {
                    console.log("Loaded directly from local geojsonph.json! Features:", localData.features.length);
                    return localData;
                }
            }
        } catch (e) {
            // fetch might fail under file:// protocol
        }

        // 3. Check browser offline cache for instant 0ms load!
        try {
            const cached = localStorage.getItem('ph_provinces_geojson_v1');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (parsed && parsed.features && parsed.features.length > 0) {
                    console.log("Loaded instantly from browser offline cache (0ms)! Provinces:", parsed.features.length);
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("LocalStorage cache read error:", e);
        }

        // 3. Fetch from fast CDN mirrors if not cached
        const urls = [
            'https://cdn.jsdelivr.net/gh/macoymejia/geojsonph@master/Province/Provinces.json',
            'https://raw.githack.com/macoymejia/geojsonph/master/Province/Provinces.json',
            'https://fastly.jsdelivr.net/gh/macoymejia/geojsonph@master/Province/Provinces.json',
            'https://raw.githubusercontent.com/macoymejia/geojsonph/master/Province/Provinces.json'
        ];

        for (const url of urls) {
            try {
                console.log("Fetching GeoJSON from:", url);
                const startTime = performance.now();
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                
                if (data && data.features && data.features.length > 0) {
                    console.log(`GeoJSON loaded from ${url} in ${(performance.now() - startTime).toFixed(0)}ms! (${data.features.length} provinces)`);
                    
                    // Save to browser offline storage
                    try {
                        localStorage.setItem('ph_provinces_geojson_v1', JSON.stringify(data));
                        console.log("Saved to browser offline cache. Next page loads will be instant (0ms)!");
                    } catch (e) {
                        console.warn("Could not save to localStorage:", e);
                    }
                    
                    return data;
                }
            } catch (err) {
                console.warn(`Failed loading from ${url}:`, err.message);
            }
        }
        throw new Error("All CDN sources failed to load GeoJSON.");
    }

    loadGeoData().then(geoData => {
        if (!geoData || !geoData.features) {
            throw new Error("Invalid GeoJSON data.");
        }
        console.log("GeoJSON loaded successfully! Features:", geoData.features.length);
        
        // 1. Spatial Joining: Figure out which NGOs are in which province
        const provinceNGOs = {}; // Maps province name to a Set of NGO colors
        
        // Initialize empty sets for all provinces
        geoData.features.forEach(feature => {
            const provName = feature.properties.PROVINCE || "Unknown";
            provinceNGOs[provName] = new Set();
        });

        // Test every NGO target coordinate against the province polygons
        Object.values(ngos).forEach(ngo => {
            ngo.targets.forEach(target => {
                // d3.geoContains needs raw unprojected [lng, lat]
                const point = [target.lng, target.lat]; 
                
                let hitLand = false;
                geoData.features.forEach(feature => {
                    if (d3.geoContains(feature, point)) {
                        const provName = feature.properties.PROVINCE || "Unknown";
                        provinceNGOs[provName].add(ngo.color);
                        hitLand = true;
                    }
                });

                if (!hitLand) {
                    console.warn(`[OCEAN DETECTED] ${ngo.name} - ${target.details.partnerName} at Lat ${target.lat}, Lng ${target.lng} missed all land polygons!`);
                }
            });
        });

        // 2. Generate SVG <defs> for Stripe Patterns
        const defs = svg.append("defs");
        
        // Helper function to create a unique pattern ID based on colors
        const getPatternId = (colorsArray) => "pattern-" + colorsArray.map(c => c.replace('#', '')).join('-');

        Object.entries(provinceNGOs).forEach(([provName, colorSet]) => {
            if (colorSet.size > 1) {
                const colors = Array.from(colorSet).sort();
                const patternId = getPatternId(colors);
                
                // Only create the pattern if we haven't already
                if (svg.select(`#${patternId}`).empty()) {
                    const pattern = defs.append("pattern")
                        .attr("id", patternId)
                        .attr("patternUnits", "userSpaceOnUse")
                        .attr("width", 20) // width of stripe repeat
                        .attr("height", 20)
                        .attr("patternTransform", "rotate(45)");
                    
                    // Divide the 20px pattern block evenly among the colors
                    const stripeWidth = 20 / colors.length;
                    colors.forEach((color, index) => {
                        pattern.append("rect")
                            .attr("x", index * stripeWidth)
                            .attr("y", 0)
                            .attr("width", stripeWidth)
                            .attr("height", 20)
                            .attr("fill", hexToRgba(color, 0.4)); // 40% opacity for elegance
                    });
                }
            }
        });

        console.log("Drawing province paths...");
        // 3. Draw Provinces and Apply Dynamic Coloring!
        g.selectAll("path")
            .data(geoData.features)
            .enter()
            .append("path")
            .attr("class", "province")
            .attr("d", path)
            .attr("fill", d => {
                const provName = d.properties.PROVINCE || "Unknown";
                const colorSet = provinceNGOs[provName];
                
                if (!colorSet || colorSet.size === 0) {
                    return "var(--map-base)"; // No NGOs active here
                }
                
                if (colorSet.size === 1) {
                    // Single NGO: Fill with 20% opacity of that NGO's color
                    const color = Array.from(colorSet)[0];
                    return hexToRgba(color, 0.2); 
                }
                
                // Multiple NGOs: Use the generated striped pattern!
                const colors = Array.from(colorSet).sort();
                return `url(#${getPatternId(colors)})`;
            })
            .attr("stroke", d => {
                    // If it has NGOs, give it a slightly darker stroke of the primary color, else default white
                    const provName = d.properties.PROVINCE || "Unknown";
                    const colorSet = provinceNGOs[provName];
                    if (colorSet && colorSet.size === 1) {
                        return hexToRgba(Array.from(colorSet)[0], 0.6);
                    }
                    return "var(--map-stroke)";
            });
        console.log("Provinces drawn successfully.");

        // 1. Generate HTML Panels in the native DOM sidebars
        console.log("Building sidebars...");
        const leftSidebar = document.getElementById("left-sidebar");
        const rightSidebar = document.getElementById("right-sidebar");

        // Define display order
        const preferredLeft = ["TRIAS", "VIVA SALUD", "We Social Movement (WSM)"];
        const preferredRight = ["11.11.11", "Solidagro", "CSA (Collectif Stratégies Alimentaires)", "Entraide et Fraternite (EF)"];

        const buildPanelHTML = (name, isRightSide) => {
            const ngo = ngos[name];
            if (!ngo) return;

            const badgeBg = hexToRgba(ngo.color, 0.1);
            const badgeBorder = hexToRgba(ngo.color, 0.25);
            
            let html = `<div class="callout-panel" id="panel-${name.replace(/[^a-zA-Z0-9]/g, '')}">
                            <div class="callout-ngo" style="color: ${ngo.color}; border-bottom: 2px solid ${ngo.color}; text-align: ${isRightSide ? 'left' : 'right'};">${ngo.name}</div>
                            <div style="display: flex; flex-direction: column; gap: 8px; align-items: ${isRightSide ? 'flex-start' : 'flex-end'};">`;
            
            // Map each partner to their highest latitude for geographic sorting
            const partnerLats = {};
            ngo.targets.forEach(t => {
                const pName = t.details.partnerName;
                if (partnerLats[pName] === undefined || t.lat > partnerLats[pName]) {
                    partnerLats[pName] = t.lat;
                }
            });

            // Sort partners from North to South (descending latitude)
            let partnersList = Array.from(ngo.partners).sort((a, b) => {
                const latA = partnerLats[a] || 0;
                const latB = partnerLats[b] || 0;
                return latB - latA;
            });

            // Specific manual ranking for EF
            if (name === "Entraide et Fraternite (EF)") {
                const efOrder = [
                    "AGRO-ECO", 
                    "SUMPAY", 
                    "Kilos Ka",
                    "LAFCOOD", 
                    "CONZARRD"
                ];
                partnersList.sort((a, b) => {
                    const idxA = efOrder.indexOf(a) !== -1 ? efOrder.indexOf(a) : 999;
                    const idxB = efOrder.indexOf(b) !== -1 ? efOrder.indexOf(b) : 999;
                    return idxA - idxB;
                });
            } else if (name === "TRIAS") {
                const triasOrder = [
                    "SOEMCO",
                    "GSAC",
                    "LPMPC",
                    "FCCT",
                    "AgriCOOPh",
                    "KAISA KA",
                    "K-COOP",
                    "KAGAMAZAS"
                ];
                partnersList.sort((a, b) => {
                    const idxA = triasOrder.indexOf(a) !== -1 ? triasOrder.indexOf(a) : 999;
                    const idxB = triasOrder.indexOf(b) !== -1 ? triasOrder.indexOf(b) : 999;
                    return idxA - idxB;
                });
            }
            
            partnersList.forEach(p => {
                const badgeId = `badge-${name.replace(/[^a-zA-Z0-9]/g, '')}-${p.replace(/[^a-zA-Z0-9]/g, '')}`;
                html += `<div class="callout-partner" id="${badgeId}" style="background-color: ${badgeBg}; color: ${ngo.color}; border: 1px solid ${badgeBorder};">${p}</div>`;
            });
            
            html += `       </div>
                        </div>`;
            return html;
        };

        preferredLeft.forEach(name => {
            if(ngos[name]) leftSidebar.innerHTML += buildPanelHTML(name, false);
        });
        
        preferredRight.forEach(name => {
            if(ngos[name]) rightSidebar.innerHTML += buildPanelHTML(name, true);
        });
        console.log("Sidebars built.");

        // 2. Wait for fonts and the browser to calculate the actual height of the flexbox panels, then draw the SVG lines!
        console.log("Waiting for fonts to load before drawing lines...");
        document.fonts.ready.then(() => {
            console.log("Fonts loaded. Drawing lines in 100ms...");
            setTimeout(() => {
            let linesDrawn = 0;
            Object.values(ngos).forEach(ngo => {
                const domId = `panel-${ngo.name.replace(/[^a-zA-Z0-9]/g, '')}`;
                const el = document.getElementById(domId);
                if (!el) {
                    console.warn("Panel not found for", ngo.name);
                    return;
                }

                const rect = el.getBoundingClientRect();
                const posterRect = posterCanvas.getBoundingClientRect();
                const isRightSide = preferredRight.includes(ngo.name);
                
                const sortedTargets = [...ngo.targets].sort((a, b) => b.lat - a.lat);

                const singleLinePartners = [
                    "ATM", "PMCJ", 
                    "KAISA KA", "K-COOP", "AgriCOOPh", "LPMPC", 
                    "GSAC", "FCCT", "SOEMCO", "KAGAMAZAS"
                ];
                const hqOverrides = {
                    "ATM": { lat: 14.6529, lng: 121.0529, location: "Metro Manila (HQ)" },
                    "PMCJ": { lat: 14.6529, lng: 121.0529, location: "Metro Manila (HQ)" },
                    "AgriCOOPh": { lat: 10.33028, lng: 123.87722, location: "170M. velez st. Bgy. guadalupe Cebu city (HQ)" },
                    "FCCT": { lat: 10.31672, lng: 123.89071, location: "Sangi, Toledo city, Cebu city (HQ)" },
                    "GSAC": { lat: 12.97389, lng: 123.99333, location: "Luna Street luna candol,subat sorsogon (HQ)" },
                    "KAGAMAZAS": { lat: 7.750256, lng: 122.829444, location: "Batu, Siay, Zamboanga sibugay (HQ)" },
                    "KAISA KA": { lat: 15.89623, lng: 120.67275, location: "Balin Bolinao, Bgy. Poblacion, pangasinan (HQ)" },
                    "K-COOP": { lat: 14.6488, lng: 121.0509, location: "#5 Matimpiin Street, Barangay pinahan, quezon city (HQ)" },
                    "LPMPC": { lat: 14.1532, lng: 122.8303, location: "Barangay malasugui, labo, camarines norte (HQ)" },
                    "SOEMCO": { lat: 9.62139, lng: 125.96667, location: "Cordita St., Brgy, Navarro, Socorro, Surigao Del Norte (HQ)" }
                };
                const drawnSinglePartners = new Set();

                sortedTargets.forEach((target, i) => {
                    const pName = target.details.partnerName;
                    
                    let drawLng = target.lng;
                    let drawLat = target.lat;
                    let isCentroid = false;
                    let hqLocation = null;
                    const partnerTargets = ngo.targets.filter(t => t.details.partnerName === pName);

                    // For massive nationwide networks, draw only one representative line/dot
                    if (singleLinePartners.includes(pName)) {
                        if (drawnSinglePartners.has(pName)) {
                            return; // Skip duplicate lines, keep province shading intact
                        }
                        drawnSinglePartners.add(pName);
                        
                        if (hqOverrides[pName]) {
                            // Point directly to headquarters
                            drawLat = hqOverrides[pName].lat;
                            drawLng = hqOverrides[pName].lng;
                            hqLocation = hqOverrides[pName].location;
                        } else if (partnerTargets.length > 1) {
                            // Calculate centroid of all locations for this partner
                            drawLng = partnerTargets.reduce((sum, t) => sum + t.lng, 0) / partnerTargets.length;
                            drawLat = partnerTargets.reduce((sum, t) => sum + t.lat, 0) / partnerTargets.length;
                            isCentroid = true;
                        }
                    }

                    const targetPoint = projection([drawLng, drawLat]);
                    if (!targetPoint) {
                        console.warn("Projection failed for target", target);
                        return;
                    }
                    
                    // Default to panel edge
                    let lineStartX = isRightSide ? (rect.left - posterRect.left) : (rect.right - posterRect.left); 
                    let lineStartY = (rect.top - posterRect.top) + 20 + (i * 10);
                    
                    // Wire directly to the specific partner badge!
                    const badgeId = `badge-${ngo.name.replace(/[^a-zA-Z0-9]/g, '')}-${target.details.partnerName.replace(/[^a-zA-Z0-9]/g, '')}`;
                    const badgeEl = document.getElementById(badgeId);
                    
                    if (badgeEl) {
                        const badgeRect = badgeEl.getBoundingClientRect();
                        // Left side panels send lines out their right edge, Right side panels send out their left edge
                        lineStartX = isRightSide ? (badgeRect.left - posterRect.left) : (badgeRect.right - posterRect.left);
                        // Vertically center on the badge
                        lineStartY = (badgeRect.top - posterRect.top) + (badgeRect.height / 2);
                    } else {
                        console.warn("Badge not found for", badgeId);
                    }
                    
                    // Helper function to show tooltip
                    const showTooltip = (event) => {
                        event.stopPropagation();
                        const partnerCount = partnerTargets.length;
                        let tooltipLocType = "Geographic Centroid (Average Location)";
                        let multiNoteText = "Arrow points to geographic center";
                        
                        if (hqLocation) {
                            tooltipLocType = hqLocation;
                            multiNoteText = "Arrow points to HQ";
                        }
                        
                        const multiNote = partnerCount > 1 
                            ? `<div style="color: ${ngo.color}; font-weight: 600; font-size: 0.75rem; margin-top: 4px;">• Active across ${partnerCount} sites (${multiNoteText})</div>` 
                            : '';
                        
                        const locText = (isCentroid || hqLocation) ? tooltipLocType : target.details.location;
                        
                        let htmlContent = `
                            <div style="font-weight: 800; color: ${ngo.color}; margin-bottom: 4px; text-transform: uppercase; font-size: 0.95rem;">${ngo.name}</div>
                            <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 8px;">Partner: ${pName}</div>
                            <div style="color: #64748b; font-size: 0.8rem;">
                                <span style="font-weight: 600;">Location:</span> ${locText}<br>
                                <span style="font-weight: 600;">Coordinates:</span> ${drawLat.toFixed(4)}, ${drawLng.toFixed(4)}
                            </div>
                            ${multiNote}
                        `;
                        tooltip.html(htmlContent)
                            .style("left", (event.pageX + 15) + "px")
                            .style("top", (event.pageY - 15) + "px")
                            .style("opacity", 1);
                    };

                    g.append("path")
                        .attr("class", "flow-line")
                        .attr("d", getBezierPath(lineStartX, lineStartY, targetPoint[0], targetPoint[1], isRightSide))
                        .attr("stroke", ngo.color)
                        .attr("stroke-width", 0.9) // Thinner lines for elegance when bundled
                        .attr("opacity", 0.5)
                        .style("cursor", "pointer")
                        .style("pointer-events", "stroke") // Ensure the thin line registers clicks
                        .on("click", (event) => {
                            console.log(`%c[MAP CLICK] ${ngo.name}`, `color: white; background-color: ${ngo.color}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`);
                            showTooltip(event);
                        });

                    g.append("circle")
                        .attr("cx", targetPoint[0])
                        .attr("cy", targetPoint[1])
                        .attr("r", 2.5) // Smaller, more precise dots
                        .attr("fill", "white")
                        .attr("stroke", ngo.color)
                        .attr("stroke-width", 1.2)
                        .style("cursor", "pointer")
                        .style("pointer-events", "all") // Explicitly capture clicks since parent is none
                        .on("click", (event) => {
                            console.log(`%c[DOT CLICK] ${ngo.name}`, `color: white; background-color: ${ngo.color}; padding: 2px 6px; border-radius: 4px; font-weight: bold;`);
                            showTooltip(event);
                        });
                    
                    linesDrawn++;
                });
            });
            console.log(`Finished drawing ${linesDrawn} lines and dots.`);
        }, 100); // 100ms gives the DOM plenty of time to render the layout
        }).catch(err => console.error("document.fonts.ready failed:", err));

    }).catch(err => {
        console.error("CRITICAL: Failed to load GeoJSON:", err);
    });

    // Print Functionality (High Res Export)
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', async () => {
            posterCanvas.classList.add('print-mode');
            await new Promise(r => setTimeout(r, 500));
            try {
                printBtn.textContent = "Exporting...";
                const canvas = await html2canvas(posterCanvas, { 
                    useCORS: true, 
                    scale: 3,
                    backgroundColor: null // Ensure transparent background 
                });
                const imgData = canvas.toDataURL('image/png');
                
                // Download as PNG
                const link = document.createElement('a');
                link.download = "JSF_Poster_Map_Transparent.png";
                link.href = imgData;
                link.click();
            } catch (error) {
                console.error("Export failed:", error);
                alert("Export failed.");
            } finally {
                posterCanvas.classList.remove('print-mode');
                printBtn.textContent = "Export / Print Poster";
            }
        });
    }
});
