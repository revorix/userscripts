// ==UserScript==
// @name          Revorix Aktien-Script
// @namespace     http://toasten.de/
// @author        toasten
// @contributor   ZupZ3r0
// @description   Aktien-Script zur leichteren Entscheidung beim Aktien-Kauf. Die Aktien bekommen einen passenden schnell lesbaren Farbcode. Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de
// @version       2.0
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/aktien/revorix.aktien.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/aktien/revorix.aktien.user.js

// @include    https://game.revorix.de/*/aktien.php
// @include    https://game.revorix.de/*/aktien_depot.php*
// @include    http://game.revorix.de/*/aktien_c.php*
// ==/UserScript==

/*
* Aktien-Script 2.0 fuer Opera 9.x und Firefox mit Greasemonkey
*
* made by
* toasten
*
*
* Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de
* Es ist eine Erweiterung fuer das Handelszentrum, damit man nicht immer erst alle
* Aktien in den Charts ansehen muss, ob sie billig genug zum kaufen ist.
*
* Die Aktien weden mit 3 Farben dargestellt:
* gruen:  die Aktie ist billig genug zum kaufen
* gelb:  die Aktie ist grade in ihrem Mittelfeld
* rot:   die Aktie ist teuer genug um sie zu verkaufen
*
* Die Werte fuer jede Aktien und die Farben koennt ihr in der folgenden Liste aendern,
* wenn euch meine Voreinstellungen nicht gefallen ;o)
*
*/


var topPreis = new Array();
var lowPreis = new Array();
var allAid = new Array();


var gruen = '#00aa00';
var gelb = '#aaaa00';
var rot = '#aa0000';

var storedData = {
  hideUndefined: false
}
try {
var storedData = JSON.parse(localStorage.getItem('rxhelper.aktien')) || storedData;
} catch(e){
  console.warn(e);
}

lowPreis['Bionic Military Equipment']=80;
topPreis['Bionic Military Equipment']=210;
// lowPreis['Lion Weapons']=30;
// topPreis['Lion Weapons']=180;
// lowPreis['Minora Weapons']=50;
// topPreis['Minora Weapons']=230;
lowPreis['Reversi Weapons']=20;
topPreis['Reversi Weapons']=160;
// lowPreis['Trao Security']=70;
// topPreis['Trao Security']=140;

lowPreis['Cosmic News Reports']=40;
topPreis['Cosmic News Reports']=100;
// lowPreis['Cyber Pictures']=40;
// topPreis['Cyber Pictures']=180;
// lowPreis['Cyberamusement']=40;
// topPreis['Cyberamusement']=120;
// lowPreis['Space Communication']=230;
// topPreis['Space Communication']=260;
// lowPreis['Space Tourism']=8;
// topPreis['Space Tourism']=30;
// lowPreis['Universe Pleasure']=100;
// topPreis['Universe Pleasure']=170;

// lowPreis['Lex Mines']=190;
// topPreis['Lex Mines']=260;

// lowPreis['Genetic Transform']=100;
// topPreis['Genetic Transform']=230;
lowPreis['Medical Aid Group']=220;
topPreis['Medical Aid Group']=270;
// lowPreis['Quarz Technology']=90;
// topPreis['Quarz Technology']=220;

lowPreis['Cosmic Bank']=20;
topPreis['Cosmic Bank']=200;
// lowPreis['Omega Insurances']=10;
// topPreis['Omega Insurances']=50;
// lowPreis['Safe Trading Commonwealth']=90;
// topPreis['Safe Trading Commonwealth']=200;
// lowPreis['Trading Express']=40;
// topPreis['Trading Express']=250;
// lowPreis['Universal Credits']=180;
// topPreis['Universal Credits']=220;

// lowPreis['Building Community Necret']=150;
// topPreis['Building Community Necret']=210;
// lowPreis['Steck Industry']=20;
// topPreis['Steck Industry']=130;
lowPreis['Synal Equipment']=20;
topPreis['Synal Equipment']=220;

lowPreis['Eagle Equipments']=180;
topPreis['Eagle Equipments']=240;
lowPreis['Nano Tech']=5;
topPreis['Nano Tech']=30;
lowPreis['Orion Docks']=10;
topPreis['Orion Docks']=40;
// lowPreis['Schwarzwolf Industries']=20;
// topPreis['Schwarzwolf Industries']=100;
lowPreis['United Dockyards']=135;
topPreis['United Dockyards']=200;



/*****************************************************************************
* Ab hier bitte nichts mehr aendern, solange ihr nicht wisst was ihr tut ;o) *
******************************************************************************/

//Short Overview
allAid['14']="Bionic Military Equipment";
allAid['15']="Lion Weapons";
allAid['116']="Minora Weapons";
allAid['113']="Reversi Weapons";
allAid['125']="Trao Security";
allAid['13']="Cosmic News Reports";
allAid['110']="Cyber Pictures";
allAid['18']="Cyberamusement";
allAid['19']="Space Communication";
allAid['115']="Space Tourism";
allAid['124']="Universe Pleasure";
allAid['112']="Lex Mines";
allAid['127']="Genetic Transform";
allAid['126']="Medical Aid Group";
allAid['114']="Quarz Technology";
allAid['121']="Cosmic Bank";
allAid['128']="Omega Insurances";
allAid['12']="Safe Trading Commonwealth";
allAid['11']="Trading Express";
allAid['122']="Universal Credits";
allAid['123']="Building Community Necret";
allAid['17']="Steck Industry";
allAid['120']="Synal Equipment";
allAid['119']="Eagle Equipments";
allAid['118']="Nano Tech";
allAid['117']="Orion Docks";
allAid['111']="Schwarzwolf Industries";
allAid['16']="United Dockyards";


//Long Overview
allAid['24']="Bionic Military Equipment";
allAid['25']="Lion Weapons";
allAid['216']="Minora Weapons";
allAid['213']="Reversi Weapons";
allAid['225']="Trao Security";
allAid['23']="Cosmic News Reports";
allAid['20']="Cyber Pictures";
allAid['28']="Cyberamusement";
allAid['29']="Space Communication";
allAid['215']="Space Tourism";
allAid['224']="Universe Pleasure";
allAid['212']="Lex Mines";
allAid['227']="Genetic Transform";
allAid['226']="Medical Aid Group";
allAid['214']="Quarz Technology";
allAid['221']="Cosmic Bank";
allAid['228']="Omega Insurances";
allAid['22']="Safe Trading Commonwealth";
allAid['21']="Trading Express";
allAid['222']="Universal Credits";
allAid['223']="Building Community Necret";
allAid['27']="Steck Industry";
allAid['220']="Synal Equipment";
allAid['219']="Eagle Equipments";
allAid['218']="Nano Tech";
allAid['217']="Orion Docks";
allAid['211']="Schwarzwolf Industries";
allAid['26']="United Dockyards";



function init()
{
    if(location.href.indexOf('aktien.php') > -1 || location.href.indexOf('aktien_depot.php') > -1 )
    {
        initMain();
    }
    else if(location.href.indexOf('aktien-details.htm') > -1 || location.href.indexOf('aktien_c.php') > -1)
    {
        initDetail();
    }

}

function initDetail()
{
    var loc = location.href.indexOf('?aid=') + 5;
    var aid = location.href.substring(loc,location.href.length);
    if(!isNaN(aid))
    {
        var name = allAid[aid];
        var low = lowPreis[name];
        var top = topPreis[name];

        var topLine = 10 + 300 - top;
        var bottomLine = 10 + 300 - low;

        //Long Overview
        if('2' == aid.substr(0,1))
        {
            var width = 600;
        }
        //Short Overview
        else
        {
            var width = 400;
        }

        /*
        var redTop = 10;
        var redHeight = topLine - redTop;

        var yellowTop = redTop+redHeight;
        var yellowHeight = bottomLine - yellowTop;

        var greenTop = bottomLine;
        var greenHeight = 310 - bottomLine;


        document.getElementsByTagName('body')[0].innerHTML += ' <div style="background:'+rot+'; position:absolute; top:'+redTop+'px; left:25px; width:'+width+'px; height:'+redHeight+'px; opacity: .2;"></div> ';
        document.getElementsByTagName('body')[0].innerHTML += ' <div style="background:'+gelb+'; position:absolute; top:'+yellowTop+'px; left:25px; width:'+width+'px; height:'+yellowHeight+'px; opacity: .2;"></div> ';
        document.getElementsByTagName('body')[0].innerHTML += ' <div style="background:'+gruen+'; position:absolute; top:'+greenTop+'px; left:25px; width:'+width+'px; height:'+greenHeight+'px; opacity: .2;"></div> ';
        */

        document.getElementsByTagName('body')[0].innerHTML += ' <div style="background:'+rot+'; position:absolute; top:'+topLine+'px; left:25px; width:'+width+'px; height:1px;"></div> ';
        document.getElementsByTagName('body')[0].innerHTML += ' <div style="background:'+gruen+'; position:absolute; top:'+bottomLine+'px; left:25px; width:'+width+'px; height:1px;"></div> ';

    }

}

function toggleHide() {
  storedData.hideUndefined = !storedData.hideUndefined;
  localStorage.setItem('rxhelper.aktien', JSON.stringify(storedData));
  initMain();
}

function initMain()
{
  if(!document.querySelector('.rxhelper-aktien-setting')) {
    document.querySelector('body').insertAdjacentHTML('beforeend',`
      <div class="rxhelper-aktien-setting" style="position: absolute; top: 10px; right: 10px; background: #000133; border: 2px solid #515A64; padding: 10px;">
        <h4 style="margin:0;">Einstellungen</h4>
        <label for="toggleHide">nur definierte Aktien anzeigen</label>
        <input name="toggleHide" type="checkbox"/>
      </div>
    `);
    var hideToggle = document.querySelector('input[name="toggleHide"]')
    hideToggle.addEventListener("click", toggleHide);
    if(storedData.hideUndefined) hideToggle.setAttribute('checked','checked');
  }
	try
	{
		var trelemente = document.getElementsByTagName("tr");
		for (var i=0; i < trelemente.length; i++)
		{
			var tdelemente = trelemente[i].getElementsByTagName("td");
			if(tdelemente != null && tdelemente.length > 2)
			{
        if(tdelemente[0].innerHTML !== 'Inf.' && tdelemente.length > 6 && !lowPreis[tdelemente[1].innerHTML]) {
          if(storedData.hideUndefined)
            trelemente[i].style.display = 'none';
          else
            trelemente[i].style.display = 'table-row';
        }
        if(lowPreis[tdelemente[1].innerHTML]) {
          var name = tdelemente[1].innerHTML;
          var splitted = tdelemente[2].innerHTML.split(" ");
          var kurs = splitted[0];
          if(kurs <= lowPreis[name])
          {
            tdelemente[2].style.backgroundColor = gruen;
          }
          else if(kurs > lowPreis[name] && kurs < topPreis[name])
          {
            tdelemente[2].style.backgroundColor = gelb;
          }
          else if(kurs >= topPreis[name])
          {
            tdelemente[2].style.backgroundColor = rot;
          }
        }
			}
		}

	} catch ( e )
	{
		console.log(e);
	}
}


init();