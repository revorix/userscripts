// ==UserScript==
// @name        Werbungsgrenze
// @namespace   http://www.nullpointer.at/
// @author      Lord-FaKe
// @description HÃ¤lt die Werbung im Rahmen
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/general/werbungsgrenze.user.js
// @updateURL   https://raw.githubusercontent.com/tpummer/gm-revorix/master/general/werbungsgrenze.meta.js
// @grant       None
// @version     1.20181019.1
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
//
// @include     /(87\.106\.151\.92|(www\.)?revorix\.(de|com|info))\S*
// @include http*revorix.info/*
// ==/UserScript==

(function()
{
	"use strict";

	function resize()
	{
      console.log($("[id^=sas_container_]").length);
      $("[id^=sas_container_]").css("height","80px");
      
	}

	resize();
})();
