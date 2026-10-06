# Deutsche Teilung lernen

Statische Lernseite zur Faktenliste "Von Teheran bis zum Mauerbau". Kein Build-Schritt.

## GitHub Pages

1. Neues Repository anlegen und alle Dateien dieses Ordners in den Hauptzweig committen.
2. Settings > Pages > Source: "Deploy from a branch", Branch `main`, Ordner `/ (root)`.
3. Die Seite liegt danach unter `https://<name>.github.io/<repo>/`.

## Dateien

- `index.html` Grundgerüst und Navigation
- `styles.css` Gestaltung nach dem Designsystem "Claude Design Analysis"
- `data.js` Faktenliste im Wortlaut, Kurzfassungen und Quizantworten
- `app.js` Modi Liste, Mischen, Verdecken, Ordnen, Quiz
