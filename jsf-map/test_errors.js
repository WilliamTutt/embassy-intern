const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const dom = new JSDOM(html, {
    url: "file://" + path.join(__dirname, 'index.html'),
    runScripts: "dangerously",
    resources: "usable"
});

dom.window.onerror = function(message, source, lineno, colno, error) {
    console.error("ERROR: ", message, " at line ", lineno);
};

dom.window.document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        console.log("Done waiting 2 seconds");
    }, 2000);
});
