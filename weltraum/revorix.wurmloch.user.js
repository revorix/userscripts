// ==UserScript==
// @name          Revorix-Wurmloch-Scout
// @namespace     https://wls.nullpointer.at
// @description   Dieses Script ist eine Erweiterung fuer das Browsergame revorix.de Es bietet Komfort in dem es die Wurmloecher auf der Karte anzeigt. Für Opera 9.x, Firefox Greasemonkey und Chrome Tampermonkey
// @version       1.8 - Erzeugt am: 2022.05.30 - 23:52
// @author        Lord-FaKe
// @contributor   Toasten
// @updateURL     https://raw.githubusercontent.com/revorix/userscripts/master/weltraum/revorix.wurmloch.meta.js
// @downloadURL   https://raw.githubusercontent.com/revorix/userscripts/master/weltraum/revorix.wurmloch.user.js

// @include http*game.revorix.de/*/map.php*

// ==/UserScript==



var isOpera = "Opera" == navigator.appName;


/*************************************************
 *          Quadranten und Wurmloecher           *
 *************************************************/  

var quads = new Array();

quads['New Hope'] = new Object();
quads['New Hope'].width = 35;
quads['New Hope'].height = 35;
quads['New Hope'].wormholes = new Array();
quads['New Hope'].wormholes[0] = new Wurmloch(11,25);
quads['New Hope'].wormholes[1] = new Wurmloch(2,34);
quads['New Hope'].wormholes[2] = new Wurmloch(12,9);
quads['New Hope'].wormholes[3] = new Wurmloch(27,10);
quads['New Hope'].wormholes[4] = new Wurmloch(25,25);
quads['New Hope'].wormholes[5] = new Wurmloch(4,3);
quads['New Hope'].wormholes[6] = new Wurmloch(32,9);
quads['New Hope'].wormholes[7] = new Wurmloch(32,32);
quads['New Hope'].wormholes[8] = new Wurmloch(1,14);
quads['New Hope'].wormholes[9] = new Wurmloch(16,33);

quads['Livenfall'] = new Object();
quads['Livenfall'].width = 40;
quads['Livenfall'].height = 20;
quads['Livenfall'].wormholes = new Array();
quads['Livenfall'].wormholes[0] = new Wurmloch(19,4);
quads['Livenfall'].wormholes[1] = new Wurmloch(37,4);
quads['Livenfall'].wormholes[2] = new Wurmloch(21,10);
quads['Livenfall'].wormholes[3] = new Wurmloch(38,18);

quads['Carmen'] = new Object();
quads['Carmen'].width = 30;
quads['Carmen'].height = 20;
quads['Carmen'].wormholes = new Array();
quads['Carmen'].wormholes[0] = new Wurmloch(2,3);
quads['Carmen'].wormholes[1] = new Wurmloch(18,5);
quads['Carmen'].wormholes[2] = new Wurmloch(24,9);

quads['Hellfire'] = new Object();
quads['Hellfire'].width = 20;
quads['Hellfire'].height = 40;
quads['Hellfire'].wormholes = new Array();
quads['Hellfire'].wormholes[0] = new Wurmloch(11,30);

quads['Horologium'] = new Object();
quads['Horologium'].width = 6;
quads['Horologium'].height = 6;
quads['Horologium'].wormholes = new Array();
quads['Horologium'].wormholes[0] = new Wurmloch(5,2);
quads['Horologium'].wormholes[1] = new Wurmloch(2,6);

quads['Jericho'] = new Object();
quads['Jericho'].width = 34;
quads['Jericho'].height = 20;
quads['Jericho'].wormholes = new Array();
quads['Jericho'].wormholes[0] = new Wurmloch(5,19);
quads['Jericho'].wormholes[1] = new Wurmloch(7,10);
quads['Jericho'].wormholes[2] = new Wurmloch(12,8);
quads['Jericho'].wormholes[3] = new Wurmloch(20,3);
quads['Jericho'].wormholes[4] = new Wurmloch(23,17);

quads['Lyra Major'] = new Object();
quads['Lyra Major'].width = 25;
quads['Lyra Major'].height = 25;
quads['Lyra Major'].wormholes = new Array();
quads['Lyra Major'].wormholes[0] = new Wurmloch(2,2);
quads['Lyra Major'].wormholes[1] = new Wurmloch(20,7);
quads['Lyra Major'].wormholes[2] = new Wurmloch(17,13);
quads['Lyra Major'].wormholes[3] = new Wurmloch(9,11);
quads['Lyra Major'].wormholes[4] = new Wurmloch(10,1);
quads['Lyra Major'].wormholes[5] = new Wurmloch(3,10);
quads['Lyra Major'].wormholes[6] = new Wurmloch(19,1);

quads['Minas Hydra'] = new Object();
quads['Minas Hydra'].width = 20;
quads['Minas Hydra'].height = 20;
quads['Minas Hydra'].wormholes = new Array();
quads['Minas Hydra'].wormholes[0] = new Wurmloch(10,13);
quads['Minas Hydra'].wormholes[1] = new Wurmloch(17,13);
quads['Minas Hydra'].wormholes[2] = new Wurmloch(17,20);
quads['Minas Hydra'].wormholes[3] = new Wurmloch(11,17);
quads['Minas Hydra'].wormholes[4] = new Wurmloch(7,17);
quads['Minas Hydra'].wormholes[5] = new Wurmloch(2,14);
quads['Minas Hydra'].wormholes[6] = new Wurmloch(2,8);
quads['Minas Hydra'].wormholes[7] = new Wurmloch(1,6);
quads['Minas Hydra'].wormholes[8] = new Wurmloch(2,2);
quads['Minas Hydra'].wormholes[9] = new Wurmloch(9,1);
quads['Minas Hydra'].wormholes[10] = new Wurmloch(13,2);
quads['Minas Hydra'].wormholes[11] = new Wurmloch(19,2);
quads['Minas Hydra'].wormholes[12] = new Wurmloch(18,8);

quads['Nadeschda'] = new Object();
quads['Nadeschda'].width = 25;
quads['Nadeschda'].height = 18;
quads['Nadeschda'].wormholes = new Array();

quads['Oculum Corvus'] = new Object();
quads['Oculum Corvus'].width = 23;
quads['Oculum Corvus'].height = 38;
quads['Oculum Corvus'].wormholes = new Array();
quads['Oculum Corvus'].wormholes[0] = new Wurmloch(18,23);
quads['Oculum Corvus'].wormholes[1] = new Wurmloch(7,4);
quads['Oculum Corvus'].wormholes[2] = new Wurmloch(15,4);
quads['Oculum Corvus'].wormholes[3] = new Wurmloch(13,12);
quads['Oculum Corvus'].wormholes[4] = new Wurmloch(9,14);
quads['Oculum Corvus'].wormholes[5] = new Wurmloch(18,9);
quads['Oculum Corvus'].wormholes[6] = new Wurmloch(7,19);
quads['Oculum Corvus'].wormholes[7] = new Wurmloch(16,12);
quads['Oculum Corvus'].wormholes[8] = new Wurmloch(10,8);
quads['Oculum Corvus'].wormholes[9] = new Wurmloch(6,24);
quads['Oculum Corvus'].wormholes[10] = new Wurmloch(20,1);

quads['Old Korion'] = new Object();
quads['Old Korion'].width = 30;
quads['Old Korion'].height = 14;
quads['Old Korion'].wormholes = new Array();
quads['Old Korion'].wormholes[0] = new Wurmloch(13,6);
quads['Old Korion'].wormholes[1] = new Wurmloch(8,5);
quads['Old Korion'].wormholes[2] = new Wurmloch(18,8);
quads['Old Korion'].wormholes[3] = new Wurmloch(14,5);

quads['Othella'] = new Object();
quads['Othella'].width = 19;
quads['Othella'].height = 19;
quads['Othella'].wormholes = new Array();
quads['Othella'].wormholes[0] = new Wurmloch(5,12);
quads['Othella'].wormholes[1] = new Wurmloch(10,7);
quads['Othella'].wormholes[2] = new Wurmloch(15,11);

quads['Phobos'] = new Object();
quads['Phobos'].width = 18;
quads['Phobos'].height = 17;
quads['Phobos'].wormholes = new Array();
quads['Phobos'].wormholes[0] = new Wurmloch(13,16);
quads['Phobos'].wormholes[1] = new Wurmloch(4,1);
quads['Phobos'].wormholes[2] = new Wurmloch(3,11);

quads['Shivan'] = new Object();
quads['Shivan'].width = 8;
quads['Shivan'].height = 9;
quads['Shivan'].wormholes = new Array();
quads['Shivan'].wormholes[0] = new Wurmloch(2,1);
quads['Shivan'].wormholes[1] = new Wurmloch(2,8);
quads['Shivan'].wormholes[2] = new Wurmloch(7,3);
quads['Shivan'].wormholes[3] = new Wurmloch(8,6);
quads['Shivan'].wormholes[4] = new Wurmloch(4,5);
quads['Shivan'].wormholes[5] = new Wurmloch(5,2);
quads['Shivan'].wormholes[6] = new Wurmloch(7,2);
quads['Shivan'].wormholes[7] = new Wurmloch(7,7);

quads['Lesunia'] = new Object();
quads['Lesunia'].width = 30;
quads['Lesunia'].height = 17;
quads['Lesunia'].wormholes = new Array();
quads['Lesunia'].wormholes[0] = new Wurmloch(19,6);
quads['Lesunia'].wormholes[1] = new Wurmloch(5,15);
quads['Lesunia'].wormholes[2] = new Wurmloch(25,5);
quads['Lesunia'].wormholes[3] = new Wurmloch(22,3);
quads['Lesunia'].wormholes[4] = new Wurmloch(10,5);
quads['Lesunia'].wormholes[5] = new Wurmloch(9,13);

quads['Helios'] = new Object();
quads['Helios'].width = 30;
quads['Helios'].height = 35;
quads['Helios'].wormholes = new Array();
quads['Helios'].wormholes[0] = new Wurmloch(26,17);
quads['Helios'].wormholes[1] = new Wurmloch(19,8);
quads['Helios'].wormholes[2] = new Wurmloch(15,16);
quads['Helios'].wormholes[3] = new Wurmloch(17,30);
quads['Helios'].wormholes[4] = new Wurmloch(6,18);
quads['Helios'].wormholes[5] = new Wurmloch(3,9);
quads['Helios'].wormholes[6] = new Wurmloch(9,3);
quads['Helios'].wormholes[7] = new Wurmloch(24,24);
quads['Helios'].wormholes[8] = new Wurmloch(11,31);

quads['Kahldorf - Hegeli'] = new Object();
quads['Kahldorf - Hegeli'].width = 15;
quads['Kahldorf - Hegeli'].height = 13;
quads['Kahldorf - Hegeli'].wormholes = new Array();
quads['Kahldorf - Hegeli'].wormholes[0] = new Wurmloch(3,7);
quads['Kahldorf - Hegeli'].wormholes[1] = new Wurmloch(13,12);
quads['Kahldorf - Hegeli'].wormholes[2] = new Wurmloch(10,6);

quads['Tyche'] = new Object();
quads['Tyche'].width = 28;
quads['Tyche'].height = 16;
quads['Tyche'].wormholes = new Array();
quads['Tyche'].wormholes[0] = new Wurmloch(27,2);
quads['Tyche'].wormholes[1] = new Wurmloch(28,15);
quads['Tyche'].wormholes[2] = new Wurmloch(3,2);

quads['Ares'] = new Object();
quads['Ares'].width = 13;
quads['Ares'].height = 25;
quads['Ares'].wormholes = new Array();
quads['Ares'].wormholes[0] = new Wurmloch(7,14);
quads['Ares'].wormholes[1] = new Wurmloch(13,17);
quads['Ares'].wormholes[2] = new Wurmloch(1,19);
quads['Ares'].wormholes[3] = new Wurmloch(8,23);

quads['Selas'] = new Object();
quads['Selas'].width = 19;
quads['Selas'].height = 15;
quads['Selas'].wormholes = new Array();
quads['Selas'].wormholes[0] = new Wurmloch(17,7);
quads['Selas'].wormholes[1] = new Wurmloch(18,3);

quads['Minos Fatalis'] = new Object();
quads['Minos Fatalis'].width = 25;
quads['Minos Fatalis'].height = 11;
quads['Minos Fatalis'].wormholes = new Array();
quads['Minos Fatalis'].wormholes[0] = new Wurmloch(1,3);
quads['Minos Fatalis'].wormholes[1] = new Wurmloch(3,10);
quads['Minos Fatalis'].wormholes[2] = new Wurmloch(24,10);

quads['Hermes'] = new Object();
quads['Hermes'].width = 40;
quads['Hermes'].height = 20;
quads['Hermes'].wormholes = new Array();
quads['Hermes'].wormholes[0] = new Wurmloch(39,17);
quads['Hermes'].wormholes[1] = new Wurmloch(1,17);

quads['Neu Kaledonien'] = new Object();
quads['Neu Kaledonien'].width = 13;
quads['Neu Kaledonien'].height = 17;
quads['Neu Kaledonien'].wormholes = new Array();
quads['Neu Kaledonien'].wormholes[0] = new Wurmloch(3,3);
quads['Neu Kaledonien'].wormholes[1] = new Wurmloch(12,10);
quads['Neu Kaledonien'].wormholes[2] = new Wurmloch(12,8);

quads['Pegasos'] = new Object();
quads['Pegasos'].width = 10;
quads['Pegasos'].height = 19;
quads['Pegasos'].wormholes = new Array();
quads['Pegasos'].wormholes[0] = new Wurmloch(8,10);
quads['Pegasos'].wormholes[1] = new Wurmloch(6,14);
quads['Pegasos'].wormholes[2] = new Wurmloch(9,13);

quads['Triangulum'] = new Object();
quads['Triangulum'].width = 9;
quads['Triangulum'].height = 8;
quads['Triangulum'].wormholes = new Array();
quads['Triangulum'].wormholes[0] = new Wurmloch(8,7);
quads['Triangulum'].wormholes[1] = new Wurmloch(2,8);
quads['Triangulum'].wormholes[2] = new Wurmloch(5,2);

quads['Ophiuchus'] = new Object();
quads['Ophiuchus'].width = 13;
quads['Ophiuchus'].height = 19;
quads['Ophiuchus'].wormholes = new Array();
quads['Ophiuchus'].wormholes[0] = new Wurmloch(1,3);
quads['Ophiuchus'].wormholes[1] = new Wurmloch(2,6);
quads['Ophiuchus'].wormholes[2] = new Wurmloch(2,12);
quads['Ophiuchus'].wormholes[3] = new Wurmloch(2,18);
quads['Ophiuchus'].wormholes[4] = new Wurmloch(5,8);
quads['Ophiuchus'].wormholes[5] = new Wurmloch(6,2);
quads['Ophiuchus'].wormholes[6] = new Wurmloch(6,18);
quads['Ophiuchus'].wormholes[7] = new Wurmloch(7,12);
quads['Ophiuchus'].wormholes[8] = new Wurmloch(10,3);
quads['Ophiuchus'].wormholes[9] = new Wurmloch(10,8);
quads['Ophiuchus'].wormholes[10] = new Wurmloch(10,14);
quads['Ophiuchus'].wormholes[11] = new Wurmloch(10,19);

quads['Gugnir'] = new Object();
quads['Gugnir'].width = 9;
quads['Gugnir'].height = 13;
quads['Gugnir'].wormholes = new Array();
quads['Gugnir'].wormholes[0] = new Wurmloch(8,13);
quads['Gugnir'].wormholes[1] = new Wurmloch(7,1);
quads['Gugnir'].wormholes[2] = new Wurmloch(2,3);
quads['Gugnir'].wormholes[3] = new Wurmloch(2,12);
quads['Gugnir'].wormholes[4] = new Wurmloch(4,7);
quads['Gugnir'].wormholes[5] = new Wurmloch(6,7);

quads['Lyra Minor Alpha'] = new Object();
quads['Lyra Minor Alpha'].width = 38;
quads['Lyra Minor Alpha'].height = 11;
quads['Lyra Minor Alpha'].wormholes = new Array();
quads['Lyra Minor Alpha'].wormholes[0] = new Wurmloch(36,7);
quads['Lyra Minor Alpha'].wormholes[1] = new Wurmloch(33,9);
quads['Lyra Minor Alpha'].wormholes[2] = new Wurmloch(11,11);
quads['Lyra Minor Alpha'].wormholes[3] = new Wurmloch(12,10);
quads['Lyra Minor Alpha'].wormholes[4] = new Wurmloch(10,2);
quads['Lyra Minor Alpha'].wormholes[5] = new Wurmloch(24,6);
quads['Lyra Minor Alpha'].wormholes[6] = new Wurmloch(20,1);
quads['Lyra Minor Alpha'].wormholes[7] = new Wurmloch(25,4);

quads['Lyra Minor Beta'] = new Object();
quads['Lyra Minor Beta'].width = 15;
quads['Lyra Minor Beta'].height = 17;
quads['Lyra Minor Beta'].wormholes = new Array();
quads['Lyra Minor Beta'].wormholes[0] = new Wurmloch(14,1);
quads['Lyra Minor Beta'].wormholes[1] = new Wurmloch(10,9);
quads['Lyra Minor Beta'].wormholes[2] = new Wurmloch(4,7);
quads['Lyra Minor Beta'].wormholes[3] = new Wurmloch(6,6);
quads['Lyra Minor Beta'].wormholes[4] = new Wurmloch(3,14);
quads['Lyra Minor Beta'].wormholes[5] = new Wurmloch(2,9);
quads['Lyra Minor Beta'].wormholes[6] = new Wurmloch(14,16);

quads['Ophiuchus Minor 1'] = new Object();
quads['Ophiuchus Minor 1'].width = 9;
quads['Ophiuchus Minor 1'].height = 9;
quads['Ophiuchus Minor 1'].wormholes = new Array();
quads['Ophiuchus Minor 1'].wormholes[0] = new Wurmloch(1,3);
quads['Ophiuchus Minor 1'].wormholes[1] = new Wurmloch(1,5);
quads['Ophiuchus Minor 1'].wormholes[2] = new Wurmloch(1,7);
quads['Ophiuchus Minor 1'].wormholes[3] = new Wurmloch(3,1);
quads['Ophiuchus Minor 1'].wormholes[4] = new Wurmloch(3,9);
quads['Ophiuchus Minor 1'].wormholes[5] = new Wurmloch(5,1);
quads['Ophiuchus Minor 1'].wormholes[6] = new Wurmloch(5,9);
quads['Ophiuchus Minor 1'].wormholes[7] = new Wurmloch(7,1);
quads['Ophiuchus Minor 1'].wormholes[8] = new Wurmloch(7,9);
quads['Ophiuchus Minor 1'].wormholes[9] = new Wurmloch(9,3);
quads['Ophiuchus Minor 1'].wormholes[10] = new Wurmloch(9,5);
quads['Ophiuchus Minor 1'].wormholes[11] = new Wurmloch(9,7);

quads['Ophiuchus Minor 2'] = new Object();
quads['Ophiuchus Minor 2'].width = 11;
quads['Ophiuchus Minor 2'].height = 4;
quads['Ophiuchus Minor 2'].wormholes = new Array();
quads['Ophiuchus Minor 2'].wormholes[0] = new Wurmloch(1,3);
quads['Ophiuchus Minor 2'].wormholes[1] = new Wurmloch(2,3);
quads['Ophiuchus Minor 2'].wormholes[2] = new Wurmloch(3,3);
quads['Ophiuchus Minor 2'].wormholes[3] = new Wurmloch(6,2);
quads['Ophiuchus Minor 2'].wormholes[4] = new Wurmloch(6,4);
quads['Ophiuchus Minor 2'].wormholes[5] = new Wurmloch(7,2);
quads['Ophiuchus Minor 2'].wormholes[6] = new Wurmloch(9,2);
quads['Ophiuchus Minor 2'].wormholes[7] = new Wurmloch(10,2);
quads['Ophiuchus Minor 2'].wormholes[8] = new Wurmloch(10,4);

quads['Utangium'] = new Object();
quads['Utangium'].width = 7;
quads['Utangium'].height = 4;
quads['Utangium'].wormholes = new Array();
quads['Utangium'].wormholes[0] = new Wurmloch(5,3);
quads['Utangium'].wormholes[1] = new Wurmloch(3,1);
quads['Utangium'].wormholes[2] = new Wurmloch(1,1);

quads['Minas Hydra 1'] = new Object();
quads['Minas Hydra 1'].width = 13;
quads['Minas Hydra 1'].height = 18;
quads['Minas Hydra 1'].wormholes = new Array();

quads['Minas Hydra 10-12'] = new Object();
quads['Minas Hydra 10-12'].width = 29;
quads['Minas Hydra 10-12'].height = 15;
quads['Minas Hydra 10-12'].wormholes = new Array();

quads['Minas Hydra 2'] = new Object();
quads['Minas Hydra 2'].width = 18;
quads['Minas Hydra 2'].height = 9;
quads['Minas Hydra 2'].wormholes = new Array();

quads['Minas Hydra 3'] = new Object();
quads['Minas Hydra 3'].width = 14;
quads['Minas Hydra 3'].height = 15;
quads['Minas Hydra 3'].wormholes = new Array();

quads['Minas Hydra 4'] = new Object();
quads['Minas Hydra 4'].width = 1;
quads['Minas Hydra 4'].height = 1;
quads['Minas Hydra 4'].wormholes = new Array();

quads['Minas Hydra 5'] = new Object();
quads['Minas Hydra 5'].width = 1;
quads['Minas Hydra 5'].height = 1;
quads['Minas Hydra 5'].wormholes = new Array();

quads['Minas Hydra 6-9'] = new Object();
quads['Minas Hydra 6-9'].width = 18;
quads['Minas Hydra 6-9'].height = 25;
quads['Minas Hydra 6-9'].wormholes = new Array();

quads['Unbekannt'] = new Object();
quads['Unbekannt'].width = 1;
quads['Unbekannt'].height = 1;
quads['Unbekannt'].wormholes = new Array();

quads['Minas Gemini'] = new Object();
quads['Minas Gemini'].width = 23;
quads['Minas Gemini'].height = 21;
quads['Minas Gemini'].wormholes = new Array();
quads['Minas Gemini'].wormholes[0] = new Wurmloch(2,21);
quads['Minas Gemini'].wormholes[1] = new Wurmloch(10,21);
quads['Minas Gemini'].wormholes[2] = new Wurmloch(13,21);
quads['Minas Gemini'].wormholes[3] = new Wurmloch(23,21);

quads['Serpentes'] = new Object();
quads['Serpentes'].width = 20;
quads['Serpentes'].height = 20;
quads['Serpentes'].wormholes = new Array();
quads['Serpentes'].wormholes[0] = new Wurmloch(2,14);
quads['Serpentes'].wormholes[1] = new Wurmloch(6,9);
quads['Serpentes'].wormholes[2] = new Wurmloch(12,3);
quads['Serpentes'].wormholes[3] = new Wurmloch(15,2);

quads['Serpens Comedentis'] = new Object();
quads['Serpens Comedentis'].width = 60;
quads['Serpens Comedentis'].height = 60;
quads['Serpens Comedentis'].wormholes = new Array();
quads['Serpens Comedentis'].wormholes[0] = new Wurmloch(30,41);
quads['Serpens Comedentis'].wormholes[1] = new Wurmloch(15,3);
quads['Serpens Comedentis'].wormholes[2] = new Wurmloch(3,27);
quads['Serpens Comedentis'].wormholes[3] = new Wurmloch(59,37);
quads['Serpens Comedentis'].wormholes[4] = new Wurmloch(58,54);
quads['Serpens Comedentis'].wormholes[5] = new Wurmloch(24,12);


/*************************************************
 *           Objekte zur Darstellung             *
 *************************************************/        

//Klasse fuer Wurmloch
function Wurmloch(x, y)
{
        this.x = (x-1);
        this.y = (y-1);
}

//Klasse fuer blinkendes Element
function Blinker(element)
{
    this.element = element;
    if(element.nodeName == "a" || element.nodeName == "A")
    {
        this.imageElement = element.childNodes[0];
    }
    else
    {
        this.imageElement = element;
    }
    this.orig_pic = this.imageElement.src;
    
    this.base_url = this.orig_pic.match(/^.*\//)[0];
    
    this.orig_pic.match(/\/([^/]*)$/);
    this.image_name = RegExp.$1;
    
    this.blink = false;
    
    this.imageElement.style.backgroundColor = "#ffffff";
}


/*************************************************
 *           Integration in die GUI              *
 *************************************************/ 

function init(){
    
    
    var href = location.href;
    
    var allTables = document.getElementsByTagName("table");
    var table = allTables[0];
if (table.rows.length < 2) {
    table = allTables[1];
}
    var row1 = table.rows[0];
    
    var td1 = row1.cells[0];
    // quadrantenzeilen sind in divs gebuendelt
    var all_elements = [];
    td1.childNodes.forEach(element => all_elements.push(element.childNodes));
    
    var td2 = row1.cells[1];
    var text = td2.innerHTML;
    text.match(/^(.*) X:/);
    var quad_name = RegExp.$1;
    
    
    
    //UI erzeugen
    
    var start_div = document.createElement("div");
    var start_link = document.createElement("a");
    start_link.style.color = '#00aaff';
    start_link.style.color = '#00ff00';
    start_link.style.fontSize = '15';
    start_link.addEventListener('mouseover', startBlink, true);
    start_link.addEventListener('mouseout', stopBlink, true);
    
    start_link.appendChild(document.createTextNode('Wurmlöcher anzeigen'));
    start_div.appendChild(start_link);
    td1.appendChild(start_div);
    

    //Wurmloecher suchen
    var quad = quads[quad_name];
    var wl = quad.wormholes;
    
    for (var i=0; i < wl.length; i++) 
    {
        var wurmloch = wl[i];        
        var highlight_element = all_elements[wurmloch.y][wurmloch.x];
        var blinker1 = new Blinker(highlight_element);
        all_blinker[i] = blinker1;
    }
}


/*************************************************
 *         Highlighting der Wurmlöcher           *
 *************************************************/ 

var all_blinker = new Array();
var shouldBlink = false;

function blinkMethod()
{
        var act_blink_state = shouldBlink;

    for (var i=0; i < all_blinker.length; i++) 
    {
        var blinker = all_blinker[i];    
        if(act_blink_state == false)
        {
            blinker.imageElement.src = blinker.orig_pic;
        }
        else
        {
            if(blinker.blink == false)
            {
                var img = blinker.base_url+"n.gif";
                blinker.blink = true;
            }
            else
            {
                var img = blinker.orig_pic;
                blinker.blink = false;
            }
            blinker.imageElement.src = img;
        }    
    }
    
    if(act_blink_state == true)
    {
        window.setTimeout(blinkMethod, 250);
    }
}

function startBlink()
{
    if(shouldBlink == false)
    {
        shouldBlink = true;
        blinkMethod();
        //window.setTimeout("blink_meth()", 250);
    }
}

function stopBlink()
{
    shouldBlink = false;
}

//Starten wir das Ganze einfach mal
init();

