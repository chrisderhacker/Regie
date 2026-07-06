# Regieplan Web

Start lokal:

```powershell
npm start
```

Dann im Browser öffnen:

```text
http://localhost:3000
```

Für den Server-Upload werden mindestens diese Dateien benötigt:

- `index.html`
- `server.js`
- `package.json`
- `20260617v1_LV_Regieplan_GREEN_FUTURE.json`

Die Standard-JSON fuer den Regieplan ist:

```text
20260617v1_LV_Regieplan_GREEN_FUTURE.json
```

Diese Datei muss in denselben Ordner wie `server.js` und `index.html`.
Der Server liefert sie dann ueber:

```text
/api/default-project
```

Der Player selbst nutzt weiterhin die Playlist:

```text
https://usa.derhacker.com/GFA_k1_SERVER.json
```

Die eigentlichen Videos liegen unter:

```text
https://usa.derhacker.com/CONTENT/
```

Gespeicherte Versionen landen serverseitig im Ordner `versions/`. Der Ordner wird automatisch erstellt.

Konfiguration:

- `PORT=3000` setzt den Web-Port.
- `DEFAULT_PROJECT=deine_datei.json` setzt eine andere Standard-JSON.
- `PLAYER_PLAYLIST=https://.../playlist.json` setzt die Player-Playlist.
- `PLAYER_ROOT=https://.../CONTENT/` setzt den Root-Ordner fuer Player-Videos.

Player-Videos in einen Regieplan einbetten:

```powershell
node scripts/embed-player-videos.js 20260617v1_LV_Regieplan_GREEN_FUTURE.json https://usa.derhacker.com/GFA_k1_SERVER.json
```

Abgleich zur Kontrolle erzeugen:

```powershell
node scripts/review-embedded-player-videos.js 20260617v1_LV_Regieplan_GREEN_FUTURE.json
```
