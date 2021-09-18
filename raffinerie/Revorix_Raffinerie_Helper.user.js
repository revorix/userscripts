// ==UserScript==
// @name           Revorix_Raffinerie_Helper
// @namespace      URI <http://marczewski.ddnss.org/>
// @description    Erleichtert die Umwandlung von Erz im Spiel Revorix beim Ressourcenversand
// @include        http*://game.revorix.de/php/res_portal.php*
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/raffinerie/Revorix_Raffinerie_Helper.user.js
// @updateURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/raffinerie/Revorix_Raffinerie_Helper.user.js
// @version 3.2021091901
// ==/UserScript==

/*
*made by Wintermoon
*/

function init()
{
    if(location.href.indexOf('res_portal.php') > -1)
    {
        initMain();
    }
}

function isNumeric(n){
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function fillForms()
{
	var erz = document.getElementsByName('erzmenge')[0].value;
	var level = document.getElementsByName('level')[0].value;
	
	if ( (isNumeric(erz) && !isNumeric(level)) || (!isNumeric(erz) && isNumeric(level)) ){
		document.getElementsByName("res7")[0].value = 0;
		document.getElementsByName("res8")[0].value = 0;
		document.getElementsByName("res9")[0].value = 0;
		document.getElementsByName("res10")[0].value = 0;
	}

    /*
		Effizienzsteigerung der Raff:
		(0,2*Level+2)% des Erzes werden in Eisenmetalle umgewandelt.
		56% der Eisenmetallemenge werden in Leichtmetalle umgewandelt.
		34% der Eisenmetallemenge werden in Schwermetalle umgewandelt.
		10% der Eisenmetallemenge werden in Edelmetalle umgewandelt.
	*/

	else{
		gesamtmenge= erz*(2+(level*0.2))/100;
		document.getElementsByName("res7")[0].value = Math.floor(gesamtmenge*1.00);
		document.getElementsByName("res8")[0].value = Math.floor(gesamtmenge*0.56);
		document.getElementsByName("res9")[0].value = Math.floor(gesamtmenge*0.34);
		document.getElementsByName("res10")[0].value = Math.ceil(gesamtmenge*0.10);
	}
}


function initMain()
{
	try
	{
		tableelement = document.getElementsByTagName("table")[0];
		var level = document.createElement("input"); //input element, text
		level.style.marginLeft="10px"
		level.style.marginBottom = "5px"
		level.setAttribute('type',"text");
		level.setAttribute('name',"level");
		level.setAttribute('placeholder',"Rafflevel");
		level.style.colspan = "3";
		level.style.size = "8";

		var erzmenge = document.createElement("input");
		erzmenge.style.marginBottom = "5px"
		erzmenge.setAttribute('type', "text");
		erzmenge.setAttribute('name', "erzmenge");
		erzmenge.setAttribute('placeholder', "Erzmenge");
		erzmenge.style.size = "8";
		erzmenge.style.colspan = "3";
		
		tableelement.parentNode.insertBefore(level, tableelement.nextSibling);
		tableelement.parentNode.insertBefore(erzmenge, tableelement.nextSibling);
		
		level.onkeyup=function(){fillForms()};
		erzmenge.onkeyup=function(){fillForms()};
	} 
	catch ( e ) 
	{
		//alert(e);
	}
}

init();
