# OPSEC Step 4 — QA finale e chiusura ciclo (completato)

**Data:** 2026-06-13  
**Base codice:** `83d65ef` + fix QA Step 4

## QA controllato

- Gate strict graduato (Steps 1–3): `forceOffline`, cache hit, internet block, Navionics consenso `_`, seamarks, Esri/Open-Meteo.
- Dialog interni `#opsecStrictConfirmDialog` — nessun `window.confirm` sui flussi OPSEC Step 3.
- `activateWarn` solo al toggle strict ON.
- i18n `opsec.strict.*` IT/EN/FR complete.
- Tracking `_netEvents` + tooltip Step 2 non regressi.
- `/sonar/` non integrato.

## Fix codice Step 4 (minimi)

- `set.opsec.strict` IT/EN/FR — label impostazioni allineata a strict graduato.
- Toggle strict — rimosso badge `seamarksBlocked` duplicato (evita sovrascrittura di `activateWarn`).

## Documentazione aggiornata

- `docs/checkpoint.md` — ciclo OPSEC Step 1–4 chiuso, semantica strict graduata.
- `docs/session-geolocalizzazione-e-mappa.md` — append Step 4 QA.
- `README.md` — sezione *Security / OPSEC notes* riscritta.

## Validazione

- `node --check` 2× script inline → **NODE_CHECK=OK**.

## Backlog (non Step 4)

- Infra: porte raw 5000/8000, open proxy, B2 tailscale serve, reboot-test.
- Feature: integrazione SonarChart `/sonar/` monolite (tailnet-proxy + consenso Navionics).

## Vincoli rispettati

- Nessun `finito`; nessun Planet-Clone/proxy.py/control-plane/n8n/systemd/ACL.
- Nessuna nuova feature OPSEC oltre rifinitura QA.

## Deploy post-push

Dopo push su `main`, deploy VPS = pull manuale:

```bash
ssh ionos-n8n 'git -C /root/local-files/handoff-runtime/cursor-coordinate-converter pull --ff-only && git -C /root/local-files/handoff-runtime/cursor-coordinate-converter log --oneline -3'
```
