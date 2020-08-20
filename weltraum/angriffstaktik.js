// ==UserScript==
// @name         revorix.de Angriffstaktik- und Feind-Selektierer
// @author       TFAN
// @description
// @include      http://www.revorix.info/php/map_attack.php*
// @version      1.0 vom 20.08.2020
// ==/UserScript==

var taktikNumber = 22; // 0 use default

//22 = Raubzug

//-------------------------------------------------------------
// do not change code after this line
//-------------------------------------------------------------


function setTaktik() {
	try 
	{
	  if(taktikNumber != 0){
  		var taktikButtons = document.getElementsByName("gtkt");
  		for( var i=0; i < taktikButtons.length; i++) {
        if(taktikButtons[i].value == taktikNumber) {
          taktikButtons[i].setAttribute("checked", "")
        }
      }
  	}
	} catch(e) {
		// noop
	}
};

function checkEnemyFleet() {
	try 
	{
    var enemyFleets = document.getElementsByName("fidt");
    if(enemyFleets.length > 0) {
      enemyFleets[0].setAttribute("checked", "")
    }
	} catch(e) {
		// noop
	}
};

setTaktik();
checkEnemyFleet();
