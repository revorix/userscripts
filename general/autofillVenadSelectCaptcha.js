// ==UserScript==
// @name        Autofill Venadname & focus captcha
// @namespace   Violentmonkey Scripts
// @match       https://www.revorix.info/login/
// @grant       none
// @version     1.0
// @author      TFAN
// @description 8/20/2020, 5:05:51 PM
// ==/UserScript==

var venadName = "Kronhall"

//-------------------------------------------------------------
// do not change code after this line
//-------------------------------------------------------------

function setVenad() {
	try 
	{
	  if(venadName != ""){
  		var venadBox = document.getElementsByName("vname");
  		for( var i=0; i < venadBox.length; i++) {
          venadBox[i].setAttribute("value", venadName)
      }
  	}
	} catch(e) {
		// noop
	}
};

function focusCaptcha() {
	try 
	{
    var captchaBox = document.getElementsByName("ucode");
    for( var i=0; i < captchaBox.length; i++) {
        captchaBox[i].focus();
  	}
	} catch(e) {
		// noop
	}
};

setVenad();
focusCaptcha();
