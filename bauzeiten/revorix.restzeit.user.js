// ==UserScript==
// @name          Revorix-Restzeit-Script
// @namespace     http://toasten.de/
// @author        toasten
// @version       1.0
// @description	  Version 1.0 - Dieses Script erweitert die Restzeit-Anzeige für Schiffsbau, -Reparatur und Planoptimierungen. Es zeigt an, wann ein Bau abgeschlossen wird.
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/restzeit/revorix.restzeit.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/restzeit/revorix.restzeit.user.js

// @include https://game.revorix.de/*/schiff_bau.php
// @include https://game.revorix.de/*/schiff_dock.php
// @include https://game.revorix.de/*/entwicklung.php
// ==/UserScript==

/*
* made by
* toasten
*/
var isOpera = "Opera" == navigator.appName;
var isFireFox = "Netscape" == navigator.appName;
var isChrome = "Netscape" == navigator.appName && navigator.appVersion.indexOf("Chrome") > -1;


var now = (new Date()).getTime();



function initBauzeit()
{

	var tds = document.getElementsByTagName('td');

	//tds.length
	for (var i=0; i < tds.length; i++)
	{
		var text = getTDText(tds[i]);
		//alert(text);
		if(text.indexOf("Restzeit")>-1)
		{
			var timestr = text.substring(13);
			//alert(timestr);

			var lastSekunden = getSekunden(trim10(timestr));
			fertig = new Date(now+(lastSekunden*1000));
			tds[i].innerHTML += "<br/><div style='color:orange'>"+formatDate(fertig)+"</div>";

		}
		else if(text.indexOf("verbleibende Zeit")>-1)
		{
			var timestr = text.substring(23);
			//alert(timestr);

			var lastSekunden = getSekunden(trim10(timestr));
			fertig = new Date(now+(lastSekunden*1000));
			tds[i].innerHTML += "<br/><div style='color:orange'>"+formatDate(fertig)+"</div>";

		}



	}

}



function trim10 (str) {
	var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
	for (var i = 0; i < str.length; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}
	for (i = str.length - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}



function formatDate(datum){

	tage = new Array();
	tage[0] = "So";
	tage[1] = "Mo";
	tage[2] = "Di";
	tage[3] = "Mi";
	tage[4] = "Do";
	tage[5] = "Fr";
	tage[6] = "Sa";

	//Fertig: 19.08.2011 07:07:00
	value = tage[datum.getDay()]+" ";
	value += datum.getDate()+".";
	value += (isFireFox||isOpera?(1+datum.getMonth()):datum.getMonth())+" ";
	value += (isFireFox||isOpera?(1900+datum.getYear()):datum.getYear())+" ";
	value += (datum.getHours()<10?"0"+datum.getHours():datum.getHours())+":";
	value += (datum.getMinutes()<10?"0"+datum.getMinutes():datum.getMinutes())+":";
	value += (datum.getSeconds()<10?"0"+datum.getSeconds():datum.getSeconds());
	return value;
}


function getSekunden(zeit){
	var split = zeit.split(" ");
	if(split.length >= 3){
		sekunden = split[0]*24*60*60;
		sekunden += getSekundenFromStunden(split[2]);
		return sekunden;
	}
	else{
		sekunden = getSekundenFromStunden(split[0]);
		return sekunden;
	}
}


function getSekundenFromStunden(zeit){
	var split = zeit.split(":");
	sekunden = split[0] * 60 * 60;
	sekunden += split[1] * 60;
	sekunden += split[2] * 1;
	return sekunden;
}





function getTDText(td){
	if(isOpera)
	{
		return td.innerText;
	}
	else
	{
		return td.textContent;
	}
}


/*Start des ganzes Systems*/
initBauzeit();