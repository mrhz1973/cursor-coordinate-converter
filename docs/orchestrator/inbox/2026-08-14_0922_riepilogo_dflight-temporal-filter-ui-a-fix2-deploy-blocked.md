# D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 — deploy BLOCKED

**Data:** 2026-08-14 09:22 (locale)  
**Review:** GPT-sostitutiva PASS — deploy autorizzato su `7f35382` / build 182  
**Esito:** **DEPLOY BLOCKED** — SSH VPS irraggiungibile; runtime live incoerente.  
**Automated Browser QA:** **NON ESEGUITA** (runtime VPS ≠ 182).  
**NON** finito · **NON** PASS operatore · WU-0014 **OPEN**

## Pre-flight locale

- HEAD / origin/main / ls-remote: `f6b57f7c0c3c0dabe6712d3e55df8e6c8edee02d`
- Runtime autorizzato: `7f35382c7e04876428b3c5d4bd45fafff308486d`
- Monolite locale: `APP_BUILD_NUM=182` · `APP_BUILD_ID=D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2`
- Workspace: pulito · branch `main`

## Finding SSH

- Alias `ionos-n8n` → `217.160.71.145:22` → **Connection timed out**
- Tailscale ping `ubuntu` (`100.114.7.53`): **OK** (~51 ms, direct `217.160.71.145:41641`)
- TCP `100.114.7.53:22`: **FAIL**
- `tailscale ssh root@ubuntu`: **FAIL** (`dial tcp 100.114.7.53:22` timeout / 502)

GIS HTTP `:8000` raggiungibile; SSH no. Nessun pull/restart possibile da questa sessione.

## Smoke HTTP (live, NON aggiornato)

- `http://100.114.7.53:8000/coordinate_converter%20Claude.html` → HTTP **200**
- Content-Length / bytes: **10072225**
- Live build: `APP_BUILD_ID=D-FLIGHT-TEMPORAL-FILTER-UI-A` · `APP_BUILD_NUM=180` (parent UI-A, **non** FIX2)
- Locale atteso ~10098870 byte (build 182)
- Helper `:8010/status`: **0.1.3 READY** (non toccato)

## Gate

`D-FLIGHT-TEMPORAL-FILTER-UI-A-FIX2 DEPLOY BLOCKED — AUTOMATED BROWSER QA NOT STARTED`

NEXT: ripristinare SSH (`ionos-n8n` / porta 22 su Tailscale) e rilanciare lo stesso prompt deploy GIS-only.
