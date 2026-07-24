# Riepilogo — WU-0010 Outdoor Routing GraphHopper plan (docs-only) + RECOVERY

**Data:** 2026-07-24 ~10:45 (Europe/Rome)
**Tipo:** pubblicazione piano docs-only + recovery post-interruzione GLM
**Monolite:** **escluso** — blob invariato `ba2cf240f20595ef066dd59e7a3b685850f049c5`
**Runtime live:** `18120102f319721aa237badb1db3c28327739e88` (`1812010`) — **B5.5Z · build 51** — **invariato**
**Deploy:** **non eseguito**

## Recovery

- Stato trovato: **CASO B** — commit task locale `8a61b91` già creato, **non pushato**; working tree pulito; `commit-msg.txt` assente.
- Scope commit task verificato: solo 4 documenti (WU-0010 nuova + roadmap + OM + HANDOFF); nessun monolite; nessun file temporaneo.
- Audit contenuti: WU/OM/roadmap/HANDOFF coerenti; **nessuna correzione chirurgica** necessaria.
- Azione recovery: **push del task esistente** + autosync orchestratore (nessun secondo commit task).

## Cosa è stato fatto

- Pubblicato piano WU-0010 **OPEN / PLAN APPROVED / RUNTIME NOT STARTED**
- Review GLM **PASS CON CORREZIONI** — 3 correzioni bloccanti registrate
- Split **B1 + B2** ratificato
- Politica loopback (Bundle C) registrata
- **MAJOR-3-b2** resta **parcheggiato** (non annullato)
- Prossimo bundle: **B1** (Planner UI no-route, build futuro 52)

## File nel commit task (`8a61b91`)

- `docs/work-units/WU-0010-outdoor-routing-graphhopper.md` (nuovo)
- `docs/work-units/WU-0005-0009-roadmap.md`
- `docs/OPERATING_MEMORY.md`
- `docs/HANDOFF.md`

## Tre correzioni GLM (vincolo runtime futuro)

1. Estendere `workbenchMapInteractionBlocked()` (+ `_routing.pickMode` / `_routing.markerDrag`), senza guardia parallela
2. Integrare pick in `attachPanHandlers.onUp` (no nuovo listener click)
3. Chiamare `geocodingAllowed()` esplicitamente prima di `geocodeSearch()` (B2), fallback `offlineForwardSearch`

## QA

- Docs-only: nessuna QA browser/runtime
- Gate scope: monolite assente dal commit; blob invariato
- PASS operatore: **non applicabile** (nessun runtime)

## Git (fatti stabili pre-autosync)

- Commit task: `8a61b9117b28c420b139950eec5403e1a542c42b`
- Subject: `docs: publish WU-0010 — Outdoor Routing GraphHopper plan`
- Push task: riuscito (`3b6447f..8a61b91`)
- Working tree pre-autosync: pulito
- Blob monolite: `ba2cf240f20595ef066dd59e7a3b685850f049c5`

## Prossimo passo

- Prompt Cursor dedicato per **B1** (Planner UI no-route) + review downstream pre-deploy
- Non avviare B1 senza autorizzazione operatore

## Limiti

- Runtime routing **non** implementato
- Endpoint GraphHopper / infrastruttura **non** installati in questo intervento
- Autosync corrente: SHA/push/HEAD finale = **EXTERNAL_ONLY** (verifica esterna post-push)
