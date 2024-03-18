// ==UserScript==
// @name          Revorix Kampfbericht-Erweiterung
// @namespace     https://github.com/ZupZ3r0
// @author        ZupZ3r0
// @description   Dieses Script erweitert die Kampfberichte um nützlche Daten. Aktuell nur der Insgesamt verursachte Schaden, mehr ist in Zukunft aber denkbar.
// @version       1.0
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/weltraum/revorix.kampf.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/weltraum/revorix.kampf.user.js

// @match    https://game.revorix.de/php/news_pop.php
// ==/UserScript==

function extractValue(td) {
    const match = td.textContent.match(/\(\-\d+\)/);
    return match ? parseInt(match[0].substr(2,match[0].length-3)) : 0;
}

function getDamage(table) {
    let dmg = 0;
    table.querySelectorAll('td').forEach((el) => {
        if(['Schild','Panzerung','Struktur'].indexOf(el.textContent) !== -1){
            dmg += extractValue(el.nextSibling);
        }
    });
    return dmg;
}

try {
    const tables = new Array(...document.querySelectorAll('table[width="100%"]')).slice(2);
    tables.forEach((table) => {
        table.querySelector('.nfo').innerHTML += `<div style="color:white; font-weight: normal;"> 
        ${getDamage(table)} Gesamtschaden
        </div>`;
    });
} catch(e) {console.log(e)}