// ==UserScript==
// @name        Revorix-Artefakte
// @namespace   http://random.erdbeerkuchen.net/
// @author      DarkIce (The42)
// @description Addon zur Generierung einer Artefakt-Übersicht
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/artefakte/rxartefakte.user.js
// @updateURL   https://raw.githubusercontent.com/tpummer/gm-revorix/master/artefakte/rxartefakte.meta.js
// @grant       none
// @version     0.42.9
//
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*\/artefakte.*/
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*\/setup\.php/
// ==/UserScript==

"use strict";

(function() {	// prevents namespace pollution. Help the environment! :)

	var ARTIS_PER_PAGE = 15;

	var SUMMARY_TEXT = 'Übersicht';
	var DELETEALL_TEXT = 'Alles löschen';
	var REFRESH_TEXT = 'Neu generieren';
	var LINK_TEXT = 'Aufrufen';

	var SettingsSummaryFirst;
	var SettingsAutoLoad;

	var DEBUG_VERBOSE = true;
	var DEBUG_ALWAYS_NEW_AID = false;

	var FREQ_0 = 0;
	var FREQ_C = 1;
	var FREQ_U = 2;
	var FREQ_R = 3;
	var FREQ_L = 4;

	var arti_name_list = [
		"Unbekannt",

		"Planbeschleuniger",
		"Optimierer",
		"Bauplanwiederhersteller",
		"Baubeschleuniger",
		"Crew Trainer",
		"Captain Trainer",

		"Logbuchchip",
		"Reparaturnaniten",
		"Sprungnaniten",
		"Waffenrepolisator",
		"Regenerative Naniten",

		// -- deprecated --
		"Regenerative Naniten Typ I",
		"Regenerative Naniten Typ II",
		"Regenerative Naniten Typ III",
		"Optimierungsbeschleuniger",
		// --     --     --

		"Ressourcen",
		"Schrott",
	];

	var ressources = ["Cr", "Nrg", "Rek", "Erz", "Org", "Syn", "FE",
		"LM", "SM", "EM", "Rad", "ES", "EG", "Iso"];

	var ressources_long = ["Credits", "Energie", "Rekruten", "Erz",
		"Organische Verbindungen", "Synthetische Verbindungen",
		"Eisenmetalle",	"Leichtmetalle", "Schwermetalle", "Edelmetalle",
		"Radioaktive Verbindungen", "Edelsteine", "Edelgase",
		"Instabile Isotope"];

	var arti_record = {
		aid: 0,
		type: 0,
		freq: 0,
		ress: 0,
		val: 0,
	}

	var artis = new Array();

	// stats
	var artis_sum;
	var c_arti_types = new Array(arti_name_list.length);
	var c_arti_types_aid = new Array(arti_name_list.length);
	var c_arti_types_page = new Array(arti_name_list.length);
	var c_ress_low = new Array(ressources.length);
	var c_ress_hi = new Array(ressources.length);
	var c_ress_total = new Array(ressources.length);
	var c_ress_count = new Array(ressources.length);
	var c_ress_low_aid = new Array(ressources.length);
	var c_ress_hi_aid = new Array(ressources.length);
	var c_ress_low_page = new Array(ressources.length);
	var c_ress_hi_page = new Array(ressources.length);
	var c_freq_c = 0;
	var c_freq_u = 0;
	var c_freq_r = 0;
	var c_freq_l = 0;
	var c_freq_0 = 0;

	function loadSettings() {

		var str = document.cookie.match(/rxuscriptartefakte=[^;]+/);

		if(!str) {
			SettingsSummaryFirst = true;
			SettingsAutoLoad = false;
		} else {
			SettingsSummaryFirst = (str[0].match(/sumfirst:\d+/)[0].match(/\d+/)[0] === '1') ? true : false;
			SettingsAutoLoad = (str[0].match(/autoload:\d+/)[0].match(/\d+/)[0] === '1') ? true : false;
		}
	}

	function saveSettings() {

		SettingsSummaryFirst = document.getElementById('rorderLeft').checked ? true : false;
		SettingsAutoLoad = document.getElementById('rautoload').checked ? true : false;

		var str = 'rxuscriptartefakte='
			+ 'sumfirst:' + (SettingsSummaryFirst ? '1' : '0') + '!'
			+ 'autoload:' + (SettingsAutoLoad ? '1' : '0')
			+ ';';

		var expiredate = new Date();
		// save cookie for a year
		expiredate.setTime(expiredate.getTime() + (365 * 24 * 60 * 60 * 1000));

		document.cookie =  str + ' expires=' + expiredate.toGMTString() + '; path=/';

		// show this to user

		var spn = document.createElement('span');
		spn.style.color = '#00FF00';
		spn.id = 'savemsg';
		spn.appendChild(document.createElement('br'));
		spn.appendChild(document.createTextNode('Gespeichert!'));
		document.getElementById('bsaveset').parentNode.appendChild(spn);
		window.setTimeout(removeSavemsg, 3000);
	}

	function removeSavemsg() {
		var spn = document.getElementById('savemsg');
		if(spn) {
			spn.parentNode.removeChild(spn);
		}
	}

	function insertSettings() {

		var frm = document.getElementsByTagName('form');
		if(!frm.length) {
			return;
		}
		frm = frm[0];

		loadSettings();

		var t = document.createElement('table');
		t.className = 'wrpd full';
		t.appendChild(document.createElement('tr'));
		t.appendChild(document.createElement('tr'));
		t.appendChild(document.createElement('tr'));
		t.rows[0].appendChild(document.createElement('td'));
		t.rows[1].appendChild(document.createElement('td'));
		t.rows[1].appendChild(document.createElement('td'));
		t.rows[1].appendChild(document.createElement('td'));
		t.rows[2].appendChild(document.createElement('td'));
		t.rows[2].appendChild(document.createElement('td'));
		t.rows[0].cells[0].appendChild(document.createTextNode('Revorix-Userscript-Einstellungen: rxartefakte'));
		t.rows[0].cells[0].className = 'nfo';
		t.rows[0].cells[0].colSpan = 3;

		t.rows[1].cells[0].appendChild(document.createTextNode('Anordnung der Übersicht'));
		t.rows[1].cells[0].style.verticalAlign = 'middle';
		t.rows[1].cells[0].style.textAlign = 'left';
		t.rows[1].cells[0].style.width = '25%';
		var r1 = document.createElement('input');
		var r2 = document.createElement('input');
		var r1l = document.createElement('label');
		var r2l = document.createElement('label');
		r1.type = 'radio';
		r2.type = 'radio';
		r1.name = 'rorder';
		r2.name = 'rorder';
		r1.id = 'rorderLeft';
		r2.id = 'rorderRight';
		r1.value = 'l';
		r2.value = 'r';
		r1.checked = SettingsSummaryFirst;
		r2.checked = !SettingsSummaryFirst;
		r1.addEventListener('change', removeSavemsg, false);
		r2.addEventListener('change', removeSavemsg, false);
		r1.style.verticalAlign = 'middle';
		r2.style.verticalAlign = 'middle';
		r1.style.margin = '4px';
		r2.style.margin = '4px';
		r1l.style.verticalAlign = 'middle';
		r2l.style.verticalAlign = 'middle';
		r1l.htmlFor = 'rorderLeft';
		r2l.htmlFor = 'rorderRight';
		r1l.appendChild(document.createTextNode('Links anordnen'));
		r2l.appendChild(document.createTextNode('Rechts anordnen'));
		t.rows[1].cells[1].appendChild(r1);
		t.rows[1].cells[1].appendChild(r1l);
		t.rows[1].cells[1].appendChild(document.createElement('br'));
		t.rows[1].cells[1].appendChild(r2);
		t.rows[1].cells[1].appendChild(r2l);

		t.rows[2].cells[0].appendChild(document.createTextNode('Verhalten'));
		t.rows[2].cells[0].style.verticalAlign = 'middle';
		t.rows[2].cells[0].style.textAlign = 'left';
		t.rows[2].cells[0].style.width = '25%';
		var c1 = document.createElement('input');
		var c1l = document.createElement('label');
		c1.type = 'checkbox';
		c1.name = 'rorder';
		c1.id = 'rautoload';
		c1.value = 'c';
		c1.checked = SettingsAutoLoad;
		c1.addEventListener('change', removeSavemsg, false);
		c1.style.verticalAlign = 'middle';
		c1.style.margin = '4px';
		c1l.style.verticalAlign = 'middle';
		c1l.htmlFor = 'rautoload';
		c1l.appendChild(document.createTextNode('Übersicht automatisch laden'));
		t.rows[2].cells[1].appendChild(c1);
		t.rows[2].cells[1].appendChild(c1l);

		t.rows[1].cells[2].style.verticalAlign = 'middle';
		t.rows[1].cells[2].style.textAlign = 'center';
		t.rows[1].cells[2].style.width = '25%';
		var b1 = document.createElement('input');
		b1.type = 'button';
		b1.className = 'Button';
		b1.name = 'bsave';
		b1.id = 'bsaveset';
		b1.value = 'Speichern';
		b1.addEventListener('click', saveSettings, false);
		t.rows[1].cells[2].appendChild(b1);

		t.rows[1].cells[2].rowSpan = t.rows.length - 1;
		var sdiv = frameTable(t);
		sdiv.id = 'rx_user_rxartefakte';

		frm.parentNode.insertBefore(sdiv, frm.nextSibling);
		frm.parentNode.insertBefore(document.createElement('br'), frm.nextSibling);
	}

	function loadStatData() {

		// load main stuff with stats and all from localStorage
		var str = localStorage.getItem('rxartefakte');

		if(!str) {
			log("main data 'rxartefakte' not found in web storage");
			return false;
		}

		artis_sum = 0;

		for(var i = 0; i < arti_name_list.length; i++) {
			c_arti_types[i] = 0;
			c_arti_types_aid[i] = 0;
			c_arti_types_page[i] = 0;
		}

		for(var i = 0; i < ressources.length; i++) {
			c_ress_low[i] = 0;
			c_ress_hi[i] = 0;
			c_ress_low_aid[i] = 0;
			c_ress_hi_aid[i] = 0;
			c_ress_low_page[i] = 0;
			c_ress_hi_page[i] = 0;
			c_ress_total[i] = 0;
			c_ress_count[i] = 0;
		}

		// artis_sum
		var substr = str.match(/sum:[^,;]+/);
		if(substr) {
			artis_sum = +substr[0].match(/\d+/);
		}

		// types
		substr = str.match(/typc:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_arti_types.length; i++) {
				c_arti_types[i] = +substr[i];
			}
		}

		substr = str.match(/typaid:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_arti_types.length; i++) {
				c_arti_types_aid[i] = +substr[i];
			}
		}

		substr = str.match(/typpg:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_arti_types.length; i++) {
				c_arti_types_page[i] = +substr[i];
			}
		}

		// freq
		substr = str.match(/freq:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			c_freq_c = +substr[0];
			c_freq_u = +substr[1];
			c_freq_r = +substr[2];
			c_freq_l = +substr[3];
			c_freq_0 = +substr[4];
		}

		// ress
		substr = str.match(/sumres:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_total.length; i++) {
				c_ress_total[i] = +substr[i];
			}
		}

		substr = str.match(/reshi:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_hi.length; i++) {
				c_ress_hi[i] = +substr[i];
			}
		}

		substr = str.match(/reslo:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+|Infinity/g);
			for(var i = 0; i < c_ress_low.length; i++) {
				c_ress_low[i] = +substr[i];
			}
		}

		substr = str.match(/reshiaid:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_hi_aid.length; i++) {
				c_ress_hi_aid[i] = +substr[i];
			}
		}

		substr = str.match(/resloaid:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_low_aid.length; i++) {
				c_ress_low_aid[i] = +substr[i];
			}
		}

		substr = str.match(/reshipg:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_hi_aid.length; i++) {
				c_ress_hi_page[i] = +substr[i];
			}
		}

		substr = str.match(/reslopg:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_low_aid.length; i++) {
				c_ress_low_page[i] = +substr[i];
			}
		}

		substr = str.match(/cntres:[^,;]+/);
		if(substr) {
			substr = substr[0].match(/\d+/g);
			for(var i = 0; i < c_ress_total.length; i++) {
				c_ress_count[i] = +substr[i];
			}
		}

		return true;
	}

	function saveStatData() {

		// save main stuff with stats and and all in localStorage
		var ikey = 'rxartefakte';
		var str = '';

		// artis_sum
		str += 'sum:' + artis_sum + ',';

		// types
		str+= 'typc:';

		for(var i = 0; i < c_arti_types.length; i++) {
			str+= c_arti_types[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'typaid:';

		for(var i = 0; i < c_arti_types_aid.length; i++) {
			str+= c_arti_types_aid[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'typpg:';

		for(var i = 0; i < c_arti_types_page.length; i++) {
			str+= c_arti_types_page[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		// freq
		str += 'freq:' + c_freq_c + '!' + c_freq_u + '!' + c_freq_r + '!' + c_freq_l + '!' + c_freq_0 + ',';

		// ress

		str+= 'sumres:';

		for(var i = 0; i < c_ress_total.length; i++) {
			str+= c_ress_total[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'reshi:';

		for(var i = 0; i < c_ress_hi.length; i++) {
			str+= c_ress_hi[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'reslo:';

		for(var i = 0; i < c_ress_low.length; i++) {
			str+= c_ress_low[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'reshiaid:';

		for(var i = 0; i < c_ress_hi_aid.length; i++) {
			str+= c_ress_hi_aid[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'resloaid:';

		for(var i = 0; i < c_ress_low_aid.length; i++) {
			str+= c_ress_low_aid[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'reshipg:';

		for(var i = 0; i < c_ress_hi_page.length; i++) {
			str+= c_ress_hi_page[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'reslopg:';

		for(var i = 0; i < c_ress_low_page.length; i++) {
			str+= c_ress_low_page[i] + '!';
		}

		str = str.replace(/\!$/, ',');

		str+= 'cntres:';

		for(var i = 0; i < c_ress_count.length; i++) {
			str+= c_ress_count[i] + '!';
		}

		str = str.replace(/\!$/, ';');

		localStorage.setItem(ikey, str);

		return 0;
	}

	function killStatData() {

		log('cleaning up web storage (stats)');
		localStorage.removeItem('rxartefakte');

		return 0;
	}

	function loadArtiData() {
		// load arti data from storage and save in global structure
		var loaded = 0;
		var keys = new Array();
		var idx = 0;

		for(var thiskey in localStorage) {
			if((/rxartefakte\d+/).test(thiskey)) {
				keys[idx++] = thiskey;
			}
		}

		artis.length = 0;

		if(keys.length === 0) {
			log("no arti data found in web storage");
			return -1;
		}

		keys.sort();	// use a special sort function if we get in trouble here

		for(var i = 0; i < keys.length; i++) {
			var str = localStorage.getItem(keys[i]).split('!');

			if((!str) || (!(/\d+/).test(str[0]))) {
				continue;
			}

			for(var j = 0; j < str.length; j++) {
				artis.push(clone(arti_record));
				artis[loaded].aid = +str[j].match(/a\d+/)[0].slice(1);
				artis[loaded].type = +str[j].match(/t\d+/)[0].slice(1);
				artis[loaded].freq = +str[j].match(/f\d+/)[0].slice(1);
				artis[loaded].ress = +str[j].match(/r\d+/)[0].slice(1);
				artis[loaded].val = +str[j].match(/v\d+/)[0].slice(1);
				loaded++;
			}
		}

		log('loaded ' + loaded + ' artis from ' + keys.length + ' keys in web storage');

		return loaded;
	}

	function saveArtiData()
	{
		// save updated global structure in storage
		// use 100 artis per key entry to limit value to a sane size

		var cid = 0;

		log('saving ' + artis.length + ' artis...');

		killArtiData();

		if(!artis.length) {
			return -1;
		}

		var key_lines = new Array(Math.ceil(artis.length / 100));
		var str = "";

		for(var i = 0; i < artis.length; i++) {
			// save as: "a3493t5f1r11v100000,"
			str +=
				"a" + artis[i].aid +
				"t" + artis[i].type +
				"f" + artis[i].freq +
				"r" + artis[i].ress +
				"v" + artis[i].val;

			if(!((i+1)%100)) {
				key_lines[cid++] = str;
				str = "";
			} else {
				str += "!";
			}
		}

		str = str.replace(/!$/,"");
		key_lines[cid] = str;

		for(var i = 0; i <= cid; i++) {
			localStorage.setItem("rxartefakte" + ((cid < 10) ? ("0" + i) : ("" + i)), key_lines[i]);
		}

		log("saved " + ++cid + " keys in web storage");

		return 0;
	}

	function killArtiData() {
		log('cleaning up web storage (artis)');

		for(var thiskey in localStorage) {
			if((/rxartefakte\d+/).test(thiskey)) {
				localStorage.removeItem(thiskey);
			}
		}

		return 0;
	}

	function parseArtis() {
		// parse page, lookup aid and add to array if new
		var addcounter = 0;
		var tables = document.getElementsByTagName('table');

		if(tables.length < 4) {
			log('not enough tables, page seems incomplete');
			return -1;
		}

        // a premium account has an extra table for filters, mind you
        var ttable = tables[tables.length - 1];

		for(var i = 1; i < ttable.rows.length; i++) {
			// exclude line with button (1 cell only)
			if(ttable.rows[i].cells.length != 4) {
				continue;
			}

			// scan
			if(!ttable.rows[i].cells[3].firstChild.href) {
				log('no aid found');
				continue;
			}

			// if link exists, get aid from it
			var aid = +ttable.rows[i].cells[3].firstChild.href.match(/aid=\d+/)[0].match(/\d+/);

			if(aid <= 0) {
				log('aid ' + aid + ' is invalid');
				continue;
			}

			// lookup aid, continue if existing (or overwrite, as debug switch)
			var idx = -1;

			for(var j = 0; j < artis.length; j++) {
				if(artis[j].aid === aid) {
					idx = j;
					break;
				}
			}

			if(idx > -1) {
				if(!DEBUG_ALWAYS_NEW_AID) continue;
			} else {
				idx = artis.length;
				artis.push(clone(arti_record));
				artis[idx].aid = aid;
			}

			var arti_string = ttable.rows[i].cells[1].textContent.trim();
			var arti_props = ttable.rows[i].cells[2].textContent.trim();

			// frequency
			var arti_freq = arti_string.match(/\([CURL]\)/);
			if(arti_freq) {
				arti_freq = arti_freq[0].replace(/[\(\)]/g, "");
			}

			switch(arti_freq) {
				case 'C': artis[idx].freq = FREQ_C; break;
				case 'U': artis[idx].freq = FREQ_U; break;
				case 'R': artis[idx].freq = FREQ_R; break;
				case 'L': artis[idx].freq = FREQ_L; break;
				default: artis[idx].freq = FREQ_0; break;
			}

			// type
			if(ttable.rows[i].cells[2].lastChild.tagName === "IMG") {
				// resources
				var rtype = ttable.rows[i].cells[2].lastChild.src.match(/[^\/]+\.gif$/);
				artis[idx].ress = +rtype[0].match(/\d+/);
				artis[idx].val = arti_props.match(/\d+/)[0];
				artis[idx].type = arti_name_list.indexOf("Ressourcen");
			} else {
				// non-ress, analyze string then
				arti_string = arti_string.replace(/\s*\([\S]*/,"");
				artis[idx].type = arti_name_list.indexOf("Unbekannt");
				for(var j = 0; j < arti_name_list.length; j++) {
					if(arti_string === arti_name_list[j]) {
						artis[idx].type = j;
						break;
					}
				}
			}

			addcounter++;

			// color new artifacts
			ttable.rows[i].cells[0].style.color = '#00FFFF';
		}

		if(addcounter > 0) {
			artis.sort(function(a, b){return (a.aid === b.aid ? 0 : (a.aid < b.aid ? -1 : 1))});

			// user message
			var spn = document.createElement('span');
			spn.style.color = '#00FFFF';
			spn.appendChild(document.createTextNode(' ' + addcounter
				+ ((addcounter == 1) ? ' neues Artefakt' : ' neue Artefakte')
				+ ' indiziert!'));
			tables[0].rows[1].cells[0].appendChild(spn);
		}

		return addcounter;
	}

	function calcStats() {
		// calc the stats of our array
		artis_sum = artis.length;

		c_freq_0 = 0;
		c_freq_c = 0;
		c_freq_u = 0;
		c_freq_r = 0;
		c_freq_l = 0;

		for(var i = 0; i < arti_name_list.length; i++) {
			c_arti_types[i] = 0;
			c_arti_types_aid[i] = 0;
			c_arti_types_page[i] = 0;
		}

		for(var i = 0; i < ressources.length; i++) {
			c_ress_low[i] = Infinity;
			c_ress_hi[i] = 0;
			c_ress_low_aid[i] = 0;
			c_ress_hi_aid[i] = 0;
			c_ress_low_page[i] = 0;
			c_ress_hi_page[i] = 0;
			c_ress_total[i] = 0;
			c_ress_count[i] = 0;
		}

		// special cases where oldest is required
		var specialBBSaid = 0;
		var specialBBSpage = 0;
		var specialCTaid = 0;
		var specialCTpage = 0;

		for(var i = 0; i < artis.length; i++) {
			// freq
			switch(artis[i].freq) {
				case FREQ_0: c_freq_0++; break;
				case FREQ_C: c_freq_c++; break;
				case FREQ_U: c_freq_u++; break;
				case FREQ_R: c_freq_r++; break;
				case FREQ_L: c_freq_l++; break;
				default: break;
			}
			// types
			c_arti_types[artis[i].type]++;
			c_arti_types_aid[artis[i].type] = artis[i].aid;
			c_arti_types_page[artis[i].type] = +i;
			// exceptions
			if(!specialBBSaid && artis[i].type == arti_name_list.indexOf("Baubeschleuniger")) {
				specialBBSaid = artis[i].aid;
				specialBBSpage = +i;
			}
			if(!specialCTaid && artis[i].type == arti_name_list.indexOf("Crew Trainer")) {
				specialCTaid = artis[i].aid;
				specialCTpage = +i;
			}
			// ress
			if(artis[i].type === arti_name_list.indexOf("Ressourcen")) {
				c_ress_total[+artis[i].ress - 1] += +artis[i].val;
				c_ress_count[+artis[i].ress - 1]++;
				if(+artis[i].val < c_ress_low[+artis[i].ress - 1]) {
					c_ress_low[+artis[i].ress - 1] = +artis[i].val;
					c_ress_low_aid[+artis[i].ress - 1] = +artis[i].aid;
					c_ress_low_page[+artis[i].ress - 1] = +i;
				}
				if(+artis[i].val > c_ress_hi[+artis[i].ress - 1]) {
					c_ress_hi[artis[i].ress - 1] = +artis[i].val;
					c_ress_hi_aid[+artis[i].ress - 1] = +artis[i].aid;
					c_ress_hi_page[+artis[i].ress - 1] = +i;
				}
			}
		}

		// age override
		c_arti_types_aid[arti_name_list.indexOf("Baubeschleuniger")] = specialBBSaid;
		c_arti_types_page[arti_name_list.indexOf("Baubeschleuniger")] = specialBBSpage;
		c_arti_types_aid[arti_name_list.indexOf("Crew Trainer")] = specialCTaid;
		c_arti_types_page[arti_name_list.indexOf("Crew Trainer")] = specialCTpage;

		for(var i = 0; i < arti_name_list.length; i++) {
			c_arti_types_page[i] = Math.ceil((artis_sum - c_arti_types_page[i]) / 15);
		}

		for(var i = 0; i < ressources.length; i++) {
			c_ress_low_page[i] = Math.ceil((artis_sum - c_ress_low_page[i]) / 15);
			c_ress_hi_page[i] = Math.ceil((artis_sum - c_ress_hi_page[i]) / 15);
		}

		saveStatData();

		return 0;
	}

	function clickRefreshStats() {

		killStatData();
		loadArtiData();
		calcStats();
		document.location.reload();

		return 0;
	}

	function clickDeleteAll() {

		killArtiData();
		killStatData();
		document.location.reload();

		return 0;
	}

	function clickRefreshSamePage() {
		// this function is necessary because a hotlink containing a link to the
		// same page visited before will not load - so we have to make it reload...
		var page = document.URL.match(/est=\d+/);
		if(page && (page[0] === this.href.match(/est=\d+/)[0])) {
			document.location.href = this.href;
			document.location.reload(false);
		}

		return 0;
	}

	function insertSummary(newartis) {

		loadSettings();

		var tables = document.getElementsByTagName('table');
		var linkline = tables[1].rows[1].cells[0];

		var sumlink = document.createElement('a');
		sumlink.href = 'javascript:void(0);';
		sumlink.id = 'artisummary';
		sumlink.appendChild(document.createTextNode(SUMMARY_TEXT));
		sumlink.addEventListener('click', generateSummaryTables, false);

		linkline.innerHTML = linkline.innerHTML.replace('unerforschte Artefakte', 'unbekannte Objekte');

		if(SettingsSummaryFirst) {
			linkline.insertBefore(document.createTextNode(' | '), linkline.firstChild);
			linkline.insertBefore(sumlink, linkline.firstChild);
		} else {
			// handle that ridicolous break
			if(linkline.lastChild.tagName === 'BR') {
				linkline.replaceChild(document.createTextNode(' | '), linkline.lastChild);
			} else {
				linkline.appendChild(document.createTextNode(' | '));
			}

			linkline.appendChild(sumlink);
		}

		// first frame load only, and only if no new artis are found
		if(SettingsAutoLoad && (/artefakte\.php$/).test(document.URL) && (!newartis)) {
			generateSummaryTables();
		}

		return 0;
	}

	function getRxDomain() {
		if((/\/\/\d+\.\d+\.\d+\.\d+\//).test(document.URL)) {	// IP
			return (document.URL.match(/[\w:\.\/]+\/rx\//)[0]);
		} else {	// revorix.info
			return (document.URL.match(/[\w:\.\/]+revorix\.info\//)[0]);
		}
	}

	function frameTable(t) {

		var maindiv = document.createElement('div');
		maindiv.className = 'wrp ce';

		// table upper boundary
		var dtop1 = document.createElement('div');
		var dtop2 = document.createElement('div');
		var dtop3 = document.createElement('div');
		dtop1.className = 'tl';
		dtop2.className = 'tr';
		dtop3.className = 'tc';
		dtop2.appendChild(dtop3);
		dtop1.appendChild(dtop2);

		// table side boundaries
		var dsid1 = document.createElement('div');
		var dsid2 = document.createElement('div');
		dsid1.className = 'ml';
		dsid2.className = 'mr';

		// table lower boundaries
		var dbot1 = document.createElement('div');
		var dbot2 = document.createElement('div');
		var dbot3 = document.createElement('div');
		dbot1.className = 'bl';
		dbot2.className = 'br';
		dbot3.className = 'bc';
		dbot2.appendChild(dbot3);
		dbot1.appendChild(dbot2);

		// connect
		dsid2.appendChild(t);
		dsid1.appendChild(dsid2);
		maindiv.appendChild(dtop1);
		maindiv.appendChild(dsid1);
		maindiv.appendChild(dbot1);

		return maindiv;
	}

	function generateSummaryTables() {

		var tables = document.getElementsByTagName('table');
		var known_artis = tables[1].rows[1].cells[0].innerHTML.match(/\berforscht[^|]*\(\d+\)/);
		var display_links = (!!known_artis) && (+(known_artis[0].match(/\d+/)[0]) <= artis_sum);

		// exchange links and bold texts to mark active page
		var thispagelink = document.getElementById('artisummary');
		var otherlinks = thispagelink.parentNode.getElementsByTagName('b');
		for(var i in otherlinks) {
			if((/^erforscht/).test(otherlinks[i].textContent)) {
				var relink = document.createElement('a');
				relink.href = '?est=1';
				relink.appendChild(document.createTextNode(otherlinks[i].textContent));
				thispagelink.parentNode.replaceChild(relink, otherlinks[i]);
			} else if((/^unerforscht/).test(otherlinks[i].textContent)) {
				var relink = document.createElement('a');
				relink.href = '?ust=1';
				relink.appendChild(document.createTextNode(otherlinks[i].textContent));
				thispagelink.parentNode.replaceChild(relink, otherlinks[i]);
			}
		}

		tables[1].rows[2].cells[1].innerHTML = '';
		if(!display_links) {
			var spn = document.createElement('span');
			spn.style.color = '#FFFF00';
			spn.appendChild(document.createTextNode('Hinweis: Indizierung unvollständig, Hotlinks nicht verfügbar'));
			tables[1].rows[2].cells[1].appendChild(spn);
			tables[1].rows[2].cells[1].style.textAlign = 'center';
		}

		var leftthing = tables[1].rows[2].cells[0];
		var rightthing = tables[1].rows[2].cells[2];

		var refreshlink = document.createElement('a');
		refreshlink.href = 'javascript:void(0);';
		refreshlink.id = 'artirefreshstats';
		refreshlink.appendChild(document.createTextNode(REFRESH_TEXT.replace(/\s/g, '\u00A0')));
		refreshlink.addEventListener('click', clickRefreshStats, false);
		leftthing.replaceChild(refreshlink, leftthing.firstChild);

		var deletelink = document.createElement('a');
		deletelink.href = 'javascript:void(0);';
		deletelink.id = 'artideleteall';
		deletelink.appendChild(document.createTextNode(DELETEALL_TEXT.replace(/\s/g, '\u00A0')));
		deletelink.addEventListener('click', clickDeleteAll, false);
		rightthing.replaceChild(deletelink, rightthing.firstChild);

		var thispagebold = document.createElement('b');
		thispagebold.textContent = thispagelink.textContent;
		thispagelink.parentNode.replaceChild(thispagebold, thispagelink);

		// summary //
		var s = document.createElement('table');
		s.className = 'wrpd full';
		s.style.textAlign = 'center';

		s.appendChild(document.createElement('tr'));
		s.appendChild(document.createElement('tr'));

		var slhdr = document.createElement('td');
		var slval = document.createElement('td');
		slhdr.className = 'nfo';
		slval.className = 'nfo';
		slhdr.style.textAlign = 'right';
		slval.style.textAlign = 'right';
		slhdr.appendChild(document.createTextNode('Häufigkeit'));
		slval.appendChild(document.createTextNode('Anzahl'));
		slhdr.style.width = '10%';
		s.rows[0].appendChild(slhdr);
		s.rows[1].appendChild(slval);

		var statsheader = new Array('Schrott', '(C)', '(U)', '(R)', '(L)', 'Summe');
		var statsvalues = new Array(c_freq_0, c_freq_c, c_freq_u,
			c_freq_r, c_freq_l, artis_sum);

		for(i = 0; i < 6; i++) {
			var tcell = document.createElement('td');
			var vcell = document.createElement('td');

			tcell.appendChild(document.createTextNode(statsheader[i]));
			tcell.style.width = '15%';
			vcell.appendChild(document.createTextNode(statsvalues[i]));

			s.rows[0].appendChild(tcell);
			s.rows[1].appendChild(vcell);
		}

		// double line at last column
		s.rows[0].cells[5].style.borderRightWidth = '0px';
		s.rows[1].cells[5].style.borderRightWidth = '0px';
		s.rows[0].cells[6].style.borderStyle = 'solid solid solid double';
		s.rows[1].cells[6].style.borderStyle = 'solid solid solid double';
		s.rows[0].cells[6].style.borderLeftWidth = '3px';
		s.rows[1].cells[6].style.borderLeftWidth = '3px';

		// arti type overview //

		var t = document.createElement('table');
		t.className = 'wrpd full';

		// rows + cells. If we have all artis, insert links to appropriate pages (warn otherwise)
		var headrow = document.createElement('tr');
		var hcell1 = document.createElement('td');
		var hcell2 = document.createElement('td');
		hcell1.className = 'nfo';
		hcell2.className = 'nfo';
		hcell1.style.width = "30%";
		hcell2.style.width = "20%";
		hcell2.style.textAlign = 'center';
		if(display_links) {
			hcell2.colSpan = 2;
		}
		hcell1.appendChild(document.createTextNode('Art'));
		hcell2.appendChild(document.createTextNode('Anzahl'));
		headrow.appendChild(hcell1);
		headrow.appendChild(hcell2);
		headrow.appendChild(hcell1.cloneNode(true));
		headrow.appendChild(hcell2.cloneNode(true));
		t.appendChild(headrow);

		var rowcount = c_arti_types.length;
		rowcount = rowcount
			- (c_arti_types[arti_name_list.indexOf('Regenerative Naniten Typ I')] === 0 ? 1 : 0)
			- (c_arti_types[arti_name_list.indexOf('Regenerative Naniten Typ II')] === 0 ? 1 : 0)
			- (c_arti_types[arti_name_list.indexOf('Regenerative Naniten Typ III')] === 0 ? 1 : 0)
			- (c_arti_types[arti_name_list.indexOf('Optimierungsbeschleuniger')] === 0 ? 1 : 0)
			- (c_arti_types[arti_name_list.indexOf('Unbekannt')] === 0 ? 1 : 0);
		rowcount = Math.ceil(rowcount / 2);

		var currow = 0;

		for(var i = 0; i < c_arti_types.length; i++) {

			var r = ((currow < rowcount) ? (document.createElement('tr')) : (t.rows[currow-rowcount+1]));
			var c1 = document.createElement('td');
			var c2 = document.createElement('td');

			// old deprecated stuff
			if(/Regenerative Naniten Typ [I]+/.test(arti_name_list[i])) {
				if(c_arti_types[i] === 0) {
					continue;
				}
				c1.className = 'i';
			}

			if(/Optimierungsbeschleuniger/.test(arti_name_list[i])) {
				if(c_arti_types[i] === 0) {
					continue;
				}
				c1.className = 'i';
			}

			if(arti_name_list[i] === 'Unbekannt') {
				if(c_arti_types[i] === 0) {
					continue;
				}
				c1.style.color = '#FF8000';
			}

			c1.appendChild(document.createTextNode(arti_name_list[i]));
			c2.appendChild(document.createTextNode(c_arti_types[i]));
			r.appendChild(c1);
			r.appendChild(c2);

			if(display_links) {
				var c3 = document.createElement('td');
				if((c_arti_types_aid[i] > 0) && (i != arti_name_list.indexOf('Ressourcen'))) {
					var link3 = document.createElement('a');
					link3.appendChild(document.createTextNode(LINK_TEXT));
					link3.href = getRxDomain() + 'php/artefakte.php?est=' + c_arti_types_page[i] + '#' + c_arti_types_aid[i];
					link3.addEventListener('click', clickRefreshSamePage, true);
					c3.appendChild(link3);
				}
				c2.style.textAlign = 'center';
				c3.style.textAlign = 'center';
				r.appendChild(c3);
			}

			if(currow < rowcount) {
				t.appendChild(r);
			}

			currow++;
		}

		// double boundary in the middle

		for(var i = 0; i < t.rows.length; i++) {
			if(t.rows[i].cells.length == 6) {
				t.rows[i].cells[3].style.borderStyle = 'solid solid solid double';
				t.rows[i].cells[3].style.borderLeftWidth = '3px';
				t.rows[i].cells[2].style.borderRightWidth = '0px';
				t.rows[i].cells[2].style.width = '10%';
				t.rows[i].cells[5].style.width = '10%';
			} else if(t.rows[i].cells.length == 4) {
				t.rows[i].cells[2].style.borderStyle = 'solid solid solid double';
				t.rows[i].cells[2].style.borderLeftWidth = '3px';
				t.rows[i].cells[1].style.borderRightWidth = '0px';
			}
		}

		// resources //

		var r = document.createElement('table');
		r.className = 'wrpd full';
		r.style.textAlign = 'center';

		var resshead = document.createElement('tr');

		var ressheader = new Array('Ressourcen', 'Anzahl', 'Summe', 'Größtes Artefakt', 'Kleinstes Artefakt');
		var taligns = new Array('10%', '15%', '25%', '25%', '25%');

		for(i = 0; i < 5; i++) {
			var rhcell = document.createElement('td');
			rhcell.className = 'nfo';
			rhcell.style.width = taligns[i];
			rhcell.style.textAlign = 'center';
			rhcell.appendChild(document.createTextNode(ressheader[i]));
			resshead.appendChild(rhcell);
		}

		if(display_links) {
			resshead.cells[3].colSpan = 2;
			resshead.cells[4].colSpan = 2;
		}

		r.appendChild(resshead);

		for(var i = 0; i < c_ress_total.length; i++) {

			if(!c_ress_count[i]) {
				continue;
			}

			var rw = document.createElement('tr');
			var c1 = document.createElement('td');
			var c2 = document.createElement('td');
			var c3 = document.createElement('td');
			var c4 = document.createElement('td');
			var c4l = document.createElement('td');
			var c5 = document.createElement('td');
			var c5l = document.createElement('td');
			var ressimg = document.createElement('img');
			var txt_cnt = document.createTextNode(c_ress_count[i]);
			var str_su = (c_ress_total[i] > 0 ? c_ress_total[i] : '-');
			var str_hi = (c_ress_hi[i] !== 0 ? c_ress_hi[i] : '-');
			var str_lo = (c_ress_low[i] !== Infinity ? c_ress_low[i] : '-');
			var link4 = document.createElement('a');
			var link5 = document.createElement('a');
			link4.appendChild(document.createTextNode(LINK_TEXT));
			link5.appendChild(document.createTextNode(LINK_TEXT));

			ressimg.src = getRxDomain() + 'gfx/r/r' + (i + 1) + '.gif';
			link4.href = getRxDomain() + 'php/artefakte.php?est=' + c_ress_hi_page[i] + '#' + c_ress_hi_aid[i];
			link5.href = getRxDomain() + 'php/artefakte.php?est=' + c_ress_low_page[i] + '#' + c_ress_low_aid[i];
			link4.addEventListener('click', clickRefreshSamePage, true);
			link5.addEventListener('click', clickRefreshSamePage, true);

			ressimg.title = ressources_long[i];
			ressimg.alt = ressources[i];

			c1.appendChild(ressimg);
			c2.appendChild(txt_cnt);
			c3.appendChild(document.createTextNode(str_su));
			c4.appendChild(document.createTextNode(str_hi));
			c5.appendChild(document.createTextNode(str_lo));
			rw.appendChild(c1);
			rw.appendChild(c2);
			rw.appendChild(c3);
			rw.appendChild(c4);
			rw.appendChild(c5);

			c4l.appendChild(link4);
			c5l.appendChild(link5);

			if(display_links) {
				rw.insertBefore(c4l, c5);
				rw.appendChild(c5l);
			}
			r.appendChild(rw);
		}

		// only leave first framed div intact, eliminate the rest

        var frtdivs = document.getElementsByClassName('wrp ce');

        for(var i = frtdivs.length - 1; i > 0; i--) {
            if(frtdivs[i].nextSibling &&
                (frtdivs[i].nextSibling.tagName == 'BR'))
            {
                frtdivs[i].parentNode.removeChild(frtdivs[i].nextSibling);
            }
            frtdivs[i].parentNode.removeChild(frtdivs[i]);
        }

        var par = frtdivs[0].parentNode;

		par.appendChild(frameTable(s));
		par.appendChild(document.createElement('br'));
		par.appendChild(frameTable(t));
        par.appendChild(document.createElement('br'));
		par.appendChild(frameTable(r));

		return 0;
	}

	function removeArti(said) {

		for(var i = 0; i < artis.length; i++) {
			if(artis[i].aid === said) {
				artis.splice(i, 1);
				log('arti ' + said + ' has been removed');
				return 0;
			}
		}
		log('arti ' + said + ' not found for removal');
		return -1;
	}

	function removeUselessArtis() {

		var i = artis.length;
		var cnt = 0;

		while(i > 0) {
			i--;
			if(artis[i].type === arti_name_list.indexOf('Schrott')) {
				log('arti ' + artis[i].aid + ' has been scrapped');
				artis.splice(i, 1);
				cnt++;
			}
		}

		return cnt;
	}

	function killOrphans() {
		// if we have too much artis, check the current page. Since artis
		// are sorted by aid (both rx and artis array), the aid chain on
		// the page should be found back at the array. Any extra aids in
		// that chain are those which have been removed previously and
		// somehow did miss our detection - hence we remove them.

		var tables = document.getElementsByTagName('table');
		var idx = -1;
		var touched = false;

		if(tables.length < 4) {
			return -1;
		}

        var ttable = tables[tables.length - 1];

		for(var i = 1; i < ttable.rows.length; i++) {
			// exclude line with button (1 cell only)
			if(ttable.rows[i].cells.length != 4) {
				continue;
			}

			// scan
			if(!ttable.rows[i].cells[3].firstChild.href) {
				log('aid missing in chain, aborting orphan search');
				return -1;
			}

			var aid = +ttable.rows[i].cells[3].firstChild.href.match(/aid=\d+/)[0].match(/\d+/);

			if(idx == -1) {
				// find start of chain
				for(var j = artis.length - 1; j >= 0; j--) {
					if(artis[j].aid === aid) {
						idx = j;
						break;
					}
				}

				if(idx == -1) {
					log('start of chain not found, first arti seems to be new');
					return 1;
				}

				if((idx > (artis.length - 15)) && (idx < (artis.length - 1))) {
					// assume we are on page 1, with lots of orphans left
					artis.splice(idx + 1, artis.length - idx);
					log('removed ' + (artis.length-idx) + ' orphan(s) from end');
					touched = true;
				}

				continue;
			}

			idx--;

			if(aid > artis[idx].aid) {
				// this means a new arti has popped up we do not know yet
				log('new arti found');
				return 1;
			}

			if(aid < artis[idx].aid) {
				// remove one or more orphans, until we hit a recognised or an unknown arti
				var st = idx;
				while((aid < artis[idx].aid) && (idx >= 0)) {
					idx--;
				}
				artis.splice(idx+1, st-idx);
				log('removed ' + (st-idx) + ' orphan(s)');
				touched = true;
			}

		}

		return (touched ? 2 : 0);
	}

	function highlightArti(haid) {

		var tables = document.getElementsByTagName('table');

        var ttable = tables[tables.length - 1];

		for(var i = 1; i < ttable.rows.length; i++) {

			if(!ttable.rows[i].cells[3].firstChild.href) {
				continue;
			}

			var thisaid = +ttable.rows[i].cells[3].firstChild.href.match(/aid=\d+/)[0].match(/\d+/);

			if(thisaid === haid) {

				var r = document.createElement('tr');
				var rc = document.createElement('td');
				var tt = document.createElement('table');

				rc.colSpan = 4;
				rc.style.padding = '2px';
				rc.style.backgroundColor = '#00FF00';

				tt.appendChild(ttable.rows[i].cloneNode(true));
				tt.setAttribute('class', 'wrpd full');
				tt.rows[0].cells[0].width = +ttable.rows[0].cells[0].width - 1;
				tt.rows[0].cells[1].width = +ttable.rows[0].cells[1].width + 2;
				tt.rows[0].cells[3].width = +ttable.rows[0].cells[3].width - 1;
				tt.rows[0].cells[1].style.whiteSpace = 'normal';
				tt.rows[0].cells[2].style.whiteSpace = 'nowrap';

				rc.appendChild(tt);
				r.appendChild(rc);

				ttable.rows[i].parentNode.replaceChild(r, ttable.rows[i]);

				ttable.rows[i].scrollIntoView();

				return 1;
			}
		}

		return 0;
	}

	function init_artis() {
		// load cookie, check artis, save cookie if necessary, generate overview

		var data_loaded = -1;
		var tables = document.getElementsByTagName('table');

		if((/setup\.php$/).test(document.URL)) {
			insertSettings();

		} else if((/artefakte\.php\S*asr=\d+$/).test(document.URL)) {
			// scrapping
			loadArtiData();
			var aid = +document.URL.match(/\d+$/)[0];
			removeArti(aid);
			saveArtiData();
			calcStats();
			insertSummary();

		} else if((/artefakte\.php\S*kaa=\d+$/).test(document.URL)) {
			// multi-scrapping
			loadArtiData();
			if(removeUselessArtis() > 0) {
				saveArtiData();
				calcStats();
			} else {
				loadStatData();
			}
			insertSummary();

		} else if((/artefakte\.php\S*agvg=\d+$/).test(document.URL) &&
			(/artefakte\.php\S*agv=\d+$/).test(document.referrer) &&
			tables.length > 0)
		{
			// transfer
			loadArtiData();
			var aid = +document.URL.match(/\d+$/)[0];
			removeArti(aid);
			saveArtiData();
			calcStats();
			insertSummary();

		} else if((/artefakte_use\.php\S*aid=\d+/).test(document.URL)) {
			// usage
			// Ress: loads page with one table containing 'Ressourcen erhalten' in row 1
			// in general: failure has a bold 'Achtung' with extra text and no tables on a plain body
			// probably risky, nevertheless convenient: exclude failure instead of inclusion of success
			if(!((document.getElementsByTagName('b').length > 0) &&
				(document.getElementsByTagName('table').length === 0) &&
				(document.getElementsByTagName('b')[0].textContent === 'Achtung')))
			{
				loadArtiData();
				var aid = +(document.URL.match(/aid=\d+/)[0].match(/\d+/));
				removeArti(aid);
				saveArtiData();
				calcStats();
			}

		} else if(((/artefakte\.php$|artefakte\S*est=\d+$|artefakte\S*[e|u]st=\d+\S*faa=\d+$/).test(document.URL)) && (tables != null)) {
			// standard page without extra parameters ('erforscht' only)

			if(!localStorage) {
				// user message
				var spn = document.createElement('span');
				spn.style.color = '#FFFF00';
				spn.appendChild(document.createTextNode(' Warnung:'
					+ ' Web Storage nicht verfügbar,'
					+ ' Artefakte können nicht gespeichert werden!'));
				tables[0].rows[1].cells[0].appendChild(spn);
				return 0;
			}

			// only load main stats here (unless this fails)
			if(!loadStatData()) {
				data_loaded = loadArtiData();
				calcStats();
			}
			log(artis_sum + ' artis stored');

			// load array data if changed
			if(tables.length > 1) {
				var user_artis = +tables[1].rows[1].cells[0].firstChild.textContent.match(/\d+/);

				var newartis = 0;

				if(user_artis != artis_sum) {
					// show a hint here
					// distinguish between more saved than existent and less than existent
					log('mismatch: ' + user_artis + ' detected, but ' + artis_sum + ' found in storage');
					if(data_loaded < 0) {
						loadArtiData();
					}

					if(user_artis < artis_sum) {
						log('it seems orphans exist');
						var youkill = killOrphans();
						if(youkill > 0) {
							if(youkill === 1) {
								newartis = parseArtis();
								killOrphans();
							}
							saveArtiData();
							calcStats();
						}
					} else {
						newartis = parseArtis();
					}

					if(newartis > 0) {
						log(newartis + ' new artifacts found on this page');
						saveArtiData();
						calcStats();
					} else if (newartis == 0) {
						log('no new artifacts');
					}
				}

				insertSummary(newartis);
			}

		} else if(((/artefakte\S*ust=(\d+|\d+\&afr\=\d+)$/).test(document.URL)) && (tables != null)) {
			if(loadStatData()) {
				insertSummary();
			}

		} else if(((/artefakte\S*est=\d+\#\d+$/).test(document.URL)) && (tables != null)) {
			var haid = +document.URL.match(/\d+$/)[0];
			if(!highlightArti(haid)) {
				log('arti ' + haid + ' not found on this page');
			}

			if(loadStatData()) {
				insertSummary();
			}
		}

		log('finished.')

		return 0;
	}

	// object and array cloning function, see
	// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
	function clone(sth) {
		// bool, string, number, and null or undefined
		if (null == sth || "object" != typeof sth) return sth;

		// date
		if (sth instanceof Date) {
			var copy = new Date();
			copy.setTime(sth.getTime());
			return copy;
		}

		// array
		if (sth instanceof Array) {
			var copy = [];
			for (var i = 0, len = sth.length; i < len; i++) {
				copy[i] = clone(sth[i]);
			}
			return copy;
		}

		// object
		if (sth instanceof Object) {
			var copy = {};
			for (var attr in sth) {
				if (sth.hasOwnProperty(attr)) copy[attr] = clone(sth[attr]);
			}
			return copy;
		}

		// throw new Error("Cannot copy object, type not supported.");
	}

	function log(str)
	{
		if(DEBUG_VERBOSE) {
			console.log('rxartis: ' + str);
		}
	}

	init_artis();

})();
