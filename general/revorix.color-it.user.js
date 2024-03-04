/*
* Color-It-Script
*
* Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de
*
* made by
* toasten
*/

// ==UserScript==
// @name          Revorix Color-It
// @namespace     http://toasten.de/
// @author        toasten
// @description	  Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de - Es erweitert die Anzeigen um selbst einstellbare Farben.
// @version       1.1
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/color-it/revorix.color-it.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/color-it/revorix.color-it.user.js

// @include https://game.revorix.de/php/*
// ==/UserScript==




/*****************************************************************************
* Ab hier bitte nichts mehr aendern, solange ihr nicht wisst was ihr tut ;o) *
******************************************************************************/

var closeimage = "data:image/gif;base64,R0lGODlhCgAKAKIAADMzM//M/5mZmUxMTL+/vwAAAAAAAAAAACH5BAEHAAEALAAAAAAKAAoAAAMfGLocM+wpQKAjYNGHG+3NIAjWIgIAaQpZkFooEzdNAgA7";

var confimage = "data:image/gif;base64,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";


var isOpera = "Opera" == navigator.appName;
var isFireFox = "Netscape" == navigator.appName;
var isChrome = "Netscape" == navigator.appName && navigator.appVersion.indexOf("Chrome") > -1;




globalRule = new Array();
count = localStorage.getItem("globalRule");
for(ri=0;ri<count;ri++){
	globalRule[ri] = restoreRule(localStorage.getItem("globalRule"+ri));
}


var actColorText = null;
var picker = null;
var select = null;


function initColorIt()
{
	table = findTableByTh(tables[0]);
	tds = table.getElementsByTagName("tr")[0].getElementsByTagName("td");
	td = tds[tds.length-1];

	addcontent = "<div style='float:left;'><a href='javascript:colorizer.toggleColorizer();'><img src='"+confimage+"' alt='Configure Color-It'/></a></div>";
	addcontent += "<div id='colorizer' style='position:absolute; right:10px; top: 200px; height:270px; width:500px;  border:3px solid #000000; padding:3px; background-color:#ffffbb; visibility:hidden;'>";
	addcontent += '<div class="nfo" style="position: relative; width: 100%; border: 0px; margin:0px; padding: 0px; top:0px; left:0px; text-align:right;"><a href="javascript:colorizer.toggleColorizer()">X</a>&nbsp;</div>';
	addcontent += '<div id="bautipttext" style="color:black; text-align:left; padding-top:1px;">';
	addcontent += '<div style="float:left; width:200px; height:200px; background-color:#aa3300; color:#ffffff;">&nbsp;Auswahl:<br/><select id="searchselect" name="top5" size="3" style="border: 1px solid #aa3300; width:100%; height:210px; background-color:#ffffff;" onchange="colorizer.searchselected(this.value)"></select><br/><center><input type="button" onclick="colorizer.addSearch()" value="Neu"></input>&nbsp;&nbsp;&nbsp;&nbsp;<input type="button" onclick="colorizer.deleteSearch()" value="Löschen"></input></center></div>';
	addcontent += '<div style="float:right; width:295px; height:190px; padding:2px;">';
	addcontent += '<div style="float:right; width:200px; height:190px; padding:0px;" id="searchcolor"></div>';
	addcontent += 'Suche:<br/><input type="text" disabled="disabled" id="textsearch" style="width:65px;"/><input type="button" onclick="colorizer.editSearch()" value="Edit"></input><br/><br/>Textfarbe:<br/><input type="text" id="textcolor" style="width:65px;" onclick="colorizer.colorFieldChanged(this)" onchange="colorizer.colorValueChanged(this.value)"/><div name="show" style="float:right;"></div><br/><br/>Zeilenfarbe:<br/><input type="text" id="bgcolor" style="width:65px;" onclick="colorizer.colorFieldChanged(this)" onchange="colorizer.colorValueChanged(this.value)"/><div name="show" style="float:right;"></div><br/><br/>';
	addcontent += '</div>';
	addcontent += '<div style="float:right; width:275px; height:50px; padding:2px;">';
	addcontent += '<input type="button" onclick="colorizer.colorit()" value="Testen"></input>&nbsp;der aktuellen Einstellungen<br/><br/><input type="button" onclick="colorizer.saveRule()" value="Speichern"><span id="unsaved" style="color:#ff0000;  visibility:hidden;">&nbsp;ungespeicherte Änderungen!</span></input>';
	addcontent += '</div>';
	addcontent += '</div>';
  td.insertAdjacentHTML('beforeend',addcontent);

	var swatch = document.getElementById("searchcolor");

	//CFInstall.check({ mode: "overlay" });
	picker = new Color.Picker({
		callback: colorValueChanged,
		element: swatch
	});
	picker.el.style.width = "160px";
	picker.el.style.visibility = "hidden";

	select = document.getElementById("searchselect");
	initSelect();
	colorit();
  colorizer = {};
  colorizer.initColorIt = initColorIt;
  colorizer.initSelect = initSelect;
  colorizer.colorValueChanged = colorValueChanged;
  colorizer.changed = changed;
  colorizer.saveRule = saveRule;
  colorizer.colorit = colorit;
  colorizer.uncolorit = uncolorit;
  colorizer.searchselected = searchselected;
  colorizer.colorFieldChanged = colorFieldChanged;
  colorizer.editSearch = editSearch;
  colorizer.addSearch = addSearch;
  colorizer.deleteSearch = deleteSearch;
  colorizer.persistRule = persistRule;
  colorizer.restoreRule = restoreRule;
  colorizer.findPos = findPos;
  colorizer.closeColorizer = closeColorizer;
  colorizer.toggleColorizer = toggleColorizer;
  colorizer.searchTd = searchTd;
  colorizer.unColorRow = unColorRow;
  colorizer.colorRow = colorRow;
  colorizer.unBgcolorRow = unBgcolorRow;
  colorizer.bgcolorRow = bgcolorRow;
  colorizer.findTableByTh = findTableByTh;
  colorizer.globalRule = globalRule;
  window.colorizer = colorizer;
}

function initSelect(){
	select.options.length=0;

	for(gi=0; gi<globalRule.length; gi++)
	{
		newopt = new Option(globalRule[gi].search, gi, false, false);
		newopt.style.color="#000000";
		select.options.add(newopt);
	}
}

function colorValueChanged(hex){

	if(select && select.value)
	{
		if(!hex || hex.length==0){
			hex = "";
		}
		else if(hex.charAt(0)!="#"){
			hex = "#"+hex;
		}
		if(actColorText!=null){
			actColorText.value = hex;
			if(actColorText.id=="textcolor")
			{
				globalRule[select.value].color = hex;
			}
			else{
				globalRule[select.value].bgcolor = hex;
			}
		}
	}
}


function changed(){
	var unsaved = document.getElementById("unsaved");
	unsaved.style.visibility = "visible";
}


function saveRule(){

	precount = localStorage.getItem("globalRule");
	for(ri=0;ri<precount;ri++){
		test = localStorage.removeItem("globalRule"+ri);
	}
	count = globalRule.length;
	localStorage.setItem("globalRule",count);
	for(ri=0;ri<count;ri++){
		localStorage.setItem("globalRule"+ri,persistRule(globalRule[ri]));
	}

	var unsaved = document.getElementById("unsaved");
	unsaved.style.visibility = "hidden";
}


function colorit(){
	uncolorit();
	//var allTables = document.getElementsByTagName("table");
	//for (var ti=0; ti < allTables.length; ti++)

	for (var ti=0; ti < tables.length; ti++)
	{
		//var akttable = allTables[ti];
		var akttable = findTableByTh(tables[ti]);
		//alert("CTable: "+akttable+" - "+tables[ti]);
		var trelems = akttable.getElementsByTagName("tr");
		var length = trelems.length>=20?20:trelems.length;
		//trelems.length
		for (var trj=1; trj < trelems.length; trj++)
		{
			var tr = trelems[trj];
			var tdelems = tr.getElementsByTagName("td");

			foundRule = false;
			for(gi=0; gi<globalRule.length; gi++)
			{
				if(searchTd(tdelems,globalRule[gi].search))
				{
					foundRule = true;
					if(globalRule[gi].color)
					{
						colorRow(tr,tdelems,globalRule[gi].color);
					}
					if(globalRule[gi].bgcolor)
					{
						bgcolorRow(tr,tdelems,globalRule[gi].bgcolor);
					}
				}
			}

			if(!foundRule)
			{
				unColorRow(tr,tdelems);
				unBgcolorRow(tr,tdelems);
			}
		}
	}
}

function uncolorit(){

	//var allTables = document.getElementsByTagName("table");
	//for (var ti=0; ti < allTables.length; ti++)
	for (var ti=0; ti < tables.length; ti++)
	{
		//var akttable = allTables[ti];
		var akttable = findTableByTh(tables[ti]);
		//alert("UTable: "+akttable+" - "+tables[ti]);
		var trelems = akttable.getElementsByTagName("tr");
		var length = trelems.length>=4?4:trelems.length;
		for (var trj=0; trj < trelems.length; trj++)
		{
			var tr = trelems[trj];
			var tdelems = tr.getElementsByTagName("td");

			for(gi=0; gi<globalRule.length; gi++)
			{
				if(searchTd(tdelems,globalRule[gi].search)){
					if(globalRule[gi].color)
					{
						unColorRow(tr,tdelems,globalRule[gi].color);
					}
					if(globalRule[gi].bgcolor)
					{
						unBgcolorRow(tr,tdelems,globalRule[gi].bgcolor);
					}
				}
			}
		}
	}
}

function searchselected(selvalue)
{
	divs = document.getElementsByName("show");
	for(gi=0;gi<divs.length;gi++)
	{
		divs[gi].innerHTML = "";
	}
	actColorText = null;

	select = document.getElementById("searchselect");
	textsearch = document.getElementById("textsearch");
	textcolor = document.getElementById("textcolor");
	tbgcolor = document.getElementById("bgcolor");

	if(globalRule[selvalue]){
		textsearch.value=globalRule[selvalue].search;
		if(globalRule[selvalue].color){
			textcolor.value=globalRule[selvalue].color;
		}
		else{
			textcolor.value="";
		}

		if(globalRule[selvalue].bgcolor){
			tbgcolor.value=globalRule[selvalue].bgcolor;
		}
		else{
			tbgcolor.value="";
		}
	}
	else{
		textcolor.value="";
		tbgcolor.value="";
	}
}

function colorFieldChanged(field){
	actColorText = field;
	picker.el.style.visibility = "visible";

	divs = document.getElementsByName("show");
	for(gi=0;gi<divs.length;gi++)
	{
		divs[gi].innerHTML = "";
	}
	field.nextSibling.innerHTML="->";

	//picker.hue="0";

	tcol = actColorText.value;//"#ff0000";
	if(tcol)
	{
		rgb = Color.HEX_RGB(tcol);
		if(rgb)
		{
			hsv = Color.RGB_HSV(rgb);
			picker.hue=hsv.h;
			picker.sat=hsv.s;
			picker.val=hsv.v;
			picker.drawSample();
		}
	}
	changed();
}

function editSearch(){

	index = select.value;

	Check = prompt("Suchtext eingeben:", globalRule[index].search);
	if (Check && Check != "") {
		textsearch = document.getElementById("textsearch");
		textsearch.value = Check;

		globalRule[index].search = Check;
		select.options[index].text = Check;
		changed();
	}
}

function addSearch(){
	Check = prompt("Suchtext eingeben:", "");
	if (Check && Check != "") {
		index = globalRule.length;
		globalRule[index] = new Array();
		globalRule[index].search = Check;

		var opt = new Option(globalRule[index].search, gi, false, false);
		opt.style.color="#000000";
		opt.selected="selected";
		select.options.add(opt);

		searchselected(index);
		changed();
	}
}

function deleteSearch(){
	val = select.value;
	length = globalRule.length;
	if(globalRule[val])
	{
		Check = confirm("Die Regel '"+globalRule[val].search+"' wirklich löschen?");
		if (Check == true)
		{
			for(gi=0; gi<globalRule.length; gi++)
			{
				if(gi>val){
					globalRule[gi-1]=globalRule[gi];
				}
			}
			globalRule.pop();
			initSelect();
			changed();
		}
  	}
}

function persistRule(rule)
{
	//result = "{";
	result = "";
	for (var Eigenschaft in rule)
	{
		result += Eigenschaft+":"+rule[Eigenschaft]+",";
	}
	//result += "}";
	return result;
}


function restoreRule(rule)
{
	result = new Object();
	eigenschaften = rule.split(",");
	for(gi=0;gi<eigenschaften.length;gi++)
	{
		if(eigenschaften[gi]!="")
		{
			eigenschaft = eigenschaften[gi].split(":");
			result[eigenschaft[0]]=eigenschaft[1];
		}
	}
	return result;
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return [curleft,curtop];
}


function closeColorizer(){
	var elem = document.getElementById("colorizer");
	elem.style.visibility="hidden";
	picker.el.style.visibility = "hidden";
	document.getElementById("unsaved").style.visibility = "hidden";
}

function toggleColorizer(){
	var elem = document.getElementById("colorizer");
	if(elem.style.visibility=="visible")
	{
		elem.style.visibility="hidden"
		picker.el.style.visibility = "hidden";
		document.getElementById("unsaved").style.visibility = "hidden";
	}
	else
	{
		elem.style.visibility="visible"
		picker.el.style.visibility = "visible";
	}
}


function searchTd(tdelemente, search)
{
	for (j=0; j < tdelemente.length; j++)
	{
		if(isOpera)
		{
			var text = tdelemente[j].innerText;
		}
		else
		{
			var text = tdelemente[j].textContent;
		}

		if(text.indexOf(search)>-1){
			return true;
		}
	}
	return false;

}

function unColorRow(tr, tdelemente)
{
	for (j=0; j < tdelemente.length; j++)
	{
		tdelemente[j].style.color = "";
		var nodes = tdelemente[j].childNodes;
		for (k=0;k< nodes.length;k++){
			if(nodes[k].tagName != "A" && nodes[k].tagName != "DIV"  && nodes[k].style)
			{
				nodes[k].style.color = "";
			}
		}
	}
}

function colorRow(tr, tdelemente, color)
{
	for (j=0; j < tdelemente.length; j++)
	{
		tdelemente[j].style.color = color;
		var nodes = tdelemente[j].childNodes;
		for (k=0;k< nodes.length;k++){
			if(nodes[k].tagName != "A" && nodes[k].tagName != "DIV" && nodes[k].style)
			{
				nodes[k].style.color = color;
			}
		}
	}
}


function unBgcolorRow(tr, tdelemente, color)
{
	tr.style.bgcolor = "";
	for (j=0; j < tdelemente.length; j++)
	{
		tdelemente[j].style.backgroundColor = "";
	}
}

function bgcolorRow(tr, tdelemente, bgcolor)
{
	tr.style.bgcolor = bgcolor;
	for (j=0; j < tdelemente.length; j++)
	{
		tdelemente[j].style.backgroundColor = bgcolor;
	}
}

function findTableByTh(thIdentifier)
{
	var allTables = document.getElementsByTagName("table");
	for (var i=0; i < allTables.length; i++)
	{
		var akttable = allTables[i];
		var akttrelemente = akttable.getElementsByTagName("tr");

		if(isOpera)
		{
			var text = akttrelemente[0].innerText;
		}
		else
		{
			var text = akttrelemente[0].textContent;
		}
		var text2 = text.replace(/[\s]/g,"");
		if(text2.indexOf(thIdentifier)==0)
		{
			return akttable;
		}
	}
	return null;
}







/**************************
	DHTML Color Picker : v1.1 : 2010/12/28
	---------------------------------------
	http://www.colorjack.com/software/dhtml+color+picker.html

	Native support:  Firefox 2+, Safari 3+, Opera 9+, Google Chrome, IE9+
	ChromeFrame supprt:  IE7+

**************************/

if(window.Color == undefined) Color = {};

Color.Picker = function (props) {

	/// loading properties
	if (typeof(props) == "undefined") props = {};
	this.callback = props.callback; // bind custom function
	this.hue = props.hue || 0; // 0-360
	this.sat = props.sat || 0; // 0-100
	this.val = props.val || 100; // 0-100
	this.element = props.element || document.body;
	this.size = 165; // size of colorpicker
	this.margin = 5; // margins on colorpicker
	this.offset = this.margin / 2;
	this.hueWidth = 30;

	/// creating colorpicker (header)
	var plugin = document.createElement("div");
	plugin.id = "colorjack_square";
	plugin.style.cssText = "position: relative; height: " + (this.size + this.margin * 2) + "px";

/*
	// shows current selected color as the background of this box
	var hexBox = document.createElement("div");
	hexBox.className = "hexBox";
	plugin.appendChild(hexBox);
	*/

/*
	// shows current selected color as HEX string
	var hexString = document.createElement("div");
	hexString.className = "hexString";
	plugin.appendChild(hexString);
	*/

/*
	// close the plugin
	var hexClose = document.createElement("div");
	hexClose.className = "hexClose";
	hexClose.textContent = "X";
	hexClose.onclick = function () { // close colorpicker
		plugin.style.display = (plugin.style.display == "none") ? "block" : "none";
	};
	plugin.appendChild(hexClose);
	plugin.appendChild(document.createElement("br"));
	*/

	/// creating media-resources
	var arrows = document.createElement("canvas");
	arrows.width = 40;
	arrows.height = 5;
	(function () { // creating arrows
		var ctx = arrows.getContext("2d");
		var width = 3;
		var height = 5;
		var size = 9;
		var top = -size / 4;
		var left = 1;
		for (var n = 0; n < 20; n++) { // multiply anti-aliasing
			ctx.beginPath();
			ctx.fillStyle = "#FFF";
			ctx.moveTo(left + size / 4, size / 2 + top);
			ctx.lineTo(left, size / 4 + top);
			ctx.lineTo(left, size / 4 * 3 + top);
			ctx.fill();
		}
		ctx.translate(width, height);
		ctx.rotate(180 * Math.PI / 180); // rotate arrows
		ctx.drawImage(arrows, -29, 0);
		ctx.translate(-width, -height);
	})();

	var circle = document.createElement("canvas");
	circle.width = 10;
	circle.height = 10;
	(function () { // creating circle-selection
		var ctx = circle.getContext("2d");
		ctx.lineWidth = 1;
		ctx.beginPath();
		var x = circle.width / 2;
		var y = circle.width / 2;
		ctx.arc(x, y, 4.5, 0, Math.PI * 2, true);
		ctx.strokeStyle = '#000';
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(x, y, 3.5, 0, Math.PI * 2, true);
		ctx.strokeStyle = '#FFF';
		ctx.stroke();
	})();

	/// creating colorpicker sliders
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.style.cssText = "position: relative; top: " + (this.offset) + "px; left: " + (this.offset) + "px;";
	canvas.width = this.size + this.hueWidth + this.margin;
	canvas.height = this.size + this.margin;
	plugin.appendChild(canvas);

	function inlinemousedown (e) {
		var down = (e.type == "mousedown");
		var offset = that.margin / 2;
		var abs = abPos(canvas);
		var x0 = (e.pageX - abs.x) - offset;
		var y0 = (e.pageY - abs.y) - offset;
		var x = clamp(x0, 0, canvas.width);
		var y = clamp(y0, 0, that.size);
		if (e.target.className == "hexString") {
			plugin.style.cursor = "text";
			return; // allow selection of HEX
		}
		else if (x <= that.size) { // saturation-value selection
			plugin.style.cursor = "crosshair";
			if (down) dragElement({
				type: "relative",
				event: e,
				element: canvas,
				callback: function (coords, state) {
					var x = clamp(coords.x - that.offset, 0, that.size);
					var y = clamp(coords.y - that.offset, 0, that.size);
					that.sat = x / that.size * 100; // scale saturation
					that.val = 100 - (y / that.size * 100); // scale value
					that.drawSample();
				}
			});
		} else if (x > that.size + that.margin && x <= that.size + that.hueWidth) { // hue selection
			plugin.style.cursor = "crosshair";
			if (down) dragElement({
				type: "relative",
				event: e,
				element: canvas,
				callback: function (coords, state) {
					var y = clamp(coords.y - that.offset, 0, that.size);
					that.hue = Math.min(1, y / that.size) * 360;
					that.drawSample();
				}
			});
		} else { // margin between hue/saturation-value
			plugin.style.cursor = "default";
		}
		return false; // prevent selection
	}


	if(isFireFox){
		plugin.addEventListener("mousedown",inlinemousedown,true);
	}
	else{
		plugin.onmousemove =
		plugin.onmousedown = inlinemousedown;
	}



	// appending to element
	this.element.appendChild(plugin);

	/// helper functions
	var that = this;
	this.el = plugin;
	this.drawSample = function () {
		// clearing canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		that.drawSquare();
		that.drawHue();
		// retrieving hex-code
		var hex = Color.HSV_HEX({
			H: that.hue,
			S: that.sat,
			V: that.val
		});
		// display hex string
		//hexString.textContent = hex.toUpperCase();
		// display background color
		//hexBox.style.backgroundColor = "#" + hex;
		// arrow-selection
		var y = (that.hue / 362) * that.size - 2;
		ctx.drawImage(arrows, that.size + that.offset + 4, Math.round(y) + that.offset);
		// circle-selection
		var x = that.sat / 100 * that.size;
		var y = (1 - (that.val / 100)) * that.size;
		x = x - circle.width / 2;
		y = y - circle.height / 2;
		ctx.drawImage(circle, Math.round(x) + that.offset, Math.round(y) + that.offset);
		// run custom code
		if (that.callback) that.callback(hex);
	};

	this.drawSquare = function () {
		// retrieving hex-code
		var hex = Color.HSV_HEX({
			H: that.hue,
			S: 100,
			V: 100
		});
		var offset = that.offset;
		var size = that.size;
		// drawing color
		ctx.fillStyle = "#" + hex;
		ctx.fillRect(offset, offset, size, size);
		// overlaying saturation
		var gradient = ctx.createLinearGradient(offset, offset, size + offset, 0);
		gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
		gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
		ctx.fillStyle = gradient;
		ctx.fillRect(offset, offset, size, size);
		// overlaying value
		var gradient = ctx.createLinearGradient(offset, offset, 0, size + offset);
		gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
		ctx.fillStyle = gradient;
		ctx.fillRect(offset, offset, size, size);
		// drawing outer bounds
		ctx.strokeStyle = "rgba(255,255,255,0.15)";
		ctx.strokeRect(offset+0.5, offset+0.5, size-1, size-1);
	};

	this.drawHue = function () {
		// drawing hue selector
		var left = that.size + that.margin + that.offset;
		var gradient = ctx.createLinearGradient(0, 0, 0, that.size);
		gradient.addColorStop(0, "rgba(255, 0, 0, 1)");
		gradient.addColorStop(0.15, "rgba(255, 255, 0, 1)");
		gradient.addColorStop(0.3, "rgba(0, 255, 0, 1)");
		gradient.addColorStop(0.5, "rgba(0, 255, 255, 1)");
		gradient.addColorStop(0.65, "rgba(0, 0, 255, 1)");
		gradient.addColorStop(0.8, "rgba(255, 0, 255, 1)");
		gradient.addColorStop(1, "rgba(255, 0, 0, 1)");
		ctx.fillStyle = gradient;
		ctx.fillRect(left, that.offset, 20, that.size);
		// drawing outer bounds
		ctx.strokeStyle = "rgba(255,255,255,0.2)";
		ctx.strokeRect(left + 0.5, that.offset + 0.5, 19, that.size-1);
	};

	this.destory = function () {
		document.body.removeChild(plugin);
		for (var key in that) delete that[key];
	};

	// drawing color selection
	this.drawSample();

	return this;
};

/* GLOBALS LIBRARY */

var dragElement = function(props) {
	function mouseMove(e, state) {
		if (typeof(state) == "undefined") state = "move";
		var coord = XY(e);
		switch (props.type) {
			case "difference":
				props.callback({
					x: coord.x + oX - eX,
					y: coord.y + oY - eY
				}, state);
				break;
			case "relative":
				props.callback({
					x: coord.x - oX,
					y: coord.y - oY
				}, state);
				break;
			default: // "absolute"
				props.callback({
					x: coord.x,
					y: coord.y
				}, state);
				break;
		}
	};
	function mouseUp(e) {
		window.removeEventListener("mousemove", mouseMove, false);
		window.removeEventListener("mouseup", mouseUp, false);
		mouseMove(e, "up");
	};
	// current element position
	var el = props.element;
	var origin = abPos(el);
	var oX = origin.x;
	var oY = origin.y;
	// current mouse position
	var e = props.event;
	var coord = XY(e);
	var eX = coord.x;
	var eY = coord.y;
	// events
	window.addEventListener("mousemove", mouseMove, false);
	window.addEventListener("mouseup", mouseUp, false);
	mouseMove(e, "down"); // run mouse-down
};

var clamp = function(n, min, max) {
	return (n < min) ? min : ((n > max) ? max : n);
};

var XY = window.ActiveXObject ? // fix XY to work in various browsers
	function(event) {
		return {
			x: event.clientX + document.documentElement.scrollLeft,
			y: event.clientY + document.documentElement.scrollTop
		};
	} : function(event) {
		return {
			x: event.pageX,
			y: event.pageY
		};
	};

var abPos = function(o) {
	o = typeof(o) == 'object' ? o : $(o);
	var offset = { x: 0, y: 0 };
	while(o != null) {
		offset.x += o.offsetLeft;
		offset.y += o.offsetTop;
		o = o.offsetParent;
	};
	return offset;
};

/* COLOR LIBRARY */

Color.HEX_STRING = function (o) {
	var z = o.toString(16);
	var n = z.length;
	while (n < 6) {
		z = '0' + z;
		n ++;
	}
	return z;
};

Color.RGB_HEX = function (o) {
	return o.R << 16 | o.G << 8 | o.B;
};

Color.HSV_RGB = function (o) {
	var H = o.H / 360,
		S = o.S / 100,
		V = o.V / 100,
		R, G, B;
	var A, B, C, D;
	if (S == 0) {
		R = G = B = Math.round(V * 255);
	} else {
		if (H >= 1) H = 0;
		H = 6 * H;
		D = H - Math.floor(H);
		A = Math.round(255 * V * (1 - S));
		B = Math.round(255 * V * (1 - (S * D)));
		C = Math.round(255 * V * (1 - (S * (1 - D))));
		V = Math.round(255 * V);
		switch (Math.floor(H)) {
			case 0:
				R = V;
				G = C;
				B = A;
				break;
			case 1:
				R = B;
				G = V;
				B = A;
				break;
			case 2:
				R = A;
				G = V;
				B = C;
				break;
			case 3:
				R = A;
				G = B;
				B = V;
				break;
			case 4:
				R = C;
				G = A;
				B = V;
				break;
			case 5:
				R = V;
				G = A;
				B = B;
				break;
		}
	}
	return {
		R: R,
		G: G,
		B: B
	};
};

Color.HSV_HEX = function (o) {
	return Color.HEX_STRING(Color.RGB_HEX(Color.HSV_RGB(o)));
};


Color.RGB_HSV = function (rgb){

	r = rgb.r / 255;
	g = rgb.g / 255;
    b = rgb.b / 255;

    HSV = {};

    var minVal = Math.min(r, g, b);
		var maxVal = Math.max(r, g, b);
		var delta = maxVal - minVal;

		HSV.v = maxVal;

		if (delta == 0) {
			HSV.h = 0;
			HSV.s = 0;
		} else {
			HSV.s = delta / maxVal;
			var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
			var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
			var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

			if (r == maxVal) {HSV.h = del_B - del_G;}
			else if (g == maxVal) {HSV.h = (1 / 3) + del_R - del_B;}
			else if (b == maxVal) {HSV.h = (2 / 3) + del_G - del_R;}

			if (HSV.h < 0) {HSV.h += 1;}
			if (HSV.h > 1) {HSV.h -= 1;}
		}
		HSV.h *= 360;
		HSV.s *= 100;
		HSV.v *= 100;
	return HSV;

}

Color.HEX_RGB = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/*******
Ende Colorpicker
*******/



function mysite() {
}

var sites = new mysite();


sites['/news.php'] = new Array();
sites['/news.php'][0] = "AktuelleNachrichten";

sites['/bau.php'] = new Array();
sites['/bau.php'][0] = "InternerAusbau";

sites['/capt_all.php'] = new Array();
sites['/capt_all.php'][0] = "ListeallerCaptains";

sites['/artefakte.php'] = new Array();
sites['/artefakte.php'][0] = "NameArtEigenschaft";

sites['/spy.php'] = new Array();
sites['/spy.php'][0] = "AktiveAgenten";

sites['/schiff_list.php'] = new Array();
sites['/schiff_list.php'][0] = "Schiffsliste";

sites['/kommanlage.php'] = new Array();
sites['/kommanlage.php'][0] = "Nachrichten";

sites['/schiff_flotten.php'] = new Array();
sites['/schiff_flotten.php'][0] = "IhreFlotten";


for(mysite in sites){
	if(location.href.indexOf(mysite)>-1){
		var tables = sites[mysite];
    try {
		  initColorIt();
    } catch(e) {
      console.log(e);
    }
	}
}


