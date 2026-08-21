# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `VPS-HEALTH-CHECK-READONLY` |
| **GATE** | none (infra census) · prodotto **MAP-CENTER-VIEWPORT-AWARE-A** resta **QA FINALE PENDING** |
| **NEXT** | eventuale maintenance window APT+reboot (NON in questo pass) |
| **RUNTIME LIVE** | VPS GIS tip `6d0b78a0a67b9fc804a387d1fc37f30c85b0ca69` · build **244** · **non modificato da questo task** |
| **RUNTIME_CANDIDATE_SHA** | `6d0b78a0a67b9fc804a387d1fc37f30c85b0ca69` (osservato, non deployato qui) |
| **Result Cursor** | **PASS** census read-only |
| **Working tree (pre-report-commit)** | docs dirty → this commit |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `502705163186f991ee2ad6b4fb11f6340025c515` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — inbox `docs/orchestrator/inbox/2026-08-21_2120_VPS-HEALTH-CHECK-READONLY.md` + `docs/orchestrator/latest.md` + questo file. Monolite **escluso**. FRONTIER **non toccato**. Nessuna WU prodotto aperta.
2. Session guard: branch `main`; al boot task HEAD era `6d0b78a` (poi origin avanzato a `5027051` per deploy MAP-CENTER 244 concorrente). Working tree pulito pre-questo commit. SSH `ionos-n8n` OK (root).
3. Evidence LIVE 2026-08-21 18:47–18:52 UTC, host `ubuntu`, Ubuntu 24.04.4, kernel running `6.8.0-124-generic`, uptime 66 giorni, load `0.00 0.00 0.00`.
4. RAM: **1896 / 3846 MiB used** (~49%), available **1950 MiB**. Swap: **657 / 1023 MiB** (~64%) `/swapfile`. Disco root: **16G / 116G (14%)**.
5. Top RSS: GraphHopper java ~586 MiB (systemd MemoryCurrent ~604 MiB, peak ~687 MiB); D-Flight helper ~245 MiB; n8n node ~239 MiB / Docker stats **322.4 MiB (8.38%)**; proxy flask ~117 MiB.
6. Servizi `goi-nav-proxy`, `goi-gis-app`, `goi-graphhopper`, `goi-ors-gateway`, `goi-dflight-helper`, `nginx`, `docker`, `tailscaled`: tutti **active**. n8n `root-n8n-1` Up 2 months, bind solo localhost:5678. Tailscale 1.102.2, serve config assente.
7. 1 unit failed transiente (probe ATM09 2026-08-16, SyntaxError) — non produzione. Leftover python su `:8011` (candidate EMPTY) — non killato.
8. Porte: GIS 8000, proxy 5000, D-Flight 8010, GH 8989, nginx 80/443-tailnet, ORS loopback 8020, GH admin 8990 localhost, n8n 5678 localhost, leftover 8011.
9. Endpoint GET tutti OK: GIS 200; proxy status OK; GH `/info` 11.0; ORS ready `secret=PRESENT` (no valore); D-Flight READY 841 feature. Nessun POST.
10. APT: solo `apt-get update`. 25 upgradable; simulato **21 upgrade / 0 install / 0 remove / 4 phased**. Sensibili nel set: **tailscale 1.102.2→1.102.3**, docker plugins (non engine). Kernel/systemd/nginx/openssl/java **non** nel set corrente. Kernel 138 **già installato**.
11. **Reboot required: SÌ** (`linux-image-6.8.0-138`, libc6; needrestart KSTA=3). docker/containerd già flagged per restart da update precedente.
12. Rischio futuro aggiornamento: **MEDIUM**. `apt upgrade` ragionevole con blip Tailscale; maintenance window sì se reboot; post-check tutti `goi-*` + n8n + tailnet endpoints.
13. NON eseguito: apt upgrade, autoremove, reboot, restart, deploy, git pull VPS, modifiche Tailscale/nginx/systemd, FRONTIER, monolite.
14. Funzioni runtime: nessuna. Chiavi i18n: nessuna.
15. Non toccato: `coordinate_converter Claude.html`, `docs/FRONTIER.md`, `docs/INFRA_VPS.md`, WU, checkpoint/session/roadmap.
16. Lint/selftest/ABQA: N/A (infra census).
17. Limiti: leftover `:8011` e failed transient non ripuliti (read-only). `INFRA_VPS.md` non riallineato.

### STATO FRESCO DA CURSOR

(compilato post-`git fetch` dopo push — vedi messaggio operatore / sezione C post-push)

```text
STATO FRESCO DA CURSOR
origin/main HEAD: PENDING_SELF_REFERENCE (pre-container 5027051)
working tree: dirty docs → this commit
ultimo blocco PASS: VPS-HEALTH-CHECK-READONLY (infra)
prossimo candidato: maintenance APT+reboot (non aperto); prodotto MAP-CENTER QA FINALE PENDING
note operative: reboot already required; swap 64%; no secrets in report
```

## C. OUTPUT GIT

Verificabile **prima** del commit container:

```text
5027051 docs: roll OM 7.2 for MAP-CENTER LIVE 244
3fb9ac2 docs: MAP-CENTER polygon panel LIVE 244 deploy+ABQA; QA FINALE PENDING
6d0b78a feat(map): polygon panel GIS height, verts priority, Ctrl+Z remove-last
a2b14b0 docs: finito VERTEX-COORD FIX4 after QA PASS operatore
7eabb17 docs: VERTEX-COORD FIX4 REVIEW PASS + deploy ABQA; QA FINALE PENDING
HEAD: 502705163186f991ee2ad6b4fb11f6340025c515
origin/main: 502705163186f991ee2ad6b4fb11f6340025c515
branch: main
```

`git ls-remote` e `git show --stat HEAD` post-push: messaggio operatore.
