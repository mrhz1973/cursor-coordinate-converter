# Browser QA PASS — waypoint double-click save (reliable)

- **Data:** 2026-05-19
- **Commit testato:** `f2e4ea8` (`fix: make waypoint double click save reliable`)
- **Modalità:** test manuale in browser (GIS)
- **Esito:** **PASS GIS**

## Checklist eseguita

- Apertura pannello Waypoint → entra automaticamente in pick mode: **PASS**.
- Doppio click sulla mappa → waypoint salvato: **PASS**.
- App resta pronta per il waypoint successivo: **PASS**.
- Secondo doppio click → aggiunge un altro waypoint: **PASS**.

## Note

- Conferma utente: **PASS GIS**.
- Nessuna regressione segnalata in questo passaggio.
- Nessuna modifica a runtime / monolite / deploy / tag in questa registrazione (solo docs orchestratore).
- Precedente registrazione PASS più sintetica: `2026-05-19_1330_browser-pass-waypoint-double-click-save.md` (commit `26000f4`). Questo report aggiunge l'esito esplicito del **secondo** doppio click consecutivo.
