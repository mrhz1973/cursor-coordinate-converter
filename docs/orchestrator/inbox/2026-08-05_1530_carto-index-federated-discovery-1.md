# Inbox — CARTO-INDEX-FEDERATED-A-DISCOVERY-1

**Data:** 2026-08-05 ~15:30 Europe/Rome  
**Gate:** `CARTO-INDEX-FEDERATED-A-DISCOVERY-1 — COMPLETE / NO RUNTIME`  
**Tipo:** docs-only discovery (fonti, formati, licenze, schema)  
**real_task_commit:** `2abbaebaa259d1af0706b8aec5e29cc36a14ec1b`  
**Subject:** `docs(carto): open federated chart index discovery`

## Cosa è stato fatto

1. Pre-flight PASS su baseline `8a7ba36` → task pushato `2abbaeb`; branch `main`; monolite tip live `8e3cee4` / `MAP-BOX-ZOOM-A-FIX1` · build 117 **invariato**.
2. Aperta Work Unit [`docs/work-units/WU-0012-carto-index-federated.md`](../../work-units/WU-0012-carto-index-federated.md) — stato `OPEN / DISCOVERY PHASE 1`.
3. Verificate fonti ufficiali **IGM / IIM / CIGA / UKHO-ADMIRALTY** (HTTP, formati, accesso, licenze con `UNKNOWN` dove non provato).
4. Scaricati e analizzati campioni IGM SHP **fuori repo** (`C:\tmp\goi-carto-discovery\igm\`) + CAL UKHO XLS metadati.
5. Matrice provider, schema provider-neutral, formato pacchetto raccomandato (ZIP+manifest), contratto motore spaziale, archivio personale, OPSEC.
6. MVP raccomandato: **IGM** (serie 50+100V geo WGS84 prima).
7. Aggiornati OM §7, roadmap § CARTO-INDEX, HANDOFF.

## File repository (commit task)

- `docs/work-units/WU-0012-carto-index-federated.md` (nuovo)
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/OPERATING_MEMORY.md`
- `docs/HANDOFF.md`

**Monolite:** **non modificato**; **escluso** dal commit task e dall’autosync.

## Campioni fuori repo (non in Git)

| File | Byte | SHA-256 |
| --- | --- | --- |
| serie_25v_wgs84.zip | 577452 | 7D373942F7BA472D456572E7701AEC7C3CF2F3C52E9C28CF22E0FCDEA58B489F |
| serie_25_wgs84_geo.zip | 380000 | 6AB6629C2C305D8A032E91990DC6B956ABE292719A7A8642582701E37D5C635A |
| serie_50_wgs84_geo.zip | 199745 | 1F62D8B3E11E2609D081F3E8BB7FD7B9E0A3BF24DEB34633B207EC9D9413F627 |
| serie_100_wgs84.zip | 65797 | 9020C818E86C0CAC420AB630158068DC30E0E897C6DD3531D0931442AE7DB8FF |
| serie_25kauto.zip | 73216 | D35A768C0E4CFDDBA26011C090B90D7A057888ECA8E558D6641CE61AB24C0F1E |
| Chart_Availability_List_0.xls (UKHO CAL) | 961536 | 45DDF127CD27347C7ED07417C972557AF41060F0EE9C12EEC0B39887B1366A45 |

## Matrice sintetica

| Provider | Impronte | Accesso | Licenza indice derivato | Strategia |
| --- | --- | --- | --- | --- |
| IGM | PROVATO (SHP) | Libero download quadri | UNKNOWN / RICHIEDE AUTORIZZAZIONE | Conversione offline locale |
| IIM | NON DISPONIBILE / UNKNOWN | PDF libero; carte commerciali | RICHIEDE AUTORIZZAZIONE | Sospeso |
| CIGA | NON DISPONIBILE / UNKNOWN | Commerciale | UNKNOWN / RICHIEDE AUTORIZZAZIONE | Digitalizzazione futura / sospeso |
| UKHO | NON DISPONIBILE in CAL | Catalogo pubblico; prodotti protetti | UNKNOWN / RICHIEDE AUTORIZZAZIONE | Online esplicito post-ToS; non MVP |

## QA

- Discovery documentale: controlli URL ufficiali, nessun monolite, nessun file cartografico in repo — **PASS tecnico docs**.
- QA operatore runtime: **N/A** (NO RUNTIME).
- Deploy: **non eseguito**.

## Working tree (post-task / pre-autosync)

Pulito dopo push `2abbaeb` (solo artefatti autosync da creare in questo commit).

## Prossimo passo

Chiarimento licenza IGM **oppure** blocco `CARTO-IGM-ACQUIRE-A` (conversione offline) solo dopo decisione operatore. Nessun auto-start runtime.

## Limiti

- GDAL/OGR assenti sul PC discovery (analisi SHP via Python stdlib).
- Licenza redistribuzione indici IGM non chiarita.
- ADC ZIP non unpackati (ToS/impronte UNKNOWN).
- Fatti del commit autosync corrente: **EXTERNAL_ONLY** (omessi).
