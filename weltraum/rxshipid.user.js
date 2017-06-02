// ==UserScript==
// @name        Revorix-Schiffsalter-Berechnung
// @namespace   http://random.erdbeerkuchen.net/
// @author      DarkIce (The42)
// @description Zeigt das geschätzte Alter eines Schiffes im Flottenscan an
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/weltraum/rxshipid.user.js
// @updateURL   https://raw.githubusercontent.com/tpummer/gm-revorix/master/weltraum/rxshipid.meta.js
// @version     1.0.20120813
// @grant       None
//
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*\/map_fflotte\.php/
// ==/UserScript==

(function()
{
	"use strict";

	/*
	 * Referenzen - ShipID + Bautag aus dem Logbuch (vorsicht bei
	 * Baubeschleunigern!) - Monate sind 0-basiert!
	 */
	var refs = [];
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
	refs[18] = new Array(13359482, (new Date(2013, 1, 3)).getTime());
	refs[19] = new Array(13893946, (new Date(2013, 4, 24)).getTime());
	refs[20] = new Array(14073123, (new Date(2013, 6, 26)).getTime());
	refs[21] = new Array(14092467, (new Date(2013, 7, 2)).getTime());
	refs[22] = new Array(14118974, (new Date(2013, 7, 12)).getTime());
	refs[23] = new Array(14334459, (new Date(2013, 9, 14)).getTime());
	refs[24] = new Array(14420282, (new Date(2013, 10, 4)).getTime());
	refs[25] = new Array(14563368, (new Date(2013, 11, 9)).getTime());
	refs[26] = new Array(14682114, (new Date(2014, 0, 9)).getTime());
	refs[27] = new Array(14784961, (new Date(2014, 1, 11)).getTime());
	refs[28] = new Array(14878690, (new Date(2014, 1, 28)).getTime());
	refs[29] = new Array(14925049, (new Date(2014, 2, 12)).getTime());
	refs[30] = new Array(15073666, (new Date(2014, 3, 27)).getTime());
	refs[31] = new Array(15088285, (new Date(2014, 4, 2)).getTime());
	refs[32] = new Array(15106745, (new Date(2014, 4, 9)).getTime());
	refs[33] = new Array(15155598, (new Date(2014, 4, 26)).getTime());
	refs[34] = new Array(15282800, (new Date(2014, 6, 16)).getTime());
	refs[35] = new Array(15359149, (new Date(2014, 7, 3)).getTime());
	refs[36] = new Array(15364350, (new Date(2014, 7, 5)).getTime());
	refs[37] = new Array(15947042, (new Date(2015, 2, 3)).getTime());
	refs[38] = new Array(16165872, (new Date(2015, 5, 7)).getTime());
	refs[39] = new Array(16392969, (new Date(2015, 8, 25)).getTime());
	refs[40] = new Array(16731355, (new Date(2016, 1, 6)).getTime());
	refs[41] = new Array(16819175, (new Date(2016, 2, 15)).getTime());
	refs[42] = new Array(16842005, (new Date(2016, 2, 26)).getTime());
	refs[43] = new Array(17270811, (new Date(2016, 10, 7)).getTime());
	refs[44] = new Array(17476791, (new Date(2017, 2, 23)).getTime());

	var now = (new Date()).getTime();	// ms

	function initShipID()
	{
		var tables = document.getElementsByTagName('table');

		for (var i = 0; i < tables.length; i++) {
			var rows = tables[i].getElementsByTagName('tr');
			var text = rows[0].textContent;

			if (text == "Gescannte Schiffe") {
				// resize popup to prevent linebreaks
				if (markBuildAge(rows) == 1)
					window.resizeBy(100, 0);
			}
		}
	}

	function markRow(tr)
	{
		var td = tr.getElementsByTagName('td');
		if (td.length !== 3)
			return false;

		var tdshipid = td[0];
		var shipid = extractID(tdshipid.textContent);

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
			(refs[highindex][0] - refs[lowindex][0]);
		// y1 - m*x1
		var c = refs[lowindex][1] - m * refs[lowindex][0];
		var estdate = new Date(m * shipid + c);

		var agemonths = Math.round((now - estdate) /
			(1000 * 60 * 60 * 24 * 365) * 12);
		var diffyears = Math.floor(agemonths / 12);
		var diffmonths = agemonths % 12;

		tdshipid.innerHTML += "&nbsp;<span style='color:#FFFF00'>" +
			strAge(diffyears, diffmonths) + "</span>";

		return true;
	}

	function markBuildAge(rows)
	{
		var marked = 0;

		for (var i = 2; i < rows.length; i++)
			marked += markRow(rows[i]) ? 1 : 0;

		return marked;
	}

	function extractID(str)
	{
		/* reference: Begleitschiff (L) xyz (ID:874535) */
		var id;

		try {
			id = str.match(/\(ID:(\d+)\)/)[1];
		} catch (ex) {
			id = 0;
		}

		return id;
	}

	function strAge(yy, mm)
	{
		var str = "&nbsp;(";

		if ((mm <= 0) && (yy <= 0))
			return str + 'neu)';

		if (yy > 0) {
			str += yy + "&nbsp;Jahr";

			if (yy > 1)
				str += "e";

			if (mm > 0)
				str += ",&nbsp;";
		}

		if (mm > 0) {
			str += mm + "&nbsp;Monat";
			if (mm > 1)
				str += "e";
		}

		str += ")";

		return str;
	}

	initShipID();
})();
