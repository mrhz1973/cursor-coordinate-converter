# D-FLIGHT-F — Automated Browser QA PASS (post ACL unblock)

**Data:** 2026-08-12  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ddce4345&qa=rerun2`  
**Runtime:** `ddce4345…` · `D-FLIGHT-F-FIX1` · build **162**  
**Helper:** `0.1.2` @ `100.114.7.53:8010`

## Gate

```text
AUTOMATED BROWSER QA D-FLIGHT-F PASS
```

## Pre-flight / reachability

| Check | Esito |
|-------|-------|
| Repo main, tree pulito | PASS — HEAD docs `d9fa25b` (≠ runtime, atteso) |
| `Test-NetConnection :8010` | **True** (Tailscale, src `100.103.225.57`) |
| GET `/status` | 200 · READY · 0.1.2 · count pre-refresh **849** |
| GIS HTTP | 200 · build 162 |

Nessun redeploy / no CORS / no firewall change.

## Casi browser

1. **Boot** — build FIX1/162; zero `:8010` pre-CTA; zero `d-flight.it`; console hook vuota.
2. **Carica zone** — 1× GET `/dataset` 200; headers JS:
   - `X-GOI-DFlight-Sha256=88d564a65152a795fb2ea2cff8d11dc7b5fd013992cfdc7160b722a37f0d67f7`
   - `X-GOI-DFlight-Fetched-At=2026-08-11T21:40:52Z`
   - `X-GOI-DFlight-Feature-Count=849`
   Panel: 849 zone · SHA 88d564a6… · visibile; overlay/legenda OK.
3. **OPSEC strict** — toggle senza nuove chiamate helper; CTA rete disabled; dataset resta; Rivaluta locale (referenceTime cambia); restore OK.
4. **Force offline** — zero `:8010`; dataset resta; CTA disabled; restore OK.
5. **Rivaluta** — zero rete; referenceTime aggiornato; overlay coerente.
6. **Regressioni** — zoom UI z11→z10; basemap control; waypoint control; layer toggle; panel open/close; no console error D-Flight.

## Refresh controllato

- Pre: `cooldown_remaining_sec=0` → **UNA** POST `/refresh` 200.
- Ramo: **READY_CHANGED** — pending `b3cd4311…`; dataset corrente 849/88d564a6 preservato; no auto-apply; CTA Applica visibile.
- **UNA** Applica → GET `/dataset` 200; headers SHA `b3cd4311…` count **840** match pending; apply OK; pending chiuso.
- Post helper `/status`: SHA `b3cd4311…`, count **840**, `fetched_at=2026-08-12T11:39:00Z`, cooldown 279.

## Network sintetico (D-Flight)

| Quando | Richieste |
|--------|-----------|
| Pre-CTA | nessuna `:8010` |
| Carica | GET `/dataset` 200 |
| Rivaluta | nessuna |
| Refresh | POST `/refresh` 200 |
| Apply | GET `/dataset` 200 |
| `d-flight.it` | **zero** |

Nota: alcuni tile CARTO falliti durante zoom (ambiente); non correlati a D-Flight; basemap poi 200 a z10.

## Conferme

- NO QA operatore inferita  
- NO `finito`  
- Monolite non modificato in questo intervento  
