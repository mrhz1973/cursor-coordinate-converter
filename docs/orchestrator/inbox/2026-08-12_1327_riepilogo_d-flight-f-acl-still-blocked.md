# D-FLIGHT-F — ACL :8010 UNBLOCK verify + Browser QA re-run

**Data:** 2026-08-12  
**Esito Fase A:** **ACL STILL BLOCKED**  
**Browser QA:** non eseguita (STOP obbligatorio)

## Pre-flight repo

| Campo | Valore |
|-------|--------|
| root | `C:/Users/Utente/Documents/AI/GitHub/cursor-coordinate-converter` |
| branch | `main` |
| workspace | pulito |
| HEAD | `76109a72597ce3b56ac7bec5ac21d72544d94a08` |
| origin/main | `76109a72597ce3b56ac7bec5ac21d72544d94a08` |
| ls-remote | `76109a72597ce3b56ac7bec5ac21d72544d94a08` |
| Runtime monolite approvato | `ddce4345…` (≠ HEAD docs — atteso) |

## Fase A — client reachability

Tailscale: connesso (`desktop-dpijl64` / peer `ubuntu` ping OK 68ms).

| Test | Esito |
|------|-------|
| `Test-NetConnection :8000` | **True** |
| `Test-NetConnection :8010` | **False** (retry dopo `tailscale ping` ancora False) |
| curl GET `:8010/status` Origin GIS | timeout (exit 28) |
| curl GIS `:8000/` | **200** |

**STOP:** nessun cambio firewall host / systemd / bind / CORS.

## Fase B — safety smoke on-box (read-only)

Helper: active/enabled; `/status` READY; `helper_version=0.1.2`;  
`canonical_sha256=88d564a65152a795fb2ea2cff8d11dc7b5fd013992cfdc7160b722a37f0d67f7`;  
`feature_count=849`; `fetched_at=last_change_at=2026-08-11T21:40:52Z` — **invariati** vs report 1318.

GIS: HTTP 200; build FIX1/162; live SHA256 LF = `2877ebd6…` MATCH; clone HEAD `ddce4345…`. **Nessun drift. Nessun redeploy.**

## Fasi C–E

Non eseguite.

## Gate

```text
AUTOMATED BROWSER QA D-FLIGHT-F FAIL
```

Root cause: **ACL STILL BLOCKED** — client non apre TCP `:8010` nonostante grant dichiarato dall’operatore. Runtime/helper non coinvolti.

## Conferme

- NO QA operatore inferita  
- NO finito  
- NO modifica runtime/helper/config in questo intervento  

## NEXT

1. Controllare in admin Tailscale che la riga ACL salvata includa esplicitamente `tcp:8010` (stesso `src`/`dst` di `tcp:8000`/`tcp:5000`).  
2. Attendere propagazione / ri-login client se necessario.  
3. Rieseguire solo verify `:8010` + Automated Browser QA.
