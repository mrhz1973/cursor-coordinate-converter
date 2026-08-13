# D-FLIGHT-H-AUTOLOAD-UX-A — candidate pre-deploy

Data: 2026-08-13 ~03:06 +02  
Tipo: bundle DELICATO runtime (monolite only)

## Commit task

- **FULL SHA:** `ad4882b5b378a8f014178dbad7ff3f5941e5873b`
- **Subject:** `feat(dflight): add panel autoload and operational loading UX`
- **Build:** `D-FLIGHT-H-AUTOLOAD-UX-A` · **171**
- **Push:** OK (`34b808f..ad4882b`)

## Scope implementato

- Autoload `/dataset` all’apertura pannello (zero fetch al boot)
- Timer auto-refresh 30 min solo con pannello aperto; clear on close; single-flight con refresh manuale
- Progress bar + fasi (loading/parsing/ready/atm09/checking/pending/blocked/error)
- CTA: rimosso «Carica zone»; «Riprova» solo su errore iniziale; tooltips
- Legenda nativa «Legenda restrizioni»; ATM09 ufficiale in `<details>` lazy-load
- Selftest H + regressione: **156/156 PASS**
- Helper `infra/dflight-helper/**`: **byte-invariato**

## Gate

`D-FLIGHT-H-AUTOLOAD-UX-A IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED`

## Non fatto

- Deploy GIS / helper
- QA operatore
- `finito`

## Limiti

- SHA/push autosync corrente = EXTERNAL_ONLY
