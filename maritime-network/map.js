document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById('d3-map-container');
    if (!container) return;

    // Set dimensions based on the container
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Add SVG
    const svg = d3.select("#d3-map-container")
        .html('') // Clear "loading..." text
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g");

    // Add projection - focusing on the Philippines, shifted left to balance layout
    const projection = d3.geoMercator().center([122, 12]).scale(2800).translate([(width/2) - 150, height/2]);
    const path = d3.geoPath().projection(projection);

    try {
        // Load Philippines GeoJSON from local file
        const response = await fetch('geojsonph.json');
        if (!response.ok) throw new Error("Network response was not ok");
        const geoData = await response.json();

        // Draw Map
        g.selectAll("path")
            .data(geoData.features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", "#1e293b")
            .attr("stroke", "#334155")
            .attr("stroke-width", 0.5)
            .on("mouseover", function() {
                d3.select(this).attr("fill", "#3b82f6").style("transition", "fill 0.2s");
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", "#1e293b");
            });

        // Add dummy port markers as placeholders for future data
        const ports = [
    {
        name: 'Port of Manila (PHMNL)',
        coords: [120.9445, 14.6165],
        role: 'International Container Transshipment',
        category: 'infrastructure',
        desc: '<p><strong>Primary Operational Focus</strong><br>International container transshipment, large-scale commercial reclamation, and deep-dredging zones.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Consists of Manila North Harbor, South Harbor, and the Manila International Container Terminal (MICT). Features 10,000 feet of rock barriers protecting a 600-hectare anchorage. Draft clearance accommodates vessels up to a maximum draft of 13.04 m.</p>         <p><strong>Geotechnical Realities</strong><br>Situated in a high-density urban reclamation zone. Ground deformation monitoring (PS-InSAR) reveals significant vertical land motion (VLM) at approx 10.1 mm/year, demanding advanced soil stabilization for future expansions.</p>         <p><strong>Maritime Connectivity</strong><br>Primary domestic feeder hub linking Luzon to Cebu, Iloilo, Cagayan de Oro, Davao, and Surigao. Direct shipping loops to global hubs: Shanghai, Hong Kong, Tokyo, Singapore, and European gateway ports.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://www.marineradar.com/port/PHMNL\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Manila (PHMNL) — Vessels & Details</a></li><li><a href=\'https://mcgutib.wordpress.com/2009/06/27/featured-ports-pmo-south-harbor/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Featured Philippine Ports: The Manila South Harbor</a></li><li><a href=\'https://www.scribd.com/document/503527657/AA-EIS-Manila-Waterfront-City-2\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Manila Waterfront City Project Overview</a></li><li><a href=\'https://www.researchgate.net/publication/380137038_GROUND_DEFORMATION_MONITORING_OF_RECLAIMED_LANDS_ALONG_MANILA_BAY_FREEPORT_ZONE_USING_PS-INSAR_TECHNIQUE\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Ground Deformation Monitoring of Reclaimed Lands</a></li></ul></div>'
    },
    {
        name: 'Port of Batangas (PHBTG)',
        coords: [121.0453, 13.746],
        role: 'Containerized Cargo & Priority OSW Staging',
        category: 'energy',
        desc: '<p><strong>Primary Operational Focus</strong><br>Diversified dry/liquid bulk handling, containerized cargo, primary southern Ro-Ro terminal, and priority OSW (Offshore Wind) staging.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Encompasses a 150-hectare seaport on Batangas Bay with a sheltered harbor. Features a channel depth of 23 feet and is backed by a Vessel Traffic Management System (VTMS) with four radar stations.</p>         <p><strong>Geotechnical & OSW Modernization</strong><br>Engineered to support fixed-bottom wind turbine assembly. Targeting a PHP 14-billion Port Terminal Management Contract (PTMC) to develop a 27-to-28-hectare property into a dedicated OSW staging hub. PNOC is also repurposing the Mabini base into an Offshore Wind Integration Port (OSWIP).</p>         <p><strong>Maritime Connectivity</strong><br>Southern Luzon Ro-Ro backbone: continuous transit to Abra de Ilog, Lucena, Balanacan, Sta. Cruz, Odiongan, and Romblon. Connected to regional intra-Asia container loops, serving as a critical overflow for Manila.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://www.marineradar.com/port/PHBTG\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Batangas/Luzon (PHBTG)</a></li><li><a href=\'https://mcgutib.wordpress.com/2014/04/09/featured-philippine-port-port-of-batangas/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Featured Philippine Ports: Batangas Port</a></li><li><a href=\'https://www.pnoc.com.ph/pnoc-port-at-mabini-batangas-to-be-an-offshore-wind-integration-port/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Repurposing of PNOC Port at Mabini Batangas to OSWIP</a></li></ul></div>'
    },
    {
        name: 'Port of Subic Bay (PHSFS)',
        coords: [120.2843, 14.8077],
        role: 'Deepwater Container & Ship Repair',
        category: 'infrastructure',
        desc: '<p><strong>Primary Operational Focus</strong><br>Deepwater container handling, bulk and breakbulk cargo, ship repair, and logistics integration.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>A naturally sheltered deepwater harbor protected by surrounding mountain ranges. Features a 13.7-meter draft capacity at the Subic Bay International Terminal (SBITC) and a 550-meter graving dock with a capacity of 450,000 DWT for heavy repairs.</p>         <p><strong>Maritime Connectivity</strong><br>Direct road-transport integration with Central and Northern Luzon industrial economic zones. High-capacity connections to major regional nodes: Singapore, Shanghai, Xiamen, Kaohsiung, and Ulsan.</p>         <p><strong>Governance</strong><br>Managed under the Subic Bay Metropolitan Authority (SBMA) freeport regime, facilitating direct cargo agreements with global shipping lines.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://shipsgo.com/ocean/ports/phsfs\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>SUBIC BAY, PHSFS, Philippines - Ocean Ports</a></li><li><a href=\'https://en.wikipedia.org/wiki/Port_of_Subic_Bay\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Subic Bay - Wikipedia</a></li><li><a href=\'https://sbitc.ph/terminal\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Subic Bay International Terminal Corporation</a></li></ul></div>'
    },
    {
        name: 'Port of Cebu (PHCEB)',
        coords: [123.9465, 10.315],
        role: 'Visayas Domestic Passenger & Cargo Transshipment',
        category: 'infrastructure',
        desc: '<p><strong>Primary Operational Focus</strong><br>Dominant domestic passenger and cargo transshipment, regional feedering for the Visayas network.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Located in the Mactan Channel. Split into a 14-hectare International Port (512-meter berthing space, 1,953 TEU ground slots) and a 21-hectare Domestic Port.</p>         <p><strong>Maritime Connectivity</strong><br>Central Visayas maritime hub: direct links to Toledo, Danao, Tubigon, Tagbilaran, Bacolod, Dumaguete, and Iloilo. Feeder networks managed by regional carriers including Maersk, Evergreen, CNC Line, and Wan Hai.</p>         <p><strong>Governance</strong><br>Operated by the Cebu Port Authority (CPA) which aligns regional expansion plans with the national DOTr to boost Visayan export lanes.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://www.marineradar.com/port/PHCEB\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Cebu (PHCEB) — Vessels & Details</a></li><li><a href=\'https://en.wikipedia.org/wiki/Port_of_Cebu\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Cebu - Wikipedia</a></li><li><a href=\'https://www.cpa.gov.ph/the-cebu-port-system\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>The Cebu Port System</a></li></ul></div>'
    },
    {
        name: 'Port of Davao (PHDVO)',
        coords: [125.6637, 7.1282],
        role: 'Mindanao Containerized Agricultural Exports',
        category: 'infrastructure',
        desc: '<p><strong>Primary Operational Focus</strong><br>Containerized agricultural exports, reefer cargo handling, and regional trade integration.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Centered at Sasa Wharf (17 hectares, 9-meter berth depth). Heavily supported by the private, modern Davao International Container Terminal (DICT) in Panabo City, optimized for refrigerated banana and pineapple exports.</p>         <p><strong>Maritime Connectivity</strong><br>Southern Mindanao maritime corridor, linking local agricultural regions to the Visayas and Luzon grids. Gateway to China, Japan, and Southeast Asian markets, positioned as an alternative shipping hub to congested ports in Singapore.</p>         <p><strong>Future Developments</strong><br>Prioritizing the Southern Philippines Logistics Hub Project under the Davao Regional Development Plan 2023–2028.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://www.icontainers.com/ports/davao/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Davao | Ocean Freight & Container Shipping</a></li><li><a href=\'https://en.wikipedia.org/wiki/Port_of_Davao\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Port of Davao - Wikipedia</a></li><li><a href=\'https://seads.adb.org/articles/transforming-davao-region-southeast-asian-logistics-hub\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Transforming Davao Region into a Southeast Asian Logistics Hub</a></li></ul></div>'
    },
    {
        name: 'Port of Jose Panganiban',
        coords: [122.6845, 14.2982],
        role: 'Priority OSW Construction & Heavy-Lift Staging',
        category: 'energy',
        desc: '<p><strong>Primary Operational Focus</strong><br>Priority offshore wind (OSW) construction, turbine component assembly, and heavy-lift staging.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Strategically positioned adjacent to 14 Offshore Wind Energy Service Contracts (OWESCs) representing 8,150 MW of potential capacity. Features an initial 40-hectare marshalling yard, expandable to 160 hectares.</p>         <p><strong>Geotechnical & OSW Modernization</strong><br>Engineered to support fixed-bottom wind turbine assembly, with the PPA aiming to make the facility operational by the first quarter of 2027 to align with the country\'s first generation of projects in 2028.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://business.inquirer.net/563200/two-offshore-wind-ports-seen-ready-by-q1-2027\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Two offshore wind ports seen ready by Q1 2027</a></li><li><a href=\'https://powerphilippines.com/ppa-targets-3-luzon-ports-for-offshore-wind/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>PPA targets 3 Luzon ports for offshore wind</a></li></ul></div>'
    },
    {
        name: 'Port of Currimao',
        coords: [120.4855, 18.0298],
        role: 'Floating OSW Staging & Deepwater Deployment',
        category: 'energy',
        desc: '<p><strong>Primary Operational Focus</strong><br>Dedicated floating offshore wind (OSW) staging and deepwater deployment.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Situated near 13 approved OWESCs representing 9,489 MW of potential capacity. Undergoing a specialized floating OSW conversion requiring deep quayside areas.</p>         <p><strong>Geotechnical & OSW Modernization</strong><br>Designed for floating offshore wind technology, which requires longer development timelines and deeper drafts. Development costs are estimated at PHP 28 billion, prompting the evaluation of specialized public-private partnerships or international sovereign financing.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://business.inquirer.net/563200/two-offshore-wind-ports-seen-ready-by-q1-2027\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>Two offshore wind ports seen ready by Q1 2027</a></li><li><a href=\'https://powerphilippines.com/ppa-targets-3-luzon-ports-for-offshore-wind/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>PPA targets 3 Luzon ports for offshore wind</a></li></ul></div>'
    },
    {
        name: 'Port of Mercedes',
        coords: [123.0167, 14.1167],
        role: 'Public OSW Marshalling & Heavy Fabrication',
        category: 'energy',
        desc: '<p><strong>Primary Operational Focus</strong><br>Dedicated public offshore wind (OSW) marshalling, heavy fabrication, and logistics.</p>         <p><strong>Key Infrastructure & Engineering Specifications</strong><br>Features a 190-meter heavy-lift berth with a load capacity of 20 MT/m², a 40-hectare marshalling zone, and a 160-hectare back-up area.</p>         <p><strong>Geotechnical & OSW Modernization</strong><br>Bidding targeted for a two-phase development costing PHP 4.8 billion to support large-scale marine logistics and dredging operations.</p><hr style=\'margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;\'><div style=\'font-size: 0.85rem;\'><strong style=\'color: #64748b;\'>Sources:</strong><ul style=\'margin-top: 8px; padding-left: 15px;\'><li><a href=\'https://powerphilippines.com/ppa-sta-clara-and-mercedes-ports-to-be-ready-for-offshore-wind-projects-by-2026/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>PPA: Sta. Clara and Mercedes Ports to be Ready for OSW</a></li><li><a href=\'https://portcalls.com/ppa-moves-bidding-for-p2b-offshore-wind-port-in-camarines-norte-to-jan-2026/\' target=\'_blank\' style=\'color: #3b82f6; text-decoration: none;\'>PPA moves bidding for P2B offshore wind port in Camarines Norte</a></li></ul></div>'
    },
];


        
        // Helper for marker colors
        const getColor = (category) => category === 'energy' ? '#10b981' : '#FBBF24';

        // Draw Maritime Routes
        const routes = [
            { source: [120.9445, 14.6165], target: [123.9465, 10.3150] }, // Manila to Cebu
            { source: [120.9445, 14.6165], target: [125.6637, 7.1282] },  // Manila to Davao
            { source: [123.9465, 10.3150], target: [125.6637, 7.1282] },  // Cebu to Davao
            { source: [120.9445, 14.6165], target: [120.2843, 14.8077] }, // Manila to Subic
            { source: [120.9445, 14.6165], target: [121.0453, 13.7460] }, // Manila to Batangas
            { source: [121.0453, 13.7460], target: [123.9465, 10.3150] }  // Batangas to Cebu
        ];

        g.selectAll(".route")
            .data(routes)
            .enter().append("path")
            .attr("class", "route")
            .attr("d", d => {
                const s = projection(d.source);
                const t = projection(d.target);
                const dx = t[0] - s[0];
                const dy = t[1] - s[1];
                const dr = Math.sqrt(dx * dx + dy * dy) * 1.5; 
                return `M${s[0]},${s[1]}A${dr},${dr} 0 0,1 ${t[0]},${t[1]}`;
            })
            .attr("fill", "none")
            .attr("stroke", "rgba(59, 130, 246, 0.4)")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "6 4")
            .style("animation", "dash 20s linear infinite");

        const markers = g.selectAll(".marker")
            .data(ports)
            .enter().append("g")
            .attr("class", "marker")
            .attr("transform", d => `translate(${projection(d.coords)[0]}, ${projection(d.coords)[1]})`)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                if (typeof openModal === 'function') {
                    openModal(d);
                }
            });

        // Pulsing background rings
        markers.append("circle")
            .attr("r", 8)
            .attr("fill", d => getColor(d.category))
            .attr("opacity", 0.3)
            .append("animate")
            .attr("attributeName", "r")
            .attr("values", "4;12;4")
            .attr("dur", "2s")
            .attr("repeatCount", "indefinite");

        // Solid inner circle
        markers.append("circle")
            .attr("r", 4)
            .attr("fill", d => getColor(d.category))
            .attr("stroke", "white")
            .attr("stroke-width", 1);


        // Leader Lines and Callout Text (Right-aligned)
        const labelX = width - 350; // Position titles on the right side
        const topMargin = 50;
        const rowHeight = (height - 100) / (ports.length);

        // Sort ports by latitude (so northernmost is at the top) to prevent lines crossing as much as possible
        const sortedPorts = [...ports].sort((a, b) => b.coords[1] - a.coords[1]);

        sortedPorts.forEach((port, index) => {
            const dotPos = projection(port.coords);
            const labelY = topMargin + (index * rowHeight);
            
            // Draw Leader Line (elbow format)
            const elbowX = dotPos[0] + 50;
            g.append("path")
                .attr("d", `M${dotPos[0]},${dotPos[1]} L${elbowX},${dotPos[1]} L${labelX - 20},${labelY} L${labelX},${labelY}`)
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0.3)")
                .attr("stroke-width", 1.5)
                .style("pointer-events", "none");
                
            // Draw Interactive Group for Text
            const textGroup = g.append("g")
                .attr("transform", `translate(${labelX}, ${labelY})`)
                .style("cursor", "pointer")
                .on("click", (event) => {
                    if (typeof openModal === 'function') openModal(port);
                })
                .on("mouseover", function() {
                    d3.select(this).select(".bg-rect").attr("fill", "rgba(255,255,255,0.08)").attr("stroke", getColor(port.category));
                    d3.select(this).select(".title-text").style("fill", "#3b82f6");
                })
                .on("mouseout", function() {
                    d3.select(this).select(".bg-rect").attr("fill", "rgba(255,255,255,0.02)").attr("stroke", "rgba(255,255,255,0.1)");
                    d3.select(this).select(".title-text").style("fill", "white");
                });
                
            // Interactive background box
            textGroup.append("rect")
                .attr("class", "bg-rect")
                .attr("x", -15)
                .attr("y", -24)
                .attr("width", 360)
                .attr("height", 50)
                .attr("rx", 6)
                .attr("fill", "rgba(255,255,255,0.02)")
                .attr("stroke", "rgba(255,255,255,0.1)")
                .style("transition", "all 0.2s");

            // Colored indicator line on the left
            textGroup.append("rect")
                .attr("x", -15)
                .attr("y", -24)
                .attr("width", 4)
                .attr("height", 50)
                .attr("rx", 2)
                .attr("fill", getColor(port.category));

            // Icons
            const shipIcon = `<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 3.2-1.2 5.5-1.2 2.3 0 3 1.2 5.5 1.2 1.3 0 1.9-.5 2.5-1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/>`;
            const turbineIcon = `<path d="M12 12v9"/><path d="M12 12c-2.4-1.5-5-3.5-7-6"/><path d="M12 12c2.4-1.5 5-3.5 7-6"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`;
            
            textGroup.append("g")
                .attr("transform", "translate(0, -11) scale(0.9)")
                .attr("fill", "none")
                .attr("stroke", getColor(port.category))
                .attr("stroke-width", "2")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "round")
                .html(port.category === 'energy' ? turbineIcon : shipIcon);

            // Text Title
            textGroup.append("text")
                .attr("class", "title-text")
                .attr("x", 32)
                .attr("y", -2)
                .attr("fill", "white")
                .style("font-size", "14px")
                .style("font-family", "Inter, sans-serif")
                .style("font-weight", "600")
                .text(port.name)
                .style("transition", "fill 0.2s");
                
            // Sub-role text
            textGroup.append("text")
                .attr("x", 32)
                .attr("y", 15)
                .attr("fill", "rgba(255,255,255,0.5)")
                .style("font-size", "11px")
                .style("font-family", "Inter, sans-serif")
                .text(port.role);
        });

            
        


        

    } catch(err) {
        container.innerHTML = '<p style="color: red; text-align: center; margin-top: 200px;">Failed to load map data. Check console.</p>';
        console.error("Map Load Error:", err);
    }
});
