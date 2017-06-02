// ==UserScript==
// @name        Revorix-Schiffsalter-Berechnung
// @namespace   http://random.erdbeerkuchen.net/
// @description Zeigt das geschätzte Alter eines Schiffes im Flottenscan an
// @downloadURL http://random.erdbeerkuchen.net/rxcode/scripts/DarkIce/rxshipid.user.js
// @updateURL   http://random.erdbeerkuchen.net/rxcode/scripts/DarkIce/rxshipid.meta.js
// @version     1.0.20120813
//
// @include     http://87.106.151.92/*/map_fflotte.php*
// @include     http://www.revorix.info/*/map_fflotte.php*
// ==/UserScript==

/* made by DarkIce */

// Referenzen - ShipID + Bautag aus dem Logbuch (vorsicht bei Baubeschleunigern!) - Monate sind 0-basiert!
var refs = new Array();
refs[0] = new Array(8305319, (new Date(2010, 0, 3)).getTime());
refs[1] = new Array(8827853, (new Date(2010, 4, 5)).getTime());
refs[2] = new Array(8834088, (new Date(2010, 4, 6)).getTime());
refs[3] = new Array(9030978, (new Date(2010, 5, 23)).getTime());
refs[4] = new Array(9685802, (new Date(2010, 10, 11)).getTime());
refs[5] = new Array(9701090, (new Date(2010, 10, 6)).getTime());
refs[6] = new Array(10182659, (new Date(2011, 2, 3)).getTime());
refs[7] = new Array(10341619, (new Date(2011, 3, 5)).getTime());
refs[8] = new Array(10341620, (new Date(2011, 3, 6)).getTime());
refs[9] = new Array(10679503, (new Date(2011, 5, 29)).getTime());
refs[10] = new Array(10877184, (new Date(2011, 7, 8)).getTime());
refs[11] = new Array(11144371, (new Date(2011, 9, 15)).getTime());
refs[12] = new Array(12066716, (new Date(2012, 3, 30)).getTime());
refs[13] = new Array(12082758, (new Date(2012, 4, 3)).getTime());
refs[14] = new Array(12285753, (new Date(2012, 5, 17)).getTime());
refs[15] = new Array(12569065, (new Date(2012, 7, 21)).getTime());
refs[16] = new Array(12592746, (new Date(2012, 7, 27)).getTime());
refs[17] = new Array(12788832, (new Date(2012, 9, 5)).getTime());
refs[18] = new Array(13893946, (new Date(2013, 4, 24)).getTime());
refs[19] = new Array(14118974, (new Date(2013, 7, 12)).getTime());

var now = (new Date()).getTime();	// ms

function initShipID()
{
	var tables = document.getElementsByTagName('table');

	for (var i = 0; i < tables.length; i++) {
		var trelemente = tables[i].getElementsByTagName('tr');
		var text = trelemente[0].textContent;

		if (text == "Gescannte Schiffe") {
			// resize popup to prevent linebreaks
			if (markBuildAge(trelemente) == 1)
				window.resizeBy(100, 0);
		}
	}
}

function markBuildAge(trelemente)
{
	var hasExecuted = 0;

	for (var i = 2; i < trelemente.length; i++) {
		var tr = trelemente[i];
		var tdelemente = tr.getElementsByTagName('td');

		if (tdelemente.length == 3) {
			var tdshipid = tdelemente[0];
			shipid = extractID(tdshipid.textContent);

			var lowindex = refs.length;
			var highindex = refs.length;

			// find adjacent grid points
			for (var j = 0; j < refs.length; j++) {
				if (shipid < refs[j][0]) {
					lowindex = j - 1;
					highindex = j;
					break;
				}
			}

			// lower bound
			if (lowindex < 0) {
				lowindex = 0;
				highindex = 1;
			}

			// upper bound
			if (highindex >= refs.length) {
				lowindex = refs.length - 2;
				highindex = refs.length - 1;
			}

			// dy / dx
			var m = (refs[highindex][1] - refs[lowindex][1]) /
				(refs[highindex][0] - refs[lowindex][0])
			// y1 - m*x1
			var c = refs[lowindex][1] - m * refs[lowindex][0];
			var estdate = new Date(m * shipid + c);

			var agemonths = Math.round((now - estdate) /
				(1000 * 60 * 60 * 24 * 365) * 12);
			var diffyears = Math.floor(agemonths / 12);
			var diffmonths = agemonths % 12;

			tdshipid.innerHTML += "&nbsp;<span style='color:#FFFF00'>" +
				strAge(diffyears, diffmonths) + "</span>";

			hasExecuted = 1;
		}
	}

	return hasExecuted;
}

function extractID(str)
{
	/* reference: Begleitschiff (L) xyz (ID:874535) */
	var split = str.split(":");
	var IDsplit = split[1].split(")");

	return IDsplit[0];
}

function strAge(yy, mm)
{
	var str = "&nbsp;(";

	if ((mm <= 0) && (yy <= 0)) {
		str += "neu";
	} else {
		if (yy > 0) {
			str += yy + "&nbsp;Jahr";

			if (yy > 1)
				str += "e";

			if (mm > 0)
				str += ",&nbsp;"
		}

		if (mm > 0) {
			str += mm + "&nbsp;Monat";
			if (mm > 1)
				str += "e";
		}
	}

	str += ")";

	return str;
}

initShipID();
