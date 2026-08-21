# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `VPS-MAINTENANCE-UPGRADE-REBOOT-A` (infra, non prodotto) |
| **GATE** | **BLOCKED** — nginx failed post-reboot |
| **NEXT** | repair nginx **fuori questo pass** (FAIL CLOSED); prodotto GIS 247 CLOSED invariato |
| **RUNTIME LIVE** | GIS **non modificato** · tip `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` · build **247** |
| **RUNTIME_CANDIDATE_SHA** | `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` (osservato, no deploy) |
| **Result Cursor** | **BLOCKED** |
| **Working tree (pre-report-commit)** | docs dirty → this commit |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `6be5a973d2c9e2f2524596557a4dfc45e3f00585` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — evidence `docs/infra/evidence/2026-08-21_VPS-MAINTENANCE-UPGRADE-REBOOT-A.md` + inbox 2325 + latest + questo file. Monolite **escluso**. FRONTIER **non toccato**.
2. Preflight: 8/8 active; GIS HEAD `ac4789e`; kernel 124; swap 657 MiB.
3. `apt-get update` + `apt-get upgrade -y`: 21 upgraded OK (tailscale 1.102.3). 4 phased non forzati. Nessun full-upgrade/autoremove.
4. reboot 21:17:31 UTC; SSH back 21:19:16 (~105 s); kernel **6.8.0-138-generic**.
5. Post-boot GOI 5/5 active, n8n UP, tailscale online. **nginx failed** — `bind() to 100.114.7.53:443 failed (99: Cannot assign requested address)`. Nessun restart.
6. Endpoint: GIS 200, proxy OK, GH 11.0, ORS loopback ready, D-Flight READY. ORS HTTPS **FAIL**. `:8011` assente (cleanup). ATM09 failed unit assente (cleanup).
7. RAM soak: used 1219 / available **2627** MiB; swap **0**. Miglioramento vs baseline 1896 used / 657 swap.
8. FAIL CLOSED: no repair nginx, no systemd/nginx edits.
9. Funzioni/i18n: nessuna. Non toccato: monolite, FRONTIER, INFRA_VPS.md, WU prodotto.

### STATO FRESCO DA CURSOR

```text
STATO FRESCO DA CURSOR
origin/main HEAD: PENDING_SELF_REFERENCE (pre-container 6be5a97)
working tree: dirty docs → this commit
ultimo blocco: VPS-MAINTENANCE-UPGRADE-REBOOT-A BLOCKED
prossimo candidato: nginx After=tailscaled / start post-TS (fuori scope); prodotto 247 CLOSED
note operative: ORS HTTPS down; GOI HTTP/GH/D-Flight up; no secrets
```

## C. OUTPUT GIT

```text
6be5a97 docs: finito GIS-OBJECTS FIX1 after QA PASS operatore
3bea0a4 docs: OM+roadmap GIS-OBJECTS FIX1 LIVE 247
6849da3 docs: GIS-OBJECTS FIX1 LIVE 247 toolbar geometry; QA FINALE PENDING
ac4789e fix(ui): restore map toolbar geometry after Oggetti GIS relegate
c0ebf58 docs: roadmap+OM policy for GIS-OBJECTS FROZEN relegate
HEAD: 6be5a973d2c9e2f2524596557a4dfc45e3f00585
origin/main: 6be5a973d2c9e2f2524596557a4dfc45e3f00585
branch: main
```
