// ==UserScript==
// @name          Revorix-Schiffs-Sortierung
// @namespace     http://toasten.de/
// @author        toasten
// @description	  Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de - Es bietet Komfort indem es eine Sortierung der Schiffs-Listen zur Verfügung stellt.
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/sortierung/revorix.sortierung.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/sortierung/revorix.sortierung.user.js
// @version       2.0.0

// @include https://game.revorix.de/*/schiff_list*
// @include https://game.revorix.de/*/schiff_fi*
// @exclude https://game.revorix.de/*/map_fspalt*
// @include https://game.revorix.de/*/map_rueck*
// @include https://game.revorix.de/*/schiff_flotten*
// @include https://game.revorix.de/*/capt_all*
// @include https://game.revorix.de/*/clan_main*

// ==/UserScript==


/*
* Sortier-Script 1.8 fuer Opera 9/10, Firefox Greasemonkey und Chrome 4+
*
* Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de
* Es bietet Komfort in dem es eine Sortierung zur Verfügung stellt.
*
* made by
* toasten
*/


var isOpera = "Opera" == navigator.appName;
var prefix = 'rxhelper.sortierung.';

function padWithZeroes(number, length) {
  let str = "" + number;
  while (str.length < length) {
      str = "0" + str;
  }
  return str;
}

function init(){


	//GM_setValue("schiff_list","5");


	var elemente = document.getElementsByTagName("table");
	var table = null;
	var createHeadLine = false;

  	if(location.href.indexOf('schiff_list') > -1){
		table = elemente[2];
	} else if(location.href.indexOf('schiff_fi') > -1){
		table = elemente[1];
	} else if(location.href.indexOf('map_fspalt') > -1){
		table = elemente[0];
	} else if(location.href.indexOf('map_rueck') > -1){
		table = elemente[0];
	} else if(location.href.indexOf('schiff_flotten') > -1){
		table = elemente[1];
		//Keine Flotte --> keine Sortierung anwenden, sonst Fehler in der Darstellung
		if(table.rows.length == 1)
		{
			table = null;
		}
	} else if(location.href.indexOf('capt_all') > -1){
		table = elemente[1];
	} else if(location.href.indexOf('clan_main') > -1){
		if(elemente.length>2)
		{
			table = elemente[elemente.length-1];
			createHeadLine = true;
		}
	}


  	if(table != null)
  	{

  		//table.createTHead();
		the = document.createElement('thead');

  		if(createHeadLine){
  			var tr = document.createElement('tr');
  			var td = document.createElement('td');
  			td.colSpan = 4;
  			td.innerHTML = "&nbsp;";
  			//td.appendChild(document.createTextNode('&nbsp;'));
  			tr.appendChild(td);
  			table.insertBefore(tr,table.firstChild);

  			var header_col = tr;
			var header_cell = td;
  		}
  		else
  		{
  			var header_col = table.rows[0];
			var header_cell = header_col.cells[0];
  		}
		//var preHTML = header_cell.innerHTML;

		//alert(header_cell.childNodes[0]);

		var title_div = document.createElement("div");
		title_div.style.cssFloat = 'left';

		title_div.appendChild(header_cell.childNodes[0]);
		//header_cell.innerHTML = "<div style='float: left;'>"+preHTML+"</div> <div  style='float: right;'><a href='javascript:alert(\"isOpera:\"+isOpera);'>Delete Cache (Reload neccessary)</a></div>";
		header_cell.appendChild(title_div);


		var clear_div = document.createElement("div");
		clear_div.style.cssFloat = 'right';
		var clear_link = document.createElement("a");
		clear_link.href = '#';
		clear_link.style.color = '#00dd00';
		clear_link.addEventListener('click', clearSortValues, false);
		clear_link.appendChild(document.createTextNode('Vorsortierung löschen'));
		clear_div.appendChild(clear_link);
		header_cell.appendChild(clear_div);


		the.appendChild(header_col);
		//save column-count from 2nd header-row (first row is title)
		var columns = table.rows[0].cells.length;
		the.appendChild(table.rows[0]);
		table.insertBefore(the,table.firstChild);

		//table.className="nfo sortable";
		css.addClassToElement(table, 'sortable');


		//Footer
		thf = document.createElement('tfoot');
		if(location.href.indexOf('map_ftank') > -1){
			thf.appendChild(table.rows[table.rows.length-1]);
		} else if(location.href.indexOf('map_rueck') > -1){
			thf = document.createElement('tfoot');
			thf.appendChild(table.rows[table.rows.length-2]);
			thf.appendChild(table.rows[table.rows.length-1]);
		}

		table.appendChild(thf,table.tBodies);


		standardistaTableSortingInit();
	}
}








function clearSortValues() {
	var akt_page = null;
	for(page in sort_colums)
	{
		if(location.href.indexOf(page) > -1)
		{
			akt_page = page;
		}
	}

  op_GM_deleteValue(akt_page);
  op_GM_deleteValue(akt_page+"SortOrder");

	alert("Vorauswahl wurde gelöscht. Bitte Seite neu laden.");
}













/// ################################################################################

// Original Files included

/// ################################################################################










/**
 * Written by Neil Crosby.
 * http://www.workingwith.me.uk/articles/scripting/standardista_table_sorting
 *
 * This module is based on Stuart Langridge's "sorttable" code.  Specifically,
 * the determineSortFunction, sortCaseInsensitive, sortDate, sortNumeric, and
 * sortCurrency functions are heavily based on his code.  This module would not
 * have been possible without Stuart's earlier outstanding work.
 *
 * Use this wherever you want, but please keep this comment at the top of this file.
 *
 * Copyright (c) 2006 Neil Crosby
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
var standardistaTableSorting = {

	that: false,
	isOdd: false,

	sortColumnIndex : -1,
	lastAssignedId : 0,
	newRows: -1,
	lastSortedTable: -1,

	/**
	 * Initialises the Standardista Table Sorting module
	 **/
	init : function() {
		// first, check whether this web browser is capable of running this script
		if (!document.getElementsByTagName) {
			return;
		}

		this.that = this;

		this.run();

	},

	/**
	 * Runs over each table in the document, making it sortable if it has a class
	 * assigned named "sortable" and an id assigned.
	 **/
	run : function() {
		var tables = document.getElementsByTagName("table");

		for (var i=0; i < tables.length; i++) {
			var thisTable = tables[i];

			if (css.elementHasClass(thisTable, 'sortable')) {
				this.makeSortable(thisTable);
			}
		}
	},

	/**
	 * Makes the given table sortable.
	 **/
	makeSortable : function(table) {

		// first, check if the table has an id.  if it doesn't, give it one
		if (!table.id) {
			table.id = 'sortableTable'+this.lastAssignedId++;
		}

		// if this table does not have a thead, we don't want to know about it
		if (!table.tHead || !table.tHead.rows || 0 == table.tHead.rows.length) {
			return;
		}

		// we'll assume that the last row of headings in the thead is the row that
		// wants to become clickable
		var row = table.tHead.rows[table.tHead.rows.length - 1];

		var akt_page = null;
		for(page in sort_colums)
		{
			if(location.href.indexOf(page) > -1)
			{
				akt_page = page;
			}
    	}

		var preSort = this.getSortValue(akt_page);
		var preSortOrder = this.getSortValue(akt_page+"SortOrder");
		var elementToPresort = null;

		for (var i=0; i < row.cells.length; i++) {

			if(sort_colums[akt_page][i])
			{
				// create a link with an onClick event which will
				// control the sorting of the table
				var linkEl = createElement('a');

				linkEl.href = '#';
        linkEl.style.color = 'rgba(255,255,255,1.0)';
				//Workaround/Bugfix
				//linkEl.onclick = this.headingClicked;
				linkEl.addEventListener('click', this.headingClicked, false);
				linkEl.setAttribute('columnId', i);
				linkEl.title = 'Click to sort';

				if(preSort == i)
				{
					elementToPresort = linkEl;
				}

				// move the current contents of the cell that we're
				// hyperlinking into the hyperlink
				var innerEls = row.cells[i].childNodes;
				for (var j = 0; j < innerEls.length; j++) {
					linkEl.appendChild(innerEls[j]);
				}

				// and finally add the new link back into the cell
				row.cells[i].appendChild(linkEl);

				var spanEl = createElement('span');
				spanEl.className = 'tableSortArrow';
				spanEl.appendChild(document.createTextNode('\u00A0\u00A0'));
				row.cells[i].appendChild(spanEl);
			}

		}

		if (css.elementHasClass(table, 'autostripe')) {
			this.isOdd = false;
			var rows = table.tBodies[0].rows;

			// We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
			for (var i=0;i<rows.length;i++) {
				this.doStripe(rows[i]);
			}
		}

		if(elementToPresort != null)
		{
			//Would work in IE
			//elementToPresort.fireEvent("onclick");

			//Would not work in IE
			var evObj = document.createEvent('MouseEvents');
			evObj.initEvent( "click", true, false );
			elementToPresort.dispatchEvent(evObj);

	  		//Just double-sort
	  		if(preSortOrder == "ASC")
	  		{
	  			var evObj = document.createEvent('MouseEvents');
				evObj.initEvent( "click", true, false );
	  			elementToPresort.dispatchEvent(evObj);
	  		}
		}
	},


	getSortValue: function(key) {
			const val =  localStorage.getItem(prefix+key);
      return isNaN(val) ? val : parseInt(val);
	},


	setSortValue: function(key, value) {
			return localStorage.setItem(prefix+key, value);
	},


	headingClicked: function(e) {
		var that = standardistaTableSorting.that;

		// linkEl is the hyperlink that was clicked on which caused
		// this method to be called
		var linkEl = getEventTarget(e);

		// directly outside it is a td, tr, thead and table
		var td     = linkEl.parentNode;
		var tr     = td.parentNode;
		var thead  = tr.parentNode;
		var table  = thead.parentNode;

		// if the table we're looking at doesn't have any rows
		// (or only has one) then there's no point trying to sort it
		if (!table.tBodies || table.tBodies[0].rows.length <= 1) {
			return false;
		}

		// the column we want is indicated by td.cellIndex
		var column = linkEl.getAttribute('columnId') || td.cellIndex;
		//var column = td.cellIndex;

		// find out what the current sort order of this column is
		var arrows = css.getElementsByClass(td, 'tableSortArrow', 'span');
		var previousSortOrder = '';
		if (arrows.length > 0) {
			previousSortOrder = arrows[0].getAttribute('sortOrder');
		}

		// work out how we want to sort this column using the data in the first cell
		// but just getting the first cell is no good if it contains no data
		// so if the first cell just contains white space then we need to track
		// down until we find a cell which does contain some actual data
		var itm = ''
		var rowNum = 0;
		while ('' == itm && rowNum < table.tBodies[0].rows.length) {
			itm = that.getInnerText(table.tBodies[0].rows[rowNum].cells[column]);
			rowNum++;
		}


		var sortfn = null;
    	//for(var page = 0; page < sort_colums.length; page++)
    	for(page in sort_colums)
    	{
    		if(location.href.indexOf(page) > -1)
    		{
    			sortfn = sort_colums[page][column];
				that.setSortValue(page,column);
				if(previousSortOrder == "ASC")
				{
					that.setSortValue(page+"SortOrder","ASC");
				}
				else
				{
					that.setSortValue(page+"SortOrder","DESC");
				}
    		}
    	}


    	if(sortfn == null)
    	{
			//sortfn = that.determineSortFunction(itm);
			return;
		}



		// if the last column that was sorted was this one, then all we need to
		// do is reverse the sorting on this column
		if (table.id == that.lastSortedTable && column == that.sortColumnIndex) {
			newRows = that.newRows;
			newRows.reverse();
		// otherwise, we have to do the full sort
		} else {
			that.sortColumnIndex = column;
			var newRows = new Array();

			for (var j = 0; j < table.tBodies[0].rows.length; j++) {
				newRows[j] = table.tBodies[0].rows[j];
			}

			newRows.sort(sortfn);
		}

		that.moveRows(table, newRows);
		that.newRows = newRows;
		that.lastSortedTable = table.id;

		// now, give the user some feedback about which way the column is sorted

		// first, get rid of any arrows in any heading cells
		var arrows = css.getElementsByClass(tr, 'tableSortArrow', 'span');
		for (var j = 0; j < arrows.length; j++) {
			var arrowParent = arrows[j].parentNode;
			arrowParent.removeChild(arrows[j]);

			if (arrowParent != td) {
				spanEl = createElement('span');
				spanEl.className = 'tableSortArrow';
				spanEl.appendChild(document.createTextNode('\u00A0\u00A0'));
				arrowParent.appendChild(spanEl);
			}
		}

		// now, add back in some feedback
		var spanEl = createElement('span');
		spanEl.className = 'tableSortArrow';
		if (null == previousSortOrder || '' == previousSortOrder || 'DESC' == previousSortOrder) {
			spanEl.appendChild(document.createTextNode(' \u2191'));
			spanEl.setAttribute('sortOrder', 'ASC');
		} else {
			spanEl.appendChild(document.createTextNode(' \u2193'));
			spanEl.setAttribute('sortOrder', 'DESC');
		}
		spanEl.style.fontSize = "11px";

		td.appendChild(spanEl);

		return false;
	},

	getInnerText : function(el) {

		if ('string' == typeof el || 'undefined' == typeof el) {
			return el;
		}

		if(document.all){
			if (el.innerText) {
				return el.innerText;  // Not needed but it is faster
			}
		} else{
			if (el.textContent) {
				return el.textContent;  // Not needed but it is faster
			}
		}

		var str = el.getAttribute('standardistaTableSortingInnerText');
		if (null != str && '' != str) {
			return str;
		}
		str = '';

		var cs = el.childNodes;
		var l = cs.length;
		for (var i = 0; i < l; i++) {
			// 'if' is considerably quicker than a 'switch' statement,
			// in Internet Explorer which translates up to a good time
			// reduction since this is a very often called recursive function
			if (1 == cs[i].nodeType) { // ELEMENT NODE
				str += this.getInnerText(cs[i]);
				break;
			} else if (3 == cs[i].nodeType) { //TEXT_NODE
				str += cs[i].nodeValue;
				break;
			}
		}

		// set the innertext for this element directly on the element
		// so that it can be retrieved early next time the innertext
		// is requested
		el.setAttribute('standardistaTableSortingInnerText', str);

		return str;
	},

	determineSortFunction : function(itm) {

		var sortfn = this.sortCaseInsensitive;

		if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d\d\d$/)) {
			sortfn = this.sortDate;
		}
		if (itm.match(/^\d\d[\/-]\d\d[\/-]\d\d$/)) {
			sortfn = this.sortDate;
		}
		if (itm.match(/^[£$]/)) {
			sortfn = this.sortCurrency;
		}
		if (itm.match(/^\d?\.?\d+$/)) {
			sortfn = this.sortNumeric;
		}
		if (itm.match(/^[+-]?\d*\.?\d+([eE]-?\d+)?$/)) {
			sortfn = this.sortNumeric;
		}
    		if (itm.match(/^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])$/)) {
        		sortfn = this.sortIP;
   		}

		return sortfn;
	},

	sortCaseInsensitive : function(a, b) {
		var that = standardistaTableSorting.that;

		var aa = that.getInnerText(a.cells.item(that.sortColumnIndex)).toLowerCase();
		var bb = that.getInnerText(b.cells.item(that.sortColumnIndex)).toLowerCase();
		if (aa==bb) {
			return 0;
		} else if (aa<bb) {
			return -1;
		} else {
			return 1;
		}
	},

	sortDate : function(a,b) {
		var that = standardistaTableSorting.that;

		// y2k notes: two digit years less than 50 are treated as 20XX, greater than 50 are treated as 19XX
		var aa = that.getInnerText(a.cells.item(that.sortColumnIndex));
		var bb = that.getInnerText(b.cells.item(that.sortColumnIndex));

		var dt1, dt2, yr = -1;

		if (aa.length == 10) {
			dt1 = aa.substr(6,4)+aa.substr(3,2)+aa.substr(0,2);
		} else {
			yr = aa.substr(6,2);
			if (parseInt(yr) < 50) {
				yr = '20'+yr;
			} else {
				yr = '19'+yr;
			}
			dt1 = yr+aa.substr(3,2)+aa.substr(0,2);
		}

		if (bb.length == 10) {
			dt2 = bb.substr(6,4)+bb.substr(3,2)+bb.substr(0,2);
		} else {
			yr = bb.substr(6,2);
			if (parseInt(yr) < 50) {
				yr = '20'+yr;
			} else {
				yr = '19'+yr;
			}
			dt2 = yr+bb.substr(3,2)+bb.substr(0,2);
		}

		if (dt1==dt2) {
			return 0;
		} else if (dt1<dt2) {
			return -1;
		}
		return 1;
	},

	sortCurrency : function(a,b) {
		var that = standardistaTableSorting.that;

		var aa = that.getInnerText(a.cells.item(that.sortColumnIndex)).replace(/[^0-9.]/g,'');
		var bb = that.getInnerText(b.cells.item(that.sortColumnIndex)).replace(/[^0-9.]/g,'');
		return parseFloat(aa) - parseFloat(bb);
	},

	sortNumeric : function(a,b) {
		var that = standardistaTableSorting.that;

		var aa = parseFloat(that.getInnerText(a.cells.item(that.sortColumnIndex)));
		if (isNaN(aa)) {
			aa = 0;
		}
		var bb = parseFloat(that.getInnerText(b.cells.item(that.sortColumnIndex)));
		if (isNaN(bb)) {
			bb = 0;
		}
		return aa-bb;
	},

	makeStandardIPAddress : function(val) {
		var vals = val.split('.');

		for (x in vals) {
			val = vals[x];

			while (3 > val.length) {
				val = '0'+val;
			}
			vals[x] = val;
		}

		val = vals.join('.');

		return val;
	},

	sortIP : function(a,b) {
		var that = standardistaTableSorting.that;

		var aa = that.makeStandardIPAddress(that.getInnerText(a.cells.item(that.sortColumnIndex)).toLowerCase());
		var bb = that.makeStandardIPAddress(that.getInnerText(b.cells.item(that.sortColumnIndex)).toLowerCase());
		if (aa==bb) {
			return 0;
		} else if (aa<bb) {
			return -1;
		} else {
			return 1;
		}
	},




	sort_type: function(a,b) {
		var that = standardistaTableSorting.that;
		aval = standardistaTableSorting.getShipType(that.getInnerText(a.cells.item(that.sortColumnIndex))).toLowerCase();
		bval = standardistaTableSorting.getShipType(that.getInnerText(a.cells.item(that.sortColumnIndex))).toLowerCase();
		if (aval==bval) return 0;
		if (aval<bval) return -1;
		return 1;
	},
	sort_rank: function(a,b) {
    var that = standardistaTableSorting.that;
		  //alert("x"+aval+" -- "+bval);
    let aval = standardistaTableSorting.getCaptainRank(that.getInnerText(a.cells.item(that.sortColumnIndex))).toLowerCase();
    let bval = standardistaTableSorting.getCaptainRank(that.getInnerText(b.cells.item(that.sortColumnIndex))).toLowerCase();
		if (aval==bval) return 0;
		if (aval<bval) return -1;
		return -1;
	},
	sort_xp: function(a,b) {
			var that = standardistaTableSorting.that;
			aval = parseFloat(standardistaTableSorting.getXP(that.getInnerText(a.cells.item(that.sortColumnIndex))));
			bval = parseFloat(standardistaTableSorting.getXP(that.getInnerText(b.cells.item(that.sortColumnIndex))));
			  //alert("x"+aval+" -- "+bval);
			if (isNaN(aval)) {
				aval = 0;
			}
			if (isNaN(bval)) {
				bval = 0;
			}
			if (aval==bval) return 0;
			if (aval<bval) return -1;
			return 1;
	},
	sort_percentage_bar: function(a,b) {
			var that = standardistaTableSorting.that;
			aval = parseFloat(standardistaTableSorting.getPercentage(that.getInnerText(a.cells.item(that.sortColumnIndex))));
			bval = parseFloat(standardistaTableSorting.getPercentage(that.getInnerText(b.cells.item(that.sortColumnIndex))));
			  //alert("x"+aval+" -- "+bval);
			if (isNaN(aval)) {
				aval = 0;
			}
			if (isNaN(bval)) {
				bval = 0;
			}
			if (aval==bval) return 0;
			if (aval<bval) return -1;
			return 1;
	},
	sort_load_time: function(a,b) {
			var that = standardistaTableSorting.that;
			aval = standardistaTableSorting.getLoadTime(that.getInnerText(a.cells.item(that.sortColumnIndex)));
			bval = standardistaTableSorting.getLoadTime(that.getInnerText(b.cells.item(that.sortColumnIndex)));
			  //alert("x"+aval+" -- "+bval);
			if (isNaN(aval)) {
				aval = 0;
			}
			if (isNaN(bval)) {
				bval = 0;
			}
			if (aval==bval) return 0;
			if (aval<bval) return -1;
			return 1;
	},



	getShipType: function(text){
    if(text.trim() === '-') return '100zzz';
    const [ shiptype, type, name ] = text.trim().toLowerCase().split(' ');
		return padWithZeroes(shipTypes.reverse().indexOf(shiptype),3)+name;
	},

	getCaptainRank: function(text){
    const [ rank, firstname, lastname ] = text.trim().toLowerCase().split(' ');
		return padWithZeroes(cptRanks.reverse().indexOf(rank),3)+lastname;
	},

	getXP: function(text){
			splitted = text.split("/");
			xp = splitted[splitted.length-1];
			return xp;
	},

	getPercentage: function(text){
			//Version1 - Direkt nach Prozent-Werten
			//splitted = text.split("%");
			//perc = splitted[0];
			//return perc;
			//Version2 - Nach absoluten Werten
			var erg = text.match(/.*% ([0-9]*).*/);
			return RegExp.$1;
	},

	getLoadTime: function(text){
		var val = "-2";
			if(text == "-")
			{
				//Schiff im Hangar
				val = -1;
			}
			else if(text == "Rückführen")
			{
				val = 0;
			}
			else if(text.match(/.* ([0-9][0-9]) Min.$/))
			{
				//lädt: 20 Min.
				val = parseFloat(RegExp.$1);
			}
			else if(text.match(/.* ([0-9]*):([0-9][0-9]):([0-9][0-9])$/))
			{
				// lädt: 20:28:00  oder  lädt: 3:27:00
				val = (parseFloat(RegExp.$1)*60) + parseFloat(RegExp.$2);
			}

			return val;//RegExp.$1;
	},


	moveRows : function(table, newRows) {
		this.isOdd = false;

		// We appendChild rows that already exist to the tbody, so it moves them rather than creating new ones
		for (var i=0;i<newRows.length;i++) {
			var rowItem = newRows[i];

			this.doStripe(rowItem);

			table.tBodies[0].appendChild(rowItem);
		}
	},

	doStripe : function(rowItem) {
		if (this.isOdd) {
			css.addClassToElement(rowItem, 'odd');
		} else {
			css.removeClassFromElement(rowItem, 'odd');
		}

		this.isOdd = !this.isOdd;
	},

}

function standardistaTableSortingInit() {
	standardistaTableSorting.init();
}

//addEvent(window, 'load', standardistaTableSortingInit)




/**************************
*                         *
*  SOME INCLUDED SCRIPTS  *
*                         *
**************************/





/**
 * addEvent written by Dean Edwards, 2005
 * with input from Tino Zijdel
 *
 * http://dean.edwards.name/weblog/2005/10/add-event/
 **/
function addEvent(element, type, handler) {
	// assign each event handler a unique ID
	if (!handler.$$guid) handler.$$guid = addEvent.guid++;
	// create a hash table of event types for the element
	if (!element.events) element.events = {};
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		// store the existing event handler (if there is one)
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// store the event handler in the hash table
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	element["on" + type] = handleEvent;
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
	// delete the event handler from the hash table
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
};

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(window.event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

// end from Dean Edwards


/**
 * Creates an Element for insertion into the DOM tree.
 * From http://simon.incutio.com/archive/2003/06/15/javascriptWithXML
 *
 * @param element the element type to be created.
 *				e.g. ul (no angle brackets)
 **/
function createElement(element) {
	if (typeof document.createElementNS != 'undefined') {
		return document.createElementNS('http://www.w3.org/1999/xhtml', element);
	}
	if (typeof document.createElement != 'undefined') {
		return document.createElement(element);
	}
	return false;
}

/**
 * "targ" is the element which caused this function to be called
 * from http://www.quirksmode.org/js/events_properties.html
 **/
function getEventTarget(e) {
	var targ;
	if (!e) {
		e = window.event;
	}
	if (e.target) {
		targ = e.target;
	} else if (e.srcElement) {
		targ = e.srcElement;
	}
	if (targ.nodeType == 3) { // defeat Safari bug
		targ = targ.parentNode;
	}

	return targ;
}














/**
 * Written by Neil Crosby.
 * http://www.workingwith.me.uk/
 *
 * Use this wherever you want, but please keep this comment at the top of this file.
 *
 * Copyright (c) 2006 Neil Crosby
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
var css = {
	/**
	 * Returns an array containing references to all elements
	 * of a given tag type within a certain node which have a given class
	 *
	 * @param node		the node to start from
	 *					(e.g. document,
	 *						  getElementById('whateverStartpointYouWant')
	 *					)
	 * @param searchClass the class we're wanting
	 *					(e.g. 'some_class')
	 * @param tag		 the tag that the found elements are allowed to be
	 *					(e.g. '*', 'div', 'li')
	 **/
	getElementsByClass : function(node, searchClass, tag) {
		var classElements = new Array();
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");


		for (var i = 0, j = 0; i < elsLen; i++) {
			if (this.elementHasClass(els[i], searchClass) ) {
				classElements[j] = els[i];
				j++;
			}
		}
		return classElements;
	},


	/**
	 * PRIVATE.  Returns an array containing all the classes applied to this
	 * element.
	 *
	 * Used internally by elementHasClass(), addClassToElement() and
	 * removeClassFromElement().
	 **/
	privateGetClassArray: function(el) {
		return el.className.split(' ');
	},

	/**
	 * PRIVATE.  Creates a string from an array of class names which can be used
	 * by the className function.
	 *
	 * Used internally by addClassToElement().
	 **/
	privateCreateClassString: function(classArray) {
		return classArray.join(' ');
	},

	/**
	 * Returns true if the given element has been assigned the given class.
	 **/
	elementHasClass: function(el, classString) {
		if (!el) {
			return false;
		}

		var regex = new RegExp('\\b'+classString+'\\b');
		if (el.className.match(regex)) {
			return true;
		}

		return false;
	},

	/**
	 * Adds classString to the classes assigned to the element with id equal to
	 * idString.
	 **/
	addClassToId: function(idString, classString) {
		this.addClassToElement(document.getElementById(idString), classString);
	},

	/**
	 * Adds classString to the classes assigned to the given element.
	 * If the element already has the class which was to be added, then
	 * it is not added again.
	 **/
	addClassToElement: function(el, classString) {
		var classArray = this.privateGetClassArray(el);

		if (this.elementHasClass(el, classString)) {
			return; // already has element so don't need to add it
		}

		classArray.push(classString);

		el.className = this.privateCreateClassString(classArray);
	},

	/**
	 * Removes the given classString from the list of classes assigned to the
	 * element with id equal to idString
	 **/
	removeClassFromId: function(idString, classString) {
		this.removeClassFromElement(document.getElementById(idString), classString);
	},

	/**
	 * Removes the given classString from the list of classes assigned to the
	 * given element.  If the element has the same class assigned to it twice,
	 * then only the first instance of that class is removed.
	 **/
	removeClassFromElement: function(el, classString) {
		var classArray = this.privateGetClassArray(el);

		for (x in classArray) {
			if (classString == classArray[x]) {
				classArray[x] = '';
				break;
			}
		}

		el.className = this.privateCreateClassString(classArray);
	}
}






/****
/ ==UserScript==
/ @name Emulate Greasemonkey functions
/ @author TarquinWJ
/ @namespace http://www.howtocreate.co.uk/
/ @version 1.1.1
/ @description  Attempts to replicate the Greasemonkey functions in
/			Opera.
/ @ujs:category browser: enhancements
/ @ujs:published 2005-05-30 23:16
/ @ujs:modified 2005-10-27 12:57
/ @ujs:documentation http://userjs.org/scripts/browser/enhancements/aa-gm-functions
/ @ujs:download http://userjs.org/scripts/download/browser/enhancements/aa-gm-functions.js
/ ==/UserScript==
***/

function op_GM_deleteValue( oKey ) {
	//yes, they didn't seem to provide a way to delete variables in Greasemonkey, and the user must use about:config to
	//delete them - so the stored variables will pile up forever ...
	localStorage.removeItem(prefix+oKey);
}

var op_GM_falsifiedMenuCom = [], hasPageGMloaded = false;
window.addEventListener('load',function () {hasPageGMloaded=true;op_doGMMeenoo();},false)

function GM_registerMenuCommand( oText, oFunc ) {
	GM_falsifiedMenuCom[GM_falsifiedMenuCom.length] = [oText,oFunc];
	if( hasPageGMloaded ) { op_doGMMeenoo(); } //if the page has already loaded, do it now
}

function op_doGMMeenoo() {
	if( !op_GM_falsifiedMenuCom.length ) { return; }
	//create a menu of commands in the top corner
	var foo = document.getElementById('GM_Falsify_me'), bar;
	if( foo ) { document.body.removeChild(foo); }
	foo = document.createElement('GMmenoo');
	foo.id = 'GM_Falsify_me';
	document.body.appendChild(foo);
	with( foo.style ) {
		border = '1px solid #000';
		backgroundColor = '#bbf';
		color = '#000';
		position = 'fixed';
		zIndex = '100000';
		top = '0px';
		right = '0px';
		padding = '2px';
		overflow = 'hidden';
		height = '1.3em';
	}
	foo.appendChild(bar = document.createElement('b'))
	bar.style.cursor = 'move';
	bar.onclick = function () {
		this.parentNode.style.left = this.parentNode.style.left ? '' : '0px';
		this.parentNode.style.right = this.parentNode.style.right ? '' : '0px';
	};
	bar.appendChild(document.createTextNode('User Script Commands'));
	foo.appendChild(bar = document.createElement('ul'));
	bar.style.margin = '0px';
	bar.style.padding = '0px';
	bar.style.listStylePosition = 'inside';
	for( var i = 0; GM_falsifiedMenuCom[i]; i++ ) {
		var baz = document.createElement('li'), bing;
		baz.appendChild(bing = document.createElement('a'));
		bing.setAttribute('href','#');
		bing.onclick = new Function('GM_falsifiedMenuCom['+i+'][1](arguments[0]);return false;');
		bing.onfocus = function () { this.parentNode.style.height = ''; };
		bing.onblur = function () { this.parentNode.style.height = '1.3em'; };
		bing.appendChild(document.createTextNode(GM_falsifiedMenuCom[i][0]));
		bar.appendChild(baz);
	}
	foo.onmouseover = function () { this.style.height = ''; };
	foo.onmouseout = function () { this.style.height = '1.3em'; };
}

//yes, I know the limitations, but it's better than an outright error
//GM_xmlhttpRequest = XMLHttpRequest;

//GM_log = opera.postError;

//window._content = window;

function op_getRecoverableString(oVar,notFirst) {
	var oType = typeof(oVar);
	if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
		//most browsers say that the typeof for null is 'object', but unlike a real
		//object, it will not have any overall value
		return 'null';
	}
	if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
	if( oType == 'object' ) {
		//Safari throws errors when comparing non-objects with window/document/etc
		if( oVar == window ) { return 'window'; }
		if( oVar == document ) { return 'document'; }
		if( oVar == document.body ) { return 'document.body'; }
		if( oVar == document.documentElement ) { return 'document.documentElement'; }
	}
	if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
	if( !notFirst ) {
		Object.prototype.toRecoverableString = function (oBn) {
			if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
			this.tempLockIgnoreMe = true;
			var retVal = '{', sepChar = '', j;
			for( var i in this ) {
				if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
				if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
				j = this[i];
				if( !i.match(basicObPropNameValStr) ) {
					//for some reason, you cannot use unescape when defining peoperty names inline
					for( var x = 0; x < cleanStrFromAr.length; x++ ) {
						i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
					}
					i = '\''+i+'\'';
				} else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+$/) ) {
					//IE mac does not allow numerical property names to be used unless they are quoted
					i = '\''+i+'\'';
				}
				retVal += sepChar+i+':'+op_getRecoverableString(j,true);
				sepChar = ',';
			}
			retVal += '}';
			this.tempLockIgnoreMe = false;
			return retVal;
		};
		Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
		Array.prototype.toRecoverableString = function () {
			if( this.tempLock ) { return '[\'LoopBack\']'; }
			if( !this.length ) {
				var oCountProp = 0;
				for( var i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
				if( oCountProp ) { return this.toRecoverableObString(true); }
			}
			this.tempLock = true;
			var retVal = '[';
			for( var i = 0; i < this.length; i++ ) {
				retVal += (i?',':'')+op_getRecoverableString(this[i],true);
			}
			retVal += ']';
			delete this.tempLock;
			return retVal;
		};
		Boolean.prototype.toRecoverableString = function () {
			return ''+this+'';
		};
		Date.prototype.toRecoverableString = function () {
			return 'new Date('+this.getTime()+')';
		};
		Function.prototype.toRecoverableString = function () {
			return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function () {[\'native code\'];}');
		};
		Number.prototype.toRecoverableString = function () {
			if( isNaN(this) ) { return 'Number.NaN'; }
			if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
			if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
			return ''+this+'';
		};
		RegExp.prototype.toRecoverableString = function () {
			return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
		};
		String.prototype.toRecoverableString = function () {
			var oTmp = escape(this);
			if( oTmp == this ) { return '\''+this+'\''; }
			return 'unescape(\''+oTmp+'\')';
		};
	}
	if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }
	var oTmp = oVar.toRecoverableString();
	if( !notFirst ) {
		//prevent it from changing for...in loops that the page may be using
		delete Object.prototype.toRecoverableString;
		delete Array.prototype.toRecoverableObString;
		delete Array.prototype.toRecoverableString;
		delete Boolean.prototype.toRecoverableString;
		delete Date.prototype.toRecoverableString;
		delete Function.prototype.toRecoverableString;
		delete Number.prototype.toRecoverableString;
		delete RegExp.prototype.toRecoverableString;
		delete String.prototype.toRecoverableString;
	}
	return oTmp;
}
var basicObPropNameValStr = /^\w+$/, cleanStrFromAr = new Array(/\\/g,/'/g,/"/g,/\r/g,/\n/g,/\f/g,/\t/g,new RegExp('-'+'->','g'),new RegExp('<!-'+'-','g'),/\//g), cleanStrToAr = new Array('\\\\','\\\'','\\\"','\\r','\\n','\\f','\\t','-\'+\'->','<!-\'+\'-','\\\/');

















/****************************
*                           *
*  END OF INCLUDED SCRIPTS  *
*                           *
****************************/


/**
* Sort-Tpyes
* sortDate
* sortCaseInsensitive
* sortCurrency
* sortNumeric
* sortIP
*
* sort_type
* sort_rank
* sort_xp
*/



	var sort_colums = new Array();
	sort_colums['schiff_list'] = new Array();
	sort_colums['schiff_list'][0] = standardistaTableSorting.sort_type;
	sort_colums['schiff_list'][1] = standardistaTableSorting.sort_rank;
	sort_colums['schiff_list'][2] = standardistaTableSorting.sortNumeric;
	sort_colums['schiff_list'][3] = standardistaTableSorting.sort_xp;
	sort_colums['schiff_list'][4] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_list'][5] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_list'][6] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_list'][7] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_list'][8] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_list'][9] = standardistaTableSorting.sort_load_time;


	sort_colums['schiff_fi'] = new Array();
	sort_colums['schiff_fi'][0] = standardistaTableSorting.sort_type;
	sort_colums['schiff_fi'][1] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['schiff_fi'][2] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['schiff_fi'][3] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['schiff_fi'][4] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['schiff_fi'][5] = standardistaTableSorting.sortNumeric;


	sort_colums['map_fspalt'] = new Array();
	sort_colums['map_fspalt'][1] = standardistaTableSorting.sort_type;
	sort_colums['map_fspalt'][2] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['map_fspalt'][3] = standardistaTableSorting.sortNumeric;
	sort_colums['map_fspalt'][4] = standardistaTableSorting.sortNumeric;
	sort_colums['map_fspalt'][5] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['map_fspalt'][6] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['map_fspalt'][7] = standardistaTableSorting.sortNumeric;


	sort_colums['map_rueck'] = new Array();
	sort_colums['map_rueck'][1] = standardistaTableSorting.sort_type;
	sort_colums['map_rueck'][2] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['map_rueck'][3] = standardistaTableSorting.sortNumeric;
	sort_colums['map_rueck'][4] = standardistaTableSorting.sortNumeric;
	sort_colums['map_rueck'][5] = standardistaTableSorting.sortCaseInsensitive;


	sort_colums['schiff_flotten'] = new Array();
	sort_colums['schiff_flotten'][0] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_flotten'][1] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_flotten'][2] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_flotten'][3] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['schiff_flotten'][4] = standardistaTableSorting.sortCaseInsensitive;

	sort_colums['capt_all'] = new Array();
	sort_colums['capt_all'][0] = standardistaTableSorting.sort_rank;
	sort_colums['capt_all'][1] = standardistaTableSorting.sort_type;
	sort_colums['capt_all'][2] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['capt_all'][3] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['capt_all'][4] = standardistaTableSorting.sort_xp;
	sort_colums['capt_all'][5] = standardistaTableSorting.sort_percentage_bar;
	sort_colums['capt_all'][6] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['capt_all'][7] = standardistaTableSorting.sortCaseInsensitive;

	sort_colums['clan_main'] = new Array();
	sort_colums['clan_main'][1] = standardistaTableSorting.sortCaseInsensitive;
	sort_colums['clan_main'][2] = standardistaTableSorting.sortNumeric;


	const shipTypes = [
	'begleitschiff',
	'frachtschiff',
	'fregatte',
	'gefechtsstation',
	'kampfstern',
	'kommandoschiff',
	'korvette',
	'kreuzer',
	'schlachtkreuzer',
	'schlachtschiff',
	'tankschiff',
	'titan',
	'versorgungsschiff',
	'waffenplattform',
	'zerstörer'
	];


	const cptRanks = [
	'captain zuweisen',
	'recruit',
	'spaceman',
	'space guard 3rd class',
	'space guard 2nd class',
	'space guard 1st class',
	'chief space guard',
	'senior chief space guard',
	'master chief space guard',
	'corporal',
	'lance coporal',
	'sergeant',
	'master sergeant',
	'lower officer',
	'orbit officer',
	'space officer',
	'chief officer',
	'staff officer',
	'warrant officer',
	'chief warrant officer',
	'ensign',
	'lieutenant junior grade',
	'3rd lieutenant',
	'2nd lieutenant',
	'1st lieutenant',
	'lt. commander 3rd class',
	'lt. commander 2nd class',
	'lt. commander 1st class',
	'sub commander',
	'major commander',
	'orbit commander',
	'chief commander',
	'major',
	'commodore',
	'sub admiral',
	'rear admiral',
	'vice admiral',
	'ship admiral',
	'group admiral',
	'fleet admiral',
	'star admiral',
	'galaxy admiral',
	'sub marshall',
	'rear marshall',
	'vice marshall',
	'ship marshall',
	'group marshall',
	'fleet marshall',
	'star marshall',
	'galaxy marshall',
	'venad sub commander',
	'vice venad commander'
	];

  init();