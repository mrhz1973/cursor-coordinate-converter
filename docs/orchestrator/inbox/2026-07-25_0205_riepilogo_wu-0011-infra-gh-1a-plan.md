# Riepilogo — WU-0011 / INFRA-GH-1A piano registrato

**Data:** 2026-07-25  
**Tipo:** docs-only (registrazione piano infrastrutturale)  
**real_task_commit:** `e5933015efe822260aef313bbf98309ce3c7905a`  
**Subject:** `docs(infra): register GraphHopper local PoC work unit`

## Cosa è stato fatto

Registrato nel repository il piano autorizzato **INFRA-GH-1A — GraphHopper 11.0 PoC locale Ryzen** (Nord-Ovest · elevation ON · loopback), stato **READY / GO EXECUTION**.

**Non** eseguito: installazioni, download, import OSM, avvio GraphHopper, creazione file PoC fuori repo, VPS, deploy, QA operatore, monolite.

## File modificati (commit task)

- `docs/work-units/WU-0011-infra-gh-1a-graphhopper-local-poc.md` (**nuovo**) — piano consolidato revisione 2
- `docs/OPERATING_MEMORY.md` §7 / §8 — WU-0011 READY; B2 BLOCKED; prossimo = esecuzione PoC
- `docs/HANDOFF.md` — snapshot fresco; link WU-0011; nessun endpoint GH attivo
- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md` — B2 operativo = endpoint; B2 BLOCKED; «B2 geocoding» superseded
- `docs/INFRA_VPS.md` — censimento GraphHopper datato (RAM ~2532 MB liberi, 8989 libera, nginx:80, non idoneo import)

## Monolite

- `coordinate_converter Claude.html`: **non modificato**
- blob invariato: `15c57074cc3c1ea5e2b75d4c6b724b7eee5a41b2`
- Runtime live: `3a702e1` · B5.5Z build 56

## Stati

| Voce | Valore |
|------|--------|
| WU-0011 | READY / GO EXECUTION |
| OUTDOOR-ROUTING-GH-B2 | BLOCKED (no endpoint) |
| INFRA-GH-1B | non aperta |
| Online/gateway | rinviato |
| Deploy | nessuno |
| QA operatore | non applicabile (docs-only) |

## Working tree pre-autosync

Dopo push task `e593301`, working tree pulito salvo artefatti autosync in creazione.

## Prossimo passo

Esecuzione operativa del PoC INFRA-GH-1A (script/config fuori repo) secondo WU-0011. **Non** implementare B2 monolite finché 1A non passa i gate.

## Limiti

- PoC **non** eseguito in questo blocco
- Endpoint GraphHopper **non** attivo
- Fatti del commit autosync corrente: **EXTERNAL_ONLY** (omessi)
