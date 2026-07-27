# INFRA-GH-1A-1B-DOCS-CLOSE — riconciliazione documentale

**Data:** 2026-07-27  
**Tipo:** docs-only (repository GIS)  
**Task commit (pre-autosync):** `b3217f559b945f41d854fa78ec4148153b476320` — `docs(infra): close GraphHopper 1A and 1B after VPS PASS`

## Obiettivo

Registrare nel repository GIS lo stato conclusivo verificato dell'infrastruttura GraphHopper e sbloccare formalmente **OUTDOOR-ROUTING-GH-B2** come **READY / NEXT RUNTIME BUNDLE**.

## Pre-flight GIS (inizio intervento)

| Campo | Valore |
|-------|--------|
| repo root | `cursor-coordinate-converter` |
| branch | `main` |
| HEAD / origin / ls-remote | `325c4d9aa23dd8d3b2522500147ef62354cbad92` |
| workspace | pulito |
| monolite blob | `db0d669db330466cf07a90db143e3c0922ec443c` |

## Fonti evidenza (PoC fuori repo)

- `C:\tmp\127-goi-gis-riepilogo.md`
- `graphhopper-poc\reports\INFRA-GH-1A-FREEZE-B-REPORT.md`
- `graphhopper-poc\reports\INFRA-GH-1A-IMPORT-B-REPORT.md`
- `graphhopper-poc\reports\INFRA-GH-1B-MMAP-SMOKE-LOCAL-REPORT.md`
- `graphhopper-poc\reports\INFRA-GH-1B-WRITE-REPORT.md`
- `graphhopper-poc\reports\INFRA-GH-1B-WRITE-SOAK.json`

## Verifica VPS read-only (2026-07-27)

- `goi-graphhopper.service`: active, enabled; NRestarts=0; MemoryCurrent ~254 MiB
- Bind: `100.114.7.53:8989`, `127.0.0.1:8990`; nessun bind pubblico 8989
- `/info` HTTP 200; version 11.0; elevation true; profili hiking, hiking_easy, mtb_touring, mtb_trail
- Swap: `/swapfile` 1 GiB attivo (~1.3 MiB used)
- n8n running; goi-gis-app active; goi-nav-proxy active; nginx/tailscaled active

## Stato registrato

### INFRA-GH-1A — CLOSED / PASS end-to-end

Fase A, QA CORS, FREEZE-B, Import B (cache nord-ovest-B 16 file / 790681035 B / CH×4 / elevation), MMAP smoke locale, diag-A preservata.

### INFRA-GH-1B — CLOSED / PASS end-to-end

Deploy VPS release `20260727-0400-gh11-nordovest-b`; endpoint `http://100.114.7.53:8989`; MMAP; soak 30 min PASS; CORS tailnet PASS; ACL tcp:8989 PASS operatore; servizi co-located invariati.

### OUTDOOR-ROUTING-GH-B2

**READY / NEXT RUNTIME BUNDLE** — endpoint disponibile; **non** implementato nel monolite; bundle **DELICATO**; review pre-deploy obbligatoria.

### GIS runtime

Monolite tip `ff43878`, build 59, blob `db0d669…` — **non modificato** in questo intervento.

## File modificati (task commit)

- `docs/OPERATING_MEMORY.md` §7
- `docs/HANDOFF.md`
- `docs/INFRA_VPS.md`
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md`
- `docs/work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md`
- `docs/work-units/WU-0005-0009-roadmap.md` (riferimenti diretti)

## Non toccato

- `coordinate_converter Claude.html` (monolite)
- PoC `graphhopper-poc`
- VPS write/restart (solo read-only verify)
- OUTDOOR-ROUTING-GH-B2 runtime

## QA

- **QA operatore:** non applicabile (blocco docs-only)
- **PASS tecnico task:** commit docs creato localmente pre-autosync

## Prossimo passo

Aprire bundle **OUTDOOR-ROUTING-GH-B2** (endpoint resolution + POST `/route` + preview transiente) con review downstream pre-deploy.
