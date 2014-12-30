// ==UserScript==
// @name        Revorix-Neue-Kartenansicht
// @namespace   http://random.erdbeerkuchen.net/
// @description Modifiziert die Kartenansicht für ein neues Fluggefühl im RX-Universum
// @downloadURL http://random.erdbeerkuchen.net/rxcode/scripts/DarkIce/rxnewmaps.user.js
// @updateURL   http://random.erdbeerkuchen.net/rxcode/scripts/DarkIce/rxnewmaps.meta.js
// @version     0.9beta
//
// @include     http://87.106.151.92/*/map*.php*
// @include     http://87.106.151.92/*/setup.php*
// @include     http://87.106.151.92/*/sgfx_select.php*
// @include     http://87.106.151.92/*/rx.php?set=4*
// @include     http://87.106.151.92/*/rx.php?set=5*
// @include     http://www.revorix.info/*/map*.php*
// @include     http://www.revorix.info/*/setup.php*
// @include     http://www.revorix.info/*/sgfx_select.php*
// @include     http://www.revorix.info/*/rx.php?set=4*
// @include     http://www.revorix.info/*/rx.php?set=5*
// ==/UserScript==

/* made by DarkIce */

"use strict";

(function()
{
	var thisIsExperimental = true;

	// logging

	var DEBUG_VERBOSE = true;

	// settings object

	var settings = {
		viewMagnitude: {
			value: 3.0,
			type: 'float',
			vmin: 0.1,
			vmax: 10.0,
			name: 'Maßstab',
			group: 'Flugbereich'
		},

		viewSectionRadius: {
			value: 3,
			type: 'int',
			vmin: 1,
			vmax: 6,
			name: 'Ausschnittsradius',
			unit: 'Sektoren',
			group: 'Flugbereich'
		},

		viewBoundarySectors: {
			value: 1,
			type: 'int',
			vmin: 0,
			vmax: 10,
			name: 'Rahmenbreite',
			unit: 'Sektoren',
			group: 'Flugbereich'
		},

		viewImproveGfx: {
			value: true,
			type: 'bool',
			name: 'Sektorgrafiken nachbearbeiten',
			group: 'Flugbereich'
		},

		viewImproveStarsOnly: {
			value: false,
			type: 'bool',
			name: 'Nur nichtleeren Raum',
			group: 'Flugbereich',
			depends: 'viewImproveGfx'
		},

		viewImproveFilter: {
			value: 1,
			type: 'sInt',
			vmin: 1,
			vmax: 4,
			name: 'Filter',
			group: 'Flugbereich',
			depends: 'viewImproveGfx'
		},

		mapMagnitude: {
			value: 1.0,
			type: 'float',
			vmin: 0.1,
			vmax: 10.0,
			name: 'Maßstab',
			group: 'Kartenbereich'
		},

		mapSectionSize: {
			value: 25,
			type: 'int',
			vmin: 1,
			vmax: 100,
			name: 'Ausschnittsgröße',
			unit: 'Sektoren',
			group: 'Kartenbereich'
		},

		mapBoundarySectors: {
			value: 2,
			type: 'int',
			vmin: 0,
			vmax: 50,
			name: 'Rahmenbreite',
			unit: 'Sektoren',
			group: 'Kartenbereich'
		},

		mapZoomFactor: {
			value: 1.2,
			type: 'float',
			vmin: 1.0,
			vmax: 5.0,
			name: 'Vergrößerungsfaktor',
			group: 'Kartenbereich'
		},

		mapZoomLevelMax: {
			value: 2,
			type: 'int',
			vmin: 1,
			vmax: 10,
			name: 'Vergrößerungsstufen',
			group: 'Kartenbereich'
		},

		sectorInfoCompact: {
			value: true,
			type: 'bool',
			name: 'Kompaktanzeige aktivieren',
			group: 'Anzeigeformat'
		},

		bodyRemoveTopMargin: {
			value: false,
			type: 'bool',
			name: 'Karten nach oben verschieben',
			group: 'Anzeigeformat'
		},

		hoverTimeout: {
			value: 500,
			type: 'int',
			vmin: 1,
			vmax: 10000,
			name: 'Zeit bis zur Anzeige der Sektorinfos',
			unit: 'ms',
			group: 'Animationen'
		},

		statusTimeout: {
			value: 1000,
			type: 'int',
			vmin: 1,
			vmax: 10000,
			name: 'Dauer der Statusanzeige',
			unit: 'ms',
			group: 'Animationen'
		},

		statusFadeInterval: {
			value: 100,
			type: 'int',
			vmin: 10,
			vmax: 1000,
			name: 'Animations-Intervall',
			unit: 'ms',
			group: 'Animationen'
		},

		_get: function (which) { return this[which] && this[which].value },
		_set: function (which, what) {
			if (!this[which]) {
				return false;
			}
			if (this[which].type === 'int' || this[which].type === 'float') {
				if (what < this[which].vmin || what > this[which].vmax) {
					return false;
				}
			}
			if (this[which].type === 'int') {
				this[which].value = Math.round(what);
			} else {
				this[which].value = what;
			}
			return true;
		}
	}

	// static vars

	var NAVBAR_HEIGHT = 150;

	var CELL_SECTORINFO = 1;
	var CELL_MAP = 2;
	var CELL_FLEETS = 3;

	var MICROTYPE_UNKNOWN = 0;
	var MICROTYPE_NOSPACE = 1;
	var MICROTYPE_BLIND = 2;
	var MICROTYPE_HERE = 3;
	var MICROTYPE_EMPTY = 4;
	var MICROTYPE_PLANETS = 5;
	var MICROTYPE_PORTAL = 6;

	var TEXT_HINT_LOGOUT = 'Kommunikation abgebrochen! (Logout)';
	var TEXT_HINT_UNKNOWN = 'Keine Informationen';
	var TEXT_HINT_SCAN = 'Sektor-Abtastung...';
	var TEXT_HINT_PINCLOSE = 'Doppelklick zum Schließen';

	var TEXT_MAP_MINI = 'Mittelstrecken-Sensoren';
	var TEXT_MAP_MICRO = '\u03BE-Scan des Quadranten';
	var TEXT_MAP_SWITCH = 'Sensorik wechseln';

	var TEXT_FLEET_FUEL = 'Tankmanöver durchgeführt.';

	var TEXT_FILTER_1 = 'Schärfen';
	var TEXT_FILTER_2 = 'Schärfen + Aufhellen';
	var TEXT_FILTER_3 = 'Verwischen';
	var TEXT_FILTER_4 = 'Verwischen + Aufhellen';
	var TEXT_FILTER_5 = 'Linien';
	var TEXT_FILTER_6 = 'Disco';
	var TEXT_FILTER_7 = 'Fliesen';

	var INPUTCOLOR_NORMAL = '#FFFFFF';
	var INPUTCOLOR_DECIMAL = '#FFF080';
	var INPUTCOLOR_RANGE = '#FFA060';
	var INPUTCOLOR_INVALID = '#FF6060';

	var TEXT_SET_LEGEND_HINT = 'Hinweis';
	var TEXT_SET_LEGEND_DECIMAL = '(Rundung auf Ganzzahl)';
	var TEXT_SET_LEGEND_RANGE = '(Bereichsüberschreitung)';
	var TEXT_SET_LEGEND_INVALID = '(ungültige Eingabe)';

	// user skins

	var currentSkin = 2;
	var userSkin = {
		naviWidth: new Array(616, 475, 641),
	};	// select with userSkin['naviWidth'][currentSkin]

	// globals

	var sector_timer = null;
	var status_timer = null;
	var fuel_timer = null;
	var interval_timer = null;

	var TID_STATUS = 1;
	var TID_FUEL = 2;
	var TID_INTERVAL = 3;

	var quad_id;

	var PIN_SECTORINFOS = false;

	var badsets = new Array();


	function loadDefaultSettings()
	{
		settings._set('viewMagnitude', 3.0);
		settings._set('viewSectionRadius', 3);
		settings._set('viewBoundarySectors', 1);
		settings._set('viewImproveGfx', true);
		settings._set('viewImproveStarsOnly', false);
		settings._set('viewImproveFilter', 1);
		settings._set('mapMagnitude', 1.0);
		settings._set('mapSectionSize', 25);
		settings._set('mapBoundarySectors', 2);
		settings._set('mapZoomFactor', 1.2);
		settings._set('mapZoomLevelMax', 2);
		settings._set('sectorInfoCompact', true);
		settings._set('bodyRemoveTopMargin', false);
		settings._set('hoverTimeout', 500);
		settings._set('statusTimeout', 2000);
		settings._set('statusFadeInterval', 100);
	}

	function loadSettings()
	{
		var str = document.cookie.match(/rxuscriptnewmaps=[^;]+/);
		if (!str) {
			log('settings cookie not found, loading default values');
			loadDefaultSettings();
			return;
		}

		str = str[0];

		str = str.substring(str.indexOf('=') + 1);
		var savedSets = str.split('!');

		for (var i = 0; i < savedSets.length; i++) {
			var [key, value] = savedSets[i].split(':');
			if (!key || !value) {
				continue;
			}

			if (settings[key]) {
				var setsuc = false;
				if (settings[key].type === 'bool') {
					setsuc = settings._set(key, (value == '1' ? true : false));
				} else if ((settings[key].type === 'int') ||
					(settings[key].type === 'float') ||
					(settings[key].type === 'sInt')) {
					setsuc = settings._set(key, +value);
				}

				if (!setsuc) {
					log('failed to load value "' + value + '" for setting "' + key + '"');
				}
			} else {
				log('saved setting "' + key + '" not found back in object (probably deprecated)');
			}
		}

	}

	function saveSettings()
	{
		var cookieString = 'rxuscriptnewmaps=';

		for (var key in settings) {

			if ((/^\_/).test(key)) {
				continue;
			}

			var input = document.getElementById('rxnms' + key);
			if (!input) {
				log('missing input for key ' + key);
				continue;
			}

			var setsuc = false;

			if (settings[key].type === 'bool') {
				setsuc = settings._set(key, input.checked);
			} else if (settings[key].type === 'sInt') {
				setsuc = settings._set(key, input.selectedIndex + 1);
			} else if ((settings[key].type === 'int') || (settings[key].type === 'float')) {
				var num = +input.value;
				if (num) {
					setsuc = settings._set(key, num);
				}
				// test for range problems
				if (!setsuc) {
					if (num > settings[key].vmax) {
						num = settings[key].vmax;
						log('restricted input to upper limit of ' + num + ' for setting "' + key + '"');
						setsuc = settings._set(key, num);
					} else if (num > settings[key].vmax) {
						num = settings[key].vmax;
						log('restricted input to lower limit of ' + num + ' for setting "' + key + '"');
						setsuc = settings._set(key, num);
					}
				}
				input.value = settings._get(key);
				input.style.backgroundColor = INPUTCOLOR_NORMAL;

				if ((settings[key].type === 'int') && !isNaN(num) && (num != settings._get(key))) {
					log('rounded value to an integer of ' + settings._get(key) + ' for "' + key + '"');
				}
			}

			if (!setsuc) {
				log('failed to set "' + key + '"');
			}

			if (settings[key].type === 'bool') {
				cookieString += key + ':' + (settings._get(key) === true ? '1' : '0') + '!';
			} else {
				cookieString += key + ':' + settings._get(key) + '!';
			}
		}

		cookieString = cookieString.replace(/!$/, ';');

		var expiredate = new Date();
		// save cookie for a year
		expiredate.setTime(expiredate.getTime() + (365 * 24 * 60 * 60 * 1000));

		document.cookie = cookieString + ' expires=' + expiredate.toGMTString();

		var svmsg = document.getElementById('rxnmsavemsg');
		if (svmsg) {
			svmsg.style.opacity = '1.0';
		}

		status_timer = window.setTimeout(fadeSin, settings._get('statusTimeout'), svmsg.id, TID_STATUS);
	}

	function hideSavemsg()
	{
		var svmsg = document.getElementById('rxnmsavemsg');
		if (svmsg) {
			svmsg.style.opacity = '0.0';
			window.clearTimeout(status_timer);
			window.clearInterval(interval_timer);
		}
	}

	function checkNumberInput(fld)
	{
		if (!fld.value) {
			return;
		}

		var key = fld.id.substring(5);

		if (!key || !settings[key]) {
			log('input field "' + fld.id + '" does not match any setting');
			return;
		}

		var legend = document.getElementById('rxnmlegend');
		if (legend) {
			legend.style.display = '';
		}

		var num = +fld.value;

		if (isNaN(num)) {
			fld.style.backgroundColor = INPUTCOLOR_INVALID;
			badsets.push(fld.id);
		} else if ((num < settings[key].vmin) || (num > settings[key].vmax)) {
			fld.style.backgroundColor = INPUTCOLOR_RANGE;
			badsets.push(fld.id);
		} else if ((settings[key].type === 'int') && ((/\./).test(fld.value))) {
			fld.style.backgroundColor = INPUTCOLOR_DECIMAL;
			badsets.push(fld.id);
		} else {
			fld.style.backgroundColor = INPUTCOLOR_NORMAL;
			var idx = badsets.indexOf(fld.id);
			if (idx > -1) {
				badsets.splice(idx, 1);
			}
		}

		var legend = document.getElementById('rxnmlegend');

		if (legend) {
			if (badsets.length > 0) {
				legend.style.display = '';
			} else {
				legend.style.display = 'none';
			}
		}

	}

	function checkDependency()
	{
		for (var key in settings) {
			if ((/^\_/).test(key)) {
				continue;
			}

			var dset = this.id.substring(5);

			if (settings[key].depends && (settings[key].depends === dset)) {
				var thisset = document.getElementById('rxnms' + key);
				if (this.checked === false) {
					thisset.disabled = 'disabled';
					thisset.parentNode.lastChild.style.color = '#888888';
					thisset.parentNode.lastChild.style.fontStyle = 'italic';
				} else {
					thisset.disabled = '';
					thisset.parentNode.lastChild.style.color = '';
					thisset.parentNode.lastChild.style.fontStyle = '';
				}
			}
		}

		hideSavemsg();
	}

	function numberInputEvent()
	{
		checkNumberInput(this);
		hideSavemsg();
	}

	function resetToDefault()
	{
		loadDefaultSettings();

		for (var key in settings) {

			if ((/^\_/).test(key)) {
				continue;
			}

			var input = document.getElementById('rxnms' + key);
			if (!input) {
				continue;
			}

			if (settings[key].type === 'bool') {
				input.checked = settings._get(key);
			} else if (settings[key].type === 'sInt') {
				input.selectedIndex = settings._get(key) - 1;
			} else if ((settings[key].type === 'int') || (settings[key].type === 'float')) {
				input.value = settings._get(key);
				input.style.backgroundColor = INPUTCOLOR_NORMAL;
			}
		}
	}

	function insertSettings()
	{
		var frm = document.getElementsByTagName('form');
		if (!frm.length) {
			return;
		}
		frm = frm[0];

		loadSettings();

		if (!Object.keys(settings).length) {
			return;
		}

		var t = document.createElement('table');
		t.className = 'wrpd full';
		// 'header'
		t.appendChild(document.createElement('tr'));
		t.rows[0].appendChild(document.createElement('td'));
		t.rows[0].cells[0].appendChild(document.createTextNode('Revorix-Userscript-Einstellungen: rxnewmaps'));
		t.rows[0].cells[0].className = 'nfo';
		t.rows[0].cells[0].colSpan = 3;

		if (thisIsExperimental) {
			var exp = document.createElement('span');
			exp.className = 'i';
			exp.style.fontVariant = 'normal';
			exp.appendChild(document.createTextNode(' (experimentell)'));
			t.rows[0].cells[0].appendChild(exp);
		}

		var legend = document.createElement('div');
		legend.style.fontVariant = 'normal';
		legend.style.fontStyle = 'italic';
		legend.style.cssFloat = 'right';
		legend.style.display = 'none';
		legend.id = 'rxnmlegend';

		var spn1 = document.createElement('span');
		var spn2 = document.createElement('span');
		var spn3 = document.createElement('span');
		var spn4 = document.createElement('span');
		spn1.appendChild(document.createTextNode(TEXT_SET_LEGEND_HINT + ': '));
		spn2.appendChild(document.createTextNode(TEXT_SET_LEGEND_DECIMAL + ' '));
		spn3.appendChild(document.createTextNode(TEXT_SET_LEGEND_RANGE + ' '));
		spn4.appendChild(document.createTextNode(TEXT_SET_LEGEND_INVALID));
		spn1.style.color = INPUTCOLOR_NORMAL;
		spn2.style.color = INPUTCOLOR_DECIMAL;
		spn3.style.color = INPUTCOLOR_RANGE;
		spn4.style.color = INPUTCOLOR_INVALID;

		legend.appendChild(spn1);
		legend.appendChild(spn2);
		legend.appendChild(spn3);
		legend.appendChild(spn4);

		t.rows[0].cells[0].appendChild(legend);

		var lastgroup = '';
		var gsoff = 0;

		for (var key in settings) {
			// test if this is a function (prepended with '_')
			if ((/^\_/).test(key)) {
				continue;
			}

			var ri = t.rows.length;

			t.appendChild(document.createElement('tr'));

			if (settings[key].group === lastgroup) {
				gsoff++;
				t.rows[ri - gsoff].cells[0].rowSpan++;
			} else {
				lastgroup = settings[key].group;
				gsoff = 0;
				t.rows[ri].appendChild(document.createElement('td'));
				t.rows[ri].cells[0].appendChild(document.createTextNode(settings[key].group));
				t.rows[ri].cells[0].style.verticalAlign = 'middle';
				t.rows[ri].cells[0].style.fontWeight = 'bold';
				t.rows[ri].cells[0].style.textAlign = 'left';
				t.rows[ri].cells[0].style.width = '25%';
			}
			t.rows[ri].appendChild(document.createElement('td'));
			var ci = t.rows[ri].cells.length - 1;

			var ip = document.createElement('input');
			ip.id = 'rxnms' + key;
			ip.style.verticalAlign = 'middle';
			ip.style.margin = '4px';
			var iplbl = document.createElement('label');
			iplbl.style.verticalAlign = 'middle';

			if ((settings[key].type === 'int') || (settings[key].type === 'float')) {
				ip.name = 'ip' + key;
				ip.className = 'text';
				ip.value = settings._get(key);
				ip.size = 8;
				ip.maxLength = 8;
				ip.addEventListener('keyup', numberInputEvent, false);
				iplbl.htmlFor = 'ip' + key;
				iplbl.appendChild(document.createTextNode(settings[key].name));
				t.rows[ri].cells[ci].appendChild(ip);
				t.rows[ri].cells[ci].appendChild(iplbl);
			} else if (settings[key].type === 'bool') {
				ip.type = 'checkbox';
				ip.name = 'cb' + key;
				ip.checked = settings._get(key);
				ip.addEventListener('change', hideSavemsg, false);
				iplbl.htmlFor = 'cb' + key;
				iplbl.appendChild(document.createTextNode(settings[key].name));
				t.rows[ri].cells[ci].appendChild(ip);
				t.rows[ri].cells[ci].appendChild(iplbl);
			} else if (settings[key].type === 'sInt') {
				// dropdown depending on key
				if (key === 'viewImproveFilter') {
					ip = document.createElement('select');
					ip.id = 'rxnms' + key;
					ip.name = 'sl' + key;
					ip.style.verticalAlign = 'middle';
					ip.style.margin = '4px';
					var opt1 = document.createElement('option');
					var opt2 = document.createElement('option');
					var opt3 = document.createElement('option');
					var opt4 = document.createElement('option');
					var opt5 = document.createElement('option');
					var opt6 = document.createElement('option');
					var opt7 = document.createElement('option');
					opt1.text = TEXT_FILTER_1;
					opt2.text = TEXT_FILTER_2;
					opt3.text = TEXT_FILTER_3;
					opt4.text = TEXT_FILTER_4;
					opt5.text = TEXT_FILTER_5;
					opt6.text = TEXT_FILTER_6;
					opt7.text = TEXT_FILTER_7;
					opt1.value = TEXT_FILTER_1;
					opt2.value = TEXT_FILTER_2;
					opt3.value = TEXT_FILTER_3;
					opt4.value = TEXT_FILTER_4;
					opt5.value = TEXT_FILTER_5;
					opt6.value = TEXT_FILTER_6;
					opt7.value = TEXT_FILTER_7;
					ip.appendChild(opt1);
					ip.appendChild(opt2);
					ip.appendChild(opt3);
					ip.appendChild(opt4);
					ip.appendChild(opt5);
					ip.appendChild(opt6);
					ip.appendChild(opt7);
					ip.selectedIndex = settings._get(key) - 1;
					ip.addEventListener('change', hideSavemsg, false);
					iplbl.htmlFor = 'sl' + key;
					iplbl.appendChild(document.createTextNode(settings[key].name));
					t.rows[ri].cells[ci].appendChild(ip);
					t.rows[ri].cells[ci].appendChild(iplbl);
				} else {
					log('unknown special list for key "' + key + '"');
				}
			} else {
				log('unrecognized settings type: ' + settings[key].type + ' at ' + settings[key]);
			}

			if (settings[key].unit) {
				t.rows[ri].cells[ci].lastChild.firstChild.data += ' [' + settings[key].unit + ']';
			}
		}

		t.rows[1].appendChild(document.createElement('td'));
		t.rows[1].cells[2].style.verticalAlign = 'middle';
		t.rows[1].cells[2].style.textAlign = 'center';
		t.rows[1].cells[2].style.width = '25%';
		var bsave = document.createElement('input');
		bsave.type = 'button';
		bsave.className = 'Button';
		bsave.id = 'rxnmsbsave';
		bsave.value = 'Speichern';
		bsave.addEventListener('click', saveSettings, false);

		var svmsg = document.createElement('span');
		svmsg.id = 'rxnmsavemsg';
		svmsg.style.color = '#00FF00';
		svmsg.style.display = 'block';
		svmsg.style.opacity = '0.0';
		svmsg.style.margin = '10px';
		svmsg.appendChild(document.createTextNode('Gespeichert!'));

		var breset = document.createElement('input');
		breset.type = 'button';
		breset.className = 'Button';
		breset.id = 'rxnmsbreset';
		breset.value = 'Standardwerte';
		breset.addEventListener('click', resetToDefault, false);

		t.rows[1].cells[2].appendChild(bsave);
		t.rows[1].cells[2].appendChild(svmsg);
		t.rows[1].cells[2].appendChild(breset);

		t.rows[1].cells[2].rowSpan = t.rows.length - 1;
		var sdiv = frameTable(t);
		sdiv.id = 'rx_user_rxnewmaps';

		frm.parentNode.insertBefore(sdiv, frm.nextSibling);
		frm.parentNode.insertBefore(document.createElement('br'), frm.nextSibling);

		// dependency check
		for (var key in settings) {

			if ((/^\_/).test(key)) {
				continue;
			}

			if (settings[key].depends) {
				var dep = settings[key].depends;
				if (settings[dep] && (settings[dep].value === false)) {
					var thisset = document.getElementById('rxnms' + key);
					thisset.disabled = 'disabled';
					thisset.parentNode.lastChild.style.color = '#888888';
					thisset.parentNode.lastChild.style.fontStyle = 'italic';
				}

				document.getElementById('rxnms' + dep).addEventListener('change', checkDependency, false);
			}
		}

	}

	function frameTable(t)
	{
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

	function getImageSize(map)
	{
		var img = map.firstChild;

		while (img.nextSibling) {
			if (img.tagName === 'IMG') {
				if ((/\/q8\/\w+\.gif$/).test(img.src)) {
					return 8;
				} else if ((/\/q15\/\w+\.gif$/).test(img.src)) {
					return 15;
				} else if ((/\/q\/\w+\.gif$/).test(img.src)) {
					return 10;
				} else {
					log('could not determine image size, using default of 10px');
					return 10;
				}
			}
			img = img.nextSibling;
		}
	}

	function chooseFilter(num)
	{
		var FILTER_BLUR = [ 1/9, 1/9, 1/9,
							1/9, 1/9, 1/9,
							1/9, 1/9, 1/9 ];

		var FILTER_BBLUR = [ 1/9, 1/9, 1/9,
							 1/9, 9/9, 1/9,
							 1/9, 1/9, 1/9 ];

		var FILTER_SHARP = [  0, -1,  0,
							 -1,  5, -1,
							  0, -1,  0 ];

		var FILTER_BSHARP = [ -1/4, -2/4, -1/4,
							  -2/4, 18/4, -2/4,
							  -1/4, -2/4, -1/4 ];

		var FILTER_LINES = [ 1,   2, 1,
							 2, -11, 2,
							 1,   2, 1 ];

		var FILTER_GHOST = [ 0,  2, 0,
							 2, -8, 2,
							 0,  2, 0 ];

		var FILTER_3DTILE = [ -4/3, -2/3,   0,
							  -2/3,  2/3, 2/3,
							     0,  2/3, 4/3 ];

		switch(num) {
			case 1: return FILTER_SHARP;
			case 2: return FILTER_BSHARP;
			case 3: return FILTER_BLUR;
			case 4: return FILTER_BBLUR;
			case 5: return FILTER_LINES;
			case 6: return FILTER_GHOST;
			case 7: return FILTER_3DTILE;
			default: return null
		}
	}


	function filterImg(image, filter)
	{
		// 15px, x3, 5 gridwidth: 1580 ms (25 calls); 770 ms @ 8px
		// now ~1050 ms @ 15px, 350 ms @ 8px
		var ops = 0;

		var h = image.height;
		var w = image.width;

		// construct source data
		var srccanv = document.createElement('canvas');
		srccanv.height = h;
		srccanv.width = w;

		var srccont = srccanv.getContext('2d');
		srccont.drawImage(image, 0, 0, w, h);

		if (!filter) {
			return srccanv;
		}

		var srcimg = srccont.getImageData(0, 0, w, h);
		var srcpx = srcimg.data;

		// construct destination data
		var dstcanv = document.createElement('canvas');
		dstcanv.height = h;
		dstcanv.width = w;

		var dstcont = dstcanv.getContext('2d');
		var dstimg = dstcont.getImageData(0, 0, w, h);
		var dstpx = dstimg.data;

		var fside = Math.round(Math.sqrt(filter.length));
		var fhside = Math.floor(fside / 2);

		var r, g, b, dstoff, sx, sy, srcoff, f;
		var x, y, fx, fy;

		// apply weighed matrix for central and neighbour pixels on each one
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				dstoff = (y * w + x) * 4;
				// alpha channel non-existent, so ignore it
				r = 0;
				g = 0;
				b = 0;
				for (fy = 0; fy < fside; fy++) {
					for (fx = 0; fx < fside; fx++) {
						sx = x + fx - fhside;
						sy = y + fy - fhside;
						// mind image borders
						if ((sx < w) && (sy < h) && (sx >= 0) && (sy >= 0)){
							srcoff = (sy * w + sx) * 4;
							f = filter[fx * fside + fy];
							r += srcpx[srcoff] * f;
							g += srcpx[srcoff + 1] * f;
							b += srcpx[srcoff + 2] * f;
						}
						ops++;
					}
				}
				dstpx[dstoff] = r;
				dstpx[dstoff + 1] = g;
				dstpx[dstoff + 2] = b;
				dstpx[dstoff + 3] = 255;
			}
		}

		dstcont.putImageData(dstimg, 0, 0);

		return dstcanv;
	}

	function removeFuelmsg()
	{
		var tables = document.getElementsByTagName('table');

		for (var i = 0; i < tables.length; i++) {
			if ((/\bEnergie\b.+\bSchiffsreaktoren\b.+\bumverteilt\b/).test(tables[i].textContent)) {
				document.body.removeChild(tables[i].parentNode.parentNode.parentNode);
				// those breaks...
				for (var i = 0; i < document.body.childNodes.length; i++) {
					if (document.body.childNodes[i].tagName === 'BR') {
						document.body.removeChild(document.body.childNodes[i]);
					}
				}
				return true;
			}
		}

		return false;
	}

	function getCell(what)
	{
		var tables = document.getElementsByTagName('table');

		if (!tables.length) {
			log('no table found');
			return null;
		}

		var i = 0;
		while ((tables[i].rows.length !== 2) || (tables[i].rows[0].cells.length !== 2)) {
			i++;
			if (i >= tables.length) {
				log('table containing map not found');
				return null;
			}
		}

		switch (what) {

			case CELL_SECTORINFO:
				return tables[i].rows[0].cells[1];

			case CELL_MAP:
				return tables[i].rows[0].cells[0];

			case CELL_FLEETS:
				return tables[i].rows[1].cells[0];

			default:
				return null;
		}
	}

	function makeLocalMap(x, y)
	{
		var map = getCell(CELL_MAP);

		if (!map) {
			return null;
		}

		var imgurl;
		var imgsize = getImageSize(map);

		if (map.firstChild.tagName === 'A') {
			imgurl = map.firstChild.firstChild.src;
		} else {
			imgurl = map.firstChild.src;
		}

		imgurl = imgurl.replace(/\/[^\/]+\.gif/, '/n.gif');

		var linelen = 0;

		while (linelen < map.childNodes.length) {
			if (map.childNodes[linelen].tagName === 'BR') {
				break;
			}
			linelen++;
		}

		// count images only, in case anyone else inserts something
		var totalsecs = map.getElementsByTagName('IMG').length;
		var linecount = totalsecs / linelen;

		function cellc(x, y)
		{
			return ((x > 0) && (x <= linelen) && (y > 0) && (y <= linecount)) ?
				((y - 1) * (linelen + 1) + (x - 1)) :
				-1;
		}

		var maxsec = settings._get('viewSectionRadius') * 2 - 1;

		var bignodes = new Array(maxsec * maxsec);

		var vx = x - (maxsec - 1) / 2;
		var vy = y - (maxsec - 1) / 2;

		for (var i = 0; i < bignodes.length; i++) {
			bignodes[i] = cellc(vx, vy);
			vx++;
			if (!((i + 1) % maxsec)) {
				vx -= maxsec;
				vy++;
			}
		}

		var ndiv = document.createElement('div');

		for (var i = 0; i < bignodes.length; i++) {

			var thisnode;

			if (bignodes[i] === -1) {
				thisnode = document.createElement('img');
				thisnode.src = imgurl;
			} else {
				thisnode = map.childNodes[bignodes[i]].cloneNode(true);
			}

			if (thisnode.tagName === 'A') {
				thisnode = thisnode.firstChild;
			}
			thisnode.height = imgsize * settings._get('viewMagnitude');
			thisnode.width = imgsize * settings._get('viewMagnitude');
			ndiv.appendChild(thisnode);
			if (!((i + 1) % maxsec)) {
				ndiv.appendChild(document.createElement('br'));
			}
		}

		// return aside from div a couple params for sake of convenience
		return [ndiv, linelen, linecount, imgsize];
	}

	function shift_layout()
	{
		var tstart = new Date().getTime();

		var scell = getCell(CELL_SECTORINFO)
		if (!scell) {
			return -1;
		}

		var strpos = scell.firstChild.textContent;
		var q = strpos.match(/^.+(?=.X\:)/)[0];
		var x = +(strpos.match(/X\:.*\d+/)[0].match(/\d+/)[0]);
		var y = +(strpos.match(/Y\:.*\d+/)[0].match(/\d+/)[0]);

		log('current fleet position is ' + q + ' ' + x + ':' + y);

		var ldiv, xmax, ymax, imgsize;

		[ldiv, xmax, ymax, imgsize] = makeLocalMap(x, y);
		log('xmax = ' + xmax + ', ymax = ' + ymax + ', imgsize = ' + imgsize);

		var viewsecsize = (settings._get('viewSectionRadius') * 2 - 1) * settings._get('viewMagnitude');
		var viewbndsize = settings._get('viewBoundarySectors') * settings._get('viewMagnitude');

		// central flight area
		ldiv.id = 'flightarea';
		ldiv.style.position = 'relative';
		ldiv.style.borderColor = '#414256';
		ldiv.style.height = viewsecsize * imgsize + 'px';
		ldiv.style.width = viewsecsize * imgsize + 'px';

		var maincell = document.createElement('td');
		maincell.className = 'ce';
		maincell.style.verticalAlign = 'top';
		maincell.style.minWidth = viewsecsize * imgsize + 'px';
		maincell.style.height = viewsecsize * imgsize + 'px';

		var tstep1 = new Date().getTime();

		if (removeFuelmsg()) {
			var holder = document.createElement('div');
			holder.style.position = 'relative';
			holder.style.padding = viewbndsize * imgsize + 'px';

			var charge = document.createElement('div');
			charge.appendChild(document.createTextNode(TEXT_FLEET_FUEL));
			charge.id = 'fuelmsg';
			charge.style.color = '#00FF00';
			charge.style.width = '100%';
			charge.style.height = 'auto';
			charge.style.bottom = '0px';
			charge.style.left = '0px';
			charge.style.position = 'absolute';
			charge.style.textAlign = 'center';
			charge.style.display = 'inline-block';
			charge.style.opacity = '1.0';
			fuel_timer = window.setTimeout(fadeSin, settings._get('statusTimeout'), charge.id, TID_FUEL);

			ldiv.style.display = 'inline-block';
			holder.appendChild(ldiv);
			holder.appendChild(charge);
			maincell.appendChild(holder);
		} else {
			maincell.style.verticalAlign = 'top';
			maincell.style.padding = viewbndsize * imgsize + 'px';
			maincell.appendChild(ldiv);
		}

		var mapcell = getCell(CELL_MAP);
		var mapdiv = document.createElement('div');
		mapdiv.id = 'minimap';

		var cmddiv = document.createElement('div');
		cmddiv.id = 'mapcmds';

		var stsdiv = document.createElement('div');
		stsdiv.id = 'mapstatus';

		function microtype(s)
		{
			s = s.match(/[^\/]+\.gif$/)[0];
			if ((/^n\./).test(s)) return MICROTYPE_NOSPACE;
			if ((/^u\./).test(s)) return MICROTYPE_BLIND;
			if ((/^a\./).test(s)) return MICROTYPE_HERE;
			if ((/^\d\./).test(s)) return MICROTYPE_EMPTY;
			if ((/^\d{2}\./).test(s)) return MICROTYPE_PLANETS;
			if ((/^100\./).test(s)) return MICROTYPE_PORTAL;
			return MICROTYPE_UNKNOWN;
		}

		var tstep2 = new Date().getTime();

		var micro_data = new Array(xmax * ymax);
		var midx = 0;
		var ndim = imgsize * settings._get('mapMagnitude');

		while (mapcell.firstChild) {

			var thisnode = mapcell.firstChild;

			if (thisnode.tagName === 'A') {
				if (!quad_id) {
					quad_id = +thisnode.href.match(/\d+(?=&x=\d+&y=\d+$)/)[0];
					log('qid: ' + quad_id);
				}
				var tmpnode = thisnode;
				thisnode = thisnode.firstChild;
				tmpnode.parentNode.removeChild(tmpnode);
				thisnode.addEventListener('mouseover', hoverSector, false);
				thisnode.addEventListener('mouseout', leaveSector, false);
				thisnode.addEventListener('click', clickSector, false);
			}

			if (thisnode.tagName === 'IMG') {
				thisnode.height = ndim;
				thisnode.width = ndim;
				micro_data[midx] = microtype(thisnode.src);
				midx++;
			}

			mapdiv.appendChild(thisnode);
		}

		// css rules for sector images:
		var lastcss = document.styleSheets[document.styleSheets.length - 1];
		lastcss.insertRule('#minimap img {' +
				'position: relative;' +
				'z-index: 5;' +
			'}', lastcss.cssRules.length);

		var tstep3 = new Date().getTime();

		var mapsecsize = settings._get('mapSectionSize') * settings._get('mapMagnitude');
		var mapbndsize = settings._get('mapBoundarySectors') * settings._get('mapMagnitude');

		var addmappadding = ((ymax < settings._get('mapSectionSize')) ? (imgsize * (settings._get('mapSectionSize') - ymax) / 2) : 0);

		mapdiv.style.height = (mapsecsize * imgsize - addmappadding) + 'px';
		mapdiv.style.width = mapsecsize * imgsize + 'px';
		mapdiv.style.whiteSpace = 'nowrap';
		mapdiv.style.overflow = 'hidden';
		mapdiv.style.verticalAlign = 'middle';
		mapdiv.style.borderStyle = 'solid';
		mapdiv.style.borderWidth = '1px';
		mapdiv.style.borderColor = '#414256';
		mapdiv.style.paddingTop = addmappadding + 'px';
		mapdiv.style.position = 'relative';

		cmddiv.style.height = mapbndsize * imgsize + 'px';
		cmddiv.style.marginBottom = '1px';
		cmddiv.style.lineHeight = mapbndsize * imgsize + 'px';
		stsdiv.style.height = mapbndsize * imgsize + 'px';
		stsdiv.style.lineHeight = mapbndsize * imgsize + 'px';
		stsdiv.style.opacity = '0';

		mapcell.rowSpan = 2;
		mapcell.style.verticalAlign = 'top';
		mapcell.style.textAlign = 'center';
		mapcell.style.paddingLeft = mapbndsize * imgsize + 'px';
		mapcell.style.paddingRight = mapbndsize * imgsize + 'px';
		mapcell.style.width = '1px';
		mapcell.appendChild(cmddiv);
		mapcell.appendChild(mapdiv);
		mapcell.appendChild(stsdiv);

		// insertion of new elements
		scell.parentNode.insertBefore(maincell, scell);
		scell.width = '20%';

		// scroll that div to a good position
		mapdiv.scrollTop = ((y - settings._get('mapSectionSize') / 2) * imgsize - imgsize / 2) * settings._get('mapMagnitude');
		mapdiv.scrollLeft = ((x - settings._get('mapSectionSize') / 2) * imgsize - imgsize / 2) * settings._get('mapMagnitude');

		var tstep4 = new Date().getTime();

		// insert micromap with boundaries and all
		var microdiv = document.createElement('div');
		microdiv.id = 'micromap';
		microdiv.style.display = 'none';
		microdiv.style.position = 'relative';
		microdiv.style.borderStyle = 'solid';
		microdiv.style.borderWidth = '1px';
		microdiv.style.borderColor = '#414256';

		var mcanv = document.createElement('canvas');
		mcanv.height = mapsecsize * imgsize;
		mcanv.width = mapsecsize * imgsize;

		microdiv.appendChild(mcanv);

		var mx = mcanv.getContext('2d');

		var pxx = Math.floor(mapsecsize * imgsize / xmax);
		var pxy = Math.floor(mapsecsize * imgsize / ymax);

		var pxsize = +(pxx < pxy ? pxx : pxy);

		var xoff = Math.floor((mapsecsize * imgsize - xmax * pxsize) / 2);
		var yoff = Math.floor((mapsecsize * imgsize - ymax * pxsize) / 2);

		var vx = 0;
		var vy = 0;

		for (var i = 0; i < micro_data.length; i++) {
			switch (micro_data[i]) {
				case MICROTYPE_NOSPACE: mx.fillStyle = 'rgba(0, 0, 0, 0)'; break;
				case MICROTYPE_BLIND: mx.fillStyle = 'rgb(0, 0, 40)'; break;
				case MICROTYPE_HERE: mx.fillStyle = 'rgb(127, 40, 40)'; break;
				case MICROTYPE_EMPTY: mx.fillStyle = 'rgb(0, 0, 127)'; break;
				case MICROTYPE_PLANETS: mx.fillStyle = 'rgb(127, 127, 0)'; break;
				case MICROTYPE_PORTAL: mx.fillStyle = 'rgb(0, 127, 0)'; break;
				default: mx.fillStyle = 'rgb(0, 0, 0)'; break;
			}
			mx.fillRect((vx * pxsize + xoff), (vy * pxsize + yoff), pxsize, pxsize);	// (x, y, width, height)
			vx++;
			if (!((i + 1) % xmax)) {
				vx -= xmax;
				vy++;
			}
		}

		var tstep5 = new Date().getTime();

		var microvframe = document.createElement('div');
		microvframe.id = 'microvframe';
		microvframe.style.display = 'none';
		microvframe.style.borderStyle = 'solid';
		microvframe.style.borderWidth = '1px';
		microvframe.style.borderColor = 'rgba(255, 0, 0, 0.8)';
		microvframe.style.position = 'absolute';
		microvframe.style.zIndex = 2;
		microvframe.style.background = 'rgba(255, 0, 0, 0.1)';
		microvframe.alt = pxsize + 'p';
		log('set microvframe alt to ' + microvframe.alt);

		if ((xmax > settings._get('mapSectionSize')) || (ymax > settings._get('mapSectionSize'))) {
			microvframe.style.height = pxsize * settings._get('mapSectionSize') - 2 + 'px';
			microvframe.style.width = pxsize * settings._get('mapSectionSize') - 2 + 'px';
			microvframe.style.left = mapdiv.scrollLeft / imgsize / settings._get('mapMagnitude') * pxsize + xoff + 'px';
			microvframe.style.top = mapdiv.scrollTop / imgsize / settings._get('mapMagnitude') * pxsize + yoff + 'px';
		}

		microdiv.appendChild(microvframe);

		mapcell.insertBefore(microdiv, stsdiv);

		var marksec = document.createElement('div');
		marksec.id = 'marksec';
		marksec.style.display = 'none';
		marksec.style.borderStyle = 'solid';
		marksec.style.borderWidth = '1px';
		marksec.style.borderColor = 'rgb(255, 0, 0)';
		marksec.style.position = 'absolute';
		marksec.style.zIndex = 2;
		marksec.style.background = 'rgba(255, 0, 0, 0.5)';
		marksec.style.height = imgsize - 2 + 'px';
		marksec.style.width = imgsize - 2 + 'px';

		mapdiv.appendChild(marksec);

		var swb = document.createElement('a');
		swb.href = 'javascript:void(0);';
		swb.id = 'switchmaps';
		swb.appendChild(document.createTextNode(TEXT_MAP_SWITCH));
		swb.addEventListener('click', switchMaps, false);
		var swbdiv = document.createElement('div');
		swbdiv.appendChild(swb);

		var magl = document.createElement('a');
		magl.href = 'javascript:void(0);';
		magl.id = 'mapsmagl';
		magl.style.fontFamily = 'DejaVu Sans Mono,Lucida Console,Liberation Mono,Courier New,monospace';
		magl.appendChild(document.createTextNode('+++'));
		magl.addEventListener('click', magnifyMaps, false);
		var magldiv = document.createElement('div');
		magldiv.appendChild(magl);
		magldiv.style.cssFloat = 'right';

		var mags = document.createElement('a');
		mags.href = 'javascript:void(0);';
		mags.id = 'mapsmags';
		mags.style.fontFamily = 'DejaVu Sans Mono,Lucida Console,Liberation Mono,Courier New,monospace';
		mags.appendChild(document.createTextNode('---'));
		mags.addEventListener('click', magnifyMaps, false);
		var magsdiv = document.createElement('div');
		magsdiv.appendChild(mags);
		magsdiv.style.cssFloat = 'left';

		cmddiv.appendChild(magsdiv);
		cmddiv.appendChild(magldiv);
		cmddiv.appendChild(swbdiv);
		stsdiv.appendChild(document.createTextNode(TEXT_MAP_MINI));

		var tstep6 = new Date().getTime();

		var fc = makeFlightCircle((settings._get('viewSectionRadius') * 2 - 1) * settings._get('viewMagnitude') * imgsize, 15, -2, [24, 25, 46]);
		fc.id = 'flightcircle';
		fc.style.position = 'absolute';
		fc.style.top = '0px';
		fc.style.left = '0px';
		fc.style.zIndex = 8;

		ldiv.appendChild(fc);

		var tstep7 = new Date().getTime();
		log('[shift] step1: ' + (tstep1 - tstart) + 'ms');
		log('[shift] step2: ' + (tstep2 - tstep1) + 'ms');
		log('[shift] step3: ' + (tstep3 - tstep2) + 'ms');
		log('[shift] step4: ' + (tstep4 - tstep3) + 'ms');
		log('[shift] step5: ' + (tstep5 - tstep4) + 'ms');
		log('[shift] step6: ' + (tstep6 - tstep5) + 'ms');
		log('[shift] step7: ' + (tstep7 - tstep6) + 'ms');
		log('[shift] done in ' + (tstep7 - tstart) + 'ms');

		return 0;

	}

	function magnifyMaps()
	{
		// scale microvframe here, display only if needed (else set height to '')
		// get micromap size from setting values - save pixsize somewhere inside micromap (as alt?)
		// get microvframe from pixsize and that settings value, position as above
		// positioning still dodgy

		var map = document.getElementById('minimap');
		var microvframe = document.getElementById('microvframe');

		var here = document.getElementById('fleetposition');
		var x = +(here.alt.match(/X\:.*\d+/)[0].match(/\d+/)[0]);
		var y = +(here.alt.match(/Y\:.*\d+/)[0].match(/\d+/)[0]);

		var micropixsize = microvframe.alt.match(/^\d+/)[0];

		var tsize = getImageSize(map);

		var zplus = document.getElementById('mapsmagl');
		var zminus = document.getElementById('mapsmags');

		var zoom = zplus.title.match(/-?\d/);
		if (!zoom) {
			zoom = 0;
		} else {
			zoom = +zoom[0];
		}

		if (this === zplus) {

			zoom++;

			if (Math.abs(zoom) === settings._get('mapZoomLevelMax')) {
				zplus.style.visibility = 'hidden';
			}
			zminus.style.visibility = 'visible';

		} else if (this === zminus) {

			zoom--;

			if (Math.abs(zoom) === settings._get('mapZoomLevelMax')) {
				zminus.style.visibility = 'hidden';
			}
			zplus.style.visibility = 'visible';

		}

		zplus.title = 'Zoomlevel: ' + zoom;
		zminus.title = 'Zoomlevel: ' + zoom;

		var factor = 1 + zoom * (settings._get('mapZoomFactor') - 1);
		log('zoom: ' + zoom + ', factor: ' + factor);

		for (var i = 0; i < map.childNodes.length; i++) {
			if (map.childNodes[i].tagName === 'IMG') {
				map.childNodes[i].height = factor * tsize;
				map.childNodes[i].width = factor * tsize;
			}
		}

		map.scrollTop = ((settings._get('mapSectionSize') / 2 - y) * tsize - tsize / 2) * settings._get('mapMagnitude') * factor;
		map.scrollLeft = ((settings._get('mapSectionSize') / 2 - x) * tsize - tsize / 2) * settings._get('mapMagnitude') * factor;
		log('x: ' + x + ', y: ' + y + ', map w/h: '  + settings._get('mapSectionSize') + ', imgsize: ' + tsize +
			', magn: ' + settings._get('mapMagnitude') +
			', sTop: ' + ((settings._get('mapSectionSize') / 2 - y) * tsize - tsize / 2) * settings._get('mapMagnitude') * factor +
			', sLeft: ' + ((settings._get('mapSectionSize') / 2 - x) * tsize - tsize / 2) * settings._get('mapMagnitude') * factor);
		log('map.scrollTop: ' + map.scrollTop + ', map.scrollLeft: ' + map.scrollLeft);
		document.getElementById('marksec').style.height = factor * tsize - 2 + 'px';
		document.getElementById('marksec').style.width = factor * tsize - 2 + 'px';

		var newframesize = micropixsize * settings._get('mapSectionSize') / factor;
		log('new size: ' + newframesize + ', max: ' + (settings._get('mapSectionSize') * tsize));

		if (newframesize < (settings._get('mapSectionSize') * tsize)) {
			microvframe.style.height = micropixsize * settings._get('mapSectionSize') / factor - 2 + 'px';
			microvframe.style.width = micropixsize * settings._get('mapSectionSize') / factor - 2 + 'px';
			microvframe.style.left = map.scrollLeft / tsize / settings._get('mapMagnitude') * micropixsize + 'px';
			microvframe.style.top = map.scrollTop / tsize / settings._get('mapMagnitude') * micropixsize + 'px';
		} else {
			microvframe.style.height = '';
			microvframe.style.width = '';
		}
	}

	function switchMaps()
	{
		var minimap = document.getElementById('minimap');
		var micromap = document.getElementById('micromap');
		var microvframe = document.getElementById('microvframe');
		var sts = document.getElementById('mapstatus');
		var zplus = document.getElementById('mapsmagl');
		var zminus = document.getElementById('mapsmags');

		zplus.style.visibility = 'visible';

		if (minimap.style.display === 'none') {
			minimap.style.display = '';
			micromap.style.display = 'none';
			zplus.style.visibility = 'visible';
			zminus.style.visibility = 'visible';
			microvframe.style.display = 'none';
			var zoom = zplus.title.match(/-?\d/);
			if (zoom && (Math.abs(+zoom[0]) === settings._get('mapZoomLevelMax'))) {
				if (+zoom[0] < 0) {
					zminus.style.visibility = 'hidden';
				} else {
					zplus.style.visibility = 'hidden';
				}
			}
			sts.textContent = TEXT_MAP_MINI;
		} else {
			minimap.style.display = 'none';
			micromap.style.display = '';
			if (microvframe.style.height !== '') {
				microvframe.style.display = '';
			}
			zplus.style.visibility = 'hidden';
			zminus.style.visibility = 'hidden';
			sts.textContent = TEXT_MAP_MICRO;
		}

		sts.style.opacity = '1';

		if (status_timer) {
			window.clearTimeout(status_timer);
			window.clearInterval(status_timer);
			window.clearInterval(interval_timer);
		}

		status_timer = window.setTimeout(fadeSin, settings._get('statusTimeout'), sts.id, TID_STATUS);

		return 0;
	}

	function hoverSector(e)
	{
		if (!e) {
			var e = window.event;
		}

		var infos = document.getElementById('sectorinfos');
		var ldrdiv = document.getElementById('loaderhint');

		var ms = document.getElementById('marksec');
		ms.style.display = 'inline-block';
		ms.style.top = this.offsetTop + 'px';
		ms.style.left = this.offsetLeft + 'px';
		this.style.opacity = 0.5;

		if (sector_timer) {
			window.clearTimeout(sector_timer);
			sector_timer = null;
		}

		var altText = this.alt;
		var isunknown = (/u\.gif$/).test(this.src);
		var qx = +altText.match(/\d+(?=\s*Y)/)[0];
		var qy = +altText.match(/\d+\s*$/)[0];

		document.getElementById('mapstatus').style.opacity = '1.0';
		document.getElementById('mapstatus').textContent = 'X:' + qx + ' Y:' + qy;

		if (PIN_SECTORINFOS && !!infos && (infos.style.visibility != 'hidden')) {
			return;
		}

		if (ldrdiv) {
			ldrdiv.style.borderColor = 'rgb(65,66,86)';
		}

		if (infos) {
			infos.contentWindow.stop();
			infos.style.display = 'none';
			infos.style.visibility = 'hidden';
		}

		sector_timer = window.setTimeout(popSector, settings._get('hoverTimeout'), qx, qy, e.pageX, e.pageY, isunknown);

		if (status_timer) {
			window.clearInterval(status_timer);
			window.clearTimeout(status_timer);
			window.clearInterval(interval_timer);
			status_timer = null;
		}

		return 0;
	}

	function leaveSector(e)
	{
		document.getElementById('mapstatus').textContent = '';

		document.getElementById('marksec').style.display = 'none';
		this.style.opacity = 1;

		if (PIN_SECTORINFOS) {
			log('pin lock');
			return;
		}

		if (sector_timer) {
			window.clearTimeout(sector_timer);
			sector_timer = null;
		}

		var infos = document.getElementById('sectorinfos');

		if (infos) {
			infos.contentWindow.stop();
			infos.style.display = 'none';
			infos.style.visibility = 'hidden';
		}

		if (document.getElementById('loaderhint')) {
			document.getElementById('loaderhint').style.visibility = 'hidden';
		}

	}

	function clickSector()
	{
		var infos = document.getElementById('sectorinfos');

		if (infos) {
			infos.contentWindow.stop();
			infos.style.display = 'none';
			infos.style.visibility = 'hidden';
		}

		PIN_SECTORINFOS = true;
	}

	function dblclickDestruct()
	{
		log('dblclick detected from ' + this.id);

		var infos = document.getElementById('sectorinfos');
		var ldr = document.getElementById('loaderhint');

		if (infos) {
			infos.contentWindow.stop();
			infos.style.display = 'none';
		}

		if (ldr) {
			ldr.style.visibility = 'hidden';
		}

		PIN_SECTORINFOS = false;
	}

	function popSector(qx, qy, mx, my, isunknown)
	{
		var infos = document.getElementById('sectorinfos');

		if (PIN_SECTORINFOS && !!infos && (infos.style.visibility != 'hidden')) {
			log('sectorinfos pinned, will not replace');
			return;
		}

		sector_timer = null;

		var ldrdiv = document.getElementById('loaderhint');

		if (!ldrdiv) {
			ldrdiv = document.createElement('div');
			ldrdiv.id = 'loaderhint';
			ldrdiv.style.position = 'absolute';
			ldrdiv.style.zIndex = 10;
			ldrdiv.style.background = 'rgb(24,25,46)'
			ldrdiv.style.textAlign = 'left';
			ldrdiv.style.padding = '2px';
			ldrdiv.style.border = 'solid';
			ldrdiv.style.borderWidth = '1px';
			ldrdiv.style.borderColor = 'rgb(65,66,86)';
			ldrdiv.appendChild(document.createTextNode(''));
			ldrdiv.addEventListener('dblclick', dblclickDestruct, false);
			document.body.appendChild(ldrdiv);
		}

		ldrdiv.style.visibility = 'visible';
		ldrdiv.style.top = my - 30 + 'px';
		ldrdiv.style.left = mx + 5 + 'px';

		if (isunknown) {
			ldrdiv.textContent = TEXT_HINT_UNKNOWN;
			return 0;
		}

		ldrdiv.textContent = TEXT_HINT_SCAN;

		if (!infos) {
			infos = document.createElement('iframe');
			infos.id = 'sectorinfos';
			infos.style.position = 'absolute';
			infos.style.zIndex = 10;
			infos.style.border = 'none';
			infos.style.overflow = 'hidden';
			infos.style.visibility = 'hidden';
			//infos.addEventListener('load', stripPage, true);
			//infos.addEventListener('DOMContentLoaded', stripPage, true);
			document.body.appendChild(infos);
		}

		if (PIN_SECTORINFOS) {
			ldrdiv.style.borderColor = '#FFFF00';
			infos.style.borderWidth = '1px';
			infos.style.borderColor = '#FFFF00';
		} else {
			ldrdiv.style.borderColor = 'rgb(65,66,86)';
			infos.style.borderWidth = '';
			infos.style.borderColor = '';
		}

		infos.src = document.URL.match(/^\S+map\.php/)[0] +
			'?q=' + quad_id + '&x=' + qx + '&y=' + qy + '#strip';

		// frame will get repositioned when content is loaded - this is to save mouse coords only
		infos.style.top = my + 'px';
		infos.style.left = mx + 'px';
		if (infos.contentDocument.firstChild) {
			infos.contentDocument.removeChild(infos.contentDocument.firstChild);
		}

		return 0;
	}

	function stripPage()
	{
		log('stripping page...');

		var mdoc = window.parent.document;

		function styleCompactNode(n)
		{
			n.style.textAlign = 'left';
			n.style.padding = '2px';
			n.style.marginTop = '2px';
			n.style.borderStyle = 'solid none none none';
			n.style.borderWidth = '1px';
			n.style.borderColor = 'rgb(65,66,86)';
			n.style.whiteSpace = 'nowrap';
			n.style.width = 'auto';
			n.style.height = 'auto';
			n.style.display = 'block';
			return n;
		}

		var infoframe = mdoc.getElementById('sectorinfos');
		var idc = document;
		var noinfos = false;

		if ((/\/rx\/error/).test(idc.URL)) {
			log('logout page detected');
			mdoc.getElementById('loaderhint').textContent = TEXT_HINT_LOGOUT;
			return -1;
		}

		mdoc.getElementById('loaderhint').style.visibility = 'hidden';

		var tables = idc.getElementsByTagName('table');

		if (!tables || tables.length === 0) {
			noinfos = true;
		}

		if (!noinfos) {
			var i = 0;
			while ((tables[i].rows.length !== 2) || (tables[i].rows[0].cells.length !== 2)) {
				i++;
				if (i >= tables.length) {
					log('table containing map not found');
					noinfos = true;
				}
			}
			var sinfos = tables[i].rows[0].cells[1];
			var fleets = tables[i].rows[1].cells[0];
		}

		var md = mdoc.createElement('div');
		md.style.background = 'rgb(24,25,46)'
		md.style.textAlign = 'left';
		md.style.whiteSpace = 'nowrap';
		md.style.padding = '2px';
		md.style.borderStyle = 'solid';
		md.style.borderWidth = '1px';
		md.style.borderColor = 'rgb(65,66,86)';
		md.style.width = 'auto';
		md.style.height = 'auto';
		md.style.display = 'inline-block';

		if (noinfos) {
			md.appendChild(idc.createTextNode(TEXT_HINT_UNKNOWN));
		} else {
			while (sinfos.firstChild) {
				if (sinfos.firstChild.tagName === 'A') {
					if ((/sgfx_select\.php/).test(sinfos.firstChild.href)) {
						sinfos.removeChild(sinfos.firstChild);
						continue;
					}
				}

				if (settings._get('sectorInfoCompact')) {
					// test for WL / CP / IP
					if (sinfos.firstChild.tagName === 'TABLE') {
						var thistab = sinfos.firstChild;
						if (thistab.rows[0].cells.length > 1) {
							for (var i = 0; i < thistab.rows.length; i++) {
								if (thistab.rows[i].cells[0].firstChild.tagName === 'IMG') {
									if ((/Individuelles\sPortal/).test(thistab.rows[i].cells[1].firstChild.data)) {
										// IP
										var ipdummy = thistab.rows[i].cells[1].innerHTML;
										ipdummy = ipdummy.replace(/Individuelles\sPortal:\s*/, '');
										ipdummy = ipdummy.split(/<br>/);
										var sum = 0;
										var sclanname = new Array(1);
										var sclansum = new Array(1);
										sclanname[0] = 'clanlos';
										sclansum[0] = 0;
										for (var j = 0; j < ipdummy.length; j++) {
											if (ipdummy[j].length > 0) {
												sum++;
												var thisclan = ipdummy[j].match(/\[\S+\]/);
												if (!thisclan) {
													sclansum[0]++;
												} else {
													var hit = false;
													for (var k = 0; k < sclanname.length; k++) {
														if (sclanname[k] === thisclan[0]) {
															sclansum[k]++;
															hit = true;
															break;
														}
													}
													if (!hit) {
														sclanname.push(thisclan[0]);
														log(sclansum + ' ' + sclansum.length + ' ' + sclansum[0]);
														sclansum.push(1);
													}
												}
											}
										}

										var ipnodediv = mdoc.createElement('div');

										if (sclanname.length == 1) {
											ipnodediv.appendChild(mdoc.createTextNode(sum + ' IP'));
										} else if ((sclanname.length == 2) && (sclansum[0] == 0)) {
											ipnodediv.appendChild(mdoc.createTextNode(sum + ' IP von ' + sclanname[1]));
										} else {
											ipnodediv.appendChild(mdoc.createTextNode(sum + ' IP:'));
											for (var j = sclanname.length - 1; j > 0; j--) {
												ipnodediv.appendChild(mdoc.createElement('br'));
												ipnodediv.appendChild(mdoc.createTextNode(sclansum[j] + ' - ' + sclanname[j]));
											}
											if (sclansum[0] > 0) {
												ipnodediv.appendChild(mdoc.createElement('br'));
												ipnodediv.appendChild(mdoc.createTextNode(sclansum[0] + ' - ' + sclanname[0]));
											}
										}
									} else if ((/Clan\sPortal/).test(thistab.rows[i].cells[1].firstChild.data)) {
										// CP
										var cpnodediv = mdoc.createElement('div');
										while (thistab.rows[i].cells[1].firstChild) {
											cpnodediv.appendChild(thistab.rows[i].cells[1].firstChild);
										}
										cpnodediv.firstChild.data.replace(/Clan\sPortal:\s*/, 'CP: ');
										if (cpnodediv.lastChild.tagName === 'BR') {
											cpnodediv.removeChild(cpnodediv.lastChild);
										}
									} else if ((/npc\/w\/\d+\.gif$/).test(thistab.rows[i].cells[0].firstChild.src)) {
										// wormhole
										var wlnodediv = mdoc.createElement('div');
										while (thistab.rows[i].cells[1].firstChild) {
											// deactivate wormhole link
											if (thistab.rows[i].cells[1].firstChild.tagName === 'A') {
												thistab.rows[i].cells[1].firstChild.href = 'javascript:void(0)';
											}
											wlnodediv.appendChild(thistab.rows[i].cells[1].firstChild);
										}
										if (wlnodediv.lastChild.tagName === 'BR') {
											wlnodediv.removeChild(wlnodediv.lastChild);
										}
									}

								}
							}
						}

						thistab.parentNode.removeChild(thistab);
						continue;

					} else if (sinfos.firstChild.tagName === 'IMG') {

						if (((/\/r\d+\.gif$/).test(sinfos.firstChild.src))
							&& (sinfos.firstChild.nextSibling.nodeName === '#text')
							&& (!(/\(\S+\)/).test(sinfos.firstChild.nextSibling.data))) {
							if (!ressnodediv) {
								var ressnodediv = mdoc.createElement('div');
							}
							sinfos.firstChild.nextSibling.data += ' ';
							ressnodediv.appendChild(sinfos.firstChild);
							ressnodediv.appendChild(sinfos.firstChild);
							if (!(ressnodediv.childNodes.length % 6)) {
								ressnodediv.appendChild(mdoc.createElement('br'));
							}
							if (sinfos.firstChild.tagName === 'BR') {
								sinfos.removeChild(sinfos.firstChild);
							}
							continue;
						}
					}
				}

				md.appendChild(sinfos.firstChild);
			}

			while (md.lastChild.tagName === 'BR') {
				md.removeChild(md.lastChild);
			}

			if (settings._get('sectorInfoCompact')) {

				if (ressnodediv || ipnodediv || wlnodediv || cpnodediv) {
					md.appendChild(mdoc.createElement('br'));
					md.appendChild(mdoc.createElement('br'));

					if (ressnodediv) {
						md.appendChild(styleCompactNode(ressnodediv));
					}

					if (wlnodediv) {
						md.appendChild(styleCompactNode(wlnodediv));
					}

					if (cpnodediv) {
						md.appendChild(styleCompactNode(cpnodediv));
					}

					if (ipnodediv) {
						md.appendChild(styleCompactNode(ipnodediv));
					}
				}
			}

			if ((/\S+/).test(fleets.textContent)) {
				var fd = mdoc.createElement('div');
				fd.style.textAlign = 'center';
				fd.style.padding = '2px';
				fd.style.marginTop = '2px';
				fd.style.borderStyle = 'solid none none none';
				fd.style.borderWidth = '1px';
				fd.style.borderColor = 'rgb(65,66,86)';
				fd.style.whiteSpace = 'nowrap';
				fd.style.width = 'auto';
				fd.style.height = 'auto';
				fd.style.display = 'block';

				while (fleets.firstChild) {
					fd.appendChild(fleets.firstChild);
				}

				while (fd.firstChild.tagName === 'BR') {
					fd.removeChild(fd.firstChild);
				}

				while (fd.lastChild.tagName === 'BR') {
					fd.removeChild(fd.lastChild);
				}

				md.appendChild(fd);

			}
		}

		idc.body.parentNode.style.background = 'none';
		idc.body.parentNode.style.margin = '0px';
		idc.body.parentNode.style.padding = '0px';

		while (idc.body.firstChild) {
			idc.body.removeChild(idc.body.firstChild);
		}

		idc.body.appendChild(md);

		infoframe.style.display = '';
		infoframe.style.height = idc.body.firstChild.scrollHeight + 2 + 'px';
		infoframe.style.width = idc.body.firstChild.scrollWidth + 2 +'px';

		// positioning
		var ifpos = infoframe.getBoundingClientRect();
		var bdpos = mdoc.body.getBoundingClientRect();
		var bodytopoffset = bdpos.top - mdoc.body.parentNode.getBoundingClientRect().top;

		if (ifpos.height < (ifpos.top - 5)) {
			infoframe.style.top = ifpos.top - ifpos.height - 5 - bdpos.top + bodytopoffset + 'px';
		} else if ((ifpos.height / 2) < ifpos.top) {
			infoframe.style.top = ifpos.top - (ifpos.height / 2) - bdpos.top + bodytopoffset + 'px';
		} else if (ifpos.height > window.innerHeight){
			infoframe.style.top = '5px';
		} else {
			infoframe.style.top = ifpos.top + 5 - bdpos.top + bodytopoffset + 'px';
		}
		if (ifpos.width < (bdpos.right - ifpos.left)) {
			infoframe.style.left = ifpos.left + 5 + 'px';
		} else if (bdpos.width < ifpos.height){
			infoframe.style.left = '0px';
		} else {
			infoframe.style.left = ifpos.left - ifpos.width - 5 + 'px';
		}

		infoframe.style.visibility = 'visible';
		idc.body.addEventListener('dblclick', dblclickDestruct, false);

		if (PIN_SECTORINFOS) {
			md.title = TEXT_HINT_PINCLOSE;
		}

		return 0;
	}

	function makeFlightCircle(size, boundwidth, boundoffset, colourrgbarr)
	{
		var tstart = new Date().getTime();

		var canv = document.createElement('canvas');
		canv.height = size;
		canv.width = size;
		var ctx = canv.getContext('2d');

		var rin = size / 2 - boundoffset - boundwidth;
		var rout = size / 2 - boundoffset;

		var rgrad = ctx.createRadialGradient(size/2, size/2, rin, size/2, size/2, rout);
		rgrad.addColorStop(0, 'rgba(' + colourrgbarr[0] + ', '
			+ colourrgbarr[1] + ', '  + colourrgbarr[2] + ', 0)');
		rgrad.addColorStop(1, 'rgba(' + colourrgbarr[0] + ', '
			+ colourrgbarr[1] + ', '  + colourrgbarr[2] + ', 255)');

		ctx.fillStyle = rgrad;
		ctx.fillRect(0, 0, size, size);

		var tstep1 = new Date().getTime();
		log('[circle] done in ' + (tstep1 - tstart) + 'ms');

		return canv;
	}

	function fadeSin(eid, tid)
	{
		switch(tid) {
			case TID_STATUS: tid = status_timer; break;
			case TID_FUEL: tid = fuel_timer; break;
			case TID_INTERVAL: tid = interval_timer; break;
			default: return;
		}

		var elem = document.getElementById(eid);

		var steps = 20;
		var sins = new Array(steps);
		for (var i = 1;  i <= steps; i++) {
			sins[i-1] = Math.round(Math.cos(i / steps * 0.5 * 3.14) * 100) / 100;
		}

		var idx = steps - 1;
		var op = +elem.style.opacity;

		if (op === 1.0) {
			interval_timer = window.setInterval(fadeSin, settings._get('statusFadeInterval'), elem.id, TID_INTERVAL);
		}

		if (op <= sins[steps - 1]) {
			window.clearInterval(tid);
			op = 0;
		} else {
			while ((idx >= 0) && (op > sins[idx])) {
				idx--;
			}
			op = sins[idx+1];
		}

		elem.style.opacity = op;
	}

	function fancyGfx()
	{
		// new function rendering a single image and overwriting darkness
		// (with optional rendering a raster in between)
		// make filter override sections which are not relevant

		if (settings._get('viewImproveGfx')) {
			var fl = document.getElementById('flightarea');

			if (!fl) {
				return -1;
			}

			var flimg = fl.getElementsByTagName('IMG');

			var seclength = settings._get('viewSectionRadius') * 2 - 1;
			var sectors = seclength * seclength;
			var secwidth = flimg[0].width;

			// make canvas, paint sectors on it, filter, paint again
			var canv = document.createElement('canvas');
			canv.height = seclength * secwidth;
			canv.width = seclength * secwidth;
			var ctx = canv.getContext('2d');

			var sx = 0, sy = 0;

			for (var i = 0; i < sectors; i++) {
				ctx.drawImage(flimg[i], sx, sy, secwidth, secwidth);
				sx += secwidth;
				if (sx >= seclength * secwidth) {
					sx = 0;
					sy += secwidth;
				}
			}

			canv = filterImg(canv, chooseFilter(settings._get('viewImproveFilter')));
			// earlier reference just got lost
			ctx = canv.getContext('2d');

			sx = 0;
			sy = 0;

			for (var i = 0; i < sectors; i++) {
				if ((/n\.gif$/).test(flimg[i].src)) {
					ctx.fillStyle = 'rgb(24, 25, 46)';
					ctx.fillRect(sx, sy, secwidth, secwidth);
				} else if ((settings._get('viewImproveStarsOnly') && !(/\d{2,3}\.gif$/).test(flimg[i].src))) {
					ctx.drawImage(flimg[i], sx, sy, secwidth, secwidth);
				}
				sx += secwidth;
				if (sx >= seclength * secwidth) {
					sx = 0;
					sy += secwidth;
				}
			}

			while (fl.firstChild.tagName === 'IMG' || fl.firstChild.tagName === 'BR') {
				fl.removeChild(fl.firstChild);
			}

			fl.insertBefore(canv, fl.firstChild);

			/*
			for (var i = 0; i < fl.childNodes.length; i++) {
				if (!(/n\.gif$/).test(fl.childNodes[i].src)) {
					if (fl.childNodes[i].tagName === 'IMG' && !(settings._get('viewImproveStarsOnly'))
						|| (settings._get('viewImproveStarsOnly') && (/\d{2,3}\.gif$/).test(fl.childNodes[i].src))) {
						var old = fl.childNodes[i];
						old.parentNode.replaceChild(filterImg(old, chooseFilter(settings._get('viewImproveFilter'))), old);
					}
				}
			}
			*/
		}

		return 0;
	}

	function eliminateRxTagScript()
	{
		// prevents that unnecessary rx script checking every single
		// image for being a ressource type and adding title and alt
		// from being executed

		var scr = document.createElement('script');
		scr.typetype = 'text/javascript';
		scr.text = 'function rewrite_images(){}';
		document.body.appendChild(scr);
	}

	function loadCompletedHook()
	{
		var start = new Date().getTime();
		fancyGfx();
		var pc = window.mozPaintCount;
		log('lCHook done in ' + (new Date().getTime() - start) + ' ms! (repaint count: ' + pc + ')')
	}

	function deframe()
	{
		var nav = document.getElementsByName('rxqa');
		var flight = document.getElementsByName('rxqb');

		if (!(nav && flight)) {
			log(flight + ' ' + nav + ' not found');
			return;
		}

		nav = nav[0];
		flight = flight[0];

		var inav = document.createElement('iframe');
		var iflight = document.createElement('iframe');

		inav.src = nav.src;
		inav.name = 'rxqa';
		inav.id = 'inav';
		inav.style.border = 'none';
		inav.style.overflow = 'hidden';
		inav.style.display = 'inline-block';
		inav.style.width = 'auto';
		inav.addEventListener('load', autoresize, false);
		inav.style.position = 'absolute';
		inav.style.bottom = '0px';
		inav.style.width = 'auto';
		inav.style.left = '50%';
		inav.style.visibility = 'hidden';
		inav.style.zIndex = 100;

		iflight.src = flight.src;
		iflight.name = 'rxqb';
		iflight.id = 'iflight';
		iflight.style.border = 'none';
		iflight.style.width = '100%';
		iflight.style.height = '100%';
		iflight.style.display = 'block';

		var wrap = document.createElement('div');
		wrap.style.height = '100%';
		wrap.style.width = '100%';
		wrap.style.position = 'relative';
		wrap.style.display = 'block';
		wrap.style.overflow = 'hidden';

		wrap.appendChild(iflight);
		wrap.appendChild(inav);

		// since the original page has the html 4 frameset standard as doctype,
		// we need to regenerate the entire page
		var doctype = document.implementation.createDocumentType('HTML',
			'-//W3C//DTD HTML 4.01 Transitional//EN',
			'http://www.w3.org/TR/html4/loose.dtd');

		var ndoc = document.implementation.createHTMLDocument('Revorix: Weltraum');
		var nnode = document.importNode(ndoc.documentElement, true);
		document.removeChild(document.documentElement);
		document.appendChild(ndoc.documentElement);
		document.replaceChild(ndoc.doctype, document.doctype);

		document.body = document.createElement('body');
		document.body.appendChild(wrap);
		document.body.style.margin = '0px';
		document.body.style.height = '100%';

		document.documentElement.style.height = '100%';
	}

	function beautify()
	{
		var db = document.body;

		db.style.background = 'none';
		document.getElementById('fleet').style.boxShadow = '0 0 5px 5px #090C1D';
		document.getElementById('fleet').style.backgroundColor = '#090C1D';

		// delete those incredibly useless textnodes containing '\n'...
		for (var i = db.childNodes.length - 1; i >= 0; i--) {
			if (db.childNodes[i].nodeName === '#text') {
				db.removeChild(db.childNodes[i]);
			}
		}

		// clear some more useless stuff at the beginning

		while ((db.firstChild.tagName === 'IMG') || (db.firstChild.tagName === 'BR')) {
			db.removeChild(db.firstChild);
		}

		// the content is placed at absolute positions without any specified paddings or margins
		// yet a margin seemed to be needed - which we now remove again
		document.body.style.position = 'relative';
		document.body.style.marginLeft = '-19px';
		// ex background img width + left - margin
		document.body.style.width = 605 + 203 - 19 + 'px';

	}

	function autoresize()
	{
		this.style.width = this.contentDocument.body.scrollWidth + 'px';
		this.style.marginLeft = -this.contentDocument.body.scrollWidth / 2 + 'px';
		this.style.visibility = 'visible';
	}

	function init_houston()
	{
		// make insert iframe @ sec-info, loads stripped fleet infos on request
		// W: x M ; A: x M ; L: x/X ; R: x/X

		logScriptInfo();
		var start = new Date().getTime();
		var pc = window.mozPaintCount;
		//log(document.URL);
		//log(document.referrer);

		if ((/\/map\S*\.php/).test(document.URL)) {
			loadSettings();
			if ((/#strip$/).test(document.URL)) {
				stripPage();
			} else {
				if (settings._get('bodyRemoveTopMargin')) {
					document.documentElement.style.paddingTop = '5px';
				}
				document.documentElement.style.paddingBottom = NAVBAR_HEIGHT + 5 + 'px';
			}
		}

		if ((/map\.php\S*fid\=\d+(?:.dir\=[a-z]{1,2})?$/).test(document.URL)) {
			loadSettings();
			eliminateRxTagScript();
			window.addEventListener('load', loadCompletedHook, true);
			shift_layout();
		}

		if ((/\/rx\.php\?set\=4/).test(document.URL)) {
			deframe();
		}

		if ((/\/rx\.php\?set\=5/).test(document.URL)) {
			beautify();
		}

		if ((/setup\.php$/).test(document.URL)) {
			insertSettings();
		}

		log('main done in ' + (new Date().getTime() - start) + ' ms! (repaint count: ' + pc + ')')

		return 0;
	}

	function log(str)
	{
		if (DEBUG_VERBOSE) {
			console.log('rxnewmaps: ' + str);
		}
	}

	function logScriptInfo()
	{
		if (typeof(GM_info) !== 'undefined') {
			console.log(
				GM_info.script.name
				+ ' v' + GM_info.script.version
				+ ' (will ' + (GM_info.scriptWillUpdate ? '' : 'NOT ')
				+ 'auto-update)'
			);
		}
	}

	init_houston();

})();
