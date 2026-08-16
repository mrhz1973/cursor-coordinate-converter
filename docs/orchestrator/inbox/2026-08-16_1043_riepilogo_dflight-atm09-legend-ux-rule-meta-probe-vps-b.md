# Riepilogo — D-FLIGHT-ATM09-LEGEND-UX-RULE-META-PROBE-VPS-B

**Data:** 2026-08-16 10:43 Europe/Rome  
**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-RULE-META-PROBE-VPS-B`  
**Esito:** **CLOSED / PASS** diagnostico — Caso **B-P2**  
**Gate:** `ATM09 STYLE METADATA SOURCE REQUIRED`

## Autosync (container)

- `real_task_commit`: `35596e6bfdb2931c7b1479bec8387cce08ae1fc8`
- Container corrente: `PENDING_SELF_REFERENCE`
- Fatti autosync: `EXTERNAL_ONLY`
- Monolite: **escluso**

## Probe (sanitizzato)

| Voce | Valore |
| --- | --- |
| Connessione | SSH Host `ionos-n8n` |
| Transient systemd + LoadCredential | sì |
| Credential exposure | **NO** |
| JSON_CAPABILITY | **SUPPORTED** |
| HTTP / MIME / bytes | 200 / `application/json` / 2828 |
| Rules | **9** |
| Probe 2 RULE | non conclusivo (script TEMP quoting) |
| TEMP CLEANUP | **PASS** |
| Helper live post | **active** invariato |

## Mapping residuo

- PROVEN join: dual Max 0 (`rosso` / `rosso_righe`); Area pericolosa (`rosse_quadri` + `shape://times`); 25/45/60/120 (arancione/giallo/azzurra/verde).
- Mancanti: `scure`/`costa`; secondo Max 120 (`italia` solo candidato).

## Invarianti

- Runtime build **197** / tip `d2d3ab3…` **invariato**
- Helper **0.1.3** **invariato**
- NO runtime/helper patch · NO deploy · NO finito
