// ==UserScript==
// @name Entwicklungsliste
// @namespace coolcow.dyndns.org
// @description Script zum Uebertrag von Schiffsplaenen aus dem Sternenbund nach Revorix
// @author coolius
// @contributor Lord-FaKe
// @include http://www.revorix.info/php/entwicklung_neu.php
// @run-at document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// ==/UserScript==

/*
    Edited by Wintermoon
*/

//Preconditions
var url;
//Should be deprecated because we no longer make use of unsafeWindow
//var isMonkey = typeof unsafeWindow != 'undefined';

//Get the shipname
//if(isMonkey){
var shipname = window.shipname;
//console.log(shipname);

//Add default button
switch (shipname)
{
default :
addButton(shipname + " übernehmen");
break;
}

//Helper function for layout and controls
function addButton(text){
    // console.log("addButton");
    var table = document.getElementsByTagName("table")[0];
   
    var sterbnd = document.createElement("input"); //input element, text
    sterbnd.style.marginBottom = "5px"
    sterbnd.setAttribute('type',"text");
    sterbnd.setAttribute('name',"sterbnd");
    sterbnd.setAttribute('placeholder', "Sternenbund Permalink");
    sterbnd.size = "150";
   
    var plan = document.createElement("input");
    plan.style.marginLeft="5px"
    plan.style.marginBottom = "5px"
    plan.setAttribute("type", "button");
    plan.setAttribute("value", text);
   
    table.parentNode.insertBefore(sterbnd, table.previousSibling);
    table.parentNode.insertBefore(plan, table.previousSibling);
   
    plan.addEventListener('click', addPlan, true);
}

//Eventhandle import modules from Sternenbund
function addPlan()
{
    url = document.getElementsByName('sterbnd')[0].value;
    var elem = url.split('/');
    document.getElementById('shplvl').value = 1 + parseInt(elem[7]); // Schiffsklasse fängt im Sternbund mit 0 an
    //if(isMonkey){
    //Call the page function to set the appropriate shipclass
    window.classy();
    //} else {
        //javascript:classy();
    //}
    var mods = elem[8].split(';');
    console.log(mods);
    for ( var i = 0; i < mods.length; i++ )
    {
        var mod = mods[i].split(',');
        console.log(mod);
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
}