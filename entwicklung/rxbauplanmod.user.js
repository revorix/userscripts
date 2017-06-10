// ==UserScript==
// @name        Revorix-Bauplananzeige-Mod
// @namespace   http://random.erdbeerkuchen.net/
// @author      DarkIce (The42)
// @description Passt die Bauplananzeige derjenigen von Schiffen an und fügt die Bau-KP hinzu
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/rxbauplanmod.user.js
// @updateURL   https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/rxbauplanmod.meta.js
// @grant       None
// @version     1.20170610.1
//
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*\/entwicklung_i\.php/
// ==/UserScript==

(function()
{
	"use strict";

	function initPlanMod()
	{
		var tables = document.getElementsByTagName('table');

		for(var i = 0; i < tables.length; i++) {
			var rows = tables[i].getElementsByTagName('tr');
			var text = rows[0].textContent;

			if (text.search(/Technische Daten des Bauplans/)) {
				rearrangeTable(tables[i]);
				break;
			}
		}
	}

	function rearrangeTable(planvals)
	{
		var trels = planvals.getElementsByTagName('tr');
		var tdels = new Array(12);

		if (trels.length != 13)
			return;

		for (var i = 0; i < 12; i++)
			tdels[i] = trels[i + 1].getElementsByTagName('td');

		var ship_name = [tdels[0][0].textContent, tdels[0][1].textContent];
		var ship_sens = [tdels[0][2].textContent, tdels[0][3].textContent];
		var ship_type = [tdels[1][0].textContent, tdels[1][1].textContent];
		var ship_trn = [tdels[1][2].textContent, tdels[1][3].textContent];
		var ship_build = [tdels[2][0].textContent, tdels[2][1].textContent];
		var ship_aw = [tdels[2][2].textContent, tdels[2][3].textContent];
		var ship_opt = [tdels[3][0].textContent, tdels[3][1].textContent];
		var ship_sh = [tdels[3][2].textContent, tdels[3][3].textContent];
		var ship_mod = [tdels[4][0].textContent, tdels[4][1].textContent];
		var ship_pz = [tdels[4][2].textContent, tdels[4][3].textContent];
		var ship_tl = [tdels[5][0].textContent, tdels[5][1].textContent];
		var ship_str = [tdels[5][2].textContent, tdels[5][3].textContent];
		var ship_kp = [tdels[6][0].textContent, tdels[6][1].textContent];
		var ship_ss = [tdels[6][2].textContent, tdels[6][3].textContent];
		var ship_maxp = [tdels[7][0].textContent, tdels[7][1].textContent];
		var ship_sq = [tdels[7][2].textContent, tdels[7][3].textContent];
		var ship_minp = [tdels[8][0].textContent, tdels[8][1].textContent];
		var ship_sv = [tdels[8][2].textContent, tdels[8][3].textContent];
		var ship_rea = [tdels[9][0].textContent, tdels[9][1].textContent];
		var ship_sz = [tdels[9][2].textContent, tdels[9][3].textContent];
		var ship_lr = [tdels[10][0].textContent, tdels[10][1].textContent];
		var ship_ae = [tdels[10][2].textContent, tdels[10][3].textContent];
		var ship_wnd = [tdels[11][0].textContent, tdels[11][1].textContent];
		var ship_az = [tdels[11][2].textContent, tdels[11][3].textContent];

		var baukp = Math.ceil(0.2 * ship_kp[1]) + 5;

		var level30 = {};

		var minkp = ship_type[1].trim().startsWith('Korvette') ? 10 : 15;
		level30.kp = Math.max(Math.round(0.7 * ship_kp[1]), minkp);
		level30.aw = Math.round(1.3 * ship_aw[1]);
		level30.sh = Math.round(1.3 * ship_sh[1]);
		level30.pz = Math.round(1.3 * ship_pz[1]);
		level30.str = Math.round(1.3 * ship_str[1]);
		level30.wnd = Math.round(1.3 * ship_wnd[1]);
		level30.sens = Math.round(1.3 * ship_sens[1]);
		level30.trn = Math.round(1.3 * ship_trn[1]);
		level30.minp = Math.round(0.93 * ship_minp[1]);
		level30.rea = Math.round(1.3 * ship_rea[1]);
		level30.lr = Math.round(1.3 * ship_lr[1]);

		planvals.innerHTML = (
			"<tr><td class=\"nfo\" align=middle colspan=3><b>Technische Daten des Bauplans</b></td></tr>" +
			"<tr><td width=200>" + ship_name[0] + "</td><td>" + ship_name[1] + "</td><td><i>Level 30</i></td></tr>" +
			"<tr><td>" + ship_type[0] + "</td><td colspan=2>" + ship_type[1] + "</td></tr>" +
			"<tr><td>" + ship_opt[0] + "</td><td colspan=2>" + ship_opt[1] + "</td></tr>" +
			"<tr><td>" + ship_build[0] + "</td><td colspan=2>" + ship_build[1] + "</td></tr>" +
			"<tr><td>" + ship_tl[0] + "</td><td colspan=2>" + ship_tl[1] + "</td></tr>" +
			"<tr><td>" + ship_mod[0] + "</td><td colspan=2>" + ship_mod[1] + "</td></tr>" +
			"<tr><td>" + ship_kp[0] + "</td><td>" + ship_kp[1] + "&nbsp;<span style='color:#00FFFF'>(" + baukp + " im Bau)</span>" +
				"</td><td><i>" + level30.kp + "</i></td></tr>" +
			"<tr><td>" + ship_ss[0] + "</td><td colspan=2>" + ship_ss[1] + "</td></tr>" +
			"<tr><td>" + ship_sq[0] + "</td><td colspan=2>" + ship_sq[1] + "</td></tr>" +
			"<tr><td>" + ship_sv[0] + "</td><td colspan=2>" + ship_sv[1] + "</td></tr>" +
			"<tr><td>" + ship_sz[0] + "</td><td colspan=2>" + ship_sz[1] + "</td></tr>" +
			"<tr><td>" + ship_az[0] + "</td><td colspan=2>" + ship_az[1] + "</td></tr>" +
			"<tr><td>" + ship_ae[0] + "</td><td colspan=2>" + ship_ae[1] + "</td></tr>" +
			"<tr><td>" + ship_aw[0] + "</td><td>" + ship_aw[1] + "</td><td><i>" + level30.aw + "</i></td></tr>" +
			"<tr><td>" + ship_sh[0] + "</td><td>" + ship_sh[1] + "</td><td><i>" + level30.sh + "</i></td></tr>" +
			"<tr><td>" + ship_pz[0] + "</td><td>" + ship_pz[1] + "</td><td><i>" + level30.pz + "</i></td></tr>" +
			"<tr><td>" + ship_str[0] + "</td><td>" + ship_str[1] + "</td><td><i>" + level30.str + "</i></td></tr>" +
			"<tr><td>" + ship_wnd[0] + "</td><td>" + ship_wnd[1] + "</td><td><i>" + level30.wnd + "</i></td></tr>" +
			"<tr><td>" + ship_sens[0] + "</td><td>" + ship_sens[1] + "</td><td><i>" + level30.sens + "</i></td></tr>" +
			"<tr><td>" + ship_trn[0] + "</td><td>" + ship_trn[1] + "</td><td><i>" + level30.trn + "</i></td></tr>" +
			"<tr><td>" + "Besatzung" + "</td><td>" + ship_minp[1] + "/" + ship_maxp[1] + "</td><td><i>" +
				level30.minp + "/" + ship_maxp[1] + "</i></td></tr>" +
			"<tr><td>" + ship_rea[0] + "</td><td>" + ship_rea[1] + "</td><td><i>" + level30.rea + "</i></td></tr>" +
			"<tr><td>" + ship_lr[0] + "</td><td>" + ship_lr[1] + "</td><td><i>" + level30.lr + "</i></td></tr>"
		);

		window.resizeBy(-150, 250);
	}

	initPlanMod();
})();
