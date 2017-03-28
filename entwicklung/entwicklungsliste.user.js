// ==UserScript==
// @name Entwicklungsliste
// @namespace coolcow.dyndns.org
// @description Script zum Uebertrag von Schiffsplaenen aus dem Sternenbund nach Revorix
// @author coolius
// @contributor Lord-FaKe
// @contributor   Wintermoon
// @downloadURL https://gist.github.com/tpummer/4d383632cb02caf80fbe/raw/entwicklungsliste.user.js
// @updateURL https://gist.github.com/tpummer/4d383632cb02caf80fbe/raw/entwicklungsliste.user.js
// @include http://www.revorix.info/php/entwicklung_neu.php
// @include https://www.revorix.info/php/entwicklung_neu.php
// @version 2.2017032801
// @run-at document-idle
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// ==/UserScript==

//Preconditions
var url = "";
//Should be deprecated because we no longer make use of unsafeWindow
//var isMonkey = typeof unsafeWindow != 'undefined';

//Get the shipname
//if(isMonkey){
//var shipname = window.shipname;
var shipname = $('#v>tbody>tr>td')[2].textContent;
//console.log(shipname);

//Container for layout
var containerControls = document.createElement('div');
var containerLists = document.createElement('div');

//Persistent list
var list = document.createElement('ul');
list.style.marginBottom = "5px"
list.style.marginLeft = "5px"
list.style.float = "left";
//console.log(shipname);

//Eventreciever persistent data
window.addEventListener ("message", recvMessage, false);

//Helper func to reset the persistent variable
function reset() {
    //console.log("Reset persistent variables")
   GM_setValue('urlStore', "");
}

//Add default button
switch (shipname)
{
default :
addButton(shipname + " übernehmen");
//Restore View
viewUrlStore();
break;
}

//Helper function for layout and controls
function addButton(text){
    // console.log("addButton");
    var tablenodes = document.getElementsByClassName("wrpd full");
   baseNode = tablenodes[0].lastChild;
   
    var sterbnd = document.createElement("input"); //input element, text
    sterbnd.style.marginBottom = "5px"
    sterbnd.style.marginLeft = "5px"
    sterbnd.style.float = "left";
    sterbnd.setAttribute('type',"text");
    sterbnd.setAttribute('name',"sterbnd");
    sterbnd.setAttribute('placeholder', "Sternenbund Permalink");
    sterbnd.size = "120";
   
    var shpName = document.createElement("input"); //input element, text
    shpName.style.marginBottom = "5px"
    shpName.style.marginLeft = "5px"
    shpName.style.float = "left";
    shpName.setAttribute('type',"text");
    shpName.setAttribute('name',"shpName");
    shpName.setAttribute('placeholder', "Kommentar");
    shpName.size = "40";
   
    var plan = document.createElement("input");
    plan.style.marginLeft="5px"
    plan.style.marginBottom = "5px"
    plan.style.float = "left";
    plan.setAttribute("type", "button");
    plan.setAttribute("value", text);
    plan.addEventListener('click', addPlan, true);
   
    var resetBtn = document.createElement("input");
    resetBtn.style.marginLeft="5px"
    resetBtn.style.marginBottom = "5px"
    resetBtn.style.float = "left";
    resetBtn.setAttribute("type", "button");
    resetBtn.setAttribute("value", "Reset Url Store");
    resetBtn.addEventListener('click', reset, true);
   
    var saveBtn = document.createElement("input");
    saveBtn.style.marginLeft="5px"
    saveBtn.style.marginBottom = "5px"
    saveBtn.style.float = "left";
    saveBtn.setAttribute("type", "button");
    saveBtn.setAttribute("value", "Bauplan dauerhaft speichern");
    saveBtn.addEventListener('click', sendMessage, true);
   
    //Insert stuff
    baseNode.parentNode.insertBefore(shpName, baseNode.previousSibling);
    baseNode.parentNode.insertBefore(sterbnd, baseNode.previousSibling);
    containerControls.appendChild(plan);
    containerControls.appendChild(saveBtn);   
    containerControls.appendChild(resetBtn); 
    baseNode.parentNode.insertBefore(containerControls, baseNode.previousSibling);
    containerLists.appendChild(list);
    baseNode.parentNode.insertBefore(containerLists, containerControls.nextSibling);
}

//Update view
function viewUrlStore(){
    //console.log("aktualisiere view!");
    var urlStore = GM_getValue('urlStore');
    //console.log(urlStore);
    l = urlStore.split(", ")
    //console.log(l);
    for(var i = 0; i < l.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        // Set its contents:
        item.appendChild(document.createTextNode(l[i]));
        //Add Eventlistener Archive
        item.addEventListener('click', function(){
            //Get URL
            url = this.childNodes[0].nodeValue.split(": ")[1];
            //Add Plan
            addPlan();
        }, true);
        // Add it to the list:
        list.appendChild(item);
    }
    list.parentNode.replaceChild(list, list);
}

//(Helper for checking if String contains something)
function isEmpty(str) {
    return (!str || 0 === str.length);
}

//Message passing endpoint
function sendMessage(){
    //Old value
    if (isEmpty(document.getElementsByName('shpName')[0].value)){
        console.log("Not enough parameter, provide a comment");
        return;
    }
    if (isEmpty(document.getElementsByName('sterbnd')[0].value)){
        console.log("Not enough parameter, provide a link");
        return;
    }
    var urlStore = GM_getValue('urlStore');
    //console.log("persistent: " + urlStore);
    //Add url to list
    if (isEmpty(urlStore)){
        urlStore += document.getElementsByName('shpName')[0].value + " Typ " + document.getElementById('shplvl').value + ": " + document.getElementsByName('sterbnd')[0].value;
    }
    else{
        urlStore += ", " + document.getElementsByName('shpName')[0].value + " Typ " + document.getElementById('shplvl').value + ": " + document.getElementsByName('sterbnd')[0].value;
    }
    //UrlStore
    var objMap = {"Url" : urlStore};
    var messageTxt  = JSON.stringify (objMap);
    window.postMessage (messageTxt, "*");
}

//Message reciever endpoint
function recvMessage(event){
    var messageJSON;
    try {
        messageJSON     = JSON.parse (event.data);
        //console.log(messageJSON);
    }
    catch (zError) {
        // Do nothing
    }
    var safeValue = messageJSON.Url;
    //console.log("recieved value: " + safeValue);
    GM_setValue("urlStore", safeValue);
}

//Eventhandle import modules from Sternenbund
function addPlan()
{
    if (isEmpty(url)){
        url = document.getElementsByName('sterbnd')[0].value;
        if (isEmpty(url)){
            return;
        }
    }
    var elem = url.split('/');
    document.getElementById('shplvl').value = 1 + parseInt(elem[7]); // Schiffsklasse fängt im Sternbund mit 0 an
    //if(isMonkey){
    //Call the page function to set the appropriate shipclass
    unsafeWindow.classy();
    //} else {
        //javascript:classy();
    //}
    var mods = elem[8].split(';');
    //console.log(mods);
    for ( var i = 0; i < mods.length; i++ )
    {
        var mod = mods[i].split(',');
        //console.log(mod);
        for ( j = 0; j < mod[2]; j++ )
        {
            //if(isMonkey){
            //unsafeWindow.add doesn't work anymore:
            //javascript:unsafeWindow.add(mod[0], mod[1]-1);

            /*
               maybe the code in entw.js has changed: 
               //needed by html from server
               window.sorty = sorty;
               window.classy = classy;
               window.sort_parm = sort_parm;
               window.multip is accesses by a DOM 0 callback, no way to get around that
               window.multip = 1;
               //missing line ?:
               window.add = add;
            */

            //Test if sorty is defined should pass
            //console.log(unsafeWindow.sorty);

            //console.log('a[data-tree$="'+mod[0]+'"]');
            var secondIndex = mod[1]-1;
            //console.log('[data-index="'+secondIndex+'"]');

            //Simulate click events:
            var link = $('a[data-tree$="'+mod[0]+'"]').filter('[data-index="'+secondIndex+'"]');
            var evt = document.createEvent ("HTMLEvents");
            evt.initEvent ("click", true, true);
            link[0].dispatchEvent (evt);
            //console.log("added module");
            //} else {
                  //javascript:add(mod[0], mod[1]-1);
            //}
        }
    }
    //console.log(url);
}
