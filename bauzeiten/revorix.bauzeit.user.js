// ==UserScript==
// @name          Revorix Bauzeit-Script
// @namespace     http://toasten.de/
// @description	  Dieses Script erweitert die Bau-Anzeige. Es zeigt an, wann ein Bau abgeschlossen wird.
// @version       3.0.180625

// @include http*revorix.info/*/bau.php*
// @include http://217.160.164.101/*/bau.php*
// @include http://www.revorix.info/*/bau.php*
// ==/UserScript==

/*
* made by
* toasten
* added init after load by coolius
*/
var isOpera = "Opera" == navigator.appName;
var isFireFox = "Netscape" == navigator.appName;
var isChrome = "Netscape" == navigator.appName && navigator.appVersion.indexOf("Chrome") > -1;


var now = (new Date()).getTime();



function initBauzeit()
{
	var tables = document.getElementsByTagName('table');
	var text="";

	for (var i=0; i < tables.length; i++)
	{
		var trelemente = tables[i].getElementsByTagName('tr');

		if(isOpera)
		{
			text = trelemente[0].innerText;
		}
		else
		{
			text = trelemente[0].textContent;
		}
		
		if(text.indexOf("Interner Ausbau") > -1)
		{
			markGeb(trelemente);
		}
	}
	
}




function markGeb(trelemente){


	var lastSekunden = "";

// trelemente.length  5  

	for (var i=2; i < trelemente.length; i++)
	{
		var tr = trelemente[i];
		var tdelemente = tr.getElementsByTagName('td');
        var zeittd;

		if(tdelemente.length==18)
		{
			var td = tdelemente[0];
			var text = getTDText(td);

			var s = text.indexOf('(');
			var e = text.indexOf(')');
			var geb = text.substring(0,s-1);

			if("Nächstes Level" == geb){
				zeittd = tdelemente[16];
				sekunden = getSekunden(getTDText(zeittd));
				fertig = new Date(now+((lastSekunden+sekunden)*1000));

				//alert(now+"--"+fertig.toLocaleString());
				zeittd.innerHTML += "<br/><div style='color:orange'>"+formatDate(fertig)+"</div>";
			}
			else{
				//18 Tage 00:27:00
				zeittd = tdelemente[16];
				lastSekunden = getSekunden(getTDText(zeittd));
				fertig = new Date(now+(lastSekunden*1000));
				
				//alert(now+"--"+fertig.toLocaleString());
				zeittd.innerHTML += "<br/><div style='color:orange'>"+formatDate(fertig)+"</div>";
			}
		}
		else if(tdelemente.length==4){
		
			zeittd = tdelemente[2];
			lastSekunden = getSekunden(getTDText(zeittd).trim());
//console.log(lastSekunden);
            fertig = new Date(now+(lastSekunden*1000));
			zeittd.innerHTML += "<br/><div style='color:orange; float:right;'>"+formatDate(fertig)+"</div>";
			
		}
		else{
			//alert("g"+tdelemente.length);
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

window.addEventListener('load', function() {
/*Start des ganzes Systems*/
    initBauzeit();
}, false);
