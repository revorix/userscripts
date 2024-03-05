// ==UserScript==
// @name        Capi-Entlassen-Verstecker
// @namespace   Violentmonkey Scripts
// @match       https://game.revorix.de/php/capt_all.php
// @grant       none
// @version     1.0
// @author      -
// @description Verstecke den Entlassen-Link bei Capis mit mehr als 0 xp
// ==/UserScript==

function containsMatchingCell(row, text)
{
  for (var i = 0; i < row.cells.length; i++)
  {
    console.log(row.cells[i])
    if (row.cells[i].firstChild !== null && row.cells[i].firstChild.data == text)
    {
      return true
    }
  }
  return false;
}

function hide0XpCapis()
{
  const rows = document.getElementsByTagName("tr");
  var matchingRows = [];
  for(var i = 0; i < rows.length; i++)
  {
    if(!containsMatchingCell(rows[i], "0/1"))
      if(rows[i].cells.length >= 7)console.log(rows[i].cells[6].firstChild.innerText)
        if(rows[i].cells.length >= 7 && rows[i].cells[6].firstChild.innerText == "entlassen")
          rows[i].cells[6].firstChild.innerHTML = "";
  }
}

hide0XpCapis()
