// ==UserScript==
// @name        Revorix-Bauplananzeige-Mod
// @namespace   http://random.erdbeerkuchen.net/
// @author      DarkIce (The42)
// @description Passt die Bauplananzeige derjenigen von Schiffen an und fügt die Bau-KP hinzu
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/rxbauplanmod.user.js
// @updateURL   https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/rxbauplanmod.meta.js
// @grant       None
// @version     1.0.2
//
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*\/entwicklung_i\.php/
// ==/UserScript==

var isOpera = "Opera" == navigator.appName;
var isFireFox = "Netscape" == navigator.appName;
var isChrome = "Netscape" == navigator.appName && navigator.appVersion.indexOf("Chrome") > -1;

function initPlanMod()
{
	var tables = document.getElementsByTagName('table');

	for(var i=0; i < tables.length; i++) {
		var trelemente = tables[i].getElementsByTagName('tr');

		text = getTDText(trelemente[0]);

		if(text.search(/Technische Daten des Bauplans/)) {
			rearrangeTable(tables[i]);
		}
	}

}

function rearrangeTable(planvals)
{
	var trels = planvals.getElementsByTagName('tr');
	var tdels = new Array(12);

	if(trels.length != 13) {
		return;
	}

	for (var i=0; i < 12; i++) {
		tdels[i] = trels[i+1].getElementsByTagName('td');
	}

	var ship_name = new Array(getTDText(tdels[0][0]), getTDText(tdels[0][1]));
	var ship_sens = new Array(getTDText(tdels[0][2]), getTDText(tdels[0][3]));
	var ship_type = new Array(getTDText(tdels[1][0]), getTDText(tdels[1][1]));
	var ship_trn = new Array(getTDText(tdels[1][2]), getTDText(tdels[1][3]));
	var ship_build = new Array(getTDText(tdels[2][0]), getTDText(tdels[2][1]));
	var ship_aw = new Array(getTDText(tdels[2][2]), getTDText(tdels[2][3]));
	var ship_opt = new Array(getTDText(tdels[3][0]), getTDText(tdels[3][1]));
	var ship_sh = new Array(getTDText(tdels[3][2]), getTDText(tdels[3][3]));
	var ship_mod = new Array(getTDText(tdels[4][0]), getTDText(tdels[4][1]));
	var ship_pz = new Array(getTDText(tdels[4][2]), getTDText(tdels[4][3]));
	var ship_tl = new Array(getTDText(tdels[5][0]), getTDText(tdels[5][1]));
	var ship_str = new Array(getTDText(tdels[5][2]), getTDText(tdels[5][3]));
	var ship_kp = new Array(getTDText(tdels[6][0]), getTDText(tdels[6][1]));
	var ship_ss = new Array(getTDText(tdels[6][2]), getTDText(tdels[6][3]));
	var ship_maxp = new Array(getTDText(tdels[7][0]), getTDText(tdels[7][1]));
	var ship_sq = new Array(getTDText(tdels[7][2]), getTDText(tdels[7][3]));
	var ship_minp = new Array(getTDText(tdels[8][0]), getTDText(tdels[8][1]));
	var ship_sv = new Array(getTDText(tdels[8][2]), getTDText(tdels[8][3]));
	var ship_rea = new Array(getTDText(tdels[9][0]), getTDText(tdels[9][1]));
	var ship_sz = new Array(getTDText(tdels[9][2]), getTDText(tdels[9][3]));
	var ship_lr = new Array(getTDText(tdels[10][0]), getTDText(tdels[10][1]));
	var ship_ae = new Array(getTDText(tdels[10][2]), getTDText(tdels[10][3]));
	var ship_wnd = new Array(getTDText(tdels[11][0]), getTDText(tdels[11][1]));
	var ship_az = new Array(getTDText(tdels[11][2]), getTDText(tdels[11][3]));

	var baukp = Math.ceil(0.2 * ship_kp[1]) + 5;

	planvals.innerHTML = (
		"<tr><td class=\"nfo\" align=middle colspan=2><b>Technische Daten des Bauplans</b></td></tr>" +
		"<tr><td width=200>" + ship_name[0] + "</td><td>" + ship_name[1] + "</td></tr>" +
		"<tr><td>" + ship_type[0] + "</td><td>" + ship_type[1] + "</td></tr>" +
		"<tr><td>" + ship_opt[0] + "</td><td>" + ship_opt[1] + "</td></tr>" +
		"<tr><td>" + ship_build[0] + "</td><td>" + ship_build[1] + "</td></tr>" +
		"<tr><td>" + ship_tl[0] + "</td><td>" + ship_tl[1] + "</td></tr>" +
		"<tr><td>" + ship_mod[0] + "</td><td>" + ship_mod[1] + "</td></tr>" +
		"<tr><td>" + ship_kp[0] + "</td><td>" + ship_kp[1] + "&nbsp;<span style='color:#00FFFF'>(" + baukp + " im Bau)</span>" + "</td></tr>" +
		"<tr><td>" + ship_ss[0] + "</td><td>" + ship_ss[1] + "</td></tr>" +
		"<tr><td>" + ship_sq[0] + "</td><td>" + ship_sq[1] + "</td></tr>" +
		"<tr><td>" + ship_sv[0] + "</td><td>" + ship_sv[1] + "</td></tr>" +
		"<tr><td>" + ship_sz[0] + "</td><td>" + ship_sz[1] + "</td></tr>" +
		"<tr><td>" + ship_az[0] + "</td><td>" + ship_az[1] + "</td></tr>" +
		"<tr><td>" + ship_ae[0] + "</td><td>" + ship_ae[1] + "</td></tr>" +
		"<tr><td>" + ship_aw[0] + "</td><td>" + ship_aw[1] + "</td></tr>" +
		"<tr><td>" + ship_sh[0] + "</td><td>" + ship_sh[1] + "</td></tr>" +
		"<tr><td>" + ship_pz[0] + "</td><td>" + ship_pz[1] + "</td></tr>" +
		"<tr><td>" + ship_str[0] + "</td><td>" + ship_str[1] + "</td></tr>" +
		"<tr><td>" + ship_wnd[0] + "</td><td>" + ship_wnd[1] + "</td></tr>" +
		"<tr><td>" + ship_sens[0] + "</td><td>" + ship_sens[1] + "</td></tr>" +
		"<tr><td>" + ship_trn[0] + "</td><td>" + ship_trn[1] + "</td></tr>" +
		"<tr><td>" + "Besatzung" + "</td><td>" + ship_minp[1] + "/" + ship_maxp[1] + "</td></tr>" +
		"<tr><td>" + ship_rea[0] + "</td><td>" + ship_rea[1] + "</td></tr>" +
		"<tr><td>" + ship_lr[0] + "</td><td>" + ship_lr[1] + "</td></tr>"
	);

	window.resizeBy(-150, 250);
}

function getTDText(td)
{
	if(isOpera) {
		return td.innerText;
	} else {
		return td.textContent;
	}
}

/* start */
initPlanMod();
