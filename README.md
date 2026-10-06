# Deutsche Teilung lernen

Lernseite zur Faktenliste "Von Teheran bis zum Mauerbau: War die deutsch-deutsche Teilung unvermeidbar?" aus dem Geschichtsunterricht. 25 Ereignisse von 1943 bis 1958, jeweils mit Zeitpunkt, historisch wichtigem Fakt und Bedeutung für die Entstehung der Teilung.

Reines HTML, CSS und JavaScript. Kein Build-Schritt, keine Abhängigkeiten, läuft auf GitHub Pages.

## Modi

| Modus | Zweck |
|---|---|
| Liste | Die vollständige Faktenliste im Wortlaut. |
| Mischen | Ein zufälliger Fakt mit allen drei Spalten. Jeder Fakt erscheint einmal, bevor sich etwas wiederholt. |
| Verdecken | Wie Mischen, aber ein oder zwei Spalten sind verdeckt und lassen sich einzeln aufdecken. Die verdeckte Fläche hat eine feste Größe, die Textlänge ist nicht erkennbar. "Nochmal später" legt den Fakt wieder in den Stapel. |
| Ordnen | Kurzfassungen der Fakten den chronologisch sortierten Daten zuordnen. Zwei Karten antippen tauscht sie. Runden mit 5, 8, 12 oder allen Fakten. |
| Quiz | Fragen zu Fakt, Bedeutung und Datum, frei kombinierbar, mit 10, 25 oder allen Fragen. |

### Quizstufen

**Normal:** Aus drei ähnlich formulierten Antworten die zutreffende wählen. Die beiden anderen enthalten je eine gezielte Abweichung.

**Schwer:**
- Einzelne Aussagen als richtig oder falsch bewerten, ohne Vergleichsantworten.
- Ein Ereignis nur anhand seiner Bedeutung erkennen.
- Monat und Jahr selbst eintippen. Bei Zeiträumen zählt der Beginn.

Nach jeder Antwort erscheint der Wortlaut der Liste. Falsch beantwortete Fragen kommen am Ende einmal zurück. Die Auswertung zeigt das Ergebnis je Bereich und bietet an, nur die Fehler zu wiederholen.

### Tastatur

- Pfeil rechts: nächster Fakt in Mischen und Verdecken
- 1 bis 4 oder A bis D: Antwort im Quiz wählen
- Esc: Menü schließen

## Lokal öffnen

`index.html` im Browser öffnen. Ein Server ist nicht nötig.

## Auf GitHub Pages veröffentlichen

1. Alle Dateien dieses Ordners in den Hauptzweig eines Repositorys committen.
2. Settings > Pages > Source: "Deploy from a branch", Branch `main`, Ordner `/ (root)`.
3. Die Seite liegt nach kurzer Zeit unter `https://<name>.github.io/<repo>/`.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Grundgerüst und Navigation |
| `styles.css` | Gestaltung, Farben für helles und dunkles Farbschema, Umbrüche für Handy, Tablet und PC |
| `data.js` | Faktenliste im Wortlaut, Kurzfassungen für Ordnen, Quizantworten |
| `app.js` | Logik der fünf Modi |
| `.nojekyll` | Schaltet die Jekyll-Verarbeitung von GitHub Pages ab |

## Inhalte anpassen

Alle Inhalte stehen in `data.js`. Jeder Eintrag in `FAKTEN` hat diese Felder:

| Feld | Bedeutung |
|---|---|
| `z`, `f`, `b` | Zeitpunkt, Fakt und Bedeutung im Wortlaut der Liste |
| `d`, `n` | Datum und Ereignisname getrennt |
| `o` | Sortierschlüssel `JJJJMMTT` für die Reihenfolge in Ordnen |
| `s` | Kurzfassung für Ordnen, ohne Datum und Ereignisname |
| `qf`, `qb`, `qd` | Je drei Quizantworten zu Fakt, Bedeutung und Datum. Die erste ist die richtige. |
| `y`, `mon` | Akzeptierte Jahre und Monate für die Eingabe in der schweren Stufe. `mon: null` blendet das Monatsfeld aus. |

Die Quizantworten und Kurzfassungen sind eigene Formulierungen und gehören nicht zur Liste aus dem Unterricht.

## Gestaltung

Farben, Schrift, Abstände und Komponenten folgen dem Designsystem "Claude Design Analysis": cremefarbener Grund, Korallrot für die Hauptaktion, Serifenschrift für Überschriften. Das dunkle Farbschema richtet sich nach der Systemeinstellung.

Die Schriften Cormorant Garamond und Inter werden von Google Fonts geladen. Ohne Netz greifen Systemschriften.

## Hinweise

- Lernstände werden nicht gespeichert. Ein Neuladen setzt alle Modi zurück.
- Die Liste führt "März 1948: Stillstand im Alliierten Kontrollrat" hinter der Berliner Blockade. Der Modus Liste behält diese Reihenfolge, Ordnen sortiert chronologisch.