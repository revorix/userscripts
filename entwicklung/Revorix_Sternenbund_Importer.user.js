// ==UserScript==
// @name Revorix_Sternenbund_Importer
// @namespace foo.ddnss.de
// @description Script zum Uebertrag von Schiffsplaenen aus dem Sternenbund nach Revorix
// @contributor Wintermoon
// @contributor Lord-FaKe
// @author   coolius
// @downloadURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/Revorix_Sternenbund_Importer.user.js
// @updateURL https://raw.githubusercontent.com/tpummer/gm-revorix/master/entwicklung/Revorix_Sternenbund_Importer.user.js
// @include http*revorix.info/php/entwicklung_neu.php*
// @version 3.2017053101
// @run-at document-idle
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// ==/UserScript==

/*
    Recreated by Wintermoon
*/

//Get the shipname
var shipname = $('#v>tbody>tr>td')[2].textContent;

//Target Table
var targetTable = null;

//Eventreciever persistent data
window.addEventListener("message", recvMessage, false);

//Helper func to reset the persistent variable
function reset() {
    GM_setValue('urlStore', "");
    var element = document.getElementsByClassName("wrp ce")[1];
    element.outerHTML = "";
    delete element;
    addButton(shipname + " übernehmen");
    viewUrlStore();
}

//Add default button
switch (shipname) {
    default: addButton(shipname + " übernehmen");
    //Restore View
    viewUrlStore();
    break;
}

//Helper function for layout and controls
function addButton(text) {
    // console.log("addButton");

    var sterbnd = document.createElement("input"); //input element, text
    sterbnd.style.marginBottom = "5px";
    sterbnd.style.marginLeft = "5px";
    sterbnd.setAttribute('type', "text");
    sterbnd.setAttribute('name', "sterbnd");
    sterbnd.setAttribute('placeholder', "Sternenbund Permalink");
    sterbnd.size = "120";

    var shpName = document.createElement("input"); //input element, text
    shpName.style.marginBottom = "5px";
    shpName.style.marginLeft = "5px";
    shpName.setAttribute('type', "text");
    shpName.setAttribute('name', "shpName");
    shpName.setAttribute('placeholder', "Kommentar");
    shpName.size = "40";

    var plan = document.createElement("input");
    plan.style.marginLeft = "5px";
    plan.style.marginBottom = "5px";
    plan.setAttribute("type", "button");
    plan.setAttribute("value", text);
    plan.setAttribute("class", "button");
    plan.addEventListener('click', function() {
        url = document.getElementsByName('sterbnd')[0].value;
        addPlan(url);
    }, true);

    var resetBtn = document.createElement("input");
    resetBtn.style.marginLeft = "5px";
    resetBtn.style.marginBottom = "5px";
    resetBtn.setAttribute("type", "button");
    resetBtn.setAttribute("class", "button");
    resetBtn.setAttribute("value", "Alle gespeicherten Pläne löschen");
    resetBtn.addEventListener('click', reset, true);

    var saveBtn = document.createElement("input");
    saveBtn.style.marginLeft = "5px";
    saveBtn.style.marginBottom = "5px";
    saveBtn.setAttribute("type", "button");
    saveBtn.setAttribute("class", "button");
    saveBtn.setAttribute("value", "Bauplan dauerhaft speichern");
    saveBtn.addEventListener('click', sendMessage, true);

    var resetModulesBtn = document.createElement("input");
    resetModulesBtn.style.marginLeft = "5px";
    resetModulesBtn.style.marginBottom = "5px";
    resetModulesBtn.setAttribute("type", "button");
    resetModulesBtn.setAttribute("class", "button");
    resetModulesBtn.setAttribute("value", "Alle Module entfernen");
    resetModulesBtn.addEventListener('click', clearModules, true);

    //Insert stuff
    baseNode = document.getElementsByClassName("wrp ce")[0];

    //Frame for targetTable
    var targetDiv = document.createElement('div');
    targetDiv.className = 'wrp ce';

    //The targetTable itself
    targetTable = document.createElement("table");
    targetTable.setAttribute("id", "shipDevStorage");
    targetTable.className = 'wrpd full';

    var dtop1 = document.createElement('div');
    var dtop2 = document.createElement('div');
    var dtop3 = document.createElement('div');
    dtop1.className = 'tl';
    dtop2.className = 'tr';
    dtop3.className = 'tc';
    dtop2.appendChild(dtop3);
    dtop1.appendChild(dtop2);

    var dsid1 = document.createElement('div');
    var dsid2 = document.createElement('div');
    dsid1.className = 'ml';
    dsid2.className = 'mr';

    var dbot1 = document.createElement('div');
    var dbot2 = document.createElement('div');
    var dbot3 = document.createElement('div');
    dbot1.className = 'bl';
    dbot2.className = 'br';
    dbot3.className = 'bc';
    dbot2.appendChild(dbot3);
    dbot1.appendChild(dbot2);

    dsid2.appendChild(targetTable);
    dsid1.appendChild(dsid2);
    targetDiv.appendChild(dtop1);
    targetDiv.appendChild(dsid1);
    targetDiv.appendChild(dbot1);

    targetTable.appendChild(document.createElement('tr'));
    targetTable.appendChild(document.createElement('tr'));
    targetTable.rows[0].appendChild(document.createElement('td'));
    targetTable.rows[0].appendChild(document.createElement('td'));
    targetTable.rows[0].appendChild(document.createElement('td'));

    targetTable.rows[0].cells[0].appendChild(sterbnd).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");
    targetTable.rows[0].cells[1].appendChild(shpName).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");
    targetTable.rows[0].cells[2].appendChild(plan).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");
    targetTable.rows[1].appendChild(document.createElement('td'));
    targetTable.rows[1].appendChild(document.createElement('td'));
    targetTable.rows[1].appendChild(document.createElement('td'));
    targetTable.rows[1].cells[0].appendChild(resetBtn).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");
    targetTable.rows[1].cells[1].appendChild(resetModulesBtn).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");
    targetTable.rows[1].cells[2].appendChild(saveBtn).setAttribute("style", "margin: auto; display: block; text-align: center; vertical-align: middle;");

    baseNode.parentNode.insertBefore(targetDiv, baseNode.nextSibling);
}

//Update view
function viewUrlStore() {
    if (!GM_getValue('urlStore')) {
        console.log("define Urlstore first time");
        GM_setValue('urlStore', "");
    }
    var urlStore = GM_getValue('urlStore');
    l = urlStore.split(", ");
    if (typeof l[0] !== 'undefined' && l[0] !== null && l[0] !== "") {
        //Start from row 2
        var basecnt = 2;
        for (var i = 0; i < l.length; i++) {
            // Set its contents:
            var item = document.createElement('div');
            item.appendChild(document.createTextNode(l[i]));
            //Add Eventlistener Archive
            item.addEventListener('click', function() {
                //Get URL
                var url = this.childNodes[0].nodeValue.split(": ")[1];
                //Add Plan
                addPlan(url);
            }, true);
            // Add it to the list:
            targetTable.appendChild(document.createElement('tr'));
            targetTable.rows[basecnt + i].appendChild(document.createElement('td'));
            targetTable.rows[basecnt + i].appendChild(document.createElement('td'));
            targetTable.rows[basecnt + i].appendChild(document.createElement('td'));
            targetTable.rows[basecnt + i].cells[0].appendChild(item);
            //Empty cell for better look and feel
            targetTable.rows[basecnt + i].cells[2].outerHTML = "<td></td>";

            var delbtn = document.createElement("a");
            delbtn.setAttribute("style", "margin: auto; display: block;");
            delbtn.setAttribute("id", i);
            delbtn.setAttribute("role", "button");
            delbtn.setAttribute("tabindex", "0");
            delbtn.setAttribute("style", "color: red;");
            delbtn.innerHTML = "X";
            delbtn.addEventListener('click', function() {
                //Recreate urlStore
                urlStore = GM_getValue('urlStore');
                l = urlStore.split(", ");
                urlStore = "";
                for (var i = 0; i < l.length; i++) {
                    if (i == this.getAttribute("id")) {
                        continue;
                    } else {
                        if (isEmpty(urlStore)) {
                            urlStore += l[i];
                        } else {
                            urlStore += ", " + l[i];
                        }
                    }
                }
                //Recreate this view
                GM_setValue("urlStore", urlStore);
                var element = document.getElementsByClassName("wrp ce")[1];
                element.outerHTML = "";
                delete element;
                addButton(shipname + " übernehmen");
                viewUrlStore();
            }, true);
            targetTable.rows[basecnt + i].cells[1].setAttribute("style", "text-align: center; vertical-align: middle;");
            targetTable.rows[basecnt + i].cells[1].appendChild(delbtn);
        }
    }
}

//(Helper for checking if String contains something)
function isEmpty(str) {
    return (!str || 0 === str.length);
}

//Message passing endpoint
function sendMessage() {
    //Old value
    if (isEmpty(document.getElementsByName('shpName')[0].value)) {
        console.log("Not enough parameter, provide a comment");
        return;
    }
    if (isEmpty(document.getElementsByName('sterbnd')[0].value)) {
        console.log("Not enough parameter, provide a link");
        return;
    }
    var urlStore = GM_getValue('urlStore');
    //console.log("persistent: " + urlStore);
    //Add url to list
    if (isEmpty(urlStore)) {
        urlStore += document.getElementsByName('shpName')[0].value + " Typ " + document.getElementById('shplvl').value + ": " + document.getElementsByName('sterbnd')[0].value;
    } else {
        urlStore += ", " + document.getElementsByName('shpName')[0].value + " Typ " + document.getElementById('shplvl').value + ": " + document.getElementsByName('sterbnd')[0].value;
    }
    //UrlStore
    var objMap = { "Url": urlStore };
    var messageTxt = JSON.stringify(objMap);
    window.postMessage(messageTxt, "*");
}

function clearModules() {
    //var entfn = document.getElementsByClassName("smallbt");
    var entfn = $("a.smallbt");
    //console.log(entfn);
    cnt = entfn.length;
    (function theLoop(cnt, entfn) {
        if (cnt > 0) {
            if (entfn[cnt - 1].text == " entf.") {
                //console.log("removing Module");
                setTimeout(function() {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("click", true, true);
                    entfn[cnt - 1].dispatchEvent(evt);
                    // DO SOMETHING WITH data AND stuff
                    if (--cnt) { // If i > 0, keep going
                        theLoop(cnt, entfn); // Call the loop again
                    }
                }, 500);
            } else {
                if (--cnt) { // If i > 0, keep going
                    theLoop(cnt, entfn); // Call the loop again
                }
            }
        }
    })(cnt, entfn);
}

//Message reciever endpoint
function recvMessage(event) {
    var messageJSON;
    try {
        messageJSON = JSON.parse(event.data);
        //console.log(messageJSON);
    } catch (zError) {
        // Do nothing
    }
    var safeValue = messageJSON.Url;
    //console.log("recieved value: " + safeValue);
    GM_setValue("urlStore", safeValue);
    var element = document.getElementsByClassName("wrp ce")[1];
    element.outerHTML = "";
    delete element;
    addButton(shipname + " übernehmen");
    viewUrlStore();
}

//Eventhandle import modules from Sternenbund
function addPlan(url) {
    if (isEmpty(url)) {
        return;
    }
    var elem = url.split('/');
    document.getElementById('shplvl').value = 1 + parseInt(elem[7]); // Schippclass starts at zero index
    unsafeWindow.classy();
    var mods = elem[8].split(';');
    //console.log(mods);
    for (var i = 0; i < mods.length; i++) {
        var mod = mods[i].split(',');
        //console.log(mod);
        for (j = 0; j < mod[2]; j++) {
            //Test if sorty is defined should pass
            //console.log(unsafeWindow.sorty);

            //console.log('a[data-tree$="'+mod[0]+'"]');
            var secondIndex = mod[1] - 1;
            //console.log('[data-index="'+secondIndex+'"]');

            //Add mods
            var link = $('a[data-tree$="' + mod[0] + '"]').filter('[data-index="' + secondIndex + '"]');
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true);
            link[0].dispatchEvent(evt);
        }
    }
}