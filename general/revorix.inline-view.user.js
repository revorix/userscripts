// ==UserScript==
// @name          Revorix News2.0-Script
// @namespace     http://toasten.de/
// @author        toasten
// @description	  Dieses Script erweitert die News-Anzeige. Alle Popups werden als IFrame dargestellt.
// @version       2.2
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/inline-view/revorix.inline-view.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/inline-view/revorix.inline-view.meta.js

// @include https://game.revorix.de/*/news.php*
// ==/UserScript==

/*
* made by
* toasten
*/
var isOpera = "Opera" == navigator.appName;
var isFireFox = "Netscape" == navigator.appName;
var isChrome = "Netscape" == navigator.appName && navigator.appVersion.indexOf("Chrome") > -1;

function init()
{

	var tables = document.getElementsByTagName('table');
	for (var i=0; i < tables.length; i++)
	{
		var trelemente = tables[i].getElementsByTagName('tr');

		if(isOpera)
		{
			var text = trelemente[0].innerText;
		}
		else
		{
			var text = trelemente[0].textContent;
		}

		if(text.indexOf("Aktuelle Nachrichten") > -1)
		{
			markRow(trelemente);
		}
	}


	if(isChrome){

		var script = document.createElement('script');

		script.appendChild(document.createTextNode('var isOpera ="'+ isOpera +'";'));
		script.appendChild(document.createTextNode('var isFireFox ="'+ isFireFox +'";'));
		script.appendChild(document.createTextNode('var isChrome ="'+ isChrome +'";'));
		script.appendChild(document.createTextNode(''+ rx_open20 +''));
		script.appendChild(document.createTextNode(''+ rx_close20 +''));
		script.appendChild(document.createTextNode(''+ calcHeight +''));

		(document.body || document.head || document.documentElement).appendChild(script);

	}
	else if(isFireFox){
		unsafeWindow.rx_close20 = rx_close20;
		unsafeWindow.rx_open20 = rx_open20;
		unsafeWindow.calcHeight = calcHeight;
	}

}



function markRow(trelemente)
{

	var id = 1;

/* trelemente.length  5  */
	for (var i=2; i < trelemente.length; i++)
	{
		var tr = trelemente[i];
		var tdelemente = tr.getElementsByTagName('td');
		if(tdelemente.length>5)
		{
			var a = tdelemente[5].getElementsByTagName('a');
			if(a.length>0){

				tr.id = "news20"+id;

				a[0].innerHTML+=" &darr;";
				var params = a[0].href.substring(a[0].href.indexOf('(')+1)

				a[0].href = "javascript:rx_open20("+id+","+params;//+")";
				id++;
			}

		}
    }

}






function rx_open20(trid,url,otyp) {

	var tr = document.getElementById('news20'+trid);
	var tropen = document.getElementById('news20open'+trid);


	var tdelemente = tr.getElementsByTagName('td');
	var a = tdelemente[5].getElementsByTagName('a');



	var params = a[0].href.substring(a[0].href.indexOf('(')+1)
	a[0].href = "javascript:rx_close20("+params;//+")";

	if(isOpera)
	{
		var text = a[0].innerText;
	}
	else
	{
		var text = a[0].textContent;
	}
	a[0].innerHTML=text.substring(0,text.length-2)+" &uarr;";

	//Wenn schon existiert -> anzeigen
	if(tropen)
	{
		//tropen.style.visibility = "visible";
		tropen.style.display = "table-row";
	}
	else
	{
		var table = tr.parentNode;
		var after = tr.nextSibling;

		//Hoehe und Breite aus Original-Script genommen
		var neuTR = document.createElement("tr");
		neuTR.id = "news20open"+trid;

		var neuTD = document.createElement("td");
		neuTD.innerHTML = '<iframe src="'+url+'" onload="javascript:calcHeight('+trid+');"></iframe>';
		neuTD.innerHTML += '&nbsp;&nbsp;<a href=\'javascript:rx_close20('+trid+',"'+url+'",'+otyp+')\' style="vertical-align:top;">(X)</a>';
		neuTD.innerHTML += '&nbsp;&nbsp;<a href=\'javascript:rx_open("'+url+'",'+otyp+')\' style="vertical-align:top;">(In Popup &Ouml;ffnen)</a>';
		neuTD.colSpan = "5";
		neuTR.appendChild(neuTD);

		if(after){
			table.insertBefore(neuTR, after);
		}
		else{
			table.appendChild(neuTR);
		}

	}


};



function rx_close20(trid,url,otyp) {

	var tropen = document.getElementById('news20open'+trid);
	//Wenn schon existiert -> anzeigen
	if(tropen)
	{
		//tropen.style.visibility = "hidden";
		tropen.style.display = "none";
	}

	var tr = document.getElementById('news20'+trid);
	var tdelemente = tr.getElementsByTagName('td');
	var a = tdelemente[5].getElementsByTagName('a');

	var params = a[0].href.substring(a[0].href.indexOf('(')+1)
	a[0].href = "javascript:rx_open20("+params;//+")";

	if(isOpera)
	{
		var text = a[0].innerText;
	}
	else
	{
		var text = a[0].textContent;
	}
	a[0].innerHTML=text.substring(0,text.length-2)+" &darr;";
};



function calcHeight(trid)
{

	var tropen = document.getElementById('news20open'+trid);
	//Wenn schon existiert -> anzeigen
	if(tropen)
	{

		  //find the height of the internal page
		  var iframe = tropen.getElementsByTagName('iframe')[0];
		  var the_height=iframe.contentWindow.document.body.scrollHeight;
		  var the_width=iframe.contentWindow.document.body.scrollWidth;

		  //change the height of the iframe
		  iframe.height=the_height+25;
		  iframe.width=the_width+25;
	}

}




/*Start des ganzes Systems*/
init();