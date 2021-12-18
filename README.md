# Greasemonkey Revorix Scriptsammlung
Eine Sammlung von Greasemonkey-Scripten für das Browserspiel
[Revorix](www.revorix.de). Die Scripte erweitern in der Regel das Interface,
schalten unpraktische Dinge ab oder integrieren externe Tools wie etwa
Schiffsplaner. Für die Benutzung wird eines der folgenden Addons benötigt:

* Violentmonkey [Firefox](https://addons.mozilla.org/de/firefox/addon/violentmonkey/), [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)
* Tampermonkey [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

Veraltet, aber vielleicht schon nachgezogen:
* Greasemonkey [Firefox](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)

Der Einfachkeit halber ist im Folgenden nur von Greasemonkey die Rede, es sind
aber immer beide Addons gemeint.

## Installation
Die Scripte sind grob nach Themen sortiert, ohne Anspruch auf Richtigkeit oder
Vollständigkeit. Um ein Script zu installieren, wählt man dieses in der
Github-Ordnerübersicht aus, sodass der Quellcode zu sehen ist. In der Leiste
oberhalb des Codes führt der Schalter `Raw` zu einem Link, den Greasemonkey als
Scriptquelle erkennt und zur Installation anbietet.

Hinweis: Für Scripte mit einer `.meta.js`-Variante muss das Original, welches
auf `.user.js` endet, für die initiale Installation ausgewählt werden. Die
Meta-Varianten sind lediglich für (automatische) Updates bestimmt.

## Updates
Die Scripte sind aus diesem Repository heraus per integrierter Update-URL
aktualisierbar. Standardmäßig werden Scripte automatisch aktualisiert.

## Entwicklung
Neue Scripte werden gerne gesehen, dazu einfach einen Pull Request in diesem
Repository erstellen. Folgende Regeln gilt es zu beachten:

* Das Script **muss** legal in Revorix benutzbar sein. Das bedeutet vor allem,
das keine automatisierten Aktionen (Mausklicks etc.) durchgeführt werden
dürfen. Wenn Zweifel über die Legalität aufkommen, muss vom Revorix-Team die
Unbedenklichkeit bestätigt werden (Ansprechpartner: toasten).

* Das Script **darf nicht** Daten an externe Server senden. Anbindungen an
Clan-Datenbanken etc. sind Sache der Clans, da wir nicht nachvollziehen können,
was am Ende mit den Daten geschieht.

* Das Script sollte in einem thematisch passenden Unterordner abgelegt werden.
Dabei bitte bestehende Verzeichnisse nutzen, soweit möglich.

Ansonsten sind der Kreativität keine Grenzen gesetzt ;)
