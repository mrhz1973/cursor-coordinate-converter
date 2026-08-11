# 2026-08-11 20:30 — DOCS-DFLIGHT-WU-0013-OPEN-A — Apertura WU-0013 UAS-GEOZONE-DFLIGHT (docs-only)

## Tipologia intervento

**Docs-only.** Apertura formale di una nuova Work Unit (WU-0013) dedicata alle **Zone Geografiche UAS italiane** (D-Flight ED-269/ED-318) come layer operativo autonomo, distinto da WU-0012.

Base di partenza: report discovery **`CARTO-DFLIGHT-DISCOVERY-A — DIAGNOSTIC COMPLETE / TECHNICAL PLAN READY`** (read-only, stessa data).

## File modificati (task docs-only)

- **`docs/work-units/WU-0013-uas-geozone-dflight.md`** — **NUOVO** file WU completo (21 sezioni): scopo, metodo/limiti, fonti verificate, schema ED-269/ED-318 (4.1–4.5), geometria, verticale, temporale, strategia pipeline, modello dati concettuale, regioni monolite da usare, rendering design, UI/UX MVP, offline/update, performance, piano blocchi D-FLIGHT-A→F, UNKNOWN checklist, OPSEC/rete, collocazione vs WU-0012, decisioni, self-check, prossimo passo.
- **`docs/work-units/WU-0012-carto-index-federated.md`** — aggiunta sezione **"Collegamento a WU-0013 — UAS-GEOZONE-DFLIGHT"** in fondo. Solo cross-reference; **nessuna duplicazione** del piano D-Flight.
- **`docs/work-units/WU-0005-0009-roadmap.md`** — aggiunta sezione **"WU-0013 — UAS-GEOZONE-DFLIGHT"** subito dopo `CARTO-INDEX-FEDERATED-A`.
- **`docs/OPERATING_MEMORY.md`** — aggiunta voce WU-0013 in §7 (stato vivo) + riga WU-0013 nella tabella §8 Work unit.
- **`docs/orchestrator/latest.md`** — aggiornato "Ultimo aggiornamento" con apertura WU-0013 docs-only.
- **`docs/runtime/LAST_CURSOR_REPORT.md`** — LATEST + HISTORY aggiornati (disciplina F3: container corrente `PENDING_SELF_REFERENCE`, HEAD finale `EXTERNAL_ONLY`).

## File NON modificati

- **`coordinate_converter Claude.html`** — **invariato** (vincolo operativo esplicito dell'operatore).
- Build / `APP_BUILD_ID` / `APP_BUILD_NUM` — invariati (nessun bump).
- IndexedDB / `state` / storage / sanitizer / OPSEC / rete — invariati.
- Workbench / Oggetti GIS — **FROZEN** (non toccati).
- `docs/checkpoint.md` / `docs/session-geolocalizzazione-e-mappa.md` — legacy/storico, non toccati.
- `docs/roadmap.md` — non incluso nel commit autosync (intervento docs-only su WU corrente).

## Stato WU-0013

**`OPEN / DISCOVERY COMPLETE / NO RUNTIME — NEXT DFLIGHT-REAL-DATA-VALIDATE-A`**

- Discovery: **`CARTO-DFLIGHT-DISCOVERY-A — DIAGNOSTIC COMPLETE / TECHNICAL PLAN READY`** (read-only).
- Blocco apertura: **`DOCS-DFLIGHT-WU-0013-OPEN-A — CLOSED / PASS DOCS-ONLY`**.
- Runtime live monolite riferimento: **`ac3a0ea` / `MAP-ZOOM-FOCUS-ANCHOR-A-FIX1 · build 157`** (invariato).

## D-Flight come layer operativo UAS separato

D-Flight è semanticamente un **layer operativo di spazio aereo UAS** (dataset vettoriale dinamico con geometria, verticalità, temporalità, regole, contatti), non una carta cartografica statica IGM/IIM/CIGA/UKHO. Condivide con WU-0012 solo il **pattern architetturale overlay** (SVG, layer menu, helper coordinate, sanitizer), non il modello dati. Modello dati concettuale autonomo `dflightZones[]` (cap 5000 default, transiente session-only per MVP), separato da `mapWaypoints`/`cartoArchiveRecords`/`track`/`gisPolygons`.

## NEXT registrato

**`DFLIGHT-REAL-DATA-VALIDATE-A`** — diagnostic read-only, gate obbligatorio prima di qualsiasi runtime:

- Operatore fornisce copia JSON reale IT in `C:\tmp\goi-carto-provider-next\dflight\` (uso ordinario portale D-Flight con credenziali BASE/PRO dell'operatore; nessuna condivisione credenziali; nessun login automatico).
- Cursor: parsing diagnostico fuori repo; verifica variante V1/V2/V3; metriche reali (byte, SHA-256, count zone, primitive Polygon/Circle, vertici max/avg/median, bbox, distribuzione restriction/reason).
- Output: report diagnostico in `/tmp/NN-goi-gis-riepilogo.md` + inbox; nessun runtime; nessun commit dataset nel repo.

## Piano blocchi futuro (NON auto-aperti)

| Blocco | Categoria | Note |
| --- | --- | --- |
| DFLIGHT-REAL-DATA-VALIDATE-A | DIAGNOSTIC | gate obbligatorio pre-runtime |
| D-FLIGHT-A ingest/parser | ROUTINE (post validate) | parser tollerante V1/V2/V3; sanitizer |
| D-FLIGHT-B normalized model | ROUTINE | `dflightNormalizeZone`; bbox derived |
| D-FLIGHT-C overlay renderer | ROUTINE leggero | `drawDflightOverlay` SVG; reuse helpers IGM |
| D-FLIGHT-D Layers toggle/legend | ROUTINE | sezione "Cataloghi"; legenda restriction; i18n IT |
| D-FLIGHT-E zone details | ROUTINE se pannello GIS normale; DELICATO se lifecycle `<dialog>` | click zona → pannello |
| D-FLIGHT-F update/offline | DELICATO | IndexedDB opt-in; export; update OPSEC-gated |

Classificazione futura vincolata (decisione operatore): A→D ROUTINE post validate; E ROUTINE/DELICATO; F DELICATO. Bundle coerente consigliato: A→E in unico bundle ROUTINE se E resta su pannello GIS normale.

## Strategia raccomandata (NO runtime)

Import manuale JSON (drag-drop/file picker) → parser JS tollerante V1/V2/V3 → normalizzazione in memoria → render SVG via pattern esistente `drawCartoIgmOverlay` + `cartoGeomToSvgPathD` + `tileMapLatLonToPx`. Nessuna fetch automatica; OPSEC/offline-first; L10N IT only per MVP (rule 32).

## QA / verifiche

- **Nessuna QA operatore** richiesta in blocco docs-only puro (no runtime, no deploy).
- **Pre-flight git:** repo root `cursor-coordinate-converter`, branch `main`, working tree pulito, HEAD = origin/main = `git ls-remote` = `fc2d1a4` pre-scrittura.
- **Self-check WU-0013 §20:** tutte le caselle verificate (monolite non toccato; nessun bump/deploy/runtime; Workbench FROZEN; nessuna fetch automatica/login/credenziali; WU-0012 non duplicata; L10N freeze rispettato; NEXT registrato; discovery richiamata).
- **Verifiche tecniche eseguibili in docs-only:** `git status --short`, `git diff --stat`, consistenza dei link tra file docs vivi.

## Rischi residui / limiti

- **Dataset IT reale NON disponibile** in questa fase: endpoint JSON ED-269 italiano è dietro autenticazione BASE/PRO (URL live UNKNOWN). Tutte le metriche di dimensioni/performance in WU-0013 sono stime da dataset pubblici comparabili (Francia) e da schema EUROCONTROL — da confermare in `DFLIGHT-REAL-DATA-VALIDATE-A`.
- **ToS redistribuzione UNKNOWN** per il JSON ED-269 IT: fail-closed; nessun commit dataset nel repo; nessun download automatico.
- **Nessun blocco runtime aperto**: D-FLIGHT-A→F restano candidati; sono registrati come piano, non come lavori in corso.

## Prossimo passo consigliato

1. **`DFLIGHT-REAL-DATA-VALIDATE-A`** (diagnostic) — decisione operatore per fornitura campione JSON IT.
2. In alternativa: provider WU-0012 (IIM/CIGA/UKHO / online update) — decisione operatore.
3. In alternativa: backlog **MODAL-OPEN-TOP-ALIGN-A**.

Nessun auto-start.

## Monolite

**`coordinate_converter Claude.html` invariato** (vincolo rispettato).

## Working tree (pre-autosync)

`git status --short` post-scrittura docs (prima del commit autosync corrente): `EXTERNAL_ONLY` per la disciplina F3; lo stato finale post-autosync appartiene al report Cursor esterno + commit task `docs: open WU-0013 UAS-GEOZONE-DFLIGHT (docs-only)`.

## Disciplina F3

- `real_task_commit` = SHA commit task docs-only (`docs: open WU-0013 UAS-GEOZONE-DFLIGHT (docs-only)`), noto prima dell'autosync.
- SHA commit autosync corrente = `EXTERNAL_ONLY`.
- HEAD finale post-autosync = `EXTERNAL_ONLY`.
- `git status` finale post-autosync = `EXTERNAL_ONLY`.
- `git ls-remote` del container corrente = `EXTERNAL_ONLY`.
- Nessun terzo commit; nessun amend; nessun finalize-hash.
