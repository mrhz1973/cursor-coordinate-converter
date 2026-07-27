# Riepilogo finito — OUTDOOR-ROUTING-GH-B2 (+ FIX1 + FIX2)

**Data:** 2026-07-27  
**Trigger:** `QA OUTDOOR-ROUTING-GH-B2 PASS operatore` (Regola H — auto-finito)

## Esito

**OUTDOOR-ROUTING-GH-B2 + FIX1 + FIX2 — CLOSED / PASS end-to-end**

## Runtime (già versionato; non in questo commit docs)

| Campo | Valore |
| --- | --- |
| Tip runtime | `89bbf285cd8f27fd0e2f30f4c1f9de550451c85b` |
| Catena | `bff1a91` → `42b01b3` (B2) → `feb1eb3` (FIX1) → `89bbf28` (FIX2) |
| Blob monolite | `83da60d9def49bf7374a51031ec85e1761071f86` |
| Byte LF | `2916874` |
| SHA-256 LF | `041469aefb946a1a3f3c4b0a4a6a19b2be62cc576c8070b844569c5f8657c399` |
| Build | `APP_BUILD_NUM=62` / `APP_BUILD_ID=B6.0B2-FIX2` |
| DETAIL | OUTDOOR-ROUTING-GH-B2-FIX2 — close downstream review findings |
| Endpoint | `http://100.114.7.53:8989` (nessun 8990 dall’app) |

## Review / deploy / QA

- **Review GPT-sostitutiva pre-deploy:** PASS / GO DEPLOY (range `bff1a91..89bbf28`)
- **GLM downstream:** non disponibile; review post-hoc resta backstop non bloccante
- **Deploy GIS-only:** PASS (VPS HEAD `89bbf28`; HTTP 200; Git↔HTTP byte/SHA match; `goi-gis-app` restart only; GraphHopper non riavviato)
- **Smoke GH read-only:** POST `/route` hiking HTTP 200 + CORS
- **QA operatore:** PASS — attestazione esatta «**QA OUTDOOR-ROUTING-GH-B2 PASS operatore**» (provenienza: operatore; 2026-07-27; URL `?v=89bbf28`)

## Commit task docs (questo ciclo finito)

- **SHA task:** `6d9c4f41005c7f35bc86532ee72b4838affc5014`
- **Subject:** `docs: close OUTDOOR-ROUTING-GH-B2 after QA PASS`
- **File:** `docs/OPERATING_MEMORY.md` §7; `docs/work-units/WU-0005-0009-roadmap.md`; `docs/work-units/WU-0010-outdoor-routing-graphhopper.md`; `docs/HANDOFF.md`
- **Monolite:** **non** incluso (già su `89bbf28`)
- **Push task:** riuscito (pre-autosync)
- **`git status --short` post-task / pre-autosync:** pulito salvo file autosync in creazione

## Working tree pre-autosync

Dopo push task `6d9c4f4`, monolite blob invariato `83da60d9…`.

## Prossimo passo

Da scegliere: WU-0010 bundle successivi / geocoding multi-riga backlog / MAJOR-3-b2 parcheggiato / TRACK-POINT-CENTER-BUTTON-A.

## Limiti

- Fatti del commit autosync corrente (SHA/push/HEAD finale): **EXTERNAL_ONLY**
- Nessun terzo commit finalize-hash
