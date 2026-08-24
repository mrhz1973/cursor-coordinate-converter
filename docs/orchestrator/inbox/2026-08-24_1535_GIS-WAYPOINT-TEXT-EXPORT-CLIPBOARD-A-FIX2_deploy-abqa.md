# GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2 — ROUTINE + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2`  
**Parent:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1` (252) — QA FAIL operatore (copia multi ancora 1 riga)  
**Categoria:** ROUTINE  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **CLOSED / PASS** (QA operatore PASS · Regola H)

## Finding

Su URL GIS `http://…` (non secure context) `navigator.clipboard` è assente. Il fallback `execCommand` montava un `<textarea readonly>` fuori / sul dialog sbagliato: focus-trap del `<dialog>` → copia incompleta / stale (1 waypoint). L’export `.txt` non usa clipboard → funzionava.

## Fix (255)

- Bundle unico `getWaypointsPlainTextExportBundle()` per TXT e Copia testo
- Selezione canonica: `waypointModalSelectedRowIds` poi DOM
- `copyTextExecCommandFallback`: host preferito `#waypointExportDialog`, **senza readonly**, retry su `body`
- Path HTTP sync (niente await Clipboard API che non esiste)

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `0a4b52b9ccc2b3a230366021f51285a961798b8b` |
| Build / ID | **255** / `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2` |
| Blob | `e8f5d3c09fcd5ac0a255cf368a51daf3dfbd1a73` |
| Byte / SHA-256 | `10867044` / `09e01fe3a5d11965e5109bedecc155ecc95693599016c8d000fa59b5147feaaa` |
| BASE | tip `4ad3b52` / FIX1 **252** |

## B — Deploy GIS-only — PASS

HTTP 200 · Content-Length `10867044` · build **255**  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=0a4b52b-abqa255`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2 PASS** · **20/20**  
JSON: [`2026-08-24_1535_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2-abqa.json`](2026-08-24_1535_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2-abqa.json)

Prove contenuto reale (HTTP, no Clipboard API): intercept `document.execCommand('copy')` sul textarea temp → **3 righe** con nominativi distinti `AlphaXP` / `BetaXP` / `GammaXP` **identici** al bundle TXT; host `#waypointExportDialog`; copia singola 1 riga; zero rete; no mutazione.

## Gate

**CLOSED / PASS** — `QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2 PASS operatore` → finito Regola H · LIVE **255**
