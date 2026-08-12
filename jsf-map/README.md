# JSF D3 Map

This interactive SVG vector map uses **D3.js**.

Because it dynamically fetches geographic data files to draw the SVG paths, web browsers will block it from loading if you simply double-click the `index.html` file on your computer (CORS security restriction).

## How to run the map

You must start a lightweight local web server in this directory.

**If you have Node.js installed:**
1. Open your terminal in this folder (`jsf-map`)
2. Run `npx http-server`
3. Open the link provided in your browser (usually `http://127.0.0.1:8080`)

**If you have Python installed (Mac default):**
1. Open your terminal in this folder (`jsf-map`)
2. Run `python3 -m http.server 8000`
3. Open `http://localhost:8000` in your browser.
