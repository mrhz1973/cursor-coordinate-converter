# GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A — ROUTINE + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A`  
**Categoria:** ROUTINE  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **QA FINALE CHATGPT — PENDING**

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `84e34986d017eae450f045d54c0ea4afd64697f6` |
| Build / ID | **251** / `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` |
| Blob | `7ff2adbecd23bedd4b001ce368720bb279cbcc86` |
| Byte / SHA-256 | `10861207` / `5cac92c2875c864a549ce0bcf52e52dda11fc3ac32e3aa5eef251e519ede7ae9` |
| BASE LIVE | tip `c3bf112…` / **250** / blob `1482ead…` |

## B — Deploy GIS-only — PASS

`git pull` FF su VPS · `goi-gis-app` active · HTTP 200 · Content-Length `10861207`  
Build label servito: `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` · **251**  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=84e3498-abqa251`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A PASS** · **19/19**  
JSON: [`2026-08-24_1042_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-abqa.json`](2026-08-24_1042_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-abqa.json)

Copertura: TXT singolo/multiplo; payload file↔clipboard; DD+MGRS; Unicode; campi vuoti; normalizzazione `|`/newline; selezione ordine lista; zero rete builder; UI dialog; narrow buttons; regressione select formato + resize Nome; no mutazione lat/lon/nome.

## Scope / freeze

Sblocco funzionale **limitato esclusivamente** a questo blocco.  
**Oggetti GIS = FROZEN / MAINTENANCE-ONLY** per ogni altra area (nessuna estensione implicita ad altri backlog).

## Gate

**QA FINALE CHATGPT — PENDING** — Cursor non emette istruzioni QA umane.
