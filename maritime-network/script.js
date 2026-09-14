document.addEventListener("DOMContentLoaded", () => {
    
    // Mind-Map Dataset
    let nodes = [
        // Diplomatic (Top Left)
        { id: 1, group: 'diplomatic', name: 'AWEX & FIT', role: 'Commercial Office', primary: true, desc: '<strong>Embassy of Belgium Economic & Commercial Office</strong><br>Joint representative for the Wallonia Export-Investment Agency (AWEX) and Flanders Investment & Trade (FIT). Acts as the primary conduit for trade missions, joint venture coordination, and state-backed financing guarantees via Finexpo.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://export.walloniaexportinvestment.be/fr/marches/philippines/" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippines | AWEX Export</a></li><li><a href="https://philippines.diplomatie.belgium.be/en/embassy-and-consulates/embassy-manila/about-us" target="_blank" style="color: #3b82f6; text-decoration: none;">Embassy in Manila - Belgium</a></li><li><a href="https://www.wallonia.ph/en/export-investment-services-ph" target="_blank" style="color: #3b82f6; text-decoration: none;">Export & Investment Services | Wallonia in the Philippines</a></li></ul></div></p>'},
        { id: 2, group: 'diplomatic', name: 'Dept. of Transportation', role: 'Public-Sector Approvals', primary: true, desc: '<strong>Department of Transportation (DOTr)</strong><br>Led by Acting Secretary Giovanni Z. Lopez, who also serves as Chairman of the PPA Governing Board. Directs all national transportation policies and represents the primary signatory for public-sector maritime infrastructure approvals.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.ppa.com.ph/content/board-members" target="_blank" style="color: #3b82f6; text-decoration: none;">PPA Board of Directors - Philippine Ports Authority</a></li><li><a href="https://open.gov.ph/ppa" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Ports Authority - Government Agency — Transparency Portal</a></li><li><a href="https://www.ppa.com.ph/sites/default/files/annual_report/2025_PPA_Annual_Rep_06092026_r.pdf" target="_blank" style="color: #3b82f6; text-decoration: none;">CENTER GROWTH - Philippine Ports Authority</a></li></ul></div></p>'},
        { id: 3, group: 'diplomatic', name: 'Joint Maritime Committee', role: 'European Chambers Advocacy', desc: '<strong>Joint Maritime Committee (JMC)</strong><br>Chaired by Tore Henriksen, the JMC unifies major European chambers to coordinate lobbying efforts directed at local regulatory authorities. It focuses on modernizing domestic shipping, upgrading training protocols, and addressing commercial port utilization.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://nordcham.com.ph/Joint%20Maritime%20Committee" target="_blank" style="color: #3b82f6; text-decoration: none;">The Joint Maritime Committee | Nordic Chamber of Commerce of the Philippines</a></li><li><a href="https://app.glueup.com/en/event/joint-maritime-committee-meeting-for-august-189777/" target="_blank" style="color: #3b82f6; text-decoration: none;">Joint Maritime Committee Meeting for August | German-Philippine Chamber of Commerce and Industry</a></li><li><a href="https://philippinen.ahk.de/de/info-hub/news/2026/navigating-the-waves-of-strategic-insights-from-the-joint-maritime-conference-2026" target="_blank" style="color: #3b82f6; text-decoration: none;">Navigating the Waves of Strategic Insights from the Joint Maritime Conference 2026</a></li><li><a href="https://www.nordcham.com.ph/news/jmc-october-featuring-insights-shipyards-association-philippines" target="_blank" style="color: #3b82f6; text-decoration: none;">JMC October: Featuring Insights from the Shipyards Association of the Philippines</a></li><li><a href="https://pnbc.ph/articles/joint-maritime-committee-meeting-for-march/" target="_blank" style="color: #3b82f6; text-decoration: none;">Joint Maritime Committee Meeting for March - Philippines Norway Business Council</a></li></ul></div></p>'},
        { id: 4, group: 'diplomatic', name: 'BBNJ Secretariat', role: 'Target Node for High Seas HQ', desc: '<strong>BBNJ Secretariat Candidacy</strong><br>Belgium officially submitted its bid to host the Secretariat of the BBNJ (High Seas) Treaty at the Residence Palace in Brussels. The Treaty entered into force in Jan 2026, with the host selection scheduled for Jan 2027.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.bbnjbrussels.be/news/belgium-officially-submits-its-candidacy-for-the-bbnj-secretariat" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium officially submits its candidacy for the BBNJ Secretariat</a></li><li><a href="http://diplomatie.belgium.be/en/news/belgium-promotes-brussels-seat-ocean-biodiversity-convention" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium promotes Brussels as seat for the Ocean Biodiversity Convention</a></li><li><a href="https://www.vliz.be/en/news/belgium-launches-bid-host-secretariat-bbnj-treaty-brussels" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium Launches Bid to Host the Secretariat of the BBNJ Treaty in Brussels</a></li><li><a href="https://www.bbnjbrussels.be/news/belgium-engaged-in-international-efforts-to-protect-marine-biodiversity-beyond-national-jurisdiction" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium engaged in international efforts to protect marine biodiversity beyond national jurisdiction - BBNJ Brussels</a></li></ul></div></p>'},
        { id: 5, group: 'diplomatic', name: 'Belgian-Filipino Business Club', role: 'Lobbying Integration', desc: '<strong>Belgian-Filipino Business Chamber (BFBC)</strong><br>A core member of the Joint Maritime Committee (JMC), representing Belgian commercial interests in the Philippines and working closely with local stakeholders on shipbuilding and industrial cooperation.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://nordcham.com.ph/Joint%20Maritime%20Committee" target="_blank" style="color: #3b82f6; text-decoration: none;">The Joint Maritime Committee | Nordic Chamber of Commerce of the Philippines</a></li><li><a href="https://app.glueup.com/en/event/joint-maritime-committee-meeting-for-august-189777/" target="_blank" style="color: #3b82f6; text-decoration: none;">Joint Maritime Committee Meeting for August | German-Philippine Chamber of Commerce and Industry</a></li></ul></div></p>'},
        { id: 6, group: 'diplomatic', name: 'MARINA', role: 'Seafarer Certifications', desc: '<strong>Maritime Industry Authority (MARINA)</strong><br>Led by Administrator Sonia B. Malaluan. Regulates national seafarer certifications, domestic ship leasing, and maritime labor training standards. A key partner for introducing alternative fuel training.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://marina.gov.ph/wp-content/uploads/2022/06/Mayl-2022-Newsletter.pdf" target="_blank" style="color: #3b82f6; text-decoration: none;">INSIDE STORIES - MARITIME INDUSTRY AUTHORITY</a></li><li><a href="https://www.intercargo.org/selected-headlines-on-alternative-fuels-technologies-2025/" target="_blank" style="color: #3b82f6; text-decoration: none;">Selected Headlines on Alternative Fuels & Technologies 2025 - Intercargo</a></li></ul></div></p>'},
        { id: 7, group: 'diplomatic', name: 'Shipyards Association', role: 'Domestic Vessel Fabrication', desc: '<strong>Shipyards Association of the Philippines</strong><br>Led by President Meneleo Carlos III. Essential for bridging European marine technologies with local dry-dock operations and ship fabrication facilities required for assembling offshore wind logistics barges.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.nordcham.com.ph/news/jmc-october-featuring-insights-shipyards-association-philippines" target="_blank" style="color: #3b82f6; text-decoration: none;">JMC October: Featuring Insights from the Shipyards Association of the Philippines</a></li></ul></div></p>'},
        { id: 8, group: 'diplomatic', name: 'DENR', role: 'Environmental Compliance', desc: '<strong>Department of Environment and Natural Resources (DENR)</strong><br>Crucial for environmental compliance of major projects. Belgium offers the DENR direct access to VLIZ’s marine databases and technology tools to build bilateral goodwill for the BBNJ bid.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.vliz.be/en/news/belgium-launches-bid-host-secretariat-bbnj-treaty-brussels" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium Launches Bid to Host the Secretariat of the BBNJ Treaty in Brussels</a></li></ul></div></p>'},

        // Infrastructure (Bottom Left)
        { id: 9, group: 'infrastructure', name: 'Port of Antwerp-Bruges', role: 'Global Logistics Expertise', primary: true, desc: '<strong>Port of Antwerp-Bruges International</strong><br>World leaders in automated terminal optimization and regional feeder port integration. They present comprehensive port automation proposals for the 12 regional ports scheduled for PPA privatization in 2026.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.ppa.com.ph/sites/default/files/annual_report/2025_PPA_Annual_Rep_06092026_r.pdf" target="_blank" style="color: #3b82f6; text-decoration: none;">CENTER GROWTH - Philippine Ports Authority</a></li></ul></div></p>'},
        { id: 10, group: 'infrastructure', name: 'Asian Development Bank', role: '$13B Portfolio', primary: true, desc: '<strong>Asian Development Bank (ADB) Philippines</strong><br>Manages an active $13 billion country portfolio. Oversees technical assistance grants for municipal port rehabilitation and grid integration studies, as well as a $400-million loan for insurance industry reforms.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.adb.org/news/adb-appoints-new-country-director-philippines-2025" target="_blank" style="color: #3b82f6; text-decoration: none;">ADB Appoints New Country Director for the Philippines - Asian Development Bank</a></li><li><a href="https://insiderph.com/adb-names-andrew-jeffries-as-new-country-director-for-ph" target="_blank" style="color: #3b82f6; text-decoration: none;">ADB names Andrew Jeffries as new country director for PH - InsiderPH</a></li><li><a href="https://www.adb.org/news/f-cleo-kawawaki-appointed-director-general-adb-new-sectors-department-2" target="_blank" style="color: #3b82f6; text-decoration: none;">F. Cleo Kawawaki Appointed as Director General for ADB"s New Sectors Department 2</a></li></ul></div></p>'},
        { id: 11, group: 'infrastructure', name: 'PPA Governing Board', role: '₱16B Port Modernization', primary: true, desc: '<strong>Philippine Ports Authority (PPA) Governing Board</strong><br>Led by General Manager Atty. Jay Daniel R. Santiago. Directs the massive ₱16 billion port efficiency and modernization initiative through 2028, backed by record annual revenues of ₱30.9 billion in 2025.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.ppa.com.ph/content/board-members" target="_blank" style="color: #3b82f6; text-decoration: none;">PPA Board of Directors - Philippine Ports Authority</a></li><li><a href="https://portcalls.com/santiago-is-back-as-ppa-general-manager/" target="_blank" style="color: #3b82f6; text-decoration: none;">Santiago is back as PPA general manager - PortCalls Asia</a></li><li><a href="https://bworldonline.com/economy/2026/01/07/722942/ports-regulator-forecasts-stronger-cargo-passenger-volumes-in-2026/" target="_blank" style="color: #3b82f6; text-decoration: none;">Ports regulator forecasts stronger cargo, passenger volumes in 2026 - BusinessWorld</a></li></ul></div></p>'},
        { id: 12, group: 'infrastructure', name: 'PPA Ops & Engineering', role: 'Bids & Specifications', desc: '<strong>PPA Operations and Engineering Divisions</strong><br>Led by AGMs Mark Jon S. Palomar and James J. Gantalao. They formulate technical guidelines, manage public tenders for regional port expansions, and dictate load-bearing specifications for OSW repurposing contracts.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://open.gov.ph/ppa" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Ports Authority - Government Agency — Transparency Portal</a></li><li><a href="https://www.ppa.com.ph/ppa_contactus" target="_blank" style="color: #3b82f6; text-decoration: none;">ppa_contactus | Philippine Ports Authority Official Website</a></li></ul></div></p>'},
        { id: 13, group: 'infrastructure', name: 'Port of Mercedes', role: '₱2.27B OSW Staging Greenfield', desc: '<strong>Port of Mercedes (Camarines Norte)</strong><br>The replacement OSW staging hub for the Bicol region. Approved budget of ₱2.27 billion for turnkey engineering, dredging, and heavy-piling staging quay development. Construction targeted for mid-2027.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://powerphilippines.com/ppa-sta-clara-and-mercedes-ports-to-be-ready-for-offshore-wind-projects-by-2026/" target="_blank" style="color: #3b82f6; text-decoration: none;">PPA: Sta. Clara and Mercedes Ports to be Ready for Offshore Wind Projects by 2026</a></li><li><a href="https://portcalls.com/ppa-moves-bidding-for-p2b-offshore-wind-port-in-camarines-norte-to-jan-2026/" target="_blank" style="color: #3b82f6; text-decoration: none;">PPA moves bidding for P2B offshore wind port in Camarines Norte to Jan 2026 - PortCalls</a></li><li><a href="https://open.gov.ph/ppa" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Ports Authority - Government Agency — Transparency Portal</a></li></ul></div></p>'},
        { id: 14, group: 'infrastructure', name: 'Port of Sta. Clara', role: 'PPP Concession Terminal', desc: '<strong>Port of Sta. Clara (Batangas City)</strong><br>Positioned near major wind service areas. Designed as a multi-user terminal to handle OSW components and automotive imports. Structured as a Public-Private Partnership (PPP) due to its naturally deep draft.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://powerphilippines.com/ppa-sta-clara-and-mercedes-ports-to-be-ready-for-offshore-wind-projects-by-2026/" target="_blank" style="color: #3b82f6; text-decoration: none;">PPA: Sta. Clara and Mercedes Ports to be Ready for Offshore Wind Projects by 2026</a></li></ul></div></p>'},
        { id: 15, group: 'infrastructure', name: 'Regional Feeder Ports', role: 'Tubigon, Nasipit, Jagna', desc: '<strong>Regional Feeder Port Network</strong><br>Includes the Ports of Tubigon, Getafe, Nasipit, Jagna, Ubay, and Talibon. Active 2026 implementation phases involve strategic dredging and quay expansion to alleviate regional cargo congestion.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://open.gov.ph/ppa" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Ports Authority - Government Agency — Transparency Portal</a></li><li><a href="https://www.ppa.com.ph/sites/default/files/annual_report/2025_PPA_Annual_Rep_06092026_r.pdf" target="_blank" style="color: #3b82f6; text-decoration: none;">CENTER GROWTH - Philippine Ports Authority</a></li></ul></div></p>'},

        // Energy (Top Right)
        { id: 16, group: 'energy', name: 'DEME & Jan De Nul', role: 'Dredging Champions', primary: true, desc: '<strong>DEME Group & Jan De Nul</strong><br>Belgian global leaders with world-class trailing suction hopper dredger (TSHD) fleets. They provide critical geotechnical soil stabilization, marine piling, and heavy foundation engineering for Philippine offshore wind ports.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://christophersensa.com/2026/06/02/jan-de-nul-boskalis-and-chinese-chec-compete-for-dredging-of-martin-garcia-channel/" target="_blank" style="color: #3b82f6; text-decoration: none;">Jan De Nul, Boskalis and Chinese CHEC Compete for Dredging of</a></li><li><a href="https://www.dredgingtoday.com/2026/04/15/breaking-news-jan-de-nul-gears-up-for-itapoa-project-second-phase" target="_blank" style="color: #3b82f6; text-decoration: none;">BREAKING NEWS: Jan De Nul gears up for Itapoá project second phase - DredgingToday</a></li></ul></div></p>'},
        { id: 17, group: 'energy', name: 'CIP & ACEN Corp', role: '1 GW San Miguel Bay', primary: true, desc: '<strong>Copenhagen Infrastructure Partners (CIP) & ACEN</strong><br>Developing the 1,000 MW San Miguel Bay Offshore Wind Project. A $3.0 Billion capital investment targeted for commercial power generation by 2028, preparing to bid in the GEA-5 auction.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.offshorewind.biz/2025/11/05/danish-cip-to-pour-usd-3-billion-into-philippines-offshore-wind-push/" target="_blank" style="color: #3b82f6; text-decoration: none;">Danish CIP to Pour USD 3 Billion Into Philippines" Offshore Wind Push</a></li><li><a href="https://mb.com.ph/2025/05/29/acen-copenhagen-firm-partner-for-1-gw-offshore-wind-project-in-camarines-sur" target="_blank" style="color: #3b82f6; text-decoration: none;">ACEN, Copenhagen firm partner for 1-GW offshore wind project in Camarines Sur</a></li><li><a href="https://ndfp.info/camarines-sur-fisherfolk-oppose-offshore-wind-projects-in-san-miguel-bay/" target="_blank" style="color: #3b82f6; text-decoration: none;">Camarines Sur fisherfolk oppose offshore wind projects in San Miguel Bay</a></li></ul></div></p>'},
        { id: 18, group: 'energy', name: 'San Miguel Corp (SMC)', role: 'Bulacan Airport Logistics', primary: true, desc: '<strong>San Miguel Corporation (SMC)</strong><br>Controls 5,710 MW of national grid generation capacity. Executing a major energy transition and constructing the New Manila International Airport (Bulacan Airport) logistics center, a natural entry point for Belgian dredging.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.smcglobalpower.com.ph/storage/files/reports/17-A/San-Miguel-Global-Power-Holdings-Corp-SEC-Form-17-A-2025-Annual-Report-15-April-2026-FINAL.pdf" target="_blank" style="color: #3b82f6; text-decoration: none;">SMC Global Power</a></li><li><a href="https://www.philstar.com/business/2026/06/10/2534023/smc-maps-out-next-growth-chapter-strategic-sectors" target="_blank" style="color: #3b82f6; text-decoration: none;">SMC maps out next growth chapter in strategic sectors | Philstar.com</a></li><li><a href="https://www.pna.gov.ph/articles/1278477" target="_blank" style="color: #3b82f6; text-decoration: none;">San Miguel pumps P1.43T into economy from 2025 revenues | Philippine News Agency</a></li><li><a href="https://www.sanmiguel.com.ph/corporate/news" target="_blank" style="color: #3b82f6; text-decoration: none;">News - San Miguel Corporation - Your World Made Better</a></li></ul></div></p>'},
        { id: 19, group: 'energy', name: 'Princess Elisabeth Island', role: 'Renewable Showcase', desc: '<strong>Princess Elisabeth Island</strong><br>An artificial energy island in the North Sea serving as an extension of the Belgian power grid. It acts as a primary technological showcase of Belgium\'s world-class offshore wind engineering capabilities.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://hub.brussels/en/international-network/" target="_blank" style="color: #3b82f6; text-decoration: none;">Our International Network - hub.brussels</a></li></ul></div></p>'},
        { id: 20, group: 'energy', name: 'CINMF', role: '1 GW Samar & Dagupan', desc: '<strong>Copenhagen Infrastructure New Markets Fund (CINMF)</strong><br>100% foreign-owned developer driving the 650 MW Samar and 350 MW Dagupan Offshore Wind Projects. Part of CIP’s massive $3.0B investment envelope in the Philippines.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://esgnews.com/philippines-doe-agrees-to-2000-mw-offshore-wind-deals-with-copenhagen-infrastructure-new-markets-fund/" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippines" DOE Agrees to 2,000-MW Offshore Wind Deals with Copenhagen Infrastructure New Markets Fund - ESG News</a></li><li><a href="https://ndfp.info/camarines-sur-fisherfolk-oppose-offshore-wind-projects-in-san-miguel-bay/" target="_blank" style="color: #3b82f6; text-decoration: none;">Camarines Sur fisherfolk oppose offshore wind projects in San Miguel Bay</a></li></ul></div></p>'},
        { id: 21, group: 'energy', name: 'BuhaWind Energy', role: '2 GW Northern Luzon', desc: '<strong>BuhaWind Energy</strong><br>A joint venture utilizing floating turbine technology to develop a massive 2,000 MW (2 GW) offshore wind project in Northern Luzon, targeting full commercial operations by 2030.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.wfw.com/articles/offshore-wind-in-the-philippines/" target="_blank" style="color: #3b82f6; text-decoration: none;">Offshore Wind in the Philippines - Watson Farley & Williams</a></li></ul></div></p>'},
        { id: 22, group: 'energy', name: 'CMB.TECH & Exmar', role: 'Ammonia/Hydrogen Innovators', desc: '<strong>CMB.TECH & Exmar</strong><br>Belgian pioneers in hydrogen and ammonia dual-fuel ship operations. They are leading the global transition to zero-carbon shipping and developing corresponding crew training systems.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.seacon.com/index.php?c=show&id=2246" target="_blank" style="color: #3b82f6; text-decoration: none;">From Lab to Vessel: Inside WinGDs Ammonia Engine</a></li><li><a href="https://www.intercargo.org/selected-headlines-on-alternative-fuels-technologies-2025/" target="_blank" style="color: #3b82f6; text-decoration: none;">Selected Headlines on Alternative Fuels & Technologies 2025 - Intercargo</a></li><li><a href="https://exmar.com/en/" target="_blank" style="color: #3b82f6; text-decoration: none;">Welcome to EXMAR | Exmar</a></li></ul></div></p>'},
        { id: 23, group: 'energy', name: 'Local Logistics Firms', role: 'Green Financing', desc: '<strong>Local Marine Logistics Firms</strong><br>Domestic fleet operators needing significant upgrades and green financing to participate in offshore wind logistics, offering joint venture opportunities for European specialized fleet operators.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://mb.com.ph/2026/01/26/danish-fund-cip-bets-on-philippine-ports-to-meet-wind-timeline" target="_blank" style="color: #3b82f6; text-decoration: none;">Danish Fund CIP bets on Philippine ports to meet wind timeline - Manila Bulletin</a></li></ul></div></p>'},

        // Welfare (Bottom Right)
        { id: 24, group: 'welfare', name: 'Philippine Transmarine', role: 'Manpower Supply', primary: true, desc: '<strong>Philippine Transmarine Carriers (PTC)</strong><br>One of the largest crew management companies in the Philippines, essential for providing the global manpower required for international shipping and emerging green-fleet operations.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.intercargo.org/selected-headlines-on-alternative-fuels-technologies-2025/" target="_blank" style="color: #3b82f6; text-decoration: none;">Selected Headlines on Alternative Fuels & Technologies 2025 - Intercargo</a></li></ul></div></p>'},
        { id: 25, group: 'welfare', name: 'Philippine Coast Guard', role: 'Maritime Security', primary: true, desc: '<strong>Philippine Coast Guard (PCG)</strong><br>Led by Commandant CG Admiral Ronnie Gil L. Gavan. Expanding its fleet and maritime domain awareness capabilities. A prime target for Belgian technical partnerships in subsea surveillance and drone operations.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://en.wikipedia.org/wiki/Philippine_Coast_Guard" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Coast Guard - Wikipedia</a></li><li><a href="https://www.dvidshub.net/image/9809106/philippine-coast-guard-commandant-visits-us-pacific-fleet-headquarters-during-rimpac-2026" target="_blank" style="color: #3b82f6; text-decoration: none;">Philippine Coast Guard Commandant visits U.S. Pacific Fleet headquarters during RIMPAC 2026 - DVIDS</a></li><li><a href="https://opinion.inquirer.net/194201/why-the-coast-guard-needs-a-governance-overhaul" target="_blank" style="color: #3b82f6; text-decoration: none;">Why the Coast Guard needs a governance overhaul - Inquirer Opinion</a></li><li><a href="https://politiko.com.ph/2026/09/01/law-extending-pcg-chiefs-term-benefitted-only-gavan-says-retired-general/daily-feed/" target="_blank" style="color: #3b82f6; text-decoration: none;">Law extending PCG chief"s term benefitted only Gavan, says retired general - POLITIKO</a></li><li><a href="https://elibrary.judiciary.gov.ph/thebookshelf/showdocs/2/98484" target="_blank" style="color: #3b82f6; text-decoration: none;">REPUBLIC ACT NO. 12122 - AN ACT FIXING THE TERM OF OFFICE OF THE PHILIPPINE COAST GUARD COMMANDANT AND FOR OTHER PURPOSES - Supreme Court E-Library</a></li></ul></div></p>'},
        { id: 26, group: 'welfare', name: 'Filipino Seafarers', role: 'Global Maritime Workforce', desc: '<strong>The Filipino Seafarer Workforce</strong><br>The primary providers of global maritime labor. The industry\'s transition to alternative, zero-carbon fuels requires major updates to their training to meet strict international ESG audits.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://www.intercargo.org/selected-headlines-on-alternative-fuels-technologies-2025/" target="_blank" style="color: #3b82f6; text-decoration: none;">Selected Headlines on Alternative Fuels & Technologies 2025 - Intercargo</a></li></ul></div></p>'},
        { id: 27, group: 'welfare', name: 'P&I Clubs & Pandiman', role: 'Specialized Insurance', desc: '<strong>Protection and Indemnity (P&I) Clubs</strong><br>Working alongside Pandiman Philippines (Captain Andrew Malpass) to establish standardized, transparent dispute resolution systems to curb predatory "ambulance chasing" litigation against shipowners.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://pnbc.ph/articles/joint-maritime-committee-meeting-for-march/" target="_blank" style="color: #3b82f6; text-decoration: none;">Joint Maritime Committee Meeting for March - Philippines Norway Business Council</a></li></ul></div></p>'},
        { id: 28, group: 'welfare', name: 'De Blauwe Cluster & VLIZ', role: 'Flanders Innovation', desc: '<strong>De Blauwe Cluster & VLIZ</strong><br>Flanders’ leading innovation ecosystem focused on marine security and the blue economy. VLIZ hosts global databases essential for BBNJ enforcement, including the World Register of Marine Species (WoRMS).<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://source.flandersinvestmentandtrade.com/aade7f4f-4f65-4d86-95af-ebcff7e0325a/Flanders--DALO-Industry-Days-2026/301eada5-b264-f111-a826-7c1e52345ae3/De-Blauwe-Cluster-Blue-Cluster-vzw" target="_blank" style="color: #3b82f6; text-decoration: none;">De Blauwe Cluster (Blue Cluster) vzw - Source from Flanders</a></li><li><a href="https://www.vliz.be/en/news/belgium-launches-bid-host-secretariat-bbnj-treaty-brussels" target="_blank" style="color: #3b82f6; text-decoration: none;">Belgium Launches Bid to Host the Secretariat of the BBNJ Treaty in Brussels</a></li></ul></div></p>'},
        { id: 29, group: 'welfare', name: 'APEC & Anglo-Eastern', role: 'Dual-Fuel Training', desc: '<strong>Antwerp Port Training Center (APEC) & Anglo-Eastern</strong><br>APEC provides a fully certified global curriculum for specialized maritime skills. Anglo-Eastern has already completed its first pilot training course on ammonia as a marine fuel.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://isa.org.jm/gsr-pmn_professional_training/" target="_blank" style="color: #3b82f6; text-decoration: none;">Call for nominations GSR – Professional Training (Apec Dredging Seminar + DEME Field Activity) - International Seabed Authority</a></li><li><a href="https://www.intercargo.org/selected-headlines-on-alternative-fuels-technologies-2025/" target="_blank" style="color: #3b82f6; text-decoration: none;">Selected Headlines on Alternative Fuels & Technologies 2025 - Intercargo</a></li></ul></div></p>'},
        { id: 30, group: 'welfare', name: 'GSR', role: 'Deep-Sea Technical Training', desc: '<strong>Global Sea Mineral Resources NV (GSR)</strong><br>A subsidiary of the DEME Group establishing a dedicated 3-week training program in June 2026. The curriculum covers advanced dredging technologies and navigating geotechnically challenging areas.<hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;"><div style="font-size: 0.85rem;"><strong style="color: #64748b;">Sources:</strong><ul style="margin-top: 8px; padding-left: 15px;"><li><a href="https://isa.org.jm/gsr-pmn_professional_training/" target="_blank" style="color: #3b82f6; text-decoration: none;">Call for nominations GSR – Professional Training (Apec Dredging Seminar + DEME Field Activity) - International Seabed Authority</a></li></ul></div></p>'}
    ];

    const edges = [
        // Hub Connections (The primary hierarchy trunks)
        { from: 'hub', to: 1, label: 'Export Credits', type: 'financial' },
        { from: 'hub', to: 4, label: 'Secretariat Bid', type: 'regulatory' },
        { from: 'hub', to: 5, label: 'Strategic Dialog', type: 'regulatory' },
        { from: 'hub', to: 9, label: 'Global Expertise', type: 'logistical' },
        { from: 'hub', to: 16, label: 'Industry Lead', type: 'logistical' },
        { from: 'hub', to: 24, label: 'Manpower Core', type: 'knowledge' },

        // Cross Connections (Rendered as sweeping background arcs)
        { from: 2, to: 6, label: 'Welfare Reforms', type: 'regulatory' },
        { from: 2, to: 11, label: 'Privatization Input', type: 'regulatory' },
        { from: 2, to: 7, label: 'Domestic Fab', type: 'logistical' },
        { from: 3, to: 2, label: 'Lobbying Force', type: 'regulatory' },
        { from: 8, to: 4, label: 'Env Alignment', type: 'regulatory' },

        { from: 10, to: 9, label: 'Funding Roadshow', type: 'financial' },
        { from: 11, to: 9, label: 'MoU Groundwork', type: 'regulatory' },
        { from: 12, to: 13, label: 'Turnkey Contract', type: 'financial' },
        { from: 12, to: 14, label: 'PPP Bidding', type: 'financial' },
        { from: 12, to: 15, label: 'Dredging Tenders', type: 'financial' },

        { from: 16, to: 13, label: 'Soil Consolidation', type: 'logistical' }, 
        { from: 16, to: 17, label: 'Capability Showcase', type: 'knowledge' },
        { from: 16, to: 18, label: 'Joint Bid (1 GW)', type: 'financial' },
        { from: 16, to: 19, label: 'Installation', type: 'logistical' },
        { from: 16, to: 21, label: 'Airport Logistics', type: 'logistical' },
        { from: 22, to: 23, label: 'Fleet Upgrades', type: 'financial' },

        { from: 26, to: 6, label: 'Magna Carta Lobby', type: 'regulatory' }, 
        { from: 26, to: 24, label: 'Dispute Protection', type: 'regulatory' },
        { from: 24, to: 25, label: 'Manpower Supply', type: 'logistical' },
        { from: 29, to: 25, label: 'Green Certification', type: 'knowledge' },
        { from: 30, to: 29, label: 'Dredging Seminar', type: 'knowledge' },
        { from: 28, to: 27, label: 'Subsea Tech', type: 'logistical' },
        { from: 28, to: 4, label: 'VLIZ Data Support', type: 'knowledge' } 
    ];

    const typeColors = {
        'financial': '#FBBF24', // Gold
        'logistical': '#60A5FA', // Blue
        'regulatory': '#F87171', // Red
        'knowledge': '#34D399'  // Green
    };

    function renderNodes() {
        nodes.forEach(node => {
            const tierId = node.primary ? `tier1-${node.group}` : `tier2-${node.group}`;
            const list = document.getElementById(tierId);
            if (!list) return;

            const el = document.createElement('div');
            el.className = `mindmap-node ${node.primary ? 'primary-node' : ''}`;
            el.id = `node-${node.id}`;
            el.innerHTML = `<h3>${node.name}</h3><p>${node.role}</p>`;
            
            // Attach click listener for modal
            el.addEventListener('click', () => openModal(node));

            list.appendChild(el);
        });

        // Add modal trigger to Embassy Hub
        const hubElement = document.getElementById('hub-node');
        if (hubElement) {
            hubElement.addEventListener('click', () => {
                openModal({
                    name: 'Embassy of Belgium',
                    role: 'Manila, Philippines',
                    category: 'command hub',
                    desc: '<p><strong>The Strategic Anchor</strong><br>The Economic and Commercial Office of the Embassy of Belgium in Manila orchestrates the comprehensive blueprint bridging Belgian industrial, maritime, and green energy capabilities with the development priorities of the Republic of the Philippines.</p>'
                });
            });
        }
        
        setTimeout(drawConnections, 300);
    }

    // Modal Logic
    const modalOverlay = document.getElementById('detail-modal');
    const modalClose = document.getElementById('modal-close');
    
    function openModal(nodeData) {
        document.getElementById('modal-title').textContent = nodeData.name;
        document.getElementById('modal-role').textContent = nodeData.role;
        document.getElementById('modal-category').textContent = (nodeData.category || nodeData.group).toUpperCase();
        document.getElementById('modal-body').innerHTML = nodeData.desc || '<p>Detailed information not available.</p>';
        modalOverlay.classList.add('active');
    }
    window.openModal = openModal; // Expose globally for map.js

    modalClose.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });
    
    // Close on outside click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    function drawConnections() {
        const svg = document.getElementById('connections-svg');
        if (!svg) return;
        
        const defs = svg.querySelector('defs');
        const defsHTML = defs ? defs.outerHTML : '';
        
        let svgContent = defsHTML;
        document.querySelectorAll('.edge-label-pill').forEach(el => el.remove());
        document.querySelectorAll('.cross-tags').forEach(el => el.remove());
        
        const canvasContainer = document.getElementById('poster-canvas');
        const canvasRect = canvasContainer.getBoundingClientRect();
        const hubElement = document.getElementById('hub-node');
        
        const getRectInfo = (el) => {
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return {
                left: rect.left - canvasRect.left + canvasContainer.scrollLeft,
                right: rect.right - canvasRect.left + canvasContainer.scrollLeft,
                top: rect.top - canvasRect.top + canvasContainer.scrollTop,
                bottom: rect.bottom - canvasRect.top + canvasContainer.scrollTop,
                width: rect.width,
                height: rect.height,
                centerX: (rect.left - canvasRect.left + canvasContainer.scrollLeft) + rect.width / 2,
                centerY: (rect.top - canvasRect.top + canvasContainer.scrollTop) + rect.height / 2
            };
        };

        // Pass 1: DOM Mutations (Injecting tags)
        // We MUST do this first so the nodes expand and the layout settles BEFORE we measure coordinates!
        edges.forEach((edge) => {
            if (edge.from !== 'hub') {
                const color = typeColors[edge.type] || '#ffffff';
                const fromEl = document.getElementById(`node-${edge.from}`);
                if (fromEl) {
                    let tagsContainer = fromEl.querySelector('.cross-tags');
                    if (!tagsContainer) {
                        tagsContainer = document.createElement('div');
                        tagsContainer.className = 'cross-tags';
                        fromEl.appendChild(tagsContainer);
                    }
                    
                    const toNodeData = nodes.find(n => n.id === edge.to);
                    const toName = toNodeData ? toNodeData.name : 'Unknown';
                    
                    const tag = document.createElement('div');
                    tag.className = 'cross-tag';
                    tag.style.borderColor = color;
                    tag.innerHTML = `<span style="color:${color}">→ ${toName}</span><br><span style="color:#94a3b8; font-weight:500;">${edge.label}</span>`;
                    tagsContainer.appendChild(tag);
                }
            }
        });

        // Re-measure Hub after all tags have expanded the grid layout
        const hubRect = getRectInfo(hubElement);
        
        // Count edges to dynamically center the lanes
        let topEdges = 0;
        let bottomEdges = 0;
        edges.forEach(edge => {
            if (edge.from === 'hub') {
                const tr = getRectInfo(document.getElementById(`node-${edge.to}`));
                if (tr) {
                    if (tr.centerY < hubRect.centerY) topEdges++;
                    else bottomEdges++;
                }
            }
        });

        let topLaneCounter = 0;
        let bottomLaneCounter = 0;

        // Pass 2: SVG Routing (Vertical I-line Bus)
        edges.forEach((edge, index) => {
            if (edge.from === 'hub') {
                const color = typeColors[edge.type] || '#ffffff';
                const toRect = getRectInfo(document.getElementById(`node-${edge.to}`));
                
                if (hubRect && toRect) {
                    const isTop = toRect.centerY < hubRect.centerY;
                    const isLeft = toRect.centerX < hubRect.centerX;
                    
                    let laneIndex = isTop ? topLaneCounter++ : bottomLaneCounter++;
                    const maxLanes = isTop ? topEdges : bottomEdges;
                    
                    // Center the parallel vertical lanes around the hub's center X
                    const laneOffset = (laneIndex - (maxLanes - 1) / 2) * 16;
                    
                    const startX = hubRect.centerX + laneOffset;
                    // Connect to the top and bottom of the Embassy
                    const startY = isTop ? hubRect.top : hubRect.bottom;
                    
                    const endX = isLeft ? toRect.right : toRect.left;
                    const endY = toRect.centerY;
                    
                    // Vertical I-line trunk, then horizontal branch to the node
                    const pathStr = `M ${startX} ${startY} L ${startX} ${endY} L ${endX} ${endY}`;
                    
                    svgContent += `<path d="${pathStr}" stroke="${color}" stroke-width="3" fill="none" />`;
                    
                    // Position label on the massive horizontal segment to capitalize on empty space
                    if (edge.label) {
                        const pill = document.createElement('div');
                        pill.className = 'edge-label-pill';
                        pill.textContent = edge.label;
                        
                        // Center label exactly on the horizontal branch
                        const labelX = (startX + endX) / 2;
                        const labelY = endY - 15;
                        
                        pill.style.left = `${labelX}px`;
                        pill.style.top = `${labelY}px`;
                        pill.style.borderColor = color;
                        pill.style.color = color;
                        
                        canvasContainer.appendChild(pill);
                    }
                }
            }
        });
        
        svg.innerHTML = svgContent;
    }

    window.addEventListener('resize', drawConnections);
    renderNodes();

    const exportPngBtn = document.getElementById("export-png-btn");
    const posterCanvas = document.getElementById("poster-canvas");
    
    exportPngBtn.addEventListener("click", async () => {
        const originalText = exportPngBtn.innerHTML;
        exportPngBtn.innerHTML = "GENERATING...";
        
        try {
            const canvas = await html2canvas(posterCanvas, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#0f172a"
            });
            
            const imgData = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = imgData;
            a.download = 'MindMap_Hierarchy.png';
            a.click();
        } catch (err) {
            console.error(err);
            alert("Export failed.");
        } finally {
            exportPngBtn.innerHTML = originalText;
        }
    });
});
