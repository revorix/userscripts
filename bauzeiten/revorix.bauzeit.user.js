// ==UserScript==
// @name            Revorix Bauzeit-Script
// @namespace       http://toasten.de/
// @description     Dieses Script erweitert die Bau-Anzeige. Es zeigt an, wann ein Bau abgeschlossen wird.
// @version         3.2.210921
//
// @updateURL       https://github.com/tpummer/gm-revorix/raw/master/bauzeiten/revorix.bauzeit.meta.js
// @downloadURL     https://github.com/tpummer/gm-revorix/raw/master/bauzeiten/revorix.bauzeit.user.js
//
// @grant           none
// @include         http*revorix.de/*/bau.php*
// ==/UserScript==

/*
Originally created by toasten
*/
(function () {
  "use strict";

  var isOpera = "Opera" == navigator.appName;
  var isFireFox = "Netscape" == navigator.appName;

  var now = new Date().getTime();
  var tage = new Array("So", "Mo", "Di", "Mi", "Do", "Fr", "Sa");

  function initBauzeit() {
    var tables = document.getElementsByTagName("table");
    var text = "";

    for (var i = 0; i < tables.length; i++) {
      var trelemente = tables[i].getElementsByTagName("tr");

      if (isOpera) {
        text = trelemente[0].innerText;
      } else {
        text = trelemente[0].textContent;
      }

      if (text.indexOf("Interner Ausbau") > -1) {
        markGeb(trelemente);
      }
    }
  }

  function markGeb(trelemente) {
    var lastSekunden = 0;

    for (var i = 2; i < trelemente.length; i++) {
      var tr = trelemente[i];
      var tdelemente = tr.getElementsByTagName("td");
      var zeittd;

      if (tdelemente.length == 18) {
        // Gebäude-Name bzw. Zeile mit Dauer für nächstes Level
        var td = tdelemente[0];
        var text = getTDText(td);

        var s = text.indexOf("(");
        var geb = text.substring(0, s - 1);

        if ("Nächstes Level" == geb) {
          // bspw. "Nächstes Level (87)"
          zeittd = tdelemente[16];
          let sekunden = getSekunden(getTDText(zeittd));
          let fertig = new Date(now + sekunden * 1000);
          let datestr = formatDate(fertig);

          zeittd.innerHTML +=
            "<br/><div style='color:orange'>" + datestr + "</div>";
        } else {
          //18 Tage 00:27:00
          zeittd = tdelemente[16];
          let sekunden = getSekunden(getTDText(zeittd));
          let fertig = new Date(now + sekunden * 1000);
          let datestr = formatDate(fertig);

          zeittd.innerHTML +=
            "<br/><div style='color:orange'>" + datestr + "</div>";
        }
      } else if (tdelemente.length == 4) {
        // Gebäude aktuell im Ausbau
        zeittd = tdelemente[2];
        // Zeit zumindest unter Chromium nicht als Text abgrabschbar
        const timerDiv = zeittd.querySelector("div[id^=timer]")
        let remainingTime;
        if (timerDiv && timerDiv.firstChild) {
          // Daten für Timer holen und zerlegen
          // 33115|3702840|400
          let splits = timerDiv.firstChild.data.split('|')
          remainingTime = splits[1] - splits[0]
        }
        let fertig = new Date(now + remainingTime * 1000);
        zeittd.innerHTML +=
          "<br/><div style='color:orange; float:right;'>" +
          formatDate(fertig) +
          "</div>";
      } else {
        // Ressourcen-Header, seltsame leere Zeilen, Gebäude-Gruppe ("Interner Ausbau", ...)
      }
    }
  }

  function formatDate(datum) {
    //Fertig: 19.08.2011 07:07:00
    let value = tage[datum.getDay()] + " ";
    value += datum.getDate() + ".";
    value +=
      (isFireFox || isOpera ? 1 + datum.getMonth() : datum.getMonth()) + " ";
    value +=
      (isFireFox || isOpera ? 1900 + datum.getYear() : datum.getYear()) + " ";
    value +=
      (datum.getHours() < 10 ? "0" + datum.getHours() : datum.getHours()) + ":";
    value +=
      (datum.getMinutes() < 10
        ? "0" + datum.getMinutes()
        : datum.getMinutes()) + ":";
    value +=
      datum.getSeconds() < 10 ? "0" + datum.getSeconds() : datum.getSeconds();

    return value;
  }

  function getSekunden(zeit) {
    let split = zeit.split(" ");
    let sekunden;

    if (split.length >= 3) {
      sekunden = split[0] * 24 * 60 * 60;
      sekunden += getSekundenFromStunden(split[2]);
      return sekunden;
    } else {
      sekunden = getSekundenFromStunden(split[0]);
      return sekunden;
    }
  }

  function getSekundenFromStunden(zeit) {
    let split = zeit.split(":");
    let sekunden;
    sekunden = split[0] * 60 * 60;
    sekunden += split[1] * 60;
    sekunden += split[2] * 1;
    return sekunden;
  }

  function getTDText(td) {
    if (isOpera) {
      return td.innerText;
    } else {
      return td.textContent;
    }
  }

  initBauzeit();
})();
